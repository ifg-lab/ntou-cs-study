"use strict";

const StudyPreferences = (() => {
  const key = "ntou-cs-study-preferences";
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 791px)");
  const themes = {
    paper: ["課本米白", false, "#f5f1e8", "#fffdf9", "#152831", "#8d3529", "#f3e6d1"],
    ocean: ["海洋藍", false, "#eef5f8", "#fcfeff", "#183b55", "#215e89", "#d9eaf3"],
    forest: ["森林綠", false, "#eef4eb", "#fcfef9", "#203e32", "#306345", "#dce9d8"],
    coffee: ["奶油咖啡", false, "#f7efe4", "#fffbf5", "#44342c", "#7c4c31", "#f0dfca"],
    lavender: ["薰衣草", false, "#f3eff8", "#fefbff", "#392f52", "#65468b", "#e9dff2"],
    midnight: ["午夜藍", true, "#101a29", "#19273b", "#0d1725", "#90cdf1", "#223650"],
    amber: ["炭黑琥珀", true, "#171719", "#232326", "#111113", "#f4c671", "#35312a"],
    pine: ["深松綠", true, "#101d19", "#192a23", "#0c1915", "#a0dfbc", "#253b30"],
    plum: ["暗紫", true, "#1c1726", "#2a2236", "#171222", "#d6b6fa", "#3b2e4c"],
    contrastLight: ["高對比淺色", false, "#ffffff", "#ffffff", "#111827", "#123686", "#e8eef9"],
    contrastDark: ["高對比深色", true, "#08090b", "#13151a", "#08090b", "#ffe081", "#282c34"]
  };
  const accents = {
    theme: ["主題預設"], brick: ["磚紅", "#91362b", "#f3a693"], blue: ["海藍", "#215e89", "#94d1f7"],
    green: ["松綠", "#2e664d", "#a3dfba"], gold: ["琥珀", "#7a4e08", "#f4c671"],
    violet: ["紫羅蘭", "#67459a", "#d9baff"], pink: ["莓紅", "#92365f", "#f4a8d0"]
  };
  const displayModes = { auto: "依裝置", single: "一次一題", list: "列表" };
  const groups = [
    ["外觀", [
      ["theme", "主題", { system: "跟隨系統", ...Object.fromEntries(Object.entries(themes).map(([id, palette]) => [id, palette[0]])) }],
      ["accent", "強調色", Object.fromEntries(Object.entries(accents).map(([id, [label]]) => [id, label]))]
    ]],
    ["閱讀", [
      ["slides", "原投影片", { auto: "依裝置", open: "每頁展開", closed: "每頁收合" }, "依裝置時，桌面展開，手機收合。"],
      ["size", "正文字級", { standard: "標準", large: "大", extra: "特大" }],
      ["spacing", "正文行距", { standard: "標準", relaxed: "寬鬆", compact: "緊湊" }],
      ["width", "閱讀欄寬度", { standard: "標準", narrow: "窄", wide: "寬" }],
      ["sidebar", "桌面章節側欄", { expanded: "展開", collapsed: "收合" }],
      ["layout", "原圖與解說", { auto: "寬螢幕並排", stacked: "上下排列" }],
      ["examWriting", "考場寫法", { visible: "直接顯示", recall: "先想再看" }]
    ]],
    ["練習與動態", [
      ["practice", "選擇題顯示", displayModes],
      ["exam", "模擬小考顯示", displayModes],
      ["sound", "答對音效", { off: "關閉", on: "開啟" }],
      ["volume", "音效音量", { 60: "標準", 30: "低", 100: "高" }],
      ["confetti", "答對彩帶", { system: "依系統", off: "關閉" }],
      ["motion", "互動動畫", { system: "依系統", reduced: "減少動態" }]
    ]]
  ];
  const defaults = {
    theme: "paper", accent: "theme", slides: "auto", size: "standard", spacing: "standard", width: "standard",
    sidebar: "expanded", layout: "auto", examWriting: "visible",
    practice: "auto", exam: "auto", sound: "off", volume: "60", confetti: "system", motion: "system"
  };
  const choices = new Map(groups.flatMap(([, fields]) => fields).map(([name, , options]) => [name, options]));
  const dialog = document.querySelector("#preferences-dialog");
  const status = document.querySelector("#preferences-status");
  let values = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    for (const [name, options] of choices) {
      if (typeof saved?.[name] === "string" && Object.hasOwn(options, saved[name])) values[name] = saved[name];
    }
    if (!saved?.sound && localStorage.getItem("ntou-cs-study-sound") === "on") values.sound = "on";
  } catch {
    // The settings remain usable when storage is unavailable.
  }

  function applyAppearance() {
    const root = document.documentElement;
    const theme = values.theme === "system" ? (dark.matches ? "midnight" : "paper") : values.theme;
    const [, night, paper, surface, navy, accent, panel] = themes[theme];
    const customAccent = accents[values.accent][night ? 2 : 1] ?? accent;
    root.dataset.scheme = night ? "dark" : "light";
    root.dataset.contrast = String(theme.startsWith("contrast"));
    for (const name of ["size", "spacing", "width", "layout"]) root.dataset[name] = values[name];
    root.dataset.reduceMotion = String(motionReduced());
    for (const [name, color] of Object.entries({ paper, white: surface, navy, accent: customAccent, panel })) {
      root.style.setProperty(`--${name}`, color);
    }
    document.querySelector('meta[name="theme-color"]').content = paper;
    const swatches = [paper, surface, navy, customAccent];
    dialog.querySelectorAll(".preference-swatches i").forEach((chip, index) => { chip.style.background = swatches[index]; });
  }

  function syncControls() {
    for (const field of dialog.querySelectorAll("select[data-preference]")) field.value = values[field.dataset.preference];
    dialog.querySelector('[data-preference="volume"]').disabled = values.sound === "off";
  }

  function save(name) {
    applyAppearance();
    syncControls();
    try {
      localStorage.setItem(key, JSON.stringify(values));
      status.textContent = name ? "已儲存" : "已恢復預設";
    } catch {
      status.textContent = "本次瀏覽已套用。此瀏覽器無法儲存偏好。";
    }
    document.dispatchEvent(new CustomEvent("study-preferences", { detail: name }));
  }

  function set(name, value) {
    const options = choices.get(name);
    if (!options || !Object.hasOwn(options, value) || values[name] === value) return;
    values[name] = value;
    save(name);
  }

  function motionReduced() {
    return values.motion === "reduced" || reduced.matches;
  }

  function slidesOpen() {
    return values.slides === "open" || (values.slides === "auto" && desktop.matches);
  }

  const swatchMarkup = '<div class="preference-swatches" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
  dialog.querySelector("#preferences-fields").innerHTML = groups.map(([title, fields], index) => `
    <fieldset class="preference-group"><legend>${title}</legend>
    ${fields.map(([name, label, options, hint]) => `<label class="preference-row">
      <span>${label}${hint ? `<small>${hint}</small>` : ""}</span>
      <select data-preference="${name}">${Object.entries(options).map(([value, text]) =>
        `<option value="${value}">${text}</option>`).join("")}</select>
    </label>`).join("")}${index === 0 ? swatchMarkup : ""}</fieldset>`).join("");
  syncControls();
  applyAppearance();
  dialog.addEventListener("change", event => {
    const field = event.target;
    if (field.matches("select[data-preference]")) set(field.dataset.preference, field.value);
  });
  dialog.querySelector("#preferences-reset").addEventListener("click", () => {
    values = { ...defaults };
    save();
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-open-preferences]") && !dialog.open) {
      status.textContent = "";
      syncControls();
      dialog.showModal();
    }
  });
  dark.addEventListener("change", applyAppearance);
  reduced.addEventListener("change", applyAppearance);
  desktop.addEventListener("change", () => {
    if (values.slides === "auto") document.dispatchEvent(new CustomEvent("study-preferences", { detail: "slides" }));
  });

  return { get: name => values[name], set, slidesOpen, motionReduced };
})();
