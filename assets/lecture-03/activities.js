"use strict";

(() => {
  const piece = (label, kind = "data") => ({ label, size: 1, kind });
  const phases = ["取", "解", "執", "存", "回"];
  StudyActivities.register("lecture-03", [
    {
      concept: "instruction-trace", page: 25, title: "逐步追蹤一段含跳躍的機器碼",
      intro: "先選 R0，預測 M[4F] 的最後數值。每按一次，觀察取指或執行如何改變狀態。",
      fields: [{ id: "compare", label: "R0 初始值", options: [["5", "05 · 比較相等"], ["6", "06 · 比較不相等"]], value: "5" }],
      action: "下一步", resetLabel: "重設",
      initialState: () => ({ comparison: null }),
      initialResult: () => ({ headline: "PC 從 20 開始。程式與位址皆為十六進位。", facts: [
        ["20–21", "2105 · R1 ← 05"], ["22–23", "B126 · 若 R1＝R0 則跳到 26"], ["24–25", "2109 · R1 ← 09"],
        ["26–27", "314F · M[4F] ← R1"], ["28–29", "C000 · HALT"]
      ] }),
      run({ compare }, _, state) {
        const program = { 32: "2105", 34: "B126", 36: "2109", 38: "314F", 40: "C000" };
        const hex = value => value === null ? "—" : value.toString(16).toUpperCase().padStart(2, "0");
        if (state.comparison !== compare) {
          Object.assign(state, { comparison: compare, pc: 32, ir: "—", r1: 0, memory: 0, phase: "fetch", log: [] });
        }
        const before = [state.pc, state.ir, state.r1, state.memory];
        if (state.phase === "fetch") {
          const address = state.pc;
          state.ir = program[address];
          state.pc += 2;
          state.phase = "execute";
          state.log.push(`取指 ${hex(address)}：IR ← ${state.ir}，PC ← ${hex(state.pc)}。`);
        } else if (state.phase === "execute") {
          state.phase = "fetch";
          const [op, , ...digits] = state.ir;
          const operand = Number.parseInt(digits.join(""), 16);
          if (op === "2") {
            state.r1 = operand;
            state.log.push(`執行 ${state.ir}：R1 ← ${hex(state.r1)}。`);
          } else if (op === "B") {
            if (state.r1 === Number(compare)) state.pc = operand;
            state.log.push(`執行 B126：R1 ${state.r1 === Number(compare) ? "＝" : "≠"} R0，下一次到 ${hex(state.pc)} 取指。`);
          } else if (op === "3") {
            state.memory = state.r1;
            state.log.push(`執行 314F：M[4F] ← ${hex(state.memory)}。`);
          } else {
            state.phase = "done";
            state.log.push("執行 C000：停止。");
          }
        }
        const after = [state.pc, state.ir, state.r1, state.memory];
        return {
          headline: state.phase === "done" ? `停止 · M[4F]＝${hex(state.memory)}` : state.log.at(-1),
          packetStrip: after.map((value, index) => ({
            label: `${["PC", "IR", "R1", "M[4F]"][index]} ${index === 1 ? value : hex(value)}`,
            size: 1, kind: value !== before[index] ? "header" : "data"
          })),
          facts: [["R0", hex(Number(compare))]],
          flow: state.log,
          explanation: state.phase === "done" ? "換 R0 值再跑一次，找出 24 位址的指令是否被跳過。" :
            "深色格是這一步有變動的欄位。分支在執行時決定下一次取指位置。"
        };
      }
    },
    {
      concept: "machine-cycle", page: 27, title: "跟著 PC 取出一條機器指令",
      intro: "從 PC＝A0 開始，逐次按取指、解碼和執行。先預測哪一步的 PC 指向 A2，哪一步 R5 才有資料。",
      goal: "起始 PC＝A0。主記憶體的 A0、A1 是 15 和 6C，6C 的內容為 2A。",
      finish: "此時下一次取指將從 A2 開始。",
      graph: {
        nodes: [["pc", "PC", 22, 26], ["ram", "記憶體", 22, 76], ["ir", "IR", 54, 51], ["r5", "R5", 82, 76]],
        links: [["pc", "ram"], ["ram", "ir"], ["ram", "r5"]]
      },
      steps: [
        { label: "從記憶體取指並更新 PC", action: "取指", hint: "PC 剛開始指向 A0，先讀連續兩格。",
          detail: "M[A0]＝15、M[A1]＝6C。IR 組成 156C，PC 前進兩格到 A2。",
          appearance: { active: ["pc-ram", "ram-ir"], focus: ["pc", "ir"] },
          messages: [{ from: "pc", to: "ram", label: "A0" }, { from: "ram", to: "ir", label: "15・6C", delay: 430 }] },
        { label: "判讀操作碼與運算元", action: "解碼", hint: "IR 已拿到指令，接著要辨認操作。",
          detail: "操作碼 1 表示從記憶體載入，5 指定目的 R5，6C 指定資料所在的位址。",
          appearance: { focus: ["ir"] } },
        { label: "載入資料到 R5", action: "執行", hint: "知道來源和目的地之後，就能複製內容。",
          detail: "把 M[6C] 的 2A 放入 R5。PC 仍是 A2，IR 仍是 156C。",
          appearance: { active: ["ram-r5"], focus: ["r5"] },
          messages: [{ from: "ram", to: "r5", label: "2A" }] }
      ]
    },
    {
      concept: "endianness", page: 31, title: "把十六進位值放進四個記憶格",
      intro: "看同一個數如何依大端序或小端序排列。每個有位址的格子恰好儲存兩個十六進位數字。",
      fields: [
        { id: "raw", label: "32 位十六進位值", type: "text", value: "12345678" },
        { id: "order", label: "位元組順序", options: [["little", "小端序"], ["big", "大端序"]], value: "little" }
      ],
      action: "寫入記憶體",
      run({ raw, order }) {
        const cleaned = raw.trim().replace(/^0x/i, "").toUpperCase();
        if (!/^[0-9A-F]{1,8}$/.test(cleaned)) return { headline: "請輸入 1～8 個十六進位數字" };
        const bytes = cleaned.padStart(8, "0").match(/../g);
        const little = order === "little";
        if (little) bytes.reverse();
        return {
          headline: "由低位址往高位址排列",
          packetStrip: bytes.map((byte, index) => piece(`0x${(0x20 + index).toString(16)}：${byte}`, index === 0 ? "header" : "data")),
          explanation: little ? "最低有效的位元組放在 0x20。每一格內的位元順序維持原樣。" :
            "最高有效的位元組放在 0x20。每一格內的位元順序維持原樣。"
        };
      }
    },
    {
      concept: "bit-mask", page: 35, title: "用一個遮罩改指定的位元",
      intro: "用 1011 和 1101 試 AND。再換 XOR 或 OR，比較哪些位元被保留、清除或翻轉。",
      fields: [
        { id: "value", label: "四位資料", type: "text", value: "1011" },
        { id: "mask", label: "四位遮罩", type: "text", value: "1101" },
        { id: "operator", label: "運算", options: [["and", "AND"], ["or", "OR"], ["xor", "XOR"]], value: "and" }
      ],
      action: "套用遮罩",
      run({ value, mask, operator }) {
        if (![value, mask].every(bits => /^[01]{4}$/.test(bits))) return { headline: "資料和遮罩都需各填四位" };
        const [a, b] = [value, mask].map(bits => Number.parseInt(bits, 2));
        const result = { and: a & b, or: a | b, xor: a ^ b }[operator].toString(2).padStart(4, "0");
        return {
          headline: `${value} ${operator.toUpperCase()} ${mask} = ${result}`,
          packetStrip: [...result].map((bit, index) => piece(`${value[index]} → ${bit}`, bit !== value[index] ? "header" : "data")),
          explanation: "每個區塊表示同一個位元從輸入到輸出。深色格是這次被改動的位元。"
        };
      }
    },
    {
      concept: "io", page: 42, title: "跟著 DMA 搬一次資料",
      intro: "先找出哪個步驟是 CPU 在下指令。再看資料真正移動時走哪條線，以及完成通知回到哪裡。",
      goal: "裝置控制器已收到一批資料，目標是寫入 RAM。",
      graph: {
        nodes: [["cpu", "CPU", 20, 51], ["controller", "控制器", 54, 26], ["ram", "RAM", 82, 70]],
        links: [["cpu", "controller"], ["controller", "ram"]]
      },
      steps: [
        { label: "設定傳輸", action: "CPU 設定 DMA", hint: "搬運前要先知道來源、目的和大小。",
          detail: "CPU 把目的位址與長度等參數交給控制器。",
          appearance: { active: ["cpu-controller"], focus: ["cpu", "controller"] },
          messages: [{ from: "cpu", to: "controller", label: "位址、長度" }] },
        { label: "硬體搬資料", action: "搬資料到 RAM", hint: "參數已經設定，可以開始傳輸資料。",
          detail: "控制器與 DMA 硬體處理搬運，資料直接送到 RAM；CPU 可繼續其他工作。",
          appearance: { active: ["controller-ram"], focus: ["controller", "ram"] },
          messages: [{ from: "controller", to: "ram", label: "資料區塊" }] },
        { label: "回報完成", action: "通知 CPU", hint: "搬運結束後，CPU 還需要知道結果。",
          detail: "控制器可用中斷通知 CPU，CPU 再處理結果。",
          appearance: { active: ["cpu-controller"], focus: ["cpu"] },
          messages: [{ from: "controller", to: "cpu", label: "完成中斷" }] }
      ]
    },
    {
      concept: "pipeline", page: 59, title: "讓指令進管線，再插入兩拍等待",
      intro: "先看四條互不相依的指令。再讓第 2 條等第 1 條的結果，從「停」的時間格觀察後面的指令也被推遲。",
      fields: [
        { id: "count", label: "指令條數", options: [["2", "2 條"], ["3", "3 條"], ["4", "4 條"], ["5", "5 條"]], value: "4" },
        { id: "hazard", label: "第 2 條需要等待", options: [["0", "無相依"], ["2", "解碼後多等 2 拍"]], value: "0" }
      ],
      run({ count, hazard }) {
        const wait = Number(hazard);
        const total = phases.length + Number(count) - 1 + wait;
        const rows = Array.from({ length: Number(count) }, (_, index) => {
          const cells = Array(total).fill("");
          const start = index + (index > 1 ? wait : 0);
          const steps = index === 1 ? [...phases.slice(0, 2), ...Array(wait).fill("停"), ...phases.slice(2)] : phases;
          cells.splice(start, steps.length, ...steps);
          return [`指令 ${index + 1}`, cells];
        });
        return {
          headline: `管線共用 ${total} 拍`,
          timeline: { caption: "取指 → 解碼 → 執行 → 訪存 → 回寫（簡化模型）", columns: Array.from({ length: total }, (_, i) => i + 1), rows },
          explanation: wait ? "第二條解碼後等兩拍，後面指令的進入時間也向後移。圖中用簡化的延後方式呈現停頓。" :
            "第一條指令走完五級；在沒有停頓時，接下來每拍完成一條。"
        };
      }
    }
  ]);
})();
