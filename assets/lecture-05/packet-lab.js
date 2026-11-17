"use strict";

(() => {
  const esc = value => StudySite.escape(String(value));
  const courseId = "lecture-05";
  const edgeKey = (from, to) => [from, to].sort().join(":");
  const labelFor = (graph, id) => graph.nodes.find(node => node.id === id)?.label ?? "";
  const pointer = (label, action, primary = false) =>
    '<button type="button" class="btn' + (primary ? "" : " secondary") + '" data-packet-action="' + action + '">' + label + '</button>';

  function render(lesson) {
    const { concept, modes, graph } = lesson;
    const id = "packet-" + concept;
    return '<section class="packet-lab" aria-label="' + esc(lesson.title) + '">' +
      '<div class="packet-config">' +
      (modes.length > 1 ? '<label class="packet-scenario"><span>情境</span><select class="field" data-packet-mode>' +
        modes.map((mode, index) => '<option value="' + index + '">' + esc(mode.label) + '</option>').join("") + '</select></label>' : "") +
      '<label class="packet-practice"><input type="checkbox" data-packet-practice> 先猜再看</label></div>' +
      '<div class="packet-task"><strong>跟做任務</strong><p data-packet-task></p></div>' +
      '<nav class="packet-phases" data-packet-phases aria-label="前往流程階段"></nav>' +
      '<div class="packet-workspace">' +
      '<div class="packet-deck"><div class="packet-deck-head"><div class="packet-view-controls" aria-label="封包視圖">' +
      '<button type="button" data-packet-view="map" aria-pressed="true" aria-controls="' + id + '-map">網路圖</button>' +
      '<button type="button" data-packet-view="sequence" aria-pressed="false" aria-controls="' + id + '-sequence">時間線</button></div>' +
      '<button type="button" class="packet-replay" data-packet-action="replay" aria-label="重播這一步的封包動畫">↻ 重播這一步</button></div>' +
      '<div class="packet-screen" id="' + id + '-map" data-packet-map>' + mapMarkup(graph) + '</div>' +
      '<div class="packet-screen packet-sequence" id="' + id + '-sequence" data-packet-sequence hidden></div>' +
      '<p class="packet-route" data-packet-route></p>' +
      '<div class="packet-step" aria-live="polite" aria-atomic="true"><h3 data-packet-title></h3><p data-packet-note></p>' +
      '<p class="packet-outcome" data-packet-outcome hidden></p></div></div>' +
      '<aside class="packet-inspector" aria-label="封包檢查器"><div data-packet-details></div>' +
      '<div class="packet-practice-panel" data-packet-question hidden></div></aside>' +
      '<nav class="packet-stepnav" aria-label="實驗步驟">' + pointer("← 上一步", "prev") +
      '<span class="packet-counter" data-packet-count></span>' + pointer("下一步 →", "next", true) + '</nav></div>' +
      '<div class="packet-playbar">' + pointer("自動播放", "play") + pointer("回到起點", "reset") +
      '<label><span>播放速度</span><select class="field" data-packet-speed><option value="2800">慢速</option>' +
      '<option value="2050" selected>標準</option><option value="1250">快速</option></select></label></div>' +
      '<p class="packet-footnote">這是簡化的教學流程。時間線依訊息排序，動畫速度和欄位範例供觀察使用。</p></section>';
  }

  function mapMarkup(graph) {
    return '<div class="packet-map" data-node-count="' + graph.nodes.length + '" aria-hidden="true">' +
      graph.links.map(([from, to]) => '<span class="packet-edge" data-packet-edge="' + edgeKey(from, to) +
        '" data-from="' + from + '" data-to="' + to + '"></span>').join("") +
      graph.nodes.map(({ id, label, x, y }) => '<div class="packet-node" data-packet-node="' + id + '" style="--x:' + x + '%;--y:' + y + '%">' +
        '<canvas class="packet-device" width="264" height="216"></canvas><span class="packet-node-label">' +
        esc(label) + '</span></div>').join("") + '</div>';
  }

  function bindMap(board, graph) {
    const points = new Map(graph.nodes.map(node => [node.id, node]));
    const wires = [...board.querySelectorAll("[data-packet-edge]")];
    const nodes = [...board.querySelectorAll("[data-packet-node]")];
    for (const node of nodes) PacketDeviceArt.draw(node.querySelector("canvas"), node.dataset.packetNode);
    function layout() {
      const { width, height } = board.getBoundingClientRect();
      if (!width || !height) return;
      for (const wire of wires) {
        const from = points.get(wire.dataset.from), to = points.get(wire.dataset.to);
        const dx = (to.x - from.x) * width / 100, dy = (to.y - from.y) * height / 100;
        wire.style.left = from.x + "%";
        wire.style.top = from.y + "%";
        wire.style.width = Math.hypot(dx, dy) + "px";
        wire.style.transform = "rotate(" + Math.atan2(dy, dx) + "rad)";
      }
    }
    function clear() {
      for (const token of board.querySelectorAll(".packet-token")) {
        for (const animation of token.getAnimations()) animation.cancel();
        token.remove();
      }
    }
    function moveToken(path, id, lost, startAfter = 0) {
      const frames = path.map(point => ({ left: point.x + "%", top: point.y + "%" }));
      if (lost) {
        const before = path.at(-2), after = path.at(-1);
        frames[frames.length - 1] = { left: (before.x + after.x) / 2 + "%", top: (before.y + after.y) / 2 + "%", opacity: 0 };
      } else {
        frames[frames.length - 1].opacity = 0;
      }
      const token = document.createElement("span");
      token.className = "packet-token";
      token.textContent = lost ? "× " + id : id;
      board.append(token);
      const animation = token.animate(frames, {
        duration: (path.length - 1) * 390, delay: startAfter, easing: "linear", fill: "backwards"
      });
      animation.onfinish = () => token.remove();
    }
    return {
      layout, clear,
      show(step, index, animate) {
        clear();
        const paths = [step.path, ...(step.branches ?? [])];
        const activeNodes = new Set(paths.flat());
        const departures = new Map(paths.flatMap(path => path.slice(1).map((to, i) => [edgeKey(path[i], to), path[i]])));
        const recipients = new Set(paths.map(path => path.at(-1)));
        for (const wire of wires) {
          const from = departures.get(wire.dataset.packetEdge);
          wire.dataset.state = from ? (step.lost ? "lost" : "active") : "";
          wire.dataset.direction = !from ? "" : from === wire.dataset.from ? "forward" : "back";
        }
        for (const node of nodes) {
          const id = node.dataset.packetNode;
          node.dataset.active = step.path[0] === id ? "sender" : recipients.has(id) && !step.lost ? "receiver" :
            activeNodes.has(id) ? "via" : "";
        }
        if (!animate || step.path.length < 2 || StudyPreferences.motionReduced() || typeof board.animate !== "function") return;
        paths.forEach(path => moveToken(path.map(id => points.get(id)), "#" + (index + 1), step.lost,
          Math.max(0, step.path.indexOf(path[0])) * 390));
      }
    };
  }

  function phasesMarkup(steps) {
    const starts = steps.flatMap((step, index) => index === 0 || step.phase !== steps[index - 1].phase ? [index] : []);
    return starts.map((start, position) => '<button type="button" data-packet-phase="' + start + '" data-end="' +
      (starts[position + 1] ?? steps.length) + '">' + esc(steps[start].phase) + '</button>').join("");
  }

  function sequenceMarkup(steps, graph) {
    const activeActors = new Set(steps.flatMap(step => step.path));
    const actors = graph.nodes.filter(node => activeActors.has(node.id));
    const lanes = new Map(actors.map((node, index) => [node.id, index + 1]));
    return '<div class="packet-lane-head" aria-hidden="true"><div class="packet-lane-labels" style="--lanes:' + actors.length + '">' +
      actors.map(node => '<span>' + esc(node.label) + '</span>').join("") + '</div></div>' +
      '<ol class="packet-sequence-list" aria-label="有序的訊息與操作">' + steps.map((step, index) => {
        const from = step.path[0], to = step.path.at(-1);
        const left = Math.min(lanes.get(from), lanes.get(to)), right = Math.max(lanes.get(from), lanes.get(to));
        const travel = !from ? "" : '<span class="packet-lane-arrow" aria-hidden="true" style="--from:' + left +
          ';--to:' + (right + 1) + '">' + (lanes.get(from) < lanes.get(to) ? "→" : "←") + '</span>';
        const route = from ? labelFor(graph, from) + " → " + labelFor(graph, to) + (step.lost ? " · × 途中遺失" : "") : step.phase;
        return '<li><button class="packet-sequence-row" type="button" data-packet-jump="' + index + '">' +
          '<span class="packet-row-number">' + (index + 1) + '</span><span><strong>' + esc(step.label) + '</strong>' +
          '<small>' + esc(route) + '</small></span>' +
          '<span class="packet-lanes" aria-hidden="true" style="--lanes:' + actors.length + '">' + travel + '</span></button></li>';
      }).join("") + '</ol>';
  }

  function detailsMarkup(step) {
    const layers = '<div class="' + (step.outline ? 'packet-layers packet-outline" aria-label="封裝順序' :
      'packet-layers" aria-label="選擇協定層') + '">' + step.layers.map((layer, i) =>
      '<button type="button" data-packet-layer="' + i + '" aria-pressed="false">' + esc(layer.name) + '</button>').join("") + '</div>';
    const slots = step.packetSlots ? '<ol class="packet-slots">' + step.packetSlots.map(([name, status, bytes]) =>
      '<li data-slot-state="' + esc(status) + '"' + (bytes ? ' style="flex-grow:' + bytes + '"' : "") +
      '><strong>' + esc(name) + '</strong><small>' + esc(status) + '</small></li>').join("") + '</ol>' : "";
    const table = step.table ? '<div class="packet-table-wrap' + (step.table.changed ? ' packet-compare' : '') +
      '" tabindex="0" role="region" aria-label="' + esc(step.table.title) + '"><table><caption>' +
      esc(step.table.title) + '</caption><thead><tr>' + step.table.headings.map(label => '<th scope="col">' + esc(label) + '</th>').join("") +
      '</tr></thead><tbody>' + step.table.rows.map(([name, ...values], i) =>
        '<tr' + (step.table.changed?.includes(i) ? ' class="packet-changed"' : "") + '><th scope="row">' + esc(name) +
        '</th>' + values.map((value, j) => '<td data-column="' + esc(step.table.headings[j + 1]) + '">' + esc(value) +
          (j === 1 && step.table.changed?.includes(i) ? '<small>已變更</small>' : "") + '</td>').join("") + '</tr>').join("") + '</tbody></table></div>' : "";
    if (!step.layers.length) return '<h3>封包欄位</h3>' + slots + table + '<p class="packet-empty">這一步是準備、等待或完成後的操作。</p>';
    return '<h3>封包欄位</h3>' + table + slots + layers + '<div data-packet-fields></div>';
  }

  function fieldsMarkup(layer) {
    return '<dl class="packet-fields">' + layer.fields.slice(0, 3).map(item =>
      '<div><dt>' + esc(item.label) + '</dt><dd><strong>' + esc(item.value) + '</strong><p>' + esc(item.note) + '</p></dd></div>').join("") +
      '</dl><details class="packet-field-detail"><summary>完整示意欄位' + (layer.fields.some(item => item.hex) ? '與十六進位' : '') +
      '</summary><dl class="packet-fields">' + layer.fields.map(item =>
        '<div><dt>' + esc(item.label) + '</dt><dd><strong>' + esc(item.value) + '</strong><p>' + esc(item.note) + '</p>' +
        (item.hex ? '<code>' + esc(item.hex) + '</code>' : "") + '</dd></div>').join("") + '</dl></details>';
  }

  function questionMarkup(question) {
    return '<form data-packet-check><fieldset><legend>' + esc(question.question) + '</legend>' +
      question.options.map((text, i) => '<label><input required type="radio" name="packet-answer" value="' + i + '"> <span>' + esc(text) + '</span></label>').join("") +
      '</fieldset><div class="packet-question-actions"><button class="btn" type="submit">檢查答案</button>' +
      pointer("給我提示", "hint") + pointer("看解答", "reveal") +
      '</div><p data-packet-feedback class="packet-hint" role="status" hidden></p></form>';
  }

  function bind(element, lesson) {
    const root = element.querySelector(".packet-lab");
    const get = key => root.querySelector("[data-packet-" + key + "]");
    const action = name => root.querySelector('[data-packet-action="' + name + '"]');
    const graph = lesson.graph;
    const board = root.querySelector(".packet-map");
    const map = bindMap(board, graph);
    let steps, position = 0, layer = 0, timer, hint = 0, modeIndex = 0;
    let view = "map";
    const completed = new Set();
    const current = () => steps[position];
    const waiting = () => Boolean(get("practice").checked && current().check && !completed.has(position));
    const visibleMotion = () => view === "map" && element.open;

    function stop() {
      clearInterval(timer);
      timer = undefined;
      action("play").textContent = "自動播放";
      action("play").setAttribute("aria-pressed", "false");
    }

    function play() {
      if (timer) { stop(); return; }
      if (position === steps.length - 1) jump(0, false);
      if (waiting()) return;
      action("play").textContent = "暫停";
      action("play").setAttribute("aria-pressed", "true");
      timer = setInterval(() => {
        if (!root.isConnected || !element.open || document.hidden) { stop(); return; }
        jump(position + 1, true);
      }, Number(get("speed").value));
    }

    function setLayer(index) {
      layer = index;
      for (const button of root.querySelectorAll("[data-packet-layer]")) {
        button.setAttribute("aria-pressed", String(Number(button.dataset.packetLayer) === layer));
      }
      get("fields").innerHTML = fieldsMarkup(current().layers[index]);
    }

    function paintCurrentSelection() {
      for (const button of root.querySelectorAll("[data-packet-phase]")) {
        const selected = position >= Number(button.dataset.packetPhase) && position < Number(button.dataset.end);
        if (selected) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      }
      const rows = [...root.querySelectorAll("[data-packet-jump]")];
      rows.forEach((button, i) => {
        if (i === position) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      const list = root.querySelector(".packet-sequence-list");
      if (view !== "sequence") return;
      const bounds = list.getBoundingClientRect(), row = rows[position].getBoundingClientRect();
      if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top;
      else if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom;
    }

    function paint(animate, feedback) {
      const step = current(), locked = waiting();
      if (locked || position === steps.length - 1) stop();
      let trail = "這一步沒有封包移動";
      if (step.path.length) trail = step.path.map(id => labelFor(graph, id)).join(" → ");
      if (step.lost) trail += " · × 途中遺失";
      if (step.branches?.length) trail += "；也送到 " + step.branches.map(path => labelFor(graph, path.at(-1))).join("、");
      get("route").textContent = locked ? "答完就會顯示這一步" : trail;
      get("title").textContent = locked ? "先猜這一步" : step.title;
      get("note").textContent = locked ? "可以先試一個答案，或分兩次打開提示。" : step.note;
      const result = get("outcome");
      result.hidden = locked || !step.summary;
      result.textContent = locked ? "" : (step.summary ?? "");
      const priorOutline = [...root.querySelectorAll(".packet-outline button")].map(button => button.textContent);
      get("details").hidden = locked;
      get("details").innerHTML = locked ? "" : detailsMarkup(step);
      if (!locked && step.layers.length) setLayer(0);
      if (animate && priorOutline.length && step.outline && !StudyPreferences.motionReduced()) {
        const removed = priorOutline.some(name => !step.outline.includes(name));
        for (const button of root.querySelectorAll(".packet-outline button")) {
          if (removed || !priorOutline.includes(button.textContent)) button.animate?.([
            { opacity: .42, transform: removed ? "translateX(6px)" : "translateX(-12px) scale(.94)" },
            { opacity: 1, transform: "none" }
          ], { duration: 310, easing: "ease-out" });
        }
      }
      const question = get("question");
      question.hidden = !locked && !feedback;
      if (locked) question.innerHTML = questionMarkup(step.check);
      else if (feedback) {
        question.innerHTML = '<p class="packet-hint packet-check-result" role="status"></p>';
        question.firstElementChild.textContent = feedback;
      } else question.replaceChildren();
      action("prev").disabled = position === 0;
      action("next").disabled = locked || position === steps.length - 1;
      action("replay").disabled = locked || !step.path.length || view !== "map" || StudyPreferences.motionReduced();
      action("play").disabled = locked;
      get("count").textContent = (position + 1) + " / " + steps.length;
      map.show(locked ? { path: [] } : step, position, !locked && animate && visibleMotion());
      paintCurrentSelection();
    }

    function jump(index, animate = true) {
      position = Math.max(0, Math.min(steps.length - 1, index));
      hint = 0;
      paint(animate);
    }

    function restart(index) {
      stop();
      completed.clear();
      modeIndex = index;
      const mode = lesson.modes[index];
      steps = mode.events();
      get("task").textContent = mode.task;
      get("phases").innerHTML = phasesMarkup(steps);
      get("sequence").innerHTML = sequenceMarkup(steps, graph);
      jump(0, false);
    }

    function selectView(selected) {
      view = selected;
      for (const name of ["map", "sequence"]) get(name).hidden = name !== selected;
      for (const button of root.querySelectorAll("[data-packet-view]")) {
        button.setAttribute("aria-pressed", String(button.dataset.packetView === selected));
      }
      if (view === "map") map.layout();
      else map.clear();
      action("replay").disabled = waiting() || !current().path.length || view !== "map" || StudyPreferences.motionReduced();
      paintCurrentSelection();
    }

    function showHint(level, retry = false) {
      hint = Math.min(2, level);
      const feedback = get("feedback");
      feedback.hidden = false;
      feedback.textContent = (retry ? "可以在這一步換個答案再試。 " : "") +
        (hint === 1 ? "提示 1｜" + current().check.hint : "提示 2｜" + current().check.reason);
      action("hint").textContent = hint === 1 ? "看原因" : "已顯示兩層提示";
      action("hint").disabled = hint === 2;
    }

    function finishCheck(correct) {
      completed.add(position);
      paint(true, (correct ? "答對了。 " : "這一步的答案。 ") + current().check.reason);
      action("next").focus({ preventScroll: true });
    }

    const choose = get("mode");
    choose?.addEventListener("change", () => restart(Number(choose.value)));
    get("practice").addEventListener("change", () => {
      stop();
      hint = 0;
      paint(false);
    });
    get("speed").addEventListener("change", () => {
      if (timer) { stop(); play(); }
    });
    root.addEventListener("submit", event => {
      if (!event.target.matches("[data-packet-check]")) return;
      event.preventDefault();
      if (Number(new FormData(event.target).get("packet-answer")) === current().check.correct) finishCheck(true);
      else showHint(Math.max(1, hint), true);
    });

    const actions = {
      prev: () => { stop(); jump(position - 1, false); },
      next: () => { stop(); jump(position + 1); },
      play, reset: () => restart(modeIndex),
      replay: () => map.show(current(), position, visibleMotion()),
      hint: () => showHint(hint + 1),
      reveal: () => finishCheck(false)
    };
    root.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      const { packetAction, packetView, packetPhase, packetJump, packetLayer } = button.dataset;
      if (packetAction) actions[packetAction]();
      else if (packetView) selectView(packetView);
      else if (packetLayer !== undefined) setLayer(Number(packetLayer));
      else if (packetPhase !== undefined || packetJump !== undefined) {
        stop();
        jump(Number(packetPhase ?? packetJump));
      }
    });
    const resize = new ResizeObserver(map.layout);
    resize.observe(board);
    const host = element.closest(".lecture-view");
    if (host) {
      const lifecycle = new MutationObserver(() => {
        if (element.isConnected) return;
        stop();
        map.clear();
        resize.disconnect();
        lifecycle.disconnect();
      });
      lifecycle.observe(host, { childList: true });
    }
    element.addEventListener("toggle", () => {
      if (element.open) { map.layout(); return; }
      stop();
      map.clear();
    });
    restart(0);
  }

  const labs = Chapter04PacketTraces.map(lesson => ({
    concept: lesson.concept, title: lesson.title, page: lesson.page, intro: lesson.intro, packetLab: lesson.summary,
    scene: { render: () => render(lesson), bind: element => bind(element, lesson) }
  }));
  StudyActivities.register(courseId, [...StudyActivities.list(courseId), ...labs]);
})();
