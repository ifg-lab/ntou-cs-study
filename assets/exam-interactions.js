"use strict";

const StudyExamInteractions = (() => {
  function steps(box, title, frames) {
    let current = 0;
    box.innerHTML = `<h4>${title}</h4><div class="exam-tool-controls">
      <button type="button" class="btn secondary" data-direction="-1">上一步</button>
      <button type="button" class="btn secondary" data-direction="1">下一步</button>
      <span role="status"></span></div><div class="exam-tool-frame"></div>`;
    const [back, next] = box.querySelectorAll("button");
    const frame = box.querySelector(".exam-tool-frame");
    function paint() {
      back.disabled = current === 0;
      next.disabled = current === frames.length - 1;
      const [description, markup] = frames[current];
      box.querySelector("[role=status]").textContent = `${current + 1}／${frames.length} · ${description}`;
      frame.innerHTML = `<div class="exam-tool-enter">${markup}</div>`;
    }
    for (const button of [back, next]) button.addEventListener("click", () => {
      current += Number(button.dataset.direction);
      paint();
    });
    paint();
  }

  function kmap(box) {
    const four = box.dataset.vars === "4";
    const rows = four ? ["00", "01", "11", "10"] : ["0", "1"];
    const columns = ["00", "01", "11", "10"];
    const ones = four ? [3,6,7,11,12,13,14,15] : [1,3,5];
    const groups = four ? [[[12,13,14,15], "AB"], [[6,7,14,15], "BC"], [[3,7,11,15], "CD"]] : [[[1,3], "x̄z"], [[1,5], "ȳz"]];
    const board = (highlight, formula) => `<table class="exam-tool-table"><thead><tr><th>${four ? "AB ∖ CD" : "x ∖ yz"}</th>${columns.map(label => `<th>${label}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(row => `<tr><th scope="row">${row}</th>${columns.map(column => {
        const code = parseInt(row + column, 2);
        return `<td${highlight.includes(code) ? ' class="exam-cell-selected"' : ""}>${Number(ones.includes(code))}<small>m${code}</small></td>`;
      }).join("")}</tr>`).join("")}</tbody></table>${formula ? `<p><strong>${formula}</strong></p>` : ""}`;
    const frames = [["依 Gray Code 排列，填入各組輸入的輸出。", board([], "")],
      ...groups.map(([group, term]) => [`圈 m${group.join("、m")}。保留沒變動的變數，這組得到 ${term}。`, board(group, term)]),
      ["把圈出的所有項用 OR 接起來。", board(ones, `F = ${groups.map(([, term]) => term).join(" + ")}`)]];
    steps(box, "逐組圈出 Karnaugh Map", frames);
  }

  function pipeline(box) {
    const old = box.dataset.reference === "2018-quiz2";
    const durations = old ? [5,3,3,2,7,5] : [5,5,4,8,5];
    const frame = mode => {
      let start = 1;
      const rows = durations.map((duration, index) => {
        if (mode) start = Math.floor(index / mode) + 1;
        const end = start + duration - 1;
        const row = [index + 1, start, duration, end];
        if (!mode) start = end + 1;
        return row;
      });
      const total = Math.max(...rows.map(row => row[3]));
      return `<table class="exam-tool-table exam-cycle-table"><thead><tr><th>指令</th>${Array.from({ length: total }, (_, index) => `<th>${index + 1}</th>`).join("")}</tr></thead><tbody>
        ${rows.map(([instruction, first, , last]) => `<tr><th scope="row">I${instruction}</th>
          ${Array.from({ length: total }, (_, index) => {
            const cycle = index + 1;
            const active = cycle >= first && cycle <= last;
            return `<td${active ? ' class="exam-cell-selected"' : ""}>${active ? cycle === last ? "✓" : "·" : ""}</td>`;
          }).join("")}</tr>`).join("")}</tbody></table><p>✓ 為該指令的完成拍。最後完成在<strong>第 ${total} 拍</strong>。</p>`;
    };
    steps(box, "看指令何時完成", [["循序：上一條做完才啟動下一條。", frame(0)], ["單發射：每拍可啟動一條，完成拍 = 開始 + 所需拍 − 1。", frame(1)],
      ...(old ? [["雙發射：每拍可啟動兩條。本題暫不計相依和資源競爭。", frame(2)]] : [])]);
  }

  function raid(box) {
    const original = ["0*110101", "*10*111*", "10*1*110", "01010**0"];
    const rows = original.map(line => [...line]);
    const frames = [];
    for (let col = 0; col < rows[0].length; col++) {
      const missing = rows.findIndex(row => row[col] === "*");
      const known = rows.filter((_, i) => i !== missing).map(row => Number(row[col]));
      const value = known.reduce((xor, bit) => xor ^ bit, 0);
      if (missing >= 0) rows[missing][col] = value;
      const display = `<table class="exam-tool-table"><thead><tr><th>Drive</th>${rows[0].map((_, i) => `<th>${i + 1}</th>`).join("")}</tr></thead><tbody>
        ${rows.map((row, i) => `<tr><th>${i + 1}</th>${row.map((bit, j) => `<td${j === col ? ' class="exam-cell-selected"' : ""}>${bit}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      frames.push([missing < 0 ? `第 ${col + 1} 欄完整，四個位元 XOR 為 ${value}。` : `第 ${col + 1} 欄缺 Drive ${missing + 1}，${known.join(" XOR ")} = ${value}。`, display]);
    }
    steps(box, "逐欄 XOR 還原 RAID 5", frames);
  }

  function mst(box) {
    const { edges, nodes } = studyExamFigures[box.dataset.figure];
    const groups = new Map(Object.keys(nodes).map(key => [Number(key), Number(key)]));
    const chosen = [];
    let cost = 0;
    const frames = [["從權重最小的邊開始。", StudyMidterm.figure(box.dataset.figure)]];
    for (const edge of [...edges].sort((a, b) => a[2] - b[2])) {
      const [from, to, weight] = edge;
      const a = groups.get(from), b = groups.get(to);
      if (a !== b) {
        for (const [node, group] of groups) if (group === b) groups.set(node, a);
        chosen.push(edge);
        cost += weight;
      }
      const full = chosen.length === groups.size - 1;
      frames.push([`${from}–${to} (${weight})：${a === b ? "會成環，略過。" : full ? "接上後全圖連通。" : "合併兩個分量。"}`,
        `${StudyMidterm.figure(box.dataset.figure, chosen, a === b ? edge : null)}
          <p>已選 ${chosen.map(([a, b, weight]) => `${a}–${b} (${weight})`).join("、")}</p>
          <p>${full ? "最小總權重" : "目前總權重"}：<strong>${cost}</strong></p>`]);
      if (full) break;
    }
    steps(box, "依 Kruskal 演算法選邊", frames);
  }

  function josephus(box) {
    const people = Array.from({ length: 100 }, (_, index) => index + 1);
    let holder = 0;
    const panel = removed => `<p>剩下 ${people.length} 人 · 持劍者 ${people[holder]}</p>
      <ol class="exam-number-grid" aria-label="本輪開始時的編號">${[...people, ...removed].sort((a, b) => a - b).map(number => {
        const label = removed.includes(number) ? "本輪淘汰" : number === people[holder] ? "持劍" : "保留";
        return `<li data-result="${label}" aria-label="${number} 號，${label}">${number}</li>`;
      }).join("")}</ol>`;
    const frames = [["1 號持劍，下一位 2 號先淘汰。", panel([])]];
    while (people.length > 1) {
      const removed = [];
      const turns = Math.floor(people.length / 2);
      for (let turn = 0; turn < turns; turn++) {
        const target = (holder + 1) % people.length;
        removed.push(people.splice(target, 1)[0]);
        holder = target % people.length;
      }
      frames.push([people.length === 1 ? `${people[0]} 號存活。` : `淘汰 ${removed.length} 人，接著從 ${people[holder]} 號繼續。`, panel(removed)]);
    }
    steps(box, "跟著編號走一輪", frames);
  }

  function machineTrace(box) {
    const registers = ["00", "3E", "59", "00"];
    const frames = [];
    let stored = "70";
    function record(index, next, description) {
      const [pc, opcode, asm] = brookshearInstructions[index];
      const state = [["下一個 PC", next], ...registers.map((value, i) => [`R${i}`, value]), ["M[4F]", stored]];
      frames.push([description, `<p><strong><code>${pc} · ${opcode}</code></strong>　<code>${asm}</code></p>
        <dl class="exam-registers">${state.map(([label, value]) => `<div><dt>${label}</dt><dd><code>${value}</code></dd></div>`).join("")}</dl>`]);
    }
    record(0, "22", "起始 PC=22。以下的位址、指令及數值皆為十六進位。");
    for (const [index, value, next, explanation] of [
      [0, "00", "24", "把 immediate 00 寫入 R0。"],
      [1, "0A", "26", "讀取 M[0A]，內容 0A 寫入 R1。"],
      [2, "00", "28", "把 R2 清成 00，準備累加。"],
      [3, "FF", "2A", "R3 ← FF。用 8-bit 二補數解讀為 −1。"]
    ]) {
      registers[index] = value;
      record(index, next, explanation);
    }
    record(4, "2C", "R1=0A、R0=00，不相等，先往下執行。");
    registers[2] = "0A";
    record(5, "2E", "第一次累加：R2 ← 00 + 0A = 0A。");
    registers[1] = "09";
    record(6, "30", "R1 ← 0A + FF，保留低八位後是 09。");
    record(7, "2A", "R0 與自己相等，所以跳回 2A。");
    for (const [round, added, result, count] of brookshearLoop.slice(1)) {
      registers[2] = result;
      registers[1] = count;
      record(7, "2A", `第 ${round} 輪跑完：R2 加上 ${added} 得 ${result}，R1 減為 ${count}，回到 2A。`);
    }
    record(4, "32", "R1 現在等於 R0，B132 跳到 32。");
    stored = registers[2];
    record(8, "34", "STORE 寫回之前累加的 37。M[4F] 從 70 變成 37。");
    record(9, "停止", "HALT 結束。最後一次寫入 M[4F] 的值是 0x37。");
    steps(box, "逐步追蹤虛擬機與迴圈", frames);
  }

  const tools = { kmap, pipeline, raid, mst, josephus, machineTrace };
  return { mount(box) { tools[box.dataset.examTool](box); } };
})();
