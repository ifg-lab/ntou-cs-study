"use strict";

// 範例作答以原課程筆記與考古題為依據。相鄰頁說明同一題型時可共用一個答案。
const examWritingByCourse = (() => {
  const byPage = entries => Object.fromEntries(entries.flatMap(([pages, answer]) =>
    [pages].flat().map(page => [page, answer])));

  return {
    "lecture-01": byPage([
      [[81, 82], "Stored-program Concept 是把 Program Instructions 和 Data 一起放在 Main Memory。CPU 依 PC 指向的位址取出 Instruction，解碼後執行。更換程式時，可載入另一組指令到記憶體，不必重新接線或調整開關。"],
      [83, "以 ENIAC 和 EDVAC 比較：ENIAC 要重新安排接線與開關來更換程式。採 Stored-program Concept 的電腦將 Instructions 和 Data 放在 Main Memory，CPU 從記憶體取指，因此可以靠載入指令更換工作。"]
    ]),

    "lecture-02": byPage([
      [4, "Bit 是 Binary Digit，只有 0 和 1 兩種狀態。依順序排列的 bit 形成 Bit Pattern。同一個 Bit Pattern 可以依不同的編碼規則代表數值或其他資料。"],
      [[5, 6], "AND 在兩個輸入都是 1 時輸出 1；OR 在至少一個輸入為 1 時輸出 1；XOR 在兩個輸入不同時輸出 1；NOT 將 0 和 1 互換。若題目要求 Truth Table，二輸入依 00、01、10、11 列四列，三輸入則列八列。"],
      [7, "Logic Gate 是用電路實作 Boolean Operation 的基本元件。NAND 是 AND 後反相，NOR 是 OR 後反相。兩者都是 Universal Gate，各自可單獨組合出 NOT、AND 和 OR。"],
      [8, [
        "先依輸入組合列 Truth Table。SOP（Sum of Products）是把各個 AND 項用 OR 接起來。畫三變數 K-map 時，兩變數欄用 Gray Code 順序 00、01、11、10，圈相鄰的 1，組的格數須是 2 的次方；可跨邊界、可重疊，優先圈大組。",
        "例如 F(A,B,C) = Σm(1,3,4,5,7)。圈 {1,3,5,7} 時只有 C 固定為 1，得到 C；圈 {4,5} 時 A=1、B=0，得到 AB̄。合起來 F = C + AB̄。作答保留圖上的圈與最後的式子。"
      ]],
      [[16, 17], "Flip-flop 可儲存 1 bit。回授（Feedback）讓輸出回到電路輸入，因此移除設定訊號後仍能保持 Q。若題目給 NAND 或 NOR 接法，要先確認輸入是高有效還是低有效，再讀 Set、Reset 和 Hold。"],
      [[18, 19, 20, 21], "追蹤 Flip-flop 時，先填題目給的初始 Q，再依 Set／Reset 輸入和電路的反相泡泡求出下一個 Q。輸入回到 Hold 條件時，下一個 Q 等於上一個 Q。"],
      [22, "以 Active-high SR 為例：S=1、R=0 為 Set（Q=1），S=0、R=1 為 Reset（Q=0），S=R=0 為 Hold，S=R=1 是禁止狀態。Clocked SR 只在時脈允許時更新；低有效 NAND 接法要依題圖重判。"],
      [23, "JK Flip-flop 的下一個 Q 由 J、K 與原本的 Q 決定。00 保持、01 清為 0、10 設為 1、11 翻轉（Toggle）。Toggle 表示 Qₙₑₓₜ = NOT Q。"],
      [24, "D Flip-flop 在有效時脈事件把 D 存進 Q。T Flip-flop 在 T=0 時保持 Q，在 T=1 時翻轉 Q。計算記憶體電路時，若題目說每個 JK Flip-flop 用 4 個 NAND、每個存 1 bit，2 GiB × 8 bit/B × 4 gate/bit = 2³⁶ 個 NAND。"],
      [27, "Hexadecimal 是 Base 16，每一位十六進位對應 4 bits。整數部分從右往左每 4 bits 一組，不足在左邊補 0。例如 1010 0011 = 0xA3。反向時把 A、3 各換成 1010、0011。"],
      [28, "1 Byte = 8 bits。若每一個可定址儲存格存一個 Byte，n 位元位址可指定 2ⁿ 個儲存格，容量就是 2ⁿ Bytes。若題目給每格 w bits，記得再乘上 w。"],
      [29, "Memory Address 是識別 Main Memory 中特定儲存格的編號。應分開寫出位址與內容：例如 Cell 0 的位址是 0，該格的內容是 10111010。另兩格就算存相同位元，仍能由各自的位址區分。"],
      [31, "DRAM 是揮發性的 Random Access Memory，常用作 Main Memory。電容儲存的電荷會漏失，需要供電並定期 Refresh。SRAM 同樣會在斷電後失去資料，但通電時無須週期刷新，常用作 Cache。"],
      [32, "ROM 通常是非揮發性記憶體，可保存 Firmware 等需要在斷電後還在的指令。PROM 通常一次寫入，EPROM 可用紫外線清除，EEPROM 以電氣訊號抹除、重寫。"],
      [[33, 34], "容量換算先確認題目使用的單位：1 GB = 10⁹ bytes，1 GiB = 2³⁰ bytes，1 byte = 8 bits。例如 2 GiB = 2 × 2³⁰ bytes = 2³⁴ bits。若單位寫法含糊，先把採用的假設寫在算式前。"],
      [[35, 36], "Mass Storage 用來長期保存大量資料。硬碟的 Platter 有可記錄資料的 Surface；同一面上的同心圓是 Track，Track 分為 Sector。規格均勻時，容量 = 可用表面數 × 每面磁軌數 × 每軌磁區數 × 每磁區 bytes。"],
      [37, "HDD Access Time = Seek Time + Rotational Latency + Transfer Time。Seek 是磁頭移到目標磁軌，Rotational Latency 是等磁區轉到磁頭下。以 7200 RPM 為例，一轉 60/7200 秒 ≈ 8.33 ms，平均旋轉延遲約半轉 = 4.17 ms。"],
      [[38, 39, 40], "作答先算容量，再算讀取時間或速率。若題目設定每轉順序讀一軌，Transfer Rate = RPM ÷ 60 × 每軌磁區數 × 每磁區 bytes。要算能放幾個完整檔案，用容量除以每檔 bytes，取整數下限。"],
      [41, "光碟利用雷射讀取記錄層的反射變化，解出儲存的位元。若要和 HDD 比較，寫出光碟用光學讀取，HDD 用磁頭讀取磁化狀態。"],
      [42, [
        "DRAM 是 Volatile Memory，斷電失去資料，通電後也需定期 Refresh，主要用在 Main Memory。",
        "EEPROM 和 Flash 都是 Non-volatile，可利用電氣訊號抹除、重新寫入。Flash 通常以 Block 為單位抹除，常用於 SSD、USB 隨身碟與記憶卡；EEPROM 通常能以較細的單位更新。"
      ]],
      [[44, 45, 46], "ASCII 使用 7 bits 表示 128 個字元。Unicode 為字元指定 Code Point，UTF-8 則是把 Code Point 編成 1 到 4 bytes 的編碼。ASCII 所含字元在 UTF-8 的單位元組表示相同。例如字元 '5' 的 ASCII 為 0x35，整數 5 則可用 0x05 表示。"],
      [48, "Bitmap 用 Pixel 網格保存顏色，未壓縮大小受解析度與色彩深度影響。Vector 用線段、曲線、座標與屬性描述圖形，縮放時可依幾何資料重畫。照片常用 Bitmap，標誌和線條圖可用 Vector。"],
      [51, "不計檔頭、填充與壓縮時，Image Size = Width × Height × bits per pixel。例如 1920 × 1080 × 24 = 49,766,400 bits，除以 8 得 6,220,800 bytes。可存張數 = ⌊可用空間 ÷ 每張 bytes⌋。"],
      [[52, 53], "Spatial Resolution 是圖像在寬與高各有多少 Pixel；Bit Depth 是每個 Pixel 用多少位元表示。降取樣會減少空間細節，降低色彩位深則減少可用顏色。放大後的插值不能還原原本已丟失的細節。"],
      [[54, 55, 56], "Sampling 是每隔固定時間取得振幅；Quantization 是把振幅映射成有限的數值。未壓縮 PCM Bit Rate = Sample Rate × bits per sample × channels。44,100 Hz、16 bits、雙聲道的速率是 1,411,200 bit/s，若求檔案大小再乘秒數並除以 8。"],
      [[57, 58], "Unsigned Binary 每個 1 依所在位置加對應的 2 次方，n 位的範圍為 0 到 2ⁿ−1。MSB 是最高有效位元，LSB 是最低有效位元。例如 101101₂ = 32+8+4+1 = 45。"],
      [[59, 60], "將十進位正整數反覆除以 2，記下餘數，最後由下往上讀。13 ÷ 2 的連續餘數為 1、0、1、1，所以 13₁₀ = 1101₂。若題目指定 8 bits，左側補零為 00001101。"],
      [61, "二進位加法從 LSB 向 MSB 逐欄算，1 + 1 產生本位 0 與進位 1，三個 1 相加則本位 1、進位 1。指定 n bits 時只保留低 n 位；判斷 Signed Overflow 要另外看符號。"],
      [[62, 70], "Binary Point 右側位權是 2⁻¹、2⁻²、2⁻³⋯。例如 101.011₂ = 4 + 1 + 1/4 + 1/8 = 5.375₁₀。轉回二進位時，整數用除 2 取餘數，小數用乘 2 取整數位。"],
      [[63, 64], "n 位元 Two’s Complement 的範圍為 −2ⁿ⁻¹ 到 2ⁿ⁻¹−1。MSB=1 時可先當 Unsigned 讀成 U，再算 U−2ⁿ。例：0xB6 在八位元無號為 182，有號為 182−256 = −74。"],
      [65, "將 −6 寫成 4 位元 Two’s Complement：6 = 0110，逐位反相得到 1001，再加 1 得 1010。驗算 1010₂ = 10−16 = −6。"],
      [[66, 67], "兩個同號的 Two’s Complement 整數相加而結果變號，就是 Signed Overflow。以考題假設只保留低 16 bits 為例，0x7FFF + 1 得 0x8000，按二補數解讀為 −32768。若加的是 2，則得 0x8001，也就是 −32767。"],
      [[68, 69], "Excess 表示法先用 Stored Exponent = Actual Exponent + Bias 編碼，解碼時以實際指數 = 欄位的無號值 − Bias。例如 3-bit Excess-4 中，101₂ = 5，所以實際指數是 1。"],
      [[71, 72, 73], "二進位小數可逐次乘 2 取整數位，例如 0.8125₁₀ = 0.1101₂ = 1.101₂ × 2⁻¹。若遇到 0.1 之類無法以有限位元精確表示的數，依題目指定的捨入或截斷規則保留有效位。"],
      [74, "浮點格式要說清楚 Sign、Exponent、Significand 三部分。若採 IEEE 正規數，數值是 (−1)ˢ × (1.F)₂ × 2ᴱ⁻ᵇⁱᵃˢ；自訂格式要先讀題，確認二進位點位置與是否有隱含的 1。"],
      [75, [
        "自訂 Float8 題先照題目標出 Sign、Exponent、Mantissa、Bias 和精度規則。以本頁 1 | 3 | 4、Bias=4、尾數保留開頭 1 的格式為例，1.5 = 0.1100₂ × 2¹，指數欄 1+4=5=101₂，編碼為 0 | 101 | 1100。",
        "若題目問 a+b 或 a−b，先把已編碼的 a、b 解回實際儲存值，計算後再重新編碼。"
      ]],
      [76, "解碼 01101011，拆為 0 | 110 | 1011。若採本章範例的 Bias=4，110₂−4=2，數值為 0.1011₂ × 2² = 2.75。若題目指定 Excess-3，指數應為 3，按同一尾數規則會得到 5.5。"],
      [77, "2 又 5/8 = 10.101₂ = 0.10101₂ × 2²。依題意截斷為 4 位尾數 1010，Bias=4 時編成 0 | 110 | 1010。解回 0.1010₂ × 2² = 2.5，絕對誤差為 2.625−2.5=0.125。"],
      [[78, 79], "IEEE 754 單精度有 1 個 Sign Bit、8 個 Exponent Bits 和 23 個 Fraction Bits，Bias = 127。正規數的真實指數為 E−127，有效數字是 1.F。E 為全 0 或全 1 時則要先判斷特殊格式。"],
      [[80, 81], "0.75 = 0.11₂ = 1.1₂ × 2⁻¹。IEEE 754 單精度的 S=0，E=−1+127=126=01111110₂，F 是 1 後接 22 個 0。因此欄位為 0 | 01111110 | 10000000000000000000000，十六進位為 0x3F400000。"],
      [[82, 83], "IEEE 754 單精度：E 全 0、F=0 是帶符號的 0；E 全 0、F≠0 是非正規數，有效數字是 0.F；E 全 1、F=0 是 ±∞；E 全 1、F≠0 是 NaN。"],
      [[86, 87, 88, 90, 91], "追蹤程式時依執行順序記錄變數的值。遇到指派，先算右側再更新左側。Syntax Error 是語法無法解析；Runtime Error 在執行到某一步時發生；Logic Error 則是程式能跑完，但結果偏離題意。"],
      [92, [
        "Lossless Compression 可完整還原原資料，Lossy Compression 允許捨棄部分資訊。RLE 用符號和重複次數表示連續相同的資料，例如 AAAABB → (A,4)(B,2)。如果每個符號都不連續，額外記錄次數可能讓資料變長。",
        "Huffman Coding 先統計各符號的 Frequency，每輪合併權重最小的兩個 Node，將總和放回，直到只剩 Root。分支標 0 或 1，從 Root 走到各葉節點得到 Prefix Code。依原字串順序串接碼字，總長 = Σ（頻率 × 碼長）。",
        "考古題例：A、B、C、D、E 的頻率分別是 3、2、6、4、10。合併 2+3=5、4+5=9、6+9=15、10+15=25。一組碼字是 E=0、C=10、D=110、B=1110、A=1111。",
        "總長 = 10×1+6×2+4×3+2×4+3×4 = 54 bits。原本固定每字 3 bits，共 75 bits，節省 21 bits（不含碼表）。左右分支互換會改變碼字，不影響碼長。若題目要求完整編碼，另外按原字串順序串接碼字。"
      ]],
      [93, [
        "按投影片給的字典解碼，1=x、2=y、3=空格、4=xyx。121343434 依序解回 xyx xyx xyx xyx。若每字元和每個代碼都算 1 byte，原文 15 bytes，編碼資料 9 bytes，另計字典成本。",
        "若題目給初始字典並要求自行做 LZW，每次找出字典中與尚未處理的文字相符的最長前綴，輸出它的代碼。如果後面還有字元，就把「前綴＋下一個字元」加入字典，再從這個下一字元繼續。"
      ]],
      [[94, 95], "JPEG 與影音常用的有損編碼可降低儲存及傳輸量；PNG 等無損格式解碼後能還原像素值。回答格式差異時，要寫清楚是否保留原始資訊，以及適合的資料類型。"],
      [[96, 97], "Parity Bit 讓指定對象的個數符合奇數或偶數。先看題目指定數 1 還是數 0，以及是否要求偶同位；用相同規則檢查收到的字串。一般單一 Parity Bit 可發現奇數個位元翻轉，偶數個同時翻轉可能漏檢。"],
      [[98, 99], "Hamming Distance 是兩串相同長度位元中，不同的位置數。若最小碼距為 d，可保證偵測最多 d−1 個錯誤、修正最多 ⌊(d−1)/2⌋ 個錯誤。解碼時與各合法碼字比較，只有唯一最近且在可修正距離內才選它。"],
      [100, "RAID 0 用 Striping 分散資料，提高吞吐量，沒有冗餘。RAID 1 用 Mirroring 保留副本。RAID 5 把資料與 Parity 分散到各碟，可容忍一顆碟故障；同容量的 N 顆碟，常用可用容量為 (N−1) 倍單碟容量。"],
      [101, "RAID 5 以 XOR 形成分散式 Parity。同一 Stripe 若 P=A⊕B⊕C⊕D 且 B 遺失，B=P⊕A⊕C⊕D，因為 x⊕x=0。作答要逐位 XOR，最後可把重建區塊代回檢查整條 Stripe 的 XOR 為 0。"]
    ]),

    "lecture-03": byPage([
      [4, "CPU（Central Processing Unit）執行機器指令。Control Unit 協調取指、解碼與執行，ALU 做算術和邏輯運算，Registers 暫存操作數、結果或執行狀態。"],
      [[5, 6], "Bus 是傳送 Data、Address 和 Control Signals 的共用路徑，連接 CPU、Main Memory 和 I/O Controller。Motherboard 提供各元件的插槽、電源與互連線路。"],
      [[7, 8, 9], "傳統晶片組中，Northbridge 連 CPU、Main Memory 和高速顯示介面，Southbridge 負責較多周邊 I/O。新式設計可把記憶體控制器等功能整合到 CPU，控制周邊的功能仍由相應晶片負責。"],
      [10, "Stored-program Concept 把 Instructions 和 Data 一起存放在 Main Memory。CPU 依 PC 從記憶體 Fetch 指令並執行，因此載入新的指令即可更換程式。"],
      [11, "Machine Instruction 是 CPU 可辨認的一條指令，編碼為 Bit Pattern。Machine Language 是該機器能辨認的機器指令集合。"],
      [[12, 13], [
        "CISC 使用較複雜的 Instructions，一條指令可以完成多個低階 Operations，常見多種編碼長度與定址模式，例如 x86。",
        "RISC 傾向使用簡單、規則的 Instructions，典型採 Load/Store Design，便於解碼及 Pipelining，例如 ARM 或 RISC-V。兩者的實際速度需依處理器、程式與實作比較。"
      ]],
      [14, [
        "Data Transfer 在 Registers 和 Memory 等位置間搬移資料，例如 LOAD、STORE、MOVE。",
        "Arithmetic/Logic 做數學及 Boolean Operations，例如 ADD、SUB、AND、XOR。",
        "Control 改變 Program Execution Flow，例如 BRANCH 或 JUMP 可以修改 PC，決定下一條要執行的指令。"
      ]],
      [[15, 16], "讀 x86 的暫存器寬度時要分清名稱。例如 RAX 是 64 bits，EAX 是低 32 bits，AX 是低 16 bits，AL 是低 8 bits。這些名稱可指同一暫存器的不同寬度。"],
      [[17, 18], "若兩數原本在 Memory，先以 LOAD 分別載入暫存器，再對兩個暫存器做 ADD 或 Divide，把結果放到指定暫存器，最後 STORE 回 Memory。除法須先檢查除數是否為 0，必要時用 branch 避開除法。"],
      [[19, 20, 21], "Op-code 指定操作，Operand 指定暫存器、記憶體位址或立即值，意思由 Op-code 決定。附錄 C 教材機器一條指令 16 bits，第一個十六進位數字是 Op-code，後三個是 Operand。"],
      [22, "35A7 分成 3 | 5 | A7。Op-code 3 是 STORE，5 是來源 Register，A7 是目的 Memory Address。作答可寫 M[0xA7] ← R[0x5]。"],
      [23, "寫出每條指令對應的狀態：156C 將 M[6C] 載入 R5，166D 將 M[6D] 載入 R6，5056 將 R5、R6 依二補數相加後寫入 R0，306E 把 R0 存到 6E，C000 停止。"],
      [24, "PC（Program Counter）保存下一條指令的位址；IR（Instruction Register）保存目前要解碼或執行的指令。Machine Cycle 按 Fetch、Decode、Execute 進行。Fetch 後 PC 依指令長度前進，執行 Branch 時可能改寫 PC。"],
      [25, "B258 分成 B | 2 | 58。若 R2 = R0，將 0x58 寫入 PC；若不相等，繼續執行順序上的下一條指令。比較的是暫存器內容，0x58 是跳躍目的位址。"],
      [[26, 27, 28], "附錄 C 教材機器每條指令 2 bytes。若 PC=A0 且 M[A0]=15、M[A1]=6C，Fetch 後 IR=156C，PC=A2。接著 Decode 得到 LOAD，Execute 將地址 6C 的內容放入 R5。"],
      [[30, 31, 32, 33, 34], "依低位址到高位址讀得 C9、25、0B、E4。Big-endian 把低位址的 C9 當最高有效位元組，得到 0xC9250BE4。Little-endian 把 C9 當最低有效位元組，得到 0xE40B25C9。反向排列的是整個 Byte，Byte 內的 bit 順序不變。"],
      [35, "Bit Mask 可用 AND 保留指定的位元（遮罩 1 保留、0 清除），OR 把選定位置設為 1，XOR 翻轉選定位置。作答要保留固定寬度，並列出輸入、遮罩與輸出。"],
      [36, "Rotate 將移出的一位從另一端放回，Shift 則依規則補位。例：0x65 = 01100101₂，循環右移 1 位得到 10110010₂ = 0xB2。若題目是 Logical Right Shift，左端補 0，結果是 0x32。"],
      [37, "Controller 處理 Computer 與 Device 間的通訊，Port 是裝置接入的位置，Bus 把 CPU、Memory 與 Controller 連起來。整合顯示常共用系統記憶體，獨立顯示通常有獨立顯示晶片與 VRAM。"],
      [38, "圖中的 CPU、Main Memory 與各 Device Controller 共用 Bus。CPU 透過 Bus 和 Controller 交換命令、狀態與資料，由 Controller 負責跟後方裝置通訊。"],
      [[39, 40], "Memory-mapped I/O（MMIO）把 Device Registers 對應到 CPU 位址空間。CPU 用 LOAD／STORE 讀寫該位址即可與周邊裝置通訊，但讀寫裝置暫存器可能啟動硬體或清除狀態。"],
      [41, "Bank Switching 將同一段 CPU Address Window 切換到不同 Memory Bank。指令所用的位址範圍相同，選到的實體記憶體區塊可以不同。"],
      [42, [
        "DMA（Direct Memory Access）：CPU 先設定來源、目的、方向與長度；DMA Controller 經 Bus 在裝置和 Main Memory 間搬移區塊；完成時通知 CPU，CPU 不必逐筆複製。",
        "Von Neumann Bottleneck 指處理器和記憶體間通道頻寬不足而限制效能。Handshaking 則是通訊雙方透過就緒、確認等訊號協調資料何時可送或已收到。"
      ]],
      [[43, 46], "Parallel Communication 用多條資料線同時送多個 bit；Serial Communication 把 bit 依序送出。平行線路高速時容易遇到各線到達時間不同（Skew）與串擾（Crosstalk）。比較速度還要看 Lane 數、每條 Lane 速率與協定開銷。"],
      [[44, 45], "比較 USB、Thunderbolt 速率時，先把資料量與傳輸速率統一成 bits 和 bit/s。Type-C 是接頭外形；該連線能跑多快，要看主機、裝置與纜線共同支援的規格。"],
      [[47, 48, 49], "InfiniBand 是高輸送率、低延遲的互連標準，常用於高效能運算。SAS 是 Serial Attached SCSI，用來連接儲存設備。比較名目頻寬時要先對齊通道數與單位。"],
      [[52, 53], "Bandwidth 是可用的最大傳輸速率。理想時間 = 資料量（bits）÷ Transfer Rate（bit/s）。若採十進位，2 GB = 16 Gb，經 1 Gbps 理想需 16 s；實際傳輸還有標頭、裝置速度等影響。"],
      [55, "High-level Language 讓程式設計師用抽象來表示操作。編譯器或直譯環境會將語言敘述實作成機器指令。例如一次變數指派可能需要 LOAD、MOVE 或 STORE。"],
      [57, "Pipelining 讓不同指令的不同階段重疊執行，提高指令輸送率；第一條指令仍須走完所有階段。Superscalar 利用多組能同時工作的執行資源，每個時脈週期可處理多條指令。"],
      [58, "SISD：一條 Instruction Stream、一條 Data Stream。SIMD：同一指令同時作用在多筆資料。MIMD：多個處理器能以不同指令處理不同資料。"],
      [59, [
        "假設每階段 1 cycle、無相依或停頓，n 條指令、k 個階段：Sequential Time = nk cycles；理想 Pipeline Time = k+n−1 cycles。",
        "例如 10 條、4 階段，循序是 40 cycles，管線為 4+10−1=13 cycles；Speedup = 40/13 ≈ 3.08。公式要和題目給的階段時間、可啟動指令數對應。"
      ]],
      [[60, 61], "RAW Data Hazard：前一條指令產生 R1，下一條要讀 R1，但結果尚未就緒。Stall 讓下一條等；Forwarding 把剛算出的結果直接提供給下一條，省去等待寫回暫存器的時間。仍來不及送達時就要留 Stall。"],
      [62, "Branch Prediction 預測分支方向，讓 Pipeline 提早對預測路徑取指。若預測錯，清除錯誤路徑上尚未完成的指令，再從正確位址重新取指。"],
      [63, "Superscalar 每拍可以開始處理多條指令，但還要看資料相依與執行資源。若各組指令能每拍啟動、每條需 k 拍、每拍最多發出 w 條，理想時間為 k+⌈n/w⌉−1 cycles。"]
    ]),

    "lecture-04": byPage([
      [[6, 9], "Operating System（OS）管理電腦的硬體與軟體資源，並提供程式的執行環境。可列五個功能：Process Scheduling 分配 CPU，Memory Management 分配與保護記憶體，File Management 管理檔案，I/O Management 協調裝置，Security 控制存取權限。"],
      [10, "Memory Management 追蹤哪些記憶體區域已被使用及其擁有者，按需求分配與回收記憶體，並防止行程任意存取其他行程的區域。"],
      [11, "Processor Management 決定哪個 Ready Process 何時可以使用 CPU、可用多久，並在它完成、等待 I/O 或用完 Time Slice 時讓其他工作接手。"],
      [12, "Device Management 透過 Device Drivers 與硬體通訊，追蹤裝置狀態；當多個 Process 需要同一裝置，OS 決定分配給誰，並在使用完成後回收。"],
      [13, "File Management 以 Directory 組織檔案和子目錄，維護檔案位置、屬性和權限。開啟、儲存或刪除檔案時，由 File System 更新檔案及空間記錄。"],
      [14, "OS 的其他工作可舉例：Access Control 阻擋未授權的存取；Job Accounting 記錄各工作耗用的時間與資源；Error Detection 可用日誌或錯誤訊息協助找出原因。"],
      [[8, 15, 16, 17], "Batch Processing 先收集 Job，放入 Queue 後分批執行，使用者通常在完成後拿到結果。Interactive Processing 在執行過程中接收使用者輸入並回應，著重 Response Time。批次系統的典型限制是缺少即時互動、I/O 等待時 CPU 可能閒置。"],
      [18, [
        "Time-sharing 把 CPU 時間分成短 Time Slices，讓多位使用者或多個工作輪流使用 CPU，縮短等待回應的時間。",
        "若題目問 Load Balancing 與 Scaling，前者在現有處理器間分配工作，避免部分過載；後者是依可用運算資源調整容量或切分工作，依題意寫清楚採用哪個情境。"
      ]],
      [[19, 20], "Multiprogramming 在 Main Memory 保留多個 Job。某個 Process 等待 I/O 時，OS 可讓另一個 Ready Process 使用 CPU，提高 CPU Utilization。單一 CPU 核心同一瞬間仍只執行一條執行流。"],
      [21, "Multitasking 讓同一位使用者在同一段時間內進行多項任務，例如一邊瀏覽網頁、一邊播放音樂。單核心可透過 Scheduling、Time Slices 和 Context Switching 交錯執行。"],
      [22, "Preemptive Scheduling 允許 OS 在 Time Slice 結束或更高優先的工作就緒時中斷目前 Process，保存狀態後改派 CPU。Non-preemptive Scheduling 會等目前行程完成、阻塞或主動讓出 CPU 才換人。"],
      [[23, 38], [
        "Context Switching：中斷發生後，核心保存原 Process 的 PC、Registers 等狀態，選擇下一個 Ready Process，再恢復其狀態，由先前停下的位置繼續執行。Time Slice 較短通常回應較快，但切換較頻繁；較長則能降低切換開銷。",
        "若保存和恢復各 10 ms，切換需 20 ms。假設每段執行結束切換一次且 Time Slice 不含切換，浪費比例 = 20 ÷（Time Slice + 20）。500 ms 時是 20/520 ≈ 3.85%，100 ms 時是 20/120 ≈ 16.67%。"
      ]],
      [24, "OpenMP 的 parallel for 可把迴圈反覆執行的工作分給多個 Thread。若多個 Thread 都做 accumulator++，用 atomic 保護這次更新，避免讀取同一舊值再各自寫回而少算。"],
      [[25, 26], "Application Software 為使用者執行特定工作，例如瀏覽器或文書軟體。System Software 提供讓應用程式運作的環境，例如 Operating System 和系統公用程式。"],
      [[27, 28, 75, 76], "User Interface 是使用者輸入命令或操作 GUI 的介面。Kernel 是 OS 的核心，在特權模式管理 Process、Memory、I/O 等資源。應用程式透過 System Call 向 Kernel 請求服務。"],
      [29, "Directory 組織檔案與子目錄。Absolute Path 從根目錄開始，例如 /home/user/a.txt；Relative Path 從目前工作目錄解讀，例如資料夾 /home/user 中的 a.txt。"],
      [[30, 31], "Virtual Memory 讓 Process 使用自己的虛擬位址空間。CPU 以虛擬頁號查 Page Table 取得實體 Frame，Page Offset 不變。若所需頁尚未載入實體記憶體，產生 Page Fault，由 OS 載入、更新映射後再重試存取。"],
      [[32, 33], "不同 Process 可將各自的虛擬頁映射到同一實體 Frame，共用函式庫或其他唯讀資料。Copy-on-Write 先共用一頁，某行程要修改時才給它獨立副本。"],
      [34, "Boot Loader 在 Firmware 完成初始啟動後執行。它從儲存裝置找到作業系統，把 Kernel 等啟動所需內容載入 Main Memory，再把控制權交給 Kernel。"],
      [[35, 36], "Program 是儲存的程式指令；Process 是程式執行中的實例。Process State 包括 PC、Registers、執行狀態和相關記憶體資訊。OS 保存必要狀態，使 Process 暫停後可以接續執行。"],
      [37, "Scheduler 決定下一個取得 CPU 的 Ready Process；Dispatcher 實際保存舊狀態、恢復新狀態並移交 CPU 控制權。依老師投影片的用語，Scheduler 也負責將新 Process 加入 Process Table，移除完成的 Process。"],
      [39, "Critical Region 是操作 Shared Resource、需互斥保護的程式區段。以初值 1 的 Binary Semaphore 為例，Process 先 wait() 取得使用權，進入後其他 Process 須等候；離開時 signal() 釋放使用權，讓等待者有機會進入。這樣可達到 Mutual Exclusion。"],
      [[40, 41], [
        "Concurrency 指多個工作在同一段時間內都有進展。單核心可以透過 Scheduling、Time-sharing 和 Context Switching 交錯執行。",
        "Parallelism 指多個工作在同一瞬間實際執行。現代 OS 可把不同 Thread 或 Process 排到不同 CPU Cores，並以 Load Balancing 分攤工作。"
      ]],
      [[42, 43, 44], "Deadlock 是一組 Process 互相等對方持有的資源，沒有一方能繼續。例如 A 拿著印表機等掃描器，B 拿著掃描器等印表機。Starvation 是某個 Process 長期分不到資源，其他 Process 仍可能完成，例如低優先工作持續被新來的高優先工作插隊。"],
      [45, "講義的死結案例是檔案請求、資料庫、專用裝置、多裝置分配、Spooling、網路和磁碟共用。舉例時應寫出誰持有什麼、還在等什麼，以及等候如何成環。"],
      [[46, 47], "檔案請求（File Request）死結：P1 持有 F1、請求 F2；P2 持有 F2、請求 F1。寫出 P1 → P2 → P1 的 Wait-for Cycle 並指出兩個行程都無法繼續。若題目用圖中的標籤，先確認實線表示已有的資源，虛線表示請求。"],
      [[48, 49], "Database Locking 控制 Transaction 對共享資料的存取。若 T1 鎖 R1 等 R2，T2 鎖 R2 等 R1，就形成 Circular Wait。Lock 可保障互斥，但取得多把 Lock 時可用共同順序減少這類死結。"],
      [50, "Lost Update：兩個 Transactions 先讀到同一舊記錄。T1 修改成績並先寫回，T2 用舊副本修改地址並覆寫整筆資料，因此 T1 的新成績遺失。可用 Locking 或合適的 Concurrency Control 避免。"],
      [[51, 52, 53], "在裝置分配圖上先寫每個 Process 已持有和正在等的裝置。例如 P1 持有磁帶機等印表機，P2 持有印表機等繪圖機，P3 持有繪圖機等磁帶機，構成 P1 → P2 → P3 → P1 的 Circular Wait。"],
      [[54, 55], "Spooling 用 Disk 當暫存空間，先保存各 Job 的 I/O 輸出，再依序交給較慢的裝置，例如印表機。若 Spool Area 被多個不完整的 Job 塞滿，且印表機必須收到完整 Job 才能開始，Job 無法寫完、裝置也無法清空緩衝，就可能形成死結。"],
      [[56, 57], "Network Deadlock 的例子：各 Node 的 Buffer 都滿了，每個 Node 必須等下一個 Node 騰出空間才能送出自己的資料。等候方向形成 Circular Wait 時，相關傳輸都無法推進。"],
      [[58, 59], "Livelock：工作仍反覆執行或改變狀態，但始終沒有進展，例如磁碟一直接到另一個請求，兩項 I/O 都沒有完成。Deadlock 則是行程停在互相等候的狀態。"],
      [[60, 61], "Deadlock 的四個必要條件：Mutual Exclusion（資源只能獨占）、Hold and Wait（持有部分資源時又等待其他資源）、No Preemption（已分配資源不能強制收回）、Circular Wait（等候關係成環）。預防可從破壞其中至少一項做起。"],
      [62, "Deadlock Prevention 可規定所有 Process 依固定資源順序取得 Lock，破壞 Circular Wait。Deadlock Avoidance 則在分配每次資源前檢查是否仍在 Safe State，有危險就暫緩。"],
      [63, "Deadlock Recovery 在偵測到死結之後，依資源性質選擇終止行程、Rollback 到檢查點，或強制回收可安全回收的資源。作答要補上代價，例如已完成的工作可能要重做。"],
      [64, "Starvation 是某個 Process 長期得不到 CPU 或其他資源，但系統仍有其他工作在執行。Aging 會隨等待時間逐步提高該 Process 的優先權，減少它反覆被排在後面的機會。"],
      [65, "OS 防護可分為外部進入和內部權限。Authentication 驗證使用者，Auditing 記錄可疑行為；User Mode／Kernel Mode 與 Privileged Instructions 則限制一般程式直接操作關鍵硬體或他人的記憶體。"],
      [74, "Linux Distribution 將 Linux Kernel 與系統工具、函式庫、套件管理和可選的桌面環境包在一起。例如 Ubuntu 與 Fedora 可使用同一家族的核心，但預設套件及管理方式不同。"],
      [78, "自由軟體強調使用者可按授權條件執行、研究、修改與重新散布程式。Free Software 的 free 指自由，免費取得只是可能的情況。"],
      [83, "Shell 接收並解讀命令，例如 ls、pwd，執行內建指令或啟動程式。Kernel 則透過 System Call 提供實際的檔案、行程和裝置服務。"],
      [[84, 85], "Linux 的根目錄是 /。從 / 開始的 Absolute Path 不依賴目前目錄；Relative Path 以 Working Directory 為基準。Home Directory 是個人檔案預設的位置，和目前工作目錄可以不同。"],
      [[86, 87], "/etc 常放系統設定，/home 放一般使用者的家目錄，/dev 提供裝置節點，/var 常放日誌等會變動的資料。Mounting 是把其他檔案系統接到既有目錄樹的某一點。"]
    ]),

    "lecture-05": byPage([
      [4, "以涵蓋範圍分類：PAN 是個人周邊設備，LAN 是房間或建物內網，CAN 串接校園多棟建築，MAN 涵蓋都會區，WAN 跨越大型地理範圍。SAN 依儲存用途分類，VPN 則描述在既有網路上建立的私有連線。"],
      [5, "PAN（Personal Area Network）讓一個人周邊的設備互相通訊，例如手機與藍牙耳機。HAN（Home Area Network）以家庭為主要使用範圍，可涵蓋同住者的多台裝置。"],
      [6, "LAN（Local Area Network）連接有限區域內的裝置，例如同一棟大樓。Ethernet 是常見的有線 LAN 技術，Wi-Fi 是常見的無線 LAN 技術。"],
      [7, "CAN（Campus Area Network）把同一校園或園區內多棟建物的 LAN 連起來，讓使用者可以共用網路及資源。典型圖中，核心交換器連接各棟樓的網路和外部 Internet。"],
      [8, "MAN（Metropolitan Area Network）連接同一都會區內的多個網路，範圍一般大於 LAN。可舉例電信業者在一座城市內提供企業據點之間的連線。"],
      [9, "WAN（Wide Area Network）用長距離連線串接不同地區的 LAN 或其他網路。例如公司利用電信線路連接位於不同城市的兩處辦公室。"],
      [10, "SAN（Storage Area Network）是用來連接伺服器與磁碟陣列等儲存設備的專用網路。伺服器可透過 SAN 存取區塊儲存，使用方式可類似本機磁碟。"],
      [11, "VPN（Virtual Private Network）在既有網路上建立虛擬私有連線。例如遠距使用者透過公共 Internet 連到公司。Authentication 驗證端點，Encryption 保護機密性，Integrity 檢查資料是否被竄改。"],
      [[12, 13, 50, 51], [
        "Client/Server：Client 主動發出 Request，專責 Server 提供檔案、網頁等服務並回應。例：瀏覽器向網站伺服器取得網頁。",
        "Peer-to-Peer（P2P）：各 Peer 可同時請求及提供資源，不必依賴單一專責資料提供者。例：下載檔案的節點也可上傳已取得的部分給其他 Peer。"
      ]],
      [14, "Physical Topology 描述設備和線路實際怎麼接；Logical Topology 描述資料怎麼傳及裝置怎麼取得媒介使用權。即使接線同為星狀，中央設備用 Hub 或 Switch，訊號與訊框的轉送方式仍不同。"],
      [[15, 16, 17], "Bus Topology 讓各節點共享一條 Backbone。纜線兩端的 Terminator 吸收訊號，減少反射。好處是線材少；缺點是多站共用媒介可能 Collision，而且主幹損壞可影響整段。"],
      [18, "Ring Topology 把裝置連成封閉環，每個節點有兩個相鄰節點。資料沿環逐站轉送，常見的媒介存取例是 Token Passing。若未額外提供備援，一處斷線可能讓單環中斷。"],
      [[19, 20], "Star Topology 讓每個終端用獨立線路連到中央 Hub 或 Switch。單一支線壞掉通常只影響該終端；中央設備故障會影響整個星狀網路。"],
      [21, "Tree Topology 把設備依階層串接，常由核心設備往下接各支線的交換器。它便於擴充並隔離分支；上層連線故障會影響其下多個節點。"],
      [22, "Repeater 重新產生訊號、延伸傳輸距離。Bridge 可分開兩個 LAN 網段，依 MAC 決定是否跨段轉送。Switch 可看成多埠 Bridge，連接並分隔多個區段。"],
      [[23, 24], "Full Mesh 的每對節點都有直接連線，N 個節點需 N(N−1)/2 條連線。某條線路故障時可利用替代路徑；代價是需要更多線材與連接埠，架設成本較高。"],
      [[25, 26, 27], "Bluetooth 適合短距離個人設備通訊，例如耳機；Wi-Fi 是以 IEEE 802.11 為基礎的 WLAN。Access Point（AP）讓無線裝置接入區域網路，該網路若有上游連線，也可通往 Internet。"],
      [28, "Protocol 是讓網路設備採用同一套方式通訊的規則，包括訊息格式、先後順序及收到訊息後的動作。有相同規則，不同廠商的設備才可互通。"],
      [29, [
        "CSMA/CD 用於共享媒介的傳統半雙工 Ethernet。先聽媒介是否空閒再送，偵測到 Collision 時停止，等待隨機 Backoff 後重試。",
        "CSMA/CA 用於 Wi-Fi。先聽媒介，在規定的空閒時間與隨機退避後傳送，可利用 ACK 判斷是否成功，也可用 RTS/CTS 降低部分隱藏終端造成的碰撞。"
      ]],
      [30, "Hidden Terminal：A、C 都聽得到 AP，但彼此訊號收不到。兩端可能都判斷媒介空閒並同時送出，訊號便在 AP 發生 Collision。RTS/CTS 可讓聽得到 AP 的站台知道接下來應暫緩傳送。"],
      [31, "Repeater 和 Hub 主要處理 Physical Layer 的訊號；Bridge 和 Switch 依 Data Link Layer 的 MAC 位址轉送 Frame；Router 依 Network Layer 的 Destination IP 和路由表，決定 Packet 的下一跳。"],
      [32, "NIC（Network Interface Card）是讓主機連到網路媒介的介面。MAC Address 是資料鏈結層用來辨識介面的位址，Ethernet Switch 會依 MAC 轉送 Frame。IP Address 則用於網路層定址與跨網路傳送。"],
      [[33, 34], "Repeater 是 Physical Layer 裝置。它從收到的訊號重新產生可辨識的訊號並向外送出，藉此延長距離，不讀取 Frame 的 MAC 位址或選擇路徑。"],
      [35, "Hub 是多埠 Repeater。一埠收到的訊號會重送到其他埠；Hub 不建立 MAC Table，也不依目的位址篩選。各埠共用媒介，形成同一個 Collision Domain。"],
      [[36, 37], "Bridge 連接兩個相容 LAN 區段，依 Frame 的 Destination MAC 判斷是否跨段轉送。目的在原網段時可篩掉。例如 A 和 B 同段、E 在另一段，A→B 不必經 Bridge，A→E 需要轉送。"],
      [38, [
        "Switch 收到 Frame 後，把 Source MAC 與進入的 Port 記入 MAC Table，再查 Destination MAC 決定送出哪一埠。若已知目的就在同一輸入埠，可篩除。",
        "未知單播或 Broadcast 則在同一 VLAN 向其他埠 Flood。作答要寫出：用來源學習，用目的轉送。"
      ]],
      [[39, 40, 41], "Router 讀 Packet 的 Destination IP，查 Routing Table 選出口及下一跳。它移除進入鏈路的 Frame Header／Trailer，再依下一段鏈路重新封裝。跨網段時，送出 Frame 的 MAC 位址會隨所在鏈路更新。"],
      [42, "Gateway 是讓資料進出另一網路的節點。Default Gateway 通常是本地網段的 Router，負責把非本地目的地的封包送出去；也有 Gateway 專門轉換兩端不同的協定。"],
      [43, "Firewall 依安全規則允許或阻擋網路流量，例如允許外部連到網站的 HTTPS 服務，但封鎖不必要的對外連入。常依來源、目的、協定、Port 和連線狀態判斷。"],
      [44, "Wired Media 用銅線、同軸線或光纖傳輸，Wireless Media 讓電磁波通過空間。若要算時間，先統一 bit 與 byte：2 GB = 16 Gb，以 1 Gbps 傳送的理想時間為 16 秒。"],
      [45, "銅線以電訊號送資料，距離增加時訊號會 Attenuate（衰減）。題目問最遠距離或速率時，應以指定 Ethernet 規格與纜線條件作答。"],
      [[46, 47, 48, 49], "Coaxial Cable 以中心導體和外層屏蔽傳訊，STP 是有屏蔽雙絞線，UTP 是沒有額外屏蔽的雙絞線。雙絞可降低干擾，屏蔽能增加抗干擾能力；實際距離與速度依線材和協定規格。"],
      [52, "Cluster 多是同一區域內緊密協作的機器；Grid 把不同位置和管理者的運算資源合在一起；Cloud 把運算、儲存等資源以服務方式按需求提供。作答可用耦合程度、地理範圍與使用者取得資源的方式比較。"],
      [[53, 54], "Cloud Computing 透過網路提供按需求使用的共享運算資源。Scalability 是能承受更大的工作量，Elasticity 是資源可隨需求增減，Multi-tenancy 是多個使用者共享服務平台但應維持資料隔離。"],
      [[55, 56, 57], [
        "IaaS 提供運算、儲存、網路等基礎資源，使用者仍管理 OS 和應用程式，例如租 VM。",
        "PaaS 由供應商管理平台與執行環境，使用者負責部署和管理自己開發的應用程式。",
        "SaaS 直接使用供應商的應用程式，例：Gmail。比較三者時，要寫出使用者能控制哪些層。"
      ]],
      [58, "Internet 是全球多個獨立網路互連形成的 Network of Networks。各網路可用不同媒介，透過 IP 和路由器交換封包，因此 Internet 包含許多 LAN、WAN 以及不同管理單位的網路。"],
      [59, "Circuit Switching 在傳送前建立通道並保留資源，傳完才釋放。Packet Switching 把資料切成 Packet，共用鏈路及交換設備，可能排隊，不同 Packet 也可能走不同路徑。Internet 主要用 Packet Switching。"],
      [61, "使用者先連 Access ISP。不同 ISP 可透過 Peering 交換彼此網路及客戶的流量，也可購買 Transit，讓上游代為連到更多目的地。回答 Tier 1、Tier 2、Access ISP 的差別時，寫出是否需要購買 Transit。"],
      [[62, 64], "IPv4 Address 是 32 bits，常以點分十進位表示；IPv6 Address 是 128 bits，常用冒號分隔十六進位群組。IP 位址配置給網路介面，一台 Router 可有多個介面與位址。"],
      [63, "ICANN 協調網際網路的唯一識別資訊，包括網域名稱與 IP 位址資源。實際 IP 位址分配會經 IANA 協調、區域註冊機構及 ISP 等層級，DNS 則處理名稱與記錄的查詢。"],
      [[65, 66, 67], "判斷 Subnet 先標出路由器的每個介面，沿鏈路找出彼此不經路由器便能通訊的區域。IP 的前綴部分由 Subnet Mask 指定，主機部分用來區分同一子網內的介面。不要漏算路由器間獨立的連線。"],
      [68, "CIDR 的 /n 表示前 n bits 屬於 Prefix。例：200.23.16.0/23 的遮罩是 255.255.254.0，包含 200.23.16.0～200.23.17.255，共 2⁹ = 512 個位址；若按一般 IPv4 子網扣除 Network 與 Broadcast Address，可配 510 個。"],
      [[69, 70], "DHCP 讓主機自動取得網路設定。Discover：主機廣播尋找伺服器；Offer：伺服器提供可分配的 IP；Request：主機請求選定的位址；ACK：伺服器確認租用。可用 DORA 記四步。"],
      [[71, 72], "追 DHCP 圖時，從 Discover 看起：還沒配置 IP 的 Client 可由 0.0.0.0:68 廣播到 255.255.255.255:67。再照 Offer、Request、ACK 追蹤建議位址、Transaction ID 與 Lease Time。題目若給了封包欄位，就按圖中的值作答。"],
      [73, "DHCP 除了分配 IP 位址和 Lease Time，也可提供 Subnet Mask、Default Gateway 與 DNS Server。Mask 用於判定本地網段，Gateway 是往外送封包的下一跳，DNS Server 用來查名稱。"],
      [[74, 75], "DNS（Domain Name System）是階層式、分散式的名稱查詢系統。網域名稱可查 A／AAAA 記錄得到 IPv4／IPv6 位址；反向查詢則用 PTR 由位址找名稱。常用 Port 53，UDP 與 TCP 都可使用。"],
      [[76, 77, 78, 79, 80], "查 www.example.com 時，Root Server 可指向 .com 的 TLD Server，TLD Server 再指向 example.com 的 Authoritative Name Server，由它提供該網域負責的記錄。Root、TLD、Authoritative 分別負責不同層級。"],
      [[81, 82], "Iterative Query 由同一查詢端逐站詢問，收到 Referral 就找下一站。Recursive Query 則要求被問的伺服器回傳最終答案或錯誤。平常用戶端可把遞迴查詢交給 Resolver，Resolver 再對上游名稱伺服器逐站查。"],
      [84, "SMTP 用來傳送郵件。基本對話依序有 HELO／EHLO、MAIL FROM 指定寄件者、RCPT TO 指定收件者、DATA 送出內文、QUIT 結束。收信者可用 IMAP 或 POP3 讀取伺服器收下的郵件。"],
      [85, "VoIP 以 IP 傳送語音。Streaming 讓音訊或影片可邊接收邊播放。CDN 把內容放到分散節點，讓使用者可由靠近自己的節點取得內容，以降低延遲並分攤原始伺服器負載。"],
      [86, "World Wide Web 使用超連結把文件連起來，瀏覽器透過 URL 找到資源，並以 HTTP 或 HTTPS 與 Web Server 交換資料。Internet 則是承載 Web、郵件等多種服務的互連網路。"],
      [[88, 89, 90], 'HTML（HyperText Markup Language）以 Tag 描述網頁結構，例如 <h1> 是主要標題、<p> 是段落、<a href="…"> 是超連結。它讓瀏覽器辨認內容的結構及語意，樣式與互動可另外交由 CSS 和 JavaScript。'],
      [[91, 92], 'HTML 以 <a href="目標網址">連結文字</a> 建立超連結。href 是要前往的位置，兩個標籤之間的文字才是可點擊的內容。'],
      [93, "XML（Extensible Markup Language）允許定義自己的標籤來描述或交換結構化資料，元素須正確巢狀並關閉。JSON 也能以物件、陣列表示許多相同資料結構。XML 可用於需要命名空間、Schema 驗證或混合文字標記的情境。"],
      [[94, 95], "用 XML 表示樂譜可將 staff、measure、notes 以階層結構表示，並記錄譜號、拍號及各小節的音符。XML 保存的是可供程式解讀的結構，排版程式再把它轉成五線譜。"],
      [96, "MathML 是表示數學公式的標記語言。例如 mfrac 內依序放分子與分母，msqrt 表示平方根，msup 表示上標。相較於單純的圖片，數學標記會保留這些結構，供瀏覽器或輔助工具解讀。"],
      [97, "Client-side 程式在使用者的瀏覽器執行，例如以 JavaScript 更新畫面。Server-side 程式在伺服器執行，例如驗證請求、查詢資料庫後回傳內容。需保護的金鑰與權限檢查應留在伺服器端。"],
      [[98, 99, 100, 106], "封裝（Encapsulation）由應用資料往下形成 Transport Segment、IP Packet、Link Frame，最後以位元傳送。接收端反向解封裝。中途 Router 查 IP 決定下一跳，對新鏈路換上相應的 Frame 封裝。"],
      [[101, 107, 108, 109, 110], [
        "TCP/IP 四層由上而下：Application 提供 HTTP、DNS 等應用服務；Transport 以 TCP 或 UDP 讓程式間端到端通訊；Internet 以 IP 定址並跨網路路由；Link 在單一鏈路傳送 Frame，例如 Ethernet。",
        "若題目要求資料單位，可依序寫應用資料、傳輸層 Segment／Datagram、IP Packet、Link Frame。"
      ]],
      [102, "IPv4 Header 的 Source／Destination Address 分別是來源、目的 IP。TTL 每經一個 Router 通常減 1；Protocol 指出上層協定；Total Length 含 Header 與資料。分片以 Identification、MF 和 Fragment Offset 協助目的端重組。"],
      [[103, 104], "以 4000-byte IPv4 Datagram、20-byte Header、MTU 1500 為例：原始資料是 3980 bytes。前兩片各放 1480 bytes，第三片放 1020。各片含 Header 的長度是 1500、1500、1040；Offset 以 8 bytes 為單位，為 0、185、370，MF 依序是 1、1、0。"],
      [[105, 111], "TCP 需要建立連線，用序號、ACK 和重送提供可靠且有序的 Byte Stream。UDP 以 Datagram 傳輸，不保證送達或順序，標頭較小，適合可接受遺失或會自行處理重送的情境。例：HTTP/1.1 通常用 TCP，許多即時語音應用用 UDP。"],
      [112, "Multiplexing 讓多個應用共用 IP 的傳送能力，各自附上 Transport Port。Demultiplexing 在接收端依傳輸協定與 Port 等欄位，分送到對應的 Socket，例如 DNS 常用 UDP 53。"],
      [114, "RJ-45 配線題先認清 Pin 1 的位置和端接標準。直通線兩端同為 T568A 或同為 T568B；傳統交叉線一端 T568A、一端 T568B，交換 1↔3、2↔6 線對位置。"],
      [115, "Malware 是破壞、竊取或未授權操作系統的軟體；DoS 使合法使用者無法取得服務。作答可各配一項防護，例如更新與防毒降低 Malware 風險，流量監控與限制請求可協助減輕 DoS 影響。"],
      [[116, 117], "Bob 的 Public Key 可交給他人加密訊息，對應的 Private Key 由 Bob 保存以解密。Digital Signature 則用簽署者的私密金鑰簽署，以公開金鑰驗證；Certificate 讓驗證者確認公開金鑰對應的身分。"],
      [119, "Security 著重未授權者不能讀、改或阻斷資料與系統；Privacy 著重個人資料由誰收集、如何使用以及能否控制揭露。例如加密能防未授權讀取，但對已獲合法權限的資料收集仍需設定隱私界線。"]
    ]),

    "lecture-06": byPage([
      [[4, 5], "Algorithm 是一組有順序、明確、可執行的步驟。對題目允許的輸入，應在有限步內完成並產生符合規格的結果。寫定義時可列出 Input、Output、Definiteness、Effectiveness 和 Termination。"],
      [[6, 7, 9], "Algorithm 是解題步驟本身；Program 是用程式語言寫出的表示；Process 是它執行中的實例。相同 Algorithm 可以用中文描述、Pseudocode 或不同程式語言表達。"],
      [[10, 11], "Abstract Data Type（ADT）規定資料與可用操作的行為。以 Stack 為例，push、pop、top 及後進先出是對外規格；內部可用陣列或鏈結串列實作。"],
      [[12, 13, 14, 15, 16, 17], "虛擬碼要能逐步執行。寫清楚 Input 和 Output；指派先算右側；用縮排區分 if 的各分支及 while 的本體。函式用參數取得本次輸入，並標明何時 Return。"],
      [[19, 20, 21], "Pólya 的四步是理解問題、擬定計畫、執行計畫、回顧及檢查解答。套在程式上，可先寫輸入、輸出與限制，再決定 Algorithm、實作程式，最後驗證正確性並評估能否推廣。"],
      [[22, 23], "先依乘積 36 列三個正整數組合，再把它們依和分組。只有 1、6、6 和 2、2、9 的總和同為 13，所以已知總和仍不能判斷。題目說有唯一最年長的小孩，排除 1、6、6，得到 2、2、9 歲。"],
      [[24, 26], "Sequential Search 由第一項往後比較。成功時回報相符的位置或項目；掃完回報找不到。若 List 由小排到大，且目前值已大於 Target，也可提早停止。最壞仍需比較 n 項，為 Θ(n)。"],
      [25, "評估 Algorithm 可問三個問題：結果是否符合規格、程式是否容易閱讀，以及消耗多少時間或空間。Performance Analysis 可依操作次數估算；Performance Measurement 則在指定機器執行並量測。"],
      [27, "迴圈控制要有 Initialization（設定起始狀態）、Test（判斷是否繼續）與 Modification（更新變數讓流程朝終止前進）。例如 i=0；只要 i<n 就處理 A[i] 並令 i=i+1，最後在 i=n 停止。"],
      [[28, 29, 30], "Pretest Loop（while）先判斷條件，可能執行 0 次；Posttest Loop（repeat–until）先執行本體，至少做 1 次，直到終止條件為真。若一開始就符合終止條件，兩者分別做 0 次與 1 次。"],
      [[31, 32], "Insertion Sort 把第一項視為已排序。每輪取下個元素為 Pivot，將前面比它大的元素向右移，再將 Pivot 放進空位。每輪後，已處理的前綴都已排序；反向排列時最壞為 Θ(n²)。"],
      [[33, 40], "Recursion 由函式呼叫自己解較小的子問題。Base Case 能直接回傳；Recursive Case 縮小問題並使用子問題的結果。要證明會停止，需指出哪個量每次變小，以及何時抵達 Base Case。"],
      [[34, 35, 36, 37, 38, 39], [
        "Binary Search 的資料必須先排序。以閉區間 [l,r] 為例，令 mid=l+⌊(r−l)/2⌋。若 A[mid]=target 就停止；若 target<A[mid]，令 r=mid−1；若 target>A[mid]，令 l=mid+1；l>r 時找不到。",
        "追蹤題每輪要寫剩下的區間、mid 對應值和下一步。每次捨棄約一半，最壞需 Θ(log n) 次比較；遞迴版每次要帶入縮小後的範圍。"
      ]],
      [41, "Spanning Tree 是包含原圖所有 V 個頂點、連通、無環的子圖，因此有 V−1 條邊。只取其中幾個頂點即使連通無環，也只是一棵一般的子樹。"],
      [42, [
        "從起點做 BFS 或 DFS，每次首次發現一個新節點，就保留走到它的那條邊。連通無向圖走完會保留 V−1 條邊，形成 Spanning Tree。",
        "BFS 用 Queue（FIFO）逐層走訪；DFS 用 Stack（LIFO）或遞迴先沿一支走到底。若題目規定鄰點順序，須照順序記錄每次發現及保留的邊。"
      ]],
      [[43, 44], "Minimum Spanning Tree（MST）在連通加權無向圖中，連通所有頂點、沒有環、總權重最小。算成本要把實際選到的 V−1 條邊相加。p.44 右圖選 AB、BC、BD、BF、DE，總成本 16+6+5+11+18 = 56。"],
      [45, [
        "Kruskal 先把全圖的邊依權重遞增排序，逐條選取不形成環的邊。Prim 從某個頂點開始，每次選連接目前樹與樹外頂點的最小權重邊。",
        "兩者都屬於 Greedy Algorithm。作答寫清楚每輪選的邊、總權重，以及完成時有 V−1 條邊。遇到等權重的邊可有不只一棵 MST。"
      ]],
      [46, "Kruskal 將邊依權重由小到大檢查。對邊 (u,v)，若 find(u)=find(v) 就跳過，因為已有路徑會成環；否則選邊、merge 兩個成分。選滿 V−1 條邊後，把權重加總。"],
      [47, "Prim 先選起點，再挑一條權重最小且由樹內接到樹外的邊，加入新頂點及該邊。用 Priority Queue 保存候選邊時，取出後若終點已在樹中就跳過。選邊不能只看全圖最小，還要確認跨越目前邊界。"],
      [[48, 49, 50, 51], "完美迷宮可把格子當 Vertex、打開的門當 Edge。每次從 FRONTIER 取一格，只打通它和 IN 中一格的牆，再把新格加入 IN。每輪加一個頂點與一條邊，最後連通且無環，任兩格間有唯一的簡單路徑。"],
      [[52, 82], "證明 Correctness 須說明對所有合法輸入都符合規格。可用迴圈不變量證明初始化、維持、終止後得出結果。測試可以發現錯誤或確認部分案例，無法單靠有限案例證明所有輸入正確。"],
      [[53, 79, 80], "反向排序是 Insertion Sort 的最壞情況。第 2 項最多比較 1 次，第 3 項最多 2 次，依此到第 n 項最多 n−1 次，合計 n(n−1)/2 = Θ(n²)。若已排序，每輪只檢查前一項，最佳是 Θ(n)。"],
      [[54, 55, 56, 57], "Time Complexity 隨輸入規模 n 衡量操作次數；Space Complexity 隨 n 衡量記憶體使用。若只算 Auxiliary Space，要排除輸入本身。例：以參考傳入陣列並只用索引和累計值求和，時間 Θ(n)，額外空間 Θ(1)。"],
      [[59, 60], "先固定輸入大小 n。Best Case 取同一大小下最少的操作數，Worst Case 取最多，Average Case 需要指定輸入的分布。三者都應寫清楚 n 代表什麼。"],
      [61, "Prefix Average 定義 A[i]=(X[0]+⋯+X[i])/(i+1)。每次從頭加總要做 1+2+⋯+n 次處理，時間 Θ(n²)；維持 running sum，每輪只加 X[i] 並除以 i+1，時間 Θ(n)。"],
      [[62, 63, 64], "實驗分析先實作，使用不同規模與組成的輸入量測時間，比較時用相同硬體與軟體條件。理論分析從 Pseudocode 選定基本操作，用 n 表示次數，可比較成長率且較少依賴機器。"],
      [[65, 66, 67, 68, 69], [
        "求 n 個數的最大值：把 currentMax 設為 A[0]，從 A[1] 掃到 A[n−1]，遇到較大值才更新。共比較 n−1 次；例如一百萬個數只需 999,999 次比較，時間 Θ(n)，輔助空間 Θ(1)。",
        "若題目要求基本操作總數，要按指定計數方式另外計入索引、指派、條件和回傳。例如講義在所有更新都發生的計數表中，總數為 7n−1，並可乘最快／最慢基本操作的時間來界定 T(n)。"
      ]],
      [[70, 71, 72, 73, 74], "漸近分析看 n 很大時主導時間的項。例：3n²+10n+5 為 Θ(n²)。常數不改變成長階，但會改變小輸入時誰先跑完。若問交會點，列兩式求相等位置，再代入前後的 n 驗證不等號方向。"],
      [75, "Fibonacci 的 Base Cases 是 F(0)=0、F(1)=1，n≥2 時 F(n)=F(n−1)+F(n−2)。直接遞迴會重算相同子問題；迭代只保留前兩項即可算 F(n)，時間 Θ(n)，額外空間 Θ(1)。"],
      [76, "依投影片的計數規則，初始設定佔 1 次；每輪計 1 次迴圈操作及 1 次更新，因此 n 輪是 2n 次。最後的迴圈檢查與回傳各 1 次，總數為 2n+3，成長階 Θ(n)。真正的程式不能把計數敘述放在 return 後面。"],
      [77, "要證明 f(n)=O(g(n))，找出常數 c>0 和 n₀，使所有 n≥n₀ 都有 f(n)≤c·g(n)。例：3n+2≤4n 在 n≥2 成立，所以可取 c=4、n₀=2，證得 3n+2=O(n)。"],
      [78, "常見成長階由慢到快為 1、log n、n、n log n、n²、n³、2ⁿ、nⁿ。用最高階項判斷多項式；每次把剩餘範圍減半常為對數，兩層各走 n 次的迴圈常為平方。"],
      [81, "Binary Search 每輪把範圍縮到約一半，最壞經約 log₂n 輪就剩一項，所以為 Θ(log n)。在相同增加量的 n 下，新增的比較次數逐漸變少；Insertion Sort 最壞則以平方成長。"],
      [[83, 84, 85], "從一端數切開第 3 節，得到長度 1、2、4 的三段。每天結束時讓旅館可用這三段組出累計應付的 1 到 7 節；第 2 天付 2 拿回 1，第 4 天付 4 拿回 1 和 2。若完全不切，只能整條交付，無法在第一天付一節，所以最少切一次。"],
      [86, "狼、羊、菜過河：先帶羊過河，空手回去；帶狼過去，帶羊回來；帶菜過去，空手回來；最後再帶羊過去。每一步都檢查人不在的一岸沒有狼和羊或羊和菜同時留下。"],
      [88, "分成 3、3、2。第一次秤兩組 3。若平衡，輕幣在剩餘兩枚，第二次一枚對一枚。若不平衡，從較輕的一組 3 取兩枚互秤，較輕的就是假幣；若平衡則是未上秤的一枚。"],
      [89, "Loop Invariant 的證明分三步。Initialization：第一次檢查前成立。Maintenance：若本輪開始時成立，執行本體及更新後仍成立。Termination：離開時用 Invariant 加上停止條件推出答案。"],
      [90, "在每輪執行本體前，i+j=9。第一次 i=0、j=9 成立。一輪中 j 減 1，迴圈更新使 i 加 1，因此兩者總和不變。離開時依最後一次更新得 i=10、j=−1。"],
      [91, "當迴圈準備處理 A[i] 時，Invariant 是 m 等於 A[0..i−1] 的最大值。初始 i=1、m=A[0]，所以成立。比較 A[i] 並按需要更新 m，再增加 i，可保持 Invariant。離開時 i=n，因此 m 是全陣列最大值。"]
    ]),
  };
})();

