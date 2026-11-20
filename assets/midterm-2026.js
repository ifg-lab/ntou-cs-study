"use strict";

const midtermString = "BCDECEEEEAACABECCEDCDDEEE";
const studyMidterm2026 = {
  id: "2026-midterm", year: 2026, month: 11, name: "期中考",
  items: [
    {
      number: 1, title: "16-bit Two’s Complement", topic: [[2, 67]], points: 10,
      prompt: "Suppose we have the following C program. What is the output of this program?\n(HINT: short int is 16-bit, 2’s compliment will be required)",
      code: '#include <stdio.h>\n\nint main( void ) {\n    short int c = 0x7FFF;\n    c = c + 0x1;\n    printf( "%d\\n", c );\n    return 0;\n}',
      steps: ["0x7FFF = 0111 1111 1111 1111₂，代表 +32767，正好是 16-bit signed short 的上限。", "加 1 時，1 從最低位逐位往高位進位，得到 1000 0000 0000 0000₂，也就是 0x8000。", "依考題預期的回存方式保留低 16 位。以 two’s complement 解讀，32768 − 65536 = −32768。"],
      exam: "0x7FFF + 0x1 = 0x8000. Interpreted as a 16-bit two’s-complement value, the output is -32768.",
      rubric: "指出原值上限，列出 0x8000，再寫出有號十進位結果。這裡採考題預期的回存位元模式。"
    },
    {
      number: 2, title: "Huffman Encoding", topic: [[2, 92]], points: 10, interactive: "huffman",
      prompt: "Originally, there are 6 characters A, B, C, D, E which requires 3-bits for each character, please use Huffman encoding method to encode/compress the following string, which originally requires 25 × 3 bits,",
      code: midtermString,
      continuation: "into a binary string. (The solution may not be unique)",
      parts: [["a", 5, "Please create the Huffman tree and the corresponding encoding for each character."], ["b", 5, "What is the length of the final encoded string in binary?"]],
      note: "卷面印了 6 characters，但列出的字母及原字串都只有 A～E，共 5 種。依實際字串計算。",
      steps: ["統計頻率：A=3、B=2、C=6、D=4、E=10，加總為 25。", "依序合併最小權重：2+3=5、4+5=9、6+9=15、10+15=25。每次把新節點放回等待合併的清單。", "若每次把較輕的子樹放左邊並標 0，另一邊標 1，一組合法碼是 A=1111、B=1110、C=10、D=110、E=0。沿原字串順序查表並串接。", "用 Σ（次數 × 碼長）得到 3×4 + 2×4 + 6×2 + 4×3 + 10×1 = 54 bits。也可加總合併權重 5+9+15+25 = 54。原本是 75 bits，資料本體少了 21 bits。"],
      exam: "(a) 畫出四次合併的樹，標示每條邊的 0/1，列出 A～E 的碼表。 (b) 3×4 + 2×4 + 6×2 + 4×3 + 10×1 = 54 bits。",
      rubric: "(a) 5 分，看頻率、合併順序和碼表是否互相一致。左右對調能得到另一組合法碼。 (b) 5 分，只問編碼後資料本體的長度。寫 54 bits 和加總算式即可。"
    },
    {
      number: 3, title: "CISC and RISC", topic: [[3, 12]], points: 10,
      prompt: "What is CISC and RISC architecture? List the differences between them and write an example processor for each architecture?",
      steps: ["先寫全名。CISC 是 Complex Instruction Set Computer，RISC 是 Reduced Instruction Set Computer。", "比較每條指令能做的事和存取記憶體的方式。CISC 的指令可以較複雜，例如某些 x86 指令可直接使用記憶體運算元。RISC 常用較規則的編碼與 load/store，先把資料載入暫存器再運算。", "各舉一顆處理器。CISC 可寫 Intel Core i7（x86-64），RISC 可寫 Arm Cortex-A53（Arm）。"],
      exam: "CISC 支援較複雜的 instructions，指令格式可以有不同長度，例如 Intel Core i7。RISC 的 instructions 通常較簡單、格式較規則，常用 load/store，例子是 Arm Cortex-A53。",
      rubric: "兩個全名、至少兩個可比較的特徵、各一個具體處理器。"
    },
    {
      number: 4, title: "Machine Instruction Categories", topic: [[3, 14]], points: 10,
      prompt: "Machine instructions are usually classified into 3 categories: Data Transfer, Arithmetic/Logic, and Control. Briefly describe what each category of the instructions do.",
      steps: ["Data Transfer 搬移或複製 data，例如 load 從 memory 搬到 register，store 從 register 寫回 memory。", "Arithmetic/Logic 改變數值或 bit pattern。ADD 是算術，AND、XOR 是邏輯。", "Control 決定下一步執行哪個 instruction，例如 branch 在條件成立時改變 PC，halt 停止執行。"],
      exam: "Data Transfer 在 memory 和 registers 等位置搬 data。Arithmetic/Logic 執行加法或位元邏輯。Control 透過 branch、jump 等改變執行順序。",
      rubric: "三類都要寫出作用，最好各附一個指令例子。"
    },
    {
      number: 5, title: "Operating System Functions", topic: [[4, 10]], points: 10,
      prompt: "List 3 functions that a operating system should have.",
      steps: ["Process Management：建立與管理 processes，排程 Ready Processes，分配 CPU 時間。", "Memory Management：分配及回收 RAM，保護不同 process 的位址空間。", "Device/I/O Management：透過 device drivers 管理裝置，協調 I/O request。File System Management 也可作為另一個例子。"],
      exam: "(1) Process management schedules processes for the CPU. (2) Memory management allocates and protects memory. (3) Device management controls I/O devices through drivers.",
      rubric: "列三項不同職責，各說明一件 OS 實際負責的工作。"
    },
    {
      number: 6, title: "Time Slices and Context Switching", topic: [[4, 23]], points: 10, diagram: true, interactive: "timeline",
      prompt: "An operation system can issue interrupts to programs to force context switching as shown in the figure below.",
      parts: [["a", 5, "What happens if we decrease the time slice allocated for executing the processes? What happens if we increase the time slice?"], ["b", 5, "Suppose there are two processes. The time required for storing the process state and restoring the process state is 10ms each. Assume that the time slice allocated for each process is 500ms. What percent of the computation time is wasted on context switching? How about decreasing the time slice to 100ms?"]],
      steps: ["(a) 較短的 time slice 讓其他 Ready Processes 較快輪到 CPU，但切換頻繁。較長的 time slice 讓切換較少，但其他程序等待較長。", "(b) 一次 context switch 要保存目前 process 的 state，再恢復下一個。題目寫各 10 ms，所以切換時間為 10 + 10 = 20 ms。", "以總經過時間當分母，500 ms 的比例為 20 ÷ (500 + 20) × 100% ≈ 3.85%；100 ms 的比例為 20 ÷ (100 + 20) × 100% ≈ 16.67%。"],
      exam: "Shorter time slices improve responsiveness but increase switching overhead. With 20 ms of switching per slice, the overhead is approximately 3.85% for 500 ms and 16.67% for 100 ms.",
      rubric: "(a) 5 分，交代較短和較長的取捨。(b) 5 分，列出 20 ms、兩個分母和百分比。筆記的 1.96% 和 9.09% 使用的是整次切換共 10 ms 的例題條件。"
    },
    {
      number: 7, title: "Core Operating System Terms", topic: [[4, 38]], points: 20,
      prompt: "Explain or describe the following terms:",
      parts: [["a", 5, "Multiprogramming."], ["b", 5, "Preemptive processes."], ["c", 5, "Kernel."], ["d", 5, "Timesharing operation systems."]],
      steps: ["(a) Multiprogramming 同時把多個 programs 放在 Main Memory。Process A 等 I/O 時，把 CPU 分給其他 Ready Process，提高 CPU utilization。", "(b) Preemptive process 可在還沒完成前，由 OS 利用 interrupt 暫停。例如 time slice 到期，OS 保存狀態並切給下一個 process。", "(c) Kernel 是 OS 在特權模式執行的核心，管理 processes、memory 和 devices，也為 applications 提供 system calls。", "(d) Timesharing 把 CPU 時間分成短 time slices，在多個使用者或程序間快速輪替，讓大家能互動並及時得到回應。"],
      exam: "Multiprogramming 要寫 I/O 等待時 CPU 換跑 Ready Process。Preemption 要寫執行途中可被 OS 取回 CPU。Kernel 要寫資源管理與特權。Timesharing 要寫短時間片、輪替和互動回應。",
      rubric: "每小題 5 分，按原卷順序分開寫。Multiprogramming 交代降低 CPU Idle Time，Timesharing 交代 Interactive Response。"
    },
    {
      number: 8, title: "Deadlock and Starvation", topic: [[4, 43]], points: 10,
      prompt: "Describe the difference in deadlocks and starvation in operating systems.",
      steps: ["Deadlock：Process A 持有鎖 X 等鎖 Y，Process B 持有 Y 等 X。兩個都等對方放手，形成 Circular Wait，因此都無法前進。", "Starvation：低優先程序一直被新來的高優先程序搶先，自己得不到 CPU，但其他程序仍會完成。可透過 Aging 逐步提高等待者優先權。", "比較時指出誰卡住、卡住原因、其他工作是否仍在進行。"],
      exam: "Deadlock 是一組 processes 互等對方持有的 resources，無法向前執行。Starvation 是某個 process 長期拿不到所需 resource，但其他 processes 仍可繼續。各舉一個情境。",
      rubric: "兩個定義、互等與長期分配不到的差異、具體例子。"
    },
    {
      number: 9, title: "Parallelism and Concurrency", topic: [[4, 40]], points: 10,
      prompt: "What is parallelism and concurrency? How does modern operating systems implement both methods?",
      steps: ["Concurrency 指多個工作在同一段時間內都有進展。在單核心上，A 跑一小段後切給 B，再切回 A。", "Parallelism 指多個工作在同一瞬間執行。例如核心 1 跑 A 時，核心 2 同時跑 B。", "回答 OS 怎麼做：利用 scheduling、time slicing、context switching 安排交錯執行，也能把可執行的 threads 排到不同核心，以 multicore scheduling 和 load balancing 支援平行執行。"],
      exam: "Concurrency allows multiple tasks to make progress during the same period, for example by time-sharing on one core. Parallelism runs tasks at the same instant on different cores. The OS uses scheduling and context switching on each core and distributes runnable threads across cores.",
      rubric: "兩個定義都要寫，接著各交代一種現代 OS 實作方式。"
    }
  ]
};
