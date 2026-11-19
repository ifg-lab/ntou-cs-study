"use strict";

(() => {
  const panel = document.querySelector("#study-traffic");
  if (!panel || location.origin !== panel.dataset.origin) return;

  const key = "ntou-study-visitor";
  const visitorId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
  const format = new Intl.NumberFormat("zh-TW");
  const status = panel.querySelector(".traffic-status");
  const today = panel.querySelector('[data-traffic-value="today"]');
  const online = panel.querySelector('[data-traffic-value="online"]');
  let timer, pending = false, lastBeat = 0;

  function browserId() {
    const loadOrCreate = () => {
      const saved = localStorage.getItem(key);
      if (saved && visitorId.test(saved)) return saved;
      const id = crypto.randomUUID();
      localStorage.setItem(key, id);
      return id;
    };
    return navigator.locks ? navigator.locks.request(key, loadOrCreate) : loadOrCreate();
  }

  function schedule(delay) {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(update, delay);
  }

  async function update() {
    if (document.hidden || pending) return;
    pending = true;
    lastBeat = Date.now();
    try {
      const id = await browserId();
      if (document.hidden) return;
      const response = await fetch(panel.dataset.endpoint, {
        method: "POST",
        headers: { "X-Study-Visitor": id },
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(8_000)
      });
      if (!response.ok) throw new Error("Traffic unavailable");
      const counts = await response.json();
      if (![counts.today, counts.online].every(value => Number.isSafeInteger(value) && value >= 0)) {
        throw new Error("Invalid traffic counts");
      }
      today.textContent = format.format(counts.today);
      online.textContent = format.format(counts.online);
      panel.dataset.state = "ready";
      status.textContent = "";
    } catch {
      today.textContent = online.textContent = "—";
      panel.dataset.state = "unavailable";
      status.textContent = "統計暫時無法更新";
    } finally {
      pending = false;
      schedule(55_000);
    }
  }

  function refreshOnReturn() {
    schedule(Math.max(0, lastBeat + 8_000 - Date.now()));
  }

  panel.hidden = false;
  document.addEventListener("visibilitychange", refreshOnReturn);
  window.addEventListener("pagehide", () => clearTimeout(timer));
  window.addEventListener("pageshow", event => { if (event.persisted) refreshOnReturn(); });
  update();
})();
