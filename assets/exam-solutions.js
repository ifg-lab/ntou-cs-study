"use strict";

function workedSolution(exam, rubric, ...steps) {
  return { steps, exam, rubric };
}

function midtermSolution(number) {
  const { steps, exam, rubric } = studyMidterm2026.items[number - 1];
  return { steps, exam, rubric };
}

const storedProgramAnswer = workedSolution(
  "A stored-program computer keeps both instructions and data in main memory. The CPU uses the program counter to fetch instructions, then decodes and executes them. Loading a different program changes the task without rewiring the machine.",
  "寫出 instructions 與 data 都存於記憶體、CPU 取指並執行，以及更換程式如何改變工作。",
  "Instructions 本身也是可編碼的資訊。把程式和它要使用的 data 放在 main memory，就可以透過位址讀到兩者。",
  "PC 指向待取的 instruction。CPU 取出它，解碼後執行，再更新 PC。有 branch 時，下一個位址可以跳到別處。",
  "例如先載入加總程式，再換成排序程式。CPU 的硬體相同，記憶體中的 instructions 變了，執行的工作就變了。"
);

const dmaAnswer = workedSolution(
  "CPU 先設定 DMA controller 的來源、目的、方向及長度。Controller 在 peripheral device 和 main memory 之間搬資料，完成後通常以 interrupt 通知 CPU。",
  "交代 CPU 設定、DMA controller 搬移、完成通知。說明 CPU 可在傳輸期間執行其他工作。",
  "以磁碟讀取為例，CPU 或 driver 先準備 RAM buffer，並設定裝置、目的位址、傳輸方向和位元組數。",
  "DMA controller 取得匯流排使用權後逐批搬運。CPU 無需逐個 byte 執行 load 和 store，可在等待期間執行其他程式。",
  "完成或出錯時通常發出 interrupt，CPU 再檢查狀態。傳輸仍占用匯流排頻寬。"
);

const virtualMemoryAnswer = workedSolution(
  "VMM 把 virtual address 拆成 virtual page number 和 offset。用 page table 或 TLB 找 physical frame，保留原 offset。若有效頁尚不在 RAM，OS 處理 page fault、載入頁、更新映射並重新執行。",
  "包含位址拆分、查表和 offset 不變。缺頁部分需提到載入、更新映射及恢復。",
  "每個 process 有自己的 virtual address space。CPU 發出的位址先拆成 page number 與頁內 offset，硬體可先查 TLB。",
  "若映射有效且頁面已在 RAM，page table 提供 physical frame number，把它與原 offset 接回去。例：4 KiB 頁的虛擬頁 3 對應框 9，offset 0x120 時得到 physical address 0x9120。",
  "若合法頁面尚未駐留，觸發 page fault。OS 取得頁框，必要時換出舊頁，載入或建立所需頁，更新 page table，再重試。無效位址或權限違規要另外處理。"
);

const processModesAnswer = workedSolution(
  "Multitasking 讓多項工作在同一段時間各有進展。Multiprogramming 把多個 programs 放在 main memory，某程序等 I/O 時，CPU 可以跑另一個 Ready Process，提高利用率。Time-sharing 用較短的 time slices 輪替，重視互動回應。",
  "分開回答三個詞。Multiprogramming 寫出多個程式在記憶體及等待 I/O 時換手，time-sharing 寫出時間片與回應性。",
  "Multitasking 描述使用者感受到多項工作同時進展，例如一邊瀏覽網頁、一邊編譯。",
  "Multiprogramming 讓 multiple programs 一起駐留 main memory。A 等磁碟時，scheduler 選 B 跑，減少 CPU idle time。",
  "Time-sharing 以短 time slices 主動輪替，例如 A 還在運算，timer interrupt 到期後也可能切給 B。這讓互動程式較快取得 CPU。"
);

const deadlockAnswer = workedSolution(
  "Deadlock 是一組程序互等對方持有的資源，整組卡住。Starvation 是某程序因分配策略長期拿不到資源，其他程序仍有進展。",
  "各給定義和具體例子。指出死結是環狀等待，飢餓可在其他工作仍完成時發生。",
  "Deadlock 例：A 鎖住印表機後等掃描器，B 鎖住掃描器後等印表機。兩方都要等對方釋放，形成 circular wait。",
  "Starvation 例：低優先權的 C 已在 ready queue，卻一直被新來的高優先工作搶先。高優先工作仍持續完成。",
  "考場判斷時先畫資源的持有與等待關係，再看誰仍能進展。Aging 能逐步提高等待者的優先權，降低飢餓。"
);

const ethernetAnswer = workedSolution(
  "(a) CSMA/CD 先聽共享媒介，空閒才送，傳送時偵測碰撞，碰撞後停止、隨機退避再送。(b) A、C 都能和 AP B 通訊但互相聽不到，可能在 B 造成碰撞。Wi‑Fi 用 CSMA/CA，可另以 RTS/CTS 協調媒介使用。",
  "(a) 寫完偵聽、碰撞偵測、退避與重傳。(b) 畫或描述 A、B、C 的收訊關係，指出碰撞發生在 B，並解釋 CTS 如何讓旁站等待。",
  "(a) 在傳統共享、半雙工 Ethernet，A 先 carrier sense。發現忙就等，空閒才送。若碰撞，停止此訊框，依 backoff 選等待時間，之後重新嘗試。",
  "(b) 畫 A ─ AP B ─ C。A、C 超出彼此的收訊範圍，各自可能聽到空閒，同時送出並在 B 的接收端重疊。",
  "802.11 用 CSMA/CA 先偵聽及隨機退避。若採 RTS/CTS，A 先發 RTS，B 回 CTS，聽到 B 的 C 依 CTS 的 duration 暫停傳送。這能降低資料訊框碰撞的機率。"
);

const maxSearchAnswer = workedSolution(
  "單次找最大值用 linear scan，以首項當目前最大值，逐項更新。1,000,000 個元素要 999,999 次比較。若改成在固定資料中反覆查不同 key，簡化模型下約 20 次以上可考慮先排序再 binary search。",
  "提供可執行的找最大值步驟、比較次數和排序成本。若給 threshold，交代查詢是找不同 key、資料固定且忽略常數。",
  "令 max = a[0]，從 a[1] 掃到最後；遇到更大的值便更新。單次用 n−1 次比較，時間 O(n)，額外空間 O(1)。",
  "若只會反覆問同一份資料的最大值，可以保存第一次掃描的結果。已排序的陣列則直接讀最後一格。",
  "若要反覆查不同 key，設 q 為查詢數，線性掃描最壞約 qn，先排序再查約 n log₂ n + q log₂ n。解得 q > n log₂ n/(n−log₂ n)，當 n=10⁶ 約 19.93，即從 20 次起。實際門檻受資料和實作影響。"
);

const compilerAnswer = workedSolution(
  "Lexer 把原始文字切成 tokens；parser 依文法建構語法結構；code generator 把中間表示翻譯成目標程式。",
  "三階段各寫輸入與產出。可用同一個表達式把三段串起來。",
  "對 x + 5，lexical analyzer 讀入字元，輸出 identifier(x)、plus、integer(5) 三個 tokens。",
  "Parser 接收 tokens，依文法辨認這是一個加法表達式，建立以加法為根的語法樹。若 token 排列不合文法，可回報語法錯誤。",
  "Code generator 根據編譯器的中間表示產生目標指令。例如載入 x，將 5 加進暫存器。"
);

