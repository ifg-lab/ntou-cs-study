"use strict";

const StudyEmoji = (() => {
  const shortcuts = ["👍", "❤️", "😂", "✅", "💡"];
  const base = "https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/";
  const paths = ["2D/svg", "third_party/region-flags/waved-svg", "3D/png/72"];
  const font = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const tones = ["🏻", "🏼", "🏽", "🏾", "🏿"];
  const support = new Map();
  let data, context, byEmoji, missing;

  async function load() {
    data ??= fetch("assets/emoji/catalog.json?v=18").then(response => {
      if (!response.ok) throw new Error("表情清單暫時無法載入。");
      return response.json();
    }).then(groups => {
      byEmoji = new Map(groups.flatMap(([, rows]) => rows.map(row => [row[0], row])));
      return groups;
    }).catch(error => { data = null; throw error; });
    return data;
  }

  function fingerprint(value) {
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
    context.fillText(value, 2, 2);
    const pixels = new Uint32Array(context.getImageData(0, 0, width, height).data.buffer);
    let hash = 2166136261;
    for (const pixel of pixels) hash = Math.imul(hash ^ pixel, 16777619);
    return hash;
  }

  function native(emoji) {
    if (!support.has(emoji)) {
      try {
        if (!context) {
          const canvas = document.createElement("canvas");
          canvas.width = 180;
          canvas.height = 44;
          context = canvas.getContext("2d", { willReadFrequently: true });
          context.font = "32px " + font;
          context.textBaseline = "top";
          missing = fingerprint("\u{10FFFF}");
        }
        const glyphs = [...emoji.replace(/[\uFE0F\u200D]/g, "")];
        const hasParts = /[\u200D\u20E3\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}]/u.test(emoji);
        const separated = hasParts && glyphs.length > 1 && fingerprint(emoji) === fingerprint(glyphs.join("\u200B"));
        support.set(emoji, !separated && fingerprint(emoji) !== missing);
      } catch { support.set(emoji, false); }
    }
    return support.get(emoji);
  }

  function name(emoji) { return byEmoji?.get(emoji)?.[1] ?? emoji; }

  function paint(root) {
    const icons = [...root.querySelectorAll("[data-emoji-icon]")].filter(icon => !icon.dataset.emojiReady);
    for (const icon of icons) {
      icon.dataset.emojiReady = "true";
      const emoji = icon.dataset.emojiIcon;
      if (native(emoji)) continue;
      load().then(() => {
        const variant = byEmoji.get(emoji)?.[4];
        if (!icon.isConnected || !paths[variant]) return;
        const code = [...emoji.replace(/\uFE0F/g, "")].map(value => value.codePointAt(0).toString(16).padStart(4, "0")).join("_");
        const image = new Image();
        image.alt = "";
        image.width = image.height = 24;
        image.decoding = "async";
        image.referrerPolicy = "no-referrer";
        image.onload = () => icon.replaceChildren(image);
        image.src = base + paths[variant] + "/emoji_u" + code + (variant === 2 ? ".png" : ".svg");
      }).catch(() => {});
    }
  }

  function markup(emoji, escape) {
    return '<span class="emoji-icon" aria-hidden="true" data-emoji-icon="' + escape(emoji) + '">' + escape(emoji) + "</span>";
  }

  function ranked(usage) {
    return [...usage.values()].filter(item => item.uses > 0).sort((a, b) =>
      b.uses - a.uses || Date.parse(b.last_used) - Date.parse(a.last_used) || a.emoji.localeCompare(b.emoji));
  }

  function quick(usage) {
    return [...new Set([...ranked(usage).map(item => item.emoji), ...shortcuts])].slice(0, shortcuts.length);
  }

  const shadesOf = emoji => [...emoji].filter(char => tones.includes(char));
  const family = emoji => emoji.replace(/[\uFE0F\u{1F3FB}-\u{1F3FF}]/gu, "");
  const toneOptions = [["", "預設黃色"], ["🏻", "淺膚色"], ["🏼", "中淺膚色"], ["🏽", "中等膚色"],
    ["🏾", "中深膚色"], ["🏿", "深膚色"], ["all", "所有膚色"]];

  function tonePreference(accountId, value) {
    try {
      const key = "ntou-cs-study:emoji-tone:" + accountId;
      if (value !== undefined) localStorage.setItem(key, value);
      const stored = localStorage.getItem(key);
      return toneOptions.some(([tone]) => tone === stored) ? stored : "";
    } catch { return value ?? ""; }
  }

  async function picker(root, { escape, selected, choose, active, favorites = [], preferenceKey }) {
    root.innerHTML = '<p role="status">正在載入表情…</p>';
    let groups;
    try { groups = await load(); }
    catch {
      if (!active()) return;
      root.innerHTML = '<p role="status">表情清單暫時無法載入。</p><button type="button" class="btn secondary">重試</button>';
      root.querySelector("button").addEventListener("click", () => picker(root, { escape, selected, choose, active, favorites, preferenceKey }));
      return;
    }
    if (!active()) return;
    const variants = new Map(), neutral = new Map();
    for (const row of byEmoji.values()) {
      const shades = shadesOf(row[0]);
      if (!shades.length) neutral.set(family(row[0]), row);
      if (shades.length && shades.every(shade => shade === shades[0])) variants.set(family(row[0]) + shades[0], row);
    }
    let tone = tonePreference(preferenceKey);
    let paintObserver;
    root.innerHTML = '<div class="emoji-picker"><label class="emoji-search">搜尋表情<input type="search" class="field" name="emoji-query" placeholder="輸入中文、英文或表情"></label>' +
      '<div class="emoji-picker-filters"><label>分類<select name="emoji-category"><option value="all">全部分類</option>' +
      groups.map(([label], index) => '<option value="' + index + '">' + escape(label) + "</option>").join("") +
      '</select></label><fieldset class="emoji-tone"><legend>膚色</legend><div>' +
      toneOptions.map(([value, label]) => '<button type="button" data-emoji-tone="' + value + '" title="' + label +
        '" aria-label="' + label + '" aria-pressed="' + (value === tone) + '">' + (value === "all" ? '<span>全部</span>' :
          markup("👍" + value, escape)) + "</button>").join("") + '</div><p data-tone-name></p></fieldset></div>' +
      '<p class="emoji-found" role="status"></p><div class="emoji-scroll" tabindex="0" aria-label="表情清單"></div>' +
      '<p class="emoji-credits">表情備用圖示來自 <a href="https://github.com/googlefonts/noto-emoji" target="_blank" rel="noopener noreferrer">Noto Emoji</a>。</p></div>';
    const query = root.querySelector('[name="emoji-query"]');
    const category = root.querySelector('[name="emoji-category"]');
    const scroll = root.querySelector(".emoji-scroll");
    const toneLabel = root.querySelector("[data-tone-name]");
    root.closest("dialog")?.addEventListener("close", () => paintObserver?.disconnect(), { once: true });

    function button([emoji, label]) {
      return '<button type="button" data-pick-emoji="' + escape(emoji) + '" title="' + escape(label) +
        '" aria-label="' + escape(label) + '" aria-pressed="' + selected(emoji) + '">' + markup(emoji, escape) + "</button>";
    }

    function grid(label, rows, empty = "") {
      return '<section class="emoji-category"><h3>' + escape(label) + '</h3>' + (rows.length ?
        '<div class="emoji-grid">' + rows.map(button).join("") + "</div>" : '<p class="emoji-empty">' + empty + '</p>') + '</section>';
    }

    function render() {
      paintObserver?.disconnect();
      const needle = query.value.normalize("NFKC").toLowerCase().trim();
      const words = needle.split(/\s+/).filter(Boolean);
      const searchable = ([emoji, zh, en, tags]) => [emoji, zh, en, tags].join(" ").toLowerCase();
      const chosenGroup = category.value === "all" ? groups : [groups[Number(category.value)]];
      const result = needle ? groups : chosenGroup;
      const exact = byEmoji.get(needle);
      let count = 0;
      const html = exact ? (count = 1, grid("搜尋結果", [exact])) : result.map(([label, rows]) => {
        const display = tone === "all" ? rows : rows.filter(([emoji]) => !shadesOf(emoji).length)
          .map(row => variants.get(family(row[0]) + tone) ?? row);
        const matches = needle ? display.filter(row => {
          const base = neutral.get(family(row[0])) ?? row;
          const text = searchable(row) + " " + searchable(base);
          return words.every(word => text.includes(word));
        }) : display;
        count += matches.length;
        return matches.length ? grid(label, matches) : "";
      }).join("");
      const frequent = !needle ? grid("常用表情", favorites.map(emoji => byEmoji.get(emoji)).filter(Boolean),
        "你加過的表情反應會出現在這裡。") : "";
      scroll.innerHTML = frequent + html;
      scroll.scrollTop = 0;
      root.querySelector(".emoji-found").textContent = count ? "共 " + count + " 個表情" : "找不到符合的表情。";
      toneLabel.textContent = toneOptions.find(([value]) => value === tone)?.[1] ?? "";
      if (typeof IntersectionObserver !== "function") { paint(scroll); return; }
      paintObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !active()) continue;
          paint(entry.target);
          paintObserver.unobserve(entry.target);
        }
      }, { root: scroll, rootMargin: "160px" });
      for (const cell of scroll.querySelectorAll("[data-pick-emoji]")) paintObserver.observe(cell);
    }

    query.addEventListener("input", render);
    category.addEventListener("change", () => { query.value = ""; render(); });
    root.querySelector(".emoji-tone").addEventListener("click", event => {
      const control = event.target.closest("[data-emoji-tone]");
      if (!control) return;
      tone = tonePreference(preferenceKey, control.dataset.emojiTone);
      for (const option of root.querySelectorAll("[data-emoji-tone]")) option.setAttribute("aria-pressed", String(option === control));
      render();
    });
    scroll.addEventListener("click", event => {
      const choice = event.target.closest("[data-pick-emoji]");
      if (choice) choose(choice.dataset.pickEmoji);
    });
    paint(root.querySelector(".emoji-tone"));
    render();
    if (matchMedia("(pointer: fine)").matches) query.focus();
  }

  return { quick, ranked, markup, paint, picker, name };
})();
