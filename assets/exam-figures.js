"use strict";

const studyExamFigures = {
  logic: {
    name: "Digital circuit",
    text: "AND 1 inputs: NOT x, NOT y, z\nAND 2 inputs: NOT x, y, z\nAND 3 inputs: x, NOT y, z\nF: OR of the three AND outputs"
  },
  bst: {
    name: "Binary tree",
    text: "                 75\n            /          \\\n          40            84\n         /  \\          /  \\\n       23    42       83    90\n      /  \\                 /  \\\n    21    28              89    93\n           \\\n            30"
  },
  "mst-quiz": {
    name: "Undirected weighted graph",
    nodes: { 1:[7,30], 2:[43,10], 3:[72,10], 4:[94,48], 5:[70,84], 6:[27,68], 7:[9,70], 8:[24,43], 9:[49,43], 10:[71,42] },
    edges: [[1,2,7],[1,8,5],[2,8,7],[2,9,4],[3,9,5],[3,10,6],[3,4,1],[4,10,5],[4,5,3],[5,9,7],[5,6,8],[6,8,6],[6,9,10],[7,8,11],[8,9,1],[9,10,2]]
  },
  "mst-final": {
    name: "Undirected weighted graph",
    nodes: { 1:[12,30], 2:[44,17], 3:[49,49], 4:[83,22], 5:[93,55], 6:[53,84], 7:[8,72], 8:[21,14], 9:[65,10], 10:[76,80], 11:[27,80] },
    edges: [[1,8,2],[1,2,6],[1,7,8],[1,11,7],[8,11,15],[2,9,5],[2,3,3],[3,9,7],[9,4,5],[4,5,4],[4,10,9],[3,5,17],[3,6,7],[3,7,19],[3,11,12],[6,10,8],[6,11,6],[7,11,2]]
  }
};