const examAnswerNotesByCourse = {
  "lecture-02": {
    67: ["先交代回存條件", "這兩道原題採超出範圍時保留低 16 位的做法。以常見的 32 位元 int 為例，加法先用 int 算，超出範圍發生在指定回 signed short 時。寫出考題採用的位元模式，再解讀正負。"],
    69: ["Bias 由題目指定", "同一組欄位 110₂ 在 Excess-4 是 6−4=2，在 Excess-3 是 6−3=3。看到三位元指數欄，仍要確認題目指定的偏移量。"],
    75: ["先寫清楚尾數與精度規則", "2026 年第一次小考第 5 題指定 Excess-3。0.3 若採顯式 0.M 並截斷，讀回 0.28125；若採隱含 1 並捨入至最近值，讀回 0.296875。兩組結果各自依一套規則推得，算式要全程採同一套。"],
    76: ["原投影片標示與算例有出入", "投影片同時寫了 Excess-3 和 2.75。保留原題位元 0 | 110 | 1011 時，Bias=4 才會得到 2.75；要依投影片標示的 Bias=3 算，則是 5.5。正式作答以當題指定的 Bias 為準。"],
    77: ["截斷與捨入分開算", "本頁明示截斷，所以 0.10101₂ 留成 0.1010₂。若另一題規定捨入，先保留後面的位元判斷，遇到中點再依題意決定。"],
    82: ["先分正規數與非正規數", "單精度的非正規數用 0.F × 2⁻¹²⁶。E 欄全 0 時先判斷 F，次正規指數也不能直接算成 0−127。"],
    92: ["看清楚題目要交什麼", "2026 年題目第 (b) 小題只問長度，寫 54 bits 和算式即可。2025 年期中考第 4(b) 題要交完整位元串，需依你在第 (a) 小題畫出的樹逐字查碼再串接。"]
  },
  "lecture-03": {
    31: ["先寫回記憶體，再讀位元組順序", "如果題目先執行 STORE，再問 big-endian 或 little-endian，先列出更新後每個位址的 byte。改變的是各 byte 的位權，byte 內的 bits 不用反轉。"],
    59: ["辨認題目給的是階段數還是指令時間", "2025 期中考假設四級各一拍、沒有停頓，用 4+10−1 算。2026 第二次小考給的是每條指令各自的執行時間，用每條的開始拍＋執行拍數−1 算完成拍，再取最晚的那條。"]
  },
  "lecture-04": {
    23: ["確認「一次」和「各要」的差別", "原筆記的 1.96% 和 9.09% 假設整次切換合計 10 ms。2026 期中考明寫保存、恢復「各」10 ms，因此要把 20 ms 加進總經過時間。"],
    38: ["確認時間片有沒有包含切換", "當執行時間片與切換時間分開，分母是兩者之和。若題目直接給已含切換的週期，就用給定週期當分母。"]
  },
  "lecture-05": {
    29: ["交代媒介與雙工條件", "CSMA/CD 對應傳統共享、半雙工 Ethernet。Wi‑Fi 的 CSMA/CA 靠偵聽與退避降低碰撞機率，ACK 用來確認收到了，RTS/CTS 則視情況使用。"],
    68: ["先看題目問哪個數量", "這題 /23 的位址池總數是 512；若問同一個一般 IPv4 子網中可配給主機的位址，扣掉網路與廣播各一個，得到 510。"]
  },
  "lecture-06": {
    37: ["中點取整要從頭一致", "2025 年第三次小考允許向下或向上取中點。先註明規則，每一輪列出選到的中點與留下的範圍。用閉區間時，移動邊界後須排除本輪已比較的中點。"],
    46: ["列出選邊與權重", "題目若要最小生成樹，列出最後保留的 V−1 條邊並驗證全圖連通。遇到相同權重，合法的選邊順序可能不同，請按你選的邊加總。"]
  }
};
