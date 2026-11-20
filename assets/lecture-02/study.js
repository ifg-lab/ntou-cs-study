"use strict";

StudySite.registerCourseStudy("lecture-02", {
  "terms": {
    "Bit": {
      "explanation": "位元是二進位的最小一位，只有 0 和 1 兩種可能。n 個位元可以排列出 2ⁿ 種不同位元串，串的意思由表示法決定。",
      "related": [
        [
          "Binary",
          "用位元組成數字。"
        ],
        [
          "Bit Width",
          "數一個表示用了多少位元。"
        ]
      ]
    },
    "Binary": {
      "explanation": "從右向左，整數位權是 1、2、4、8⋯。把 1 所在位置的權重加起來，就是二進位數的值。",
      "exam": "轉成十進位時加位權，轉回二進位時可反覆除以 2，從最後得到的餘數讀回第一個。",
      "example": "1101₂ = 8 + 4 + 0 + 1 = 13₁₀。",
      "related": [
        [
          "Place Value",
          "數字所在的位置決定權重。"
        ],
        [
          "Binary Fraction",
          "小數點後使用負次方。"
        ]
      ]
    },
    "Place Value": {
      "explanation": "相同的符號放在不同欄位，貢獻不同。例如 10₂ 的左側 1 在 2¹ 欄，因此 10₂ 的值為 2。",
      "related": [
        [
          "Binary",
          "位權是 2 的次方。"
        ]
      ]
    },
    "Unsigned Integer": {
      "explanation": "每個位元都以非負的權重解讀。4 位的 1111 是 8 + 4 + 2 + 1 = 15，因此最大值是 15；0000 是 0。",
      "related": [
        [
          "Two’s Complement",
          "同一串位元也能以有號規則解讀。"
        ]
      ]
    },
    "Remainder": {
      "explanation": "一個整數除以 2，餘 0 表示偶數，餘 1 表示奇數。要將 13 轉為二進位，第一輪的餘 1 就是答案最右邊一位。",
      "related": [
        [
          "Binary",
          "反覆除以 2 並反向讀取餘數即可轉換。"
        ]
      ]
    },
    "Carry": {
      "explanation": "二進位的欄位總和到達 2 時，會將 2 個當前位權合成 1 個更高位權。固定寬度加法會丟掉流出最高位的進位；有號溢位要看真正總和的範圍。",
      "related": [
        [
          "Overflow",
          "有號溢位和最高位進位有不同判準。"
        ]
      ]
    },
    "Binary Fraction": {
      "explanation": "小數點右方從 1/2 開始，每向右一位再除以 2。把寫成 1 的分數相加，就得到這段位元的十進位小數值。",
      "exam": "小數點右側第一位是 2⁻¹，先算整數部分再加小數部分。",
      "example": "101.101₂ = 5 + 1/2 + 0/4 + 1/8 = 5.625。",
      "related": [
        [
          "Place Value",
          "小數部分同樣靠位置決定權重。"
        ]
      ]
    },
    "Two’s Complement": {
      "explanation": "n 位時，最高位的權重為 −2ⁿ⁻¹。對可表示的負整數，可用同寬的絕對值位元串逐位反相再加 1，保留低 n 位。",
      "exam": "先確認寬度，再寫編碼或解碼。n 位可表示 −2ⁿ⁻¹ 至 2ⁿ⁻¹−1。",
      "example": "4 位的 −6：0110 → 1001 → 1010，按位權讀回是 −8 + 2。",
      "related": [
        [
          "Sign Bit",
          "最高位有負權重。"
        ],
        [
          "Overflow",
          "加法結果超出固定寬度的範圍時發生。"
        ]
      ],
      "concept": "twos-complement"
    },
    "Sign Bit": {
      "explanation": "最高位是 1 時，二補數一定是負值，因為其負權重大於其餘位元可提供的正值總和。",
      "related": [
        [
          "Two’s Complement",
          "最高位具有負的位權。"
        ],
        [
          "Overflow",
          "可用加數和結果的符號檢查。"
        ]
      ]
    },
    "Bit Width": {
      "explanation": "位元寬度影響可用位元串個數和取值範圍。例如 4 位二補數只能表示 −8 到 7，6 位則可表示 −32 到 31。",
      "related": [
        [
          "Two’s Complement",
          "位寬決定最高的負位權。"
        ]
      ]
    },
    "Overflow": {
      "explanation": "真正的計算結果超出表示範圍時，保留低位後可能得到不同的數。對二補數加法，兩個加數同號且結果反號時，就發生有號溢位。",
      "exam": "先算正確總和並比對範圍。有號溢位與是否有最高位進位要分開判斷。",
      "example": "4 位的 5 + 4 會留下 1001（−7）；正確值 9 超出 −8 到 7。",
      "related": [
        [
          "Carry",
          "最高位進位不能單獨判斷有號溢位。"
        ],
        [
          "Bit Width",
          "增加寬度能擴大可表示範圍。"
        ]
      ],
      "concept": "signed-overflow"
    },
    "Boolean Operation": {
      "explanation": "AND 檢查條件是否同時成立，OR 檢查至少一項，XOR 檢查兩輸入是否相異，NOT 交換真假。組合運算時從內向外算。",
      "exam": "能列出四組輸入，特別比較兩個輸入都為 1 的情況。",
      "example": "1 OR 1＝1，1 XOR 1＝0。",
      "related": [
        [
          "Logic Gate",
          "電路中的實作"
        ],
        [
          "Parity Bit",
          "可用 XOR 計算奇偶"
        ]
      ],
      "concept": "logic-gates"
    },
    "Logic Gate": {
      "explanation": "閘接收電位所代表的邏輯值並輸出結果。一個閘的輸出可連到另一閘的輸入，形成更大的電路。",
      "related": [
        [
          "Boolean Operation",
          "用真值描述行為"
        ],
        [
          "Flip-Flop",
          "多個閘可共同儲存狀態"
        ]
      ]
    },
    "Flip-Flop": {
      "explanation": "回授可保留狀態。實際觸發行為要看設計；例如 D 正反器在指定時脈邊緣取樣 D，兩次觸發之間讓 Q 維持。",
      "exam": "畫狀態變化先標出時脈邊緣和上一刻 Q。",
      "example": "D 變成 1 但還沒有觸發時，若 Q 原為 0，Q 仍維持 0。",
      "related": [
        [
          "Logic Gate",
          "可連成狀態儲存電路"
        ],
        [
          "Bit",
          "正反器可保存一位"
        ]
      ],
      "concept": "flip-flop"
    },
    "Hexadecimal": {
      "explanation": "一個十六進位數字可編碼一個四位元組，因為 16＝2⁴。把同一串位元由右向左四位分組可快速轉換。",
      "exam": "轉回二進位時，每格固定寫四位，特別留意中間的 0。",
      "example": "0xA2 轉二進位是 1010 0010。",
      "related": [
        [
          "Bit Width",
          "十六進位每個數字對應四位"
        ],
        [
          "Address",
          "常以此格式顯示位址"
        ]
      ]
    },
    "Address": {
      "explanation": "要從記憶體讀資料需先給位址。寫入修改該處資料，不會把位址改成新內容。連續位址的差對應所採的可尋址單位。",
      "exam": "先確認題目問的是那一格的編號還是該格目前的值。",
      "example": "M[0x20]＝0x7F 中，0x20 是位址，0x7F 是內容。",
      "related": [
        [
          "Byte",
          "常見的可尋址單位"
        ],
        [
          "Hexadecimal",
          "常用於顯示位址"
        ]
      ]
    },
    "Byte": {
      "explanation": "位元組是計算檔案和記憶體容量的常用單位。規格中的 b 和 B 常分別代表 bit 和 byte。",
      "related": [
        [
          "Bit",
          "八個位元組成一個位元組"
        ]
      ]
    },
    "RAM": {
      "explanation": "這裡的 memory 指程式執行時暫存資料的主記憶體。DRAM 需週期刷新；常見 DRAM 及 SRAM 都需要供電留住內容。",
      "related": [
        [
          "Address",
          "用位址指明讀寫的位置"
        ]
      ]
    },
    "Flash Memory": {
      "explanation": "斷電後仍保有資料，因此可做為隨身碟或 SSD 的儲存元件。擦除以區塊進行，寫入與磨耗管理由裝置控制。",
      "related": [
        [
          "RAM",
          "用途與斷電保存性不同"
        ]
      ]
    },
    "Encoding": {
      "explanation": "編碼定義符號與可儲存位元串之間的對應。Unicode 碼位與 UTF-8 位元組不是同一欄位。",
      "exam": "比較數字的數值、畫面字元和實際檔案大小。",
      "example": "數值 5 可用 101₂ 表示，文字「5」用 ASCII 位元組 0x35。",
      "related": [
        [
          "Byte",
          "編碼輸出常以位元組為單位"
        ],
        [
          "Sampling",
          "先取得數值再編碼"
        ]
      ]
    },
    "Sampling": {
      "explanation": "取樣率決定隔多久量一次。若原訊號變化太快，稀疏樣本可能看不出原變化；影像上的取樣則可用像素位置理解。",
      "exam": "比對改變取樣率和改變位深影響的對象。",
      "example": "錄音 8 kHz 是每秒 8000 次測量，16 位是每次樣本的表示寬度。",
      "related": [
        [
          "Quantization",
          "對取到的樣本值分級"
        ],
        [
          "Encoding",
          "把分級結果存成位元串"
        ]
      ]
    },
    "Quantization": {
      "explanation": "振幅接近的兩個樣本可能被存成同一等級。增加位深通常提供更細的等級，並增加儲存成本。",
      "related": [
        [
          "Sampling",
          "決定在哪些位置量測"
        ]
      ]
    },
    "Excess Notation": {
      "explanation": "欄位先讀成無號數再扣 bias。與二補數不同，最高位沒有獨立的負位權。",
      "exam": "編碼加偏移，解碼減偏移。指數欄位數相同也可能採不同 Bias，應以題目指定的偏移為準，再檢查結果可否放入欄位。",
      "example": "指數欄 110 讀作無號 6。第 76 頁的數值範例按 Bias=4 得指數 2；2026 年第一次小考指定 Excess-3，按其規則則得指數 3。",
      "related": [
        [
          "Floating Point",
          "指數欄用偏移值"
        ],
        [
          "Two’s Complement",
          "解讀最高位的規則不同"
        ]
      ]
    },
    "Floating Point": {
      "explanation": "有效位數決定精度，指數範圍決定可及的量級。課本八位練習使用 0.xxxx，IEEE 正規單精度使用隱含 1 的 1.F。",
      "exam": "先確認 Bias、尾數是否隱含首位 1，以及截斷或捨入規則。IEEE 單精度中，E 全 0 或全 1 時要依 F 判斷特殊值；自訂格式依題意處理。",
      "example": "0.75＝1.1₂×2⁻¹，IEEE 正規單精度的 E 欄為 126。",
      "related": [
        [
          "Excess Notation",
          "將實際指數轉為儲存指數"
        ],
        [
          "Binary Fraction",
          "有效數字由二進位位權組成"
        ]
      ],
      "concept": "floating-fields"
    },
    "Lossless Compression": {
      "explanation": "藉資料重複性縮短常見輸入，例如把重複值記成次數。若資料缺少這種規律，標記本身可能讓輸出更長。",
      "exam": "問解碼要能還原什麼，以及編碼在哪種輸入下省空間。",
      "example": "AAAAAB 可以表示成 5A1B；ABABAB 用逐游程表示未必更短。",
      "related": [
        [
          "Encoding",
          "需要互相對應的編碼和解碼規則"
        ]
      ],
      "concept": "compression"
    },
    "Huffman Coding": {
      "explanation": "把每個符號當成葉節點，反覆取最小兩個權重，合併後重新放回，再從根到葉標出編碼。不同合併或左右配置可能讓位元串不同。",
      "exam": "若題目只問資料本體總長，可加總各次合併的權重。若題目要完整位元串，要沿自己畫的樹查出碼表，再依原字串順序串接。",
      "example": "頻率 5、3、2、2 時，合併權重依序為 4、7、12，共 23 bits。",
      "related": [
        [
          "Lossless Compression",
          "前綴碼可以還原原訊息"
        ],
        [
          "Encoding",
          "符號依樹上路徑對應位元串"
        ]
      ]
    },
    "Lossy Compression": {
      "explanation": "可把不易察覺的細節用較粗的數值表示。重新解碼可保留可用外觀或聲音，原始樣本可能已無法還原。",
      "related": [
        [
          "Quantization",
          "較粗的分級可用更少資訊表示資料"
        ],
        [
          "Lossless Compression",
          "還原要求不同"
        ]
      ]
    },
    "Parity Bit": {
      "explanation": "用 XOR 可得到原資料的奇偶。加一位後，重算可發現奇數次位元翻轉，但不能指出單一錯誤位置，也可能漏過偶數次翻轉。",
      "exam": "先讀題目要求奇同位或偶同位，再數全部位元的 1。",
      "example": "1011 有三個 1，偶同位需加 1 才變成四個。",
      "related": [
        [
          "Hamming Distance",
          "比較可偵測和更正的界限"
        ]
      ],
      "concept": "parity"
    },
    "Hamming Distance": {
      "explanation": "逐位對照並計算不相同的欄位。合法碼字彼此最少差三位時，一個位元錯誤的接收值在距離 1 內只會靠近一個合法碼字。",
      "exam": "找最近碼字前確認碼字合法集合，以及題目假設的錯誤個數。",
      "example": "0000 與 1110 距離是 3；收到 0100 時距 0000 為 1。",
      "related": [
        [
          "Parity Bit",
          "提供偵錯而無法單靠一位定位錯位"
        ]
      ]
    },
    "RAID": {
      "explanation": "不同類型用條帶、鏡像或同位資料換取不同容量和容錯。透過 XOR 可重建某些缺失區塊，但檔案被誤刪仍可能同步反映到整組陣列。",
      "related": [
        [
          "Parity Bit",
          "陣列可用 XOR 同位資料重建一塊遺失資料"
        ]
      ]
    },
    "Volatile Memory": {
      "explanation": "常見 DRAM、SRAM 都需要供電。前者還需要週期刷新，後者通電時靠電路狀態維持資料。",
      "related": [
        [
          "RAM",
          "多數主記憶體是揮發性的，但兩個詞描述不同性質"
        ]
      ]
    },
    "DRAM": {
      "explanation": "電容電荷會逐漸流失，因此控制器須週期更新記憶胞。密度較高，常用於主記憶體。",
      "exam": "同時交代刷新與斷電的影響。",
      "example": "筆電主記憶體掉電時，尚未儲存的資料可能消失。",
      "related": [
        [
          "SRAM",
          "同樣需供電，通電時的維持方式不同"
        ]
      ]
    },
    "SRAM": {
      "explanation": "通常使用互相回授的電路保持狀態，可用於低延遲快取。斷電仍會遺失。",
      "related": [
        [
          "DRAM",
          "對照是否需要週期刷新"
        ]
      ]
    },
    "ROM": {
      "explanation": "傳統 ROM 內容在製造後固定。EPROM、EEPROM、快閃記憶體則有不同的擦除或寫入方式。",
      "related": [
        [
          "EEPROM",
          "可電氣擦寫的非揮發儲存"
        ]
      ]
    },
    "EEPROM": {
      "explanation": "常用於容量較小、需要偶爾更新的設定。快閃記憶體通常以區塊擦除，適合大量儲存。",
      "related": [
        [
          "ROM",
          "同屬斷電可保留資料的類型"
        ],
        [
          "Flash Memory",
          "比較典型擦除粒度"
        ]
      ]
    },
    "EPROM": {
      "explanation": "典型 EPROM 晶片有能照射紫外線的窗口，擦除後可以重新寫入。EEPROM 可用電氣方式擦除。",
      "related": [
        [
          "EEPROM",
          "擦除方法不同"
        ]
      ]
    },
    "Bias": {
      "explanation": "若偏移量為 3，期望指數 −1 就存 2。解碼時用欄位的無號值減去偏移量。",
      "related": [
        [
          "Excess Notation",
          "使用偏移量表示數值"
        ],
        [
          "Floating Point",
          "指數欄常用偏移量"
        ]
      ],
      "concept": "floating-fields"
    },
    "Exponent": {
      "explanation": "欄位中的位元先轉成無號值，再按規格扣除偏移量。IEEE 指數全零和全一另有特殊規則。",
      "related": [
        [
          "Bias",
          "把欄位值還原為實際指數"
        ],
        [
          "Significand",
          "實際數值由有效數字乘上底數的次方"
        ]
      ],
      "concept": "floating-fields"
    },
    "Significand": {
      "explanation": "課本八位模型從 0.xxxx 讀起。IEEE 單精度正規數採 1.F，前面的 1 省略儲存。",
      "exam": "先寫出題目使用的格式與小數點位置。",
      "example": "0.75＝1.1₂×2⁻¹，在 IEEE 格式的有效數字是 1.1₂。",
      "related": [
        [
          "Exponent",
          "配合移動二進位小數點"
        ]
      ],
      "concept": "floating-fields"
    },
    "Truncation": {
      "explanation": "直接留下可儲存的前幾位，和先向最近可表示值捨入不同。存完後再照同一格式解碼可求截斷誤差。",
      "exam": "依序列出原值、欄位和還原值。",
      "example": "0.10101₂ 保留四個小數位會成 0.1010₂。",
      "related": [
        [
          "Significand",
          "其欄位寬度限制可保留的有效位"
        ]
      ],
      "concept": "floating-fields"
    },
    "Underflow": {
      "explanation": "IEEE 浮點數可用次正規值表示部分更小的量級，再更小時可能捨入為零。判斷時依題目格式及捨入規則。",
      "related": [
        [
          "Floating Point",
          "數值量級受指數欄限制"
        ]
      ]
    },
    "Subnormal Number": {
      "explanation": "單精度的有效數字採 0.F，指數採 −126。它填補零和最小正規數之間的一段範圍。",
      "related": [
        [
          "Underflow",
          "提供比最小正規數更小的表示"
        ]
      ]
    },
    "NaN": {
      "explanation": "在 IEEE 單精度中，指數欄全一且小數欄非零。小數欄全零時表示帶符號的無窮大。",
      "related": [
        [
          "Floating Point",
          "屬於該格式的特殊編碼"
        ]
      ]
    },
    "Run-Length Encoding": {
      "explanation": "當資料含長段重複值時特別有效。若每個值都不同，額外的次數欄可能使資料變大。",
      "related": [
        [
          "Lossless Compression",
          "按次數展開可完全還原"
        ]
      ],
      "concept": "compression"
    },
    "LZW": {
      "explanation": "從已有的單字元表開始，掃描輸入並找最長已知片段。輸出代碼後，把片段加上下個字元加入字典。",
      "exam": "逐次追蹤輸出代碼和新增項目。",
      "example": "初始 A＝0、B＝1，讀到 A 後面接 B 時可加入 AB。",
      "related": [
        [
          "Huffman Coding",
          "比較按片段建立字典和按符號頻率編碼"
        ]
      ]
    }
  }
});
