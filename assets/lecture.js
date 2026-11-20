"use strict";

(() => {
const { escape: esc, getProgress, persist, soundEnabled, setSound, saveNote } = StudySite;
const sections = [
  ["overview", "課程總覽"], ["learn", "逐頁教學"], ["activities", "互動實驗"], ["templates", "C++ 競程模板"], ["terms", "術語表"],
  ["practice", "選擇練習"], ["exam", "模擬小考"]
];
const sectionNames = { ...Object.fromEntries(sections), guide: "從連上 Wi‑Fi 到開啟網站", forwarding: "MAC／IP 考前速查" };
const main = document.querySelector("#lecture-view");
const sidebar = document.querySelector("#sidebar");
const sidebarToggle = sidebar.querySelector(".sidebar-toggle");
const desktopOutline = sidebar.querySelector(".desktop-outline");
const mobileOutline = sidebar.querySelector(".mobile-outline");
const labels = "ABCD";
const englishQuestions = () => course.questionLanguage === "en" || course.id === "lecture-05";
let course, study, progress, route;
let examClock = 0;
let confirmSubmit = false;
let confirmReset = false;
let examPage = 1;
const compactLayout = window.matchMedia("(max-width: 650px)");
const singleQuestion = section => {
  const mode = StudyPreferences.get(section);
  return mode === "single" || (mode === "auto" && compactLayout.matches);
};

const pageRange = unit => `p.${unit.start}–${unit.end}`;
const lessonUnit = page => course.units.find(unit => unit.start <= page && page <= unit.end);
const href = (...segments) => StudySite.courseLink(course.id, ...segments);
const lessonHref = page => href("learn", lessonUnit(page)?.id ?? course.units[0].id, page);
const activityHref = (activity, returnQuestion) => returnQuestion
  ? href("learn", lessonUnit(activity.page).id, activity.page, activity.concept, returnQuestion)
  : href("learn", lessonUnit(activity.page).id, activity.page, activity.concept);
const reviewLessonHref = question => href("learn", question.unit, question.page, "", question.id);
const wrongQuestionsPath = () => href("practice", "all", "wrong");
const courseActivities = () => typeof StudyActivities === "undefined" ? [] : StudyActivities.list(course.id);
const hasTemplates = () => course.id === "lecture-06" && typeof Lecture06Templates !== "undefined";
const link = (path, label, style = "secondary") =>
  `<a class="btn ${style}" href="${path}">${esc(label)}</a>`;
const termPath = (name, page) => page ? href("terms", name, page) : href("terms", name);
const questionPath = id => href("practice", "all", id);
const questionFor = id => course.practice.find(question => question.id === id);
const practicePreset = () => ["wrong", "range"].includes(route[3]);
const lookupActivity = concept => courseActivities().find(activity => activity.concept === concept);
const termDetails = name => study?.terms && Object.hasOwn(study.terms, name) ? study.terms[name] : null;
const canonicalTerm = name => course.termAliases && Object.hasOwn(course.termAliases, name) ? course.termAliases[name] : name;
const forwardingTerms = new Set(["Switch", "Router", "MAC Address", "IP Address", "Default Gateway", "Frame", "Packet"]);
const forwardingConcepts = new Set(["switch-source", "switch-destination", "router-ip", "reframing", "default-gateway"]);

function reviewButton(type, id, title, page) {
  const saved = StudySite.findReview(course.id, type, id);
  return `<button type="button" class="btn secondary review-save" data-save-review="${type}" data-review-id="${esc(id)}"
    data-review-title="${esc(title)}" data-review-page="${page ?? ""}" aria-label="加入複習" aria-pressed="${Boolean(saved)}">
      <span class="review-save-add" aria-hidden="true">＋ 加入複習</span>
      <span class="review-save-done" aria-hidden="true">✓ 已加入複習</span>
    </button>`;
}

function reportButton(kind, page, question = "") {
  return StudyCommunity.enabled ? `<button class="utility material-report-button" type="button" data-report-kind="${kind}"
    data-report-page="${page}" data-report-question="${question}">回報${kind === "page" ? "教材" : "題目"}問題</button>` : "";
}

function head(title, description) {
  return `<header class="page-head"><p class="small-label">${esc(course.label)}</p>
    <h1>${esc(title)}</h1><p>${esc(description)}</p></header>`;
}

function applySidebarPreference() {
  const collapsed = StudyPreferences.get("sidebar") === "collapsed";
  const label = collapsed ? "展開章節側欄" : "收合章節側欄";
  if (collapsed && desktopOutline.contains(document.activeElement)) sidebarToggle.focus({ preventScroll: true });
  sidebar.parentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded";
  desktopOutline.inert = collapsed;
  sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
  sidebarToggle.setAttribute("aria-label", label);
  sidebarToggle.querySelector(".sidebar-toggle-hint").textContent = label;
}

applySidebarPreference();
sidebarToggle.addEventListener("click", () => {
  StudyPreferences.set("sidebar", sidebarToggle.getAttribute("aria-expanded") === "true" ? "collapsed" : "expanded");
});

function paintNavigation() {
  const [section, unitId] = route;
  const selected = section === "guide" ? "activities" : section === "forwarding" ? "overview" : section;
  document.querySelector("#top-nav").innerHTML = sections.filter(([id]) =>
    (id !== "activities" || courseActivities().length) && (id !== "templates" || hasTemplates()))
    .map(([id, label]) => {
      const target = id === "learn" ? lessonHref(progress.lastPage) : href(id);
      return `<a href="${target}" ${id === selected ? 'aria-current="page"' : ""}>${label}</a>`;
    }).join("") + `<a href="${href("past-exams")}">考古題</a>`;
  const outline = `<ol>${course.units.map(unit => `<li><a href="${href("learn", unit.id)}" ${section === "learn" && unit.id === unitId ? 'aria-current="page"' : ""}>
      <span>${pageRange(unit)}</span><span>${esc(unit.title)}</span></a></li>`).join("")}</ol>`;
  const count = progress.done.length;
  desktopOutline.innerHTML = `
    <div class="side-progress"><p><span>閱讀進度</span><span>${count} / ${course.slides.length} 頁</span></p>
    <progress aria-label="閱讀進度" value="${count}" max="${course.slides.length}"></progress></div>
    <nav class="sidebar-chapters" aria-label="本章段落">${outline}</nav>`;
  mobileOutline.open = false;
  mobileOutline.innerHTML = `<summary><span>章節導覽</span><span class="mobile-outline-count">${count} / ${course.slides.length} 頁已讀</span></summary>${outline}`;
}

function overviewDiagram() {
  const flow = (nodes, network = false) => `<div class="cover-diagram cover-flow${network ? " cover-network" : ""}" aria-hidden="true">
    ${nodes.map(([title, note]) => `<span class="cover-node">${network ? `<i class="cover-symbol symbol-${title.toLowerCase()}"></i>` : ""}<strong>${title}</strong><small>${note}</small></span>`).join("")}
    ${network ? '<i class="cover-packet"></i>' : ""}</div>`;
  switch (course.id) {
    case "lecture-01":
      return flow([["Input", "輸入"], ["Process", "處理"], ["Output", "輸出"]]);
    case "lecture-02":
      return `<div class="cover-diagram cover-bits" aria-hidden="true"><div>${[..."01000001"].map(bit => `<span>${bit}</span>`).join("")}</div>
        <p><span>Binary</span><span>→</span><strong>0x41</strong><span>→</span><strong>‘A’</strong><span>ASCII</span></p></div>`;
    case "lecture-03":
      return `<div class="cover-diagram cover-cpu" aria-hidden="true"><span>Memory</span><i></i>
        <div><small>CPU</small><strong>IR</strong><strong>ALU</strong></div></div>`;
    case "lecture-04":
      return `<div class="cover-diagram cover-timeline" aria-hidden="true">
        <div><span>P1</span><span>P2</span><span>P1</span><span>P2</span></div><p><span>CPU 排程</span><span>時間 →</span></p></div>`;
    case "lecture-05":
      return flow([["Device", "裝置"], ["Switch", "交換器"], ["Router", "路由器"]], true);
    case "lecture-06":
      return `<div class="cover-diagram cover-search" aria-hidden="true"><div>${[2,4,7,13,18,24,31].map(value =>
        `<span>${value}</span>`).join("")}</div><p><span>low</span><span>mid</span><span>high</span></p><i></i></div>`;
    default:
      return "";
  }
}

function overview() {
  const last = course.slides.find(slide => slide.page === progress.lastPage);
  const started = Boolean(progress.lastReadAt || progress.done.length || progress.lastPage > course.slides[0].page);
  const resume = started ? `繼續 p.${progress.lastPage}` : "開始逐頁教學";
  const count = course.terms.size;
  return `<section class="hero" aria-labelledby="chapter-title"><div class="hero-copy">
      <p class="small-label" lang="en">${esc(course.label)}</p>
      <h1 id="chapter-title">${esc(course.title)}</h1><p class="hero-sub" lang="en">${esc(course.english)}</p>
      ${course.lead ? `<p class="hero-lead">${esc(course.lead)}</p>` : ""}
      <div class="hero-actions">${link(lessonHref(last?.page ?? 1), resume, "light")}${link(href("practice"), "開始練習", "ghost")}
      ${courseActivities().length ? link(href("activities"), "互動實驗", "ghost") : ""}
      ${hasTemplates() ? link(href("templates"), "C++ 競程模板", "ghost") : ""}
      ${course.originalPdf ? `<a class="btn ghost" href="${originalPdfPath()}" target="_blank" rel="noopener">原投影片 PDF <span aria-hidden="true">↗</span></a>` : ""}</div>
    </div>${overviewDiagram()}</section>
    <div class="stats" aria-label="${esc(course.label)} 教材內容">
      ${[[course.slides.length,"頁逐頁教學"],[count,"則術語"],[course.practice.length,"題選擇練習"],
        course.exam.length ? [course.exam.length,"題模擬小考"] : [courseActivities().length,"個互動實驗"]]
        .map(([n, label]) => `<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join("")}
    </div>
    <div class="section-heading"><h2>課程目錄</h2><p>${course.units.length} 個單元 · 依投影片順序</p></div>
    <ol class="module-index">${course.units.map(unit => {
      const current = started && unit === lessonUnit(progress.lastPage);
      const questions = course.practice.filter(question => question.unit === unit.id).length;
      return `<li class="module-row${current ? " is-recent" : ""}">
        <a class="module-lesson" href="${current ? lessonHref(progress.lastPage) : href("learn", unit.id)}">
          <span class="module-range">${pageRange(unit)}</span>
          <span class="module-title"><strong>${esc(unit.title)}</strong><small>${esc(unit.description)}</small></span>
          ${current ? `<span class="module-resume">續讀 p.${progress.lastPage}</span>` : '<span class="module-arrow" aria-hidden="true">→</span>'}</a>
        ${questions ? `<a class="module-practice" href="${href("practice", unit.id)}" aria-label="${esc(unit.title)} · ${questions} 題練習">${questions} 題練習 <span aria-hidden="true">↗</span></a>` : ""}
      </li>`;
    }).join("")}</ol>
    ${study?.forwarding ? `<aside class="review-entry"><div><strong>MAC／IP 考前速查</strong><p>看同一個封包經過筆電、Switch 和 Router 時，哪些位址會變。</p></div>
      ${link(href("forwarding"), "打開對照圖")}</aside>` : ""}
    <details class="source-notes"><summary>教材來源與補充資料</summary>
      <p>主教材為許為元老師的 ${esc(course.source)}。頁碼依投影片順序，重點術語與例題為複習用解說。</p>
      ${course.availableNote ? `<p>${esc(course.availableNote)}</p>` : ""}
      ${course.examSource ? `<p>${esc(course.examSource)}</p>` : ""}
      ${course.id === "lecture-05" ? `<p>模擬題參考 2026 年兩次正式小考、2025 年第二次小考、期中與期末卷的題型，以及可辨讀的批改回饋。網頁上的改寫題以本章為範圍。</p>
      <ul><li><a href="https://csrc.nist.gov/pubs/sp/800/145/final" target="_blank" rel="noopener">NIST 雲端運算定義</a></li>
      <li><a href="https://www.icann.org/root-server-system-en" target="_blank" rel="noopener">ICANN 根伺服器系統</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc2131" target="_blank" rel="noopener">RFC 2131 · DHCP</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc791" target="_blank" rel="noopener">RFC 791 · IPv4</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc4632" target="_blank" rel="noopener">RFC 4632 · CIDR</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc1034" target="_blank" rel="noopener">RFC 1034 · DNS</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc9293" target="_blank" rel="noopener">RFC 9293 · TCP</a></li>
      <li><a href="https://www.rfc-editor.org/info/rfc8446" target="_blank" rel="noopener">RFC 8446 · TLS 1.3</a></li></ul>` : ""}
    </details>`;
}

function lessonTable({ caption, headings, rows }) {
  return `<div class="lesson-table-scroll" tabindex="0" role="region" aria-label="${esc(caption)}">
    <table><caption>${esc(caption)}</caption>
      <thead><tr>${headings.map(label => `<th scope="col">${esc(label)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(([label, ...cells]) => `<tr><th scope="row">${esc(label)}</th>${cells.map(cell =>
        `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  </div>`;
}

function lessonBits({ caption, split, groups }) {
  return `<figure class="lesson-bits" ${split ? "data-split" : ""}>
    <figcaption>${esc(caption)}</figcaption>
    <div class="lesson-octets">${groups.map(([first, host, value]) =>
      `<div><code><span class="bits-prefix">${esc(first)}</span><span class="bits-host">${esc(host)}</span></code>
        <span class="bits-decimal">${esc(value)}</span></div>`).join("")}</div>
    ${split ? '<p class="bits-legend"><span>前綴位元</span><span>主機位元</span></p>' : ""}
  </figure>`;
}

function detailedLesson({ sections, check, exam, sources }) {
  return sections.map(({ title, paragraphs, steps, flow, table, bits, snippet, pages }) =>
    `<section class="lesson-explanation">
      <h3>${esc(title)}</h3>
      ${(paragraphs ?? []).map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}
      ${flow ? `<ol class="lesson-flow" aria-label="${esc(flow.label)}">${flow.items.map((item, index) =>
        `<li>${index ? '<span aria-hidden="true">→</span>' : ""}<strong>${esc(item)}</strong></li>`).join("")}</ol>` : ""}
      ${steps ? `<ol class="lesson-steps">${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol>` : ""}
      ${snippet ? `<pre class="lesson-code" tabindex="0"><code>${esc(snippet)}</code></pre>` : ""}
      ${bits ? lessonBits(bits) : ""}
      ${table ? lessonTable(table) : ""}
      ${pages ? `<p class="lesson-reference-links">${pages.map(([page, title]) =>
        `<a href="${lessonHref(page)}">${esc(title)}</a>`).join("")}</p>` : ""}
    </section>`).join("") +
    (check ? `<div class="lesson-reading-check"><h3>容易寫漏的地方</h3><p>${esc(check)}</p></div>` : "") +
    (exam ? `<div class="callout"><h3>考場寫法</h3><p>${esc(exam)}</p></div>` : "") +
    (sources ? `<p class="lesson-reference-links">${sources.map(([title, url]) =>
      `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)} <span aria-hidden="true">↗</span></a>`).join("")}</p>` : "");
}

function slideCard(slide) {
  const notes = study?.lessons?.[slide.page];
  const cards = slide.terms.map(name => {
    const term = course.terms.get(name);
    return `<div class="term-inline"><dt><a href="${termPath(name, slide.page)}"><span lang="en">${esc(term.english)}</span> · ${esc(term.chinese)}</a></dt><dd>${esc(term.explanation)}</dd></div>`;
  }).join("");
  return `<article class="lesson" id="slide-${slide.page}">
    ${notes ? `<section class="lesson-key-point" aria-labelledby="lesson-key-title">
      <h2 id="lesson-key-title">本頁重點</h2><p>${esc(notes.summary)}</p>
    </section>` : ""}
    <div class="lesson-reading${notes ? " lesson-reading--detailed" : ""}">
      ${originalSlide(slide)}
      <div class="lesson-commentary">
        <section class="lesson-notes${notes ? " lesson-notes--detailed" : ""}" aria-labelledby="slide-notes-title">
          <h2 id="slide-notes-title">${notes ? "逐頁詳解" : "觀念筆記"}</h2>
          ${notes ? detailedLesson(notes) : slide.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}
          ${!notes && slide.exam ? `<div class="callout"><strong>考場寫法</strong><p>${esc(slide.exam)}</p></div>` : ""}
        </section>
        ${cards ? `<section class="lesson-terms" aria-labelledby="slide-terms-title">
          <h2 id="slide-terms-title">本頁術語</h2><dl class="terms-inline">${cards}</dl>
        </section>` : ""}
      </div>
    </div>
    ${route[4] && !route[3] ? reviewReturn(questionFor(route[4])) : ""}
    ${conceptCheck(slide.page)}
    ${courseActivities().filter(activity => activity.page === slide.page).map(activity => {
      const returnQuestion = activity.concept === route[3] && route[4];
      return `${StudyActivities.card(activity)}${returnQuestion ? reviewReturn(questionFor(returnQuestion)) : ""}`;
    }).join("")}
    ${relatedActivities(slide.page)}
    ${course.widgets?.[slide.page] ?? ""}
    ${supplementaryFigure(slide.page)}
    ${study?.forwarding && slide.page === 40 ? `<p class="activity-guide-link"><a href="${href("forwarding")}">考前對照：同一個封包經過 Switch 和 Router →</a></p>` : ""}
    </article>`;
}

function relatedActivities(page) {
  const activities = (course.activityLinks?.[page] ?? []).map(lookupActivity).filter(Boolean);
  return activities.length ? `<nav class="related-activities" aria-label="延伸互動實驗">
    <h3>接著動手試</h3>${activities.map(activity=>link(activityHref(activity), activity.title+" →")).join("")}</nav>` : "";
}

function conceptCheck(page) {
  const check = studyConceptChecks[course.id];
  if (check?.page !== page) return "";
  const activity = courseActivities().find(item => item.concept === check.activity);
  return `<section class="concept-check" aria-labelledby="concept-check-title">
    <h3 id="concept-check-title">${esc(check.title)}</h3>
    <p>${esc(check.compare)}</p><p>${esc(check.example)}</p>
    <form id="concept-check-form">
      <fieldset><legend lang="en">${esc(check.prompt)}</legend>${check.choices.map(([choice], index) =>
        `<label><input type="radio" name="choice" value="${index}" required><span lang="en">${esc(choice)}</span></label>`).join("")}</fieldset>
      <button class="btn secondary" type="submit">看這個選項的解析</button>
      <p class="concept-check-feedback" role="status"></p>
    </form>
    <footer>${activity ? `<a href="${activityHref(activity)}">用互動實驗驗證</a>` : ""}${check.sources.map(([paper, number, label]) =>
      `<a href="${StudySite.courseLink("past-exams", paper, number)}">${esc(label)}</a>`).join("")}</footer>
  </section>`;
}

function learn() {
  const unit = course.units.find(item => item.id === route[1]) ?? course.units[0];
  const slides = course.slides.filter(item => item.page >= unit.start && item.page <= unit.end);
  const slide = slides.find(item => item.page === route[2]) ?? slides[0];
  const checked = progress.done.includes(slide.page);
  const previousPage = slide.page > course.slides[0].page ? link(lessonHref(slide.page - 1), "← 上一頁", "text-link") :
    '<button type="button" class="btn text-link" disabled>← 上一頁</button>';
  const nextPage = slide.page < course.slides.at(-1).page ? link(lessonHref(slide.page + 1), "下一頁 →") :
    link(href("exam"), "模擬小考 →");
  return `<header class="reader-heading">
      <div><p class="reader-location"><a href="${href("overview")}" lang="en">${esc(course.label)}</a><span aria-hidden="true">/</span><span>${esc(unit.title)}</span></p>
        <h1>${esc(slide.title)}</h1></div>
      <div class="reader-heading-tools">
        <span class="reader-page-position">p.${slide.page} <span>/ ${course.slides.at(-1).page}</span></span>
        ${reviewButton("page", String(slide.page), slide.title, slide.page)}
      </div>
    </header>
    <button type="button" class="reader-ai-launch" data-page-study="ask" aria-haspopup="dialog">
      <span class="reader-ai-icon" aria-hidden="true">✦</span>
      <span class="reader-ai-label"><strong>AI 助教</strong><span>針對這一頁提問</span></span>
      <span class="reader-ai-arrow" aria-hidden="true">↗</span>
    </button>
    <div class="reader-bar">
      <nav class="reader-actions" aria-label="教材翻頁">
        ${previousPage}
        <button type="button" class="btn secondary" data-done="${slide.page}" aria-pressed="${checked}">${checked ? "✓ 已讀" : "標為已讀"}</button>
        ${nextPage}
      </nav>
      <div class="reader-tools">
        ${course.figurePages?.has(slide.page) ? '<button class="btn secondary reader-quick-zoom" data-open-slide type="button" aria-haspopup="dialog">放大投影片</button>' : ""}
        <button class="btn secondary reader-desktop-jump" type="button" data-open-page-jump aria-haspopup="dialog">跳頁 · p.${slide.page}</button>
      </div>
    </div>
    ${slideCard(slide)}
    <details class="page-note" ${progress.notes[slide.page] ? "open" : ""}>
      <summary>我的筆記</summary>
      <form id="page-note-form" data-page="${slide.page}">
        <label class="visually-hidden" for="page-note-text">p.${slide.page} 的個人筆記</label>
        <textarea class="field" id="page-note-text" name="note" rows="3" maxlength="500" placeholder="記一句自己的理解…">${esc(progress.notes[slide.page]?.text)}</textarea>
        <div class="actions"><button class="btn secondary" type="submit">儲存筆記</button>
          <button class="utility" type="button" id="page-note-remove" ${progress.notes[slide.page] ? "" : "hidden"}>刪除筆記</button>
          <span class="tool-status" id="page-note-status" role="status"></span></div>
      </form>
    </details>
    <nav class="pager" aria-label="延伸練習和討論">${link(href("practice", unit.id, "range", unit.start, slide.page), `練習 p.${unit.start}–${slide.page}`)}
      ${link(href("practice", unit.id), "練習本單元")}
      <button type="button" class="btn secondary" data-page-study="practice" aria-haspopup="dialog">生成練習題</button>
      ${link(href("past-exams", "page", slide.page), "本頁相關考古題")}
      ${StudyCommunity.enabled ? link(StudySite.courseLink("discussion", course.id, unit.id), "本單元討論") +
        link(StudySite.courseLink("discussion", course.id, unit.id, slide.page, "ask"), "問這一頁") : ""}
      ${reportButton("page", slide.page)}
    </nav>
    <nav class="reader-footer" aria-label="教材底部翻頁">${previousPage}
      <button class="btn reader-footer-jump" type="button" data-open-page-jump aria-haspopup="dialog" aria-label="目前第 ${slide.page} 頁，跳至其他頁">p.${slide.page}</button>
      ${nextPage}</nav>
    <dialog class="records-dialog reader-jump-dialog" id="reader-jump-dialog" aria-labelledby="page-jump-title">
      <div class="records-heading"><h2 id="page-jump-title">跳至教材頁</h2><form method="dialog"><button class="utility" type="submit" autofocus>關閉</button></form></div>
      <form id="page-jump" class="reader-jump"><label for="page-number">頁碼</label>
        <input class="field" id="page-number" type="number" inputmode="numeric" min="${course.slides[0].page}" max="${course.slides.at(-1).page}" required value="${slide.page}">
        <button class="btn" type="submit">前往</button></form>
      <nav class="page-links" aria-label="單元頁碼">${slides.map(item => `<a class="${progress.done.includes(item.page) ? "done" : ""}" data-page-link="${item.page}" ${item.page === slide.page ? 'aria-current="page"' : ""} href="${lessonHref(item.page)}">p.${item.page}</a>`).join("")}</nav>
      ${course.figurePages?.has(slide.page) ? `<button class="btn secondary slide-preference" data-slide-preference type="button"
        aria-pressed="${StudyPreferences.slidesOpen()}">自動顯示原投影片</button>` : ""}
    </dialog>`;
}

const glossFilters = new Map();
let activeGlossList;
let glossPages = new Map();
const alphabet = new Intl.Collator("en");

function glossDefaults() {
  return { query: "", order: "az", unit: "all", from: "", to: "", keyOnly: false, priority: false, scroll: 0, indexScroll: 0, term: "" };
}

function selectedGlossFilters() {
  if (!glossFilters.has(course.id)) glossFilters.set(course.id, glossDefaults());
  return glossFilters.get(course.id);
}

function glossEntries(filters) {
  const { query, keyOnly, priority, order, unit, from, to } = filters;
  const cleaned = query.trim().normalize("NFKC").toLocaleLowerCase();
  const aliasMatches = new Set(Object.entries(course.termAliases ?? {}).filter(([alias]) =>
    alias.toLocaleLowerCase().includes(cleaned)).map(([, name]) => name));
  const chapter = course.units.find(item => item.id === unit);
  const lower = Math.max(chapter?.start ?? 1, from === "" ? 1 : Number(from));
  const upper = Math.min(chapter?.end ?? Infinity, to === "" ? Infinity : Number(to));
  const limited = Boolean(chapter || from !== "" || to !== "");
  const matches = [];
  for (const term of course.terms.values()) {
    const key = Boolean(termDetails(term.english)?.exam);
    if (keyOnly && !key) continue;
    const found = aliasMatches.has(term.english) || [term.english, term.chinese, term.explanation]
      .some(text => text.normalize("NFKC").toLocaleLowerCase().includes(cleaned));
    if (!found) continue;
    const allPages = glossPages.get(term.english) ?? [];
    const pages = limited ? allPages.filter(page => page >= lower && page <= upper) : allPages;
    if (!limited || pages.length) matches.push({ term, key, pages, first: pages[0] ?? Infinity });
  }
  return matches.sort((a, b) => {
    if (priority && a.key !== b.key) return a.key ? -1 : 1;
    if (order === "pages" && a.first !== b.first) return a.first - b.first;
    return alphabet.compare(a.term.english, b.term.english) * (order === "za" ? -1 : 1);
  });
}

function updateGloss(filters) {
  const results = glossEntries(filters);
  const term = course.terms.get(canonicalTerm(route[1]));
  const selected = term ?? results[0]?.term;
  main.querySelector("#gloss-status").textContent = `顯示 ${results.length} / ${course.terms.size} 則`;
  const index = main.querySelector("#gloss-index");
  index.innerHTML = results.length ? `<ul>${results.map(({ term, key, pages }) =>
    `<li><a class="gloss-entry${key ? " is-key" : ""}" data-gloss-term="${esc(term.english)}"
      href="${termPath(term.english, pages[0])}" ${selected === term ? 'aria-current="true"' : ""}>
      <span class="gloss-entry-name"><strong lang="en">${esc(term.english)}</strong><small>${esc(term.chinese)}</small></span>
      <span class="gloss-entry-meta">${key ? '<span class="gloss-key-dot" aria-hidden="true"></span><span class="visually-hidden">複習重點</span>' : ""}
        ${pages.length ? `<span>p.${pages[0]}</span>` : ""}</span></a></li>`
  ).join("")}</ul>` : '<p class="empty">找不到符合目前條件的術語。</p>';
  index.scrollTop = filters.indexScroll;
  const detail = main.querySelector("#gloss-detail");
  if (!term) detail.innerHTML = selected ? glossaryDetail(selected, false) : "";
  detail.hidden = !selected;
}

function rememberGlossList() {
  if (!activeGlossList) return;
  const index = main.querySelector("#gloss-index");
  if (index?.clientHeight && getComputedStyle(index).overflowY === "auto") activeGlossList.indexScroll = index.scrollTop;
  if (!course.terms.has(canonicalTerm(route[1]))) activeGlossList.scroll = window.scrollY;
  activeGlossList = undefined;
}

function bindGlossary() {
  const form = main.querySelector("#gloss-filters");
  if (!form) return;
  const filters = selectedGlossFilters();
  activeGlossList = filters;
  if (route[1] && !course.terms.has(canonicalTerm(route[1]))) filters.query = route[1];
  const controls = ["query", "order", "unit", "keyOnly", "priority"];
  const apply = () => updateGloss(filters);
  const sync = () => {
    for (const name of [...controls, "from", "to"]) {
      const field = form.elements.namedItem(name);
      if (!field) continue;
      if (field.type === "checkbox") field.checked = filters[name];
      else field.value = filters[name];
    }
  };
  for (const name of controls) {
    const field = form.elements.namedItem(name);
    field?.addEventListener(name === "query" ? "input" : "change", () => {
      filters[name] = field.type === "checkbox" ? field.checked : field.value;
      filters.indexScroll = 0;
      apply();
    });
  }
  const message = form.querySelector("#gloss-range-message");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const from = form.elements.namedItem("from");
    const to = form.elements.namedItem("to");
    if (from.value && to.value && from.valueAsNumber > to.valueAsNumber) {
      message.textContent = "起始頁碼必須小於或等於結束頁碼。";
      from.focus();
      return;
    }
    filters.from = from.value;
    filters.to = to.value;
    filters.indexScroll = 0;
    message.textContent = from.value || to.value ? `已套用 p.${from.value || from.min}–${to.value || to.max}` : "";
    apply();
  });
  main.querySelector("[data-gloss-reset]").addEventListener("click", () => {
    Object.assign(filters, glossDefaults());
    message.textContent = "";
    sync();
    apply();
  });
  sync();
  if (filters.from || filters.to) {
    message.textContent = `已套用 p.${filters.from || form.elements.namedItem("from").min}–${filters.to || form.elements.namedItem("to").max}`;
  }
  apply();
}

function glossaryDetail(term, explicit = true) {
  const name = term.english;
  const detail = termDetails(name);
  const source = Number(route[2]);
  const slides = course.slides.filter(slide => slide.terms.includes(name));
  const fromLesson = slides.find(slide => slide.page === source);
  const page = fromLesson?.page ?? slides[0]?.page;
  const context = fromLesson ?? slides.find(slide => slide.paragraphs.length);
  const activity = lookupActivity(detail?.concept);
  const related = (detail?.related ?? []).filter(([other]) => course.terms.has(other));
  const nearby = !related.length && context ? context.terms.filter(other => other !== name).slice(0, 4) : [];
  const compare = study?.forwarding && forwardingTerms.has(name);
  return `<article class="term-detail${detail?.exam ? " gloss-key" : ""}" aria-labelledby="term-detail-title">
      ${explicit ? `<nav class="study-breadcrumb" aria-label="術語導覽"><a href="${href("terms")}">← 回術語索引</a></nav>` : ""}
      <header class="review-term-heading">${reviewButton("term", name, `${name} · ${term.chinese}`, page)}
        ${detail?.exam ? '<span class="review-tag">複習重點</span>' : ""}
        <h2 id="term-detail-title" tabindex="-1">${esc(term.chinese)}</h2><p class="term-english" lang="en">${esc(name)}</p></header>
      <p class="term-definition">${esc(term.explanation)}</p>
      ${slides.length ? `<div class="term-source-list"><span>原投影片</span>${slides.map(slide =>
        `<a href="${lessonHref(slide.page)}" aria-label="查看教材第 ${slide.page} 頁"${slide.page === source ? ' class="term-source-current"' : ""}>p.${slide.page}</a>`).join("")}</div>` : ""}
      ${detail?.explanation && detail.explanation !== term.explanation
        ? `<section class="term-context"><h2>深入了解</h2><p>${esc(detail.explanation)}</p></section>`
        : context ? `<section class="term-context"><h2>講義中的用法</h2>
          <p class="term-source"><a href="${lessonHref(context.page)}">p.${context.page} · ${esc(context.title)}</a></p>
          ${context.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}</section>` : ""}
      ${detail?.exam ? `<div class="term-review"><section><h2>題目怎麼判斷</h2><p>${esc(detail.exam)}</p></section>
        <section><h2>例子</h2><p>${esc(detail.example)}</p></section></div>` : ""}
      ${related.length ? `<section class="term-relations"><h2>相關術語</h2><ul>${related.map(([other, reason]) => {
        const relatedTerm = course.terms.get(other);
        return `<li><a href="${termPath(other)}">${esc(relatedTerm.chinese)} <span lang="en">· ${esc(other)}</span></a>
          <p>${esc(reason)}</p></li>`;
      }).join("")}</ul></section>` : ""}
      ${nearby.length ? `<section class="term-relations"><h2>同頁術語</h2><ul>${nearby.map(other => {
        const relatedTerm = course.terms.get(other);
        return `<li><a href="${termPath(other, context.page)}">${esc(relatedTerm.chinese)} <span lang="en">· ${esc(other)}</span></a>
          <p>${esc(relatedTerm.explanation)}</p></li>`;
      }).join("")}</ul></section>` : ""}
      ${activity || compare
        ? `<div class="actions">${activity ? link(activityHref(activity), "試做互動") : ""}
          ${compare ? link(href("forwarding"), "看 MAC／IP 對照") : ""}</div>` : ""}
    </article>`;
}

function glossary() {
  const term = course.terms.get(canonicalTerm(route[1]));
  const first = course.slides[0].page;
  const last = course.slides.at(-1).page;
  return `<header class="gloss-heading"><p class="small-label" lang="en">${esc(course.label)}</p><h1>術語表</h1></header>
    <div class="gloss-layout${term ? " has-term" : ""}">
      <aside class="gloss-browser" aria-label="術語索引">
    <form class="gloss-filters" id="gloss-filters" aria-label="術語篩選">
      <div class="gloss-filter-fields">
        <label>搜尋術語<input class="field" id="term-search" name="query" type="search" placeholder="輸入英文或中文"></label>
        <label>排序<select name="order"><option value="az">A → Z</option><option value="za">Z → A</option><option value="pages">依講義頁碼</option></select></label>
        <label>章節<select name="unit"><option value="all">全部章節</option>${course.units.map(unit =>
          `<option value="${esc(unit.id)}">${esc(unit.title)} · ${pageRange(unit)}</option>`).join("")}</select></label>
      </div>
      <details class="gloss-filter-actions"><summary>頁碼與複習重點</summary>
        <fieldset class="gloss-range"><legend>自訂頁碼</legend><div class="range-fields">
          <input class="field" type="number" name="from" aria-label="起始頁碼" inputmode="numeric" min="${first}" max="${last}" placeholder="${first}">
          <span aria-hidden="true">–</span>
          <input class="field" type="number" name="to" aria-label="結束頁碼" inputmode="numeric" min="${first}" max="${last}" placeholder="${last}">
          <button class="btn secondary" type="submit">套用頁碼</button>
        </div><p class="tool-status" id="gloss-range-message" role="status"></p></fieldset>
        ${study?.terms ? `<div class="gloss-review-options">
          <label class="check-label"><input type="checkbox" name="priority">複習重點置頂</label>
          <label class="check-label"><input type="checkbox" name="keyOnly" id="gloss-key-only">只看複習重點</label>
        </div>` : ""}
      </details>
    </form>
    <div class="gloss-index-status"><p class="tool-status" id="gloss-status" aria-live="polite"></p>
      <button class="text-button" type="button" data-gloss-reset>清除篩選</button></div>
    <nav class="gloss-index" id="gloss-index" aria-label="術語清單" tabindex="0"></nav></aside>
    <div class="gloss-detail-pane" id="gloss-detail">${term ? glossaryDetail(term) : ""}</div></div>`;
}

function answerChoices(question, options, name, selected = null) {
  return question.options.map((option, index) => `<label class="option">
    <input type="radio" name="${name}" value="${index}" ${index === selected ? "checked" : ""}>
    <span class="letter">${labels[index]}.</span><span${options ? "" : ' lang="en"'}>${esc(options?.[index] ?? option.label)}</span>
  </label>`).join("");
}

function guidePoint(step) {
  const question = questionFor(step.question);
  return question ? Number(question.options[progress.guide?.[step.question]]?.correct === true) : 0;
}

function guide() {
  const steps = study.guide;
  const active = Math.max(0, steps.findIndex(step => step.id === route[1]));
  const step = steps[active];
  const activity = lookupActivity(step.concept);
  const question = questionFor(step.question);
  const done = steps.reduce((count, item) => count + guidePoint(item), 0);
  return head(sectionNames.guide, "一台筆電剛連上 Wi‑Fi。跟著它取得 IP、查到網站位址，再建立連線。") +
    `<div class="guide-track"><nav aria-label="入門路線"><ol>${steps.map((item, index) =>
      `<li><a href="${href("guide", item.id)}"${index === active ? ' aria-current="step"' : ""}>
        <span>${index + 1}</span><strong>${esc(item.protocol)}</strong><small>${esc(item.title)} · ${item.minutes} 分鐘${guidePoint(item) ? " · 完成" : ""}</small></a></li>`).join("")}</ol></nav>
      <p class="tool-status" id="guide-progress">${done} / ${steps.length} 站答對</p></div>
    <article class="guide-panel">
      <p class="small-label">第 ${active + 1} 站 · ${esc(step.protocol)}</p>
      <h2>${esc(step.title)}</h2><p>${esc(step.why)}</p>
      ${activity ? `<div class="guide-lab">${StudyActivities.card(activity)}</div>` : ""}
      <form id="guide-question" class="guide-question">
        <fieldset><legend>${esc(step.prompt)}</legend>${answerChoices(question, step.options, "guide-option", progress.guide?.[question.id])}</fieldset>
        <div class="actions"><button class="btn" type="submit">確認答案</button>
          ${link(termPath(step.protocol), "看術語詳解")}</div>
        <div id="guide-feedback" role="status" aria-atomic="true"></div>
      </form>
      <div class="guide-next" id="guide-next" ${guidePoint(step) ? "" : "hidden"}>
        ${steps[active + 1] ? link(href("guide", steps[active + 1].id), `下一站 · ${steps[active + 1].protocol} →`)
          : `<p id="guide-finish">${done === steps.length ? "三站通過。可以接著練習或看 MAC／IP 對照。" : "TCP 已通過。還可以回到前面的站完成練習。"}</p>
          <div class="actions">${link(href("forwarding"), "看 MAC／IP 考前速查")}${link(href("practice"), "到題庫練習")}</div>`}
      </div>
    </article>`;
}

function bindGuide() {
  const steps = study.guide;
  const step = steps.find(item => item.id === route[1]) ?? steps[0];
  const question = questionFor(step.question);
  const activity = main.querySelector(".guide-lab .study-activity");
  if (activity) {
    activity.open = true;
    bindActivity(activity);
  }
  const form = main.querySelector("#guide-question");
  const feedback = main.querySelector("#guide-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const selection = form.querySelector("input:checked");
    if (!selection) {
      feedback.textContent = "請先選一個答案。";
      form.querySelector("input").focus();
      return;
    }
    const chosen = Number(selection.value);
    const option = question.options[chosen];
    progress.guide ??= {};
    if (option.correct || !guidePoint(step)) progress.guide[question.id] = chosen;
    persist();
    feedback.innerHTML = `<div class="feedback ${option.correct ? "good" : "bad"}">
      <strong>${option.correct ? "答對了" : "再試一次"}</strong><p>${esc(option.explanation)}</p></div>`;
    main.querySelector("#guide-next").hidden = !guidePoint(step);
    const done = steps.reduce((count, item) => count + guidePoint(item), 0);
    main.querySelector("#guide-progress").textContent = `${done} / ${steps.length} 站答對`;
    main.querySelector("#guide-finish")?.replaceChildren(done === steps.length
      ? "三站通過。可以接著練習或看 MAC／IP 對照。" : "TCP 已通過。還可以回到前面的站完成練習。");
    if (option.correct) main.querySelector('[aria-current="step"] small').textContent = `${step.title} · ${step.minutes} 分鐘 · 完成`;
  });
}

function forwarding() {
  return head("MAC／IP 考前速查", "筆電 A 把封包送給另一個子網的主機 B。這個例子使用 Ethernet，路由器沒有做 NAT。") +
    `<article class="forward-panel">
      <ol class="forward-path" aria-label="封包路徑">
        ${["筆電 A", "Switch", "Router R", "主機 B"].map((name, index) => `<li data-forward-node="${index}">${name}</li>`).join("")}
      </ol>
      <div class="forward-controls" role="group" aria-label="觀察哪一步">
        ${study.forwarding.map((stage, index) => `<button class="btn secondary" type="button" data-forward-step="${index}" aria-pressed="${index === 0}">${stage.action}</button>`).join("")}
      </div>
      <div id="forward-detail" aria-live="polite" aria-atomic="true"></div>
      <details class="forward-review"><summary>考前自問：Router 換了哪些欄位？</summary>
        <p>同一份 IP 封包在這個例子裡保留來源與目的 IP。Router 為出站鏈路換上新的來源與目的 MAC，IPv4 TTL 減 1。</p>
      </details>
      <div class="actions">${link(termPath("Switch"), "交換器詞條")}${link(termPath("Router"), "路由器詞條")}
        ${link(questionPath("practice-146"), "試做下一跳題")}</div>
    </article>`;
}

function bindForwarding() {
  const controls = [...main.querySelectorAll("[data-forward-step]")];
  const nodes = [...main.querySelectorAll("[data-forward-node]")];
  function showStage(index) {
    const stage = study.forwarding[index];
    controls.forEach((control, position) => control.setAttribute("aria-pressed", String(position === index)));
    nodes.forEach((node, position) => {
      node.dataset.state = position === stage.from ? "send" : position === stage.to ? "receive" : "";
    });
    main.querySelector("#forward-detail").innerHTML = `<p class="forward-summary">${esc(stage.summary)}</p>
      <dl class="forward-fields"><div${index === 2 ? ' class="forward-changed"' : ""}><dt>本段的來源 → 目的 MAC</dt><dd>${esc(stage.mac)}</dd></div>
      <div><dt>封包的來源 → 目的 IP</dt><dd>${esc(stage.ip)}</dd></div>
      <div${index === 2 ? ' class="forward-changed"' : ""}><dt>IPv4 TTL</dt><dd>${stage.ttl}</dd></div></dl>`;
  }
  controls.forEach((control, index) => control.addEventListener("click", () => showStage(index)));
  showStage(0);
}

function activityIndex() {
  const activities = courseActivities();
  return head("互動實驗", "跟著範例做一次，再換條件看看結果怎麼變。") +
    (study?.guide ? `<aside class="review-entry"><div><strong>${sectionNames.guide}</strong>
      <p>適合學完 DHCP、DNS 和 TCP 後複習，約 10 分鐘。</p></div>${link(href("guide"), "開始複習")}</aside>` : "") +
    StudyActivities.starterLinks(activities, activityHref) +
    (hasTemplates() ? `<aside class="review-entry"><div><strong>C++ 競程模板</strong><p>沿著互動實驗讀虛擬碼，再下載可以直接編譯的範例。</p></div>${link(href("templates"), "開啟模板")}</aside>` : "") +
    `<div class="toolbar"><label for="activity-search">找活動</label>
    <input class="field search" id="activity-search" type="search" placeholder="觀念名稱或頁碼"></div>
    <p class="activity-index-count">${activities.length} 個活動，依教材單元排列</p>
    <div id="activity-index" aria-live="polite">${StudyActivities.indexCards(activities, course, activityHref)}</div>`;
}

function templates() {
  return head("C++ 競程模板", "每份範例都有 GNU++17 程式、範例輸入輸出和可展開的段落解說。") + Lecture06Templates.render();
}

const originalPdfPath = () => `assets/${course.id}/original.pdf`;

function originalSlide({ page, title }) {
  if (!course.figurePages?.has(page)) return "";
  const source = `assets/${course.id}/slides/slide-${page}.jpg`;
  const textKey = `${course.id}/${page}`;
  const caption = `<span class="slide-figure-page">p.${page}</span>
    <button type="button" class="text-button" data-open-slide aria-haspopup="dialog">放大投影片</button>`;
  const details = `<details class="slide-figure original-figure" ${StudyPreferences.slidesOpen() ? "open" : ""}><summary>原投影片</summary>
    ${lazyFigure(source, `${course.label} 原投影片第 ${page} 頁 · ${title}`, caption, "正在載入投影片…", { textKey })}
  </details>`;
  return study?.translations?.[page] ? `<div class="original-slide-region">
    ${details}
    <button type="button" class="slide-translation-trigger utility" data-translate-slide="${page}" aria-haspopup="dialog">中英對照</button>
  </div>` : details;
}

function supplementaryFigure(page) {
  const illustration = course.illustrations?.[page];
  if (!illustration) return "";
  const { file, alt, caption, credit, source, license, licenseUrl, width, height } = illustration;
  const path = `assets/${course.id}/illustrations/${file}`;
  const attribution = `<span class="figure-credit">${esc(credit)} · <a href="${esc(source)}" target="_blank" rel="noopener">圖片來源</a> ·
    ${licenseUrl ? `<a href="${esc(licenseUrl)}" target="_blank" rel="noopener">${esc(license)}</a>` : esc(license)}</span>`;
  return `<details class="slide-figure supplementary-figure"><summary>查看補充插圖</summary>
    ${lazyFigure(path, alt, `<span>${esc(caption)}</span>${attribution}`, "正在載入插圖…", { width, height })}
  </details>`;
}

function lazyFigure(path, alt, caption, loadingLabel, { width, height, textKey } = {}) {
  const size = width && height ? ` width="${width}" height="${height}"` : "";
  const text = textKey ? ` data-slide-text="${esc(textKey)}" draggable="false"` : "";
  const image = `<img decoding="async" alt="${esc(alt)}" data-slide-src="${esc(path)}" data-loading-label="${loadingLabel}"${text}${size} hidden>`;
  return `<figure>
    <p class="slide-image-status tool-status" role="status"></p>
    ${textKey ? `<div class="slide-text-frame">${image}</div>` : image}
    <figcaption>${caption}</figcaption>
  </figure>`;
}

function loadFigure(details) {
  if (!details?.open) return;
  const image = details.querySelector("img");
  const status = details.querySelector(".slide-image-status");
  const textKey = image.dataset.slideText;
  const frame = image.parentElement;
  const textError = "文字載入失敗。請收合後再展開重試。";
  if (textKey && !frame.querySelector(".slide-text-layer") && !frame.hasAttribute("data-loading-text")) {
    frame.setAttribute("data-loading-text", "");
    StudySlideText.create(textKey).then(layer => {
      frame.removeAttribute("data-loading-text");
      frame.toggleAttribute("data-text-unavailable", !layer);
      if (layer) image.after(layer);
      if (!image.hidden) status.textContent = layer ? "" : textError;
    });
  }
  if (image.hasAttribute("src")) return;
  status.textContent = image.dataset.loadingLabel;
  image.onload = () => {
    image.hidden = false;
    status.textContent = frame.hasAttribute("data-text-unavailable") ? textError : "";
  };
  image.onerror = () => {
    image.removeAttribute("src");
    status.textContent = "圖片載入失敗。請收合後再展開重試。";
  };
  image.src = image.dataset.slideSrc;
}

main.addEventListener("toggle", event => {
  const details = event.target;
  if (details.matches?.(".study-activity[open]")) bindActivity(details);
  if (details.matches?.(".slide-figure[open]")) loadFigure(details);
}, true);

function ipv4Number(address) {
  const parts = address.trim().split(".");
  if (parts.length !== 4 || parts.some(value => !/^\d{1,3}$/.test(value) || Number(value) > 255)) return null;
  return parts.reduce((acc, value) => acc * 256 + Number(value), 0);
}

function ipv4String(address) {
  return [24,16,8,0].map(shift => (address >>> shift) & 255).join(".");
}

function subnetResult(address, prefix) {
  const value = ipv4Number(address);
  if (value === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  const size = 2 ** (32 - prefix);
  const network = Math.floor(value / size) * size;
  return {
    mask: ipv4String(2 ** 32 - size), network: ipv4String(network),
    last: ipv4String(network + size - 1), size
  };
}

function fragments(total, mtu) {
  const payloadSize = total - 20;
  if (!Number.isInteger(total) || !Number.isInteger(mtu) || total < 20 || total > 65535 || mtu < 68 || mtu > 65535) return [];
  if (total <= mtu) return [{ data: payloadSize, length: total, offset: 0, more: 0 }];
  const capacity = mtu - 20;
  const alignedData = Math.floor(capacity / 8) * 8;
  const result = [];
  for (let start = 0; start < payloadSize;) {
    const remaining = payloadSize - start;
    const data = remaining <= capacity ? remaining : alignedData;
    result.push({ data, length: data + 20, offset: start / 8, more: Number(start + data < payloadSize) });
    start += data;
  }
  return result;
}

function bindActivity(element) {
  const activity = courseActivities().find(item => item.concept === element.dataset.activity);
  if (activity) StudyActivities.bind(element, activity, { ipv4Number, ipv4String, subnetResult, fragments });
}


let practiceFilter;
const practiceFeedback = new Set();
let practicePool = [];
let audioContext;

function resetPracticeFilters() {
  practiceFilter = { level: "all", scope: "all", concept: "all", readOnly: false, from: null, to: null, relatedTo: "", offset: 0 };
}

function inPracticeRange(question) {
  const [, unit] = route;
  const { from, to, readOnly } = practiceFilter;
  return (unit === "all" || question.unit === unit)
    && (from === null || question.page >= from)
    && (to === null || question.page <= to)
    && (!readOnly || progress.done.includes(question.page));
}

function lastAnswer(question) {
  return question.options[progress.practice[question.id]];
}

function wasWrong(question) {
  return lastAnswer(question)?.correct === false;
}

function matchesPracticeLevel(question) {
  return practiceFilter.level === "all" || question.level === practiceFilter.level;
}

function matchesPracticeFilters(question) {
  const { concept, scope, relatedTo } = practiceFilter;
  return inPracticeRange(question)
    && matchesPracticeLevel(question)
    && (concept === "all" || question.concept === concept)
    && question.id !== relatedTo
    && (scope === "all" || (scope === "wrong" && wasWrong(question)) || (scope === "fresh" && !lastAnswer(question)));
}

function hasVariant(question) {
  return course.practice.some(candidate => candidate.concept === question.concept
    && candidate.id !== question.id && inPracticeRange(candidate));
}

function relatedQuestion(question) {
  const candidates = course.practice.filter(candidate => candidate.concept === question.concept && candidate.id !== question.id);
  return candidates.find(candidate => !lastAnswer(candidate)) ?? candidates.find(wasWrong) ?? candidates[0];
}

function variantLink(question) {
  const variant = relatedQuestion(question);
  return variant ? link(href("practice", "all", variant.id, "variant", question.id), "同觀念再練一題") : "";
}

function reviewReturn(question) {
  return `<nav class="activity-return" aria-label="回到錯題">
    ${link(questionPath(question.id), "← 回原題")}${variantLink(question)}
  </nav>`;
}

function wrongFeedbackLinks(question, activity, term) {
  const filtered = !route[2] && practiceFilter.scope !== "wrong";
  const variant = filtered
    ? hasVariant(question) && `<button type="button" class="btn secondary" data-practice-action="related" data-id="${question.id}">同觀念再練一題</button>`
    : variantLink(question);
  return `<div class="mistake-next">
    <h2>回練 ${esc(course.concepts[question.concept])}</h2>
    <div class="feedback-actions">
      ${link(reviewLessonHref(question), `看教材 p.${question.page}`)}
      ${activity ? link(activityHref(activity, question.id), "做同觀念的實驗") : ""}
      ${variant || ""}
      <button type="button" class="btn secondary" data-page-study="practice" data-study-page="${question.page}" aria-haspopup="dialog">依這頁出題</button>
    </div>
    ${term || (study?.forwarding && forwardingConcepts.has(question.concept)) ? `<div class="feedback-actions">
      ${term ? `<a href="${termPath(term)}">看術語詳解</a>` : ""}
      ${study?.forwarding && forwardingConcepts.has(question.concept) ? `<a href="${href("forwarding")}">看 MAC／IP 對照</a>` : ""}
    </div>` : ""}
    ${filtered && !variant && relatedQuestion(question) ? '<p class="tool-status">放寬出題範圍可練同觀念的其他題目。</p>' : ""}
  </div>`;
}

function questionFeedback(question, chosen) {
  const index = question.options.findIndex(option => option.correct);
  const correct = index === chosen;
  const activity = lookupActivity(question.concept);
  const term = Object.entries(study?.terms ?? {}).find(([, detail]) => detail.concept === question.concept)?.[0];
  const cleared = correct && !route[2] && practiceFilter.scope === "wrong";
  const moreWrong = cleared && course.practice.some(matchesPracticeFilters);
  return `<div class="feedback ${correct ? "good" : "bad"}" tabindex="-1">
    <strong>${cleared ? "✓ 答對了，已從待回練的錯題移除" : correct ? "✓ 答對了" : `答錯了 · 正確答案 ${labels[index]}`}</strong>
    <ul>${question.options.map((option, i) => `<li><b>${labels[i]} ${option.correct ? "正確" : "不適用"}。</b> ${esc(option.explanation)}</li>`).join("")}</ul>
    ${correct ? `<div class="feedback-actions">
      <a href="${lessonHref(question.page)}">回教材 p.${question.page}</a>
      ${activity ? link(activityHref(activity), "試做同觀念的互動") : ""}
      ${cleared ? `<button type="button" class="btn secondary" data-practice-action="continue-wrong">${moreWrong ? "繼續回練 →" : "完成回練"}</button>` : ""}
    </div>` : wrongFeedbackLinks(question, activity, term)}</div>`;
}

function questionCard(question) {
  const savedAnswer = progress.practice[question.id];
  const graded = practiceFeedback.has(question.id) && Boolean(lastAnswer(question));
  return `<article class="question" data-question="${question.id}">
    <p class="qmeta">第 ${course.practice.indexOf(question) + 1} 題 · ${esc(question.level)} · p.${question.page} · ${esc(course.concepts[question.concept])}</p>
    <fieldset ${graded ? "disabled" : ""}><legend${englishQuestions() ? ' lang="en"' : ""}>${esc(question.prompt)}</legend>
    ${question.options.map((option, index) => {
      const selected = graded && index === savedAnswer;
      const marker = graded && option.correct ? "正解" : selected ? "你的答案" : "";
      const state = graded && option.correct ? " is-correct" : selected ? " is-incorrect" : "";
      return `<label class="option${state}"><input type="radio" name="${question.id}" value="${index}" ${selected ? "checked" : ""}>
        <span class="letter">${labels[index]}.</span><span${englishQuestions() ? ' lang="en"' : ""}>${esc(option.label)}</span>${marker ? `<span class="option-marker">${marker}</span>` : ""}</label>`;
    }).join("")}
    </fieldset><div class="actions">
      <button type="button" class="btn ${graded ? "secondary" : ""}" data-practice-action="${graded ? "retry" : "check"}" data-id="${question.id}">${graded ? "重作本題" : "確認答案"}</button>
      ${!graded && lastAnswer(question) ? `<button type="button" class="btn secondary" data-practice-action="review" data-id="${question.id}">${wasWrong(question) ? "看錯題解析" : "看上次解析"}</button>` : ""}
      ${reviewButton("question", question.id, question.prompt, question.page)}
      ${reportButton("question", question.page, question.id)}
      <span class="tool-status" data-answer-status role="status"></span></div>
      ${graded ? questionFeedback(question, savedAnswer) : ""}</article>`;
}

function updateWrongTopics() {
  const target = main.querySelector("#wrong-topics");
  const counts = new Map();
  if (practiceFilter.scope === "wrong") {
    for (const question of course.practice.filter(question => inPracticeRange(question) && matchesPracticeLevel(question) && wasWrong(question))) {
      counts.set(question.concept, (counts.get(question.concept) ?? 0) + 1);
    }
  }
  target.hidden = !counts.size;
  target.innerHTML = counts.size ? `<strong>錯題觀念</strong><div class="topic-links">${[...counts].map(([key, count]) =>
    `<button type="button" class="topic-link" data-practice-action="topic" data-id="${key}" aria-pressed="${practiceFilter.concept === key}">
      ${esc(course.concepts[key])} <span>${count}</span></button>`).join("")}</div>` : "";
}

function updatePracticeStats() {
  const attempted = course.practice.filter(lastAnswer);
  const correct = attempted.filter(question => lastAnswer(question).correct);
  const remaining = practiceFilter.scope === "wrong"
    ? `待回練 ${course.practice.filter(matchesPracticeFilters).length} 題` : `本輪 ${practicePool.length} 題`;
  main.querySelector("#practice-status").textContent =
    `${remaining} · 累計作答 ${attempted.length} 題 · 最近答對 ${correct.length} 題`;
  const { from, to, scope } = practiceFilter;
  main.querySelector("#practice-heading").textContent = scope === "wrong" ? "錯題回練" : "選擇練習";
  main.querySelector("#practice-intro").textContent = scope === "wrong"
    ? "用「看錯題解析」回教材或做實驗，再練一道同觀念的題目。原題答對後就會從錯題清單移除。"
    : "用頁碼或觀念縮小範圍。確認答案後可以看解析，答錯時可以換題練同一個觀念。";
  const range = from !== null || to !== null ? ` · p.${from ?? course.slides[0].page}–${to ?? course.slides.at(-1).page}` : "";
  main.querySelector("#practice-range-caption").textContent = `${scope === "wrong" ? " · 錯題" : ""}${range}`;
  updateWrongTopics();
}

function updatePracticeConcepts() {
  const visible = new Set(course.practice.filter(inPracticeRange).map(question => question.concept));
  if (!visible.has(practiceFilter.concept)) practiceFilter.concept = "all";
  const select = main.querySelector("#practice-concept");
  select.innerHTML = `<option value="all">全部觀念</option>${[...visible].map(key =>
    `<option value="${key}">${esc(course.concepts[key])}</option>`).join("")}`;
  select.value = practiceFilter.concept;
}

function updatePractice() {
  practicePool = course.practice.filter(matchesPracticeFilters);
  if (practiceFilter.relatedTo) {
    practicePool.sort((left, right) => Number(Boolean(lastAnswer(left))) - Number(Boolean(lastAnswer(right))));
  }
  const perPage = singleQuestion("practice") ? 1 : 10;
  main.dataset.singlePractice = String(perPage === 1);
  const lastOffset = Math.max(0, (Math.ceil(practicePool.length / perPage) - 1) * perPage);
  practiceFilter.offset = Math.max(0, Math.min(lastOffset, Math.floor(practiceFilter.offset / perPage) * perPage));
  const { offset, relatedTo, readOnly } = practiceFilter;
  const page = practicePool.slice(offset, offset + perPage);
  const empty = readOnly && !progress.done.length
    ? `目前還沒有已讀頁。到<a href="${lessonHref(progress.lastPage)}">逐頁教學</a>標記讀完的頁面，或關閉「只考已讀頁」。`
    : practiceFilter.scope === "wrong" ? "這個範圍目前沒有待回練的錯題。"
      : "目前沒有符合條件的題目。可調整頁碼、單元或其他篩選。";
  main.querySelector("#quiz-list").innerHTML = page.map(questionCard).join("") || `<div class="empty">${empty}</div>`;
  main.querySelector("#practice-pager").innerHTML = practicePool.length > perPage
    ? `<button type="button" class="btn secondary" data-offset="-${perPage}" ${offset === 0 ? "disabled" : ""}>${perPage === 1 ? "← 上一題" : "← 上一頁題目"}</button>
       ${perPage === 1 ? `<label class="question-jump">第 <select id="practice-question" aria-label="跳至第幾題">${practicePool.map((_, index) =>
         `<option value="${index}" ${index === offset ? "selected" : ""}>${index + 1}</option>`).join("")}</select> / ${practicePool.length} 題</label>`
       : `<span class="tool-status">${offset + 1}–${offset + page.length} / ${practicePool.length}</span>`}
       <button type="button" class="btn secondary" data-offset="${perPage}" ${offset + perPage >= practicePool.length ? "disabled" : ""}>${perPage === 1 ? "下一題 →" : "下一頁題目 →"}</button>` : "";
  main.querySelector("#practice-related").hidden = !relatedTo;
  updatePracticeStats();
}

function soundToggle() {
  const enabled = soundEnabled();
  return `<button class="sound-button" type="button" aria-pressed="${enabled}" data-practice-action="sound">答對音效<span aria-hidden="true">${enabled ? "開" : "關"}</span></button>`;
}

function practice() {
  const focusQuestion = questionFor(route[2]);
  if (focusQuestion) {
    const original = route[4];
    return head(original ? "同觀念再練" : "單題練習", course.concepts[focusQuestion.concept]) +
      `<div class="study-breadcrumb practice-single-tools">
        ${original ? `<a href="${questionPath(original)}">← 回原題</a>` : `<a href="${href("practice", focusQuestion.unit)}">← 回這個單元的題庫</a>`}
        <a href="${wrongQuestionsPath()}">本章錯題</a>${soundToggle()}</div>
        <div id="quiz-list" class="quiz-list" tabindex="-1">${questionCard(focusQuestion)}</div>`;
  }
  const { from, to, readOnly, level, scope } = practiceFilter;
  const firstPage = course.slides[0].page;
  const lastPage = course.slides.at(-1).page;
  return `<header class="page-head"><p class="small-label">${esc(course.label)}</p>
    <h1 id="practice-heading">選擇練習</h1><p id="practice-intro"></p></header>` +
    `<details class="practice-refine" ${compactLayout.matches ? "" : "open"}><summary>出題範圍與設定<span id="practice-range-caption"></span></summary>
    <div class="practice-controls" aria-label="出題範圍">
      <div class="practice-filters">
        <label>單元<select id="practice-unit"><option value="all">全部單元</option>${course.units.map(unit =>
          `<option value="${unit.id}" ${unit.id === route[1] ? "selected" : ""}>${esc(unit.title)}</option>`).join("")}</select></label>
        <label>觀念<select id="practice-concept"></select></label>
        <label>題型<select id="practice-level"><option value="all">全部題型</option>${[...new Set(course.practice.map(question => question.level))].map(type =>
          `<option ${type === level ? "selected" : ""}>${type}</option>`).join("")}</select></label>
        <label>紀錄<select id="practice-scope">${[["all", "全部紀錄"], ["fresh", "未作答"], ["wrong", "錯題"]].map(([key, label]) =>
          `<option value="${key}" ${key === scope ? "selected" : ""}>${label}</option>`).join("")}</select></label>
      </div>
      <form class="practice-range" id="practice-range" aria-label="頁碼範圍">
        <span class="range-title">頁碼範圍</span>
        <div class="range-fields">
          <input type="number" inputmode="numeric" class="field" id="range-from" aria-label="起始頁碼" min="${firstPage}" max="${lastPage}" step="1" placeholder="${firstPage}" value="${from ?? ""}">
          <span aria-hidden="true">–</span>
          <input type="number" inputmode="numeric" class="field" id="range-to" aria-label="結束頁碼" min="${firstPage}" max="${lastPage}" step="1" placeholder="${lastPage}" value="${to ?? ""}">
          <button class="btn secondary" type="submit">套用頁碼</button>
        </div>
        <p id="range-message" class="tool-status" role="status"></p>
      </form>
      <div class="practice-settings">
        <label class="check-label"><input id="practice-read" type="checkbox" ${readOnly ? "checked" : ""}>只考已讀頁</label>
        <button class="text-button" type="button" data-practice-action="clear">清除篩選</button>
        ${soundToggle()}
      </div>
    </div></details>
    <div class="practice-summary"><span class="tool-status" id="practice-status" aria-live="polite"></span>
      <button class="text-button" type="button" id="practice-related" data-practice-action="stop-related" hidden>結束換題</button></div>
    <div class="wrong-topics" id="wrong-topics" hidden></div>
    <div class="practice-questions">
      <div class="quiz-list" id="quiz-list" tabindex="-1"></div>
      <div class="pager question-pager" id="practice-pager"></div>
    </div>
    <div class="actions">${link(href("exam"), "正式小考模擬 →")}</div>`;
}

function bindPractice() {
  const updateFilters = () => {
    if (practicePreset()) {
      route[3] = undefined;
      history.replaceState(history.state, "", href("practice", route[1]));
    }
    practiceFilter.offset = 0;
    practiceFilter.relatedTo = "";
    updatePracticeConcepts();
    updatePractice();
  };
  main.querySelector("#practice-unit").addEventListener("change", event => {
    location.hash = href("practice", event.target.value);
  });
  for (const [id, key] of [["#practice-level", "level"], ["#practice-scope", "scope"], ["#practice-concept", "concept"]]) {
    main.querySelector(id).addEventListener("change", event => {
      practiceFilter[key] = event.target.value;
      updateFilters();
    });
  }
  main.querySelector("#practice-read").addEventListener("change", event => {
    practiceFilter.readOnly = event.target.checked;
    updateFilters();
  });
  main.querySelector("#practice-range").addEventListener("submit", event => {
    event.preventDefault();
    const fromField = main.querySelector("#range-from");
    const toField = main.querySelector("#range-to");
    const status = main.querySelector("#range-message");
    const from = fromField.value ? fromField.valueAsNumber : null;
    const to = toField.value ? toField.valueAsNumber : null;
    if (from !== null && to !== null && from > to) {
      status.textContent = "起始頁碼須小於或等於結束頁碼。";
      fromField.focus();
      return;
    }
    practiceFilter.from = from;
    practiceFilter.to = to;
    status.textContent = from === null && to === null ? "已清除頁碼範圍。" : `已套用 p.${from ?? fromField.min}–${to ?? toField.max}`;
    updateFilters();
  });
  updatePracticeConcepts();
  updatePractice();
}

function playCorrectSound() {
  if (!soundEnabled()) return;
  const Audio = window.AudioContext ?? window.webkitAudioContext;
  if (!Audio) return;
  try {
    audioContext ??= new Audio();
    if (audioContext.state !== "running") audioContext.resume().catch(() => {});
    const start = audioContext.currentTime + .018;
    // Three ascending notes, with a quiet overtone that fades before the body of each note.
    const notes = [[587.33, 0, .17], [739.99, .07, .19], [880, .15, .29]];
    const volumeScale = Number(StudyPreferences.get("volume")) / 60;
    for (const [pitch, delay, duration] of notes) {
      const onset = start + delay;
      for (const [ratio, gain, decay] of [[1, .083, duration], [2.01, .016, .10], [3, .005, .06]]) {
        const volume = gain * volumeScale;
        const tone = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        tone.frequency.value = pitch * ratio;
        envelope.gain.setValueAtTime(.0001, onset);
        envelope.gain.exponentialRampToValueAtTime(volume, onset + .009);
        envelope.gain.exponentialRampToValueAtTime(volume * .24, onset + decay * .38);
        envelope.gain.exponentialRampToValueAtTime(.0001, onset + decay);
        tone.connect(envelope);
        envelope.connect(audioContext.destination);
        tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
        tone.start(onset);
        tone.stop(onset + decay + .005);
      }
    }
  } catch {
    // Visual feedback remains available if audio cannot start.
  }
}

function celebrate(option, feedback) {
  if (StudyPreferences.get("confetti") === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const selected = option.getBoundingClientRect();
  const origin = selected.bottom > 30 && selected.top < window.innerHeight - 36
    ? selected : feedback.getBoundingClientRect();
  const burst = document.createElement("div");
  burst.className = "correct-burst";
  burst.setAttribute("aria-hidden", "true");
  const originX = Math.min(window.innerWidth - 34, Math.max(34, origin.left + origin.width * .55));
  const originY = Math.max(55, Math.min(window.innerHeight - 36, origin.top + origin.height / 2));
  burst.style.setProperty("--origin-x", `${originX}px`);
  burst.style.setProperty("--origin-y", `${originY}px`);
  const colors = ["#a44232", "#e88763", "#c19642", "#486f99", "#2f7b63", "#9676a1"];
  const spread = Math.min(155, window.innerWidth * .36);
  const lift = Math.min(100, originY - 30);
  for (let index = 0; index < 28; index++) {
    const ribbon = document.createElement("i");
    const direction = (index / 27) * 2 - 1;
    const drift = direction * spread * (.64 + .36 * Math.random());
    const x = Math.max(10 - originX, Math.min(window.innerWidth - 10 - originX, drift));
    const y = -lift * (.35 + .65 * Math.random()) * (1 - .35 * Math.abs(direction));
    const spin = (direction < 0 ? -1 : 1) * (145 + Math.random() * 410);
    ribbon.style.setProperty("--apex-x", `${x * .65}px`);
    ribbon.style.setProperty("--apex-y", `${y}px`);
    ribbon.style.setProperty("--land-x", `${x}px`);
    ribbon.style.setProperty("--land-y", `${y + 85 + Math.random() * 76}px`);
    ribbon.style.setProperty("--spin", `${spin}deg`);
    ribbon.style.setProperty("--ribbon-width", `${4 + Math.random() * 4}px`);
    ribbon.style.setProperty("--ribbon-length", `${10 + Math.random() * 12}px`);
    ribbon.style.setProperty("--duration", `${740 + Math.round(Math.random() * 210)}ms`);
    ribbon.style.setProperty("--delay", `${Math.round(Math.random() * 65)}ms`);
    ribbon.style.backgroundColor = colors[index % colors.length];
    burst.append(ribbon);
  }
  document.querySelector(".correct-burst")?.remove();
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 1050);
}

function handlePracticeAnswer(control, action, id) {
  if (action === "sound") {
    const enabled = !soundEnabled();
    setSound(enabled);
    control.setAttribute("aria-pressed", String(enabled));
    control.querySelector("span").textContent = enabled ? "開" : "關";
    return;
  }
  if (action === "clear") {
    resetPracticeFilters();
    if (route[1] === "all" && !practicePreset()) {
      render(false);
      main.querySelector("#practice-unit").focus();
    } else location.hash = href("practice");
    return;
  }
  if (action === "topic" || action === "stop-related") {
    practiceFilter.concept = action === "topic" ? id : "all";
    practiceFilter.offset = 0;
    practiceFilter.relatedTo = "";
    main.querySelector("#practice-concept").value = practiceFilter.concept;
    updatePractice();
    main.querySelector("#practice-concept").focus();
    return;
  }
  if (action === "continue-wrong") {
    updatePractice();
    const list = main.querySelector("#quiz-list");
    list.focus({ preventScroll: true });
    list.scrollIntoView({ block: "start" });
    return;
  }
  const question = course.practice.find(item => item.id === id);
  if (!question) return;
  if (action === "related") {
    practiceFilter.concept = question.concept;
    practiceFilter.relatedTo = id;
    practiceFilter.scope = "all";
    practiceFilter.level = "all";
    practiceFilter.offset = 0;
    practiceFeedback.clear();
    main.querySelector("#practice-concept").value = question.concept;
    main.querySelector("#practice-scope").value = "all";
    main.querySelector("#practice-level").value = "all";
    updatePractice();
    const list = main.querySelector("#quiz-list");
    list.focus({ preventScroll: true });
    list.scrollIntoView({ block: "start" });
    return;
  }

  const card = control.closest(".question");
  let newlyCorrect = false;
  if (action === "check") {
    const selection = card.querySelector("input:checked");
    if (!selection) {
      card.querySelector("[data-answer-status]").textContent = "請先選一個答案。";
      return;
    }
    progress.practice[id] = Number(selection.value);
    newlyCorrect = Boolean(lastAnswer(question)?.correct);
    if (newlyCorrect) playCorrectSound();
    persist();
    if (!route[2]) updatePracticeStats();
  }
  if (action === "retry") practiceFeedback.delete(id);
  else practiceFeedback.add(id);
  card.outerHTML = questionCard(question);
  const replacement = main.querySelector(`[data-question="${id}"]`);
  const feedback = replacement.querySelector(".feedback");
  if (feedback) {
    feedback.focus({ preventScroll: true });
    feedback.scrollIntoView({ block: "nearest" });
    if (newlyCorrect) celebrate(replacement.querySelector(".option.is-correct"), feedback);
  } else {
    replacement.querySelector("input").focus({ preventScroll: true });
  }
}

const partKey = (question, part) => `q${question + 1}-${part + 1}`;
const pointsFor = question => question.parts.reduce((sum, item) => sum + item.points, 0);
const legacyAttempt = attempt => Boolean(attempt && course.legacyExam && attempt.form !== "english");
const questionsFor = attempt => legacyAttempt(attempt)
  ? (course.previousExamLength && !attempt.expanded ? course.legacyExam.slice(0, course.previousExamLength) : course.legacyExam)
  : course.exam;
const totalFor = (bonus, attempt) => questionsFor(attempt).filter(question => Boolean(question.bonus) === bonus)
  .reduce((sum, question) => sum + pointsFor(question), 0);
const activePart = (part, key, attempt) => attempt.version === 2 ? course.examCalculations?.[key] ?? part : part;
const fieldKey = (key, field) => `${key}-${field.id}`;

function normalizeObjective(format, answer) {
  const text = answer.normalize("NFKC").trim();
  if (!text) return null;
  if (format === "ipv4") return ipv4Number(text.replace(/[。｡]/g, ".").replace(/\s*\.\s*/g, "."));
  if (format === "bits") return /^[01]+$/.test(text) ? text : null;
  if (format === "signed-integer") {
    const value = text.replace(/^−/, "-");
    return /^[+-]?\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
  }
  const numbers = format === "integer-list" ? text.split(/\s*[,、]\s*|\s+/) : [text];
  if (numbers.some(value => !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)))) return null;
  return format === "integer-list" ? numbers.map(Number).join(",") : Number(numbers[0]);
}

