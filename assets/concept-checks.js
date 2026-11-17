"use strict";

const studyConceptChecks = {
  "lecture-01": {
    page: 81, title: "換工作時，改的是什麼？",
    compare: "接線式裝置可能需要調整接線或開關。儲存程式電腦把指令和資料放在記憶體，CPU 依程式計數器（PC）找到下一條要取的指令。",
    example: "同一台電腦剛執行完求總和的程式。現在把求最大值的程式載到位址 0x40。先猜 CPU 怎麼知道要從哪裡開始。",
    prompt: "What should happen before the CPU fetches the first instruction of the new program?",
    choices: [
      ["Load the starting address 0x40 into the program counter.", "正確。PC 指向新程式的第一條指令。取指後，CPU 才能把指令送進 IR 進行解碼。"],
      ["Load the program’s first data value into the program counter.", "PC 要存的是指令位址。資料值不能用來告訴 CPU 要從哪裡取指令。"],
      ["Rewire the CPU before running every new program.", "新程式已經以指令序列載入記憶體。同一顆 CPU 可以執行這些指令，不需要為每個工作改接線。"]
    ],
    answer: 0, activity: "hardware-history", sources: [["2022-quiz1", 5, "2022 年第一次小考第 5 題"], ["2026-quiz1", 1, "2026 年第一次小考第 1 題"]]
  },
  "lecture-02": {
    page: 67, title: "同一串位元，有號解讀和溢位怎麼分？",
    compare: "先決定用有號還是無號解讀。8 位元無號範圍是 0～255，二補數有號範圍是 −128～127。有號溢位看數學結果能不能落在有號範圍內。",
    example: "例如 0xB6 的無號值是 182，二補數值是 182 − 256 = −74。接著先猜：把兩個有號的 0xB6 相加，低 8 位和溢位判斷會是多少？",
    prompt: "In 8-bit two’s-complement arithmetic, what happens when 0xB6 is added to 0xB6?",
    choices: [
      ["The result is 0x6C, with no signed overflow.", "低 8 位確實是 0x6C，但 −74 + (−74) = −148，超過可表示的下限。"],
      ["The low eight bits are 0x6C, and signed overflow occurs.", "正確。數學結果是 −148，低 8 位留下 0x6C（+108）。兩個負數相加後符號反轉，是這次有號溢位的線索。"],
      ["The result is 0x94 because both operands are negative.", "應先算 −74 + (−74) = −148，然後取模 256。得到 108，也就是 0x6C。"]
    ],
    answer: 1, activity: "signed-overflow", sources: [["2022-quiz1", 6, "2022 年第一次小考第 6 題"], ["2026-quiz1", 4, "2026 年第一次小考第 4 題"]]
  },
  "lecture-03": {
    page: 59, title: "管線讓哪個時間變短？",
    compare: "第一條指令仍要經過所有階段。管線的效益是讓多條指令重疊，讓後續指令接連完成。題目若有停頓，把停頓的拍數另外加上。",
    example: "先想像 5 條指令通過 4 個階段。第 4 拍才完成第一條，後面 4 條可以一拍完成一條。",
    prompt: "Eight instructions go through a four-stage pipeline. Each stage takes one cycle and there are no stalls. When does the last instruction finish?",
    choices: [
      ["After 8 cycles.", "這個答案少算了填滿管線的時間。第一條要到第 4 拍才完成。"],
      ["After 32 cycles.", "8 × 4 是每條指令走完才讓下一條進來的時間。題目允許階段重疊。"],
      ["After 11 cycles.", "正確。第 4 拍完成第一條，接著 7 條各等一拍：4 + 7 = 11。"]
    ],
    answer: 2, activity: "pipeline", sources: [["2025-midterm", 8, "2025 年期中考第 8 題"], ["2026-quiz2", 2, "2026 年第二次小考第 2 題"]]
  },
  "lecture-04": {
    page: 43, title: "一直等，是死結還是飢餓？",
    compare: "死結要追誰持有資源、誰在等誰。飢餓要看是否有某個工作反覆被跳過，但其他工作仍能進行。",
    example: "A 拿著鎖 1 等鎖 2，B 拿著鎖 2 等鎖 1，兩人都卡住。想想另一個情境：排程器一直執行新來的高優先工作。",
    prompt: "One low-priority process repeatedly loses access to the CPU, while new high-priority processes keep finishing. What does this illustrate?",
    choices: [
      ["Starvation.", "正確。系統持續完成其他工作，但低優先程序一直拿不到 CPU。給等待者逐步提高優先權，可以降低這種情況。"],
      ["Deadlock.", "情境裡其他工作持續完成，也沒有互等資源的循環。低優先程序卡在資源分配。"],
      ["Every process is blocked.", "高優先工作仍一直完成，題目描述的是其中一個工作拿不到 CPU。"]
    ],
    answer: 0, activity: "deadlock", sources: [["2018-quiz2", 9, "2018 年第二次小考第 9 題"], ["2025-quiz2", 6, "2025 年第二次小考第 6 題"]]
  },
  "lecture-05": {
    page: 38, title: "同一個訊框，先學來源，再查目的",
    compare: "A 從埠 1 進來，交換器會先記 A → 埠 1。若目的 B 已知在埠 3，只送到埠 3；若目的 C 未知，才向同一 VLAN 的其他可用埠泛洪。",
    example: "四個埠都在同一 VLAN。先猜 A 從埠 1 傳給未知的 C 時，交換器會在哪些埠送出，再開實驗送一次。",
    prompt: "A frame enters port 1. Its destination MAC is unknown, and ports 1–4 are all forwarding in the same VLAN. What does the switch do?",
    choices: [
      ["It sends the frame out ports 1, 2, 3 and 4.", "未知單播會泛洪，但進來的埠 1 要排除。"],
      ["It learns the source on port 1 and sends the frame out ports 2, 3 and 4.", "正確。來源 MAC 用來更新表格；找不到目的 MAC 時，向同 VLAN 的其他可用埠送出。"],
      ["It learns the destination MAC on port 1 and waits for another frame.", "埠 1 告訴交換器的是來源 A 在哪裡。C 還沒從自己的埠送過來，這一筆無法學到 C 的位置。"]
    ],
    answer: 1, activity: "switch-destination", sources: [["2025-quiz2", 9, "2025 年第二次小考第 9 題（連網設備）"]]
  }
};
