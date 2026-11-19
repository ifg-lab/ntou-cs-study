"use strict";

const StudySlideViewer = (() => {
  const dialog = document.querySelector("#slide-viewer");
  const stage = dialog.querySelector(".slide-viewer-stage");
  const image = stage.querySelector("img");
  const title = dialog.querySelector("h2");
  const status = stage.querySelector("[role=status]");
  const original = dialog.querySelector("#slide-viewer-original");
  const fitButton = dialog.querySelector('[data-viewer-zoom="fit"]');
  const out = dialog.querySelector('[data-viewer-zoom="out"]');
  const zoomIn = dialog.querySelector('[data-viewer-zoom="in"]');
  const points = new Map();
  const levels = { min: 1, max: 6 };
  let width = 0, height = 0, scale = 1, x = 0, y = 0;
  let opener;
  let textLayer, textRequest;
  const onText = event => event.target.closest(".slide-text-layer span");

  function clearText() {
    textRequest = undefined;
    textLayer?.remove();
    textLayer = undefined;
    stage.removeAttribute("data-selecting");
    stage.setAttribute("aria-label", "投影片，可縮放與移動");
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function paint() {
    const limitX = Math.max(0, (width * scale - stage.clientWidth) / 2);
    const limitY = Math.max(0, (height * scale - stage.clientHeight) / 2);
    x = clamp(x, -limitX, limitX);
    y = clamp(y, -limitY, limitY);
    image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    if (textLayer) textLayer.style.transform = image.style.transform;
    const percent = Math.round(scale * 100);
    stage.dataset.zoomed = String(scale > 1);
    fitButton.textContent = scale === 1 ? "符合畫面" : `${percent}% · 重設`;
    fitButton.disabled = image.hidden || scale === 1;
    out.disabled = image.hidden || scale <= levels.min;
    zoomIn.disabled = image.hidden || scale >= levels.max;
  }

  function fit() {
    const ratio = Math.min(stage.clientWidth / image.naturalWidth, stage.clientHeight / image.naturalHeight);
    width = image.naturalWidth * ratio;
    height = image.naturalHeight * ratio;
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    if (textLayer) {
      textLayer.style.width = image.style.width;
      textLayer.style.height = image.style.height;
    }
    paint();
  }

  function zoom(next, from = { x: 0, y: 0 }, to = from) {
    const updated = clamp(next, levels.min, levels.max);
    const ratio = updated / scale;
    x = to.x - (from.x - x) * ratio;
    y = to.y - (from.y - y) * ratio;
    scale = updated;
    paint();
  }

  function point(event) {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 };
  }

  const middle = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  stage.addEventListener("pointerdown", event => {
    if (image.hidden || onText(event) || points.size >= 2 || event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    points.set(event.pointerId, point(event));
  });
  stage.addEventListener("pointermove", event => {
    const previous = points.get(event.pointerId);
    if (!previous) return;
    const current = point(event);
    const other = [...points].find(([id]) => id !== event.pointerId)?.[1];
    points.set(event.pointerId, current);
    if (other) {
      const oldDistance = distance(previous, other);
      if (oldDistance > 0) zoom(scale * distance(current, other) / oldDistance, middle(previous, other), middle(current, other));
    } else if (scale > 1) {
      x += current.x - previous.x;
      y += current.y - previous.y;
      paint();
    }
  });
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
    stage.addEventListener(name, event => points.delete(event.pointerId));
  }
  stage.addEventListener("dblclick", event => {
    if (!image.hidden && !onText(event)) zoom(scale === 1 ? 2 : 1, point(event));
  });
  stage.addEventListener("wheel", event => {
    if (!event.ctrlKey || image.hidden) return;
    event.preventDefault();
    zoom(scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12), point(event));
  }, { passive: false });
  stage.addEventListener("keydown", event => {
    const selection = window.getSelection();
    if (image.hidden || (selection && !selection.isCollapsed && textLayer?.contains(selection.anchorNode))) return;
    const moves = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] };
    if (Object.hasOwn(moves, event.key)) {
      x += moves[event.key][0];
      y += moves[event.key][1];
      paint();
    } else if (event.key === "+" || event.key === "=") zoom(scale * 1.5);
    else if (event.key === "-") zoom(scale / 1.5);
    else if (event.key === "0") zoom(1);
    else return;
    event.preventDefault();
  });

  zoomIn.addEventListener("click", () => zoom(scale * 1.5));
  out.addEventListener("click", () => zoom(scale / 1.5));
  fitButton.addEventListener("click", () => zoom(1));
  const resize = () => { if (dialog.open && !image.hidden) fit(); };
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener("resize", resize);
  image.addEventListener("load", () => {
    if (!dialog.open) return;
    image.hidden = false;
    status.textContent = "";
    fit();
    if (textLayer) textLayer.hidden = false;
  });
  image.addEventListener("error", () => {
    if (dialog.open) status.textContent = "投影片載入失敗。可點「原圖」重新開啟。";
  });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    points.clear();
    clearText();
    image.removeAttribute("src");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });

  return {
    open(source, control) {
      if (dialog.open) return;
      clearText();
      points.clear();
      opener = control;
      x = y = width = height = 0;
      scale = 1;
      title.textContent = source.alt;
      image.alt = source.alt;
      image.hidden = true;
      status.textContent = "正在載入投影片…";
      original.href = source.dataset.slideSrc;
      const textKey = source.dataset.slideText;
      if (textKey) {
        const request = StudySlideText.create(textKey);
        textRequest = request;
        request.then(layer => {
          if (!dialog.open || textRequest !== request || !layer) return;
          textLayer = layer;
          textLayer.hidden = image.hidden;
          stage.append(layer);
          stage.dataset.selecting = "true";
          stage.setAttribute("aria-label", "投影片，可選取文字、縮放與移動");
          if (!image.hidden) fit();
        });
      }
      dialog.showModal();
      paint();
      image.src = original.href;
    },
    close() { if (dialog.open) dialog.close(); }
  };
})();