function objectiveScore(field, answer = "") {
  const expected = Array.isArray(field.answer) ? field.answer.join(",") : String(field.answer);
  const value = normalizeObjective(field.format, answer);
  return value !== null && value === normalizeObjective(field.format, expected) ? field.points : 0;
}

function objectiveField(field, key, attempt) {
  const id = fieldKey(key, field);
  const answer = attempt.answers[id] ?? "";
  const isList = field.format === "integer-list";
  const placeholder = isList ? "用逗號或空格分隔" : field.format === "ipv4" ? "輸入 IPv4 位址"
    : field.format === "bits" ? "輸入完整位元串" : "輸入整數";
  let result = "";
  if (attempt.submitted) {
    const score = objectiveScore(field, answer);
    const expected = Array.isArray(field.answer) ? field.answer.join(", ") : field.answer;
    const outcome = score ? "正確" : answer.trim() ? "答錯" : "未作答";
    result = `<p class="objective-result ${score ? "correct" : "incorrect"}">
      <strong>${outcome} · ${score}/${field.points} 分</strong>${score ? "" : `　正解 ${esc(expected)}`}</p>`;
  }
  return `<div class="exam-field"><label for="${id}"><span${englishQuestions() && !legacyAttempt(attempt) ? ' lang="en"' : ""}>${esc(field.label)}</span> <span class="tool-status">（${field.points} 分）</span></label>
    <input type="text" class="field" id="${id}" data-exam-answer="${id}" ${["integer", "bits"].includes(field.format) ? 'inputmode="numeric"' : ""}
      spellcheck="false" autocomplete="off" maxlength="180" ${attempt.submitted ? "readonly" : ""}
      placeholder="${placeholder}" value="${esc(answer)}">
    ${result}</div>`;
}

