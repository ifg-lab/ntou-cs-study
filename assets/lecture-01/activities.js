"use strict";

(() => {
  StudyActivities.register("lecture-01", [
    {
      concept: "algorithm", page: 24, title: "找出最大值程式的破綻",
      intro: "先試全負數，再改用第一項當初值。觀察每輪留下的最大值。",
      fields: [
        { id: "sample", label: "測試資料", options: [["negative", "−8、−2、−5"], ["mixed", "−4、7、3"], ["one", "−3"]], value: "negative" },
        { id: "first", label: "初始最大值", options: [["zero", "先設成 0"], ["first", "使用陣列第一項"]], value: "zero" }
      ],
      run({ sample, first }) {
        const values = { negative: [-8, -2, -5], mixed: [-4, 7, 3], one: [-3] }[sample];
        const fromArray = first === "first";
        let best = fromArray ? values[0] : 0;
        const startsAt = fromArray ? 1 : 0;
        const trace = Array.from({ length: startsAt }, () => String(best));
        for (const value of values.slice(startsAt)) {
          best = Math.max(best, value);
          trace.push(String(best));
        }
        const correct = best === Math.max(...values);
        return {
          headline: `程式回傳 ${best} · ${correct ? "符合規格" : "結果錯誤"}`,
          timeline: { caption: "依序讀取陣列", columns: values.map((_, i) => i + 1), rows: [
            ["本輪讀到", values.map(String)], ["目前最大值", trace]
          ] },
          explanation: correct ? "目前最大值等於這組輸入的最大項。換另一組資料，檢查初始值是否仍適用。" :
            `輸入中最大的值是 ${Math.max(...values)}。用 0 初始化時，所有負數都無法更新它。`
        };
      }
    },
    {
      concept: "gcd", page: 30, title: "一步步找最大公因數",
      intro: "先用 48 和 18 試算。每按一次只做一輪，注意除數和餘數怎麼移到下一輪。再把兩數對調試一次。",
      fields: [
        { id: "first", label: "第一個正整數", type: "number", min: 1, max: 99999, value: 48 },
        { id: "second", label: "第二個正整數", type: "number", min: 1, max: 99999, value: 18 }
      ],
      action: "算下一輪", resetLabel: "重設",
      initialState: () => ({ input: "", steps: [] }),
      initialResult: () => ({ headline: "目前的數對是 (48, 18)", explanation: "第一輪先算 48 除以 18 的餘數。" }),
      run({ first, second }, _, state) {
        const input = `${first},${second}`;
        if (state.input !== input) {
          state.input = input;
          state.pair = [Number(first), Number(second)];
          state.steps = [];
        }
        const [a, b] = state.pair;
        if (b) {
          const remainder = a % b;
          state.steps.push(`${a} = ${Math.floor(a / b)} × ${b} + ${remainder}`);
          state.pair = [b, remainder];
        }
        const [left, right] = state.pair;
        return {
          headline: right ? `下一輪是 (${left}, ${right})` : `最大公因數是 ${left}`,
          packetStrip: [{ label: `第一個數 ${left}`, size: 1 }, { label: `第二個數 ${right}`, size: 1, kind: "header" }],
          flow: state.steps,
          explanation: right ? "用上一輪的除數當新的第一個數，以餘數當新的第二個數。" :
            "第二個數已變成 0。答案是第一個數；可換一組輸入重新觀察。"
        };
      }
    },
    {
      concept: "hardware-history", page: 81, title: "從打孔卡走到儲存程式",
      intro: "選一個時期，比較指令或控制資料放在哪裡，以及機器要怎麼改做另一件事。",
      fields: [{ id: "era", label: "歷史階段", options: [
        ["loom", "19 世紀初 · 賈卡織機"], ["wiring", "1940 年代 · 早期 ENIAC"], ["memory", "1940 年代末 · 儲存程式"]
      ], value: "loom" }],
      run({ era }) {
        const eras = {
          loom: ["賈卡織機", "打孔卡序列", "換一疊卡片", "卡片的孔位決定每一輪哪些經線抬起。"],
          wiring: ["早期 ENIAC", "接線與開關", "重新接線與調整開關", "硬體接線配置決定各運算單元怎麼配合。"],
          memory: ["儲存程式電腦", "記憶體中的指令", "載入另一段程式", "CPU 從記憶體取出指令，依程式內容執行。"]
        };
        const [headline, storage, change, explanation] = eras[era];
        return { headline, facts: [["控制資訊", storage], ["變更工作", change]], explanation,
          timeline: { caption: "比較三個階段", columns: ["19 世紀初", "1940 年代", "1940 年代末"],
            rows: [["目前選擇", ["loom", "wiring", "memory"].map(id => id === era ? "●" : "")]] } };
      }
    },
    {
      concept: "stored-program", page: 82, title: "把不同的程式載入同一台電腦",
      intro: "兩個程式使用同一台簡化 CPU。用相同輸入切換指令，觀察取出的動作和結果如何改變。",
      graph: {
        nodes: [["ram", "主記憶體", 18, 50], ["cpu", "CPU", 49, 50], ["screen", "輸出", 82, 50]],
        links: [["ram", "cpu"], ["cpu", "screen"]]
      },
      fields: [
        { id: "program", label: "載入的程式", options: [["add", "加 1"], ["scale", "乘以 2"]], value: "add" },
        { id: "value", label: "輸入", type: "number", min: 0, max: 100, value: 7 }
      ],
      action: "載入並執行", initialResult: () => ({ headline: "先選要載入的程式" }),
      run({ program, value }) {
        const add = program === "add";
        const instruction = add ? "加 1" : "乘以 2";
        const answer = add ? Number(value) + 1 : Number(value) * 2;
        return {
          inFlight: "CPU 正取指並傳回結果…", headline: `輸入 ${value} → ${answer}`,
          facts: [["記憶體內的指令", instruction], ["CPU", "取指 → 解碼 → 執行"]],
          map: {
            active: ["ram-cpu", "cpu-screen"], focus: ["cpu"],
            messages: [{ from: "ram", to: "cpu", label: instruction }, { from: "cpu", to: "screen", label: String(answer), delay: 440 }]
          },
          explanation: "程式不同時，記憶體的指令內容改變，CPU 取指和執行的硬體仍可重用。"
        };
      }
    }
  ]);
})();
