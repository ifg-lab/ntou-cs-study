"use strict";

const StudySite = (() => {
  const storageKey = "ntou-cs-study-v1";
  const backupFormat = "ntou-cs-study";
  const main = document.querySelector("#main");
  const home = document.querySelector("#home");
  const homeProgress = document.querySelector("#home-progress");
  const homeProgressList = document.querySelector("#home-progress-list");
  const homeMistakesLink = document.querySelector("#home-mistakes-link");
  const lecture = document.querySelector("#lecture");
  const loading = document.querySelector("#lecture-loading");
  const review = document.querySelector("#review");
  const pastExams = document.querySelector("#past-exams");
  const community = document.querySelector("#community");
  const account = document.querySelector("#account");
  const reviewLink = document.querySelector("#review-link");
  const reviewStatus = document.querySelector("#review-status-filter");
  const reviewCourse = document.querySelector("#review-course");
  const reviewType = document.querySelector("#review-type");
  const reviewItems = document.querySelector("#review-items");
  const reviewCount = document.querySelector("#review-count");
  const reviewEmpty = document.querySelector("#review-empty");
  const reviewAnnouncement = document.querySelector("#review-announcement");
  const topNav = document.querySelector("#top-nav");
  const dialog = document.querySelector("#records-dialog");
  const fileInput = document.querySelector("#records-file");
  const recordStatus = document.querySelector("#records-status");
  const applyRecord = document.querySelector("#records-apply");
  const dataset = new Map();
  const courseStudies = new Map();
  const courseLessons = new Map();
  const courseTranslations = new Map();
  const resources = new Map();
  const progressChecks = new Set();
  const publishedCourses = studyCatalog.filter(entry => !entry.pending);
  const reviewTypes = { page: "教材頁", term: "術語", question: "練習題", exam: "考古題" };
  const examReviewId = new RegExp(`^${examPaperIdPattern}/[1-9]\\d?(?:/[a-z])?$`);
  let lectureView;
  let currentCourse;
  let saved = readProgress();
  let routing = 0;
  let importRevision = 0;
  let pendingImport;
  let recordAccount = "";

  const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const blankProgress = firstPage => ({ done: [], practice: {}, guide: {}, lastPage: firstPage, exam: null, review: [], notes: {} });
  const getProgress = id => saved[id] ??= blankProgress(publishedCourses.find(entry => entry.id === id)?.firstPage ?? 1);

  function record(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function timestamp(value) {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  function normalizeReview(items, entry, pageExists) {
    const valid = new Map();
    for (const item of items) {
      if (!record(item) || !Object.hasOwn(reviewTypes, item.type) || typeof item.title !== "string") continue;
      const title = item.title.trim().slice(0, 600);
      if (!title) continue;
      const { type, id } = item;
      if (entry.pending && type !== "exam") continue;
      if (type === "exam" && (typeof id !== "string" || !examReviewId.test(id))) continue;
      const originalPage = pageExists(item.page) ? item.page : null;
      const [page = null] = type === "exam" ? examReviewPages(id, Number(entry.number), originalPage) : [originalPage];
      if (type === "page" && (page === null || id !== String(page))) continue;
      if (type === "term" && (typeof id !== "string" || !id.trim() || id.length > 200 || /[\uD800-\uDFFF]/u.test(id))) continue;
      if (type === "question" && (typeof id !== "string" || !/^practice-[1-9]\d*$/.test(id) ||
        Number(id.slice(9)) > entry.questions)) continue;
      valid.set(`${type}:${id}`, {
        type, id, title, page, addedAt: timestamp(item.addedAt) ?? 0, mastered: item.mastered === true
      });
    }
    return [...valid.values()];
  }

  function normalizeProgress(value, entry) {
    if (!record(value) || !Array.isArray(value.done) || !record(value.practice)) {
      throw new Error("這份檔案缺少已讀頁或練習紀錄。");
    }
    const firstPage = entry.firstPage ?? 1;
    const pageExists = page => Number.isInteger(page) && page >= firstPage && page < firstPage + entry.pages;
    const done = [...new Set(value.done.filter(pageExists))];
    const acceptedAnswers = answers => Object.fromEntries(Object.entries(answers).filter(([id, answer]) =>
      /^practice-[1-9]\d*$/.test(id) && Number(id.slice(9)) <= entry.questions &&
      Number.isInteger(answer) && answer >= 0 && answer < 4
    ));
    let exam = null;
    if (record(value.exam) && record(value.exam.answers) && record(value.exam.rubric)) {
      const answers = Object.fromEntries(Object.entries(value.exam.answers).filter(([key, answer]) =>
        /^q\d+-\d+(?:-[a-z][a-z0-9-]*)?$/.test(key) && typeof answer === "string"
      ).map(([key, answer]) => [key, answer.slice(0, 4500)]));
      const rubric = Object.fromEntries(Object.entries(value.exam.rubric).filter(([key, score]) =>
        /^q\d+-\d+-r\d+$/.test(key) && Number.isInteger(score) && score >= 0 && score <= 10
      ));
      exam = {
        answers, rubric, deadline: timestamp(value.exam.deadline), submitted: timestamp(value.exam.submitted)
      };
      if (value.exam.version === 2) exam.version = 2;
      if (value.exam.expanded === true) exam.expanded = true;
      if (value.exam.form === "english") exam.form = "english";
    }
    return {
      done, practice: acceptedAnswers(value.practice), guide: record(value.guide) ? acceptedAnswers(value.guide) : {},
      lastPage: pageExists(value.lastPage) ? value.lastPage : firstPage,
      lastReadAt: timestamp(value.lastReadAt), exam,
      review: Array.isArray(value.review) ? normalizeReview(value.review, entry, pageExists) : [],
      notes: Object.fromEntries(Object.entries(record(value.notes) ? value.notes : {}).flatMap(([id, note]) => {
        if (String(Number(id)) !== id || !pageExists(Number(id)) || typeof note?.text !== "string" || !note.text.trim()) return [];
        return [[id, {
          title: typeof note.title === "string" ? note.title.trim().slice(0, 180) : "",
          text: note.text.trim().slice(0, 500), updatedAt: timestamp(note.updatedAt) ?? 0
        }]];
      }))
    };
  }

  // These archived questions were saved under the earlier Programming Languages course ID.
  function migrateArchiveReviews(courses) {
    if (!record(courses)) return courses;
    const review = id => Array.isArray(courses[id]?.review) ? courses[id].review : [];
    const programming = new Set(["2025-quiz3/5", "2025-quiz3/6", "2025-quiz3/7",
      "2025-quiz3/9", "2025-quiz3/10", "2025-final/5"]);
    const isProgramming = item => item?.type === "exam" && typeof item.id === "string" &&
      programming.has(item.id.split("/").slice(0, 2).join("/"));
    const current = review("lecture-08");
    const moved = current.filter(isProgramming);
    const previous = review("lecture-09").filter(item => item?.type === "exam");
    if (!moved.length && !previous.length) return courses;
    const withReview = (id, items) => ({ done: [], practice: {}, ...courses[id], review: items });
    return {
      ...courses,
      ...(moved.length ? { "lecture-07": withReview("lecture-07", [...moved, ...review("lecture-07")]) } : {}),
      "lecture-08": withReview("lecture-08", [...previous, ...current.filter(item => !isProgramming(item))])
    };
  }

  function readProgress(key = storageKey) {
    const result = {};
    try {
      const data = migrateArchiveReviews(JSON.parse(localStorage.getItem(key) ?? "{}"));
      for (const entry of studyCatalog) {
        if (!record(data?.[entry.id])) continue;
        try {
          result[entry.id] = normalizeProgress(data[entry.id], entry);
        } catch {
          // A damaged record for one course must not hide the other records.
        }
      }
    } catch {
      // Browsers can disable storage for locally opened files.
    }
    return result;
  }

  function persist() {
    StudyCommunity.progressChanged();
    return storeProgress();
  }

  const accountStorageKey = id => `${storageKey}:account:${id}`;

  function storeProgress() {
    try {
      localStorage.setItem(recordAccount ? accountStorageKey(recordAccount) : storageKey, JSON.stringify(saved));
      return true;
    } catch {
      return false;
    }
  }

  function useAccount(id) {
    if (recordAccount === id) return;
    recordAccount = id;
    saved = readProgress(id ? accountStorageKey(id) : storageKey);
    if (community.hidden && account.hidden) navigate(false, false);
  }

  function applySyncedCourse(id, entry, remote) {
    const current = getProgress(id);
    Object.assign(current, normalizeProgress({ ...current, ...remote }, entry));
    storeProgress();
    if (!home.hidden) paintHomeCourses();
    if (!review.hidden) paintReview();
    if (currentCourse?.id === id && !lecture.hidden) lectureView.refreshProgress();
  }

  function soundEnabled() {
    return StudyPreferences.get("sound") === "on";
  }

  function setSound(enabled) {
    StudyPreferences.set("sound", enabled ? "on" : "off");
  }

  const chapterForRoute = segment => studyCatalog.find(entry => entry.slug === segment || entry.id === segment);

  function courseLink(id, ...path) {
    const chapter = chapterForRoute(id);
    if (id === "discussion" && path.length) path[0] = chapterForRoute(path[0])?.slug ?? path[0];
    return "#" + [chapter?.slug ?? id, ...path].map(encodeURIComponent).join("/");
  }

  const catalogNavigation = current => `<a href="#courses">課程目錄</a><a href="#past-exams" ${current === "past-exams" ? 'aria-current="page"' : ""}>考古題</a><a href="#past-exams/mock" ${current === "mock" ? 'aria-current="page"' : ""}>模擬小考</a>`;

  function findReview(courseId, type, id) {
    return saved[courseId]?.review.find(item => item.type === type && item.id === id);
  }

  function saveNote(courseId, page, title, text) {
    const { notes } = getProgress(courseId);
    if (text) notes[page] = { title: title.slice(0, 180), text: text.slice(0, 500), updatedAt: Date.now() };
    else delete notes[page];
    return persist();
  }

  function updateReview(courseId, item, action) {
    const progress = getProgress(courseId);
    const previous = findReview(courseId, item.type, item.id);
    let message;
    if (action === "remove") {
      progress.review = progress.review.filter(entry => entry !== previous);
      message = "已從複習清單移除。";
    } else if (action === "status" && previous) {
      previous.mastered = !previous.mastered;
      message = previous.mastered ? "已標為掌握。" : "已移回待複習。";
    } else if (action === "add" && !previous) {
      progress.review.push({ ...item, addedAt: Date.now(), mastered: false });
      message = "已加入複習清單。";
    } else return;
    reviewAnnouncement.textContent = persist() ? message : `${message}瀏覽器無法儲存這次變更。`;
  }

  function reviewPath(courseId, item) {
    if (item.type === "page" || item.type === "note") return courseLink(courseId, "learn", "", item.page);
    if (item.type === "term") return courseLink(courseId, "terms", item.id, item.page ?? "");
    if (item.type === "exam") return courseLink("past-exams", "retry", ...item.id.split("/"));
    return courseLink(courseId, "practice", "all", item.id);
  }

  function reviewPageLabel(course, item) {
    const [from, to] = item.type === "exam" ? examReviewPages(item.id, Number(course.number), item.page) : [item.page, item.page];
    return from ? ` · p.${from}${to !== from ? `–${to}` : ""}` : "";
  }

  function paintReview() {
    const all = studyCatalog.flatMap(course => {
      const progress = saved[course.id];
      if (!progress) return [];
      const notes = Object.entries(progress.notes).map(([id, note]) => ({
        type: "note", id, page: Number(id), title: note.title || `p.${id} 筆記`, text: note.text, addedAt: note.updatedAt
      }));
      return [...progress.review, ...notes].map(item => ({ course, item }));
    });
    const list = all.filter(({ course, item }) => {
      return (reviewCourse.value === "all" || reviewCourse.value === course.id) &&
        (reviewType.value === "all" || reviewType.value === item.type) &&
        (reviewStatus.value === "all" || (item.type === "note" ? reviewStatus.value === "pending" :
          item.mastered === (reviewStatus.value === "mastered")));
    }).sort((first, second) => second.item.addedAt - first.item.addedAt);
    const noteCount = all.filter(({ item }) => item.type === "note").length;
    reviewCount.textContent = `${all.filter(({ item }) => item.type !== "note" && !item.mastered).length} 項待複習${noteCount ? ` · ${noteCount} 則筆記` : ""} · 顯示 ${list.length} / ${all.length} 項`;
    reviewEmpty.hidden = Boolean(list.length);
    reviewEmpty.innerHTML = all.length ? "<p>這個篩選條件下沒有項目。</p>" :
      '<p>清單目前是空的。「加入複習」的項目和教材頁儲存的筆記會出現在這裡。</p><a class="btn secondary" href="#courses">前往課程目錄</a>';
    reviewItems.innerHTML = list.map(({ course, item }) =>
      `<li class="review-item" data-course="${course.id}" data-type="${item.type}" data-id="${escape(item.id)}">
        <div class="review-item-copy">
          <p>${escape(course.label)} · ${reviewTypes[item.type] ?? "筆記"}${reviewPageLabel(course, item)}${item.mastered ? " · 已掌握" : ""}</p>
          <a class="review-item-link" href="${reviewPath(course.id, item)}">${escape(item.title)}</a>
          ${item.type === "note" ? `<p class="review-note-text">${escape(item.text)}</p>` : ""}
        </div>
        ${item.type === "note" ? "" : `<div class="review-item-actions">
          <button class="btn secondary" type="button" data-review-action="status">${item.mastered ? "移回待複習" : "標為已掌握"}</button>
          <button class="utility" type="button" data-review-action="remove">移除</button>
        </div>`}
      </li>`).join("");
  }

  reviewCourse.innerHTML = '<option value="all">全部章次</option>' + studyCatalog.map(entry =>
    `<option value="${entry.id}">${escape(entry.label)} · ${escape(entry.title)}</option>`).join("");
  review.querySelector("#review-filters").addEventListener("change", paintReview);
  reviewItems.addEventListener("click", event => {
    const button = event.target.closest("[data-review-action]");
    if (!button) return;
    const row = button.closest(".review-item");
    const { course, type, id } = row.dataset;
    const index = [...reviewItems.children].indexOf(row);
    const action = button.dataset.reviewAction;
    updateReview(course, { type, id }, action);
    paintReview();
    const matching = [...reviewItems.children].find(item =>
      item.dataset.course === course && item.dataset.type === type && item.dataset.id === id);
    const next = reviewItems.children[Math.min(index, reviewItems.children.length - 1)];
    (matching?.querySelector('[data-review-action="status"]') || next?.querySelector("a") || reviewStatus).focus();
  });

  const lectureStatus = entry => entry.pending ? "教材準備中" : entry.partial ? "部分教材已上架" : "已上架";

  function hasReadingProgress(entry, value) {
    return Boolean(value && (value.lastReadAt || value.lastPage > (entry.firstPage ?? 1) || value.done.length));
  }

  function paintHomeProgress() {
    const entries = publishedCourses.filter(entry => {
      const value = saved[entry.id];
      return hasReadingProgress(entry, value) || Object.keys(value?.practice ?? {}).length > 0;
    }).sort((a, b) => (saved[b.id].lastReadAt ?? 0) - (saved[a.id].lastReadAt ?? 0));
    let wrongTotal = 0;
    let countPending = false;
    homeProgress.hidden = !entries.length;
    homeProgressList.innerHTML = entries.map(entry => {
      const value = saved[entry.id];
      const course = dataset.get(entry.id);
      const attempted = Object.keys(value.practice).length;
      if (attempted && !course && !progressChecks.has(entry.id)) {
        progressChecks.add(entry.id);
        loadCourseData(entry).then(() => { if (!home.hidden) paintHomeProgress(); }).catch(() => progressChecks.delete(entry.id));
      }
      const wrong = course?.practice.filter(question => question.options[value.practice[question.id]]?.correct === false).length;
      wrongTotal += wrong ?? 0;
      countPending ||= attempted > 0 && wrong === undefined;
      const wrongLink = wrong > 0 || (attempted > 0 && wrong === undefined)
        ? `<a class="home-progress-mistakes" href="${courseLink(entry.id, "practice", "all", "wrong")}">${wrong === undefined ? "查看錯題" : `回練 ${wrong} 題錯題`} <span aria-hidden="true">→</span></a>` : "";
      return `<li><div><strong>${escape(entry.label)} · ${escape(entry.title)}</strong><p>${value.done.length}／${entry.pages} 頁已讀${wrong === 0 && attempted ? " · 目前沒有錯題" : ""}</p></div>
        <div class="home-progress-links">${hasReadingProgress(entry, value) ? `<a href="${courseLink(entry.id, "learn", "", value.lastPage)}">續讀 p.${value.lastPage}</a>` : ""}${wrongLink}</div></li>`;
    }).join("");
    homeMistakesLink.hidden = wrongTotal === 0 && !countPending;
    homeMistakesLink.textContent = countPending ? "查看待複習的錯題" : `${wrongTotal} 題錯題待複習`;
  }

  function paintHomeCourses() {
    paintHomeProgress();
    const entries = [...studyCatalog].sort((first, second) => Number(first.number) - Number(second.number));
    const resumable = publishedCourses.filter(entry => hasReadingProgress(entry, saved[entry.id]))
      .sort((first, second) => (saved[second.id].lastReadAt ?? 0) - (saved[first.id].lastReadAt ?? 0));
    const resume = document.querySelector("#resume-study");
    const recent = resumable[0];
    resume.hidden = !recent;
    const browse = document.querySelector("#browse-courses");
    browse.classList.toggle("light", !recent);
    browse.classList.toggle("ghost", Boolean(recent));
    if (recent) {
      const page = saved[recent.id].lastPage;
      resume.textContent = `接著讀 ${recent.label} · p.${page} →`;
      resume.href = courseLink(recent.id, "learn", "", page);
    }
    const summary = document.querySelector("#course-index-summary");
    if (summary) summary.textContent = `${entries.length} 章 · ${publishedCourses.length} 章已上架`;
    document.querySelector("#course-list").innerHTML = entries.map(entry => {
      const progress = saved[entry.id];
      const resumed = hasReadingProgress(entry, progress);
      const to = (...path) => courseLink(entry.id, ...path);
      const id = escape(entry.id);
      const completed = Math.min(entry.pages ?? 0, progress?.done.length ?? 0);
      return `<li class="course-entry${entry.pending ? "" : " is-published"}">
        <a class="course-card" href="${to("overview")}" aria-labelledby="${id}-label ${id}-name">
          <span id="${id}-label" class="course-label" lang="en">${escape(entry.label)}</span>
          <div class="course-card-name">
            <h3 id="${id}-name">${escape(entry.title)}</h3>
            <span lang="en">${escape(entry.english)}</span>
          </div>
          ${entry.pending ? `<span class="course-status">${lectureStatus(entry)}</span>` : completed ? `
            <span class="course-completion"><span>${completed} / ${entry.pages} 頁已讀</span>
              <progress value="${completed}" max="${entry.pages}" aria-label="閱讀進度"></progress></span>` :
            `<span class="course-completion">${entry.pages} 頁教材</span>`}
          <span class="course-arrow" aria-hidden="true">↗</span>
        </a>
        ${entry.pending ? "" : `<div class="course-quick">
          ${resumed ? `<a href="${to("learn", "", progress.lastPage)}">續讀 p.${progress.lastPage}</a>` : `<a href="${to("learn")}">逐頁教學</a>`}
          ${entry.activities ? `<a href="${to("activities")}">互動實驗</a>` : ""}
        </div>`}
      </li>`;
    }).join("");
  }

  function showPlaceholder(entry, move) {
    document.documentElement.dataset.view = "home";
    document.title = `${entry.label} · ${entry.english}｜海洋大學計算機概論`;
    topNav.innerHTML = catalogNavigation();
    loading.innerHTML = `<section class="placeholder-card" aria-labelledby="placeholder-title">
      <p class="course-label" lang="en">${escape(entry.label)}</p>
      <h1 id="placeholder-title" lang="en" tabindex="-1">${escape(entry.english)}</h1>
      <p class="course-status">${lectureStatus(entry)}</p>
      <p class="placeholder-note">教材還在準備，完成後會在這裡上架。</p>
      ${entry.sourcePdf ? `<a class="btn" href="${escape(entry.sourcePdf)}" target="_blank" rel="noopener noreferrer">開啟老師講義 PDF <span aria-hidden="true">↗</span></a>` : ""}
      <a class="btn secondary" href="${courseLink(entry.id, "past-exams")}">${escape(entry.label)} 考古題</a>
      <a class="btn secondary" href="#courses"><span aria-hidden="true">←</span> 回課程目錄</a>
    </section>`;
    loading.hidden = false;
    if (move) {
      loading.querySelector("h1").focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function loadResource(url, style = false) {
    if (resources.has(url)) return resources.get(url);
    const element = document.createElement(style ? "link" : "script");
    if (style) {
      element.rel = "stylesheet";
      element.href = url;
    } else {
      element.src = url;
    }
    const promise = new Promise((resolve, reject) => {
      element.onload = resolve;
      element.onerror = () => {
        element.remove();
        resources.delete(url);
        reject(new Error(`Unable to load ${url}`));
      };
    });
    resources.set(url, promise);
    document.head.append(element);
    return promise;
  }

  const loadCourseData = entry => loadResource(`assets/${entry.id}/data.js?v=${entry.id === "lecture-06" ? "algorithm-practice" : entry.id === "lecture-05" ? "packet-lab" : "chapters"}`);

  async function loadActivities(entry) {
    const version = entry.id === "lecture-06" ? "beginner-walkthrough" : entry.id === "lecture-05" ? "chapters" : "study-edition";
    await loadResource("assets/activities.js?v=packet-lab");
    await loadResource(`assets/${entry.id}/activities.js?v=${version}`);
    if (entry.id === "lecture-05") {
      await Promise.all([
        loadResource("assets/lecture-05/packet-lab.css?v=2", true),
        loadResource("assets/lecture-05/packet-traces.js?v=2"),
        loadResource("assets/lecture-05/packet-devices.js?v=1")
      ]);
      await loadResource("assets/lecture-05/packet-lab.js?v=2");
    }
  }

  async function loadCourseContent(entry) {
    await Promise.all([
      loadCourseData(entry),
      entry.study && loadResource(`assets/${entry.id}/study.js?v=${entry.id === "lecture-06" ? "algorithms-labs" : entry.id === "lecture-05" ? "network-comparisons" : "lecture-copy"}`),
      entry.reading && loadResource(`assets/${entry.id}/reading.js?v=complete-reading`),
      entry.translations && loadResource(`assets/${entry.id}/translations.js?v=${entry.translations}`),
      entry.id === "lecture-06" && loadResource("assets/lecture-06/labs.css?v=8", true),
      entry.id === "lecture-06" && loadResource("assets/exam-figures.js?v=worked"),
      entry.activities && loadActivities(entry)
    ]);
    const course = dataset.get(entry.id);
    const study = courseStudies.get(entry.id);
    const activities = entry.activities ? StudyActivities.list(entry.id) : [];
    if (!course || (entry.study && !study) || activities.length !== (entry.activities ?? 0)) {
      throw new Error(`Course content did not initialize: ${entry.id}`);
    }
    return { course, study, activities };
  }

  function revealCourse(entry, segments, move, trackReading) {
    currentCourse = entry;
    lecture.hidden = false;
    loading.hidden = true;
    document.documentElement.dataset.view = "lecture";
    const data = dataset.get(entry.id);
    const study = courseStudies.get(entry.id);
    const lessons = courseLessons.get(entry.id);
    const translations = courseTranslations.get(entry.id);
    const courseStudy = {
      ...study,
      lessons: { ...study?.lessons, ...lessons },
      translations: { ...study?.translations, ...translations }
    };
    lectureView.show(data, segments, move, courseStudy, trackReading);
  }

  async function navigate(move = true, trackReading = true) {
    const [routeId, ...segments] = location.hash.slice(1).split("/").map(value => {
      try { return decodeURIComponent(value); } catch { return value; }
    });
    if (routeId === "main") {
      main.focus({ preventScroll: true });
      return;
    }
    const revision = ++routing;
    const entry = chapterForRoute(routeId);
    const id = entry?.id ?? routeId;
    const discussionChapter = id === "discussion" ? chapterForRoute(segments[0]) : undefined;
    if (entry && routeId !== entry.slug) history.replaceState(history.state, "", courseLink(entry.id, ...segments));
    if (discussionChapter) {
      if (segments[0] !== discussionChapter.slug) history.replaceState(history.state, "", courseLink(id, ...segments));
      segments[0] = discussionChapter.id;
    }
    const examLecture = segments[0] === "past-exams" ? entry : undefined;
    community.hidden = id !== "discussion" || !StudyCommunity.enabled;
    account.hidden = id !== "account" || !StudyCommunity.enabled;
    review.hidden = id !== "review";
    pastExams.hidden = id !== "past-exams" && !examLecture;
    if (review.hidden) reviewLink.removeAttribute("aria-current");
    document.querySelector("#discussion-link").removeAttribute("aria-current");
    document.querySelector("#account-button").removeAttribute("aria-current");
    if (!account.hidden) {
      lectureView?.leave();
      currentCourse = undefined;
      lecture.hidden = loading.hidden = home.hidden = true;
      document.documentElement.dataset.view = "home";
      document.title = "我的帳號｜海洋大學計算機概論";
      topNav.innerHTML = catalogNavigation();
      document.querySelector("#account-button").setAttribute("aria-current", "page");
      if (move) StudyCommunity.showAccount();
      return;
    }
    if (!community.hidden) {
      lectureView?.leave();
      currentCourse = undefined;
      lecture.hidden = loading.hidden = home.hidden = true;
      document.documentElement.dataset.view = "home";
      document.title = "課程討論｜海洋大學計算機概論";
      topNav.innerHTML = catalogNavigation();
      document.querySelector("#discussion-link").setAttribute("aria-current", "page");
      StudyCommunity.showDiscussion(segments, move);
      return;
    }
    if (!pastExams.hidden) {
      lectureView?.leave();
      currentCourse = undefined;
      lecture.hidden = loading.hidden = home.hidden = true;
      document.documentElement.dataset.view = "home";
      const examSegments = examLecture ? segments.slice(1) : segments;
      const [examView, questionView] = examSegments;
      const specialTitle = { topics: "考點索引", range: "依頁碼練原題", retry: "重做考古題" };
      if (examLecture && examView === "page" && /^\d+$/.test(questionView)) {
        specialTitle.page = `p.${Number(questionView)} 相關考古題`;
      }
      const isMock = examView === "mock" || questionView === "mock";
      const special = Object.hasOwn(specialTitle, examView);
      const pageTitle = special ? specialTitle[examView] : isMock ? "模擬小考" : "考古題";
      const heading = examLecture ? `${examLecture.label} ${pageTitle}` : pageTitle === "考古題" ? "歷年考古題" : pageTitle;
      document.title = `${heading}｜海洋大學計算機概論`;
      topNav.innerHTML = examLecture ? `<a href="#courses">課程目錄</a>
        <a href="${courseLink(examLecture.id, "overview")}">回 ${escape(examLecture.label)}</a>
        <a href="${courseLink(examLecture.id, "past-exams")}" ${special ? "" : 'aria-current="page"'}>${escape(examLecture.label)} 考古題</a>
        <a href="#past-exams">全部考古題</a>` : catalogNavigation(isMock ? "mock" : id);
      const title = pastExams.querySelector("h1");
      title.textContent = heading;
      title.nextElementSibling.hidden = isMock || special;
      title.nextElementSibling.textContent = examLecture ? `${examLecture.title} · 依年份或場次查閱相關原題與詳解。`
        : "依年份、考試場次和原題號查閱，點開題目下方可看中文詳解。";
      const content = pastExams.querySelector("#past-exams-content");
      if (move) {
        title.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
      try {
        if (typeof StudyPastExams === "undefined") {
          content.innerHTML = '<p class="site-message" role="status">正在載入考古題…</p>';
          await Promise.all([
            loadResource("assets/past-exam-data.js?v=2015-homework"), loadResource("assets/exam-transcripts.js?v=2"),
            loadResource("assets/midterm-2026.js?v=1").then(() => loadResource("assets/exam-solutions.js?v=1")),
            loadResource("assets/exam-figures.js?v=worked"), loadResource("assets/exam-interactions.js?v=worked"),
            loadResource("assets/midterm-tools.js?v=2015-homework"), loadResource("assets/exam-topics.js?v=networks-homework")
          ]);
          await loadResource("assets/past-exams.js?v=2015-homework");
        }
        if (revision === routing) StudyPastExams.show(content, examSegments, examLecture);
      } catch (error) {
        if (revision !== routing) return;
        content.innerHTML = '<div class="site-message"><p role="status">考古題載入失敗。</p><button class="btn secondary" type="button">重試</button></div>';
        content.querySelector("button").addEventListener("click", () => navigate(false));
        console.error(error);
      }
      return;
    }
    if (id === "review") {
      lectureView?.leave();
      currentCourse = undefined;
      lecture.hidden = loading.hidden = home.hidden = true;
      document.documentElement.dataset.view = "home";
      document.title = "我的複習清單｜海洋大學計算機概論";
      topNav.innerHTML = catalogNavigation();
      reviewLink.setAttribute("aria-current", "page");
      if (move) reviewType.value = segments[0] === "exam" ? "exam" : "all";
      paintReview();
      if (move) {
        review.querySelector("h1").focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
      return;
    }
    if (!entry) {
      lectureView?.leave();
      currentCourse = undefined;
      lecture.hidden = true;
      loading.hidden = true;
      home.hidden = false;
      document.documentElement.dataset.view = "home";
      document.title = "海洋大學計算機概論｜課程複習站";
      topNav.innerHTML = catalogNavigation();
      paintHomeCourses();
      if (id === "courses" || (id === "home-progress" && !homeProgress.hidden)) {
        const heading = document.querySelector(id === "courses" ? "#courses-title" : "#home-progress-title");
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "start" });
      } else if (move) {
        main.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
      return;
    }
    home.hidden = true;
    if (currentCourse?.id === id) {
      revealCourse(entry, segments, move, trackReading);
      return;
    }
    lectureView?.leave();
    currentCourse = undefined;
    lecture.hidden = true;
    if (entry.pending) {
      showPlaceholder(entry, move);
      return;
    }
    loading.hidden = false;
    document.documentElement.dataset.view = "lecture";
    loading.innerHTML = `<p class="site-message" role="status">正在載入 ${escape(entry.label)}…</p>`;
    try {
      await Promise.all([
        loadResource("assets/lecture.css?v=exam-writing", true),
        Promise.all([
          loadResource("assets/slide-viewer.js?v=direct-translations"), loadResource("assets/slide-text.js?v=all-slide-text"), loadResource("assets/concept-checks.js?v=1"),
          loadResource("assets/page-ai-config.js?v=2"), loadResource("assets/page-study.js?v=chat"),
          loadResource("assets/exam-writing.js?v=reference-answers")
        ]).then(() => loadResource("assets/lecture.js?v=exam-writing")),
        loadCourseContent(entry)
      ]);
      if (revision !== routing) return;
      if (!lectureView) throw new Error("Lecture view did not initialize.");
      revealCourse(entry, segments, move, trackReading);
    } catch (error) {
      if (revision !== routing) return;
      currentCourse = undefined;
      lecture.hidden = true;
      loading.hidden = false;
      loading.innerHTML = `<div class="site-message"><p role="status">課程載入失敗。請確認整個網站資料夾都已解壓縮。</p>
        <button class="btn secondary" type="button">重試載入</button> <a class="btn secondary" href="#home">回首頁</a></div>`;
      loading.querySelector("button").addEventListener("click", () => navigate());
      console.error(error);
    }
  }

  function showRecordStatus(message, error = false) {
    recordStatus.textContent = message;
    recordStatus.toggleAttribute("data-error", error);
  }

  function clearImport() {
    importRevision++;
    pendingImport = undefined;
    applyRecord.hidden = true;
    fileInput.value = "";
  }

  document.querySelector("#study-records").addEventListener("click", () => {
    clearImport();
    showRecordStatus("");
    dialog.showModal();
  });
  dialog.addEventListener("close", clearImport);
  document.querySelector("#records-export").addEventListener("click", () => {
    const examDrafts = StudyExamDrafts.exportDrafts();
    if (!Object.keys(saved).length && !Object.keys(examDrafts).length) {
      showRecordStatus("目前沒有可匯出的學習紀錄。");
      return;
    }
    const content = JSON.stringify({ format: backupFormat, version: 1, courses: saved, examDrafts }, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
    const download = document.createElement("a");
    download.href = url;
    const now = new Date();
    const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map(value => String(value).padStart(2, "0")).join("-");
    download.download = `海洋大學計算機概論學習紀錄-${date}.json`;
    dialog.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showRecordStatus("已下載學習紀錄。");
  });
  document.querySelector("#records-import").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    clearImport();
    if (!file) return;
    const revision = importRevision;
    try {
      if (file.size > 12_000_000) throw new Error("檔案超出 12 MB。請選擇本網站匯出的 JSON 檔。");
      const backup = JSON.parse(await file.text());
      if (revision !== importRevision) return;
      if (backup?.format !== backupFormat || backup.version !== 1 || !record(backup.courses)) {
        throw new Error("請選擇本網站匯出的學習紀錄 JSON。");
      }
      const examDrafts = StudyExamDrafts.prepareImport(backup.examDrafts);
      const draftCount = Object.keys(examDrafts).length;
      const courses = migrateArchiveReviews(backup.courses);
      const included = studyCatalog.filter(entry => Object.hasOwn(courses, entry.id));
      if (!included.length && !draftCount) throw new Error("檔案裡沒有這個網站的學習紀錄。");
      const normalized = Object.fromEntries(included.map(entry => [entry.id, normalizeProgress(courses[entry.id], entry)]));
      const summary = included.map(entry => {
        const progress = normalized[entry.id];
        const { done, practice, exam, review, notes } = progress;
        const hasReview = Array.isArray(courses[entry.id].review);
        const hasNotes = record(courses[entry.id].notes);
        if (!hasReview) delete progress.review;
        if (!hasNotes) delete progress.notes;
        return `${entry.label}（${done.length} 頁已讀、${Object.keys(practice).length} 題作答${exam ? "、1 份小考" : ""}${hasReview ? `、${review.length} 項複習清單` : ""}${hasNotes ? `、${Object.keys(notes).length} 則筆記` : ""}）`;
      });
      if (draftCount) summary.push(`${draftCount} 份模擬小考作答紀錄`);
      pendingImport = { courses: normalized, examDrafts };
      showRecordStatus(`將匯入 ${summary.join("、")}，並取代此裝置上對應的紀錄。`);
      applyRecord.hidden = false;
    } catch (error) {
      if (revision !== importRevision) return;
      showRecordStatus(error instanceof SyntaxError ? "無法讀取 JSON。請選擇本網站匯出的學習紀錄。" : error.message, true);
    }
  });
  applyRecord.addEventListener("click", () => {
    if (!pendingImport) return;
    if (!StudyExamDrafts.restore(pendingImport.examDrafts)) {
      showRecordStatus("無法儲存模擬小考紀錄，請確認瀏覽器儲存空間後再試。", true);
      return;
    }
    for (const [courseId, progress] of Object.entries(pendingImport.courses)) {
      saved[courseId] = { ...progress, review: progress.review ?? saved[courseId]?.review ?? [], notes: progress.notes ?? saved[courseId]?.notes ?? {} };
    }
    clearImport();
    const stored = persist();
    navigate(false);
    showRecordStatus(stored ? "已套用學習紀錄。" : "已套用到這次瀏覽。瀏覽器無法儲存，關閉前請先匯出。", !stored);
  });

  document.querySelector(".skip").addEventListener("click", event => {
    event.preventDefault();
    (lecture.hidden ? main : document.querySelector("#lecture-view")).focus();
  });

  function setupMobileHeader() {
    const mobile = matchMedia("(max-width: 650px)");
    const more = document.querySelector("#header-more");
    const resources = document.querySelector("#header-resources");
    const courseToggle = document.querySelector("#course-nav-toggle");
    const courseCurrent = document.querySelector("#course-nav-current");
    const expanded = () => more.getAttribute("aria-expanded") === "true";
    const courseExpanded = () => courseToggle.getAttribute("aria-expanded") === "true";
    let openedDialog;

    function close(restoreFocus = false) {
      more.setAttribute("aria-expanded", "false");
      if (restoreFocus && mobile.matches) more.focus();
    }

    function closeCourse(restoreFocus = false) {
      courseToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus && mobile.matches) courseToggle.focus();
    }

    courseToggle.addEventListener("click", () => {
      if (courseExpanded()) { closeCourse(); return; }
      close();
      courseToggle.setAttribute("aria-expanded", "true");
      (topNav.querySelector("[aria-current]") ?? topNav.querySelector("a"))?.focus();
    });
    topNav.addEventListener("click", event => {
      const link = event.target.closest("a");
      if (courseExpanded() && link) closeCourse(link.hash === location.hash);
    });
    more.addEventListener("click", () => {
      if (expanded()) { close(); return; }
      closeCourse();
      more.setAttribute("aria-expanded", "true");
      resources.querySelector("a:not([hidden]), button:not([hidden])")?.focus();
    });
    resources.addEventListener("click", event => {
      if (!expanded()) return;
      const action = event.target.closest("a, button");
      if (!action) return;
      if (action.id === "study-records") openedDialog = dialog;
      if (action.hasAttribute("data-open-preferences")) openedDialog = document.querySelector("#preferences-dialog");
      close();
    });
    for (const modal of [dialog, document.querySelector("#preferences-dialog")]) {
      modal.addEventListener("close", () => {
        if (openedDialog !== modal) return;
        openedDialog = undefined;
        if (mobile.matches) more.focus();
      });
    }
    document.addEventListener("click", event => {
      if (expanded() && !more.contains(event.target) && !resources.contains(event.target)) close();
      if (courseExpanded() && !courseToggle.contains(event.target) && !topNav.contains(event.target)) closeCourse();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && expanded()) { event.preventDefault(); close(true); }
      if (event.key === "Escape" && courseExpanded()) { event.preventDefault(); closeCourse(true); }
    });
    window.addEventListener("hashchange", () => { close(); closeCourse(); });

    function revealCurrentTab() {
      const active = topNav.querySelector("[aria-current]");
      courseCurrent.textContent = active?.textContent ?? "";
      if (!mobile.matches || document.documentElement.dataset.view === "lecture") return;
      if (!active) { topNav.scrollLeft = 0; return; }
      const strip = topNav.getBoundingClientRect();
      const current = active.getBoundingClientRect();
      if (current.left < strip.left) topNav.scrollLeft += current.left - strip.left;
      else if (current.right > strip.right) topNav.scrollLeft += current.right - strip.right;
    }
    new MutationObserver(() => requestAnimationFrame(revealCurrentTab)).observe(topNav, { childList: true });
    mobile.addEventListener("change", () => { close(); closeCourse(); revealCurrentTab(); });
    revealCurrentTab();
  }

  function setupHomeScroll() {
    const intro = home.querySelector(".home-intro");
    const hero = home.querySelector(".home-hero");
    const content = home.querySelector(".home-content");
    const courseList = home.querySelector("#course-list");
    const header = document.querySelector(".site-header");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = value => Math.min(1, Math.max(0, value));
    let frame = 0;

    function paint() {
      frame = 0;
      if (home.hidden || StudyPreferences.motionReduced()) return;
      const stage = intro.getBoundingClientRect();
      const viewport = window.innerHeight;
      const headerBottom = header.getBoundingClientRect().bottom;
      const scroll = headerBottom - stage.top;
      const travel = Math.max(105, stage.height - hero.offsetHeight);
      const listTop = courseList.getBoundingClientRect().top;
      const coverProgress = clamp(scroll / travel);
      const catalogProgress = Math.min(clamp(window.scrollY / 150),
        clamp((viewport - listTop + 28) / Math.min(310, viewport * .36)));
      const coverOffset = `${headerBottom}px`;
      if (home.style.getPropertyValue("--cover-offset") !== coverOffset) home.style.setProperty("--cover-offset", coverOffset);
      home.style.setProperty("--cover-progress", coverProgress.toFixed(3));
      home.style.setProperty("--catalog-progress", catalogProgress.toFixed(3));
    }

    function queue() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("hashchange", queue);
    document.addEventListener("study-preferences", queue);
    reduced.addEventListener("change", queue);
    hero.addEventListener("focusin", event => {
      const target = event.target;
      if (target.matches(":focus-visible") && target.getBoundingClientRect().bottom > content.getBoundingClientRect().top) {
        window.scrollTo(0, 0);
      }
    });
    if ("ResizeObserver" in window) new ResizeObserver(queue).observe(home);
    queue();
  }

  function start() {
    const outsideDialog = event => {
      if (!(event.target instanceof HTMLDialogElement) || !event.target.open) return false;
      const area = event.target.getBoundingClientRect();
      return event.clientX < area.left || event.clientX > area.right || event.clientY < area.top || event.clientY > area.bottom;
    };
    let pressedBackdrop;
    document.addEventListener("pointerdown", event => { pressedBackdrop = outsideDialog(event) ? event.target : null; });
    document.addEventListener("pointercancel", () => { pressedBackdrop = null; });
    document.addEventListener("click", event => {
      if (pressedBackdrop === event.target && outsideDialog(event)) {
        if (event.target.dispatchEvent(new Event("cancel", { cancelable: true }))) event.target.close();
      }
      pressedBackdrop = null;
    });
    setupMobileHeader();
    StudyCommunity.start({
      courses: publishedCourses, escape, courseLink, useAccount, applySyncedCourse,
      getCourses: () => saved, getGuestCourses: () => readProgress()
    });
    window.addEventListener("hashchange", () => navigate());
    navigate(Boolean(location.hash));
    setupHomeScroll();
  }

  return {
    start, escape, courseLink, loadCourseContent, getProgress, persist, soundEnabled, setSound, findReview, updateReview, saveNote,
    registerCourse: data => dataset.set(data.id, data),
    registerCourseStudy: (id, data) => courseStudies.set(id, data),
    registerCourseLessons: (id, data) => courseLessons.set(id, data),
    registerCourseTranslations: (id, data) => courseTranslations.set(id, Object.fromEntries(
      Object.entries(data).map(([page, content]) => [page, { ...content, page: Number(page) }])
    )),
    registerLectureView: view => { lectureView = view; }
  };
})();

StudySite.start();
