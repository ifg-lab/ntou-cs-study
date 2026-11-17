"use strict";

(() => {
const width = { id: "width", label: "位元寬度", options: [["4", "4 位"], ["6", "6 位"], ["8", "8 位"]], value: "4" };
const integer = (id, label, value) => ({ id, label, value, type: "number", min: -128, max: 127 });
const magnitude = width => 2 ** (Number(width) - 1);
const limits = width => [-magnitude(width), magnitude(width) - 1];
const encoded = (value, width) => ((value + 2 * magnitude(width)) % (2 * magnitude(width))).toString(2).padStart(Number(width), "0");
const bitsOf = binary => Array.from(binary, (label, index) => ({ label, size: 1, kind: index ? "data" : "header" }));
const fits = (value, [minimum, maximum]) => value >= minimum && value <= maximum;

StudyActivities.register("lecture-02", [
  {
    concept: "twos-complement", page: 65, title: "把負數寫成二補數",
    intro: "先看 4 位的 −6，再試 −8 和 −9，比較哪一個超出範圍。",
    fields: [width, integer("value", "十進位整數", -6)], action: "換成位元",
    run({ width, value }) {
      const number = Number(value);
      const range = limits(width);
      if (!fits(number, range)) return { headline: `${width} 位無法表示 ${number}`, explanation: `有號範圍為 ${range[0]} 到 ${range[1]}，可改用更寬的位元。` };
      const binary = encoded(number, width);
      const weights = Array.from(binary, (bit, index) => bit === "0" ? null
        : index ? String(2 ** (Number(width) - index - 1)) : String(range[0])).filter(Boolean);
      return { headline: `${number} → ${binary}`, packetStrip: bitsOf(binary),
        explanation: `棕色的最高位權重為 ${range[0]}。把值為 1 的位權加起來：${weights.join(" + ") || "0"} = ${number}。` };
    }
  },
  {
    concept: "signed-overflow", page: 67, title: "加法會不會溢位？",
    intro: "先算 5 + 4，試著把 4 位改為 6 位。再試 −1 + 1，比較進位與溢位。",
    fields: [width, integer("left", "第一個整數", 5), integer("right", "第二個整數", 4)], action: "試算加法",
    run({ width, left, right }) {
      const values = [Number(left), Number(right)];
      const range = limits(width);
      if (values.some(value => !fits(value, range))) return { headline: "有加數超出範圍", explanation: `請輸入 ${range[0]} 到 ${range[1]} 之間的整數，或換較多位元。` };
      const [x, y] = values;
      const sum = x + y;
      const a = encoded(x, width);
      const b = encoded(y, width);
      const raw = Number.parseInt(a, 2) + Number.parseInt(b, 2);
      const carry = raw >= 2 * magnitude(width);
      const result = (raw % (2 * magnitude(width))).toString(2).padStart(Number(width), "0");
      const signed = Number.parseInt(result, 2) - (result.startsWith("1") ? 2 * magnitude(width) : 0);
      const overflow = !fits(sum, range);
      return {
        headline: overflow ? "有號溢位" : "沒有有號溢位",
        flow: [`${a} + ${b}`, `保留低 ${width} 位：${result}`],
        packetStrip: bitsOf(result),
        facts: [["數學總和", sum], ["低位的有號解讀", signed], ["最高位進位", carry ? "有" : "無"]],
        explanation: `範圍為 ${range[0]} 到 ${range[1]}。${overflow ? "正確總和超出範圍，所以保留低位後讀到的是另一個值。" : "正確總和在範圍內，因此有號解讀等於數學總和。"}`
      };
    }
  },
  {
    concept: "logic-gates", page: 8, title: "沿著訊號看邏輯閘",
    intro: "先把 A、B 都設為 1，分別送進 OR 和 XOR。觀察訊號到達閘後的輸出。",
    graph: {
      nodes: [["a", "A", 17, 24], ["b", "B", 17, 76], ["gate", "邏輯閘", 48, 50], ["q", "輸出", 82, 50]],
      links: [["a", "gate"], ["b", "gate"], ["gate", "q"]]
    },
    fields: [
      { id: "operator", label: "邏輯運算", options: [["or", "OR"], ["xor", "XOR"], ["and", "AND"]], value: "or" },
      ...["a", "b"].map(id => ({ id, label: `輸入 ${id.toUpperCase()}`, options: [["0", "0"], ["1", "1"]], value: "1" }))
    ],
    action: "送出訊號",
    initialResult: () => ({ headline: "預設 A＝1、B＝1" }),
    run({ operator, a, b }) {
      const result = { and: Number(a) & Number(b), or: Number(a) | Number(b), xor: Number(a) ^ Number(b) }[operator];
      const rule = { and: "兩個都為 1 才輸出 1。", or: "至少一個為 1 就輸出 1。", xor: "兩個輸入不同才輸出 1。" }[operator];
      return {
        inFlight: "輸入訊號進入邏輯閘…",
        headline: `${a} ${operator.toUpperCase()} ${b} → ${result}`, explanation: rule,
        map: { active: ["a-gate", "b-gate", "gate-q"], focus: ["gate"],
          messages: [{ from: "a", to: "gate", label: a }, { from: "b", to: "gate", label: b },
            { from: "gate", to: "q", delay: 440, label: String(result) }] }
      };
    }
  },
  {
    concept: "flip-flop", page: 24, title: "D 正反器什麼時候更新？",
    intro: "先換 D 的值，觀察 Q 保持不動。按一次觸發，才會把現在的 D 存進 Q。回頭把 D 改回 0 再試一次。",
    fields: [{ id: "data", label: "D 輸入", options: [["0", "0"], ["1", "1"]], value: "1" }],
    graph: { nodes: [["d", "輸入 D", 20, 51], ["clock", "時脈 ↑", 48, 24], ["q", "輸出 Q", 79, 51]],
      links: [["d", "q"], ["clock", "q"]] },
    action: "觸發上升邊緣", resetLabel: "重設 Q",
    initialState: () => ({ output: "0", clock: 0 }),
    initialResult: () => ({ headline: "初始 Q＝0", facts: [["D", "1"], ["Q", "0"], ["觸發次數", 0]] }),
    preview({ data }, state) {
      return { headline: `D＝${data}，Q 仍是 ${state.output}`,
        facts: [["D", data], ["Q", state.output], ["觸發次數", state.clock]] };
    },
    run({ data }, _, state) {
      state.output = data;
      state.clock++;
      return { headline: `已取樣：Q＝${data}`, inFlight: "上升邊緣觸發，Q 正在更新…",
        facts: [["D", data], ["Q", state.output], ["觸發次數", state.clock]],
        map: { active: ["clock-q", "d-q"], focus: ["q"],
          messages: [{ from: "clock", to: "q", label: "↑" }, { from: "d", to: "q", label: data, delay: 330 }] },
        explanation: "兩次有效邊緣之間，D 怎麼改都不會自動覆寫已存的 Q。" };
    }
  },
  {
    concept: "bit-interpretation", page: 65, title: "同一個 byte，兩種整數解讀",
    intro: "預測 D6 在兩種格式的值，再切換有號與無號，檢查最高位的權重。",
    fields: [
      { id: "raw", label: "十六進位 byte", type: "text", value: "D6" },
      { id: "mode", label: "格式", options: [["signed", "有號二補數"], ["unsigned", "無號整數"]], value: "signed" }
    ],
    action: "顯示位權",
    run({ raw, mode }) {
      const hex = raw.trim().replace(/^0x/i, "");
      if (!/^[0-9a-f]{1,2}$/i.test(hex)) return { headline: "請輸入 00～FF 之間的十六進位值" };
      const byte = Number.parseInt(hex, 16);
      const bits = [...byte.toString(2).padStart(8, "0")];
      const top = mode === "signed" ? -128 : 128;
      const weights = [top, 64, 32, 16, 8, 4, 2, 1];
      const parts = weights.filter((_, index) => bits[index] === "1");
      const total = parts.reduce((sum, weight) => sum + weight, 0);
      return { headline: `0x${hex.toUpperCase().padStart(2, "0")} → ${total}`,
        packetStrip: bits.map((label, index) => ({ label: `${label} × ${weights[index]}`, size: 1, kind: index ? "data" : "header" })),
        explanation: `把位元為 1 的位權加總，得到 ${parts.join(" + ") || "0"}。換解讀方式時，位元串保持原樣。` };
    }
  },
  {
    concept: "floating-fields", page: 75, title: "分拆課本的八位浮點數",
    intro: "輸入 8 個位元，先用 01011011，再把指數欄的 101 改成 110，看看數值如何改變。",
    fields: [{ id: "raw", label: "依序填寫 1 位符號、3 位指數、4 位尾數", type: "text", value: "01011011" }],
    action: "下一欄", resetLabel: "從頭開始",
    initialState: () => ({ input: "", step: 0 }),
    initialResult: () => ({ headline: "先預測最後的數值，再按「下一欄」。" }),
    run({ raw }, _, state) {
      const bits = raw.trim().replace(/\s/g, "");
      if (!/^[01]{8}$/.test(bits)) return { headline: "請輸入八個 0 或 1" };
      const sign = bits[0];
      const exponentBits = bits.slice(1, 4);
      const fractionBits = bits.slice(4);
      const exponent = Number.parseInt(exponentBits, 2) - 3;
      const fraction = Number.parseInt(fractionBits, 2) / 16;
      const value = (sign === "1" ? -1 : 1) * fraction * 2 ** exponent;
      if (state.input !== bits) {
        state.input = bits;
        state.step = 0;
      }
      state.step = Math.min(state.step + 1, 4);
      const stages = [
        [sign === "1" ? "符號是負" : "符號是正", "第一個位元 1 代表負，0 代表正。"],
        [`指數是 ${exponent}`, `${exponentBits}₂ 的無號值減 3，得到實際指數。`],
        [`有效數字是 ${fraction}`, `從 0.${fractionBits}₂ 逐位加起來。`],
        [`算得 ${value}`, `把符號、有效數字 ${fraction} 與 2 的 ${exponent} 次方相乘。`]
      ];
      const [headline, explanation] = stages[state.step - 1];
      return {
        headline,
        packetStrip: [
          { label: `S：${sign}`, size: 1, kind: "header" },
          { label: `E：${exponentBits}`, size: 2, kind: "network" },
          { label: `尾數：${fractionBits}`, size: 2 }
        ],
        facts: [["步驟", `${state.step} / 4`]],
        explanation
      };
    }
  },
  {
    concept: "compression", page: 92, title: "把連續重複的字元收成一組",
    intro: "比較 AAAAABBBCC 和 ABABAB。程式會標出每個游程，接著比較表示長度。",
    fields: [{ id: "text", label: "輸入 1～16 個英文字母", type: "text", value: "AAAAABBBCC" }],
    action: "分組編碼",
    run({ text }) {
      const input = text.trim().toUpperCase();
      if (!/^[A-Z]{1,16}$/.test(input)) return { headline: "請輸入 1～16 個英文字母" };
      const runs = input.match(/([A-Z])\1*/g);
      const encoded = runs.map(run => `${run.length}${run[0]}`);
      const length = encoded.join("").length;
      return {
        headline: `${input.length} 個字元 → ${length} 個字元`,
        packetStrip: runs.map((run, index) => ({ label: `${run} → ${encoded[index]}`, size: run.length, kind: index % 2 ? "data" : "header" })),
        explanation: `讀回時按次數重複每個字母。採用「次數＋字母」的表示，這筆輸入${length < input.length ? "變短了。" : length === input.length ? "長度一樣。" : "反而變長。"}`
      };
    }
  },
  {
    concept: "parity", page: 97, title: "翻轉位元，看偶同位會不會發現",
    intro: "先比對完全正確、翻一位和翻兩位。從顏色找出翻動的位置，再檢查 1 的總數。",
    fields: [{ id: "count", label: "傳輸中翻動的位元", options: [["0", "不翻動"], ["1", "翻第 2 位"], ["2", "翻第 2、3 位"]], value: "0" }],
    run({ count }) {
      const data = "10111";
      const received = [...data].map((bit, index) => index > 0 && index <= Number(count) ? String(1 - Number(bit)) : bit);
      const ones = received.filter(bit => bit === "1").length;
      return {
        headline: ones % 2 ? "檢查發現錯誤" : "接收端的偶同位檢查通過",
        packetStrip: received.map((bit, index) => ({ label: `第 ${index + 1} 位：${bit}`, size: 1, kind: bit === data[index] ? "data" : "header" })),
        facts: [["原始序列（末位是同位元）", data], ["接收序列", received.join("")], ["接收到的 1", ones]],
        explanation: "翻一位會改變奇偶。翻兩位維持原本的奇偶，因此即使這次檢查通過，仍有可能出現錯誤。"
      };
    }
  }
]);
})();
