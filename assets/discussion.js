"use strict";

const StudyDiscussion = (() => {
  const view = document.querySelector("#community");
  const dialog = document.querySelector("#discussion-dialog");
  const dialogTitle = document.querySelector("#discussion-dialog-title");
  const dialogContent = document.querySelector("#discussion-dialog-content");
  const dialogStatus = document.querySelector("#discussion-dialog-status");
  const personFields = "id,nickname,bio,avatar,avatar_version";
  const author = `author:study_profiles(${personFields})`;
  const threadFields = `id,author_id,course_id,unit_id,page,title,body,created_at,edited_at,deleted_at,solved,${author}`;
  const replyFields = `id,author_id,body,created_at,edited_at,deleted_at,reply_to,quotes_thread,${author}`;
  const icons = {
    reply: '<path d="m9 10-4 4 4 4M5 14h9a5 5 0 0 0 0-10"/>',
    react: '<path d="M21 12a9 9 0 1 1-9-9m3 3h6m-3-3v6M8 13a4 4 0 0 0 7 1m-6-5h.01"/>',
    more: '<path d="M5 12h.01m7 0h.01m7 0h.01" stroke-width="3"/>'
  };
  const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
  const perPage = 20;
  const dateFormat = new Intl.DateTimeFormat("zh-TW", { dateStyle: "medium", timeStyle: "short" });
  const units = new Map();
  let site, account, route = [], revision = 0, pageOffset = 0, replyOffset = 0, activeThread, actionBusy = false;
  let dialogJob, postContext, postOwner, quoteId, replyDraft = "", sendingReply = false;
  let profileBack, previousDiscussion, requestedReply;
  let messages = new Map(), reactions = new Map(), usage = new Map(), popular = new Map();
  let memberSearch = "", members = new Map(), reactionNames;
  const busyReactions = new Set();

  const url = (...parts) => site.courseLink("discussion", ...parts);
  const courseLabel = id => site.courses.find(course => course.id === id)?.label ?? id;
  const unitFor = (course, id) => units.get(course)?.find(unit => unit.unit_id === id);
  const lesson = item => site.courseLink(item.course_id, "learn", item.unit_id, item.page ?? "");
  const escape = value => site.escape(value);
  const heading = (title, copy = "") => `<header class="community-heading"><h1 tabindex="-1">${escape(title)}</h1>
    ${copy ? `<p>${escape(copy)}</p>` : ""}</header>`;
  const renderMessage = message => `<p class="community-empty">${escape(message)}</p>`;

  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  const time = date => `<time datetime="${escape(date)}">${dateFormat.format(new Date(date))}</time>`;
  const badge = '<span class="discussion-rank">ADMIN</span>';

  async function people(client, entries, withProfile = false) {
    const ids = [...new Set(entries.filter(Boolean).map(item => item.id))];
    if (!ids.length) return new Map();
    const { data, error } = await client.rpc("study_discussion_people_full", { people: ids, with_profile: withProfile });
    if (error) throw error;
    return new Map(data.map(item => [item.id, item]));
  }

  const className = flags => flags?.department ? `${flags.department} ${flags.grade}${flags.section}` : "";

  function person(entry, metadata, deleted = false) {
    if (!entry || deleted) return '<span class="discussion-person">同學</span>';
    const flags = metadata.get(entry.id);
    return `<span class="discussion-identity">
      <a class="discussion-person${flags?.is_admin ? " is-admin" : ""}" href="${url("profile", entry.id)}">
        ${account.avatarMarkup(entry)}<strong>${escape(entry.nickname)}</strong></a>
      ${flags?.is_admin ? badge : ""}
      ${flags?.student_id ? `<span class="discussion-enrollment"><span class="discussion-student-id">(${escape(flags.student_id)})</span>
        ${flags.department ? `<span class="discussion-class">${escape(className(flags))}</span>` : ""}</span>` : ""}</span>`;
  }

  function requireProfile(resume) {
    if (account.canDiscuss()) return true;
    account.openAccount(resume);
    return false;
  }

  async function loadUnits(client) {
    if (units.size) return;
    const { data, error } = await client.from("study_units").select("*").order("course_id").order("first_page").limit(1000);
    if (error) throw error;
    const loaded = new Map();
    for (const unit of data) {
      if (!loaded.has(unit.course_id)) loaded.set(unit.course_id, []);
      loaded.get(unit.course_id).push(unit);
    }
    for (const [id, list] of loaded) units.set(id, list);
  }

  function headingSlot(thread) {
    const label = unitFor(thread.course_id, thread.unit_id)?.title ?? thread.unit_id;
    return `<span>${escape(courseLabel(thread.course_id))} · ${escape(label)}${thread.page ? ` · p.${thread.page}` : ""}</span>`;
  }

  function filters(course, unit) {
    return `<div class="discussion-filters">
      <label>章次<select id="discussion-course" data-discussion-filter>
        <option value="">全部章次</option>${site.courses.filter(item => units.has(item.id)).map(item =>
          `<option value="${item.id}" ${item.id === course ? "selected" : ""}>${escape(item.label)} · ${escape(item.title)}</option>`).join("")}
      </select></label>
      ${course ? `<label>單元<select id="discussion-unit" data-discussion-filter>
        <option value="">全部單元</option>${(units.get(course) ?? []).map(item => `<option value="${item.unit_id}"
          ${item.unit_id === unit ? "selected" : ""}>${escape(item.title)} · p.${item.first_page}–${item.last_page}</option>`).join("")}
      </select></label>` : ""}
      <button type="button" class="btn" data-discussion="new">發問</button></div>`;
  }

  function pagination(offset, more, kind) {
    return offset || more ? `<nav class="community-actions discussion-pages" aria-label="分頁">
      <button type="button" class="btn secondary" data-discussion="${kind}-back" ${offset ? "" : "disabled"}>上一頁</button>
      <button type="button" class="btn secondary" data-discussion="${kind}-next" ${more ? "" : "disabled"}>下一頁</button></nav>` : "";
  }

  const readPage = query => query.range(pageOffset, pageOffset + perPage);

  async function threadList(client, at) {
    const [course, unitId, rawPage] = route;
    const unit = unitFor(course, unitId);
    const page = unit && /^\d+$/.test(rawPage) && Number(rawPage) >= unit.first_page && Number(rawPage) <= unit.last_page ? Number(rawPage) : null;
    postContext = { course: units.has(course) ? course : "", unit: unit?.unit_id ?? "", page };
    let query = client.from("study_threads").select(`id,course_id,unit_id,page,title,created_at,edited_at,deleted_at,solved,${author}`)
      .order("created_at", { ascending: false }).order("id", { ascending: false });
    if (postContext.course) query = query.eq("course_id", course);
    if (unit) query = query.eq("unit_id", unitId);
    if (page) query = query.eq("page", page);
    const { data, error } = await readPage(query);
    if (error) throw error;
    const metadata = await people(client, data.slice(0, perPage).filter(item => !item.deleted_at).map(item => item.author));
    if (at !== revision) return;
    view.innerHTML = heading(unit ? unit.title : course && units.has(course) ? `${courseLabel(course)} 討論` : "最新討論",
      page ? `這裡顯示 p.${page} 的提問。` : "找同學的問題，或分享你在教材裡卡住的地方。") +
      (unit ? `<nav class="discussion-nav"><a href="${page ? url(course, unitId) : url(course)}">${page ? "回單元討論" : `回 ${escape(courseLabel(course))} 討論區`}</a>
        <a href="${lesson({ course_id: course, unit_id: unitId, page })}">回教材${page ? ` p.${page}` : ""}</a></nav>` : "") +
      filters(postContext.course, postContext.unit) +
      (data.length ? `<ul class="discussion-list">${data.slice(0, perPage).map(item => `<li class="discussion-card">
        <div class="discussion-meta">${headingSlot(item)}${item.solved ? '<span class="discussion-solved">已解決</span>' : ""}</div>
        <h2><a href="${url("thread", item.id)}">${escape(item.title)}</a></h2>
        <div class="discussion-meta">${person(item.author, metadata, item.deleted_at)}${time(item.created_at)}${item.edited_at && !item.deleted_at ? '<span class="discussion-edited">已編輯</span>' : ""}</div>
      </li>`).join("")}</ul>` : renderMessage("這個範圍還沒有貼文。")) + pagination(pageOffset, data.length > perPage, "list");
  }

  function quoteMarkup(entry) {
    if (!(entry.reply_to || entry.quotes_thread) || entry.deleted_at) return "";
    const quoted = entry.quotes_thread ? activeThread : entry.quoted;
    const target = entry.quotes_thread ? activeThread.id : entry.reply_to;
    const body = quoted?.deleted_at ? "此訊息已被刪除" : quoted ? quoted.body.replace(/\s+/g, " ").trim() : "這則訊息目前無法查看";
    const label = quoted && !quoted.deleted_at ? quoted.author?.nickname ?? "同學" : "引用訊息";
    const link = entry.quotes_thread ? url("thread", activeThread.id) : url("thread", activeThread.id, entry.reply_to);
    return `<a class="discussion-quote" href="${link}" data-discussion="jump" data-id="${escape(target)}"><strong>${escape(label)}</strong><span>${escape(body)}</span></a>`;
  }

  function reactionsMarkup(id) {
    const emoji = [...(reactions.get(id)?.values() ?? [])].sort((a, b) => b.total - a.total || a.emoji.localeCompare(b.emoji));
    return emoji.map(entry => `<button type="button" class="discussion-reaction" data-discussion="react" data-id="${escape(id)}"
      data-emoji="${escape(entry.emoji)}" aria-pressed="${Boolean(entry.reacted)}" aria-label="${escape(StudyEmoji.name(entry.emoji))}，${entry.total} 個反應">
      ${StudyEmoji.markup(entry.emoji, escape)}<span>${entry.total}</span></button>`).join("");
  }

  function messageTools(entry, root) {
    const id = escape(entry.id);
    const mine = account.getUser()?.id === entry.author_id;
    return `<div class="message-tools" aria-label="訊息操作">
      <div class="message-quick" data-quick-reactions="${id}"></div>
      <button type="button" data-discussion="emoji" data-id="${id}" aria-label="新增表情" title="新增表情">${icon("react")}</button>
      <button type="button" data-discussion="quote" data-id="${id}" aria-label="回覆這則訊息" title="回覆">${icon("reply")}</button>
      <details class="message-menu">
        <summary aria-label="更多訊息操作" title="更多操作">${icon("more")}</summary>
        <div class="message-menu-panel"><div class="message-menu-quick" data-quick-reactions="${id}"></div>
          <button type="button" data-discussion="emoji" data-id="${id}">新增表情</button>
          <button type="button" data-discussion="quote" data-id="${id}">回覆這則訊息</button>
          ${mine ? `<button type="button" data-discussion="edit" data-id="${id}">編輯</button>
            ${root ? `<button type="button" data-discussion="solve">${entry.solved ? "改為未解決" : "標記已解決"}</button>` : ""}
            <button type="button" class="destructive" data-discussion="delete" data-id="${id}">刪除</button>` :
          account.getUser() ? `<button type="button" class="destructive" data-discussion="report-${root ? "thread" : "reply"}" data-id="${id}">檢舉</button>` : ""}
        </div>
      </details>
    </div>`;
  }

  function message(entry, metadata, root = false) {
    const id = escape(entry.id);
    if (entry.deleted_at) return `<article class="discussion-message message-deleted" tabindex="-1" id="message-${id}">
      <p>此訊息已被刪除</p>${!root && account.isOwner() ?
      `<button type="button" class="utility remove-deleted-notice" data-discussion="remove-deleted" data-id="${id}" aria-label="移除此訊息的刪除提示">移除提示</button>` : ""}</article>`;
    return `<article class="discussion-message${root ? " discussion-original" : ""}" tabindex="-1" id="message-${id}">
      ${root ? `<div class="discussion-context">${headingSlot(entry)}${entry.solved ? '<span class="discussion-solved">已解決</span>' : ""}</div>` : ""}
      ${quoteMarkup(entry)}
      <div class="discussion-meta">${person(entry.author, metadata)}${time(entry.created_at)}
        ${entry.edited_at ? '<span class="discussion-edited">已編輯</span>' : ""}</div>
      <div class="message-content"><p class="discussion-body">${escape(entry.body)}</p></div>
      <div class="discussion-reactions" data-reactions-for="${id}">${reactionsMarkup(entry.id)}</div>
      ${messageTools(entry, root)}
    </article>`;
  }

  function refreshQuick() {
    const shortcuts = StudyEmoji.quick(popular);
    for (const menu of view.querySelectorAll("[data-quick-reactions]")) {
      const id = menu.dataset.quickReactions;
      menu.innerHTML = shortcuts.map(emoji => `<button type="button" data-discussion="react" data-id="${escape(id)}"
        data-emoji="${escape(emoji)}" aria-pressed="${Boolean(reactions.get(id)?.get(emoji)?.reacted)}"
        aria-label="${escape(StudyEmoji.name(emoji))}" title="${escape(StudyEmoji.name(emoji))}">${StudyEmoji.markup(emoji, escape)}</button>`).join("");
    }
    StudyEmoji.paint(view);
  }

  function composerMarkup() {
    if (!account.canDiscuss()) return `<div class="discussion-composer"><p>${account.getUser() ? "填妥學號、系級班和暱稱後即可參與討論。" : "登入後即可回覆和加表情。"}</p>
      <button type="button" class="btn" data-discussion="reply">${account.getUser() ? "完成帳號資料" : "登入後回覆"}</button></div>`;
    const quoted = quoteId ? messages.get(quoteId) : null;
    return `<form class="discussion-composer community-form" id="thread-reply-form">
      <div class="composer-context"${quoted ? "" : " hidden"}>
        <p>${quoted ? `回覆給 <strong>${escape(quoted.author?.nickname ?? "同學")}</strong>` : ""}</p>
        <button type="button" class="utility" data-discussion="clear-quote">取消引用</button></div>
      <label>寫回覆<textarea name="body" rows="3" required maxlength="2500" placeholder="輸入你的回覆…">${escape(replyDraft)}</textarea></label>
      <button class="btn" type="submit">送出回覆</button></form>`;
  }

  function showMessage(id) {
    const target = document.getElementById("message-" + id);
    if (!target || !view.contains(target)) return false;
    target.scrollIntoView({ block: "center" });
    target.focus({ preventScroll: true });
    target.classList.remove("message-highlight");
    requestAnimationFrame(() => target.classList.add("message-highlight"));
    return true;
  }

  async function threadDetail(client, id, at) {
    const result = await client.from("study_threads").select(threadFields).eq("id", id).maybeSingle();
    if (result.error) throw result.error;
    if (at !== revision) return;
    activeThread = result.data;
    if (!activeThread) {
      view.innerHTML = heading("無法開啟討論") + renderMessage("這篇貼文可能已移除。") + `<a href="${url()}">回最新討論</a>`;
      return;
    }
    const thread = activeThread;
    const linked = requestedReply;
    if (linked) {
      const position = await client.rpc("study_reply_position", { target_thread: id, target_reply: linked });
      if (position.error) throw position.error;
      if (at !== revision) return;
      if (position.data != null) replyOffset = Math.floor(Number(position.data) / perPage) * perPage;
    }
    const readReplies = offset => client.from("study_replies").select(replyFields)
      .eq("thread_id", id).order("created_at").order("id").range(offset, offset + perPage);
    let replyResult = await readReplies(replyOffset);
    if (!replyResult.error && !replyResult.data.length && replyOffset && at === revision) {
      replyOffset = Math.max(0, replyOffset - perPage);
      replyResult = await readReplies(replyOffset);
    }
    if (replyResult.error) throw replyResult.error;
    const { data } = replyResult;
    const replies = data.slice(0, perPage);
    const visible = [thread, ...replies].filter(entry => !entry.deleted_at);
    const quotedIds = [...new Set(replies.filter(entry => !entry.deleted_at && entry.reply_to).map(entry => entry.reply_to))];
    const [metadata, counts, weights, globalWeights, quotes] = await Promise.all([
      people(client, visible.map(entry => entry.author)),
      client.rpc("study_message_reactions", { target_thread: id, messages: visible.map(entry => entry.id) }),
      account.canDiscuss() ? client.from("study_emoji_usage").select("emoji,uses,last_used").eq("user_id", account.getUser().id)
        .order("uses", { ascending: false }).order("last_used", { ascending: false }).order("emoji").limit(24) : Promise.resolve({}),
      client.rpc("study_popular_emoji"),
      quotedIds.length ? client.from("study_replies").select("id,body,deleted_at,author:study_profiles(nickname)")
        .eq("thread_id", id).in("id", quotedIds) : Promise.resolve({})
    ]);
    if (counts.error || weights.error || quotes.error) throw counts.error ?? weights.error ?? quotes.error;
    if (at !== revision) return;
    messages = new Map(visible.map(entry => [entry.id, entry]));
    reactions = new Map();
    for (const row of counts.data) {
      if (!reactions.has(row.message_id)) reactions.set(row.message_id, new Map());
      reactions.get(row.message_id).set(row.emoji, row);
    }
    usage = new Map((weights.data ?? []).map(row => [row.emoji, row]));
    popular = new Map((globalWeights.data ?? []).map(row => [row.emoji, row]));
    const quoteMap = new Map((quotes.data ?? []).map(row => [row.id, row]));
    for (const reply of replies) reply.quoted = quoteMap.get(reply.reply_to);
    view.innerHTML = `<nav class="discussion-nav"><a href="${url(thread.course_id, thread.unit_id)}">回單元討論</a>
      <a href="${lesson(thread)}">回教材${thread.page ? " p." + thread.page : ""}</a></nav>` + heading(thread.title) +
      message(thread, metadata, true) + `<section class="discussion-replies"><h2>回覆</h2>
        ${replies.length ? `<div class="discussion-conversation">${replies.map(reply => message(reply, metadata)).join("")}</div>` :
          renderMessage("目前還沒有回覆。")}
        ${pagination(replyOffset, data.length > perPage, "reply")}
        <div id="discussion-composer">${composerMarkup()}</div>
        <p id="discussion-feedback" class="tool-status" role="status"></p>
      </section>`;
    refreshQuick();
  }

  async function profilePage(client, id, at) {
    const [personResult, posts, metadata] = await Promise.all([
      client.from("study_profiles").select(personFields).eq("id", id).maybeSingle(),
      readPage(client.from("study_threads").select("id,course_id,unit_id,page,title,created_at,solved")
        .eq("author_id", id).is("deleted_at", null).order("created_at", { ascending: false }).order("id")),
      people(client, [{ id }], true)
    ]);
    if (personResult.error || posts.error) throw personResult.error ?? posts.error;
    if (at !== revision) return;
    const entry = personResult.data;
    const back = `<nav class="discussion-nav"><a href="${profileBack ?? url()}">← 回討論</a></nav>`;
    if (!entry) {
      view.innerHTML = back + heading("找不到個人檔案");
      return;
    }
    const flags = metadata.get(id);
    const isAdmin = flags?.is_admin;
    const { discord, github, birth_month, birth_day, interests } = flags?.extras ?? {};
    const fields = [
      ["學號", escape(flags?.student_id)], ["系級班", escape(className(flags))],
      ["Discord", escape(discord)], ["生日", birth_month && birth_day ? `${birth_month} 月 ${birth_day} 日` : ""],
      ["GitHub", github ? `<a href="https://github.com/${encodeURIComponent(github)}" target="_blank" rel="noopener noreferrer">${escape(github)}</a>` : ""],
      ["興趣／想學的主題", escape(interests)]
    ].filter(([, value]) => value);
    view.innerHTML = back + `<header class="discussion-profile">
      ${account.avatarMarkup(entry)}<div><h1 tabindex="-1" class="${isAdmin ? "is-admin" : ""}">${escape(entry.nickname)}</h1>
      ${isAdmin ? badge : ""}<p class="discussion-body">${escape(entry.bio || "這位同學還沒填寫簡介。")}</p></div>
      ${fields.length ? `<dl class="discussion-profile-details">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>` : ""}</header>
      <section class="discussion-profile-posts"><h2>公開提問</h2>${posts.data.length ? `<ul class="discussion-list">${posts.data.slice(0, perPage).map(item =>
      `<li class="discussion-card"><div class="discussion-meta">${headingSlot(item)}
        ${item.solved ? '<span class="discussion-solved">已解決</span>' : ""}</div>
      <h3><a href="${url("thread", item.id)}">${escape(item.title)}</a></h3><div class="discussion-meta">${time(item.created_at)}</div></li>`).join("")}</ul>` :
      renderMessage("目前沒有公開提問。")}${pagination(pageOffset, posts.data.length > perPage, "list")}</section>`;
  }

  function moderationNav(selected) {
    const tabs = [["posts", "貼文檢舉"], ["materials", "教材與題目回報"]];
    if (account.isOwner()) tabs.push(["members", "成員管理"]);
    return `<nav class="staff-navigation" aria-label="站務管理"><a href="${url()}">← 回討論</a>${tabs.map(([item, label]) =>
      `<a href="${url("moderation", item)}"${selected === item ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`;
  }

  async function reporterNames(client, reports) {
    const ids = [...new Set(reports.map(item => item.reporter_id))];
    if (!ids.length) return new Map();
    const { data, error } = await client.from("study_profiles").select("id,nickname").in("id", ids);
    if (error) throw error;
    return new Map(data.map(item => [item.id, item.nickname]));
  }

  async function moderation(client, at) {
    const material = route[1] === "materials";
    const selected = uuid.test(route[2]) ? route[2] : null;
    const kind = material ? "materials" : "posts";
    const title = material ? "教材與題目回報" : "貼文檢舉";
    const table = material ? "study_material_reports" : "study_reports";
    const fields = "id,reason,reporter_id,created_at,resolved_at," + (material ? "course_id,unit_id,page,question_id" :
      "thread_id,reply_id,thread:study_threads(id,title,body),reply:study_replies(id,body,thread_id)");
    let query = client.from(table).select(fields).order("created_at", { ascending: false }).order("id");
    query = selected ? query.eq("id", selected) : readPage(query.is("resolved_at", null));
    const { data, error } = await query;
    if (error) throw error;
    const shown = data.slice(0, perPage);
    const names = await reporterNames(client, shown);
    if (at !== revision) return;
    const back = selected ? `<p class="staff-back"><a href="${url("moderation", kind)}">查看所有待處理項目</a></p>` : "";
    view.innerHTML = heading(title) + moderationNav(kind) + back + (shown.length ? `<ul class="discussion-list staff-reports">${shown.map(item => {
      const thread = item.thread_id ?? item.reply?.thread_id;
      const destination = material ? (item.question_id ? site.courseLink(item.course_id, "practice", "all", item.question_id) :
        lesson(item)) : thread ? (item.reply_id ? url("thread", thread, item.reply_id) : url("thread", thread)) : "";
      const number = item.question_id ? " · 第 " + Number(item.question_id.slice(9)) + " 題" : "";
      const label = material ? courseLabel(item.course_id) + " · p." + item.page + number :
        item.thread?.title ?? (item.reply_id ? "被檢舉的回覆" : "被檢舉的貼文");
      const name = names.get(item.reporter_id);
      return `<li class="discussion-card staff-report">
        <div class="discussion-meta"><span class="staff-report-state">${item.resolved_at ? "已處理" : "待處理"}</span>
          <span>回報人 ${name ? `<a href="${url("profile", item.reporter_id)}">${escape(name)}</a>` : "未設定暱稱"} </span>${time(item.created_at)}</div>
        <h2>${destination ? `<a href="${destination}">${escape(label)}</a>` : escape(label)}</h2>
        <p class="discussion-body">${escape(item.reason)}</p>
        ${material ? "" : `<blockquote>${escape(item.thread?.body ?? item.reply?.body ?? "內容已隱藏")}</blockquote>`}
        ${item.resolved_at ? "" : `<div class="community-actions">
          <button class="btn secondary" data-discussion="${material ? "resolve-material" : "dismiss"}" data-id="${item.id}" type="button">標為已處理</button>
          ${material ? "" : `<button class="utility" data-discussion="hide" data-id="${item.id}" type="button">隱藏內容並結案</button>`}
        </div>`}</li>`;
    }).join("")}</ul>` : renderMessage(selected ? "找不到這筆檢舉。" : "目前沒有待處理的檢舉。")) +
      (selected ? "" : pagination(pageOffset, data.length > perPage, "list"));
  }

  async function memberPage(client, at) {
    const { data, error } = await client.rpc("study_manage_members", { search_term: memberSearch, row_offset: pageOffset });
    if (error) throw error;
    if (at !== revision) return;
    const shown = data.slice(0, perPage);
    members = new Map(shown.map(item => [item.id, item]));
    view.innerHTML = heading("成員管理", "管理員可以查看並處理站內檢舉。") + moderationNav("members") +
      `<form class="staff-search" id="staff-member-search"><label>搜尋成員<input type="search" name="query" class="field" maxlength="60"
        placeholder="暱稱或完整學號" value="${escape(memberSearch)}"></label><button type="submit" class="btn">搜尋</button></form>
      <p id="staff-feedback" class="tool-status" role="status"></p>` +
      (shown.length ? `<ul class="discussion-list staff-members">${shown.map(item => `<li class="discussion-card staff-member">
        <div class="staff-member-name">${account.avatarMarkup(item)}<div><a href="${url("profile", item.id)}"><strong>${escape(item.nickname)}</strong></a>
          ${item.is_admin ? badge : ""}<p>${item.student_suffix ? "學號末四碼 " + escape(item.student_suffix) : "學籍資料待補"}</p></div></div>
        ${item.is_admin || item.eligible ? `<button type="button" class="btn secondary" data-discussion="member-role" data-id="${item.id}">
          ${item.is_admin ? "撤銷管理員" : "授予管理員"}</button>` : ""}</li>`).join("")}</ul>` :
        renderMessage("找不到符合條件的成員。")) + pagination(pageOffset, data.length > perPage, "list");
  }

  function setMemberRole(id) {
    const member = members.get(id);
    if (!member || !account.isOwner()) return;
    const enable = !member.is_admin;
    const verb = enable ? "授予" : "撤銷";
    editor(verb + "管理員權限", `<p>成員 <strong>${escape(member.nickname)}</strong>${member.student_suffix ? "（學號末四碼 " + escape(member.student_suffix) + "）" : ""}</p>
      <p>${enable ? "授權後，此成員可以看到並處理檢舉。" : "撤權後，此成員的檢舉管理權限會立即收回。"}</p>`, async client => {
      const { error } = await client.rpc("study_set_moderator", { member_id: id, enabled: enable });
      if (error) throw error;
      pageOffset = 0;
      await render(false);
      const feedback = view.querySelector("#staff-feedback");
      if (feedback) feedback.textContent = `已${verb} ${member.nickname} 的管理員權限。`;
    }, "確認" + verb);
  }

  async function render(move, requestComposer = false) {
    reactionNames.dismiss();
    const at = ++revision;
    if (move || !view.querySelector("h1")) view.innerHTML = heading("課程討論") + '<p role="status">正在載入…</p>';
    try {
      const client = await account.connect();
      await loadUnits(client);
      if (at !== revision || view.hidden) return;
      if (route[0] === "thread" && uuid.test(route[1])) await threadDetail(client, route[1], at);
      else if (route[0] === "profile" && uuid.test(route[1])) await profilePage(client, route[1], at);
      else if (route[0] === "moderation") {
        if (route[1] === "members" && account.isOwner()) await memberPage(client, at);
        else if (route[1] !== "members" && account.isModerator()) await moderation(client, at);
        else view.innerHTML = heading("這個頁面需要管理權限") + `<a href="${url()}">回討論</a>`;
      }
      else await threadList(client, at);
    } catch {
      if (at !== revision || view.hidden) return;
      view.innerHTML = heading("課程討論") + renderMessage("討論區暫時無法載入。") +
        '<button class="btn secondary" type="button" data-discussion="retry">重試</button>';
      return;
    }
    if (at !== revision || view.hidden) return;
    const reply = requestedReply;
    requestedReply = null;
    if (move && !(reply && showMessage(reply))) {
      view.querySelector("h1")?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    if (!account.resumeDiscussion() && requestComposer && postContext?.page) composeThread();
  }

  function openDialog(title, markup, job) {
    reactionNames.dismiss();
    dialogJob = job;
    postOwner = account.getUser()?.id;
    dialogTitle.textContent = title;
    dialogContent.innerHTML = markup;
    dialogStatus.textContent = "";
    dialogStatus.removeAttribute("data-error");
    if (!dialog.open) dialog.showModal();
  }

  function editor(title, markup, job, button) {
    openDialog(title, `<form class="community-form" id="discussion-form">${markup}
      <button type="submit" class="btn">${button}</button></form>`, job);
  }

  function editUnits() {
    const course = dialogContent.querySelector('[name="course"]').value;
    const select = dialogContent.querySelector('[name="unit"]');
    select.innerHTML = (units.get(course) ?? []).map(unit => `<option value="${unit.unit_id}"
      ${postContext.unit === unit.unit_id ? "selected" : ""}>${escape(unit.title)}</option>`).join("");
  }

  function composeThread() {
    if (view.hidden || !postContext || !requireProfile(composeThread)) return;
    const context = { ...postContext };
    editor("向同學發問", `<label>章次<select name="course" required>${site.courses.filter(entry => units.has(entry.id)).map(entry =>
      `<option value="${entry.id}" ${entry.id === context.course ? "selected" : ""}>${escape(entry.label)} · ${escape(entry.title)}</option>`).join("")}</select></label>
      <label>單元<select name="unit" required></select></label>
      ${context.page ? `<p data-page-attachment>附上教材 p.${context.page}</p>` : ""}
      <label>標題<input name="title" required maxlength="120"></label>
      <label>問題內容<textarea name="body" rows="5" required maxlength="4000"></textarea></label>`, async (client, values) => {
      const course = values.get("course"), unit = values.get("unit");
      const title = values.get("title").trim(), body = values.get("body").trim();
      if (!title || !body) throw new Error("請填寫標題和問題內容。");
      const { data, error } = await client.from("study_threads").insert({
        course_id: course, unit_id: unit, page: course === context.course && unit === context.unit ? context.page : null, title, body
      }).select("id").single();
      if (error) throw error;
      location.hash = url("thread", data.id);
    }, "發表問題");
    editUnits();
  }

  function composeReply(id) {
    if (view.hidden || !activeThread || !requireProfile(() => composeReply(id))) return;
    quoteId = messages.has(id) ? id : null;
    const composer = view.querySelector("#discussion-composer");
    composer.innerHTML = composerMarkup();
    composer.querySelector("textarea")?.focus();
  }

  function threadFeedback(text, failure = false) {
    const status = view.querySelector("#discussion-feedback");
    if (!status) return;
    status.textContent = text;
    status.toggleAttribute("data-error", failure);
  }

  async function sendReply(form, button) {
    if (sendingReply || !account.canDiscuss() || !activeThread) return;
    const threadId = activeThread.id;
    const owner = account.getUser().id;
    const at = revision;
    const body = form.elements.body.value.trim();
    if (!body) { threadFeedback("請填寫回覆內容。", true); return; }
    sendingReply = true;
    button.disabled = true;
    try {
      const client = await account.connect();
      if (owner !== account.getUser()?.id || at !== revision) return;
      const { data, error } = await client.from("study_replies").insert({ thread_id: threadId, body,
        reply_to: quoteId === threadId ? null : quoteId, quotes_thread: quoteId === threadId }).select("id").single();
      if (error) throw error;
      if (!data || at !== revision) return;
      quoteId = null;
      replyDraft = "";
      location.hash = url("thread", threadId, data.id);
    } catch (error) {
      if (at !== revision) return;
      threadFeedback(error.code === "P0001" ? "發文太頻繁，請稍等再試。" :
        error.code === "22023" ? "引用的訊息已被移除，取消引用後可重新送出。" : "無法送出回覆，請稍後再試。", true);
    } finally {
      sendingReply = false;
      button.disabled = false;
    }
  }

  function editMessage(id) {
    if (!requireProfile(() => editMessage(id))) return;
    const entry = messages.get(id);
    const target = document.getElementById("message-" + id)?.querySelector(".message-content");
    if (!entry || !target) return;
    const root = id === activeThread.id;
    if (!target.querySelector("form")) {
      target.innerHTML = `<form class="community-form inline-message-edit" data-message-edit="${escape(id)}">
        ${root ? `<label>標題<input name="title" required maxlength="120" value="${escape(entry.title)}"></label>` : ""}
        <label>內容<textarea name="body" required rows="4" maxlength="${root ? 4000 : 2500}">${escape(entry.body)}</textarea></label>
        <div class="community-actions"><button type="submit" class="btn">儲存編輯</button><button type="button" class="utility"
          data-discussion="cancel-edit" data-id="${escape(id)}">取消</button></div><p role="status" class="tool-status"></p></form>`;
    }
    target.querySelector("textarea").focus();
  }

  function cancelEdit(id) {
    const target = document.getElementById("message-" + id)?.querySelector(".message-content");
    if (!target || !messages.has(id)) return;
    target.innerHTML = `<p class="discussion-body">${escape(messages.get(id).body)}</p>`;
    target.closest(".discussion-message").focus({ preventScroll: true });
  }

  async function saveEdit(form, button) {
    const at = revision;
    const id = form.dataset.messageEdit;
    const entry = messages.get(id);
    const threadId = activeThread?.id;
    if (!entry || !account.canDiscuss() || !threadId || button.disabled) return;
    const owner = account.getUser().id;
    const newTitle = form.elements.title?.value.trim() ?? null;
    const newBody = form.elements.body.value.trim();
    const status = form.querySelector("[role=status]");
    if (!newBody || newTitle === "") { status.textContent = "請填寫完整內容。"; return; }
    if (newBody === entry.body && (newTitle === null || newTitle === entry.title)) { cancelEdit(id); return; }
    button.disabled = true;
    try {
      const client = await account.connect();
      if (at !== revision || account.getUser()?.id !== owner) return;
      const { data, error } = await client.rpc("study_change_message", {
        target_thread: threadId, target_reply: id === threadId ? null : id,
        new_title: newTitle, new_body: newBody, remove_message: false
      });
      if (error || !data) throw error ?? new Error();
      if (at !== revision) return;
      await render(false);
      document.getElementById("message-" + id)?.focus({ preventScroll: true });
      threadFeedback("修改已儲存。");
    } catch {
      if (at === revision) status.textContent = "無法儲存修改，請稍後再試。";
    } finally { button.disabled = false; }
  }

  function deleteMessage(id) {
    if (!messages.has(id) || !requireProfile(() => deleteMessage(id))) return;
    const threadId = activeThread.id;
    editor("刪除此訊息？", "<p>原位置會顯示刪除提示，其他同學的回覆會保留。</p>", async client => {
      const { data, error } = await client.rpc("study_change_message", {
        target_thread: threadId, target_reply: id === threadId ? null : id, new_title: null, new_body: null, remove_message: true
      });
      if (error || !data) throw new Error("這則訊息已無法刪除。");
      if (quoteId === id) quoteId = null;
      await render(false);
      threadFeedback("訊息已刪除。");
    }, "確認刪除");
  }

  async function hideDeletedNotice(button, id) {
    if (!activeThread || !account.isOwner()) return;
    const at = revision;
    const thread = activeThread.id;
    const viewer = account.getUser()?.id;
    button.disabled = true;
    try {
      const client = await account.connect();
      if (at !== revision || viewer !== account.getUser()?.id) return;
      const { error } = await client.rpc("study_hide_deleted_reply", { target_thread: thread, target_reply: id });
      if (error) throw error;
      if (at === revision) {
        await render(false);
        if (route[0] === "thread" && route[1] === thread) threadFeedback("已移除刪除提示。");
      }
    } catch {
      if (at === revision) threadFeedback("無法移除提示，請稍後再試。", true);
    } finally { button.disabled = false; }
  }

  async function react(id, emoji) {
    if (!messages.has(id) || !activeThread || !requireProfile(() => react(id, emoji))) return;
    const key = id + emoji;
    if (busyReactions.has(key)) return;
    const at = revision;
    const owner = account.getUser().id;
    const thread = activeThread.id;
    const add = !reactions.get(id)?.get(emoji)?.reacted;
    busyReactions.add(key);
    try {
      const client = await account.connect();
      if (at !== revision || account.getUser()?.id !== owner) return;
      const { data, error } = await client.rpc("study_set_reaction", {
        target_thread: thread, target_reply: thread === id ? null : id, chosen_emoji: emoji, add_reaction: add
      }).single();
      if (error || !data) throw error ?? new Error();
      if (at !== revision) return;
      if (!reactions.has(id)) reactions.set(id, new Map());
      const items = reactions.get(id);
      if (data.total > 0) items.set(emoji, data);
      else items.delete(emoji);
      if (data.uses) usage.set(emoji, data);
      const target = view.querySelector(`[data-reactions-for="${id}"]`);
      const restoreFocus = document.activeElement?.dataset.emoji === emoji;
      if (target) target.innerHTML = reactionsMarkup(id);
      refreshQuick();
      if (restoreFocus) {
        [...(target?.querySelectorAll('button') ?? [])].find(button => button.dataset.emoji === emoji)?.focus({ preventScroll: true });
      }
      threadFeedback(add ? "已新增表情反應。" : "已收回表情反應。");
      if (add) {
        const global = await client.rpc("study_popular_emoji");
        if (!global.error && at === revision) {
          popular = new Map(global.data.map(row => [row.emoji, row]));
          refreshQuick();
        }
      }
    } catch {
      if (at === revision) threadFeedback("無法更新表情反應，請稍後再試。", true);
    } finally { busyReactions.delete(key); }
  }

  function openEmoji(id) {
    if (!messages.has(id) || !requireProfile(() => openEmoji(id))) return;
    const at = revision;
    openDialog("新增表情反應", '<div id="discussion-emoji-picker"></div>');
    const root = dialogContent.querySelector("#discussion-emoji-picker");
    StudyEmoji.picker(root, {
      escape, active: () => dialog.open && root.isConnected && at === revision,
      favorites: StudyEmoji.ranked(usage).slice(0, 24).map(entry => entry.emoji),
      preferenceKey: account.getUser().id,
      selected: emoji => Boolean(reactions.get(id)?.get(emoji)?.reacted),
      choose: emoji => { dialog.close(); react(id, emoji); }
    });
  }

  function reportContent(target) {
    editor("檢舉內容", '<label>原因<textarea name="reason" rows="3" required maxlength="300"></textarea></label>', async (client, values) => {
      const reason = values.get("reason").trim();
      if (!reason) throw new Error("請填寫檢舉原因。");
      const { error } = await client.from("study_reports").insert({ ...target, reason });
      if (error?.code === "23505") throw new Error("你已檢舉過這則內容。");
      if (error) throw error;
      dialogJob = null;
      dialogContent.innerHTML = '<p>已送出檢舉。</p>';
    }, "送出檢舉");
  }

  function reportMaterial(target) {
    const { kind, course, unit, page, question, label, title } = target;
    const heading = kind === "question" ? "回報題目問題" : "回報教材問題";
    if (!account.getUser()) {
      openDialog(heading, '<p>登入後可以把問題私下回報給管理員。</p><button class="btn" id="material-report-login" type="button">前往登入</button>');
      dialogContent.querySelector("#material-report-login").addEventListener("click", () => {
        dialog.close();
        account.openAccount();
      });
      return;
    }
    editor(heading, `<p>${escape(label)} · p.${page}${question ? ` · 第 ${Number(question.slice(9))} 題` : ""}</p>
      <p><strong>${escape(title)}</strong></p><p>回報只有管理員看得到。</p>
      <label>遇到什麼問題？<textarea name="reason" rows="4" maxlength="1200" required></textarea></label>`, async (client, values) => {
      const reason = values.get("reason").trim();
      if (!reason) throw new Error("請填寫遇到的問題。");
      const { error } = await client.from("study_material_reports").insert({ course_id: course, unit_id: unit, page, question_id: question, reason });
      if (error?.code === "23505") throw new Error("你已經回報過這個項目。");
      if (error) throw error;
      openDialog(heading, '<p role="status">已送出回報，管理員可以在後台查看。</p>');
    }, "送出回報");
  }

  dialog.addEventListener("submit", async event => {
    if (event.target.method === "dialog" && actionBusy) { event.preventDefault(); return; }
    if (event.target.id !== "discussion-form") return;
    event.preventDefault();
    if (actionBusy || !dialogJob) return;
    actionBusy = true;
    const job = dialogJob;
    const button = event.submitter ?? event.target.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      if (postOwner !== account.getUser()?.id) throw new Error("登入狀態已變更，請重新開啟表單。");
      const client = await account.connect();
      if (postOwner !== account.getUser()?.id) throw new Error("登入狀態已變更，請重新開啟表單。");
      await job(client, new FormData(event.target));
      if (dialogJob === job && dialog.open) dialog.close();
    } catch (error) {
      dialogStatus.textContent = error.code === "P0001" ? "發文太頻繁，請稍等再試。" :
        error instanceof Error ? error.message : "送出失敗，請稍後再試。";
      dialogStatus.setAttribute("data-error", "");
    } finally { button.disabled = false; actionBusy = false; }
  });
  dialog.addEventListener("cancel", event => { if (actionBusy) event.preventDefault(); });

  dialog.addEventListener("change", event => {
    if (event.target.name === "course") editUnits();
    if (!["course", "unit"].includes(event.target.name)) return;
    const attachment = dialogContent.querySelector("[data-page-attachment]");
    if (attachment) attachment.hidden = dialogContent.querySelector('[name="course"]').value !== postContext.course ||
      dialogContent.querySelector('[name="unit"]').value !== postContext.unit;
  });

  view.addEventListener("change", event => {
    if (!event.target.hasAttribute("data-discussion-filter")) return;
    const course = view.querySelector("#discussion-course").value;
    const unit = event.target.id === "discussion-unit" ? event.target.value : "";
    location.hash = course ? unit ? url(course, unit) : url(course) : url();
  });

  view.addEventListener("input", event => {
    if (event.target.form?.id === "thread-reply-form") replyDraft = event.target.value;
  });

  view.addEventListener("submit", event => {
    const form = event.target;
    if (form.id === "staff-member-search") {
      event.preventDefault();
      memberSearch = form.elements.query.value.trim();
      pageOffset = 0;
      render(false);
      return;
    }
    if (form.id !== "thread-reply-form" && !form.hasAttribute("data-message-edit")) return;
    event.preventDefault();
    const button = event.submitter ?? form.querySelector('[type="submit"]');
    if (form.id === "thread-reply-form") sendReply(form, button);
    else saveEdit(form, button);
  });

  document.addEventListener("click", event => {
    for (const menu of view.querySelectorAll(".message-menu[open]")) {
      if (!menu.contains(event.target)) menu.open = false;
    }
  });

  view.addEventListener("keydown", event => {
    const menu = event.target.closest(".message-menu[open]");
    if (event.key !== "Escape" || !menu) return;
    menu.open = false;
    menu.querySelector("summary").focus();
  });

  view.addEventListener("click", async event => {
    const control = event.target.closest("[data-discussion]");
    if (!control || control.disabled) return;
    const action = control.dataset.discussion, id = control.dataset.id;
    const menu = control.closest(".message-menu");
    if (menu) { menu.open = false; menu.querySelector("summary").focus({ preventScroll: true }); }
    if (action === "new") composeThread();
    else if (action === "reply" || action === "clear-quote") composeReply();
    else if (action === "quote") composeReply(id);
    else if (action === "emoji") openEmoji(id);
    else if (action === "react") react(id, control.dataset.emoji);
    else if (action === "edit") editMessage(id);
    else if (action === "cancel-edit") cancelEdit(id);
    else if (action === "delete") deleteMessage(id);
    else if (action === "remove-deleted") hideDeletedNotice(control, id);
    else if (action === "member-role") setMemberRole(id);
    else if (action === "jump") { if (showMessage(id)) event.preventDefault(); }
    else if (action === "report-thread") reportContent({ thread_id: activeThread.id });
    else if (action === "report-reply") reportContent({ reply_id: id });
    else if (action === "retry") refresh();
    else if (action === "list-next" || action === "list-back") {
      pageOffset += action === "list-next" ? perPage : -perPage;
      render(true);
    } else if (action === "reply-next" || action === "reply-back") {
      replyOffset += action === "reply-next" ? perPage : -perPage;
      quoteId = null;
      render(true);
    } else {
      const at = revision;
      control.disabled = true;
      try {
        const client = await account.connect();
        if (at !== revision) return;
        if (action === "solve") {
          if (!requireProfile(() => view.querySelector('[data-discussion="solve"]')?.click())) return;
          const { error } = await client.from("study_threads").update({ solved: !activeThread.solved }).eq("id", activeThread.id);
          if (error) throw error;
          refresh();
        } else if (action === "resolve-material") {
          const { error } = await client.from("study_material_reports").update({ resolved_at: new Date().toISOString() }).eq("id", id);
          if (error) throw error;
          refresh();
        } else if (action === "hide" || action === "dismiss") {
          const { error } = await client.rpc("study_resolve_report", { report_id: id, hide_content: action === "hide" });
          if (error) throw error;
          refresh();
        }
      } catch {
        if (at === revision) openDialog("操作失敗", "<p>請稍後再試。</p>");
      } finally { control.disabled = false; }
    }
  });

  function refresh() { if (!view.hidden) render(false); }

  function show(segments, move) {
    if (segments[0] === "profile") profileBack = previousDiscussion;
    else previousDiscussion = url(...segments);
    route = segments;
    memberSearch = "";
    activeThread = null;
    postContext = null;
    quoteId = null;
    replyDraft = "";
    requestedReply = segments[0] === "thread" && uuid.test(segments[2]) ? segments[2] : null;
    pageOffset = replyOffset = 0;
    render(move, segments[3] === "ask");
  }

  function start(api, accounts) {
    site = api;
    account = accounts;
    reactionNames = StudyReactionNames.create(view, { escape, async load(message, emoji) {
      const thread = activeThread?.id;
      const client = await account.connect();
      const { data, error } = await client.rpc("study_reaction_names", {
        target_thread: thread, target_message: message, chosen_emoji: emoji
      }).single();
      if (error) throw error;
      return data;
    } });
  }

  return { start, show, refresh, reportMaterial };
})();
