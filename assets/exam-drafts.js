"use strict";

const StudyExamDrafts = (() => {
  const midtermId = "2026-midterm";
  const midtermKey = "ntou-midterm-2026";
  const prefix = "ntou-past-exam:";
  const paper = examPaperIdPattern;
  const item = `${paper}/[1-9]\\d?[a-z]{0,5}`;
  const draftId = new RegExp(`^(?:${paper}|notes-review|range:lecture-\\d{2}:${item}(?:,${item})*)$`);
  const answerKey = /^[1-9]\d?[a-z]?$/;
  const scoreKey = /^[1-9]\d?$/;
  const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const keyFor = id => id === midtermId ? midtermKey : prefix + id;

  function cleanDraft(value) {
    if (!record(value) || !record(value.answers)) return undefined;
    return {
      answers: Object.fromEntries(Object.entries(value.answers)
        .filter(([key, answer]) => answerKey.test(key) && typeof answer === "string")
        .map(([key, answer]) => [key, answer.slice(0, 3000)])),
      scores: Object.fromEntries(Object.entries(record(value.scores) ? value.scores : {})
        .filter(([key, score]) => scoreKey.test(key) && Number.isInteger(score) && score >= 0 && score <= 120)),
      submitted: value.submitted === true
    };
  }

  function load(id) {
    if (!draftId.test(id)) return undefined;
    try { return cleanDraft(JSON.parse(localStorage.getItem(keyFor(id)))); } catch { return undefined; }
  }

  function save(id, draft) {
    if (!draftId.test(id)) return false;
    try { localStorage.setItem(keyFor(id), JSON.stringify(cleanDraft(draft))); return true; }
    catch { return false; }
  }

  function exportDrafts() {
    const drafts = {};
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key !== midtermKey && !key?.startsWith(prefix)) continue;
        const id = key === midtermKey ? midtermId : key.slice(prefix.length);
        const draft = load(id);
        if (draft && (draft.submitted || Object.keys(draft.answers).length || Object.keys(draft.scores).length)) drafts[id] = draft;
      }
    } catch {}
    return drafts;
  }

  function prepareImport(value) {
    if (value === undefined) return {};
    if (!record(value)) throw new Error("模擬小考備份格式有誤。");
    const drafts = {};
    for (const [id, stored] of Object.entries(value)) {
      const draft = cleanDraft(stored);
      if (!draftId.test(id) || !draft) throw new Error("模擬小考備份包含無法識別的紀錄。");
      drafts[id] = draft;
    }
    return drafts;
  }

  function restore(drafts) {
    const replaced = new Map();
    try {
      for (const [id, draft] of Object.entries(drafts)) {
        const key = keyFor(id);
        const previous = localStorage.getItem(key);
        localStorage.setItem(key, JSON.stringify(draft));
        replaced.set(key, previous);
      }
      return true;
    } catch {
      try {
        for (const key of replaced.keys()) localStorage.removeItem(key);
        for (const [key, previous] of replaced) if (previous !== null) localStorage.setItem(key, previous);
      } catch {}
      return false;
    }
  }

  return { load, save, exportDrafts, prepareImport, restore };
})();