function rubric(part, key, answer) {
  return `<div class="feedback exam-feedback">
    <strong>參考作答</strong><p>${esc(part.model)}</p>
    <strong>逐點自評</strong><div class="rubric-items">${part.criteria.map(([points, criterion], index) => {
      const id = `${key}-r${index}`;
      return `<div class="rubric-item"><label for="${id}">${esc(criterion)} <span>（${points} 分）</span></label>
        <select id="${id}" data-rubric="${id}" aria-label="${esc(criterion)} 自評分數" ${answer.trim() ? "" : "disabled"}>
        <option value="">給分</option>${Array.from({ length: points + 1 }, (_, score) =>
          `<option value="${score}" ${progress.exam.rubric[id] === score ? "selected" : ""}>${score} / ${points}</option>`).join("")}</select></div>`;
    }).join("")}</div><p class="exam-review"><b>常見失分</b>　${esc(part.trap)}</p></div>`;
}

function examQuestion(question, index, attempt) {
  const language = englishQuestions() && !legacyAttempt(attempt) ? ' lang="en"' : "";
  return `<article class="question exam-question" id="exam-q${index + 1}">
    <p class="qmeta">第 ${index + 1} 題 · ${question.bonus ? "Bonus · " : ""}${pointsFor(question)} 分</p>
    <h2${language}>${esc(question.title)}</h2><p${language} class="exam-setup">${esc(question.setup)}</p>
    ${question.parts.map((original, partIndex) => {
      const key = partKey(index, partIndex);
      const part = activePart(original, key, attempt);
      const answer = attempt.answers[key] ?? "";
      const label = question.parts.length > 1 ? `(${String.fromCharCode(97 + partIndex)}) ` : "";
      return `<div class="exam-part"><label for="${key}"${language}>${label}(${part.points} ${language ? "points" : "分"}) ${esc(part.prompt)}</label>
        ${part.fields ? `<div class="exam-fields">${part.fields.map(field => objectiveField(field, key, attempt)).join("")}</div>` : ""}
        <textarea id="${key}" data-exam-answer="${key}" maxlength="4500" ${attempt.submitted ? "readonly" : ""}
        placeholder="${part.fields ? "簡述算式或理由" : "可用繁中搭配英文術語，計算題請保留算式"}">${esc(answer)}</textarea>
        ${attempt.submitted ? rubric(part, key, answer) : ""}</div>`;
    }).join("")}
    ${attempt.submitted ? `<div class="page-links exam-pages" aria-label="複習頁碼">${question.pages.map(page =>
      `<a href="${lessonHref(page)}">p.${page}</a>`).join("")}</div>` : ""}</article>`;
}