const detailedExamSolutions = {
  "2018-quiz2": {
    1: workedSolution(
      "先給 I/O-bound process CPU，讓它送出 I/O request。它等待裝置時把 CPU 交給 CPU-bound process，使 I/O 與計算重疊。",
      "應寫出優先誰、它會發出 I/O、等待期間另一個程序做什麼。",
      "I/O-bound process 的 CPU burst 通常短，跑一小段便要讀寫裝置。CPU-bound process 則會用較長時間運算。",
      "若先讓 I/O-bound process 發出讀取請求，磁碟便可開始工作；它 blocked 後，scheduler 讓 CPU-bound process 接手。",
      "這樣磁碟與 CPU 同時有工作。若長計算工作先占住 CPU，裝置可能要等到下一次切換才收到請求。"
    ),
    2: dmaAnswer,
    3: workedSolution(
      "(a) 25 cycles。(b) RAW hazard 是後面的 instruction 需要前面尚未算出的結果。(c) 依題序每拍發射一條，11 cycles。(d) 依題序每拍發射兩條，9 cycles。",
      "每小題 5 分。寫出各模式的啟動與完成拍、取最晚完成拍，並舉出一個 data hazard。雙發射採題目列出的指令次序。",
      "(a) 沒有重疊，總拍數 5+3+3+2+7+5=25。以下以第 1 拍開始計數，完成拍 = 開始拍 + 所需拍 − 1。",
      "(b) 真實程式中的 XOR 讀 R4、R5。前面兩條 MOV 若尚未產出這些值，就有 read-after-write hazard，可用 stall 或 forwarding 視情況處理。",
      "(c) 一拍開一條，六條完成拍依序 5、4、5、5、11、10，最晚是 I5 的第 11 拍。",
      "(d) 兩拍組的啟動拍依序為 1、1、2、2、3、3；完成拍為 5、3、4、3、9、7。若另外允許任意重排且完全沒有相依與資源限制，先發射需 7 拍的指令會得到更低理論下限，應與依題序的 9 拍分開。"
    ),
    4: workedSolution(
      "(a) Big-endian: 0xC9250BE4。(b) Little-endian: 0xE40B25C9。",
      "兩個 32-bit 結果需包含四個完整 bytes。寫明低位址對應的有效位，保留 0B 的前導 0。",
      "從記憶體表的 0x20 列找 A、B、C、D 欄，依位址為 2A:C9、2B:25、2C:0B、2D:E4。",
      "(a) Big-endian 的最低位址放最高有效 byte，故依 C9 25 0B E4 讀成整數。",
      "(b) Little-endian 的最低位址放最低有效 byte；以人閱讀整數的高位到低位順序寫 E4 0B 25 C9。"
    ),
    5: workedSolution(
      "Kernel 是 OS 在特權模式運作的核心。它管理 CPU、記憶體與 I/O 裝置，並透過 system calls 提供受控的服務。",
      "要寫出核心角色、至少兩項資源管理工作，可補 system call 例子。",
      "Kernel 負責安排 processes 使用 CPU，管理位址空間，並處理驅動程式與硬體 interrupts。",
      "應用程式要求讀檔時會發出 system call。Kernel 先檢查讀取權限，再安排 I/O，將結果交回應用程式。"
    ),
    6: workedSolution(
      "Load balancing 在現有 processors 間分配可執行工作。Scaling 描述工作與資源增加時如何擴展，例如把可分解的工作拆成 subtasks，使用更多核心。",
      "比較兩個操作解的問題。用具體核心或節點的例子說明，避免把負載平衡理解成每顆核心一律分到相同數量。",
      "已經有四個核心時，scheduler 可把 runnable tasks 從很忙的核心移到較閒的核心，改善利用率，這是 load balancing。",
      "例如將 100 張圖切成可獨立處理的批次，增加可同時處理的核心，從 2 核擴到 4 核，這是 scaling 的例子。",
      "擴充後的速度仍受串行部分、共享匯流排或同步成本影響。"
    ),
    7: workedSolution(
      "單核心可用 time-sharing 模擬多工。OS 透過 timer interrupt 收回 CPU，保存目前程序的 context，恢復下一個 ready process 的 context，快速反覆輪替。",
      "說清楚切換的觸發、狀態的保存與恢復，以及單個核心如何在一段時間內讓多個工作有進展。",
      "OS 讓多個 programs 留在 main memory。A 開始等待 I/O 或 time slice 到期時，切回核心的 scheduler。",
      "保存 A 的 PC 和 registers 等 state，挑選 ready process B，再恢復 B 的 state。",
      "A、B 在同一段時間交錯推進。例如 A 執行 20 ms，輪到 B，再回到 A 上次的位置。單核心同一時刻只執行一條工作流。"
    ),
    8: workedSolution(
      "Virtual memory 是程序所見的邏輯位址空間，由 page table 映射；main memory 是實體 RAM，目前駐留的頁面放在 page frames。",
      "寫出位址空間與實體硬體各是什麼，說明兩者如何對應。",
      "同一個 virtual address 可在不同 process 中映射到不同 RAM 位置，因此程式可有獨立的位址空間。",
      "Main memory 是晶片提供的實體容量。已駐留的虛擬頁由 frame 承載；未駐留的內容可能需要由磁碟載入。"
    ),
    9: deadlockAnswer,
    10: workedSolution(
      "Preemption 指 OS 可在程序尚未結束或自願讓出之前收回 CPU，例如 time slice 到期觸發 timer interrupt 後切換給其他程序。",
      "寫出程序尚未完成、誰觸發切換、如何繼續原工作。",
      "A 還在運算且未提出 I/O。時間片到期時 timer interrupt 讓 CPU 進入 OS。",
      "OS 保存 A 的 PC 和暫存器、把 A 放回 ready queue，讓 B 執行。A 以後能恢復到原本的位置。"
    ),
    11: workedSolution(
      "採 1 Gbps（gigabit/s）與十進位 GB，2 GB = 16 Gb，理論時間 16 s。若卷面 1GBPS 按 gigabyte/s 解讀則是 2 s。",
      "確認 b/B、將檔案大小與速率統一單位、給出數值與秒。這題的印刷大小寫使兩種讀法有不同答案。",
      "理論下限用 time = size / rate，依網路常見的 bit/s 慣例把 2 GB 乘 8，得到 16 Gb。",
      "16 Gb ÷ 1 Gb/s = 16 s，不計封包標頭、重傳及其他瓶頸。",
      "若明寫 1 GB/s，單位已相同，2 GB ÷ 1 GB/s = 2 s。把讀法寫在算式旁。"
    ),
    12: workedSolution(
      "Parallel channel 用多條線同時送多個 bits。Serial channel 在一路上依時序傳送，每個 lane 可用較高的信號速率，多 lane 也可組合。",
      "寫出每次傳送方式與線路差異，能以訊號同步或串擾解釋實際效率。",
      "例如平行 8 線可同時送一個 byte，串列單 lane 依序送 bit。",
      "高速平行匯流排需控制不同線路到達時間的 skew 與 crosstalk；串列可用較少導線，提高單通道速率。總速率仍須看 lanes、訊號速度與協定。"
    ),
    13: workedSolution(
      "1920×1080×24×30 = 1,492,992,000 bit/s ≈ 1.493 Gbps。理論上 USB 1.1 和 2.0 不足，USB 3.0 的 5 Gbps 足夠。",
      "列完整四因子與 bit/s，逐一比較卷面三個 USB 版本，說明比較採標稱上限。",
      "一幀有 2,073,600 pixels，每像素 24 bits，因此每幀 49,766,400 bits。",
      "每秒 30 幀，乘得約 1,493 Mbps。與 12 Mbps、480 Mbps、5,000 Mbps 比較，前兩者皆低於需求。",
      "題目問理論上限。實際輸送還要考慮編碼、協定與裝置能維持的吞吐量。"
    )
  },
  "2022-quiz1": {
    1: workedSolution(
      "(a) xyz 依 000～111 排列，F = 0,1,0,1,0,1,0,0。(b) F = x̄z + ȳz = z·NOT(xy)。",
      "(a) 5 分，列八組輸入與輸出。(b) 5 分，寫出 K-map 分組或等價的布林化簡。",
      "三個 AND 的輸出是 x̄ȳz、x̄yz、xȳz，再接 OR，所以只有 minterms 1、3、5 令 F=1。",
      "K-map 欄為 yz = 00、01、11、10，列為 x = 0、1。(1,3) 合併時 y 變、x̄z 不變；(1,5) 合併時 x 變、ȳz 不變。",
      "OR 兩組得 x̄z+ȳz。提取 z 後用 De Morgan 得 z·NOT(xy)，可回查 x=y=z=1 時輸出為 0。"
    ),
    2: workedSolution(
      "按 2×2³⁰ bytes 計，2×2³⁰×8×4 = 2³⁶ = 68,719,476,736 個 NAND gates。若採十進位 2 GB，則是 64,000,000,000 個。",
      "從 bytes 換成 bits，一個 bit 用一個 JK flip-flop，再乘每個 flip-flop 的 4 個 NAND。",
      "先聲明容量慣例。記憶體題常用 2×2³⁰ bytes，乘 8 得 2³⁴ bits。",
      "每個 JK flip-flop 儲存 1 bit，共需 2³⁴ 個。每個由 4 個 NAND gates 實現，得 2³⁶，未計位址解碼等周邊電路。"
    ),
    3: workedSolution(
      "Volatile memory 需要供電才能保留資料。DRAM 和 SRAM 都是例子；DRAM 另外需要定期 refresh。",
      "寫清楚斷電時資料的行為，至少舉出一種正確記憶體。",
      "Volatile 說的是失去供電後內容消失。DRAM 用電荷儲存且會漏電，因此上電時也要 refresh。",
      "SRAM 用電路保持狀態，只要供電就能保持，常見於 cache；斷電同樣失去內容。"
    ),
    4: workedSolution(
      "EEPROM 是 Electrically Erasable Programmable Read-Only Memory，可用電訊號清除和重新寫入，並在斷電後保存。卷面的 EEPRAM 要依課堂採用的定義作答。",
      "EEPROM 寫全名、擦除方式和非揮發性。第二個縮寫需有課堂明確定義才能確認。",
      "EEPROM 常保存可更新的設定資料。例如裝置重新上電，仍能讀回先前寫入的校正值。",
      "題面另印 EEPRAM；提供的筆記與對應投影片內容沒有確認其全名。若老師口頭指的是 EPROM，應先註明讀法，再解釋 EPROM 以 UV 擦除。"
    ),
    5: storedProgramAnswer,
    6: workedSolution(
      "(a) 假設 8-bit signed char 採 two’s complement，0xB6 = −74。(b) Unsigned char 的同一位元是 182。",
      "寫同一組位元的兩種解讀，列出 182−256，註明 plain char 的有號假設。",
      "B6ₕ = 1011 0110₂。先依無號計算 11×16+6=182。",
      "若是 8-bit two’s complement signed char，最高位為 1，應扣掉 2⁸，得 182−256 = −74。",
      "C 的 plain char 由實作決定是否有號；若該環境的 char 無號，(a) 也讀成 182。"
    ),
    7: workedSolution(
      "依顯式四位尾數、截斷模型，a = 0.1875，b = 0.375，輸出 Value: 0.375000。若採 IEEE 式隱藏位、次正規數與最近值捨入，則為 Value: 0.406250。",
      "先聲明尾數、偏移和捨入假設。用實際儲存的 a 相加，再列出 b 和 printf 輸出。",
      "十進位 0.2 的二進位表示為 0.00110011…₂ = 0.110011…₂×2⁻²。顯式四位截斷得 0.1100₂×2⁻² = 0.1875。",
      "a+a = 0.375 = 0.1100₂×2⁻¹，可精確寫回。printf 的 %f 預設顯示六位小數。",
      "另一套慣例取 000 為次正規數、001 的指數為 −2。次正規間距 2⁻²×2⁻⁴=1/64，0.2 捨入為 13/64，加倍為 26/64=0.40625，可用正常數精確表示。"
    ),
    8: workedSolution(
      "Overflow 是結果超過格式可表示範圍；underflow 是非零浮點結果太接近零，可能成次正規或捨到 0；truncation 是捨去超出保留精度的位元。",
      "各寫定義與一個不同的例子，交代哪個範圍或精度限制被碰到。",
      "8-bit signed integer 的上限是 127，因此數學結果 127+1 超出範圍，這是 overflow。",
      "若最小可表示正數是 δ，結果 δ/4 用最近值捨入會成 0，這是 underflow 的例子。",
      "若保留四個小數位元，直接把 0.110011₂ 寫成 0.1100₂，就是 truncation。"
    ),
    9: workedSolution(
      "(a) 49,152,000 B。(b) 1,474,560 B/s。(c) 7 張完整圖片。假設每片雙面可用、一次讀一軌，每像素 RGB 24 bit。",
      "三小題各 5 分。容量要乘可用 surfaces，傳輸率要把 RPM 換成每秒，圖片數向下取整。",
      "(a) 5 platters × 2 = 10 surfaces，每面對每個 cylinder 有一條 track。10×400×24×512 = 49,152,000 B。",
      "(b) 7200 RPM = 120 轉／秒。一轉讀一軌 24×512 B，故 120×24×512 = 1,474,560 B/s，不計換軌。",
      "(c) 每圖 1920×1080×3 = 6,220,800 B。容量除以每圖 bytes 得約 7.9，最多存 7 張完整圖。"
    ),
    10: workedSolution(
      "(a) 第一與第四串未通過。四串的 0 個數是 5、6、4、7。(b) 通過只能證明偶同位一致，兩個 bit 同時翻轉仍可能漏檢。",
      "題目要數整個九位碼字中的 0。接著解釋為何偶數個翻轉不改變奇偶。",
      "(a) 按題目的 even parity of zeros，0 的數量要是偶數。逐字數得 5、6、4、7，所以第 1、4 組判定有錯。",
      "(b) 若第 2 組的兩個 0 各自翻成 1，0 的數量會從 6 變 4，仍通過，但資料已改變。"
    ),
    11: workedSolution(
      "RLE 把連續相同符號存成 (符號, 次數)，例如 AAAABB → (A,4)(B,2)。交替符號可能讓編碼變長，壓縮效果取決於 runs 和計數欄位的成本。",
      "解釋 run、給壓得動的例子，再給一個會膨脹的例子和理由。",
      "從第一個字元開始數連續出現的次數，遇到不同字元便輸出一組，再開始下一段。",
      "假設符號和計數各占 1 byte，AAAABB 從 6 bytes 減成 4 bytes。ABAB 有四段，每段長 1，反而從 4 bytes 增為 8 bytes。"
    )
  },
  "2025-midterm": {
    1: workedSolution(
      "(a) DRAM 用電容存 bits、會漏電、需 refresh，斷電失去內容。(b) EEPROM 可由電訊號抹除和重寫，斷電可保存。(c) Flash 也非揮發，通常以 block 擦除，例如 SSD、USB drive。",
      "依 3、3、4 原卷配分分項作答。DRAM 要提 refresh，EEPROM 要提 electrical erase，Flash 要提 block erase 和用途。",
      "DRAM = Dynamic Random Access Memory。電容的電荷會漏失，因此需供電及定期 refresh；常用在 main memory。",
      "EEPROM = Electrically Erasable Programmable ROM。可用電訊號更新，常用於體積小、需要保留的裝置設定。",
      "Flash 通常整個 block 才能擦除，可大量儲存資料，常見於 SSD、USB 隨身碟和記憶卡。"
    ),
    2: workedSolution(
      "採顯式四位 mantissa 並截斷，a=1.375、b=1.625，c=−0.25，位元 1 010 1000。若採 IEEE 式隱藏位及最近值捨入，則 a=1.4375、b=1.75，c=−0.3125。",
      "明寫 mantissa 與 rounding 規則。先量化兩個運算元，再計算寫回的差，避免直接拿實數相減後才量化。",
      "顯式格式下，√2 ≈ 0.101101…₂×2¹，截為 0.1011₂×2¹=1.375。√3 ≈ 0.110111…₂×2¹，截為 0.1101₂×2¹=1.625。",
      "相減是 −0.25 = −0.1000₂×2⁻¹。sign = 1、excess-3 exponent = −1+3=2=010、mantissa = 1000。",
      "若採隱藏 1，這兩個正數的 exp 都是 0，分數每格間距 1/16，最接近的值是 1+7/16、1+12/16，因此差 −5/16。原題採自訂 8-bit 格式，需交代假設。"
    ),
    3: workedSolution(
      "Bitmap 將顏色存在固定解析度的 pixel grid，適合照片。Vector 記錄線、曲線與圖形參數，可在不同尺寸重畫，適合 Logo 或示意圖。",
      "比較儲存內容、放大結果、各舉一種用途。",
      "Bitmap 的每個 pixel 有色值。放大原始 16×16 圖會重複或插補像素，新增的像素不含原圖不存在的細節。",
      "Vector 可以記一個圓的中心、半徑和顏色；放大時重算幾何形狀，再針對輸出裝置 rasterize。"
    ),
    4: workedSolution(
      "(a) 一組合法碼是 A=011、B=110、C=10、D=111、E=00、F=010。(b) 依原字串查碼表，完整編碼見下方，總長 81 bits。",
      "(a) 5 分，頻率、最小權重合併、樹與碼表需一致。(b) 寫出連續的編碼，81 bits 可作驗算。等權重或左右對調可有不同合法答案。",
      "逐字計次：A=4、B=4、C=8、D=6、E=7、F=3，共 32 字元。合併 F3+A4 得 7，再合併 B4+D6 得 10。",
      "此時是 E7、子樹7、C8、子樹10。先接 7+7=14，再接 8+10=18，最後 14+18=32。採左 0 右 1，從根一路走到葉得碼表。",
      "依原字串順序替換，開頭 E、C、B、D、A 對應 00 10 110 111 011。將全部字碼連起來是 001011011101100111011100011110101101100101110000000111001011110110100010111011010。",
      "驗算 4×3+4×3+8×2+6×3+7×2+3×3=81。原本 32×3=96 bits，資料本體少 15 bits。"
    ),
    5: workedSolution(
      "RAID 5 同一 stripe 的 XOR 為 0。XOR 四個可讀區塊：11001010 ⊕ 11001110 ⊕ 10010110 ⊕ 01010110 = 11000100。",
      "交代每欄 XOR 或逐塊 XOR 的推導、列出 8-bit 結果，能以 XOR 回 0 檢查。",
      "令 X 為遺失區塊。RAID 5 的 data 和 distributed parity 對齊在同一 stripe，所以四個已知區塊 XOR X 等於全 0。",
      "先算 11001010 ⊕ 11001110 = 00000100，再 ⊕ 10010110 得 10010010，最後 ⊕ 01010110 得 11000100。",
      "X ⊕ X = 0，所以把還原的 11000100 XOR 回中間結果 11000100，得到 00000000。"
    ),
    6: workedSolution(
      "CPU 是執行 machine instructions 的處理器。主要有 Control Unit 控制取指與執行，ALU 做算術及邏輯，registers 暫存資料、指令或位址。",
      "先定義 CPU，再列三個部件和各自工作。",
      "Control Unit 根據 PC 取出 instruction、解碼，發出控制訊號。",
      "ALU 執行 ADD、AND 等算術或位元運算。Registers 保存操作數、結果和狀態，例如 IR 保留目前 instruction。",
      "以 ADD 為例，Control Unit 解碼後讓 ALU 讀暫存器做加法，再將結果寫回暫存器。"
    ),
    7: workedSolution(
      "Parallel 用多條線同時傳多個 bits，serial 每個 lane 依時序送 bits。USB 採高速串列可減少接腳、線材與多線同步負擔，延伸線路也較容易。",
      "兩種模式各寫一個特徵，給出 USB 採 serial 的具體工程原因，例如 skew 或串擾。",
      "8-bit parallel bus 可以八條資料線同拍送一個 byte。單 lane serial 則在一對或一路訊號上依時間序列傳送。",
      "平行線路延遲不同會造成 skew，接收端須確定同一拍的線都有正確資料。高速、長距離下，也較難抑制串擾與控制接腳數。",
      "高速 serial 可在較少線對上提高每 lane 速率，速率需求高時也可使用多 lanes。"
    ),
    8: workedSolution(
      "四級各一拍且無 stalls 時，循序 T=10×4=40，管線 T=4+(10−1)=13，speedup=40/13≈3.08 倍。",
      "給未管線化和管線化兩個總拍數，再相除求 speedup。題目若將『增加』當百分比，可補約 207.7% 的吞吐速度增幅。",
      "循序模式要等一條指令經過 fetch、decode、execute、store 完成後才開始下一條，10 條共 40 cycles。",
      "Pipeline 在第 1 拍進 I1、第 2 拍進 I2。第一條第 4 拍完成，之後每拍完成一條，I10 在第 13 拍完成。",
      "加速比為 40/13。相同工作量下，執行時間減少 (40−13)/40=67.5%，與 speedup 倍數要區分。"
    ),
    9: workedSolution(
      "(a) 依 PC 所指記憶體表，R0=79、R2=3E、R3=3B、PC=2C（hex）。(b) 4A～4D 為 79 98 61 7C，大端 0x7998617C，小端 0x7C619879。",
      "(a) 5 分，寫明採記憶體表的 121C，依取指順序留出 R0、R2、R3 和 PC。(b) 5 分，先列寫回後的四個 bytes，再分別讀兩種 byte order。",
      "PC=22 時取 233B，把 immediate 3B 放入 R3。PC=24 讀得 121C，故 R2 ← M[1C] = 3E。",
      "PC=26 取 5023，R0 ← R2+R3 = 3E+3B = 79。PC=28 取 304A，M[4A] ← 79。PC=2A 取 C000 停機；依取指後 PC+2 的慣例得到 2C。",
      "再讀地址 4A～4D 的 79、98、61、7C。Big-endian 以第一 byte 為最高有效位，little-endian 以第一 byte 為最低有效位。",
      "卷面附錄另列 121E。若按 121E 讀 M[1E]=2F，則 R2=2F、R0=6A，大端 0x6A98617C、小端 0x7C61986A。"
    ),
    10: workedSolution(
      "OS 的五項職責：管理及排程 processes、配置與保護 memory、組織 files/directories、以 drivers 管理 I/O、控制身分與存取權。",
      "至少五個不同職責，每項附一個可辨認的工作。",
      "Processor management 決定下一個使用 CPU 的程序；memory management 配置、回收並保護 RAM 和各程序的位址空間。",
      "File management 管理路徑、目錄和檔案讀寫；device management 透過 driver 和裝置交換資料及處理 I/O。",
      "Security 例如驗證使用者，並依 access control 檢查能否開檔或執行某項特權操作。"
    ),
    11: workedSolution(
      "Multiprogramming keeps multiple programs in main memory. When one process blocks for I/O, the OS schedules another ready process and context-switches to it, keeping the CPU busy.",
      "一定要寫多個程式存在 main memory。交代等待 I/O、ready process 接手、提高 CPU utilization。",
      "先載入 A、B 等多個 programs 到 main memory。只有 A 同時占用這顆 CPU。",
      "A 發出讀碟請求後轉成 blocked。scheduler 從 ready queue 選 B，dispatcher 恢復 B 的狀態。",
      "讀碟完成後以 interrupt 通知，A 可回 ready queue。這段期間 CPU 已執行 B，減少 idle time。"
    ),
    12: workedSolution(
      "例一是暫時停用 preemption 的 kernel critical section，需完成共享資料更新後才切換。例二是 cooperative scheduling 的任務，在完成、阻塞或主動 yield 前持續執行。",
      "各給例子並說明不能任意切換的原因或切換點。若用老師講的裝置工作，要指出該操作要求保有的狀態。",
      "Non-preemptive 工作會持續占用執行資源，到完成、阻塞或自願讓出時才切換。",
      "不能被中途搶先的核心區段可保護暫時不一致的共享狀態，例如先後更新雙向串列兩端指標。",
      "Cooperative 排程的工作要定期交還 CPU。若一項工作一直算而沒有 yield、阻塞或結束，其他工作可能長時間等不到執行。"
    ),
    13: workedSolution(
      "(a) Integrated graphics 通常使用共享 RAM；discrete graphics 通常用獨立 GPU 和 VRAM。(b) DDR 表示每時脈週期傳兩次；dual/quad channel 表示有兩條或四條可並行的記憶體通道。",
      "(a) 比較顯示處理器及記憶體來源。(b) 分清楚每拍的傳輸次數與控制器通道數。",
      "Integrated GPU 通常和 CPU 共用系統記憶體，功耗和成本較低但會共用頻寬。Discrete GPU 通常有自己的高頻寬 VRAM。",
      "DDR = double data rate，以時脈上、下緣傳輸。Dual-channel 和 quad-channel 依控制器、插槽和模組配置使用多條通道。",
      "在單通道頻寬相同且充分交錯存取時，雙、四通道的理論 aggregate 頻寬可約為單通道的兩、四倍。"
    )
  },
  "2025-quiz2": {
    1: virtualMemoryAnswer,
    2: workedSolution(
      "Boot loader 在 firmware 初始化硬體後執行，找到選定的 OS，將 kernel 及啟動所需資料載入記憶體，然後把控制權交給 kernel。",
      "把 firmware、loader、kernel 依時序分開，說出載入及交接。",
      "開機後 CPU 先執行 BIOS 或 UEFI firmware 提供的程式。韌體做基本初始化，依設定找開機入口。",
      "Boot loader 找到相應的 kernel image，必要時提供啟動參數、初始檔案系統，再跳到 kernel 的入口。",
      "從這一刻起由 OS kernel 初始化其餘硬體與服務。若有多個 OS，loader 也可提供選單。"
    ),
    3: workedSolution(
      "Scheduler 決定哪個 Ready Process 接下來使用 CPU；dispatcher 執行這個決定，保存舊 context、恢復新 context，並從選中程序的位置開始執行。",
      "明確區分選擇工作與實際交接，至少說出 PC/registers 或 ready queue 的一個具體細節。",
      "Timer interrupt 到期時，scheduler 根據政策從 ready queue 選擇。Round Robin 例如挑隊首的 B。",
      "Dispatcher 接手，保存 A 的 registers 與 PC，載入 B 的 context，讓 B 從上次停止的位置執行。",
      "在考場可用一句記法：scheduler selects，dispatcher switches。"
    ),
    4: dmaAnswer,
    5: workedSolution(
      "瓶頸是主機板 8 Gbps。10 GB/s = 80 Gbps，檔案 1.5 GB = 12 Gb，故理論下限 12÷8 = 1.5 s。",
      "統一 bit/byte、寫出三段速率、取瓶頸後計算。需說明採連續串流、十進位與理論最大速率。",
      "把路徑畫成 SAS 磁碟 12 Gbps → 主機板 8 Gbps → 網路 10 GB/s。最後一段轉成 80 Gbps。",
      "各段可同時傳送不同部分時，持續吞吐量受最慢一段 8 Gbps 限制。題目問最短時間，用此模型。",
      "1.5 GB × 8 = 12 Gb，除以 8 Gbps。若每段都要等整份檔案收完才轉送，延遲模型會不同。"
    ),
    6: deadlockAnswer,
    7: processModesAnswer,
    8: ethernetAnswer,
    9: workedSolution(
      "(a) Router 依目的 IP 轉送 packets。(b) Bridge 依 MAC 位址轉送或過濾 frames。(c) NIC 是裝置的網路介面。(d) Firewall 依規則允許或阻擋流量。(e) DHCP 租用 IP 並提供連線參數。",
      "依原卷每個名詞 3 分分開作答。Router 寫 destination IP，Bridge 寫 destination MAC，DHCP 寫 lease 和至少一個設定參數。",
      "(a) Router 接在不同網路之間，用 destination IP 查 routing table 決定出口及下一跳。Ethernet 的下一跳還要另行封裝 frame。",
      "(b) Bridge 連接鏈路區段，從 source MAC 學習在哪一側，再按 destination MAC 決定轉送、過濾或對未知目的做 flooding。",
      "(c) NIC 負責連接有線或無線媒介並收送鏈路層 frames，Ethernet NIC 一般具有 MAC 位址。",
      "(d) Firewall 檢查流量及政策，例如依來源、目的、埠號與連線狀態決定放行；可用封鎖外部直接連內網服務作例子。",
      "(e) DHCP 自動租出 IP，提供 subnet mask、default gateway、DNS 等。IPv4 可用 Discover → Offer → Request → ACK 說明。"
    ),
    10: workedSolution(
      "IPv4: 2³² = 4,294,967,296 種。IPv6: 2¹²⁸ = 340282366920938463463374607431768211456 種。",
      "寫出兩種位址的 bit 數和 2 的次方。題目問位址空間，若提到可分配位址，另說明有些範圍有專屬用途。",
      "IPv4 有四個 8-bit octets，共 32 bits，每 bit 有 0、1 兩種。",
      "IPv6 有八組 16-bit 欄位，共 128 bits。縮寫冒號會省略顯示用的 0，但格式長度仍是 128 bits。",
      "將每個位置的兩種選擇相乘，分別得到 2³² 與 2¹²⁸。"
    ),
    11: workedSolution(
      "若要把大型更新發給大量用戶且同儕願意上傳，我選 P2P。使用者下載完某些 chunks 就能提供給其他 peers，分散源站上傳負擔。更新應以簽章驗證。",
      "明確選模型，解釋資料來源、流量如何分攤及成立條件。若選 client-server，也要說明其容量與控制優勢。",
      "Client-server 由中心提供檔案。下載量暴增時，容易受伺服器上傳頻寬限制，可再用 CDN 分流。",
      "P2P 把檔案切 chunks。第一批客戶拿到部分後，一邊下載其他部分一邊分享給下一批，比每人都向源站取全檔省源站頻寬。",
      "假設有足夠可連線、願意上傳的 peers。更新的內容可用官方簽章和雜湊驗證，起始 seed 仍需可用。"
    ),
    12: workedSolution(
      "IaaS 租 VM、storage、network，使用者管 OS 和應用；PaaS 提供受管理的 runtime，使用者部署程式；SaaS 提供已完成的應用，使用者登入使用。",
      "三個全名或縮寫都需配用途，交代 OS、runtime、應用由誰管理。",
      "Infrastructure as a Service：租一台 VM，自行安裝 Linux、套件與網站程式。機房與虛擬化基礎由供應商管理。",
      "Platform as a Service：供應商管理 OS、runtime 等平台。開發者提交程式碼並維護應用和資料，例如部署 Web app。",
      "Software as a Service：供應商管理整套應用。使用者在瀏覽器操作郵件或文件服務，只管理自己的帳號、資料及相關設定。"
    )
  },
  "2025-quiz3": {
    1: maxSearchAnswer,
    2: workedSolution(
      "以 1-based 閉區間並取 floor。第一次第 12 位 James，留下 Liam 到 Xavier（13–24）。第二次第 18 位是 Oliver，找到即停。",
      "交代 floor 與索引慣例，列出每輪 mid 和還保留的名單。若採 ceiling，界線要一致。",
      "初始 lo=1、hi=24，mid=floor((1+24)/2)=12。James 的字母順序早於 Oliver，左半與 James 都可排除。",
      "留下 Liam, Lucas, Mason, Mia, Noah, Oliver, Olivia, Peter, Sophia, Tuvoc, William, Xavier。lo=13、hi=24。",
      "mid=floor((13+24)/2)=18，這格是 Oliver。比對相等後返回索引 18，不再切半。"
    ),
    3: workedSolution(
      "最後剩 No. 73。vector 存 1～100；每步令 pos=(pos+1) mod size 找淘汰者，erase 後下一個人落在原位置，最後輸出唯一剩下的值。",
      "說清楚 pos 在加一前後各代表誰、取模用途、erase 後如何接續，以及輸出 73。",
      "起始 pos=0，持劍者 No. 1。加一得到 No. 2 並刪除。元素往前移，同一 pos 現在指向 No. 3，再加一即淘汰 No. 4。",
      "用模數讓隊尾接回隊首。若刪掉最後元素，位置仍按環狀意義理解，下一輪的取模會回到正確位置。",
      "第一次完整繞圈刪掉偶數，留下 50 人。用 Josephus k=2 公式：100=64+36，最後編號 2×36+1=73。"
    ),
    4: workedSolution(
      "依重繪圖取 3–4、8–9、9–10、4–5、2–9、1–8、3–9、6–8、7–8。這 9 條邊連通 10 點，總權重 38。",
      "給出足以重畫的邊集合，解釋遇環要跳過，檢查 10 個點各在同一分量且恰有 9 條邊。",
      "先從權重 1 的 3–4、8–9 開始，加入 9–10 (2)、4–5 (3)、2–9 (4)。此時形成了幾個較大的連通分量。",
      "權重 5 可選 1–8 和 3–9，使主要分量接上；另一條 4–10 (5) 此時會成環，略過。等權重時可有另一種合法選法。",
      "接 6–8 (6)，最後接上 7–8 (11)。共有 9 條、所有頂點都連通，1+1+2+3+4+5+5+6+11=38。"
    ),
    5: workedSolution(
      "while 是 pre-test，先判斷再執行，可能 0 次。do–while 是 post-test，先執行一次再判斷，至少執行 1 次。",
      "寫出測試發生位置和最少執行次數，給初始條件為假的對比例子。",
      "令 x=0，條件是 x>0。while 先檢查為假，直接跳過本體。",
      "do–while 則會先跑一次本體、再檢查同樣的條件。常見用途是先顯示一次選單，再判斷是否續用。"
    ),
    6: compilerAnswer,
    7: workedSolution(
      "Cross-compiling 是在 host 平台執行編譯器，產生給另一個 target 平台執行的程式，例如在 x86-64 PC 編譯 ARM 韌體。",
      "指出 host 與 target 各是什麼，附例子。把編譯器從哪裡執行與輸出程式跑在哪裡分開。",
      "編譯工具本身在主機執行，它的 code generator 卻依目標 CPU 和 ABI 產生指令及可執行檔。",
      "例如用 x86-64 電腦執行 ARM cross-toolchain，生成 ARM MCU 的韌體。將輸出拿到 MCU 上執行或透過模擬器測試。"
    ),
    8: workedSolution(
      "依題意把陣列攤平後，索引 87 對應 data[4][7]，它在 a=87 時寫入 87×2，因此輸出 174。",
      "寫出每列 20 個元素、除法取列、餘數取欄，再套入初始化的 a×2。",
      "陣列的 row-major layout 讓同一列的 20 個 int 連續。程式以 0 為起始索引。",
      "87÷20 的商是 4、餘數 7。因此 ((int *)data)[87] 按題意讀第五列第八元素，即 data[4][7]。",
      "a=87 的那一輪寫入 174。寫實務程式時可直接用 data[4][7] 表示這個位置。"
    ),
    9: workedSolution(
      "頂層 Expression → Term OP1 Expression，OP1 為 +。左 Term 產生 x*y，右側 Expression → Term，產生 x*z。展開式見下方詳解。",
      "根節點需為 Expression。依題給文法保留 Term、Factor、OP1、OP2，葉從左至右須還原 x*y+x*z。",
      "從最低外層運算 + 切開。用 Expression → Term OP1 Expression，所以 + 在 OP1 下，左是 Term，右仍為 Expression。",
      "左側 x*y 用 Term → Factor OP2 Term，OP2 → *，左 Factor → x，右 Term → Factor → y。",
      "右側 Expression → Term → Factor OP2 Term，以相同規則產生 x*z。不能把 * 放到 OP1，因為 OP1 只產生加減。"
    ),
    10: workedSolution(
      "HTML 是 HyperText Markup Language，藉標籤描述文件結構及語意。它可表達標題、段落、連結、表單。例如要依條件計算或處理互動，可用 JavaScript。",
      "寫出 markup 的用途，說出一般程式語言會表達的控制流程或運算，並用網頁例子區分。",
      "例如 <h1> 將文字標為主標題，<a href=…> 建立連結。這些標記告訴瀏覽器如何理解內容。",
      "HTML 本身沒有一般的 if 或 while 語法。瀏覽器能呈現表單及支援部分內建驗證，遇到更一般的條件判斷與互動可由 JavaScript 實作。"
    )
  },
  "2025-final": {
    1: processModesAnswer,
    2: virtualMemoryAnswer,
    3: ethernetAnswer,
    4: maxSearchAnswer,
    5: compilerAnswer,
    6: workedSolution(
      "按程式所用的 row-major 讀法，((int *)data)[50] 是 data[2][10]，在 a=50 時寫入 50×2=100，所以輸出 100。",
      "以 20 為除數寫出商 2、餘數 10，最後寫初始化的值 100。",
      "每列 20 個 int，前兩列覆蓋索引 0～39。索引 50 位於第三列（從 0 數是列 2）。",
      "50 mod 20 = 10。初始化時 a=50，正好寫 data[2][10]=100。"
    ),
    7: workedSolution(
      "(a) FINAL 的欄是 X,Y，唯一一列 (9,7)。(b) FINAL 的欄是 L,M,N，唯一一列 (Z,R,6)。兩小題分別從原始 relation 執行。",
      "兩小題各 5 分。列出每次結果的欄名及符合條件的完整 row。",
      "(a) 在 B 對 X 欄做選擇。9=9，保留 (9,7)；4≠9，排除 (4,3)。",
      "(b) 在 A 的 L 欄比較 Z。前兩列 X、Y 都不符，只有 (Z,R,6) 通過。",
      "Relational selection 篩的是 rows，原本的 columns 都保留。"
    ),
    8: workedSolution(
      "CAP 的 C 指一致的讀寫視圖（如 linearizability），A 指每個送達未故障節點的請求都取得有效回應，P 指要面對節點間通訊中斷。發生 partition 時，若要保證 C 就可能須拒絕／等待，若要保證 A 就可能讀到舊值。",
      "三個名詞都要定義，並用分區時的同一筆資料示範 C 與 A 的取捨。",
      "把同一份資料複製到 A、B。網路分區後兩者都活著，但接收不到彼此的訊息。",
      "假設 A 已確認把 x 更新成 1，接著使用者讀 B。若 B 回覆舊值 0，保有 availability 但違反 linearizability。",
      "若 B 等到重連才回覆或拒絕此讀取，可以避免回傳不一致的讀值，但在分區中便不能滿足 CAP 的 availability。"
    ),
    9: workedSolution(
      "採 h(k)=k mod 7 並以 separate chaining 保留插入順序。0:[21,7]，1:[22]，2:[9,2,23,72]，3:[]，4:[88,67,4]，5:[12,5]，6:[55,13]。",
      "寫明 7 個 buckets 與碰撞處理假設，交代餘數計算並列出所有 14 筆資料。",
      "例：9 mod 7=2、88 mod 7=4、55 mod 7=6。若相同餘數，放進同個 bucket 的 chain。",
      "從題首依序插入，9 和 2 都到 bucket 2；23 和 72 也到 bucket 2。它們都要保留。",
      "把 0～6 桶畫出來，包括空的 3。若採 open addressing，必須先指定 probing 規則，最後結構會不同。"
    ),
    10: workedSolution(
      "一棵 MST 的邊為 1–8、7–11、2–3、4–5、2–9、9–4、1–2、6–11、1–11、6–10，總成本 48。",
      "列出 10 條邊和總成本，說明按權重檢查並跳過成環邊；允許同成本的合法答案。",
      "Kruskal 先選 1–8 (2)、7–11 (2)、2–3 (3)、4–5 (4)，再以 2–9 (5)、9–4 (5) 合併子樹。",
      "接上 1–2 (6)、6–11 (6)。權重 7 的 3–9 已連通會成環，略過；接 1–11 (7)，使兩大群相連。",
      "以 6–10 (8) 連上最後頂點，共 10 條。2+2+3+4+5+5+6+6+7+8 = 48。"
    ),
    11: workedSolution(
      "(a) 21,23,28,30,40,42,75,83,84,89,90,93。(b) 21,30,28,23,42,40,83,89,93,90,84,75。(c) 89。(d) 4。(e) 插在 42 的右側。",
      "每小題 3 分。寫完整走訪序、找 predecessor 的依據、以邊計算高度、以及插入 70 的比較路徑。",
      "(a) Inorder 是左、根、右。根 75 的左側依序得到 21,23,28,30,40,42；接 75 再接右側 83,84,89,90,93。這棵 BST 的 inorder 應遞增。",
      "(b) Postorder 是左、右、根。左子樹為 21,30,28,23,42,40；右子樹為 83,89,93,90,84；最後才寫 75。",
      "(c) 90 的 inorder predecessor 是其左子樹最大值 89。",
      "(d) 根深度算 0，最長路徑 75→40→23→28→30 共四條邊，所以高度是 4。",
      "(e) 70<75 往左、70>40 往右、70>42 再往右，將 70 放在 42 的右子節點。"
    )
  },
  "2026-quiz1": {
    1: storedProgramAnswer,
    2: workedSolution(
      "(a) 依 ABCD 列 16 組，F=1 的 minterms 為 3、6、7、11、12、13、14、15。(b) F = AB + BC + CD。",
      "(a) 把公式中的 D 納入並給完整 truth table。(b) 用吸收律或圈三個 K-map 群組，每組說明哪些變數固定。",
      "題面列出 A、B、C，算式末項還有 D，因此照公式用 ABCD 四個變數。任一乘積項為 1 就讓 F=1。",
      "AB + ABC̄ = AB，因為 AB 為 1 時已涵蓋 ABC̄。AB + ĀBC = B(A+ĀC) = B(A+C) = AB+BC，末項 CD 保留。",
      "K-map 把 AB、CD 都按 00、01、11、10 排列。圈 {12,13,14,15} 得 AB，圈 {6,7,14,15} 得 BC，圈 {3,7,11,15} 得 CD。圈可互相重疊。"
    ),
    3: workedSolution(
      "ROM 保存固定內容，傳統 mask ROM 在製造時寫入。EPROM 可用 UV 擦除後重寫。EEPROM 透過電訊號擦除與重寫。三者都可在斷電後保存資料。",
      "三個名詞各答怎麼寫入或擦除，特別標出 EPROM 的 UV 與 EEPROM 的 electrical erase。",
      "ROM 屬於非揮發性記憶體，常存 firmware 或不常更新的內容。考題中可把傳統 ROM 當作寫入後固定。",
      "EPROM 的 Erasable 可透過晶片的視窗照 UV 抹除，之後用 programmer 寫入。",
      "EEPROM 多一個 Electrically，可以由電訊號清除後重寫。實際可擦除大小視元件而定。"
    ),
    4: workedSolution(
      "依題意將結果回存為 16 bits，0x7FFF+0x2 = 0x8001。其最高位為 1，以 two’s complement 讀成 32769−65536 = −32767。",
      "寫出 0x7FFF 的十進位值、低 16 位的結果、減 2¹⁶ 後的數值。加數是 2。",
      "0x7FFF = 32767，正好是 16-bit signed short 上限。加 2 的數學結果為 32769。",
      "按題目預期保留 16 位，位元是 1000 0000 0000 0001₂。最高位為 1，扣掉 2¹⁶，得 −32767。",
      "在常見 32-bit int 環境，c + 0x2 先以 int 計算，再縮回 short。這裡使用題目預期的回存結果。"
    ),
    5: workedSolution(
      "顯式四位尾數、截斷時，0.3 編成 0 010 1001，讀回 0.28125。若用 IEEE 式隱藏 1 與最近值捨入，編成 0 001 0011，讀回 0.296875。",
      "寫出正規化、偏移指數與尾數處理，再解回十進位。原題的自訂 8-bit 格式要聲明假設。",
      "將 0.3 連乘 2 取整數位，得到 0.0100110011…₂。顯式尾數格式可寫成 0.100110…₂×2⁻¹。",
      "保留首四位 1001，偏移指數為 −1+3=2，所以 0 010 1001 解回 (9/16)×(1/2)=0.28125。",
      "若採隱藏 1，正規化是 1.001100…₂×2⁻²；最近值捨入保留 0011，得到 1.1875×0.25=0.296875。"
    ),
    6: midtermSolution(2),
    7: midtermSolution(3),
    8: midtermSolution(4),
    9: workedSolution(
      "PC (Program Counter) 保存下一條要取指的記憶體位址。IR (Instruction Register) 保存已取出、目前要解碼或執行的指令。",
      "指出 PC 是位址，IR 是指令內容，補上 fetch 後 PC 和分支時如何更新。",
      "取指開始時假設 PC=0x22。CPU 從 M[0x22] 讀取指令，放入 IR。在題目常見的兩 byte 虛擬機中，PC 先加 2。",
      "Control Unit 讀 IR 的 opcode 和 operands。如果這條指令造成跳躍，PC 改寫成目標位址。"
    ),
    10: workedSolution(
      "完成的四列依序為 00110101、11011111、10111110、01010100。",
      "每個星號都以該欄其餘三個 bit 的 XOR 補回。列出完整四列，檢查任一欄四個 bit XOR 為 0。",
      "同一 stripe 對每個 bit 位置採 even XOR parity，故未知值是該欄其餘三個 bits 的 XOR。八欄各有一個缺值。",
      "例如第 1 欄缺 Drive 2，0⊕1⊕0=1；第 2 欄缺 Drive 1，1⊕0⊕1=0；第 3 欄缺 Drive 3，1⊕0⊕0=1。",
      "第 4、5、6、7、8 欄分別填 1、1、1、0、1。補完後按列抄寫並逐欄驗證。"
    )
  },
  "2026-quiz2": {
    1: workedSolution(
      "(a) 由 PC=22 依序解碼，組合語言與位址見表。(b) B132 在 R1 歸零時跳往 32，STORE 將 R2 累加的 0A+09+⋯+01=0x37 寫進 M[4F]。",
      "(a) 對照 opcode 表，分清 LOAD immediate 和 LOAD from memory，寫全跳轉目標。(b) 追蹤 R1 如何遞減、R2 如何累加及實際寫回的地址和值。",
      "表中都是十六進位。PC=22 起每條指令讀相鄰的兩個 bytes。2000、2200、23FF 用 immediate；110A 要讀 M[0A]，該 byte 是 0A。",
      "在 2A，B132 的意思是 R1=R0 才跳到 0x32。第一輪 R1=0A、R0=00，先往下走；5221 將 R2 加上 R1，5113 將 R1 加上 FF。8-bit 裡 FF 表示 −1，所以 R1 減 1。",
      "PC=30 的 B02A 比較 R0 與自己，始終跳回 2A。反覆十輪，R2 依序是 0A、13、1B、22、28、2D、31、34、36、37，R1 則減到 00。",
      "再次抵達 2A 時條件成立，跳到 32，324F 把 R2 存到 M[4F]。原值 70 被改成 37，C000 隨即停止。"
    ),
    2: workedSolution(
      "(a) 5+5+4+8+5 = 27 cycles。(b) 每拍發射一條時最晚的完成拍為 11，所以共 11 cycles。",
      "(a) 加總五條的 latency。(b) 列開始拍與完成拍，取最大值，並依題意忽略相依。",
      "循序模式中每條都等上一條完成，總拍數是五條指令延遲的和。",
      "管線從第 1～5 拍依序開始 I1～I5。延遲 L 的指令在開始 + L − 1 完成，所以完成拍為 5、6、6、11、9。",
      "I4 第 4 拍開始、占 8 拍，最晚在第 11 拍完成。題面明示忽略相依；實際 I2 會讀 I1 的 R1。"
    ),
    3: workedSolution(
      "瓶頸為硬碟的 6 Gb/s。1 TB=8000 Gb，時間 8000÷6≈1333.33 s，約 22 分 13.3 秒。",
      "把三段速率取最慢，換 TB 到 Gb，再除並保留單位。若採 TiB 需先聲明。",
      "路徑為 6 Gb/s 硬碟 → 10 Gb/s USB-C → 12 Gb/s chipset，最高穩定吞吐受 6 Gb/s 上限限制。",
      "採十進位，1 TB = 10¹² bytes = 8×10¹² bits = 8000 Gb。除以每秒 6 Gb 得 1333.33 秒。",
      "若題意明寫 1 TiB，需把 2⁴⁰ bytes 轉成十進位 Gb，得到約 1466.02 秒，兩種容量慣例不要混寫。"
    ),
    4: workedSolution(
      "Memory-mapped I/O 把裝置控制暫存器映射進位址空間，可用 load/store 操作。DMA 則讓 controller 代 CPU 把一段資料搬到 RAM 或裝置。",
      "分別回答控制裝置的方法與誰搬資料；以同一次傳輸示範兩者可搭配。",
      "例如 driver 對某個 mapped address 寫一個命令。該 address 解碼到裝置的 control register，而非一般 RAM。",
      "可透過這些 registers 告知 DMA 目的 buffer、長度並啟動。資料由控制器搬移，CPU 之後由 interrupt 得知完成。",
      "CPU 也可用 mapped I/O 自己逐筆搬；有沒有使用 DMA 要看傳輸是由誰執行。"
    ),
    5: workedSolution(
      "Parallel communication 同時在多條線傳 bits，serial 在 lane 上依序傳。外部高速介面如 USB 多採 serial，原因包括較少線路、較容易控制多線同步與串擾。",
      "寫兩種傳法，回答實例與原因。主流是針對高速外部連接，內部匯流排仍可能並行。",
      "平行匯流排一次送多 bits，但線越多越需要處理到達時間差（skew）與 crosstalk。",
      "Serial 傳輸可減少接腳與線材，並用高速訊號或多 lanes 提高吞吐量。USB、PCIe 是可寫的例子。",
      "實際速度取決於每 lane 速率、lane 數和協定；平行記憶體通道仍適合相近元件間的大頻寬。"
    ),
    6: workedSolution(
      "Handshaking 是兩端用 request/acknowledge 交換狀態，確認資料有效、對方已收到或已準備好，再繼續下一步。",
      "寫出雙向訊號和何時開始下一筆，說明可處理兩端速度不同。",
      "發送端把資料放到線上，拉高 REQ 或送出 request。接收端能處理後讀資料，再回 ACK。",
      "發送端察覺 ACK 才撤回 request 或前往下一筆，以免速度較慢的接收端漏接。"
    ),
    7: midtermSolution(5),
    8: midtermSolution(6),
    9: midtermSolution(7)
  }
};

