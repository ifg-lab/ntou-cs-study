"use strict";

const StudyMidterm = (() => {
  const { escape, courseLink } = StudySite;
  function figure(id, chosen = [], rejected = null) {
    if (id === "josephus") return `<figure class="source-figure"><figcaption>Which number survives at the last?</figcaption>
      <svg viewBox="0 0 100 57" role="img" aria-label="100 people in a circle, with 1 at the top, 25 at the right, 50 at the bottom, and 75 at the left">
        <circle cx="50" cy="28.5" r="20"/><text x="50" y="27">100 people</text><text x="50" y="31">standing in a circle</text>
        <text x="50" y="6">No. 1</text><text x="78" y="29.5">No. 25</text><text x="50" y="53">No. 50</text><text x="22" y="29.5">No. 75</text>
      </svg></figure>`;
    const data = studyExamFigures[id];
    if (!data) return "";
    if (!data.edges) return `<figure class="source-figure"><figcaption>${escape(data.name)}</figcaption><pre tabindex="0">${escape(data.text)}</pre></figure>`;
    const coordinates = data.edges.map(edge => {
      const [a, b] = edge;
      const [x, y] = data.nodes[a], [toX, toY] = data.nodes[b];
      return { edge, x, y: y * .57, toX, toY: toY * .57 };
    });
    return `<figure class="source-figure"><figcaption>${escape(data.name)}</figcaption><svg viewBox="0 0 100 57" aria-hidden="true">
      ${coordinates.map(({ edge, x, y, toX, toY }) => `<line class="${chosen.includes(edge) ? "is-chosen" : edge === rejected ? "is-rejected" : ""}" x1="${x}" y1="${y}" x2="${toX}" y2="${toY}"/>`).join("")}
      ${coordinates.map(({ edge, x, y, toX, toY }) => `<text x="${(x + toX) / 2}" y="${(y + toY) / 2 - .6}">${edge[2]}</text>`).join("")}
      ${Object.entries(data.nodes).map(([label, [x, y]]) => `<circle cx="${x}" cy="${y * .57}" r="2.15"/><text class="graph-label" x="${x}" y="${y * .57 + .75}">${label}</text>`).join("")}</svg>
      ${chosen.length ? "" : `<p class="graph-edges">${data.edges.map(([a, b, weight]) => `${a}–${b} (${weight})`).join(" · ")}</p>`}</figure>`;
  }

  function prompt(question) {
    return `<div class="midterm-prompt" lang="en">
      <p>${escape(question.prompt)}</p>
      ${question.code ? `<pre tabindex="0"><code>${escape(question.code)}</code></pre>` : ""}
      ${question.continuation ? `<p>${escape(question.continuation)}</p>` : ""}
      ${question.diagram || question.figure === "timeline" ? `<figure class="midterm-diagram"><figcaption>Interrupts force process switches</figcaption>
        <div>${[1, 2, 1, 2].map(process => `<span>Process ${process}<small>Time Slice</small></span>`).join("")}</div></figure>` : ""}
      ${figure(question.figure)}
      ${question.parts ? `<ol type="a">${question.parts.map(([label, points, text]) => `<li value="${label.charCodeAt(0) - 96}">(${points} points) ${escape(text)}</li>`).join("")}</ol>` : ""}
    </div>`;
  }

  function solutionTable({ caption, headers, rows }) {
    return `<div class="worked-table" tabindex="0" role="region" aria-label="${escape(caption)}">
      <table class="exam-tool-table"><caption>${escape(caption)}</caption>
        <thead><tr>${headers.map(label => `<th scope="col">${escape(label)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
  }

  function solution(question) {
    const interactive = question.interactive === "huffman" ? `<div class="huffman-workbench" data-huffman="${escape(question.code)}"></div>` :
      question.interactive === "timeline" ? `<div class="midterm-interactive" data-timeline>
        <label>時間片 <select class="field" name="slice"><option value="500">500 ms</option><option value="100">100 ms</option></select></label>
        <button class="btn secondary" type="button" data-timeline-next>下一步</button>
        <p role="status"></p><div class="midterm-timeline" aria-hidden="true"></div>
      </div>` : question.interactive ? `<div class="midterm-interactive" data-exam-tool="${question.interactive}" data-vars="${question.variables ?? ""}"
        data-figure="${question.figure ?? ""}" data-reference="${question.reference ?? ""}"></div>` : "";
    return `<div class="midterm-solution">${interactive}<h4>逐步解題</h4>
      <ol>${question.steps.map(step => `<li>${escape(step)}</li>`).join("")}</ol>
      ${question.tables?.map(solutionTable).join("") ?? ""}
      ${question.drawing ? `<pre class="worked-drawing" tabindex="0"><code>${escape(question.drawing)}</code></pre>` : ""}
      ${question.exam ? `<h4>考場寫法</h4><p>${escape(question.exam)}</p>` : ""}
      ${question.rubric ? `<h4>給分重點</h4><p>${escape(question.rubric)}</p>` : ""}</div>`;
  }

  function buildHuffman(box) {
    const source = box.dataset.huffman;
    const frequencies = new Map();
    for (const symbol of source) frequencies.set(symbol, (frequencies.get(symbol) ?? 0) + 1);
    const leaves = [...frequencies].sort(([a], [b]) => a.localeCompare(b)).map(([symbol, weight]) => ({ id: symbol, symbol, weight }));
    const ordered = nodes => [...nodes].sort((a, b) => a.weight - b.weight || a.id.localeCompare(b.id));
    const history = [{ nodes: ordered(leaves) }];
    let selected = new Set(), picked = "", message = "";
    box.innerHTML = `<h4>動手做 Huffman Tree</h4><p>選出目前權重最小的兩個節點，再合併。每一步都可以重來。</p>
      <p class="huffman-stage"></p><div class="huffman-queue" aria-label="待合併節點"></div>
      <div class="huffman-actions"><button type="button" class="btn secondary" data-huffman-action="back">上一步</button>
        <button type="button" class="btn" data-huffman-action="merge">合併選取</button>
        <button type="button" class="btn secondary" data-huffman-action="demo">示範這一步</button></div>
      <p class="huffman-status" role="status"></p><div class="huffman-tree" aria-label="目前的樹"></div>
      <div class="huffman-output"></div>`;
    const queue = box.querySelector(".huffman-queue"), tree = box.querySelector(".huffman-tree"), output = box.querySelector(".huffman-output");
    const status = box.querySelector(".huffman-status");

    function treeMarkup(node, path = "", edge) {
      return `<li><span class="huffman-node${picked && picked.startsWith(path) ? " huffman-on-path" : ""}">
        ${edge === undefined ? "" : `<small>${edge}</small> `}${escape(node.symbol ?? "")} <strong>${node.weight}</strong></span>
        ${node.left ? `<ul>${treeMarkup(node.left, `${path}0`, 0)}${treeMarkup(node.right, `${path}1`, 1)}</ul>` : ""}</li>`;
    }

    function paint(focusSelector, animateMerge = false) {
      const { nodes, merged } = history.at(-1);
      const complete = nodes.length === 1;
      const activeTree = complete ? nodes[0] : merged;
      box.querySelector(".huffman-stage").textContent = complete ? "樹已完成。點碼表中的字母可追蹤路徑。" : `已合併 ${history.length - 1}／${leaves.length - 1} 次`;
      queue.innerHTML = complete ? "" : nodes.map(node => `<button type="button" class="utility" data-node="${node.id}" aria-pressed="${selected.has(node.id)}">${node.symbol ?? "子樹"} · ${node.weight}</button>`).join("");
      tree.innerHTML = activeTree ? `<ul>${treeMarkup(activeTree)}</ul>` : "";
      tree.classList.toggle("is-merging", animateMerge);
      box.querySelector('[data-huffman-action="back"]').disabled = history.length === 1;
      box.querySelector('[data-huffman-action="merge"]').disabled = complete || selected.size !== 2;
      box.querySelector('[data-huffman-action="demo"]').disabled = complete;
      status.textContent = message;
      const codes = {};
      function walk(node, path) {
        if (node.symbol) codes[node.symbol] = path;
        else { walk(node.left, `${path}0`); walk(node.right, `${path}1`); }
      }
      if (complete) {
        walk(nodes[0], "");
        const bits = [...source].map(symbol => codes[symbol]);
        output.innerHTML = `<table class="huffman-codes"><caption>字母、頻率與編碼</caption><thead><tr><th>字母</th><th>頻率</th><th>編碼</th><th>頻率 × 碼長</th></tr></thead><tbody>${leaves.map(({ symbol, weight }) => `<tr>
          <th scope="row"><button type="button" class="utility" data-path="${codes[symbol]}" aria-pressed="${picked === codes[symbol]}">${symbol}</button></th>
          <td>${weight}</td><td><code>${codes[symbol]}</code></td><td>${weight} × ${codes[symbol].length}</td></tr>`).join("")}</tbody></table>
          <p><strong>${bits.join("").length} bits</strong>（原本 ${source.length * 3} bits）</p><p>依原字串順序，以空格分隔字碼</p><code class="huffman-bits">${bits.join(" ")}</code>
          <p>左右子樹對調會改變字碼。只要沿同一棵樹編碼，總位元數相同。</p>`;
      } else output.innerHTML = "";
      if (focusSelector) box.querySelector(focusSelector)?.focus({ preventScroll: true });
    }

    box.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      const { node, path, huffmanAction } = button.dataset;
      if (node) {
        if (selected.has(node)) selected.delete(node);
        else if (selected.size < 2) selected.add(node);
        else { status.textContent = "先取消其中一個節點，再改選。"; return; }
        message = "";
        paint(`[data-node="${node}"]`);
        return;
      }
      if (path) { picked = path; paint(`[data-path="${path}"]`); return; }
      if (huffmanAction === "back") {
        history.pop(); selected.clear(); picked = ""; message = "已回到前一步。"; paint("[data-node]"); return;
      }
      if (huffmanAction !== "merge" && huffmanAction !== "demo") return;
      const { nodes } = history.at(-1);
      const [left, right] = huffmanAction === "demo" ? nodes : nodes.filter(item => selected.has(item.id));
      if (!right || left.weight !== nodes[0].weight || right.weight !== nodes[1].weight) {
        status.textContent = "比較清單上的權重，挑出目前最小的兩個再試一次。";
        return;
      }
      const merged = { id: `m${history.length}`, weight: left.weight + right.weight, left, right };
      history.push({ nodes: ordered([...nodes.filter(item => item !== left && item !== right), merged]), merged });
      selected.clear(); message = `${left.weight} + ${right.weight} = ${merged.weight}，新節點已加入。`;
      paint(huffmanAction === "demo" && history.length < leaves.length ? '[data-huffman-action="demo"]' : history.length < leaves.length ? "[data-node]" : "[data-path]", true);
    });
    paint();
  }

  function bind(container) {
    for (const box of container.querySelectorAll("[data-huffman]:empty")) buildHuffman(box);
    for (const box of container.querySelectorAll("[data-exam-tool]:empty")) StudyExamInteractions.mount(box);
    for (const box of container.querySelectorAll("[data-timeline]")) {
      const slice = box.querySelector("select"), status = box.querySelector("[role=status]"), bars = box.querySelector(".midterm-timeline");
      let step = 0;
      const paint = () => {
        const time = Number(slice.value);
        status.textContent = ["A 使用 CPU 執行。", "時間片結束，保存 A 的狀態，耗時 10 ms。", "恢復 B 的狀態，再耗時 10 ms。", `B 接手 CPU。一次完整切換占 20 ÷ (${time} + 20) ≈ ${(20 / (time + 20) * 100).toFixed(2)}%。`][step];
        const labels = [`A 執行 ${time} ms`, "保存 A · 10 ms", "恢復 B · 10 ms", `B 執行 ${time} ms`];
        bars.innerHTML = labels.slice(0, step + 1).map((label, i) => `<span${i === step ? ' class="is-current"' : ""}>${label}</span>`).join("");
      };
      slice.addEventListener("change", () => { step = 0; paint(); });
      box.querySelector("button").addEventListener("click", () => { step = (step + 1) % 4; paint(); });
      paint();
    }
  }

  function mock(container, paper, questions) {
    const archive = paper.back ?? (paper.id === "notes-review" ? courseLink("past-exams", "mock") : courseLink("past-exams", paper.id));
    const backLabel = paper.backLabel ?? (paper.id === "notes-review" ? "回模擬小考" : "回考古題");
    const name = paper.items || paper.questions ? `${examSourceLabel(paper)}模擬` : paper.name;
    const total = questions.reduce((sum, item) => sum + item.points, 0);
    const emptyDraft = () => ({ answers: {}, scores: {}, submitted: false });
    let draft = (paper.transient ? undefined : StudyExamDrafts.load(paper.id)) ?? emptyDraft();
    for (const [key, points] of Object.entries(draft.scores)) {
      const question = questions[Number(key) - 1];
      if (!question || points > question.points) delete draft.scores[key];
    }
    const keep = () => { if (!paper.transient) StudyExamDrafts.save(paper.id, draft); };
    const render = () => {
      const submitted = draft.submitted;
      let awaitingConfirmation = false;
      container.innerHTML = `<section class="midterm-mock"><a class="exam-back" href="${archive}">← ${backLabel}</a>
        <header class="mock-sheet-heading">
          <p class="mock-sheet-meta">${questions.length} 大題 <span>·</span> ${total} 分 <span>·</span> ${submitted ? "已交卷" : "不限時"}</p>
          <h2 tabindex="-1">${escape(name)}</h2>
          <p class="past-note">${submitted ? "展開詳解後可依給分重點自評。" : "可用繁體中文搭配英文專有名詞作答。畫圖題可在紙上完成，交卷後再對照。"}</p>
          ${submitted ? '<div class="mock-results"><p class="midterm-score" role="status"></p><a href="#review/exam">考古題重做清單 <span aria-hidden="true">→</span></a></div>' : ""}
        </header>
        <form>${questions.map((q, index) => `<article class="past-question">
          <header class="past-question-heading"><h3>第 ${index + 1} 題</h3><span class="exam-points">${q.points} 分</span></header>
          ${submitted ? `<a class="past-source" href="${courseLink("past-exams", q.paper.id, q.number)}">${escape(examSourceLabel(q.paper))} · 原卷第 ${q.number} 題</a>`
            : paper.sourceBeforeSubmit ? `<p class="past-source">${escape(examSourceLabel(q.paper))} · 原卷第 ${q.number} 題</p>` : ""}
          ${prompt(q)}${q.parts ? q.parts.map(([label]) => answer(index, label)).join("") : answer(index)}
          ${submitted ? `${q.steps.length ? `<details><summary>看詳解</summary>${solution(q)}</details>` : ""}
            <label class="midterm-self-score">第 ${index + 1} 題自評 <input class="field" type="number" min="0" max="${q.points}" step="1" name="score-${index + 1}" value="${escape(draft.scores[index + 1])}">／${q.points} 分</label>
            ${StudyPastExams.reviewButtons(q, true)}` : ""}</article>`).join("")}
        <div class="mock-submit"><button class="btn" type="submit">${submitted ? "重新作答" : "交卷"}</button><p role="status"></p></div></form></section>`;
      function answer(index, part = "") {
        const key = `${index + 1}${part}`;
        return `<label class="midterm-answer">第 ${index + 1} 題${part ? ` (${part})` : ""}作答
          <textarea class="field" name="${key}" rows="3" maxlength="3000"${submitted ? " readonly" : ""}>${escape(draft.answers[key])}</textarea></label>`;
      }
      const form = container.querySelector("form"), submit = form.querySelector('[type="submit"]');
      const feedback = submit.nextElementSibling;
      function paintScore() {
        const score = container.querySelector(".midterm-score");
        if (!score) return;
        const marked = questions.map((_, index) => draft.scores[index + 1]).filter(Number.isInteger);
        const points = marked.reduce((sum, value) => sum + value, 0);
        score.textContent = `目前自評 ${points}／${total} 分 · 已評 ${marked.length}／${questions.length} 題`;
      }
      paintScore();
      form.addEventListener("input", event => {
        if (!draft.submitted || !event.target.name?.startsWith("score-")) return;
        const field = event.target;
        const number = field.name.slice(6);
        if (!field.checkValidity()) return;
        if (field.value === "") delete draft.scores[number];
        else draft.scores[number] = field.valueAsNumber;
        paintScore(); keep();
      });
      form.addEventListener("change", event => {
        const field = event.target;
        if (field.name?.startsWith("score-") && !field.checkValidity()) field.value = draft.scores[field.name.slice(6)] ?? "";
      });
      form.addEventListener("input", event => {
        if (event.target.tagName !== "TEXTAREA" || draft.submitted) return;
        draft.answers[event.target.name] = event.target.value;
        keep(); awaitingConfirmation = false; submit.textContent = "交卷"; feedback.textContent = "";
      });
      form.addEventListener("submit", event => {
        event.preventDefault();
        const blanks = [...form.querySelectorAll("textarea")].filter(field => !field.value.trim()).length;
        if (!awaitingConfirmation && (draft.submitted || blanks)) {
          awaitingConfirmation = true;
          submit.textContent = draft.submitted ? "確認重新作答" : "確認交卷";
          feedback.textContent = draft.submitted ? "重新作答會清除本卷的答案。" : `還有 ${blanks} 個作答欄空白。`;
          return;
        }
        if (draft.submitted) draft = emptyDraft();
        else draft.submitted = true;
        keep(); render();
      });
      bind(container);
      StudyPastExams.bindReview(container);
      container.querySelector("h2").focus();
    };
    render();
  }

  return { figure, prompt, solution, bind, mock };
})();