function countExamAnswers(attempt) {
  let filled = 0;
  let total = 0;
  for (const field of main.querySelectorAll("[data-exam-answer]")) {
    total++;
    if (attempt.answers[field.dataset.examAnswer]?.trim()) filled++;
  }
  return { filled, total };
}

function updateScore() {
  const attempt = progress.exam;
  let base = 0, bonus = 0, marked = 0, available = 0, automatic = 0, autoTotal = 0;
  questionsFor(attempt).forEach((question, index) => question.parts.forEach((original, partIndex) => {
    const key = partKey(index, partIndex);
    const part = activePart(original, key, attempt);
    let points = 0;
    for (const field of part.fields ?? []) {
      const earned = objectiveScore(field, attempt.answers[fieldKey(key, field)]);
      autoTotal += field.points;
      automatic += earned;
      points += earned;
    }
    if (attempt.answers[key]?.trim()) {
      part.criteria.forEach(([max], criterion) => {
        available++;
        const value = attempt.rubric[`${key}-r${criterion}`];
        if (Number.isInteger(value) && value >= 0 && value <= max) {
          marked++;
          points += value;
        }
      });
    }
    if (question.bonus) bonus += points;
    else base += points;
  }));
  main.querySelector("#exam-score").textContent = `目前得分 ${base} / ${totalFor(false, attempt)} 分 · 加分 ${bonus} / ${totalFor(true, attempt)} 分`;
  main.querySelector("#exam-score-detail").textContent =
    `${autoTotal ? `自動給分 ${automatic} / ${autoTotal} 分 · ` : ""}已自評 ${marked} / ${available} 個得分點`;
}

