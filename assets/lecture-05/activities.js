"use strict";

(() => {
const choice = (id, label, options, value = options[0][0]) => ({ id, label, options, value });
const integer = (id, label, value, min, max) => ({ id, label, type: "number", value, min, max });
const range = (id, label, value, min, max) => ({ id, label, type: "range", value, min, max });
const text = (id, label, value) => ({ id, label, type: "text", value });
const model = (concept, page, title, intro, fields, run, controls = {}) =>
  ({ concept, page, title, intro, fields, run, ...controls });
const sequence = (concept, page, title, intro, steps, options) => ({
  concept, page, title, intro, ...options,
  steps: steps.map(([label, hint, detail], index) => ({ label, hint, detail, ...options.steps[index] }))
});
const compare = (concept, page, title, intro, label, scenarios) => model(concept, page, title, intro,
  [choice("scenario", label, scenarios.map(([name], index) => [String(index), name]))], ({ scenario }) => {
    const [, headline, explanation, flow] = scenarios[Number(scenario)];
    return { headline, explanation, flow };
  }, { scenario: true });

const message = (from, to, label, delay = 0) => ({ from, to, label, delay });
const pairGraph = (left, right) => ({
  nodes: [["left", left, 22, 50], ["right", right, 78, 50]], links: [["left", "right"]]
});
const pairStep = (action, label, reverse = false) => ({
  action, messages: [reverse ? message("right", "left", label) : message("left", "right", label)],
  appearance: { active: ["left-right"], focus: [reverse ? "left" : "right"] }
});

const switchGraph = {
  nodes: [["switch", "Switch", 50, 30], ...[1, 2, 3, 4].map((port, index) => [String(port), `埠 ${port}`, 14 + index * 24, 78])],
  links: [1, 2, 3, 4].map(port => ["switch", String(port)])
};
const ringGraph = {
  nodes: [["A", "A 站", 25, 23], ["B", "B 站", 75, 23], ["C", "C 站", 75, 77], ["D", "D 站", 25, 77]],
  links: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]]
};
const routeGraph = {
  nodes: [
    ["start", "來源", 13, 50], ["r1", "R1", 34, 50], ["r2", "R2", 59, 25], ["r3", "R3", 59, 75], ["end", "目的地", 85, 50]
  ],
  links: [["start", "r1"], ["r1", "r2"], ["r1", "r3"], ["r2", "end"], ["r3", "end"]]
};

const dnsGraph = {
  nodes: [
    ["browser", "瀏覽器", 16, 50], ["resolver", "解析器", 45, 50],
    ["root", "根伺服器", 82, 20], ["tld", ".com", 82, 50], ["auth", "權威伺服器", 82, 80]
  ],
  links: [["browser", "resolver"], ["resolver", "root"], ["resolver", "tld"], ["resolver", "auth"]]
};
const dnsStep = (action, server, answer) => ({
  action, messages: [message("resolver", server, "查詢"), message(server, "resolver", answer, 440)],
  appearance: { active: [`resolver-${server}`], focus: ["resolver", server] }
});
const transportGraph = pairGraph("送出端", "接收端");

const address = (value, helpers) => helpers.ipv4Number(value.trim());
const prefixOptions = Array.from({ length: 33 }, (_, prefix) => [String(prefix), `/${prefix}`]);

function subnetUsability(prefix, subnet, helpers) {
  if (prefix === 0) return {
    broadcast: "預設路由沒有單一子網廣播位址",
    hosts: "涵蓋所有 IPv4 位址，含特殊用途位址"
  };
  if (prefix >= 31) return {
    broadcast: "此例沒有一般子網廣播位址",
    hosts: prefix === 31 ? "點對點鏈路的兩端" : "一個主機位址"
  };
  const first = helpers.ipv4Number(subnet.network);
  const count = subnet.size - 2;
  return {
    broadcast: subnet.last,
    hosts: `${count.toLocaleString("zh-TW")} 個 · ${helpers.ipv4String(first + 1)} 到 ${helpers.ipv4String(first + count)}`
  };
}

function switchExperiment(concept, title, intro, initialDestination, knownAddresses) {
  const macs = [["A", "MAC A"], ["B", "MAC B"], ["C", "MAC C"], ["D", "MAC D"]];
  const initialState = () => new Map(knownAddresses);
  const table = state => [...state].sort(([first], [second]) => first.localeCompare(second));
  const diagramLabels = (source, destination, ingress, target) => {
    const labels = { [ingress]: `埠 ${ingress} · ${source}` };
    if (target && target !== Number(ingress)) labels[target] = `埠 ${target} · ${destination}`;
    return labels;
  };
  return model(concept, 38, title, intro,
    [choice("source", "來源 MAC", macs), choice("destination", "目的 MAC", macs.slice(1).concat([macs[0]]), initialDestination),
      choice("ingress", "進入的埠", [1, 2, 3, 4].map(port => [String(port), `埠 ${port}`]))],
    ({ source, destination, ingress }, _, state) => {
      if (source === destination) return {
        headline: "請選兩個不同的 MAC", explanation: "用不同的來源與目的來比較轉送行為。", macTable: table(state)
      };
      const input = Number(ingress);
      const previous = state.get(source);
      state.set(source, input);
      const target = state.get(destination);
      const ports = [1, 2, 3, 4].map(number => {
        const entry = number === input;
        const sent = !entry && (!target || number === target);
        return { number, state: entry ? "in" : sent ? "out" : "idle", label: entry ? "接收" : sent ? "轉送" : "未送出" };
      });
      const learnedMac = previous !== input ? source : undefined;
      const learned = previous === input ? `MAC ${source} 已對應埠 ${input}`
        : previous ? `MAC ${source} 從埠 ${previous} 更新到埠 ${input}` : `MAC ${source} → 埠 ${input}`;
      const headline = !target ? "目的未知，向其他埠泛洪"
        : target === input ? "目的就在進入的埠，過濾此 frame" : `已知單播，只從埠 ${target} 送出`;
      const outputs = ports.filter(port => port.state === "out").map(port => String(port.number));
      const learnedTable = table(state);
      return { headline, ports, macTable: learnedTable, learnedMac, inFlight: `埠 ${input} 收到 ${source} → ${destination} 的訊框`,
        map: {
          active: [String(input), ...outputs].map(port => `switch-${port}`), focus: ["switch", ...outputs],
          labels: diagramLabels(source, destination, ingress, target),
          incoming: { active: [`switch-${input}`], focus: [ingress, "switch"] },
          messages: [message(ingress, "switch", `${source} → ${destination}`),
            ...outputs.map(port => message("switch", port, "Frame", 640))]
        },
        during: {
          headline: `先學來源：${learned}`, macTable: learnedTable, learnedMac,
          explanation: `接著查目的 MAC ${destination}。`
        },
        flow: [`從埠 ${input} 收到 ${source} → ${destination}`, `學來源：${learned}`, `再查目的 MAC ${destination}`],
        explanation: "所有埠都在同一 VLAN。送下一個 frame 時會沿用目前的 MAC 表。" };
    }, {
      action: "送出訊框", resetLabel: "重設", initialState, graph: switchGraph, workbench: true,
      initialResult: state => ({
        headline: `範例：A 從埠 1 傳給 ${initialDestination}`,
        explanation: concept === "switch-source" ? "表裡先有 B。送出後，找找看 A 被記在哪個埠。" :
          "表裡先有 B。送完這次，再把目的 MAC 改成 B，比較亮起的埠。",
        macTable: table(state),
        map: { focus: ["1"], labels: diagramLabels("A", initialDestination, "1", state.get(initialDestination)) }
      })
    });
}

const cableIcon = '<span class="network-cable-icon" aria-hidden="true"></span>';

