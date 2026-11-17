"use strict";

StudySite.registerCourseStudy("lecture-03", {
  "terms": {
    "CPU": {
      "explanation": "CPU 使用暫存器保留正在操作的值，控制單元協調資料路徑，運算單元計算指令的結果。處理器經互連從記憶體取得指令和資料。",
      "related": [
        [
          "ALU",
          "負責數值與邏輯運算"
        ],
        [
          "Register",
          "保存需要快速存取的值"
        ]
      ]
    },
    "ALU": {
      "explanation": "兩個值通常由暫存器或資料路徑送入 ALU。控制訊號選擇加法、比較或位元運算，結果可寫回暫存器。",
      "related": [
        [
          "CPU",
          "ALU 是 CPU 的一部分"
        ],
        [
          "Bit Mask",
          "可由 ALU 執行"
        ]
      ]
    },
    "Register": {
      "explanation": "通用暫存器保存運算值，PC 和 IR 有特殊用途。同一指令可能同時讀來源暫存器並寫一個目的暫存器。",
      "related": [
        [
          "Program Counter",
          "保存接下來要取指的位置"
        ],
        [
          "Instruction Register",
          "保存當前指令"
        ]
      ]
    },
    "Bus": {
      "explanation": "讀記憶體時互連發出位址和讀取要求，再送回資料。多個裝置使用共享通路時，要有分配使用權的方式。",
      "related": [
        [
          "DMA",
          "可經互連直接搬資料"
        ]
      ]
    },
    "Instruction Set": {
      "explanation": "ISA 定義程式能依賴的操作與資料格式；不同 CPU 實作可以遵守相同 ISA，但內部管線或效能不同。",
      "related": [
        [
          "Opcode",
          "指令編碼中決定動作的欄位"
        ],
        [
          "Pipeline",
          "硬體可用不同管線實作相同指令"
        ]
      ]
    },
    "Opcode": {
      "explanation": "讀完操作碼才知道剩餘欄位的解讀方式。附錄 C 的 3 開頭指令表示儲存，B 開頭表示帶條件的跳躍。",
      "exam": "解碼先寫操作，之後標出資料來源和目的地。",
      "example": "35A7 把 R5 寫入 M[A7]。",
      "related": [
        [
          "Operand",
          "操作碼決定其欄位如何解讀"
        ]
      ]
    },
    "Operand": {
      "explanation": "欄位可能直接給值，也可能指定暫存器或位址。不能只看到十六進位，就判斷某個欄位代表什麼。",
      "related": [
        [
          "Opcode",
          "決定每一欄的意義"
        ]
      ]
    },
    "Program Counter": {
      "explanation": "取指後通常前進到循序下一條。若分支條件成立，執行該指令時再改寫 PC。",
      "exam": "先把指令長度換成位元組，再決定循序 PC；有跳躍須檢查條件。",
      "example": "位址 A0 的兩位元組指令讀完，循序 PC 是 A2。",
      "related": [
        [
          "Instruction Register",
          "保留取出的指令，PC 可先走到下一條"
        ],
        [
          "Machine Cycle",
          "逐例追蹤取指與執行"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Instruction Register": {
      "explanation": "附錄 C 從相鄰兩格取得 15 和 6C 之後，IR 是 156C。IR 保存的是指令字，CPU 同時可更新 PC。",
      "exam": "取指後分別回答 IR 的資料與 PC 的位址。",
      "example": "M[A0]＝15、M[A1]＝6C 時 IR＝156C。",
      "related": [
        [
          "Program Counter",
          "使用 PC 定位取指來源"
        ],
        [
          "Opcode",
          "在 IR 的指令內容中拆解"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Machine Cycle": {
      "explanation": "先從記憶體讀指令，再辨認操作和欄位，最後完成計算、存取或控制轉移。個別指令未必都有記憶體寫入。",
      "exam": "能描述取指後 PC 與 IR 的變化，以及分支時 PC 如何更新。",
      "example": "取出 B258 後先得到循序位址，當 R2＝R0 時再把 PC 改成 58。",
      "related": [
        [
          "Program Counter",
          "提供取指位址"
        ],
        [
          "Pipeline",
          "讓多條指令重疊通過階段"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Endianness": {
      "explanation": "小端序從最低有效位元組開始放，大端序從最高有效位元組開始放。單個位元組中的位元排列無須顛倒。",
      "exam": "先將十六進位值每兩碼分為一組，再從最低位址排。",
      "example": "0x1234 的小端序記憶體是 34 12，大端序為 12 34。",
      "related": [
        [
          "Bus",
          "搬移多位元組資料時會遇到編碼約定"
        ]
      ],
      "concept": "endianness"
    },
    "Bit Mask": {
      "explanation": "AND 用 0 清除位元，OR 用 1 設定位元，XOR 用 1 翻轉位元。要讀第 k 位可先 AND 只含該位的遮罩。",
      "exam": "根據目標行為選 AND、OR 或 XOR，再對齊位元位置。",
      "example": "1011 AND 1101＝1001，第三個位置被清掉。",
      "related": [
        [
          "ALU",
          "執行位元邏輯"
        ],
        [
          "Register",
          "保存操作前後的位元"
        ]
      ],
      "concept": "bit-mask"
    },
    "Memory-Mapped I/O": {
      "explanation": "程式可使用普通讀寫指令操作這些地址。對裝置暫存器寫值有可能啟動動作或確認事件，要看裝置規格。",
      "related": [
        [
          "DMA",
          "映射用於控制，DMA 可另外負責大批搬運"
        ]
      ]
    },
    "DMA": {
      "explanation": "CPU 先設定參數，再由相關硬體處理大批傳輸。CPU 可執行其他工作，但仍要處理完成通知及共享記憶體。",
      "exam": "能描述誰設定傳輸、誰搬資料，以及完成後如何回報。",
      "example": "磁碟控制器把一塊資料放進 RAM，之後以中斷通知 CPU。",
      "related": [
        [
          "Bus",
          "作為資料通路"
        ],
        [
          "Memory-Mapped I/O",
          "可用映射暫存器設定裝置"
        ]
      ]
    },
    "Pipeline": {
      "explanation": "以理想每級一拍為例，第一條須經所有階段；填滿後可每拍完成一條。資料相依、分支與資源重疊會讓實際結果不同。",
      "exam": "k 級、n 條、無停頓的理想時間為 k+n−1 拍。",
      "example": "5 級處理 4 條需 8 拍；停頓兩拍後是 10 拍。",
      "related": [
        [
          "Data Hazard",
          "可能需要加入停頓"
        ],
        [
          "Machine Cycle",
          "提供可重疊的階段"
        ]
      ],
      "concept": "pipeline"
    },
    "Data Hazard": {
      "explanation": "像 R1 剛由前一條指令計算，而下一條正要讀 R1；沒處理就可能取得舊值。可由前遞提供新值，或停頓直到就緒。",
      "exam": "在題目上標註哪條寫哪個暫存器、哪條讀，及新值何時就緒。",
      "example": "ADD 寫 R1，下一條 SUB 讀 R1，構成先寫後讀的相依。",
      "related": [
        [
          "Pipeline",
          "等待造成理想時間之外的空拍"
        ]
      ],
      "concept": "pipeline"
    },
    "Immediate Value": {
      "explanation": "解碼時仍需先看操作碼。附錄 C 的 2RXY 直接把 XY 寫入暫存器，1RXY 讀取位址 XY 的內容。",
      "exam": "分清寫入的是 XY 或 M[XY]。",
      "example": "2A4F 令 RA＝4F。",
      "related": [
        [
          "Addressing Mode",
          "定義取出操作數的方法"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Addressing Mode": {
      "explanation": "立即定址直接使用欄位數值。直接定址把欄位當記憶位址，再讀出該處資料。暫存器定址則從指定暫存器取值。",
      "related": [
        [
          "Operand",
          "模式決定操作數欄位的含義"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Instruction Fetch": {
      "explanation": "簡化模型中一條指令有兩個位元組。取指後 PC 指到下一條，但分支仍可在執行階段改寫 PC。",
      "exam": "取指完成先算循序 PC，再依執行結果判斷。",
      "example": "PC 由 A0 進到 A2，IR 保留從 A0 與 A1 組成的四位十六進位數。",
      "related": [
        [
          "Program Counter",
          "保存取指位址"
        ],
        [
          "Instruction Register",
          "接收這次取出的內容"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Decode": {
      "explanation": "解碼器判斷這是載入、儲存或跳躍等哪類操作，並辨認後面的欄位是資料、位址或暫存器。",
      "related": [
        [
          "Opcode",
          "指出指令操作種類"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Execute": {
      "explanation": "根據指令更新指定狀態。儲存會寫記憶體，條件跳躍在比較成功時會改寫 PC。",
      "related": [
        [
          "Conditional Jump",
          "執行時才決定要不要改 PC"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Conditional Jump": {
      "explanation": "附錄 C 的 BRXY 比較編號 R 的暫存器與 R0。相等則 PC 改成 XY，不相等就接著執行循序下一條。",
      "exam": "分開列出取指後、執行後的 PC。",
      "example": "B140 在 R1 等於 R0 時跳至 40。",
      "related": [
        [
          "Program Counter",
          "跳躍直接改變下一次取指位置"
        ]
      ],
      "concept": "instruction-trace"
    },
    "Load": {
      "explanation": "讀記憶體和載入常數是兩種操作。相同的 XY 欄位，在兩種操作中分別代表位址和資料。",
      "related": [
        [
          "Immediate Value",
          "可直接從指令取值"
        ],
        [
          "Store",
          "資料移動方向不同"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Store": {
      "explanation": "先定位來源暫存器和目的位址，再複製資料。附錄 C 的 3RXY 從 RR 寫到 M[XY]。",
      "related": [
        [
          "Load",
          "讀取資料放入暫存器"
        ]
      ],
      "concept": "machine-cycle"
    },
    "Machine Code": {
      "explanation": "常用十六進位寫法方便閱讀，但仍需知道指令集才能解碼。不同處理器不必對同一組位元做同樣的操作。",
      "related": [
        [
          "Instruction Set",
          "定義機器碼的語意"
        ]
      ]
    },
    "RISC": {
      "explanation": "載入和儲存主要負責記憶體存取，許多運算在暫存器之間完成。真實處理器仍可能含複雜擴充。",
      "related": [
        [
          "CISC",
          "比較指令設計取向"
        ]
      ]
    },
    "CISC": {
      "explanation": "有些指令能結合記憶體存取與運算。總執行時間也取決於用到的指令、硬體和工作負載。",
      "related": [
        [
          "RISC",
          "常用較規則的基本指令"
        ]
      ]
    },
    "Pipeline Stall": {
      "explanation": "若後指令要使用尚未到達的結果，可停一拍或數拍。延遲長度依產生結果的階段與可用硬體決定。",
      "exam": "先算不含停頓的基本週期，再加實際等待拍數。",
      "example": "原本共 8 拍，插入兩個額外氣泡後成 10 拍。",
      "related": [
        [
          "Data Hazard",
          "尚未可用的資料可造成停頓"
        ],
        [
          "Forwarding",
          "某些等待可借結果轉送縮短"
        ]
      ],
      "concept": "pipeline"
    },
    "Forwarding": {
      "explanation": "從管線內的可用位置直接取資料，可避免每次都等待寫回暫存器。若結果尚未產生，仍須等待。",
      "related": [
        [
          "Pipeline Stall",
          "前遞可減少一部分停頓"
        ]
      ],
      "concept": "pipeline"
    },
    "Branch Prediction": {
      "explanation": "猜對可繼續推進。猜錯時放棄錯誤路徑的部分工作，從正確位址重新取指。",
      "related": [
        [
          "Conditional Jump",
          "產生下一個位址的選擇"
        ],
        [
          "Pipeline Stall",
          "重新取指會增加時間"
        ]
      ],
      "concept": "pipeline"
    }
  }
});
