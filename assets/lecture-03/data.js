"use strict";

(() => {
  const course = {
    "id": "lecture-03",
    "label": "Chapter 2",
    "title": "資料操作",
    "english": "Data manipulation",
    "lead": "看一條指令怎麼穿過 CPU，接著練習端序、遮罩、DMA 和管線。",
    "artTerms": [
      "IR",
      "CPU",
      "PC",
      "ALU",
      "BUS"
    ],
    "source": "Chapter 2 資料操作講義",
    "availableNote": "頁碼依 PDF 順序。每頁可展開原投影片圖。",
    "examSource": "英文模擬題參考手邊可辨讀的 2018、2022、2025 和 2026 年小考、期中與期末題型，按教材範圍改寫。評分規準及解析以繁體中文呈現。",
    "questionLanguage": "en",
    "examMinutes": 45,
    "units": [
      {
        "id": "architecture",
        "start": 1,
        "end": 10,
        "title": "CPU、記憶體與匯流排",
        "description": "從硬體分工到儲存程式"
      },
      {
        "id": "instructions",
        "start": 11,
        "end": 23,
        "title": "指令集與機器碼",
        "description": "操作碼、運算元與附錄 C"
      },
      {
        "id": "cycle",
        "start": 24,
        "end": 29,
        "title": "指令週期",
        "description": "追蹤 PC、IR、取指與跳躍"
      },
      {
        "id": "bit-operations",
        "start": 30,
        "end": 36,
        "title": "位元組順序與邏輯",
        "description": "端序、遮罩與旋轉"
      },
      {
        "id": "input-output",
        "start": 37,
        "end": 55,
        "title": "裝置通訊與抽象",
        "description": "控制器、記憶體映射、DMA 與速率"
      },
      {
        "id": "pipelining",
        "start": 56,
        "end": 63,
        "title": "管線和平行處理",
        "description": "吞吐量、資料相依與分支"
      }
    ],
    "slides": [
      {
        "page": 1,
        "title": "資料操作導讀",
        "paragraphs": [
          "先追蹤指令在 CPU 與記憶體之間的路徑，再練習解讀記憶體中的位元組。"
        ],
        "terms": []
      },
      {
        "page": 2,
        "title": "從硬體到處理工作",
        "paragraphs": [
          "同一個處理器能隨程式完成不同工作。接著辨認哪些步驟由資料路徑完成、哪些由控制單元安排。"
        ],
        "terms": []
      },
      {
        "page": 3,
        "title": "資料操作的三個問題",
        "paragraphs": [
          "先弄懂指令能做什麼，再追蹤一條指令如何執行，最後看 I/O 與管線如何影響吞吐。"
        ],
        "terms": []
      },
      {
        "page": 4,
        "title": "CPU 的主要元件",
        "paragraphs": [
          "控制單元安排動作，ALU 做計算與邏輯，暫存器保存處理中的值。主記憶體容納更大的程式與資料。"
        ],
        "terms": [
          "CPU",
          "ALU",
          "Register"
        ]
      },
      {
        "page": 5,
        "title": "匯流排連接 CPU 和記憶體",
        "paragraphs": [
          "讀取時處理器先指出位址與操作，之後由資料通路帶回內容。位址和資料代表不同訊息。"
        ],
        "terms": [
          "CPU",
          "Bus"
        ]
      },
      {
        "page": 6,
        "title": "主機板與互連",
        "paragraphs": [
          "主機板連接處理器、記憶體與周邊。匯流排或互連的設計決定裝置如何交換資料。"
        ],
        "terms": [
          "Bus"
        ]
      },
      {
        "page": 7,
        "title": "北橋功能的整合",
        "paragraphs": [
          "某些過去由北橋處理的功能可整合到 CPU，例如記憶體控制。判讀架構圖時依連線找到資料路徑。"
        ],
        "terms": []
      },
      {
        "page": 8,
        "title": "I/O 橋接",
        "paragraphs": [
          "橋接器把不同互連或裝置群連起來。各段介面可有不同傳輸規則。"
        ],
        "terms": [
          "Bus"
        ]
      },
      {
        "page": 9,
        "title": "讀架構方塊圖",
        "paragraphs": [
          "先找 CPU 和主記憶體，再沿線追 I/O 控制器。方塊之間的連線比它們在畫面的位置重要。"
        ],
        "terms": [
          "CPU"
        ]
      },
      {
        "page": 10,
        "title": "儲存程式",
        "paragraphs": [
          "指令就是一種位元資料，可與一般資料一同保存在主記憶體。CPU 從 PC 指定的位址取指令。"
        ],
        "terms": [
          "CPU",
          "Program Counter"
        ]
      },
      {
        "page": 11,
        "title": "機器指令與指令集",
        "paragraphs": [
          "處理器能辨識的位元模式有明確語義。一整組指令與編碼規則構成指令集。"
        ],
        "terms": [
          "Instruction Set",
          "Machine Code"
        ]
      },
      {
        "page": 12,
        "title": "RISC 與 CISC 的設計取向",
        "paragraphs": [
          "課堂把較簡單的指令形式與較複雜的形式對照。比較實際速度時還須看實作與工作。"
        ],
        "terms": [
          "Instruction Set",
          "RISC",
          "CISC"
        ]
      },
      {
        "page": 13,
        "title": "指令集的取捨",
        "paragraphs": [
          "一條複雜指令可能做更多事，簡單指令常較易規則化解碼。指令數和完成時間不能直接畫等號。"
        ],
        "terms": [
          "Instruction Set",
          "RISC",
          "CISC"
        ]
      },
      {
        "page": 14,
        "title": "三類機器指令",
        "paragraphs": [
          "資料傳送複製值，算術邏輯改變或比較值，控制指令改變執行路徑。"
        ],
        "terms": [
          "ALU",
          "Instruction Set",
          "Load",
          "Store"
        ]
      },
      {
        "page": 15,
        "title": "8086 的暫存器",
        "paragraphs": [
          "暫存器名字可表示用途或視圖。閱讀此例時先找通用暫存器和特殊用途的暫存器。"
        ],
        "terms": [
          "Register"
        ]
      },
      {
        "page": 16,
        "title": "64 位元處理器的暫存器視圖",
        "paragraphs": [
          "同一暫存器可透過不同名稱存取低位部分。個別指令怎麼處理未寫入的部分要看架構規則。"
        ],
        "terms": [
          "Register"
        ]
      },
      {
        "page": 17,
        "title": "用載入、相加、寫回完成計算",
        "paragraphs": [
          "從記憶體取兩個值到暫存器，在 ALU 相加，再把結果寫回指定位置。"
        ],
        "terms": [
          "ALU",
          "Register",
          "Load",
          "Store"
        ]
      },
      {
        "page": 18,
        "title": "除法如何分解",
        "paragraphs": [
          "要分清被除數、除數與結果位置；實際 ISA 可能規定使用特定暫存器。"
        ],
        "terms": [
          "ALU"
        ]
      },
      {
        "page": 19,
        "title": "附錄 C 的簡化機器",
        "paragraphs": [
          "用四個十六進位數字表示一條指令，記憶胞為一個位元組。固定長度讓這套機器每次要取兩格。"
        ],
        "terms": [
          "Register",
          "Instruction Set",
          "Machine Code"
        ]
      },
      {
        "page": 20,
        "title": "操作碼和操作數",
        "paragraphs": [
          "操作碼先決定要做的工作，後面的數字才知道要當暫存器索引、位址或常數。"
        ],
        "terms": [
          "Opcode",
          "Operand",
          "Immediate Value",
          "Addressing Mode",
          "Decode"
        ]
      },
      {
        "page": 21,
        "title": "依操作碼看指令欄位",
        "paragraphs": [
          "附錄 C 的第一個十六進位數字是操作碼，剩下三格的切法隨操作碼改變。"
        ],
        "terms": [
          "Opcode",
          "Operand",
          "Immediate Value",
          "Addressing Mode",
          "Load"
        ]
      },
      {
        "page": 22,
        "title": "解碼 35A7",
        "paragraphs": [
          "3 是 STORE，5 是來源暫存器，A7 是目的記憶位址。把 R5 的內容複製到 M[A7]。",
          "35A7 的第一個十六進位數字 3 決定這是儲存，後面 5 表示 R5，A7 是一個記憶位址。假設 R5＝0x2A，執行後 M[A7]＝0x2A。"
        ],
        "terms": [
          "Register",
          "Opcode",
          "Operand",
          "Immediate Value",
          "Addressing Mode",
          "Store"
        ],
        "exam": "依操作碼決定欄位含義。至少交代哪個值從哪裡讀出，又寫到哪裡。"
      },
      {
        "page": 23,
        "title": "把一段程序編成指令",
        "paragraphs": [
          "把每一步轉成對應的操作碼與欄位，再照執行起點把指令寫入記憶體。"
        ],
        "terms": [
          "Opcode",
          "Machine Code"
        ]
      },
      {
        "page": 24,
        "title": "PC 和 IR",
        "paragraphs": [
          "PC 保存下一條要取的指令位址；IR 保存目前正在解碼或執行的指令。兩者可同時含有不同數值。"
        ],
        "terms": [
          "CPU",
          "Program Counter",
          "Instruction Register",
          "Machine Cycle",
          "Instruction Fetch",
          "Decode",
          "Execute"
        ]
      },
      {
        "page": 25,
        "title": "解碼 B258：條件跳躍",
        "paragraphs": [
          "B 表示比較 R2 與 R0。如果相等，將 0x58 寫入 PC；否則沿用循序的下一個位置。",
          "B258 若起始於 A0，取指後 PC 先變 A2。若 R2＝R0 執行時改成 58，否則 PC 保持 A2；兩種情況在這條指令執行完時 IR 都是 B258。"
        ],
        "terms": [
          "Opcode",
          "Operand",
          "Program Counter",
          "Execute",
          "Conditional Jump"
        ],
        "exam": "用表格分開記每階段的 PC 與 IR。跳躍成立才覆寫循序 PC。"
      },
      {
        "page": 26,
        "title": "程式如何放進記憶體",
        "paragraphs": [
          "在此簡化機器，一條四位十六進位指令跨相鄰兩格。讀程式圖要看指令從哪個位址開始。"
        ],
        "terms": [
          "Program Counter"
        ]
      },
      {
        "page": 27,
        "title": "取出位址 A0 的指令",
        "paragraphs": [
          "先依 PC 讀 M[A0] 與 M[A1]，依序為 15 與 6C，合成 156C 送進 IR。"
        ],
        "terms": [
          "Program Counter",
          "Instruction Register",
          "Machine Cycle",
          "Instruction Fetch"
        ]
      },
      {
        "page": 28,
        "title": "取指後更新 PC",
        "paragraphs": [
          "本例每條指令兩位元組，所以取完 156C 後 PC 為 A2。解碼執行時，IR 仍保留 156C。",
          "練習追蹤 2105、B126、2109、314F、C000。它們從十六進位 20 開始，每條兩個位元組。取 2105 後 PC＝22、IR＝2105，執行才使 R1＝05。取 B126 後 PC 先到 24。若 R0＝05，執行後 PC 變成 26，因此 M[4F] 最後是 05。若 R0＝06，會執行 24 的 2109，最後寫入 09。"
        ],
        "terms": [
          "Program Counter",
          "Instruction Register",
          "Machine Cycle",
          "Instruction Fetch",
          "Decode",
          "Execute",
          "Conditional Jump",
          "Load"
        ],
        "exam": "逐行分開記取指後與執行後的 PC；儲存只改題目指定的記憶位置。"
      },
      {
        "page": 29,
        "title": "不同架構的取指長度",
        "paragraphs": [
          "固定長度案例可直接加固定值；可變長度的 ISA 需要辨認指令邊界，下一條位置取決於這條指令用了幾個位元組。"
        ],
        "terms": [
          "Instruction Set",
          "Program Counter"
        ]
      },
      {
        "page": 30,
        "title": "位元組順序",
        "paragraphs": [
          "兩個以上位元組共同表示一個數時，要說明第一個位址放最高還是最低有效位元組。"
        ],
        "terms": [
          "Endianness"
        ]
      },
      {
        "page": 31,
        "title": "小端序",
        "paragraphs": [
          "小端序把最低有效位元組放最低位址。寫 0x12345678 從低位址讀到高位址是 78 56 34 12。",
          "位址 0x40 到 0x43 若依序存 5A、00、93、0C，從 0x42 讀 16 位只能取後兩格。小端是 0x0C93，大端是 0x930C。"
        ],
        "terms": [
          "Endianness"
        ],
        "exam": "先依讀取位址和字寬挑 byte，最後依端序排列。每個 byte 內的兩個十六進位數字不換位。"
      },
      {
        "page": 32,
        "title": "小端序記憶圖",
        "paragraphs": [
          "先在每格標出遞增位址，再依位元組順序填入。位元組 0x78 內部仍是原本的位元排列。"
        ],
        "terms": [
          "Endianness"
        ]
      },
      {
        "page": 33,
        "title": "大端序",
        "paragraphs": [
          "大端序把最高有效位元組放最低位址。同一值 0x12345678 依遞增位址是 12 34 56 78。"
        ],
        "terms": [
          "Endianness"
        ]
      },
      {
        "page": 34,
        "title": "比較兩種端序",
        "paragraphs": [
          "端序不改變整個數的值，改變的是各位元組所在位址。從原始記憶體恢復數值前要知道約定。"
        ],
        "terms": [
          "Endianness"
        ]
      },
      {
        "page": 35,
        "title": "用邏輯遮罩操作位元",
        "paragraphs": [
          "AND 搭配 0 可清掉目標位，OR 搭配 1 可設為 1，XOR 搭配 1 會翻轉目標位。"
        ],
        "terms": [
          "ALU",
          "Bit Mask"
        ]
      },
      {
        "page": 36,
        "title": "旋轉與移位",
        "paragraphs": [
          "0x65 左旋一位成 0xCA，掉出的最高位回到最低位。多轉幾位便可看出跟補 0 移位的差異。"
        ],
        "terms": [
          "Bit Mask"
        ]
      },
      {
        "page": 37,
        "title": "控制器替 CPU 處理裝置介面",
        "paragraphs": [
          "控制器管理特定裝置的命令與資料。CPU 可使用同一類介面讀狀態、送命令或取得資料。"
        ],
        "terms": [
          "Memory-Mapped I/O"
        ]
      },
      {
        "page": 38,
        "title": "控制器連上匯流排",
        "paragraphs": [
          "畫出 CPU、記憶體、控制器與裝置之間的連線，找出控制命令和資料是否走同一段路。"
        ],
        "terms": [
          "Bus",
          "Memory-Mapped I/O",
          "DMA"
        ]
      },
      {
        "page": 39,
        "title": "記憶體映射 I/O",
        "paragraphs": [
          "把某些位址範圍對到裝置暫存器，CPU 可以用讀寫指令操作。目的地由位址映射決定。"
        ],
        "terms": [
          "Memory-Mapped I/O"
        ]
      },
      {
        "page": 40,
        "title": "裝置暫存器的副作用",
        "paragraphs": [
          "讀某些裝置位址可能清掉事件，寫入可能啟動裝置。使用方式須符合裝置的介面規格。"
        ],
        "terms": [
          "Memory-Mapped I/O"
        ]
      },
      {
        "page": 41,
        "title": "記憶體分頁切換的例子",
        "paragraphs": [
          "同一段 CPU 位址可切換到不同實體儲存區。辨認目前啟用哪一個區組才能解讀內容。"
        ],
        "terms": [
          "Memory-Mapped I/O"
        ]
      },
      {
        "page": 42,
        "title": "DMA 的資料路徑",
        "paragraphs": [
          "CPU 先設定來源、目的與大小，由 DMA 相關硬體搬大量資料。完成後可用中斷通知 CPU。",
          "CPU 寫裝置暫存器可用 MMIO，控制器把資料搬到 RAM 可用 DMA，最後可透過中斷通知。相同的 I/O 作業可同時使用這三個機制。"
        ],
        "terms": [
          "Bus",
          "DMA"
        ],
        "exam": "分開說出誰發命令、誰搬資料，以及誰收到完成通知。"
      },
      {
        "page": 43,
        "title": "平行與序列傳輸",
        "paragraphs": [
          "平行使用多條訊號路徑同時傳位元；序列沿路徑依次傳送。實際速度還受每路速率、編碼與同步成本影響。"
        ],
        "terms": []
      },
      {
        "page": 44,
        "title": "USB 和 Thunderbolt",
        "paragraphs": [
          "介面名稱、接頭形狀和實際支援速率是不同資訊。查看線材和兩端裝置共同支援的模式。"
        ],
        "terms": []
      },
      {
        "page": 45,
        "title": "介面速度的比較方法",
        "paragraphs": [
          "把數值換成相同單位，區分標示速率和有效資料量。鏈路也可能受較慢的其中一端限制。"
        ],
        "terms": []
      },
      {
        "page": 46,
        "title": "時序與串擾",
        "paragraphs": [
          "多條高速訊號到達時間可能不一致，相鄰走線也可能互相影響。加線不必然成比例提高速率。"
        ],
        "terms": []
      },
      {
        "page": 47,
        "title": "InfiniBand 的資料互連",
        "paragraphs": [
          "它是常見於高效能系統的互連例子。評估用途時同時看頻寬、延遲和通訊開銷。"
        ],
        "terms": []
      },
      {
        "page": 48,
        "title": "讀互連的歷史速率圖",
        "paragraphs": [
          "不同世代可有多種鏈路設定。讀圖時先對齊單向或雙向、每通道或聚合速率。"
        ],
        "terms": []
      },
      {
        "page": 49,
        "title": "SAS 的儲存互連",
        "paragraphs": [
          "Serial Attached SCSI 是序列儲存通訊技術示例，應區分介面能力與實際磁碟能提供的速度。"
        ],
        "terms": []
      },
      {
        "page": 50,
        "title": "外接儲存的接頭",
        "paragraphs": [
          "同一類儲存協定可以有內接與外接形式。接頭樣子只是一層，仍要確認協定和硬體相容。"
        ],
        "terms": []
      },
      {
        "page": 51,
        "title": "串接與擴展裝置",
        "paragraphs": [
          "多個儲存裝置可共用上游路徑，頻寬要按實際拓樸分配。"
        ],
        "terms": []
      },
      {
        "page": 52,
        "title": "位元速率與位元組速率",
        "paragraphs": [
          "1 byte＝8 bits，800 Mbit/s 在忽略其他開銷時等於 100 MB/s。題目要先辨認 b 或 B。",
          "750 MB 的資料穿過 10、3、8 Gbit/s 三段串流路徑。穩定傳送時受最慢的 3 Gbit/s 限制，資料等於 6 Gbit，所以理想需要 2 秒。"
        ],
        "terms": [],
        "exam": "先寫 bottleneck，再將檔案大小和速率對齊到 bit 或 byte，最後計時間。"
      },
      {
        "page": 53,
        "title": "比較不同年代的通訊速度",
        "paragraphs": [
          "可用同樣大小的檔案估算傳輸時間，並把協定、設備與標稱峰值的差異寫清楚。"
        ],
        "terms": []
      },
      {
        "page": 54,
        "title": "標準提供互通規則",
        "paragraphs": [
          "不同裝置實作同一個協定才有機會互通。介面規格也會定義訊號和資料格式。"
        ],
        "terms": []
      },
      {
        "page": 55,
        "title": "程式語言隱藏機器細節",
        "paragraphs": [
          "同一段進階語言可由不同工具轉換給不同 ISA 執行。何時藏起細節、何時必須了解細節，是抽象的取捨。"
        ],
        "terms": [
          "Instruction Set"
        ]
      },
      {
        "page": 56,
        "title": "從訓練圖理解階段重疊",
        "paragraphs": [
          "不同工作可同時處在不同階段。先找每個工作要走過的階段，再看共享設備是否會撞在一起。"
        ],
        "terms": [
          "Pipeline"
        ]
      },
      {
        "page": 57,
        "title": "管線與吞吐量",
        "paragraphs": [
          "同一時刻各級可處理不同指令。單條指令仍須走過所需階段，整體完成頻率可以變高。"
        ],
        "terms": [
          "Machine Cycle",
          "Pipeline"
        ]
      },
      {
        "page": 58,
        "title": "多單元平行處理",
        "paragraphs": [
          "把可獨立完成的部分派給不同單元，遇到相依關係或共享資源就需協調。"
        ],
        "terms": [
          "Pipeline"
        ]
      },
      {
        "page": 59,
        "title": "理想管線時間",
        "paragraphs": [
          "若有 k 級且每級一拍，連續 n 條指令理想需 k+n−1 拍。開頭填滿與末尾排空也要算。"
        ],
        "terms": [
          "Pipeline",
          "Pipeline Stall"
        ]
      },
      {
        "page": 60,
        "title": "資料冒險",
        "paragraphs": [
          "較晚的指令需要較早指令尚未準備好的結果。硬體可等待或依實作改用前遞的值。",
          "五級管線處理六條指令，無停頓需 10 拍。若相依等兩拍，另因猜錯分支再損失一拍，題設總共 13 拍。"
        ],
        "terms": [
          "Pipeline",
          "Data Hazard",
          "Pipeline Stall",
          "Forwarding"
        ],
        "exam": "列序列、理想重疊和額外停頓的時間，也要確認題目是否設定可前遞。"
      },
      {
        "page": 61,
        "title": "停頓與管線泡泡",
        "paragraphs": [
          "插入空拍可保持資料的正確性，完成時間也會增加。從時間圖找出等待在哪兩條指令間。"
        ],
        "terms": [
          "Pipeline",
          "Data Hazard",
          "Pipeline Stall",
          "Forwarding"
        ]
      },
      {
        "page": 62,
        "title": "分支預測",
        "paragraphs": [
          "先猜分支方向以便持續取指。猜錯要丟棄錯路徑中的部分工作，改從正確位置開始。"
        ],
        "terms": [
          "Pipeline",
          "Branch Prediction"
        ]
      },
      {
        "page": 63,
        "title": "超純量處理器",
        "paragraphs": [
          "透過多條執行通路，一拍可推進多條合適的指令。相依性和可用單元限制實際並行量。"
        ],
        "terms": [
          "Pipeline",
          "Data Hazard"
        ]
      }
    ],
    "concepts": {
      "instruction-trace": "追蹤載入、分支與儲存的完整程式",
      "architecture": "CPU 元件、匯流排與程式儲存",
      "machine-instruction": "機器指令和指令格式",
      "machine-cycle": "PC、IR 與指令週期",
      "endianness": "大端序和小端序",
      "bit-mask": "位元遮罩及旋轉",
      "io": "記憶體映射與 DMA",
      "transfer-rate": "序列、平行與傳輸量",
      "pipeline": "管線、相依和停頓"
    },
    "practice": [
      {
        "id": "practice-1",
        "unit": "architecture",
        "page": 4,
        "concept": "architecture",
        "level": "觀念",
        "prompt": "Which CPU component performs arithmetic and bitwise operations?",
        "options": [
          {
            "label": "The network controller",
            "correct": false,
            "explanation": "ALU 負責算術和邏輯。"
          },
          {
            "label": "The ALU",
            "correct": true,
            "explanation": "ALU 負責算術和邏輯。"
          },
          {
            "label": "The program counter",
            "correct": false,
            "explanation": "ALU 負責算術和邏輯。"
          },
          {
            "label": "Main memory",
            "correct": false,
            "explanation": "ALU 負責算術和邏輯。"
          }
        ]
      },
      {
        "id": "practice-2",
        "unit": "architecture",
        "page": 5,
        "concept": "architecture",
        "level": "判讀",
        "prompt": "What does the CPU first send when it wants to read M[A7]?",
        "options": [
          {
            "label": "Address A7 and a read request",
            "correct": true,
            "explanation": "回來的才是資料，請求先指出要哪格。"
          },
          {
            "label": "The value that memory will return",
            "correct": false,
            "explanation": "回來的才是資料，請求先指出要哪格。"
          },
          {
            "label": "A character to display on screen",
            "correct": false,
            "explanation": "回來的才是資料，請求先指出要哪格。"
          },
          {
            "label": "The device's external file name",
            "correct": false,
            "explanation": "回來的才是資料，請求先指出要哪格。"
          }
        ]
      },
      {
        "id": "practice-3",
        "unit": "architecture",
        "page": 10,
        "concept": "architecture",
        "level": "觀念",
        "prompt": "Where can a stored-program computer keep machine instructions?",
        "options": [
          {
            "label": "Only in permanently configured wiring",
            "correct": false,
            "explanation": "CPU 按指定位置讀取記憶體內的指令。"
          },
          {
            "label": "Only in the ALU",
            "correct": false,
            "explanation": "CPU 按指定位置讀取記憶體內的指令。"
          },
          {
            "label": "Only in the display",
            "correct": false,
            "explanation": "CPU 按指定位置讀取記憶體內的指令。"
          },
          {
            "label": "In main memory, encoded as bits",
            "correct": true,
            "explanation": "CPU 按指定位置讀取記憶體內的指令。"
          }
        ]
      },
      {
        "id": "practice-4",
        "unit": "instructions",
        "page": 13,
        "concept": "machine-instruction",
        "level": "判讀",
        "prompt": "What information helps predict which of two CPUs runs a given program faster?",
        "options": [
          {
            "label": "The instruction set name alone",
            "correct": false,
            "explanation": "只看 RISC 或 CISC 不能得知每條指令耗時及所需指令數。"
          },
          {
            "label": "The length of the instruction mnemonics",
            "correct": false,
            "explanation": "只看 RISC 或 CISC 不能得知每條指令耗時及所需指令數。"
          },
          {
            "label": "The instruction set, hardware implementation, and workload",
            "correct": true,
            "explanation": "只看 RISC 或 CISC 不能得知每條指令耗時及所需指令數。"
          },
          {
            "label": "The number of ways to comment assembly code",
            "correct": false,
            "explanation": "只看 RISC 或 CISC 不能得知每條指令耗時及所需指令數。"
          }
        ]
      },
      {
        "id": "practice-5",
        "unit": "instructions",
        "page": 14,
        "concept": "machine-instruction",
        "level": "判讀",
        "prompt": "Which class of instruction copies a register value into a memory cell?",
        "options": [
          {
            "label": "Control transfer",
            "correct": false,
            "explanation": "STORE 複製值到指定位置。"
          },
          {
            "label": "Data transfer",
            "correct": true,
            "explanation": "STORE 複製值到指定位置。"
          },
          {
            "label": "Arithmetic division",
            "correct": false,
            "explanation": "STORE 複製值到指定位置。"
          },
          {
            "label": "Bit rotation",
            "correct": false,
            "explanation": "STORE 複製值到指定位置。"
          }
        ]
      },
      {
        "id": "practice-6",
        "unit": "instructions",
        "page": 20,
        "concept": "machine-instruction",
        "level": "觀念",
        "prompt": "Which part of an instruction identifies the operation to perform?",
        "options": [
          {
            "label": "The opcode",
            "correct": true,
            "explanation": "其他欄位依操作碼才知道怎麼讀。"
          },
          {
            "label": "An arbitrary memory address",
            "correct": false,
            "explanation": "其他欄位依操作碼才知道怎麼讀。"
          },
          {
            "label": "The transfer rate",
            "correct": false,
            "explanation": "其他欄位依操作碼才知道怎麼讀。"
          },
          {
            "label": "The device buffer size",
            "correct": false,
            "explanation": "其他欄位依操作碼才知道怎麼讀。"
          }
        ]
      },
      {
        "id": "practice-7",
        "unit": "instructions",
        "page": 22,
        "concept": "machine-instruction",
        "level": "判讀",
        "prompt": "What does Appendix C instruction 35A7 do?",
        "options": [
          {
            "label": "Load the immediate value A7 into R5.",
            "correct": false,
            "explanation": "3 表示儲存，5 是來源暫存器，A7 是目的位址。"
          },
          {
            "label": "Load M[A7] into R5.",
            "correct": false,
            "explanation": "3 表示儲存，5 是來源暫存器，A7 是目的位址。"
          },
          {
            "label": "Set PC to the contents of R5.",
            "correct": false,
            "explanation": "3 表示儲存，5 是來源暫存器，A7 是目的位址。"
          },
          {
            "label": "Copy the contents of R5 into M[A7].",
            "correct": true,
            "explanation": "3 表示儲存，5 是來源暫存器，A7 是目的位址。"
          }
        ]
      },
      {
        "id": "practice-8",
        "unit": "cycle",
        "page": 24,
        "concept": "machine-cycle",
        "level": "觀念",
        "prompt": "Which register holds the instruction the processor is about to decode?",
        "options": [
          {
            "label": "PC",
            "correct": false,
            "explanation": "IR 保存取出的指令位元，PC 紀錄位置。"
          },
          {
            "label": "The address field in memory",
            "correct": false,
            "explanation": "IR 保存取出的指令位元，PC 紀錄位置。"
          },
          {
            "label": "IR",
            "correct": true,
            "explanation": "IR 保存取出的指令位元，PC 紀錄位置。"
          },
          {
            "label": "The controller's device number",
            "correct": false,
            "explanation": "IR 保存取出的指令位元，PC 紀錄位置。"
          }
        ]
      },
      {
        "id": "practice-9",
        "unit": "cycle",
        "page": 25,
        "concept": "machine-cycle",
        "level": "判讀",
        "prompt": "In the Appendix C machine, what is PC after executing B258 if R2 equals R0?",
        "options": [
          {
            "label": "0xB2",
            "correct": false,
            "explanation": "比較成立，就採用指令的目標位址。"
          },
          {
            "label": "0x58",
            "correct": true,
            "explanation": "比較成立，就採用指令的目標位址。"
          },
          {
            "label": "0x02",
            "correct": false,
            "explanation": "比較成立，就採用指令的目標位址。"
          },
          {
            "label": "0x25",
            "correct": false,
            "explanation": "比較成立，就採用指令的目標位址。"
          }
        ]
      },
      {
        "id": "practice-10",
        "unit": "cycle",
        "page": 25,
        "concept": "machine-cycle",
        "level": "應用",
        "prompt": "PC initially points to B258 at A0, and R2 differs from R0. What is PC after this two-byte instruction executes?",
        "options": [
          {
            "label": "0xA2",
            "correct": true,
            "explanation": "此指令兩位元組，條件不成立就保留循序下一條。"
          },
          {
            "label": "0x58",
            "correct": false,
            "explanation": "此指令兩位元組，條件不成立就保留循序下一條。"
          },
          {
            "label": "0xA1",
            "correct": false,
            "explanation": "此指令兩位元組，條件不成立就保留循序下一條。"
          },
          {
            "label": "0xB2",
            "correct": false,
            "explanation": "此指令兩位元組，條件不成立就保留循序下一條。"
          }
        ]
      },
      {
        "id": "practice-11",
        "unit": "cycle",
        "page": 28,
        "concept": "machine-cycle",
        "level": "計算",
        "prompt": "PC starts at A0 with M[A0] = 15 and M[A1] = 6C. What is the state after fetching the two-byte instruction?",
        "options": [
          {
            "label": "IR = A0, PC = 156C",
            "correct": false,
            "explanation": "IR 組合兩個位元組，PC 跨過兩格。"
          },
          {
            "label": "IR = 156C, PC = A1",
            "correct": false,
            "explanation": "IR 組合兩個位元組，PC 跨過兩格。"
          },
          {
            "label": "IR = 6C15, PC = A2",
            "correct": false,
            "explanation": "IR 組合兩個位元組，PC 跨過兩格。"
          },
          {
            "label": "IR = 156C, PC = A2",
            "correct": true,
            "explanation": "IR 組合兩個位元組，PC 跨過兩格。"
          }
        ]
      },
      {
        "id": "practice-12",
        "unit": "bit-operations",
        "page": 31,
        "concept": "endianness",
        "level": "計算",
        "prompt": "What bytes represent 0x1234 in little-endian memory, from lower to higher address?",
        "options": [
          {
            "label": "12, 34",
            "correct": false,
            "explanation": "最低有效位元組 34 在低位址。"
          },
          {
            "label": "43, 21",
            "correct": false,
            "explanation": "最低有效位元組 34 在低位址。"
          },
          {
            "label": "34, 12",
            "correct": true,
            "explanation": "最低有效位元組 34 在低位址。"
          },
          {
            "label": "21, 43",
            "correct": false,
            "explanation": "最低有效位元組 34 在低位址。"
          }
        ]
      },
      {
        "id": "practice-13",
        "unit": "bit-operations",
        "page": 33,
        "concept": "endianness",
        "level": "應用",
        "prompt": "Memory holds A1, B2, C3, D4 in increasing address order. What 32-bit value do these bytes represent in big-endian order?",
        "options": [
          {
            "label": "0xD4C3B2A1",
            "correct": false,
            "explanation": "最高有效位元組最先出現。"
          },
          {
            "label": "0xA1B2C3D4",
            "correct": true,
            "explanation": "最高有效位元組最先出現。"
          },
          {
            "label": "0x1A2B3C4D",
            "correct": false,
            "explanation": "最高有效位元組最先出現。"
          },
          {
            "label": "0x4D3C2B1A",
            "correct": false,
            "explanation": "最高有效位元組最先出現。"
          }
        ]
      },
      {
        "id": "practice-14",
        "unit": "bit-operations",
        "page": 35,
        "concept": "bit-mask",
        "level": "計算",
        "prompt": "Which operation clears the second bit from the right of 1111 while preserving all other bits?",
        "options": [
          {
            "label": "AND 1101",
            "correct": true,
            "explanation": "AND 目標位配 0，其餘配 1。"
          },
          {
            "label": "OR 1101",
            "correct": false,
            "explanation": "AND 目標位配 0，其餘配 1。"
          },
          {
            "label": "AND 0010",
            "correct": false,
            "explanation": "AND 目標位配 0，其餘配 1。"
          },
          {
            "label": "XOR 1101",
            "correct": false,
            "explanation": "AND 目標位配 0，其餘配 1。"
          }
        ]
      },
      {
        "id": "practice-15",
        "unit": "bit-operations",
        "page": 35,
        "concept": "bit-mask",
        "level": "計算",
        "prompt": "What is 0110 XOR 0011?",
        "options": [
          {
            "label": "0111",
            "correct": false,
            "explanation": "右兩欄翻轉，左兩欄不變。"
          },
          {
            "label": "0010",
            "correct": false,
            "explanation": "右兩欄翻轉，左兩欄不變。"
          },
          {
            "label": "1001",
            "correct": false,
            "explanation": "右兩欄翻轉，左兩欄不變。"
          },
          {
            "label": "0101",
            "correct": true,
            "explanation": "右兩欄翻轉，左兩欄不變。"
          }
        ]
      },
      {
        "id": "practice-16",
        "unit": "bit-operations",
        "page": 36,
        "concept": "bit-mask",
        "level": "計算",
        "prompt": "What is the result when the eight-bit value 10000001 is rotated left by one position?",
        "options": [
          {
            "label": "00000010",
            "correct": false,
            "explanation": "最高位移回最右，其餘位左移。"
          },
          {
            "label": "11000000",
            "correct": false,
            "explanation": "最高位移回最右，其餘位左移。"
          },
          {
            "label": "00000011",
            "correct": true,
            "explanation": "最高位移回最右，其餘位左移。"
          },
          {
            "label": "00000001",
            "correct": false,
            "explanation": "最高位移回最右，其餘位左移。"
          }
        ]
      },
      {
        "id": "practice-17",
        "unit": "input-output",
        "page": 39,
        "concept": "io",
        "level": "觀念",
        "prompt": "What can happen when the CPU writes to a memory-mapped device control register?",
        "options": [
          {
            "label": "Ordinary RAM is always the only thing changed.",
            "correct": false,
            "explanation": "位址映射到裝置暫存器，如何處理寫入由裝置定義。"
          },
          {
            "label": "A device-specific operation begins.",
            "correct": true,
            "explanation": "位址映射到裝置暫存器，如何處理寫入由裝置定義。"
          },
          {
            "label": "PC always changes to a branch target.",
            "correct": false,
            "explanation": "位址映射到裝置暫存器，如何處理寫入由裝置定義。"
          },
          {
            "label": "All interrupts are immediately disabled.",
            "correct": false,
            "explanation": "位址映射到裝置暫存器，如何處理寫入由裝置定義。"
          }
        ]
      },
      {
        "id": "practice-18",
        "unit": "input-output",
        "page": 42,
        "concept": "io",
        "level": "判讀",
        "prompt": "In a typical DMA transfer, what moves the data block into main memory?",
        "options": [
          {
            "label": "DMA hardware or a DMA-capable device controller",
            "correct": true,
            "explanation": "CPU 設好傳輸參數，搬運由相關硬體負責。"
          },
          {
            "label": "The CPU executing LOAD and STORE for every byte",
            "correct": false,
            "explanation": "CPU 設好傳輸參數，搬運由相關硬體負責。"
          },
          {
            "label": "The program counter itself",
            "correct": false,
            "explanation": "CPU 設好傳輸參數，搬運由相關硬體負責。"
          },
          {
            "label": "A peripheral that rewrites the CPU's instruction set",
            "correct": false,
            "explanation": "CPU 設好傳輸參數，搬運由相關硬體負責。"
          }
        ]
      },
      {
        "id": "practice-19",
        "unit": "input-output",
        "page": 52,
        "concept": "transfer-rate",
        "level": "計算",
        "prompt": "Ignoring overhead, how many MB/s is 400 Mbit/s?",
        "options": [
          {
            "label": "400",
            "correct": false,
            "explanation": "從 bit/s 換成 byte/s 除以 8。"
          },
          {
            "label": "3,200",
            "correct": false,
            "explanation": "從 bit/s 換成 byte/s 除以 8。"
          },
          {
            "label": "25",
            "correct": false,
            "explanation": "從 bit/s 換成 byte/s 除以 8。"
          },
          {
            "label": "50",
            "correct": true,
            "explanation": "從 bit/s 換成 byte/s 除以 8。"
          }
        ]
      },
      {
        "id": "practice-20",
        "unit": "pipelining",
        "page": 59,
        "concept": "pipeline",
        "level": "計算",
        "prompt": "How many cycles do four instructions take in an ideal five-stage pipeline with one cycle per stage?",
        "options": [
          {
            "label": "4",
            "correct": false,
            "explanation": "第一條花 5 拍，後三條各延後一拍完成，共 8。"
          },
          {
            "label": "9",
            "correct": false,
            "explanation": "第一條花 5 拍，後三條各延後一拍完成，共 8。"
          },
          {
            "label": "8",
            "correct": true,
            "explanation": "第一條花 5 拍，後三條各延後一拍完成，共 8。"
          },
          {
            "label": "20",
            "correct": false,
            "explanation": "第一條花 5 拍，後三條各延後一拍完成，共 8。"
          }
        ]
      },
      {
        "id": "practice-21",
        "unit": "pipelining",
        "page": 60,
        "concept": "pipeline",
        "level": "判讀",
        "prompt": "Instruction 1 writes R1. Instruction 2 needs the new R1 before it is ready. What is this situation called?",
        "options": [
          {
            "label": "Big-endian byte ordering",
            "correct": false,
            "explanation": "後方指令依賴前方尚未就緒的結果。"
          },
          {
            "label": "A data hazard",
            "correct": true,
            "explanation": "後方指令依賴前方尚未就緒的結果。"
          },
          {
            "label": "Direct memory access",
            "correct": false,
            "explanation": "後方指令依賴前方尚未就緒的結果。"
          },
          {
            "label": "A difference in instruction length",
            "correct": false,
            "explanation": "後方指令依賴前方尚未就緒的結果。"
          }
        ]
      },
      {
        "id": "practice-22",
        "unit": "pipelining",
        "page": 62,
        "concept": "pipeline",
        "level": "應用",
        "prompt": "What does a CPU typically do after discovering a wrong branch prediction?",
        "options": [
          {
            "label": "Discard work from the wrong path and resume on the correct path.",
            "correct": true,
            "explanation": "錯路徑的指令不能影響提交的程式結果。"
          },
          {
            "label": "Erase all main memory.",
            "correct": false,
            "explanation": "錯路徑的指令不能影響提交的程式結果。"
          },
          {
            "label": "Disable the whole program permanently.",
            "correct": false,
            "explanation": "錯路徑的指令不能影響提交的程式結果。"
          },
          {
            "label": "Switch the CPU's byte order.",
            "correct": false,
            "explanation": "錯路徑的指令不能影響提交的程式結果。"
          }
        ]
      },
      {
        "id": "practice-23",
        "unit": "instructions",
        "page": 23,
        "concept": "machine-instruction",
        "level": "分析",
        "prompt": "Appendix C uses 2RXY for immediate load, 5RST for integer addition, and 3RXY for store. After 2117, 2219, 5312, 33C0 execute, what is M[C0]? All operands are hexadecimal.",
        "options": [
          {
            "label": "0x23",
            "correct": false,
            "explanation": "正確判斷是「0x30」。R1＝0x17、R2＝0x19，R3 相加得 0x30，再以 33C0 寫入。"
          },
          {
            "label": "0xCE",
            "correct": false,
            "explanation": "正確判斷是「0x30」。R1＝0x17、R2＝0x19，R3 相加得 0x30，再以 33C0 寫入。"
          },
          {
            "label": "0x00",
            "correct": false,
            "explanation": "正確判斷是「0x30」。R1＝0x17、R2＝0x19，R3 相加得 0x30，再以 33C0 寫入。"
          },
          {
            "label": "0x30",
            "correct": true,
            "explanation": "R1＝0x17、R2＝0x19，R3 相加得 0x30，再以 33C0 寫入。"
          }
        ]
      },
      {
        "id": "practice-24",
        "unit": "cycle",
        "page": 25,
        "concept": "machine-cycle",
        "level": "計算",
        "prompt": "A two-byte B238 at address 0x20 branches to 0x38 when R2 equals R0. Initially R2 = R0 = 0x9A. What are IR and PC after execution?",
        "options": [
          {
            "label": "IR = B238, PC = 22",
            "correct": false,
            "explanation": "正確判斷是「IR = B238, PC = 38」。取指先使 PC 成 22，再因條件相符改寫成 38；IR 仍是 B238。"
          },
          {
            "label": "IR = 0038, PC = 38",
            "correct": false,
            "explanation": "正確判斷是「IR = B238, PC = 38」。取指先使 PC 成 22，再因條件相符改寫成 38；IR 仍是 B238。"
          },
          {
            "label": "IR = B238, PC = 38",
            "correct": true,
            "explanation": "取指先使 PC 成 22，再因條件相符改寫成 38；IR 仍是 B238。"
          },
          {
            "label": "IR = 229A, PC = 20",
            "correct": false,
            "explanation": "正確判斷是「IR = B238, PC = 38」。取指先使 PC 成 22，再因條件相符改寫成 38；IR 仍是 B238。"
          }
        ]
      },
      {
        "id": "practice-25",
        "unit": "cycle",
        "page": 28,
        "concept": "machine-cycle",
        "level": "分析",
        "prompt": "The instruction 35A7 starts at address 0x7F. R5 holds 0x10. Which state is correct after this two-byte STORE?",
        "options": [
          {
            "label": "PC = 0x80; M[0xA7] = 0x10",
            "correct": false,
            "explanation": "正確判斷是「PC = 0x81; M[0xA7] = 0x10」。PC 前進兩位元組；操作碼 3 把 R5 的內容寫到 A7。"
          },
          {
            "label": "PC = 0x81; M[0xA7] = 0x10",
            "correct": true,
            "explanation": "PC 前進兩位元組；操作碼 3 把 R5 的內容寫到 A7。"
          },
          {
            "label": "PC = 0x81; R5 = 0xA7",
            "correct": false,
            "explanation": "正確判斷是「PC = 0x81; M[0xA7] = 0x10」。PC 前進兩位元組；操作碼 3 把 R5 的內容寫到 A7。"
          },
          {
            "label": "PC = 0xA7; M[0x7F] = 0x10",
            "correct": false,
            "explanation": "正確判斷是「PC = 0x81; M[0xA7] = 0x10」。PC 前進兩位元組；操作碼 3 把 R5 的內容寫到 A7。"
          }
        ]
      },
      {
        "id": "practice-26",
        "unit": "bit-operations",
        "page": 34,
        "concept": "endianness",
        "level": "分析",
        "prompt": "Bytes from 0x40 onward are 5A, 00, 93, 0C. Reading a little-endian 16-bit word at 0x42 yields which value?",
        "options": [
          {
            "label": "0x0C93",
            "correct": true,
            "explanation": "從 0x42 讀 93、0C，低位址是最低有效位元組。"
          },
          {
            "label": "0x930C",
            "correct": false,
            "explanation": "正確判斷是「0x0C93」。從 0x42 讀 93、0C，低位址是最低有效位元組。"
          },
          {
            "label": "0x005A",
            "correct": false,
            "explanation": "正確判斷是「0x0C93」。從 0x42 讀 93、0C，低位址是最低有效位元組。"
          },
          {
            "label": "0x5A00",
            "correct": false,
            "explanation": "正確判斷是「0x0C93」。從 0x42 讀 93、0C，低位址是最低有效位元組。"
          }
        ]
      },
      {
        "id": "practice-27",
        "unit": "bit-operations",
        "page": 35,
        "concept": "bit-mask",
        "level": "計算",
        "prompt": "An eight-bit status value is 0xA6. First clear bit 5 (bit 0 is the least significant), then flip bit 0. What result remains?",
        "options": [
          {
            "label": "0xA7",
            "correct": false,
            "explanation": "正確判斷是「0x87」。清第 5 位後 A6→86，再 XOR 01 得 87。"
          },
          {
            "label": "0x85",
            "correct": false,
            "explanation": "正確判斷是「0x87」。清第 5 位後 A6→86，再 XOR 01 得 87。"
          },
          {
            "label": "0xC7",
            "correct": false,
            "explanation": "正確判斷是「0x87」。清第 5 位後 A6→86，再 XOR 01 得 87。"
          },
          {
            "label": "0x87",
            "correct": true,
            "explanation": "清第 5 位後 A6→86，再 XOR 01 得 87。"
          }
        ]
      },
      {
        "id": "practice-28",
        "unit": "input-output",
        "page": 42,
        "concept": "io",
        "level": "分析",
        "prompt": "A CPU writes a device command register at a special address. The controller then fills a RAM buffer and raises an interrupt. Which mapping is correct?",
        "options": [
          {
            "label": "Both actions are CPU-driven DMA writes.",
            "correct": false,
            "explanation": "正確判斷是「The command write uses memory-mapped I/O; the controller's data transfer is DMA.」。位址映射使 CPU 可控制裝置；資料搬運另由控制器經 DMA 完成。"
          },
          {
            "label": "The command write is DMA and the RAM transfer is memory-mapped I/O.",
            "correct": false,
            "explanation": "正確判斷是「The command write uses memory-mapped I/O; the controller's data transfer is DMA.」。位址映射使 CPU 可控制裝置；資料搬運另由控制器經 DMA 完成。"
          },
          {
            "label": "The command write uses memory-mapped I/O; the controller's data transfer is DMA.",
            "correct": true,
            "explanation": "位址映射使 CPU 可控制裝置；資料搬運另由控制器經 DMA 完成。"
          },
          {
            "label": "An interrupt sends each byte to RAM.",
            "correct": false,
            "explanation": "正確判斷是「The command write uses memory-mapped I/O; the controller's data transfer is DMA.」。位址映射使 CPU 可控制裝置；資料搬運另由控制器經 DMA 完成。"
          }
        ]
      },
      {
        "id": "practice-29",
        "unit": "input-output",
        "page": 46,
        "concept": "transfer-rate",
        "level": "分析",
        "prompt": "Why can a high-speed serial link carry more useful data than a particular older parallel link?",
        "options": [
          {
            "label": "One serial bit is always larger than one parallel bit.",
            "correct": false,
            "explanation": "正確判斷是「Higher signaling rates can outweigh the smaller lane count; timing skew and crosstalk constrain parallel links.」。比較應看每條線速率、並行路數及同步成本。"
          },
          {
            "label": "Higher signaling rates can outweigh the smaller lane count; timing skew and crosstalk constrain parallel links.",
            "correct": true,
            "explanation": "比較應看每條線速率、並行路數及同步成本。"
          },
          {
            "label": "Parallel links transfer only one bit per transmission.",
            "correct": false,
            "explanation": "正確判斷是「Higher signaling rates can outweigh the smaller lane count; timing skew and crosstalk constrain parallel links.」。比較應看每條線速率、並行路數及同步成本。"
          },
          {
            "label": "Serial links cannot suffer signal integrity problems.",
            "correct": false,
            "explanation": "正確判斷是「Higher signaling rates can outweigh the smaller lane count; timing skew and crosstalk constrain parallel links.」。比較應看每條線速率、並行路數及同步成本。"
          }
        ]
      },
      {
        "id": "practice-30",
        "unit": "input-output",
        "page": 52,
        "concept": "transfer-rate",
        "level": "計算",
        "prompt": "A 750 MB file crosses links rated 10 Gbit/s, 3 Gbit/s, and 8 Gbit/s. Ignoring overhead and using decimal units, what is the best end-to-end time?",
        "options": [
          {
            "label": "2 seconds",
            "correct": true,
            "explanation": "最慢一段 3 Gbit/s；750 MB＝6 Gbit，因此 6/3＝2 秒。"
          },
          {
            "label": "0.6 seconds",
            "correct": false,
            "explanation": "正確判斷是「2 seconds」。最慢一段 3 Gbit/s；750 MB＝6 Gbit，因此 6/3＝2 秒。"
          },
          {
            "label": "0.25 seconds",
            "correct": false,
            "explanation": "正確判斷是「2 seconds」。最慢一段 3 Gbit/s；750 MB＝6 Gbit，因此 6/3＝2 秒。"
          },
          {
            "label": "16 seconds",
            "correct": false,
            "explanation": "正確判斷是「2 seconds」。最慢一段 3 Gbit/s；750 MB＝6 Gbit，因此 6/3＝2 秒。"
          }
        ]
      },
      {
        "id": "practice-31",
        "unit": "pipelining",
        "page": 59,
        "concept": "pipeline",
        "level": "計算",
        "prompt": "Twelve instructions each use four one-cycle stages. What are the serial and ideal pipelined cycle counts?",
        "options": [
          {
            "label": "48 and 12",
            "correct": false,
            "explanation": "正確判斷是「48 and 15」。序列 12×4，理想管線 4＋12−1。"
          },
          {
            "label": "16 and 15",
            "correct": false,
            "explanation": "正確判斷是「48 and 15」。序列 12×4，理想管線 4＋12−1。"
          },
          {
            "label": "48 and 16",
            "correct": false,
            "explanation": "正確判斷是「48 and 15」。序列 12×4，理想管線 4＋12−1。"
          },
          {
            "label": "48 and 15",
            "correct": true,
            "explanation": "序列 12×4，理想管線 4＋12−1。"
          }
        ]
      },
      {
        "id": "practice-32",
        "unit": "pipelining",
        "page": 60,
        "concept": "pipeline",
        "level": "分析",
        "prompt": "An ideal five-stage pipeline takes 12 cycles for eight instructions. Two bubbles are inserted for a data dependency and one for a branch. How many cycles are needed now?",
        "options": [
          {
            "label": "12",
            "correct": false,
            "explanation": "正確判斷是「15」。停頓共有三拍，12＋3＝15。"
          },
          {
            "label": "13",
            "correct": false,
            "explanation": "正確判斷是「15」。停頓共有三拍，12＋3＝15。"
          },
          {
            "label": "15",
            "correct": true,
            "explanation": "停頓共有三拍，12＋3＝15。"
          },
          {
            "label": "24",
            "correct": false,
            "explanation": "正確判斷是「15」。停頓共有三拍，12＋3＝15。"
          }
        ]
      },
      {
        "id": "practice-33",
        "unit": "pipelining",
        "page": 63,
        "concept": "pipeline",
        "level": "判讀",
        "prompt": "Two instructions can issue in the same cycle on a dual-issue CPU. Which pair has a direct read-after-write dependency? Assume no forwarding within that cycle.",
        "options": [
          {
            "label": "I1 reads R4; I2 also reads R4.",
            "correct": false,
            "explanation": "正確判斷是「I1 writes R4; I2 reads R4.」。第二條不能同拍取得第一條尚未產生的新值。"
          },
          {
            "label": "I1 writes R4; I2 reads R4.",
            "correct": true,
            "explanation": "第二條不能同拍取得第一條尚未產生的新值。"
          },
          {
            "label": "I1 writes R4; I2 writes R5.",
            "correct": false,
            "explanation": "正確判斷是「I1 writes R4; I2 reads R4.」。第二條不能同拍取得第一條尚未產生的新值。"
          },
          {
            "label": "I1 reads R3; I2 reads R6.",
            "correct": false,
            "explanation": "正確判斷是「I1 writes R4; I2 reads R4.」。第二條不能同拍取得第一條尚未產生的新值。"
          }
        ]
      },
      {
        "id": "practice-34",
        "unit": "cycle",
        "page": 25,
        "concept": "instruction-trace",
        "level": "流程",
        "prompt": "PC is 22 hex before fetching B126. What is PC immediately after fetch, before the comparison executes?",
        "options": [
          {
            "label": "24 hex",
            "correct": true,
            "explanation": "取指長度是兩個位元組，先把 PC 加 2。執行比較後才可能跳到 26。"
          },
          {
            "label": "26 hex",
            "correct": false,
            "explanation": "正確判斷是「24 hex」。取指長度是兩個位元組，先把 PC 加 2。執行比較後才可能跳到 26。"
          },
          {
            "label": "22 hex",
            "correct": false,
            "explanation": "正確判斷是「24 hex」。取指長度是兩個位元組，先把 PC 加 2。執行比較後才可能跳到 26。"
          },
          {
            "label": "B126 hex",
            "correct": false,
            "explanation": "正確判斷是「24 hex」。取指長度是兩個位元組，先把 PC 加 2。執行比較後才可能跳到 26。"
          }
        ]
      },
      {
        "id": "practice-35",
        "unit": "cycle",
        "page": 25,
        "concept": "instruction-trace",
        "level": "流程",
        "prompt": "A program starts with 2105, B126, 2109, 314F at addresses 20, 22, 24, 26 hex. R0 is 06. What reaches memory 4F?",
        "options": [
          {
            "label": "05",
            "correct": false,
            "explanation": "正確判斷是「09」。比較不相等，PC 保留循序位置 24。2109 改寫 R1，314F 將 09 寫入。"
          },
          {
            "label": "06",
            "correct": false,
            "explanation": "正確判斷是「09」。比較不相等，PC 保留循序位置 24。2109 改寫 R1，314F 將 09 寫入。"
          },
          {
            "label": "4F",
            "correct": false,
            "explanation": "正確判斷是「09」。比較不相等，PC 保留循序位置 24。2109 改寫 R1，314F 將 09 寫入。"
          },
          {
            "label": "09",
            "correct": true,
            "explanation": "比較不相等，PC 保留循序位置 24。2109 改寫 R1，314F 將 09 寫入。"
          }
        ]
      },
      {
        "id": "practice-36",
        "unit": "cycle",
        "page": 25,
        "concept": "instruction-trace",
        "level": "判讀",
        "prompt": "For 2105, B126, 2109 and 314F at 20, 22, 24 and 26 hex, R0 is 05. Which instruction is skipped?",
        "options": [
          {
            "label": "2105",
            "correct": false,
            "explanation": "正確判斷是「2109」。2105 寫入 R1＝05，比較相等使 PC 跳到 26，跳過 24 的 2109。"
          },
          {
            "label": "B126",
            "correct": false,
            "explanation": "正確判斷是「2109」。2105 寫入 R1＝05，比較相等使 PC 跳到 26，跳過 24 的 2109。"
          },
          {
            "label": "2109",
            "correct": true,
            "explanation": "2105 寫入 R1＝05，比較相等使 PC 跳到 26，跳過 24 的 2109。"
          },
          {
            "label": "314F",
            "correct": false,
            "explanation": "正確判斷是「2109」。2105 寫入 R1＝05，比較相等使 PC 跳到 26，跳過 24 的 2109。"
          }
        ]
      }
    ],
    "exam": [
      {
        "title": "Connect architecture to the instruction set",
        "setup": "A processor loads data, adds two operands, and then branches when a condition is true.",
        "pages": [
          4,
          10,
          12,
          14
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Name the three instruction categories and map each to an operation here. Compare one common RISC design choice with one CISC design choice and explain why either could be faster for a specific workload.",
            "model": "載入屬資料傳送，加法屬算術邏輯，條件跳躍屬控制。典型 RISC 選較規則的編碼，CISC 可有較複雜操作或可變長度指令；執行時間受指令數、硬體及程式行為影響。",
            "trap": "不能只用指令種類的多寡判斷效能。",
            "criteria": [
              [
                5,
                "辨認資料傳送、算術邏輯、控制三類並各配一個題中動作"
              ],
              [
                5,
                "比較一項具體 ISA 取向"
              ],
              [
                5,
                "說明相同工作何以可能有不同完成時間"
              ]
            ]
          }
        ]
      },
      {
        "title": "Execute a short Appendix C program",
        "setup": "PC starts at 0x20. Each instruction is two bytes. The words from 0x20 are 211B, 2207, 5312, 33A0, C000. Opcodes 2, 5, 3, and C are immediate load, integer add, store, and halt. Fetch advances PC before execution.",
        "pages": [
          19,
          22,
          24,
          28
        ],
        "parts": [
          {
            "points": 20,
            "prompt": "Give the final byte at address 0xA0 in binary. Identify the final R1, R2, R3, PC and IR in hexadecimal.",
            "fields": [
              {
                "id": "answer",
                "label": "M[0xA0] in binary",
                "format": "bits",
                "answer": "00100010",
                "points": 5
              }
            ],
            "model": "R1＝1B，R2＝07，R3＝22。33A0 將 22 寫至 A0。取到 C000 後 PC 已前進到 2A，IR＝C000。",
            "trap": "最後的 PC 是依定義取指後的值，IR 保存 HALT 指令。",
            "criteria": [
              [
                8,
                "解碼載入、加法與寫回的來源及目的地"
              ],
              [
                7,
                "逐條按兩位元組更新 PC，寫出 HALT 時的 PC 與 IR"
              ]
            ]
          }
        ]
      },
      {
        "title": "Follow a conditional branch",
        "setup": "At address 0x40 there is B26E. It branches to 0x6E if R2 equals R0. The machine advances the PC by two on fetch. R0 = 0xA1 and R2 = 0x01.",
        "pages": [
          25,
          28
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Give the final PC as an unsigned decimal integer. Then explain what would change if R2 were 0xA1.",
            "fields": [
              {
                "id": "answer",
                "label": "Final PC in decimal",
                "format": "integer",
                "answer": 66,
                "points": 5
              }
            ],
            "model": "條件為假，保留循序 0x42＝66。若 R2＝R0，執行時將 PC 改成 0x6E；IR 在兩種情況都保持 B26E。",
            "trap": "不可只看操作碼 B 就直接套用跳躍位址。",
            "criteria": [
              [
                3,
                "指出取指後循序地址和比較結果"
              ],
              [
                2,
                "說明條件成立的 PC 及 IR 和 PC 的不同"
              ]
            ]
          }
        ]
      },
      {
        "title": "Read bytes and apply a mask",
        "setup": "Memory holds 12, 80, 00, FF in increasing addresses starting at 0x50. Treat the bytes as a 32-bit word.",
        "pages": [
          30,
          31,
          33,
          35
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Write the big-endian and little-endian hexadecimal values. In the little-endian value, clear bits 0–7 while preserving the other bits. Give the 32-bit hex result and the mask.",
            "model": "大端 0x128000FF，小端 0xFF008012。以 AND 0xFFFFFF00 清除低八位，得 0xFF008000。",
            "trap": "端序重排的是 bytes。算遮罩時針對數值的位權。",
            "criteria": [
              [
                5,
                "正確排列兩個端序的四位元組"
              ],
              [
                5,
                "指出低八位是哪個位元組"
              ],
              [
                5,
                "寫出 AND 遮罩與結果"
              ]
            ]
          }
        ]
      },
      {
        "title": "Move a block through an I/O path",
        "setup": "A CPU writes a command register with an MMIO store. The controller moves 900 MB of data across 6 and 4 Gbit/s links in a steady stream, ignoring overhead and using decimal units.",
        "pages": [
          39,
          42,
          52
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter the ideal transfer time in milliseconds. Explain which action is MMIO, which is DMA, and how software may learn the transfer has finished.",
            "fields": [
              {
                "id": "answer",
                "label": "Ideal time in milliseconds",
                "format": "integer",
                "answer": 1800,
                "points": 5
              }
            ],
            "model": "慢段 4 Gbit/s，900 MB＝7.2 Gbit，需 1.8 秒＝1800 ms。CPU 的寫入屬 MMIO，控制器搬 RAM 屬 DMA，完成可用中斷通知。",
            "trap": "一個傳輸可以同時使用 MMIO 做控制、DMA 做搬運。",
            "criteria": [
              [
                5,
                "看出瓶頸並列出 bit 與 byte 的換算"
              ],
              [
                5,
                "依序說明 MMIO、DMA、完成通知"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain serial and parallel links",
        "setup": "Link P has eight parallel wires at 200 Mbit/s per wire. Link S has two serial lanes at 1 Gbit/s per lane. Ignore protocol overhead and assume all lanes are used.",
        "pages": [
          43,
          46,
          52
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Give each link's aggregate rate. Explain one physical reason why the older parallel design may not scale by simply increasing its clock.",
            "model": "P＝1.6 Gbit/s，S＝2 Gbit/s。高速多線的訊號到達時間可能不同，鄰線串擾也會增加，接收端較難把時序對齊。",
            "trap": "一條序列通道和多條 lanes 可同時存在於同一個介面。",
            "criteria": [
              [
                4,
                "算出 P 的總速率並寫單位"
              ],
              [
                3,
                "算出 S 的總速率並寫單位"
              ],
              [
                3,
                "具體解釋 skew 或 crosstalk 的影響"
              ]
            ]
          }
        ]
      },
      {
        "title": "Measure pipeline throughput",
        "setup": "Six instructions each pass through five one-cycle stages. The pipelined run incurs two additional cycles for a dependency and one for a wrong branch prediction.",
        "pages": [
          57,
          59,
          60,
          62
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter the actual pipelined cycle count. Give the serial and ideal pipeline counts and explain what causes the two kinds of penalty.",
            "fields": [
              {
                "id": "answer",
                "label": "Actual pipelined cycles",
                "format": "integer",
                "answer": 13,
                "points": 5
              }
            ],
            "model": "序列 6×5＝30；理想管線 5＋6−1＝10；加入三拍得 13。資料未就緒要等，分支猜錯要丟棄錯路徑工作並重新取指。",
            "trap": "填滿與排空都算在總週期內。",
            "criteria": [
              [
                5,
                "列出序列與理想管線的算式"
              ],
              [
                5,
                "解釋資料相依與分支猜錯兩種代價"
              ]
            ]
          }
        ]
      },
      {
        "title": "Estimate ideal dual issue",
        "setup": "Ten mutually independent instructions go through a five-stage pipeline. The stages take one cycle each. Up to two instructions can enter every cycle and each stage can hold two.",
        "bonus": true,
        "pages": [
          56,
          59,
          63
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Enter the minimum cycle count. Explain why it is smaller than single issue and why a real dependency can change it.",
            "fields": [
              {
                "id": "answer",
                "label": "Minimum cycle count",
                "format": "integer",
                "answer": 9,
                "points": 5
              }
            ],
            "model": "每拍進兩條，共 5 批，理想完成時間為 5＋5−1＝9。單發射需 5＋10−1＝14。後方指令若缺結果，該批可能不能同拍進入。",
            "trap": "雙發射不會讓一條指令省略自己的管線級。",
            "criteria": [
              [
                3,
                "說明為何十條可分五批並計入管線填滿"
              ],
              [
                2,
                "和單發射比較並說出依賴可能造成的限制"
              ]
            ]
          }
        ]
      }
    ],
    "legacyExam": [
      {
        "title": "跟著 PC 取指",
        "pages": [
          27
        ],
        "setup": "使用附錄 C 的兩位元組指令，PC＝0xA0，接連兩格為 15 和 6C。",
        "parts": [
          {
            "points": 5,
            "prompt": "填 PC 的十進位值，說明 IR 內容及 PC 為何這樣變動。",
            "model": "IR＝0x156C，PC＝0xA0＋2＝0xA2＝162。",
            "trap": "PC 是位址，IR 是內容。",
            "fields": [
              {
                "id": "answer",
                "label": "取指後 PC（十進位）",
                "format": "integer",
                "answer": 162,
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "指出 IR 是 156C，並說明每條指令在本例佔兩個位元組。"
              ]
            ]
          }
        ]
      },
      {
        "title": "估算管線時間",
        "pages": [
          59
        ],
        "setup": "五級管線、每一級一拍，連續六條指令。",
        "parts": [
          {
            "points": 5,
            "prompt": "填寫無停頓時會花幾拍，並說明若讀到前一條尚未完成的值可能需要怎麼處理。",
            "model": "5＋6−1＝10 拍。遇資料相依時可由前遞提供新值，或暫停直到資料就緒。",
            "trap": "不能只把級數乘上指令數。",
            "fields": [
              {
                "id": "answer",
                "label": "理想總週期",
                "format": "integer",
                "answer": 10,
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "列出公式並解釋讀到尚未就緒的結果需要前遞或停頓。"
              ]
            ]
          }
        ]
      }
    ],
    "terms": [
      [
        "CPU",
        {
          "english": "CPU",
          "chinese": "中央處理器",
          "explanation": "讀取並執行機器指令的硬體。"
        }
      ],
      [
        "ALU",
        {
          "english": "ALU",
          "chinese": "算術邏輯單元",
          "explanation": "執行算術及布林運算的硬體單元。"
        }
      ],
      [
        "Register",
        {
          "english": "Register",
          "chinese": "暫存器",
          "explanation": "處理器內供指令快速讀寫的小型儲存。"
        }
      ],
      [
        "Bus",
        {
          "english": "Bus",
          "chinese": "匯流排",
          "explanation": "元件交換位址、資料與控制訊號的通路。"
        }
      ],
      [
        "Instruction Set",
        {
          "english": "Instruction Set",
          "chinese": "指令集",
          "explanation": "處理器可執行的機器指令與其編碼規則。"
        }
      ],
      [
        "Opcode",
        {
          "english": "Opcode",
          "chinese": "操作碼",
          "explanation": "告訴處理器要執行什麼動作的欄位。"
        }
      ],
      [
        "Operand",
        {
          "english": "Operand",
          "chinese": "運算元",
          "explanation": "在指令中指定資料位置、目的地或常數的欄位。"
        }
      ],
      [
        "Program Counter",
        {
          "english": "Program Counter",
          "chinese": "程式計數器（PC）",
          "explanation": "保存接下來要取的指令位址。"
        }
      ],
      [
        "Instruction Register",
        {
          "english": "Instruction Register",
          "chinese": "指令暫存器（IR）",
          "explanation": "保存正在解碼或執行的機器指令。"
        }
      ],
      [
        "Machine Cycle",
        {
          "english": "Machine Cycle",
          "chinese": "指令週期",
          "explanation": "取指、解碼、執行等處理階段。"
        }
      ],
      [
        "Endianness",
        {
          "english": "Endianness",
          "chinese": "位元組順序",
          "explanation": "多位元組資料在遞增位址中的約定。"
        }
      ],
      [
        "Bit Mask",
        {
          "english": "Bit Mask",
          "chinese": "位元遮罩",
          "explanation": "選定要在邏輯運算中讀取或修改的位元位置。"
        }
      ],
      [
        "Memory-Mapped I/O",
        {
          "english": "Memory-Mapped I/O",
          "chinese": "記憶體映射 I/O",
          "explanation": "將部分處理器位址映射到裝置暫存器。"
        }
      ],
      [
        "DMA",
        {
          "english": "DMA",
          "chinese": "直接記憶體存取",
          "explanation": "讓控制器或相關硬體在 CPU 逐項搬資料之外存取主記憶體。"
        }
      ],
      [
        "Pipeline",
        {
          "english": "Pipeline",
          "chinese": "管線",
          "explanation": "多條指令在不同處理階段重疊推進。"
        }
      ],
      [
        "Data Hazard",
        {
          "english": "Data Hazard",
          "chinese": "資料冒險",
          "explanation": "下一條指令需要尚未準備好的前條結果。"
        }
      ],
      [
        "Immediate Value",
        {
          "english": "Immediate Value",
          "chinese": "立即值",
          "explanation": "直接放在指令欄位中的數值。"
        }
      ],
      [
        "Addressing Mode",
        {
          "english": "Addressing Mode",
          "chinese": "定址模式",
          "explanation": "指令取得操作數的規則。"
        }
      ],
      [
        "Instruction Fetch",
        {
          "english": "Instruction Fetch",
          "chinese": "取指",
          "explanation": "從 PC 指定位置讀取指令並送入 IR。"
        }
      ],
      [
        "Decode",
        {
          "english": "Decode",
          "chinese": "解碼",
          "explanation": "判斷操作碼與各操作數的含義。"
        }
      ],
      [
        "Execute",
        {
          "english": "Execute",
          "chinese": "執行",
          "explanation": "按解碼結果完成計算、存取或跳躍。"
        }
      ],
      [
        "Conditional Jump",
        {
          "english": "Conditional Jump",
          "chinese": "條件跳躍",
          "explanation": "條件成立時把目的位址寫入 PC。"
        }
      ],
      [
        "Load",
        {
          "english": "Load",
          "chinese": "載入",
          "explanation": "把記憶體內容或立即值寫入暫存器。"
        }
      ],
      [
        "Store",
        {
          "english": "Store",
          "chinese": "儲存",
          "explanation": "把暫存器的內容寫入記憶體。"
        }
      ],
      [
        "Machine Code",
        {
          "english": "Machine Code",
          "chinese": "機器碼",
          "explanation": "處理器能直接解讀的指令位元。"
        }
      ],
      [
        "RISC",
        {
          "english": "RISC",
          "chinese": "精簡指令集設計",
          "explanation": "常採規則指令格式與載入／儲存架構。"
        }
      ],
      [
        "CISC",
        {
          "english": "CISC",
          "chinese": "複雜指令集設計",
          "explanation": "可能提供較複雜的操作或可變長度指令。"
        }
      ],
      [
        "Pipeline Stall",
        {
          "english": "Pipeline Stall",
          "chinese": "管線停頓",
          "explanation": "等候資料或資源時，暫停部分管線進度。"
        }
      ],
      [
        "Forwarding",
        {
          "english": "Forwarding",
          "chinese": "資料前遞",
          "explanation": "把剛產生的值直接送往下一條需要的指令。"
        }
      ],
      [
        "Branch Prediction",
        {
          "english": "Branch Prediction",
          "chinese": "分支預測",
          "explanation": "先猜下一個取指位置以維持管線運作。"
        }
      ]
    ],
    "figurePages": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63
    ]
  };
  course.terms = new Map(course.terms);
  course.figurePages = new Set(course.figurePages);
  StudySite.registerCourse(course);
})();