function examView() {
  const attempt = progress.exam;
  const newExam = `<div class="exam-intro"><h2>歷屆原題模擬</h2><p>可選筆記重點混合卷，或按年份與場次練整卷。</p>
    <div class="actions">${link(StudySite.courseLink("past-exams", "mock"), "選擇模擬考卷", "")}
      ${link(href("past-exams", "range"), "依頁碼練原題")}</div></div>`;
  if (!attempt) return head("模擬小考", "以原卷題目和配分作答，交卷後可看逐題詳解。") + newExam;
  const questions = questionsFor(attempt);
  const description = course.id === "lecture-05"
    ? "依 2026 年正式小考的配分架構，參考有考網路的 2025 年考古題改寫。"
    : course.examSource ?? "作答後查看參考答案與逐點給分規準。";
  const front = head(course.id === "lecture-05" ? "正式小考模擬" : "模擬小考", description) + newExam + (legacyAttempt(attempt)
    ? '<p class="activity-guide-link">這是你先前的中文試卷紀錄。歷屆原題可從上方選卷。</p>' : "");
  const summary = attempt.submitted ? `<div class="exam-summary" id="exam-result" tabindex="-1">
    <strong>已交卷</strong><p id="exam-score" aria-live="polite"></p>
    <p class="exam-review" id="exam-score-detail"></p>
    <p class="exam-review">空白作答以 0 分計。可依解釋題下方的規準補上自評分數。</p>
    <div class="actions"><button type="button" class="btn secondary" id="exam-copy">複製題目與作答</button>
    <button type="button" class="btn secondary" id="exam-reset">重新作答</button><span class="tool-status" id="exam-copy-status" role="status"></span></div></div>`
    : `<div class="exam-status"><p id="exam-progress" aria-live="polite"></p><time id="exam-time" aria-label="剩餘作答時間"></time>
    <a href="#exam-submit" data-exam-end>到交卷區 ↓</a></div>`;
  return front + summary + `<nav class="page-links" aria-label="跳至小考題號">
    ${questions.map((_, index) => `<a href="#exam-q${index + 1}" data-exam-jump="exam-q${index + 1}">${index + 1}</a>`).join("")}</nav>
    <div class="quiz-list">${questions.map((question, index) => examQuestion(question, index, attempt)).join("")}</div>
    <nav class="exam-turn question-pager" aria-label="前後題">
      <button type="button" class="btn secondary" data-exam-step="-1">← 上一題</button>
      <span class="tool-status" data-exam-position aria-live="polite"></span>
      <button type="button" class="btn secondary" data-exam-step="1">下一題 →</button>
    </nav>
    ${attempt.submitted ? '<button type="button" class="btn secondary exam-final" data-exam-jump="exam-result">回自評總分 ↑</button>' :
    '<div class="exam-final actions"><button type="button" class="btn" id="exam-submit">交卷並查看解析</button><span class="tool-status" id="exam-submit-status" role="status"></span></div>'}`;
}

