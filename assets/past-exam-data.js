"use strict";

// Each row is one numbered question in the supplied paper. All prompts are study paraphrases.
// The optional reference gives the first related slide in the current lecture material.
const studyPastExams = [
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
2:93|Huffman coding for a message|Build a Huffman tree from character counts, give the codes and encode the message.|每次合併兩個最小權重，沿樹分配 0 和 1，最後以原字元順序串接。並列權重和左右分支可能讓答案形式不同。|照片中的字串有手寫遮擋，保留題意與解法。
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
2:93|Huffman tree and payload size|Build binary Huffman codes for the symbols in the supplied message and find the final encoded length.|統計各符號出現頻率，反覆合併兩個最小頻率。總位數是每種頻率乘碼長後加總，等於所有合併權重的和。
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
` }
];
