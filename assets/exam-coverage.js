"use strict";

const examPaperIdPattern = "(?:\\d{4}-(?:quiz[1-9]|midterm|final)|networks-homework)";
const examSourceLabel = paper => {
  const date = paper.year ? `${paper.year} 年${paper.month ? ` ${paper.month} 月` : ""}` : "年份未標示";
  return `${date} · ${paper.name}`;
};

// Inclusive slide ranges, with worked-solution step indices for individual parts.
const ethernetExamParts = { a: [29,29,[0]], b: [30,30,[1,2]] };
const operatingSystemTermsParts = {
  a: [18,18,[0]], b: [22,22,[1]], c: [27,28,[2]], d: [19,19,[3]]
};
const contextSwitchParts = { a: [19,23,[0]], b: [23,23,[1,2]] };
const examPageCoverage = {
  "2025-quiz3/1": { 6: [64,69] },
  "2025-quiz3/2": { 6: [34,40] },
  "2025-quiz3/4": { 6: [41,47] },
  "2025-quiz3/5": { 6: [28,30] },
  "2025-final/4": { 6: [64,69] },
  "2025-final/10": { 6: [41,47] },
  "2026-midterm/6": { 4: contextSwitchParts },
  "2026-quiz2/8": { 4: contextSwitchParts },
  "2026-midterm/7": { 4: operatingSystemTermsParts },
  "2026-quiz2/9": { 4: operatingSystemTermsParts },
  "2018-quiz2/6": { 4: [18,18], 5: [54,54] },
  "2025-quiz2/8": { 5: ethernetExamParts },
  "2025-final/3": { 5: ethernetExamParts },
  "2025-quiz2/9": { 5: {
    a: [39,41,[0]], b: [36,37,[1]], c: [32,32,[2]], d: [43,43,[3]], e: [69,73,[4]]
  } },
  "2025-quiz2/11": { 5: [12,13] },
  "2025-quiz2/12": { 5: [55,57] },
  "networks-homework/3": { 5: [12,13] },
  "networks-homework/8": { 5: [108,110] },
  "2025-midterm/9": { 3: { a: [23,29,[0,1]], b: [23,34,[0,1,2,3]] } },
  "2025-midterm/13": { 3: [37,37] }
};

function examReviewPages(id, lecture, fallback) {
  const [paper, number, part] = id.split("/");
  const coverage = examPageCoverage[`${paper}/${number}`]?.[lecture];
  const range = Array.isArray(coverage) ? coverage : coverage?.[part];
  return range ? range.slice(0, 2) : fallback ? [fallback, fallback] : [];
}

// Reading-only links for neighboring slides that explain the same question.
const examReadingCoverage = {
  "2025-midterm/4": { 2: { a: [92, 92], b: [92, 92] } },
  "2025-midterm/9": { 3: { a: [23, 29], b: [30, 34] } },
  "2026-midterm/2": { 2: { a: [92, 92], b: [92, 92] } },
  "2026-quiz1/5": { 2: [75, 76] },
  "2026-quiz1/6": { 2: { a: [92, 92], b: [92, 92] } },
  "2026-quiz2/2": { 3: { a: [59, 59], b: [59, 59] } },
  "networks-homework/1": { 5: [29, 30] }
};

function indexExamReadingLinks(papers) {
  const byLecture = new Map();
  for (const paper of papers) {
    const metadata = paper.questions?.trim().split("\n");
    const items = paper.items ?? examTranscripts[paper.id].trim().split("\n").filter(row => /^\d+\|/.test(row)).map((_, index) => {
      const [pages, title] = metadata[index].split("|");
      return { number: index + 1, title, topic: pages.split(",").filter(Boolean).map(ref => ref.split(":").map(Number)) };
    });
    for (const { number, title, topic } of items) {
      if (/\bbonus\b/i.test(title)) continue;
      const id = `${paper.id}/${number}`;
      const ranges = { ...examPageCoverage[id], ...examReadingCoverage[id] };
      for (const [lecture, page] of topic) {
        if (page && !Object.hasOwn(ranges, lecture)) ranges[lecture] = [page, page];
      }
      for (const [lecture, coverage] of Object.entries(ranges)) {
        const parts = Array.isArray(coverage) ? [[null, coverage]] : Object.entries(coverage);
        const references = byLecture.get(Number(lecture)) ?? [];
        for (const [part, [start, end]] of parts) {
          references.push({ paper, number, part, start, end });
        }
        byLecture.set(Number(lecture), references);
      }
    }
  }
  for (const references of byLecture.values()) references.sort((a, b) =>
    (a.end - a.start) - (b.end - b.start) || (b.paper.year ?? 0) - (a.paper.year ?? 0) ||
    (b.paper.month ?? 0) - (a.paper.month ?? 0) || a.number - b.number);
  return byLecture;
}