function paintExamPage() {
  const questions = main.querySelectorAll(".exam-question");
  if (!questions.length) return;
  const single = singleQuestion("exam");
  main.dataset.singleExam = String(single);
  questions.forEach((question, index) => { question.hidden = single && index + 1 !== examPage; });
  for (const control of main.querySelectorAll("a[data-exam-jump]")) {
    if (control.dataset.examJump === `exam-q${examPage}`) control.setAttribute("aria-current", "step");
    else control.removeAttribute("aria-current");
  }
  main.querySelector("[data-exam-position]").textContent = `第 ${examPage} / ${questions.length} 題`;
  main.querySelector('[data-exam-step="-1"]').disabled = examPage === 1;
  main.querySelector('[data-exam-step="1"]').disabled = examPage === questions.length;
}

function submitExam() {
  progress.exam.submitted = Date.now();
  confirmSubmit = false;
  persist();
  render(false);
  const result = main.querySelector("#exam-result");
  result.focus({ preventScroll: true });
  result.scrollIntoView({ block: "start" });
}

async function copyExam(attempt) {
  const content = [`${course.label} 正式小考作答｜請依每小題配分批改，並說明得分與扣分原因。`,
    ...questionsFor(attempt).map((question, index) => {
      const parts = question.parts.map((original, partIndex) => {
        const key = partKey(index, partIndex);
        const part = activePart(original, key, attempt);
        const answer = attempt.answers[key]?.trim() || "（空白）";
        const results = (part.fields ?? []).map(field => {
          const value = attempt.answers[fieldKey(key, field)]?.trim();
          return `${field.label}：${value || "（空白）"}（${objectiveScore(field, value)} / ${field.points} 分）`;
        });
        const criteria = part.criteria.map(([points, criterion]) => `${criterion} (${points} 分)`).join(" ");
        return [`(${partIndex + 1}) ${part.points} 分 · ${part.prompt}`, ...results, `作答：${answer}`, `給分依據：${criteria}`].join("\n");
      });
      return `第 ${index + 1} 題 · ${question.title}${question.bonus ? " · Bonus" : ""}\n${question.setup}\n${parts.join("\n")}`;
    })].join("\n\n");
  const status = main.querySelector("#exam-copy-status");
  try {
    await navigator.clipboard.writeText(content);
    status.textContent = "已複製題目與作答。";
  } catch {
    let copyBox = main.querySelector("#exam-copy-text");
    if (!copyBox) {
      copyBox = document.createElement("textarea");
      copyBox.id = "exam-copy-text";
      copyBox.readOnly = true;
      copyBox.setAttribute("aria-label", "可手動複製的試卷與答案");
      status.parentElement.after(copyBox);
    }
    copyBox.value = content;
    copyBox.select();
    status.textContent = "請手動複製下方文字。";
  }
}

