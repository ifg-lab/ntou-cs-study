"use strict";

StudySite.registerCourseStudy("lecture-01", {
  "terms": {
    "Algorithm": {
      "explanation": "先說明合法輸入和要回傳的結果，再把方法寫成逐步可執行的操作。迴圈若能為某些合法輸入持續下去，就沒有完成對這些輸入的求解。",
      "exam": "辨認題目要的是規則、實作或輸出。",
      "example": "例如找最小值可先取第一個，再逐一比較剩下的元素並更新目前最小值。",
      "related": [
        [
          "Program",
          "同一演算法可用不同語言實作"
        ],
        [
          "Termination",
          "說明程序何時結束"
        ]
      ]
    },
    "Program": {
      "explanation": "程式還會處理讀取資料、格式、錯誤和顯示。一份程式可組合幾種演算法，而同一演算法也可在多個程式重用。",
      "related": [
        [
          "Algorithm",
          "定義解法本身"
        ],
        [
          "Stored-Program Concept",
          "把機器指令存入記憶體"
        ]
      ]
    },
    "Termination": {
      "explanation": "驗證迴圈怎麼停止時，可找一個不會無限下降的量。對歐幾里得法，每個非零餘數小於原本的除數，所以除數最後會降到零。",
      "exam": "交代停止條件及停下時要回傳哪個值。",
      "example": "歐幾里得法得到 (6,0) 時停下並回傳 6。",
      "related": [
        [
          "Euclidean Algorithm",
          "每輪的除數嚴格減少"
        ]
      ]
    },
    "Abstraction": {
      "explanation": "抽象讓人透過約定操作一個元件。替換內部實作時，呼叫端仍可依原介面的輸入、輸出及行為使用。",
      "exam": "同時指出使用者看得到什麼，以及被隱藏什麼。",
      "example": "使用乘法函式只要給兩個值並取得乘積，內部可使用硬體乘法或加法與位移。",
      "related": [
        [
          "Program",
          "由不同抽象層組成"
        ]
      ]
    },
    "Digitization": {
      "explanation": "以錄音為例，先在離散時刻取樣，再把振幅對應到能儲存的等級；這兩步會限制能保留的細節。",
      "related": [
        [
          "Abstraction",
          "保存與目的相關的資訊"
        ]
      ]
    },
    "Greatest Common Divisor": {
      "explanation": "最大公因數會隨輸入改變。兩個正整數若沒有大於 1 的共同因數，最大公因數是 1；gcd(a,0) 在 a 為正時等於 a。",
      "exam": "餘數變成 0 時，答案是當時的除數。",
      "example": "gcd(48,18) 的最後一個非零餘數為 6，6 同時整除 48 和 18。",
      "related": [
        [
          "Euclidean Algorithm",
          "利用相同公因數集合反覆縮小輸入"
        ]
      ],
      "concept": "gcd"
    },
    "Euclidean Algorithm": {
      "explanation": "若 a＝qb＋r，a、b 的公因數必整除 r；b、r 的公因數也必整除 a。兩組公因數相同，替換便能保留答案。",
      "exam": "寫出每輪的除法與餘數，下一輪把上一輪除數放前面。",
      "example": "48＝2×18＋12，18＝1×12＋6，12＝2×6＋0，所以答案是 6。",
      "related": [
        [
          "Greatest Common Divisor",
          "這套程序計算的結果"
        ],
        [
          "Termination",
          "餘數為零是停止條件"
        ]
      ],
      "concept": "gcd"
    },
    "Punched Card": {
      "explanation": "卡片上的孔本身只是一組可讀取的狀態。織機以它控制經線，製表機把孔讀成資料欄位，意思由各機器決定。",
      "related": [
        [
          "Stored-Program Concept",
          "比較外部介質與記憶體保存指令"
        ]
      ]
    },
    "Stored-Program Concept": {
      "explanation": "程式可預先載入記憶體，CPU 按目前的取指位置讀入指令。更換工作時可改載一組指令；位元的角色由使用方式決定。",
      "exam": "說明早期接線式設定換程式的成本為何較高。",
      "example": "把排序程式的指令放到記憶體另一段，再讓 CPU 從該段起點開始執行。",
      "related": [
        [
          "Program",
          "指令化後能儲存"
        ],
        [
          "Microprocessor",
          "負責取指和執行"
        ]
      ],
      "concept": "stored-program"
    },
    "Transistor": {
      "explanation": "在數位電路，電晶體可組成閘與記憶體。大量元件放到同一晶片後，縮短互連也可改善速度和功耗。",
      "related": [
        [
          "Integrated Circuit",
          "把大量元件整合到一塊晶片"
        ]
      ]
    },
    "Integrated Circuit": {
      "explanation": "把元件在晶片內互連，可以減少裝配大型電路時的外部連接。積體電路可以實作處理器、儲存空間或其他功能。",
      "related": [
        [
          "Microprocessor",
          "以積體電路實作 CPU"
        ],
        [
          "Transistor",
          "積體電路的構成元件"
        ]
      ]
    },
    "Microprocessor": {
      "explanation": "早期 CPU 可能跨多塊板；把功能整合進晶片降低了體積與成本。現代處理器可在單一封裝中使用多裸晶設計。",
      "related": [
        [
          "Integrated Circuit",
          "處理器依賴的整合技術"
        ]
      ]
    },
    "Parallel Computing": {
      "explanation": "平行工作先把輸入或問題切成多份。若須頻繁同步或傳送資料，時間可能耗在互連，運算單元增加不一定成比例加速。",
      "related": [
        [
          "Abstraction",
          "由介面隱藏部分分工細節"
        ]
      ]
    },
    "Input": {
      "explanation": "先寫清楚資料型態和允許範圍。例如求最大值的輸入若允許空集合，規格就要說明這種情況的結果。",
      "related": [
        [
          "Output",
          "輸入決定可能的結果"
        ],
        [
          "Boundary Case",
          "邊界值可揭露未處理的輸入"
        ]
      ]
    },
    "Output": {
      "explanation": "輸出規格要明確到可以驗證。例如陣列最大值應是輸入中的一項，而且不小於任何一項。",
      "related": [
        [
          "Input",
          "用來定義輸出要滿足的條件"
        ]
      ]
    },
    "Conditional Branch": {
      "explanation": "先評估條件，再執行相符的分支。若規格把同分算作通過，判斷式要用大於或等於，而非僅大於。",
      "related": [
        [
          "Loop",
          "迴圈也用條件決定是否繼續"
        ]
      ]
    },
    "Loop": {
      "explanation": "描述迴圈時要交代初值、每輪的狀態改變和停止條件。遺漏狀態更新容易反覆處理同一筆資料。",
      "exam": "追蹤前兩輪和最後一輪。",
      "example": "求最大值時每讀一項，索引加一，並視情況更新目前最大值。",
      "related": [
        [
          "Termination",
          "定義何時離開迴圈"
        ]
      ]
    },
    "Termination Condition": {
      "explanation": "歐幾里得演算法在第二個值等於零時停下。還可以證明第二個值每輪減小且不會低於零，所以總會抵達條件。",
      "related": [
        [
          "Euclidean Algorithm",
          "餘數為零是停止訊號"
        ],
        [
          "Termination",
          "從條件和狀態證明確實會停止"
        ]
      ],
      "concept": "gcd"
    },
    "Loop Invariant": {
      "explanation": "可先證明初始化成立，再說明一次更新會保持它，最後利用它證明輸出。求最大值的例子是處理過前 k 項後，目前值就是這 k 項的最大值。",
      "exam": "分初始、維持與結束三步解說。",
      "example": "讀完 −7、−2 時記為 −2，再讀 −5 後仍為 −2。",
      "related": [
        [
          "Loop",
          "每輪保持的性質"
        ],
        [
          "Greatest Common Divisor",
          "替換數對前後最大公因數相同"
        ]
      ]
    },
    "Boundary Case": {
      "explanation": "用最短輸入、等值或剛好越界的值驗證規格。若只測常見正數，可能漏掉全負時以零初始化的錯誤。",
      "exam": "挑一組輸入能讓錯法和正法得出不同結果。",
      "example": "陣列只有 −3 時，正確最大值是 −3。",
      "related": [
        [
          "Input",
          "先看規格允許哪些值"
        ]
      ],
      "concept": "algorithm"
    },
    "ENIAC": {
      "explanation": "原始配置用接線和開關設定工作。這有助於比較硬體既定的資料路徑與後來從記憶體取指的做法。",
      "related": [
        [
          "Stored-Program Concept",
          "比較兩種換工作的做法"
        ]
      ]
    },
    "Jacquard Loom": {
      "explanation": "卡片序列控制織圖。卡片讓圖樣選擇與機械結構分離，換卡就可改變編織結果。",
      "related": [
        [
          "Punched Card",
          "提供可讀取的控制指示"
        ]
      ]
    }
  }
});
