"use strict";

(() => {
  const card = document.querySelector("#updates-card");
  const status = document.querySelector("#updates-status");
  const recent = document.querySelector("#updates-recent");
  const earlier = document.querySelector("#updates-earlier");
  const history = document.querySelector("#updates-history");
  const timeZone = "Asia/Taipei";
  const calendar = new Intl.DateTimeFormat("zh-TW", { timeZone, year:"numeric", month:"long", day:"numeric" });
  const clock = new Intl.DateTimeFormat("zh-TW", { timeZone, hour:"2-digit", minute:"2-digit", hourCycle:"h23" });
  const labels = { deployed:"上線", commit:"提交紀錄", work:"工作紀錄", file:"檔案紀錄" };
  const esc = StudySite.escape;

  function item(entry, showDate) {
    const time = new Date(entry.time);
    const date = showDate ? calendar.format(time) : "";
    return `<li class="update-entry">
      <div class="update-when"><time datetime="${esc(entry.time)}">${date ? `<span>${date}</span>` : ""}${clock.format(time)}</time>
        <span class="update-source" data-source="${esc(entry.source)}">${labels[entry.source]}</span></div>
      <h3 class="update-title">${esc(entry.title)}</h3>
    </li>`;
  }

  function render({ entries }) {
    recent.innerHTML = entries.slice(0, 3).map(entry => item(entry, true)).join("");
    document.querySelector("#updates-count").textContent = `${entries.length} 筆`;
    function renderArchive() {
      if (!history.open || earlier.childElementCount) return;
      const days = new Map();
      for (const entry of entries.slice(3)) {
        const day = calendar.format(new Date(entry.time));
        if (!days.has(day)) days.set(day, []);
        days.get(day).push(entry);
      }
      earlier.innerHTML = [...days].map(([day, group]) => `<section class="update-day">
        <h3>${esc(day)}</h3><ol class="updates-list">${group.map(entry => item(entry, false)).join("")}</ol></section>`).join("");
    }
    history.addEventListener("toggle", renderArchive);
    renderArchive();
    status.hidden = true;
    card.hidden = false;
    if (location.hash === "#updates") {
      const reveal = () => requestAnimationFrame(() => {
        if (location.hash !== "#updates") return;
        const heading = document.querySelector("#updates-title");
        heading.focus({ preventScroll:true });
        heading.scrollIntoView({ block:"start", behavior:"instant" });
      });
      if (document.readyState === "complete") reveal();
      else window.addEventListener("load", reveal, { once:true });
    }
  }

  fetch("assets/updates.json", { cache:"no-cache" }).then(response => {
    if (!response.ok) throw new Error("Update archive unavailable.");
    return response.json();
  }).then(render).catch(() => { status.textContent = "目前無法載入更新日誌，可以重新整理後再試。"; });
})();
