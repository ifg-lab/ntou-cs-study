"use strict";

(() => {
  const course = {
    "id": "lecture-01",
    "label": "Chapter 0",
    "title": "概論",
    "english": "Introduction",
    "lead": "從一個可執行的步驟出發，看演算法如何寫成程式，以及電腦如何一路演變。",
    "artTerms": [
      "STEP",
      "GCD",
      "CODE",
      "BIT",
      "CPU"
    ],
    "source": "Chapter 0 概論講義",
    "availableNote": "頁碼依 PDF 順序。每頁可展開原投影片圖。 課務頁的聯絡資料及邀請連結已遮蔽。",
    "examSource": "英文模擬題參考手邊可辨讀的 2018、2022、2025 和 2026 年小考、期中與期末題型，按教材範圍改寫。評分規準及解析以繁體中文呈現。",
    "questionLanguage": "en",
    "examMinutes": 45,
    "units": [
      {
        "id": "orientation",
        "start": 1,
        "end": 12,
        "title": "課程導讀",
        "description": "設計一份可重複使用的複習流程"
      },
      {
        "id": "foundations",
        "start": 13,
        "end": 28,
        "title": "演算法、抽象與資訊",
        "description": "從問題定義走到程式和社會影響"
      },
      {
        "id": "euclid",
        "start": 29,
        "end": 30,
        "title": "歐幾里得演算法",
        "description": "用餘數算最大公因數"
      },
      {
        "id": "mechanical",
        "start": 31,
        "end": 49,
        "title": "早期計算工具",
        "description": "算盤、齒輪與打孔卡"
      },
      {
        "id": "programmable",
        "start": 50,
        "end": 69,
        "title": "可程式化的機械",
        "description": "分析機、製表機與 Mark I"
      },
      {
        "id": "stored",
        "start": 70,
        "end": 90,
        "title": "電子計算與儲存程式",
        "description": "ENIAC、記憶體、電晶體與微處理器"
      },
      {
        "id": "modern",
        "start": 91,
        "end": 99,
        "title": "現代運算",
        "description": "多核心互連、GPU、網路和感測裝置"
      }
    ],
    "slides": [
      {
        "page": 1,
        "title": "課程導讀",
        "paragraphs": [
          "前四章先建立同一個模型：資料寫成位元，指令操作資料，作業系統管理共用資源。"
        ],
        "terms": []
      },
      {
        "page": 2,
        "title": "課程資訊",
        "paragraphs": [
          "先確認老師使用的課程公告管道。此站的進度用於複習，實際授課安排以課堂公告為準。"
        ],
        "terms": []
      },
      {
        "page": 3,
        "title": "課程入口",
        "paragraphs": [
          "用講義頁碼找到對應的筆記，遇到不熟的名詞就從短解釋進入術語表。"
        ],
        "terms": []
      },
      {
        "page": 4,
        "title": "授課與聯絡資訊",
        "paragraphs": [
          "講義記載授課與聯絡資訊；課務問題請循老師公布的方式提出。"
        ],
        "terms": []
      },
      {
        "page": 5,
        "title": "課堂討論",
        "paragraphs": [
          "求助時寫出題目、自己試過的步驟與卡住的位置，讓同學能重現問題。"
        ],
        "terms": []
      },
      {
        "page": 6,
        "title": "計算機科學在研究什麼？",
        "paragraphs": [
          "計算機科學研究怎麼讓問題可以被表示和求解。試著用自己的話說明演算法、資料和程式的差別。"
        ],
        "terms": []
      },
      {
        "page": 7,
        "title": "後續的主題",
        "paragraphs": [
          "資料儲存先回答「怎麼表示」，資料操作回答「怎麼改變」，作業系統回答「怎麼協調」。"
        ],
        "terms": []
      },
      {
        "page": 8,
        "title": "課本與講義",
        "paragraphs": [
          "教科書以演算法為主軸，逐章展開資料、機器、作業系統等例子。不同版本頁碼可能不同。"
        ],
        "terms": []
      },
      {
        "page": 9,
        "title": "討論如何進行",
        "paragraphs": [
          "同一道題可能有多種演算法；比較時先確認它們使用相同的輸入與產出要求。"
        ],
        "terms": []
      },
      {
        "page": 10,
        "title": "課程評量（一）",
        "paragraphs": [
          "評量細節以老師公布為準。複習時把會解釋的觀念和要實際算的題目分開準備。"
        ],
        "terms": []
      },
      {
        "page": 11,
        "title": "課程評量（二）",
        "paragraphs": [
          "練習把結果與推導一起寫下來，例如最大公因數要寫到哪一步餘數為零。"
        ],
        "terms": []
      },
      {
        "page": 12,
        "title": "課程評量（三）",
        "paragraphs": [
          "用一份短自測找出卡住的概念，再回到對應頁練習不同輸入。"
        ],
        "terms": []
      },
      {
        "page": 13,
        "title": "演算法是研究主軸",
        "paragraphs": [
          "計算機科學研究如何發現、表示、執行並分析演算法。排序方法即使尚未寫成程式，也能比較步驟。"
        ],
        "terms": [
          "Input",
          "Output"
        ]
      },
      {
        "page": 14,
        "title": "演算法的定義",
        "paragraphs": [
          "把一項任務描述成明確可執行的步驟。還要指定何時停止，才能判斷程序是否完成。",
          "找陣列最大值：先以第一項作為目前最大值，往後每讀一項就比較並視情況替換。處理完前 k 項後，手上的值應是那 k 項的最大值。"
        ],
        "terms": [
          "Algorithm",
          "Termination",
          "Input",
          "Output",
          "Loop",
          "Loop Invariant"
        ],
        "exam": "用「處理前 k 項得到哪個不變量」說明正確性；n 個元素初始化後需 n−1 次比較。"
      },
      {
        "page": 15,
        "title": "哪些問題能用演算法解",
        "paragraphs": [
          "先問是否存在能求解所有合法輸入的程序，再問需要多少時間和空間。"
        ],
        "terms": []
      },
      {
        "page": 16,
        "title": "資訊操作與解題",
        "paragraphs": [
          "同一個搜尋想法可以用於查字典或查資料表。資料排列方式會影響可使用的方法。"
        ],
        "terms": []
      },
      {
        "page": 17,
        "title": "運算的影響",
        "paragraphs": [
          "同一套資訊處理方法可用在科學、產業與政府。輸入資料的偏差也會影響輸出。"
        ],
        "terms": []
      },
      {
        "page": 18,
        "title": "從問題到可執行步驟",
        "paragraphs": [
          "先確定問題、設計解法，再選擇表示法並實作。找不到答案時，可先定位問題出在哪一層。"
        ],
        "terms": [
          "Algorithm",
          "Program"
        ]
      },
      {
        "page": 19,
        "title": "抽象是保留可用的介面",
        "paragraphs": [
          "使用者只要知道計算機要輸入什麼、回傳什麼。電路和運算指令封裝在內部，可以各自改良。",
          "照片讀寫介面若承諾逐位元組還原，內部改用無損壓縮仍符合承諾。若縮圖後只留像素近似值，呼叫端就可能得到不同資料。"
        ],
        "terms": [
          "Abstraction"
        ],
        "exam": "分別寫出介面保證的結果、實作藏在哪裡、換實作後可否維持行為。"
      },
      {
        "page": 20,
        "title": "計算機科學的創造性",
        "paragraphs": [
          "同一問題可能有多個解法。設計者可改善時間、降低記憶體需求，或讓方法更容易驗證。"
        ],
        "terms": []
      },
      {
        "page": 21,
        "title": "資訊怎麼變成數位資料",
        "paragraphs": [
          "先決定要保留哪些物理量，再用有限的取樣點與數值表示。精確度、大小和需求一起決定表示法。"
        ],
        "terms": [
          "Digitization"
        ]
      },
      {
        "page": 22,
        "title": "數位物件的表示",
        "paragraphs": [
          "文字可以用字元編碼，影像可以用像素，錄音可以用取樣值。同一串位元需要格式才知道怎麼解讀。"
        ],
        "terms": [
          "Abstraction",
          "Digitization"
        ]
      },
      {
        "page": 23,
        "title": "把意圖轉為程式",
        "paragraphs": [
          "程式用語言表達演算法和資料。要處理空值、非法輸入等例外，問題才算定義完整。"
        ],
        "terms": [
          "Algorithm",
          "Program"
        ]
      },
      {
        "page": 24,
        "title": "程式與錯誤",
        "paragraphs": [
          "語法正確的程式仍可能給出錯誤結果。測試小例子和邊界輸入能揭露遺漏的條件。",
          "用 [-7, -2, -5] 測試最大值。若把目前最大值初設為 0，最後會回傳從未出現的項目，也不是數列的最大值。"
        ],
        "terms": [
          "Algorithm",
          "Program",
          "Termination",
          "Input",
          "Conditional Branch",
          "Loop",
          "Boundary Case"
        ],
        "exam": "準備全負、僅一項及重複值，看看初始化與迴圈邊界。"
      },
      {
        "page": 25,
        "title": "資訊如何改變取得與傳播",
        "paragraphs": [
          "數位資料容易複製、搜尋和傳播。設計系統時要同時考量取得權限和可追溯性。"
        ],
        "terms": [
          "Digitization"
        ]
      },
      {
        "page": 26,
        "title": "計算帶來的規範問題",
        "paragraphs": [
          "同一個設計可以從法律責任、隱私與社會公平評估。先辨識誰受影響，才有可比較的方案。"
        ],
        "terms": []
      },
      {
        "page": 27,
        "title": "社會議題與資料",
        "paragraphs": [
          "設計公共服務時，缺少某群人的資料會造成偏差。即使平均準確率高，也要觀察不同群體的結果。"
        ],
        "terms": [
          "Digitization"
        ]
      },
      {
        "page": 28,
        "title": "倫理推理的角度",
        "paragraphs": [
          "可比較整體後果，也可檢查是否尊重個人權利及採用一致規則。說明權衡過程比只列結論更有用。"
        ],
        "terms": []
      },
      {
        "page": 29,
        "title": "最大公因數問題",
        "paragraphs": [
          "最大公因數是同時整除兩個整數的最大正整數。以 48 和 18 為例，答案是 6。"
        ],
        "terms": [
          "Greatest Common Divisor",
          "Euclidean Algorithm"
        ]
      },
      {
        "page": 30,
        "title": "歐幾里得演算法",
        "paragraphs": [
          "用 (a,b) → (b,a mod b) 保持最大公因數。餘數為零時停止並回傳第一個數。例如 48、18 → 18、12 → 12、6 → 6、0。",
          "84＝2×30＋24，30＝1×24＋6，24＝4×6＋0。每次以「原除數、餘數」替換，公因數集合相同，因為餘數＝被除數−商×除數。"
        ],
        "terms": [
          "Algorithm",
          "Termination",
          "Greatest Common Divisor",
          "Euclidean Algorithm",
          "Loop",
          "Termination Condition",
          "Loop Invariant"
        ],
        "exam": "每輪寫被除數、除數、商和餘數。寫到餘數為 0，答案取當時除數，不取最後的 0。"
      },
      {
        "page": 31,
        "title": "早期計算工具",
        "paragraphs": [
          "先看機械裝置如何表示數字，再看裝置如何依照外部指示改變操作。"
        ],
        "terms": []
      },
      {
        "page": 32,
        "title": "打孔卡與織機",
        "paragraphs": [
          "孔洞配合讀取機構，能指定要控制哪些經線。這讓樣式可以用卡片保存並重用。"
        ],
        "terms": [
          "Punched Card"
        ]
      },
      {
        "page": 33,
        "title": "繼電器與早期自動計算",
        "paragraphs": [
          "機械繼電器以電流控制接點，能組成開關邏輯。大量接點也帶來速度和磨損限制。"
        ],
        "terms": []
      },
      {
        "page": 34,
        "title": "算盤的表示法",
        "paragraphs": [
          "珠子的位置保存目前數值，操作者依規則移動珠子完成運算。"
        ],
        "terms": []
      },
      {
        "page": 35,
        "title": "算盤的歷史脈絡",
        "paragraphs": [
          "不同文化發展出各類算具。辨認圖中的位值和操作方式，比背單一發明者更能解釋用途。"
        ],
        "terms": []
      },
      {
        "page": 36,
        "title": "對數的運算優勢",
        "paragraphs": [
          "對正數 x、y，log(xy) = log x + log y。查表後以加法取代直接乘法。"
        ],
        "terms": []
      },
      {
        "page": 37,
        "title": "對數表怎麼用",
        "paragraphs": [
          "查兩個操作數的對數並相加，再查回原數值。查表的位數會限制答案精度。"
        ],
        "terms": []
      },
      {
        "page": 38,
        "title": "計算尺",
        "paragraphs": [
          "尺上的位置對應對數，把刻度距離相加即可估算乘積。小數點位置需由操作者判斷。"
        ],
        "terms": []
      },
      {
        "page": 39,
        "title": "齒輪計算機的設計",
        "paragraphs": [
          "齒輪轉角可以儲存一位數；跨越一圈時撥動下一個齒輪，實現進位。"
        ],
        "terms": []
      },
      {
        "page": 40,
        "title": "早期齒輪計算機",
        "paragraphs": [
          "自動處理進位能減少人工錯誤，仍需要操作者輸入數字並指定運算。"
        ],
        "terms": []
      },
      {
        "page": 41,
        "title": "帕斯卡加法機",
        "paragraphs": [
          "轉盤輸入十進位數，機械結構把各位相加。觀察個位從 9 變 0 時十位怎麼變。"
        ],
        "terms": []
      },
      {
        "page": 42,
        "title": "帕斯卡加法機外觀",
        "paragraphs": [
          "每個撥輪對應一個十進位欄位，結果窗呈現各欄的數字。"
        ],
        "terms": []
      },
      {
        "page": 43,
        "title": "帕斯卡加法機內部",
        "paragraphs": [
          "進位機構把前一欄的一整圈，轉成下一欄的一格。"
        ],
        "terms": []
      },
      {
        "page": 44,
        "title": "萊布尼茲的計算機",
        "paragraphs": [
          "階梯輪讓機器以重複加法及位移處理乘法。自動化的重點是少做手動重複步驟。"
        ],
        "terms": []
      },
      {
        "page": 45,
        "title": "階梯計算器",
        "paragraphs": [
          "辨認階梯輪與寄存目前數值的部件；機械狀態在每輪轉動後改變。"
        ],
        "terms": []
      },
      {
        "page": 46,
        "title": "賈卡織機",
        "paragraphs": [
          "卡片的孔洞和空白控制經線，改變卡片可以改變織出的圖樣。"
        ],
        "terms": [
          "Punched Card",
          "Jacquard Loom"
        ]
      },
      {
        "page": 47,
        "title": "卡片的順序",
        "paragraphs": [
          "單張卡表示一列控制資訊，多張卡串接後就能重複產生完整樣式。"
        ],
        "terms": [
          "Punched Card",
          "Jacquard Loom"
        ]
      },
      {
        "page": 48,
        "title": "打孔卡特寫",
        "paragraphs": [
          "思考孔和無孔怎麼被機構讀取。一張實體物件可以標記很多獨立的二元狀態。"
        ],
        "terms": [
          "Punched Card"
        ]
      },
      {
        "page": 49,
        "title": "織機的影響",
        "paragraphs": [
          "設計圖樣和執行動作可以分離。換一套卡，相同機器就能做出另一種布料。"
        ],
        "terms": []
      },
      {
        "page": 50,
        "title": "巴貝奇的差分機",
        "paragraphs": [
          "把製作數表的計算規律轉為機械動作，減少數表中的手算錯誤。"
        ],
        "terms": []
      },
      {
        "page": 51,
        "title": "差分表與重複加法",
        "paragraphs": [
          "有限差分讓某些數列可從前值加出下一值。這對大量規則的表格項目有用。"
        ],
        "terms": []
      },
      {
        "page": 52,
        "title": "分析機的構想",
        "paragraphs": [
          "巴貝奇設計可依指定步驟工作的更通用機器。資料儲存和實際計算分由不同部件負責。"
        ],
        "terms": []
      },
      {
        "page": 53,
        "title": "卡片儲存指令和資料",
        "paragraphs": [
          "同一種介質可以放計算指示或數值。孔洞本身的意思取決於讀取位置和規則。"
        ],
        "terms": [
          "Punched Card"
        ]
      },
      {
        "page": 54,
        "title": "條件分支",
        "paragraphs": [
          "如果結果符合條件，選擇另一段指令。可根據數值改變執行順序，也讓迴圈有明確停止條件。"
        ],
        "terms": [
          "Termination",
          "Conditional Branch"
        ]
      },
      {
        "page": 55,
        "title": "愛達與分析機",
        "paragraphs": [
          "愛達．勒芙蕾絲的筆記展示如何描述一連串可由機器執行的運算。"
        ],
        "terms": [
          "Abstraction"
        ]
      },
      {
        "page": 56,
        "title": "人口普查需要自動統計",
        "paragraphs": [
          "大量資料若靠手工分類，統計時間會快速成長。先把欄位編為孔洞，才能用機器計數。"
        ],
        "terms": []
      },
      {
        "page": 57,
        "title": "霍勒里斯製表機",
        "paragraphs": [
          "讀卡器偵測孔位，計數器依欄位累加。這裡卡片主要承載人口資料。"
        ],
        "terms": [
          "Punched Card"
        ]
      },
      {
        "page": 58,
        "title": "1890 年普查的資料處理",
        "paragraphs": [
          "讀卡把重複的分類工作交給裝置。工作規模仍受到輸入、卡片整理與更正影響。"
        ],
        "terms": []
      },
      {
        "page": 59,
        "title": "製表技術走向商業",
        "paragraphs": [
          "機器製表從單次普查延伸到大量的企業資料。資料格式和讀取設備一起形成流程。"
        ],
        "terms": []
      },
      {
        "page": 60,
        "title": "打孔位置與欄位",
        "paragraphs": [
          "每個欄位的孔要依固定規則解讀。卡片只保存編碼，計數機構提供後續操作。"
        ],
        "terms": [
          "Punched Card"
        ]
      },
      {
        "page": 61,
        "title": "科學和軍事計算",
        "paragraphs": [
          "建立射表等任務需要大量可重複的數值運算，成為開發自動計算設備的動力。"
        ],
        "terms": []
      },
      {
        "page": 62,
        "title": "人力計算與射表",
        "paragraphs": [
          "人員依共同方法分工求值。機器問世前，「computer」也可指負責計算的人。"
        ],
        "terms": []
      },
      {
        "page": 63,
        "title": "哈佛 Mark I",
        "paragraphs": [
          "大型機電自動計算設備按指令序列完成長串數值運算。"
        ],
        "terms": []
      },
      {
        "page": 64,
        "title": "Mark I 的實體規模",
        "paragraphs": [
          "從重量、佈線與機件看早期機電系統的建造成本，並和後來的電子化比較。"
        ],
        "terms": []
      },
      {
        "page": 65,
        "title": "Mark I 系統照",
        "paragraphs": [
          "照片可用來辨認裝置是由多個機械和電氣部件連成的系統。"
        ],
        "terms": []
      },
      {
        "page": 66,
        "title": "Mark I 的面板",
        "paragraphs": [
          "面板和指示元件提供可觀察的機器狀態，便於操作和故障檢查。"
        ],
        "terms": []
      },
      {
        "page": 67,
        "title": "葛麗絲．霍珀",
        "paragraphs": [
          "霍珀參與 Mark I 程式設計，後來也推動讓程式表達遠離機器細節的工具。"
        ],
        "terms": []
      },
      {
        "page": 68,
        "title": "早期對電腦需求的理解",
        "paragraphs": [
          "早期電腦昂貴且用途集中。理解這些條件後，再回頭看個人電腦帶來的變化。"
        ],
        "terms": []
      },
      {
        "page": 69,
        "title": "市場與技術互相影響",
        "paragraphs": [
          "設備需求會隨速度、成本及可用軟體改變。歷史上的市場預測應放在當時背景理解。"
        ],
        "terms": []
      },
      {
        "page": 70,
        "title": "早期電子計算探索",
        "paragraphs": [
          "轉向電子元件後，開關不必等待齒輪和機械接點移動。早期機器常為特定計算任務設計。"
        ],
        "terms": []
      },
      {
        "page": 71,
        "title": "阿塔納索夫－貝里電腦",
        "paragraphs": [
          "這項設計用電子方式協助求解線性方程組，呈現從機電轉向電子的路徑。"
        ],
        "terms": []
      },
      {
        "page": 72,
        "title": "Colossus",
        "paragraphs": [
          "以電子電路高速處理戰時密碼分析中的資料，展示專用硬體如何針對任務設計。"
        ],
        "terms": []
      },
      {
        "page": 73,
        "title": "微處理器與字長",
        "paragraphs": [
          "處理器用數位電路處理固定寬度的資料。字長影響常用運算的表示範圍，整體效能還受其他因素影響。"
        ],
        "terms": [
          "Transistor",
          "Integrated Circuit",
          "Microprocessor"
        ]
      },
      {
        "page": 74,
        "title": "ENIAC 的定位",
        "paragraphs": [
          "大型電子數位計算機以真空管運算。它的運算方式和更換整個工作流程時的設定方式應分開理解。"
        ],
        "terms": [
          "ENIAC"
        ]
      },
      {
        "page": 75,
        "title": "真空管作為開關",
        "paragraphs": [
          "用電氣方式控制導通狀態，可以組成邏輯電路。體積、耗電和散熱會影響規模。"
        ],
        "terms": [
          "Transistor"
        ]
      },
      {
        "page": 76,
        "title": "電子化帶來的速度",
        "paragraphs": [
          "電子切換能加快運算，程式如何設定仍是另一個限制。歷史比較要區分通用性和程式儲存方式。"
        ],
        "terms": []
      },
      {
        "page": 77,
        "title": "ENIAC 如何設定程式",
        "paragraphs": [
          "操作人員依任務接線、切換開關。程式變更因此需要重新設定機器的實體配置。"
        ],
        "terms": [
          "Program",
          "Stored-Program Concept",
          "ENIAC"
        ]
      },
      {
        "page": 78,
        "title": "接線面板圖",
        "paragraphs": [
          "沿接線辨認運算單元之間的訊號路徑；重配置時這些路徑也會改變。"
        ],
        "terms": []
      },
      {
        "page": 79,
        "title": "運算快與換程式快",
        "paragraphs": [
          "重接線可耗費大量工時，即使配置完成後能高速計算。兩種時間要分開衡量。"
        ],
        "terms": [
          "Program",
          "Stored-Program Concept",
          "ENIAC"
        ]
      },
      {
        "page": 80,
        "title": "真空管系統的維護",
        "paragraphs": [
          "元件數量多會放大故障、散熱和維護的挑戰。這也推動更小更可靠的元件。"
        ],
        "terms": [
          "Transistor"
        ]
      },
      {
        "page": 81,
        "title": "儲存程式的想法",
        "paragraphs": [
          "讓指令和資料都可用位元編碼放入記憶體。處理器讀取指令，換程序通常只要載入另一份指令序列。"
        ],
        "terms": [
          "Stored-Program Concept"
        ]
      },
      {
        "page": 82,
        "title": "記憶體內的指令",
        "paragraphs": [
          "位元串可表示指令或資料；CPU 的取指位置和解碼規則決定如何處理。",
          "假設記憶體 0x20 開始是求和程式，0x80 開始是找最大值程式。讓處理器從 0x80 開始取指，同一組暫存器和運算單元就能做另一項工作。"
        ],
        "terms": [
          "Program",
          "Stored-Program Concept"
        ],
        "exam": "回答時要提到記憶體中的指令和資料、PC 提供取指位址，以及更新指令可換工作。"
      },
      {
        "page": 83,
        "title": "從接線切換到載入程式",
        "paragraphs": [
          "比較更換實體連線和更新記憶體內容的工作量。這個改變讓一台機器更易重用。"
        ],
        "terms": [
          "Program",
          "Stored-Program Concept"
        ]
      },
      {
        "page": 84,
        "title": "昂貴的早期系統",
        "paragraphs": [
          "看歷史價格時記得主要設備、維護與服務是不同成本。掌握成本趨勢即可。"
        ],
        "terms": []
      },
      {
        "page": 85,
        "title": "電晶體",
        "paragraphs": [
          "電晶體可用作數位開關，讓電子設備有機會縮小尺寸與降低功耗。"
        ],
        "terms": [
          "Transistor",
          "Integrated Circuit"
        ]
      },
      {
        "page": 86,
        "title": "UNIVAC 與商業用途",
        "paragraphs": [
          "電子計算設備開始用於大量組織資料和日常處理，應用從科學計算擴大。"
        ],
        "terms": []
      },
      {
        "page": 87,
        "title": "積體電路",
        "paragraphs": [
          "將多個電晶體等元件放在同一晶片，減少分立元件與外部連線。"
        ],
        "terms": [
          "Transistor",
          "Integrated Circuit"
        ]
      },
      {
        "page": 88,
        "title": "微處理器",
        "paragraphs": [
          "把 CPU 功能整合到單一晶片，使通用處理器更容易放進較小的設備。"
        ],
        "terms": [
          "Integrated Circuit",
          "Microprocessor"
        ]
      },
      {
        "page": 89,
        "title": "個人電腦",
        "paragraphs": [
          "CPU 成本和裝置體積降低後，使用場景從共用大型設備擴大到個人。"
        ],
        "terms": [
          "Microprocessor"
        ]
      },
      {
        "page": 90,
        "title": "效能與成本的長期變化",
        "paragraphs": [
          "比較不同年代要先指定衡量基準，如每元可完成的工作量，而不是只數元件。"
        ],
        "terms": []
      },
      {
        "page": 91,
        "title": "多裸晶設計",
        "paragraphs": [
          "處理器可把不同功能拆成數塊裸晶，再用封裝內互連傳送資料。互連的延遲和頻寬也是設計條件。"
        ],
        "terms": [
          "Microprocessor",
          "Parallel Computing"
        ]
      },
      {
        "page": 92,
        "title": "把多個運算單元連起來",
        "paragraphs": [
          "擴充運算能力要考量工作能否拆開，以及各部分是否能及時交換資料。"
        ],
        "terms": [
          "Parallel Computing"
        ]
      },
      {
        "page": 93,
        "title": "高速互連",
        "paragraphs": [
          "處理器或節點之間需要傳輸通道；傳輸或同步太慢時，加更多運算單元也不一定改善整體時間。"
        ],
        "terms": [
          "Parallel Computing"
        ]
      },
      {
        "page": 94,
        "title": "GPU 叢集",
        "paragraphs": [
          "GPU 有大量可並行的運算資源，適合能切成許多相似小工作的任務。"
        ],
        "terms": [
          "Parallel Computing"
        ]
      },
      {
        "page": 95,
        "title": "GPU 伺服器",
        "paragraphs": [
          "用多個加速器共同處理大型工作時，要考量資料搬運、供電、散熱及工作如何分配。"
        ],
        "terms": [
          "Parallel Computing"
        ]
      },
      {
        "page": 96,
        "title": "網際網路與 Web",
        "paragraphs": [
          "網際網路提供互連基礎，Web 是建構在其上的服務。二者可搭配但負責不同層次。"
        ],
        "terms": []
      },
      {
        "page": 97,
        "title": "物聯網",
        "paragraphs": [
          "感測器先把環境事件轉成資料，連線後由其他裝置或服務使用。裝置管理和資料保護也屬於系統設計。"
        ],
        "terms": []
      },
      {
        "page": 98,
        "title": "穿戴裝置",
        "paragraphs": [
          "以手錶為例，感測、運算、電池與連線是同一套產品中的不同子系統。"
        ],
        "terms": []
      },
      {
        "page": 99,
        "title": "用歷史案例串起全章",
        "paragraphs": [
          "觀察舊電腦執行程式時，找出輸入、指令、儲存和輸出。這些概念延續到後面的 Chapter 1 和 2。"
        ],
        "terms": [
          "Abstraction"
        ]
      }
    ],
    "concepts": {
      "algorithm": "從問題寫出演算法",
      "abstraction": "選擇保留的資訊",
      "gcd": "最大公因數與歐幾里得演算法",
      "punched-cards": "打孔卡與機械控制",
      "stored-program": "程式與資料如何儲存",
      "hardware-history": "電子元件與硬體演變",
      "parallel-work": "平行計算與互連"
    },
    "practice": [
      {
        "id": "practice-1",
        "unit": "orientation",
        "page": 6,
        "concept": "algorithm",
        "level": "觀念",
        "prompt": "Which item is a program that a computer can run?",
        "options": [
          {
            "label": "The integers waiting to be sorted",
            "correct": false,
            "explanation": "程式是在語言中表達要做的動作。"
          },
          {
            "label": "An executable implementation of sorting in Python",
            "correct": true,
            "explanation": "程式是在語言中表達要做的動作。"
          },
          {
            "label": "The sorted sequence",
            "correct": false,
            "explanation": "程式是在語言中表達要做的動作。"
          },
          {
            "label": "The written statement of the problem",
            "correct": false,
            "explanation": "程式是在語言中表達要做的動作。"
          }
        ]
      },
      {
        "id": "practice-2",
        "unit": "foundations",
        "page": 14,
        "concept": "algorithm",
        "level": "觀念",
        "prompt": "Which instruction is precise enough to implement as one step of an algorithm?",
        "options": [
          {
            "label": "Compare the current value with the next value and keep the smaller one.",
            "correct": true,
            "explanation": "明確說出比較哪些值及如何決定後續。"
          },
          {
            "label": "Improve the answer.",
            "correct": false,
            "explanation": "明確說出比較哪些值及如何決定後續。"
          },
          {
            "label": "Change it until it looks correct.",
            "correct": false,
            "explanation": "明確說出比較哪些值及如何決定後續。"
          },
          {
            "label": "Choose a suitable result.",
            "correct": false,
            "explanation": "明確說出比較哪些值及如何決定後續。"
          }
        ]
      },
      {
        "id": "practice-3",
        "unit": "foundations",
        "page": 15,
        "concept": "algorithm",
        "level": "觀念",
        "prompt": "Before timing two algorithms against each other, what should you verify?",
        "options": [
          {
            "label": "They contain the same number of lines.",
            "correct": false,
            "explanation": "需在相同任務條件下才有可比性。"
          },
          {
            "label": "They use completely different input sets.",
            "correct": false,
            "explanation": "需在相同任務條件下才有可比性。"
          },
          {
            "label": "They use the same variable names.",
            "correct": false,
            "explanation": "需在相同任務條件下才有可比性。"
          },
          {
            "label": "They solve the same problem under the same input requirements.",
            "correct": true,
            "explanation": "需在相同任務條件下才有可比性。"
          }
        ]
      },
      {
        "id": "practice-4",
        "unit": "foundations",
        "page": 19,
        "concept": "abstraction",
        "level": "應用",
        "prompt": "When a library replaces its internal algorithm, what lets existing callers keep using it?",
        "options": [
          {
            "label": "The original number of lines of source code",
            "correct": false,
            "explanation": "介面約定相容時，呼叫端不需要知道替換的實作。"
          },
          {
            "label": "The original register allocation",
            "correct": false,
            "explanation": "介面約定相容時，呼叫端不需要知道替換的實作。"
          },
          {
            "label": "The original interface contract for inputs, outputs, and behavior",
            "correct": true,
            "explanation": "介面約定相容時，呼叫端不需要知道替換的實作。"
          },
          {
            "label": "The original developer's editor",
            "correct": false,
            "explanation": "介面約定相容時，呼叫端不需要知道替換的實作。"
          }
        ]
      },
      {
        "id": "practice-5",
        "unit": "foundations",
        "page": 21,
        "concept": "abstraction",
        "level": "判讀",
        "prompt": "Which operation directly digitizes the signal from a microphone?",
        "options": [
          {
            "label": "Rename the recording file.",
            "correct": false,
            "explanation": "取樣與量化讓連續訊號變成可編碼的數值序列。"
          },
          {
            "label": "Measure the amplitude at discrete times and quantize each measurement.",
            "correct": true,
            "explanation": "取樣與量化讓連續訊號變成可編碼的數值序列。"
          },
          {
            "label": "Turn up the volume during playback.",
            "correct": false,
            "explanation": "取樣與量化讓連續訊號變成可編碼的數值序列。"
          },
          {
            "label": "Move the loudspeaker to another room.",
            "correct": false,
            "explanation": "取樣與量化讓連續訊號變成可編碼的數值序列。"
          }
        ]
      },
      {
        "id": "practice-6",
        "unit": "foundations",
        "page": 24,
        "concept": "algorithm",
        "level": "判讀",
        "prompt": "A program runs but reports 12 for 3 + 4. What is the most likely problem?",
        "options": [
          {
            "label": "A logic error or the wrong operation",
            "correct": true,
            "explanation": "輸入輸出流程已能執行，應檢查如何計算值。"
          },
          {
            "label": "A syntax error in every case",
            "correct": false,
            "explanation": "輸入輸出流程已能執行，應檢查如何計算值。"
          },
          {
            "label": "A disk failure in every case",
            "correct": false,
            "explanation": "輸入輸出流程已能執行，應檢查如何計算值。"
          },
          {
            "label": "The program cannot accept positive integers",
            "correct": false,
            "explanation": "輸入輸出流程已能執行，應檢查如何計算值。"
          }
        ]
      },
      {
        "id": "practice-7",
        "unit": "foundations",
        "page": 27,
        "concept": "abstraction",
        "level": "應用",
        "prompt": "A public-service model has high average accuracy. What else should you inspect to evaluate fairness?",
        "options": [
          {
            "label": "The length of the executable's file name",
            "correct": false,
            "explanation": "整體平均能掩蓋特定群體樣本不足及較高錯誤率。"
          },
          {
            "label": "Whether every database row has the same text length",
            "correct": false,
            "explanation": "整體平均能掩蓋特定群體樣本不足及較高錯誤率。"
          },
          {
            "label": "The executable's compression format",
            "correct": false,
            "explanation": "整體平均能掩蓋特定群體樣本不足及較高錯誤率。"
          },
          {
            "label": "Data coverage and error rates for different groups",
            "correct": true,
            "explanation": "整體平均能掩蓋特定群體樣本不足及較高錯誤率。"
          }
        ]
      },
      {
        "id": "practice-8",
        "unit": "euclid",
        "page": 29,
        "concept": "gcd",
        "level": "計算",
        "prompt": "What is gcd(18, 24)?",
        "options": [
          {
            "label": "3",
            "correct": false,
            "explanation": "6 同時整除，且比它更大的 18 的因數 9、18 都不能整除 24。"
          },
          {
            "label": "12",
            "correct": false,
            "explanation": "6 同時整除，且比它更大的 18 的因數 9、18 都不能整除 24。"
          },
          {
            "label": "6",
            "correct": true,
            "explanation": "6 同時整除，且比它更大的 18 的因數 9、18 都不能整除 24。"
          },
          {
            "label": "18",
            "correct": false,
            "explanation": "6 同時整除，且比它更大的 18 的因數 9、18 都不能整除 24。"
          }
        ]
      },
      {
        "id": "practice-9",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "流程",
        "prompt": "Euclid's algorithm starts with (56, 15). Which pair is used in the next iteration?",
        "options": [
          {
            "label": "(56, 11)",
            "correct": false,
            "explanation": "56＝3×15＋11，換成上一輪的除數與餘數。"
          },
          {
            "label": "(15, 11)",
            "correct": true,
            "explanation": "56＝3×15＋11，換成上一輪的除數與餘數。"
          },
          {
            "label": "(15, 3)",
            "correct": false,
            "explanation": "56＝3×15＋11，換成上一輪的除數與餘數。"
          },
          {
            "label": "(11, 15)",
            "correct": false,
            "explanation": "56＝3×15＋11，換成上一輪的除數與餘數。"
          }
        ]
      },
      {
        "id": "practice-10",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "應用",
        "prompt": "Euclid's algorithm reaches (12, 0). What should it do next?",
        "options": [
          {
            "label": "Stop and return 12.",
            "correct": true,
            "explanation": "零是停止訊號，當前第一個數是答案。"
          },
          {
            "label": "Stop and return 0.",
            "correct": false,
            "explanation": "零是停止訊號，當前第一個數是答案。"
          },
          {
            "label": "Divide 12 by 0.",
            "correct": false,
            "explanation": "零是停止訊號，當前第一個數是答案。"
          },
          {
            "label": "Restart from the initial pair.",
            "correct": false,
            "explanation": "零是停止訊號，當前第一個數是答案。"
          }
        ]
      },
      {
        "id": "practice-11",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "計算",
        "prompt": "What is gcd(75, 45)?",
        "options": [
          {
            "label": "5",
            "correct": false,
            "explanation": "(75,45) → (45,30) → (30,15) → (15,0)。"
          },
          {
            "label": "30",
            "correct": false,
            "explanation": "(75,45) → (45,30) → (30,15) → (15,0)。"
          },
          {
            "label": "45",
            "correct": false,
            "explanation": "(75,45) → (45,30) → (30,15) → (15,0)。"
          },
          {
            "label": "15",
            "correct": true,
            "explanation": "(75,45) → (45,30) → (30,15) → (15,0)。"
          }
        ]
      },
      {
        "id": "practice-12",
        "unit": "mechanical",
        "page": 38,
        "concept": "hardware-history",
        "level": "觀念",
        "prompt": "Which operation can a slide rule approximate by adding distances on logarithmic scales?",
        "options": [
          {
            "label": "Testing two strings for equality",
            "correct": false,
            "explanation": "對數把乘積轉成兩項對數的和。"
          },
          {
            "label": "Inverting binary bits",
            "correct": false,
            "explanation": "對數把乘積轉成兩項對數的和。"
          },
          {
            "label": "Multiplying two positive numbers",
            "correct": true,
            "explanation": "對數把乘積轉成兩項對數的和。"
          },
          {
            "label": "Exactly converting any number to an infinite decimal",
            "correct": false,
            "explanation": "對數把乘積轉成兩項對數的和。"
          }
        ]
      },
      {
        "id": "practice-13",
        "unit": "mechanical",
        "page": 46,
        "concept": "punched-cards",
        "level": "應用",
        "prompt": "How would a Jacquard loom produce a different pattern?",
        "options": [
          {
            "label": "Replace the material of all its gears.",
            "correct": false,
            "explanation": "卡片孔位按行控制經線，換序列能換樣式。"
          },
          {
            "label": "Use a different sequence of punched cards.",
            "correct": true,
            "explanation": "卡片孔位按行控制經線，換序列能換樣式。"
          },
          {
            "label": "Change the factory's power frequency.",
            "correct": false,
            "explanation": "卡片孔位按行控制經線，換序列能換樣式。"
          },
          {
            "label": "Change the number of people on the line.",
            "correct": false,
            "explanation": "卡片孔位按行控制經線，換序列能換樣式。"
          }
        ]
      },
      {
        "id": "practice-14",
        "unit": "programmable",
        "page": 54,
        "concept": "algorithm",
        "level": "判讀",
        "prompt": "An instruction chooses which code to execute next by testing a computed value. What is this?",
        "options": [
          {
            "label": "A conditional branch",
            "correct": true,
            "explanation": "下一個步驟取決於條件是否成立。"
          },
          {
            "label": "Data compression",
            "correct": false,
            "explanation": "下一個步驟取決於條件是否成立。"
          },
          {
            "label": "Sampling",
            "correct": false,
            "explanation": "下一個步驟取決於條件是否成立。"
          },
          {
            "label": "An output format",
            "correct": false,
            "explanation": "下一個步驟取決於條件是否成立。"
          }
        ]
      },
      {
        "id": "practice-15",
        "unit": "programmable",
        "page": 57,
        "concept": "punched-cards",
        "level": "比較",
        "prompt": "What information did Hollerith's punched cards primarily carry for the census?",
        "options": [
          {
            "label": "The physical wiring of the counters",
            "correct": false,
            "explanation": "讀卡器依固定欄位解碼，再增加對應的計數。"
          },
          {
            "label": "The CPU's program counter",
            "correct": false,
            "explanation": "讀卡器依固定欄位解碼，再增加對應的計數。"
          },
          {
            "label": "A gate's carry output",
            "correct": false,
            "explanation": "讀卡器依固定欄位解碼，再增加對應的計數。"
          },
          {
            "label": "Observations to classify and count",
            "correct": true,
            "explanation": "讀卡器依固定欄位解碼，再增加對應的計數。"
          }
        ]
      },
      {
        "id": "practice-16",
        "unit": "stored",
        "page": 79,
        "concept": "stored-program",
        "level": "比較",
        "prompt": "What distinguishes reconfiguring ENIAC by rewiring from loading a stored program?",
        "options": [
          {
            "label": "Whether the machine can represent numbers",
            "correct": false,
            "explanation": "更改記憶體裡的指令讓更換工作更容易。"
          },
          {
            "label": "Whether the machine can add",
            "correct": false,
            "explanation": "更改記憶體裡的指令讓更換工作更容易。"
          },
          {
            "label": "Changing physical connections versus changing instructions in memory",
            "correct": true,
            "explanation": "更改記憶體裡的指令讓更換工作更容易。"
          },
          {
            "label": "Whether the machine must use a network",
            "correct": false,
            "explanation": "更改記憶體裡的指令讓更換工作更容易。"
          }
        ]
      },
      {
        "id": "practice-17",
        "unit": "stored",
        "page": 82,
        "concept": "stored-program",
        "level": "應用",
        "prompt": "What determines how the CPU interprets the bit pattern 10100011 in memory?",
        "options": [
          {
            "label": "How many zeros it contains",
            "correct": false,
            "explanation": "位元本身可作資料或指令，取用及解碼決定角色。"
          },
          {
            "label": "How it is accessed and which encoding rules apply",
            "correct": true,
            "explanation": "位元本身可作資料或指令，取用及解碼決定角色。"
          },
          {
            "label": "Whether it contains eight bits",
            "correct": false,
            "explanation": "位元本身可作資料或指令，取用及解碼決定角色。"
          },
          {
            "label": "Whether a human entered it manually",
            "correct": false,
            "explanation": "位元本身可作資料或指令，取用及解碼決定角色。"
          }
        ]
      },
      {
        "id": "practice-18",
        "unit": "stored",
        "page": 87,
        "concept": "hardware-history",
        "level": "觀念",
        "prompt": "What is a direct advantage of an integrated circuit?",
        "options": [
          {
            "label": "Many components can be interconnected on the same chip.",
            "correct": true,
            "explanation": "元件整合可減少外部接點和布線。"
          },
          {
            "label": "Every operation requires a mechanical switch.",
            "correct": false,
            "explanation": "元件整合可減少外部接點和布線。"
          },
          {
            "label": "Each component must be a vacuum tube.",
            "correct": false,
            "explanation": "元件整合可減少外部接點和布線。"
          },
          {
            "label": "Memory can hold only instructions.",
            "correct": false,
            "explanation": "元件整合可減少外部接點和布線。"
          }
        ]
      },
      {
        "id": "practice-19",
        "unit": "modern",
        "page": 93,
        "concept": "parallel-work",
        "level": "應用",
        "prompt": "A task is split among four processors, but all four routinely wait for data. What cost should you investigate?",
        "options": [
          {
            "label": "The length of each file name",
            "correct": false,
            "explanation": "資料交換可能是限制整體速度的瓶頸。"
          },
          {
            "label": "The color of each processing unit",
            "correct": false,
            "explanation": "資料交換可能是限制整體速度的瓶頸。"
          },
          {
            "label": "An imbalance in the counts of zeros and ones",
            "correct": false,
            "explanation": "資料交換可能是限制整體速度的瓶頸。"
          },
          {
            "label": "Communication and synchronization between processors",
            "correct": true,
            "explanation": "資料交換可能是限制整體速度的瓶頸。"
          }
        ]
      },
      {
        "id": "practice-20",
        "unit": "modern",
        "page": 96,
        "concept": "parallel-work",
        "level": "比較",
        "prompt": "How are the Internet and the Web related?",
        "options": [
          {
            "label": "The Internet is used only to display web pages.",
            "correct": false,
            "explanation": "網際網路連結網路，Web 使用它交換資源。"
          },
          {
            "label": "Web pages can transfer only text.",
            "correct": false,
            "explanation": "網際網路連結網路，Web 使用它交換資源。"
          },
          {
            "label": "The Web is one service built on the Internet.",
            "correct": true,
            "explanation": "網際網路連結網路，Web 使用它交換資源。"
          },
          {
            "label": "They are the same physical connector.",
            "correct": false,
            "explanation": "網際網路連結網路，Web 使用它交換資源。"
          }
        ]
      },
      {
        "id": "practice-21",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "計算",
        "prompt": "Starting with (252, 105), Euclid's algorithm replaces (a, b) with (b, a mod b). Which pair ends the loop?",
        "options": [
          {
            "label": "(42, 0)",
            "correct": false,
            "explanation": "正確判斷是「(21, 0)」。252＝2×105＋42；105＝2×42＋21；42＝2×21，因此回傳 21。"
          },
          {
            "label": "(21, 0)",
            "correct": true,
            "explanation": "252＝2×105＋42；105＝2×42＋21；42＝2×21，因此回傳 21。"
          },
          {
            "label": "(0, 21)",
            "correct": false,
            "explanation": "正確判斷是「(21, 0)」。252＝2×105＋42；105＝2×42＋21；42＝2×21，因此回傳 21。"
          },
          {
            "label": "(42, 21)",
            "correct": false,
            "explanation": "正確判斷是「(21, 0)」。252＝2×105＋42；105＝2×42＋21；42＝2×21，因此回傳 21。"
          }
        ]
      },
      {
        "id": "practice-22",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "判讀",
        "prompt": "A student claims gcd(84, 30) = gcd(84, 24) because 84 mod 30 = 24. Which correction is valid?",
        "options": [
          {
            "label": "Keep the old divisor: gcd(84, 30) = gcd(30, 24).",
            "correct": true,
            "explanation": "保留的是原除數和餘數。這例 gcd(84,24)=12，比原答案 6 大。"
          },
          {
            "label": "Keep the quotient: gcd(84, 30) = gcd(2, 24).",
            "correct": false,
            "explanation": "正確判斷是「Keep the old divisor: gcd(84, 30) = gcd(30, 24).」。保留的是原除數和餘數。這例 gcd(84,24)=12，比原答案 6 大。"
          },
          {
            "label": "Use 24 as the answer because it is nonzero.",
            "correct": false,
            "explanation": "正確判斷是「Keep the old divisor: gcd(84, 30) = gcd(30, 24).」。保留的是原除數和餘數。這例 gcd(84,24)=12，比原答案 6 大。"
          },
          {
            "label": "Replace both inputs with 24.",
            "correct": false,
            "explanation": "正確判斷是「Keep the old divisor: gcd(84, 30) = gcd(30, 24).」。保留的是原除數和餘數。這例 gcd(84,24)=12，比原答案 6 大。"
          }
        ]
      },
      {
        "id": "practice-23",
        "unit": "euclid",
        "page": 30,
        "concept": "gcd",
        "level": "應用",
        "prompt": "Why does Euclid's update always preserve the set of common divisors?",
        "options": [
          {
            "label": "The remainder has the same prime factors as a.",
            "correct": false,
            "explanation": "正確判斷是「A number dividing b divides a if and only if it divides a − qb.」。a 和 r=a−qb 相差 b 的倍數，所以兩組的公因數集合完全相同。"
          },
          {
            "label": "The quotient is a common divisor of a and b.",
            "correct": false,
            "explanation": "正確判斷是「A number dividing b divides a if and only if it divides a − qb.」。a 和 r=a−qb 相差 b 的倍數，所以兩組的公因數集合完全相同。"
          },
          {
            "label": "Each iteration halves both operands exactly.",
            "correct": false,
            "explanation": "正確判斷是「A number dividing b divides a if and only if it divides a − qb.」。a 和 r=a−qb 相差 b 的倍數，所以兩組的公因數集合完全相同。"
          },
          {
            "label": "A number dividing b divides a if and only if it divides a − qb.",
            "correct": true,
            "explanation": "a 和 r=a−qb 相差 b 的倍數，所以兩組的公因數集合完全相同。"
          }
        ]
      },
      {
        "id": "practice-24",
        "unit": "foundations",
        "page": 15,
        "concept": "algorithm",
        "level": "分析",
        "prompt": "To find the maximum of n distinct unsorted values with one scan, what is the exact number of comparisons after initializing from the first value?",
        "options": [
          {
            "label": "n",
            "correct": false,
            "explanation": "正確判斷是「n − 1」。第一個作為目前最大值，其餘每項各比較一次。"
          },
          {
            "label": "log₂ n",
            "correct": false,
            "explanation": "正確判斷是「n − 1」。第一個作為目前最大值，其餘每項各比較一次。"
          },
          {
            "label": "n − 1",
            "correct": true,
            "explanation": "第一個作為目前最大值，其餘每項各比較一次。"
          },
          {
            "label": "n(n − 1)/2",
            "correct": false,
            "explanation": "正確判斷是「n − 1」。第一個作為目前最大值，其餘每項各比較一次。"
          }
        ]
      },
      {
        "id": "practice-25",
        "unit": "foundations",
        "page": 15,
        "concept": "algorithm",
        "level": "分析",
        "prompt": "An ascending array is read once to answer a maximum query. A second unsorted array is read to answer the same query. Which pair can be justified without preprocessing?",
        "options": [
          {
            "label": "Use the last element for both.",
            "correct": false,
            "explanation": "正確判斷是「Use the last element of the ascending array; scan the unsorted array.」。已排序時最後一格就是最大；無序時未檢查的值可能更大。"
          },
          {
            "label": "Use the last element of the ascending array; scan the unsorted array.",
            "correct": true,
            "explanation": "已排序時最後一格就是最大；無序時未檢查的值可能更大。"
          },
          {
            "label": "Run binary search for the maximum in the unsorted array.",
            "correct": false,
            "explanation": "正確判斷是「Use the last element of the ascending array; scan the unsorted array.」。已排序時最後一格就是最大；無序時未檢查的值可能更大。"
          },
          {
            "label": "Sort both arrays before any query.",
            "correct": false,
            "explanation": "正確判斷是「Use the last element of the ascending array; scan the unsorted array.」。已排序時最後一格就是最大；無序時未檢查的值可能更大。"
          }
        ]
      },
      {
        "id": "practice-26",
        "unit": "foundations",
        "page": 24,
        "concept": "algorithm",
        "level": "應用",
        "prompt": "A maximum routine starts with best = 0 and replaces best only when it reads a larger element. Which test exposes a bug if nonempty signed inputs are allowed?",
        "options": [
          {
            "label": "[−9, −2, −5]",
            "correct": true,
            "explanation": "每個元素都比 0 小，程式錯回 0。可以第一個元素初始化。"
          },
          {
            "label": "[4, 1, 3]",
            "correct": false,
            "explanation": "正確判斷是「[−9, −2, −5]」。每個元素都比 0 小，程式錯回 0。可以第一個元素初始化。"
          },
          {
            "label": "[0]",
            "correct": false,
            "explanation": "正確判斷是「[−9, −2, −5]」。每個元素都比 0 小，程式錯回 0。可以第一個元素初始化。"
          },
          {
            "label": "[−6, 0, −2]",
            "correct": false,
            "explanation": "正確判斷是「[−9, −2, −5]」。每個元素都比 0 小，程式錯回 0。可以第一個元素初始化。"
          }
        ]
      },
      {
        "id": "practice-27",
        "unit": "foundations",
        "page": 19,
        "concept": "abstraction",
        "level": "分析",
        "prompt": "A storage API promises exact byte-for-byte recovery. Which internal change preserves that abstraction?",
        "options": [
          {
            "label": "Downsample every stored image before compression.",
            "correct": false,
            "explanation": "正確判斷是「Compress losslessly before saving, and decompress transparently on reading.」。讀回相同位元組即可保有介面承諾。"
          },
          {
            "label": "Round all numbers to two decimal places.",
            "correct": false,
            "explanation": "正確判斷是「Compress losslessly before saving, and decompress transparently on reading.」。讀回相同位元組即可保有介面承諾。"
          },
          {
            "label": "Require callers to read compressed bytes instead of original bytes.",
            "correct": false,
            "explanation": "正確判斷是「Compress losslessly before saving, and decompress transparently on reading.」。讀回相同位元組即可保有介面承諾。"
          },
          {
            "label": "Compress losslessly before saving, and decompress transparently on reading.",
            "correct": true,
            "explanation": "讀回相同位元組即可保有介面承諾。"
          }
        ]
      },
      {
        "id": "practice-28",
        "unit": "programmable",
        "page": 54,
        "concept": "algorithm",
        "level": "應用",
        "prompt": "A routine subtracts the smaller positive integer from the larger until they are equal. Why does the loop terminate for positive integers?",
        "options": [
          {
            "label": "The larger value always becomes zero on the next step.",
            "correct": false,
            "explanation": "正確判斷是「Before equality, a positive subtraction strictly reduces the sum of the two numbers.」。兩數一直保持為正，不相等時總和嚴格下降，因此不會無限執行。"
          },
          {
            "label": "Both values stay unchanged except on the final step.",
            "correct": false,
            "explanation": "正確判斷是「Before equality, a positive subtraction strictly reduces the sum of the two numbers.」。兩數一直保持為正，不相等時總和嚴格下降，因此不會無限執行。"
          },
          {
            "label": "Before equality, a positive subtraction strictly reduces the sum of the two numbers.",
            "correct": true,
            "explanation": "兩數一直保持為正，不相等時總和嚴格下降，因此不會無限執行。"
          },
          {
            "label": "An equality test alone guarantees termination.",
            "correct": false,
            "explanation": "正確判斷是「Before equality, a positive subtraction strictly reduces the sum of the two numbers.」。兩數一直保持為正，不相等時總和嚴格下降，因此不會無限執行。"
          }
        ]
      },
      {
        "id": "practice-29",
        "unit": "stored",
        "page": 81,
        "concept": "stored-program",
        "level": "分析",
        "prompt": "Two identical CPUs run different programs on the same input. What can account for the difference while using the same hardware design?",
        "options": [
          {
            "label": "The CPUs must use different physical wiring.",
            "correct": false,
            "explanation": "正確判斷是「Different instruction bit patterns are fetched from their memories.」。指令存在可載入的記憶體；相同處理器可按不同位元串採取不同動作。"
          },
          {
            "label": "Different instruction bit patterns are fetched from their memories.",
            "correct": true,
            "explanation": "指令存在可載入的記憶體；相同處理器可按不同位元串採取不同動作。"
          },
          {
            "label": "The input bits must have been changed by the user.",
            "correct": false,
            "explanation": "正確判斷是「Different instruction bit patterns are fetched from their memories.」。指令存在可載入的記憶體；相同處理器可按不同位元串採取不同動作。"
          },
          {
            "label": "The CPUs must use different instruction sets.",
            "correct": false,
            "explanation": "正確判斷是「Different instruction bit patterns are fetched from their memories.」。指令存在可載入的記憶體；相同處理器可按不同位元串採取不同動作。"
          }
        ]
      },
      {
        "id": "practice-30",
        "unit": "stored",
        "page": 82,
        "concept": "stored-program",
        "level": "判讀",
        "prompt": "A byte copied from one address into another is later fetched as part of an instruction. Which statement is justified?",
        "options": [
          {
            "label": "The same bits may be fetched as code in one context and accessed as data in another.",
            "correct": true,
            "explanation": "資料的角色由取用方式和編碼決定。"
          },
          {
            "label": "A byte has a built-in tag permanently identifying it as code.",
            "correct": false,
            "explanation": "正確判斷是「The same bits may be fetched as code in one context and accessed as data in another.」。資料的角色由取用方式和編碼決定。"
          },
          {
            "label": "Any code byte must have been produced in a different kind of memory.",
            "correct": false,
            "explanation": "正確判斷是「The same bits may be fetched as code in one context and accessed as data in another.」。資料的角色由取用方式和編碼決定。"
          },
          {
            "label": "Fetching a byte changes its bit pattern into an opcode automatically.",
            "correct": false,
            "explanation": "正確判斷是「The same bits may be fetched as code in one context and accessed as data in another.」。資料的角色由取用方式和編碼決定。"
          }
        ]
      },
      {
        "id": "practice-31",
        "unit": "modern",
        "page": 93,
        "concept": "parallel-work",
        "level": "分析",
        "prompt": "A task has a 20-second serial phase and an 80-second phase that divides evenly across four processors. With no other costs, what is the speedup?",
        "options": [
          {
            "label": "4×",
            "correct": false,
            "explanation": "正確判斷是「2.5×」。原本 100 秒，平行後 20＋80/4＝40 秒，故 100/40＝2.5。"
          },
          {
            "label": "5×",
            "correct": false,
            "explanation": "正確判斷是「2.5×」。原本 100 秒，平行後 20＋80/4＝40 秒，故 100/40＝2.5。"
          },
          {
            "label": "2×",
            "correct": false,
            "explanation": "正確判斷是「2.5×」。原本 100 秒，平行後 20＋80/4＝40 秒，故 100/40＝2.5。"
          },
          {
            "label": "2.5×",
            "correct": true,
            "explanation": "原本 100 秒，平行後 20＋80/4＝40 秒，故 100/40＝2.5。"
          }
        ]
      },
      {
        "id": "practice-32",
        "unit": "foundations",
        "page": 24,
        "concept": "algorithm",
        "level": "除錯",
        "prompt": "A maximum-finding loop starts at best = 0. Which input exposes the bug?",
        "options": [
          {
            "label": "[-4, 1, -2]",
            "correct": false,
            "explanation": "正確判斷是「[-4, -9, -2]」。這三項都小於零，以零初始化會回傳不在陣列中的 0。"
          },
          {
            "label": "[0]",
            "correct": false,
            "explanation": "正確判斷是「[-4, -9, -2]」。這三項都小於零，以零初始化會回傳不在陣列中的 0。"
          },
          {
            "label": "[-4, -9, -2]",
            "correct": true,
            "explanation": "這三項都小於零，以零初始化會回傳不在陣列中的 0。"
          },
          {
            "label": "[3, 1, 2]",
            "correct": false,
            "explanation": "正確判斷是「[-4, -9, -2]」。這三項都小於零，以零初始化會回傳不在陣列中的 0。"
          }
        ]
      },
      {
        "id": "practice-33",
        "unit": "foundations",
        "page": 24,
        "concept": "algorithm",
        "level": "判讀",
        "prompt": "What should remain true after scanning the first k entries?",
        "options": [
          {
            "label": "The current best is the last entry read.",
            "correct": false,
            "explanation": "正確判斷是「The current best is the maximum of those k entries.」。每輪比較新的一項即可更新目前最大值。"
          },
          {
            "label": "The current best is the maximum of those k entries.",
            "correct": true,
            "explanation": "每輪比較新的一項即可更新目前最大值。"
          },
          {
            "label": "The current best is always nonnegative.",
            "correct": false,
            "explanation": "正確判斷是「The current best is the maximum of those k entries.」。每輪比較新的一項即可更新目前最大值。"
          },
          {
            "label": "The current best is the sum of those entries.",
            "correct": false,
            "explanation": "正確判斷是「The current best is the maximum of those k entries.」。每輪比較新的一項即可更新目前最大值。"
          }
        ]
      }
    ],
    "exam": [
      {
        "title": "Trace Euclid's algorithm",
        "setup": "Start with a = 391 and b = 153. At each iteration, replace (a,b) by (b,a mod b).",
        "pages": [
          30
        ],
        "parts": [
          {
            "points": 20,
            "prompt": "Give the greatest common divisor. Show each quotient and remainder, including the stopping step.",
            "fields": [
              {
                "id": "answer",
                "label": "GCD",
                "format": "integer",
                "answer": 17,
                "points": 5
              }
            ],
            "model": "391＝2×153＋85，153＝1×85＋68，85＝1×68＋17，68＝4×17＋0。最後一個非零餘數是 17。",
            "trap": "停止時回傳當時的除數。",
            "criteria": [
              [
                8,
                "列出前兩輪的商與餘數"
              ],
              [
                7,
                "列出最後兩輪；說明餘數為 0 時回傳 17"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain why a step works",
        "setup": "Let a = qb + r for positive integers a and b, with 0 ≤ r < b.",
        "pages": [
          29,
          30
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Prove in both directions that (a,b) and (b,r) have exactly the same common divisors. Explain why the loop terminates.",
            "model": "若 d 同時整除 a、b，就整除 r＝a−qb；若 d 同時整除 b、r，就整除 a＝qb＋r。每輪第二個值嚴格下降，而且不會小於 0，因此終止。",
            "trap": "只用一次數值例無法證明規則對所有合法輸入成立。",
            "criteria": [
              [
                5,
                "從 d 整除 a、b 推到 d 整除 r"
              ],
              [
                5,
                "從 d 整除 b、r 推到 d 整除 a"
              ],
              [
                5,
                "用非負整數嚴格下降說明終止"
              ]
            ]
          }
        ]
      },
      {
        "title": "Choose a strategy for maximum queries",
        "setup": "An array contains 4096 signed integers. The array is unsorted, and there will be exactly one maximum query.",
        "pages": [
          14,
          15,
          24
        ],
        "parts": [
          {
            "points": 20,
            "prompt": "Give the exact comparison count for a one-pass scan initialized from the first item. Explain why initializing to zero fails and what you would do for repeated maximum queries on an unchanged array.",
            "fields": [
              {
                "id": "answer",
                "label": "Number of comparisons",
                "format": "integer",
                "answer": 4095,
                "points": 5
              }
            ],
            "model": "比較剩下 4095 個項目。全為負數時以 0 初始化會回傳不存在的 0。資料不變時可保留第一輪找出的最大值，後續直接讀取。",
            "trap": "重複查詢最大值不需要為整個陣列排序。",
            "criteria": [
              [
                8,
                "說明比較次數或每步不變量"
              ],
              [
                7,
                "舉全負輸入；說明重複查詢可快取已求得的最大值"
              ]
            ]
          }
        ]
      },
      {
        "title": "Specify an abstraction",
        "setup": "A photo archive promises that reading a saved image returns the original bytes. A team wants to save space.",
        "pages": [
          19,
          21,
          22
        ],
        "parts": [
          {
            "points": 15,
            "prompt": "Explain which interface properties must stay the same, give an internal change that preserves the contract, and show why downsampling would violate it.",
            "model": "呼叫者可用原儲存、讀取介面，且讀回逐位元組相同。可在內部無損壓縮再解壓。降取樣捨棄像素資訊，無法保證原位元組可還原。",
            "trap": "外觀相似與逐位元組相同是兩種不同要求。",
            "criteria": [
              [
                5,
                "說出讀寫介面與逐位還原約定"
              ],
              [
                5,
                "解釋無損壓縮加解壓如何遵守"
              ],
              [
                5,
                "說明降取樣丟失哪些資訊"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain the stored-program concept",
        "setup": "A laboratory wants an existing computer to switch from computing a sum to finding a maximum.",
        "pages": [
          77,
          81,
          82,
          83
        ],
        "parts": [
          {
            "points": 20,
            "prompt": "Contrast how a configurable wiring-based machine and a stored-program machine change tasks. Explain how the CPU knows where to fetch the new instructions.",
            "model": "接線式機器可能要改接線與開關。儲存程式機器可用新的位元指令序列取代或另外載入，並令 PC 指向起始位址，CPU 再逐條取指。記憶體亦可存資料。",
            "trap": "「可以存檔」不足以解釋 CPU 如何從記憶體執行程式。",
            "criteria": [
              [
                7,
                "辨認接線或開關如何影響舊機器"
              ],
              [
                7,
                "說出指令與資料可存在記憶體"
              ],
              [
                6,
                "說明 PC 和取指，連結到換工作的操作"
              ]
            ]
          }
        ]
      },
      {
        "title": "Explain two hardware transitions",
        "setup": "A museum compares a room-sized electronic computer with a single-chip CPU, then shows a multi-accelerator computer.",
        "pages": [
          85,
          87,
          88,
          93
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Explain one benefit of transistor/IC integration, describe what a microprocessor integrates, and explain why adding accelerators can give less than proportional speedup.",
            "model": "電晶體與 IC 整合可減少空間和外部連線。微處理器把 CPU 的主要功能放進積體電路。無法平行的部分及傳輸和同步成本仍會限制速度。",
            "trap": "不同硬體的性能要按要做的工作比較。",
            "criteria": [
              [
                4,
                "舉電子元件整合帶來的明確好處"
              ],
              [
                3,
                "指出微處理器整合的是 CPU 的主要功能"
              ],
              [
                3,
                "以序列工作或通訊成本解釋非線性加速"
              ]
            ]
          }
        ]
      },
      {
        "title": "Trace a different GCD algorithm",
        "setup": "Start with two positive integers (126, 45). Repeatedly subtract the smaller number from the larger. Stop when both are equal.",
        "bonus": true,
        "pages": [
          14,
          24,
          30
        ],
        "parts": [
          {
            "points": 10,
            "prompt": "Enter the number of subtractions performed. Show the sequence of pairs and explain why each subtraction preserves the GCD.",
            "fields": [
              {
                "id": "answer",
                "label": "Number of subtractions",
                "format": "integer",
                "answer": 6,
                "points": 5
              }
            ],
            "model": "依序 (81,45)、(36,45)、(36,9)、(27,9)、(18,9)、(9,9)，共 6 次。公因數能整除兩數的差，反過來也能整除兩數的和。",
            "trap": "相等就停，不再減到零。",
            "criteria": [
              [
                3,
                "列出所有變化並停在相等"
              ],
              [
                2,
                "說明差與原來兩值的公因數關係"
              ]
            ]
          }
        ]
      }
    ],
    "legacyExam": [
      {
        "title": "追蹤歐幾里得法",
        "pages": [
          30
        ],
        "setup": "用 84 和 30 作為輸入。",
        "parts": [
          {
            "points": 5,
            "prompt": "求最大公因數，並列每輪的新數對。",
            "model": "84＝2×30＋24，30＝1×24＋6，24＝4×6＋0，所以答案為 6。",
            "trap": "最後一個除數才是答案。",
            "fields": [
              {
                "id": "answer",
                "label": "答案",
                "format": "integer",
                "answer": 6,
                "points": 2
              }
            ],
            "criteria": [
              [
                3,
                "寫出 (30,24)、(24,6)、(6,0) 及停在餘數 0。"
              ]
            ]
          }
        ]
      },
      {
        "title": "說明儲存程式",
        "pages": [
          82
        ],
        "setup": "比較實體接線的計算機與指令位於主記憶體的計算機。",
        "parts": [
          {
            "points": 5,
            "prompt": "舉例解釋第二種如何改做另一件事，以及 CPU 如何取得指令。",
            "model": "把另一份指令序列載入記憶體，再讓 PC 指向開始位址；CPU 依該位址取出指令並解碼。",
            "trap": "換程式時既有的運算硬體仍可使用。",
            "criteria": [
              [
                5,
                "提到更換記憶體中指令、CPU 依位置取指，以及和實體重接線的差別。"
              ]
            ]
          }
        ]
      }
    ],
    "terms": [
      [
        "Algorithm",
        {
          "english": "Algorithm",
          "chinese": "演算法",
          "explanation": "可執行並完成任務的一組明確步驟。"
        }
      ],
      [
        "Program",
        {
          "english": "Program",
          "chinese": "程式",
          "explanation": "以語言或機器指令表達運算與控制。"
        }
      ],
      [
        "Termination",
        {
          "english": "Termination",
          "chinese": "終止",
          "explanation": "在有限步內停止並回傳結果。"
        }
      ],
      [
        "Abstraction",
        {
          "english": "Abstraction",
          "chinese": "抽象",
          "explanation": "透過介面保留必要資訊並隱藏實作細節。"
        }
      ],
      [
        "Digitization",
        {
          "english": "Digitization",
          "chinese": "數位化",
          "explanation": "把資訊用離散符號表示。"
        }
      ],
      [
        "Greatest Common Divisor",
        {
          "english": "Greatest Common Divisor",
          "chinese": "最大公因數",
          "explanation": "同時整除兩數的最大正整數。"
        }
      ],
      [
        "Euclidean Algorithm",
        {
          "english": "Euclidean Algorithm",
          "chinese": "歐幾里得演算法",
          "explanation": "反覆以除數與餘數替換目前兩數，求最大公因數。"
        }
      ],
      [
        "Punched Card",
        {
          "english": "Punched Card",
          "chinese": "打孔卡",
          "explanation": "以孔的位置編碼資料或控制指示。"
        }
      ],
      [
        "Stored-Program Concept",
        {
          "english": "Stored-Program Concept",
          "chinese": "儲存程式概念",
          "explanation": "將指令編碼後與資料一樣放入記憶體。"
        }
      ],
      [
        "Transistor",
        {
          "english": "Transistor",
          "chinese": "電晶體",
          "explanation": "可用電訊號控制導通的半導體元件。"
        }
      ],
      [
        "Integrated Circuit",
        {
          "english": "Integrated Circuit",
          "chinese": "積體電路",
          "explanation": "在單一晶片上結合多個電子元件。"
        }
      ],
      [
        "Microprocessor",
        {
          "english": "Microprocessor",
          "chinese": "微處理器",
          "explanation": "在單片積體電路上實現主要 CPU 功能的處理器。"
        }
      ],
      [
        "Parallel Computing",
        {
          "english": "Parallel Computing",
          "chinese": "平行運算",
          "explanation": "同時間用多個運算單元處理工作。"
        }
      ],
      [
        "Input",
        {
          "english": "Input",
          "chinese": "輸入",
          "explanation": "演算法開始時取得的資料。"
        }
      ],
      [
        "Output",
        {
          "english": "Output",
          "chinese": "輸出",
          "explanation": "演算法結束時回傳的結果。"
        }
      ],
      [
        "Conditional Branch",
        {
          "english": "Conditional Branch",
          "chinese": "條件分支",
          "explanation": "依條件真假選擇下一步。"
        }
      ],
      [
        "Loop",
        {
          "english": "Loop",
          "chinese": "迴圈",
          "explanation": "依條件重複一段步驟。"
        }
      ],
      [
        "Termination Condition",
        {
          "english": "Termination Condition",
          "chinese": "終止條件",
          "explanation": "決定何時停止重複的條件。"
        }
      ],
      [
        "Loop Invariant",
        {
          "english": "Loop Invariant",
          "chinese": "迴圈不變量",
          "explanation": "每次走到同一迴圈位置都成立的敘述。"
        }
      ],
      [
        "Boundary Case",
        {
          "english": "Boundary Case",
          "chinese": "邊界案例",
          "explanation": "位在合法輸入範圍邊界的測試。"
        }
      ],
      [
        "ENIAC",
        {
          "english": "ENIAC",
          "chinese": "電子數值積分計算機",
          "explanation": "早期採真空管的通用電子計算機。"
        }
      ],
      [
        "Jacquard Loom",
        {
          "english": "Jacquard Loom",
          "chinese": "賈卡織機",
          "explanation": "以打孔卡選擇經線的織機。"
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
      99
    ]
  };
  course.terms = new Map(course.terms);
  course.figurePages = new Set(course.figurePages);
  StudySite.registerCourse(course);
})();
