"use strict";

// Older entries use compact metadata and a separate transcript. New papers can supply complete items.
// The optional reference gives the first related slide in the current lecture material.
const studyPastExams = [
  {
    id: "2026-quiz3", year: 2026, month: 11, name: "第三次小考",
    note: "原卷照片第 1 頁列出第 1–11 題。第 1–10 題共 110 分，第 11 題為 10 分加分題。詳解和給分重點由本站整理。",
    items: [
      {
        number: 1, title: "Network Layout for 12 Computers", topic: [[5, 39]], points: 20,
        keywords: "網路拓樸 路由器 交換器 傳輸媒介 網路媒介 光纖 UTP LAN 200 250 80 3 50",
        prompt: "Consider the following layout of 12 computers.",
        figure: "quiz3-2026-layout", figureBeforeContinuation: true, interactive: "network-layout",
        continuation: "Computers 1-4 forms a group, 5-8 forms a group, 9-11 forms a group, and 12 is a group itself. The desired topology is outlined as follows. The green circles forms a LAN, and the black lines indicate where the connection between LANs will be constructed. Devise a network layout plan (using routers, switches, hubs) to connect the computer. Please label the network device you’re using and the network media used in between.",
        steps: [
          "先畫 LAN 邊界。PC 1–4 與 PC 5–8 各接一台 Switch，兩台 Switch 接起來後仍屬於 LAN 1。PC 9–11 接 LAN 2 的 Switch。LAN 3 只有 PC 12，可直接接 Router 的 LAN Port。",
          "看每段距離。組內短線和 LAN 2 的 80 m 段用 Cat 5e UTP（1000BASE-T 通道最長 100 m）。LAN 1 的 Switch 到 Switch 為 200 m，改用光纖。LAN 1 和 LAN 2 是不同 IP 網路，兩端用 Router，250 m 段也用光纖。這兩段可用 50 μm 多模光纖搭配 1000BASE-SX。",
          "跨山的 3 km 與 50 km 可在有布線路徑的情況下合成一條光纖鏈路，接 LAN 2 的 R2 和 LAN 3 的 R3。按圖距合計 53 km，選單模光纖及相容的長距離光模組，例如標稱約 70 km 的 1000BASE-ZX。實際要依布線長度、接頭與熔接損耗驗算光功率預算。",
          "資料從 PC 1 到 PC 12 時，依序經過 S1 → S2 → R1 → R2 → R3。S1、S2 在 LAN 1 按 MAC Address 轉送 Frames，各 Router 依 IP Address 做跨網路轉送。LAN 2 的 S3 是接 PC 9–11 的支線。"
        ],
        tables: [{
          caption: "一組可行的設備與媒介配置", headers: ["連接區段", "圖示距離", "媒介"],
          rows: [
            ["PC 1–4 ↔ S1、PC 5–8 ↔ S2、PC 9–11 ↔ S3", "組內短線", "Cat 5e UTP，每台各接一條"],
            ["S1 ↔ S2（LAN 1）", "200 m", "光纖"],
            ["S2 ↔ R1、R3 ↔ PC 12", "各自的 LAN 內短線", "Cat 5e UTP"],
            ["R1 ↔ R2", "250 m", "光纖"],
            ["R2 ↔ S3（LAN 2）", "80 m", "Cat 5e UTP"],
            ["R2 ↔ R3（跨山）", "3 km + 50 km", "單模光纖，兩端用相容的長距離光模組"]
          ]
        }],
        exam: "PC 1–4 用 UTP 接 S1，PC 5–8 用 UTP 接 S2，S1 與 S2 以 200 m 光纖相連，S2 接 R1。R1 與 R2 以 250 m 光纖相連。PC 9–11 用 UTP 接 S3，S3 用 80 m UTP 接 R2。R2 到 R3 的跨山路段用長距離單模光纖，R3 用 UTP 直接接 PC 12。",
        examEnglish: "Use a switch for each multi-computer group and connect its PCs with UTP. Join the two LAN 1 switches with a 200 m fiber link, and connect the second switch to R1. Connect R1 to R2 with 250 m of fiber. Connect the LAN 2 switch to R2 with 80 m of UTP. Link R2 to R3 across the 3 km and 50 km sections using single-mode fiber and suitable long-reach optics. Connect PC 12 directly to the LAN interface of R3 with UTP.",
        rubric: "保留 3 個 LAN，畫清楚所有電腦接到哪裡。標出 80 m、200 m、250 m 與跨山 3 km＋50 km 各段媒介。主機群內用 Switch 接入，不同 LAN 之間用 Router。若改採其他媒介，需說明距離、設備及地形條件。",
        sources: [["Cisco 乙太網路光模組與銅線距離", "https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html"]]
      },
      {
        number: 2, title: "CSMA/CD and CSMA/CA", topic: [[5, 29]], points: 10,
        keywords: "碰撞偵測 碰撞避免 載波感測 隨機退避 ACK 隱藏終端",
        prompt: "Please explain how the CSMA/CD, CSMA/CA protocol works.",
        steps: [
          "共同起點是 Carrier Sense。要傳資料前先聽 Channel，若忙碌就等候。Multiple Access 指多台裝置共享媒介。",
          "CSMA/CD（Carrier Sense Multiple Access with Collision Detection）用於傳統共享、半雙工 Ethernet。Channel 空閒才送，送的同時偵測是否碰撞。偵測到 Collision 就送 Jam Signal 並停止這次傳輸，再各自 Random Backoff 後重試。",
          "CSMA/CA（Carrier Sense Multiple Access with Collision Avoidance）用於 Wi-Fi。Channel 空閒後經過規定等待時間並倒數 Random Backoff。途中變忙就凍結，下一次空閒再續數。倒數到 0 才送。",
          "Wi-Fi 傳送後用 ACK 確認收到。若未收到 ACK，按規則退避再試。RTS/CTS 可選用來減少隱藏終端造成的碰撞，碰撞仍有可能發生。"
        ],
        exam: "CSMA/CD 先監聽，再邊送邊偵測碰撞。碰撞後停止並 Random Backoff，再重送。CSMA/CA 先監聽，空閒時倒數，忙碌時暫停，到 0 才送。未收到 ACK 就退避重試。",
        examEnglish: "With CSMA/CD, a station senses the channel, transmits when idle, and monitors for collisions while transmitting. On a collision it sends a jam signal, stops, and retries after a random backoff. With CSMA/CA, a Wi-Fi station senses the channel and counts down a random backoff during idle time. It transmits when the backoff expires and retries if the expected ACK does not arrive.",
        rubric: "兩者都先 Carrier Sense。CD 要寫傳送中偵測、撞後停止與隨機退避。CA 要寫傳送前退避、媒介忙時暫停倒數，以及 ACK。"
      },
      {
        number: 3, title: "Five Network Service Protocols", topic: [[5, 83]], points: 10,
        keywords: "應用層 網路服務協定 HTTP FTP SMTP POP3 IMAP 郵件",
        prompt: "List 5 network service protocols",
        steps: [
          "題目要列的是 Network Service Protocols。從講義的 Application Layer 範例選五個，寫全名或用途可讓答案明確。",
          "先用 Web、傳檔和寄信記住 HTTP、FTP、SMTP，再用兩種收信方式補齊 POP3 和 IMAP。",
          "SMTP 負責提交或轉送郵件。POP3 側重下載郵件，IMAP 可讓不同裝置同步伺服器上的郵件與資料夾狀態。"
        ],
        tables: [{ caption: "五個協定各提供什麼服務", headers: ["Protocol", "Full name", "用途"], rows: [
          ["HTTP", "Hypertext Transfer Protocol", "傳送網頁與其他 Web 資源"],
          ["FTP", "File Transfer Protocol", "上傳與下載檔案"],
          ["SMTP", "Simple Mail Transfer Protocol", "提交或轉送郵件"],
          ["POP3", "Post Office Protocol version 3", "下載郵件"],
          ["IMAP", "Internet Message Access Protocol", "讀取並同步伺服器信箱"]
        ] }],
        exam: "HTTP 存取網頁，FTP 傳檔，SMTP 寄送或中繼郵件，POP3 下載郵件，IMAP 同步伺服器信箱。",
        examEnglish: "HTTP for web resources, FTP for file transfer, SMTP for sending or relaying email, POP3 for downloading email, and IMAP for accessing and synchronizing a server mailbox.",
        rubric: "列出五個應用層服務協定即可。順手記住 SMTP 是送信，POP3 和 IMAP 是取信。"
      },
      {
        number: 4, title: "Is the IPv6 Address Space Adequate?", topic: [[5, 62]], points: 10,
        keywords: "IPv4 IPv6 32-bit 128-bit 位址空間 耗盡",
        prompt: "Using 32-bit Internet addresses (IPv4) was originally thought to provide ample room for expansion, but that conjecture is not proving to be accurate. IPv6 uses 128-bit addressing. Will that prove to be adequate? Justify your answer.",
        steps: [
          "n-bit 位址有 2ⁿ 種組合。IPv4 的 32 bits 有 2³² ≈ 4.29 × 10⁹ 種，IPv6 的 128 bits 有 2¹²⁸ ≈ 3.40 × 10³⁸ 種。",
          "兩者相除得 2¹²⁸ ÷ 2³² = 2⁹⁶，約 7.92 × 10²⁸ 倍。位元從 32 增到 128，位址組合數是指數成長。",
          "因此在可預見的需求下，IPv6 的位址空間相當充足。它仍然是有限空間，保留用途、階層式前綴分配等規則也會讓可實際配出的主機位址少於原始組合數。"
        ],
        exam: "IPv6 有 2¹²⁸ 種位址組合，約 3.40 × 10³⁸，是 IPv4 的 2⁹⁶ 倍。即使扣除保留與分配所需空間，對可預見的需求仍足夠。",
        examEnglish: "IPv6 has 2¹²⁸ possible addresses, approximately 3.40 × 10³⁸, which is 2⁹⁶ times the IPv4 address space. Even allowing for reserved addresses and hierarchical allocation, this is ample for foreseeable demand.",
        rubric: "給出 2³²、2¹²⁸ 或 2⁹⁶ 的比較，再解釋為何對可預見的成長足夠。",
        sources: [["RFC 8200 · IPv6 Specification", "https://www.rfc-editor.org/rfc/rfc8200.html"]]
      },
      {
        number: 5, title: "Internet and World Wide Web", topic: [[5, 86]], points: 10,
        keywords: "網際網路 全球資訊網 萬維網 Web WWW Internet HTTP",
        prompt: "Many people use the terms Internet and world-wide web interchangeably. What is the difference between the Internet and the world-wide web?",
        steps: [
          "Internet 是全球互連的 Network of Networks，讓不同的網路可以透過 IP 交換封包。",
          "World Wide Web 是建立在 Internet 上的服務。網頁與其他資源以 URL 識別，瀏覽器用 HTTP 或 HTTPS 向 Web Server 請求資源，Hyperlinks 可串起資源。",
          "以使用情境區分。透過瀏覽器開網頁是在用 Web。用郵件程式以 SMTP 寄信，也在用 Internet。"
        ],
        exam: "Internet 是以 IP 互連的全球網路。WWW 是在 Internet 上運作的服務，用瀏覽器和 HTTP／HTTPS 存取互相連結的網頁與資源。",
        examEnglish: "The Internet is the global network of interconnected networks using IP. The World Wide Web is a service that runs on the Internet and lets browsers retrieve linked resources over HTTP or HTTPS. Email is another Internet service.",
        rubric: "Internet 要寫全球網路基礎。WWW 要寫瀏覽器、網頁資源以及 HTTP／HTTPS，並交代兩者的關係。"
      },
      {
        number: 6, title: "Server Side and Client Side", topic: [[5, 97]], points: 10,
        keywords: "伺服器端 服務端 用戶端 前端 後端 Browser JavaScript",
        prompt: "In web programming, what does the terms “server side” and “client side” refer to?",
        steps: [
          "先看程式在哪裡執行。Client side 在使用者的瀏覽器或裝置上執行，負責呈現頁面、接收輸入與更新畫面。",
          "Server side 在伺服器上執行，接收 Requests，處理驗證、查詢資料庫等工作，再回傳 HTML 或 JSON。",
          "例如送出表單時，瀏覽器可先檢查欄位格式，Server 仍要檢查輸入與權限。JavaScript 在 Browser 和 Server 都能執行，判斷依據是執行位置。"
        ],
        exam: "Client-side code 在 Browser 執行，例如更新畫面。Server-side code 在 Server 執行，例如驗證登入、查資料庫，再回傳結果。",
        examEnglish: "Client-side code runs on the user’s device, commonly in the web browser, and handles page interaction. Server-side code runs on the server, processes requests, and returns responses, for example after checking authorization or querying a database.",
        rubric: "兩邊各寫執行位置和一項工作。用表單或登入流程當例子。"
      },
      {
        number: 7, title: "Client/Server and Peer-to-Peer", topic: [[5, 12]], points: 10,
        keywords: "Client Server P2P 對等式 主從式 服務角色",
        prompt: "Describe the difference between a client/server architecture and peer-to-peer (P2P) architectures.",
        steps: [
          "Client/Server 分清角色。Client 發出 Request，Server 持續提供服務並回傳 Response。例如很多瀏覽器連同一個 Web Service。",
          "P2P 的每個 Peer 都可以請求及提供 Resources。例如下載檔案區塊的同時，也把自己手上的區塊上傳給其他 Peer。",
          "比較資源由誰提供。Client/Server 主要從 Server 取得資源，可以有多台 Server。P2P 的資料可由 Peers 彼此提供，仍可能用集中式服務做登入或找其他 Peer。"
        ],
        exam: "Client/Server 由 Client 請求、Server 提供服務。P2P 的 Peers 可以同時扮演請求者和提供者，彼此交換資源，例如分享檔案區塊。",
        examEnglish: "In a client/server architecture, clients request a service and designated servers provide it. In a P2P architecture, peers can both request and provide resources directly to one another, such as when they exchange pieces of a file.",
        rubric: "交代兩個架構的角色與資源流向。各給一個具體例子。"
      },
      {
        number: 8, title: "The Four TCP/IP Layers", topic: [[5, 101]], points: 10,
        keywords: "TCP/IP 四層 應用層 傳輸層 網路層 資料鏈結層 網路介面層",
        prompt: "The TCP/IP suite contains of 4 layers. What are they and what does each layer do?",
        steps: [
          "由上到下寫 Application → Transport → Internet → Link。Internet Layer 又稱 Network Layer，Link Layer 也可寫 Network Interface Layer。",
          "用開網頁串一次。Application 產生 HTTP 訊息，Transport 把資料送給目的應用程式，Internet 依目的 IP 跨網路轉送，Link 把 Frame 送到同一條鏈路的下一個節點。",
          "封裝可以寫成 Message → TCP Segment／UDP Datagram → IP Packet → Link Frame。接收端依相反順序解封裝。四層寫法把本地鏈路與其實體傳送放在 Link 層的範圍。"
        ],
        tables: [{ caption: "四層模型與各層要做的事", headers: ["層級", "作用", "例子"], rows: [
          ["Application Layer（應用層）", "定義應用程式的訊息與服務", "HTTP、DNS、SMTP"],
          ["Transport Layer（傳輸層）", "端到端的程序通訊，用 Port 找到應用程式", "TCP、UDP"],
          ["Internet Layer（網路層）", "用 IP 位址識別來源與目的，支援跨網路轉送", "IPv4、IPv6"],
          ["Link Layer（網路介面層）", "在同一條鏈路上往下一跳送訊框", "Ethernet、Wi-Fi"]
        ] }],
        exam: "Application 定義應用服務。Transport 負責端到端的程序通訊。Internet 負責 IP 定址與跨網路轉送。Link 負責在本地鏈路上逐跳傳送。",
        examEnglish: "The application layer defines application messages and services. The transport layer provides end-to-end communication between applications and uses port numbers. The internet layer supplies IP addressing and forwards packets across networks. The link layer delivers frames across the local link.",
        rubric: "四層名稱和職責都要寫。Transport 是程序到程序，Internet 是跨網路 IP 轉送，Link 是一跳。",
        sources: [["RFC 1122 · Internet Host Layers", "https://www.rfc-editor.org/rfc/rfc1122.html#page-8"]]
      },
      {
        number: 9, title: "TCP versus UDP", topic: [[5, 111]], points: 10,
        keywords: "TCP UDP 連線 重傳 可靠 有序 Byte Stream Datagram",
        prompt: "What is the difference between using TCP and UDP transferring your data?",
        steps: [
          "TCP（Transmission Control Protocol）先建立連線，提供 Reliable、In-order 的 Byte Stream。用 Sequence Number 和 ACK 辨認資料，遺失時重傳，並執行 Flow Control 與 Congestion Control。",
          "UDP（User Datagram Protocol）採 Connectionless Datagram。應用程式可直接送一個個 Datagram，會保留訊息邊界。UDP 自己不保證抵達或到達順序，也不會替應用程式重傳。",
          "依需求選擇。要求完整、有序的檔案傳輸可用 TCP。即時語音或部分遊戲資料可用 UDP，應用程式可以依需求處理遺失、排序或可靠性。"
        ],
        exam: "TCP 是有連線、可靠且有序的 Byte Stream，提供 ACK、重傳、流量與壅塞控制。UDP 是無連線的 Datagram，開銷較少，沒有內建的重傳或排序保證。",
        examEnglish: "TCP is connection-oriented and delivers a reliable, ordered byte stream using acknowledgments and retransmissions, with flow and congestion control. UDP is connectionless and carries discrete datagrams with less protocol overhead, without built-in retransmission or guarantees of delivery or ordering.",
        rubric: "至少比較連線、可靠性與順序。再補一項機制或使用情境。",
        sources: [["RFC 9293 · TCP", "https://www.rfc-editor.org/rfc/rfc9293.html"], ["RFC 768 · UDP", "https://www.rfc-editor.org/rfc/rfc768.html"]]
      },
      {
        number: 10, title: "DoS and DDoS", topic: [[5, 115]], points: 10,
        keywords: "拒絕服務 阻斷服務 分散式可用性 網路資源 DoS DDoS",
        prompt: "What is DoS and DDoS attacks on the network? How can it be done?",
        steps: [
          "DoS（Denial of Service）破壞 Availability。當網路頻寬、伺服器的處理能力或其他資源被耗盡，正常使用者的請求會變慢、等不到回應或無法送達。",
          "DDoS（Distributed Denial of Service）是從多個來源共同造成的 DoS。單一來源便足以造成部分 DoS，多個來源的負載則可在目標匯集。",
          "用資源與症狀解釋原理。當到達的流量或請求超過系統能處理的量，等待佇列開始堆積，正常請求可能逾時。防禦會監測流量、限制超額請求或由上游協助清洗異常流量。"
        ],
        exam: "DoS 透過耗盡頻寬、連線或運算資源，使正常使用者無法取得服務。DDoS 由多個來源共同施加負載，資源不足時，正常使用者就會遇到延遲、逾時或中斷。",
        examEnglish: "A denial-of-service attack makes a service unavailable to legitimate users by exhausting resources such as bandwidth or server capacity. A distributed denial-of-service attack has the same goal, with load originating from multiple coordinated sources.",
        rubric: "寫出 Availability、資源耗盡的機制、正常使用者看到的結果，以及 DDoS 的多來源特徵。",
        sources: [["CISA · DoS 與 DDoS 的原理和應對", "https://www.cisa.gov/sites/default/files/publications/understanding-and-responding-to-ddos-attacks_508c.pdf"]]
      },
      {
        number: 11, title: "RJ45 Wiring Order (T568B Bonus)", topic: [[5, 114]], points: 10, bonus: true,
        keywords: "RJ45 8P8C T568B 線序 雙絞線",
        prompt: "Please list the wiring order of RJ45 cables using T568B standard.",
        steps: [
          "先標出 Pin 1 到 Pin 8，照腳位寫，避免拿接頭的方向相反時把順序整個倒過來。",
          "T568B 的橙對在 Pin 1、2，綠對在 Pin 3、6。Pin 4、5 是藍、白藍，Pin 7、8 是白棕、棕。"
        ],
        tables: [{ caption: "T568B 由 Pin 1 到 Pin 8", headers: ["腳位", "中文線色", "English"], rows: [
          ["1", "白橙", "White/Orange"], ["2", "橙", "Orange"], ["3", "白綠", "White/Green"], ["4", "藍", "Blue"],
          ["5", "白藍", "White/Blue"], ["6", "綠", "Green"], ["7", "白棕", "White/Brown"], ["8", "棕", "Brown"]
        ] }],
        exam: "Pin 1 → 8 為白橙、橙、白綠、藍、白藍、綠、白棕、棕。",
        examEnglish: "Pins 1 through 8 are white/orange, orange, white/green, blue, white/blue, green, white/brown, and brown.",
        rubric: "照腳位 1 到 8 列完整順序，特別留意第 3 和第 6 腳是綠對。",
        sources: [["Fluke Networks · T568A／T568B 配對", "https://www.flukenetworks.com/blog/cabling-chronicles/wire-map-testing-it-s-not-all-about-color"]]
      }
    ]
  },
  { id: "2018-quiz2", year: 2018, month: 10, name: "第二次小考", questions: `
4:37|I/O-bound and CPU-bound processes|A CPU-bound job and an I/O-bound job are both ready. Which would you favor to keep the CPU and the I/O device busy, and why?|可先讓 I/O-bound 工作發出 I/O 請求。它等待裝置時，CPU 就能執行另一個工作。實際優先順序仍取決於排程策略。
3:42|Direct memory access|Describe how DMA transfers a block between an I/O device and main memory.|CPU 先設定緩衝區、方向與長度，DMA 控制器負責搬移，完成後通知 CPU。裝置傳輸速度與記憶體匯流排仍可能限制吞吐量。
3:59|Instruction timing and data hazards|Six instructions take 5, 3, 3, 2, 7 and 5 cycles. Find sequential time, explain a data hazard, then compare one-instruction and two-instruction launch schedules with dependencies ignored.|循序為 25 cycles。若題意採每拍啟動一條，依各指令的啟動時間加上所需拍數，取最晚完成時間，為 11 cycles；每拍啟動兩條且無資源衝突為 9 cycles。資料危害是後一指令在值尚未就緒時需要它。
3:34|Big-endian and little-endian reads|Four consecutive bytes starting at address 0x2A are C9, 25, 0B and E4. What 32-bit number does each byte order produce?|大端序把第一個 byte 當最高有效位，得 0xC9250BE4；小端序把第一個當最低有效位，得 0xE40B25C9。
4:76|Kernel responsibilities|Explain what the kernel does in an operating system.|核心在特權模式下管理程序、記憶體和裝置，並透過系統呼叫提供受控服務。
4:37,5:54|Load balancing and scaling|Distinguish distributing work among resources from changing the amount of capacity available.|負載平衡把工作適當分派到現有資源。擴充是增加資源容量，例如加大單台規格或增加節點。
4:38|Concurrency on a single core|Explain how one CPU core can make several programs appear to run at once.|計時器與排程器讓程序輪流佔用 CPU，切換時保存與恢復執行狀態。任一時刻仍只有一條執行流佔用該核心。
4:30|Virtual memory and main memory|What is the difference between virtual memory and physical main memory?|虛擬記憶體是程序看到的位址空間，透過頁表映射到實體記憶體。實體主記憶體是實際儲存目前使用中的頁面的 RAM。
4:43|Deadlock and starvation|Give a separate example of deadlock and starvation.|死結例：A 持有印表機且等待掃描器，B 持有掃描器且等待印表機。飢餓例：高優先工作一直搶先，低優先工作持續等不到，但其他工作仍完成。
4:38|Preemption|Describe what it means for an executing process to be preempted.|作業系統可因時間片用完或更高優先工作的需要暫停目前程序，保存狀態並讓另一程序執行。
5:44|Theoretical network transfer time|Find the ideal time to transfer a 2 GB file at 1 Gbps.|採十進位單位，2 GB = 16 Gb，所以理想下限為 16 秒，未計標頭、重傳及其他瓶頸。
3:43|Parallel and serial communication|Compare parallel and serial communication channels.|平行傳輸同時走多條資料線，串列依序在一個或多個串列通道送出。同步偏差與串擾限制高速平行連線，實際速度要看通道數與單通道速率。
3:43|Uncompressed video over USB|Estimate the data rate of uncompressed 1920×1080 video and compare it with the USB versions in the question.|每秒資料量為寬 × 高 × 每像素位元數 × 每秒畫格數。統一成 bit/s 後與各版本的可用吞吐量比較。|照片的畫格率與部分數字辨識不夠清楚，保留計算方法。
` },
  { id: "2022-quiz1", year: 2022, month: 10, name: "第一次小考", questions: `
2:5|Boolean circuit and truth table|Construct a truth table for F = (NOT x AND NOT y AND z) OR (NOT x AND y AND z) OR (x AND NOT y AND z), then simplify it.|三項的共同因子是 z，括號化簡成 NOT (x AND y)。按 xyz = 000 到 111 排列，F 依序是 0, 1, 0, 1, 0, 1, 0, 0。
2:24|Memory capacity using flip-flops|A JK flip-flop stores one bit and uses four NAND gates. How many NAND gates would a 2 GB memory need?|容量先乘 8 得位元數，再乘 4。若題目採 2×2³⁰ bytes，答案為 2³⁶ 個；若採 2×10⁹ bytes，為 64×10⁹ 個。
2:42|Volatile memory|Define volatile memory and give suitable examples.|揮發性記憶體失去電力後無法保持內容。常見例子是 DRAM 與 SRAM。
2:42|Electrically erasable memory|Explain EEPROM and the memory term written as EEPRAM in the paper.|EEPROM 是可用電氣方式抹除、再寫入的非揮發性記憶體。EEPRAM 依卷面保留拼法，解釋時要先說明課上採用的定義。|原卷的第二個縮寫保留，參考解未替它指定唯一含義。
1:81|Stored-program computer|Describe the stored-program idea associated with the EDVAC report.|指令可像資料一樣編碼、存入記憶體。CPU 依程式計數器取指與執行，換工作時可改載入的指令。
2:64|Signed and unsigned interpretation|Interpret hexadecimal B6 as an 8-bit signed two’s-complement value and as an unsigned value.|無號是 182。有號最高位為 1，182 − 256 = −74。兩種解讀的八位元內容相同。
2:75|Eight-bit floating-point arithmetic|A custom float8 uses one sign bit, a three-bit excess-3 exponent and four mantissa bits. Explain how you would evaluate a = 0.2 and b = a + a.|先把 0.2 轉成二進位並按題目慣例編碼，解回實際儲存的 a，再對相加結果做一次編碼。尾數是否有隱藏位和捨入方法會影響答案。|原卷未明示這兩項慣例，保留方法與假設。
2:67|Overflow, underflow and truncation|Explain overflow, underflow and truncation by giving an example of each.|溢位是結果超過可表示範圍；浮點下溢是非零量太接近零，可能成為次正規數或被捨入為零；截斷是直接捨去保留範圍外的位元。
2:38|Disk capacity and image storage|A disk has five platters, 400 cylinders, 24 sectors per track and 512 bytes per sector. Assuming ten usable surfaces, estimate capacity, peak sequential rate at 7200 RPM and the number of 24-bit 1920×1080 images.|容量 49,152,000 bytes。以每轉一軌的資料量估計，120 × 24 × 512 = 1,474,560 B/s。每圖 6,220,800 bytes，可存 7 張完整圖片。
2:97|Even parity of zeros|A ninth bit is used to make the number of zeros even. Check 010100110, 100000011, 111000101 and 000011000, then explain what a passing check guarantees.|四串的 0 分別有 5、6、4、7 個，第一串和第四串不通過。偶數個位元同時翻轉可能漏檢。
2:92|Run-length encoding|Explain run-length encoding. Give a case where the output gets longer.|把連續相同符號寫成符號與次數。若每個符號都只有一次，額外記錄次數可能比原資料還長。
|Technology history bonus|The bonus asked for an approximate date when a type of handheld media viewing became possible. How would you define and justify the date?|答案取決於對手持裝置、媒體和普及程度的定義，可先說明判準再舉實例。|課堂加分題，題意摘要。
` },
  { id: "2025-midterm", year: 2025, month: 10, name: "期中考", questions: `
2:42|DRAM, EEPROM and flash|Compare DRAM, EEPROM and flash memory.|DRAM 揮發且要刷新。EEPROM 與 flash 斷電仍可保存。Flash 通常以區塊抹除，EEPROM 常允許較細粒度的更新。
2:75|Subtraction in a custom float8|Describe how to compute the stored difference between approximations of √2 and √3 using the paper’s eight-bit format.|先分別編碼兩個運算元，解出已量化的值再相減，最後把差重新編碼。捨入與有效位規則要和前一步一致。
2:51|Raster and vector images|Compare bitmap and vector representations.|點陣圖片用像素網格表示；向量圖用圖形、曲線與座標描述。放大向量時可重新繪製，固定解析度的點陣圖放大會看出像素或插值痕跡。
2:92|Huffman coding for a message|Build a Huffman tree from character counts, give the codes and encode the message.|每次合併兩個最小權重，沿樹分配 0 和 1，最後以原字元順序串接。並列權重和左右分支可能讓答案形式不同。|照片中的字串有手寫遮擋，保留題意與解法。
2:101|Recover a RAID 5 drive|Recover the missing bit block in a five-drive RAID 5 stripe from the other four blocks.|把同條帶其餘四個區塊 XOR 起來。偶同位模型下全條帶 XOR 為 0，所以能解出唯一遺失區塊。|保留原題方法，未將照片上不清楚的位元抄入。
3:4|CPU components|Define the CPU and name the three main components covered in class.|CPU 執行指令。控制單元安排取指與執行，ALU 做算術與邏輯，暫存器保存當下資料與狀態。
3:43|Serial buses and parallel buses|Compare serial and parallel device communication, and explain why a high-speed serial bus can be practical.|高速平行匯流排需要多線同步，也較容易有串擾。串列設計可用較少線路達到高單通道速度，實際效能也受協定與通道數影響。
3:59|Four-stage pipeline speedup|Ten instructions each occupy one cycle in each of four stages. Compare non-pipelined and ideal pipelined execution.|循序 10 × 4 = 40 cycles；理想管線 4 + 10 − 1 = 13 cycles，約 3.08 倍。第一條指令仍需要走完四階段。
3:27|Brookshear machine and byte order|Trace a program that loads two values, adds them, stores a byte and halts. Then interpret four bytes starting at the modified address using both endian conventions.|逐條記錄 PC、IR 和暫存器，寫回記憶體後再取最後的四個 bytes。大端依位址順序讀高到低，小端由第一個 byte 當低位。|此題依原卷記憶體表格作答，網站列出題意和解題步驟。
4:10|Operating system functions|List at least five functions an operating system can provide.|例：程序排程、主記憶體管理、檔案系統管理、裝置 I/O 管理、存取保護。可以各說一項具體工作。
4:18|Multiprogramming|Explain how multiprogramming keeps resources in use.|讓多個工作留在記憶體，執行中的工作等待 I/O 時，作業系統可派另一個就緒工作使用 CPU。
4:38|Nonpreemptive work|Give two examples of operations that may have to complete without preemption.|可用課上例子，例如一個受保護的核心臨界區或一個不可被任意拆開的裝置操作。說明中途切換會破壞什麼狀態。
3:37|Graphics adapters and memory channels|Explain integrated versus discrete graphics, and distinguish DDR from dual-channel and quad-channel memory.|整合式顯示常與 CPU 共用系統記憶體，獨立顯示通常有自己的晶片與顯示記憶體。DDR 描述每時脈週期的資料傳輸，雙／四通道描述可並行的記憶體通道數。
|Classroom benchmark bonus|The bonus asked for the score of a benchmark demonstrated in class.|這是當時那台設備的量測值，不能只由處理器或顯示卡的型號推出。|課堂專屬加分題，原分數未確認。
` },
  { id: "2025-quiz2", year: 2025, month: 11, name: "第二次小考", questions: `
4:30|Virtual memory management|Explain how a virtual memory manager translates addresses and handles a missing page.|用位址中的虛擬頁號查頁表，頁內偏移保持不變。缺頁時由作業系統把所需頁載入實體頁框，更新映射後再重啟存取。
4:34|Boot loader|Describe what a boot loader does when a computer starts.|韌體完成初始工作後執行開機載入器。它找到選定的系統，把核心等資料載入記憶體並移交控制。
4:37|Scheduler and dispatcher|Distinguish scheduler and dispatcher responsibilities.|排程器選下一個就緒程序，派遣器負責切換狀態，讓選中的程序接手 CPU。
3:42|DMA transfers|Explain direct memory access and which work remains with the CPU.|CPU 設定傳輸與處理完成通知，控制器執行記憶體與裝置間的實際搬移，CPU 可同時處理其他工作。
5:44|End-to-end bottleneck|A 1.5 GB file goes through a 12 Gbps disk interface, an 8 Gbps motherboard link and a 10 GB/s network link. Estimate the sustained transfer lower bound.|10 GB/s 等於 80 Gbps。以最慢的 8 Gbps 為瓶頸，1.5 GB = 12 Gb，理想下限 1.5 秒。這採串流傳送與十進位單位。
4:43|Deadlock and starvation|Compare deadlock and starvation in an operating system.|死結中的參與者因相互等待而都不能前進。飢餓可能只影響某個一直得不到資源的工作，其他工作仍繼續。
4:18|Multitasking, multiprogramming and time-sharing|Explain how these ideas relate, including the goal of time-sharing.|多道程式讓等待 I/O 時有其他工作可跑，以提高利用率。分時以短時間片快速輪替，重視互動反應。多工是作業系統支援多工作並行進展的較廣用法。
5:30|CSMA/CD and hidden terminals|Describe CSMA/CD and explain how hidden terminals are addressed in a wireless LAN.|CSMA/CD 先聽媒介、送出時偵測碰撞並退避。無線裝置可能互相聽不到，卻都能到達 AP；CSMA/CA 降低碰撞，RTS/CTS 可協助媒介預約。
5:38|Network components|Explain the roles of a router, bridge, NIC, firewall and DHCP service.|Router 查目的 IP 轉送跨網路封包。Bridge 依鏈路層位址轉送訊框。NIC 是裝置的網路介面。Firewall 按規則過濾流量。DHCP 自動分配 IP 等參數。
5:62|IPv4 and IPv6 address spaces|How many bit patterns can IPv4 and IPv6 addresses represent?|IPv4 有 32 bits，可表示 2³² 種。IPv6 有 128 bits，可表示 2¹²⁸ 種。可表示的位址與一般可分配位址是兩回事。
5:51|Large software distribution|Compare client–server and P2P distribution for a large update sent to millions of users.|P2P 可讓下載者同時分享已取得的部分，分散源站上傳負擔。若需要集中控管或同儕上傳不足，伺服器或 CDN 仍有優勢。
5:57|Cloud service models|Name and compare three common cloud service models.|IaaS 提供基礎運算、網路和儲存；PaaS 再管理平台與執行環境；SaaS 提供可直接使用的應用。用誰維護 OS、執行環境和應用來對照。
|Cloud meme bonus|The bonus referred to a service model nicknamed VaaS in a meme. Explain the idea in the original context.|縮寫必須依課堂提到的原始梗圖解讀，再說明服務端與使用者各負責什麼。|課堂加分題，梗圖未附。
` },
  { id: "2025-quiz3", year: 2025, month: 12, name: "第三次小考", questions: `
1:24,6:65|Finding the largest item|Compare a direct scan with sorting first when finding a maximum in one million numbers.|單次求最大值，用首項初始化後掃一趟，只需 999,999 次比較。排序通常成本較高。若僅重複查最大值，可保留已算出的最大值。
6:37|Binary-search trace|Trace a binary search for Oliver in a sorted list of names. Record the surviving interval at each step.|先固定區間慣例，例如閉區間。比較中點後，排除不可能的一半並更新界線；每一步記錄剩下的索引或姓名範圍。
|Josephus circle|Number 100 people in a circle. Starting at 1, repeatedly remove every second person. Which starting label survives?|J(n,2)=2(n−2^⌊log₂n⌋)+1，所以 J(100,2)=73。用程式模擬時，刪除後的索引已指向下一位，記得取模。
6:45|Minimum spanning tree|Find a minimum spanning tree for the weighted graph in the paper.|Kruskal 從小到大挑選邊，略過會成環的邊，連通後應有 V−1 條。也可用 Prim 從一點擴張。
6:28,7|While and do–while loops|Compare pre-test and post-test loops.|while 先檢查條件，可能一次也不做；do–while 先執行一次，再檢查是否繼續。
7|Compiler stages|Describe what a lexer, parser and code generator produce.|Lexer 把字元分成 token；parser 依文法建立語法結構；code generator 把中間表示轉成目標程式碼。
7|Cross-compilation|Explain what cross-compiling means.|編譯器執行的平台和輸出的程式所要執行的平台不同，例如在 x86 電腦上產生給 ARM 裝置執行的程式。
8|Row-major array layout|Use row-major order to relate an index into a flat integer sequence to a position in a C two-dimensional array.|每列有 c 個元素時，索引 k 對應第 ⌊k/c⌋ 列和第 k mod c 欄。實際作答仍需依題目的陣列尺寸與初始化方式。
7|Context-free grammar parse tree|Use the supplied context-free grammar to parse x * y + x * z.|以加法作外層 Expression，左右各是乘法 Term；x、y、z 落在對應的 Factor。依原文法的遞迴方向展開各分支。
7,5:88|Is HTML a programming language?|Explain how HTML is used and what it can express by itself.|HTML 標記內容的結構和語意。可以用 HTML 描述連結、資料表和表單，程式控制流程及一般運算通常由其他語言提供。
|Minimum number of tests|Identify one poisoned bottle among 1000 using a single round of independent binary outcomes.|每個案例可以用結果位元唯一識別，需最小 k 滿足 2ᵏ≥1000，所以 k=10。按瓶號的二進位編號分配每組測試。
|Course staff bonus|The bonus asked students to recall the names of the teaching assistants for that offering.|這題依該學期的課務資訊作答。|課堂專屬加分題。
` },
  { id: "2025-final", year: 2025, month: 12, name: "期末考",
    partScopes: { 11: { a: { lectures: [8], step: 0 }, b: { lectures: [8], step: 1 } } },
    questions: `
4:18|Multiprogramming and time-sharing|Compare the goals of multiprogramming and interactive time-sharing.|前者透過切換到可執行工作提高資源利用率，後者透過短時間片輪換，讓不同使用者或程序有即時反應。
4:30|Virtual memory|Explain how address translation and paging provide a virtual address space.|頁表把虛擬頁對到實體頁框，頁內偏移保留。若頁不在 RAM，缺頁處理會安排載入並更新映射。
5:30|Ethernet contention and hidden terminals|Explain CSMA/CD and how wireless LANs mitigate hidden-terminal collisions.|半雙工共享乙太網可偵測碰撞並退避。隱藏終端是兩發送端互相聽不到但會在接收端衝突，無線網以 CSMA/CA 與可選的 RTS/CTS 降低機率。
1:24,6:65|Maximum-search strategy|Explain when a direct maximum scan is suitable and when a sorted structure could help.|求單一最大值用線性掃描即可。若其他查詢需要有序資料、範圍查詢或頻繁插入，才依工作量評估資料結構與維護成本。
7|Lexing, parsing and code generation|Describe the role of the three translation stages.|把字元切成 token，依文法建立語法結構，再把程式的表示轉成目標指令。
8|Flattened C array indexing|Read positions in a C two-dimensional array using row-major order.|用索引除以欄數找列、取餘數找欄，再依初始化規則取值。此處保留題意與通用解法。
8|Selection in a relation|Relation A(L,M,N) has rows (X,P,1), (Y,Q,7) and (Z,R,6). Relation B(X,Y) has rows (9,7) and (4,3). Select from B where X equals 9, then from A where L equals Z.|B 的結果是 (9,7)，A 的結果是 (Z,R,6)。選擇依條件篩列，保留原來的欄位。
8,5:52|CAP theorem|Explain consistency, availability and partition tolerance, including the trade-off during a partition.|發生分區時，若仍要每個可達節點回應，部分回應可能看不到最新提交；若堅持一致性，系統可拒絕或延後某些請求。CAP 的可用性有特定定義。
8|Hash indexing with seven buckets|Group 9, 12, 5, 2, 88, 23, 55, 72, 21, 67, 22, 7, 13 and 4 by their remainder modulo 7, using separate chaining.|0:21,7；1:22；2:9,2,23,72；3:空；4:88,67,4；5:12,5；6:55,13。用餘數決定桶，依插入順序列出同桶項目。
6:45|Minimum spanning tree cost|Select a minimum spanning tree for the given undirected graph and compute its cost.|挑出不形成環且能連通全部頂點的最小權重邊，再把所選 V−1 條邊的權重加總。
8|Binary search tree operations|A BST has root 75. Its left and right children are 40 and 84. The children of 40 are 23 and 42, and those of 84 are 83 and 90. Nodes 23 and 90 have pairs of children 21/28 and 89/93, respectively. Node 28 has only a right child, 30. Find the inorder and postorder traversals, the inorder predecessor of 90, the height in edges, and the insertion point for 70.|中序：21, 23, 28, 30, 40, 42, 75, 83, 84, 89, 90, 93。後序：21, 30, 28, 23, 42, 40, 83, 89, 93, 90, 84, 75。90 的中序前驅為 89，高度為 4，70 插在 42 的右側。
` },
  { id: "2026-quiz1", year: 2026, month: 10, name: "第一次小考", questions: `
1:81|The stored-program idea|Explain what it means for a computer’s program to be stored in memory.|記憶體可存程式指令與資料。CPU 使用 PC 指向下一條待取指令，同一台電腦可載入不同程式來改變工作。
2:5|Boolean truth table and minimization|Tabulate F = AB OR AB(NOT C) OR (NOT A)BC OR CD for inputs A, B, C and D, then minimize it as a sum of products.|AB 吸收 AB(NOT C)，剩下 AB OR (NOT A)BC OR CD。再用 A OR (NOT A)C = A OR C，可化為 AB OR BC OR CD。對四個輸入共列 16 組。
2:42|ROM, EPROM and EEPROM|Distinguish ROM, EPROM and EEPROM by how information is programmed and erased.|傳統 ROM 寫入後固定；EPROM 可用紫外線抹除後重寫；EEPROM 可用電氣方式抹除再寫入。三者都是非揮發性。
2:67|16-bit signed arithmetic|Under the usual 16-bit two’s-complement wraparound assumption, what happens when a short initialized to 0x7FFF is assigned its value plus 2?|低 16 位是 0x8001，按二補數讀成 −32767。C 中加法通常先提升成 int，超範圍的 signed short 轉換要按實作規則判斷。
2:75|Representing 0.3 in a toy floating-point format|Encode decimal 0.3 in the supplied 8-bit floating-point layout and decode the rounded or truncated result.|0.3 的二進位展開是 0.0100110011…₂。先正規化，再用題目採用的隱藏位、偏移指數及捨入慣例取所需位元。
2:92|Huffman tree and payload size|Build binary Huffman codes for the symbols in the supplied message and find the final encoded length.|統計各符號出現頻率，反覆合併兩個最小頻率。總位數是每種頻率乘碼長後加總，等於所有合併權重的和。
3:12|RISC and CISC|Compare the tendencies of RISC and CISC instruction sets and give an example of each.|RISC 常採較規則的指令格式與 load/store 設計，例如 RISC-V。CISC 常提供較複雜的指令與多種編碼格式，例如 x86。實際效能還取決於微架構與工作負載。
3:14|Three classes of machine instructions|Explain data transfer, arithmetic/logic and control instructions.|資料搬移在暫存器、記憶體等位置間搬資料。算術／邏輯指令改變數值或位元。控制指令改變執行順序，如跳躍與分支。
3:27|PC and IR|How do the program counter and instruction register cooperate when an instruction is fetched?|PC 提供下一條待取指令的位址。取出的指令存入 IR 再解碼，PC 依指令長度往前或於分支時改成目標位址。
2:101|Recover multiple RAID 5 blocks|Recover the missing symbols in 0*110101, *10*111*, 10*1*110 and 01010**0, with one missing value per affected column.|逐欄讓四個 bit 的 XOR 為 0。四列補完為 00110101、11011111、10111110、01010100。
2:92|LZW dictionary compression|Start with A and B in the LZW dictionary. Trace the output phrases for BABAABAAAA.|輸出 B、A、BA、AB、A、AA、A。新建項目依序是 BA、AB、BAA、ABA、AA、AAA。數字碼取決於初始字典編號。
|Course staff bonus|The multiple-choice bonus asked students to identify the teaching assistants for that offering.|這題依該學期的課務資訊作答。|課堂專屬加分題。
` },
  { id: "2026-quiz2", year: 2026, month: 10, name: "第二次小考", questions: `
3:27|Machine-code decoding and memory trace|Decode the given machine instructions and trace the final value at memory address 0x4F.|先用操作碼辨認各指令，再依 PC 逐條追蹤來源、結果和寫回位址。最後找最後一次寫入 0x4F 的值。|此處保留解題方法，原卷的記憶體與暫存器表未重製。
3:59|Sequential and pipelined timing|Five instructions take 5, 5, 4, 8 and 5 cycles. Compare sequential execution and an ideal pipeline with one instruction launched per cycle, ignoring dependencies.|循序為 27 cycles。用第 1 到第 5 拍開始，五條分別於第 5、6、6、11、9 拍完成，最晚為第 11 拍。
3:43|Transfer bottleneck and units|A drive supports 6 Gbps, its USB-C link supports 10 Gbps and the chipset supports 12 Gbps. Estimate the ideal time to transfer 1 TB into memory.|最慢的是 6 Gbps。採十進位單位 1 TB = 8000 Gb，約 1333.3 秒，也就是 22 分 13 秒。
3:42|Memory-mapped I/O and DMA|Explain the difference between memory-mapped I/O and DMA.|Memory-mapped I/O 用一般記憶體存取指令讀寫映射的裝置暫存器。DMA 讓控制器搬移一段資料；CPU 也可能透過映射暫存器設定 DMA。
3:43|Parallel and serial transfers|Compare parallel and serial transmission and discuss which is faster.|平行傳輸同時送多個 bit，串列傳輸按時間依序送。實際快慢要看時脈、通道數和協定，不能只看接線數。
3:43|Device handshaking|Explain what a handshake does between devices or software components.|用 request／acknowledge 等訊號確認對方就緒、資料有效或已收到，讓時序不同的兩端安全交換資料。
4:10|Three operating system functions|List three functions of an operating system.|可舉程序排程、記憶體管理、裝置 I/O 管理，並各寫出系統實際負責的工作。
4:38|Time slices and context-switch overhead|Saving and restoring process state each take 10 ms. Compare the fraction of time spent switching for CPU slices of 500 ms and 100 ms. Explain the trade-off.|每次切換共 20 ms。若分母採總經過時間，比例為 20/520 ≈ 3.85% 與 20/120 ≈ 16.67%。較短時間片通常讓其他程序更快輪到，但切換更頻繁。
4:38|Multiprogramming, preemption, kernel and time sharing|Define the four operating-system terms and explain how they fit together.|多道程式讓多個工作可輪替使用資源。搶先允許 OS 暫停目前程序。核心在特權模式負責管理。分時藉短時間片輪換以提供互動反應。
2:75|Pentium FDIV bug bonus|What caused the historical Pentium floating-point division error?|除法硬體用來選下一個商位的查表內容漏了部分項目，特定輸入會選錯，造成浮點除法結果不正確。
` },
  {
    id: "networks-homework",
    year: 2015,
    name: "電腦網路作業",
    note: "收錄原作業第 1～8 題，共 80 分。",
    items: [
      {
        number: 1, title: "CSMA/CD and CSMA/CA", topic: [[5, 29]], points: 10,
        prompt: "What is CSMA/CD and CSMA/CA?",
        steps: [
          "CSMA 是 Carrier Sense Multiple Access。多個裝置共用傳輸媒介，發送前先偵聽是否有人正在傳。",
          "CSMA/CD 的 CD 是 Collision Detection。傳統共享、半雙工 Ethernet 會一邊傳一邊偵測碰撞。一旦碰撞，停止傳送，隨機退避後再試。現代全雙工交換式 Ethernet 不需要這個碰撞處理流程。",
          "CSMA/CA 的 CA 是 Collision Avoidance，常見於 Wi-Fi。發送前先偵聽媒介，依規則等待及隨機退避，倒數完才送。接收端的 ACK 可確認收到，選用的 RTS/CTS 可減少隱藏終端造成的碰撞。"
        ],
        exam: "兩者都會先偵聽共享媒介。CSMA/CD（碰撞偵測）用於傳統半雙工乙太網路，傳送時若偵測到碰撞就停止，隨機退避後重試。CSMA/CA（碰撞避免）用於 Wi-Fi，發送前透過偵聽和隨機退避降低碰撞機率。",
        examEnglish: "Both methods sense the shared medium before sending. CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is used on classic half-duplex Ethernet. A station that detects a collision while transmitting stops and retries after a random backoff. CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) is used in Wi-Fi to reduce the chance of collisions by sensing the channel and using a random backoff before transmitting.",
        rubric: "各 5 分。寫出全名、各自的運作流程和典型使用情境，並點出偵測碰撞與降低碰撞機率的差別。"
      },
      {
        number: 2, title: "Hubs, Switches, Routers, and Repeaters", topic: [[5, 31]], points: 10,
        prompt: "Describe the following networking devices: Hubs, Switches, Routers, and Repeaters.",
        steps: [
          "Hub（集線器）是實體層的多埠裝置。把從某個埠收到的訊號重送到其他埠，所有相連裝置共用碰撞網域。",
          "Switch（交換器）通常在資料鏈結層接收訊框。它用來源 MAC 學習埠號，再用目的 MAC 決定送到哪個埠。若目的 MAC 未知，通常向同一 VLAN 的其他可用埠泛洪。",
          "Router（路由器）在網路層連接不同 IP 網路。查目的 IP 和路由表，選擇下一跳與輸出介面。",
          "Repeater（中繼器）在實體層重生訊號，再送往下一段媒介以延伸距離。它處理訊號與位元。"
        ],
        exam: "Hub 把訊號送到其他埠。Switch 學來源 MAC、查目的 MAC。Router 查目的 IP 及路由表。Repeater 重生訊號以延長傳輸距離。",
        examEnglish: "A hub repeats incoming signals to its other ports. A switch learns source MAC addresses and forwards frames based on destination MAC addresses. A router uses the destination IP address and its routing table to forward packets between networks. A repeater regenerates signals to extend the transmission distance.",
        rubric: "四種設備各 2.5 分。各寫清楚處理的對象和用途。Switch 的來源學習與目的轉送是兩個不同動作。"
      },
      {
        number: 3, title: "Client/Server and Peer-to-Peer Architectures", topic: [[5, 12]], points: 10,
        prompt: "Describe the difference between a client/server architecture and peer-to-peer (P2P) architectures.",
        steps: [
          "Client/server 將角色分為發出請求的 client 與提供服務的 server。瀏覽器向校務系統請求課表就是一例。服務端可由多台機器共同提供服務。",
          "P2P 的節點可以同時請求和提供資源。例如下載一個檔案時，能向其他節點取缺少的區塊，也把已收到的區塊分享出去。",
          "比較的重點是請求由誰發起、資源由誰提供。P2P 系統仍可有伺服器協助登入或尋找其他節點。"
        ],
        exam: "在主從式架構中，客戶端發出請求，由伺服器提供服務。在點對點（P2P）架構中，每個對等節點都可以向其他節點索取資源，也可以提供資源。",
        examEnglish: "In a client/server architecture, clients request services and servers provide them. In a peer-to-peer (P2P) architecture, each peer can both request resources from and provide resources to other peers.",
        rubric: "說明 client 和 server 的分工 4 分，peer 可兼具兩種角色 4 分，舉例或清楚指出資源分布上的差異 2 分。"
      },
      {
        number: 4, title: "Circuit Switching and Packet Switching", topic: [[5, 59]], points: 10,
        prompt: "What is circuit switch network and packet switching network?",
        steps: [
          "Circuit switching（電路交換）先建立端到端電路，並保留沿途所需的通訊資源。電路維持期間，即使暫時沒有資料，保留的資源也由這條電路占用。傳統電話通話是常見例子。",
          "Packet switching（封包交換）把資料切成封包，透過共享鏈路逐跳轉送。各流量可以交錯使用鏈路，忙碌時可能排隊。在 Internet 的資料報模式裡，封包可能走不同路徑。",
          "比較時可從建立方式、頻寬分配與延遲說明。TCP 建立的是邏輯連線，實際的 IP 封包仍在共享網路上轉送。"
        ],
        exam: "電路交換在通訊開始前先建立端到端電路，並沿途保留傳輸資源。封包交換把資料切成封包，讓封包在共享鏈路上依其位址逐跳轉送。",
        examEnglish: "A circuit-switched network sets up an end-to-end circuit and reserves resources along the path before communication. A packet-switched network divides data into packets and forwards them hop by hop over shared links using their destination addresses.",
        rubric: "電路交換 5 分，交代先建立及保留資源。封包交換 5 分，交代分成封包、共享鏈路與逐跳轉送。"
      },
      {
        number: 5, title: "Domain Name System (DNS)", topic: [[5, 74]], points: 10,
        prompt: "What does a domain name system (DNS) do?",
        steps: [
          "DNS 是分散式、具階層的名稱系統。它能查詢某個網域名稱對應的資源記錄，例如 A 記錄給 IPv4 位址、AAAA 記錄給 IPv6 位址。",
          "主機通常先問 DNS resolver。若沒有可用的快取，resolver 可以循根伺服器、頂級網域伺服器與權威伺服器取得答案，再回覆主機。",
          "DNS 還有 MX 等其他記錄，例如指出某個網域使用的郵件伺服器。"
        ],
        exam: "DNS 是分散式、具階層的名稱系統，能查詢網域名稱對應的資源記錄，例如 IPv4 或 IPv6 位址，讓用戶端知道要連到哪個位址。",
        examEnglish: "DNS is a distributed, hierarchical naming system that resolves domain names to resource records, such as IPv4 or IPv6 addresses, so that clients can determine where to connect.",
        rubric: "寫出網域名稱可查到對應位址或其他資源記錄是核心。可用 A／AAAA、階層分工及快取補充。"
      },
      {
        number: 6, title: "Hypertext Markup Language (HTML)", topic: [[5, 88]], points: 10,
        prompt: "What is Hypertext Markup Language (HTML)?",
        steps: [
          "HTML 是用於描述網頁內容結構與語意的標記語言。瀏覽器讀取網頁文件後，依元素建立文件結構。",
          "例子包括 <h1> 主標題、<p> 段落，以及 <a href='page2.html'>下一頁</a> 超連結。href 屬性指定連結目的地。",
          "HTML 表達結構，CSS 控制樣式，JavaScript 可以加入互動。HTTP 則負責傳送網頁等資源的請求和回應。"
        ],
        exam: "HTML（超文字標記語言）使用標題、段落及超連結等元素來描述網頁的結構與語意，供瀏覽器解讀並呈現。",
        examEnglish: "HTML (Hypertext Markup Language) describes the structure and semantics of web pages using elements such as headings, paragraphs, and hyperlinks.",
        rubric: "交代標記語言、網頁結構或語意，並舉出元素或超連結的例子。"
      },
      {
        number: 7, title: "XML and Alternative Representations", topic: [[5, 93]], points: 10,
        prompt: "What is eXtensible Markup Language (XML)? Is there other representations or similar representations that can also be used and is yet as powerful as XML?",
        steps: [
          "XML 是可以定義自有標籤的文字標記語言，用來表示及交換結構化資料。資訊可由巢狀元素、屬性與文字內容組成。例如 <book id='21'><title>Networks</title></book>。",
          "JSON 也能表達巢狀資料。例如用 {\"book\":{\"id\":\"21\",\"title\":\"Networks\"}} 表示同一筆書籍資料。物件與陣列讓程式能保存及交換常見的階層式資料。",
          "比較是否同樣強大時，要先指出用途。JSON 足以處理許多資料交換情境。若需保留 XML 的命名空間、屬性或文字與元素交錯的順序，改用 JSON 時要另外約定表示法。MathML 是用 XML 表達數學式的例子。"
        ],
        exam: "XML（可擴展標記語言）可用自訂標籤表示及交換結構化資料。JSON 也能用物件與陣列表達階層式資料，足以處理許多資料交換需求。若要保留 XML 的屬性、命名空間或混合內容的順序，需額外約定如何轉換。",
        examEnglish: "XML (Extensible Markup Language) uses application-defined tags to represent and exchange structured data. JSON can represent hierarchical data using objects and arrays. Preserving XML-specific features such as attributes, namespaces, or the order of mixed text and elements requires explicit mapping conventions.",
        rubric: "定義 XML 並說明自訂標籤 5 分，舉一種可用的表示法並比較適用情境 5 分。"
      },
      {
        number: 8, title: "The Four Layers of TCP/IP", topic: [[5, 108]], points: 10,
        prompt: "Describe the TCP/IP 4 layer model and the activities performed at each layer. (Question 38,40, page 212)",
        steps: [
          "Application（應用層）定義應用程式交換的訊息。例如 HTTP 用來請求網頁資源，DNS 用來查詢名稱。",
          "Transport（傳輸層）在端點的程式之間傳資料，以 port 號送到正確的程式。TCP 提供可靠、有序的位元組流，UDP 傳送各自獨立的資料報。",
          "Internet（網際網路層）使用 IP 位址來跨網路傳送封包。路由器按目的 IP 決定下一跳。",
          "Network Interface（網路介面層，也稱 Link）在相鄰裝置間傳送訊框和實體訊號，例如 Ethernet 或 Wi‑Fi。",
          "例如載入網頁時，應用資料依序經過傳輸層、IP 及網路介面封裝。接收端反向解封裝，把資料還原給應用程式。"
        ],
        exam: "應用層定義應用程式交換訊息的格式與規則，例如 HTTP 與 DNS。傳輸層負責端到端的程式間通訊，用通訊埠識別程式。網際網路層利用 IP 位址將封包跨網路轉送。網路介面層（鏈結層）透過實體訊號，在相鄰裝置之間傳送訊框。",
        examEnglish: "The application layer defines the format and rules for application messages, as in HTTP and DNS. The transport layer provides end-to-end communication and uses ports to identify applications. The Internet layer uses IP addresses to route packets across networks. The network interface (link) layer sends frames over a local link using physical signals.",
        rubric: "每層 2.5 分。寫出四層名稱，並分別說明每層實際做什麼。協定或封裝例子可用來說清楚各層的差異。"
      }
    ]
  }
];
