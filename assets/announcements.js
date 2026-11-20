"use strict";

(() => {
  const compose = document.querySelector("#announcement-compose");
  const endpoint = compose.dataset.endpoint;
  const launch = document.querySelector("#open-announcement");
  const banner = document.querySelector("#study-announcement");
  const siteSlot = banner.parentElement;
  const rail = banner.querySelector(".announcement-rail");
  const animatedText = banner.querySelector(".announcement-text");
  const staticText = banner.querySelector(".announcement-static");
  const meter = banner.querySelector(".announcement-progress");
  const live = banner.querySelector("#announcement-live");
  const pause = banner.querySelector(".announcement-pause");
  const dismiss = banner.querySelector(".announcement-dismiss");
  const form = document.querySelector("#announcement-form");
  const message = form.elements.message;
  const code = form.elements.code;
  const submit = form.querySelector("[type='submit']");
  const preview = form.querySelector(".announcement-preview");
  const count = form.querySelector("#announcement-count");
  const status = document.querySelector("#announcement-status");
  const storageKey = "ntou-study-announcements-seen";
  const idPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
  const codePattern = /^[\w-]{22,128}$/;
  const queue = new Map();
  const seen = new Map();
  let current, animation, meterAnimation, staticTimer, fetchTimer, priorFocus, attempt;
  let previousWidth, previousTextWidth;
  let userPaused = false, waiting = false, fetching = false, lastFetch = 0;

  if (!endpoint || !/^https?:$/.test(location.protocol)) return;

  function syncHeaderSpace() {
    const height = !banner.hidden && banner.parentElement === siteSlot ? banner.offsetHeight : 0;
    document.documentElement.style.setProperty("--announcement-height", height ? `${height}px` : "0px");
  }

  function placeBanner() {
    if (!current) return;
    const modal = document.activeElement?.closest("dialog:modal") ??
      [...document.querySelectorAll("dialog:modal")].at(-1);
    const slot = modal?.querySelector(":scope > [data-announcement-slot]");
    const parent = slot ?? modal ?? siteSlot;
    if (banner.parentElement !== parent) parent.prepend(banner);
    banner.classList.toggle("announcement-overlay", Boolean(modal && !slot));
    syncHeaderSpace();
  }

  function claim(entry) {
    const remember = () => {
      if (seen.has(entry.id) || entry.expires <= Date.now()) return false;
      try {
        const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const recent = new Map(Array.isArray(raw) ? raw.filter(row => Array.isArray(row) &&
          idPattern.test(row[0]) && Number.isFinite(row[1]) && row[1] > Date.now()) : []);
        if (recent.has(entry.id)) { seen.set(entry.id, entry.expires); return false; }
        recent.set(entry.id, entry.expires);
        localStorage.setItem(storageKey, JSON.stringify([...recent].slice(-32)));
      } catch {}
      seen.set(entry.id, entry.expires);
      return true;
    };
    return navigator.locks?.request(storageKey, remember).catch(remember) ?? remember();
  }

  function updatePlayback() {
    if (!animation) return;
    for (const effect of [animation, meterAnimation]) {
      if (userPaused || document.hidden) effect.pause();
      else effect.play();
    }
  }

  const readingTime = () => Math.max(9000, [...current.text].length * 185 + 2700);

  function positionTrack() {
    const width = rail.clientWidth;
    const textWidth = animatedText.offsetWidth;
    if (animation && previousWidth === width && previousTextWidth === textWidth) return;
    previousWidth = width;
    previousTextWidth = textWidth;
    const overflowing = textWidth > width;
    rail.toggleAttribute("data-overflow", overflowing);
    const edge = 7;
    const travel = overflowing ? textWidth - width + edge * 2 : 0;
    const startHold = 1700;
    const scrollingTime = travel * 15;
    const duration = Math.max(readingTime(), startHold + scrollingTime + 2400);
    const keyframes = overflowing ? [
      { offset: 0, transform: `translateX(${edge}px)` },
      { offset: startHold / duration, transform: `translateX(${edge}px)` },
      { offset: (startHold + scrollingTime) / duration, transform: `translateX(${edge - travel}px)` },
      { offset: 1, transform: `translateX(${edge - travel}px)` }
    ] : [
      { offset: 0, opacity: .65 },
      { offset: 260 / duration, opacity: 1 },
      { offset: 1, opacity: 1 }
    ];
    if (animation) {
      const elapsed = (animation.currentTime ?? 0) / animation.effect.getTiming().duration;
      animation.effect.setKeyframes(keyframes);
      for (const effect of [animation, meterAnimation]) {
        effect.effect.updateTiming({ duration });
        effect.currentTime = elapsed * duration;
      }
      return;
    }
    const timing = { duration, easing: "linear", fill: "both" };
    animation = animatedText.animate(keyframes, timing);
    meterAnimation = meter.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], timing);
    animation.onfinish = stopPlayback;
  }

  function clearPlayback() {
    animation?.cancel();
    meterAnimation?.cancel();
    animation = meterAnimation = undefined;
  }

  function stopPlayback() {
    const restore = banner.contains(document.activeElement) ? priorFocus : undefined;
    current = undefined;
    clearTimeout(staticTimer);
    clearPlayback();
    banner.hidden = true;
    live.textContent = "";
    siteSlot.append(banner);
    syncHeaderSpace();
    if (restore?.isConnected) restore.focus({ preventScroll: true });
    showNext();
  }

  function startPlayback() {
    clearTimeout(staticTimer);
    if (StudyPreferences.motionReduced() || typeof animatedText.animate !== "function") {
      clearPlayback();
      banner.dataset.static = "";
      syncHeaderSpace();
      if (!document.hidden) staticTimer = setTimeout(stopPlayback, readingTime());
      return;
    }
    delete banner.dataset.static;
    syncHeaderSpace();
    positionTrack();
    updatePlayback();
  }

  async function showNext() {
    if (waiting || current || document.hidden) return;
    waiting = true;
    try {
      for (const [id, entry] of seen) if (entry <= Date.now()) seen.delete(id);
      for (const entry of queue.values()) {
        queue.delete(entry.id);
        if (!await claim(entry)) continue;
        current = entry;
        userPaused = false;
        priorFocus = document.activeElement;
        pause.setAttribute("aria-pressed", "false");
        pause.setAttribute("aria-label", "暫停跑馬燈");
        animatedText.textContent = staticText.textContent = entry.text;
        banner.hidden = false;
        placeBanner();
        requestAnimationFrame(() => {
          if (current === entry) live.textContent = entry.text;
        });
        startPlayback();
        break;
      }
    } finally { waiting = false; }
  }

  function offer(entries) {
    for (const entry of entries) {
      if (!entry || !idPattern.test(entry.id) || typeof entry.text !== "string" || entry.text.length > 100 ||
        !Number.isFinite(entry.expires) || entry.expires <= Date.now() || seen.has(entry.id)) continue;
      queue.set(entry.id, entry);
    }
    showNext();
  }

  function schedule(delay) {
    clearTimeout(fetchTimer);
    if (!document.hidden) fetchTimer = setTimeout(poll, delay);
  }

  async function poll() {
    if (document.hidden || fetching) return;
    fetching = true;
    lastFetch = Date.now();
    try {
      const response = await fetch(endpoint, {
        credentials: "omit", referrerPolicy: "no-referrer", signal: AbortSignal.timeout(8_000)
      });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.announcements)) return;
      launch.hidden = data.publishing !== true;
      offer(data.announcements);
    } catch {}
    finally {
      fetching = false;
      schedule(12_000);
    }
  }

  pause.addEventListener("click", () => {
    userPaused = !userPaused;
    pause.setAttribute("aria-pressed", String(userPaused));
    pause.setAttribute("aria-label", userPaused ? "繼續播放跑馬燈" : "暫停跑馬燈");
    updatePlayback();
  });
  dismiss.addEventListener("click", stopPlayback);
  document.addEventListener("focusin", event => {
    if (current && !banner.contains(event.target)) priorFocus = event.target;
    placeBanner();
  });
  new MutationObserver(placeBanner).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
  if ("ResizeObserver" in window) {
    const resize = new ResizeObserver(() => {
      syncHeaderSpace();
      if (animation) positionTrack();
    });
    resize.observe(banner);
    resize.observe(rail);
  }
  document.addEventListener("study-preferences", () => { if (current) startPlayback(); });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => { if (current) startPlayback(); });
  document.addEventListener("visibilitychange", () => {
    if (current) startPlayback();
    schedule(Math.max(0, lastFetch + 4_000 - Date.now()));
    showNext();
  });
  window.addEventListener("pageshow", event => { if (event.persisted) schedule(0); });

  launch.addEventListener("click", () => {
    status.textContent = "";
    compose.showModal();
  });
  compose.addEventListener("close", () => { code.value = ""; });
  message.addEventListener("input", () => {
    const text = message.value.replace(/\s+/gu, " ").trim();
    count.textContent = `${message.value.length} / ${message.maxLength}`;
    preview.hidden = !text;
    preview.lastElementChild.textContent = text;
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submit.disabled) return;
    const text = message.value.replace(/\s+/gu, " ").trim();
    const token = code.value;
    if (!text || !codePattern.test(token)) {
      status.textContent = !text ? "請填寫公告內容。" : "發布碼格式有誤，請再核對一次。";
      (!text ? message : code).focus();
      return;
    }
    if (attempt?.text !== text) attempt = { id: crypto.randomUUID(), text };
    submit.disabled = true;
    status.textContent = "正在發布…";
    try {
      const response = await fetch(endpoint, {
        method: "POST", body: JSON.stringify(attempt), signal: AbortSignal.timeout(10_000),
        credentials: "omit", referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
      });
      const result = await response.json();
      if (!response.ok) {
        const errors = {
          disabled: "目前尚未設定發布碼。",
          code: "發布碼不正確。",
          rate: "請稍等一分鐘再試。",
          text: "請填寫 100 字以內的公告。",
          cooldown: `剛有一則公告送出，請在 ${Number(result.seconds) || 20} 秒後再試。`
        };
        status.textContent = errors[result.error] ?? "發布暫時失敗，請稍後再試。";
        return;
      }
      status.textContent = response.status === 201 ? "已發布全站公告。" : "這則公告已經發布。";
      if (message.value.replace(/\s+/gu, " ").trim() === text) {
        message.value = "";
        message.dispatchEvent(new Event("input"));
      }
      attempt = undefined;
      offer([result.announcement]);
    } catch {
      status.textContent = "連線中斷。可以用同一則內容重試。";
    } finally { submit.disabled = false; }
  });

  poll();
})();
