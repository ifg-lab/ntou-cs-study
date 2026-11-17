"use strict";

(() => {
  const locks = {
    crossing: { strategy: "相反順序", first: "B", second: "A" },
    ordered: { strategy: "都先拿 A", first: "A", second: "B" }
  };
  const lockMap = {
    nodes: [["p1", "程序 P1", 20, 23], ["p2", "程序 P2", 80, 23], ["a", "鎖 A", 20, 76], ["b", "鎖 B", 80, 76]],
    links: [["p1", "a"], ["p1", "b"], ["p2", "a"], ["p2", "b"]]
  };
  const scenario = {
    id: "order", label: "鎖的取得順序", options: [["crossing", "P1：A → B；P2：B → A"], ["ordered", "兩者都先 A → 再 B"]], value: "crossing"
  };

  StudyActivities.register("lecture-04", [
    {
      concept: "virtual-memory", page: 31, title: "跟著一次缺頁看 CPU 換人",
      intro: "A 讀到一個合法虛擬頁。先用不在 RAM 的情境跑一遍，再選已在 RAM，對照就緒佇列的變化。",
      fields: [{ id: "present", label: "A 的頁面是否在 RAM", options: [["missing", "不在 RAM"], ["ready", "已在 RAM"]], value: "missing" }],
      action: "下一步", resetLabel: "重設",
      initialState: () => ({ mode: null, step: 0 }),
      initialResult: () => ({ headline: "A 正使用 CPU，B 在就緒佇列。", facts: [["CPU", "A"], ["就緒", "B"], ["阻塞", "—"]] }),
      run({ present }, _, state) {
        const resident = present === "ready";
        const steps = resident ? [
          ["找到駐留頁，A 繼續執行", "A", "B", "—", "實體頁框可直接使用", "頁表項已指向 RAM 中的頁框。"]
        ] : [
          ["A 缺頁並等待載入", "核心", "B", "A", "磁碟讀取中", "合法頁不在 RAM，核心開始 I/O。"],
          ["B 接手 CPU", "B", "—", "A", "磁碟讀取中", "A 等待 I/O，排程器選可執行的 B。"],
          ["I/O 完成，A 回到就緒", "B", "A", "—", "頁表指向 RAM", "A 現在有可用頁面，等下一次派遣。"],
          ["B 用完時間片，A 再執行", "A", "B", "—", "A 重新存取該頁", "這次頁面已駐留，A 可完成存取。"]
        ];
        if (state.mode !== present) {
          state.mode = present;
          state.step = 0;
        }
        state.step = Math.min(state.step + 1, steps.length);
        const [headline, cpu, ready, blocked, page, explanation] = steps[state.step - 1];
        return {
          headline,
          packetStrip: [
            { label: `CPU · ${cpu}`, size: 1, kind: "header" },
            { label: `就緒 · ${ready}`, size: 1 },
            { label: `阻塞 · ${blocked}`, size: 1 }
          ],
          facts: [["頁表與磁碟", page], ["步驟", `${state.step} / ${steps.length}`]],
          explanation
        };
      }
    },
    {
      concept: "time-sharing", page: 38, title: "追蹤 A 和 B 如何輪流取得 CPU",
      intro: "兩個程序同時就緒：A 要四拍、B 要三拍。從 A 開始，改用一拍或兩拍的時間片，觀察誰先做完。",
      fields: [{ id: "quantum", label: "每次最多執行", options: [["1", "1 拍"], ["2", "2 拍"], ["4", "4 拍"]], value: "2" }],
      run({ quantum }) {
        const remaining = { A: 4, B: 3 };
        const queue = ["A", "B"];
        const timeline = [];
        while (queue.length) {
          const process = queue.shift();
          const ticks = Math.min(Number(quantum), remaining[process]);
          timeline.push(...Array(ticks).fill(process));
          remaining[process] -= ticks;
          if (remaining[process]) queue.push(process);
        }
        return {
          headline: `A 第 ${timeline.lastIndexOf("A") + 1} 拍完成，B 第 ${timeline.lastIndexOf("B") + 1} 拍完成`,
          timeline: {
            caption: "單核心輪轉排程（無 I/O 或切換成本）", columns: timeline.map((_, index) => index + 1),
            rows: ["A", "B"].map(process => [process, timeline.map((active, index) =>
              active === process ? "跑" : index < timeline.lastIndexOf(process) ? "等" : "")])
          },
          explanation: "「跑」代表正在 CPU 上執行，「等」代表已就緒但在排隊。這七拍每個時間格只有一個程序在跑。"
        };
      }
    },
    {
      concept: "synchronization", page: 39, title: "為什麼兩次加一只剩一次？",
      intro: "A、B 都對初始為 0 的計數器執行加一。切換操作次序，看每個程序各自讀到什麼、最後又寫回哪個值。",
      fields: [{ id: "mode", label: "執行順序", options: [["interleaved", "兩者先後讀到舊值"], ["locked", "依序進入臨界區"]], value: "interleaved" }],
      run({ mode }) {
        const locked = mode === "locked";
        const actions = locked ? ["A讀", "A加", "A寫", "B讀", "B加", "B寫"] : ["A讀", "B讀", "A加", "B加", "A寫", "B寫"];
        let total = 0;
        const values = {};
        const cells = { A: Array(actions.length).fill(""), B: Array(actions.length).fill(""), shared: [] };
        actions.forEach(([process, operation], index) => {
          if (operation === "讀") values[process] = total;
          else if (operation === "加") values[process]++;
          else total = values[process];
          cells[process][index] = `${operation} ${values[process]}`;
          cells.shared.push(String(total));
        });
        return {
          headline: `共用計數器最後是 ${total}`,
          timeline: { caption: "逐步讀取、在本地加一、寫回共用數值",
            columns: actions.map((_, index) => index + 1), rows: [["A", cells.A], ["B", cells.B], ["共用值", cells.shared]] },
          explanation: locked ? "A 寫入 1 後 B 才能讀，B 以 1 為起點再加一。" :
            "兩者都讀到 0，各自在本地算出 1。B 寫回時蓋過 A 已寫的 1，少算了一次。"
        };
      }
    },
    {
      concept: "deadlock", page: 46, title: "一步步看兩個程序怎麼卡住",
      intro: "先用相反的加鎖順序按三次，沿圖找出互等的兩個方向。再改成兩邊都先拿 A，看看哪個程序能先完成。",
      fields: [scenario], graph: lockMap, action: "下一步", resetLabel: "重設",
      initialState: () => ({ order: "", step: 0 }),
      initialResult: () => ({ headline: "兩把鎖都還沒分配", explanation: "P1 固定先取 A，P2 的順序由你決定。" }),
      preview({ order }, state) {
        state.order = order;
        state.step = 0;
        return { headline: `已選「${locks[order].strategy}」`, explanation: "按下一步，從空白狀態開始。" };
      },
      run({ order }, _, state) {
        if (state.order !== order) {
          state.order = order;
          state.step = 0;
        }
        state.step = Math.min(state.step + 1, 3);
        const { first, second } = locks[order];
        if (state.step === 1) return {
          inFlight: "P1 請求鎖 A…", headline: "P1 拿到鎖 A",
          facts: [["鎖 A", "P1 持有"], ["鎖 B", "可用"]],
          map: { active: ["p1-a"], focus: ["p1", "a"], messages: [{ from: "a", to: "p1", label: "A" }] }
        };
        if (state.step === 2) {
          const free = first === "B";
          return {
            inFlight: `P2 請求鎖 ${first}…`,
            headline: free ? "P2 拿到鎖 B" : "P2 等鎖 A，現在手上沒有鎖",
            facts: [["鎖 A", "P1 持有"], ["鎖 B", free ? "P2 持有" : "可用"]],
            map: { active: free ? ["p1-a", "p2-b"] : ["p1-a"], broken: free ? [] : ["p2-a"], focus: ["p2"],
              messages: [{ from: free ? "b" : "p2", to: free ? "p2" : "a", label: first }] }
          };
        }
        if (second === "A") return {
          inFlight: "雙方請求第二把鎖…", headline: "發生死結：P1 等 P2，P2 等 P1",
          facts: [["P1", "持有 A，等待 B"], ["P2", "持有 B，等待 A"]],
          map: { active: ["p1-a", "p2-b"], broken: ["p1-b", "p2-a"], focus: ["p1", "p2"],
            messages: [{ from: "p1", to: "b", label: "等 B" }, { from: "p2", to: "a", label: "等 A" }] },
          explanation: "兩程序各握有對方需要的鎖，且都不會先放手。試把取得順序改成一致。"
        };
        return {
          inFlight: "P1 可以繼續使用鎖 B…", headline: "P1 可先完成，P2 接著取得兩把鎖",
          facts: [["P1", "依序取得 A、B，完成後釋放"], ["P2", "等待 A 時沒有持有 B"]],
          map: { active: ["p1-a", "p1-b"], focus: ["p1"], messages: [{ from: "b", to: "p1", label: "B" }] },
          explanation: "P2 雖然仍需排隊，P1 可以完成。相同的加鎖順序消除了循環等待。"
        };
      }
    },
    {
      concept: "linux-path", page: 85, title: "沿著目錄走到指定位置",
      intro: "從 /home/mei/docs 出發，先猜 ../pics 會到哪裡，再按解析。也試試 /var/log 和 ../../。",
      fields: [{ id: "path", label: "要去的路徑（示意）", type: "text", value: "../pics" }],
      action: "解析路徑",
      run({ path }) {
        const text = path.trim();
        const absolute = text.startsWith("/");
        const parts = text.split("/").filter(Boolean);
        if (!text || text.length > 36 || parts.length > 6 || parts.some(part => !/^[a-z0-9._-]{1,16}$/i.test(part))) {
          return { headline: "請填最多六段的簡短路徑", explanation: "可用 /、..、. 或英數名稱，例如 ../pics。" };
        }
        const stack = absolute ? [] : ["home", "mei", "docs"];
        const visited = [{ label: `起點 /${stack.join("/")}`, size: 1, kind: "header" }];
        for (const part of parts) {
          if (part === "..") stack.pop();
          else if (part !== ".") stack.push(part);
          visited.push({ label: `${part} → /${stack.join("/")}`, size: 1, kind: "data" });
        }
        return {
          headline: `路徑解析為 /${stack.join("/")}`, packetStrip: visited,
          explanation: "以 / 開頭從根目錄出發；其他路徑從目前位置開始。這裡只追蹤路徑字串，實際 cd 還需目錄存在且有權限。"
        };
      }
    }
  ]);
})();
