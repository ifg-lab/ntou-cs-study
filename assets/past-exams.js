"use strict";

const StudyPastExams = (() => {
  const { escape, courseLink, getProgress, findReview, updateReview } = StudySite;
  const papers = [studyMidterm2026, ...studyPastExams].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  const questions = papers.flatMap(paper => {
    const items = paper.items ?? transcribe(paper);
    return items.map(item => {
      const partScopes = paper.partScopes?.[item.number];
      const topics = [...item.topic];
      for (const part of Object.values(partScopes ?? {})) {
        for (const lecture of part.lectures) {
          if (!topics.some(([number]) => number === lecture)) topics.push([lecture]);
        }
      }
      return { ...item, paper, topics, partScopes };
    });
  });
  const referenceFor = question => `${question.paper.id}/${question.number}`;
  const byReference = new Map(questions.map(question => [referenceFor(question), question]));
  const idFor = ({ paper, number }) => `past-${paper.id}-${number}`;
  const sourceLabel = examSourceLabel;
  const paperYear = paper => String(paper.year ?? "undated");
  const normalize = text => text.normalize("NFKC").toLowerCase().trim();
  const archivePath = (scope, ...segments) => scope
    ? courseLink(scope.id, "past-exams", ...segments) : courseLink("past-exams", ...segments);

  function transcribe(paper) {
    const items = [];
    const original = paper.questions.trim().split("\n");
    const decoded = line => line.replace(/(?<!\\)\\n/g, "\n").replace(/\\\\/g, "\\");
    for (const row of examTranscripts[paper.id].trim().split("\n")) {
      const bar = row.indexOf("|");
      const field = row.slice(0, bar), value = row.slice(bar + 1);
      const current = items.at(-1);
      if (field === "C") current.code = decoded(value);
      else if (field === "D") current.continuation = decoded(value);
      else if (field === "F") current.figure = value;
      else if (field === "A") {
        const part = value.indexOf("|");
        current.parts ??= [];
        current.parts.push([String.fromCharCode(97 + current.parts.length), Number(value.slice(0, part)), value.slice(part + 1)]);
      } else {
        const [scope, title] = original[items.length].split("|");
        const number = items.length + 1;
        const topic = scope ? scope.split(",").map(ref => ref.split(":").map(Number)) : [];
        const solution = detailedExamSolutions[paper.id][number];
        const work = detailedExamWork[paper.id]?.[number];
        items.push({ number, title, prompt: decoded(value), points: Number(field), topic, ...solution, ...work });
      }
    }
    const tools = {
      "2018-quiz2": { 3: "pipeline" }, "2022-quiz1": { 1: "kmap" },
      "2025-midterm": { 4: "huffman" }, "2025-quiz3": { 3: "josephus", 4: "mst" }, "2025-final": { 10: "mst" },
      "2026-quiz1": { 2: "kmap", 6: "huffman", 10: "raid" }, "2026-quiz2": { 1: "machineTrace", 2: "pipeline", 8: "timeline" }
    }[paper.id] ?? {};
    for (const item of items) {
      item.interactive = tools[item.number];
      item.reference = paper.id;
      if (item.interactive === "kmap") item.variables = paper.year === 2022 ? 3 : 4;
      if (item.interactive === "huffman" && paper.year === 2026) item.note = studyMidterm2026.items[1].note;
      if (item.interactive === "mst") {
        item.note = paper.id === "2025-quiz3"
          ? "圖依考卷照片重繪。照片上的手寫線條蓋住部分小字，1–2 的權重按可辨讀的標記採 7。"
          : "圖依考卷照片重繪。";
      }
      if (paper.id === "2026-quiz1" && item.number === 2) item.note = "原題文字列 A、B、C，公式另含 D，依公式列真值表。";
      if (paper.id === "2025-midterm" && item.number === 9) item.note = "卷面命令列和記憶體表在 121E／121C 有差異，詳解從 PC 指到的記憶體內容執行。";
    }
    return items;
  }

  function forLecture(question, lecture) {
    if (!question.topics.some(([number]) => number === lecture)) return null;
    const { partScopes } = question;
    if (!partScopes) return question;

    const parts = question.parts.filter(([label]) => partScopes[label]
      ? partScopes[label].lectures.includes(lecture) : question.topic.some(([number]) => number === lecture));
    return narrowQuestion(question, parts, parts.map(([label]) => partScopes[label]?.step));
  }

  function narrowQuestion(question, parts, stepIndices) {
    if (!parts.length) return null;
    if (parts.length === question.parts.length) return question;
    const steps = [...new Set(stepIndices)].map(index => question.steps[index]).filter(Boolean);
    const points = parts.reduce((total, [, value]) => total + value, 0);
    return { ...question, parts, steps, points, partial: true, interactive: undefined, exam: undefined, rubric: undefined, tables: undefined, drawing: undefined };
  }

  function reviewLocation(question, part) {
    const reference = referenceFor(question);
    const id = part ? `${reference}/${part}` : reference;
    const numbers = question.partScopes?.[part]?.lectures ?? question.topics.map(([lecture]) => lecture);
    const lectures = numbers.map(lecture => studyCatalog.find(entry => Number(entry.number) === lecture)).filter(Boolean);
    const course = lectures.find(entry => !entry.pending) ?? lectures[0];
    return { course, id };
  }

  function reviewButtons(question, showParts = false) {
    const controls = showParts || question.partial ? question.parts?.map(([part]) => part) ?? [] : [];
    if (!question.partial) controls.unshift("");
    if (!controls.length) return "";
    return `<div class="exam-save-actions" aria-label="考古題重做清單">${controls.map(part => {
      const { course, id } = reviewLocation(question, part);
      if (!course) return "";
      const saved = findReview(course.id, "exam", id);
      const active = saved && !saved.mastered;
      return `<button type="button" class="utility exam-save" data-exam-save="${id}" aria-pressed="${Boolean(active)}">${saveLabel(part, active)}</button>`;
    }).join("")}</div>`;
  }

  function saveLabel(part, active) {
    return `${active ? "已加入重做" : "加入重做"}${part ? ` (${part})` : ""}`;
  }

  function bindReview(root) {
    for (const button of root.querySelectorAll("[data-exam-save]")) {
      button.addEventListener("click", () => {
        const [paper, number, part] = button.dataset.examSave.split("/");
        const question = byReference.get(`${paper}/${number}`);
        const { course, id } = reviewLocation(question, part);
        const saved = findReview(course.id, "exam", id);
        const title = `${sourceLabel(question.paper)} · 第 ${number} 題${part ? ` (${part})` : ""} · ${question.title}`;
        const lecture = Number(course.number);
        const fallback = question.topics.find(([number]) => number === lecture)?.[1];
        const [page] = examReviewPages(id, lecture, fallback);
        updateReview(course.id, { type: "exam", id, title, page: page ?? null },
          saved ? saved.mastered ? "status" : "remove" : "add");
        const updated = findReview(course.id, "exam", id);
        const active = Boolean(updated && !updated.mastered);
        for (const toggle of root.querySelectorAll(`[data-exam-save="${id}"]`)) {
          toggle.textContent = saveLabel(part, active);
          toggle.setAttribute("aria-pressed", String(active));
        }
      });
    }
  }

  const algorithmLabs = {
    "2025-quiz3/2": ["recursion",37,"binary-search","用原題姓名跑二元搜尋"],
    "2025-quiz3/4": ["graphs",45,"mst","用原題圖形跑最小生成樹"],
    "2025-final/10": ["graphs",45,"mst","用原題圖形跑最小生成樹"]
  };

  function card(question, scoped, showIndex) {
    const { paper, number, title, note, topics } = question;
    const chapters = topics.flatMap(([number,page]) => {
      const entry = studyCatalog.find(chapter => Number(chapter.number) === number);
      return entry ? [[entry,page]] : [];
    });
    const links = chapters.filter(([,page]) => page).map(([entry,page]) =>
      `<a href="${courseLink(entry.id, "learn", "", page)}">回 ${escape(entry.label)} · p.${page}</a>`);
    const topicLabels = chapters.map(([entry]) => entry.label);
    const activity = algorithmLabs[referenceFor(question)];
    if (activity) {
      const [unit,page,concept,label] = activity;
      links.push(`<a href="${courseLink("lecture-06","learn",unit,page,concept)}">${label} ↗</a>`);
    }
    return `<article class="past-question" id="${idFor(question)}">
      <header class="past-question-heading">
        <p class="past-source" title="${escape(sourceLabel(paper))}">第 ${number} 題</p>
        <h3 lang="en">${escape(title)}</h3>
        ${question.points ? `<span class="exam-points" lang="en">${question.points} points</span>` : ""}
      </header>
      ${question.partial ? `<p class="past-note">以下只列出和 ${escape(scoped.label)} 有關的小題與配分。</p>` : ""}
      ${StudyMidterm.prompt(question)}
      ${note ? `<p class="past-note">${escape(note)}</p>` : ""}
      ${question.steps.length ? `<details class="archive-solution"><summary>參考答案與解題步驟</summary>${StudyMidterm.solution(question)}</details>` : ""}
      ${reviewButtons(question)}
      ${topicLabels.length || showIndex ? `<footer class="past-question-footer">${topicLabels.length ? `<span>${topicLabels.join("、")}</span>` : ""}${links.join("")}
        ${scoped && topics.length > 1 ? `<a href="${courseLink("past-exams", paper.id, number)}">查看完整原題</a>` : ""}
        ${showIndex ? `<button type="button" class="text-button" data-archive-back="${number}">回題號索引</button>` : ""}</footer>` : ""}
    </article>`;
  }

  function show(container, segments, scope) {
    const [paperId, ordinal] = segments;
    if (paperId === "topics") { showConcepts(container, scope, ordinal); return; }
    if (paperId === "range") { rangeSetup(container, scope, segments.slice(1)); return; }
    if (paperId === "retry") { retry(container, ...segments.slice(1)); return; }
    const directPaper = papers.find(item => item.id === paperId);
    if (ordinal === "mock") {
      const collection = directPaper ? questions.filter(item => item.paper === directPaper) : [];
      if (collection.length) StudyMidterm.mock(container, directPaper, collection);
      else mockCatalog(container, paperId === "notes-review");
      return;
    }
    if (paperId === "mock") { mockCatalog(container); return; }
    const page = paperId === "page" && scope && /^\d+$/.test(ordinal) ? Number(ordinal) : null;
    const scopedPath = page ? archivePath(scope, "page", page) : archivePath(scope);
    const available = scope ? questions.map(item => page
      ? forPages(item, Number(scope.number), (start, end) => start <= page && page <= end)
      : forLecture(item, Number(scope.number))).filter(Boolean) : questions;
    const directQuestion = directPaper && available.find(item => item.paper === directPaper && item.number === Number(ordinal));
    if (!available.length) {
      container.innerHTML = page
        ? `<p class="site-message">目前沒有考古題對照到 p.${page}。</p>
          <div class="past-tools"><a class="btn secondary" href="${courseLink(scope.id, "learn", "", page)}">回 p.${page} 教材</a>
          <a class="btn secondary" href="${archivePath(scope)}">查看 ${escape(scope.label)} 考古題</a></div>`
        : `<p class="site-message">目前${scope ? `沒有收錄 ${escape(scope.label)} 的` : "沒有收錄任何"}考古題。</p>`;
      return;
    }
    const availablePapers = papers.filter(paper => available.some(item => item.paper === paper));
    const years = [...new Set(availablePapers.map(paperYear))];
    const active = directPaper ? { year: paperYear(directPaper), paper: directPaper.id, lecture: "all", query: "" } :
      { year: "all", paper: "all", lecture: "all", query: "" };
    container.innerHTML = `${page ? `<a class="exam-back" href="${courseLink(scope.id, "learn", "", page)}">← 回 p.${page} 教材</a>` : ""}
    <div class="past-tools">
      <a class="btn secondary" href="${archivePath(scope, "topics")}">考點索引</a>
      ${scope?.pending ? "" : `<a class="btn secondary" href="${archivePath(scope, "range")}">依頁碼練原題</a>`}
      <a class="btn secondary" href="#review/exam">考古題重做清單</a>
    </div><div class="exam-archive">
    <aside class="archive-index" aria-label="考古題篩選">
      <div class="archive-index-heading"><h2>選擇考卷</h2><button class="utility" type="button" data-clear-past>清除篩選</button></div>
      <div class="past-filters${scope ? " is-scoped" : ""}">
      <label>年份<span class="exam-select"><select class="field" name="year"><option value="all">全部年份</option>${years.map(year =>
        `<option value="${year}">${year === "undated" ? "年份未標示" : year}</option>`).join("")}</select></span></label>
      <label>場次<span class="exam-select"><select class="field" name="paper"></select></span></label>
      ${scope ? "" : `<label>章次<span class="exam-select"><select class="field" name="lecture"><option value="all">全部章次</option>${studyCatalog.map(lecture =>
        `<option value="${Number(lecture.number)}">${escape(lecture.label)} · ${escape(lecture.title)}</option>`).join("")}</select></span></label>`}
      <label class="past-query">搜尋考點<span class="exam-search-field"><span class="search-icon" aria-hidden="true"></span><input class="field" name="query" type="search" placeholder="${scope ? "輸入關鍵字" : "例如：死結、DMA"}" maxlength="100"></span></label>
    </div>
    <details class="archive-question-nav" hidden>
      <summary>題號索引</summary><nav aria-label="考卷題號"></nav>
    </details></aside>
    <div class="archive-reading">
      <div class="past-count"><p role="status"></p></div>
      <div class="past-exam-list"></div>
    </div></div>`;
    const controls = container.querySelector(".past-filters");
    const select = name => controls.querySelector(`[name="${name}"]`);
    const list = container.querySelector(".past-exam-list");
    const status = container.querySelector("[role=status]");
    const clear = container.querySelector("[data-clear-past]");
    const questionIndex = container.querySelector(".archive-question-nav");
    const indexLinks = questionIndex.querySelector("nav");
    const wide = matchMedia("(min-width: 801px)");
    questionIndex.open = wide.matches;
    let selectedQuestion = directQuestion?.number;

    function selectQuestion(id) {
      selectedQuestion = id;
      for (const link of indexLinks.querySelectorAll("a")) {
        if (Number(link.dataset.archiveQuestion) === id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }

    function jumpToQuestion(id, number) {
      const heading = document.getElementById(id)?.querySelector("h3");
      if (!heading) return;
      selectQuestion(number);
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: "start" });
    }

    function render() {
      const visiblePapers = availablePapers.filter(paper => active.year === "all" || paperYear(paper) === active.year);
      if (!visiblePapers.some(paper => paper.id === active.paper)) active.paper = "all";
      select("paper").innerHTML = `<option value="all">全部場次</option>${visiblePapers.map(paper =>
        `<option value="${paper.id}">${escape(sourceLabel(paper))}</option>`).join("")}`;
      select("paper").value = active.paper;
      const words = normalize(active.query).split(/\s+/).filter(Boolean);
      const matching = available.filter(question => {
        const { paper, topics, title, prompt, exam, examEnglish, steps, parts } = question;
        return visiblePapers.includes(paper) && (active.paper === "all" || active.paper === paper.id) &&
          (active.lecture === "all" || topics.some(([lecture]) => String(lecture) === active.lecture)) &&
          words.every(word => normalize([title, prompt, exam, examEnglish, ...steps, ...(parts ?? []).map(part => part[2])].join(" ")).includes(word));
      });
      const grouped = visiblePapers.map(paper => [paper, matching.filter(item => item.paper === paper)]).filter(([, items]) => items.length);
      const showIndex = active.paper !== "all" && matching.length > 0;
      questionIndex.hidden = !showIndex;
      indexLinks.innerHTML = showIndex ? matching.map(item => `<a href="${archivePath(scope, item.paper.id, item.number)}"
        data-archive-question="${item.number}" data-question-id="${idFor(item)}" aria-label="第 ${item.number} 題">${item.number}</a>`).join("") : "";
      selectQuestion(selectedQuestion);
      status.textContent = `共 ${grouped.length} 份考卷、${matching.length} 題`;
      list.innerHTML = grouped.map(([paper, items]) => `<section class="past-paper">
        <header><div><h2>${scope ? escape(sourceLabel(paper)) : `<a href="${courseLink("past-exams", paper.id)}">${escape(sourceLabel(paper))}</a>`}</h2>
        <span>${items.length} 題 · 原題與詳解</span></div>
        ${scope ? `<a class="btn secondary" href="${courseLink("past-exams", paper.id)}">查看整份考卷</a>`
          : `<a class="btn secondary" href="${courseLink("past-exams", paper.id, "mock")}">模擬這份考卷</a>`}</header>
        ${paper.note ? `<p class="past-note">${escape(paper.note)}</p>` : ""}
        <div class="past-paper-questions">${items.map(item => card(item, scope, showIndex)).join("")}</div></section>`).join("") || '<p class="site-message">沒有符合的題目，請更換關鍵字或篩選。</p>';
      StudyMidterm.bind(list);
      bindReview(list);
    }

    for (const field of controls.querySelectorAll("select, input")) field.value = active[field.name];
    function update(event) {
      if (event.target.name === "paper" || event.target.name === "year") selectedQuestion = undefined;
      active[event.target.name] = event.target.value;
      if (location.hash !== scopedPath) history.replaceState(history.state, "", scopedPath);
      render();
    }
    for (const field of controls.querySelectorAll("select")) field.addEventListener("change", update);
    select("query").addEventListener("input", update);
    clear.addEventListener("click", () => {
      history.replaceState(history.state, "", scopedPath);
      show(container, page ? ["page", String(page)] : [], scope);
      container.querySelector("select").focus();
    });
    indexLinks.addEventListener("click", event => {
      const link = event.target.closest("a");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (!wide.matches) questionIndex.open = false;
      jumpToQuestion(link.dataset.questionId, Number(link.dataset.archiveQuestion));
    });
    list.addEventListener("click", event => {
      const back = event.target.closest("[data-archive-back]");
      if (!back) return;
      const link = indexLinks.querySelector(`[data-archive-question="${back.dataset.archiveBack}"]`);
      if (!link) return;
      questionIndex.open = true;
      selectQuestion(Number(back.dataset.archiveBack));
      link.focus({ preventScroll: true });
      (wide.matches ? link : questionIndex).scrollIntoView({ block: wide.matches ? "nearest" : "start" });
    });
    render();
    if (directQuestion) jumpToQuestion(idFor(directQuestion), directQuestion.number);
  }

  function showConcepts(container, scope, selected) {
    const lookup = reference => {
      const item = byReference.get(reference);
      return scope && item ? forLecture(item, Number(scope.number)) : item;
    };
    const groups = examConcepts.map(([slug, title, refs]) => ({ slug, title, items: refs.map(lookup).filter(Boolean) }))
      .filter(group => group.items.length)
      .sort((a, b) => new Set(b.items.map(item => item.paper)).size - new Set(a.items.map(item => item.paper)).size);
    container.innerHTML = `<a class="exam-back" href="${archivePath(scope)}">← 回考古題</a>
      <p class="past-note">每個考點列出題目與出處。場次按考卷計，同一份卷只計一次。</p>
      <label class="concept-search">搜尋考點<span class="exam-search-field"><span class="search-icon" aria-hidden="true"></span><input name="concept-query" class="field" type="search" placeholder="例如：Context Switching、霍夫曼"></span></label>
      <div class="exam-concept-list"></div>`;
    const search = container.querySelector("input");
    const list = container.querySelector(".exam-concept-list");
    function render() {
      const words = normalize(search.value).split(/\s+/).filter(Boolean);
      list.innerHTML = groups.filter(({ title }) => words.every(word => normalize(title).includes(word)))
        .map(({ slug, title, items }) => {
          const refs = items.map(referenceFor);
          const [name, english] = title.split(" · ");
          return `<details class="exam-concept"${slug === selected || words.length ? " open" : ""}>
            <summary><span class="concept-title"><strong>${escape(name)}</strong><span lang="en">${escape(english)}</span></span>
              <span class="concept-count">${new Set(items.map(item => item.paper)).size} 場 · ${items.length} 題</span></summary>
            <ul>${items.map(item => {
              const reference = referenceFor(item);
              const repeat = examRepetitions.some(group => group.includes(reference) && group.filter(ref => refs.includes(ref)).length > 1);
              const label = repeat ? "有近似題" : items.length > 1 ? "同考點題" : "";
              return `<li><div><a href="${archivePath(scope, item.paper.id, item.number)}">${escape(sourceLabel(item.paper))} · 第 ${item.number} 題</a>
                <span lang="en">${escape(item.title)}</span></div>${label ? `<small${repeat ? ' class="is-repeat"' : ""}>${label}</small>` : ""}</li>`;
            }).join("")}</ul>
          </details>`;
        }).join("") || '<p class="site-message">沒有符合的考點。</p>';
    }
    search.addEventListener("input", render);
    render();
  }

  function forPages(question, lecture, inRange) {
    const inLecture = forLecture(question, lecture);
    if (!inLecture) return null;
    const coverage = examPageCoverage[referenceFor(question)]?.[lecture];
    if (coverage && !Array.isArray(coverage)) {
      const parts = inLecture.parts.filter(([part]) => coverage[part] && inRange(...coverage[part]));
      return narrowQuestion(question, parts, parts.flatMap(([part]) => coverage[part][2]));
    }
    const page = question.topics.find(([number]) => number === lecture)?.[1];
    return (coverage ? inRange(...coverage) : page && inRange(page, page)) ? inLecture : null;
  }

  function rangeSetup(container, scope, [start, end, option]) {
    const availableCourses = studyCatalog.filter(entry => !entry.pending);
    const entry = scope ?? [...availableCourses].sort((a, b) =>
      (getProgress(b.id).lastReadAt ?? 0) - (getProgress(a.id).lastReadAt ?? 0))[0];
    if (entry.pending) {
      container.innerHTML = `<p class="site-message">${escape(entry.label)} 的講義還沒上架。</p><a href="${archivePath(entry)}">回 ${escape(entry.label)} 考古題</a>`;
      return;
    }
    const low = entry.firstPage ?? 1;
    const high = low + entry.pages - 1;
    const progress = getProgress(entry.id);
    const from = Number(start ?? low);
    const to = Number(end ?? progress.lastPage ?? low);
    const read = option === "read";
    container.innerHTML = `<a class="exam-back" href="${archivePath(scope)}">← 回考古題</a>
      <form class="exam-range-form" aria-labelledby="exam-range-title">
        <header class="range-intro">
          <h2 id="exam-range-title">練習範圍</h2>
          <p>可用頁碼 p.${low}–${high} · 結束頁預設為最近開過的頁面</p>
        </header>
        <div class="exam-range-fields">
          <label class="range-course">章次<span class="exam-select"><select name="course" class="field">${availableCourses.map(course => `<option value="${course.id}"${course === entry ? " selected" : ""}>${escape(course.label)} · ${escape(course.title)}</option>`).join("")}</select></span></label>
          <div class="range-page-pair">
            <label>起始頁<span class="exam-page-field"><span aria-hidden="true">p.</span><input name="from" class="field" type="number" min="${low}" max="${high}" value="${from}" inputmode="numeric" required></span></label>
            <span class="range-divider" aria-hidden="true">–</span>
            <label>結束頁<span class="exam-page-field"><span aria-hidden="true">p.</span><input name="to" class="field" type="number" min="${low}" max="${high}" value="${to}" inputmode="numeric" required></span></label>
          </div>
        </div>
        <div class="range-options">
          <label class="range-read"><input type="checkbox" name="read" aria-labelledby="range-read-label" aria-describedby="range-read-help"${read ? " checked" : ""}>
            <span><strong id="range-read-label">只用已讀頁</strong><small id="range-read-help">只選你在講義標記為已讀的頁面。</small></span>
          </label>
          <p class="past-note">有講義頁碼對照的原題才會入卷。跨頁題會檢查完整範圍，小題有各自頁碼時可分開出題。</p>
        </div>
        <footer class="range-actions"><p class="range-feedback" role="status"></p><button class="btn" type="submit">開始原題練習 <span aria-hidden="true">→</span></button></footer>
      </form><div class="exam-range-result"></div>`;
    const form = container.querySelector("form");
    const { course, from: min, to: max, read: readOnly } = form.elements;
    const result = container.querySelector(".exam-range-result");
    function selection() {
      const begin = min.valueAsNumber, finish = max.valueAsNumber;
      const done = new Set(getProgress(entry.id).done);
      const valid = form.checkValidity() && begin <= finish;
      const inRange = (first, last) => first >= begin && last <= finish &&
        (!readOnly.checked || Array.from({ length: last - first + 1 }, (_, i) => first + i).every(page => done.has(page)));
      const items = valid ? questions.map(item => forPages(item, Number(entry.number), inRange)).filter(Boolean) : [];
      const feedback = form.querySelector("[role=status]");
      feedback.textContent = !valid ? "請輸入有效頁碼，起始頁須小於或等於結束頁。"
        : items.length ? `符合範圍 ${items.length} 題` : "這個範圍沒有符合條件的原題。";
      feedback.dataset.state = !valid ? "invalid" : items.length ? "ready" : "empty";
      form.querySelector('button[type="submit"]').disabled = !items.length;
      result.hidden = begin !== from || finish !== to || readOnly.checked !== read;
      return items;
    }
    course.addEventListener("change", () => { location.hash = courseLink(course.value, "past-exams", "range"); });
    form.addEventListener("input", selection);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const items = selection();
      if (!items.length) return;
      const target = archivePath(entry, "range", min.valueAsNumber, max.valueAsNumber, ...(readOnly.checked ? ["read"] : []));
      if (location.hash === target) result.querySelector("h2")?.focus();
      else location.hash = target;
    });
    const items = selection();
    if (start !== undefined && end !== undefined && items.length) {
      const signature = items.map(item => referenceFor(item) + (item.partial ? item.parts.map(([part]) => part).join("") : "")).join(",");
      StudyMidterm.mock(result, {
        id: `range:${entry.id}:${signature}`, name: `${entry.label} · p.${from}–${to} 原題練習`,
        back: archivePath(entry), sourceBeforeSubmit: true
      }, items);
    }
  }

  function retry(container, paper, number, part) {
    const question = byReference.get(`${paper}/${number}`);
    const chosen = part && question?.parts?.find(([label]) => part === label);
    if (!question || (part && !chosen)) {
      container.innerHTML = '<p class="site-message">找不到這道原題。</p><a href="#review">回複習清單</a>';
      return;
    }
    const item = chosen ? narrowQuestion(question, [chosen], partStepsFor(question, part)) : question;
    StudyMidterm.mock(container, {
      id: "retry", name: `${sourceLabel(question.paper)} · 第 ${question.number} 題${part ? ` (${part})` : ""}`,
      back: courseLink("review", "exam"), backLabel: "回複習清單", sourceBeforeSubmit: true, transient: true
    }, [item]);
  }

  function partStepsFor(question, part) {
    const reference = referenceFor(question);
    const partPage = Object.values(examPageCoverage[reference] ?? {}).find(coverage => coverage[part])?.[part];
    return partPage?.[2] ?? examPartSteps[reference]?.[part] ?? [];
  }

  function mockCatalog(container, startMixed = false) {
    const featured = ["2026-midterm", "2026-quiz1", "2026-quiz2", "2025-quiz2", "2025-midterm"];
    const list = [...papers].sort((a, b) => Number(!featured.includes(a.id)) - Number(!featured.includes(b.id)));
    const selection = [
      ["2026-quiz1", 1], ["2026-midterm", 1], ["2026-midterm", 2], ["2026-midterm", 3], ["2026-quiz2", 2],
      ["2026-midterm", 6], ["2026-midterm", 7], ["2026-midterm", 8], ["2025-quiz2", 8], ["2025-quiz2", 12]
    ].map(([id, number]) => questions.find(item => item.paper.id === id && item.number === number));
    if (startMixed) {
      StudyMidterm.mock(container, { id: "notes-review", name: "筆記重點混合卷" }, selection);
      return;
    }
    container.innerHTML = `<div class="past-tools"><a class="btn secondary" href="#past-exams/range">依頁碼練原題</a><a class="btn secondary" href="#review/exam">考古題重做清單</a></div>
      <section class="mock-feature"><div><h2>筆記重點混合卷</h2>
      <p>依 L1～L5 筆記選題，包含儲存程式、二補數、Huffman、指令管線、排程、死結及網路。</p></div>
      <a class="btn" href="${courseLink("past-exams", "notes-review", "mock")}">開始原題混合卷 <span aria-hidden="true">→</span></a></section>
      <h2 class="mock-catalog-title">按年份與場次練整卷</h2><ul class="mock-paper-list">${list.map(paper => {
        const items = questions.filter(item => item.paper === paper);
        return `<li><a href="${courseLink("past-exams", paper.id, "mock")}">${escape(sourceLabel(paper))}</a>
          <span>${items.length} 大題 · ${items.reduce((sum, item) => sum + item.points, 0)} 分</span></li>`;
      }).join("")}</ul>`;
  }

  return { show, reviewButtons, bindReview };
})();