function bindExam() {
  const attempt = progress.exam;
  if (!attempt) return;
  if (attempt.submitted) {
    updateScore();
    main.querySelector("#exam-copy").addEventListener("click", () => copyExam(attempt));
    main.querySelector("#exam-reset").addEventListener("click", event => {
      if (!confirmReset) {
        confirmReset = true;
        event.currentTarget.textContent = "確認清除本次作答";
        main.querySelector("#exam-copy-status").textContent = "再按一次會清除本次小考作答和自評紀錄。";
        return;
      }
      progress.exam = null;
      confirmReset = false;
      persist();
      render();
    });
    return;
  }

  const displayProgress = () => {
    const { filled, total } = countExamAnswers(attempt);
    main.querySelector("#exam-progress").textContent = `已填 ${filled} / ${total} 個作答欄`;
  };
  const displayTime = () => {
    const time = main.querySelector("#exam-time");
    if (!attempt.deadline) {
      time.textContent = "不限時";
      return;
    }
    const seconds = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
    time.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    if (!seconds) submitExam();
  };
  displayProgress();
  const submit = main.querySelector("#exam-submit");
  const submitStatus = main.querySelector("#exam-submit-status");
  submit.addEventListener("click", () => {
    const { filled, total } = countExamAnswers(attempt);
    if (filled < total && !confirmSubmit) {
      confirmSubmit = true;
      submitStatus.textContent = `還有 ${total - filled} 個作答欄空白，再按一次即可交卷。`;
      submit.textContent = "確認交卷";
      return;
    }
    submitExam();
  });
  main.querySelectorAll("[data-exam-answer]").forEach(field => field.addEventListener("input", () => {
    attempt.answers[field.dataset.examAnswer] = field.value;
    confirmSubmit = false;
    submit.textContent = "交卷並查看解析";
    submitStatus.textContent = "";
    persist();
    displayProgress();
  }));
  if (attempt.deadline > Date.now()) examClock = window.setInterval(displayTime, 1000);
  displayTime();
}

