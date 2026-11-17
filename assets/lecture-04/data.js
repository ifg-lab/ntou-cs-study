"use strict";

(() => {
  const course = {
    "id": "lecture-04",
    "label": "Chapter 3",
    "title": "作業系統",
    "english": "Operating systems",
    "lead": "跟著程序輪流使用 CPU，觀察記憶體如何隔離，以及兩個程序何時會互相卡住。",
    "artTerms": [
      "RAM",
      "PID",
      "OS",
      "I/O",
      "CPU"
    ],
    "source": "Chapter 3 作業系統講義",
    "availableNote": "頁碼依 PDF 順序。每頁可展開原投影片圖。",
    "examSource": "英文模擬題參考手邊可辨讀的 2018、2022、2025 和 2026 年小考、期中與期末題型，按教材範圍改寫。評分規準及解析以繁體中文呈現。",
    "questionLanguage": "en",
    "examMinutes": 45,
    "units": [
      {
        "id": "responsibilities",
        "start": 1,
        "end": 14,
        "title": "作業系統與資源管理",
        "description": "CPU、記憶體、裝置和檔案"
      },
      {
        "id": "time-sharing",
        "start": 15,
        "end": 24,
        "title": "批次、分時與多工",
        "description": "回應時間、搶占和程序切換"
      },
      {
        "id": "system-layers",
        "start": 25,
        "end": 34,
        "title": "系統層次與虛擬記憶體",
        "description": "Shell、核心、映射和開機"
      },
      {
        "id": "processes",
        "start": 35,
        "end": 41,
        "title": "程序、排程與同步",
        "description": "程序狀態、臨界區和並行"
      },
      {
        "id": "deadlock",
        "start": 42,
        "end": 65,
        "title": "死結、飢餓與安全",
        "description": "七種情境和四個必要條件"
      },
      {
        "id": "linux",
        "start": 66,
        "end": 89,
        "title": "Linux 核心、發行版與目錄",
        "description": "系統分工和路徑判讀"
      }
    ],
    "slides": [
      {
        "page": 1,
        "title": "作業系統導讀",
        "paragraphs": [
          "作業系統讓程式能共同使用處理器、記憶體和裝置，也隔離各程式的操作。"
        ],
        "terms": []
      },
      {
        "page": 2,
        "title": "作業系統為誰服務",
        "paragraphs": [
          "應用程式透過系統提供的介面使用硬體。使用者在同一台設備上也能有彼此隔離的環境。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 3,
        "title": "作業系統學習重點",
        "paragraphs": [
          "先看執行環境和資源管理，再練並行、死結和安全，最後用 Linux 實例辨認各層。"
        ],
        "terms": []
      },
      {
        "page": 4,
        "title": "桌面與伺服器的作業系統",
        "paragraphs": [
          "同一類資源管理問題可出現在多種系統。辨認產品時也要分清底層核心和使用者看到的環境。"
        ],
        "terms": []
      },
      {
        "page": 5,
        "title": "行動裝置的作業系統",
        "paragraphs": [
          "與桌面系統共享程序和記憶體等概念，還需處理感測器、背景執行及電力。"
        ],
        "terms": []
      },
      {
        "page": 6,
        "title": "OS 提供的服務",
        "paragraphs": [
          "提供檔案、程式執行與 I/O 介面，並決定程式能使用哪些資源。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 7,
        "title": "早期作業以工作為單位",
        "paragraphs": [
          "一個 job 是一組提交給電腦執行的工作。操作者先準備程序和資料，再排入執行。"
        ],
        "terms": [
          "Batch Processing"
        ]
      },
      {
        "page": 8,
        "title": "批次佇列",
        "paragraphs": [
          "系統依排程從隊列選取工作執行。提交者通常要等完成後才取得輸出。"
        ],
        "terms": [
          "Batch Processing",
          "Scheduler"
        ]
      },
      {
        "page": 9,
        "title": "資源管理全覽",
        "paragraphs": [
          "可以用「現在誰在使用、誰可以使用、誰應該下一個使用」理解各類管理工作。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 10,
        "title": "主記憶體管理",
        "paragraphs": [
          "跟蹤哪些空間已分配，建立程序間的隔離，並在程序結束時回收。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 11,
        "title": "處理器管理",
        "paragraphs": [
          "等待輸入的程序可以暫停執行，OS 選另一個就緒程序使用 CPU。"
        ],
        "terms": [
          "Operating System",
          "Process",
          "Scheduler"
        ]
      },
      {
        "page": 12,
        "title": "裝置管理",
        "paragraphs": [
          "驅動程式提供作業系統能理解的裝置介面，也要處理配置、排隊與錯誤回報。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 13,
        "title": "檔案管理",
        "paragraphs": [
          "目錄幫我們找到名稱。系統還需追蹤檔案所在位置、讀寫方式及權限。"
        ],
        "terms": [
          "Operating System",
          "Path"
        ]
      },
      {
        "page": 14,
        "title": "錯誤與資源統計",
        "paragraphs": [
          "系統需要記錄操作、發現錯誤、量測資源使用，讓管理者能定位問題。"
        ],
        "terms": []
      },
      {
        "page": 15,
        "title": "批次處理的使用情境",
        "paragraphs": [
          "每筆工作先提交，執行期間通常無互動。規律且可預先描述的任務適合這個方式。"
        ],
        "terms": [
          "Batch Processing"
        ]
      },
      {
        "page": 16,
        "title": "看懂批次流程圖",
        "paragraphs": [
          "沿「提交 → 等待 → 執行 → 輸出」追一份工作；排隊時間可能比真正計算時間長。"
        ],
        "terms": [
          "Batch Processing"
        ]
      },
      {
        "page": 17,
        "title": "互動式處理重視回應",
        "paragraphs": [
          "使用者陸續輸入並期待及時回應。過長的單一工作會拖慢其他互動，排程需考量延遲。"
        ],
        "terms": [
          "Batch Processing",
          "Time-Sharing"
        ]
      },
      {
        "page": 18,
        "title": "分時讓多人共用",
        "paragraphs": [
          "快速切換使用 CPU 的程序可提供各人的回應機會。單核心仍可在每個時刻只執行一個工作。"
        ],
        "terms": [
          "Time-Sharing",
          "Scheduler",
          "Concurrency",
          "Time Slice"
        ]
      },
      {
        "page": 19,
        "title": "多道程式的動機",
        "paragraphs": [
          "某個程序等 I/O 時，讓可執行的另一個程序使用 CPU，可以減少閒置。"
        ],
        "terms": []
      },
      {
        "page": 20,
        "title": "讀多道程式時間圖",
        "paragraphs": [
          "先標記各程序的 CPU 區段與等待區段。不同程序的 I/O 與運算可重疊。"
        ],
        "terms": [
          "Time-Sharing",
          "Process",
          "Concurrency"
        ]
      },
      {
        "page": 21,
        "title": "多工",
        "paragraphs": [
          "系統讓多個任務輪流或並行推進。使用者看到多個程式都有進展，底層執行方式取決於核心與排程。"
        ],
        "terms": [
          "Time-Sharing",
          "Scheduler",
          "Concurrency",
          "Time Slice"
        ]
      },
      {
        "page": 22,
        "title": "搶占與非搶占",
        "paragraphs": [
          "搶占式排程可中止仍可執行的當前程序；非搶占通常等待它完成、阻塞或主動交出 CPU。"
        ],
        "terms": [
          "Time-Sharing",
          "Context Switch",
          "Time Slice",
          "Preemption"
        ]
      },
      {
        "page": 23,
        "title": "切換程序需要保存狀態",
        "paragraphs": [
          "先保存目前程序的暫存器、PC 等狀態，再載入下一個的狀態。切換本身也花時間。"
        ],
        "terms": [
          "Time-Sharing",
          "Context Switch",
          "Process",
          "Preemption"
        ]
      },
      {
        "page": 24,
        "title": "平行程式例子",
        "paragraphs": [
          "平行迴圈可分派迭代給不同執行緒。若迭代讀寫同一筆資料，要確保更新順序正確。"
        ],
        "terms": [
          "Critical Section",
          "Concurrency"
        ]
      },
      {
        "page": 25,
        "title": "應用程式與系統軟體",
        "paragraphs": [
          "應用程式完成使用者想做的任務。作業系統提供執行與硬體服務，公用工具通常協助維護及操作。"
        ],
        "terms": [
          "Operating System"
        ]
      },
      {
        "page": 26,
        "title": "程式分類圖",
        "paragraphs": [
          "按職責辨認圖中角色。看起來相似的工具，可分別屬於應用程式或系統工具。"
        ],
        "terms": []
      },
      {
        "page": 27,
        "title": "介面、Shell 與 GUI",
        "paragraphs": [
          "使用者可打指令或點選介面。Shell 解讀命令，可啟動程式或請作業系統提供服務。"
        ],
        "terms": [
          "Kernel",
          "Shell"
        ]
      },
      {
        "page": 28,
        "title": "從使用者到核心",
        "paragraphs": [
          "互動介面接收意圖，核心執行受保護的資源操作。兩者的權限和責任不同。"
        ],
        "terms": [
          "Kernel",
          "Shell"
        ]
      },
      {
        "page": 29,
        "title": "檔名與目錄樹",
        "paragraphs": [
          "一個目錄可含檔案與子目錄。路徑交代從哪一層依哪些名稱尋找。"
        ],
        "terms": [
          "Path"
        ]
      },
      {
        "page": 30,
        "title": "虛擬記憶體",
        "paragraphs": [
          "程序使用虛擬位址，再由系統與硬體轉換。某些頁目前可在 RAM，部分情況則需重新載入。"
        ],
        "terms": [
          "Kernel",
          "Virtual Memory",
          "Page Table",
          "Page Fault",
          "Page Frame"
        ]
      },
      {
        "page": 31,
        "title": "頁表和缺頁",
        "paragraphs": [
          "頁表等資訊描述虛擬頁的映射。若存取的頁不在記憶體，缺頁處理會決定載入或回報無效存取。",
          "兩個程序讀相同虛擬位址，可以用各自的頁表映射到不同實體頁。若合法頁面尚在儲存裝置，缺頁處理載入資料並更新映射，期間可先執行其他程序。"
        ],
        "terms": [
          "Virtual Memory",
          "Blocked State",
          "Page Table",
          "Page Fault",
          "Page Frame"
        ],
        "exam": "按「翻譯與檢查 → 缺頁處理 → 更新映射及重新就緒」回答，並區分合法缺頁與無效存取。"
      },
      {
        "page": 32,
        "title": "共用程式庫的映射",
        "paragraphs": [
          "多個程序的唯讀程式碼頁可對到同一實體頁以節省 RAM。各自的可變資料通常維持獨立。"
        ],
        "terms": [
          "Virtual Memory",
          "Page Table",
          "Page Fault",
          "Page Frame"
        ]
      },
      {
        "page": 33,
        "title": "共用頁面的寫入",
        "paragraphs": [
          "映射共用時要有明確權限。複製後寫入技術可讓不同程序先共用，寫入時再分開。"
        ],
        "terms": [
          "Virtual Memory"
        ]
      },
      {
        "page": 34,
        "title": "開機載入器",
        "paragraphs": [
          "韌體先啟動必要硬體，接著載入器讓作業系統核心進入可執行環境。細節隨平台不同。"
        ],
        "terms": [
          "Kernel"
        ]
      },
      {
        "page": 35,
        "title": "協調程式的執行",
        "paragraphs": [
          "系統為每個執行中的程式管理執行狀態、資源及等待原因，然後選擇下一個能執行的工作。"
        ],
        "terms": [
          "Operating System",
          "Process"
        ]
      },
      {
        "page": 36,
        "title": "程式與程序",
        "paragraphs": [
          "程式是指令與資料的組成；執行中的實例是程序。兩次啟動同一程式可有不同程序及狀態。"
        ],
        "terms": [
          "Process",
          "Scheduler",
          "Ready Queue",
          "Blocked State"
        ]
      },
      {
        "page": 37,
        "title": "排程器與派遣",
        "paragraphs": [
          "排程政策決定選誰，派遣把 CPU 控制權交給選中的程序。程序表是管理紀錄。"
        ],
        "terms": [
          "Context Switch",
          "Process",
          "Scheduler",
          "Ready Queue",
          "Dispatcher"
        ]
      },
      {
        "page": 38,
        "title": "分時切換 A 和 B",
        "paragraphs": [
          "A 用完時間片可回到就緒隊列，B 被派上 CPU。A 等 I/O 時則進入等待，等事件後才可就緒。",
          "若執行 180 ms 需要 20 ms 切換，總時間是 200 ms，切換占 10%。若時間片減到 80 ms，總時間 100 ms，切換變 20%。"
        ],
        "terms": [
          "Time-Sharing",
          "Context Switch",
          "Process",
          "Scheduler",
          "Ready Queue",
          "Blocked State",
          "Dispatcher",
          "Time Slice",
          "Preemption"
        ],
        "exam": "時間片短通常輪得快，但固定的切換成本占比變大。分數的分母要寫清楚。"
      },
      {
        "page": 39,
        "title": "號誌與臨界區",
        "paragraphs": [
          "臨界區操作共用資源，需要同步。用互斥鎖或適當的號誌可避免兩段更新交錯。",
          "若兩個程序都先讀到 10，各自在暫存器加 4，兩次寫入都是 14。把讀、加、寫三個步驟放在同一個臨界區，第二個才會用 14 來算。"
        ],
        "terms": [
          "Process",
          "Semaphore",
          "Critical Section",
          "Mutual Exclusion"
        ],
        "exam": "解釋遺失更新時，照時間列兩次讀和兩次寫。只保護最後的寫入仍可能讀到舊值。"
      },
      {
        "page": 40,
        "title": "並行與平行",
        "paragraphs": [
          "並行讓多個工作有交錯進展；平行讓多個工作在同一時刻執行。單核心切換可實現前者。"
        ],
        "terms": [
          "Concurrency"
        ]
      },
      {
        "page": 41,
        "title": "從時間圖辨認平行",
        "paragraphs": [
          "找某一瞬間有幾個工作的實際執行區段重疊。若不同時間各跑一個，圖示的是交錯。"
        ],
        "terms": [
          "Concurrency"
        ]
      },
      {
        "page": 42,
        "title": "死結的定義",
        "paragraphs": [
          "一組程序互相等對方釋放資源，且沒有成員能自行前進。要先列出各程序已取得和正在要的資源。"
        ],
        "terms": [
          "Deadlock",
          "Resource Allocation Graph",
          "Mutual Exclusion",
          "Hold and Wait"
        ]
      },
      {
        "page": 43,
        "title": "死結與飢餓",
        "paragraphs": [
          "死結的一組程序卡在互等，飢餓是某工作一再被跳過。後者可能發生在其他程序照常完成的系統。"
        ],
        "terms": [
          "Deadlock",
          "Starvation"
        ]
      },
      {
        "page": 44,
        "title": "死結的影響範圍",
        "paragraphs": [
          "先找出卡住的資源集合，再看哪些其他工作依賴它。某處死結可能擴散，仍可能有不相關任務繼續。"
        ],
        "terms": [
          "Deadlock",
          "Starvation"
        ]
      },
      {
        "page": 45,
        "title": "七種死結情境",
        "paragraphs": [
          "練習將檔案、資料庫鎖、裝置、佇列空間或網路緩衝區都換成「資源」來分析。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 46,
        "title": "檔案鎖的循環等待",
        "paragraphs": [
          "P1 持有 F1 等 F2，P2 持有 F2 等 F1。兩個鎖若只能由當前持有者釋放，就會一直卡住。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait",
          "Resource Allocation Graph",
          "Hold and Wait"
        ]
      },
      {
        "page": 47,
        "title": "檔案鎖示意圖",
        "paragraphs": [
          "把資源指向持有它的程序，把程序指向等待的資源。沿箭頭就可找出等待環。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait"
        ]
      },
      {
        "page": 48,
        "title": "資料庫鎖定範圍",
        "paragraphs": [
          "可鎖整庫、表或記錄。範圍越小可增加並行度，也可能需要管理更多鎖。"
        ],
        "terms": []
      },
      {
        "page": 49,
        "title": "資料庫交錯取得兩筆記錄",
        "paragraphs": [
          "一方先鎖 R1，另一方先鎖 R2，再向對方要另一筆時形成循環。若都先鎖 R1，第二方先等待而不會持有 R2。"
        ],
        "terms": [
          "Critical Section",
          "Deadlock"
        ]
      },
      {
        "page": 50,
        "title": "資料庫鎖的關係圖",
        "paragraphs": [
          "先把每筆記錄畫成資源節點，再標示已授予與請求中的邊。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait"
        ]
      },
      {
        "page": 51,
        "title": "搶兩台專用裝置",
        "paragraphs": [
          "兩個工作各拿到一台磁帶機，再各要第二台時沒有可用實體裝置。可改變取得政策避免這種狀態。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 52,
        "title": "三個程序也能成環",
        "paragraphs": [
          "P1 等 P2 的印表機，P2 等 P3 的繪圖機，P3 等 P1 的磁帶機。循環不必只有兩個成員。",
          "P1 等 P2 的 Y，P2 等 P3 的 Z，若 P3 又申請 P1 的 X，程序等待關係由鏈變成環。持有者與等待者是兩種角色。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait",
          "Resource Allocation Graph"
        ],
        "exam": "畫出每條「程序 → 它在等的程序」，再檢查是否繞回起點。"
      },
      {
        "page": 53,
        "title": "多裝置等待圖",
        "paragraphs": [
          "按箭頭逐一列出「誰等誰」，標出回到起點時經過的所有程序。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait"
        ]
      },
      {
        "page": 54,
        "title": "Spooling 暫存輸出",
        "paragraphs": [
          "列印工作先放到儲存空間排隊，再由印表機逐份取得。排入暫存和實際列印是兩個階段。"
        ],
        "terms": []
      },
      {
        "page": 55,
        "title": "暫存空間填滿",
        "paragraphs": [
          "在講義的模型中，每份工作要完整才可列印。若空間被幾份未完成工作填滿，就無法再加入資料讓任何一份完成。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 56,
        "title": "網路緩衝區互等",
        "paragraphs": [
          "資料要往下一節點送，下一節點又沒有可用緩衝區。當多節點互相等可用空間時，傳送可能停滯。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 57,
        "title": "沿網路方向追蹤",
        "paragraphs": [
          "從擁塞的節點開始找它的下一跳，找出是否回到起點。箭頭方向能區分誰在等誰。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 58,
        "title": "磁碟請求的活結例子",
        "paragraphs": [
          "若策略不停回應新狀態、來回改變方向，兩個請求仍可能都完成不了。這是持續活動卻無進度的活結。"
        ],
        "terms": [
          "Livelock"
        ]
      },
      {
        "page": 59,
        "title": "活結的辨認",
        "paragraphs": [
          "從圖上分辨執行狀態有沒有變化與工作有沒有完成。一直變動也可能無法有效前進。"
        ],
        "terms": [
          "Livelock"
        ]
      },
      {
        "page": 60,
        "title": "四個路口形成等待環",
        "paragraphs": [
          "每輛車佔住目前路段並等待下一格。把車輛和路段換成程序和資源，就能對照資源等待圖。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait"
        ]
      },
      {
        "page": 61,
        "title": "死結的四個必要條件",
        "paragraphs": [
          "互斥、持有且等待、不可剝奪、循環等待。說明一個方法能避免死結時，指出它破壞哪個條件。",
          "全域鎖順序如 X、Y、Z。程序拿到較晚的鎖後，不能再向前申請較早的鎖，因此等待環中不可能每一步都沿著更晚的方向。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait",
          "Livelock",
          "Mutual Exclusion",
          "Hold and Wait"
        ],
        "exam": "先列互斥、持有且等待、不可剝奪、循環等待，再指出哪個條件被所選策略破壞。"
      },
      {
        "page": 62,
        "title": "用固定順序預防死結",
        "paragraphs": [
          "所有程序按同樣資源次序取得鎖，等待只能朝更後面的鎖前進，就不能形成循環。"
        ],
        "terms": [
          "Deadlock",
          "Circular Wait"
        ]
      },
      {
        "page": 63,
        "title": "發生後如何復原",
        "paragraphs": [
          "有些資源可剝奪，有些程序可回滾或終止。選擇時需考量資料一致性與重做成本。"
        ],
        "terms": [
          "Deadlock"
        ]
      },
      {
        "page": 64,
        "title": "用老化降低飢餓風險",
        "paragraphs": [
          "等待越久就提高優先權，讓新來且原本較高優先權的工作較難一直插隊。",
          "就緒佇列裡的低優先權程序可以一直排不到，而高優先權工作仍持續完成。這種飢餓可讓等待時間逐步提高優先權來緩解。"
        ],
        "terms": [
          "Scheduler",
          "Starvation",
          "Aging"
        ],
        "exam": "死結的例子要給互等關係，飢餓的例子要說出何者持續被跳過、何者仍能前進。"
      },
      {
        "page": 65,
        "title": "外部與內部的安全風險",
        "paragraphs": [
          "透過存取控制限制程式權限，配合更新及稽核。隔離能減少一個受侵害程序影響的範圍。"
        ],
        "terms": []
      },
      {
        "page": 66,
        "title": "Linux 單元導讀",
        "paragraphs": [
          "用 Linux 認識核心、發行版、Shell 與目錄。操作時先分清指令作用在哪個路徑。"
        ],
        "terms": [
          "Linux Distribution"
        ]
      },
      {
        "page": 67,
        "title": "Unix 與 Linux",
        "paragraphs": [
          "Linux 是 Unix-like 系統常用的核心。討論整套系統時還要包括函式庫、工具與設定。"
        ],
        "terms": [
          "Linux Distribution"
        ]
      },
      {
        "page": 68,
        "title": "個人電腦系統的背景",
        "paragraphs": [
          "不同作業系統的硬體成本、可取得性和用途影響歷史上的採用。這些是背景而非現況表。"
        ],
        "terms": []
      },
      {
        "page": 69,
        "title": "Unix-like 系統家族",
        "paragraphs": [
          "相似的介面和設計傳統不等於相同核心或相同授權，要依實際系統區分。"
        ],
        "terms": []
      },
      {
        "page": 70,
        "title": "GNU 計畫",
        "paragraphs": [
          "GNU 發展可供使用、研究、修改與分享的系統軟體，許多工具可配合 Linux 核心工作。"
        ],
        "terms": []
      },
      {
        "page": 71,
        "title": "Minix 的教育用途",
        "paragraphs": [
          "Minix 讓學生能閱讀和理解完整的作業系統設計。教學用途和大量部署時的設計重點可能不同。"
        ],
        "terms": []
      },
      {
        "page": 72,
        "title": "核心設計爭論",
        "paragraphs": [
          "核心元件放在核心空間或使用者空間會改變保護邊界和通訊成本。比較要說出交換條件。"
        ],
        "terms": []
      },
      {
        "page": 73,
        "title": "Linux 的應用場景",
        "paragraphs": [
          "核心可用於桌面、伺服器、嵌入式與高效能系統。各場景搭配的工具和介面會不同。"
        ],
        "terms": [
          "Linux Distribution"
        ]
      },
      {
        "page": 74,
        "title": "發行版",
        "paragraphs": [
          "把核心、套件、安裝與維護工具組成一套可使用的系統。發行版可有不同版本和預設設定。"
        ],
        "terms": [
          "Linux Distribution"
        ]
      },
      {
        "page": 75,
        "title": "核心和工具的分工",
        "paragraphs": [
          "核心處理受保護的系統工作；命令列工具和應用程式經由介面請求服務。"
        ],
        "terms": [
          "Kernel",
          "Shell",
          "Linux Distribution"
        ]
      },
      {
        "page": 76,
        "title": "核心的底層服務",
        "paragraphs": [
          "建立程序、安排 CPU、管理記憶體及接收裝置事件，是核心提供的典型服務。"
        ],
        "terms": [
          "Kernel"
        ]
      },
      {
        "page": 77,
        "title": "開放原始碼的授權",
        "paragraphs": [
          "能看到程式碼只是其中一部分。是否可修改及再散布，要看授權條款。"
        ],
        "terms": []
      },
      {
        "page": 78,
        "title": "自由軟體的自由",
        "paragraphs": [
          "重點在可執行、研究、修改與分享軟體的權利，不是價格。不同授權對散布有不同條件。"
        ],
        "terms": []
      },
      {
        "page": 79,
        "title": "平台和架構",
        "paragraphs": [
          "指令集與硬體介面影響核心如何移植。支援某架構仍需符合該裝置的驅動與開機方式。"
        ],
        "terms": []
      },
      {
        "page": 80,
        "title": "不同處理器家族",
        "paragraphs": [
          "讀架構清單時區分處理器家族、機器品牌和發行版。歷史支援清單會隨版本變化。"
        ],
        "terms": []
      },
      {
        "page": 81,
        "title": "移植要處理哪些層",
        "paragraphs": [
          "系統呼叫可能維持相同，啟動、管理記憶體及中斷的底層部分需配合架構。"
        ],
        "terms": []
      },
      {
        "page": 82,
        "title": "自由與開源的用語",
        "paragraphs": [
          "兩者的授權集合高度重疊，但倡議重點不同。談使用義務時以具體授權為準。"
        ],
        "terms": []
      },
      {
        "page": 83,
        "title": "Shell 執行指令",
        "paragraphs": [
          "Shell 解析字詞、展開路徑並啟動程式。可先用 pwd 看目前工作目錄，再用 ls 列內容。"
        ],
        "terms": [
          "Kernel",
          "Shell",
          "Path"
        ]
      },
      {
        "page": 84,
        "title": "家目錄、工作目錄與路徑",
        "paragraphs": [
          "登入初始常位於家目錄。相對路徑從工作目錄算，絕對路徑從根目錄 / 起算。"
        ],
        "terms": [
          "Shell",
          "Path"
        ]
      },
      {
        "page": 85,
        "title": "從根目錄走目錄樹",
        "paragraphs": [
          "/home/alex/notes 是從 / 開始逐層找 home、alex、notes。.. 表示上一層。"
        ],
        "terms": [
          "Path"
        ]
      },
      {
        "page": 86,
        "title": "系統目錄的常見用途",
        "paragraphs": [
          "/boot 存開機相關檔，/etc 常放系統設定。發行版可用符號連結或不同配置組合這些路徑。"
        ],
        "terms": [
          "Path"
        ]
      },
      {
        "page": 87,
        "title": "掛載點與執行資料",
        "paragraphs": [
          "掛載把另一個檔案系統接到目錄樹。/mnt 常用作臨時掛載點，/var 常見持續變動的資料。"
        ],
        "terms": [
          "Path"
        ]
      },
      {
        "page": 88,
        "title": "家目錄與多使用者環境",
        "paragraphs": [
          "每位使用者可有自己的家目錄。擁有者與權限控制其他帳號可讀取、改寫或執行哪些項目。"
        ],
        "terms": [
          "Path"
        ]
      },
      {
        "page": 89,
        "title": "Linux 練習回顧",
        "paragraphs": [
          "用 pwd 確認位置，ls 查看內容，再用 cd 選目錄。碰到路徑題先判斷從 / 或目前位置起算。"
        ],
        "terms": [
          "Path"
        ]
      }
    ],
    "concepts": {
      "os-roles": "作業系統負責什麼",
      "time-sharing": "分時、搶占與排程",
      "virtual-memory": "核心和記憶體映射",
      "process-state": "程序狀態和 CPU 使用",
      "synchronization": "臨界區、號誌與並行",
      "deadlock": "死結的資源等待",
      "starvation": "活結、飢餓與安全",
      "linux-path": "Linux 系統和路徑"
    },
    "practice": [
      {
        "id": "practice-1",
        "unit": "responsibilities",
        "page": 6,
        "concept": "os-roles",
        "level": "觀念",
        "prompt": "Which task is normally an operating system responsibility?",
        "options": [
          {
            "label": "Writing the user's report",
            "correct": false,
            "explanation": "OS 分配硬體資源並維持程序隔離。"
          },
          {
            "label": "Managing how processes share CPU time and memory",
            "correct": true,
            "explanation": "OS 分配硬體資源並維持程序隔離。"
          },
          {
            "label": "Composing all email messages",
            "correct": false,
            "explanation": "OS 分配硬體資源並維持程序隔離。"
          },
          {
            "label": "Choosing the spelling of every file name",
            "correct": false,
            "explanation": "OS 分配硬體資源並維持程序隔離。"
          }
        ]
      },
      {
        "id": "practice-2",
        "unit": "responsibilities",
        "page": 12,
        "concept": "os-roles",
        "level": "應用",
        "prompt": "What usually provides an OS with a device-specific interface to physical hardware?",
        "options": [
          {
            "label": "A device driver",
            "correct": true,
            "explanation": "驅動依裝置規格實作讀寫等操作。"
          },
          {
            "label": "A user file name",
            "correct": false,
            "explanation": "驅動依裝置規格實作讀寫等操作。"
          },
          {
            "label": "A terminal font",
            "correct": false,
            "explanation": "驅動依裝置規格實作讀寫等操作。"
          },
          {
            "label": "A program counter shared by all programs",
            "correct": false,
            "explanation": "驅動依裝置規格實作讀寫等操作。"
          }
        ]
      },
      {
        "id": "practice-3",
        "unit": "time-sharing",
        "page": 15,
        "concept": "time-sharing",
        "level": "判讀",
        "prompt": "Nightly jobs generate reports from pre-submitted data without user input while they run. Which processing model is this?",
        "options": [
          {
            "label": "Real-time interactive processing",
            "correct": false,
            "explanation": "輸入先準備好，執行期間不必與使用者互動。"
          },
          {
            "label": "Mandatory multicore processing",
            "correct": false,
            "explanation": "輸入先準備好，執行期間不必與使用者互動。"
          },
          {
            "label": "Device interrupt handling",
            "correct": false,
            "explanation": "輸入先準備好，執行期間不必與使用者互動。"
          },
          {
            "label": "Batch processing",
            "correct": true,
            "explanation": "輸入先準備好，執行期間不必與使用者互動。"
          }
        ]
      },
      {
        "id": "practice-4",
        "unit": "time-sharing",
        "page": 19,
        "concept": "time-sharing",
        "level": "應用",
        "prompt": "Process A waits for disk I/O while B is ready. How can multiprogramming reduce CPU idle time?",
        "options": [
          {
            "label": "Fabricate disk data for A immediately.",
            "correct": false,
            "explanation": "等待 I/O 期間 B 能繼續運算。"
          },
          {
            "label": "Run both processes at the same instant on one core.",
            "correct": false,
            "explanation": "等待 I/O 期間 B 能繼續運算。"
          },
          {
            "label": "Run B while waiting for A's I/O.",
            "correct": true,
            "explanation": "等待 I/O 期間 B 能繼續運算。"
          },
          {
            "label": "Always cancel the disk request.",
            "correct": false,
            "explanation": "等待 I/O 期間 B 能繼續運算。"
          }
        ]
      },
      {
        "id": "practice-5",
        "unit": "time-sharing",
        "page": 22,
        "concept": "time-sharing",
        "level": "觀念",
        "prompt": "An operating system can suspend a still-runnable job when its time slice expires. What kind of scheduling is this?",
        "options": [
          {
            "label": "Non-preemptive scheduling that waits for the job to yield",
            "correct": false,
            "explanation": "計時器等機制讓核心取回控制權。"
          },
          {
            "label": "Preemptive scheduling",
            "correct": true,
            "explanation": "計時器等機制讓核心取回控制權。"
          },
          {
            "label": "Boot loading",
            "correct": false,
            "explanation": "計時器等機制讓核心取回控制權。"
          },
          {
            "label": "Disk seeking",
            "correct": false,
            "explanation": "計時器等機制讓核心取回控制權。"
          }
        ]
      },
      {
        "id": "practice-6",
        "unit": "time-sharing",
        "page": 23,
        "concept": "process-state",
        "level": "觀念",
        "prompt": "Why are the PC and registers saved when the OS suspends process A?",
        "options": [
          {
            "label": "To resume A from its saved execution state",
            "correct": true,
            "explanation": "程序的上下文包含其運算值和指令位置。"
          },
          {
            "label": "To merge A's data into B's address space",
            "correct": false,
            "explanation": "程序的上下文包含其運算值和指令位置。"
          },
          {
            "label": "To restart A from the beginning",
            "correct": false,
            "explanation": "程序的上下文包含其運算值和指令位置。"
          },
          {
            "label": "To guarantee A has terminated",
            "correct": false,
            "explanation": "程序的上下文包含其運算值和指令位置。"
          }
        ]
      },
      {
        "id": "practice-7",
        "unit": "system-layers",
        "page": 28,
        "concept": "virtual-memory",
        "level": "觀念",
        "prompt": "How do a shell and an OS kernel differ?",
        "options": [
          {
            "label": "The shell must directly control all CPU registers.",
            "correct": false,
            "explanation": "兩者位於不同層次，系統服務由核心管控。"
          },
          {
            "label": "An OS does not need a kernel if it has a shell.",
            "correct": false,
            "explanation": "兩者位於不同層次，系統服務由核心管控。"
          },
          {
            "label": "The kernel can only parse strings.",
            "correct": false,
            "explanation": "兩者位於不同層次，系統服務由核心管控。"
          },
          {
            "label": "The shell interprets commands; the kernel handles protected system operations.",
            "correct": true,
            "explanation": "兩者位於不同層次，系統服務由核心管控。"
          }
        ]
      },
      {
        "id": "practice-8",
        "unit": "system-layers",
        "page": 31,
        "concept": "virtual-memory",
        "level": "判讀",
        "prompt": "Can two processes read different values at the same virtual address?",
        "options": [
          {
            "label": "No. A virtual address is a physical RAM location.",
            "correct": false,
            "explanation": "每個程序有自己的虛擬位址空間與映射關係。"
          },
          {
            "label": "No, provided the printed address is the same.",
            "correct": false,
            "explanation": "每個程序有自己的虛擬位址空間與映射關係。"
          },
          {
            "label": "Yes. Their mappings may point to different physical pages.",
            "correct": true,
            "explanation": "每個程序有自己的虛擬位址空間與映射關係。"
          },
          {
            "label": "Yes, and sharing a physical page is impossible.",
            "correct": false,
            "explanation": "每個程序有自己的虛擬位址空間與映射關係。"
          }
        ]
      },
      {
        "id": "practice-9",
        "unit": "system-layers",
        "page": 32,
        "concept": "virtual-memory",
        "level": "應用",
        "prompt": "Several processes use the same read-only library code. What may save physical memory?",
        "options": [
          {
            "label": "Forcing all variables to be shared",
            "correct": false,
            "explanation": "唯讀內容可以共用，而可變資料仍能隔離。"
          },
          {
            "label": "Mapping their code pages to the same physical pages",
            "correct": true,
            "explanation": "唯讀內容可以共用，而可變資料仍能隔離。"
          },
          {
            "label": "Disabling memory protection for every process",
            "correct": false,
            "explanation": "唯讀內容可以共用，而可變資料仍能隔離。"
          },
          {
            "label": "Making two copies of the code per process",
            "correct": false,
            "explanation": "唯讀內容可以共用，而可變資料仍能隔離。"
          }
        ]
      },
      {
        "id": "practice-10",
        "unit": "system-layers",
        "page": 34,
        "concept": "os-roles",
        "level": "流程",
        "prompt": "What is a boot loader's primary job?",
        "options": [
          {
            "label": "Load the OS kernel and transfer control to it.",
            "correct": true,
            "explanation": "引導階段建立剛好足以執行核心的環境。"
          },
          {
            "label": "Perform process scheduling after the OS starts.",
            "correct": false,
            "explanation": "引導階段建立剛好足以執行核心的環境。"
          },
          {
            "label": "Send print jobs to the printer.",
            "correct": false,
            "explanation": "引導階段建立剛好足以執行核心的環境。"
          },
          {
            "label": "Select the largest file in the user's folder.",
            "correct": false,
            "explanation": "引導階段建立剛好足以執行核心的環境。"
          }
        ]
      },
      {
        "id": "practice-11",
        "unit": "processes",
        "page": 36,
        "concept": "process-state",
        "level": "判讀",
        "prompt": "What can happen when the same editor is launched twice?",
        "options": [
          {
            "label": "There must be exactly one process.",
            "correct": false,
            "explanation": "執行個體與程式檔案是不同層次。"
          },
          {
            "label": "Both instances must share one PC and one register state.",
            "correct": false,
            "explanation": "執行個體與程式檔案是不同層次。"
          },
          {
            "label": "The program file must be duplicated first.",
            "correct": false,
            "explanation": "執行個體與程式檔案是不同層次。"
          },
          {
            "label": "The same program can have two processes with independent state.",
            "correct": true,
            "explanation": "執行個體與程式檔案是不同層次。"
          }
        ]
      },
      {
        "id": "practice-12",
        "unit": "processes",
        "page": 38,
        "concept": "process-state",
        "level": "流程",
        "prompt": "Disk I/O for process A finishes while process B is running. What state does A normally enter first?",
        "options": [
          {
            "label": "Still waiting for the completed I/O",
            "correct": false,
            "explanation": "A 已符合執行條件，還要等取得 CPU。"
          },
          {
            "label": "Terminated",
            "correct": false,
            "explanation": "A 已符合執行條件，還要等取得 CPU。"
          },
          {
            "label": "Ready",
            "correct": true,
            "explanation": "A 已符合執行條件，還要等取得 CPU。"
          },
          {
            "label": "Running at the same instant as B on the same core",
            "correct": false,
            "explanation": "A 已符合執行條件，還要等取得 CPU。"
          }
        ]
      },
      {
        "id": "practice-13",
        "unit": "processes",
        "page": 39,
        "concept": "synchronization",
        "level": "應用",
        "prompt": "Two processes each increment a shared counter, but the result occasionally rises by just one. Why?",
        "options": [
          {
            "label": "The counter must be converted to floating point.",
            "correct": false,
            "explanation": "讀、改、寫的交錯會遺失更新，需同步整段。"
          },
          {
            "label": "Both read the old value and their writes overwrite each other.",
            "correct": true,
            "explanation": "讀、改、寫的交錯會遺失更新，需同步整段。"
          },
          {
            "label": "The file extension is invalid.",
            "correct": false,
            "explanation": "讀、改、寫的交錯會遺失更新，需同步整段。"
          },
          {
            "label": "A single core makes every read-modify-write sequence atomic.",
            "correct": false,
            "explanation": "讀、改、寫的交錯會遺失更新，需同步整段。"
          }
        ]
      },
      {
        "id": "practice-14",
        "unit": "processes",
        "page": 40,
        "concept": "synchronization",
        "level": "判讀",
        "prompt": "One core alternates between A and B. Both make progress in a time interval. What follows?",
        "options": [
          {
            "label": "They run concurrently, but the schedule does not show simultaneous execution.",
            "correct": true,
            "explanation": "切換提供並行；平行需要實際同時執行。"
          },
          {
            "label": "They must run on two physical cores.",
            "correct": false,
            "explanation": "切換提供並行；平行需要實際同時執行。"
          },
          {
            "label": "Their lifetimes cannot overlap.",
            "correct": false,
            "explanation": "切換提供並行；平行需要實際同時執行。"
          },
          {
            "label": "They must be deadlocked.",
            "correct": false,
            "explanation": "切換提供並行；平行需要實際同時執行。"
          }
        ]
      },
      {
        "id": "practice-15",
        "unit": "deadlock",
        "page": 46,
        "concept": "deadlock",
        "level": "判讀",
        "prompt": "P1 holds A and needs B; P2 holds B and needs A. The locks are exclusive and cannot be taken away. What has happened?",
        "options": [
          {
            "label": "P1 starves while P2 continues to complete work.",
            "correct": false,
            "explanation": "等待形成一個無成員能自行釋放資源的環。"
          },
          {
            "label": "An ordered schedule allows both to finish in turn.",
            "correct": false,
            "explanation": "等待形成一個無成員能自行釋放資源的環。"
          },
          {
            "label": "There is only synchronization overhead.",
            "correct": false,
            "explanation": "等待形成一個無成員能自行釋放資源的環。"
          },
          {
            "label": "Deadlock",
            "correct": true,
            "explanation": "等待形成一個無成員能自行釋放資源的環。"
          }
        ]
      },
      {
        "id": "practice-16",
        "unit": "deadlock",
        "page": 49,
        "concept": "deadlock",
        "level": "應用",
        "prompt": "All transactions need R1 and R2. Why does requiring every transaction to take R1 before R2 help?",
        "options": [
          {
            "label": "It eliminates all waiting.",
            "correct": false,
            "explanation": "第二個交易可在 R1 前等待，不會預先佔住 R2。"
          },
          {
            "label": "It removes mutual exclusion for R2.",
            "correct": false,
            "explanation": "第二個交易可在 R1 前等待，不會預先佔住 R2。"
          },
          {
            "label": "It prevents a cycle: a transaction waiting for R1 cannot hold R2.",
            "correct": true,
            "explanation": "第二個交易可在 R1 前等待，不會預先佔住 R2。"
          },
          {
            "label": "It lets the transactions write the same record at once.",
            "correct": false,
            "explanation": "第二個交易可在 R1 前等待，不會預先佔住 R2。"
          }
        ]
      },
      {
        "id": "practice-17",
        "unit": "deadlock",
        "page": 55,
        "concept": "deadlock",
        "level": "分析",
        "prompt": "A spool is full of incomplete print jobs, and printing starts only when a job is complete. Why can progress stop?",
        "options": [
          {
            "label": "A brighter display is required.",
            "correct": false,
            "explanation": "此簡化模型中，釋放空間依賴完成，而完成又依賴空間。"
          },
          {
            "label": "Nothing can print to free space, and nothing can finish without space.",
            "correct": true,
            "explanation": "此簡化模型中，釋放空間依賴完成，而完成又依賴空間。"
          },
          {
            "label": "Each new job creates more space.",
            "correct": false,
            "explanation": "此簡化模型中，釋放空間依賴完成，而完成又依賴空間。"
          },
          {
            "label": "The processor instructions are too short.",
            "correct": false,
            "explanation": "此簡化模型中，釋放空間依賴完成，而完成又依賴空間。"
          }
        ]
      },
      {
        "id": "practice-18",
        "unit": "deadlock",
        "page": 58,
        "concept": "starvation",
        "level": "判讀",
        "prompt": "Two processes repeatedly back off and retry at the same time. Their states change, but neither finishes. Which is the best description?",
        "options": [
          {
            "label": "Livelock",
            "correct": true,
            "explanation": "彼此不斷反應，但沒有有效進展。"
          },
          {
            "label": "Successful parallel execution",
            "correct": false,
            "explanation": "彼此不斷反應，但沒有有效進展。"
          },
          {
            "label": "Both jobs have already completed.",
            "correct": false,
            "explanation": "彼此不斷反應，但沒有有效進展。"
          },
          {
            "label": "The file system is being mounted.",
            "correct": false,
            "explanation": "彼此不斷反應，但沒有有效進展。"
          }
        ]
      },
      {
        "id": "practice-19",
        "unit": "deadlock",
        "page": 61,
        "concept": "deadlock",
        "level": "觀念",
        "prompt": "What are the four necessary conditions for resource deadlock?",
        "options": [
          {
            "label": "Mutual exclusion, batch execution, preemption, and aging",
            "correct": false,
            "explanation": "這四項都是標準資源死結模型下的必要條件。"
          },
          {
            "label": "Sharing, time slices, rollback, and circular wait",
            "correct": false,
            "explanation": "這四項都是標準資源死結模型下的必要條件。"
          },
          {
            "label": "Parallelism, virtual memory, no preemption, and disks",
            "correct": false,
            "explanation": "這四項都是標準資源死結模型下的必要條件。"
          },
          {
            "label": "Mutual exclusion, hold and wait, no preemption, and circular wait",
            "correct": true,
            "explanation": "這四項都是標準資源死結模型下的必要條件。"
          }
        ]
      },
      {
        "id": "practice-20",
        "unit": "deadlock",
        "page": 64,
        "concept": "starvation",
        "level": "應用",
        "prompt": "Incoming high-priority jobs keep overtaking an old job. Which policy most directly helps the old job?",
        "options": [
          {
            "label": "Permanently reduce its priority.",
            "correct": false,
            "explanation": "老化把等待時間反映到排程，減少長期被略過。"
          },
          {
            "label": "Disable all interrupts.",
            "correct": false,
            "explanation": "老化把等待時間反映到排程，減少長期被略過。"
          },
          {
            "label": "Raise a job's priority as it waits longer.",
            "correct": true,
            "explanation": "老化把等待時間反映到排程，減少長期被略過。"
          },
          {
            "label": "Sort the letters of each file path.",
            "correct": false,
            "explanation": "老化把等待時間反映到排程，減少長期被略過。"
          }
        ]
      },
      {
        "id": "practice-21",
        "unit": "deadlock",
        "page": 65,
        "concept": "starvation",
        "level": "應用",
        "prompt": "An ordinary program needs to read its own files. Which permission policy is most appropriate?",
        "options": [
          {
            "label": "Let every program modify the kernel.",
            "correct": false,
            "explanation": "限制權限可縮小意外或遭入侵時的影響。"
          },
          {
            "label": "Grant only the permissions needed for its task.",
            "correct": true,
            "explanation": "限制權限可縮小意外或遭入侵時的影響。"
          },
          {
            "label": "Let every process read every user's files.",
            "correct": false,
            "explanation": "限制權限可縮小意外或遭入侵時的影響。"
          },
          {
            "label": "Disable access checks to make startup faster.",
            "correct": false,
            "explanation": "限制權限可縮小意外或遭入侵時的影響。"
          }
        ]
      },
      {
        "id": "practice-22",
        "unit": "linux",
        "page": 74,
        "concept": "linux-path",
        "level": "比較",
        "prompt": "What core component can different Linux distributions share?",
        "options": [
          {
            "label": "The Linux kernel",
            "correct": true,
            "explanation": "發行版可用同類核心搭配不同工具、設定與套件。"
          },
          {
            "label": "The exact same desktop and update schedule",
            "correct": false,
            "explanation": "發行版可用同類核心搭配不同工具、設定與套件。"
          },
          {
            "label": "Identical versions of every package",
            "correct": false,
            "explanation": "發行版可用同類核心搭配不同工具、設定與套件。"
          },
          {
            "label": "A common user password",
            "correct": false,
            "explanation": "發行版可用同類核心搭配不同工具、設定與套件。"
          }
        ]
      },
      {
        "id": "practice-23",
        "unit": "linux",
        "page": 84,
        "concept": "linux-path",
        "level": "判讀",
        "prompt": "At which location does Linux begin resolving /var/log?",
        "options": [
          {
            "label": "The parent of the current directory",
            "correct": false,
            "explanation": "開頭的斜線指出是從根目錄開始的絕對路徑。"
          },
          {
            "label": "The user's home directory",
            "correct": false,
            "explanation": "開頭的斜線指出是從根目錄開始的絕對路徑。"
          },
          {
            "label": "The directory containing the shell executable",
            "correct": false,
            "explanation": "開頭的斜線指出是從根目錄開始的絕對路徑。"
          },
          {
            "label": "The root directory /",
            "correct": true,
            "explanation": "開頭的斜線指出是從根目錄開始的絕對路徑。"
          }
        ]
      },
      {
        "id": "practice-24",
        "unit": "linux",
        "page": 85,
        "concept": "linux-path",
        "level": "計算",
        "prompt": "The working directory is /home/mei/docs. Where does ../pics lead?",
        "options": [
          {
            "label": "/home/pics",
            "correct": false,
            "explanation": "先切到上一層 /home/mei，再往下到 pics。"
          },
          {
            "label": "/home/mei/docs/pics",
            "correct": false,
            "explanation": "先切到上一層 /home/mei，再往下到 pics。"
          },
          {
            "label": "/home/mei/pics",
            "correct": true,
            "explanation": "先切到上一層 /home/mei，再往下到 pics。"
          },
          {
            "label": "/pics",
            "correct": false,
            "explanation": "先切到上一層 /home/mei，再往下到 pics。"
          }
        ]
      },
      {
        "id": "practice-25",
        "unit": "processes",
        "page": 38,
        "concept": "time-sharing",
        "level": "計算",
        "prompt": "A process runs for 180 ms per slice. Saving and restoring state costs 10 ms each per switch. With one switch per full slice, what fraction of elapsed time is lost to switching?",
        "options": [
          {
            "label": "5%",
            "correct": false,
            "explanation": "正確判斷是「10%」。每輪總時間 180＋10＋10＝200 ms，開銷為 20/200。"
          },
          {
            "label": "10%",
            "correct": true,
            "explanation": "每輪總時間 180＋10＋10＝200 ms，開銷為 20/200。"
          },
          {
            "label": "11.1%",
            "correct": false,
            "explanation": "正確判斷是「10%」。每輪總時間 180＋10＋10＝200 ms，開銷為 20/200。"
          },
          {
            "label": "20%",
            "correct": false,
            "explanation": "正確判斷是「10%」。每輪總時間 180＋10＋10＝200 ms，開銷為 20/200。"
          }
        ]
      },
      {
        "id": "practice-26",
        "unit": "processes",
        "page": 38,
        "concept": "time-sharing",
        "level": "分析",
        "prompt": "A and B are always ready. What usually happens when a round-robin scheduler reduces the time slice and switching cost stays fixed?",
        "options": [
          {
            "label": "A process generally waits less for its next turn, while switching takes a larger fraction of time.",
            "correct": true,
            "explanation": "時間片縮短，輪到的間隔通常變短，但每次固定開銷更頻繁。"
          },
          {
            "label": "The CPU uses less time for switching and jobs wait longer for turns.",
            "correct": false,
            "explanation": "正確判斷是「A process generally waits less for its next turn, while switching takes a larger fraction of time.」。時間片縮短，輪到的間隔通常變短，但每次固定開銷更頻繁。"
          },
          {
            "label": "Each process can run uninterrupted for longer.",
            "correct": false,
            "explanation": "正確判斷是「A process generally waits less for its next turn, while switching takes a larger fraction of time.」。時間片縮短，輪到的間隔通常變短，但每次固定開銷更頻繁。"
          },
          {
            "label": "The scheduler becomes non-preemptive.",
            "correct": false,
            "explanation": "正確判斷是「A process generally waits less for its next turn, while switching takes a larger fraction of time.」。時間片縮短，輪到的間隔通常變短，但每次固定開銷更頻繁。"
          }
        ]
      },
      {
        "id": "practice-27",
        "unit": "processes",
        "page": 37,
        "concept": "process-state",
        "level": "應用",
        "prompt": "A timer fires during A, the scheduler chooses B, and dispatch begins. What must be saved so A can continue later?",
        "options": [
          {
            "label": "Only B's file name",
            "correct": false,
            "explanation": "正確判斷是「A's next instruction address and register state」。這些是恢復程序執行所需的上下文。"
          },
          {
            "label": "Only the timer interval",
            "correct": false,
            "explanation": "正確判斷是「A's next instruction address and register state」。這些是恢復程序執行所需的上下文。"
          },
          {
            "label": "Only the contents of A's executable file",
            "correct": false,
            "explanation": "正確判斷是「A's next instruction address and register state」。這些是恢復程序執行所需的上下文。"
          },
          {
            "label": "A's next instruction address and register state",
            "correct": true,
            "explanation": "這些是恢復程序執行所需的上下文。"
          }
        ]
      },
      {
        "id": "practice-28",
        "unit": "processes",
        "page": 38,
        "concept": "time-sharing",
        "level": "分析",
        "prompt": "When an interactive I/O-bound process wakes while CPU-bound work stays ready, why might a scheduler favor the interactive process briefly?",
        "options": [
          {
            "label": "CPU-bound processes never need CPU time.",
            "correct": false,
            "explanation": "正確判斷是「It can respond and issue its next I/O quickly, allowing the CPU and device to overlap work.」。一小段 CPU 就可能讓 I/O 密集程序送出下一個請求，改善回應及重疊。"
          },
          {
            "label": "I/O-bound processes can execute while blocked.",
            "correct": false,
            "explanation": "正確判斷是「It can respond and issue its next I/O quickly, allowing the CPU and device to overlap work.」。一小段 CPU 就可能讓 I/O 密集程序送出下一個請求，改善回應及重疊。"
          },
          {
            "label": "It can respond and issue its next I/O quickly, allowing the CPU and device to overlap work.",
            "correct": true,
            "explanation": "一小段 CPU 就可能讓 I/O 密集程序送出下一個請求，改善回應及重疊。"
          },
          {
            "label": "Favoring it eliminates all future context switches.",
            "correct": false,
            "explanation": "正確判斷是「It can respond and issue its next I/O quickly, allowing the CPU and device to overlap work.」。一小段 CPU 就可能讓 I/O 密集程序送出下一個請求，改善回應及重疊。"
          }
        ]
      },
      {
        "id": "practice-29",
        "unit": "processes",
        "page": 39,
        "concept": "synchronization",
        "level": "分析",
        "prompt": "A shared counter starts at 12. A and B each read 12, add 2 locally, and then write their results. What is the final value and why?",
        "options": [
          {
            "label": "16; each read-modify-write is atomic on a single core.",
            "correct": false,
            "explanation": "正確判斷是「14; the second write overwrites the first update.」。兩個程序都用舊值 12 算 14；最後一次寫入仍是 14。"
          },
          {
            "label": "14; the second write overwrites the first update.",
            "correct": true,
            "explanation": "兩個程序都用舊值 12 算 14；最後一次寫入仍是 14。"
          },
          {
            "label": "12; both writes are discarded.",
            "correct": false,
            "explanation": "正確判斷是「14; the second write overwrites the first update.」。兩個程序都用舊值 12 算 14；最後一次寫入仍是 14。"
          },
          {
            "label": "28; the two local results are added by memory.",
            "correct": false,
            "explanation": "正確判斷是「14; the second write overwrites the first update.」。兩個程序都用舊值 12 算 14；最後一次寫入仍是 14。"
          }
        ]
      },
      {
        "id": "practice-30",
        "unit": "system-layers",
        "page": 31,
        "concept": "virtual-memory",
        "level": "分析",
        "prompt": "Process A reads a valid virtual page currently on disk, and B is ready. Which sequence is plausible?",
        "options": [
          {
            "label": "A faults, the OS starts I/O, B runs, and A becomes ready after the page arrives.",
            "correct": true,
            "explanation": "有效頁缺頁可使 A 等 I/O，系統先安排 B，完成後再把 A 放回就緒。"
          },
          {
            "label": "A continues before the page arrives.",
            "correct": false,
            "explanation": "正確判斷是「A faults, the OS starts I/O, B runs, and A becomes ready after the page arrives.」。有效頁缺頁可使 A 等 I/O，系統先安排 B，完成後再把 A 放回就緒。"
          },
          {
            "label": "A's virtual address is sent directly to the disk by the application.",
            "correct": false,
            "explanation": "正確判斷是「A faults, the OS starts I/O, B runs, and A becomes ready after the page arrives.」。有效頁缺頁可使 A 等 I/O，系統先安排 B，完成後再把 A 放回就緒。"
          },
          {
            "label": "The OS must terminate A, even though the mapping is valid.",
            "correct": false,
            "explanation": "正確判斷是「A faults, the OS starts I/O, B runs, and A becomes ready after the page arrives.」。有效頁缺頁可使 A 等 I/O，系統先安排 B，完成後再把 A 放回就緒。"
          }
        ]
      },
      {
        "id": "practice-31",
        "unit": "system-layers",
        "page": 32,
        "concept": "virtual-memory",
        "level": "計算",
        "prompt": "Four processes each map the same 64 KiB of read-only library code to a single physical copy and each has 16 KiB of private data. How much physical memory is used for those mappings?",
        "options": [
          {
            "label": "80 KiB",
            "correct": false,
            "explanation": "正確判斷是「128 KiB」。共用 64 KiB 只算一次，私有 4×16 KiB，共 128 KiB。"
          },
          {
            "label": "256 KiB",
            "correct": false,
            "explanation": "正確判斷是「128 KiB」。共用 64 KiB 只算一次，私有 4×16 KiB，共 128 KiB。"
          },
          {
            "label": "320 KiB",
            "correct": false,
            "explanation": "正確判斷是「128 KiB」。共用 64 KiB 只算一次，私有 4×16 KiB，共 128 KiB。"
          },
          {
            "label": "128 KiB",
            "correct": true,
            "explanation": "共用 64 KiB 只算一次，私有 4×16 KiB，共 128 KiB。"
          }
        ]
      },
      {
        "id": "practice-32",
        "unit": "deadlock",
        "page": 52,
        "concept": "deadlock",
        "level": "分析",
        "prompt": "P1 holds X and waits for Y; P2 holds Y and waits for Z; P3 holds Z and has no pending request. Which change completes a circular wait?",
        "options": [
          {
            "label": "P3 releases Z.",
            "correct": false,
            "explanation": "正確判斷是「P3 requests X.」。形成 P1→P2→P3→P1。"
          },
          {
            "label": "P1 cancels its request for Y.",
            "correct": false,
            "explanation": "正確判斷是「P3 requests X.」。形成 P1→P2→P3→P1。"
          },
          {
            "label": "P3 requests X.",
            "correct": true,
            "explanation": "形成 P1→P2→P3→P1。"
          },
          {
            "label": "P2 releases Y before requesting Z.",
            "correct": false,
            "explanation": "正確判斷是「P3 requests X.」。形成 P1→P2→P3→P1。"
          }
        ]
      },
      {
        "id": "practice-33",
        "unit": "deadlock",
        "page": 62,
        "concept": "deadlock",
        "level": "分析",
        "prompt": "What condition does a policy that requires jobs to request all their exclusive resources together directly remove?",
        "options": [
          {
            "label": "Mutual exclusion",
            "correct": false,
            "explanation": "正確判斷是「Hold and wait」。程序在等待資源時一開始就拿不到任何一把鎖；拿到時已有所需的全部資源。"
          },
          {
            "label": "Hold and wait",
            "correct": true,
            "explanation": "程序在等待資源時一開始就拿不到任何一把鎖；拿到時已有所需的全部資源。"
          },
          {
            "label": "No preemption",
            "correct": false,
            "explanation": "正確判斷是「Hold and wait」。程序在等待資源時一開始就拿不到任何一把鎖；拿到時已有所需的全部資源。"
          },
          {
            "label": "The need to allocate resources",
            "correct": false,
            "explanation": "正確判斷是「Hold and wait」。程序在等待資源時一開始就拿不到任何一把鎖；拿到時已有所需的全部資源。"
          }
        ]
      },
      {
        "id": "practice-34",
        "unit": "deadlock",
        "page": 64,
        "concept": "starvation",
        "level": "判讀",
        "prompt": "P1 stays in the ready queue indefinitely as higher-priority tasks finish. Which detail distinguishes this from ordinary resource deadlock?",
        "options": [
          {
            "label": "Other jobs keep completing, and no circular-wait chain is shown.",
            "correct": true,
            "explanation": "一個程序一直被排程略過，符合飢餓。"
          },
          {
            "label": "P1 and every other process must hold each other's locks.",
            "correct": false,
            "explanation": "正確判斷是「Other jobs keep completing, and no circular-wait chain is shown.」。一個程序一直被排程略過，符合飢餓。"
          },
          {
            "label": "P1 is guaranteed to get the next time slice.",
            "correct": false,
            "explanation": "正確判斷是「Other jobs keep completing, and no circular-wait chain is shown.」。一個程序一直被排程略過，符合飢餓。"
          },
          {
            "label": "All resource owners have stopped making progress.",
            "correct": false,
            "explanation": "正確判斷是「Other jobs keep completing, and no circular-wait chain is shown.」。一個程序一直被排程略過，符合飢餓。"
          }
        ]
      },
      {
        "id": "practice-35",
        "unit": "linux",
        "page": 85,
        "concept": "linux-path",
        "level": "應用",
        "prompt": "Assume no symbolic links. Starting in /home/mei/docs/drafts, which absolute path is reached by ../../pics/../music?",
        "options": [
          {
            "label": "/home/music",
            "correct": false,
            "explanation": "正確判斷是「/home/mei/music」。先上兩層到 /home/mei，進 pics 再退一層，最後進 music。"
          },
          {
            "label": "/home/mei/docs/music",
            "correct": false,
            "explanation": "正確判斷是「/home/mei/music」。先上兩層到 /home/mei，進 pics 再退一層，最後進 music。"
          },
          {
            "label": "/music",
            "correct": false,
            "explanation": "正確判斷是「/home/mei/music」。先上兩層到 /home/mei，進 pics 再退一層，最後進 music。"
          },
          {
            "label": "/home/mei/music",
            "correct": true,
            "explanation": "先上兩層到 /home/mei，進 pics 再退一層，最後進 music。"
          }
        ]
      },
      {
        "id": "practice-36",
        "unit": "system-layers",
        "page": 31,
        "concept": "virtual-memory",
        "level": "流程",
        "prompt": "A waits for disk after a valid page fault, while B runs. The disk read completes without preempting B. What is A's new state?",
        "options": [
          {
            "label": "Running",
            "correct": false,
            "explanation": "正確判斷是「Ready」。頁面已在記憶體，A 可執行，先等 CPU 派遣。"
          },
          {
            "label": "Blocked on the same disk read",
            "correct": false,
            "explanation": "正確判斷是「Ready」。頁面已在記憶體，A 可執行，先等 CPU 派遣。"
          },
          {
            "label": "Ready",
            "correct": true,
            "explanation": "頁面已在記憶體，A 可執行，先等 CPU 派遣。"
          },
          {
            "label": "Terminated",
            "correct": false,
            "explanation": "正確判斷是「Ready」。頁面已在記憶體，A 可執行，先等 CPU 派遣。"
          }
        ]
      },
      {
        "id": "practice-37",
        "unit": "system-layers",
        "page": 31,
        "concept": "virtual-memory",
        "level": "判讀",
        "prompt": "A page table already maps the requested virtual page to an available frame with valid permissions. What does A need?",
        "options": [
          {
            "label": "A disk read must load the page every time.",
            "correct": false,
            "explanation": "正確判斷是「No disk read is required for this page access.」。頁面已駐留於 RAM，依映射即可取資料。"
          },
          {
            "label": "No disk read is required for this page access.",
            "correct": true,
            "explanation": "頁面已駐留於 RAM，依映射即可取資料。"
          },
          {
            "label": "A must enter the blocked state before translation.",
            "correct": false,
            "explanation": "正確判斷是「No disk read is required for this page access.」。頁面已駐留於 RAM，依映射即可取資料。"
          },
          {
            "label": "A must always yield the CPU to B.",
            "correct": false,
            "explanation": "正確判斷是「No disk read is required for this page access.」。頁面已駐留於 RAM，依映射即可取資料。"
          }
        ]
      },
      {
        "id": "practice-38",
        "unit": "system-layers",
        "page": 31,
        "concept": "virtual-memory",
        "level": "應用",
        "prompt": "Two processes read the same virtual address but get different bytes. Which fact can explain this?",
        "options": [
          {
            "label": "Their page tables map the virtual page to different physical frames.",
            "correct": true,
            "explanation": "同一虛擬位址在不同程序中可映射到不同的實體頁框。"
          },
          {
            "label": "The address syntax is invalid in both processes.",
            "correct": false,
            "explanation": "正確判斷是「Their page tables map the virtual page to different physical frames.」。同一虛擬位址在不同程序中可映射到不同的實體頁框。"
          },
          {
            "label": "The page offset must differ despite identical addresses.",
            "correct": false,
            "explanation": "正確判斷是「Their page tables map the virtual page to different physical frames.」。同一虛擬位址在不同程序中可映射到不同的實體頁框。"
          },
          {
            "label": "The disk must copy one process's page into the other.",
            "correct": false,
            "explanation": "正確判斷是「Their page tables map the virtual page to different physical frames.」。同一虛擬位址在不同程序中可映射到不同的實體頁框。"
          }
        ]
      }
    ],
    "exam": [
      {
        "title": "Evaluate a time slice",
        "setup": "A single-core machine runs two always-ready processes in round robin. A useful slice is 180 ms. Saving state costs 8 ms and restoring costs 12 ms per switch; assume one switch per full slice.",
        "pages": [
          18,
          21,
          23,
          38
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Enter the percentage of elapsed time spent switching, as a whole number. Explain what changes when the useful slice is decreased to 80 ms.",
            "fields": [
              {
                "id": "answer",
                "label": "Switching overhead (%)",
                "format": "integer",
                "answer": 10,
                "points": 5
              }
            ],
            "model": "開銷 8＋12＝20 ms，原本 20/(180＋20)=10%。改為 80 ms 後是 20/(80＋20)=20%，同時別的工作通常能較早輪到。",
            "trap": "用 20 除以 180 得的是每單位有效工作附帶的成本，與題設的耗時比例不同。",
            "criteria": [
              [
                5,
                "分母要包含有效時間和切換成本"
              ],
              [
                5,
                "算出新百分比並解釋回應時間的折衷"
              ]
            ]
          }
        ]
      },
      {
        "title": "Trace scheduling states",
        "setup": "A is running and B is ready. A starts a blocking disk read, so B runs. When the read completes, the scheduler is allowed to preempt B.",
        "pages": [
          36,
          37,
          38
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Name A's states immediately after blocking, after completion before dispatch, and after dispatch. Explain what the scheduler and dispatcher each do.",
            "model": "A 從執行變等待；I/O 完成先轉就緒；被派遣才跑。排程政策選下一個程序，派遣保存及恢復上下文並交出 CPU 控制。",
            "trap": "事件完成讓程序可執行，仍須取得 CPU。",
            "criteria": [
              [
                5,
                "正確列出 A 的三段狀態"
              ],
              [
                5,
                "說出排程器如何選擇就緒程序"
              ],
              [
                5,
                "說出派遣如何移轉控制與上下文"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain an address translation and a page fault",
        "setup": "Processes A and B both read virtual address 0x2000. A's valid page is on disk, while B's mapping points to a physical page already in RAM.",
        "pages": [
          28,
          30,
          31,
          32
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Explain why the two processes can see different data, what happens when A faults, and when A becomes eligible to run again.",
            "model": "各程序的頁表可映射到不同頁。A 的有效映射缺頁時，由 OS 取得頁面、更新映射，在等待期間可換 B 執行。頁到達後 A 回就緒，再由排程派遣。",
            "trap": "有些缺頁是合法頁暫時不在 RAM。這題已說明映射有效。",
            "criteria": [
              [
                5,
                "用個別頁表解釋相同虛擬位址的不同內容"
              ],
              [
                5,
                "交代 OS 的缺頁讀入及更新映射"
              ],
              [
                5,
                "解釋等待時可切換程序和 A 何時回就緒"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain a lost update",
        "setup": "A shared variable is initially 10. Two processes independently read the variable, add 4, and write their result. Both reads occur before either write.",
        "pages": [
          24,
          39,
          40
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Enter the final value. Explain where a critical section should begin and end if each update must count.",
            "fields": [
              {
                "id": "answer",
                "label": "Final value",
                "format": "integer",
                "answer": 14,
                "points": 5
              }
            ],
            "model": "兩個都讀 10，各算 14，最後一次寫回仍為 14。互斥區應從讀取前到寫入後，讓另一個讀到已更新數值。",
            "trap": "只鎖最後一次寫入仍可讓兩者先讀到相同舊值。",
            "criteria": [
              [
                3,
                "列出兩套讀改寫的值"
              ],
              [
                2,
                "指出讀取與寫入須在同一互斥區，並說明保護後可得 18"
              ]
            ]
          }
        ]
      },
      {
        "title": "Analyze a three-process wait cycle",
        "setup": "P1 holds X and requests Y; P2 holds Y and requests Z; P3 holds Z and requests X. Each resource is exclusive and cannot be taken from its current holder.",
        "pages": [
          42,
          52,
          61,
          62,
          64
        ],
        "parts": [
          {
            "points": 20,
            "prompt": "Give the wait-for cycle, name the four necessary conditions, and propose a global lock order. Explain why an indefinitely postponed ready job is a different case.",
            "model": "P1→P2→P3→P1。互斥、持有且等待、不可剝奪與循環等待；規定 X→Y→Z 可破壞循環。飢餓可因優先權一直被略過，其他工作仍可能完成。",
            "trap": "畫箭頭前先確認每個被請求資源的持有者。",
            "criteria": [
              [
                7,
                "給完整等待環和四項必要條件"
              ],
              [
                7,
                "說明全域排序為何切斷循環"
              ],
              [
                6,
                "用其他工作仍前進解釋飢餓"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain OS and startup roles",
        "setup": "A laptop powers on. A user later runs a shell command that reads a file on an external device.",
        "pages": [
          6,
          12,
          27,
          28,
          34
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Trace the roles of the boot loader, kernel, shell, and device driver. Name two other services the kernel provides while programs are running.",
            "model": "載入器啟動核心。Shell 解析命令並啟動程式；程式請求核心讀檔；驅動程式依裝置規格操作硬體。核心也可管理程序、排程、記憶體、安全權限等。",
            "trap": "系統工具與核心可互相配合，權限與責任仍各自不同。",
            "criteria": [
              [
                5,
                "區分載入器和核心的開機職責"
              ],
              [
                5,
                "連起 shell、核心、磁碟驅動的路徑"
              ],
              [
                5,
                "舉至少兩種其它核心服務"
              ]
            ]
          }
        ]
      },
      {
        "title": "Work with a directory tree",
        "setup": "Assume no symbolic links and a current working directory of /home/lin/work/week4. One command opens ../../notes/os.txt; another opens /var/log/boot.log.",
        "pages": [
          29,
          83,
          84,
          85
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Give both absolute paths. Explain how each path is resolved and why the shell's current directory affects only one of them.",
            "model": "相對路徑上兩層到 /home/lin，結果是 /home/lin/notes/os.txt。第二條已從 / 起算，為 /var/log/boot.log。",
            "trap": "根目錄和使用者的家目錄是不同起點。",
            "criteria": [
              [
                4,
                "逐段寫出兩個 .. 以及相對結果"
              ],
              [
                3,
                "正確交代絕對路徑與根目錄"
              ],
              [
                3,
                "說明目前目錄影響哪個解析"
              ]
            ]
          }
        ]
      },
      {
        "title": "Compare priorities using a concrete workload",
        "setup": "A CPU-bound job is ready indefinitely. An interactive job wakes after each short I/O operation and runs just long enough to issue the next request. One CPU and one I/O device can work at the same time.",
        "bonus": true,
        "pages": [
          17,
          21,
          38,
          64
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Explain why letting the interactive job run briefly can improve response time and device utilization. Give a scheduling safeguard against starving the CPU-bound job.",
            "model": "短工作可以及時完成回應並送出下一個 I/O，在等裝置時讓 CPU 做計算工作，可讓兩者重疊。可對等待時間做老化，或保證 CPU-bound 工作至少獲得一定時間片。",
            "trap": "優先給短工作不等於一直讓它插隊。",
            "criteria": [
              [
                4,
                "解釋短工作何時能發下一次 I/O"
              ],
              [
                3,
                "說出 CPU 與裝置如何重疊"
              ],
              [
                3,
                "給能保障另一工作的公平策略"
              ]
            ]
          }
        ]
      }
    ],
    "legacyExam": [
      {
        "title": "判斷資源等待",
        "pages": [
          61
        ],
        "setup": "P1 持有印表機要磁帶機，P2 持有磁帶機要印表機。兩者只能獨佔，且只能由持有者釋放。",
        "parts": [
          {
            "points": 5,
            "prompt": "寫出等待環，列出四個必要條件，再提出一種能打破其中一個條件的策略。",
            "model": "P1 等 P2、P2 等 P1。四條件是互斥、持有且等待、不可剝奪與循環等待。所有程序按固定次序拿資源可打破循環等待。",
            "trap": "需要等待不代表已經形成循環。",
            "criteria": [
              [
                5,
                "寫出兩個等待方向、正確列四條件，並說出所選策略破壞哪一個條件。"
              ]
            ]
          }
        ]
      },
      {
        "title": "輪轉排程",
        "pages": [
          38
        ],
        "setup": "A 有 4 拍工作，B 有 3 拍工作，皆已就緒。時間片為 2 拍，從 A 開始，無 I/O 和切換成本。",
        "parts": [
          {
            "points": 5,
            "prompt": "填 B 結束時是第幾拍，並按順序列出執行區段。",
            "model": "A 用 1–2 拍、B 用 3–4 拍、A 用 5–6 拍、B 用第 7 拍。",
            "trap": "用完時間片且未完成的程序回到就緒隊尾。",
            "fields": [
              {
                "id": "answer",
                "label": "B 完成拍數",
                "format": "integer",
                "answer": 7,
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "列出兩個輪轉和最後只用 1 拍的 B。"
              ]
            ]
          }
        ]
      }
    ],
    "terms": [
      [
        "Operating System",
        {
          "english": "Operating System",
          "chinese": "作業系統",
          "explanation": "管理硬體資源、保護存取並提供應用服務的系統軟體。"
        }
      ],
      [
        "Batch Processing",
        {
          "english": "Batch Processing",
          "chinese": "批次處理",
          "explanation": "先提交一組工作，再由系統依序或依規則安排。"
        }
      ],
      [
        "Time-Sharing",
        {
          "english": "Time-Sharing",
          "chinese": "分時",
          "explanation": "用短時間片讓多個工作輪流使用處理器。"
        }
      ],
      [
        "Context Switch",
        {
          "english": "Context Switch",
          "chinese": "上下文切換",
          "explanation": "由目前程序切換到另一個程序的執行狀態。"
        }
      ],
      [
        "Kernel",
        {
          "english": "Kernel",
          "chinese": "核心",
          "explanation": "在受保護環境管理硬體和主要系統服務。"
        }
      ],
      [
        "Shell",
        {
          "english": "Shell",
          "chinese": "命令列介面程式",
          "explanation": "接收並解讀指令的使用者空間程式。"
        }
      ],
      [
        "Virtual Memory",
        {
          "english": "Virtual Memory",
          "chinese": "虛擬記憶體",
          "explanation": "讓程序使用與實體儲存分離的位址。"
        }
      ],
      [
        "Process",
        {
          "english": "Process",
          "chinese": "程序",
          "explanation": "執行中的程式實例及其執行狀態。"
        }
      ],
      [
        "Scheduler",
        {
          "english": "Scheduler",
          "chinese": "排程器",
          "explanation": "按策略從可執行的工作中選擇下一個工作。"
        }
      ],
      [
        "Semaphore",
        {
          "english": "Semaphore",
          "chinese": "號誌",
          "explanation": "以原子操作等待或釋放許可的同步工具。"
        }
      ],
      [
        "Critical Section",
        {
          "english": "Critical Section",
          "chinese": "臨界區",
          "explanation": "為保護共用資料需同步進入的程式段。"
        }
      ],
      [
        "Concurrency",
        {
          "english": "Concurrency",
          "chinese": "並行",
          "explanation": "多個工作在重疊的時間範圍各自有進展。"
        }
      ],
      [
        "Deadlock",
        {
          "english": "Deadlock",
          "chinese": "死結",
          "explanation": "一組程序因互相等待資源而無法自行推進。"
        }
      ],
      [
        "Circular Wait",
        {
          "english": "Circular Wait",
          "chinese": "循環等待",
          "explanation": "等待關係沿著幾個程序繞回起點。"
        }
      ],
      [
        "Livelock",
        {
          "english": "Livelock",
          "chinese": "活結",
          "explanation": "程序在回應彼此時一直改變狀態，卻無有效進展。"
        }
      ],
      [
        "Starvation",
        {
          "english": "Starvation",
          "chinese": "飢餓",
          "explanation": "某個工作長期拿不到資源，即使其他工作持續完成。"
        }
      ],
      [
        "Linux Distribution",
        {
          "english": "Linux Distribution",
          "chinese": "Linux 發行版",
          "explanation": "以 Linux 核心搭配工具、套件與維護方式的一套系統。"
        }
      ],
      [
        "Path",
        {
          "english": "Path",
          "chinese": "路徑",
          "explanation": "指定檔案或目錄在目錄樹中的位置。"
        }
      ],
      [
        "Ready Queue",
        {
          "english": "Ready Queue",
          "chinese": "就緒佇列",
          "explanation": "存放可執行且正在等待 CPU 的程序。"
        }
      ],
      [
        "Blocked State",
        {
          "english": "Blocked State",
          "chinese": "阻塞狀態",
          "explanation": "程序必須等待某事件才能繼續。"
        }
      ],
      [
        "Dispatcher",
        {
          "english": "Dispatcher",
          "chinese": "派遣器",
          "explanation": "將 CPU 控制權交給排程器選中的程序。"
        }
      ],
      [
        "Time Slice",
        {
          "english": "Time Slice",
          "chinese": "時間片",
          "explanation": "排程允許程序連續使用 CPU 的時段。"
        }
      ],
      [
        "Preemption",
        {
          "english": "Preemption",
          "chinese": "搶占",
          "explanation": "作業系統暫停仍可執行的程序並取回 CPU。"
        }
      ],
      [
        "Page Table",
        {
          "english": "Page Table",
          "chinese": "頁表",
          "explanation": "記錄虛擬頁映射和相關狀態的表。"
        }
      ],
      [
        "Page Fault",
        {
          "english": "Page Fault",
          "chinese": "缺頁",
          "explanation": "頁面存取需要作業系統介入的例外。"
        }
      ],
      [
        "Page Frame",
        {
          "english": "Page Frame",
          "chinese": "頁框",
          "explanation": "實體記憶體中可放一個頁面的區塊。"
        }
      ],
      [
        "Resource Allocation Graph",
        {
          "english": "Resource Allocation Graph",
          "chinese": "資源配置圖",
          "explanation": "用箭頭表示程序的資源請求及資源持有情況。"
        }
      ],
      [
        "Mutual Exclusion",
        {
          "english": "Mutual Exclusion",
          "chinese": "互斥",
          "explanation": "同一時間只允許一個程序使用資源。"
        }
      ],
      [
        "Hold and Wait",
        {
          "english": "Hold and Wait",
          "chinese": "持有並等待",
          "explanation": "手上持有資源時仍要求其他資源。"
        }
      ],
      [
        "Aging",
        {
          "english": "Aging",
          "chinese": "老化",
          "explanation": "逐步提高等待較久的程序的優先序。"
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
      89
    ]
  };
  course.terms = new Map(course.terms);
  course.figurePages = new Set(course.figurePages);
  StudySite.registerCourse(course);
})();
