"use strict";

(() => {
  const course = {
    "id": "lecture-02",
    "label": "Chapter 1",
    "title": "資料儲存",
    "english": "Data storage",
    "lead": "從一位元到影像、二補數和浮點數，再看看怎麼把資料壓小或找出錯誤。",
    "artTerms": [
      "01",
      "BIT",
      "2ⁿ",
      "ADD",
      "−1"
    ],
    "source": "Chapter 1 資料儲存講義",
    "availableNote": "頁碼依 PDF 順序。每頁可展開原投影片圖。",
    "examSource": "英文模擬題參考手邊可辨讀的 2018、2022、2025 和 2026 年小考、期中與期末題型，按教材範圍改寫。評分規準及解析以繁體中文呈現。",
    "questionLanguage": "en",
    "examMinutes": 45,
    "units": [
      {
        "id": "bits",
        "start": 1,
        "end": 27,
        "title": "位元、邏輯與記憶電路",
        "description": "從布林運算到正反器和十六進位"
      },
      {
        "id": "storage",
        "start": 28,
        "end": 43,
        "title": "記憶體與儲存媒體",
        "description": "位址、容量、磁碟和快閃記憶體"
      },
      {
        "id": "representation",
        "start": 44,
        "end": 56,
        "title": "文字、圖像與聲音",
        "description": "編碼、取樣、量化與容量估算"
      },
      {
        "id": "binary-integers",
        "start": 57,
        "end": 67,
        "title": "二進位與二補數",
        "description": "位權、進位、有號整數與溢位"
      },
      {
        "id": "floating-point",
        "start": 68,
        "end": 83,
        "title": "偏移表示與浮點數",
        "description": "二進位小數、欄位和 IEEE 754"
      },
      {
        "id": "python",
        "start": 84,
        "end": 91,
        "title": "Python 表示與運算",
        "description": "變數、算式和錯誤排查"
      },
      {
        "id": "reliability",
        "start": 92,
        "end": 101,
        "title": "壓縮與錯誤保護",
        "description": "RLE、LZW、同位和 RAID"
      }
    ],
    "slides": [
      {
        "page": 1,
        "title": "資料儲存導讀",
        "paragraphs": [
          "從 0 與 1 開始，追蹤同一組位元如何表示數字、文字、圖像和聲音。"
        ],
        "terms": []
      },
      {
        "page": 2,
        "title": "從音樂檔估算容量",
        "paragraphs": [
          "若每分鐘約 1 MB，長度乘上每分鐘容量就得到估計。比較容量前先對齊單位，壓縮率也會改變結果。"
        ],
        "terms": []
      },
      {
        "page": 3,
        "title": "資料表示與儲存硬體",
        "paragraphs": [
          "前段從電路到記憶體，中段練習解讀位元，最後看壓縮與錯誤保護。"
        ],
        "terms": []
      },
      {
        "page": 4,
        "title": "位元與位元串",
        "paragraphs": [
          "一位有兩個狀態，n 位共有 2ⁿ 種排列。要讀出意思，需要知道編碼規則。"
        ],
        "terms": [
          "Bit",
          "Encoding"
        ]
      },
      {
        "page": 5,
        "title": "布林運算",
        "paragraphs": [
          "布林值只有真與假，可用 1 和 0 表示。運算把輸入轉為一個布林值。"
        ],
        "terms": [
          "Boolean Operation"
        ]
      },
      {
        "page": 6,
        "title": "AND、OR 與 XOR",
        "paragraphs": [
          "AND 要兩個輸入都是 1。OR 接受至少一個 1。恰好一個為 1 才會讓 XOR 輸出 1。"
        ],
        "terms": [
          "Boolean Operation"
        ]
      },
      {
        "page": 7,
        "title": "邏輯閘",
        "paragraphs": [
          "邏輯閘是實作布林運算的元件。畫出所有輸入組合和對應輸出，就能比較兩個閘的行為。"
        ],
        "terms": [
          "Boolean Operation",
          "Logic Gate"
        ]
      },
      {
        "page": 8,
        "title": "讀邏輯閘符號",
        "paragraphs": [
          "連線將輸出送到下一個閘。NOT 只有一個輸入，會把 0 和 1 對調。",
          "對 F＝AB＋A¬B，固定 A＝0 時兩項同為 0。固定 A＝1 時 B 和 ¬B 必有一項為真。兩種情況都符合 F＝A。"
        ],
        "terms": [
          "Boolean Operation",
          "Logic Gate"
        ],
        "exam": "真值表列出所有輸入。化簡後可用原表驗證兩式在每列都一致。"
      },
      {
        "page": 9,
        "title": "數位積體電路",
        "paragraphs": [
          "同一晶片可含多個閘，外接腳位把訊號及電源帶入或送出。"
        ],
        "terms": [
          "Logic Gate"
        ]
      },
      {
        "page": 10,
        "title": "TTL 與 CMOS",
        "paragraphs": [
          "兩者是常見數位電路家族，使用的電晶體結構與電氣規格有所不同。不可只憑邏輯符號推斷可接電壓。"
        ],
        "terms": []
      },
      {
        "page": 11,
        "title": "整合規模",
        "paragraphs": [
          "單一晶片能容納的元件數從少到多。規模提高讓更多功能可以直接在晶片內互連。"
        ],
        "terms": []
      },
      {
        "page": 12,
        "title": "TTL 系列與型號",
        "paragraphs": [
          "系列前綴只提供線索。要確定第幾腳是輸入、輸出或電源，應看該型號的腳位圖。"
        ],
        "terms": []
      },
      {
        "page": 13,
        "title": "CMOS 系列與型號",
        "paragraphs": [
          "同是 CMOS 元件也可能有不同的供電與邏輯電壓要求，使用前看個別規格。"
        ],
        "terms": []
      },
      {
        "page": 14,
        "title": "IC 的接腳",
        "paragraphs": [
          "先找定位凹口或標點，再確認腳位編號方向。把訊號接到電源腳會造成錯誤。"
        ],
        "terms": []
      },
      {
        "page": 15,
        "title": "電源腳與共同基準",
        "paragraphs": [
          "電路需要供電和接地。外接裝置的訊號通常需要能用同一電壓基準判讀。"
        ],
        "terms": []
      },
      {
        "page": 16,
        "title": "正反器保存一位",
        "paragraphs": [
          "由閘組成的電路可利用回授保留狀態。同樣的外部輸入有時會因上一刻狀態而有不同輸出。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 17,
        "title": "回授形成記憶",
        "paragraphs": [
          "追線時先找把輸出送回輸入的位置。回授讓電路在外部設定訊號解除後仍保持狀態。"
        ],
        "terms": [
          "Logic Gate",
          "Flip-Flop"
        ]
      },
      {
        "page": 18,
        "title": "設定狀態的第一步",
        "paragraphs": [
          "把設定訊號作用到對應輸入，會先改變直接相連的閘。輸出改變後沿線繼續判讀。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 19,
        "title": "設定訊號如何傳播",
        "paragraphs": [
          "閘的輸出影響後面的閘，最後回到前段。逐個節點追蹤比同時猜所有輸出更容易。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 20,
        "title": "解除設定後仍保持",
        "paragraphs": [
          "外部設定訊號回到閒置值時，互相回授的閘仍支持目前的穩定狀態。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 21,
        "title": "用另一組閘實作",
        "paragraphs": [
          "可用不同邏輯閘組出保存一位的電路。有效高、有效低要依實作的真值或狀態表辨認。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 22,
        "title": "SR 與時脈控制",
        "paragraphs": [
          "S 可設定、R 可重設。加上控制訊號後，可限制哪個時段允許外部輸入改變狀態。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 23,
        "title": "JK 正反器",
        "paragraphs": [
          "典型 JK 正反器在 J、K 都有效且發生時脈觸發時翻轉原狀態。只給其中一個有效可設定或清除。"
        ],
        "terms": [
          "Flip-Flop"
        ]
      },
      {
        "page": 24,
        "title": "D 與 T 正反器",
        "paragraphs": [
          "D 在觸發時擷取資料；T 在啟用且觸發時翻轉。看輸入、時脈邊緣與上一刻 Q 三者。",
          "若 Q 初始為 0，D 先變成 1，Q 仍為 0。第一個上升邊緣後 Q＝1，此後把 D 改成 0，Q 要等下一個指定邊緣才更新。"
        ],
        "terms": [
          "Flip-Flop"
        ],
        "exam": "先標時脈邊緣和 Q 初始值，只在有效邊緣複製當時的 D。"
      },
      {
        "page": 25,
        "title": "磁芯記憶體",
        "paragraphs": [
          "磁性材料可以保留某個磁化方向，兩種狀態可對應兩個位元值。"
        ],
        "terms": []
      },
      {
        "page": 26,
        "title": "磁芯的兩種狀態",
        "paragraphs": [
          "讀取線圈訊號能判斷磁化狀態。儲存的原理是讓物理狀態對應 0 或 1。"
        ],
        "terms": []
      },
      {
        "page": 27,
        "title": "十六進位是位元串的速記",
        "paragraphs": [
          "每個十六進位數字正好對應四位。1010 1111 依四位分組，可寫成 AF₁₆。"
        ],
        "terms": [
          "Hexadecimal"
        ]
      },
      {
        "page": 28,
        "title": "記憶胞與位元組",
        "paragraphs": [
          "每個 byte 由八個 bits 組成。常見的可尋址單位是位元組，讀取寬度則可跨越多個位址。"
        ],
        "terms": [
          "Address",
          "Byte"
        ]
      },
      {
        "page": 29,
        "title": "位址和內容",
        "paragraphs": [
          "位址指出讀寫哪一格，內容是格內的位元。在同一位址寫新內容，位址本身沒有變。"
        ],
        "terms": [
          "Address"
        ]
      },
      {
        "page": 30,
        "title": "讀記憶體表格",
        "paragraphs": [
          "先辨認表格的位址欄和內容欄。兩欄都可用十六進位顯示，意義仍各自不同。"
        ],
        "terms": [
          "Hexadecimal",
          "Address"
        ]
      },
      {
        "page": 31,
        "title": "RAM、DRAM 與 SRAM",
        "paragraphs": [
          "可隨機存取表示不必從頭循序尋找。常見 DRAM 需刷新，SRAM 在供電時不需同類刷新。"
        ],
        "terms": [
          "Address",
          "RAM",
          "Volatile Memory",
          "DRAM",
          "SRAM"
        ]
      },
      {
        "page": 32,
        "title": "ROM 與韌體",
        "paragraphs": [
          "ROM 類儲存可在關電後留住內容，常用於開機必須先取得的韌體。某些類型可按特定程序重寫。"
        ],
        "terms": [
          "RAM",
          "Volatile Memory",
          "ROM",
          "EEPROM",
          "EPROM"
        ]
      },
      {
        "page": 33,
        "title": "容量的十進位與二進位單位",
        "paragraphs": [
          "講義把 2¹⁰ bytes 慣寫成 KB。為避免混淆，可用 KiB 表示 1024 bytes，kB 表示 1000 bytes。"
        ],
        "terms": [
          "Byte"
        ]
      },
      {
        "page": 34,
        "title": "用次方估算容量",
        "paragraphs": [
          "1 MiB = 2²⁰ bytes，1 GiB = 2³⁰ bytes。計算時先寫清楚題目採用的單位。"
        ],
        "terms": [
          "Byte"
        ]
      },
      {
        "page": 35,
        "title": "大量儲存設備",
        "paragraphs": [
          "硬碟、磁帶、光碟和快閃儲存的物理機制不同。選擇常取決於隨機讀取、耐久與容量。"
        ],
        "terms": [
          "RAM",
          "Flash Memory"
        ]
      },
      {
        "page": 36,
        "title": "磁碟的磁軌與磁區",
        "paragraphs": [
          "磁軌是碟面上的同心路徑，磁區是沿路徑劃分的範圍。讀取要等磁頭對準目標位置。"
        ],
        "terms": []
      },
      {
        "page": 37,
        "title": "硬碟存取時間",
        "paragraphs": [
          "尋軌是磁頭移到對應磁軌，旋轉延遲是等磁區轉到磁頭下。資料對準後還要花時間傳輸。",
          "每個磁面 250 條磁軌、每軌 32 磁區、每區 512 bytes，兩張碟片各有兩個可寫面時，容量要乘 4 個磁面。若估磁頭一圈能傳多少，先算單一磁軌的資料量。"
        ],
        "terms": [],
        "exam": "容量與速率的乘式不同。題目未給可用面數或並行讀取假設時，寫清楚你採用的條件。"
      },
      {
        "page": 38,
        "title": "看懂硬碟規格",
        "paragraphs": [
          "容量回答能存多少，速率回答傳送有多快，延遲回答一次請求要等多久。三個數值用途不同。"
        ],
        "terms": []
      },
      {
        "page": 39,
        "title": "為什麼標示容量不同",
        "paragraphs": [
          "同樣 10⁹ bytes 可以寫成 1 GB，約為 0.931 GiB。檔案系統的管理空間也可能佔去部分容量。"
        ],
        "terms": [
          "Byte"
        ]
      },
      {
        "page": 40,
        "title": "讀寫磁頭",
        "paragraphs": [
          "磁頭在碟片上方工作。需要移動磁頭的裝置對隨機存取的成本和固態儲存不同。"
        ],
        "terms": []
      },
      {
        "page": 41,
        "title": "光碟如何讀取",
        "paragraphs": [
          "裝置用光學方式感測碟面反射變化，再解碼為位元。實體記號和最後的資料碼中間還有編碼規則。"
        ],
        "terms": []
      },
      {
        "page": 42,
        "title": "快閃記憶體",
        "paragraphs": [
          "用電荷狀態保存資料，斷電後仍可保留。擦除常按區塊處理，和讀取粒度可以不同。"
        ],
        "terms": [
          "Flash Memory",
          "EEPROM"
        ]
      },
      {
        "page": 43,
        "title": "其他儲存媒體",
        "paragraphs": [
          "評估媒體時同時考量資料能保存多久、能否重寫和實際讀寫模式。"
        ],
        "terms": [
          "Flash Memory"
        ]
      },
      {
        "page": 44,
        "title": "文字用字元編碼",
        "paragraphs": [
          "字元和一串位元之間需要對照規則。Unicode 定義碼位，UTF-8 定義如何把碼位放進位元組。"
        ],
        "terms": [
          "Encoding"
        ]
      },
      {
        "page": 45,
        "title": "ASCII 與 UTF-8 的共同範圍",
        "paragraphs": [
          "基本 ASCII 字元在 UTF-8 保留同樣的一個位元組。中文字通常需多個位元組，因此字元數不一定等於位元組數。"
        ],
        "terms": [
          "Hexadecimal",
          "Byte",
          "Encoding"
        ]
      },
      {
        "page": 46,
        "title": "數字與數字符號",
        "paragraphs": [
          "數值 5 直接用二進位可寫 101，字元「5」在 ASCII 中用 0x35。先辨認是存值還是文字。"
        ],
        "terms": [
          "Encoding"
        ]
      },
      {
        "page": 47,
        "title": "量子位元的課堂延伸",
        "paragraphs": [
          "量子位元需要另一套描述方式。容量估算和編碼練習都使用經典位元。"
        ],
        "terms": []
      },
      {
        "page": 48,
        "title": "像素與點陣圖",
        "paragraphs": [
          "點陣圖把影像表示為像素網格。每格存亮度或顏色，解析度與每格編碼一起影響大小。"
        ],
        "terms": [
          "Encoding",
          "Sampling"
        ]
      },
      {
        "page": 49,
        "title": "影像對比",
        "paragraphs": [
          "相鄰區域的亮度差會影響我們辨認細節。兩張解析度相同的影像也可能有不同的清晰感。"
        ],
        "terms": [
          "Quantization"
        ]
      },
      {
        "page": 50,
        "title": "量化影像亮度",
        "paragraphs": [
          "先選可用亮度等級，再把每個量測值歸到相近等級。級距越大，越容易丟失微小差異。"
        ],
        "terms": [
          "Quantization"
        ]
      },
      {
        "page": 51,
        "title": "估算未壓縮圖像",
        "paragraphs": [
          "一張 200×100 的 RGB 圖若每像素 24 位，像素資料需要 60,000 bytes，另可能有格式表頭。"
        ],
        "terms": [
          "Byte",
          "Quantization"
        ]
      },
      {
        "page": 52,
        "title": "空間解析度",
        "paragraphs": [
          "解析度可用橫向及縱向取樣數描述。增加色深會增加每點可表示的顏色數，像素數仍維持原本大小。"
        ],
        "terms": [
          "Sampling"
        ]
      },
      {
        "page": 53,
        "title": "降取樣與重取樣",
        "paragraphs": [
          "縮小影像後某些原始細節無法還原。插值在新位置估計像素值，結果也受方法影響。"
        ],
        "terms": [
          "Sampling"
        ]
      },
      {
        "page": 54,
        "title": "聲音取樣",
        "paragraphs": [
          "以固定間隔測量波形振幅。每秒幾次是取樣率，每次能分成多少等級由量化精度決定。"
        ],
        "terms": [
          "Sampling",
          "Quantization"
        ]
      },
      {
        "page": 55,
        "title": "從取樣值觀察波形",
        "paragraphs": [
          "每個數字對應一個時刻的振幅。依序放回時間軸就能看出趨勢，樣本間的曲線需用方法重建。"
        ],
        "terms": [
          "Sampling"
        ]
      },
      {
        "page": 56,
        "title": "取樣與量化造成的差異",
        "paragraphs": [
          "取樣在時間軸選點，量化把振幅對到有限等級。這兩步各自可能丟失資訊。"
        ],
        "terms": [
          "Sampling",
          "Quantization"
        ]
      },
      {
        "page": 57,
        "title": "位權與無號範圍",
        "terms": [
          "Bit",
          "Binary",
          "Unsigned Integer"
        ],
        "paragraphs": [
          "位址或數值用同一串位元時，還要知道它採哪種表示法。無號整數每一位都用正位權；4 位的範圍為 0 至 15。"
        ]
      },
      {
        "page": 58,
        "title": "用位權讀二進位",
        "terms": [
          "Binary",
          "Place Value"
        ],
        "paragraphs": [
          "從右到左標 1、2、4、8⋯，只加位元為 1 的項。例如 1011₂ = 8 + 2 + 1 = 11₁₀。"
        ]
      },
      {
        "page": 59,
        "title": "十進位整數怎麼轉成二進位",
        "terms": [
          "Binary",
          "Remainder"
        ],
        "paragraphs": [
          "非負整數連續除以 2，記下每次的餘數，商為 0 時停止。較早取得的餘數在較低位，所以答案由最後一個餘數往回讀。0 自身可直接寫作 0。"
        ]
      },
      {
        "page": 60,
        "title": "例題：把 13 轉成二進位",
        "terms": [
          "Binary",
          "Remainder"
        ],
        "paragraphs": [
          "13 ÷ 2 得 6 餘 1；6 ÷ 2 得 3 餘 0；3 ÷ 2 得 1 餘 1；1 ÷ 2 得 0 餘 1。把 1、0、1、1 倒著讀，得到 1101₂。"
        ]
      },
      {
        "page": 61,
        "title": "二進位加法與進位",
        "terms": [
          "Carry",
          "Binary"
        ],
        "paragraphs": [
          "一欄只有 0、1 兩個符號。1 + 1 寫下 0 並向左進 1；如果再加上右邊傳來的 1，就寫下 1 並向左進 1。"
        ]
      },
      {
        "page": 62,
        "title": "例題：含小數點的位權",
        "terms": [
          "Binary Fraction",
          "Place Value"
        ],
        "paragraphs": [
          "二進位小數 101.101₂ 的整數部分是 5，小數部分是 1/2 + 1/8 = 0.625，合起來是 5.625。小數點左邊第一位的位權才是 1。"
        ]
      },
      {
        "page": 63,
        "title": "同一串位元可以代表負數",
        "terms": [
          "Two’s Complement",
          "Unsigned Integer",
          "Sign Bit"
        ],
        "paragraphs": [
          "先確認題目說的是無號還是二補數。例如 1111 用 4 位無號讀是 15，用 4 位二補數讀是 −1。"
        ]
      },
      {
        "page": 64,
        "title": "二補數的範圍",
        "terms": [
          "Two’s Complement",
          "Bit Width",
          "Sign Bit"
        ],
        "paragraphs": [
          "n 位二補數範圍為 −2ⁿ⁻¹ 到 2ⁿ⁻¹−1。4 位為 −8 到 7。最高位是負位權，其餘為正位權，因此負端比正端多容納一個數。"
        ]
      },
      {
        "page": 65,
        "title": "例題：用 4 位表示 −6",
        "terms": [
          "Two’s Complement",
          "Bit Width",
          "Sign Bit"
        ],
        "paragraphs": [
          "先寫正數 6 的 4 位樣子 0110，逐位反相得到 1001，再加 1 得 1010。用位權驗算：−8 + 2 = −6。"
        ]
      },
      {
        "page": 66,
        "title": "固定寬度的有號加法",
        "terms": [
          "Two’s Complement",
          "Carry",
          "Overflow"
        ],
        "paragraphs": [
          "同寬的位元串照一般加法相加，只留低 n 位。例：−3 + 2 用 4 位是 1101 + 0010 = 1111，依二補數讀成 −1。"
        ]
      },
      {
        "page": 67,
        "title": "判斷有號溢位",
        "terms": [
          "Overflow",
          "Sign Bit",
          "Bit Width"
        ],
        "paragraphs": [
          "兩個正數相加，固定寬度結果卻為負，或兩個負數相加結果成為非負，就發生有號溢位。異號相加不會有有號溢位；有沒有最高位進位是另一個問題。",
          "以 8 位為例，0x90 代表 −112，兩個相加的真值是 −224。只保留低八位會得到 0x20（+32）。"
        ],
        "exam": "先寫表示範圍，判斷真值是否超界。最高位進位不能單獨判斷有號溢位。"
      },
      {
        "page": 68,
        "title": "偏移表示法",
        "paragraphs": [
          "先把位元串當無號數 u，再算 u−bias。Excess-8 的 1000 是 8−8＝0。"
        ],
        "terms": [
          "Excess Notation",
          "Bias"
        ]
      },
      {
        "page": 69,
        "title": "三位元 Excess-4",
        "paragraphs": [
          "範圍是 0−4 到 7−4，也就是 −4 到 3。把 −2 編碼時加 4 得到 2，寫成 010。"
        ],
        "terms": [
          "Excess Notation"
        ]
      },
      {
        "page": 70,
        "title": "小數點兩側的位權",
        "paragraphs": [
          "10.01₂ = 2 + 1/4 = 2.25；左邊用非負次方，右邊用負次方。"
        ],
        "terms": [
          "Binary Fraction",
          "Place Value"
        ]
      },
      {
        "page": 71,
        "title": "有限十進位可能在二進位重複",
        "paragraphs": [
          "約分後分母只有 2 的因子，才有有限二進位展開。1/10 含因子 5，必須用近似值表示於有限位數。"
        ],
        "terms": [
          "Floating Point"
        ]
      },
      {
        "page": 72,
        "title": "科學記號與規格化",
        "paragraphs": [
          "同一值可用多種尾數與指數寫法。選定規格化規則可讓表示一致，也利於解碼。"
        ],
        "terms": [
          "Floating Point",
          "Significand"
        ]
      },
      {
        "page": 73,
        "title": "把 0.8125 寫成二進位",
        "paragraphs": [
          "0.8125 = 1/2 + 1/4 + 1/16，因此按 1/2、1/4、1/8、1/16 依序是 1101。"
        ],
        "terms": [
          "Binary Fraction",
          "Place Value"
        ]
      },
      {
        "page": 74,
        "title": "浮點數的三個欄位",
        "paragraphs": [
          "符號決定正負，指數移動二進位點，有效數字提供精度。先知道欄位長度與解讀規則，再拆位元。"
        ],
        "terms": [
          "Excess Notation",
          "Floating Point",
          "Exponent"
        ]
      },
      {
        "page": 75,
        "title": "課本的八位元浮點格式",
        "paragraphs": [
          "例題使用 1 位符號、3 位 Excess-3 指數、4 位小數。它使用 0.xxxx 的尾數規則，和下文 IEEE 正規數的 1.F 不同。"
        ],
        "terms": [
          "Floating Point",
          "Significand"
        ]
      },
      {
        "page": 76,
        "title": "驗算講義的八位浮點例題",
        "paragraphs": [
          "按 Excess-3 計算，110₂ 是 6，指數為 3，0.1011₂×2³＝5.5。講義所示的 2.75 對應指數 2，在這套格式要用 101 作為指數欄。"
        ],
        "terms": [
          "Excess Notation",
          "Floating Point",
          "Bias",
          "Exponent"
        ]
      },
      {
        "page": 77,
        "title": "編碼時截斷有效位",
        "paragraphs": [
          "2.625＝10.101₂＝0.10101₂×2²。若欄位只能存四位小數並採截斷，留下 1010，解回 2.5。",
          "題目若指定用 0.ffff₂×2ᵉ，2.625＝0.10101₂×2²；保留四位得 0.1010₂，回算是 2.5。若改採捨入，題目要指定捨入規則。"
        ],
        "terms": [
          "Floating Point",
          "Truncation"
        ],
        "exam": "列原值、規格化寫法、保留下來的欄位，再解碼算截斷後的值。"
      },
      {
        "page": 78,
        "title": "IEEE 754 單精度",
        "paragraphs": [
          "單精度是 1 位符號、8 位指數、23 位小數欄位。正規數為 (−1)ˢ × 1.F × 2^(E−127)。"
        ],
        "terms": [
          "Excess Notation",
          "Floating Point",
          "Significand",
          "Underflow"
        ]
      },
      {
        "page": 79,
        "title": "隱含前導 1 與指數偏移",
        "paragraphs": [
          "正規數使用 1.F，前導 1 不需獨立儲存。指數欄的位元先讀成無號再扣 127。"
        ],
        "terms": [
          "Excess Notation",
          "Floating Point",
          "Bias",
          "Exponent",
          "Significand"
        ]
      },
      {
        "page": 80,
        "title": "把 0.75 拆成 S、E、F",
        "paragraphs": [
          "0.75＝0.11₂＝1.1₂×2⁻¹，所以 S＝0、E＝126，F 是 1 後續補 0。"
        ],
        "terms": [
          "Floating Point"
        ]
      },
      {
        "page": 81,
        "title": "把 IEEE 欄位合起來",
        "paragraphs": [
          "0.75 的三欄為 0｜01111110｜10000000000000000000000，串起來可用 0x3F400000 表示。"
        ],
        "terms": [
          "Hexadecimal",
          "Floating Point"
        ]
      },
      {
        "page": 82,
        "title": "特殊指數值",
        "paragraphs": [
          "E 全 0 時可表示零和次正規數；E 全 1 時可表示無窮或 NaN。判斷前先看 F 是否為零。"
        ],
        "terms": [
          "Floating Point",
          "Underflow",
          "Subnormal Number",
          "NaN"
        ]
      },
      {
        "page": 83,
        "title": "零、無窮與 NaN",
        "paragraphs": [
          "E＝0 且 F＝0 是帶符號的零。E＝255 且 F＝0 是帶符號無窮；E＝255 且 F 非零是 NaN。"
        ],
        "terms": [
          "Floating Point",
          "Subnormal Number",
          "NaN"
        ]
      },
      {
        "page": 84,
        "title": "程式語言讓演算法可執行",
        "paragraphs": [
          "先用例子確認運算，再轉為語法正確的程式。程式會照實執行寫下的規則。"
        ],
        "terms": []
      },
      {
        "page": 85,
        "title": "Python 作為學習工具",
        "paragraphs": [
          "可用簡短程式做數字轉換和檢查結果。顯示內容的字串與可參與數學運算的數值要區分。"
        ],
        "terms": []
      },
      {
        "page": 86,
        "title": "給值一個名字",
        "paragraphs": [
          "在 Python 中，x = 3 將名稱 x 綁定到值 3。後續賦值可改變名稱指向的值。"
        ],
        "terms": []
      },
      {
        "page": 87,
        "title": "Python 算式入門",
        "paragraphs": [
          "基本算式有優先順序；例如 2 + 3 * 4 得 14。加上括號可改成 (2 + 3) * 4。"
        ],
        "terms": []
      },
      {
        "page": 88,
        "title": "以變數保存換算比例",
        "paragraphs": [
          "換算結果等於原金額乘比例；把比例寫成有意義的名稱，更新時可找到單一位置。"
        ],
        "terms": []
      },
      {
        "page": 89,
        "title": "故障排除的提示",
        "paragraphs": [
          "記下輸入、預期結果與實際輸出，在最小案例重現問題，才能逐步排除原因。"
        ],
        "terms": []
      },
      {
        "page": 90,
        "title": "用小案例驗算",
        "paragraphs": [
          "當結果不合預期，先挑可以手算的輸入。印出中間值可定位是取值、計算還是顯示出錯。"
        ],
        "terms": []
      },
      {
        "page": 91,
        "title": "區分語法錯誤和運算錯誤",
        "paragraphs": [
          "print(5 +) 缺少操作數，無法解析；print(5 − 3) 的減號要用語言接受的 ASCII 形式。語法合法後還要驗證是否採用正確運算。"
        ],
        "terms": []
      },
      {
        "page": 92,
        "title": "無損、有損與游程編碼",
        "paragraphs": [
          "無損必須還原完全相同的資料。游程編碼把連續相同項記為值與次數，適合長段重複。"
        ],
        "terms": [
          "Lossless Compression",
          "Lossy Compression",
          "Run-Length Encoding"
        ]
      },
      {
        "page": 93,
        "title": "LZW 利用字典代碼",
        "paragraphs": [
          "編解碼端依相同規則增添重複字串，後續可傳字典代碼減少表示長度。",
          "考古題延伸常把 Huffman 與 LZW 分開考。Huffman 以符號頻率建前綴碼；LZW 在掃描訊息時為重複片段建立代碼。例：頻率 5、3、2、2 時，Huffman 合併 2＋2＝4、3＋4＝7、5＋7＝12，總長 23 bits。"
        ],
        "terms": [
          "Lossless Compression",
          "Huffman Coding",
          "LZW"
        ],
        "exam": "Huffman 樹的左右交換可改變碼字，總長以每個符號的頻率乘碼長驗算。"
      },
      {
        "page": 94,
        "title": "圖像壓縮格式",
        "paragraphs": [
          "平坦色塊與照片的資料分布不同。常見 JPEG 可捨棄較不顯眼的資訊，用較小大小交換細節。"
        ],
        "terms": [
          "Lossless Compression",
          "Lossy Compression"
        ]
      },
      {
        "page": 95,
        "title": "影音壓縮",
        "paragraphs": [
          "相鄰畫格常有重複內容。可儲存基準畫格及預測差異，減少重複保存整幅畫面。"
        ],
        "terms": [
          "Lossy Compression"
        ]
      },
      {
        "page": 96,
        "title": "冗餘用來發現錯誤",
        "paragraphs": [
          "根據內容加上檢查資料；收到資料後重新計算並比對。不同方法可偵測或修正的錯誤數不同。"
        ],
        "terms": [
          "Parity Bit"
        ]
      },
      {
        "page": 97,
        "title": "奇同位與偶同位",
        "paragraphs": [
          "同位位元讓整組 1 的總數為奇數或偶數。翻一位會改變奇偶，翻兩位可能通過檢查。"
        ],
        "terms": [
          "Parity Bit"
        ]
      },
      {
        "page": 98,
        "title": "能更正一位的編碼",
        "paragraphs": [
          "讓合法碼字彼此至少相差三位。收到只錯一位的字串時，最近的合法碼字會唯一。"
        ],
        "terms": [
          "Hamming Distance"
        ]
      },
      {
        "page": 99,
        "title": "用漢明距離解碼",
        "paragraphs": [
          "比較接收到的位元串和各合法碼字在幾個位置不同。最近碼字判讀需要先確定題目允許的錯誤數。"
        ],
        "terms": [
          "Hamming Distance"
        ]
      },
      {
        "page": 100,
        "title": "RAID 將多顆磁碟組合",
        "paragraphs": [
          "組合可用於增加吞吐或容忍故障。條帶、鏡像和同位資料提供不同性質。"
        ],
        "terms": [
          "RAID"
        ]
      },
      {
        "page": 101,
        "title": "利用 XOR 重建遺失資料",
        "paragraphs": [
          "若 P＝A XOR B，且只有 A 遺失，就能用 P XOR B 找回 A。冗餘保護有限，個別組態可承受的故障數不同。",
          "同一組的同位資料若為 P＝A XOR B XOR C，只有 B 缺失時，P XOR A XOR C 就剩 B。原因是每個已知值異或兩次變 0。"
        ],
        "terms": [
          "Parity Bit",
          "RAID"
        ],
        "exam": "逐欄寫已知資料與遺失位置。完整性檢查和單塊重建是不同用途。"
      }
    ],
    "concepts": {
      "binary-place": "二進位位權與進位",
      "twos-complement": "二補數編碼與解碼",
      "signed-overflow": "有號加法與溢位",
      "bit-interpretation": "同一組位元的有號與無號解讀",
      "logic-gates": "布林運算、邏輯閘與回授",
      "flip-flop": "正反器與時脈",
      "memory-address": "記憶體位置、容量與媒體",
      "digitization": "文字與訊號的表示",
      "floating-fields": "偏移值和浮點欄位",
      "python-expression": "變數、算式和錯誤",
      "compression": "壓縮與資訊保留",
      "parity": "同位檢查、漢明距離與 XOR 重建"
    },
    "practice": [
      {
        "id": "practice-1",
        "unit": "binary-integers",
        "page": 57,
        "concept": "binary-place",
        "level": "觀念",
        "prompt": "What is the largest value of a 4-bit unsigned integer?",
        "options": [
          {
            "label": "16",
            "correct": false,
            "explanation": "4 位有 16 種，從 0 算到 15。"
          },
          {
            "label": "15",
            "correct": true,
            "explanation": "4 位有 16 種，從 0 算到 15。"
          },
          {
            "label": "7",
            "correct": false,
            "explanation": "4 位有 16 種，從 0 算到 15。"
          },
          {
            "label": "8",
            "correct": false,
            "explanation": "4 位有 16 種，從 0 算到 15。"
          }
        ]
      },
      {
        "id": "practice-2",
        "unit": "binary-integers",
        "page": 58,
        "concept": "binary-place",
        "level": "計算",
        "prompt": "What is the decimal value of 1011₂?",
        "options": [
          {
            "label": "11",
            "correct": true,
            "explanation": "1×8 + 0×4 + 1×2 + 1×1 = 11。"
          },
          {
            "label": "9",
            "correct": false,
            "explanation": "1×8 + 0×4 + 1×2 + 1×1 = 11。"
          },
          {
            "label": "13",
            "correct": false,
            "explanation": "1×8 + 0×4 + 1×2 + 1×1 = 11。"
          },
          {
            "label": "15",
            "correct": false,
            "explanation": "1×8 + 0×4 + 1×2 + 1×1 = 11。"
          }
        ]
      },
      {
        "id": "practice-3",
        "unit": "binary-integers",
        "page": 60,
        "concept": "binary-place",
        "level": "流程",
        "prompt": "Repeatedly dividing 13 by 2 yields the remainders 1, 0, 1, 1 in that order. How should you read them?",
        "options": [
          {
            "label": "First to last, yielding 1011₂",
            "correct": false,
            "explanation": "先取得的餘數是最低位。"
          },
          {
            "label": "Ignore the first remainder, yielding 011₂",
            "correct": false,
            "explanation": "先取得的餘數是最低位。"
          },
          {
            "label": "Read only the last remainder, yielding 1₂",
            "correct": false,
            "explanation": "先取得的餘數是最低位。"
          },
          {
            "label": "Last to first, yielding 1101₂",
            "correct": true,
            "explanation": "先取得的餘數是最低位。"
          }
        ]
      },
      {
        "id": "practice-4",
        "unit": "binary-integers",
        "page": 61,
        "concept": "binary-place",
        "level": "計算",
        "prompt": "What is 101₂ + 011₂?",
        "options": [
          {
            "label": "110₂",
            "correct": false,
            "explanation": "5 + 3 = 8，進位最後到達 2³ 欄。"
          },
          {
            "label": "1010₂",
            "correct": false,
            "explanation": "5 + 3 = 8，進位最後到達 2³ 欄。"
          },
          {
            "label": "1000₂",
            "correct": true,
            "explanation": "5 + 3 = 8，進位最後到達 2³ 欄。"
          },
          {
            "label": "111₂",
            "correct": false,
            "explanation": "5 + 3 = 8，進位最後到達 2³ 欄。"
          }
        ]
      },
      {
        "id": "practice-5",
        "unit": "binary-integers",
        "page": 62,
        "concept": "binary-place",
        "level": "計算",
        "prompt": "What is the decimal value of 101.101₂?",
        "options": [
          {
            "label": "5.101",
            "correct": false,
            "explanation": "整數 5，加上 1/2 和 1/8。"
          },
          {
            "label": "5.625",
            "correct": true,
            "explanation": "整數 5，加上 1/2 和 1/8。"
          },
          {
            "label": "5.75",
            "correct": false,
            "explanation": "整數 5，加上 1/2 和 1/8。"
          },
          {
            "label": "5.3125",
            "correct": false,
            "explanation": "整數 5，加上 1/2 和 1/8。"
          }
        ]
      },
      {
        "id": "practice-6",
        "unit": "binary-integers",
        "page": 63,
        "concept": "twos-complement",
        "level": "判讀",
        "prompt": "What does 1111 represent as a 4-bit two's-complement number?",
        "options": [
          {
            "label": "−1",
            "correct": true,
            "explanation": "位權和是 −8 + 4 + 2 + 1 = −1。"
          },
          {
            "label": "15",
            "correct": false,
            "explanation": "位權和是 −8 + 4 + 2 + 1 = −1。"
          },
          {
            "label": "−7",
            "correct": false,
            "explanation": "位權和是 −8 + 4 + 2 + 1 = −1。"
          },
          {
            "label": "−8",
            "correct": false,
            "explanation": "位權和是 −8 + 4 + 2 + 1 = −1。"
          }
        ]
      },
      {
        "id": "practice-7",
        "unit": "binary-integers",
        "page": 64,
        "concept": "twos-complement",
        "level": "觀念",
        "prompt": "What is the range of 4-bit two's-complement integers?",
        "options": [
          {
            "label": "0 through 15",
            "correct": false,
            "explanation": "最低位權為 −8，其餘三位加起來最多 7。"
          },
          {
            "label": "−7 through 7",
            "correct": false,
            "explanation": "最低位權為 −8，其餘三位加起來最多 7。"
          },
          {
            "label": "−8 through 8",
            "correct": false,
            "explanation": "最低位權為 −8，其餘三位加起來最多 7。"
          },
          {
            "label": "−8 through 7",
            "correct": true,
            "explanation": "最低位權為 −8，其餘三位加起來最多 7。"
          }
        ]
      },
      {
        "id": "practice-8",
        "unit": "binary-integers",
        "page": 65,
        "concept": "twos-complement",
        "level": "計算",
        "prompt": "Which 4-bit two's-complement pattern represents −6?",
        "options": [
          {
            "label": "1001",
            "correct": false,
            "explanation": "0110 反相成 1001，再加 1 得 1010。"
          },
          {
            "label": "1110",
            "correct": false,
            "explanation": "0110 反相成 1001，再加 1 得 1010。"
          },
          {
            "label": "1010",
            "correct": true,
            "explanation": "0110 反相成 1001，再加 1 得 1010。"
          },
          {
            "label": "0110",
            "correct": false,
            "explanation": "0110 反相成 1001，再加 1 得 1010。"
          }
        ]
      },
      {
        "id": "practice-9",
        "unit": "binary-integers",
        "page": 66,
        "concept": "signed-overflow",
        "level": "計算",
        "prompt": "What is the result of the 4-bit two's-complement addition 1101 + 0010?",
        "options": [
          {
            "label": "15, with no overflow",
            "correct": false,
            "explanation": "−3 + 2 = −1，在 −8 到 7 內。"
          },
          {
            "label": "−1, with no overflow",
            "correct": true,
            "explanation": "−3 + 2 = −1，在 −8 到 7 內。"
          },
          {
            "label": "−1, with overflow",
            "correct": false,
            "explanation": "−3 + 2 = −1，在 −8 到 7 內。"
          },
          {
            "label": "1, with no overflow",
            "correct": false,
            "explanation": "−3 + 2 = −1，在 −8 到 7 內。"
          }
        ]
      },
      {
        "id": "practice-10",
        "unit": "binary-integers",
        "page": 67,
        "concept": "signed-overflow",
        "level": "判讀",
        "prompt": "Adding 0101 and 0100 produces 1001 in four bits. How should this be interpreted as two's complement?",
        "options": [
          {
            "label": "Signed overflow: the exact sum 9 is too large.",
            "correct": true,
            "explanation": "兩個正數相加，保留的 4 位卻讀出 −7。"
          },
          {
            "label": "No signed overflow: there is no carry out.",
            "correct": false,
            "explanation": "兩個正數相加，保留的 4 位卻讀出 −7。"
          },
          {
            "label": "No signed overflow: the exact sum is −7.",
            "correct": false,
            "explanation": "兩個正數相加，保留的 4 位卻讀出 −7。"
          },
          {
            "label": "The exact sum 9 fits in four signed bits.",
            "correct": false,
            "explanation": "兩個正數相加，保留的 4 位卻讀出 −7。"
          }
        ]
      },
      {
        "id": "practice-11",
        "unit": "binary-integers",
        "page": 67,
        "concept": "signed-overflow",
        "level": "判讀",
        "prompt": "Adding 1111 and 0001 gives low bits 0000. Which two's-complement interpretation is correct?",
        "options": [
          {
            "label": "Any carry out implies signed overflow.",
            "correct": false,
            "explanation": "兩個加數異號；捨去最高位進位仍得到正確的有號總和。"
          },
          {
            "label": "The exact signed sum is 16, so there is overflow.",
            "correct": false,
            "explanation": "兩個加數異號；捨去最高位進位仍得到正確的有號總和。"
          },
          {
            "label": "Both inputs are negative.",
            "correct": false,
            "explanation": "兩個加數異號；捨去最高位進位仍得到正確的有號總和。"
          },
          {
            "label": "−1 + 1 = 0, with no signed overflow.",
            "correct": true,
            "explanation": "兩個加數異號；捨去最高位進位仍得到正確的有號總和。"
          }
        ]
      },
      {
        "id": "practice-12",
        "unit": "binary-integers",
        "page": 65,
        "concept": "twos-complement",
        "level": "計算",
        "prompt": "What is the smallest 6-bit two's-complement integer?",
        "options": [
          {
            "label": "−31",
            "correct": false,
            "explanation": "最高位權重是 −2⁵，最小值對應 100000。"
          },
          {
            "label": "−64",
            "correct": false,
            "explanation": "最高位權重是 −2⁵，最小值對應 100000。"
          },
          {
            "label": "−32",
            "correct": true,
            "explanation": "最高位權重是 −2⁵，最小值對應 100000。"
          },
          {
            "label": "−16",
            "correct": false,
            "explanation": "最高位權重是 −2⁵，最小值對應 100000。"
          }
        ]
      },
      {
        "id": "practice-13",
        "unit": "bits",
        "page": 4,
        "concept": "logic-gates",
        "level": "計算",
        "prompt": "How many different patterns can five bits represent?",
        "options": [
          {
            "label": "5",
            "correct": false,
            "explanation": "每個位置兩種選擇，2⁵＝32。"
          },
          {
            "label": "32",
            "correct": true,
            "explanation": "每個位置兩種選擇，2⁵＝32。"
          },
          {
            "label": "10",
            "correct": false,
            "explanation": "每個位置兩種選擇，2⁵＝32。"
          },
          {
            "label": "31",
            "correct": false,
            "explanation": "每個位置兩種選擇，2⁵＝32。"
          }
        ]
      },
      {
        "id": "practice-14",
        "unit": "bits",
        "page": 6,
        "concept": "logic-gates",
        "level": "判讀",
        "prompt": "Which operation returns 0 when both of its inputs are 1?",
        "options": [
          {
            "label": "XOR",
            "correct": true,
            "explanation": "XOR 要恰有一個 1，兩個 1 因此輸出 0。"
          },
          {
            "label": "AND",
            "correct": false,
            "explanation": "XOR 要恰有一個 1，兩個 1 因此輸出 0。"
          },
          {
            "label": "OR",
            "correct": false,
            "explanation": "XOR 要恰有一個 1，兩個 1 因此輸出 0。"
          },
          {
            "label": "The constant 1 function",
            "correct": false,
            "explanation": "XOR 要恰有一個 1，兩個 1 因此輸出 0。"
          }
        ]
      },
      {
        "id": "practice-15",
        "unit": "bits",
        "page": 16,
        "concept": "flip-flop",
        "level": "應用",
        "prompt": "Why can a feedback circuit retain a state after its external set signal is removed?",
        "options": [
          {
            "label": "The output is permanently set to zero.",
            "correct": false,
            "explanation": "穩定狀態可在外部設定解除時維持。"
          },
          {
            "label": "It chooses a random state on each clock tick.",
            "correct": false,
            "explanation": "穩定狀態可在外部設定解除時維持。"
          },
          {
            "label": "An external device continually resends the bit.",
            "correct": false,
            "explanation": "穩定狀態可在外部設定解除時維持。"
          },
          {
            "label": "Its output feeds back to its input.",
            "correct": true,
            "explanation": "穩定狀態可在外部設定解除時維持。"
          }
        ]
      },
      {
        "id": "practice-16",
        "unit": "bits",
        "page": 24,
        "concept": "flip-flop",
        "level": "判讀",
        "prompt": "A D flip-flop currently has Q = 0. D goes to 1 without an active clock edge. What happens to Q?",
        "options": [
          {
            "label": "It immediately becomes 1.",
            "correct": false,
            "explanation": "D 正反器只在指定時脈邊緣擷取 D。"
          },
          {
            "label": "It alternates between 0 and 1 every second.",
            "correct": false,
            "explanation": "D 正反器只在指定時脈邊緣擷取 D。"
          },
          {
            "label": "It remains 0.",
            "correct": true,
            "explanation": "D 正反器只在指定時脈邊緣擷取 D。"
          },
          {
            "label": "It becomes undefined as soon as D changes.",
            "correct": false,
            "explanation": "D 正反器只在指定時脈邊緣擷取 D。"
          }
        ]
      },
      {
        "id": "practice-17",
        "unit": "bits",
        "page": 27,
        "concept": "logic-gates",
        "level": "計算",
        "prompt": "What is the hexadecimal representation of 1100 0010₂?",
        "options": [
          {
            "label": "2C",
            "correct": false,
            "explanation": "1100 是 C，0010 是 2。"
          },
          {
            "label": "C2",
            "correct": true,
            "explanation": "1100 是 C，0010 是 2。"
          },
          {
            "label": "C1",
            "correct": false,
            "explanation": "1100 是 C，0010 是 2。"
          },
          {
            "label": "D2",
            "correct": false,
            "explanation": "1100 是 C，0010 是 2。"
          }
        ]
      },
      {
        "id": "practice-18",
        "unit": "storage",
        "page": 29,
        "concept": "memory-address",
        "level": "判讀",
        "prompt": "M[0x20] changes from 0xAA to 0x55. Which value is the address?",
        "options": [
          {
            "label": "0x20",
            "correct": true,
            "explanation": "位址標記該記憶格。寫入只改格內內容。"
          },
          {
            "label": "0xAA",
            "correct": false,
            "explanation": "位址標記該記憶格。寫入只改格內內容。"
          },
          {
            "label": "0x55",
            "correct": false,
            "explanation": "位址標記該記憶格。寫入只改格內內容。"
          },
          {
            "label": "0x75",
            "correct": false,
            "explanation": "位址標記該記憶格。寫入只改格內內容。"
          }
        ]
      },
      {
        "id": "practice-19",
        "unit": "storage",
        "page": 31,
        "concept": "memory-address",
        "level": "觀念",
        "prompt": "What is one difference between typical DRAM and SRAM?",
        "options": [
          {
            "label": "DRAM always retains data without power.",
            "correct": false,
            "explanation": "DRAM 儲存的電荷會隨時間流失。"
          },
          {
            "label": "SRAM cannot be accessed by address.",
            "correct": false,
            "explanation": "DRAM 儲存的電荷會隨時間流失。"
          },
          {
            "label": "SRAM must always be read from the first cell onward.",
            "correct": false,
            "explanation": "DRAM 儲存的電荷會隨時間流失。"
          },
          {
            "label": "DRAM requires periodic refresh.",
            "correct": true,
            "explanation": "DRAM 儲存的電荷會隨時間流失。"
          }
        ]
      },
      {
        "id": "practice-20",
        "unit": "storage",
        "page": 34,
        "concept": "memory-address",
        "level": "計算",
        "prompt": "How many bytes are in 3 KiB?",
        "options": [
          {
            "label": "3000",
            "correct": false,
            "explanation": "3 × 1024＝3072。"
          },
          {
            "label": "384",
            "correct": false,
            "explanation": "3 × 1024＝3072。"
          },
          {
            "label": "3072",
            "correct": true,
            "explanation": "3 × 1024＝3072。"
          },
          {
            "label": "24,576",
            "correct": false,
            "explanation": "3 × 1024＝3072。"
          }
        ]
      },
      {
        "id": "practice-21",
        "unit": "storage",
        "page": 37,
        "concept": "memory-address",
        "level": "觀念",
        "prompt": "The head is over the correct disk track. What delay remains while waiting for the correct sector to arrive?",
        "options": [
          {
            "label": "CPU instruction fetch time",
            "correct": false,
            "explanation": "磁片還要旋轉到可讀寫的位置。"
          },
          {
            "label": "Rotational latency",
            "correct": true,
            "explanation": "磁片還要旋轉到可讀寫的位置。"
          },
          {
            "label": "Seek time",
            "correct": false,
            "explanation": "磁片還要旋轉到可讀寫的位置。"
          },
          {
            "label": "Compression time",
            "correct": false,
            "explanation": "磁片還要旋轉到可讀寫的位置。"
          }
        ]
      },
      {
        "id": "practice-22",
        "unit": "representation",
        "page": 45,
        "concept": "digitization",
        "level": "判讀",
        "prompt": "How do you find the length in UTF-8 bytes of a string containing both English letters and Chinese characters?",
        "options": [
          {
            "label": "Add the encoded lengths of its characters.",
            "correct": true,
            "explanation": "Unicode 字元的 UTF-8 表示可有不同位元組數。"
          },
          {
            "label": "Use the number of characters as the number of bytes.",
            "correct": false,
            "explanation": "Unicode 字元的 UTF-8 表示可有不同位元組數。"
          },
          {
            "label": "Multiply the number of characters by four.",
            "correct": false,
            "explanation": "Unicode 字元的 UTF-8 表示可有不同位元組數。"
          },
          {
            "label": "Count only its English letters.",
            "correct": false,
            "explanation": "Unicode 字元的 UTF-8 表示可有不同位元組數。"
          }
        ]
      },
      {
        "id": "practice-23",
        "unit": "representation",
        "page": 51,
        "concept": "digitization",
        "level": "計算",
        "prompt": "A 100 × 80 image uses 24 bits per pixel. How many bytes of uncompressed pixel data does it contain?",
        "options": [
          {
            "label": "8,000",
            "correct": false,
            "explanation": "24 bits 為 3 bytes，100×80×3＝24,000。"
          },
          {
            "label": "192,000",
            "correct": false,
            "explanation": "24 bits 為 3 bytes，100×80×3＝24,000。"
          },
          {
            "label": "30,000",
            "correct": false,
            "explanation": "24 bits 為 3 bytes，100×80×3＝24,000。"
          },
          {
            "label": "24,000",
            "correct": true,
            "explanation": "24 bits 為 3 bytes，100×80×3＝24,000。"
          }
        ]
      },
      {
        "id": "practice-24",
        "unit": "representation",
        "page": 56,
        "concept": "digitization",
        "level": "觀念",
        "prompt": "The sample rate is unchanged but audio bit depth is reduced. What changes directly?",
        "options": [
          {
            "label": "The number of samples per second decreases.",
            "correct": false,
            "explanation": "位深影響量化等級，取樣率控制時間軸的測量次數。"
          },
          {
            "label": "The track duration is halved.",
            "correct": false,
            "explanation": "位深影響量化等級，取樣率控制時間軸的測量次數。"
          },
          {
            "label": "Each amplitude can be stored at fewer levels.",
            "correct": true,
            "explanation": "位深影響量化等級，取樣率控制時間軸的測量次數。"
          },
          {
            "label": "Every amplitude becomes zero.",
            "correct": false,
            "explanation": "位深影響量化等級，取樣率控制時間軸的測量次數。"
          }
        ]
      },
      {
        "id": "practice-25",
        "unit": "floating-point",
        "page": 68,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "What value does 1011 encode in Excess-8 notation?",
        "options": [
          {
            "label": "11",
            "correct": false,
            "explanation": "無號 11 減偏移 8，得到 3。"
          },
          {
            "label": "3",
            "correct": true,
            "explanation": "無號 11 減偏移 8，得到 3。"
          },
          {
            "label": "−5",
            "correct": false,
            "explanation": "無號 11 減偏移 8，得到 3。"
          },
          {
            "label": "19",
            "correct": false,
            "explanation": "無號 11 減偏移 8，得到 3。"
          }
        ]
      },
      {
        "id": "practice-26",
        "unit": "floating-point",
        "page": 71,
        "concept": "floating-fields",
        "level": "觀念",
        "prompt": "Which decimal fraction has a finite binary representation?",
        "options": [
          {
            "label": "0.625",
            "correct": true,
            "explanation": "0.625＝5/8，分母是 2 的次方。"
          },
          {
            "label": "0.1",
            "correct": false,
            "explanation": "0.625＝5/8，分母是 2 的次方。"
          },
          {
            "label": "0.2",
            "correct": false,
            "explanation": "0.625＝5/8，分母是 2 的次方。"
          },
          {
            "label": "0.3",
            "correct": false,
            "explanation": "0.625＝5/8，分母是 2 的次方。"
          }
        ]
      },
      {
        "id": "practice-27",
        "unit": "floating-point",
        "page": 75,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "An eight-bit format uses s eee ffff, an Excess-3 exponent, and significand 0.ffff₂. What is the value of 1 100 1100?",
        "options": [
          {
            "label": "−3.5",
            "correct": false,
            "explanation": "符號負，指數 4−3＝1，0.11₂×2＝1.5。"
          },
          {
            "label": "−0.75",
            "correct": false,
            "explanation": "符號負，指數 4−3＝1，0.11₂×2＝1.5。"
          },
          {
            "label": "1.5",
            "correct": false,
            "explanation": "符號負，指數 4−3＝1，0.11₂×2＝1.5。"
          },
          {
            "label": "−1.5",
            "correct": true,
            "explanation": "符號負，指數 4−3＝1，0.11₂×2＝1.5。"
          }
        ]
      },
      {
        "id": "practice-28",
        "unit": "floating-point",
        "page": 80,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "What unsigned value is stored in the E field for 0.75 in IEEE 754 binary32?",
        "options": [
          {
            "label": "127",
            "correct": false,
            "explanation": "0.75＝1.1₂×2⁻¹，存 −1＋127。"
          },
          {
            "label": "128",
            "correct": false,
            "explanation": "0.75＝1.1₂×2⁻¹，存 −1＋127。"
          },
          {
            "label": "126",
            "correct": true,
            "explanation": "0.75＝1.1₂×2⁻¹，存 −1＋127。"
          },
          {
            "label": "255",
            "correct": false,
            "explanation": "0.75＝1.1₂×2⁻¹，存 −1＋127。"
          }
        ]
      },
      {
        "id": "practice-29",
        "unit": "floating-point",
        "page": 83,
        "concept": "floating-fields",
        "level": "判讀",
        "prompt": "In IEEE 754 binary32, all exponent bits are 1 and the fraction field is nonzero. What does the pattern represent?",
        "options": [
          {
            "label": "Positive infinity",
            "correct": false,
            "explanation": "E 全 1 保留給無窮與 NaN，F 非零時是 NaN。"
          },
          {
            "label": "NaN",
            "correct": true,
            "explanation": "E 全 1 保留給無窮與 NaN，F 非零時是 NaN。"
          },
          {
            "label": "Negative zero",
            "correct": false,
            "explanation": "E 全 1 保留給無窮與 NaN，F 非零時是 NaN。"
          },
          {
            "label": "A normal finite value",
            "correct": false,
            "explanation": "E 全 1 保留給無窮與 NaN，F 非零時是 NaN。"
          }
        ]
      },
      {
        "id": "practice-30",
        "unit": "python",
        "page": 87,
        "concept": "python-expression",
        "level": "計算",
        "prompt": "What is the result of the Python expression 2 + 3 * 4?",
        "options": [
          {
            "label": "14",
            "correct": true,
            "explanation": "先乘 3×4，再加 2。"
          },
          {
            "label": "20",
            "correct": false,
            "explanation": "先乘 3×4，再加 2。"
          },
          {
            "label": "24",
            "correct": false,
            "explanation": "先乘 3×4，再加 2。"
          },
          {
            "label": "11",
            "correct": false,
            "explanation": "先乘 3×4，再加 2。"
          }
        ]
      },
      {
        "id": "practice-31",
        "unit": "python",
        "page": 91,
        "concept": "python-expression",
        "level": "判讀",
        "prompt": "Why does Python reject print(5 +)?",
        "options": [
          {
            "label": "The answer needs rounding.",
            "correct": false,
            "explanation": "加法記號後缺右操作數，無法解析。"
          },
          {
            "label": "It necessarily causes a page fault.",
            "correct": false,
            "explanation": "加法記號後缺右操作數，無法解析。"
          },
          {
            "label": "It prints 5 and then overflows.",
            "correct": false,
            "explanation": "加法記號後缺右操作數，無法解析。"
          },
          {
            "label": "There is a syntax error.",
            "correct": true,
            "explanation": "加法記號後缺右操作數，無法解析。"
          }
        ]
      },
      {
        "id": "practice-32",
        "unit": "reliability",
        "page": 92,
        "concept": "compression",
        "level": "應用",
        "prompt": "Which input would usually compress best with simple run-length encoding?",
        "options": [
          {
            "label": "ABABABABABAB",
            "correct": false,
            "explanation": "重複成段，兩組次數就能描述。"
          },
          {
            "label": "ABCDEFGH",
            "correct": false,
            "explanation": "重複成段，兩組次數就能描述。"
          },
          {
            "label": "AAAAAAAABBBB",
            "correct": true,
            "explanation": "重複成段，兩組次數就能描述。"
          },
          {
            "label": "ABCDABCD",
            "correct": false,
            "explanation": "重複成段，兩組次數就能描述。"
          }
        ]
      },
      {
        "id": "practice-33",
        "unit": "reliability",
        "page": 94,
        "concept": "compression",
        "level": "觀念",
        "prompt": "An edited image must be recoverable bit for bit after decompression. What is required?",
        "options": [
          {
            "label": "The image must look similar.",
            "correct": false,
            "explanation": "解碼後資料必須完全相同。"
          },
          {
            "label": "Lossless compression",
            "correct": true,
            "explanation": "解碼後資料必須完全相同。"
          },
          {
            "label": "The file needs a .jpg extension.",
            "correct": false,
            "explanation": "解碼後資料必須完全相同。"
          },
          {
            "label": "The dimensions must stay the same.",
            "correct": false,
            "explanation": "解碼後資料必須完全相同。"
          }
        ]
      },
      {
        "id": "practice-34",
        "unit": "reliability",
        "page": 97,
        "concept": "parity",
        "level": "計算",
        "prompt": "What even parity bit should be appended to 1011?",
        "options": [
          {
            "label": "1",
            "correct": true,
            "explanation": "原有三個 1，再加一個才成偶數。"
          },
          {
            "label": "0",
            "correct": false,
            "explanation": "原有三個 1，再加一個才成偶數。"
          },
          {
            "label": "10",
            "correct": false,
            "explanation": "原有三個 1，再加一個才成偶數。"
          },
          {
            "label": "11",
            "correct": false,
            "explanation": "原有三個 1，再加一個才成偶數。"
          }
        ]
      },
      {
        "id": "practice-35",
        "unit": "reliability",
        "page": 98,
        "concept": "parity",
        "level": "計算",
        "prompt": "What is the Hamming distance between 101100 and 100001?",
        "options": [
          {
            "label": "2",
            "correct": false,
            "explanation": "第 3、4、6 位不同，共三位。"
          },
          {
            "label": "4",
            "correct": false,
            "explanation": "第 3、4、6 位不同，共三位。"
          },
          {
            "label": "5",
            "correct": false,
            "explanation": "第 3、4、6 位不同，共三位。"
          },
          {
            "label": "3",
            "correct": true,
            "explanation": "第 3、4、6 位不同，共三位。"
          }
        ]
      },
      {
        "id": "practice-36",
        "unit": "reliability",
        "page": 101,
        "concept": "parity",
        "level": "計算",
        "prompt": "If P = A XOR B, P = 0101, and B = 0011, what is A?",
        "options": [
          {
            "label": "1110",
            "correct": false,
            "explanation": "P XOR B＝0101 XOR 0011＝0110。"
          },
          {
            "label": "0001",
            "correct": false,
            "explanation": "P XOR B＝0101 XOR 0011＝0110。"
          },
          {
            "label": "0110",
            "correct": true,
            "explanation": "P XOR B＝0101 XOR 0011＝0110。"
          },
          {
            "label": "0101",
            "correct": false,
            "explanation": "P XOR B＝0101 XOR 0011＝0110。"
          }
        ]
      },
      {
        "id": "practice-37",
        "unit": "bits",
        "page": 8,
        "concept": "logic-gates",
        "level": "分析",
        "prompt": "A circuit computes F = (A AND B) OR (A AND NOT B). Which single input determines F?",
        "options": [
          {
            "label": "B",
            "correct": false,
            "explanation": "正確判斷是「A」。分配律可寫 A AND (B OR NOT B)，括號永遠為真。"
          },
          {
            "label": "A",
            "correct": true,
            "explanation": "分配律可寫 A AND (B OR NOT B)，括號永遠為真。"
          },
          {
            "label": "NOT A",
            "correct": false,
            "explanation": "正確判斷是「A」。分配律可寫 A AND (B OR NOT B)，括號永遠為真。"
          },
          {
            "label": "NOT B",
            "correct": false,
            "explanation": "正確判斷是「A」。分配律可寫 A AND (B OR NOT B)，括號永遠為真。"
          }
        ]
      },
      {
        "id": "practice-38",
        "unit": "bits",
        "page": 24,
        "concept": "flip-flop",
        "level": "計算",
        "prompt": "Q starts at 0. D is 1 at the first rising edge, 0 at the second, and 1 at the third. D later falls to 0 without another edge. What is Q just before the first edge and just after each of the three edges and the final fall?",
        "options": [
          {
            "label": "0, 1, 0, 1, 1",
            "correct": true,
            "explanation": "只在指定的上升邊緣更新，最後一次 D 變動不影響 Q。"
          },
          {
            "label": "0, 1, 0, 1, 0",
            "correct": false,
            "explanation": "正確判斷是「0, 1, 0, 1, 1」。只在指定的上升邊緣更新，最後一次 D 變動不影響 Q。"
          },
          {
            "label": "0, 0, 1, 0, 1",
            "correct": false,
            "explanation": "正確判斷是「0, 1, 0, 1, 1」。只在指定的上升邊緣更新，最後一次 D 變動不影響 Q。"
          },
          {
            "label": "1, 1, 0, 1, 1",
            "correct": false,
            "explanation": "正確判斷是「0, 1, 0, 1, 1」。只在指定的上升邊緣更新，最後一次 D 變動不影響 Q。"
          }
        ]
      },
      {
        "id": "practice-39",
        "unit": "storage",
        "page": 31,
        "concept": "memory-address",
        "level": "計算",
        "prompt": "A byte-addressed device uses 18 address bits. What is its total capacity if every address refers to one byte?",
        "options": [
          {
            "label": "128 KiB",
            "correct": false,
            "explanation": "正確判斷是「256 KiB」。2¹⁸ 個位址，每個一 byte；除以 2¹⁰ 得 256 KiB。"
          },
          {
            "label": "256 KB exactly, using decimal SI units",
            "correct": false,
            "explanation": "正確判斷是「256 KiB」。2¹⁸ 個位址，每個一 byte；除以 2¹⁰ 得 256 KiB。"
          },
          {
            "label": "2 MiB",
            "correct": false,
            "explanation": "正確判斷是「256 KiB」。2¹⁸ 個位址，每個一 byte；除以 2¹⁰ 得 256 KiB。"
          },
          {
            "label": "256 KiB",
            "correct": true,
            "explanation": "2¹⁸ 個位址，每個一 byte；除以 2¹⁰ 得 256 KiB。"
          }
        ]
      },
      {
        "id": "practice-40",
        "unit": "storage",
        "page": 37,
        "concept": "memory-address",
        "level": "計算",
        "prompt": "A disk has two platters with two data surfaces each, 250 tracks per surface, 32 sectors per track, and 512 bytes per sector. What is its raw capacity?",
        "options": [
          {
            "label": "8,192,000 bytes",
            "correct": false,
            "explanation": "正確判斷是「16,384,000 bytes」。2×2×250×32×512＝16,384,000。"
          },
          {
            "label": "4,096,000 bytes",
            "correct": false,
            "explanation": "正確判斷是「16,384,000 bytes」。2×2×250×32×512＝16,384,000。"
          },
          {
            "label": "16,384,000 bytes",
            "correct": true,
            "explanation": "2×2×250×32×512＝16,384,000。"
          },
          {
            "label": "32,768,000 bytes",
            "correct": false,
            "explanation": "正確判斷是「16,384,000 bytes」。2×2×250×32×512＝16,384,000。"
          }
        ]
      },
      {
        "id": "practice-41",
        "unit": "representation",
        "page": 51,
        "concept": "digitization",
        "level": "分析",
        "prompt": "A 640 × 480 image changes from 24 bits per pixel to 8 bits per pixel with no size change. Ignoring headers and compression, what fraction of storage is saved?",
        "options": [
          {
            "label": "One third",
            "correct": false,
            "explanation": "正確判斷是「Two thirds」。原本每格 3 bytes，現在每格 1 byte，省 2/3。"
          },
          {
            "label": "Two thirds",
            "correct": true,
            "explanation": "原本每格 3 bytes，現在每格 1 byte，省 2/3。"
          },
          {
            "label": "One half",
            "correct": false,
            "explanation": "正確判斷是「Two thirds」。原本每格 3 bytes，現在每格 1 byte，省 2/3。"
          },
          {
            "label": "Three quarters",
            "correct": false,
            "explanation": "正確判斷是「Two thirds」。原本每格 3 bytes，現在每格 1 byte，省 2/3。"
          }
        ]
      },
      {
        "id": "practice-42",
        "unit": "representation",
        "page": 54,
        "concept": "digitization",
        "level": "計算",
        "prompt": "A stereo recording uses 48,000 samples per second per channel and 16 bits per sample. How many bytes does 10 seconds occupy, before compression?",
        "options": [
          {
            "label": "1,920,000",
            "correct": true,
            "explanation": "48,000×2×16×10÷8＝1,920,000 bytes。"
          },
          {
            "label": "960,000",
            "correct": false,
            "explanation": "正確判斷是「1,920,000」。48,000×2×16×10÷8＝1,920,000 bytes。"
          },
          {
            "label": "15,360,000",
            "correct": false,
            "explanation": "正確判斷是「1,920,000」。48,000×2×16×10÷8＝1,920,000 bytes。"
          },
          {
            "label": "480,000",
            "correct": false,
            "explanation": "正確判斷是「1,920,000」。48,000×2×16×10÷8＝1,920,000 bytes。"
          }
        ]
      },
      {
        "id": "practice-43",
        "unit": "binary-integers",
        "page": 65,
        "concept": "twos-complement",
        "level": "判讀",
        "prompt": "The byte 0xD6 is read once as signed 8-bit two's complement and once as unsigned. What are the two decimal values in that order?",
        "options": [
          {
            "label": "−86, 214",
            "correct": false,
            "explanation": "正確判斷是「−42, 214」。無號 0xD6＝214；最高位為 1，有號值為 214−256＝−42。"
          },
          {
            "label": "−42, 86",
            "correct": false,
            "explanation": "正確判斷是「−42, 214」。無號 0xD6＝214；最高位為 1，有號值為 214−256＝−42。"
          },
          {
            "label": "214, −42",
            "correct": false,
            "explanation": "正確判斷是「−42, 214」。無號 0xD6＝214；最高位為 1，有號值為 214−256＝−42。"
          },
          {
            "label": "−42, 214",
            "correct": true,
            "explanation": "無號 0xD6＝214；最高位為 1，有號值為 214−256＝−42。"
          }
        ]
      },
      {
        "id": "practice-44",
        "unit": "binary-integers",
        "page": 67,
        "concept": "signed-overflow",
        "level": "分析",
        "prompt": "Adding 0x90 and 0x90 in eight bits produces 0x20. Which explanation is correct for signed two's-complement addition?",
        "options": [
          {
            "label": "The exact signed sum is 32, so no overflow occurs.",
            "correct": false,
            "explanation": "正確判斷是「The exact signed sum is −224; 0x20 has the opposite sign because of overflow.」。0x90 解成 −112，兩個負數相加得到正號的低八位，正確值超界。"
          },
          {
            "label": "A carry out is absent, so overflow is impossible.",
            "correct": false,
            "explanation": "正確判斷是「The exact signed sum is −224; 0x20 has the opposite sign because of overflow.」。0x90 解成 −112，兩個負數相加得到正號的低八位，正確值超界。"
          },
          {
            "label": "The exact signed sum is −224; 0x20 has the opposite sign because of overflow.",
            "correct": true,
            "explanation": "0x90 解成 −112，兩個負數相加得到正號的低八位，正確值超界。"
          },
          {
            "label": "Both operands are positive 144.",
            "correct": false,
            "explanation": "正確判斷是「The exact signed sum is −224; 0x20 has the opposite sign because of overflow.」。0x90 解成 −112，兩個負數相加得到正號的低八位，正確值超界。"
          }
        ]
      },
      {
        "id": "practice-45",
        "unit": "floating-point",
        "page": 77,
        "concept": "floating-fields",
        "level": "分析",
        "prompt": "In the course's toy format, keep four bits of normalized 0.ffff₂ by truncation. What value is stored for 2.625?",
        "options": [
          {
            "label": "2.625",
            "correct": false,
            "explanation": "正確判斷是「2.5」。2.625＝0.10101₂×2²；截成 0.1010₂×2² 得 2.5。"
          },
          {
            "label": "2.5",
            "correct": true,
            "explanation": "2.625＝0.10101₂×2²；截成 0.1010₂×2² 得 2.5。"
          },
          {
            "label": "2.75",
            "correct": false,
            "explanation": "正確判斷是「2.5」。2.625＝0.10101₂×2²；截成 0.1010₂×2² 得 2.5。"
          },
          {
            "label": "1.3125",
            "correct": false,
            "explanation": "正確判斷是「2.5」。2.625＝0.10101₂×2²；截成 0.1010₂×2² 得 2.5。"
          }
        ]
      },
      {
        "id": "practice-46",
        "unit": "floating-point",
        "page": 81,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "For −0.75 in IEEE 754 binary32, what are S and the unsigned E field?",
        "options": [
          {
            "label": "S = 1, E = 126",
            "correct": true,
            "explanation": "符號獨立；0.75 的正規化指數是 −1，E＝127−1。"
          },
          {
            "label": "S = 0, E = 126",
            "correct": false,
            "explanation": "正確判斷是「S = 1, E = 126」。符號獨立；0.75 的正規化指數是 −1，E＝127−1。"
          },
          {
            "label": "S = 1, E = 127",
            "correct": false,
            "explanation": "正確判斷是「S = 1, E = 126」。符號獨立；0.75 的正規化指數是 −1，E＝127−1。"
          },
          {
            "label": "S = 1, E = 254",
            "correct": false,
            "explanation": "正確判斷是「S = 1, E = 126」。符號獨立；0.75 的正規化指數是 −1，E＝127−1。"
          }
        ]
      },
      {
        "id": "practice-47",
        "unit": "reliability",
        "page": 92,
        "concept": "compression",
        "level": "分析",
        "prompt": "A simple run-length encoder stores each run as one count byte and one symbol byte. Which input grows to exactly twice its original byte count?",
        "options": [
          {
            "label": "A sequence with runs of exactly two symbols",
            "correct": false,
            "explanation": "正確判斷是「A sequence in which every symbol differs from the immediately preceding symbol」。每個符號各成一段，大小從每段 1 byte 變成 2 bytes。"
          },
          {
            "label": "A single run of six identical symbols",
            "correct": false,
            "explanation": "正確判斷是「A sequence in which every symbol differs from the immediately preceding symbol」。每個符號各成一段，大小從每段 1 byte 變成 2 bytes。"
          },
          {
            "label": "A sequence with runs of exactly three symbols",
            "correct": false,
            "explanation": "正確判斷是「A sequence in which every symbol differs from the immediately preceding symbol」。每個符號各成一段，大小從每段 1 byte 變成 2 bytes。"
          },
          {
            "label": "A sequence in which every symbol differs from the immediately preceding symbol",
            "correct": true,
            "explanation": "每個符號各成一段，大小從每段 1 byte 變成 2 bytes。"
          }
        ]
      },
      {
        "id": "practice-48",
        "unit": "reliability",
        "page": 93,
        "concept": "compression",
        "level": "計算",
        "prompt": "Huffman coding combines the two least frequent symbols first. For frequencies 5, 3, 2, 2, what is the weighted total number of encoded bits?",
        "options": [
          {
            "label": "20",
            "correct": false,
            "explanation": "正確判斷是「23」。先合成 4，接著 3＋4＝7，最後 5＋7＝12；加總 4＋7＋12＝23。"
          },
          {
            "label": "24",
            "correct": false,
            "explanation": "正確判斷是「23」。先合成 4，接著 3＋4＝7，最後 5＋7＝12；加總 4＋7＋12＝23。"
          },
          {
            "label": "23",
            "correct": true,
            "explanation": "先合成 4，接著 3＋4＝7，最後 5＋7＝12；加總 4＋7＋12＝23。"
          },
          {
            "label": "27",
            "correct": false,
            "explanation": "正確判斷是「23」。先合成 4，接著 3＋4＝7，最後 5＋7＝12；加總 4＋7＋12＝23。"
          }
        ]
      },
      {
        "id": "practice-49",
        "unit": "reliability",
        "page": 97,
        "concept": "parity",
        "level": "分析",
        "prompt": "Each of the four eight-bit words 10000001, 11100001, 01010111, 11000000 includes an even parity bit. Which word must be flagged?",
        "options": [
          {
            "label": "10000001",
            "correct": false,
            "explanation": "正確判斷是「01010111」。四組各有 2、4、5、2 個 1，第三組違反偶同位。"
          },
          {
            "label": "01010111",
            "correct": true,
            "explanation": "四組各有 2、4、5、2 個 1，第三組違反偶同位。"
          },
          {
            "label": "11100001",
            "correct": false,
            "explanation": "正確判斷是「01010111」。四組各有 2、4、5、2 個 1，第三組違反偶同位。"
          },
          {
            "label": "11000000",
            "correct": false,
            "explanation": "正確判斷是「01010111」。四組各有 2、4、5、2 個 1，第三組違反偶同位。"
          }
        ]
      },
      {
        "id": "practice-50",
        "unit": "reliability",
        "page": 101,
        "concept": "parity",
        "level": "計算",
        "prompt": "Parity P is the XOR of three data bytes. Given P = 0xD2 and surviving data bytes 0x6F and 0xB8, what was the missing byte?",
        "options": [
          {
            "label": "0x05",
            "correct": true,
            "explanation": "D2 XOR 6F XOR B8＝05。"
          },
          {
            "label": "0xD7",
            "correct": false,
            "explanation": "正確判斷是「0x05」。D2 XOR 6F XOR B8＝05。"
          },
          {
            "label": "0x1B",
            "correct": false,
            "explanation": "正確判斷是「0x05」。D2 XOR 6F XOR B8＝05。"
          },
          {
            "label": "0xE5",
            "correct": false,
            "explanation": "正確判斷是「0x05」。D2 XOR 6F XOR B8＝05。"
          }
        ]
      },
      {
        "id": "practice-51",
        "unit": "binary-integers",
        "page": 65,
        "concept": "bit-interpretation",
        "level": "計算",
        "prompt": "What values does 0x9C represent as an unsigned byte and as an 8-bit two’s complement byte, respectively?",
        "options": [
          {
            "label": "156 and −28",
            "correct": false,
            "explanation": "正確判斷是「156 and −100」。十六進位 9C＝156。最高位為 1，有號解讀需減 256。"
          },
          {
            "label": "100 and −156",
            "correct": false,
            "explanation": "正確判斷是「156 and −100」。十六進位 9C＝156。最高位為 1，有號解讀需減 256。"
          },
          {
            "label": "−100 and 156",
            "correct": false,
            "explanation": "正確判斷是「156 and −100」。十六進位 9C＝156。最高位為 1，有號解讀需減 256。"
          },
          {
            "label": "156 and −100",
            "correct": true,
            "explanation": "十六進位 9C＝156。最高位為 1，有號解讀需減 256。"
          }
        ]
      },
      {
        "id": "practice-52",
        "unit": "binary-integers",
        "page": 65,
        "concept": "bit-interpretation",
        "level": "判讀",
        "prompt": "Which bit weight changes between unsigned and two’s complement interpretations of the same 8-bit pattern?",
        "options": [
          {
            "label": "The lowest bit changes from +1 to −1.",
            "correct": false,
            "explanation": "正確判斷是「The highest bit changes from +128 to −128.」。其餘七位仍是 64、32、16、8、4、2、1。"
          },
          {
            "label": "All bit weights become negative.",
            "correct": false,
            "explanation": "正確判斷是「The highest bit changes from +128 to −128.」。其餘七位仍是 64、32、16、8、4、2、1。"
          },
          {
            "label": "The highest bit changes from +128 to −128.",
            "correct": true,
            "explanation": "其餘七位仍是 64、32、16、8、4、2、1。"
          },
          {
            "label": "Only the bit with weight 64 becomes negative.",
            "correct": false,
            "explanation": "正確判斷是「The highest bit changes from +128 to −128.」。其餘七位仍是 64、32、16、8、4、2、1。"
          }
        ]
      },
      {
        "id": "practice-53",
        "unit": "floating-point",
        "page": 75,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "In the toy format, what is the actual exponent when the three-bit exponent field is 010 and the bias is 3?",
        "options": [
          {
            "label": "2",
            "correct": false,
            "explanation": "正確判斷是「−1」。二進位 010 是 2，扣掉 3 得 −1。"
          },
          {
            "label": "−1",
            "correct": true,
            "explanation": "二進位 010 是 2，扣掉 3 得 −1。"
          },
          {
            "label": "3",
            "correct": false,
            "explanation": "正確判斷是「−1」。二進位 010 是 2，扣掉 3 得 −1。"
          },
          {
            "label": "5",
            "correct": false,
            "explanation": "正確判斷是「−1」。二進位 010 是 2，扣掉 3 得 −1。"
          }
        ]
      },
      {
        "id": "practice-54",
        "unit": "floating-point",
        "page": 75,
        "concept": "floating-fields",
        "level": "計算",
        "prompt": "In the toy format with bias 3, decode the byte 10101000 using a 0.xxxx significand.",
        "options": [
          {
            "label": "−0.25",
            "correct": true,
            "explanation": "符號為負、指數 010 扣偏移得 −1，有效數字 0.1000₂ 是 0.5，因此結果為 −0.25。"
          },
          {
            "label": "−0.5",
            "correct": false,
            "explanation": "正確判斷是「−0.25」。符號為負、指數 010 扣偏移得 −1，有效數字 0.1000₂ 是 0.5，因此結果為 −0.25。"
          },
          {
            "label": "0.25",
            "correct": false,
            "explanation": "正確判斷是「−0.25」。符號為負、指數 010 扣偏移得 −1，有效數字 0.1000₂ 是 0.5，因此結果為 −0.25。"
          },
          {
            "label": "−1",
            "correct": false,
            "explanation": "正確判斷是「−0.25」。符號為負、指數 010 扣偏移得 −1，有效數字 0.1000₂ 是 0.5，因此結果為 −0.25。"
          }
        ]
      }
    ],
    "exam": [
      {
        "title": "Simplify a circuit and trace storage",
        "setup": "Let F = (A AND B) OR (A AND NOT B). F feeds D of a rising-edge D flip-flop with Q initially 0. At three successive rising edges, (A,B) is (1,0), (0,1), and (1,1).",
        "pages": [
          6,
          8,
          24
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter Q immediately after the three edges as three bits. Write the four-row truth table for F and give a simpler Boolean expression.",
            "fields": [
              {
                "id": "answer",
                "label": "Q after the three edges",
                "format": "bits",
                "answer": "101",
                "points": 5
              }
            ],
            "model": "F＝A(B＋¬B)＝A。按 00、01、10、11 順序的 F 是 0011；三次邊緣鎖住 1、0、1。",
            "trap": "把 A、B 丟進真值表時，確認同一列在算哪組輸入。",
            "criteria": [
              [
                5,
                "列出 F 的四列輸入與正確輸出"
              ],
              [
                5,
                "用布林代數化簡，說明 Q 何時更新"
              ]
            ]
          }
        ]
      },
      {
        "title": "Read the same byte as signed and unsigned",
        "setup": "An 8-bit storage cell contains 0xB2. Addition retains only the low eight bits.",
        "pages": [
          27,
          63,
          64,
          67
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Give its signed two's-complement decimal value. Also state its unsigned value and explain what happens if it is added to another copy of itself as a signed value.",
            "fields": [
              {
                "id": "answer",
                "label": "Signed decimal value",
                "format": "signed-integer",
                "answer": -78,
                "points": 5
              }
            ],
            "model": "0xB2＝178，按二補數是 178−256＝−78；相加真值 −156 超出範圍，低八位是 0x64（+100）。",
            "trap": "同一 bit pattern 有不同解讀，先確認題目指定的表示法。",
            "criteria": [
              [
                3,
                "給無號值與有號解讀關係"
              ],
              [
                2,
                "列出真實總和及低位，解釋有號溢位"
              ]
            ]
          }
        ]
      },
      {
        "title": "Trace finite precision",
        "setup": "Use an instructional format s eee ffff with value (−1)^s × 0.ffff₂ × 2^(eee−3). For positive normalized numbers the first fraction bit is 1. Truncate toward zero when encoding. Compute x = encode(0.3), then encode(x + x).",
        "pages": [
          71,
          75,
          77,
          78
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Give the final eight bits without spaces. Show the truncated binary significand and the decimal value of the final result.",
            "fields": [
              {
                "id": "answer",
                "label": "Final encoded bits",
                "format": "bits",
                "answer": "00111001",
                "points": 5
              }
            ],
            "model": "0.3 的二進位展開為 0.010011…₂＝0.10011…₂×2⁻¹，保留 1001，得 0.28125。加倍得 0.5625＝0.1001₂×2⁰；欄位是 0 011 1001。",
            "trap": "明確用試題給定的 0.ffff 截斷模型，與 IEEE 754 正規單精度的規則不同。",
            "criteria": [
              [
                5,
                "寫出首次編碼的有效位與解回值"
              ],
              [
                5,
                "寫出第二次實際指數、欄位與解回結果"
              ]
            ]
          }
        ]
      },
      {
        "title": "Size a disk and an image workload",
        "setup": "A disk has 3 platters, 2 recording surfaces per platter, 320 tracks per surface, 40 sectors per track, and 512 bytes per sector. An RGB image has 1920 × 1080 pixels at 24 bits/pixel and no headers.",
        "pages": [
          33,
          36,
          37,
          51
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Enter the disk capacity in bytes. Show how many complete images fit, ignoring file-system overhead.",
            "fields": [
              {
                "id": "answer",
                "label": "Raw disk bytes",
                "format": "integer",
                "answer": 39321600,
                "points": 5
              }
            ],
            "model": "6×320×40×512＝39,321,600 bytes；每張 1920×1080×3＝6,220,800 bytes，整除得 6 張。",
            "trap": "像素位深先除以 8，完整檔案張數向下取整。",
            "criteria": [
              [
                3,
                "正確辨認有 6 個可記錄面並列容量的乘式"
              ],
              [
                2,
                "算出每張 byte 數和可完整存入的張數"
              ]
            ]
          }
        ]
      },
      {
        "title": "Choose a representation or memory device",
        "setup": "A scanner produces a pixel image. A device needs volatile main memory for buffers and rewritable nonvolatile storage for firmware.",
        "pages": [
          31,
          32,
          42,
          48,
          51
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Compare a raster image with a vector drawing and choose a suitable memory type for each role. Explain how refresh and power loss affect your choices.",
            "model": "點陣圖保存像素值，向量由形狀與座標描述繪圖。緩衝可用 DRAM，需刷新且斷電內容會消失；可更新韌體可用 flash／EEPROM，斷電仍保存。",
            "trap": "RAM 的可隨機存取和是否揮發應分開說明。",
            "criteria": [
              [
                4,
                "比較 raster 與 vector 的資料表示"
              ],
              [
                3,
                "說明 DRAM 的用途、刷新與揮發性"
              ],
              [
                3,
                "說明非揮發媒體允許保留及更新韌體"
              ]
            ]
          }
        ]
      },
      {
        "title": "Compare Huffman coding with fixed width",
        "setup": "The message has symbol frequencies A:7, B:4, C:2, D:1, E:1. Use binary Huffman coding and compare with three-bit fixed-width codes. Ignore codebook cost.",
        "pages": [
          92,
          93
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter the Huffman payload length in bits. Give any valid Huffman construction and the savings compared with fixed width.",
            "fields": [
              {
                "id": "answer",
                "label": "Huffman payload bits",
                "format": "integer",
                "answer": 29,
                "points": 5
              }
            ],
            "model": "合併 1＋1＝2，2＋2＝4，4＋4＝8，7＋8＝15；合併權重和為 2＋4＋8＋15＝29。固定寬度為 15×3＝45，省 16 bits。",
            "trap": "同權重交換左右分支可產生不同但等長的前綴碼。",
            "criteria": [
              [
                5,
                "依最小權重順序給出合併或前綴碼樹"
              ],
              [
                5,
                "正確比較固定寬度與壓縮長度"
              ]
            ]
          }
        ]
      },
      {
        "title": "Compare dictionary and run-length coding",
        "setup": "Use a run-length scheme that stores a one-byte count and one byte per symbol. Two 8-byte inputs are AAAAAAAA and ABABABAB.",
        "pages": [
          92,
          93
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Give the resulting byte lengths. Explain how a dictionary-based encoder could still exploit repeated substrings in the alternating input.",
            "model": "連續 8 個 A 只需 2 bytes；交錯輸入成 8 個長度一的游程，共 16 bytes。LZW 可為 AB、BA 等重複片段建立字典代碼，後續使用代碼代表片段。",
            "trap": "游程要求連續相同項，重複字串可包含不同項。",
            "criteria": [
              [
                4,
                "正確算出第一種輸出的 2 bytes"
              ],
              [
                3,
                "正確算出第二種的 16 bytes"
              ],
              [
                3,
                "說明字典可重用重複片段，並舉實例"
              ]
            ]
          }
        ]
      },
      {
        "title": "Detect corruption and reconstruct a missing block",
        "setup": "An eight-bit word 10011010 includes an even-parity bit. Elsewhere, RAID uses P = A XOR B XOR C. P = 0xA7, A = 0x31, and C = 0xC0.",
        "pages": [
          97,
          101
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter the missing byte B as eight binary digits. Explain whether the received word passes, and how a corrupted word could pass.",
            "fields": [
              {
                "id": "answer",
                "label": "Missing byte B",
                "format": "bits",
                "answer": "01010110",
                "points": 5
              }
            ],
            "model": "0xA7 XOR 0x31 XOR 0xC0＝0x56＝01010110。收到的位元串有 4 個 1，偶同位通過。若翻轉兩位，奇偶性不變。",
            "trap": "偶同位驗證的結論是奇偶相符，無法證明資料完全正確。",
            "criteria": [
              [
                5,
                "寫出 XOR 重建式和資料代換"
              ],
              [
                5,
                "數出 4 個 1，並說明偶數次翻轉可能漏檢"
              ]
            ]
          }
        ]
      },
      {
        "title": "Build a small LZW dictionary",
        "setup": "Encode ABABABA with initial dictionary A = 0 and B = 1. The next new dictionary code is 2. At each step emit the longest existing phrase and add that phrase followed by the next character, when there is one.",
        "bonus": true,
        "pages": [
          92,
          93
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Enter the emitted codes in order. Show the new dictionary phrases and explain where the encoder emits the final phrase.",
            "fields": [
              {
                "id": "answer",
                "label": "Emitted codes",
                "format": "integer-list",
                "answer": [
                  0,
                  1,
                  2,
                  4
                ],
                "points": 5
              }
            ],
            "model": "依序輸出 A(0)，新增 AB(2)；輸出 B(1)，新增 BA(3)；輸出 AB(2)，新增 ABA(4)；最後輸出 ABA(4)。",
            "trap": "最後一段後面沒有字元，所以不能再建新片段。",
            "criteria": [
              [
                3,
                "依新增順序列出 AB、BA、ABA"
              ],
              [
                2,
                "指出最後一段已在字典內，輸出 4 且不再新增"
              ]
            ]
          }
        ]
      }
    ],
    "legacyExam": [
      {
        "title": "二進位與二補數小測",
        "pages": [
          58,
          65,
          66,
          67
        ],
        "setup": "在有號計算題中，運算結果只保留低 4 位，並以二補數解讀。",
        "parts": [
          {
            "points": 5,
            "prompt": "把 1011₂ 轉成十進位，再把 −6 寫成 4 位二補數。簡述編碼步驟。",
            "fields": [
              {
                "id": "decimal",
                "label": "1011₂ 的十進位值",
                "format": "integer",
                "answer": 11,
                "points": 2
              },
              {
                "id": "encoding",
                "label": "−6 的 4 位二補數",
                "format": "bits",
                "answer": "1010",
                "points": 2
              }
            ],
            "criteria": [
              [
                1,
                "寫出 0110 → 1001 → 1010，或用 −8 + 2 驗算。"
              ]
            ],
            "model": "1011₂ = 8 + 2 + 1 = 11。把 0110 逐位反相，再加 1 得 1010。",
            "trap": "只反相少做加 1，會得到 1001。"
          },
          {
            "points": 5,
            "prompt": "計算 4 位二補數 0101 + 0100。寫下低 4 位與其有號解讀，說明是否溢位。",
            "fields": [
              {
                "id": "bits",
                "label": "保留的低 4 位",
                "format": "bits",
                "answer": "1001",
                "points": 2
              },
              {
                "id": "signed",
                "label": "低 4 位解讀出的有號整數",
                "format": "signed-integer",
                "answer": -7,
                "points": 2
              }
            ],
            "criteria": [
              [
                1,
                "5 + 4 = 9 超出 4 位有號範圍，因此有溢位。"
              ]
            ],
            "model": "低 4 位為 1001，按二補數讀成 −7；正確的 9 超出 −8 至 7，所以有溢位。",
            "trap": "這題沒有最高位進位，仍會發生有號溢位。"
          }
        ]
      },
      {
        "title": "IEEE 754 的 0.75",
        "pages": [
          80
        ],
        "setup": "使用課堂的單精度正規表示。",
        "parts": [
          {
            "points": 5,
            "prompt": "填 E 欄解讀成無號整數的值，並寫出原值的規格化二進位形式。",
            "model": "0.75＝0.11₂＝1.1₂×2⁻¹，所以 E＝−1＋127＝126。",
            "trap": "真實指數與欄位整數是不同的值。",
            "fields": [
              {
                "id": "answer",
                "label": "E 欄無號值",
                "format": "integer",
                "answer": 126,
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "寫出 1.1₂×2⁻¹ 以及加 127 的依據。"
              ]
            ]
          }
        ]
      },
      {
        "title": "偶同位檢查",
        "pages": [
          97
        ],
        "setup": "在資料 101101 的末端加上偶同位元。",
        "parts": [
          {
            "points": 5,
            "prompt": "填同位元，並解釋為什麼兩位同時翻轉可能通過。",
            "model": "資料有 4 個 1，偶同位補 0。翻兩位讓 1 的個數總共改變 −2、0 或 2，奇偶維持。",
            "trap": "檢查通過只表示奇偶相符。",
            "fields": [
              {
                "id": "answer",
                "label": "同位元",
                "format": "bits",
                "answer": "0",
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "指出 1 的總數並解釋偶數次翻轉不改變奇偶性。"
              ]
            ]
          }
        ]
      }
    ],
    "terms": [
      [
        "Bit",
        {
          "english": "Bit",
          "chinese": "位元",
          "explanation": "二進位的一位，可為 0 或 1。"
        }
      ],
      [
        "Binary",
        {
          "english": "Binary",
          "chinese": "二進位",
          "explanation": "以 2 為底的數字表示法。位權依位置為 2 的不同次方。"
        }
      ],
      [
        "Place Value",
        {
          "english": "Place Value",
          "chinese": "位權",
          "explanation": "一個數字所在的位置對應的權重。"
        }
      ],
      [
        "Unsigned Integer",
        {
          "english": "Unsigned Integer",
          "chinese": "無號整數",
          "explanation": "不使用負號的整數表示法；n 位可以表示 0 到 2ⁿ−1。"
        }
      ],
      [
        "Remainder",
        {
          "english": "Remainder",
          "chinese": "餘數",
          "explanation": "整數除法除完後剩下的部分。除以 2 時餘數只可能為 0 或 1。"
        }
      ],
      [
        "Carry",
        {
          "english": "Carry",
          "chinese": "進位",
          "explanation": "某欄結果超過該欄能容納的值，送到下一個較高位的部分。"
        }
      ],
      [
        "Binary Fraction",
        {
          "english": "Binary Fraction",
          "chinese": "二進位小數",
          "explanation": "小數點右側依序使用 2⁻¹、2⁻²、2⁻³ 等位權。"
        }
      ],
      [
        "Two’s Complement",
        {
          "english": "Two’s Complement",
          "chinese": "二補數",
          "explanation": "固定 n 位的有號整數表示法。最高位權重為 −2ⁿ⁻¹，其餘位權為正。"
        }
      ],
      [
        "Sign Bit",
        {
          "english": "Sign Bit",
          "chinese": "符號位元",
          "explanation": "二補數的最高位。1 表示負值，0 表示零或正值。"
        }
      ],
      [
        "Bit Width",
        {
          "english": "Bit Width",
          "chinese": "位元寬度",
          "explanation": "固定表示一個數值所使用的位元數。"
        }
      ],
      [
        "Overflow",
        {
          "english": "Overflow",
          "chinese": "溢位",
          "explanation": "正確計算結果超出目前表示法能容納的範圍。"
        }
      ],
      [
        "Boolean Operation",
        {
          "english": "Boolean Operation",
          "chinese": "布林運算",
          "explanation": "以真假作為輸入和輸出的運算。"
        }
      ],
      [
        "Logic Gate",
        {
          "english": "Logic Gate",
          "chinese": "邏輯閘",
          "explanation": "實作布林運算的電路元件。"
        }
      ],
      [
        "Flip-Flop",
        {
          "english": "Flip-Flop",
          "chinese": "正反器",
          "explanation": "可以保存一位狀態的數位儲存電路。"
        }
      ],
      [
        "Hexadecimal",
        {
          "english": "Hexadecimal",
          "chinese": "十六進位",
          "explanation": "基數 16，使用 0–9 及 A–F 作為數字。"
        }
      ],
      [
        "Address",
        {
          "english": "Address",
          "chinese": "位址",
          "explanation": "指定某個可讀寫位置的編號。"
        }
      ],
      [
        "Byte",
        {
          "english": "Byte",
          "chinese": "位元組",
          "explanation": "現代常用定義為八個位元。"
        }
      ],
      [
        "RAM",
        {
          "english": "RAM",
          "chinese": "隨機存取記憶體",
          "explanation": "可依位址存取各個位置的記憶體。"
        }
      ],
      [
        "Flash Memory",
        {
          "english": "Flash Memory",
          "chinese": "快閃記憶體",
          "explanation": "利用電荷狀態長期保存位元的儲存媒體。"
        }
      ],
      [
        "Encoding",
        {
          "english": "Encoding",
          "chinese": "編碼",
          "explanation": "把文字、數字或其他資訊轉成規則化的資料。"
        }
      ],
      [
        "Sampling",
        {
          "english": "Sampling",
          "chinese": "取樣",
          "explanation": "在離散位置或時間量測原訊號。"
        }
      ],
      [
        "Quantization",
        {
          "english": "Quantization",
          "chinese": "量化",
          "explanation": "將測量值映射到有限的數值等級。"
        }
      ],
      [
        "Excess Notation",
        {
          "english": "Excess Notation",
          "chinese": "偏移表示法",
          "explanation": "儲存值為真實值加上一個固定偏移量。"
        }
      ],
      [
        "Floating Point",
        {
          "english": "Floating Point",
          "chinese": "浮點數",
          "explanation": "用符號、有效數字和指數描述有小數點的數。"
        }
      ],
      [
        "Lossless Compression",
        {
          "english": "Lossless Compression",
          "chinese": "無損壓縮",
          "explanation": "解碼後還原一模一樣的輸入資料。"
        }
      ],
      [
        "Huffman Coding",
        {
          "english": "Huffman Coding",
          "chinese": "霍夫曼編碼",
          "explanation": "依頻率合併最小權重，建出可唯一解碼的二元前綴碼。"
        }
      ],
      [
        "Lossy Compression",
        {
          "english": "Lossy Compression",
          "chinese": "有損壓縮",
          "explanation": "允許捨棄部分資訊以減少資料量。"
        }
      ],
      [
        "Parity Bit",
        {
          "english": "Parity Bit",
          "chinese": "同位元",
          "explanation": "使整組位元的 1 數符合指定的奇偶性。"
        }
      ],
      [
        "Hamming Distance",
        {
          "english": "Hamming Distance",
          "chinese": "漢明距離",
          "explanation": "兩串等長位元在多少個位置不同。"
        }
      ],
      [
        "RAID",
        {
          "english": "RAID",
          "chinese": "磁碟陣列",
          "explanation": "配置多顆磁碟共同提供一組儲存空間。"
        }
      ],
      [
        "Volatile Memory",
        {
          "english": "Volatile Memory",
          "chinese": "揮發性記憶體",
          "explanation": "斷電後無法保留內容的記憶體。"
        }
      ],
      [
        "DRAM",
        {
          "english": "DRAM",
          "chinese": "動態隨機存取記憶體",
          "explanation": "以電荷儲存位元且需刷新。"
        }
      ],
      [
        "SRAM",
        {
          "english": "SRAM",
          "chinese": "靜態隨機存取記憶體",
          "explanation": "通電時靠電路狀態保留位元。"
        }
      ],
      [
        "ROM",
        {
          "english": "ROM",
          "chinese": "唯讀記憶體",
          "explanation": "用於保存斷電後仍保留的內容。"
        }
      ],
      [
        "EEPROM",
        {
          "english": "EEPROM",
          "chinese": "電氣可擦除可程式唯讀記憶體",
          "explanation": "可用電訊號擦除與重寫的非揮發記憶體。"
        }
      ],
      [
        "EPROM",
        {
          "english": "EPROM",
          "chinese": "可擦除可程式唯讀記憶體",
          "explanation": "可用紫外線擦除的非揮發記憶體。"
        }
      ],
      [
        "Bias",
        {
          "english": "Bias",
          "chinese": "偏移量",
          "explanation": "將有正有負的指數移到無號欄位的固定值。"
        }
      ],
      [
        "Exponent",
        {
          "english": "Exponent",
          "chinese": "指數",
          "explanation": "決定浮點數量級的欄位。"
        }
      ],
      [
        "Significand",
        {
          "english": "Significand",
          "chinese": "有效數字",
          "explanation": "浮點數中會乘上基底次方的部分。"
        }
      ],
      [
        "Truncation",
        {
          "english": "Truncation",
          "chinese": "截斷",
          "explanation": "超出欄位的低位直接捨去。"
        }
      ],
      [
        "Underflow",
        {
          "english": "Underflow",
          "chinese": "下溢",
          "explanation": "數值量級太小，低於格式的正常表示範圍。"
        }
      ],
      [
        "Subnormal Number",
        {
          "english": "Subnormal Number",
          "chinese": "次正規數",
          "explanation": "IEEE 格式中指數欄全零且小數欄非零的數。"
        }
      ],
      [
        "NaN",
        {
          "english": "NaN",
          "chinese": "非數值",
          "explanation": "表示未定義或無法用數值描述的浮點結果。"
        }
      ],
      [
        "Run-Length Encoding",
        {
          "english": "Run-Length Encoding",
          "chinese": "游程編碼",
          "explanation": "用一個符號和次數表示連續相同的資料。"
        }
      ],
      [
        "LZW",
        {
          "english": "LZW",
          "chinese": "LZW 字典壓縮",
          "explanation": "使用逐步建立的字典替重複字串編號。"
        }
      ]
    ],
    "previousExamLength": 1,
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
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101
    ]
  };
  course.terms = new Map(course.terms);
  course.figurePages = new Set(course.figurePages);
  StudySite.registerCourse(course);
})();