function render(move = true, previousPage) {
  clearInterval(examClock);
  StudySlideViewer.close();
  StudyPageTools.close();
  paintNavigation();
  const [section, , pageText, activityKey] = route;
  const views = { overview, learn, activities: activityIndex, templates, terms: glossary, practice, exam: examView, guide, forwarding };
  main.dataset.section = section;
  main.innerHTML = views[section]();
  let activityTarget;
  if (section === "learn") {
    const lesson = main.querySelector(".lesson");
    const delta = Number(lesson.id.slice("slide-".length)) - previousPage;
    if (Math.abs(delta) === 1) lesson.dataset.enterDirection = delta > 0 ? "forward" : "back";
    const checkForm = main.querySelector("#concept-check-form");
    checkForm?.addEventListener("submit", event => {
      event.preventDefault();
      const check = studyConceptChecks[course.id];
      const chosen = Number(new FormData(checkForm).get("choice"));
      const feedback = checkForm.querySelector("[role=status]");
      feedback.textContent = check.choices[chosen][1];
      feedback.dataset.correct = String(chosen === check.answer);
    });
    loadFigure(main.querySelector(".original-figure"));
    if (activityKey) {
      activityTarget = document.getElementById(`activity-${activityKey}`);
      if (activityTarget) {
        activityTarget.open = true;
        bindActivity(activityTarget);
      }
    }
    main.querySelector("#page-jump").addEventListener("submit", event => {
      event.preventDefault();
      const page = main.querySelector("#page-number").valueAsNumber;
      if (!lessonUnit(page)) return;
      const target = lessonHref(page);
      main.querySelector("#reader-jump-dialog").close();
      if (location.hash === target) main.querySelector(".reader-heading").scrollIntoView({ block: "start" });
      else location.hash = target;
    });
    const note = main.querySelector("#page-note-form");
    const notePage = Number(note.dataset.page);
    const noteText = note.elements.note;
    const remove = note.querySelector("#page-note-remove");
    const noteStatus = note.querySelector("#page-note-status");
    const persistNote = text => {
      const stored = saveNote(course.id, notePage, course.slides.find(slide => slide.page === notePage).title, text);
      noteText.value = noteText.defaultValue = text;
      remove.hidden = !text;
      noteStatus.textContent = stored ? (text ? "已儲存。" : "已刪除筆記。") : "瀏覽器無法儲存，本次瀏覽仍可查看。";
    };
    note.addEventListener("submit", event => {
      event.preventDefault();
      const text = noteText.value.trim();
      if (text) persistNote(text);
      else { noteStatus.textContent = "請先填寫筆記。"; noteText.focus(); }
    });
    remove.addEventListener("click", () => { persistNote(""); noteText.focus(); });
  }
  if (section === "activities") {
    const search = main.querySelector("#activity-search");
    search.addEventListener("input", () => {
      main.querySelector("#activity-index").innerHTML = StudyActivities.indexCards(courseActivities(), course, activityHref, search.value);
    });
  }
  if (section === "terms") bindGlossary();
  if (section === "templates") Lecture06Templates.bind(main);
  if (section === "guide") bindGuide();
  if (section === "forwarding") bindForwarding();
  if (section === "practice" && !route[2]) bindPractice();
  if (section === "exam" && progress.exam) {
    bindExam();
    paintExamPage();
  }
  if (move) {
    if (activityTarget) {
      activityTarget.querySelector("summary").focus({ preventScroll: true });
      activityTarget.scrollIntoView({ block: "start" });
      return;
    }
    const selectedTerm = section === "terms" && course.terms.has(canonicalTerm(route[1]));
    const heading = selectedTerm ? main.querySelector("#term-detail-title")
      : section === "learn" || section === "terms" ? main.querySelector("h1") : main;
    if (heading !== main) heading.tabIndex = -1;
    const termLink = !selectedTerm && activeGlossList?.term && [...main.querySelectorAll("[data-gloss-term]")]
      .find(link => link.dataset.glossTerm === activeGlossList.term);
    (termLink || heading).focus({ preventScroll: true });
    window.scrollTo(0, selectedTerm ? 0 : activeGlossList?.scroll ?? 0);
  }
}

function show(nextCourse, segments, move, nextStudy, trackReading = true) {
  const previousPage = move && course?.id === nextCourse.id && route?.[0] === "learn"
    ? Number(main.querySelector("[data-done]")?.dataset.done) : undefined;
  rememberGlossList();
  if (course?.id !== nextCourse.id) {
    resetPracticeFilters();
    glossPages = new Map();
    for (const slide of nextCourse.slides) for (const name of slide.terms) {
      if (!glossPages.has(name)) glossPages.set(name, []);
      glossPages.get(name).push(slide.page);
    }
    for (const pages of glossPages.values()) pages.sort((a, b) => a - b);
  }
  course = nextCourse;
  study = nextStudy;
  progress = getProgress(course.id);
  const [section, unitId, pageText, activityKey, returnQuestion] = segments;
  const validSection = Object.hasOwn(sectionNames, section)
    && (section !== "activities" || courseActivities().length)
    && (section !== "templates" || hasTemplates())
    && (section !== "guide" || study?.guide?.length)
    && (section !== "forwarding" || study?.forwarding?.length);
  route = [validSection ? section : "overview", unitId, pageText];
  if (route[0] === "learn") {
    const requestedPage = Number(pageText || (unitId ? 0 : progress.lastPage));
    const unit = lessonUnit(requestedPage) ?? course.units.find(item => item.id === unitId) ?? course.units[0];
    route[1] = unit.id;
    route[2] = Number.isInteger(requestedPage) && lessonUnit(requestedPage) ? requestedPage : undefined;
    route[3] = courseActivities().find(activity => activity.page === route[2] && activity.concept === activityKey)?.concept;
    const original = questionFor(returnQuestion);
    if (original && (route[3] ? original.concept === route[3] : !activityKey && original.page === route[2])) {
      route[4] = original.id;
    }
    if (trackReading && !route[4]) {
      progress.lastPage = route[2] ?? unit.start;
      progress.lastReadAt = Date.now();
      persist();
    }
  }
  if (route[0] === "practice") {
    if (!course.units.some(unit => unit.id === unitId)) route[1] = "all";
    route[2] = questionFor(pageText)?.id;
    const original = activityKey === "variant" && questionFor(returnQuestion);
    if (route[2] && original && original.id !== route[2] && original.concept === questionFor(route[2]).concept) {
      route[4] = original.id;
    }
    if (pageText === "wrong") {
      resetPracticeFilters();
      practiceFilter.scope = "wrong";
      route[3] = "wrong";
    }
    if (pageText === "range") {
      const from = Number(activityKey);
      const to = Number(returnQuestion);
      if (Number.isInteger(from) && Number.isInteger(to) && from <= to && lessonUnit(from) && lessonUnit(to)) {
        resetPracticeFilters();
        Object.assign(practiceFilter, { from, to });
        route[3] = "range";
      }
    }
  }
  practiceFilter.offset = 0;
  practiceFilter.relatedTo = "";
  practiceFeedback.clear();
  if (route[0] === "practice" && route[2] && !route[4] && lastAnswer(questionFor(route[2]))) practiceFeedback.add(route[2]);
  confirmSubmit = false;
  confirmReset = false;
  examPage = 1;
  document.title = `${course.label} · ${sectionNames[route[0]]}｜海洋大學計算機概論`;
  render(move, previousPage);
}

main.addEventListener("click", event => {
  const control = event.target.closest("button, a");
  if (!control) return;
  if (control.dataset.pageStudy) {
    const page = Number(control.dataset.studyPage ?? main.querySelector(".lesson")?.id.slice(6));
    const slide = course.slides.find(item => item.page === page);
    if (slide) StudyPageTools.open({ course, slide, lessonHref, subnetResult }, control.dataset.pageStudy);
    return;
  }
  if (control.hasAttribute("data-open-page-jump")) {
    main.querySelector("#reader-jump-dialog").showModal();
    return;
  }
  if (control.hasAttribute("data-page-link") && control.matches("[aria-current]")) {
    event.preventDefault();
    main.querySelector("#reader-jump-dialog").close();
    return;
  }
  if (control.hasAttribute("data-open-slide") || control.hasAttribute("data-translate-slide")) {
    const image = main.querySelector(".original-figure img");
    const translation = study?.translations?.[control.dataset.translateSlide];
    if (image) StudySlideViewer.open(image, control, translation);
    return;
  }
  if (control.dataset.reportKind) {
    const { reportKind: kind, reportPage, reportQuestion } = control.dataset;
    const page = Number(reportPage);
    const unit = lessonUnit(page);
    const target = kind === "question" ? questionFor(reportQuestion) : course.slides.find(slide => slide.page === page);
    if (unit && target) StudyCommunity.reportMaterial({
      kind, course: course.id, label: course.label, unit: unit.id, page, question: reportQuestion,
      title: target.prompt ?? target.title
    });
    return;
  }
  if (control.dataset.saveReview) {
    const { saveReview: type, reviewId: id, reviewTitle: title, reviewPage } = control.dataset;
    const saved = control.getAttribute("aria-pressed") === "true";
    StudySite.updateReview(course.id, { type, id, title, page: Number(reviewPage) || null }, saved ? "remove" : "add");
    control.setAttribute("aria-pressed", String(!saved));
    return;
  }
  if (activeGlossList && control.dataset.glossTerm) activeGlossList.term = control.dataset.glossTerm;
  if (control.hasAttribute("data-slide-preference")) {
    StudyPreferences.set("slides", StudyPreferences.slidesOpen() ? "closed" : "open");
    return;
  }
  const { done, practiceAction, id, offset, examJump, examEnd, examStep } = control.dataset;
  if (done) {
    const page = Number(done);
    const checked = !progress.done.includes(page);
    progress.done = checked ? [...progress.done, page] : progress.done.filter(value => value !== page);
    progress.lastPage = page;
    progress.lastReadAt = Date.now();
    persist();
    paintNavigation();
    control.textContent = checked ? "✓ 已讀" : "標為已讀";
    control.setAttribute("aria-pressed", String(checked));
    main.querySelector(`[data-page-link="${page}"]`)?.classList.toggle("done", checked);
  }
  if (practiceAction) handlePracticeAnswer(control, practiceAction, id);
  if (offset) {
    practiceFilter.offset += Number(offset);
    updatePractice();
    main.querySelector("#quiz-list").focus({ preventScroll: true });
    (singleQuestion("practice") ? main.querySelector("#practice-pager") : main.querySelector("#quiz-list")).scrollIntoView({ block: "start" });
  }
  if (examJump || examEnd !== undefined || examStep) {
    event.preventDefault();
    const requested = examStep ? examPage + Number(examStep) : Number(examJump?.match(/^exam-q(\d+)$/)?.[1]);
    if (requested && requested <= questionsFor(progress.exam).length) {
      examPage = requested;
      paintExamPage();
    }
    const target = document.getElementById(examJump || (examStep ? `exam-q${examPage}` : "exam-submit"));
    target?.scrollIntoView({ block: "start" });
    if (target?.matches("button")) target.focus({ preventScroll: true });
  }
});

main.addEventListener("change", event => {
  const field = event.target;
  if (field.id === "practice-question") {
    practiceFilter.offset = Number(field.value);
    updatePractice();
    main.querySelector("#practice-question").focus({ preventScroll: true });
    main.querySelector("#quiz-list").scrollIntoView({ block: "nearest" });
    return;
  }
  if (!field.dataset.rubric) return;
  const key = field.dataset.rubric;
  if (field.value === "") delete progress.exam.rubric[key];
  else progress.exam.rubric[key] = Number(field.value);
  persist();
  updateScore();
});

compactLayout.addEventListener("change", () => {
  if (route?.[0] === "practice" && !route[2] && main.querySelector("#practice-pager")) updatePractice();
  if (route?.[0] === "exam") paintExamPage();
});

document.addEventListener("study-preferences", event => {
  const name = event.detail;
  if (!name || name === "sidebar") applySidebarPreference();
  if (!name || name === "slides") {
    const figure = main.querySelector(".original-figure");
    if (figure) {
      figure.open = StudyPreferences.slidesOpen();
      loadFigure(figure);
      main.querySelector("[data-slide-preference]").setAttribute("aria-pressed", String(figure.open));
    }
  }
  if (!name || name === "sound") for (const button of main.querySelectorAll('[data-practice-action="sound"]')) {
    button.setAttribute("aria-pressed", String(soundEnabled()));
    button.querySelector("span").textContent = soundEnabled() ? "開" : "關";
  }
  if ((!name || name === "practice") && main.querySelector("#practice-pager")) updatePractice();
  if ((!name || name === "exam") && main.dataset.section === "exam") paintExamPage();
});

StudySite.registerLectureView({
  show,
  leave() {
    rememberGlossList();
    clearInterval(examClock);
    StudySlideViewer.close();
    StudyPageTools.close();
  },
  refreshProgress() {
    if (route[0] === "learn") {
      paintNavigation();
      const button = main.querySelector("[data-done]");
      const checked = progress.done.includes(Number(button.dataset.done));
      button.textContent = checked ? "✓ 已讀" : "標為已讀";
      button.setAttribute("aria-pressed", String(checked));
      for (const link of main.querySelectorAll("[data-page-link]")) {
        link.classList.toggle("done", progress.done.includes(Number(link.dataset.pageLink)));
      }
      const note = main.querySelector("#page-note-form");
      const field = note.elements.note;
      const updated = progress.notes[note.dataset.page]?.text ?? "";
      const editing = field.value !== field.defaultValue;
      if (!editing) field.value = updated;
      field.defaultValue = updated;
      note.querySelector("#page-note-remove").hidden = !updated;
    }
    for (const button of main.querySelectorAll("[data-save-review]")) {
      const item = StudySite.findReview(course.id, button.dataset.saveReview, button.dataset.reviewId);
      button.setAttribute("aria-pressed", String(Boolean(item)));
    }
  }
});
})();
