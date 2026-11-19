"use strict";

const StudySlideText = (() => {
  const slides = {
    "lecture-05/53": {
      width: 720,
      height: 540,
      // Each line uses the PDF's left edge, baseline, width, and font size.
      lines: [
        [101.35, 100.61, 230.53, 32.04, "Cloud Computing"],
        [120.79, 148.22, 304.79, 21.96, "Cloud computing is Internet-based"],
        [120.79, 171.98, 337.56, 21.98, "computing, whereby shared resources,"],
        [120.79, 195.77, 343.98, 21.96, "software, and information are provided"],
        [120.79, 219.53, 300.92, 21.96, "to computers and other devices on"],
        [120.79, 243.29, 285.90, 21.96, "demand, like the electricity grid."],
        [120.79, 281.09, 285.20, 21.98, "A Cloud is a type of parallel and"],
        [120.79, 304.87, 294.15, 21.96, "distributed system consisting of a"],
        [120.79, 328.63, 282.74, 21.96, "collection of interconnected and"],
        [120.79, 352.39, 261.87, 21.96, "virtualized computers that are"],
        [120.79, 376.15, 344.88, 21.96, "dynamically provisioned and presented"],
        [120.79, 399.91, 297.34, 21.96, "as one or more unified computing"],
        [120.79, 423.67, 283.73, 21.98, "resources based on service-level"],
        [120.79, 447.46, 277.22, 21.96, "agreements established through"],
        [120.79, 471.22, 277.73, 21.96, "negotiation between the service"],
        [120.79, 494.98, 216.59, 21.96, "provider and consumers."],
        [567.2, 384.9, 50, 14, "CLOUD", "Arial"],
        [553.1, 397.4, 77, 12, "COMPUTING", "Arial"],
        [655.42, 522.6, 9.34, 8.04, "53", "Arial"]
      ],
      paragraphs: [0, 1, 6, 16, 18]
    }
  };
  const measure = document.createElement("canvas").getContext("2d");

  function create(key) {
    const slide = slides[key];
    const layer = document.createElement("div");
    layer.className = "slide-text-layer";
    layer.lang = "en";
    layer.hidden = true;
    for (const [x, y, width, size, text, font = "Times New Roman"] of slide.lines) {
      const line = document.createElement("span");
      measure.font = `${size}px "${font}", ${font === "Arial" ? "sans-serif" : "serif"}`;
      const { width: measured, fontBoundingBoxAscent: ascent, fontBoundingBoxDescent: descent } = measure.measureText(text);
      const baseline = Number.isFinite(ascent + descent) ? (size + ascent - descent) / 2 : size * .84;
      line.style.fontFamily = `"${font}", ${font === "Arial" ? "sans-serif" : "serif"}`;
      line.style.fontSize = `${size / slide.width * 100}cqw`;
      line.style.top = `${(y - baseline) / slide.height * 100}%`;
      line.style.left = `${x / slide.width * 100}%`;
      line.style.transform = `scaleX(${width / measured})`;
      line.textContent = text;
      layer.append(line);
    }
    return layer;
  }

  function plainText(key) {
    const { lines, paragraphs } = slides[key];
    return paragraphs.map((start, index) =>
      lines.slice(start, paragraphs[index + 1]).map(line => line[4]).join(" ")).join("\n\n") + "\n";
  }

  function actions(key, filename) {
    const group = document.createElement("span");
    const copy = document.createElement("button");
    const download = document.createElement("a");
    const status = document.createElement("span");
    group.className = "slide-text-actions";
    group.hidden = true;
    copy.className = download.className = "utility";
    copy.type = "button";
    copy.textContent = "複製整頁";
    download.textContent = "下載文字檔";
    download.download = filename;
    const text = plainText(key);
    download.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
    status.setAttribute("role", "status");
    status.className = "slide-text-copy-status";
    copy.addEventListener("click", async () => {
      status.textContent = "";
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = "已複製";
      } catch {
        status.textContent = "無法存取剪貼簿，可手動選取或下載文字檔。";
      }
    });
    group.append(copy, download, status);
    return group;
  }

  return { available: key => Object.hasOwn(slides, key), create, actions };
})();
