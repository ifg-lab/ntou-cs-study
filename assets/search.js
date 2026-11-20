"use strict";

(() => {
  const { courseLink, escape, loadCourseContent, loadExamSources } = StudySite;
  const courses = studyCatalog.filter(entry => !entry.pending);
  const trigger = document.querySelector("#open-search");
  const dialog = document.querySelector("#search-dialog");
  const input = document.querySelector("#site-search");
  const type = document.querySelector("#search-type");
  const courseFilter = document.querySelector("#search-course");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  const more = document.querySelector("#search-more");
  const retry = document.querySelector("#search-retry");
  const names = { page: "教材頁", term: "術語", activity: "互動實驗", exam: "考古題" };
  const examKey = "exams";
  const pageSize = 10;
  const index = new Map();
  let loading;
  let limit = pageSize;

  const normalize = text => String(text ?? "").normalize("NFKC").toLowerCase()
    .replace(/[‐‑‒–—−]/g, "-").trim().replace(/\s+/g, " ");
  const pageLabel = page => page ? `p.${page}` : "";

  function addCourse(entry, { course, study, activities }) {
    const entries = [];
    const units = new Map(course.slides.map(slide => [slide.page,
      course.units.find(unit => unit.start <= slide.page && slide.page <= unit.end)]));
    const termPages = new Map();
    const aliases = new Map();
    for (const [alias, name] of Object.entries(course.termAliases ?? {})) {
      if (!aliases.has(name)) aliases.set(name, []);
      aliases.get(name).push(alias);
    }
    const termKeywords = name => [name, course.terms.get(name)?.chinese, ...(aliases.get(name) ?? [])].filter(Boolean);

    function add(kind, title, alternate, page, path, description, keywords, pages = [page]) {
      entries.push({
        kind, title, alternate, page, path, description, course: entry,
        titles: [title, alternate].filter(Boolean).map(normalize),
        keywords: normalize(keywords.join(" ")),
        text: normalize([description, entry.title, entry.english, entry.label, `第${entry.chapter}章`, `lecture ${Number(entry.number)}`].join(" ")),
        pages: new Set(pages)
      });
    }

    for (const slide of course.slides) {
      const unit = units.get(slide.page);
      for (const name of slide.terms) {
        if (!termPages.has(name)) termPages.set(name, []);
        termPages.get(name).push(slide.page);
      }
      add("page", slide.title, "", slide.page, courseLink(entry.id, "learn", unit.id, slide.page),
        study?.lessons?.[slide.page]?.summary ?? slide.paragraphs.join(" "), [unit.title, ...slide.terms.flatMap(termKeywords)]);
    }

    for (const [name, term] of course.terms) {
      const pages = termPages.get(name) ?? [];
      const page = pages[0];
      const path = page ? courseLink(entry.id, "terms", name, page) : courseLink(entry.id, "terms", name);
      add("term", term.chinese, name, page, path, term.explanation,
        [...(aliases.get(name) ?? []), study?.terms?.[name]?.explanation], pages);
    }

    const slides = new Map(course.slides.map(slide => [slide.page, slide]));
    const conceptTerms = new Map();
    for (const [name, detail] of Object.entries(study?.terms ?? {})) {
      if (!detail.concept) continue;
      if (!conceptTerms.has(detail.concept)) conceptTerms.set(detail.concept, []);
      conceptTerms.get(detail.concept).push(...termKeywords(name));
    }
    for (const activity of activities) {
      const unit = units.get(activity.page);
      add("activity", activity.title, "", activity.page,
        courseLink(entry.id, "learn", unit.id, activity.page, activity.concept), activity.intro,
        [course.concepts[activity.concept], ...activity.concept.split("-"),
          ...(conceptTerms.get(activity.concept) ?? []), ...slides.get(activity.page).terms.flatMap(termKeywords)]);
    }
    index.set(entry.id, entries);
  }

  function addExams(papers) {
    const chapterForNumber = new Map(studyCatalog.map(chapter => [Number(chapter.number), chapter]));
    const references = indexExamReadingLinks(papers);
    const entries = examCatalogEntries(papers).flatMap(item => {
      const courses = new Map(item.topic);
      for (const part of Object.values(item.paper.partScopes?.[item.number] ?? {})) {
        for (const lecture of part.lectures) if (!courses.has(lecture)) courses.set(lecture, undefined);
      }
      const { paper, number, title, prompt } = item;
      return [...courses].flatMap(([lecture, page]) => {
        const course = chapterForNumber.get(lecture);
        if (!course) return [];
        const matched = (references.get(lecture) ?? []).filter(ref => ref.paper === paper && ref.number === number);
        const pages = new Set(matched.flatMap(({ start, end }) => Array.from({ length:end - start + 1 }, (_, i) => start + i)));
        const source = `${examSourceLabel(paper)} · 第 ${number} 題`;
        return [{
          kind: "exam", course, title, description: prompt, source, page: matched[0]?.start ?? page,
          path: courseLink(course.id, "past-exams", paper.id, number), pages,
          titles: [normalize(title)],
          keywords: normalize([source, course.title, course.label, item.keywords].join(" ")),
          text: normalize([prompt, ...(item.parts ?? []).map(part => part[2]), ...(item.steps ?? [])].join(" "))
        }];
      });
    });
    index.set(examKey, entries);
  }

  function score(entry, phrase, words, pages) {
    if (!pages.every(page => entry.pages.has(page))) return 0;
    let relevance = 1;
    for (const word of words) {
      if (entry.titles.includes(word)) relevance += 36;
      else if (entry.titles.some(title => title.includes(word))) relevance += 18;
      else if (entry.keywords.includes(word)) relevance += 6;
      else if (entry.text.includes(word)) relevance += 2;
      else return 0;
    }
    if (phrase && words.length > 1 && entry.titles.some(title => title.includes(phrase))) relevance += 15;
    return relevance;
  }

  function search(query) {
    const pages = [];
    const phrase = normalize(query).replace(/\bp\.?\s*(\d+)\b|(\d+)\s*頁/g, (_, left, right) => {
      pages.push(Number(left ?? right));
      return " ";
    }).trim();
    const words = phrase.split(/\s+/).filter(Boolean);
    return [...index.values()].flatMap(entries => entries)
      .filter(entry => (type.value === "all" || entry.kind === type.value) &&
        (courseFilter.value === "all" || entry.course.id === courseFilter.value))
      .map(entry => ({ entry, page: pages[0] ?? entry.page, relevance: score(entry, phrase, words, pages) }))
      .filter(match => match.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance || (a.page ?? Infinity) - (b.page ?? Infinity));
  }

  function render() {
    const query = input.value.trim();
    const missing = courses.filter(entry => !index.has(entry.id)).length;
    const missingExams = !index.has(examKey);
    const coverage = [missing ? `${missing} 章載入失敗` : "", missingExams ? "原題索引載入失敗" : ""].filter(Boolean).join(" · ");
    const coverageLabel = coverage ? `（${coverage}）` : "";
    retry.hidden = Boolean(loading) || (!missing && !missingExams);
    more.hidden = true;
    if (loading || !query || !index.size) {
      results.replaceChildren();
      status.textContent = loading ? "正在載入搜尋資料…" : !index.size ? "搜尋資料載入失敗，請重試。" :
        `可搜尋講義、術語、互動實驗和考古題。試試 p.38、2026 Huffman。${coverageLabel}`;
      return;
    }
    const matches = search(query);
    const shown = matches.slice(0, limit);
    results.innerHTML = shown.map(({ entry, page }) => {
      const details = [entry.course.label, names[entry.kind], pageLabel(page), entry.source].filter(Boolean).join(" · ");
      const title = entry.alternate ? `${entry.title} · ${entry.alternate}` : entry.title;
      const path = entry.kind === "term" && page !== entry.page ? courseLink(entry.course.id, "terms", entry.alternate, page) : entry.path;
      return `<li><a href="${escape(path)}"><span class="search-result-meta">${escape(details)}</span>
        <strong>${escape(title)}</strong>${entry.description ? `<span class="search-result-description">${escape(entry.description)}</span>` : ""}</a></li>`;
    }).join("");
    status.textContent = matches.length ? `顯示 ${shown.length}／${matches.length} 筆結果${coverageLabel}` :
      `找不到符合的結果。可以換關鍵字或放寬篩選。${coverageLabel}`;
    more.hidden = shown.length >= matches.length;
  }

  function loadIndex() {
    if (loading || index.size === courses.length + 1) return;
    const tasks = courses.filter(entry => !index.has(entry.id)).map(async entry => {
      addCourse(entry, await loadCourseContent(entry, { indexOnly:true }));
    });
    if (!index.has(examKey)) tasks.push(loadExamSources().then(addExams));
    loading = Promise.allSettled(tasks).then(() => {
      loading = undefined;
      if (dialog.open) render();
    });
  }

  function filterResults() {
    limit = pageSize;
    render();
  }

  for (const entry of studyCatalog) courseFilter.add(new Option(`${entry.label} · ${entry.title}`, entry.id));
  trigger.hidden = false;
  trigger.addEventListener("click", () => {
    dialog.showModal();
    loadIndex();
    render();
    input.select();
  });
  input.addEventListener("input", () => {
    filterResults();
  });
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter" || event.isComposing) return;
    results.querySelector("a")?.focus();
  });
  type.addEventListener("change", filterResults);
  courseFilter.addEventListener("change", filterResults);
  results.addEventListener("click", event => {
    if (event.target.closest("a") && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) dialog.close();
  });
  more.addEventListener("click", () => {
    const oldLimit = limit;
    limit += pageSize;
    render();
    results.children[oldLimit]?.firstElementChild.focus();
  });
  retry.addEventListener("click", () => {
    loadIndex();
    render();
    input.focus();
  });
})();