const cableScene = {
  render: () => `
    <div class="network-scene">
      <div class="network-board cable-board" role="group" aria-label="交換器和網路線">
        <span class="network-wire wire-a" aria-hidden="true"></span>
        <span class="network-wire wire-x" aria-hidden="true"></span>
        <span class="network-wire wire-branch-trunk" aria-hidden="true"></span>
        <span class="network-wire wire-branch-fan" aria-hidden="true"></span>
        <button type="button" class="network-node cable-root" data-network-switch aria-pressed="true">
          <span class="network-lamp" aria-hidden="true"></span><strong>主 Switch</strong><span data-switch-state>通電</span>
        </button>
        <button type="button" class="network-cable cable-a" data-network-cable="a" aria-label="A 的網路線" aria-pressed="true">
          ${cableIcon}<span data-cable-state>A 的線</span>
        </button>
        <button type="button" class="network-cable cable-x" data-network-cable="x" aria-label="分支的上行線" aria-pressed="true">
          ${cableIcon}<span data-cable-state>上行線</span>
        </button>
        <div class="network-node cable-branch"><strong>分支 Switch</strong></div>
        ${["A", "B", "C"].map(letter => `<div class="network-node cable-host host-${letter.toLowerCase()}"><strong>${letter}</strong><span data-host="${letter}">連線</span></div>`).join("")}
      </div>
      <p class="network-note" role="status"></p>
      <button class="btn secondary network-reset" type="button" data-network-reset>還原連線</button>
    </div>`,
  bind(element) {
    const board = element.querySelector(".cable-board");
    const note = element.querySelector(".network-note");
    const power = element.querySelector("[data-network-switch]");
    const cables = [...element.querySelectorAll("[data-network-cable]")];
    const state = { power: true, a: true, x: true };

    function update() {
      const { power: powered, a, x } = state;
      const aOnline = powered && a;
      const branchOnline = powered && x;
      board.dataset.power = powered ? "on" : "off";
      power.setAttribute("aria-pressed", String(powered));
      power.querySelector("[data-switch-state]").textContent = powered ? "通電" : "停電";
      for (const button of cables) {
        const name = button.dataset.networkCable;
        const connected = state[name];
        board.dataset[name] = connected ? "on" : "off";
        button.setAttribute("aria-pressed", String(connected));
        button.querySelector("[data-cable-state]").textContent = name === "a"
          ? (connected ? "A 的線" : "A 已拔線")
          : (connected ? "上行線" : "上行已拔");
      }
      element.querySelector('[data-host="A"]').textContent = aOnline ? "連線" : "離線";
      for (const host of element.querySelectorAll('[data-host="B"], [data-host="C"]')) {
        host.textContent = branchOnline ? "連線" : "可互通";
      }
      if (!powered) {
        note.textContent = "主 Switch 停電，直接接在它上面的 A 離線。B 和 C 還能靠分支 Switch 互通。";
      } else if (!a && !x) {
        note.textContent = "A 已離線。分支也無法連到主 Switch，但 B 和 C 仍可互通。";
      } else if (!a) {
        note.textContent = "只有 A 離線。B 和 C 的連線仍正常。";
      } else if (!x) {
        note.textContent = "分支無法連到主 Switch。B 和 C 仍可互通，但不能連到 A。";
      } else {
        note.textContent = "A、B、C 同在一個網路，可以互通。";
      }
    }

    for (const button of [power, ...cables]) {
      const key = button.dataset.networkCable ?? "power";
      button.addEventListener("click", () => {
        state[key] = !state[key];
        update();
      });
    }
    element.querySelector("[data-network-reset]").addEventListener("click", () => {
      Object.assign(state, { power: true, a: true, x: true });
      update();
    });
    update();
  }
};

const wirelessScene = {
  render: () => `
    <div class="network-scene">
      <div class="network-board wireless-board" aria-hidden="true">
        <span class="network-wire wireless-a"></span>
        <span class="network-wire wireless-c"></span>
        <span class="network-packet" data-packet="0" hidden></span>
        <span class="network-packet" data-packet="1" hidden></span>
        <div class="network-node wireless-node wireless-node-a"><strong>A</strong></div>
        <div class="network-node wireless-node wireless-node-ap"><strong>AP</strong><span class="wireless-alert" data-wireless-alert hidden>碰撞</span></div>
        <div class="network-node wireless-node wireless-node-c"><strong>C</strong><span class="wireless-alert" data-wireless-wait hidden>等候</span></div>
        <span class="wireless-distance">A 和 C 彼此聽不到</span>
      </div>
      <p class="network-note" role="status"></p>
      <div class="activity-actions wireless-actions">
        <button class="btn" type="button" data-wireless-send="together">同時傳送</button>
        <button class="btn secondary" type="button" data-wireless-send="separate">依序傳送</button>
        <label class="network-option"><input type="checkbox" data-wireless-rts>讓 A 先請求 RTS/CTS</label>
      </div>
    </div>`,
  bind(element) {
    const board = element.querySelector(".wireless-board");
    const note = element.querySelector(".network-note");
    const packets = [...board.querySelectorAll("[data-packet]")];
    const alert = board.querySelector("[data-wireless-alert]");
    const wait = board.querySelector("[data-wireless-wait]");
    const rts = element.querySelector("[data-wireless-rts]");
    const motion = [];
    const position = { a: 12, ap: 50, c: 88 };
    let timer;

    const stop = () => {
      clearTimeout(timer);
      for (const animation of motion.splice(0)) animation.cancel();
      for (const packet of packets) packet.hidden = true;
    };

    function show(phase, text) {
      board.dataset.phase = phase;
      note.textContent = text;
      alert.hidden = phase !== "collision";
      wait.hidden = phase !== "wait";
    }

    function travel({ packet, from, to, label }) {
      const marker = packets[packet];
      marker.textContent = label;
      marker.hidden = false;
      const animation = marker.animate([
        { left: `${position[from]}%`, opacity: 1 },
        { left: `${position[to]}%`, opacity: 1 }
      ], { duration: 520, easing: "ease-in-out", fill: "forwards" });
      motion.push(animation);
    }

    function run(together) {
      const reserve = rts.checked;
      const sendA = { packet: 0, from: "a", to: "ap", label: "DATA" };
      const sendC = { packet: 1, from: "c", to: "ap", label: "DATA" };
      const steps = [];
      if (reserve) {
        steps.push(
          ["active", "A 先送 RTS，向 AP 請求傳送。", [{ ...sendA, label: "RTS" }]],
          ["active", "AP 回送 CTS。C 也聽得到 AP 的這則訊息。", [
            { packet: 0, from: "ap", to: "a", label: "CTS" },
            { packet: 1, from: "ap", to: "c", label: "CTS" }
          ]]
        );
      }
      if (together && !reserve) {
        steps.push(
          ["active", "A 和 C 都以為媒介空閒，同時送出資料。", [sendA, sendC]],
          ["collision", "兩路訊號在 AP 處重疊，造成碰撞。", []]
        );
      } else {
        steps.push(
          [reserve ? "wait" : "active", reserve ? "C 聽到 CTS，等 A 傳完。" : "A 先向 AP 傳資料。", [sendA]],
          ["active", "A 傳完後，C 再傳送自己的資料。", [sendC]],
          ["received", reserve ? "C 聽見 CTS 後等待，兩段資料分開抵達 AP。" : "兩段資料依序抵達 AP，沒有重疊。", []]
        );
      }
      const next = index => {
        stop();
        if (!element.isConnected || !element.open) return;
        const [phase, label, packetsInFlight] = steps[index];
        show(phase, label);
        if (!packetsInFlight.length) return;
        for (const packet of packetsInFlight) travel(packet);
        timer = setTimeout(() => next(index + 1), 570);
      };
      next(StudyPreferences.motionReduced() || typeof packets[0].animate !== "function" ? steps.length - 1 : 0);
    }

    function ready() {
      stop();
      show("idle", "A 和 C 都能和 AP 通訊，但聽不到對方。");
    }

    for (const button of element.querySelectorAll("[data-wireless-send]")) {
      button.addEventListener("click", () => run(button.dataset.wirelessSend === "together"));
    }
    rts.addEventListener("change", () => {
      stop();
      show("idle", rts.checked ? "AP 若成功回送 CTS，C 聽到後就會等待。" : "再試一次同時傳送，看看訊號在哪裡重疊。");
    });
    element.addEventListener("toggle", () => { if (!element.open) ready(); });
    ready();
  }
};

const backoffScene = {
  render: () => `<div class="network-scene">
    <div class="network-board backoff-board" aria-hidden="true">
      <div class="backoff-slots"><span></span><span></span><span></span><span></span><span></span></div>
      <div class="backoff-count"><strong data-backoff-count>3</strong><span>剩餘時槽</span></div>
    </div>
    <p class="network-note" role="status"></p>
    <div class="activity-actions">
      <button class="btn" type="button" data-backoff-step>前進一格</button>
      <label class="network-option"><input type="checkbox" data-backoff-busy>媒介忙碌</label>
      <button class="btn secondary" type="button" data-backoff-reset>重新開始</button>
    </div>
  </div>`,
  bind(element) {
    const slots = [...element.querySelectorAll(".backoff-slots span")];
    const count = element.querySelector("[data-backoff-count]");
    const progress = element.querySelector("[data-backoff-step]");
    const busy = element.querySelector("[data-backoff-busy]");
    const reset = element.querySelector("[data-backoff-reset]");
    const note = element.querySelector(".network-note");
    let remaining = 3;
    let mustWait = false;
    let history = [];

    function show(text) {
      for (const [index, slot] of slots.entries()) {
        const state = history[index];
        slot.dataset.state = state?.[0] ?? "";
        slot.textContent = state?.[1] ?? "·";
        slot.classList.toggle("backoff-current", Boolean(state) && index === history.length - 1);
      }
      count.textContent = remaining;
      progress.disabled = remaining === 0;
      note.textContent = text;
    }

    progress.addEventListener("click", () => {
      let step;
      if (busy.checked) {
        mustWait = true;
        step = ["busy", "忙碌", `別的裝置正在送，倒數停在 ${remaining}。`];
      } else if (mustWait) {
        mustWait = false;
        step = ["wait", "等待", "媒介轉為空閒。先等待，下一格才恢復倒數。"];
      } else {
        remaining--;
        step = ["idle", String(remaining), remaining ? `媒介空閒，倒數剩 ${remaining} 格。` : "倒數到 0，可以嘗試傳送。"];
      }
      history = [...history, step].slice(-slots.length);
      show(step[2]);
      if (progress.disabled) reset.focus({ preventScroll: true });
    });
    reset.addEventListener("click", () => {
      remaining = 3;
      mustWait = false;
      history = [];
      busy.checked = false;
      show("從 3 格開始。先前進一格，再勾選「媒介忙碌」觀察倒數。");
      progress.focus({ preventScroll: true });
    });
    show("從 3 格開始。先前進一格，再勾選「媒介忙碌」觀察倒數。");
  }
};

