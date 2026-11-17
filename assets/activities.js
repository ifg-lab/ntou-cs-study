"use strict";

const StudyActivities = (() => {
  const sets = new Map();
  const { escape: esc } = StudySite;

  function register(id, activities) {
    sets.set(id, activities);
  }

  function list(id) {
    return sets.get(id) ?? [];
  }

  function indexCards(activities, course, linkFor, query = "") {
    const normalize = text => text.normalize("NFKC").toLowerCase();
    const words = normalize(query).trim().replace(/\bp\s*\.?\s*(?=\d)/g, "p.").split(/\s+/);
    return course.units.map(unit => {
      const matching = activities.filter(activity => {
        if (activity.page < unit.start || activity.page > unit.end) return false;
        const description = normalize(`${activity.title} ${activity.intro} ${activity.packetLab ?? ""} ${course.concepts[activity.concept] ?? ""} ${unit.title} p.${activity.page}`);
        return words.every(word => description.includes(word));
      }).sort((first, second) => first.page - second.page);
      if (!matching.length) return "";
      return `<section class="activity-unit">
        <h2>${esc(unit.title)}</h2>
        <div class="activity-grid">${matching.map(activity => `<a class="activity-link" href="${linkFor(activity)}">
          <span class="activity-page">p.${activity.page}</span>
          <strong>${esc(activity.title)}</strong><span class="activity-link-arrow" aria-hidden="true">→</span>
        </a>`).join("")}</div>
      </section>`;
    }).join("") || '<p class="empty">找不到符合的活動。試試觀念名稱或頁碼。</p>';
  }

  function starterLinks(activities, linkFor) {
    const packetLabs = activities.filter(activity => activity.packetLab);
    if (packetLabs.length) {
      return `<section class="packet-collection" aria-labelledby="packet-collection-title">
        <h2 id="packet-collection-title">封包實驗室</h2>
        <div class="activity-starters">${packetLabs.map(activity => `<a class="activity-starter" href="${linkFor(activity)}">
          <span class="activity-page">p.${activity.page}</span><strong>${esc(activity.title)}</strong>
          <span class="activity-starter-detail">${esc(activity.packetLab)}</span><span class="activity-link-arrow" aria-hidden="true">→</span>
        </a>`).join("")}</div>
      </section>`;
    }
    const starters = [
      ["dns-referral", "找出網站的 IP", "跟著 DNS 解析器查一次"],
      ["tcp-handshake", "建立一條 TCP 連線", "看兩端怎麼互相確認"],
      ["dhcp-exchange", "幫新裝置取得 IP", "跟著走完 DHCP 的四步"],
      ["insertion-sort", "把一個值插進排序區", "看 key 獨立移出、空位往左走"],
      ["binary-search", "找出第一個匹配", "換目標值，觀察左右界如何變動"],
      ["mst", "用最小成本連通全圖", "同一張圖比較 Kruskal 和 Prim"]
    ];
    const byConcept = new Map(activities.map(activity => [activity.concept, activity]));
    const links = starters.filter(([concept]) => byConcept.has(concept)).map(([concept, name, detail]) => {
      const activity = byConcept.get(concept);
      return `<a class="activity-starter" href="${linkFor(activity)}">
        <span class="activity-page">p.${activity.page}</span><strong>${name}</strong>
        <span class="activity-starter-detail">${detail}</span><span class="activity-link-arrow" aria-hidden="true">→</span></a>`;
    });
    return links.length ? `<section class="activity-start" aria-labelledby="activity-start-title">
      <h2 id="activity-start-title">第一次使用，從這裡開始</h2><div class="activity-starters">${links.join("")}</div></section>` : "";
  }

  function fieldMarkup(field, activityId) {
    const id = `${activityId}-${field.id}`;
    const label = `<label for="${id}">${esc(field.label)}</label>`;
    if (field.options) {
      return `<div class="activity-field">${label}
        <select id="${id}" name="${field.id}">${field.options.map(([key, name]) =>
          `<option value="${esc(key)}" ${key === field.value ? "selected" : ""}>${esc(name)}</option>`).join("")}</select></div>`;
    }
    if (field.type === "range") {
      return `<div class="activity-field">
        <div class="activity-range-label">${label}<output for="${id}">/${field.value}</output></div>
        <input id="${id}" name="${field.id}" type="range" value="${field.value}" min="${field.min}" max="${field.max}" step="1" aria-valuetext="/${field.value}">
        <div class="activity-range-bounds" aria-hidden="true"><span>/${field.min}</span><span>/${field.max}</span></div></div>`;
    }
    const constraints = field.type === "number"
      ? ` min="${field.min}" max="${field.max}" step="1" inputmode="numeric"`
      : ' maxlength="260" spellcheck="false" autocomplete="off"';
    return `<div class="activity-field">${label}
      <input class="field" id="${id}" name="${field.id}" type="${field.type}" value="${esc(field.value)}"${constraints} required></div>`;
  }

  function modelMarkup(activity) {
    const submit = activity.action || activity.fields.some(field => !field.options);
    const fields = activity.scenario ? scenarioMarkup(activity.fields[0], activity.concept)
      : activity.fields.map(field => fieldMarkup(field, activity.concept)).join("");
    const diagram = activity.graph ? graphMarkup(activity.graph) : "";
    const result = '<div class="activity-result" aria-live="polite" aria-atomic="true"></div>';
    const form = `<form class="activity-form">
      ${activity.firstStep ? `<p class="activity-first-step">${esc(activity.firstStep)}</p>` : ""}
      ${activity.workbench ? "" : diagram}
      ${activity.advanced ? '<details class="activity-options"><summary>調整參數</summary>' : ""}
      <div class="activity-fields">${fields}</div>
      ${activity.advanced ? "</details>" : ""}
      ${submit ? `<div class="activity-actions">
        <button class="btn" type="submit">${esc(activity.action ?? "試算")}</button>
        ${activity.resetLabel ? `<button class="btn secondary" data-activity-reset type="button">${esc(activity.resetLabel)}</button>` : ""}
      </div>` : ""}
    </form>`;
    return activity.workbench ? `<div class="switch-workbench">${form}
      <div class="switch-workbench-stage">${diagram}<div class="workbench-mac"></div>${result}</div></div>`
      : form + result;
  }

  function scenarioMarkup(field, concept) {
    return `<fieldset class="activity-scenarios"><legend>${esc(field.label)}</legend>
      <div class="scenario-options">${field.options.map(([value, label], index) => {
        const id = `scenario-${concept}-${index}`;
        return `<label for="${id}"><input id="${id}" type="radio" name="${field.id}" value="${esc(value)}"
          ${value === field.value ? "checked" : ""}><span>${esc(label)}</span></label>`;
      }).join("")}</div>
    </fieldset>`;
  }

  function sequenceMarkup(activity) {
    return `<div class="guided-activity">
      ${activity.graph ? graphMarkup(activity.graph) : `<div class="encapsulation-preview" aria-label="${esc(activity.diagramLabel ?? "目前的封裝內容")}"></div>`}
      <div class="activity-result guided-result" role="status" aria-atomic="true"></div>
      <div class="activity-actions">
        <button class="btn" type="button" data-guided-next></button>
        <button class="btn secondary" type="button" data-guided-reset hidden>從頭開始</button>
        <button class="activity-restart" type="button" data-guided-mode hidden>自己排順序</button>
      </div>
      <div class="activity-steps" data-guided-choices hidden></div>
      <details class="activity-log" hidden><summary>回看已完成步驟</summary><ol class="activity-sequence"></ol></details>
    </div>`;
  }

  function graphMarkup({ nodes, links = [] }) {
    return `<div class="network-board activity-map" aria-hidden="true">
      ${links.map(([from, to]) => `<span class="map-line" data-map-link="${from}-${to}" data-from="${from}" data-to="${to}"></span>`).join("")}
      ${nodes.map(([name, label, x, y]) => `<div class="map-node" data-map-node="${name}"
        style="left:${x}%;top:${y}%">${esc(label)}</div>`).join("")}
    </div>`;
  }

  function bindGraph(container, graph) {
    const board = container.querySelector(".activity-map");
    const points = new Map(graph.nodes.map(([id, , x, y]) => [id, [x, y]]));
    const defaultLabels = new Map(graph.nodes.map(([id, label]) => [id, label]));
    const nodes = [...board.querySelectorAll("[data-map-node]")];
    const wires = [...board.querySelectorAll("[data-map-link]")];
    let tokens = [];

    function layoutWires() {
      const { width, height } = board.getBoundingClientRect();
      for (const line of wires) {
        const [x1, y1] = points.get(line.dataset.from);
        const [x2, y2] = points.get(line.dataset.to);
        const dx = (x2 - x1) * width / 100;
        const dy = (y2 - y1) * height / 100;
        line.style.left = `${x1}%`;
        line.style.top = `${y1}%`;
        line.style.width = `${Math.hypot(dx, dy)}px`;
        line.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      }
    }
    let previousWidth = -1;
    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      if (width === previousWidth) return;
      previousWidth = width;
      layoutWires();
    });
    observer.observe(board);
    // The observer owns only geometry. Stop observing when this activity leaves the page.
    const host = container.closest(".lecture-view");
    if (host) {
      const lifecycle = new MutationObserver(() => {
        if (board.isConnected) return;
        observer.disconnect();
        lifecycle.disconnect();
      });
      lifecycle.observe(host, { childList: true });
    }

    function clearMotion() {
      for (const token of tokens) token.remove();
      tokens = [];
    }

    function setLinks({ active = [], broken = [], focus = [], labels = {} } = {}) {
      for (const line of wires) {
        line.dataset.state = broken.includes(line.dataset.mapLink) ? "broken"
          : active.includes(line.dataset.mapLink) ? "active" : "";
      }
      for (const node of nodes) {
        const id = node.dataset.mapNode;
        node.classList.toggle("map-node-active", focus.includes(id));
        const label = labels[id] ?? defaultLabels.get(id);
        if (node.textContent !== label) node.textContent = label;
      }
    }

    function send(messages) {
      clearMotion();
      const animationEnd = messages.reduce((max, { delay = 0 }) => Math.max(max, delay + 380), 0);
      if (StudyPreferences.motionReduced() || typeof board.animate !== "function") return 0;
      for (const { from, to, label, delay = 0, stop = 1 } of messages) {
        const [x1, y1] = points.get(from);
        const [x2, y2] = points.get(to);
        const token = document.createElement("span");
        token.className = "map-message";
        token.textContent = label;
        board.append(token);
        tokens.push(token);
        token.animate([
          { left: `${x1}%`, top: `${y1}%`, opacity: 0 },
          { opacity: 1, offset: .18 },
          { opacity: 1, offset: .83 },
          { left: `${x1 + (x2 - x1) * stop}%`, top: `${y1 + (y2 - y1) * stop}%`, opacity: 0 }
        ], { duration: 380, delay, easing: "ease-out", fill: "both" });
      }
      return animationEnd;
    }
    return { clearMotion, setLinks, send };
  }

  function card(activity) {
    const render = activity.scene?.render ?? (activity.steps ? sequenceMarkup : modelMarkup);
    return `<details class="study-activity" id="activity-${activity.concept}" data-activity="${activity.concept}">
      <summary><span class="activity-symbol" aria-hidden="true">▶</span>${esc(activity.title)}</summary>
      <div class="activity-body">
        <p class="activity-intro">${esc(activity.intro)}</p>
        ${render(activity)}
      </div>
    </details>`;
  }

  function bitMarkup({ address, prefix }) {
    const hasPrefix = Number.isInteger(prefix);
    return `<div class="activity-bits">
      <div class="activity-octets" aria-label="${hasPrefix ? "IPv4 網路位元與主機位元" : "IPv4 的 32 個位元"}">${address.split(".").map((octet, index) => {
        const digits = Number(octet).toString(2).padStart(8, "0");
        if (!hasPrefix) return `<code>${digits}</code>`;
        const cut = Math.max(0, Math.min(8, prefix - index * 8));
        return `<code><span class="network-bit">${digits.slice(0, cut)}</span><span class="host-bit">${digits.slice(cut)}</span></code>`;
      }).join("")}</div>
      ${hasPrefix ? `<p class="bit-legend"><span class="network-bit">前 ${prefix} 位為網路</span><span class="host-bit">後 ${32 - prefix} 位為主機</span></p>` : ""}
    </div>`;
  }

  function fragmentMarkup(fragments) {
    const maxData = Math.max(1, ...fragments.map(item => item.data));
    return `<div class="activity-table-wrap">
      <table class="study-table activity-fragments">
        <caption>各片資料長度與標頭欄位</caption>
        <thead><tr><th scope="col">分片</th><th scope="col">資料</th><th scope="col">總長</th><th scope="col">Offset</th><th scope="col">MF</th></tr></thead>
        <tbody>${fragments.map(item => `<tr><th scope="row">${item.number}</th>
          <td><div class="fragment-length"><meter min="0" max="${maxData}" value="${item.data}" aria-label="分片 ${item.number} 的資料長度"></meter><span>${item.data} B</span></div></td>
          <td>${item.length} B</td><td>${item.offset}</td><td>${item.more}</td></tr>`).join("")}</tbody>
      </table></div>`;
  }

  function packetStripMarkup(parts) {
    return `<div class="packet-strip">${parts.map(({ label, size, kind = "data" }) =>
      `<span class="packet-part" data-kind="${kind}" style="--packet-size:${Math.max(1, size)}">${esc(label)}</span>`).join("")}</div>`;
  }

  function previewMarkup({ tag, text, url }) {
    const content = esc(text);
    const preview = {
      title: `<div class="preview-tab">${content}</div>`,
      h1: `<strong class="preview-heading">${content}</strong>`,
      p: `<p>${content}</p>`,
      a: `<a href="${esc(url)}">${content}</a>`
    }[tag];
    return `<div class="activity-preview">${preview}</div>`;
  }

  function macTableMarkup(entries, learnedMac) {
    return `<table class="study-table activity-mac-table">
      <caption>MAC 位址表</caption>
      <thead><tr><th scope="col">MAC 位址</th><th scope="col">連接埠</th></tr></thead>
      <tbody>${entries.map(([mac, port]) => `<tr${mac === learnedMac ? ' class="mac-learned"' : ""}>
        <th scope="row">MAC ${esc(mac)}</th><td>埠 ${port}${mac === learnedMac ? ' <span class="mac-badge">本次學習</span>' : ""}</td></tr>`).join("")}</tbody>
    </table>`;
  }

  function resultMarkup(result) {
    const { headline, explanation, flow, facts, ports, macTable, learnedMac, bits, fragments, preview, code, packetStrip, timeline } = result;
    const flowList = flow?.length ? `<ol class="activity-flow" aria-label="處理順序">${flow.map(step => `<li>${esc(step)}</li>`).join("")}</ol>` : "";
    const factList = facts?.length ? `<dl class="activity-facts">${facts.map(([label, value]) =>
      `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : "";
    const portList = ports?.length ? `<ul class="activity-ports" aria-label="交換器連接埠">${ports.map(({ number, state, label }) =>
      `<li class="port-${state}"><span>埠 ${number}</span><strong>${esc(label)}</strong></li>`).join("")}</ul>` : "";
    return `<p class="activity-outcome">${esc(headline)}</p>${flowList}${portList}${macTable ? macTableMarkup(macTable, learnedMac) : ""}
      ${bits ? bitMarkup(bits) : ""}${packetStrip?.length ? packetStripMarkup(packetStrip) : ""}${fragments?.length ? fragmentMarkup(fragments) : ""}${timeline ? timelineMarkup(timeline) : ""}${factList}
      ${code ? `<pre class="activity-code"><code>${esc(code)}</code></pre>` : ""}${preview ? previewMarkup(preview) : ""}
      ${explanation ? `<p class="activity-explanation">${esc(explanation)}</p>` : ""}`;
  }

  function timelineMarkup({ caption, columns, rows }) {
    return `<div class="activity-table-wrap"><table class="study-table activity-timeline">
      <caption>${esc(caption)}</caption>
      <thead><tr><th scope="col">工作</th>${columns.map(column => `<th scope="col">${esc(column)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(([label, cells]) => `<tr><th scope="row">${esc(label)}</th>${cells.map((cell, index) =>
        `<td>${cell ? `<span data-stage="${esc(cell)}" style="--tick:${index}">${esc(cell)}</span>` : '<span class="timeline-empty">·</span>'}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>`;
  }

  function bindModel(element, activity, helpers) {
    const form = element.querySelector("form");
    const result = element.querySelector(".activity-result");
    const table = element.querySelector(".workbench-mac");
    const submit = form.querySelector('[type="submit"]');
    let state = activity.initialState?.();
    const graph = activity.graph ? bindGraph(element, activity.graph) : null;
    let timer;
    let inFlight = false;
    let lastTable = "";
    const setInFlight = active => {
      inFlight = active;
      if (table && submit) {
        submit.setAttribute("aria-disabled", String(active));
        submit.textContent = active ? "傳送中…" : activity.action;
      }
    };
    const paint = output => {
      if (!table) { result.innerHTML = resultMarkup(output); return; }
      const { macTable, learnedMac, ...summary } = output;
      result.innerHTML = resultMarkup(summary);
      if (!macTable) return;
      const signature = JSON.stringify([macTable, learnedMac]);
      if (signature === lastTable) return;
      lastTable = signature;
      table.innerHTML = macTableMarkup(macTable, learnedMac);
    };
    const run = (interactive = false) => {
      if (table && inFlight) return;
      if (interactive ? !form.reportValidity() : !form.checkValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      const output = activity.run(values, helpers, state);
      clearTimeout(timer);
      if (!graph) {
        paint(output);
        return;
      }
      const { messages = [], incoming, ...appearance } = output.map ?? {};
      const duration = graph.send(interactive ? messages : []);
      graph.setLinks(duration && incoming ? { ...appearance, ...incoming } : appearance);
      if (duration) {
        const oldHighlight = table?.querySelector(".mac-learned");
        if (oldHighlight) {
          oldHighlight.classList.remove("mac-learned");
          table.querySelector(".mac-badge")?.remove();
          lastTable = "";
        }
        setInFlight(true);
        paint({ headline: output.inFlight ?? "訊息傳送中…" });
        const intermediate = output.during;
        if (intermediate) {
          timer = setTimeout(() => {
            if (element.isConnected) paint(intermediate);
            if (incoming) graph.setLinks(appearance);
            timer = setTimeout(finish, Math.max(duration - 400, incoming ? 390 : 0));
          }, 400);
        } else timer = setTimeout(finish, duration);
      } else {
        paint(output);
      }
      function finish() {
        setInFlight(false);
        graph.clearMotion();
        if (element.isConnected) paint(output);
      }
    };
    const showInitial = () => {
      if (activity.initialResult) {
        const initial = activity.initialResult(state);
        graph?.setLinks(initial.map);
        paint(initial);
      } else run();
    };
    form.addEventListener("submit", event => { event.preventDefault(); run(true); });
    if (activity.preview) {
      form.addEventListener("change", () => {
        clearTimeout(timer);
        const preview = activity.preview(Object.fromEntries(new FormData(form)), state);
        graph?.clearMotion();
        graph?.setLinks(preview.map);
        result.innerHTML = resultMarkup(preview);
      });
    }
    if (!activity.action && activity.fields.every(field => field.options)) form.addEventListener("change", () => run());
    for (const slider of form.querySelectorAll('input[type="range"]')) {
      slider.addEventListener("input", () => {
        slider.parentElement.querySelector("output").value = `/${slider.value}`;
        slider.setAttribute("aria-valuetext", `/${slider.value}`);
        run();
      });
    }
    form.querySelector("[data-activity-reset]")?.addEventListener("click", () => {
      form.reset();
      if (activity.advanced) form.querySelector(".activity-options").open = false;
      state = activity.initialState?.();
      clearTimeout(timer);
      setInFlight(false);
      graph?.clearMotion();
      graph?.setLinks();
      showInitial();
    });
    showInitial();
  }

  function bindSequence(element, activity) {
    const steps = activity.steps;
    const next = element.querySelector("[data-guided-next]");
    const reset = element.querySelector("[data-guided-reset]");
    const mode = element.querySelector("[data-guided-mode]");
    const choices = element.querySelector("[data-guided-choices]");
    const feedback = element.querySelector(".guided-result");
    const log = element.querySelector(".activity-log");
    const list = log.querySelector("ol");
    const encapsulation = element.querySelector(".encapsulation-preview");
    const graph = activity.graph ? bindGraph(element, activity.graph) : null;
    let index = 0;
    let challenge = false;
    let learned = false;
    let busy = false;
    let timer;

    const focus = control => control?.focus({ preventScroll: true });

    function showNext() {
      const finished = index === steps.length;
      next.hidden = challenge || finished;
      next.setAttribute("aria-disabled", String(busy));
      if (!finished) next.textContent = busy ? "傳送中…" : steps[index].action ?? (index ? "下一步" : "開始示範");
      reset.hidden = index === 0;
      mode.hidden = !learned || (!challenge && !finished);
      mode.textContent = challenge ? "回到引導" : "自己排順序";
      choices.hidden = !challenge || finished;
    }

    function resetSequence() {
      clearTimeout(timer);
      busy = false;
      index = 0;
      list.replaceChildren();
      log.hidden = true;
      log.open = false;
      graph?.clearMotion();
      graph?.setLinks();
      if (encapsulation) encapsulation.textContent = activity.initialDiagram ?? "等待應用程式產生資料";
      feedback.innerHTML = resultMarkup({
        headline: challenge ? "選出第 1 步" : activity.goal ?? "跟著按鈕完成一次",
        explanation: challenge ? "選對後會播放該步驟。" : ""
      });
      if (challenge) {
        const order = steps.map((_, position) => position);
        for (let position = order.length - 1; position > 0; position--) {
          const swap = Math.floor(Math.random() * (position + 1));
          [order[position], order[swap]] = [order[swap], order[position]];
        }
        choices.innerHTML = order.map(position =>
          `<button class="btn secondary" type="button" data-activity-step="${position}">${esc(steps[position].label)}</button>`).join("");
      }
      showNext();
    }

    function advance() {
      if (busy || index === steps.length) return;
      const step = steps[index];
      if (graph) {
        graph.setLinks(step.appearance);
        const duration = graph.send(step.messages ?? []);
        if (duration) {
          busy = true;
          showNext();
          timer = setTimeout(() => {
            graph.clearMotion();
            if (element.isConnected) finishStep(step);
          }, duration);
          return;
        }
      }
      finishStep(step);
    }

    function finishStep(step) {
      busy = false;
      index++;
      const item = document.createElement("li");
      item.textContent = `${step.label} · ${step.detail}`;
      list.append(item);
      log.hidden = false;
      const finished = index === steps.length;
      if (finished) learned = true;
      if (encapsulation && step.parts) {
        encapsulation.innerHTML = packetStripMarkup(step.parts);
      }
      feedback.innerHTML = resultMarkup({
        headline: `${index} / ${steps.length} · ${step.label}`,
        explanation: finished && activity.finish ? `${step.detail} ${activity.finish}` : step.detail
      });
      showNext();
      if (element.open && (element.contains(document.activeElement) || document.activeElement === document.body)) {
        if (finished) focus(mode);
        else if (challenge) focus(choices.querySelector("button:not(:disabled)"));
      }
    }

    next.addEventListener("click", advance);
    choices.addEventListener("click", event => {
      const button = event.target.closest("[data-activity-step]");
      if (!button || busy || index === steps.length) return;
      const step = steps[index];
      if (Number(button.dataset.activityStep) !== index) {
        feedback.innerHTML = resultMarkup({ headline: `再想一下第 ${index + 1} 步`, explanation: step.hint });
        return;
      }
      button.disabled = true;
      advance();
    });
    reset.addEventListener("click", () => {
      resetSequence();
      focus(challenge ? choices.querySelector("button") : next);
    });
    mode.addEventListener("click", () => {
      challenge = !challenge;
      resetSequence();
      focus(challenge ? choices.querySelector("button") : next);
    });
    element.addEventListener("toggle", () => { if (!element.open) graph?.clearMotion(); });
    resetSequence();
  }

  function bind(element, activity, helpers) {
    if (element.dataset.initialized) return;
    element.dataset.initialized = "true";
    if (activity.scene) activity.scene.bind(element);
    else if (activity.steps) bindSequence(element, activity);
    else bindModel(element, activity, helpers);
  }

  return { register, list, indexCards, starterLinks, card, bind };
})();