function workedTable(caption, headers, rows) {
  return { caption, headers, rows };
}

function binaryTruthTable(variables, ones) {
  const rows = Array.from({ length: 2 ** variables.length }, (_, index) => [
    ...index.toString(2).padStart(variables.length, "0"), Number(ones.includes(index))
  ]);
  return workedTable("完整真值表", [...variables, "F"], rows);
}

const brookshearInstructions = [
  ["22", "2000", "LOAD R0, 00"],
  ["24", "110A", "LOAD R1, [0A]"],
  ["26", "2200", "LOAD R2, 00"],
  ["28", "23FF", "LOAD R3, FF"],
  ["2A", "B132", "JUMP R1, 32"],
  ["2C", "5221", "ADD R2, R2, R1"],
  ["2E", "5113", "ADD R1, R1, R3"],
  ["30", "B02A", "JUMP R0, 2A"],
  ["32", "324F", "STORE R2, [4F]"],
  ["34", "C000", "HALT"]
];

const examHexByte = number => number.toString(16).toUpperCase().padStart(2, "0");
const brookshearLoop = Array.from({ length: 10 }, (_, index) => {
  const round = index + 1;
  const operand = 11 - round;
  const total = round * (21 - round) / 2;
  return [round, examHexByte(operand), examHexByte(total), examHexByte(operand - 1)];
});

