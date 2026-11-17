"use strict";

(() => {
const units = [
  ["foundations",1,11,"演算法的概念","可執行的指令、終止性、基本操作與抽象資料型態"],
  ["pseudocode",12,17,"寫出演算法","指派、條件、迴圈、函式與參數"],
  ["discovery",18,23,"從問題找解法","波利亞四步驟、倒推與年齡問題"],
  ["iteration",24,32,"迭代與插入排序","循序搜尋、前測與後測、逐步擴張排序區"],
  ["recursion",33,40,"遞迴與二元搜尋","縮小搜尋範圍、追蹤呼叫與停止條件"],
  ["graphs",41,51,"生成樹與迷宮","最小生成樹、Kruskal、Prim、隨機迷宮"],
  ["efficiency",52,60,"如何比較效率","時間、空間、輸入規模與最壞情況"],
  ["analysis",61,81,"操作計數與成長率","前綴平均、Big-O、Θ 與搜尋排序成本"],
  ["correctness",82,91,"正確性與迴圈不變量","敘述條件、解題驗證、掃描最大值證明"]
].map(([id,start,end,title,description]) => ({id,start,end,title,description}));

const coreTerms = {
  "Algorithm": ["演算法","為達成目標而設計的有序步驟。每一步的行為必須明確、可執行，並在適用輸入上完成。"],
  "Termination": ["終止性","對所有符合前置條件的輸入，有限步內停止。常用一個每步變小且有下界的量來解釋。"],
  "Primitive": ["基本操作","在目前使用的模型中，可直接執行且意義已定義的操作，例如讀取陣列元素。"],
  "Abstract data type": ["抽象資料型態","規定一組值與可用操作的行為，使用者只需要知道介面。"],
  "Pseudocode": ["虛擬碼","用結構化文字交代流程、狀態更新與終止條件的演算法表示法。"],
  "Assignment": ["指派","先算出右側，再更新左側變數。x ← x + 1 會用原來的 x 算出新值。"],
  "Conditional selection": ["條件選擇","依條件真假決定執行哪一段程式。縮排或括號決定每段的作用範圍。"],
  "Function": ["函式","把可重用的操作命名。定義安排函式的內容，呼叫才執行內容。"],
  "Parameter": ["參數","函式定義中接收輸入的名稱。每次呼叫可傳入不同實際資料。"],
  "Iteration": ["迭代","反覆執行同一段流程，每輪可更新狀態並依條件決定何時停止。"],
  "Sequential search": ["循序搜尋","按順序檢查項目。升冪資料遇到比目標大的值時，可以提早確定找不到。"],
  "Pretest loop": ["前測式迴圈","先檢查條件，再決定是否進入本輪，因此可能執行零次。"],
  "Posttest loop": ["後測式迴圈","先執行本輪，再檢查條件，因此至少執行一次。"],
  "Insertion sort": ["插入排序","逐一取出下一項，把排好區間內較大的項目右移，再把取出的值放進空位。"],
  "Stability": ["排序穩定性","具有相同排序鍵的項目，在排序後保留原本的相對順序。"],
  "Recursion": ["遞迴","函式呼叫自身以解決較小的同類問題，並把結果傳回上層。"],
  "Activation": ["函式呼叫實例","每次呼叫都有自己的參數、區域狀態與返回位置。遞迴時上層可能暫停等待下層。"],
  "Base case": ["基底情況","可直接給出答案而不必再呼叫的輸入情況，例如找不到任何候選項目的空區間。"],
  "Binary search": ["二元搜尋","在有序資料中比較中點，依結果保留其中一半，直到命中或候選區間為空。"],
  "Search interval": ["搜尋區間","仍可能含有目標的索引範圍。使用閉區間或半開區間會改變縮界與停止寫法。"],
  "Graph": ["圖","由頂點和連接頂點的邊組成。加權圖的邊另有距離或代價等數值。"],
  "Spanning tree": ["生成樹","連通同一張圖的所有頂點且無環的子圖。V 個頂點的生成樹有 V−1 條邊。"],
  "Minimum spanning tree": ["最小生成樹","連通無向加權圖中，總邊權重最小的生成樹，可用 Kruskal 或 Prim 找到。"],
  "Kruskal's algorithm": ["Kruskal 演算法","把全圖的邊依權重排序，再依序接納連接兩個不同成分的邊。"],
  "Prim's algorithm": ["Prim 演算法","從任一頂點開始，每輪挑一條最便宜的跨界邊，將樹外的一個頂點納入。"],
  "Cycle": ["環","從同一點出發並回到它的一圈封閉路徑。生成樹內的任兩點只需要一條路徑。"],
  "Disjoint set union": ["並查集","維護互斥的集合，能查元素所屬成分並合併集合。可快速判斷加邊前兩端是否已連通。"],
  "Frontier": ["邊界候選","已納入區域外側，仍可透過一步接到已納入區域的候選頂點或格子。"],
  "Perfect maze": ["完美迷宮","格子互通，且任兩格之間恰好有一條簡單路徑。通道結構對應一棵生成樹。"],
  "Time complexity": ["時間複雜度","描述輸入規模增大時，演算法所需工作量如何成長。"],
  "Space complexity": ["空間複雜度","描述輸入規模增大時，所需儲存空間如何成長。要交代是否只計額外空間。"],
  "Worst case": ["最壞情況","在相同規模的合法輸入中，需要最多成本的情況。"],
  "Prefix average": ["前綴平均","第 i 項是輸入從第一項到第 i 項的平均。累加和可以沿用到下一個位置。"],
  "Asymptotic analysis": ["漸近分析","分析規模夠大時的成長率，忽略固定乘數與不主導成長的低階項。"],
  "Big O": ["大 O 上界","對夠大的 n，成本不超過某個固定倍數的 g(n)。上界可以比實際成長寬鬆。"],
  "Big Theta": ["大 Θ 緊確界","成本在足夠大的 n 始終夾在 g(n) 的兩個正固定倍數間，因而是同階成長。"],
  "Fibonacci sequence": ["費波那契數列","以兩項作為起點，之後每項等於前兩項之和。本章採 F(0)=0、F(1)=1。"],
  "Correctness": ["正確性","對符合前置條件的任意輸入，演算法停止後確實得到滿足後置條件的結果。"],
  "Precondition": ["前置條件","執行之前必須成立的約定，例如掃描最大值前陣列至少要有一項。"],
  "Postcondition": ["後置條件","結束時保證成立的敘述，例如返回值等於陣列最大值。"],
  "Loop invariant": ["迴圈不變量","在每次回到指定迴圈位置時都成立的性質，用來把局部更新連接到最後的答案。"]
};
const terms = new Map(Object.entries(coreTerms).map(([english,[chinese,explanation]]) =>
  [english,{english,chinese,explanation}]));

const rows = `
從課程開始|Algorithm|本章對應課本的 Chapter 5。逐頁教學的 p. 編號依 PDF 的實際順序，可直接用「原投影片」互相對照。|第一次讀可從「插入排序 → 二元搜尋 → 最小生成樹」建立流程感，再回頭用複雜度和不變量解釋為什麼這些步驟有效。
演算法會得到什麼|Algorithm;Termination|先寫清楚起始資料、目標結果以及從輸入走到結果的動作。規則或限制漏寫，實作照做仍可能得到錯誤結果。|例如只說「找最大值」少了空陣列處理。先定義輸入至少有一個元素，才有辦法合法地用第一項當初始值。
章節路線|Algorithm;Pseudocode;Iteration;Recursion;Correctness|前半段從定義、表示和發現解法開始，接著用迭代和遞迴兩種結構練追蹤。|後半段要能分開回答兩種問題：答案在各種合法輸入上為什麼正確，以及輸入變大時需要多少資源。
先辨認輸入、步驟和輸出|Algorithm|讀舊例子時先圈出資料與結果，再找重複的動作。例如排序的輸入是一串值，輸出須仍含相同元素，且次序符合要求。|不同表示可以描述同樣的流程。用一組小輸入手動追蹤，能查出步驟有沒有漏掉邊界。
演算法的定義|Algorithm;Primitive;Termination|「有序」是指下一步有明確規則，允許條件分支和重複；「可執行」是每一步在當前模型做得到；「明確」是遇到同一狀態知道要做什麼。|檢查終止性時，問的是合法輸入能否在有限時間內完成。迴圈一路更新但永遠碰不到停止條件，仍會失敗。
演算法與表示方式|Algorithm;Pseudocode|同樣的找資料流程，可以用自然語言、流程圖、虛擬碼或 C++ 表達。換成另一種語法，輸入到輸出的規則可以完全相同。|像同一個故事可以出現在不同版本的書中。考題要描述方法時，先說清楚演算法，再選方便呈現的表示。
基本操作的字彙|Primitive;Algorithm|把步驟寫到執行者認得的尺度。例如「往右移一格」需要先約定方向、格子邊界和空格的意義。|分析時間時也會選定基本操作。讀陣列項、比較與指派可以各計一次，計數必須前後使用同一套規則。
摺紙的步驟順序|Algorithm;Primitive|每一步摺出來的形狀是下一個操作的起點。把兩步交換後，原本指定的角或摺線可能已經改變。|用狀態與動作描述：目前紙張的方向、選定的邊、摺的位置。操作過於模糊時，讀者無法重現結果。
摺紙的基本動作|Primitive;Pseudocode|先定義「往內摺」、「翻面」等可重用動作，再在較長流程中引用。操作的輸入應包含要處理的邊或角。|閱讀更抽象的程式指令時也一樣：SortedInsert 之類的名稱讓主流程好讀，仍要能解釋其中一項如何被插入。
資料型態與抽象資料型態|Abstract data type|描述一種資料時可分兩層：允許的值，以及對這些值可用的操作。ADT 把這些規則做成介面。|同一個介面可以有不同的內部儲存方式。例：堆疊對外都有 push、pop，用陣列或鏈結節點實作都可以。
以自然數設計操作|Abstract data type;Primitive|投影片用自然數展示 ADT。先定義合法值，再說明操作如何接收值、返回結果，以及何時有額外限制。|例如前一個自然數這類操作，要處理最小值的邊界。把邊界納入介面，比假設每個值都能做同一操作更清楚。
開始讀寫虛擬碼|Pseudocode|寫作順序可用「輸入 → 初始化 → 分支或迴圈 → 回傳」。關鍵是讀者能照做並預測狀態。|先聲明索引從 0 或 1 開始，特別是搜尋的中點和排序的插入位置。省略語法細節仍要保留索引界線。
指派與條件|Assignment;Conditional selection;Pseudocode|指派的右側會先依目前狀態求值，再覆蓋左側。判斷則只讀條件的真假，例如 x ← x+1 與 x = 1？的角色不同。|if 區塊只有在條件成立時執行。用一個條件為真、一個為假的輸入各追一次，就能檢查漏寫的情況。
重複執行和巢狀縮排|Iteration;Pretest loop;Conditional selection|while 每輪開始前重測條件。售票例中，每賣出一張票會減少可售張數，最後讓條件轉為假。|讀兩層 if 時要先判斷外層，再判斷內層。縮排相同的 else 跟同層的 if 配對，先把分支樹寫出來再追蹤。
函式的定義|Function;Pseudocode|定義先把一組步驟綁定到名稱。函式本體的第一行何時執行，由呼叫發生的位置決定。|題目若同時出現定義和呼叫，先標出呼叫位置，再按傳入的資料執行本體，回到呼叫端繼續。
Greetings 的三次迴圈|Function;Iteration;Assignment|Count 從 3 開始，每輪發出一次問候後減一。進入迴圈時看見的值依序是 3、2、1。|Count 歸零後，下一次條件檢查失敗，因此總共執行三次。手寫追蹤時把「檢查」和「更新後」分欄。
用參數重用流程|Function;Parameter|Sort(List) 中，List 是描述方法時用的參數。傳進不同的清單，同一組步驟會處理不同的資料。|寫答案時交代函式將排序結果傳回，或直接改動傳入的資料。兩種實作會讓呼叫後的狀態不同。
把解題當成設計問題|Algorithm;Correctness|先用小例子理解限制，再把一次成功的過程整理成每次都能重現的規則。只得出某組資料的答案，還需要抽出通用步驟。|想不到完整解法時，可以先固定一個條件、減少元素數量，觀察哪些判斷在規模變大後仍成立。
波利亞的四個解題步驟|Algorithm;Correctness|第一步讀懂問題，第二步構思方案，第三步執行，第四步回頭檢查並找可改進之處。|讀題時重述輸入、輸出和限制。回頭檢查至少能用普通情況與一個邊界情況試算。
把解題步驟套進程式|Algorithm;Precondition;Postcondition|把問題規格整理成前置條件與預期輸出。選定方法後，先用虛擬碼追一遍，再寫程式及測試。|找資料時，先問資料有沒有排好，才決定能不能用二元搜尋。這個條件會直接影響可以採取的每一步。
倒推與縮小問題|Algorithm;Recursion|從目標倒推，問「只差一步時長什麼樣」；或把輸入變小，找小問題的解怎麼擴成大問題。|插入排序就是從已有一段排序好的資料出發，每次解決「把一項加進排好區」的小問題。
年齡題有哪些限制|Algorithm;Precondition|由三個正整數年齡的乘積是 36，先列不排序重複的三元組。知道總和後還有歧義，代表那個總和至少對應兩組。|最後一句的資訊是存在唯一最大的孩子。會不會彈琴本身和年齡的數字無關。
把年齡題的候選排成表|Algorithm;Correctness|按年齡從小到大排列三元組並依總和分組。只有總和 13 重複，可能是 1、6、6 或 2、2、9。|第一組有兩個並列最年長，第二組有唯一的 9 歲孩子，符合最後線索。答案是 2、2、9 歲。
什麼時候適合迭代|Iteration;Sequential search;Insertion sort|將重複的流程拆為目前處理的位置、何時停止以及每輪怎麼前進。循序搜尋和插入排序都可用迴圈表達。|讀任何迴圈時，先圈出本輪會讀哪些值，再找迴圈控制變數何時改變。
評估方法的三個角度|Correctness;Time complexity;Space complexity|程式先要符合規格，再比較可讀性和資源成本。量實際秒數會受執行環境影響，計算工作量的成長則可以跨機器比較。|回答哪個方法快時，把輸入大小、資料特性與你比較的操作寫出來，讓結論可驗證。
有序清單的循序搜尋|Sequential search;Pretest loop|清單空時直接回報失敗。升冪清單從第一項開始，只在目標值仍大於目前值且還有下一項時繼續。|找 7 於 [2,4,9,12] 時，看見 9 即可停下。若清單無序，越過 7 的判斷失去依據。最壞仍須比較 n 個項目。
初始化、測試、更新|Iteration;Termination|迴圈控制有三部分：設定起始值、測試可否執行這一輪、讓狀態往停止條件移動。|若從 i=0 開始讀長度 n 的陣列，合法讀取時需滿足 i<n，每輪前進一格，抵達 i=n 時結束。
先檢查或先執行|Pretest loop;Posttest loop|前測式先檢查條件，初值不符合便執行零次。後測式先執行，第一次檢查發生在本體之後。|while(C) 在 C 為真時進入；repeat…until(C) 在 C 為真時停止。比較這兩種寫法時要說明測試位置及條件方向。
while 的流程圖|Pretest loop;Iteration|箭頭先進到判斷節點，真時走本體再回頭，假時直接離開。判斷通常比本體多執行一次。|若本體執行 3 次，含最後一次離開測試，共測試 4 次。初始條件為假時，只測 1 次。
repeat–until 的流程圖|Posttest loop;Iteration|箭頭先進本體，再檢查是否已達停止條件。若條件為假，就回到本體完成下一輪。|C++ 的 do–while(C) 是 C 為真就繼續。要寫等價的 repeat–until(C)，需要將 do–while 的條件取反。
插入排序的移動過程|Insertion sort;Stability;Loop invariant|從第二項開始，把目前 key 取出來，讓左側排好區中比 key 大的值逐個右移，直到出現可放入的空位。|用 Fred、Alex、Diana、Byron、Carol 追蹤：前三次插入後左側逐步成為 Alex/Fred、Alex/Diana/Fred、Alex/Byron/Diana/Fred。
插入排序的虛擬碼|Insertion sort;Stability;Loop invariant|外層逐一擴張已排序的前綴；內層要先檢查左側索引仍有效，才能讀值和比較。暫存 key 可避免右移時蓋掉原值。|比較使用「嚴格大於 key」，相等項不會跨過對方，因此保留原先順序。最壞情況要移動 1+2+⋯+(n−1) 次。
遞迴與每次呼叫的狀態|Recursion;Activation;Base case|每次呼叫建立自己的參數與執行位置。較深一層算完後，把回傳值交給暫停的上一層。|用「下行縮小問題」與「上行回傳答案」兩個階段追。畫格子記錄每層的輸入，比只寫重複的函式名稱清楚。
在有序姓名中找 John|Binary search;Search interval|每次比中點姓名與 John 的字典序，較小就排除左半含中點，較大就排除右半含中點。|實際追蹤先在投影片標出目前仍保留的姓名，再找該區的中點。從完整清單重算中點會讓搜尋無法縮小。
寫出三個比較結果|Binary search;Recursion;Base case|先檢查清單為空，再取中點；目標等於中點就成功，較小找左側，較大找右側。兩側都不再包含中點。|初次呼叫就可能是空清單，這是合法的失敗結果。沒有先判斷空清單就取中點，會讀到無效的位置。
二元搜尋如何回傳結果|Binary search;Recursion;Base case|把左右子問題用界線傳給同一函式，仍可沿用原陣列。當下層完成，將成功或失敗結果回傳給上層。|使用閉區間時，往左為 [L,mid−1]，往右為 [mid+1,R]。區間空的判斷為 L>R。
二元搜尋追蹤：開始比較|Binary search;Search interval;Activation|先記下第一層的輸入界線與中點。讀中點值後，記錄比較方向及下一層收到的範圍。|畫成四欄 L、mid、R、選擇方向。命中時所需的答案可以是值、位置或布林值，要看題目規格。
二元搜尋追蹤：遞迴向下|Binary search;Search interval;Activation|下一層只在保留的一側重新取中點。上層的界線依舊存在於自己的呼叫實例中，等待回傳。|要算比較次數，就只數實際有讀中點的步驟。空區間只進行停止檢查。
二元搜尋追蹤：回到呼叫端|Binary search;Activation;Base case|最後一層命中目標或區間為空，便有確定結果。上一層收到它後依次回傳，完整搜尋才結束。|若有重複元素，普通版本命中任一項就會停。要回傳第一個位置，需要另外約定找到相等值也繼續向左收縮。
遞迴如何保證終止|Recursion;Termination;Base case|用一個可下降的量衡量問題。二元搜尋可以用候選元素數量，向下呼叫時它嚴格減少。|基底條件的意義是達到某個小規模後可以直接回傳。若遞迴範圍保留原中點，單項範圍可能永遠縮不掉。
從無向圖取出一棵樹|Graph;Spanning tree;Cycle|生成樹保留全部頂點，沿著原圖的邊使它們相互可達。加邊如果閉合成環，該環有一條邊可移除且保留可達性。|檢查答案時同時驗證頂點都有、圖連通、圖無環。原圖若不連通，就無法取得涵蓋全部頂點的一棵樹。
用走訪得到生成樹|Spanning tree;Graph;Cycle|挑一個起點，每次第一次到達新頂點才記錄走過的那條邊。沿已記錄邊找路可回到起點。|這個由走訪取得的樹取決於處理鄰點的順序。只要走訪走遍原圖，就記錄了 V−1 條邊。
連得起來還要省成本|Spanning tree;Minimum spanning tree|鋪設網路或道路時，每條候選邊都可以有成本。目標是所有端點互通，並讓選中的邊權重合計最小。|最小生成樹跟兩點最短路徑有不同的目標。求樹時加總所有選入邊的成本。
加權圖與最小生成樹|Graph;Minimum spanning tree|對每條邊讀取它的權重。兩棵生成樹即使使用相同條數的邊，總權重仍可能不同。|如果有同權重的替代邊，可能有多棵同成本的最小生成樹。作答時可列邊集合與總權重供檢查。
Kruskal 與 Prim 選哪條邊|Minimum spanning tree;Kruskal's algorithm;Prim's algorithm|Kruskal 從全圖未處理的邊由輕到重看，Prim 從目前樹的跨界候選挑最輕。|Kruskal 一開始可同時出現多個成分，Prim 始終維持一棵越長越大的樹。兩者最後可得到同樣的最小成本。
Kruskal：連不同成分|Kruskal's algorithm;Disjoint set union;Cycle|先將邊依權重排序。每次檢查端點是否已經透過選入的邊互通，若還不通就納入並合併成分。|已互通時，舊路徑與新邊合起來會成環。連通圖選滿 V−1 條即完成。競程實作可用 DSU 維護成分。
Prim：只考慮跨界邊|Prim's algorithm;Frontier;Minimum spanning tree|從起點形成已訪集合 S。候選邊須一端在 S、另一端不在 S，挑最輕的把樹外端點納入。|起點可能改變選邊的次序。做題可每輪列出 S 和候選邊，以免選到兩端都在外部的邊。
把迷宮轉成圖|Graph;Perfect maze|每個格子是一個頂點，相鄰兩格如果開了一道牆，就在兩頂點之間連邊。可以用圖方法分析迷宮有沒有走通。|只允許上下左右相鄰時，對角格不能直接連通。看著圖上的牆面決定是不是同一條路。
完美迷宮和生成樹|Perfect maze;Spanning tree;Cycle|完美迷宮需要每格能到達所有其他格，任兩格的簡單路線也只有一條。這兩個條件正是連通且無環。|對 V 格的網格，最後會開出 V−1 條內部通道。外部的入口、出口屬邊界開口，可另外處理。
IN 與 FRONTIER|Frontier;Perfect maze;Prim's algorithm|IN 是已納入的格子。FRONTIER 是樹外、和 IN 相鄰的候選格子；距離 IN 更遠的格子先留在外面。|每次取一個 FRONTIER，透過一面牆連到某個 IN 格。即便有多個 IN 鄰居，這一步仍只接一條邊。
逐步生成隨機迷宮|Frontier;Perfect maze;Spanning tree|任取起始格，反覆挑選邊界候選和一個接上的舊格。加入新格後，把它的新外鄰納入候選集合。|隨機選擇會改變樹形。每步只接進一個新頂點這項性質，讓不同結果都保持連通且無環。
效率和正確性|Correctness;Time complexity|用一個例子發現錯誤很容易；要說明每個合法輸入都得到對的結果，需要推理。效率則是在方法符合規格後比較所需資源。|題目若問「快不快」，請寫明規模、情況與成本。若問「對不對」，請寫明要求與能維持的性質。
插入排序的最壞成長|Insertion sort;Worst case;Big Theta|升冪排序遇到嚴格遞減陣列時，第 k 個新鍵要越過前面的所有鍵，移動總數為 n(n−1)/2。|用 Θ(n²) 表達最壞情況的同階成長。已有順序的輸入通常只需沿陣列比較，最佳情況為 Θ(n)。
時間與空間要分開計|Time complexity;Space complexity|時間描述做多少工作，空間描述同時要保留多少資料。有時多存一張表能減少重複計算。|寫複雜度前先約定哪個量是 n。用兩個不同輸入維度時，例如圖的 V 與 E，要保留兩個符號。
空間複雜度算什麼|Space complexity;Activation|區分輸入本身、輸出以及演算法工作時的額外記憶體。只問輔助空間時，通常另計呼叫堆疊。|原地插入排序只需要暫存 key 與索引，額外空間 Θ(1)。遞迴二元搜尋每層有少量區域狀態，總堆疊為 Θ(log n)。
固定與隨輸入增長的空間|Space complexity|固定部分包含與輸入大小無關的少量變數，變動部分例如長度 n 的暫存陣列、動態節點，或隨深度增加的呼叫資料。|把同時留在記憶體的最大需求算出來。跑完的呼叫已釋放時，不必把所有歷史呼叫的空間加在一起。
陣列求和的輔助空間|Space complexity;Function|範例以參照傳入陣列，求和過程只追蹤 n、索引和累加值。把相同做法推廣到可變長度，額外空間仍為 Θ(1)。|如果在函式內另外複製 n 個元素，輔助空間會變成 Θ(n)。考試可註明不另計傳入的陣列。
為什麼重視成長趨勢|Time complexity;Asymptotic analysis|執行環境變快可以降低實際時間，輸入規模變大卻會依演算法的成長速率放大工作量。|若工作量是 n²，將輸入加倍時約做 4 倍工作。從方法上減少多餘的重複處理，常能改變整個成長率。
最壞情況要固定 n|Worst case;Time complexity|同長度的輸入可因資料分布產生不同執行時間。最壞情況是在 n 固定後，於所有合法輸入中取最大的成本。|說明最壞案例時，最好給出一族會隨 n 變大的輸入，例如插入排序的嚴格反序陣列。
影響時間的因素|Time complexity;Worst case|資料的筆數經常是主要規模。記錄大小、鍵的排序、表示方法和執行環境也可能改變實際時間。|比較演算法時，把輸入因素與硬體因素分開。計數結果若只考慮固定單位成本，要明確講出模型。
前綴平均的兩種算法|Prefix average;Time complexity|第 i 項平均要加總 X[0] 到 X[i]，再除以 i+1。每次重算前綴能得出答案，但前面算過的部分重複用到。|把 sum 保留到下一輪只加新項目，n 個前綴總共只納入 n 個值。逐個重掃則納入 n(n+1)/2 個值。
實驗量測執行時間|Time complexity|實作待比較的方法，針對多個規模準備資料並量時間，再畫出尺寸與耗時的關係。|把耗時來源的設定記下來，例如排序情況、測試次數、編譯選項。多次測量後看代表值，有助於減少偶然的系統干擾。
實驗結果能推到哪裡|Time complexity;Worst case|測得的數字反映當時的輸入與環境。某組資料沒有出現慢的情況，仍可能有其他資料會觸發更多步驟。|若要比較不同機器，應盡量控制設定；若要推理所有大小的成本，另用基本操作計數或形式分析。
理論分析怎麼做|Time complexity;Asymptotic analysis;Worst case|用虛擬碼說清楚流程，選定規模與成本模型，計算工作量隨 n 如何成長。|例如找最大值可挑「比較兩個值」作基本操作。無論資料順序如何都比較 n−1 次，更新最大值的次數才受資料影響。
讀 arrayMax 虛擬碼|Pseudocode;Precondition;Loop invariant|設 currentMax=A[0]，再依序處理索引 1 到 n−1。每步用新值和之前最大值比較，必要時更新。|空陣列不符合使用 A[0] 的前置條件。測試至少放一個全負數案例，確認沒有錯把 0 當初始最大值。
選擇基本操作|Primitive;Time complexity|指派、算術、比較、陣列索引與回傳都可在指定的模型裡作為基本操作。先決定粒度，再計算各行的執行次數。|只數比較時，寫清楚數的是值比較或也含迴圈條件。不同計法的常數可以不同，常見情況下成長階仍相同。
把虛擬碼分解計數|Primitive;Time complexity|一句複合操作可以含好幾個基本動作。例如讀一格再比較，要分別考慮索引存取和大小比較。|有條件的指派只在比較為真時發生，要用 n−1 的上界時也要說出可以觸發的資料排列。
逐行推算 arrayMax|Worst case;Time complexity;Primitive|資料比較固定做 n−1 次。嚴格遞增時，每次比較都更新最大值；起始元素已最大時，後續都不更新。|把每行的單次成本乘執行次數再加總。像迴圈結束的最後一次條件檢查也應依模型計入。
從基本操作估算時間|Time complexity;Big Theta|投影片採其完整基本操作成本模型，列最壞操作數為 7n−1。用最快與最慢基本操作時間夾住實際時間。|只計資料比較時答案是 n−1。檢查題目問的是指定模型的完整計數，還是單一類型的成本。
機器速度與成長階|Asymptotic analysis;Time complexity|在固定成本模型中，硬體與軟體環境可改變常數。一次掃描依舊隨資料筆數線性增加。|把 2n 與 30n 畫在同一張圖，量到的時間不同，成長都與 n 同階。
線性、平方與立方|Asymptotic analysis;Time complexity|輸入加倍時，n、n²、n³ 分別變為 2 倍、4 倍、8 倍。投影片用圖顯示長期的成長差異。|雙對數尺度下，n 的 k 次方會形成斜率 k 的直線。看圖比較前先確認座標軸是否同一種尺度。
哪些項在大規模時主導|Asymptotic analysis;Big Theta|像 4n²+3n+7，n 增大時 n² 項比 n 項與常數項成長得更快。係數仍會影響小規模時的實際成本。|給緊確階數時可寫 Θ(n²)。若問某個 n 的精確步數，仍應代回原式。
從精確成本到漸近表示|Asymptotic analysis;Big O;Big Theta|先找最大成長階，再看所要求的表示是上界還是同時具有下界的緊確界。|以 3n+1 為例，O(n) 與 O(n²) 都可當上界，Θ(n) 交代它的緊確成長階。
規模小時誰先跑完|Asymptotic analysis;Time complexity|比較 n²+2n 和 100n，令兩式相等得到 n(n−98)=0。正規模的交會點是 n=98。|1≤n<98 時前式較小，n>98 時後式較小。看到 n² 的成長較快，仍要算交會點才能回答特定規模。
費波那契的遞迴定義|Fibonacci sequence;Recursion;Base case|先定義 F(0)=0、F(1)=1；n≥2 時回傳 F(n−1)+F(n−2)。兩個子呼叫分別往較小的參數前進。|畫 F(5) 時會在不同分支再遇到 F(3)、F(2)。重複求值使直接遞迴的呼叫數快速增加，暫存結果能避免重算。
在程式加入計數器|Primitive;Time complexity|把 counter 放在要觀察的操作旁，可以量到某次執行做了幾次指定操作。它是一種以實際資料核對推導的方式。|求和一趟時若只數加法，n 項會累加 n 次。迴圈條件和索引更新要不要計入，取決於計數目的。
Big-O 的正式定義|Big O;Big Theta|找到常數 c>0 與 n₀，使得從 n≥n₀ 開始 f(n)≤c·g(n)，即可說 f(n) 是 O(g(n))。|例如 3n+2≤5n 對 n≥1 成立，可選 c=5、n₀=1。找到任一個有效的搭配就能證明上界。
辨認常見成長階|Asymptotic analysis;Big O|常見順序為常數、對數、線性、線性對數、平方、立方、指數。比較時假定 n 足夠大。|每輪把候選砍半通常是 log n 輪；每輪掃全部 n 個並做 log n 輪，會是 n log n 工作量。
插入排序最壞操作數|Insertion sort;Worst case;Big Theta|嚴格遞減輸入時，每輪都把 key 移到目前前綴的最左端。將各輪移動數相加得到三角形數列。|寫出 Σ k，k=1 到 n−1，再化為 n(n−1)/2，可直接支持最壞時間 Θ(n²)。
在圖上看插入排序的成本|Insertion sort;Worst case;Time complexity|用 n 做橫軸，移動或比較的成本做縱軸。輸入愈大，同樣增加幾項會付出愈多額外成本。|規模翻倍時，最壞成本約乘四。若修改資料變成幾乎有序，實際需要的右移次數會少很多。
在圖上看二元搜尋的成本|Binary search;Worst case;Big Theta|每輪至少排除約一半候選，在 n 變得很大時，比較次數仍只慢慢增加。|把規模翻倍通常只多一輪中點比較。若要說總成本，注意任何先排序的時間要另外列出。
如何描述正確性|Correctness;Precondition;Postcondition;Loop invariant|先寫合法輸入，再寫完成時的保證。對迴圈可用不變量，說明開始、維持以及結束時如何推出結果。|還要解釋迴圈會停。只說「若停下就有正確答案」，還沒有保證每次都會得到答案。
七節金鏈的付款問題|Algorithm;Correctness|每天結算後，旅館手上應有與住宿天數相等的節數。允許用較大片換回手上的小片。|目標是最少切開幾個鏈節。先想每種累計數 1～7 能不能用切出的片段組合，再安排每天交換。
先看可行的三刀解|Algorithm;Correctness|投影片給出可每天支付成功的三刀做法。找到可行解後，還可嘗試保留較大片段來減少切割。|要說「最少」，可行解提供上界，還須證明更少不可能。下一頁會把可行的上界壓到一刀。
一次切開第三節|Algorithm;Correctness|切開第三節並取出，得到長度 1、2、4 的三份。三個份量可組成 1 到 7，對應三個二進位位權。|例如第二天交 2 節並拿回 1 節，第四天交 4 節並拿回前一日的 1、2 節。零刀無法支付第一天的一節，故一刀最少。
狼、羊與高麗菜|Algorithm;Precondition;Correctness|只有人在岸邊時才能制止狼吃羊或羊吃菜。每次過河後檢查兩岸，包含人剛離開的那一側。|一條可行次序是：帶羊去、空船回、帶狼去、帶羊回、帶菜去、空船回、帶羊去。
兩位男孩與二十五位士兵|Algorithm;Iteration;Loop invariant|兩男孩先過河，一人划回，接著一名士兵單獨過河，留在對岸的男孩把船划回。四趟完成一名士兵的運送。|每輪結束兩男孩和船都回到起岸，已過河士兵多一名。25 輪共 100 趟，兩個男孩仍共同持有船。
用兩次秤找出較輕的硬幣|Algorithm;Worst case|把八枚分成 3、3、2。先秤兩組三枚；平衡表示假幣在剩餘兩枚，不平衡則假幣在較輕組。|第二次在可疑組任取兩枚互秤。第一次秤最多三種結果，無法唯一識別八種可能，故最少兩次。
while 的正確性圖|Loop invariant;Precondition;Postcondition|迴圈入口先建立不變量。條件為真時本體應能把它維持到下一次入口，條件為假後把停止條件與不變量合用。|寫證明可用 initialization、maintenance、termination 三段，並註明不變量成立的位置。
追蹤 i+j 的變化|Loop invariant;Iteration|初值 i=0、j=9，以每次判斷 i<10 的位置看，i+j=9。迴圈內 j−− 後暫時變成 8，接著 i++ 恢復為 9。|結束時 i=10，因此 j=−1。「0≤i≤10」也是真的，但單靠它無法推知 j 的最後值。
用不變量證明最大值|Loop invariant;Precondition;Postcondition;Correctness|每次檢查條件時，m 是已處理區間 a[0..i−1] 的最大值。初始 i=1、m=a[0]，處理 a[i] 後更新 m 再遞增 i。|i=n 時會離開迴圈，已處理區間正好覆蓋整個陣列。因 n≥1，初值合法，且整個掃描只比較 n−1 次。
`;

const concepts = {
  fundamentals:"演算法的規格", notation:"虛擬碼與流程", discovery:"發現解法", "loop-trace":"迴圈追蹤",
  "sequential-search":"循序搜尋", "insertion-sort":"插入排序", "binary-search":"二元搜尋","recursive-binary":"遞迴二元搜尋",
  "mst":"Kruskal 與 Prim", "maze":"完美迷宮", "complexity":"時間與空間複雜度", "prefix-average":"前綴平均",
  "fibonacci":"費波那契遞迴樹", "growth":"漸近成長率", "invariant":"迴圈不變量", correctness:"正確性",
  "spanning-tree":"生成樹", "grid-traversal":"網格走訪 BFS 與 DFS", "prefix-query":"前綴和與區間查詢",
  "difference-updates":"差分陣列與區間加值", "two-pointers":"雙指標找兩數和",
  "max-count":"最大值操作計數", "chain-payment":"七節金鍊", "river-puzzle":"狼羊菜渡河",
  "soldier-ferry":"士兵渡河", "fake-coin":"找較輕的硬幣"
};

const activityLinks = {
  14:["loop-trace"],16:["loop-trace"],24:["sequential-search","insertion-sort"],
  27:["loop-trace"],29:["loop-trace"],30:["loop-trace"],32:["insertion-sort"],
  33:["recursive-binary","fibonacci"],34:["binary-search"],35:["recursive-binary"],
  38:["recursive-binary","binary-search"],39:["recursive-binary"],40:["recursive-binary"],
  41:["spanning-tree","grid-traversal"],43:["mst"],44:["mst"],46:["mst"],47:["mst"],48:["maze"],49:["maze"],50:["maze"],
  53:["insertion-sort","growth"],58:["growth"],59:["max-count","growth"],64:["max-count"],65:["max-count"],
  66:["max-count"],67:["max-count"],69:["max-count"],70:["growth"],71:["growth"],72:["growth"],
  73:["growth"],77:["growth"],79:["insertion-sort","growth"],80:["growth"],81:["binary-search","growth"],
  82:["invariant"],83:["chain-payment"],84:["chain-payment"],89:["invariant"],90:["invariant","soldier-ferry"]
};

const slides = rows.trim().split("\n").map((row,index) => {
  const [title,names,...paragraphs] = row.split("|");
  return {page:index+1,title,terms:names.split(";"),paragraphs};
});

const PRACTICE_ROWS = `
5|觀念|fundamentals|Which property is missing if a procedure can run forever on a valid input?|Termination~對每個合法輸入都需要在有限步內完成。|Readability~可讀性不決定是否停止。|Stability~穩定性是排序的特定性質。|Portability~可移植性描述更換執行環境的能力。
6|判讀|fundamentals|Two programs use different languages but perform the same ordered steps and handle the same cases. What can they share?|The same algorithm~程式語言是表示與實作的選擇。|The exact same source code~語言語法可以不同。|The same machine instructions on every system~機器碼由平台和編譯器決定。|The same running time on every device~實際耗時會隨環境而變。
7|觀念|fundamentals|What makes an operation a primitive in a given algorithm model?|The model treats it as a basic executable step.~基本操作的粒度由所使用的模型決定。|It must use a loop internally.~可以只是比較或索引存取。|It always takes one nanosecond.~操作耗時要看環境。|It works only on integers.~基本操作也可處理其他資料型態。
10|情境|fundamentals|Two stacks have identical push and pop behavior but use different storage. Which description is accurate?|They can implement the same abstract data type.~ADT 以值與操作的行為定義介面。|They must have different interfaces.~內部表示不同可以共用介面。|They must have equal memory usage.~介面不規定記憶體使用量。|Only a linked stack is an ADT.~抽象行為並不限定實作方式。
13|追蹤|notation|Initially x = 3. Execute x ← x + 2, then execute x ← x + 1 only if x > 4. What is x?|6~第一個指派得到 5，判斷為真後加一。|3~忽略了兩次指派。|4~應先加二。|5~漏了條件成立後的更新。
14|判讀|notation|A while loop starts with k = 0 and tests k > 0. How many times does its body execute?|0~進入本體前先檢查條件。|1~後測式迴圈才必然先執行一次。|2~起始條件已為假。|Infinitely many~迴圈直接離開。
16|追蹤|notation|Count starts at 3. The loop prints once, then decrements Count while Count is positive. What is Count after the loop?|0~印三次後，Count 為 0 並停止。|1~Count 為 1 時仍會再印一次並更新。|3~這是初值。|−1~Count 為 0 時不會再進本體。
17|判讀|notation|In Sort(List), what lets the same function act on different data in separate calls?|Its parameter List~呼叫時可給參數不同的實際資料。|A hard-coded list inside the function~固定資料會限制重用。|A required global loop counter~能否重用與全域索引無關。|The name Sort alone~名稱沒有辦法提供資料。
19|情境|discovery|After implementing a proposed solution, which action best matches Pólya's final step?|Check the result and reconsider the approach.~最後要檢查結果並回顧是否有更好的做法。|Write down the problem for the first time.~理解問題是開頭的步驟。|Choose a plan without running it.~構思與執行發生在回顧前。|Discard all evidence from the worked example.~可用例子檢查解法。
23|推理|discovery|The age triples (1, 6, 6) and (2, 2, 9) have the same sum. Which clue distinguishes the second triple?|There is exactly one oldest child.~9 是唯一最大值，另一組有兩名年齡並列最大的孩子。|The sum is 13.~兩組都符合。|The product is 36.~兩組乘積都相同。|There are three children.~兩個候選都是三元組。
26|追蹤|sequential-search|The sorted list is [2, 4, 9, 12] and the target is 7. At which value can the lecture's sequential search stop with failure?|9~9 是第一個大於 7 的值，後面只會更大或一樣。|4~後面還可能出現 7。|2~第一項較小，仍需往下查。|12 only~讀到 9 時已經可以停。
26|判讀|sequential-search|What breaks if the sorted-list early-stop rule is used on [9, 2, 7] to find 7?|It may stop at 9 even though 7 appears later.~早停仰賴後續資料不會再變小。|It must read all three entries in order.~錯誤的早停規則會提前返回。|It finds 7 faster than binary search on all inputs.~這次會回報失敗。|It changes the contents of the list.~搜尋只檢視資料。
27|判讀|loop-trace|A loop starts with i = 0 and repeats while i < 5. Its body does not change i or any variable in the condition. What is missing?|A modification that can lead to termination~i 維持不變，條件永遠為真。|A starting value for i~初值已寫好。|A condition test~i<5 已經是判斷。|A second copy of the loop body~重複其他本體無法改變條件。
28|判讀|loop-trace|Which loop executes its body at least once before its first test?|A posttest loop~後測式的判斷在本體後。|A pretest loop~前測式可執行零次。|Every for loop~一般 for 先判斷條件。|Every recursive call~遞迴呼叫可能直接碰到基底情況。
29|計算|loop-trace|A pretest while loop completes four body executions and then exits normally. How many times is the condition tested?|5~四次為真，再多一次為假離開。|4~忽略了離開的檢查。|3~進入四次已至少四次測試。|8~每輪不需要兩次條件測試。
30|判讀|loop-trace|Which C++ condition matches repeat body until done?|do { body; } while (!done);~直到 done 為真才停，所以 done 為假時繼續。|do { body; } while (done);~這會在 done 為真時繼續。|while (done) { body; }~條件方向不合，且測試時機不同。|while (!done) { body; }~條件方向正確，但可能一次都不進。
31|追蹤|insertion-sort|In insertion sort, the sorted prefix is [2, 5, 8] and the next key is 4. Which values shift before insertion?|8, then 5~由右往左一直移，遇到小於 key 的 2 停止。|2, then 5~2 應保留在 key 左側。|5, then 8~掃描從前綴最右端開始。|All three values~2 不需移動。
32|推理|insertion-sort|Which comparison keeps equal keys in their original relative order during insertion sort?|Shift while the preceding key is strictly greater.~相等時停止右移，新元素會插在舊元素右側。|Shift while the preceding key is greater or equal.~相等也右移，可能顛倒等值鍵的原順序。|Shift while the preceding key is strictly smaller.~這不符合升冪排序所需的方向。|Shift every preceding key unconditionally.~強制右移會破壞排序。
33|理解|binary-search|When a recursive function calls itself with a smaller input, what happens to the caller's local variables?|They remain associated with the caller's activation.~下一層有自己的參數與區域狀態。|The new call must overwrite them.~新呼叫有獨立的執行狀態。|They all become global variables.~區域變數的作用域沒有改變。|They are always discarded before the call.~上層返回後還可能使用它們。
35|判讀|binary-search|What does binary search require to safely discard one side after comparing the middle element?|The elements are sorted by the same comparison rule.~才能從中點大小推出兩邊的大小範圍。|The elements use consecutive integer keys.~排序規則有序即可。|The array length is a power of two.~非二次方長度同樣可縮界。|Every value is distinct.~重複值也能搜尋。
36|追蹤|binary-search|The closed search interval is [2, 8], mid is 5, and target < A[5]. What is the next interval?|[2, 4]~右界移到 mid−1。|[2, 5]~保留了已排除的中點。|[5, 8]~往錯誤的方向縮界。|[6, 8]~這用於目標較大的情況。
37|追蹤|binary-search|Binary search uses floor midpoint on [3, 5, 9, 11, 14, 18, 22]. Which values are compared when searching for 14?|11, 18, 14~中點 3 得 11，進 [4,6] 得 18，最後 [4,4] 得 14。|11, 14~[4,6] 的中點索引是 5。|9, 14, 18~起始中點索引 3，值是 11。|11, 9, 14~11 小於目標，不能進左半。
39|推理|binary-search|To find the first occurrence using [L, R), what update is appropriate when A[mid] equals the target?|R ← mid~保留左側可能更早的匹配，最後檢查交界。|L ← mid + 1~這會丟掉目前匹配和可能更早的位置。|Return mid immediately.~只能保證找到任意一個匹配。|R ← mid − 1~半開區間這樣會多排除一個可能的索引。
40|理解|binary-search|Which argument proves termination of a correctly written recursive binary search?|Every recursive call has fewer candidates, eventually reaching a base case.~候選數有下界且遞迴時會嚴格減少。|It always finds the target.~合法輸入仍可能找不到。|It uses a sorted array and no base case.~缺少停止條件仍可能出錯。|It uses the same bounds at each level.~界線若不變，可能永遠無法停止。
41|計算|mst|How many edges does every spanning tree of a connected graph with 12 vertices contain?|11~生成樹有 V−1 條邊。|12~再加一條會出現環。|10~不足以把 12 個點連通。|66~66 是 12 點簡單無向完全圖的邊數。
44|判讀|mst|Can different minimum spanning trees have the same total weight?|Yes, equal-weight alternatives can produce different edge sets.~最小成本是同一個值，但選邊可能不唯一。|No, the tree is unique for every connected graph.~等權邊可讓最小生成樹不唯一。|Only if the graph is directed.~本章的 MST 設在無向圖中。|Only if both trees have different numbers of edges.~兩者都必須有 V−1 條邊。
45|計算|mst|An undirected graph has edges AB:1, BC:2, AC:3, CD:4 and AD:6. What is its MST weight?|7~選 AB、BC、CD，略過會成環的 AC。|6~1+2+3 形成三角環，D 未連上。|9~選 AB、BC、AD 可連通，但成本高於 7。|16~不需納入所有邊。
46|判讀|mst|When does Kruskal's algorithm skip a candidate edge?|Its endpoints are already connected by selected edges.~新增該邊會與原路徑形成環。|One endpoint has never appeared before.~這通常是可以接入的情況。|Its weight is currently the smallest.~最小邊要先檢查成分，仍可能入選。|It connects two separate components.~這正是可以合併的機會。
47|追蹤|mst|Prim has built a tree containing A and B. Which edge is eligible to extend it?|An edge from B to an unvisited vertex C~只有一端在目前的樹。|An edge between two unvisited vertices~兩端都在樹外。|The edge AB already in the tree~重複選不會納入新頂點。|A self-loop at A~仍然無法連到樹外。
49|推理|maze|In a perfect maze consisting of 20 connected cells, how many internal passages connect pairs of cells?|19~每個通道算一條邊，完美迷宮是生成樹。|20~連通的 20 點圖若有 20 條邊便有環。|21~還會有額外邊。|10~不足以連通所有格。
50|判讀|maze|A frontier cell has three neighbors already inside the maze tree. How many of those walls should the algorithm open when adding that cell?|Exactly one~接入一格只加一條邊，維持無環。|All three~會形成可繞行的環。|Exactly two~兩個舊格已互通，仍會成環。|None~新格會和已完成區域分離。
53|計算|insertion-sort|How many right shifts does insertion sort perform on [5, 4, 3, 2, 1]?|10~每輪右移 1、2、3、4 項，共 10 次。|4~這是外層迴圈的輪數。|5~這是輸入項目數。|25~平方階描述成長，不等於精確操作數。
57|判讀|complexity|An array sum uses a reference to the input array plus one index and one accumulator. What is its auxiliary space?|Θ(1)~指標或參照和少量變數屬固定空間。|Θ(n)~只有複製整個陣列等情況才需線性輔助空間。|Θ(log n)~一趟迴圈不用增加多層堆疊。|Θ(n²)~沒有配置與規模平方相關的資料。
59|理解|complexity|To analyze worst-case running time for inputs of size n, which quantity should be taken?|The maximum running time over valid size-n inputs.~先固定規模，再找成本最大的一個情況。|The average over all measured input sizes.~既不是固定規模也不是最大值。|The time for the smallest legal input.~最小案例不代表規模 n 的最大成本。|The median of compiler benchmarks.~這不是演算法最壞操作量的定義。
61|計算|prefix-average|For eight values, how many array-element reads are needed when each prefix average is recomputed from scratch?|36~前綴長度 1 到 8 相加得到 36。|8~這是沿用累加和的讀值量。|16~輸出和輸入各八個，不等於重掃的讀值數。|64~每輪只讀當時的前綴，不必全部八項。
68|計算|invariant|A direct maximum scan starts with the first item of a 100-element array. How many comparisons between array values are needed?|99~剩餘 99 個各和目前最大值比較一次。|100~第一項用作初值，無需與自己比較。|50~可能最大值仍需要和每一項確認。|4,950~這是所有不同元素對的數量。
74|計算|growth|For which positive integer n do n² + 2n and 100n have equal cost?|98~移項得到 n(n−98)=0，正的交點是 98。|100~遺漏 2n。|2~把係數誤當成交會點。|90~代入兩式不相等。
75|推理|fibonacci|Why can memoization reduce the work of recursive Fibonacci?|Different branches can compute the same F(k) more than once.~快取允許同參數子問題沿用之前的結果。|It replaces both base cases with a single call to F(n).~基底值仍保留。|It changes the Fibonacci recurrence.~遞迴公式不變。|It makes every input return zero.~結果不因加入快取改變。
77|判讀|growth|Which pair proves 3n + 2 is O(n) for n ≥ n₀?|c = 5, n₀ = 1~對 n≥1，有 3n+2≤5n。|c = 3, n₀ = 1~常數加二仍讓原式大於上界。|c = 2, n₀ = 1~線性係數二太小。|c = 0, n₀ = 1~c 必須為正且上界不足。
78|判讀|growth|A loop performs n operations per round and halves its remaining control variable after every round. Which tight bound fits its total work?|Θ(n log n)~每輪 n 步，輪數約 log n。|Θ(log n)~只數了輪數。|Θ(n)~忽略總輪數隨 n 成長。|Θ(n²)~需要的輪數約 log n，並非 n。
79|判讀|insertion-sort|Which input gives ascending insertion sort its worst-case number of shifts?|A strictly decreasing array~每輪 key 都比先前所有鍵小。|An already increasing array~不需要右移。|An array of identical keys with strict comparison~相等時不會右移。|An empty array~沒有可插入的鍵。
81|推理|binary-search|Doubling the size of a sorted array changes the worst-case number of binary-search midpoint comparisons by about how much?|One additional comparison~每次排除約一半，對數成長。|Twice as many comparisons~這更接近線性成長。|A fixed additional n comparisons~每次都不必掃過全部資料。|Four times as many comparisons~這是平方級工作量加倍時的成長。
85|推理|correctness|A seven-link chain is cut into pieces of lengths 1, 2 and 4. How can the innkeeper's holdings increase from three links to four?|Give the four-link piece and take back the one- and two-link pieces.~旅館收到四節，同時歸還三節，累積增加一節。|Give the four-link piece and leave the other pieces there.~會直接持有七節。|Give a two-link piece and take back four links.~第四天之前旅館還沒有四節片段。|Cut the four-link piece into two equal sections.~可用交換完成，無需再切。
88|推理|correctness|One of eight coins is known to be lighter. Which first balance-scale weighing guarantees identification with at most one more weighing?|Weigh three coins against three coins.~不平衡剩三個候選，平衡剩兩個，下一秤足夠。|Weigh four against four.~較輕一側仍有四個候選，下一秤只有三種結果。|Weigh one against one.~若平衡還有六個候選。|Weigh two against two.~若平衡還有四個候選。
90|追蹤|invariant|A loop starts with i = 0 and j = 9. Each of ten rounds decrements j and increments i. What is j at termination?|−1~在每次迴圈入口 i+j=9，結束時 i=10。|0~這是九輪之後的值。|1~比最後的結果多兩次更新。|9~這是初值。
91|證明|invariant|At the head of a maximum-scan loop with next index i, which invariant suffices to prove correctness?|m is the maximum of a[0..i−1].~結束時 i=n，這段剛好覆蓋完整陣列。|m is always equal to a[0].~遇到更大值時就不成立。|i is an integer.~不足以推出任何最大值資訊。|m is the maximum of a[i..n−1].~m 對應的是已處理的左前綴。
`;

StudySite.registerCourse({
  id:"lecture-06",label:"Chapter 5",title:"演算法",english:"Algorithms",
  lead:"把搜尋、排序和生成樹拆成每一次比較、移動與選邊，再把同樣的步驟寫進 C++。",
  availableNote:"頁碼依 PDF 實際順序。p.79 起，投影片印刷頁碼比 PDF 頁碼多 2。",
  examSource:"歷屆原題附場次和配分。可依本章範圍或已讀頁碼選題，也可直接到互動實驗重跑解法。",
  questionLanguage:"en",examMinutes:40,originalPdf:true,units,slides,terms,concepts,activityLinks,
  practice: makePractice(), exam:[], figurePages:new Set(slides.map(slide=>slide.page))
});

function makePractice() {
  const rows = PRACTICE_ROWS;
  const orders = [[2,0,3,1],[0,3,1,2],[1,3,0,2],[2,1,3,0]];
  return rows.trim().split("\n").map((row,index) => {
    const [pageText,level,concept,prompt,...answers] = row.split("|");
    const page = Number(pageText);
    const options = answers.map((answer,position) => {
      const [label,explanation] = answer.split("~");
      return {label,explanation,correct:position===0};
    });
    return {
      id:"practice-" + (index+1), unit:units.find(unit=>page>=unit.start && page<=unit.end).id,
      page,level,concept,prompt,options:orders[index%orders.length].map(i=>options[i])
    };
  });
}
})();