const activities = [
  compare("network-scope", 4, "依範圍辨認網路", "切換使用情境，看分類依據怎麼變。", "使用情境", [
    ["同一人的手機和藍牙耳機", "PAN · 個人區域網路", "範圍以個人裝置為中心，通常很短。"],
    ["一間教室內的電腦", "LAN · 區域網路", "主機位於同一個小區域。即使用 Wi-Fi，範圍仍可屬於 LAN。"],
    ["校內多棟系館互連", "CAN · 校園區域網路", "一個校園裡的多個 LAN 可以互連成 CAN。"],
    ["城市各區的行政機關", "MAN · 都會區域網路", "連線跨越同一個都會區。"],
    ["台北與高雄分公司", "WAN · 廣域網路", "連線跨越較大地理範圍。"]
  ]),
  compare("storage-network", 10, "選擇資料庫的儲存方式", "換一種存取需求，觀察伺服器會看到什麼。", "資料需求", [
    ["資料庫要管理遠端磁碟區塊", "選 SAN 的區塊儲存", "伺服器把遠端磁碟看成區塊裝置，可以自行建立檔案系統。", ["資料庫主機", "儲存網路", "磁碟區塊"]],
    ["同事透過網路共用資料夾", "選 NAS 的檔案共享", "用戶端存取遠端檔案和目錄，由檔案伺服器管理底層磁碟。", ["用戶端", "檔案服務", "檔案與目錄"]]
  ]),
  model("vpn", 11, "切換隧道的保護", "在簡化模型裡分別開關加密與完整性驗證。", [
    choice("encrypt", "加密", [["on", "開啟"], ["off", "關閉"]]),
    choice("integrity", "完整性驗證", [["on", "開啟"], ["off", "關閉"]])
  ], ({ encrypt, integrity }) => ({
    headline: encrypt === "on" && integrity === "on" ? "同時保護機密性與完整性" : "檢查這條隧道提供的保護",
    facts: [["旁觀者讀取內容", encrypt === "on" ? "難以直接讀取" : "可讀取明文"],
      ["收件端偵測竄改", integrity === "on" ? "驗證失敗時拒收" : "沒有這項驗證"]],
    explanation: "這裡把兩種保護拆開觀察。實務上常使用同時提供加密與驗證的機制。"
  })),
  compare("service-roles", 12, "切換 Client/Server 與 P2P", "觀察相同檔案在兩種架構裡從哪裡取得。", "檔案分享方式", [
    ["集中式下載", "Client 向 Server 要檔案", "伺服器負責提供檔案，用戶端發出請求。", ["Client 發出請求", "Server 回傳檔案"]],
    ["P2P 分享", "同一節點可下載也可上傳", "節點可以一邊從別人取得片段，一邊提供自己已有的片段。", ["Peer A 取得片段 2", "Peer A 分享已有的片段 1"]]
  ]),
  compare("physical-logical", 14, "從接線與傳送方式看拓撲", "換一個場景，對照設備怎麼接和訊號怎麼走。", "接線方式", [
    ["四台電腦分別接到中央 hub", "實體是 Star，邏輯上共享媒介", "Hub 會把收到的訊號重送到其他埠。", ["各電腦各有一條線", "中央 hub 重送", "其他埠都能收到訊號"]],
    ["四台電腦分別接到中央 switch", "實體是 Star，已知單播只到目的埠", "Switch 查 MAC 表，目的已知時不需把 frame 泛洪到其他埠。"],
    ["每台設備接到兩個相鄰節點", "實體接線形成 Ring", "如果同時採用權杖機制，邏輯上只有拿到權杖的站可傳送。"]
  ]),
  model("bus", 15, "測試 Bus 主幹與終端器", "切換故障條件，觀察共享主幹上的訊號。", [
    choice("condition", "主幹狀態", [["normal", "主幹完好、兩端有終端器"], ["open", "一端未裝終端器"], ["broken", "主幹中間斷開"]])
  ], ({ condition }) => ({
    normal: { headline: "訊號沿共享主幹傳播", flow: ["A 送出", "其他節點收到訊號", "終端器吸收端點訊號"], explanation: "同一條媒介上的設備共用傳輸資源。" },
    open: { headline: "開路端可能造成訊號反射", flow: ["A 送出", "訊號抵達未端接的端點", "反射回主幹"], explanation: "適當的終端器用來減少端點反射。" },
    broken: { headline: "斷點兩側的通訊中斷", flow: ["左側送出", "訊號無法越過斷點"], explanation: "斷點還可能造成新的反射，影響整段的傳輸品質。" }
  })[condition]),
  model("ring", 18, "傳遞 Ring 的權杖", "按一次就把權杖沿環交給下一站。", [
    choice("waiting", "正在等著傳送的站", [["A", "A 站"], ["B", "B 站"], ["C", "C 站"], ["D", "D 站"]], "C")
  ], ({ waiting }, _, state) => {
    const stations = ["A", "B", "C", "D"];
    const previous = stations[state.position];
    state.position = (state.position + 1) % stations.length;
    const holder = stations[state.position];
    return { headline: `${holder} 站拿到權杖`,
      map: { active: [`${previous}-${holder}`], focus: [holder], messages: [message(previous, holder, "權杖")] },
      explanation: holder === waiting ? `${holder} 現在可以傳送資料。` : `${waiting} 仍需等權杖傳過來。` };
  }, { graph: ringGraph, action: "傳給下一站", resetLabel: "重設權杖", initialState: () => ({ position: 0 }),
    initialResult: () => ({ headline: "權杖在 A 站", explanation: "先傳兩次，看看預設等候中的 C 站何時能傳送。", map: { focus: ["A"] } }) }),
  {
    concept: "star-tree", page: 19, title: "拔掉一條線，看誰會離線",
    intro: "點一下網路線或主 Switch，再看看哪些裝置仍能互通。",
    scene: cableScene
  },
  model("mesh", 24, "試算 Full Mesh 的鏈路成本", "改節點數量，看冗餘路徑和接線數如何增加。", [
    integer("nodes", "節點數", 4, 2, 30)
  ], ({ nodes }) => {
    const n = Number(nodes);
    return { headline: `${n} 個節點需要 ${n * (n - 1) / 2} 條鏈路`, facts: [["每個節點的連線", n - 1], ["斷一條直連後可經其他節點繞路", n > 2 ? "拓撲上有替代路徑" : "沒有替代路徑"]],
      explanation: "每個節點連到其餘節點。每條線被兩端各算一次，因此總數除以二。" };
  }),
  compare("wireless-range", 25, "依距離選擇無線連線", "改變設備的位置，看適合的接入技術。", "場景", [
    ["耳機連旁邊的手機", "Bluetooth · 近距離裝置互連", "Bluetooth 常用於周邊設備和個人區域網路。"],
    ["筆電在教室內接入校園網", "Wi-Fi · 接入區域網路", "筆電和鄰近的 AP 交換資料，再由 AP 接到後端網路。"],
    ["搭車時保持行動上網", "行動網路 · 透過基地臺接入", "手機可以在基地臺覆蓋區內連線，移動時由網路處理交遞。"]
  ]),
  compare("wireless-standards", 27, "檢查 Wi-Fi 能否連線", "選用戶端和基地臺的設定，觀察能否建立連線。", "兩端的設定", [
    ["雙方都支援 2.4 GHz，密碼相符", "有共同的頻段和安全設定", "不同廠牌可依共同支援的 Wi-Fi 規格互通。"],
    ["AP 只開 5 GHz，用戶端只支援 2.4 GHz", "頻段沒有交集", "即使兩邊都標示支援 Wi-Fi，也需要共同支援的頻段。"],
    ["頻段相同，密碼錯誤", "可能找到網路，驗證會失敗", "掃描到基地臺和成功加入網路是兩個步驟。"]
  ]),
  compare("csma-cd", 29, "模擬共享 Ethernet 的碰撞", "改變兩站送出訊號的時機。這是舊式半雙工共享媒介的示意。", "兩站何時送出", [
    ["A 先送，B 聽到媒介忙碌", "B 等待媒介空閒", "B 在送出前先偵測載波。", ["A 發送", "B 感測為忙碌", "B 延後傳送"]],
    ["A、B 都聽到空閒，幾乎同時送", "兩個訊號可能碰撞", "碰撞發生時，送端停止本次傳送，分別隨機退避後重試。", ["A、B 偵測空閒", "同時送出", "碰撞後退避"]]
  ]),
  {
    concept: "wifi-backoff", page: 29, title: "觀察 Wi-Fi 的退避計數",
    intro: "每次前進一格。示範用一格表示恢復倒數前需要的空閒等待，時間不按實際比例。",
    scene: backoffScene
  },
  {
    concept: "hidden-terminal", page: 30, title: "讓兩個隱藏終端同時送",
    intro: "試試同時送與依序送，再觀察 A 成功取得 CTS 後，C 會怎麼做。",
    scene: wirelessScene
  },
  model("poe", 31, "用同一條網路線供電", "切換供電方式和 AP 需求。假設網路線與兩端均相容。", [
    choice("power", "供電端", [["off", "一般交換器，無 PoE"], ["on", "PoE 可用功率 15 W"]]),
    choice("demand", "AP 的需求", [["8", "8 W"], ["18", "18 W"]])
  ], ({ power, demand }) => ({
    headline: power === "on" && Number(demand) <= 15 ? "AP 可以從網路線取得所需電力" : "這個供電端無法滿足 AP 的需求",
    facts: [["PoE 可用", power === "on" ? "15 W" : "0 W"], ["AP 需要", `${demand} W`]],
    explanation: "資料連線和供電是兩個條件。缺少電力時，AP 需要其他供電來源或符合需求的 PoE。"
  })),
  compare("interface-address", 32, "同一台筆電換網卡時", "切換出站介面，觀察 frame 的來源 MAC。", "連線介面", [
    ["有線網卡", "frame 使用有線介面的 MAC", "同一台筆電可以有多張網卡，各介面有自己的鏈路層位址。", ["筆電", "Ethernet 介面", "MAC E"]],
    ["Wi-Fi 網卡", "frame 使用無線介面的 MAC", "IP 設定也可能隨接入的網路與介面改變。", ["筆電", "Wi-Fi 介面", "MAC W"]]
  ]),
  compare("signal-repeat", 35, "將同一個訊號送入不同設備", "選設備，看看它會把什麼送到哪裡。", "設備", [
    ["兩埠 repeater", "重生訊號並送往另一端", "它在實體層處理訊號，無須查看 MAC。", ["收到位元訊號", "重整訊號", "另一端送出"]],
    ["多埠 hub", "重送到其他所有埠", "Hub 是多埠的 repeater，其他埠共用媒介。"],
    ["Switch，已知道目的 MAC 在埠 3", "只把 frame 送到埠 3", "Switch 依鏈路層的 MAC 表選擇出埠。"]
  ]),
  switchExperiment("switch-source", "交換器如何學來源 MAC", "先按「送出訊框」。觀察 Switch 在表裡記住哪台裝置是從哪個埠進來的。", "B", [["B", 3]]),
  switchExperiment("switch-destination", "交換器往哪個埠轉送", "先按「送出訊框」，看目的 C 還不在表上時會發生什麼。再改目的為 B 比較。", "C", [["B", 3]]),
  compare("reframing", 40, "看路由器重包哪一層", "選下一跳是鄰近路由器或同網段的收件主機。假設沒有 NAT。", "下一跳", [
    ["還要交給另一台路由器", "用下一台路由器的 MAC 重做 frame", "最終目的 IP 保留，TTL 會遞減。新 frame 的來源 MAC 屬於本路由器的出站介面。", ["移除舊的鏈路層標頭", "依目的 IP 查路由", "用下一跳 MAC 重新封裝"]],
    ["最後一段已接到收件主機所在網段", "用收件主機的 MAC 重做 frame", "目的 IP 仍指向收件主機。目的 MAC 只用在這一跳的鏈路上。", ["路由器出站介面", "目的主機 MAC", "交付收件主機"]]
  ]),
  model("router-ip", 40, "用目的 IP 查最長前綴", "輸入 IPv4 位址，比對路由表的 /24、/16、/8 和預設路由。", [
    text("destination", "目的 IPv4", "10.0.1.25")
  ], ({ destination }, helpers) => {
    if (address(destination, helpers) === null) return { headline: "請輸入有效的 IPv4 位址" };
    const table = [["10.0.1.0", 24, "埠 3"], ["10.0.0.0", 16, "埠 2"], ["10.0.0.0", 8, "埠 1"], ["0.0.0.0", 0, "預設閘道"]];
    const matching = table.filter(([network, prefix]) => helpers.subnetResult(destination, prefix).network === network);
    const [network, prefix, port] = matching[0];
    return { headline: `選 ${network}/${prefix}，走${port}`,
      facts: table.map(([net, length, output]) => [`${net}/${length} · ${output}`,
        matching.some(([candidate, bits]) => candidate === net && bits === length) ? "符合" : "不符合"]),
      explanation: "從符合的路由中選前綴最長的一條。預設路由 /0 可以匹配任何位址。" };
  }, { action: "查路由" }),
  model("default-gateway", 42, "判斷是否要交給預設閘道", "主機在 192.168.1.10/24，切換目的地與閘道設定。", [
    choice("destination", "目的 IP", [["same", "192.168.1.90"], ["other", "192.168.2.90"]]),
    choice("gateway", "預設閘道", [["on", "192.168.1.1"], ["off", "未設定"]])
  ], ({ destination, gateway }) => destination === "same"
    ? { headline: "同一子網，可以直接送給目的主機", explanation: "主機先取得同網段收件者的 MAC。預設閘道不影響這段傳送。" }
    : gateway === "on"
      ? { headline: "跨子網，先交給 192.168.1.1", explanation: "frame 的目的 MAC 是閘道，封包的目的 IP 仍是最終收件主機。" }
      : { headline: "沒有到目的子網的路由", explanation: "在沒有其他相符路由時，主機需要預設閘道。" }),
  model("firewall", 43, "試送封包穿越防火牆", "規則按順序比對。先擋外部連入的 SSH，其他封包最後放行。", [
    choice("from", "來源", [["external", "外部網路"], ["internal", "內部網路"]]),
    choice("service", "目的 TCP 埠", [["22", "22 · SSH"], ["443", "443 · HTTPS"]])
  ], ({ from, service }) => {
    const blocked = from === "external" && service === "22";
    return { headline: blocked ? "封包遭拒絕" : "封包獲准通過",
      flow: [blocked ? "符合規則 1：外部 → TCP 22" : "規則 1 不符合", blocked ? "拒絕" : "規則 2 放行"],
      explanation: "這個例子只考慮來源和目的服務的第一條相符規則。" };
  }),
  compare("fiber", 44, "機房環境影響傳輸媒介", "換傳輸媒介，觀察靠近大型馬達時可能發生什麼。", "傳輸媒介", [
    ["銅纜", "訊號可能受到電磁干擾", "銅導體傳送電訊號，線對絞合與屏蔽可降低一些干擾。"],
    ["光纖", "光訊號不受同類電磁干擾", "光在纖芯傳播。光纖仍要注意接頭、距離和彎折造成的損耗。"]
  ]),
  model("attenuation", 45, "看距離與衰減如何累加", "以固定每公尺損耗的簡化模型，計算接收端的訊號強度。", [
    integer("distance", "距離（m）", 50, 0, 300),
    choice("rate", "每公尺損耗", [["0.1", "0.1 dB/m"], ["0.2", "0.2 dB/m"], ["0.3", "0.3 dB/m"]])
  ], ({ distance, rate }) => {
    const loss = Number(distance) * Number(rate);
    return { headline: `總衰減 ${loss.toFixed(1)} dB`,
      facts: [["接收功率相對於送出功率", `${(100 * 10 ** (-loss / 10)).toPrecision(3)}%`]],
      explanation: "同一段媒介以每公尺損耗乘距離得到總 dB；功率比例依對數換算。實際數值依介質與頻率而異。" };
  }),
  compare("copper", 47, "拆開看銅纜的構造", "切換同軸、有遮蔽與無遮蔽雙絞線。", "線材", [
    ["Coaxial", "中央導體外有絕緣層與同軸遮蔽", "外層遮蔽環繞中央導體。"],
    ["UTP", "多對銅線絞合，沒有額外遮蔽", "絞合有助於降低電磁干擾與串音。"],
    ["有遮蔽雙絞線", "在絞合之外另加遮蔽", "遮蔽效果和接地、施工品質有關。線材能跑的速率還要看網路規格、距離及兩端設備。"]
  ]),
  model("copper-connectors", 49, "比對網路線兩端接法", "選線兩端使用的接線標準，觀察哪幾個接腳對調。", [
    choice("first", "第一端", [["A", "T568A"], ["B", "T568B"]]),
    choice("second", "第二端", [["A", "T568A"], ["B", "T568B"]], "B")
  ], ({ first, second }) => {
    const green = ["白綠", "綠", "白橙", "藍", "白藍", "橙", "白棕", "棕"];
    const orange = ["白橙", "橙", "白綠", "藍", "白藍", "綠", "白棕", "棕"];
    const left = first === "A" ? green : orange;
    const right = second === "A" ? green : orange;
    return { headline: first === second ? "兩端接腳相同 · 直通線" : "橙綠線對交叉 · 交叉線",
      facts: left.map((color, index) => [`接腳 ${index + 1}`, `${color} → 另一端接腳 ${right.indexOf(color) + 1}`]),
      explanation: "看同一顏色在線的另一端接到哪一個位置。現代設備常能自動調整收發線對。" };
  }),
  compare("distributed-computing", 52, "把工作分給多個節點", "選要完成的工作，觀察節點如何合作。", "工作", [
    ["在一組高速互連的伺服器上運算", "Cluster 讓多台機器協同工作", "節點通常由同一系統管理，可以分工並交換中間結果。", ["切分工作", "多節點運算", "合併結果"]],
    ["跨機構使用各地閒置的算力", "Grid 協調分散的運算資源", "各處節點可能隸屬不同組織，排程需要協調資源。"],
    ["網站前端請後端程序查資料", "不同程序透過 IPC 或網路交換訊息", "請求和回應可在同一台機器的程序之間，也可跨主機。"]
  ]),
  compare("cloud-properties", 54, "讓網站因流量增加而擴充", "選一個事件，看它對應哪項雲端特性。", "事件", [
    ["使用者自行開啟一台虛擬機", "On-demand self-service", "使用者可自行取得所需資源。"],
    ["活動爆量時多開機器，結束後縮回", "Rapid elasticity", "容量可以隨需求擴大，也可以縮小。", ["平常 2 台", "高峰 8 台", "活動結束回 2 台"]],
    ["系統記錄每月用量供帳單查閱", "Measured service", "提供者量測並回報使用量。"],
    ["多個客戶共用提供者的資源池", "Resource pooling", "提供者可在客戶需求之間分配共用資源。"]
  ]),
  compare("cloud-models", 57, "選雲端服務，看誰維護哪一層", "切換服務類型，比較使用者和提供者的工作。", "服務模式", [
    ["租一台虛擬機 · IaaS", "你維護 OS 和應用", "提供者管理硬體、網路和虛擬化。"],
    ["部署程式到執行平台 · PaaS", "你維護應用和資料", "提供者管理作業系統與執行環境。"],
    ["使用線上信箱 · SaaS", "你使用並設定應用程式", "提供者管理應用程式及其下方的執行環境。"]
  ]),
  model("internet-routing", 59, "切換路徑可用狀態", "先送一次，再切斷主線。路由更新後重送，比較封包走的路。", [
    choice("route", "線路狀態", [["main", "兩條線都正常"], ["backup", "R1 到 R2 斷線"], ["none", "主線與備援都斷"]])
  ], ({ route }) => {
    const next = route === "main" ? "r2" : "r3";
    const blocked = route === "none";
    const broken = route === "main" ? [] : blocked ? ["r1-r2", "r1-r3"] : ["r1-r2"];
    return {
      headline: blocked ? "封包在 R1 停下" : `封包經 ${next.toUpperCase()} 抵達目的地`,
      explanation: blocked ? "兩條路都斷了，R1 找不到可以到達目的地的下一跳。"
        : route === "backup" ? "主線中斷。在這個示範中，路由更新完成後，R1 會改用 R3。"
          : "兩條線都可用。這個示範原本選擇 R2。",
      map: {
        broken, active: blocked ? ["start-r1"] : ["start-r1", `r1-${next}`, `${next}-end`],
        focus: [blocked ? "r1" : "end"], messages: [
          message("start", "r1", "IP"),
          ...(!blocked ? [message("r1", next, "IP", 420), message(next, "end", "IP", 840)] : [])
        ]
      }
    };
  }, {
    graph: routeGraph, action: "送出封包", initialResult: () => ({ headline: "目前主線和備援都可用" }),
    preview: ({ route }) => ({
      headline: route === "main" ? "兩條線都可用，準備送出" : route === "backup" ? "主線已斷，準備測試備援" : "主線和備援都已斷",
      map: { broken: route === "main" ? [] : route === "backup" ? ["r1-r2"] : ["r1-r2", "r1-r3"] }
    })
  }),
  compare("isp", 60, "選 ISP 之間的互連方式", "切換交換流量的範圍，觀察兩種服務的差異。", "流量要送去哪裡", [
    ["只送到對方與對方客戶的網路", "可使用 Peering", "雙方交換彼此網路及客戶的流量。", ["A ISP 的客戶", "A ↔ B 互連", "B ISP 的客戶"]],
    ["透過對方到更多外部網路", "需要 Transit 提供可達性", "上游向客戶提供到其他網路的路由和轉送服務。", ["客戶 ISP", "上游 Transit", "外部網路"]]
  ]),
  model("ip-format", 64, "看同一位址的十進位與二進位", "改變 IPv4 位址，查看四個 octet 的位元。", [
    text("ip", "IPv4 位址", "192.168.1.10")
  ], ({ ip }, helpers) => {
    const parsed = address(ip, helpers);
    if (parsed === null) return { headline: "請輸入有效的 IPv4 位址" };
    const normalized = helpers.ipv4String(parsed);
    return { headline: `${normalized} 由 32 位元組成`, bits: { address: normalized },
      facts: [["IPv4", "32 位元"], ["IPv6", "128 位元，通常以十六進位表示"]],
      explanation: "IPv4 的每個十進位數各代表 8 個位元，範圍 0 到 255。" };
  }, { action: "轉換位址" }),
  model("domain-hierarchy", 78, "拆開網域名稱的層級", "輸入網域名稱，從右到左看 DNS 層級。", [
    text("domain", "網域名稱", "www.example.com")
  ], ({ domain }) => {
    const labels = domain.trim().toLowerCase().replace(/\.$/, "").split(".");
    const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
    if (labels.length < 2 || labels.join(".").length > 253 || labels.some(value => !label.test(value))) {
      return { headline: "請輸入包含兩層以上的英文網域名稱", explanation: "例如 www.example.com。這個練習接受英數字、連字號與點。" };
    }
    return { headline: `頂級網域是 .${labels.at(-1)}`, flow: ["根 .", ...labels.slice().reverse().map((_, index) => labels.slice(-(index + 1)).join("."))],
      explanation: "根是最右邊隱含的點。每向左多讀一段，就再深入一層。" };
  }, { action: "拆解網域" }),
  compare("address-allocation", 63, "追蹤 IP 區塊如何分配", "選一個層級，觀察它把位址資源交給誰。", "分配層級", [
    ["全球協調層", "IANA 把位址區塊分配給 RIR", "RIR 在各區域管理網際網路號碼資源。", ["IANA", "區域網路註冊管理機構"]],
    ["區域註冊管理機構", "RIR 將位址資源分配或指派給成員", "成員可包括 ISP 與其他符合政策的網路機構。", ["RIR", "ISP 或其他網路機構"]],
    ["ISP 客戶端", "用戶向 ISP 取得連線使用的位址", "ISP 可按服務型態提供一個位址或前綴。", ["ISP", "客戶網路"]]
  ]),
  model("cidr-membership", 65, "比較兩台主機是否同子網", "換第二台主機或前綴，對照兩邊算出的網路位址。", [
    text("first", "主機 A", "192.168.1.42"), text("second", "主機 B", "192.168.1.140"),
    choice("prefix", "共同前綴", prefixOptions, "24")
  ], ({ first, second, prefix }, helpers) => {
    const left = helpers.subnetResult(first, Number(prefix));
    const right = helpers.subnetResult(second, Number(prefix));
    if (!left || !right) return { headline: "請檢查兩個 IPv4 位址" };
    return { headline: left.network === right.network ? "同一子網" : "位於不同子網",
      facts: [["A 的網路", `${left.network}/${prefix}`], ["B 的網路", `${right.network}/${prefix}`]],
      explanation: "套用相同遮罩後，比較兩個網路位址是否一致。" };
  }, { action: "比較子網" }),
  model("subnet-boundaries", 66, "試算網路位址與廣播位址", "改位址或前綴，觀察子網範圍如何縮放。", [
    text("ip", "IPv4 位址", "192.168.1.70"), choice("prefix", "前綴", prefixOptions, "26")
  ], ({ ip, prefix }, helpers) => {
    const bits = Number(prefix);
    const subnet = helpers.subnetResult(ip, bits);
    if (!subnet) return { headline: "請輸入有效的 IPv4 位址" };
    const { broadcast, hosts } = subnetUsability(bits, subnet, helpers);
    let explanation = "主機位元全 0 得到網路位址，全 1 得到廣播位址。";
    if (bits === 0) explanation = "/0 可匹配任何 IPv4 位址，在路由表中用作預設路由。";
    else if (bits >= 31) explanation = "/31 用於點對點鏈路，/32 表示單一主機位址。";
    return { headline: `網路範圍為 ${subnet.network}/${prefix}`, facts: [
      ["第一個位址", subnet.network], ["最後一個位址", subnet.last],
      ["廣播位址", broadcast], ["主機位址", hosts]], explanation };
  }, { action: "試算範圍" }),
  model("subnet-count", 67, "數出拓撲裡有幾個子網", "每台路由器接一個 LAN。任兩台路由器之間的每條點對點鏈路也各占一個子網。", [
    choice("routers", "路由器數量", [["3", "3 台"], ["4", "4 台"], ["5", "5 台"]]),
    choice("shape", "路由器之間的接法", [["ring", "首尾相連"], ["line", "排成直線"]])
  ], ({ routers, shape }) => {
    const count = Number(routers);
    const links = shape === "ring" ? count : count - 1;
    return { headline: `共 ${count + links} 個子網`,
      facts: [["每台路由器連接的 LAN", `${count} 個`], ["路由器之間的鏈路", `${links} 條`]],
      explanation: "把各 LAN 與路由器之間的點對點鏈路相加。試把三個路由器由三角形改成直線。" };
  }),
  model("cidr-mask", 68, "調整 CIDR 前綴與遮罩", "輸入位址或拖動前綴，看 32 個位元怎麼分成網路和主機部分。", [
    text("ip", "IPv4 位址", "200.23.17.4"), range("prefix", "IPv4 前綴長度", 23, 0, 32)
  ], ({ ip, prefix }, helpers) => {
    const length = Number(prefix);
    const parsed = address(ip, helpers);
    const subnet = helpers.subnetResult(ip, length);
    if (!subnet) return { headline: "請輸入有效的 IPv4 位址" };
    const { mask, network, size } = subnet;
    const { broadcast, hosts } = subnetUsability(length, subnet, helpers);
    return { headline: `/${length} 的遮罩是 ${mask}`, bits: { address: helpers.ipv4String(parsed), prefix: length },
      facts: [["網路位址", `${network}/${length}`], ["位址總數", size.toLocaleString("zh-TW")],
        ["廣播位址", broadcast], ["主機位址", hosts]],
      explanation: "遮罩的網路部分填 1，主機部分填 0。前綴越長，單一子網涵蓋的位址越少。" };
  }, { action: "更新前綴" }),
  sequence("dhcp-exchange", 70, "幫新裝置取得 IP", "看看一台剛連上網路的電腦，怎麼向 DHCP 伺服器取得 IPv4 設定。", [
    ["Discover", "裝置沒有位址，第一步是先找伺服器。", "用戶端廣播 Discover 尋找伺服器。"],
    ["Offer", "伺服器收到探詢後，先提出可用的租約。", "伺服器提供可租用的位址和相關參數。"],
    ["Request", "用戶端收到提案後，需表明選擇哪一個。", "用戶端提出 Request 選擇這筆提案。"],
    ["ACK", "伺服器收到 Request 後才確認租約。", "伺服器送出 ACK，裝置可以使用確認的設定。"]
  ], {
    goal: "新裝置目前沒有 IPv4 位址",
    graph: pairGraph("新裝置", "DHCP 伺服器"),
    steps: [
      pairStep("尋找 DHCP 伺服器", "Discover"),
      pairStep("回覆租約提案", "Offer", true),
      pairStep("選擇這筆租約", "Request"),
      pairStep("確認租約", "ACK", true)
    ]
  }),
  compare("dhcp-relay", 71, "讓 DHCP 請求跨子網", "假設用戶端所在網段沒有 DHCP 伺服器。切換 relay 設定。", "路由器設定", [
    ["無 DHCP Relay", "本地 Discover 到不了遠端伺服器", "一般路由器不會把本地廣播直接轉到另一個子網。", ["用戶端廣播", "到達本地網段邊界"]],
    ["有 DHCP Relay", "Relay 代為送達遠端 DHCP 伺服器", "伺服器可依 relay 提供的來源網段資訊挑選適合的租約。", ["用戶端廣播", "本地 Relay", "遠端 DHCP Server"]]
  ]),
  compare("dns-records", 74, "選擇要查的 DNS 記錄", "切換想查的資訊，觀察對應的記錄類型。", "查詢目的", [
    ["名稱 → IPv4", "查 A 記錄", "A 記錄包含 IPv4 位址。"],
    ["名稱 → IPv6", "查 AAAA 記錄", "AAAA 記錄包含 IPv6 位址。"],
    ["IP → 名稱", "做反向查詢，查 PTR", "IPv4 使用 in-addr.arpa 的反向名稱，例如 192.0.2.8 對應 8.2.0.192.in-addr.arpa。"],
    ["找收信的郵件伺服器", "查 MX 記錄", "MX 指出該網域接收郵件的伺服器及優先順序。"]
  ]),
  compare("dns-transport", 75, "看 DNS 何時改用 TCP", "切換傳統 DNS 查詢情境。", "情境", [
    ["一般小型查詢，UDP 回覆放得下", "UDP 就能完成這次查詢", "傳統 DNS 常可用 UDP 53 完成小型查詢。"],
    ["UDP 回覆標記已截斷", "可改用 TCP 重試", "截斷旗標告訴解析器回覆不完整。", ["UDP 查詢", "收到截斷回覆", "用 TCP 再查"]],
    ["使用 AXFR 完整區域轉送", "走 TCP", "區域轉送需要完整傳輸區域資料。"]
  ]),
  model("dns-cache", 75, "快轉 DNS 快取的時間", "設定記錄 TTL 和再次查詢時間。", [
    integer("ttl", "TTL（秒）", 60, 0, 86400), integer("elapsed", "經過時間（秒）", 30, 0, 86400)
  ], ({ ttl, elapsed }) => {
    const left = Number(ttl) - Number(elapsed);
    return { headline: left > 0 ? `命中快取，剩 ${left} 秒` : "已到期，需要重新查詢",
      flow: left > 0 ? ["用戶端詢問", "快取回覆"] : ["用戶端詢問", "舊記錄已到期", "解析器向上游查詢"],
      explanation: "這個模型假設同一筆記錄一直留在快取，且解析器依原 TTL 處理。" };
  }, { action: "模擬查詢" }),
  sequence("dns-referral", 81, "沿 DNS 轉介找到網站 IP", "這是快取沒有答案的簡化示範。瀏覽器把查詢交給解析器，由解析器去找答案。", [
    ["瀏覽器把名稱交給解析器", "先由瀏覽器發起查詢。", "解析器收到 www.example.com，希望找到它的 IPv4 位址。"],
    ["根伺服器指出 .com", "解析器先找負責 .com 的伺服器。", "根伺服器只給下一站的線索，答案還沒找到。"],
    [".com 指出權威伺服器", "問過根伺服器後，依照回覆查 .com。", ".com 伺服器指出哪台權威伺服器負責 example.com。"],
    ["權威伺服器回覆 A 記錄", "現在可以問負責 example.com 的伺服器。", "解析器拿到 IPv4 位址。這個示範用 192.0.2.8 作為範例答案。"],
    ["解析器把 IP 回給瀏覽器", "拿到答案後，要交給原本提出查詢的瀏覽器。", "瀏覽器收到範例答案 192.0.2.8，可以接著嘗試連線。"]
  ], {
    goal: "目標：找出 www.example.com 的 IPv4 位址",
    graph: dnsGraph,
    steps: [
      { action: "開始查詢", messages: [message("browser", "resolver", "查詢")], appearance: { active: ["browser-resolver"], focus: ["resolver"] } },
      dnsStep("問根伺服器", "root", ".com 線索"),
      dnsStep("問 .com 伺服器", "tld", "權威線索"),
      dnsStep("問權威伺服器", "auth", "A 記錄"),
      { action: "把 IP 回給瀏覽器", messages: [message("resolver", "browser", "192.0.2.8")], appearance: { active: ["browser-resolver"], focus: ["browser"] } }
    ]
  }),
  model("anycast", 76, "切換 Anycast 節點的路由", "兩個地點宣告同一個服務 IP。這裡用路由成本簡化比較。", [
    choice("north", "北站", [["low", "成本 10"], ["high", "成本 40"], ["off", "不宣告路由"]]),
    choice("south", "南站", [["low", "成本 15"], ["high", "成本 50"], ["off", "不宣告路由"]])
  ], ({ north, south }) => {
    const cost = { low: [10, 15], high: [40, 50], off: [Infinity, Infinity] };
    const [n, s] = [cost[north][0], cost[south][1]];
    return { headline: Math.min(n, s) === Infinity ? "目前兩站都沒有路由" : `封包送往${n < s ? "北站" : "南站"}`,
      facts: [["北站", Number.isFinite(n) ? `成本 ${n}` : "無路由"], ["南站", Number.isFinite(s) ? `成本 ${s}` : "無路由"]],
      explanation: "用戶端用的是同一目的 IP。實際網路還會考慮路由政策，這裡示範可用路徑與成本如何影響選站。" };
  }),
  compare("application-protocols", 83, "依工作選應用層協定", "換一個工作，看應用會用哪種協定。", "工作", [
    ["登入遠端主機執行指令", "SSH", "SSH 提供可加密和驗證的遠端操作連線。"],
    ["瀏覽網頁", "HTTP 或 HTTPS", "瀏覽器與網站交換請求及回應。HTTPS 加上 TLS 保護。"],
    ["查名稱對應的位址", "DNS", "應用通常透過解析器取得名稱所對應的記錄。"]
  ]),
  compare("mail", 84, "追蹤一封電子郵件", "切換送信與讀信，觀察哪個協定參與。", "現在要做什麼", [
    ["寄件程式送出郵件", "使用 SMTP 提交", "寄件端把信交給寄件伺服器。", ["寄件程式", "SMTP", "寄件伺服器"]],
    ["兩個郵件伺服器轉交信件", "伺服器間使用 SMTP", "寄件伺服器找到收件方的郵件伺服器後轉送。", ["寄件伺服器", "SMTP", "收件伺服器"]],
    ["在兩台裝置讀同一個信箱", "可用 IMAP 同步信箱", "郵件和資料夾狀態由伺服器管理，各裝置可以同步。"]
  ]),
  compare("streams", 85, "切換串流分發方式", "比較三個收看者共用同一段上游鏈路時的流量。假設鏈路上每份串流都用 4 Mb/s。", "分發方式", [
    ["每位觀眾各一份 Unicast", "共用上游鏈路送 3 份，共 12 Mb/s", "各個用戶端都有獨立的資料流。"],
    ["網路支援 IP Multicast", "分岔前只送 1 份，共 4 Mb/s", "有多播能力的節點在路徑分岔時複製資料。"],
    ["有靠近觀眾的 CDN 快取", "快取命中時可直接從邊緣取回內容", "CDN 縮短取得內容的距離。不同觀眾仍可能各有一條到邊緣節點的資料流。"]
  ]),
  model("url", 87, "把 URL 拆成各部分", "編輯網址，看看瀏覽器能讀出哪些欄位。", [
    text("url", "完整網址", "https://example.com:8443/course?id=5#dns")
  ], ({ url }) => {
    let parsed;
    try { parsed = new URL(url); } catch { return { headline: "請輸入完整網址", explanation: "例如 https://example.com/course?id=5#dns。" }; }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { headline: "請使用 HTTP 或 HTTPS 網址" };
    return { headline: "網址的結構", facts: [["協定", parsed.protocol.slice(0, -1)], ["主機", parsed.hostname],
      ["連接埠", parsed.port || "協定預設值"], ["路徑", parsed.pathname],
      ["查詢參數", parsed.search.slice(1) || "無"], ["片段", parsed.hash.slice(1) || "無"]],
    explanation: "查詢參數可隨 HTTP 請求送到伺服器。# 後的片段由瀏覽器處理。" };
  }, { action: "拆解網址" }),
  model("html", 89, "改 HTML 元素，看實際呈現", "輸入一行文字，選元素後預覽。也可以試著把同一句話放在其他元素。", [
    choice("tag", "HTML 元素", [["h1", "h1 · 主標題"], ["p", "p · 段落"], ["a", "a · 連結"], ["title", "title · 分頁標題"]]),
    text("content", "要顯示的文字", "網路與網際網路")
  ], ({ tag, content }) => {
    const url = "#chapter-04/overview";
    const explanations = {
      h1: "h1 顯示在頁面內容，表示主標題。",
      p: "p 表示一段文字。",
      a: "href 提供連結的目的地。這個例子連到 Chapter 4 的總覽。",
      title: "title 位於 head。這裡用小標籤示意瀏覽器分頁的標題。"
    };
    const escapedText = content.replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
    return { headline: "HTML 預覽", preview: { tag, text: content, url },
      code: `<${tag}${tag === "a" ? ` href="${url}"` : ""}>${escapedText}</${tag}>`, explanation: explanations[tag] };
  }, { action: "預覽 HTML" }),
  model("xml", 93, "編輯 XML 並檢查標籤", "改一個標籤或調換關閉順序，再檢查這份 XML。", [
    text("document", "XML 片段", "<course><name>CS</name></course>")
  ], ({ document: xml }) => {
    if (/<!\s*(doctype|entity)\b/i.test(xml)) return { headline: "請使用只含元素與屬性的 XML 片段" };
    const parsed = new DOMParser().parseFromString(xml, "application/xml");
    const root = parsed.documentElement;
    if (!root || parsed.getElementsByTagName("parsererror").length) {
      return { headline: "這段 XML 沒有通過解析",
        explanation: "檢查開關標籤、大小寫、屬性引號，並確認只有一個根元素。" };
    }
    return { headline: `解析成功，根元素是 <${root.nodeName}>`,
      facts: [["根元素的直接子元素", [...root.children].map(child => child.nodeName).join("、") || "無"]],
      explanation: "元素必須依巢狀順序關閉。例如先關 </name>，最後再關 </course>。" };
  }, { action: "檢查 XML" }),
  compare("server-side", 97, "切換瀏覽器端與伺服器端", "選一個功能，觀察程式通常在哪端執行。", "功能", [
    ["使用者輸入時即時提示格式", "瀏覽器端可立即提示", "使用者仍可修改或略過瀏覽器端的檢查。"],
    ["查詢只有網站能存取的資料庫", "伺服器端處理查詢", "伺服器使用受保護的憑證查詢資料，再回傳允許顯示的結果。"],
    ["提交表單寫入資料", "伺服器端仍要驗證", "瀏覽器端可協助提示，伺服器端必須自行檢查權限與資料。", ["瀏覽器送表單", "伺服器驗證", "寫入資料庫"]]
  ]),
  sequence("encapsulation", 100, "一層一層包裝資料", "依資料從應用程式走向 Ethernet 網路的順序點選。", [
    ["應用程式產生資料", "先有應用層要傳送的內容。", "應用層準備訊息。"],
    ["加 TCP 標頭，成為 segment", "應用資料先交給傳輸層。", "TCP 加入連接埠及序號等資訊。"],
    ["加 IP 標頭，成為 packet", "下一層需要跨網路的來源與目的位址。", "IP 加入來源與目的 IP 等資訊。"],
    ["加 Ethernet 標頭與尾端，成為 frame", "最後用這一跳的鏈路層資訊來包裝。", "Ethernet frame 提供本鏈路的位址與錯誤偵測資訊。"]
  ], {
    goal: "目標：準備好能送上 Ethernet 的資料",
    finish: "收件端沿相反方向逐層解封裝。",
    steps: [
      { action: "產生應用資料", parts: [{ label: "應用資料", size: 6 }] },
      { action: "加 TCP 標頭", parts: [{ label: "TCP", size: 2, kind: "header" }, { label: "應用資料", size: 6 }] },
      { action: "加 IP 標頭", parts: [{ label: "IP", size: 2, kind: "header" }, { label: "TCP", size: 2, kind: "header" }, { label: "資料", size: 6 }] },
      { action: "包成 Ethernet 訊框", parts: [
        { label: "Ethernet", size: 3, kind: "header" }, { label: "IP", size: 2, kind: "header" },
        { label: "TCP", size: 2, kind: "header" }, { label: "資料", size: 6 }, { label: "FCS", size: 2, kind: "header" }
      ] }
    ]
  }),
  model("transport-ports", 101, "用目的埠把資料送給程式", "三個服務使用同一台主機。選協定和目的埠，看送到哪個監聽程式。", [
    choice("protocol", "傳輸層協定", [["TCP", "TCP"], ["UDP", "UDP"]]),
    choice("port", "目的埠", [["80", "80"], ["443", "443"], ["53", "53"]])
  ], ({ protocol, port }) => {
    const services = { "TCP:80": "網站服務", "TCP:443": "加密網站服務", "UDP:53": "DNS 服務" };
    const service = services[`${protocol}:${port}`];
    return { headline: service ? `交給${service}` : "這個協定與目的埠沒有監聽服務",
      facts: [["目的 IP", "同一台主機"], ["協定與目的埠", `${protocol} ${port}`]],
      explanation: "這是例題的服務配置。TCP 和 UDP 各有自己的埠號空間。" };
  }),
  model("ipv4-header", 102, "改 IPv4 的 IHL 與總長", "IHL 以 32 位元字為單位。輸入 IHL 與總長，看標頭和資料各占幾個 bytes。", [
    integer("ihl", "IHL（32 位元字）", 5, 5, 15), integer("total", "總長（bytes）", 60, 20, 65535)
  ], ({ ihl, total }) => {
    const header = Number(ihl) * 4;
    const payload = Number(total) - header;
    if (payload < 0) return { headline: "總長不能短於標頭", explanation: `這個 IHL 已占 ${header} bytes。` };
    return { headline: `標頭 ${header} bytes，資料 ${payload} bytes`,
      facts: [["基本標頭", "20 bytes"], ["選項與填補占用", `${header - 20} bytes`]],
      explanation: "總長包含 IPv4 標頭與資料。IHL 大於 5 時，標頭還含選項與必要的填補。" };
  }, { action: "試算 IPv4 長度" }),
  model("fragmentation", 104, "改 MTU 看 IPv4 怎麼切片", "假設每片 IPv4 標頭 20 bytes。改變總長、MTU 和 DF。", [
    integer("total", "封包總長（bytes）", 4000, 20, 65535),
    integer("mtu", "MTU（bytes）", 1500, 68, 65535),
    choice("df", "DF", [["0", "0 · 允許分片"], ["1", "1 · 禁止分片"]])
  ], ({ total, mtu, df }, helpers) => {
    const size = Number(total);
    const limit = Number(mtu);
    if (size <= limit) return {
      headline: `${size} bytes 沒有超過 MTU，可直接送出`,
      packetStrip: [{ label: `1 個封包 · ${size} B`, size }]
    };
    if (df === "1") return { headline: "封包太大且禁止分片，路由器丟棄",
      packetStrip: [{ label: `丟棄 · ${size} B 大於 MTU ${limit} B`, size, kind: "summary" }],
      explanation: "在這個基本情境下，路由器可回送 ICMP 訊息告知需要分片。" };
    const items = helpers.fragments(size, limit);
    const numbered = items.map((item, index) => ({ ...item, number: index + 1 }));
    const shown = numbered.length > 30 ? [...numbered.slice(0, 20), ...numbered.slice(-3)] : numbered;
    return { headline: `分成 ${items.length} 片`,
      packetStrip: [
        ...numbered.slice(0, 4).map(item => ({ label: `第 ${item.number} 片 · ${item.length} B`, size: item.length })),
        ...(numbered.length > 4 ? [{ label: `其餘 ${numbered.length - 4} 片`, size: numbered[0].length, kind: "summary" }] : [])
      ],
      fragments: shown, facts: [["原始資料長度", `${size - 20} B`]],
      explanation: `${items.length > shown.length ? "表格列前 20 片與最後 3 片。 " : ""}Offset 以 8 bytes 為一單位。除了最後一片，資料長度要是 8 的倍數。` };
  }, { action: "模擬分片" }),
  model("transport", 111, "試掉一段資料，比較 TCP 與 UDP", "先送一次 TCP，再切換成 UDP。每次都會讓第 2 段在途中遺失。", [
    choice("protocol", "傳輸方式", [["tcp", "TCP"], ["udp", "UDP"]])
  ], ({ protocol }) => {
    const tcp = protocol === "tcp";
    const slot = (label, kind = "data") => ({ label, size: 1, kind });
    return {
      headline: tcp ? "TCP 補回缺口，依序交付" : "UDP 收到第 1、3 個資料報",
      explanation: tcp ? "TCP 偵測到資料遺失後重傳。接收端可以先暫存後到的資料，等缺口補好再交給應用程式。"
        : "UDP 本身不重傳。除非應用程式另外處理，這次第 2 個資料報就收不到。",
      packetStrip: [slot("1"), tcp ? slot("2 · 重傳", "header") : slot("2 · 遺失", "summary"), slot("3")],
      map: {
        active: ["left-right"], focus: ["right"],
        messages: [message("left", "right", "1"), { ...message("left", "right", "2 · 遺失", 390), stop: .58 },
          message("left", "right", "3", 780), ...(tcp ? [message("left", "right", "重傳 2", 1220)] : [])]
      }
    };
  }, {
    graph: transportGraph, action: "送出三段資料",
    initialResult: () => ({ headline: "準備送出 1、2、3，第 2 段會在途中遺失" }),
    preview: ({ protocol }) => ({ headline: protocol === "tcp" ? "準備用 TCP 傳送" : "準備用 UDP 傳送" })
  }),
  sequence("tcp-handshake", 110, "建立 TCP 連線的三步", "先看一次用戶端和伺服器怎麼交換訊息，再試著自己排順序。", [
    ["Client → Server · SYN", "首先要由發起端提出建立連線。", "Client 送出 SYN 和初始序號。"],
    ["Server → Client · SYN + ACK", "Server 需要確認 Client 的 SYN，同時送出自己的 SYN。", "Server 確認 Client 的序號，並送出自己的初始序號。"],
    ["Client → Server · ACK", "最後還要讓 Server 確認對方收到它的 SYN。", "Client 回傳 ACK，完成一般的三向交握。"]
  ], {
    goal: "目標：讓兩端確認彼此的初始序號",
    graph: pairGraph("用戶端", "伺服器"),
    steps: [pairStep("送出 SYN", "SYN"), pairStep("回覆 SYN + ACK", "SYN + ACK", true), pairStep("回傳 ACK", "ACK")]
  }),
  compare("attacks", 115, "從跡象辨認網路攻擊", "逐一打開異常情境，對照攻擊如何運作。", "觀察到的跡象", [
    ["收到假冒教務處的登入連結", "Phishing · 網路釣魚", "攻擊者假冒可信任來源，誘導你交出密碼或其他資訊。"],
    ["一群設備同時向服務送出大量流量", "DDoS · 分散式阻斷服務", "分散來源消耗目標的頻寬或運算資源。"],
    ["瀏覽器與伺服器之間有第三方攔截並轉送", "MITM · 中間人攻擊", "中間人可嘗試讀取或更動資料。正確驗證連線對象可降低風險。"]
  ]),
  model("trust-signing", 116, "試驗數位簽章的驗證結果", "A 先簽署訊息。切換訊息是否遭改動，以及驗證時使用的公鑰。", [
    choice("message", "收到的訊息", [["original", "原訊息"], ["modified", "遭改動"]]),
    choice("key", "驗證公鑰", [["A", "已確認屬於 A 的公鑰"], ["B", "B 的公鑰"]])
  ], ({ message, key }) => ({
    headline: message === "original" && key === "A" ? "簽章驗證通過" : "簽章驗證失敗",
    explanation: "用 A 的私鑰簽署後，要用對應的公鑰驗證。簽章可檢查完整性及簽署者，訊息若要保密還需要加密。"
  })),
  model("encryption", 117, "選誰的公鑰才能讓收件者解密", "A 想傳密文給 B。選擇加密用的公鑰，再試哪把私鑰能解開。", [
    choice("publicKey", "加密用公鑰", [["B", "B 的公鑰"], ["A", "A 的公鑰"]]),
    choice("privateKey", "試用的私鑰", [["B", "B 的私鑰"], ["A", "A 的私鑰"]])
  ], ({ publicKey, privateKey }) => ({
    headline: publicKey === privateKey ? `${privateKey} 的私鑰可以解密` : "這把私鑰無法解密",
    explanation: "用 B 的公鑰加密，才能讓掌握對應私鑰的 B 解開。這裡假設已確認公鑰的持有者。"
  })),
  compare("lecture-laws", 118, "對照講義的法規例子", "切換情境，找出這頁講義提到的法規縮寫。", "講義中的情境", [
    ["未經授權存取他人電腦", "CFAA", "投影片以未經授權的電腦存取為例。"],
    ["電子通訊及其隱私保護", "ECPA", "投影片以電子通訊保護為例。"],
    ["惡意搶註與商標有關的網域", "ACPA", "投影片以網域搶註為例。"],
    ["電信業者協助合法監聽的技術能力", "CALEA", "投影片以電信設備如何提供法定協助為例。"]
  ]),
  model("privacy", 119, "試著減少表單蒐集的資料", "借一本書只需要校內帳號。切換額外欄位，觀察暴露的資訊。", [
    choice("phone", "手機號碼", [["no", "不蒐集"], ["yes", "要求填寫"]]),
    choice("location", "精確位置", [["no", "不蒐集"], ["yes", "要求提供"]])
  ], ({ phone, location }) => {
    const extra = [phone === "yes" && "手機號碼", location === "yes" && "精確位置"].filter(Boolean);
    return { headline: extra.length ? `多蒐集 ${extra.length} 項資料` : "只蒐集借書需要的資料",
      facts: [["借書功能", "有校內帳號即可"], ["額外暴露", extra.join("、") || "無"]],
      explanation: "加密與權限控制保護已蒐集的資料。資料最小化則從一開始減少蒐集範圍。" };
  })
];

StudyActivities.register("lecture-05", activities);
})();