const detailedExamWork = {
  "2018-quiz2": {
    3: { tables: [workedTable("各模式啟動與完成拍", ["指令", "延遲", "循序", "單發射", "雙發射"], [
      ["I1", 5, "1 → 5", "1 → 5", "1 → 5"],
      ["I2", 3, "6 → 8", "2 → 4", "1 → 3"],
      ["I3", 3, "9 → 11", "3 → 5", "2 → 4"],
      ["I4", 2, "12 → 13", "4 → 5", "2 → 3"],
      ["I5", 7, "14 → 20", "5 → 11", "3 → 9"],
      ["I6", 5, "21 → 25", "6 → 10", "3 → 7"]
    ])] },
    4: { tables: [workedTable("依位址讀出的 bytes", ["位址", "0x2A", "0x2B", "0x2C", "0x2D"], [
      ["內容", "C9", "25", "0B", "E4"],
      ["Big-endian 有效位", "31–24", "23–16", "15–8", "7–0"],
      ["Little-endian 有效位", "7–0", "15–8", "23–16", "31–24"]
    ])] },
    13: { tables: [workedTable("與理論上限比較", ["介面", "上限", "1,493 Mbps 是否可傳"], [
      ["USB 1.1", "12 Mbps", "否"], ["USB 2.0", "480 Mbps", "否"], ["USB 3.0", "5,000 Mbps", "可"]
    ])] }
  },
  "2022-quiz1": {
    1: { tables: [binaryTruthTable(["x","y","z"], [1,3,5])] },
    10: { tables: [workedTable("逐個碼字檢查", ["收到的位元", "0 的數量", "偶同位"], [
      ["010100110", 5, "未通過"], ["100000011", 6, "通過"], ["111000101", 4, "通過"], ["000011000", 7, "未通過"]
    ])] }
  },
  "2025-midterm": {
    9: { tables: [workedTable("按記憶體表追蹤（十六進位）", ["取指 PC", "IR", "本步寫入", "下一 PC"], [
      ["22","233B","R3 ← 3B","24"], ["24","121C","R2 ← M[1C] = 3E","26"],
      ["26","5023","R0 ← 79","28"], ["28","304A","M[4A] ← 79","2A"], ["2A","C000","停止","2C"]
    ])] }
  },
  "2025-quiz2": {
    9: { tables: [workedTable("設備與轉送依據", ["設備", "判斷的資料", "主要動作"], [
      ["Router", "目的 IP、路由表", "決定封包下一跳"],
      ["Bridge", "來源／目的 MAC", "學習與轉送或過濾訊框"],
      ["NIC", "裝置的鏈路設定", "在實體媒介上收送"],
      ["Firewall", "規則、連線狀態等", "允許或阻擋流量"],
      ["DHCP", "可租位址、租約、用戶需求", "分配位址與連線設定"]
    ])] }
  },
  "2025-quiz3": {
    2: { tables: [workedTable("1-based 閉區間查找", ["輪數", "lo", "hi", "mid", "比對", "下一步"], [
      [1,1,24,12,"James < Oliver","保留 13–24"],
      [2,13,24,18,"Oliver = Oliver","返回 18"]
    ])] },
    9: { drawing: [
      "Expression",
      "├─ Term",
      "│  ├─ Factor → x",
      "│  ├─ OP2 → *",
      "│  └─ Term → Factor → y",
      "├─ OP1 → +",
      "└─ Expression",
      "   └─ Term",
      "      ├─ Factor → x",
      "      ├─ OP2 → *",
      "      └─ Term → Factor → z"
    ].join("\n") }
  },
  "2025-final": {
    7: { tables: [
      workedTable("(a) FINAL", ["X","Y"], [[9,7]]),
      workedTable("(b) FINAL", ["L","M","N"], [["Z","R",6]])
    ] },
    9: { tables: [workedTable("雜湊桶（separate chaining）", ["Bucket","串列"], [
      [0,"21 → 7"],[1,"22"],[2,"9 → 2 → 23 → 72"],[3,"空"],[4,"88 → 67 → 4"],[5,"12 → 5"],[6,"55 → 13"]
    ])] }
  },
  "2026-quiz1": {
    2: { tables: [binaryTruthTable(["A","B","C","D"], [3,6,7,11,12,13,14,15])] },
    10: { tables: [workedTable("逐欄找遺失位元", ["欄", "遺失位置", "三個已知 bit 的 XOR", "還原"], [
      [1,"Drive 2","0 ⊕ 1 ⊕ 0",1], [2,"Drive 1","1 ⊕ 0 ⊕ 1",0],
      [3,"Drive 3","1 ⊕ 0 ⊕ 0",1], [4,"Drive 2","1 ⊕ 1 ⊕ 1",1],
      [5,"Drive 3","0 ⊕ 1 ⊕ 0",1], [6,"Drive 4","1 ⊕ 1 ⊕ 1",1],
      [7,"Drive 4","0 ⊕ 1 ⊕ 1",0], [8,"Drive 2","1 ⊕ 0 ⊕ 0",1]
    ])] }
  },
  "2026-quiz2": {
    1: { tables: [
      workedTable("逐條反組譯（十六進位）", ["PC","機器碼","組合語言"], brookshearInstructions),
      workedTable("迴圈暫存器與累加結果（十六進位）", ["輪數","進入時 R1","ADD 後 R2","遞減後 R1"], brookshearLoop)
    ] },
    2: { tables: [workedTable("開始與完成拍", ["指令","所需拍","開始拍","完成拍"], [
      ["I1",5,1,5], ["I2",5,2,6], ["I3",4,3,6], ["I4",8,4,11], ["I5",5,5,9]
    ])] }
  }
};