const StudyNetworkQuizDiagram = (() => {
  const stages = [
    ["接好各個 LAN", "每組電腦各接一台 Switch。LAN 1 的 S1、S2 用 200 m 光纖相連，LAN 2 的 S3 用 80 m UTP 接 R2。PC 12 可直接接 R3。"],
    ["連接 LAN 1 和 LAN 2", "各 LAN 用自己的 Router 對外。R1 ↔ R2 約 250 m，用光纖承載跨網路鏈路。"],
    ["接通跨山路段", "R2 ↔ R3 走單模光纖。圖上兩段是 3 km 和 50 km，選光模組時以實際線長與光功率預算為準。"]
  ];

  function original() {
    return `<figure class="network-quiz-figure" lang="en">
      <figcaption>Original network layout, redrawn from the quiz</figcaption>
      <div class="network-quiz-scroll" tabindex="0" role="region" aria-label="Original exam diagram">
        <svg viewBox="0 0 690 274" role="img" aria-label="LAN 1 contains computers 1 to 8, split into two groups 200 m apart. LAN 2 contains computers 9 to 11. Its group is 80 m from the backbone, 250 m from LAN 1. From there the route crosses the mountain at 3 km and continues 50 km to computer 12 in LAN 3.">
          <ellipse class="net-lan" cx="92" cy="136" rx="80" ry="121"/>
          <ellipse class="net-lan" cx="283" cy="80" rx="82" ry="63"/>
          <ellipse class="net-lan" cx="610" cy="200" rx="68" ry="49"/>
          <path class="net-terrain" d="M374 198l30-37 13 11 25-51 48 77z"/>
          <path class="net-line" d="M92 105v63M161 198h381M283 118v80"/>
          <path class="net-tick" d="M84 108h16m-16 58h16m61 24v16m122-16v16m159-16v16m100-16v16m-267-85h16"/>
          <rect class="net-node" x="33" y="60" width="118" height="40" rx="8"/>
          <rect class="net-node" x="33" y="173" width="118" height="40" rx="8"/>
          <rect class="net-node" x="226" y="71" width="114" height="40" rx="8"/>
          <rect class="net-node" x="553" y="174" width="115" height="38" rx="8"/>
          <text class="net-label" x="92" y="42">LAN 1</text><text class="net-label" x="283" y="42">LAN 2</text><text class="net-label" x="610" y="232">LAN 3</text>
          <text x="92" y="85">Computers 1–4</text><text x="92" y="198">Computers 5–8</text><text x="283" y="96">Computers 9–11</text><text x="610" y="198">Computer 12</text>
          <text class="net-distance" x="124" y="142">200 m</text><text class="net-distance" x="226" y="224">250 m</text>
          <text class="net-distance" x="313" y="164">80 m</text><text class="net-distance" x="355" y="224">3 km</text>
          <text class="net-distance" x="497" y="224">50 km</text><text class="net-distance" x="443" y="110">Mountain</text>
        </svg>
      </div>
      <p class="network-quiz-caption">Inside LAN 1: 200 m · LAN 1 to LAN 2: 250 m · LAN 2 to the backbone: 80 m · Across the mountain to LAN 3: 3 km + 50 km</p>
    </figure>`;
  }

  function solution() {
    return `<section class="midterm-interactive network-quiz-solution" data-network-quiz-step="1" aria-label="第 1 題拓樸解題">
      <div class="network-quiz-heading"><h4>一步一步接好網路</h4><span data-network-counter>1 / 3</span></div>
      <p class="network-quiz-instruction" role="status"></p>
      <div class="network-quiz-scroll" tabindex="0" role="region" aria-label="參考拓樸圖">
        <svg viewBox="0 0 700 322" role="img" aria-label="PC 1–4 接 S1，PC 5–8 接 S2，兩台交換器用 200 m 光纖相連。S2 接 R1，R1 用 250 m 光纖接 R2。PC 9–11 接 S3，S3 用 80 m UTP 接 R2。R2 以長距離單模光纖經 3 km 與 50 km 路段接 R3，R3 直接接 PC 12。">
          <rect class="net-lan" x="12" y="12" width="187" height="298" rx="19"/>
          <rect class="net-lan" x="245" y="12" width="133" height="258" rx="19"/>
          <rect class="net-lan" x="546" y="178" width="142" height="95" rx="19"/>
          <path class="net-terrain" d="M397 232l26-33 12 9 22-43 36 67z"/>
          <text class="net-label" x="105" y="36">LAN 1</text><text class="net-label" x="311" y="36">LAN 2</text><text class="net-label" x="617" y="200">LAN 3</text>
          <g data-network-reveal="1">
            <path class="net-line" d="M80 80v31m0 126v34m24-52h42m165-139v31m0 27v68m280 27h30"/>
            <path class="net-fiber" d="M80 138v68"/>
            <text class="net-distance" x="117" y="98">UTP</text><text class="net-distance" x="128" y="168">200 m 光纖</text>
            <text class="net-distance" x="105" y="255">UTP</text><text class="net-distance" x="126" y="209">UTP</text>
            <text class="net-distance" x="340" y="98">UTP</text><text class="net-distance" x="313" y="181">80 m UTP</text>
            <text class="net-distance" x="610" y="250">UTP</text>
            <rect class="net-node" x="27" y="49" width="106" height="31" rx="7"/><text x="80" y="69">PC 1–4</text>
            <rect class="net-node" x="27" y="271" width="106" height="28" rx="7"/><text x="80" y="291">PC 5–8</text>
            <rect class="net-node" x="259" y="49" width="104" height="31" rx="7"/><text x="311" y="69">PC 9–11</text>
            <rect class="net-node" x="621" y="218" width="58" height="30" rx="7"/><text x="650" y="238">PC 12</text>
            ${[[80,124,"S1"],[80,221,"S2"],[311,124,"S3"]].map(([x,y,name]) =>
              `<rect class="net-switch" x="${x-24}" y="${y-14}" width="48" height="28" rx="7"/><text x="${x}" y="${y+5}">${name}</text>`).join("")}
            ${[[163,221,"R1"],[311,221,"R2"],[573,233,"R3"]].map(([x,y,name]) =>
              `<circle class="net-router" cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+5}">${name}</text>`).join("")}
          </g>
          <g data-network-reveal="2">
            <path class="net-fiber" d="M180 221h114"/>
            <text class="net-distance" x="237" y="248">250 m 光纖</text>
          </g>
          <g data-network-reveal="3">
            <path class="net-fiber" d="M328 221h52v12h176"/>
            <circle class="net-waypoint" cx="453" cy="233" r="4"/>
            <text class="net-distance" x="413" y="257">3 km</text><text class="net-distance" x="501" y="257">50 km</text>
            <text class="net-distance" x="457" y="288">跨山單模光纖</text>
          </g>
        </svg>
      </div>
      <p class="network-quiz-caption">S1–S3 為 Switch，R1–R3 為 Router。<span class="network-quiz-swipe">圖面可以左右滑動。</span></p>
      <div class="network-quiz-actions"><button type="button" class="btn secondary" data-network-move="-1">← 上一步</button><button type="button" class="btn" data-network-move="1">下一步 →</button></div>
    </section>`;
  }

  function bind(box) {
    const counter = box.querySelector("[data-network-counter]");
    const instructions = box.querySelector(".network-quiz-instruction");
    const [previous, next] = box.querySelectorAll("[data-network-move]");
    const diagram = box.querySelector(".network-quiz-scroll");
    let step = 0;
    function render() {
      const [title, detail] = stages[step];
      box.dataset.networkQuizStep = step + 1;
      counter.textContent = `${step + 1} / ${stages.length}`;
      instructions.textContent = `${title}。 ${detail}`;
      previous.disabled = step === 0;
      next.disabled = step === stages.length - 1;
    }
    for (const button of [previous, next]) button.addEventListener("click", () => {
      step += Number(button.dataset.networkMove);
      render();
      if (diagram.scrollWidth > diagram.clientWidth) {
        const layer = box.querySelector(`[data-network-reveal="${step + 1}"]`).getBoundingClientRect();
        const frame = diagram.getBoundingClientRect();
        diagram.scrollLeft = step === 0 ? 0 : diagram.scrollLeft + layer.left + layer.width / 2 - frame.left - frame.width / 2;
      }
      if (button.disabled) (step === 0 ? next : previous).focus({ preventScroll: true });
    });
    render();
  }

  return { original, solution, bind };
})();
