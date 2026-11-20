"use strict";

const StudySlideText = (() => {
  const chapters = new Map();
  const measure = document.createElement("canvas").getContext("2d");
  const fonts = {
    times: '"Times New Roman", serif',
    arial: 'Arial, sans-serif',
    chinese: '"Microsoft JhengHei UI", "Noto Sans TC", sans-serif',
    mono: '"Lucida Console", Consolas, monospace',
    courier: '"Courier New", monospace',
    consolas: 'Consolas, monospace',
    math: '"Cambria Math", "Times New Roman", serif'
  };

  function read(chapter) {
    if (!chapters.has(chapter)) {
      const version = chapter === "lecture-02" ? "hamming-tables" : "1";
      const request = fetch("assets/" + chapter + "/slide-text.json?v=" + version).then(response => {
        if (!response.ok) throw new Error("Slide text unavailable");
        return response.json();
      }).catch(() => {
        chapters.delete(chapter);
        return null;
      });
      chapters.set(chapter, request);
    }
    return chapters.get(chapter);
  }

  async function create(key) {
    const [chapter, page] = key.split("/");
    const data = await read(chapter);
    const lines = data?.pages?.[page];
    if (!lines?.length) return null;

    const layer = document.createElement("div");
    layer.className = "slide-text-layer";
    const folios = lines.filter(([x, y, , , text]) => x >= data.width * .85 &&
      y >= data.height * .93 && /^[1-9]\d{0,2}$/.test(text));
    if (folios.length === 1 && folios[0][4] !== page) layer.dataset.sourceFolio = folios[0][4];
    for (const [x, y, width, size, text, font, weight, angle = 0] of lines) {
      const line = document.createElement("span");
      const family = fonts[font] || fonts.times;
      const style = weight & 2 ? "italic" : "normal";
      const bold = weight & 1 ? "700" : "400";
      measure.font = style + " " + bold + " " + size + "px " + family;
      const { width: measured, fontBoundingBoxAscent: ascent, fontBoundingBoxDescent: descent } = measure.measureText(text);
      if (!measured) continue;

      const baseline = Number.isFinite(ascent + descent) ? (size + ascent - descent) / 2 : size * .84;
      const radians = angle * Math.PI / 180;
      line.style.fontFamily = family;
      line.style.fontSize = (size / data.width * 100) + "cqw";
      line.style.fontStyle = style;
      line.style.fontWeight = bold;
      line.style.left = ((x + baseline * Math.sin(radians)) / data.width * 100) + "%";
      line.style.top = ((y - baseline * Math.cos(radians)) / data.height * 100) + "%";
      line.style.transform = "rotate(" + angle + "deg) scaleX(" + (width / measured) + ")";
      line.lang = /\p{Script=Han}/u.test(text) ? "zh-Hant" : "en";
      line.textContent = text;
      layer.append(line);
    }
    return layer;
  }

  return { create };
})();
