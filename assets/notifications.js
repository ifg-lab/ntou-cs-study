"use strict";

const StudyNotifications = (() => {
  const dropdown = document.querySelector("#notification-dropdown");
  const trigger = document.querySelector("#notification-trigger");
  const badge = document.querySelector("#notification-badge");
  const panel = document.querySelector("#notification-panel");
  const list = document.querySelector("#notification-list");
  const status = document.querySelector("#notification-status");
  const markAll = panel.querySelector('[data-notice-action="read-all"]');
  const more = panel.querySelector('[data-notice-action="more"]');
  const perPage = 12;
  const time = new Intl.DateTimeFormat("zh-TW", { dateStyle: "short", timeStyle: "short" });
  let site, connect, rolesChanged, userId, revision = 0, timer, request = 0, unread = 0, items = [], options = { more: false, extended: false };

  function paintCount(total) {
    unread = Number(total) || 0;
    badge.hidden = !unread;
    badge.textContent = unread > 9 ? "9+" : String(unread);
    trigger.setAttribute("aria-label", unread ? "通知，" + unread + " 則未讀" : "通知");
    markAll.hidden = !unread;
  }

  function locationFor(item) {
    if (item.kind === "report") return site.courseLink("discussion", "moderation", "posts", item.report_id);
    if (item.kind === "material") return site.courseLink("discussion", "moderation", "materials", item.material_id);
    return item.message_available ? site.courseLink("discussion", "thread", item.thread_id, item.reply_id) : "";
  }

  function notice(item) {
    const { escape } = site;
    const actor = escape(item.nickname || "未設定暱稱的同學");
    const href = locationFor(item);
    const report = item.kind !== "reply";
    const title = item.kind === "report" ? actor + " 檢舉了一則討論訊息" : item.kind === "material" ?
      actor + " 回報了教材或題目" : actor + " 回覆了你";
    const course = site.courses.find(entry => entry.id === item.course_id)?.label;
    const target = item.kind === "material" ? [course, item.page && "p." + item.page].filter(Boolean).join(" · ") : item.title;
    const context = report ? [target, item.reason].filter(Boolean).join(" · ") : target || (href ? "查看回覆" : "這則回覆目前無法查看");
    const body = '<span class="notice-kind">' + (report ? "檢舉" : "回覆") + '</span><span class="notice-copy"><strong>' + title +
      '</strong><span class="notice-preview">' + escape(context) + '</span><span class="notice-meta"><time datetime="' +
      escape(item.created_at) + '">' + time.format(new Date(item.created_at)) + '</time>' +
      (report && item.resolved ? '<span>已處理</span>' : "") + '</span></span>' +
      (item.read ? "" : '<span class="notice-unread" aria-label="未讀"></span>');
    const attributes = 'class="notice-item" data-notice-id="' + item.id + '"';
    return '<li>' + (href ? '<a ' + attributes + ' href="' + escape(href) + '">' + body + '</a>' :
      '<button type="button" ' + attributes + '>' + body + '</button>') + "</li>";
  }

  function paintList() {
    list.innerHTML = items.map(notice).join("");
    status.textContent = items.length ? "" : "目前沒有通知。";
    more.hidden = !options.more;
  }

  async function load(full = !panel.hidden && !options.extended, append = false) {
    if (!userId) return;
    const at = revision;
    const sequence = ++request;
    try {
      const client = await connect();
      if (at !== revision || sequence !== request) return;
      const { data, error } = await client.rpc("study_inbox", {
        page_size: full ? perPage + 1 : 0, before_id: append ? items.at(-1)?.id ?? null : null
      });
      if (error) throw error;
      if (at !== revision || sequence !== request) return;
      paintCount(data.unread);
      rolesChanged(data.is_admin, data.is_owner);
      if (!data.is_admin && items.some(item => item.kind !== "reply")) {
        items = items.filter(item => item.kind === "reply");
        if (!panel.hidden) paintList();
      }
      if (full && !panel.hidden) {
        options.more = data.items.length > perPage;
        const page = data.items.slice(0, perPage);
        if (append) {
          options.extended = true;
          list.insertAdjacentHTML("beforeend", page.map(notice).join(""));
          list.querySelector('[data-notice-id="' + page[0]?.id + '"]')?.focus();
          items.push(...page);
          more.hidden = !options.more;
        } else {
          const focusId = list.contains(document.activeElement) ? document.activeElement.dataset.noticeId : null;
          items = page;
          paintList();
          if (focusId) list.querySelector('[data-notice-id="' + focusId + '"]')?.focus({ preventScroll: true });
        }
      }
    } catch {
      if (at === revision && sequence === request && full && !panel.hidden) status.textContent = "通知暫時無法載入，請重新開啟或稍後再試。";
    }
  }

  function popup(open, focus = false) {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) {
      items = [];
      list.replaceChildren();
      options = { more: false, extended: false };
      more.hidden = true;
      status.textContent = "正在載入通知…";
      load(true);
    }
    if (focus) trigger.focus();
  }

  async function markRead(id) {
    const at = revision;
    ++request;
    try {
      const client = await connect();
      if (at !== revision) return;
      const { error } = await client.rpc("study_read_inbox", { notice_id: id });
      if (error) throw error;
      if (at !== revision) return;
      const checked = items.filter(item => !item.read && (id === null || item.id === id));
      for (const item of checked) item.read = true;
      const focusId = list.contains(document.activeElement) ? document.activeElement.dataset.noticeId : null;
      paintCount(id === null ? 0 : Math.max(0, unread - checked.length));
      if (!panel.hidden) {
        paintList();
        if (focusId) list.querySelector('[data-notice-id="' + focusId + '"]')?.focus({ preventScroll: true });
      }
      load(false);
    } catch {
      if (at === revision && !panel.hidden) status.textContent = "無法更新已讀狀態，請再試一次。";
    }
  }

  trigger.addEventListener("click", () => popup(panel.hidden));
  panel.addEventListener("click", async event => {
    const control = event.target.closest("[data-notice-action], [data-notice-id]");
    if (!control || control.disabled) return;
    if (control.dataset.noticeAction === "more") {
      control.disabled = true;
      try { await load(true, true); } finally { control.disabled = false; }
    } else if (control.dataset.noticeAction === "read-all") {
      control.disabled = true;
      try { await markRead(null); } finally { control.disabled = false; }
    } else {
      const item = items.find(entry => String(entry.id) === control.dataset.noticeId);
      if (item && !item.read) markRead(item.id);
    }
  });
  dropdown.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) { event.preventDefault(); popup(false, true); }
  });
  document.addEventListener("click", event => { if (!dropdown.contains(event.target) && !panel.hidden) popup(false); });
  window.addEventListener("hashchange", () => { if (!panel.hidden) popup(false); });
  const whenVisible = () => { if (!document.hidden && userId) load(); };
  document.addEventListener("visibilitychange", whenVisible);
  window.addEventListener("focus", whenVisible);
  window.addEventListener("online", whenVisible);

  function setUser(next) {
    if (next === userId) return;
    ++revision;
    userId = next;
    clearInterval(timer);
    popup(false);
    list.replaceChildren();
    items = [];
    paintCount(0);
    dropdown.hidden = !userId;
    if (userId) {
      load(false);
      timer = setInterval(whenVisible, 20000);
    }
  }
  return { start(api, client, onRoles) { site = api; connect = client; rolesChanged = onRoles; }, setUser };
})();
