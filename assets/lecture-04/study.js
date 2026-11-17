"use strict";

StudySite.registerCourseStudy("lecture-04", {
  "terms": {
    "Operating System": {
      "explanation": "各應用不需各自控制硬碟等裝置，由 OS 提供檔案、記憶體等介面。它既負責分配資源，也建立程序間的保護邊界。",
      "related": [
        [
          "Kernel",
          "內部執行受保護的服務"
        ],
        [
          "Scheduler",
          "負責分配處理器使用機會"
        ]
      ]
    },
    "Batch Processing": {
      "explanation": "適合定期報表等可以預先準備輸入的工作。使用者可以先提交，稍後再取得輸出，排程著重整體完成率等目標。",
      "related": [
        [
          "Time-Sharing",
          "關注多人互動時的回應"
        ]
      ]
    },
    "Time-Sharing": {
      "explanation": "每次可能因時間片結束或等待 I/O 交出 CPU，之後派遣其他就緒程序。單核心任何瞬間仍只執行一個。",
      "exam": "從時間圖說明哪些程序執行、就緒或等待。",
      "example": "A 用完兩拍回隊尾，B 可以接著取得 CPU。",
      "related": [
        [
          "Scheduler",
          "決定下一個程序"
        ],
        [
          "Context Switch",
          "保存並切換目前上下文"
        ]
      ],
      "concept": "time-sharing"
    },
    "Context Switch": {
      "explanation": "保存目前暫存器和 PC 等，恢復接下來的程序需要的狀態。切換花費的時間會影響時間片設定。",
      "related": [
        [
          "Process",
          "每個程序有自己的執行上下文"
        ],
        [
          "Time-Sharing",
          "頻繁使用的切換機制"
        ]
      ]
    },
    "Kernel": {
      "explanation": "一般程式透過介面請求檔案操作、配置記憶體等服務。硬體保護可限制使用者程式直接執行高權限操作。",
      "related": [
        [
          "Shell",
          "解析命令後可間接使用核心服務"
        ],
        [
          "Virtual Memory",
          "核心配合硬體管理映射"
        ]
      ]
    },
    "Shell": {
      "explanation": "Shell 可執行內建命令，或尋找並啟動外部程式。展開相對路徑時要考量目前工作目錄。",
      "related": [
        [
          "Kernel",
          "由系統呼叫進入系統服務"
        ],
        [
          "Path",
          "命令操作的檔案位置"
        ]
      ]
    },
    "Virtual Memory": {
      "explanation": "硬體地址轉換與 OS 映射共同把虛擬位址對到實體。多個程序的相同虛擬位址可各自指向不同實體頁；也可刻意共用唯讀頁。",
      "exam": "說明虛擬位址、實體頁與缺頁處理分別扮演的角色。",
      "example": "兩個程序的虛擬 0x1000 可對到不同 RAM 頁，因此互不覆寫。",
      "related": [
        [
          "Kernel",
          "管理程序的映射"
        ],
        [
          "Process",
          "每個程序可有自己的位址空間"
        ]
      ]
    },
    "Process": {
      "explanation": "同一個程式可同時執行兩份，各有 PC、暫存器、記憶體映射等。常見狀態包括就緒、執行和等待。",
      "exam": "根據原因辨認狀態。等待 I/O 完成後可回到就緒。",
      "example": "等待磁碟時為等待，磁碟回報完成後，還需要等派遣才真正執行。",
      "related": [
        [
          "Scheduler",
          "從就緒程序選擇"
        ],
        [
          "Context Switch",
          "切換程序執行上下文"
        ]
      ],
      "concept": "time-sharing"
    },
    "Scheduler": {
      "explanation": "可依到達順序、優先權或輪轉政策安排 CPU。政策不同會改變回應時間、等待與公平性。",
      "related": [
        [
          "Time-Sharing",
          "輪流讓多個程序進展"
        ],
        [
          "Starvation",
          "政策一直略過某工作時可能發生"
        ]
      ],
      "concept": "time-sharing"
    },
    "Semaphore": {
      "explanation": "計數號誌可表示剩餘的可用單位。取得操作在沒有許可時等候，釋放操作讓其他使用者能取得；需要一個持有者時要用合適的互斥機制。",
      "related": [
        [
          "Critical Section",
          "保護共用資料的區段可用同步機制"
        ]
      ]
    },
    "Critical Section": {
      "explanation": "讀出、加一、寫回若是三個步驟，兩個程序可先讀到同一舊值再各自覆寫。用互斥保護整段可避免遺失更新。",
      "exam": "找出共享資料及必須視為整體的操作。",
      "example": "兩人同時存款，先各讀到 100，再寫 110，總額應是 120 卻剩 110。",
      "related": [
        [
          "Semaphore",
          "用原子操作協調許可"
        ],
        [
          "Deadlock",
          "不當取得多個鎖可能造成互等"
        ]
      ]
    },
    "Concurrency": {
      "explanation": "單核心可交錯執行，仍要處理共享資料上的先後關係。多核心則可能讓它們實際同時執行。",
      "exam": "分清在一段時間都有進展，與同一時刻同時做。",
      "example": "一個核心交替處理 A、B 是並行；兩個核心同時執行 A、B 是平行。",
      "related": [
        [
          "Time-Sharing",
          "提供交錯進展"
        ],
        [
          "Critical Section",
          "並行接觸可變資料需同步"
        ]
      ]
    },
    "Deadlock": {
      "explanation": "先記錄各資源的持有者，再畫每個程序正在等的資源。當單一實例的互斥資源形成循環，環上的程序都等不到釋放。",
      "exam": "四個必要條件是互斥、持有且等待、不可剝奪、循環等待。能指出預防策略破壞哪個條件。",
      "example": "P1 持有 A 等 B，P2 持有 B 等 A。若要求所有程序先拿 A 再拿 B，可切斷循環等待。",
      "related": [
        [
          "Circular Wait",
          "固定資源順序可破壞這個條件"
        ],
        [
          "Starvation",
          "持續被延後和互相卡住的原因不同"
        ]
      ],
      "concept": "deadlock"
    },
    "Circular Wait": {
      "explanation": "若鎖固定依嚴格遞增的序號取得，每條等待關係都朝向更高編號的資源，就無法繞到較低編號。",
      "exam": "從程序標出在等誰，再追箭頭是否回到自己。",
      "example": "P1 等 P2，P2 等 P3，P3 等 P1，是三個程序的循環。",
      "related": [
        [
          "Deadlock",
          "循環是四個必要條件之一"
        ]
      ],
      "concept": "deadlock"
    },
    "Livelock": {
      "explanation": "兩個動作可反覆讓步或重試，但每次都在相同時間採用相同策略而再次衝突。引入適當的不同行為可避免一直對撞。",
      "related": [
        [
          "Deadlock",
          "兩種情形都無進展，狀態是否持續變化可用來分辨"
        ]
      ]
    },
    "Starvation": {
      "explanation": "高優先權新工作不斷到達時，低優先權舊工作可能一直排不到。老化可把等待時間逐漸算入優先權。",
      "exam": "先檢查是否有等待環，還是某一個工作被反覆略過。",
      "example": "低優先權工作等了很久，但新的高優先權工作照常完成，符合飢餓。",
      "related": [
        [
          "Scheduler",
          "分配政策可能造成或緩解飢餓"
        ],
        [
          "Deadlock",
          "會因互等而不能進展"
        ]
      ]
    },
    "Linux Distribution": {
      "explanation": "使用同系列核心的發行版仍可採用不同套件來源、預設桌面和更新週期。比較兩種發行版須看實際提供的這些部分。",
      "related": [
        [
          "Kernel",
          "同一個核心可搭配不同工具和設定"
        ]
      ]
    },
    "Path": {
      "explanation": "以 / 開頭的 Linux 路徑從根目錄解析。相對路徑從工作目錄開始，一個 .. 往上一層，連續的名稱再往下找。",
      "exam": "先寫出起點，再逐段處理每個名稱與 ..。",
      "example": "從 /home/lin/docs 走 ../pics 會得到 /home/lin/pics。",
      "related": [
        [
          "Shell",
          "指令透過路徑尋找目標"
        ]
      ],
      "concept": "linux-path"
    },
    "Ready Queue": {
      "explanation": "程序在就緒時已具備執行所需條件，但要等排程器選到才開始執行。等磁碟回應的程序先留在等待狀態。",
      "exam": "用「是否仍在等外部事件」分辨就緒與阻塞。",
      "example": "磁碟載入完成，A 通常先回就緒佇列。",
      "related": [
        [
          "Blocked State",
          "還在等事件完成"
        ],
        [
          "Dispatcher",
          "選定程序後交付 CPU"
        ]
      ],
      "concept": "virtual-memory"
    },
    "Blocked State": {
      "explanation": "程序等待磁碟或其他事件時通常無法利用 CPU。事件一完成，常先轉為就緒。",
      "related": [
        [
          "Ready Queue",
          "事件完成後可能返回這個佇列"
        ]
      ],
      "concept": "virtual-memory"
    },
    "Dispatcher": {
      "explanation": "實際交接要載入新程序的執行上下文。排程器決定讓誰執行，派遣器完成交接。",
      "related": [
        [
          "Scheduler",
          "做決定"
        ],
        [
          "Context Switch",
          "交接時可能進行的操作"
        ]
      ],
      "concept": "time-sharing"
    },
    "Time Slice": {
      "explanation": "時間片到期時，搶占式系統可取回 CPU。較短時間片可讓其他程序更快輪到，但切換次數較多。",
      "related": [
        [
          "Time-Sharing",
          "多個程序輪流使用時間片"
        ]
      ],
      "concept": "time-sharing"
    },
    "Preemption": {
      "explanation": "例如時間片到期時暫停尚未完成的程序。此程序可回到就緒並等待下一輪。",
      "related": [
        [
          "Context Switch",
          "取回 CPU 後可能交給另一程序"
        ]
      ],
      "concept": "time-sharing"
    },
    "Page Table": {
      "explanation": "依虛擬頁查實體頁框，再附上原頁內位移，形成實體位址。頁表項也可能記錄存取權和頁面目前是否在 RAM。",
      "related": [
        [
          "Page Fault",
          "映射的狀態可引發此例外"
        ],
        [
          "Virtual Memory",
          "藉映射提供獨立位址空間"
        ]
      ],
      "concept": "virtual-memory"
    },
    "Page Fault": {
      "explanation": "合法頁面若目前不在實體記憶體，作業系統可載入它並更新映射。若存取違反規則，則依系統方式處理錯誤。",
      "exam": "先判斷是否合法，再看頁面是否駐留。",
      "example": "A 等磁碟載入合法頁面時，B 可以獲得 CPU。",
      "related": [
        [
          "Page Table",
          "缺頁處理時可能更新映射"
        ],
        [
          "Blocked State",
          "等待較慢的 I/O 時會進入此狀態"
        ]
      ],
      "concept": "virtual-memory"
    },
    "Page Frame": {
      "explanation": "虛擬頁可映射到任意空閒頁框，且相鄰虛擬頁不必放在相鄰實體頁框。",
      "related": [
        [
          "Page Table",
          "記錄映射的頁框編號"
        ]
      ],
      "concept": "virtual-memory"
    },
    "Resource Allocation Graph": {
      "explanation": "程序指向資源代表請求，資源指向程序代表已分配。每種資源只有一個實例時，圖中的循環表示死結。",
      "exam": "檢查方向與每種資源可用實例數。",
      "example": "P1→B→P2→A→P1 顯示兩個程序互等。",
      "related": [
        [
          "Deadlock",
          "可用圖分析互等"
        ],
        [
          "Circular Wait",
          "由等待關係形成"
        ]
      ],
      "concept": "deadlock"
    },
    "Mutual Exclusion": {
      "explanation": "互斥避免共享狀態被交錯破壞。在多把鎖的情境中，仍需規劃取得順序。",
      "related": [
        [
          "Critical Section",
          "可用互斥保護的區段"
        ],
        [
          "Deadlock",
          "互斥是必要條件之一"
        ]
      ],
      "concept": "deadlock"
    },
    "Hold and Wait": {
      "explanation": "程序握著既有資源又等待新的資源，可能讓別人也無法完成。一次申請所需資源可打破這個條件。",
      "related": [
        [
          "Deadlock",
          "四個必要條件之一"
        ]
      ],
      "concept": "deadlock"
    },
    "Aging": {
      "explanation": "若高優先序工作一直到達，可用等待時間提高舊工作的優先序。實際能否保證服務還要看排程規則。",
      "related": [
        [
          "Starvation",
          "老化可緩解長期等不到 CPU 的情況"
        ]
      ]
    }
  }
});
