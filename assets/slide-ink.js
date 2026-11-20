"use strict";

const StudySlideInk = (() => {
  const storeName = "sheets";
  const memory = new Map();
  let opening;
  let restored = 0;
  function database() {
    if (!opening) {
      opening = new Promise((resolve, reject) => {
        const request = indexedDB.open("ntou-study-ink", 1);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => { db.close(); opening = undefined; };
          resolve(db);
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("The handwriting database is busy."));
      }).catch(error => { opening = undefined; throw error; });
    }
    return opening;
  }

  async function transact(mode, operation) {
    const db = await database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = operation(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error ?? new Error("The handwriting transaction was interrupted."));
    });
  }

  async function exportSheets() {
    let keys;
    const rows = await transact("readonly", store => {
      keys = store.getAllKeys();
      return store.getAll();
    }).catch(() => []);
    const combined = new Map(rows.map((value, index) => [keys.result[index], value]));
    for (const [id, value] of memory) combined.set(id, value);
    return Object.fromEntries([...combined].filter(([, strokes]) => strokes.length));
  }

  function validateSheets(value) {
    if (value === undefined) return {};
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("手寫筆記備份格式有誤。");
    const chapters = new Map(studyCatalog.filter(chapter => !chapter.pending).map(chapter => [chapter.id, chapter.pages]));
    const unit = value => typeof value === "number" && value >= 0 && value <= 1;
    for (const [id, strokes] of Object.entries(value)) {
      const [chapter, page, surface, extra] = id.split("/");
      if (extra !== undefined || !/^[1-9]\d*$/.test(page) || Number(page) > (chapters.get(chapter) ?? 0) ||
        !["slide", "paper"].includes(surface) || !Array.isArray(strokes) || strokes.some(stroke => !stroke ||
          !["pen", "highlight"].includes(stroke.tool) || !/^#[\da-f]{6}$/i.test(stroke.color) ||
          typeof stroke.size !== "number" || !(stroke.size > 0 && stroke.size <= .05) ||
          !Array.isArray(stroke.points) || !stroke.points.length || stroke.points.length > 12000 ||
          stroke.points.some(point => !Array.isArray(point) || point.length !== 3 || !point.every(unit)))) {
        throw new Error("備份中含有無法識別的手寫筆記。");
      }
    }
    return value;
  }

  async function restoreSheets(sheets) {
    const records = Object.entries(sheets);
    if (!records.length) return true;
    try {
      await transact("readwrite", store => records.map(([id, strokes]) => store.put(strokes, id)).at(-1));
      for (const [id] of records) memory.delete(id);
      restored++;
      return true;
    } catch { return false; }
  }

  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function includesPoint(polygon, [x, y]) {
    let inside = false;
    for (let a = 0, b = polygon.length - 1; a < polygon.length; b = a++) {
      const [ax, ay] = polygon[a], [bx, by] = polygon[b];
      if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
    }
    return inside;
  }

  function nearLine([x, y], [ax, ay], [bx, by], radius, ratio) {
    const dx = bx - ax, dy = (by - ay) * ratio;
    const px = x - ax, py = (y - ay) * ratio;
    const lengths = dx * dx + dy * dy;
    const t = lengths ? Math.max(0, Math.min(1, (dx * px + dy * py) / lengths)) : 0;
    return Math.hypot(px - t * dx, py - t * dy) <= radius;
  }

  function trace(context, points) {
    const pixel = ([x, y]) => [x * context.canvas.width, y * context.canvas.height];
    context.beginPath();
    context.moveTo(...pixel(points[0]));
    for (let i = 1; i < points.length - 1; i++) {
      const [x, y] = pixel(points[i]), [nx, ny] = pixel(points[i + 1]);
      context.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
    }
    context.lineTo(...pixel(points.at(-1)));
  }

  function drawStroke(context, stroke, selected = false) {
    const { width, height } = context.canvas;
    const size = stroke.size * width;
    const { points } = stroke;
    if (!points.length) return;
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = context.fillStyle = selected ? "#236dd2" : stroke.color;
    if (stroke.tool === "highlight" || selected) {
      context.globalAlpha = selected ? .85 : .28;
      context.lineWidth = selected ? size + width * .004 : size;
      if (points.length === 1) {
        const [x, y] = points[0];
        context.beginPath();
        context.arc(x * width, y * height, context.lineWidth / 2, 0, 2 * Math.PI);
        context.fill();
      } else {
        trace(context, points);
        context.stroke();
      }
    } else {
      const radius = pressure => size * (.36 + .64 * pressure) / 2;
      context.beginPath();
      for (let i = 0; i < points.length; i++) {
        const [x, y, pressure] = points[i];
        const p = points[i - 1];
        if (p) {
          const ax = p[0] * width, ay = p[1] * height, bx = x * width, by = y * height;
          const length = Math.hypot(bx - ax, by - ay);
          if (length > 0) {
            const ux = -(by - ay) / length, uy = (bx - ax) / length;
            const first = radius(p[2]), second = radius(pressure);
            context.moveTo(ax + ux * first, ay + uy * first);
            context.lineTo(ax - ux * first, ay - uy * first);
            context.lineTo(bx - ux * second, by - uy * second);
            context.lineTo(bx + ux * second, by + uy * second);
            context.closePath();
          }
        }
        const r = radius(pressure);
        context.moveTo(x * width + r, y * height);
        context.arc(x * width, y * height, r, 0, 2 * Math.PI);
      }
      context.fill();
    }
    context.restore();
  }

  function create(dialog, { refit, sourceImage, currentPage }) {
    const bar = dialog.querySelector(".slide-ink-tools");
    const sheet = dialog.querySelector(".slide-ink-sheet");
    const canvas = sheet.querySelector("canvas");
    const preview = sheet.querySelector(".slide-ink-preview");
    const context = canvas.getContext("2d");
    const floating = preview.getContext("2d");
    const status = bar.querySelector("[role=status]");
    const surfaces = [...bar.querySelectorAll("[data-ink-surface]")];
    const tools = [...bar.querySelectorAll("[data-ink-tool]")];
    const undo = bar.querySelector("[data-ink-undo]");
    const redo = bar.querySelector("[data-ink-redo]");
    const remove = bar.querySelector("[data-ink-remove]");
    const output = bar.querySelector("[data-ink-export]");
    const palette = bar.querySelector("[data-ink-color]");
    const swatches = bar.querySelector("[data-ink-swatches]");
    const thickness = bar.querySelector("[data-ink-size]");
    const appearance = {
      pen: { color:"#24377d", size:"2", colors:[["深藍", "#24377d"], ["墨黑", "#19232d"], ["朱紅", "#bd352e"], ["青綠", "#17735c"], ["紫色", "#7f4ba9"]] },
      highlight: { color:"#ffd348", size:"7", colors:[["淺黃", "#ffd348"], ["蜜桃", "#ffab7b"], ["粉紅", "#f978b0"], ["淺綠", "#70d59d"], ["水藍", "#55bff3"]] }
    };
    const histories = new Map();
    let enabled = false, surface = "slide", tool = "pen", restoreVersion = restored;
    let pageKey, state, ready = false, active, frame, generation = 0;
    let selected = new Set();

    function actions() {
      undo.disabled = !ready || !state?.undo.length;
      redo.disabled = !ready || !state?.redo.length;
      remove.hidden = !selected.size;
      output.disabled = !ready || (surface === "slide" && sourceImage.hidden);
    }

    function paintSaved() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const stroke of state?.strokes ?? []) {
        if (active?.erased?.has(stroke) || (active?.tool === "move-selection" && selected.has(stroke))) continue;
        drawStroke(context, stroke, selected.has(stroke));
      }
      actions();
    }

    function paintPreview() {
      floating.clearRect(0, 0, preview.width, preview.height);
      if (!active?.points.length) return;
      if (active.tool === "lasso") {
        floating.save();
        trace(floating, active.points);
        floating.setLineDash([7, 5]);
        floating.strokeStyle = "#236dd2";
        floating.lineWidth = Math.max(2, preview.width * .002);
        floating.stroke();
        floating.restore();
      } else if (active.tool === "move-selection") {
        for (const stroke of selected) drawStroke(floating, shifted(stroke, active.delta), true);
      } else if (active.tool !== "erase") drawStroke(floating, active);
    }

    function renderSoon() {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => { frame = undefined; paintPreview(); });
    }

    function save() {
      const key = state.key, snapshot = state.strokes;
      memory.set(key, snapshot);
      status.textContent = "儲存中…";
      transact("readwrite", store => store.put(snapshot, key)).then(() => {
        if (memory.get(key) !== snapshot) return;
        memory.delete(key);
        if (state?.key === key) status.textContent = "已儲存在這台裝置";
      }).catch(() => {
        if (state?.key === key && memory.get(key) === snapshot) status.textContent = "這次可查看。儲存失敗，可下載圖片。";
      });
    }

    function update(strokes) {
      if (!state) return;
      state.undo.push(state.strokes);
      if (state.undo.length > 35) state.undo.shift();
      state.redo = [];
      state.strokes = strokes;
      selected.clear();
      paintSaved();
      save();
    }

    function changeHistory(from, to) {
      finish(active?.pointer);
      if (!state?.[from].length) return;
      state[to].push(state.strokes);
      state.strokes = state[from].pop();
      selected.clear();
      paintSaved();
      save();
    }

    function load() {
      if (restoreVersion !== restored) { histories.clear(); restoreVersion = restored; }
      const request = ++generation;
      const key = pageKey + "/" + surface;
      selected.clear();
      ready = false;
      state = undefined;
      paintSaved();
      status.textContent = "正在讀取手寫筆記…";
      const cached = histories.get(key);
      if (cached) return shown(cached);
      (memory.has(key) ? Promise.resolve(memory.get(key)) : transact("readonly", store => store.get(key))).then(strokes => {
        shown({ key, strokes:strokes ?? [], undo:[], redo:[] });
      }).catch(() => {
        shown({ key, strokes:[], undo:[], redo:[] });
        if (request === generation) status.textContent = "本次仍可手寫與下載圖片。";
      });
      function shown(snapshot) {
        if (!enabled || request !== generation) return;
        histories.delete(key);
        if (histories.size >= 24) histories.delete(histories.keys().next().value);
        histories.set(key, snapshot);
        state = snapshot;
        ready = true;
        status.textContent = "用筆書寫，手指移動或縮放";
        paintSaved();
      }
    }

    function changeSurface(next) {
      finish(active?.pointer);
      surface = next;
      sheet.classList.toggle("is-paper", surface === "paper");
      for (const button of surfaces) button.setAttribute("aria-pressed", String(button.dataset.inkSurface === surface));
      if (enabled && pageKey) load();
      refit(true);
    }

    function changeTool(next) {
      finish(active?.pointer);
      tool = next;
      dialog.dataset.inkTool = next;
      for (const button of tools) button.setAttribute("aria-pressed", String(button.dataset.inkTool === tool));
      if (next !== "lasso" && selected.size) { selected.clear(); paintSaved(); }
      palette.disabled = thickness.disabled = !appearance[next];
      if (appearance[next]) {
        palette.value = appearance[next].color;
        thickness.value = appearance[next].size;
      }
      showSwatches();
    }

    function showSwatches() {
      const style = appearance[tool];
      swatches.replaceChildren(...(style?.colors ?? []).map(([name, color]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.color = color;
        button.title = name;
        button.setAttribute("aria-label", name);
        button.style.setProperty("--swatch", color);
        return button;
      }));
      markColor();
    }

    function markColor() {
      for (const button of swatches.children) {
        button.setAttribute("aria-pressed", String(button.dataset.color === palette.value));
      }
    }

    function point(event, bounds) {
      const cap = number => Math.round(Math.max(0, Math.min(1, number)) * 10000) / 10000;
      const pressure = event.pointerType === "pen" && event.pressure > 0 ? event.pressure : .5;
      return [cap((event.clientX - bounds.left) / bounds.width), cap((event.clientY - bounds.top) / bounds.height), cap(pressure)];
    }

    function erase(point) {
      const ratio = canvas.height / canvas.width;
      for (const stroke of state.strokes) {
        if (active.erased.has(stroke)) continue;
        if (stroke.points.some((p, i) => nearLine(point, p, stroke.points[i + 1] ?? p, .014 + stroke.size / 2, ratio))) active.erased.add(stroke);
      }
      paintSaved();
    }

    function selectionBounds() {
      let left = 1, right = 0, top = 1, bottom = 0;
      for (const { points } of selected) for (const [x, y] of points) {
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
      return { left, right, top, bottom };
    }

    function shifted(stroke, [dx, dy]) {
      const unit = value => Math.round(Math.min(1, Math.max(0, value)) * 10000) / 10000;
      return { ...stroke, points:stroke.points.map(([x, y, force]) => [unit(x + dx), unit(y + dy), force]) };
    }

    function start(event) {
      if (!enabled || !ready || tool === "move" || event.pointerType === "touch" || event.button !== 0 || active ||
        (surface === "slide" && sourceImage.hidden)) return false;
      const bounds = sheet.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return false;
      const sample = point(event, bounds);
      if (tool === "lasso" && selected.size) {
        const limits = selectionBounds();
        const [x, y] = sample;
        if (x >= limits.left - .02 && x <= limits.right + .02 && y >= limits.top - .02 && y <= limits.bottom + .02) {
          active = { pointer:event.pointerId, tool:"move-selection", bounds, points:[sample], limits, delta:[0, 0] };
          paintSaved();
          renderSoon();
          return true;
        }
      }
      if (selected.size) { selected.clear(); paintSaved(); }
      const style = appearance[tool];
      active = { pointer:event.pointerId, tool, bounds, points:[sample] };
      if (style) Object.assign(active, { color:style.color, size:Number(style.size) / 620 });
      if (tool === "erase") { active.erased = new Set(); erase(sample); }
      else renderSoon();
      return true;
    }

    function move(event) {
      if (active?.pointer !== event.pointerId) return false;
      const events = event.getCoalescedEvents?.() ?? [];
      for (const sample of events.length ? events : [event]) {
        const p = point(sample, active.bounds);
        if (active.tool === "erase") erase(p);
        else if (active.tool === "move-selection") {
          const { left, right, top, bottom } = active.limits;
          const [x, y] = active.points[0];
          active.delta = [
            Math.max(-left, Math.min(1 - right, p[0] - x)),
            Math.max(-top, Math.min(1 - bottom, p[1] - y))
          ];
        }
        else if (distance(p, active.points.at(-1)) >= .0008 && active.points.length < 12000) active.points.push(p);
      }
      renderSoon();
      return true;
    }

    function finish(pointer) {
      if (!active || active.pointer !== pointer) return false;
      const stroke = active;
      active = undefined;
      if (stroke.tool === "erase") {
        if (stroke.erased.size) update(state.strokes.filter(item => !stroke.erased.has(item)));
        else paintSaved();
      } else if (stroke.tool === "lasso") {
        if (stroke.points.length > 2) selected = new Set(state.strokes.filter(item =>
          item.points.some(p => includesPoint(stroke.points, p))));
        paintSaved();
        status.textContent = selected.size ? "已選取 " + selected.size + " 筆，可拖曳移動" : "圈選範圍內沒有筆跡";
      } else if (stroke.tool === "move-selection") {
        if (Math.hypot(...stroke.delta) > .0008) {
          const moved = new Set();
          const strokes = state.strokes.map(item => {
            if (!selected.has(item)) return item;
            const next = shifted(item, stroke.delta);
            moved.add(next);
            return next;
          });
          update(strokes);
          selected = moved;
        }
        paintSaved();
      } else update([...state.strokes, { tool:stroke.tool, color:stroke.color, size:stroke.size, points:stroke.points }]);
      paintPreview();
      return true;
    }

    function exportPage() {
      if (!state || !ready) return;
      finish(active?.pointer);
      const snapshot = document.createElement("canvas");
      snapshot.width = surface === "paper" ? 1600 : Math.min(2400, sourceImage.naturalWidth);
      snapshot.height = Math.round(snapshot.width * canvas.height / canvas.width);
      const target = snapshot.getContext("2d");
      target.fillStyle = "#fffdf8";
      target.fillRect(0, 0, snapshot.width, snapshot.height);
      if (surface === "slide") target.drawImage(sourceImage, 0, 0, snapshot.width, snapshot.height);
      else {
        const cell = snapshot.width / 32;
        target.beginPath();
        for (let x = cell; x < snapshot.width; x += cell) {
          target.moveTo(x, 0);
          target.lineTo(x, snapshot.height);
        }
        for (let y = cell; y < snapshot.height; y += cell) {
          target.moveTo(0, y);
          target.lineTo(snapshot.width, y);
        }
        target.strokeStyle = "#d4deea66";
        target.lineWidth = 1.5;
        target.stroke();
      }
      for (const stroke of state.strokes) drawStroke(target, stroke);
      const label = "p." + currentPage() + (surface === "paper" ? "-手寫筆記" : "-投影片批註");
      snapshot.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = label + ".png";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }, "image/png");
    }

    for (const button of surfaces) button.addEventListener("click", () => {
      if (button.dataset.inkSurface !== surface) changeSurface(button.dataset.inkSurface);
    });
    for (const button of tools) button.addEventListener("click", () => changeTool(button.dataset.inkTool));
    palette.addEventListener("input", () => {
      if (appearance[tool]) appearance[tool].color = palette.value;
      markColor();
    });
    swatches.addEventListener("click", event => {
      const { color } = event.target.dataset;
      if (!color) return;
      palette.value = appearance[tool].color = color;
      markColor();
    });
    thickness.addEventListener("change", () => { if (appearance[tool]) appearance[tool].size = thickness.value; });
    undo.addEventListener("click", () => changeHistory("undo", "redo"));
    redo.addEventListener("click", () => changeHistory("redo", "undo"));
    remove.addEventListener("click", () => update(state.strokes.filter(stroke => !selected.has(stroke))));
    output.addEventListener("click", exportPage);
    bar.querySelector("details").addEventListener("toggle", () => refit());
    dialog.addEventListener("keydown", event => {
      if (!enabled || !(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== "z" ||
        event.target.matches("input, textarea, select")) return;
      event.preventDefault();
      if (event.shiftKey) changeHistory("redo", "undo");
      else changeHistory("undo", "redo");
    });

    return {
      get enabled() { return enabled; },
      get isDrawing() { return Boolean(active); },
      get paper() { return enabled && surface === "paper"; },
      get navigation() { return !enabled || tool === "move"; },
      setPage(key) {
        finish(active?.pointer);
        pageKey = key;
        if (enabled) load();
      },
      setEnabled(next) {
        finish(active?.pointer);
        enabled = next;
        dialog.toggleAttribute("data-inking", next);
        bar.hidden = sheet.hidden = !next;
        if (next) {
          changeTool(tool);
          changeSurface(surface);
        } else {
          ++generation;
          state = undefined;
          ready = false;
          sheet.classList.remove("is-paper");
        }
      },
      layout(width, height, transform) {
        if (!enabled || !width || !height) return;
        sheet.style.width = width + "px";
        sheet.style.height = height + "px";
        sheet.style.transform = transform;
        const ratio = Math.min(2.5, devicePixelRatio || 1);
        const pixels = Math.max(1, Math.round(width * ratio));
        const rows = Math.max(1, Math.round(height * ratio));
        if (canvas.width !== pixels || canvas.height !== rows) {
          canvas.width = preview.width = pixels;
          canvas.height = preview.height = rows;
          paintSaved();
          renderSoon();
        } else actions();
      },
      start, move, finish
    };
  }

  return { create, exportSheets, validateSheets, restoreSheets };
})();
