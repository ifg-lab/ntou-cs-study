"use strict";

const StudyPageTools = (() => {
  const { escape: esc } = StudySite;
  const topicLabels = {
    binary: "二元搜尋",
    complement: "二補數",
    subnet: "IPv4 子網路"
  };
  const errors = {
    rate_limit: "請稍等一分鐘再試。",
    daily_limit: "今天的 AI 額度已用完。可切換到「生成練習題」繼續做計算題。",
    invalid_question: "請輸入 2～500 字的問題。",
    invalid_range: "請選擇同一章內、最多 5 頁的範圍。",
    unavailable: "AI 暫時無法回答。可以稍後再試，或先做計算練習。"
  };
  const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const conversations = new Map();
  let activeDialog, pending;

  function calculation(topic, subnetResult) {
    if (topic === "binary") {
      let value = randomInt(1, 8);
      const items = Array.from({ length: randomInt(5, 9) }, () => (value += randomInt(1, 7)));
      const target = items[randomInt(0, items.length - 1)];
      const steps = [];
      let left = 0;
      let right = items.length - 1;
      let mid;
      while (left <= right) {
        mid = Math.floor((left + right) / 2);
        const current = items[mid];
        steps.push(`[${left}, ${right}] → mid = ${mid}，值為 ${current}。${current === target ? "找到目標" : current < target ? "往右半找" : "往左半找"}。`);
        if (current === target) break;
        if (current < target) left = mid + 1;
        else right = mid - 1;
      }
      return {
        prompt: `In the sorted array [${items.join(", ")}], what is the zero-based index of ${target}?`,
        hint: "先取中間位置，把中間的值和目標比較。索引從 0 開始。",
        answer: String(mid), steps
      };
    }
    if (topic === "complement") {
      const width = randomInt(6, 8);
      const magnitude = randomInt(2, 2 ** (width - 1));
      const bits = number => number.toString(2).padStart(width, "0");
      const flipped = (2 ** width - 1) - magnitude;
      const answer = bits(flipped + 1);
      return {
        prompt: `Write −${magnitude} as a ${width}-bit two’s complement binary number.`,
        hint: "先把絕對值寫成指定寬度的位元，再反相、加 1。",
        answer, steps: [`把 ${magnitude} 以 ${width} 位元寫出來 → ${bits(magnitude)}。`, `每一位取反 → ${bits(flipped)}。`, `加 1 → ${answer}。`]
      };
    }
    const prefix = randomInt(25, 30);
    const octet = randomInt(4, 250);
    const address = `192.0.2.${octet}`;
    const subnet = subnetResult(address, prefix);
    const askNetwork = randomInt(0, 1) === 0;
    return {
      prompt: `What is the ${askNetwork ? "network" : "broadcast"} address of the subnet containing ${address}/${prefix}?`,
      hint: "先用 32 − 前綴長度找到主機位元數，再計算每個子網有幾個位址。",
      answer: askNetwork ? subnet.network : subnet.last,
      steps: [
        `主機部分有 ${32 - prefix} 位元，每個子網有 ${subnet.size} 個位址。`,
        `最後一個八位元組 ${octet} 落在從 ${Math.floor(octet / subnet.size) * subnet.size} 開始的區塊，網路位址是 ${subnet.network}。`,
        `網路位址加上 ${subnet.size - 1}，廣播位址是 ${subnet.last}。`
      ]
    };
  }

  function paintQuestion(host, question) {
    host.innerHTML = `<form class="page-study-question">
      <p class="page-study-prompt" lang="en">${esc(question.prompt)}</p>
      ${question.options
        ? `<fieldset><legend class="visually-hidden">選擇答案</legend>${question.options.map((option, index) =>
          `<label class="page-study-option"><input type="radio" name="answer" value="${index}" required> <span lang="en">${esc(option)}</span></label>`).join("")}</fieldset>`
        : '<label>你的答案<input class="field" name="answer" type="text" maxlength="32" autocomplete="off" required></label>'}
      ${question.hint ? `<details><summary>我需要提示</summary><p>${esc(question.hint)}</p></details>` : ""}
      <button type="submit" class="btn secondary">檢查答案</button>
      <div class="page-study-feedback" aria-live="polite"></div>
    </form>`;
    const form = host.querySelector("form");
    const feedback = form.querySelector(".page-study-feedback");
    form.addEventListener("submit", event => {
      event.preventDefault();
      const answer = String(new FormData(form).get("answer") ?? "").normalize("NFKC").replace(/\s/g, "");
      const correct = answer === String(question.answer);
      feedback.dataset.correct = String(correct);
      const solution = question.options ? question.options[question.answer] : question.answer;
      feedback.innerHTML = `<strong>${correct ? "✓ 答對了" : "答錯了"} · 正確答案 ${esc(solution)}</strong>
        ${question.steps ? `<ol>${question.steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol>`
          : `<p>${esc(question.explanation)}</p>`}`;
    });
  }

  function paintSource(host, pages, lessonHref, slide) {
    const sources = document.createElement("nav");
    sources.className = "page-study-sources";
    sources.setAttribute("aria-label", "提供給 AI 的教材頁碼");
    const label = document.createElement("span");
    label.textContent = "對照教材";
    sources.append(label);
    for (const page of pages) {
      const alreadyReading = page === slide.page && Boolean(document.querySelector(`#slide-${page}`));
      const source = document.createElement(alreadyReading ? "button" : "a");
      source.className = "btn secondary";
      source.textContent = `p.${page}`;
      if (source.tagName === "A") source.href = lessonHref(page);
      else {
        source.type = "button";
        source.addEventListener("click", () => {
          close();
          const notes = document.querySelector('[data-lesson-pane="notes"][aria-pressed="false"]');
          if (notes?.offsetWidth) notes.click();
          document.querySelector("#slide-notes-title")?.scrollIntoView({ block: "start" });
        });
      }
      sources.append(source);
    }
    host.append(sources);
  }

  function close() {
    pending?.abort();
    pending = undefined;
    const dialog = activeDialog;
    activeDialog = undefined;
    if (!dialog) return;
    if (dialog.open) dialog.close();
    dialog.remove();
  }

  function open({ course, slide, lessonHref, subnetResult }, initialMode) {
    close();
    const first = course.slides[0].page;
    const last = course.slides.at(-1).page;
    const conversationKey = `${course.id}/${slide.page}`;
    const turns = conversations.get(conversationKey) ?? [];
    const dialog = document.createElement("dialog");
    dialog.className = "records-dialog page-study";
    dialog.setAttribute("aria-labelledby", "page-study-title");
    dialog.innerHTML = `
      <div class="records-heading">
        <div>
          <h2 id="page-study-title">AI 助教</h2>
          <p class="page-study-location">${esc(course.label)} · p.${slide.page} <span aria-hidden="true">／</span> ${esc(slide.title)}</p>
        </div>
        <form method="dialog"><button class="utility" type="submit" autofocus>關閉</button></form>
      </div>
      <div class="page-study-switch" role="group" aria-label="選擇複習方式">
        <button class="btn secondary" data-mode="ask" type="button">問這一頁</button>
        <button class="btn secondary" data-mode="practice" type="button">生成練習題</button>
      </div>
      <section data-panel="ask" class="page-study-panel" aria-label="問這一頁">
        <div class="page-study-chat-scroll" tabindex="0" aria-label="聊天紀錄">
          <p class="page-study-chat-empty">哪裡看不懂？可以問一個觀念，或請我用例子說明。</p>
          <div data-result="answer" class="page-study-chat-log" role="log" aria-label="你與 AI 助教的對話"></div>
          <p class="page-study-status" data-status="ask" role="status"></p>
        </div>
        <form class="page-study-chat-form">
          <label class="visually-hidden" for="page-study-question">輸入你的問題</label>
          <textarea class="field" id="page-study-question" name="question" rows="2" minlength="2" maxlength="500" required placeholder="輸入問題或追問…"></textarea>
          <div class="page-study-chat-actions">
            <label><span class="visually-hidden">回答方式</span><select class="field" name="style"><option value="explain">解釋觀念</option><option value="example">用例子講</option><option value="hint">只給提示</option></select></label>
            <button class="btn page-study-chat-send" type="submit">送出 <span aria-hidden="true">↑</span></button>
          </div>
          <p class="page-study-privacy">問題和公開教材由 Cloudflare Workers AI 處理，請勿輸入個人資料。</p>
        </form>
      </section>
      <section data-panel="practice" class="page-study-panel" aria-label="生成練習題">
        <div class="page-study-generator">
          <h3>計算練習</h3>
          <form class="page-study-form" data-calculation>
            <div class="page-study-form-row">
              <label>題型<select class="field" name="topic">${Object.entries(topicLabels).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}</select></label>
              <button class="btn secondary" type="submit">換一題</button>
            </div>
          </form>
          <div data-result="calculation"></div>
        </div>
        <div class="page-study-generator">
          <h3>AI 情境題</h3>
          <form class="page-study-form">
            <p class="page-study-privacy">選同一章內最多 5 頁。題目為英文，作答後可看繁中解析。</p>
            <div class="page-study-form-row">
              <label>起始頁<input class="field" type="number" name="from" min="${first}" max="${last}" value="${slide.page}" required></label>
              <label>結束頁<input class="field" type="number" name="to" min="${first}" max="${last}" value="${slide.page}" required></label>
              <button class="btn" type="submit">生成情境題</button>
            </div>
          </form>
          <p class="page-study-status" data-status="practice" role="status"></p>
          <div data-result="quiz" class="page-study-result" aria-live="polite"></div>
        </div>
      </section>`;
    const askForm = dialog.querySelector('[data-panel="ask"] form');
    const quizForm = dialog.querySelector('[data-panel="practice"] .page-study-generator:last-child form');
    const askStatus = dialog.querySelector('[data-status="ask"]');
    const quizStatus = dialog.querySelector('[data-status="practice"]');
    const chatScroll = dialog.querySelector(".page-study-chat-scroll");
    const chatLog = dialog.querySelector(".page-study-chat-log");
    const chatEmpty = dialog.querySelector(".page-study-chat-empty");
    const questionField = askForm.elements.namedItem("question");
    const localForm = dialog.querySelector("[data-calculation]");
    const localResult = dialog.querySelector('[data-result="calculation"]');
    const topic = localForm.elements.namedItem("topic");
    const aiForms = [askForm, quizForm];
    let mode = initialMode;
    let lastCalculation;

    function scrollChat() {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }

    function appendMessage(role, text, pages) {
      chatEmpty.hidden = true;
      const message = document.createElement("div");
      message.className = `page-study-message is-${role}`;
      const sender = document.createElement("span");
      sender.className = "page-study-sender";
      sender.textContent = role === "user" ? "你" : "AI 助教";
      const bubble = document.createElement("div");
      bubble.className = "page-study-bubble";
      const content = document.createElement("p");
      if (role === "assistant") content.className = "page-study-answer";
      content.textContent = text;
      bubble.append(content);
      if (pages?.length) paintSource(bubble, pages, lessonHref, slide);
      if (role === "assistant") {
        const tools = document.createElement("div");
        tools.className = "page-study-note-actions";
        const save = document.createElement("button");
        save.className = "utility";
        save.type = "button";
        save.textContent = "把重點存到本頁筆記";
        const noteStatus = document.createElement("span");
        noteStatus.setAttribute("role", "status");
        save.addEventListener("click", () => {
          const selection = window.getSelection();
          const selected = content.contains(selection?.anchorNode) && content.contains(selection?.focusNode)
            ? selection.toString().trim() : "";
          const firstParagraph = text.trim().split(/\n\s*\n/)[0];
          const excerpt = selected || (firstParagraph.length > 180 ? firstParagraph.slice(0, 180).trim() + "…" : firstParagraph);
          const current = StudySite.getProgress(course.id).notes[slide.page]?.text ?? "";
          const label = `AI 助教${pages?.length ? `（參考 ${pages.map(page => `p.${page}`).join("、")}）` : ""}`;
          const addition = `${label}\n${excerpt}`;
          const next = [current, addition].filter(Boolean).join("\n\n");
          if (current.includes(addition)) noteStatus.textContent = "這段已在筆記中。";
          else if (next.length > 500) noteStatus.textContent = "筆記空間不足，可以選取更短的一段。";
          else {
            const saved = StudySite.saveNote(course.id, slide.page, slide.title, next);
            const field = document.querySelector("#page-note-text");
            if (field && field.value === field.defaultValue) {
              field.defaultValue = field.value = next;
              document.querySelector("#page-note-remove").hidden = false;
            }
            noteStatus.textContent = saved ? "已存到本頁筆記。" : "本次瀏覽已加入，瀏覽器無法儲存。";
          }
        });
        tools.append(save, noteStatus);
        bubble.append(tools);
      }
      message.append(sender, bubble);
      chatLog.append(message);
      scrollChat();
      return message;
    }

    function showMode(next) {
      mode = next;
      dialog.dataset.mode = mode;
      for (const button of dialog.querySelectorAll("[data-mode]")) button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
      for (const panel of dialog.querySelectorAll("[data-panel]")) panel.hidden = panel.dataset.panel !== mode;
      for (const form of aiForms) form.querySelector('button[type="submit"]').disabled = !studyPageAiEndpoint || Boolean(pending);
      if (mode === "ask") scrollChat();
    }

    async function send(payload, status, loadingText) {
      const request = new AbortController();
      pending = request;
      showMode(mode);
      status.textContent = loadingText;
      if (payload.action === "ask") scrollChat();
      const timer = setTimeout(() => request.abort(new DOMException("Timed out", "TimeoutError")), 25000);
      try {
        const response = await fetch(studyPageAiEndpoint, {
          method: "POST",
          credentials: "omit",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course: course.id, ...payload }),
          signal: request.signal
        });
        const data = await response.json();
        if (pending !== request || activeDialog !== dialog) return;
        if (!response.ok) {
          status.textContent = errors[data.error] ?? errors.unavailable;
          return;
        }
        status.textContent = "";
        return data;
      } catch {
        if (pending === request && activeDialog === dialog) status.textContent = errors.unavailable;
      } finally {
        clearTimeout(timer);
        if (pending === request) {
          pending = undefined;
          showMode(mode);
        }
      }
    }

    askForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (!studyPageAiEndpoint || pending) return;
      const question = questionField.value.trim();
      if (question.length < 2) { askStatus.textContent = errors.invalid_question; questionField.focus(); return; }
      questionField.value = "";
      const message = appendMessage("user", question);
      const data = await send({
        action: "ask", page: slide.page, question, style: askForm.elements.namedItem("style").value,
        history: turns.length ? turns.slice(-3).map(turn => ({
          question: turn.question.slice(0, 240), answer: turn.answer.slice(0, 400)
        })) : undefined
      }, askStatus, "AI 助教正在參考這一頁…");
      if (activeDialog !== dialog) return;
      if (typeof data?.answer !== "string") {
        message.remove();
        chatEmpty.hidden = turns.length > 0;
        if (!questionField.value) questionField.value = question;
        if (data) askStatus.textContent = errors.unavailable;
        scrollChat();
        return;
      }
      turns.push({ question, answer: data.answer, pages: data.pages });
      conversations.set(conversationKey, turns);
      appendMessage("assistant", data.answer, data.pages);
    });
    questionField.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault();
        askForm.requestSubmit();
      }
    });

    quizForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (!studyPageAiEndpoint || pending) return;
      const from = quizForm.elements.namedItem("from").valueAsNumber;
      const to = quizForm.elements.namedItem("to").valueAsNumber;
      if (to < from || to - from >= 5) { quizStatus.textContent = errors.invalid_range; return; }
      const result = dialog.querySelector('[data-result="quiz"]');
      result.replaceChildren();
      const data = await send({ action: "quiz", page: slide.page, from, to }, quizStatus, "正在編寫練習題…");
      if (!data || activeDialog !== dialog) return;
      paintQuestion(result, data.question);
      paintSource(result, data.pages, lessonHref, slide);
    });

    function refreshCalculation() {
      let question = calculation(topic.value, subnetResult);
      if (question.prompt === lastCalculation) question = calculation(topic.value, subnetResult);
      lastCalculation = question.prompt;
      paintQuestion(localResult, question);
    }

    topic.value = ({ "lecture-02": "complement", "lecture-05": "subnet" })[course.id] ?? "binary";
    topic.addEventListener("change", refreshCalculation);
    localForm.addEventListener("submit", event => { event.preventDefault(); refreshCalculation(); });
    for (const control of dialog.querySelectorAll("[data-mode]")) control.addEventListener("click", () => showMode(control.dataset.mode));
    dialog.addEventListener("close", () => { if (activeDialog === dialog) close(); });
    if (!studyPageAiEndpoint) {
      dialog.querySelectorAll(".page-study-privacy").forEach(note => { note.hidden = true; });
      askStatus.textContent = "雲端 AI 尚未啟用。可以切換到「生成練習題」做計算題。";
      quizStatus.textContent = "AI 情境題尚未啟用。";
      questionField.disabled = true;
    }
    for (const turn of turns) {
      appendMessage("user", turn.question);
      appendMessage("assistant", turn.answer, turn.pages);
    }
    refreshCalculation();
    showMode(initialMode);
    activeDialog = dialog;
    document.body.append(dialog);
    dialog.showModal();
    if (initialMode === "ask") scrollChat();
  }

  return { open, close };
})();
