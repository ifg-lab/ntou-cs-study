"use strict";



(() => {

const S = (page, title, keywords, text, exam = "") => ({
  page, title, terms: keywords ? keywords.split("|") : [], paragraphs: text.split("\n"), exam
});

const lecture05 = {
  id: "lecture-05",
  label: "Chapter 4",
  title: "網路與網際網路",
  english: "Networking and the Internet",
  source: "Lecture-5-Network-Distribute (3).pptx",
  lead: "從裝置接上網路開始，跟著一個封包學會位址、路由、網頁和安全通訊。",
  artTerms: ["IP", "DNS", "TCP", "LAN", "TLS"],
  originalPdf: true,
  units: [
    ["scope", 1, 13, "網路的分類", "範圍、用途、擁有權與服務角色"],
    ["topology", 14, 24, "網路拓撲", "Bus、Ring、Star、Tree、Mesh"],
    ["wireless", 25, 30, "無線網路與媒體存取", "Bluetooth、Wi-Fi、CSMA 與隱藏終端"],
    ["devices", 31, 43, "連網設備", "從 Repeater 到 Router、Gateway 與 Firewall"],
    ["media", 44, 49, "傳輸媒介", "銅線、同軸、雙絞線、光纖與接頭"],
    ["cloud", 50, 57, "分散式系統與雲端", "IPC、Cluster、Grid、Cloud 與服務模型"],
    ["internet", 58, 64, "網際網路與位址", "ISP、Peering、IP、網域與介面"],
    ["subnet", 65, 73, "子網路、CIDR 與 DHCP", "前綴判讀、切割子網與位址租約"],
    ["dns", 74, 82, "DNS 名稱解析", "名稱層級、快取、迭代與遞迴"],
    ["apps", 83, 85, "網際網路應用", "郵件、遠端登入、串流與 CDN"],
    ["web", 86, 97, "全球資訊網", "URL、HTML、XML、MathML 與前後端"],
    ["protocols", 98, 112, "封裝、IP 與 TCP/UDP", "協定分層、IPv4 分片與多工"],
    ["security", 113, 119, "網路實物與資安", "實體接線、攻擊、加密與隱私"]
  ].map(([id, start, end, title, description]) => ({id, start, end, title, description})),
  slides: [
    S(1,"Chapter 4 課程封面","Computer Network|Internet|Distributed System","許為元老師的計算機概論。先看「設備怎麼接」，再追蹤「資料怎麼走」，最後看「應用怎麼用、如何防護」。同一個例子可以一路串下去：筆電透過 Wi-Fi 連線，取得 IP，查出網站的位置，再送出網頁請求。"),
    S(2,"網路與網際網路是怎麼組成的","Internet|IETF|ICANN","Internet 由許多獨立營運的網路互連而成。你實際依賴的基礎設施包含光纖、無線基地台、路由器和交換設備；網路間能互通還仰賴共通標準與協議。\n投影片開頭的英文容易誤讀。Internet 的營運與治理由許多組織共同參與。IETF 發展技術標準，ICANN 協調全球識別資源，IAB 關注網際網路架構；NSF 和 InterNIC 可放在早期發展及域名服務的歷史脈絡下理解。","The Internet is a global network of interconnected networks，各網路由不同組織營運，透過共同協定互通。"),
    S(3,"電腦網路的五個主題","World Wide Web|Protocol","4.1 基礎談範圍、拓撲、協定、設備、媒介與分散式系統。4.2 Internet 談 ISP、IP、子網、DHCP、DNS 與應用。4.3 Web 談 URL 和網頁技術。4.4 協定談分層、封裝及 TCP/UDP。4.5 資安談攻擊、防護、加密與隱私。"),
    S(4,"分類要先看分類依據","","同一網路可從幾個角度描述。PAN、LAN、CAN、MAN、WAN 主要是範圍；SAN 強調儲存用途，VPN 強調虛擬私有連接；Client/Server、P2P 主要是服務角色。Ownership 看擁有和存取安排，Topology 看連接或傳送方式。\n例如校園多棟大樓可構成 CAN，各教室內可有 Star LAN，校務系統又是 Client/Server。這些描述能同時成立。","先寫分類依據，再寫例子。CAN 是校園範圍，Star 是拓撲，Client/Server 是服務角色。"),
    S(5,"個人區域網路","PAN|Bluetooth","PAN 圍繞個人裝置，像手機和耳機的 Bluetooth 連線。PAN 內的裝置能彼此溝通，也可由某個裝置擔任上游出口，例如筆電接手機熱點再使用行動網路。\n投影片把 HAN 與 PAN 並提。HAN 通常指整個住宅的家庭網路，範圍和用途可以比個人裝置形成的 PAN 更廣。","PAN 連接同一使用者附近的裝置，例如手機與 Bluetooth 耳機。"),
    S(6,"區域網路與 Ethernet","LAN|Ethernet","LAN 服務相對局部的範圍，例如一間電腦教室、一層辦公室或一棟大樓。Ethernet 是常見有線 LAN 技術，早期由 Xerox、DEC、Intel 合作推廣。講義舉 10 Gbps 為例，實際速率視 Ethernet 標準和設備而定。\nFDDI 與 Token Ring 是歷史上的其他 LAN 技術，常利用 token 控制發送權。LAN 是規模分類，Ethernet 是技術名稱。","LAN is a network in a limited area；Ethernet 是 LAN 可採用的傳輸技術。"),
    S(7,"校園區域網路","","CAN 串起同一校園或園區的多棟相鄰建物，常整合數個 LAN。以海洋大學情境想像：系館、圖書館、行政大樓各自有內網，校園骨幹讓它們共享驗證、印表、檔案或上網資源。規模通常介於 LAN 與 MAN。"),
    S(8,"都會區域網路","MAN|ISP","MAN 涵蓋同一城市或都會區，把不同地點的區域網路接起來。講義的 5～50 km 是典型尺度的例子；題目判斷時看是否屬都會範圍。電信業者或市政府都可能營運這類網路。"),
    S(9,"廣域網路","WAN","WAN 跨越城市、國家或洲際，常用電信線路或光纖等連接遠距網路。Modem 在特定接取線路負責訊號調變與解調；設備需求由接取技術決定。Internet 可以視為全球規模的網路互連。\n例：台北分部 LAN 與高雄分部 LAN 透過電信網互通，從公司整體視角就是 WAN。"),
    S(10,"儲存區域網路","SAN","SAN 把伺服器和儲存陣列以專用網路連起來。重點是讓伺服器像操作磁碟一樣存取遠端的儲存區塊，例如資料庫伺服器把 SAN 提供的磁碟卷掛載後自行建立檔案系統。\n用題目目的辨認：強調共享儲存裝置或磁碟區塊，優先想 SAN；強調跨城市的地理跨度，優先想 WAN。"),
    S(11,"虛擬私人網路","VPN|Encryption","VPN 在公用網路上建立虛擬通道，讓遠端用戶或兩個據點安全連入私有網路。例如在家先連學校 VPN，再用校內位址存取資源。\nAuthentication 驗證對方身分；Confidentiality 用加密讓旁人看不懂內容；Integrity 檢查內容有沒有被竄改。通道也可能包住原本的封包，外層送到 VPN 端點，內層交給校內網路。","VPN 建立 virtual tunnel，使用 authentication 驗證身分、encryption 提供 confidentiality，並檢查 integrity。"),
    S(12,"Client/Server 網路","Client/Server","Client 通常主動提出 request，Server 持續提供服務並回 response。檔案、印表、網站等服務可以由同一台或多台主機提供。講義用專用伺服器當例子；在程式層次，Server 是服務角色。\n例如教室電腦是用戶端，向校務系統伺服器請求課表。即使有很多客戶端，服務端依然是大家共同存取的入口。","Client initiates a request，Server waits for requests 並回傳結果。"),
    S(13,"Peer-to-Peer 網路","P2P|Hub|Switch","P2P 的端點地位相對對等，可以同時下載別人的資料，也上傳自己有的資料。講義先以小型工作群組示範；P2P 也能運行在大型 Internet 上，實際規模和表現視設計與負載而定。\n「可不需要 hub 或 switch」描述小型直接互連情境。P2P 關心服務角色，因此仍可透過有交換器的 LAN 或經由路由器連線。","In P2P, a peer can both request and provide services；例如一邊收檔一邊分享已收到的區塊。"),
    S(14,"實體與邏輯拓撲","Physical Topology|Logical Topology|Token Passing","Physical topology 看線或媒介怎麼接；logical topology 看資料怎麼傳或哪個節點可以使用媒介。Broadcast 讓同一個範圍內的裝置收到傳送；token passing 讓持有權杖的一方使用媒介。\n接在舊式中央 hub 上時，外觀看起來是星狀，hub 卻把訊號送到其他埠，節點仍分享同一媒介。多種拓撲合併可稱 Hybrid。","Physical = actual layout；Logical = how hosts access the medium and how data flows。"),
    S(15,"Bus 拓撲與終端器","Bus Topology","Bus 的設備接同一條 backbone。訊號沿共享線傳播，線兩端的 terminator 匹配阻抗，吸收訊號，降低反射干擾。每台裝置可透過支線接到主幹。\n畫圖時把電腦接到一條線，再把兩個 T 放在線的兩端。T 代表終端器；電腦數量改變時，仍由主幹的兩端終結訊號。"),
    S(16,"Bus 上怎麼送資料","Frame","A 發送給 C 時，A 把 frame 放上主幹，訊號可沿線到達其他節點。裝置檢查目的位址，C 接收符合自己的 frame，B 等其他一般節點忽略。\n同一條媒介共用，A 與另一個節點若同時送訊號，訊號可能重疊。要安排大家何時能送，就需要媒體存取協定。"),
    S(17,"Bus 的優缺點","Collision","Bus 用線少、施工簡單，各站自行控制存取。多台站點競爭一條線，可能發生 contention 和 collision；主幹斷裂或終端失效可能造成訊號反射，使整段通訊失常。\n排錯時，一台電腦故障與主幹故障的範圍不同。題目如果說「一條共用主線斷掉，許多裝置同時失聯」，先想到 Bus 的主幹風險。"),
    S(18,"Ring 拓撲","Ring Topology|Repeater","典型 Ring 每站連兩個相鄰節點，形成封閉迴路；課堂示意採單向傳送，資料沿環由一站交下一站，節點可重生訊號。搭配 token passing，可安排一個時間只有持有 token 的節點傳送。\n簡單單環一處中斷就可能影響整環。環狀物理接法與碰撞控制屬於兩個層次，碰撞情況仍取決於媒體存取規則。","Ring forms a closed loop，每站接兩個鄰居；單環中斷可能讓整條環失效。"),
    S(19,"Star 拓撲","Star Topology|Hub|Switch|Access Point","Star 中每個端點接到同一中心，彼此通訊通常經過中心。中心可以是 hub、switch，或無線 AP。單一支線斷掉多半只影響該端點；中心故障可能讓全部分支失去互通。\n例如電腦教室一台電腦網路線鬆脫，其他座位照常上網；中央 switch 斷電時，多台主機一起失聯。","A failed spoke affects one node；a failed central hub/switch affects the whole star。"),
    S(20,"拓撲圖判讀","Star Topology|Bus Topology|Ring Topology","原圖五台電腦各有一條線通往中央 switch，因此是 Star。若節點依附同一條長線就是 Bus；若每個節點接兩個鄰居且首尾接合就是 Ring。圖畫成圓形或方形都可以，判斷依據是連線。\n測驗常把星狀圖旋轉，或把環畫成矩形。先數每個節點接幾條線，再確認是否有中心或共用線。"),
    S(21,"Tree／階層式拓撲","Tree Topology","Tree 有上層中心與下層中心，可由多個 Star 接成分層架構。樓層 switch 連到核心 switch，各教室掛在樓層設備下；增設分支可容納更多設備，也能按分支管理通訊。\n低層支線故障多半是局部；樓層上行斷掉可讓整個樓層離開其他分支；高層核心故障的影響範圍更大。"),
    S(22,"由較小網段組成大型網路","Bridge","左圖用 repeater 或 bridge 連接兩條 bus；右圖用 switch 連接多條 bus。先圈出每段共享的主線，再找段與段之間的設備。各端點仍只接所在網段；跨段的資料是否轉送，取決於接段設備的功能。\n例如使用 bridge 時，已知同段資料可留在原段，需要去別段的 frame 才轉送。p.33～38 會分辨單純重生訊號和依位址轉送。"),
    S(23,"Mesh 與替代路徑","Mesh Topology","Full mesh 是每一對節點都有一條直接連線；partial mesh 只在部分節點間設置多路互連。設計目的之一是讓單一路線失效時仍有其他路徑，講義以高可靠性控制系統為例。\nInternet 有許多替代路徑，但不同網路未必彼此直接互接，所以整體屬互連網路而非 full mesh。"),
    S(24,"Mesh 的成本和可靠性","","若有 n 個節點且每對只需一條雙向鏈路，每個節點需 n−1 個埠，總線數為 n(n−1)/2。例：6 台需 15 條線，每台 5 個埠。替代路徑提高容錯，獨立鏈路也讓流量和故障較易隔離。\n硬體、施工與管理成本會隨節點數快速成長。專線可減少共用媒介暴露，資料機密性仍由加密與存取控制保護。","Full mesh has n(n−1)/2 links and n−1 ports per node；成本是線和埠多，優點是替代路徑。"),
    S(25,"無線網路的範圍","Bluetooth|Wi-Fi","無線網路透過電磁波在裝置間傳遞資料。Bluetooth 常見於個人周邊；Wi-Fi 常用於房間、教室或熱點的無線 LAN；3G/4G 則依賴電信業者的大範圍行動網路。\n同一支手機可以同時用 Bluetooth 接耳機、用 Wi-Fi 接室內網，出門後用行動網路上網。這三段的接收設備、覆蓋和存取方式各不相同。"),
    S(26,"Bluetooth","Bluetooth","Bluetooth 是短距離無線技術，適用耳機、鍵盤、手機或感測裝置。講義提到約 2.402～2.48 GHz，屬於 2.4 GHz ISM 頻段。頻率代表每秒振盪次數，GHz 不是資料傳輸量的單位。\nIEEE 802.15.1 曾把 Bluetooth 規格標準化，現行 Bluetooth 規格由 Bluetooth SIG 發展。"),
    S(27,"Wi-Fi 和 AP","Wi-Fi|Access Point","Wi-Fi 是以 IEEE 802.11 系列為基礎的無線 LAN 技術。AP 是可收發無線訊號的接取點，可以把無線裝置接到區域網路；要連 Internet，還需要路由及上游連線。\n講義把 Wi-Fi 展開成 Wireless Fidelity，這是歷史行銷用語。作答時記住「IEEE 802.11 family」與「wireless LAN」最準確。","An AP connects Wi-Fi clients to the LAN；Wi-Fi is based on the IEEE 802.11 family。"),
    S(28,"通訊協定為何必要","Protocol","協定規定雙方怎麼理解資料、怎麼回覆，以及何時可傳。共用媒介上若所有設備一起發送，彼此可能干擾；有一致的媒體存取規則才能協調競爭。\n不同品牌設備都遵守相同標準，就可能互通。例如手機與路由器來自不同廠商，仍可用共同支援的 Wi-Fi 標準連線。"),
    S(29,"CSMA/CD 與 CSMA/CA","CSMA|CSMA/CD|CSMA/CA|Random Backoff|RTS/CTS","CSMA 是先聽媒介再嘗試送。舊式共享、半雙工 Ethernet 的 CD 在送的同時偵測碰撞；偵測後停止、等待各自隨機的退避時間再試。交換式全雙工 Ethernet 不會用到這個碰撞處理流程。\nWi-Fi 的 CA 主要在送前避免碰撞。媒介空閒後按規則倒數，忙碌時凍結倒數，空閒後續數。接收端 ACK 可幫助確認傳送，RTS/CTS 可減少部分隱藏終端造成的碰撞。","CD = detect collisions and back off；CA = listen and back off before sending to reduce collisions。"),
    S(30,"隱藏終端問題","Hidden Terminal|Access Point|RTS/CTS|Collision","假設 A 和 C 都聽得到 AP，但 A、C 彼此超出感測範圍。A 在傳時，C 仍可能聽到「空閒」，兩個訊號於 AP 重疊。碰撞發生的關鍵是共同接收端的訊號重疊。\n可選用 RTS/CTS：A 先請求傳送，AP 回 CTS，能聽見 AP 的 C 依宣告時間先等。這降低隱藏終端衝突，仍可能因控制訊框等情形出現碰撞。","A and C cannot hear each other, but both reach the AP；simultaneous transmission can collide at the AP。"),
    S(31,"從訊號到跨網路轉送","Repeater|Bridge|Switch|Hub|Router|Internet","Repeater 讓訊號走更遠；hub 把訊號送到其他連接埠；bridge 和 switch 可依 MAC 位址篩選 frame；router 依 IP 位址在不同網路間轉送。PoE 是網路線同時供電的方式，例如用一條線接 AP。\n本頁列出設備能力及耗電的概略排序，實際瓦數看機型與負載。小寫 internet 可指任何互連網路，大寫 Internet 指全球的網際網路。","L1 repeater/hub 看訊號；L2 bridge/switch 看 MAC；L3 router 看 IP。"),
    S(32,"網路介面卡與 MAC 位址","NIC|MAC Address","NIC 讓主機接上有線或無線媒介，可能是插在主機板擴充槽上的卡，也可能內建。MAC address 是資料鏈結層用來辨識介面的位址，常見 Ethernet MAC 位址為 48 bits。\n同一台筆電可有一個 Wi-Fi 介面和一個 Ethernet 介面，各有自己的 MAC；某些系統也可使用本地指定或隨機化 MAC。"),
    S(33,"Repeater 重生訊號","Repeater","訊號經長距離傳輸會衰減或失真。數位 repeater 可重建位元訊號再送出，延伸可達距離。它工作的依據是物理訊號，無須知道目的 MAC 或目的 IP。\n若接收訊號已無法辨識，重生設備也無法保證還原。題目說「延長同一網段、無地址判斷」，對應 repeater。"),
    S(34,"Repeater 圖的讀法","Repeater","沿連線找兩段媒介與中間的 repeater。左側送出的訊號到中間先重生，再進右側；資料傳輸的距離因此拉長。這裡的兩段線是物理媒介的分段。\n把 repeater 換成 bridge，行為會改變：bridge 在 frame 層級決定要不要跨段送出。"),
    S(35,"Hub 的轉送方式","Hub|Ethernet|Port Number|Collision Domain","一個 hub 讓多台主機接到同一共享媒介。A 傳入時，hub 將訊號重送到其他連接埠，沒有學習哪個 MAC 在哪一埠。Active hub 還可重生訊號，因此可視為多埠 repeater。\n若兩個主機同時傳送，彼此仍可能碰撞。實體是星狀接線，邏輯上仍共享頻寬和碰撞範圍。","Hub repeats incoming signals to the other ports，且不查目的 MAC。"),
    S(36,"Bridge 的跨段篩選","Bridge|Frame|MAC Address","Bridge 連接 LAN 網段並檢查 frame。以圖的 A、B、E 為例，A 和 B 在同一段時，bridge 可把 A→B 留在原段；A→E 需要到另一段時，bridge 才轉送。\nBridge 通常從收到的來源 MAC 學習位置，再根據目的 MAC 決定行為。未知單播和廣播有各自的轉送規則。"),
    S(37,"Bridge 讓網段流量局部化","Bridge|MAC Table|Flooding","橋接器用位址資訊判斷 frame 是否需要跨到另一段。各段局部通訊可以留在原段，其他段就不用一起承受流量。橋接是在資料鏈結層運作，具體可連接的媒介或 frame 格式取決於設備。\n例：同段 MAC 已學到就篩掉；跨段且目的已知就轉送；未知目的通常向可用的其他段泛洪。"),
    S(38,"Switch 如何學習與轉送","Switch|MAC Table|Unknown Unicast","收到 frame 時，switch 先記「來源 MAC → 進來的埠」，再查目的 MAC。目的已知且在另一埠時，向該埠轉送；未知目的單播會向同一 VLAN 的其他可用埠泛洪。若目的就在原埠，交換器不必再轉送。\n交換背板能同時承載多筆可並行的傳輸；各端點用獨立鏈路。獨立線路和轉送決策是它比 hub 更能隔離流量的原因。","Switch learns the source MAC and forwards based on the destination MAC。"),
    S(39,"Router 連接不同網路","Router|LAN|WAN|Next Hop","Router 可把本地 LAN 接到 WAN，或接起多個 IP 網路。核心行為是查目的 IP 並決定下一跳及輸出介面。家用盒子常整合路由器、switch、AP 與防火牆，這些功能在答題時要能分開。\n例：宿舍筆電連學校網段，再透過校方路由器往外送至遠端服務。"),
    S(40,"Router 如何拆封裝再封裝","Router|OSI|Network Layer|Encapsulation|Routing Table","Router 收到 LAN frame，取出 IP packet，查目的 IP 與 routing table，選擇輸出介面／下一跳，再依輸出鏈路重新加上該跳的 header 與 trailer。這讓相同的 IP 資料能經過不同媒介。\n每跳的 frame 位址可變；在沒有 NAT 的例子中，端到端的來源與目的 IP 通常相同。Router 仍會更新 IPv4 TTL 和相關 header checksum。","Router removes the incoming link header, routes by destination IP, then encapsulates the packet for the next link。"),
    S(41,"跨 Wi-Fi 與 Ethernet 的圖","Wi-Fi|Ethernet|Router","圖把不同 Wi-Fi 與 Ethernet 區域接成互連網路。各區域可用不同的實體媒介和 frame 格式，router 在邊界負責 IP 層轉送。\n讀圖時，沿著一筆資料依序找起點、第一台 router、中間的網段和目的地。每進入下一條 link 都可能換外層 frame。"),
    S(42,"Gateway 與 Router","Default Gateway|Router","Gateway 廣義上是通往另一系統的入口。講義著重可在不同協定或應用間轉換的 gateway，例如轉接不同格式的通訊。Router 常負責 IP 路由。\n另一常見用法是 default gateway，指主機將目的在本地子網之外的 IP 封包交給的本地路由器。看到題目要先辨認用法。"),
    S(43,"Firewall 防火牆","Firewall","Firewall 依規則允許或封鎖流量，可在邊界設備或單台主機上。規則可看來源、目的、port、協定，以及連線狀態。例：允許對外提供的 HTTPS，封鎖從外面連進管理埠。\n一道規則應能說清楚哪類流量可過，不能只寫『陌生人全部擋掉』。防火牆可減少暴露面，允許通過的流量仍要由應用程式安全處理。"),
    S(44,"有線與無線媒介","Fiber Optic Cable|Ethernet","媒介是承載訊號的材料或空間。銅線以電訊號傳遞；光纖以光訊號傳遞；無線媒介則透過空間傳遞電磁波。\nEthernet 定義一族傳輸技術，可使用銅纜或光纖。要比較媒介時，通常看距離、速率、布線成本與抗電磁干擾能力。"),
    S(45,"銅線與訊號衰減","","銅纜容易取得、安裝與端接，常用在室內 LAN。距離增加時訊號通常衰減；干擾、接頭品質及線材類別也會影響接收。\n比較室內短線和跨棟長距離時，銅線常見於前者；若要長距離或避開嚴重電磁干擾，可以考慮光纖。"),
    S(46,"Coaxial Cable 同軸纜線","","同軸纜線由中央導體、絕緣層、外側屏蔽與外皮構成，屏蔽有助減少干擾。講義的 10–100 Mbps 與最大 500 m 應依範例讀取。500 m 是早期 10BASE5 網段的典型規格。\n傳輸上限屬於特定系統的規格，題目若指定技術或講義表格，就使用其條件。"),
    S(47,"STP 有屏蔽雙絞線","Twisted Pair","STP 將導線成對絞繞，另有金屬屏蔽以抑制電磁干擾。絞繞本身可降低串音，屏蔽效果也仰賴正確端接與接地。\n講義範例列 100 m，速率視線材與 Ethernet 規格。馬達或工業設備附近可能會考慮屏蔽線材或光纖。"),
    S(48,"UTP 無屏蔽雙絞線","Twisted Pair","一般 Ethernet UTP 有四對、共八根具絕緣皮的銅線。成對絞繞有助控制串音，UTP 缺少額外金屬屏蔽，因此好佈線且常較便宜。\n講義列 10、100、1000 Mbps 和常見 100 m 通道長度。實際速率與距離依 Cat 類別、設備和對應規格判斷。","UTP uses twisted pairs without additional shielding；STP adds shielding against EMI。"),
    S(49,"UTP 接頭與端接","","常說的 Ethernet RJ-45 接頭外觀有八個位置、八個接點，技術描述常寫 8P8C。RJ 是 Registered Jack；課堂可用 RJ-45 稱呼。EIA/TIA 相關布線規範用於接線及連接器安排。\n排查短線時，可查看插頭卡榫是否固定、接點是否壓接妥當、兩端線序是否符合設計。p.114 有實物圖。"),
    S(50,"行程之間如何交換資料","Client/Server|P2P","這裡改用「行程」來看 client/server 和 P2P。Client 行程先聯絡長時間等請求的 server 行程。P2P 中對等行程可向對方發起通訊，也能服務對方，個別 peer 可短暫上線。\n同一台主機能執行多個角色。角色由這次通訊中的行為定義，與主機外觀或硬體等級無關。"),
    S(51,"兩種角色模型圖","Client/Server|P2P","Client/server 圖先找共同服務中心和指向中心的請求。P2P 圖則找可以直接互相請求或分享資料的 peer；系統也可能另外有登入或配對服務。\n例：校務系統靠集中服務；分散分享檔案時，每個 peer 可分別從多台取得區塊，也分享自己已收到的區塊。"),
    S(52,"Cluster、Grid、Cloud","Distributed System|Cluster Computing|Grid Computing|Cloud Computing","Distributed system 的組件在不同電腦上透過網路協作。Cluster 常在同一 LAN 使用相似節點，耦合較緊密。Grid 可整合跨地點、不同所有者或硬體的資源，常將可切分任務交給各節點。\nCloud 重點在按需提供服務、抽象化基礎設施，例如租用 EC2 或使用雲端文件。FutureGrid 是講義舉的實驗環境。分類看資源如何協作或交付；雲端提供者底層也能使用 cluster。","Cluster 是 tightly coupled 的近端節點；Grid 彙整地理分散資源；Cloud 提供 on-demand services。"),
    S(53,"Cloud Computing 的核心","Cloud Computing|Virtualization|Resource Pooling","雲端把運算、儲存、網路或軟體包裝成可透過網路取用的資源。使用者需要時可申請或釋放，供應商在背後分配機器、網路與儲存。虛擬化常用來隔離及配置資源。\n講義以電網類比，使用者關注用量和服務，供應商處理底層供應。SLA 可以約定可用性等服務水準。"),
    S(54,"雲端特性圖","Rapid Elasticity|Resource Pooling","原圖以 Utility Computing 為核心。Scalability／Elasticity 是按需求擴充或縮減，依靠 dynamic provisioning 與多租戶設計。Availability／Reliability 是靠容錯、系統韌性與安全讓服務持續運作。Performance optimization 可用平行處理、負載平衡和工作排程。\nAccessibility／Portability 強調統一存取及 thin client；Manageability／Interoperability 涵蓋自動控制、監控和計費。SLA 約定服務水準，QoS 描述效能要求。NIST 也用自助取用、廣泛網路存取、資源池、快速彈性、計量服務五項特性描述雲端。"),
    S(55,"IaaS：租基礎設施","IaaS","供應商提供運算、網路、儲存等基礎設施，使用者可部署自己的作業系統與應用程式，並配置允許控制的網路資源。實體伺服器、機房與虛擬化基礎通常由供應商管理。\n例：租一台 EC2 VM，自己選 OS 映像檔、裝套件、更新系統和啟動網站。Eucalyptus、OpenNebula 是講義舉的基礎設施雲管理工具。"),
    S(56,"PaaS：部署自己的應用","PaaS","供應商提供可執行程式的環境，使用者部署自己寫的應用，通常管理程式與部分環境設定。底層機器、OS 和執行平台由供應商維護。\n例：把 Python 網站部署到 App Engine。Azure 有多種服務，須看題目指定的產品；Hadoop 是分散式資料處理框架，受管理的 Hadoop 服務才有平台交付的意義。"),
    S(57,"SaaS：直接使用應用","SaaS","供應商提供已完成的應用程式，使用者透過瀏覽器或其他用戶端使用它，通常只調整帳號、個人偏好或工作區設定。以 Gmail、Google Docs 為例，開瀏覽器就能完成寄信、寫作或共同編輯。\n做題時問『我在用成品、部署程式，還是管理自己的 OS？』三個答案依序是 SaaS、PaaS、IaaS。","IaaS 管 OS 和應用；PaaS 管部署的應用；SaaS 使用供應商的應用。"),
    S(58,"Internet 是全球互連","Internet","大寫 Internet 是遍布全球的互連網路。它連接不同規模、由不同組織營運的網路，這些網路透過共同的 IP 協定交換封包。路由可使用替代路徑，設計上有助因應局部故障。\n如果看到 internet 小寫，通常只在說多個網路互連形成的系統。"),
    S(59,"封包如何穿越 Internet","Packet Switching|Router|ISP|Web Server","主機經 ISP 接入，封包由一跳一跳的 router 轉送，最後到目的伺服器。轉送按路由資訊與政策決定；條件改變時後續封包可能走不同路徑。\n即使瀏覽器與伺服器使用 TCP，TCP 的連線仍是邏輯狀態。底層通常繼續用封包交換，沒有一條固定專線為這次瀏覽保留。"),
    S(60,"ISP、Peering 與 Transit","ISP|Peering","ISP 讓家庭或學校接入 Internet。講義以 tier 說明網路互連：Tier 1 仰賴免費互惠 peering 取得全域可達性；Tier 2 對部分目的地購買 transit，並可與其他網路 peering；Tier 3 典型上向上游購買 transit 連外。\nPeering 是對等交換彼此可達的流量；transit 是付費請對方幫忙到更廣的 Internet。接取方式可包括熱點、電話線 DSL、纜線、衛星、光纖。","Peering 讓網路互換流量；transit 由上游提供更廣泛的可達性。"),
    S(61,"Internet 組成圖","ISP|Peering","圖題由使用者接取網路往外讀：端點先接 access ISP，再由 ISP 的上游或對等網路轉送。骨幹承載大範圍跨網路流量。相鄰 ISP 也可直接交換流量，路徑並非都要先到同一個中心。\n畫箭頭時可標「設備 → 接取網 → ISP 互連 → 目的地網路」，並解釋跨 ISP 連接取決於其協議與路由。"),
    S(62,"IP 位址、網域與 TLD","IP Address|IPv4|IPv6|Domain Name|TLD|DNS","IPv4 用 32 bits，常寫為四段十進位；IPv6 用 128 bits，常寫為冒號分隔的十六進位。人較容易記住 domain name，DNS 可將名稱查成 IP 等資料。\n在 mail.example.org 中，最右邊的 .org 是 TLD，example.org 是上層網域，mail 是下一層名稱。TLD 包含 .com、.org、.gov 等，也有 .au、.ca 等國碼。"),
    S(63,"ICANN 與位址管理","ICANN|ISP","講義概述 IP 分配與網域管理。更完整的鏈條是 IANA 依政策向區域網際網路註冊管理機構（RIR）配置位址資源，再由各區機構配置給 ISP 或其他組織。\n網域註冊也有不同角色：registry 管理某個 TLD 的登錄資料，registrar 向使用者提供註冊服務。DNS 解析則是查資料的程序。"),
    S(64,"IP 位址屬於網路介面","IPv4","Router 常有多個介面，每個介面連到某條 link、可配置各自的 IP。主機可能同時有 Wi-Fi 和有線介面，兩個介面也可能各有位址。\nIPv4 的 223.1.1.1 是四個 8-bit octet：11011111 00000001 00000001 00000001。辨認子網前先搞清楚位址是連哪個介面。"),
    S(65,"Subnet 子網路","Subnet|Network Prefix|Host Portion","IPv4 位址可依前綴長度分成高位的 network prefix 與低位的 host portion。同一子網的介面在圖中能透過其共同鏈路直接到達，中間不需跨 router。\n原圖有三組：223.1.1.x、223.1.2.x、223.1.3.x。Router 雖然是同一台，但連到三組的三個介面分別屬各組。共同前幾段只是 /24 例子的快速判斷，遇到 /23、/26 要按 bits 判。"),
    S(66,"切開介面找子網","Subnet Mask|Network Address|Broadcast Address|Subnet","想像把每個介面從 router 機身分開，再看剩下哪些介面仍透過同一個局部網路連接。每個獨立區域是一個子網。圖中的三組是 223.1.1.0/24、223.1.2.0/24、223.1.3.0/24。\n/24 意味 mask 有 24 個前導 1，也就是 255.255.255.0。用 IP AND mask 可算 network address。一般 /24 的 .0 代表網路、.255 代表廣播，其餘 254 個是一般主機位址。","Network address = IP address bitwise AND subnet mask；router 的不同介面可屬不同子網。"),
    S(67,"三個 LAN 加三條路由器鏈路","Subnet|Router","原圖三個 router 彼此以三條鏈路接成三角形，此外各自連一個 LAN。三個 LAN 為 223.1.1、223.1.2、223.1.3；router 間三組示例為 223.1.7、223.1.8、223.1.9。依圖共有六個子網。\n常漏數的是 router-to-router link。投影片未指定三條點對點鏈路的 mask；計數靠連線圖和位址分組，避免把 /24 的 .0 規則套到所有前綴。"),
    S(68,"CIDR 前綴計算","CIDR|Prefix Length|Subnet Mask|Network Address|Broadcast Address","CIDR 用 a.b.c.d/x 表示前 x 個 bits 是前綴。200.23.16.0/23 的 mask 是 255.255.254.0，第三段以 2 為一區塊，含 16、17，最後一段有 256 種。網路位址 200.23.16.0，廣播 200.23.17.255。\n/23 留 9 個 host bits，所以總共 512 個位址，一般情況可配 510 個。例：200.23.17.4 屬於該網；200.23.18.4 落在下一個 /23。","Write the prefix length first；將 IP AND mask 求 network address，再把 host bits 全設 1 求 broadcast address。"),
    S(69,"主機取得 IP 的兩種方式","DHCP","管理者可手動設定 IP、mask、閘道與 DNS，稱 static configuration；也可由 DHCP 動態發放。後者讓裝置連線時自動取得設定，適合大量電腦或頻繁移動的用戶。\n例：伺服器可依管理政策固定 IP；同一台筆電在宿舍、教室和家中常分別向當地的 DHCP 取設定。"),
    S(70,"DHCP 四個步驟","DHCP|DHCP Discover|DHCP Offer|DHCP Request|DHCP ACK|Lease","初次取得位址常用 DORA。Discover 找可用 DHCP server；Offer 由伺服器提出設定；Request 由 client 表明選哪份 offer；ACK 確認配置與租約。已有租約的續租或特定重連流程可能從 Request 開始。\nLease 到期前可更新。有效的租約使伺服器能追蹤使用中的位址，並於適當時機重新發放。","Discover → Offer → Request → ACK。Offer 是提出，ACK 是確認。"),
    S(71,"DHCP 配給哪個子網","Subnet","圖中剛到的 client 接在 223.1.2.0/24，應取得這個子網可用的位址。圖上的 DHCP server 服務此網段。即使 client 起初沒有一般 IP，也能透過本地 broadcast 找伺服器。\n若 server 放在其他子網，實際網路可由 DHCP relay 在兩側代轉，讓伺服器知道 client 來自哪個網段。"),
    S(72,"DHCP 封包圖的欄位","UDP|Port Number|Broadcast Address|DHCP ACK","圖中的 DHCP server 為 223.1.2.5，提供 223.1.2.4 與 3600 秒租約。初始 client 可用 0.0.0.0:68 → 255.255.255.255:67，server 使用 UDP 67，client 使用 UDP 68。Offer／ACK 的 yiaddr 欄位表示提供給 client 的 IP。\nTransaction ID 讓回覆對上交易。圖示把 Discover/Offer 配成 654、Request/ACK 配成 655；考圖時辨認配對即可，正式協定的重送和租約狀態另有規則。","Client UDP 68；server UDP 67；首次尋找時可使用 limited broadcast 255.255.255.255。"),
    S(73,"DHCP 還能給哪些設定","Default Gateway|DNS Resolver|Subnet Mask","除了 IP，DHCP 可給 subnet mask、第一跳 router 的 IP、DNS server 等設定。Mask 用來判斷目的是否同網段；default gateway 幫忙轉送遠端封包；DNS server 用於查網域。\n例：本機能 ping 已知公網 IP 卻無法用網站名稱，可能是 DNS 設定；只到得了同子網、到不了遠端，優先查 gateway 或路由。"),
    S(74,"名稱查位址與反向查詢","DNS|A Record|AAAA Record|PTR Record","DNS 將 domain name 查成相應記錄。查 IPv4 常用 A、IPv6 常用 AAAA。反向查詢可利用 PTR 取得與 IP 相關的名稱，是否有回覆取決於反向區域是否配置。\n同一網域可有多個 IP，一個 IP 也可服務多個名稱。DNS 也有郵件 MX 等記錄，因此理解為分散式名稱資料庫比『電話簿』更完整。"),
    S(75,"分散式資料庫與階層名稱","Port Number|DNS Resolver|TTL|DNS Cache","DNS 由許多 server 分工，沒有一台機器存全部記錄。右側名稱較靠近根，例如 .com → google.com → mail.google.com。一般查詢可使用 UDP 53，DNS 也使用 TCP 53，例如截斷後重試或區域傳送。\nResolver 可依 TTL 暫存回答或轉介。快取命中可省下上游查詢；過期後須重新取得資料。DNS TTL 是記錄可快取的秒數，和 IP TTL 的跳數角色不同。"),
    S(76,"Root Name Server 與 Anycast","Root Name Server|TLD Name Server|DNS Resolver|Referral","當快取無法回答時，resolver 可從 root 開始。Root 通常回覆所查 TLD 的伺服器位置，如 .com，讓 resolver 繼續查。原圖是歷史分布；根伺服器系統有 13 個邏輯識別，各識別可透過全球多個實體 instance 提供服務。\nAnycast 讓多個站點宣告同一服務位址，路由把請求帶到所選站點。這能分散流量並減少部分使用者延遲。"),
    S(77,"DNS 的根與分支","TLD|Delegation","原圖從 Root 往下看到 arpa、com、edu、org、ad、zw 等 TLD，再繼續分支。DNS 的管理權可以從父區委派給子區。\n例如根區委派 .edu，.edu 再提供某校網域權威伺服器的線索。要找一個名稱所在分支，通常從最右邊辨認 TLD。"),
    S(78,"Label 與完整名稱","Domain Name","原圖的 challenger.atc.fhda.edu. 由 label challenger、atc、fhda、edu 組成，最後的點表示 root。沿樹由節點往根拼接可得到完整名稱。\n例如單獨的 challenger 只有一個 label，atc.fhda.edu. 是其上一層完整名稱。平常瀏覽器常省略尾端 root 的點。"),
    S(79,"Domain 是命名樹的一個子樹","Subdomain|Delegation","原圖以不同色塊標出 .com、.edu 和其中的下層 domain。Domain 以某節點為根並涵蓋其後代，可以有 subdomain。\nZone 是一組由同一管理責任提供的 DNS 資料。若父管理者委派一個子網域，父 domain 仍在命名樹上包含它，但該子區的實際記錄可由別的權威伺服器維護。"),
    S(80,"權威名稱伺服器的分工","Authoritative Name Server|TLD Name Server|Root Name Server","原圖上層 root server，下方有 arpa、edu、com、us 等不同管理範圍的伺服器，再到 fhda.edu、mcgraw.com 等下層。圖表呈現管理責任可分散，不代表每個 zone 只有一台伺服器。\n權威伺服器對自己負責的 zone 提供資料；resolver 則依快取或去問其他伺服器來回答 client。"),
    S(81,"Iterative 逐步查詢","Iterative Query|Referral|DNS Resolver|DNS Cache|Authoritative Name Server","Iterative 的受詢者給目前可提供的答案或下一站 referral。原圖讓查詢端分次向多台伺服器送請求；常見實作是本地 resolver 幫 client 做上游迭代。\n例：resolver 問 root 得到 .com 線索，問 .com 得到 example.com 的權威位置，問權威取得 A 記錄。每一步由查詢端根據回覆接著問。","Iterative query returns an answer or referral；查詢端自行追下一個伺服器。"),
    S(82,"Recursive 遞迴查詢","Recursive Query|Iterative Query|DNS Resolver","Recursive query 要受詢者代為追查並回傳最終答案或錯誤。原圖由被詢問的一端代問更上層，再沿原路回傳。現實常見是 client 對本地 resolver 要求 recursion，而 resolver 對 root、TLD、authoritative 採迭代。\n判斷看『誰要去問下一站』。第一次問誰與回答怎麼回來可分開畫，勿把 client 對 resolver 的模式和上游模式混成一種。","Recursive = queried resolver obtains and returns the final result；iterative = requester follows referrals。"),
    S(83,"早期 Internet 應用協定","FTP|SSH|HTTP|SMTP|POP3|IMAP","NNTP 用於網路新聞群組；FTP 傳檔；Telnet 與 SSH 都能遠端登入，SSH 提供加密。HTTP 讓瀏覽器與網站交換請求和回應。\n郵件流程：寄件用戶端或寄件 server 以 SMTP 提交／中繼，收件 server 儲存郵件，收件者可用 POP3 下載，或用 IMAP 同步 server 上的資料夾、已讀等狀態。","SMTP sends or relays mail；POP3 downloads it；IMAP synchronizes mailbox state。"),
    S(84,"SMTP 對話逐行讀","SMTP","原卷講義的範例先由 server 回 220，client 送 HELO，指定 MAIL FROM 和 RCPT TO，再用 DATA 開始郵件內容；單獨一行句點結束內容。Server 回 250 接受後，client 送 QUIT，server 回 221。\nSMTP envelope 的寄件與收件位址和郵件內可顯示的標頭是不同層次。354 表示可以開始傳本文，250 表示命令或提交成功。"),
    S(85,"VoIP、串流與 CDN","VoIP|Unicast|Multicast|CDN","VoIP 把語音當資料傳，延遲和抖動太大時會影響對話。串流可在資料陸續到達時播放，buffer 吸收部分到達時間變動。\nN-unicast 是分別送 N 份到 N 個接收者；multicast 讓共用路段只送一份，到分支再複製。點播由個人選時間及進度。CDN 把內容放在靠近使用者的節點，縮短部分路徑並分散來源站負載。"),
    S(86,"Internet 上的 World Wide Web","World Wide Web|Browser|Web Server|URL|HTTP","Web 是透過網路存取相互連結文件及其他資源的系統。瀏覽器請求 URL 所指資源，伺服器回應內容，瀏覽器再顯示。Hyperlink 讓頁面指向其他資源。\nURI 是識別資源的通稱；URL 提供定位資源所用的資訊，例如存取方式與位置。Internet 還承載 Web 以外的郵件和其他服務。"),
    S(87,"拆一條典型 URL","URL","原圖的 http://eagle.mu.edu/authors/Shakespeare/Julius_Caesar.html，可分出 scheme http、host eagle.mu.edu、目錄路徑及文件名稱。現代網站路徑常由應用程式處理，也可能對應到檔案。\n例如 https://example.org/search?q=dns#results，?q=dns 是 query，#results 是 fragment，通常由瀏覽器定位而不送進 HTTP request。","URL supplies scheme, host and resource location；以 /、?、# 分辨路徑、查詢與片段。"),
    S(88,"HTML 的標籤和屬性","HTML","HTML 以文字和標籤描述文件結構。h1 是主標題、p 是段落，a 搭配 href 指定連結目標，img 搭配 src 指定圖片來源。\n以 <a href='page2.html'>下一頁</a> 為例，a 是標籤，href 是屬性，下一頁是顯示文字。HTML 表達內容結構，呈現樣式可以交由 CSS，互動可用 JavaScript。"),
    S(89,"簡單網頁的 HTML 原始碼","HTML","原圖從 html 根元素開始，head 放 title 等文件資訊，body 放 h1 標題及 p 段落。title 可出現在瀏覽器分頁，h1 顯示在頁面內容。\n檢查配對時把巢狀想成一棵樹：body 之下有 h1 和 p，結束子元素後才結束 body。"),
    S(90,"瀏覽器呈現簡單網頁","HTML","本頁呈現上一頁的程式碼效果：h1 顯示成醒目主標，p 顯示成一行文字。原圖雖然寫 Click here for another page，這段仍是純段落文字。\n瀏覽器根據 HTML 建立文件結構，再套用預設樣式或 CSS。把字寫成『Click here』本身不會產生連結。"),
    S(91,"把單字變成可點的連結","","原圖在段落中用 <a href='http://crafty.com/demo.html'>here</a> 包住 here。開標籤設定目標，結束標籤限定連結文字範圍。\nhref 可放絕對 URL，也可放相對路徑，例如 ./demo.html。連結顯示給人看的字和真正的目標位置是兩份資料。"),
    S(92,"瀏覽器呈現超連結","","和 p.90 版面幾乎相同，但原圖的 here 已有超連結樣式並可點擊。瀏覽器依 href 導航，若為相對路徑，會以目前文件的基準位置解出目標。\n能用鍵盤聚焦、啟動是連結的實際行為。只從顏色判斷容易混淆，因為 CSS 可以改變連結和普通文字的外觀。"),
    S(93,"XML、SGML 與語意網","XML|HTML","XML 是可定義自身標籤的標記語言，可用來標明資料種類及結構。語法要求標籤配對、區分大小寫、屬性值加引號，並有單一根元素。XML 承繼 SGML 的標記語言概念。\n例如 HTML 的 p 有既定用途；自訂 XML 的 measure 則由其應用規範定義。語意網強調機器能辨認資料的意義或關係，仍需要共同的詞彙和規則。"),
    S(94,"以 XML 表達樂譜","XML","講義示意 staff 根元素搭配 clef 屬性，再以 key、time、measure、rest、notes 表示調、拍號、小節、休止與音符。第一小節寫八分休止後三個八分 G，下一小節寫二分音符。\n這是投影片自訂的示意標記。真正交換資料時會用定義好的 schema 或規格確認欄位、名稱和合法值。"),
    S(95,"從結構化資料回到五線譜","","原圖是貝多芬第五號交響曲開頭兩小節。第一小節是八分休止和三個八分 G，第二小節是二分 E♭。上一頁寫 E，原圖的 C minor 調號含 E♭，呈現程式要理解調號與音符的互動。\n這兩頁用同一內容展示兩個層次：XML 讓程式讀到音符與拍號，繪譜程式再決定五線譜畫法。"),
    S(96,"MathML 表達算式","","MathML 用標記描述數學式的結構。原圖以二次方程根公式為例，分數由 mfrac 表示，上下子元素對應分子與分母；平方根、上標、水平群組可分別用 msqrt、msup、mrow。\n如果只存一張公式圖片，程式未必能知道哪部分是根號內；結構化標記讓程式能按樹狀關係排版和存取。"),
    S(97,"Client-side 與 Server-side","JavaScript","Client-side 指在用戶端執行，例如 JavaScript 在瀏覽器更新畫面。Server-side 指在伺服器執行，例如驗證登入、查資料庫，再回傳 HTML 或 JSON。JavaScript 也能在伺服器跑，分類要看執行位置。\n投影片列 Flash 為歷史用戶端技術；CGI、Servlet、JSP、ASP、PHP、Python、Perl 是各種服務端程式或介面例子。需要保護的資料或憑證應由伺服端控管。","Client-side code runs in the browser/device；server-side code handles requests on the server。"),
    S(98,"協定為什麼要分層","Protocol Stack","上層關心應用內容與端到端傳送，下層關心路由、逐跳鏈路和訊號。分層讓每一層依賴下方提供的服務，對接收方同層則有對應的協定格式。\n例如 HTTP 可以透過 TCP/IP 傳，IP 又能在 Ethernet 或 Wi-Fi 上承載。換本地媒介時，不需重寫整個 HTTP 應用。"),
    S(99,"寄包裹類比","Encapsulation|Payload","寄件者先準備物品，物流把包裹裝到容器，航空公司再用自己的運輸流程送出。到對方後按相反順序拆封。原圖也畫出中途換飛機，類似資料走過不同鏈路。\n類比的重點是每層增加自己所需資訊。轉運站只需處理該步路線，不必開封查看收件人應用的訊息內容。"),
    S(100,"封裝與解封裝流程","Segment (TCP)|Datagram|Packet|Frame|Encapsulation","送端應用資料先加 TCP/UDP 資訊成 segment/datagram，再加 IP header，最後放進 link frame（可能有 header 與 trailer），由實體媒介送 bits。原圖把 Data Link 和 Physical 分列，四層 TCP/IP 則常將兩者放進 link/interface 層。\n接收端按逆序拆開，根據各層標記交給下一個處理模組。Router 逐跳處理外層 frame 和 IP 資訊；終點才交給相應的 transport 和 application。"),
    S(101,"Internet 四層各做什麼","Application Layer|Transport Layer|Network Layer|Link Layer|Port Number","Application 形成和解讀應用訊息；Transport 提供程序間傳輸，TCP 可切分位元流並依序交付；Network 以 IP 處理跨網路位址和路由；Link 負責同一跳的傳送。\n做題記地址層級：應用常看到 URL 或網域，transport 看 port，network 看 IP，Ethernet 等 link 看 MAC。應用程式不必逐跳決定每個 MAC。"),
    S(102,"IPv4 Header 欄位","DF|MF|Fragment Offset|TTL","Version 表明 IP 版本；IHL 記 header 的 32-bit words 數，最小值 5 代表 20 bytes；Total Length 包含 header 與 payload。舊 Type of Service 欄位現用於 DSCP/ECN。ID、DF、MF、offset 支援分片處理。\nTTL 每經過 router 通常減 1，降到 0 時丟棄；Protocol Number 指明內容交給 TCP、UDP 等；Header Checksum 只檢查 IPv4 header。另有來源／目的 IP 和選用欄位。無 options 時 IPv4 20 bytes 加 TCP 最小 20 bytes，未含 link 與 application overhead。"),
    S(103,"MTU 與 IPv4 分片","MTU|IPv4 Fragmentation|DF|MF|Fragment Offset","MTU 是該鏈路可承載的最大網路層封包大小，例如 Ethernet 常見 IP MTU 1500 bytes，計算時不加 Ethernet header。IPv4 datagram 超出輸出 MTU 且允許分片時，可分成多個有各自 IP header 的 fragments。\n原圖在目的主機才做 reassembly；ID 與來源／目的 IP、協定協助辨認同一原封包，offset 指資料位置。IPv6 的中途 router 不做分片，由來源端在需要時處理。"),
    S(104,"例題：4000-byte IPv4 datagram","MTU|MF|Fragment Offset","原 IP datagram 長 4000、header 20，所以 payload 3980。MTU 1500 時，前兩片各載 1480 data，最後一片載 1020。各片都加自己的 20-byte header，總長是 1500、1500、1040。\nOffset 單位是 8 bytes，因此分別為 0、1480/8 = 185、2960/8 = 370。ID 相同，MF 為 1、1、0。若 MTU−header 不能被 8 整除，非最後片取可容納的最大 8 倍數。","先扣 header 算 data，再用累積資料量除以 8 求 offset；只有最後片 MF=0。"),
    S(105,"TCP 和 UDP Header 對照","TCP|UDP|Port Number|Sequence Number|Acknowledgment Number","TCP 和 UDP 都有來源、目的 port 和 checksum。TCP 另有序號、確認號、flags、window、urgent pointer、選用欄位等，最小 header 20 bytes。UDP header 有來源 port、目的 port、length、checksum 四項，共 8 bytes。\nTCP sequence number 是位元組流中的位置；ACK number 通常指下一個期待的位置。UDP length 包含 header 和 data。TCP data offset 表示 header 長度，和 IPv4 fragment offset 作用不同。"),
    S(106,"逐跳設備如何處理一則訊息","Router|Network Layer|Link Layer","圖由來源的 application 往下到 link，再沿中間設備逐跳通過 network/link，最後到目的地往上交給 transport/application。Router 要取出 IP packet 以決定出路，換用下一跳的 link frame。\n因此同一則訊息可經過許多 frame。傳輸層的資料通常由端點處理，例如目的主機用 port 交給正確 socket。"),
    S(107,"TCP/IP Protocol Suite","Protocol Stack|TCP|UDP|IPv4|IPv6","TCP/IP 是一組協定。TCP 和 UDP 同在 transport 層；IP 在其下方的 network/internet 層，包含 IPv4 和 IPv6。應用層的不同服務能選 TCP 或 UDP，底下仍可透過 IP 跨網路。\n例如 SMTP 通常使用 TCP；DHCPv4 使用 UDP；DNS 兩種傳輸協定都會用到。"),
    S(108,"TCP/IP Stack 與 OSI","Protocol Stack|OSI","講義採 TCP/IP 四層。最底的 network interface/link 對應 OSI Physical + Data Link；Internet 對應 Network；Transport 對應 Transport；Application 約涵蓋 Session、Presentation、Application。\n同一份課有圖將物理媒介另外畫出成五列。作答時照題目使用的模型，並寫清楚功能，避免把兩個模型的層號互換。"),
    S(109,"TCP/IP 下兩層","Network Prefix|Host Portion|Next Hop","Layer 1 Network Interface 讓資料在相鄰裝置間傳送，包含物理訊號和 frame；Layer 2 Internet 用 IP 跨越子網，查目的網路後送往適當下一跳。\nOSI 裡 router 常稱 Layer 3 device，但在講義此處從下往上數的 TCP/IP 四層圖中，Internet Layer 位於第二層。差異來自分層模型。"),
    S(110,"TCP/IP 上兩層","Transport Layer|Application Layer|TCP|Three-way Handshake|SMTP|FTP","Transport 層的 TCP 通常先建立連線：SYN、SYN-ACK、ACK，雙方同步初始序號，再進行端到端傳輸。正確名稱是 Transmission Control Protocol。\n最上面的 Application 層包含實際用途的協定，例如 SMTP 負責郵件傳送，FTP 用於檔案傳輸。四層模型把 OSI 的 session/presentation 一併歸在上層。"),
    S(111,"什麼時候選 TCP 或 UDP","TCP|UDP|Datagram|Retransmission|Flow Control|Congestion Control","TCP 提供可靠、有序的 byte stream，透過 ACK、重送、流量與壅塞控制維持傳輸；建立連線和恢復丟包會有成本。UDP 保留 datagram 邊界、header 短，自己不提供連線建立、重傳或排序。\n檔案要完整有序常選 TCP；部分即時語音可選 UDP 並由應用處理遺失。UDP 之上的協定也能自行實作可靠性，因此應按需求判斷。","TCP gives reliable, ordered byte stream；UDP gives lightweight datagrams, with no built-in retransmission or ordering。"),
    S(112,"Multiplexing 與 Demultiplexing","Port Number|SMTP|HTTP|DNS|DHCP","發送端讓多個應用共用網路，transport 加上 port，IP 加上協定欄位和位址。接收端先依 IP Protocol 找 TCP/UDP，再由 transport 將資料送至適當 socket。圖示例 SMTP、HTTP 走 TCP，DNS、DHCP 可走 UDP。\n兩個 TCP client 同時連到伺服器 443 仍能分開，TCP 連線可由來源 IP、來源 port、目的 IP、目的 port 四項辨認。Port 與實體設備的連接埠是不同的名詞用法。"),
    S(113,"網路通訊協定地圖","OSI|Protocol Stack","原圖是一張涵蓋多種網路家族的總覽。先抓課堂關注的分層關係：例如 HTTP／SMTP／DNS 屬應用，TCP／UDP 屬 transport，IP 跨網路，而 Ethernet／Wi-Fi 處理本地鏈路。\n圖中的欄位、顏色、連線是分類索引。可放大原圖查看需要的名稱；答題優先解釋某協定在網路的哪一層、為上一層提供哪種功能。"),
    S(114,"RJ-45 接線圖：568A 與 568B","","原圖左側是兩種線序，T568A 的 1、2 腳是白綠、綠，T568B 的 1、2 腳是白橙、橙，橙綠兩對交換位置，藍棕對維持。兩端採同一方案是常見直通線；一端 A、一端 B 可形成傳統 10/100 Ethernet crossover。\n現代許多設備支援 Auto-MDI-X，自動處理收發對的安排。做圖題以 pin 編號和顏色順序為準。"),
    S(115,"Cybersecurity：攻擊與防禦","Malware|Phishing|DoS|DDoS|Firewall","Virus 常附在宿主檔案或程式並隨執行感染；worm 能自行經網路散播；Trojan 偽裝成合法程式誘導執行；spyware 在背後蒐集資料；phishing 用假訊息或頁面誘取帳密。\nDoS 讓服務無法正常使用，若由多處同時攻擊則稱 DDoS。Spam 是大量不請自來的訊息。Firewall 管網路流量，spam filter 篩郵件，proxy 作中介，antivirus 偵測處理惡意程式。"),
    S(116,"HTTPS、憑證與數位簽章","HTTPS|TLS|Public-key Encryption|Public Key|Private Key|Digital Certificate|Digital Signature|CA|Symmetric Encryption","HTTPS 是透過 TLS 保護 HTTP，SSL 是歷史協定名稱。TLS 用憑證協助驗證伺服器，建立工作階段金鑰後通常使用對稱加密保護資料。CA 簽發的憑證把名稱與公鑰綁定，瀏覽器可驗證信任鏈與名稱。\n為了機密性，可用收件者公鑰加密、收件者私鑰解密。為了驗證簽署者與內容完整性，用簽署者私鑰簽章、公鑰驗證。兩種用法的金鑰方向相反。","Confidentiality uses recipient public key → recipient private key；signature uses signer private key → signer public key。"),
    S(117,"Alice、Bob、Carol 的公鑰圖","Public Key|Private Key","Alice 和 Carol 都可拿 Bob 的 public key 加密給 Bob；只有持有 Bob private key 的人能解密。即使 Carol 持有同一把公開金鑰，也不能靠它解開 Alice 已加密的訊息。\n用 Bob 的公鑰加密可以保護內容，但任何人都能用那把公鑰送資料，無法只憑加密斷定是 Alice 寄的。驗證寄件者要另外考慮簽章與公鑰來源。"),
    S(118,"網路安全相關的美國法律","","投影片列舉美國法律。CFAA 與未經授權的電腦存取等相關；ECPA 涵蓋電子通訊與儲存通訊的保護規範；USA PATRIOT Act 涉反恐與部分調查權限；CALEA 與電信業者協助合法監聽的技術能力相關；ACPA 處理與商標有關的惡意網域搶註。\n課程層次記『縮寫、目的、典型情境』。例如搶註近似商標域名和未授權進入電腦是兩種不同題型。"),
    S(119,"Security 與 Privacy","Security|Privacy","Security 關心如何保護系統與資料免於未授權存取、修改或中斷。Privacy 關心個資何時被蒐集、誰能用、用來做什麼與保留多久。\n例：一個 app 把蒐集到的定位加密保護，做到了部分 security。如果服務本身不需要定位卻一直蒐集，仍有 privacy 問題。Privacy 可以透過資料最小化與明確用途配合 security 控制。","Security protects data and systems；privacy governs collection, use and sharing of personal information。"),
  ]
};


const rows = `Computer Network|電腦網路|一群透過媒介與共同規則交換資料的裝置。
Internet|網際網路|全球許多獨立網路以 IP 協定互連而成的系統。
Distributed System|分散式系統|多台電腦上的元件透過網路合作，完成共同服務或計算。
IETF|網際網路工程任務組|Internet Engineering Task Force，推動網際網路協定等技術標準。
ICANN|網際網路名稱與號碼指配機構|Internet Corporation for Assigned Names and Numbers，協調網域名稱及全球識別資源。
World Wide Web|全球資訊網|由 URL、HTTP、超連結等技術串起的網路資源系統。
Protocol|通訊協定|雙方共同遵守的訊息格式、傳送順序和處理規則。
PAN|個人區域網路|Personal Area Network，讓某個人附近的裝置互連。
Bluetooth|藍牙|常用於短距離周邊裝置的無線通訊技術。
LAN|區域網路|Local Area Network，在教室、辦公室等局部範圍內連接設備。
Ethernet|乙太網路|IEEE 802.3 有線區域網路標準家族，可在銅纜或光纖上傳送 frame。
MAN|都會區域網路|Metropolitan Area Network，涵蓋一座城市或相近的都會區。
ISP|網際網路服務供應商|Internet Service Provider，提供用戶接入網際網路或對其他網路提供連通。
WAN|廣域網路|Wide Area Network，跨城市或更廣區域連接網路。
SAN|儲存區域網路|Storage Area Network，讓伺服器透過專用網路存取儲存資源。
VPN|虛擬私人網路|Virtual Private Network，利用公用網路上的受保護通道連接私有端點。
Encryption|加密|以金鑰和演算法把可讀資料轉成只有適當持鑰者可還原的形式。
Client/Server|用戶端／伺服器模型|Client 提出請求，Server 等待並提供服務。
P2P|點對點服務模型|Peer-to-Peer，端點可相互提出請求和提供資源。
Hub|集線器|在實體層把輸入訊號重送到其他埠的共享設備。
Switch|交換器|一般 Layer 2 switch 會學習 MAC 所在埠，再據目的位址轉送 frame。
Physical Topology|實體拓撲|看電纜、無線鏈路與節點在實際環境怎麼接。
Logical Topology|邏輯拓撲|看資料流或裝置取得共享媒介的方式。
Token Passing|權杖傳遞|端點輪流傳遞許可，拿到 token 的端點可發送資料。
Bus Topology|匯流排拓撲|多個節點共享一條主幹媒介。
Frame|訊框|資料鏈結層的傳輸單位，含該鏈路所需資訊及承載資料。
Collision|碰撞|兩個同時發送的訊號在共用媒介或接收端重疊，可能無法辨識。
Ring Topology|環狀拓撲|節點依序連接，首尾合成封閉迴路。
Repeater|中繼器|重生或轉送物理訊號來延伸傳輸距離。
Star Topology|星狀拓撲|多個裝置各有一條連線通往同一中心。
Access Point|無線接取點|AP，讓 Wi-Fi 用戶端接入本地網路。
Tree Topology|樹狀拓撲|多個支線中心分層連接，形成根和分支。
Bridge|橋接器|連接資料鏈結層網段並依 MAC 篩選、轉送 frame。
Mesh Topology|網狀拓撲|節點之間有多條互連路徑，可完整或部分互連。
Wi-Fi|無線區域網路技術|以 IEEE 802.11 為基礎的無線網路技術與認證品牌。
CSMA|載波感測多重存取|Carrier Sense Multiple Access，發送前感測共享媒介是否忙碌。
CSMA/CD|具碰撞偵測的 CSMA|Carrier Sense Multiple Access with Collision Detection，送的同時偵測碰撞，碰撞後隨機退避。
CSMA/CA|具碰撞避免的 CSMA|Carrier Sense Multiple Access with Collision Avoidance，藉聽取與退避等降低碰撞機率。
Random Backoff|隨機退避|每個競爭端點等一個隨機時間，降低再次同時發送的機率。
RTS/CTS|請求傳送／允許傳送|Request to Send／Clear to Send，讓附近端點知道有人預約通道。
Hidden Terminal|隱藏終端|兩個發送者彼此聽不到，卻都能到達同一接收端。
Router|路由器|依目的 IP 和路由資訊在不同網路間轉送封包。
NIC|網路介面卡|Network Interface Card，讓主機接上有線或無線網路。
MAC Address|媒體存取控制位址|Media Access Control address，在本地鏈路用來辨識介面的位址。
Collision Domain|碰撞網域|其中的裝置若同時在共享媒介送資料，彼此可能碰撞。
MAC Table|MAC 位址表|記錄 MAC 位址與所在的交換器埠。
Flooding|泛洪|把特定 frame 轉送到同一範圍內多個可用埠，通常排除入口。
Unknown Unicast|未知目的單播|目的 MAC 是單播，但交換器目前沒有相對應的埠紀錄。
Next Hop|下一跳|封包朝目的地前進時接下來要交給的鄰接設備。
OSI|開放系統互連模型|Open Systems Interconnection，描述通訊職責的七層參考模型。
Network Layer|網路層|用邏輯位址在多個網路間選擇和轉送封包。
Encapsulation|封裝|每一層將上層資料當作 payload，附上自身所需資訊。
Routing Table|路由表|記錄目的前綴、下一跳及輸出介面的選擇資訊。
Default Gateway|預設閘道|主機通常交付外部子網封包的本地路由器。
Firewall|防火牆|依安全規則控制哪些網路流量可以進出。
Fiber Optic Cable|光纖纜線|在細長纖維中導引光訊號，常用於高容量或長距離連線。
Twisted Pair|雙絞線|將兩條導線成對絞繞以抑制干擾的線材。
Cluster Computing|叢集運算|緊密連接的一群電腦一起完成工作或提供服務。
Grid Computing|網格運算|協調跨地區或管理單位的資源，將工作分給多個節點。
Cloud Computing|雲端運算|經網路按需取得供應商所管理的資源、平台或軟體。
Virtualization|虛擬化|用軟體抽象出虛擬機器、儲存或網路，讓多個工作負載共用底層設備。
Resource Pooling|資源池化|集中一組資源，按需求配置給不同使用者。
Rapid Elasticity|快速彈性|隨著負載變化快速增加或釋放容量。
IaaS|基礎設施即服務|Infrastructure as a Service，租用基礎運算、儲存與網路，使用者可管理 OS。
PaaS|平台即服務|Platform as a Service，提供執行平台讓使用者部署自己的應用。
SaaS|軟體即服務|Software as a Service，透過網路直接使用供應商的成品應用。
Packet Switching|封包交換|資料拆成封包，共用鏈路並由中間設備逐跳轉送。
Web Server|網頁伺服器|接受 HTTP 請求並回傳網頁、資料或其他資源。
Peering|對等互連|兩個網路直接交換其客戶或彼此可達網路的流量。
IP Address|IP 位址|網路層用來識別介面及路由的數字位址。
IPv4|網際網路協定第四版|使用 32-bit 位址，常寫成四段十進位。
IPv6|網際網路協定第六版|使用 128-bit 位址，常寫成冒號分隔的十六進位。
Domain Name|網域名稱|DNS 命名樹上的名稱，例如 www.example.org。
TLD|頂級網域|Top-Level Domain，根下第一層，例如 com、edu、tw。
DNS|網域名稱系統|Domain Name System，分散式、階層化的名稱與資源記錄查詢系統。
Subnet|子網路|共享前綴的一組介面，典型上在同一網段可直接互達。
Network Prefix|網路前綴|位址前端用來識別網路範圍的 bits。
Host Portion|主機部分|位址中未被前綴占用的位元，辨識子網內位址。
Subnet Mask|子網路遮罩|IPv4 用連續前導 1 表示前綴長度的 32-bit 遮罩。
Network Address|網路位址|IPv4 子網的基底位址，可由位址 AND 遮罩求出。
Broadcast Address|廣播位址|對一般 IPv4 子網，將 host bits 全設為 1 可求該子網廣播位址。
CIDR|無類別域間路由|Classless Inter-Domain Routing，以斜線和前綴長度表示位址範圍。
Prefix Length|前綴長度|斜線後的數字，表示從最左側開始有幾個網路位元。
DHCP|動態主機設定協定|Dynamic Host Configuration Protocol，自動提供位址租約和網路設定。
DHCP Discover|尋找伺服器|尚在尋找設定的 client 發送的 DHCP 訊息。
DHCP Offer|提出位址方案|Server 提供候選 IP、租約與設定的訊息。
DHCP Request|請求位址|Client 選擇某個提供方案或申請續租的訊息。
DHCP ACK|確認租約|Server 確認用戶端可使用其配置的位址及參數。
Lease|租約|DHCP 允許用戶端使用位址的有效期限。
UDP|使用者資料報協定|User Datagram Protocol，無須先建立連線的資料報傳輸，無內建重傳與排序。
DNS Resolver|DNS 解析器|代客戶端查詢 DNS 或從快取提供結果。
A Record|IPv4 位址記錄|讓名稱對應到 IPv4 位址的 DNS 記錄。
AAAA Record|IPv6 位址記錄|讓名稱對應到 IPv6 位址的 DNS 記錄。
PTR Record|指標記錄|常見於反向 DNS，用來由位址查關聯名稱。
TTL|存活時間|Time to Live，DNS 用來限制快取時間，IPv4 用來限制封包在網路停留的跳數。
DNS Cache|DNS 快取|暫存查詢結果或轉介，讓有效期限內的相同查詢更快。
Root Name Server|根名稱伺服器|對 DNS 根區提供權威資料，通常將解析器導向適當 TLD。
TLD Name Server|頂級網域伺服器|管理某 TLD 的資料與其下網域的委派。
Referral|轉介|回覆負責下一層的伺服器線索，查詢方可繼續追問。
Delegation|委派|父區將某子網域的管理責任交給指定權威伺服器。
Subdomain|子網域|某網域下的名稱分支，例如 mail.example.org 位於 example.org 下。
Authoritative Name Server|權威名稱伺服器|能對其管理區域直接提供有權威的 DNS 資料。
Iterative Query|迭代查詢|受詢者回手上答案或轉介，查詢方自行追下一站。
Recursive Query|遞迴查詢|要求受詢者代為解析，回傳最終答案或錯誤。
FTP|檔案傳輸協定|File Transfer Protocol，提供用戶端和伺服器間的檔案傳輸。
SSH|安全殼層|Secure Shell，提供加密的遠端登入、指令執行及相關通訊。
HTTP|超文字傳輸協定|Hypertext Transfer Protocol，定義 Web 用戶端和伺服器的請求及回應。
SMTP|簡單郵件傳輸協定|Simple Mail Transfer Protocol，用於提交或轉送郵件。
POP3|郵局協定第三版|Post Office Protocol version 3，常用於從伺服器下載收件。
IMAP|網際網路訊息存取協定|Internet Message Access Protocol，讓多裝置存取與同步伺服器上的信箱狀態。
VoIP|網路語音通訊|Voice over Internet Protocol，把語音數位化後經 IP 網路傳送。
Unicast|單播|送給一個目的端點的通訊。
Multicast|多播／群播|向特定接收群組傳送，網路可在分支處複製資料。
CDN|內容傳遞網路|Content Delivery Network，讓邊緣節點靠近使用者提供內容。
Browser|瀏覽器|請求、解讀和呈現 Web 內容的用戶端程式。
URL|統一資源定位符|Uniform Resource Locator，提供資源的定位與存取方式。
HTML|超文字標記語言|Hypertext Markup Language，使用標籤描述網頁內容的結構與語意。
XML|可擴展標記語言|Extensible Markup Language，允許應用定義自己的結構化資料標記。
JavaScript|JavaScript 程式語言|可在瀏覽器執行互動，也能在服務端的執行環境使用。
Protocol Stack|協定堆疊|多個分層協定彼此提供服務，合力完成通訊。
Payload|承載資料|目前協定層實際攜帶的資料，常是上一層的整份資料單位。
Segment (TCP)|TCP 區段|TCP header 加上承載資料所形成的傳輸單位。
Datagram|資料報|可獨立處理的傳送單位，例如 IP datagram 或 UDP datagram。
Packet|封包|網路中轉送的一份資料，狹義常指網路層封包。
Application Layer|應用層|為使用者程式定義 HTTP、DNS 等用途的訊息與互動。
Transport Layer|傳輸層|透過 TCP／UDP 等提供端點行程之間的通訊。
Link Layer|鏈結層|在相鄰介面之間傳送資料並處理該鏈路的訊框。
Port Number|通訊埠號|傳輸層用來辨識應用端點的編號。
DF|禁止分片旗標|Don't Fragment，設成 1 時中途不得對此 IPv4 datagram 分片。
MF|尚有分片旗標|More Fragments，後方還有其他分片時設為 1。
Fragment Offset|分片偏移量|分片資料在原 payload 的起點，以 8 bytes 為一單位。
MTU|最大傳輸單位|Maximum Transmission Unit，一條鏈路可一次承載的網路層資料單位上限。
IPv4 Fragmentation|IPv4 分片|把太大的 IPv4 datagram 拆為數個各有 IP header 的分片。
TCP|傳輸控制協定|Transmission Control Protocol，提供可靠、有序的位元組流。
Sequence Number|序號|TCP 用它記錄資料在位元組流中的位置。
Acknowledgment Number|確認號|TCP 通常以此指出已接收範圍後的下一個預期序號。
Three-way Handshake|三向交握|TCP 以 SYN、SYN-ACK、ACK 建立連線並同步序號。
Retransmission|重送|推斷某份資料遺失後再送一次。
Flow Control|流量控制|限制發送速率或未確認資料量，避免接收端來不及處理。
Congestion Control|壅塞控制|依網路狀況調節送出的資料量，減輕鏈路或路由器過載。
Malware|惡意軟體|以破壞、竊取資料或未授權操作為目的的軟體。
Phishing|網路釣魚|以假訊息、網站或身分誘騙使用者提供資料或採取行動。
DoS|阻斷服務攻擊|Denial of Service，消耗資源或利用弱點讓服務無法使用。
DDoS|分散式阻斷服務攻擊|Distributed Denial of Service，由多個來源同時使服務過載或中斷。
HTTPS|安全的 HTTP|HTTP over TLS，保護瀏覽器與網站間的 HTTP 通訊。
TLS|傳輸層安全性協定|Transport Layer Security，保護網路通訊的機密性與完整性，並支援端點驗證。
Public-key Encryption|公鑰加密|以公鑰加密資料，由相對的私鑰解密。
Public Key|公鑰|可以分享的金鑰，視用途用來加密資料或驗證簽章。
Private Key|私鑰|由持有人保密的金鑰，視用途用來解密或簽章。
Digital Certificate|數位憑證|用受信任的簽署把公鑰與網站名稱或身分綁定的資料。
Digital Signature|數位簽章|以簽署者私鑰產生、可用公鑰驗證的完整性與來源證明。
CA|憑證授權機構|Certificate Authority，查核規定資訊後簽發數位憑證的機構。
Symmetric Encryption|對稱式加密|加密與解密使用相同的祕密金鑰或相關的共享金鑰材料。
Security|安全性|保護資料與系統的機密性、完整性和可用性。
Privacy|隱私|關心個人資訊如何被蒐集、使用、揭露和保留。
Half-duplex|半雙工|同一連線可雙向使用，但同時間只能有一個方向傳送。
Full-duplex|全雙工|連線的兩個方向可同時傳送。
VLAN|虛擬區域網路|Virtual LAN，在交換設備上建立彼此分隔的鏈結層廣播範圍。
NAT|網路位址轉換|Network Address Translation，改寫封包中的 IP，常搭配埠號轉換。
MX Record|郵件交換記錄|Mail Exchange，指定網域接收郵件的伺服器。
DSCP|差異化服務碼點|Differentiated Services Code Point，用來標記 IP 封包的服務分類。
ECN|明確壅塞通知|Explicit Congestion Notification，可在封包標示壅塞，讓端點減速。
Public Cloud|公有雲|資源供公眾或廣泛客戶使用的雲端部署。
Private Cloud|私有雲|資源由單一組織專用的雲端部署。
Community Cloud|社群雲|由共享要求的一群組織共同使用的雲端部署。
Hybrid Cloud|混合雲|組合兩種以上雲端並讓資料或應用在其間協作。
FCS|訊框檢查序列|Frame Check Sequence，資料鏈結層用於偵測訊框傳輸錯誤。
`;

const terms05 = new Map(rows.trim().split("\n").map(row => {
  const [english, chinese, explanation] = row.split("|");
  return [english, { english, chinese, explanation }];
}));


const concepts = {
  "network-scope": "網路範圍與分類",
  "storage-network": "SAN 儲存網路",
  "vpn": "VPN 的機密性與完整性",
  "service-roles": "Client/Server 與 P2P",
  "physical-logical": "實體拓撲與邏輯拓撲",
  "bus": "Bus 共享主幹與終端器",
  "ring": "Ring 與權杖傳遞",
  "star-tree": "Star 與 Tree 的故障範圍",
  "mesh": "Mesh 的替代路徑與成本",
  "wireless-range": "無線接入與覆蓋範圍",
  "wireless-standards": "Wi-Fi 標準與互通",
  "csma-cd": "CSMA/CD 與碰撞",
  "wifi-backoff": "Wi-Fi 的 CSMA/CA 退避",
  "hidden-terminal": "隱藏終端與 RTS/CTS",
  "poe": "PoE 網路供電",
  "interface-address": "網路介面與位址",
  "signal-repeat": "Repeater 與 Hub 重送訊號",
  "switch-destination": "Switch 查目的 MAC",
  "switch-source": "Switch 學習來源 MAC",
  "reframing": "Router 重新封裝",
  "router-ip": "Router 查目的 IP",
  "default-gateway": "預設閘道與跨子網",
  "firewall": "Firewall 的通行規則",
  "fiber": "光纖與電磁干擾",
  "attenuation": "訊號衰減",
  "copper": "銅纜構造、遮蔽與速率",
  "copper-connectors": "雙絞線線對與接頭",
  "distributed-computing": "分散式運算與程序通訊",
  "cloud-properties": "雲端特性與服務承諾",
  "cloud-models": "IaaS、PaaS 與 SaaS",
  "internet-routing": "互連網路與替代路徑",
  "isp": "ISP、Peering 與 Transit",
  "ip-format": "IP 位址格式與長度",
  "domain-hierarchy": "網域名稱的層級",
  "address-allocation": "IP 位址資源的分配",
  "cidr-membership": "CIDR 子網成員判斷",
  "subnet-boundaries": "子網的網路位址、廣播與主機數",
  "subnet-count": "拓撲圖的子網數量",
  "cidr-mask": "CIDR 前綴與子網路遮罩",
  "dhcp-exchange": "DHCP 的 DORA 交換",
  "dhcp-relay": "DHCP Relay 跨子網",
  "dns-records": "DNS 記錄與反向查詢",
  "dns-transport": "DNS 的 UDP 與 TCP",
  "dns-cache": "DNS 快取與 TTL",
  "dns-referral": "DNS 遞迴、迭代與轉介",
  "anycast": "Anycast 的多站同 IP",
  "application-protocols": "遠端登入與應用協定",
  "mail": "SMTP 寄送與 IMAP 讀取",
  "streams": "串流分發與延遲",
  "url": "URL 的結構",
  "html": "HTML 元素與用途",
  "xml": "XML 結構與 MathML",
  "server-side": "前端與伺服器端的分工",
  "encapsulation": "網路分層與封裝順序",
  "transport-ports": "傳輸層連接埠與多工",
  "ipv4-header": "IPv4 標頭欄位與長度",
  "fragmentation": "IPv4 分片與 Offset",
  "transport": "TCP 與 UDP 的傳輸特性",
  "tcp-handshake": "TCP 三向交握",
  "attacks": "網路攻擊的辨識",
  "trust-signing": "公開金鑰與身分驗證",
  "encryption": "收件者公鑰加密",
  "lecture-laws": "投影片中的網路法規",
  "privacy": "資安、隱私與資料最小化"
};

// Keep existing questions in place so saved answers retain their IDs and option order.

const baseQuestions = `scope|4|觀念|network-scope|Which pair describes two different classification axes for the same network?|CAN and star~CAN 是地理範圍，star 是連線拓撲。|LAN and MAN~兩者都是地理範圍。|Bus and ring~兩者都是拓撲。|Client/server and P2P~兩者都是服務角色安排。
scope|5|情境|network-scope|A watch sends step counts to its owner's phone over Bluetooth. Which scope fits best?|PAN~相同使用者附近的裝置形成個人網。|MAN~都會範圍過大。|WAN~跨遠距區域才常用 WAN。|SAN~SAN 著重伺服器存取儲存區塊。
scope|6|觀念|network-scope|Which statement correctly describes LAN and Ethernet?|LAN describes local scope; Ethernet is a possible link technology.~一個描述範圍，另一個描述傳輸技術。|Every LAN must use Ethernet.~Wi-Fi 等技術也可形成 LAN。|Ethernet always operates at 10 Gbps.~速率依標準及設備。|Ethernet describes the network owner.~擁有權是另一分類依據。
scope|7|情境|network-scope|A university connects the LANs in four neighboring campus buildings. What describes the combined scope?|CAN~多棟同校園建物透過骨幹互連。|PAN~PAN 以個人周邊為範圍。|SAN~描述中沒有專用儲存需求。|MAN~MAN 涵蓋較廣的都會區。
scope|8|情境|network-scope|A municipal fiber network connects libraries across one city. Which scope fits best?|MAN~多個城市據點仍在同一都會區。|PAN~並非個人附近裝置。|LAN~範圍跨越全市多個據點。|P2P~P2P 描述角色，這題問地理範圍。
scope|9|情境|network-scope|A business links its Taipei and Kaohsiung office LANs through a carrier. What describes the resulting geographic scope?|WAN~兩地跨城市，透過電信網路互連。|CAN~兩辦公室分隔遠超同一校園。|LAN~各辦公室有 LAN，兩者合看跨廣域。|VPN~題目未說有安全通道，也在問地理範圍。
scope|10|情境|storage-network|Servers must see a remote disk array as block devices. Which network is designed for this?|SAN~SAN 讓伺服器以區塊方式使用儲存設備。|PAN~個人網路的範圍與儲存區塊無直接關係。|MAN~都會規模與此功能無關。|P2P~對等提供資源不等於遠端磁碟區塊。
scope|11|觀念|vpn|A VPN detects that the received content was altered in transit. Which property is involved?|Integrity~完整性關心內容是否遭竄改。|Confidentiality~機密性關心旁人能否讀懂。|Availability~可用性關心能否使用服務。|Authentication~驗證關心對方身分。
scope|11|情境|vpn|Which VPN mechanism most directly keeps a packet's content unreadable to a passive observer?|Encryption~加密將明文轉為密文。|Authentication alone~單獨驗證身分不隱藏內容。|A DNS lookup~DNS 解析名稱。|A checksum alone~一般檢查碼提供偵錯，內容仍可讀。
scope|12|觀念|service-roles|Who normally initiates a request for a web page in the client/server model?|The client~瀏覽器發出請求，伺服器接收後回應。|The server~伺服器是此例等待請求的一方。|The router~路由器轉送封包。|The NIC~網卡傳送訊號，不擔任 Web 請求角色。
scope|13|情境|service-roles|A program uploads file pieces while downloading missing pieces from other users. What feature makes it P2P?|Peers can request and provide data.~每個端點可同時是取用者和供應者。|It runs only on directly connected cables.~P2P 可經 Internet。|It is a star topology.~角色與拓撲是兩種分類。|It has a single server doing every transfer.~分發由對等端點共同負擔。
topology|14|判讀|physical-logical|All hosts are wired to a hub, which repeats incoming signals. What describes the setup?|Physical star with a shared logical medium~線接中央，訊號仍重送給其他埠。|Physical bus with dedicated logical links~中央集線器的線路排列是 star。|A full mesh~主機之間沒有兩兩直連。|A physical ring~沒有封閉迴路。
topology|15|觀念|bus|Why are terminators installed at both ends of a classic bus?|To limit signal reflections~匹配阻抗使訊號不在兩端反射回去。|To route IP packets~路由是 router 的工作。|To distribute tokens~終端器只作用在物理訊號。|To encrypt frames~終端器沒有加密功能。
topology|16|流程|bus|A sends a unicast frame to C on a shared bus. What happens at B?|B can see the signal but normally discards the frame.~訊號沿主幹傳到 B，但目的地址不是 B。|B always stores the frame as its own data.~一般節點檢查目的位址。|B must forward it like a router.~共用線傳播不需 B 決定下一跳。|B receives it only if C approves.~接收訊號不取決於 C 同意。
topology|17|情境|bus|A break in one common cable causes failures across much of the network. Which design best fits?|Bus~多台設備依賴同一主幹，斷裂會影響傳播。|Full mesh~一條線故障通常還有其他路徑。|A star with only one broken spoke~單支線故障通常只影響一台。|Two independent LANs~描述特徵是同一共享主幹。
topology|18|判讀|ring|Every station has exactly two direct neighbors, and the cables form one closed loop. Which topology?|Ring~一個封閉迴路是環狀的特徵。|Bus~Bus 共用一條主幹。|Star~Star 的外圍裝置各連中心。|Tree~樹狀沒有閉合迴路。
topology|18|觀念|ring|In a token-passing ring, what allows a station to transmit?|It currently holds the token.~權杖代表傳送許可。|Its address is the lowest.~位址大小不直接給傳送權。|Its cable has no terminator.~終端器與 token 無關。|It is nearest the Internet gateway.~位置不決定是否拿到 token。
topology|19|情境|star-tree|In a star LAN, which failure is likely to disconnect all end nodes from one another?|Central switch failure~所有分支經中央設備通訊。|One host's cable failure~其餘支線仍接到中心。|One host loses its browser~瀏覽器不是拓撲中心。|A broken cable on an isolated printer~影響範圍是該分支。
topology|21|情境|star-tree|In a tree network, a floor switch loses its only uplink. What is the direct impact?|That floor loses its path to other branches.~分支與上層失聯，同一樓層內部仍可能通訊。|All other floors necessarily fail.~其他樓層仍可能連核心。|Only the first port fails.~所有經該 uplink 的跨樓層流量受影響。|Every node gains a direct link.~故障不會創造新鏈路。
topology|23|觀念|mesh|Why can the Internet have redundant routes without being a full mesh?|Alternative paths do not require every pair to be directly connected.~部分網狀即可存在替代路徑。|The Internet consists of only one link.~Internet 由大量網路互連。|Full mesh requires a central hub.~full mesh 是每對節點直連。|Only a ring supports redundancy.~多種結構都能有備援。
topology|24|計算|mesh|A full mesh has 8 nodes and one bidirectional link per pair. How many links are needed?|28~8×7÷2 = 28，每條只數一次。|56~8×7 把每一對算了兩次。|8~8 只等於節點數。|7~7 是每個節點的連接埠數。
wireless|25|情境|wireless-range|Which technology best matches a carrier's wide-area connection while a phone is moving across town?|4G~由電信業者跨大範圍提供行動接取。|Bluetooth~一般用於短距離周邊。|WLAN at home~家用 Wi-Fi 的覆蓋有限。|Wired Ethernet~有線連接不適合移動中的手機。
wireless|26|觀念|wireless-range|What does 2.4 GHz describe in a Bluetooth discussion?|A radio frequency band~GHz 是頻率單位，每秒十億次振盪。|A rate of 2.4 Gbps~位元傳輸速率另用 bps。|An IPv4 address range~IPv4 由 32 bits 表示。|The Bluetooth device's MAC length~MAC 長度用位元計。
wireless|27|觀念|wireless-standards|Which standard family underlies Wi-Fi?|IEEE 802.11~這是無線 LAN 的標準家族。|IEEE 802.3~802.3 屬 Ethernet。|IEEE 802.15.1~是歷史藍牙相關標準。|T568A~規定雙絞線端接線序。
wireless|27|情境|wireless-range|Wi-Fi clients can connect to their AP but no client can reach the Internet. Which conclusion is sound?|The WLAN may work even if the upstream route fails.~AP 接上區網不等於已有上游 Internet 連通。|Every AP must have working Internet at all times.~可建立只有區網的 WLAN。|All clients necessarily have broken Wi-Fi radios.~客戶端已能和 AP 連線。|Bluetooth will automatically provide the uplink.~需要另外配置才能使用替代上游。
wireless|28|觀念|wireless-standards|How can a phone and AP from different vendors normally communicate?|They implement a common protocol standard.~共同規則定義雙方理解的格式及傳送方式。|They must be manufactured together.~互通性的目的就是跨廠商。|They share one MAC address.~共享同一 MAC 可能造成衝突。|They ignore message timing.~協定也可能規定順序和等待。
wireless|29|流程|csma-cd|Two nodes collide on a classic half-duplex Ethernet bus. What is the CSMA/CD response?|Stop transmission and retry after independent random backoffs.~偵測碰撞後停止，隨機等待再競爭。|Continue sending and hope one frame wins.~重疊訊號使 frame 可能受損。|Both retry immediately at the same time.~容易再度碰撞。|Have the DNS server schedule a retry.~DNS 與媒介存取無關。
wireless|29|判讀|csma-cd|Which Ethernet case generally has no need for CSMA/CD collision handling?|A full-duplex point-to-point switched link~兩個方向可同時獨立傳送。|A classic shared coax bus~共享匯流排可能碰撞。|Half-duplex hosts attached to a hub~Hub 將端點放在同一碰撞網域。|Two half-duplex senders sharing one cable~共享傳送環境仍需協調。
wireless|29|流程|wifi-backoff|A Wi-Fi station is counting down its backoff and detects a busy medium. What happens to the counter?|It pauses, then resumes once the rules permit after the channel is idle.~忙時凍結退避計數，之後再續。|It immediately reaches zero.~這會增加在忙碌媒介上送出的風險。|It sends a TCP ACK before sensing again.~TCP ACK 與 Wi-Fi 退避不同層。|The switch deletes the station's IP.~與 IP 表無關。
wireless|30|情境|hidden-terminal|A and C can both reach B, but cannot sense each other. Where do simultaneous transmissions collide in this scenario?|At B~兩個訊號在共同接收端重疊。|Only at A~A 聽不見 C。|Only at C~C 聽不見 A。|At a DNS root server~碰撞發生在本地無線媒介。
wireless|30|流程|hidden-terminal|C cannot hear A's RTS but hears the AP's CTS. Why can RTS/CTS still help?|The CTS tells C that the medium is reserved for A's exchange.~C 可聽到共同 AP 宣告的保留期間。|CTS changes C's IP address.~RTS/CTS 是媒介存取控制。|The AP decrypts both messages before collision.~解密無法避免訊號重疊。|CTS guarantees no future collision of any kind.~它降低特定情境的碰撞，無法消除所有碰撞。
devices|31|情境|poe|An AP gets data and power over a single Ethernet cable. What feature is used?|PoE~Power over Ethernet 同時供電與傳資料。|DNS~DNS 查名稱。|P2P~描述對等角色。|NAT~改寫 IP 位址或埠。
devices|32|判讀|interface-address|A laptop has a Wi-Fi interface and an Ethernet interface. Which statement about MAC addresses is correct?|Each interface can have its own MAC address.~MAC 對應網路介面。|They must always share exactly one MAC.~兩介面可各有位址。|MAC identifies the DNS domain.~網域名稱另由 DNS 管理。|MAC is a 128-bit IPv6 address.~兩者用途和格式不同。
devices|33|情境|signal-repeat|Which device extends a signal without examining the destination address?|Repeater~在實體層重生訊號。|Router~以目的 IP 做轉送決策。|Bridge~看 MAC 以決定 frame 是否跨網段。|Stateful firewall~需要按封包與連線規則判斷。
devices|35|流程|signal-repeat|A hub receives a signal from port 1. What does it typically do?|Repeats it out the other connected ports.~多埠 repeater 的基本行為。|Learns source MAC and sends only to one port.~這描述交換器的已知單播。|Chooses the lowest-cost IP route.~這描述 router。|Queries the address pool.~這屬 DHCP。
devices|36|情境|switch-destination|A and B are on the same side of a learning bridge, and both MAC locations are known. What does the bridge do with A→B?|Filters it from the opposite side.~同段可以收到，無須跨段。|Always sends it across the bridge.~已知目的與來源同段時可篩掉。|Rewrites the destination IP.~橋接器以鏈結層運作。|Allocates B a new MAC.~學習表不負責發放 MAC。
devices|38|流程|switch-source|A switch receives a frame on port 3 from MAC X. What entry should it learn?|X → port 3~來源 MAC 與入埠可直接觀察。|Destination MAC → port 3~目的地址未必在入埠。|Source IP → port 3 in the MAC table~MAC 表以 MAC 及埠為資料。|Port 3 → default DNS~與 DNS 無關。
devices|38|情境|switch-destination|A switch has no entry for a unicast destination MAC. What is the usual action?|Flood within the VLAN except on the ingress port.~讓未知目的可能收到，後續再學習。|Always discard every unknown unicast.~一般交換行為會泛洪，特定政策另計。|Forward to a random router only.~不是按 IP 做路由。|Replace the MAC with the DNS name.~DNS 不負責 MAC 轉送。
devices|40|流程|reframing|A packet leaves a router over a different link. What normally changes even without NAT?|The outgoing link-layer framing.~router 依下一條鏈路重新封裝。|The final destination IP changes on every hop.~沒有 NAT 時端到端 IP 通常維持。|The application's URL must be rewritten.~路由器不以 URL 轉送。|The TCP service port must become 53.~路由不要求更改 transport 服務埠。
devices|40|觀念|router-ip|Which address is most important for ordinary router forwarding?|Destination IP address~路由器查目的 IP 的前綴。|Source MAC alone~來源 MAC 只在本地 link 有作用。|Source TCP port alone~單靠 transport 埠不能選目的路由。|URL fragment~瀏覽器端片段通常也未送到伺服器。
devices|42|情境|default-gateway|A host sends off-subnet traffic to one configured local IP. What is that local role called?|Default gateway~下一跳通常是本地 router。|Authoritative DNS server~DNS 伺服器提供名稱資料。|An RJ-45 terminator~RJ-45 是實體接頭。|DHCP lease~租約定義位址有效期限。
devices|43|情境|firewall|A firewall should allow a public site and deny inbound admin access. Which policy fits?|Allow HTTPS to the web server and deny unwanted management traffic.~按目的服務與規則管控暴露。|Allow every packet from any address.~這會讓管理服務也暴露。|Replace MAC addresses with IPs.~更改地址不是目標規則。|Block all inbound traffic including HTTPS.~會同時阻止公開網站。
media|44|觀念|fiber|What is carried by fiber-optic cable?|Light signals~光纖在纖芯中導引光。|Copper current only~銅纜主要用電訊號。|Only UDP datagrams~媒介承載多種上層協定。|DNS names without encoding~名稱也需經底層訊號承載。
media|45|情境|attenuation|A copper link receives a weaker signal as cable length increases. What phenomenon is this?|Attenuation~沿媒介傳遞時訊號強度下降。|Encapsulation~加上協定標頭。|Multiplexing~多筆通訊共用一項資源。|Encryption~將明文轉為密文。
media|46|觀念|copper|Which construction identifies coaxial cable?|A center conductor with an outer concentric shield~中心和屏蔽沿同一軸。|Four separate twisted pairs without shielding~這是典型 UTP。|Only an optical core~這是光纖。|A wireless antenna array~無線設備不是此種線材。
media|47|情境|copper|Near strong electrical machinery, which twisted-pair option adds metal shielding?|STP~STP 在絞繞線對之外提供屏蔽。|UTP~沒有額外屏蔽。|RJ-45~這是接頭稱呼。|ISM~這是無線電頻段分類。
media|48|觀念|copper-connectors|How many conductors are in the common four-pair UTP cable described in the slides?|8~四對，每對兩條，共八根。|4~這是線對數，不是導線數。|2~這是一對的導線數。|16~把四對的導線再多乘了一次。
media|48|判讀|copper|What determines supported Ethernet speed on a copper link?|The Ethernet standard, cable category, and equipment.~完整鏈路的電氣能力與規格共同決定。|The cable jacket color alone.~外皮顏色通常不表示可用速度。|The server's DNS record.~DNS 不決定線材的傳輸上限。|The Internet tier only.~ISP 層級與本地線速是不同問題。
media|49|觀念|copper-connectors|Which name describes eight connector positions and eight contacts?|8P8C~8 Position 8 Contact 就是八位置八接點。|4G~指第四代行動通訊。|PoE~指透過網路線供電。|WLAN~指無線 LAN。
media|49|情境|fiber|A technician must pick a medium for a long run between buildings with substantial electrical interference. Which is usually best?|Fiber-optic cable~光纖適合長距且不受電磁訊號干擾。|A single UTP run of arbitrary length~距離與電磁環境都有限制。|An RJ-45 plug by itself~接頭不是傳輸媒介。|A copper terminator alone~只能處理端點反射，無法建立鏈路。
cloud|50|觀念|distributed-computing|What does inter-process communication describe?|Exchanging data or coordination between running processes.~IPC 關心行程彼此交換資訊或同步。|Only the wiring of a data center.~那是實體拓撲。|Only one program reading its own variable.~沒有行程間通訊。|A DNS registrar assigning a name.~那是網域管理。
cloud|52|情境|distributed-computing|A lab uses similar computers on one fast LAN to run one tightly coupled workload. Which model fits best?|Cluster computing~同地、硬體近似且通訊緊密。|Grid computing~常跨地點或管理單位，耦合較鬆。|SaaS~描述對使用者交付成品應用。|CDN~重點是內容邊緣分發。
cloud|52|情境|distributed-computing|Universities contribute heterogeneous machines in different cities to process independent parts of a project. What fits?|Grid computing~跨地點整合不同來源資源，適合可分割任務。|An individual PAN~範圍超過一人的周邊。|One local cluster only~題目強調地理分散及硬體不同。|An isolated thin client~多台機器都提供計算資源。
cloud|53|觀念|cloud-properties|A provider promises a defined availability target to a customer. Which agreement records it?|SLA~SLA 約定服務水準與責任。|MTU~鏈路最大傳輸單位。|DHCP ACK~確認客戶端配置。|P2P~通訊角色模型。
cloud|54|情境|cloud-properties|A service scales from 3 to 30 instances for enrollment day and returns to 3 afterward. What characteristic is shown?|Rapid elasticity~隨負載迅速加容量也能釋放。|Measured service alone~只量測用量不足以說明增減。|Fault isolation alone~它關心縮小故障範圍。|Portability only~指遷移應用或資料。
cloud|54|判讀|cloud-properties|The cloud records instance-hours and reports usage to the customer. Which characteristic is this?|Measured service~系統量測並呈現用量。|Rapid elasticity~描述容量快速擴縮。|Broad network access~描述多設備可經網路存取。|Fault tolerance~描述部件故障時維持服務。
cloud|55|情境|cloud-models|You rent a VM, choose its OS image, and maintain the OS and application. Which service model?|IaaS~提供底層虛擬基礎資源，自己管理 OS。|PaaS~通常由供應商管理 OS。|SaaS~使用成品軟體。|DNSaaS only~題目沒有 DNS 限定，關鍵是租 VM。
cloud|56|情境|cloud-models|You upload your own web app and configure environment variables. The provider patches the runtime and OS. Which model?|PaaS~你部署應用，平台提供執行環境。|IaaS~自行掌控 OS 的情境更符合 IaaS。|SaaS~你不是只操作供應商成品。|Grid~著重分散資源合作而非代管執行平台。
cloud|57|情境|cloud-models|A team uses the provider's browser-based mail app without maintaining its code. Which model?|SaaS~直接使用供應商應用。|PaaS~沒有自行部署應用。|IaaS~沒有自管虛擬機或 OS。|Cluster~使用者看到的是成品服務。
cloud|57|判讀|cloud-models|Which ordering gives users decreasing control over the operating system and application stack?|IaaS → PaaS → SaaS~依序自管 OS、自管應用、使用成品。|SaaS → PaaS → IaaS~這會逐步增加使用者控制。|PaaS → IaaS → SaaS~中間轉至 IaaS 時控制會增加。|SaaS → IaaS → PaaS~從成品切到 VM 時控制增加。
internet|58|觀念|internet-routing|What does the uppercase Internet refer to?|The worldwide network of interconnected networks.~大寫指全球系統，小寫 internet 可泛指互連。|Any private star LAN.~單一 LAN 未必是互連網路。|Only websites and web browsers.~Internet 也承載 DNS、郵件等。|A network controlled by a single router.~多組網路各自營運並互連。
internet|59|判讀|internet-routing|What does packet switching allow when a route becomes unavailable?|Later packets may use an alternate path if one exists.~路由改變後可從別的路徑逐跳轉送。|Packets must remain on a reserved circuit.~封包交換共享鏈路。|DNS must assign new IPs.~改道不必重新編址。|The HTML file must be rewritten.~應用內容與路徑無直接關係。
internet|60|情境|isp|Network A pays B for reachability to destinations beyond B and its customers. What is A buying?|Transit~上游提供較廣泛的網路可達性。|Peering only~對等互換流量的範圍通常較有限。|DNS registration~註冊名稱不提供路由。|A CDN cache hit~CDN 提供內容，不是這類連通合約。
internet|60|情境|isp|Two ISPs directly exchange traffic for their respective customers. What is this arrangement?|Peering~雙方直接交換彼此客戶的流量。|DHCP~DHCP 提供客戶端組態。|Fragmentation~分片拆大型資料報。|A full mesh of all hosts~單一互連不代表所有主機兩兩連接。
internet|60|判讀|isp|An ISP peers with some networks and buys transit to reach the rest. Which lecture tier fits?|Tier 2~部分靠對等，其他靠付費上游。|Tier 1~講義的 Tier 1 無須購買 transit。|Tier 3~簡化模型主要靠購買 transit。|All ISPs share one tier.~Tier 描述不同互連方式。
internet|62|觀念|ip-format|What are the IPv4 and IPv6 address lengths, respectively?|32 bits and 128 bits~IPv4 四個 octet，IPv6 用 128 bits。|32 bytes and 128 bytes~題目要位元。|48 bits and 64 bits~48 bits 常見於 Ethernet MAC。|128 bits and 32 bits~版本順序顛倒。
internet|62|判讀|domain-hierarchy|What is the TLD in mail.example.org?|org~最右側非根 label 是 TLD。|mail~位於最下層。|example~是 org 下的 label。|example.org~是完整的第二級網域。
internet|63|觀念|address-allocation|Who typically manages regional number resources between global coordination and local networks?|A Regional Internet Registry~RIR 管理某地區的 IP 等資源。|An Ethernet switch vendor~廠商不分配區域公網 IP。|A mail server~負責寄收信。|A domain registrar~提供域名註冊。
internet|64|計算|ip-format|Which is the first octet of 223.1.1.1 in binary?|11011111~128+64+16+8+4+2+1=223。|11101111~等於 239。|11011110~少最低位的 1，等於 222。|10111111~等於 191。
internet|64|情境|interface-address|A router has interfaces on three subnets. Which statement is sound?|It can have different IPs assigned to its interfaces.~每個介面可配置所在子網的位址。|It can have only one IP in total.~一台 router 可有多個介面。|A DNS name replaces interface addresses.~名稱不能取代 IP 路由。|All interface addresses must share one prefix.~題目有三個不同子網。
subnet|65|計算|cidr-membership|Which host shares the subnet of 192.168.7.39/26?|192.168.7.61~第一區塊為 .0 至 .63。|192.168.7.64~.64 開始下一區塊。|192.168.7.126~在 .64 至 .127。|192.168.8.39~前三段不同，前綴也不同。
subnet|66|計算|subnet-boundaries|What is the network address of 192.0.2.190/26?|192.0.2.128~最後一段每 64 個一組，190 在 128 至 191。|192.0.2.0~屬於第一組。|192.0.2.191~這是該區塊廣播位址。|192.0.2.192~是下一區塊基底。
subnet|66|計算|subnet-boundaries|What is the broadcast address for 198.51.100.64/27?|198.51.100.95~區塊大小 32，64+31=95。|198.51.100.64~是 network address。|198.51.100.96~是下一網段的基底。|198.51.100.255~是較大 /24 的末尾。
subnet|67|判讀|subnet-count|Four routers form a ring. Each inter-router link is its own subnet and each router serves one separate LAN. How many subnets?|8~四條 router 間鏈路，加四個 LAN。|4~只數到一種子網。|6~這裡有四台 router，不是講義的三台。|12~一條鏈路兩端共同屬一子網。
subnet|68|計算|cidr-mask|Which mask is equivalent to /23?|255.255.254.0~第三段前七個 bits 是 1。|255.255.255.0~這是 /24。|255.255.252.0~這是 /22。|255.255.255.128~這是 /25。
subnet|68|計算|subnet-boundaries|How many conventional assignable host addresses are in a /27?|30~5 個 host bits 有 32 個位址，扣 network 和 broadcast。|32~這是總位址數。|27~是前綴位元數。|62~是 /26 的一般可配置數量。
subnet|68|計算|cidr-membership|Which address belongs to 200.23.16.0/23?|200.23.17.190~第三個 octet 可為 16 或 17。|200.23.15.250~在上一區塊。|200.23.18.1~在下一區塊。|200.24.16.1~第二個 octet 不同。
subnet|70|流程|dhcp-exchange|Which is the typical initial DHCP sequence?|Discover → Offer → Request → ACK~DORA 分別找伺服器、提出、選擇、確認。|Offer → Discover → ACK → Request~初次由 client 找 server。|Discover → Request → Offer → ACK~先有 Offer 再選擇。|Request → ACK → Offer → Discover~混淆初次取得與續租。
subnet|71|情境|dhcp-relay|DHCP is in another subnet, but clients should get addresses for their local subnet. What helps?|DHCP relay~跨子網代轉並傳達來源網段。|HTTP redirect~屬瀏覽器導覽。|PoE~負責網路線供電。|A DNS PTR record~提供反向查詢。
subnet|72|判讀|dhcp-exchange|Which UDP ports are used by a DHCPv4 client's initial request?|Source 68, destination 67~client 用 68、server 用 67。|Source 67, destination 68~這是回覆方向。|Source 53, destination 53~53 常用於 DNS server。|Source 443, destination 80~這兩號與 Web 相關。
subnet|72|判讀|dhcp-exchange|What does yiaddr in a DHCP Offer represent?|The offered client IPv4 address.~server 提出的客戶端候選位址。|The server's TCP port.~DHCPv4 用 UDP，埠在 transport header。|The DNS query name.~屬名稱查詢。|The client's link speed.~此欄位不表示速率。
subnet|73|情境|default-gateway|A host can reach devices on its own subnet but lacks an off-subnet route. Which setting should be checked?|Default gateway~遠端目的需交給本地閘道。|DNS PTR record~只影響反向解析。|HTTPS certificate~憑證不提供路由。|Wi-Fi channel label~同網段通訊顯示已有鏈路。
dns|74|觀念|dns-records|Which DNS record maps a name to an IPv6 address?|AAAA~AAAA 用於 IPv6。|A~A 用於 IPv4。|PTR~常用於反向查詢。|MX~指向郵件伺服器。
dns|74|情境|dns-records|You have an IP and want an associated hostname. What do you query?|PTR through a reverse lookup~反向區域的 PTR 可回名稱。|A through a forward lookup~A 從名稱查 IPv4。|DHCP ACK~確認租約。|SMTP RCPT TO~指定郵件收件者。
dns|75|判讀|dns-transport|Which statement about normal DNS transport is correct?|UDP 53 is common, and TCP 53 is also used.~一般查詢常用 UDP，某些情況需 TCP。|DNS is limited to TCP 443.~443 常用於 HTTPS。|DNS never uses a port.~UDP 和 TCP 都有埠。|DNS uses only UDP 67.~67 常見於 DHCP server。
dns|75|情境|dns-cache|A cached DNS record has not reached its TTL. What can the resolver usually do?|Use the valid cached answer.~有效快取可省下上游查詢。|Delete every root hint.~TTL 管單筆記錄的快取。|Change the IP TTL of every packet.~兩種 TTL 作用不同。|Allocate an IP lease.~這屬 DHCP。
dns|76|觀念|dns-referral|What usually comes back from the root when resolving www.example.com?|A referral toward the .com servers.~根提供 TLD 的委派線索。|The HTML of the page.~DNS 不提供 HTML。|A DHCP Offer.~根伺服器不發租約。|A guaranteed final A record.~一般由下層權威管理。
dns|76|情境|anycast|Many physical DNS sites advertise the same service IP and routing selects one. What is this?|Anycast~多處宣告同一位址，路由選其中一處。|Broadcast~廣播送到範圍內所有端點。|Full mesh~是拓撲概念。|TCP retransmission~重送不會建立多站點。
dns|78|判讀|domain-hierarchy|Which part of lab.cs.example.edu. marks the DNS root?|The final dot.~尾點表示根。|lab~是末端名稱。|cs~在 example.edu 下。|edu~是 TLD，根在其上。
dns|79|觀念|domain-hierarchy|A parent domain delegates a child zone. What is true?|The child remains in the domain tree and may have its own authoritative servers.~名稱包含關係和管理責任可分開。|The child loses its parent in its domain name.~完整名稱仍有上層 label。|All child records must stay under parent authority.~委派允許子區維護。|The root holds all records.~DNS 是分散式資料庫。
dns|81|流程|dns-referral|A resolver asks root, then .edu, then the authoritative server. Who follows referrals?|The resolver issuing successive queries.~迭代中查詢端追下一站。|The authoritative server after its final answer.~它回答自己區域的記錄。|The laptop NIC.~網卡不負責解析 DNS。|The root on the client's behalf.~原流程由 resolver 逐站問。
dns|82|流程|dns-referral|A laptop requests a final answer; its resolver then follows upstream referrals. Which describes the two legs?|Client-to-resolver recursive; upstream iterative.~client 要最終結果，resolver 逐站問。|Both always recursive.~上游回 referral。|Client iterative; upstream recursive.~角色對調。|Neither leg is DNS.~兩段都屬解析流程。
apps|83|情境|application-protocols|Which protocol fits encrypted interactive remote login?|SSH~Secure Shell 提供加密遠端操作。|Telnet~傳統 Telnet 通常明文。|NNTP~用於新聞群組。|SMTP~用於寄信。
apps|83|觀念|application-protocols|Which protocol historically transfers network news articles?|NNTP~Network News Transfer Protocol。|FTP~用於檔案傳輸。|IMAP~用於存取與同步信箱。|VoIP~用於 IP 語音。
apps|83|情境|mail|A sender's mail server forwards a message to the recipient's mail server. Which protocol?|SMTP~負責提交與伺服器間中繼。|POP3~收件者用於下載信件。|IMAP~客戶端存取信箱。|DHCP~發放網路組態。
apps|83|情境|mail|Which protocol best shares read status and folders between phone and laptop?|IMAP~同步伺服器端信箱狀態。|POP3 in download-only use~單純下載不提供同樣的同步。|SMTP alone~SMTP 不同步收件匣。|FTP~處理檔案傳輸。
apps|84|流程|mail|Which SMTP command supplies the envelope recipient?|RCPT TO~指定信封收件者。|MAIL FROM~指定信封寄件者。|DATA~開始傳標頭與本文。|QUIT~結束會話。
apps|84|判讀|mail|SMTP replies 354 after DATA. What should the client do?|Send message content and end with a line containing only a dot.~354 表示可以開始送本文。|Send QUIT without data.~伺服器正在等本文。|Download mail via POP3.~這段是 SMTP 會話。|Request a new DHCP lease.~和寄信無關。
apps|85|情境|streams|One stream copy travels over a shared path and is replicated at branches. What is illustrated?|Multicast~對群組在分支處複製。|N-unicast~會為每個接收者個別送。|On-demand seeking~描述自行選播放位置。|Reverse DNS~以位址查名稱。
apps|85|情境|streams|Different regions fetch a video from nearby edge servers. What technique is this?|CDN~邊緣內容可減少延遲和來源站壓力。|A VPN lease~不提供邊緣內容。|TCP handshake~建立連線而非部署內容。|SMTP relay~轉交郵件。
apps|85|情境|streams|VoIP packets arrive with widely varying spacing. Which term names the problem?|Jitter~到達延遲的變動。|Confidentiality~關心內容能否被讀。|Fragment identifier~URL 井字後的片段。|Peering~網路間互連。
web|86|觀念|url|What does a URL add to the general idea of identifying a resource?|Information about how or where to locate it.~URL 提供定位資訊。|A guarantee the resource still exists.~資源可能已刪除。|A rule that it must use FTP.~URL 有不同 scheme。|A requirement that it has an IP literal.~可用名稱。
web|87|判讀|url|In https://example.org/find?q=ip#top, what is the query string?|q=ip~在問號後、井字前。|/find~是 path。|top~是 fragment。|https~是 scheme。
web|87|判讀|url|Which URL part commonly navigates within the document and stays on the browser side?|Fragment identifier~# 後片段由瀏覽器處理。|Host name~用於聯絡目標主機。|Path~隨 HTTP 請求提供。|Query string~通常隨請求送出。
web|88|流程|html|Which markup references an image file for rendering?|<img src='photo.jpg' alt='Photo'>~img 讀 src 取得圖片。|<img href='photo.jpg'>~圖像來源應用 src。|<h1 src='photo.jpg'>~h1 是標題。|<p href='photo.jpg'>~p 是段落。
web|89|判讀|html|Which element sets the text usually shown on a browser tab?|title~位於 head 的文件名稱。|h1~顯示於頁面內容。|p~標記段落。|body~容納內容。
web|91|判讀|html|In <a href='notes.html'>Read notes</a>, what is the destination?|notes.html~href 的值是目的位置。|Read notes~是連結文字。|a~是元素名稱。|</a>~是結束標籤。
web|93|觀念|xml|Which XML example is well formed?|<r><x>1</x></r>~有單一根，標籤巢狀並正確關閉。|<r><x></r></x>~結束順序錯誤。|<r id=1></r>~屬性值須加引號。|<R></r>~XML 區分大小寫。
web|94|判讀|xml|In <staff clef='treble'>, what is clef?|An attribute name~staff 開標籤上的設定鍵。|A text node~文字節點在內容內。|A closing tag~結束標籤是 </staff>。|A domain name~和 DNS 無關。
web|96|觀念|xml|Which MathML element represents a fraction with numerator and denominator?|mfrac~兩個子項是分子和分母。|msup~表示上標。|msqrt~表示平方根。|mrow~把多個元素分組。
web|97|情境|server-side|A web app checks a password against its private database. Where should this happen?|Server-side~伺服器維持資料與驗證控制。|Client-side with a database copy~這會暴露資料和規則。|In the RJ-45 plug~接頭只傳訊號。|At the DNS root~DNS 不處理登入。
protocols|100|流程|encapsulation|What is the order of encapsulation from application toward the wire?|Application data → transport unit → IP packet → link frame~由上向下逐層加資訊。|Frame → IP packet → segment → application data~這是接收端順序。|IP packet → application data → frame → segment~先產生應用資料。|Bits → UDP datagram → HTTP → Ethernet~bits 是媒介上的表示。
protocols|101|觀念|transport-ports|Which layer uses the destination port to deliver data to the right application endpoint?|Transport~TCP、UDP header 有 port。|Physical~傳位元訊號。|Network~看 IP 位址及協定欄位。|Link~Ethernet frame 用 MAC。
protocols|102|計算|ipv4-header|An IPv4 header has IHL=7. What is its length?|28 bytes~7 個 32-bit words，每個 4 bytes。|7 bytes~IHL 單位是 word。|20 bytes~IHL=5 才是 20 bytes。|56 bytes~每個 word 不是 8 bytes。
protocols|102|情境|ipv4-header|An IPv4 packet enters a router with TTL 1. What happens on the normal forwarding path?|It is discarded when TTL reaches zero.~避免封包無限迴圈。|TTL resets to 255.~中途通常扣 1。|It becomes a DNS record.~兩種 TTL 不同。|The cable is disconnected.~這是封包處理。
protocols|102|計算|ipv4-header|What is the minimum IPv4 plus TCP header length, excluding other layers?|40 bytes~20 IPv4 加 20 TCP。|28 bytes~最小 IPv4 加 UDP。|20 bytes~只數了一層。|60 bytes~可因 options 達到，非最小。
protocols|103|情境|fragmentation|An IPv4 datagram exceeds the next link's MTU and DF=1. What should the router do?|Drop it and generally report fragmentation needed via ICMP.~DF 禁止分片，該鏈路承載不了。|Fragment it anyway.~違反 DF。|Reassemble it first.~原封包太大，重組無助。|Clear DF and forward it unchanged.~仍超過 MTU。
protocols|104|計算|fragmentation|IPv4 total length is 3000, header 20 and MTU 1500. What are the fragment total lengths?|1500, 1500, 40~Payload 2980 = 1480+1480+20，每片加 20。|1500, 1500~只承載 2960 bytes。|1480, 1480, 20~是各片 payload。|1500, 1500, 20~末片還需 header。
protocols|104|計算|fragmentation|If 1480 payload bytes precede a fragment, what offset value does the header contain?|185~單位 8 bytes，1480÷8。|1480~是位元組數。|1500~把前一片 header 算進去了。|186~不是 1480÷8。
protocols|104|計算|fragmentation|MTU is 1000 and the IPv4 header is 20 bytes. What is the maximum non-final fragment payload?|976 bytes~980 往下取最大 8 倍數。|980 bytes~不能被 8 整除。|1000 bytes~未扣 header。|960 bytes~是 8 倍數，但非最大。
protocols|105|觀念|transport|Which field is in TCP but absent from basic UDP?|Sequence Number~TCP 追蹤位元組流位置。|Source Port~兩者都有。|Destination Port~兩者都有。|Checksum~兩者都設有欄位。
protocols|106|流程|reframing|Which part does an ordinary IP router rebuild for the outgoing hop?|The link-layer frame.~逐跳改用相應鏈結層封裝。|The HTTP message body.~路由無須改本文。|The receiver's TCP byte stream.~由終端處理。|The DNS zone.~與逐跳轉送無關。
protocols|108|判讀|encapsulation|Which TCP/IP layer corresponds to both OSI Physical and Data Link?|Network Interface / Link~兩個底層職責合併。|Transport~對應 OSI Transport。|Internet~對應 OSI Network。|Application~對應 OSI 上三層。
protocols|110|流程|tcp-handshake|Which sequence is the normal TCP three-way handshake?|SYN → SYN-ACK → ACK~發起、同步兼確認、確認。|ACK → SYN → SYN-ACK~ACK 不能代替起始 SYN。|SYN → ACK → FIN~FIN 用於結束傳送方向。|Discover → Offer → ACK~屬 DHCP 用語，且缺 Request。
protocols|111|情境|transport|A file transfer requires all bytes in order, with retransmission handled by transport. What fits?|TCP~提供可靠有序的 byte stream。|Basic UDP alone~無內建重傳或排序。|IP alone~IP 為盡力而為的轉送。|Collision detection~無法提供端到端檔案可靠性。
protocols|111|情境|transport|A real-time app handles loss itself and wants preserved message boundaries. Which transport fits?|UDP~保留資料報邊界，應用可自訂處理。|TCP byte stream~不保留個別訊息邊界。|SMTP~是應用層協定。|DNS~是名稱查詢服務。
protocols|112|判讀|transport-ports|Two clients connect to the same server IP and TCP port 443. What can distinguish the connections?|The source/destination IP and port four-tuple.~來源 IP 或來源埠可不同。|Only destination port 443.~目的埠相同。|The HTML title.~不屬於傳輸層。|The cable color.~與 TCP 識別無關。
security|113|觀念|encapsulation|Which set is in application → transport → internet → link order?|DNS → UDP → IP → Ethernet~依序名稱查詢、資料報、跨網路轉送、逐跳訊框。|IP → DNS → Ethernet → UDP~角色順序錯亂。|Ethernet → IP → UDP → DNS~是由下往上。|UDP → Ethernet → DNS → IP~UDP 屬傳輸，Ethernet 屬 link。
security|114|判讀|copper-connectors|Both ends use T568B. What kind of cable is this?|Straight-through~腳位依相同線序對應。|An A-to-B crossover~交叉是一端 A 一端 B。|Fiber-optic~T568B 屬銅雙絞線。|A DNS ring~接線與名稱解析無關。
security|115|情境|attacks|Malicious code scans neighboring hosts and copies itself to them. Which term fits?|Worm~可自行經網路擴散。|Trojan horse~強調偽裝誘導執行。|Spyware only~強調偷偷蒐集資料。|Spam filter~用來篩垃圾信。
security|115|情境|attacks|A counterfeit campus login page asks students for credentials. Which attack?|Phishing~用仿冒頁面誘取帳密。|Fragmentation~是 IP 傳輸功能。|DNS cache hit~有效快取本身不是攻擊。|A normal SSH login~題目是冒充校方的網頁。
security|115|情境|attacks|Thousands of infected devices overwhelm one public service. What is this?|DDoS~分散來源同時壓垮服務。|A local spam filter~不會造成這種攻擊。|A confidentiality guarantee~事件主要破壞可用性。|An SMTP reply~和郵件回覆無關。
security|116|觀念|trust-signing|What does a trusted website certificate help a browser verify?|The public key is bound to the expected site identity.~信任鏈與名稱檢查建立金鑰信任。|The site can never collect data.~憑證不管蒐集行為。|All web bugs are fixed.~憑證不能證明程式無漏洞。|DNS always uses UDP.~與 DNS 無關。
security|116|流程|trust-signing|Alice wants Bob to verify that her message was unchanged and came from her. What should she do?|Sign with Alice's private key; Bob verifies with Alice's public key.~簽章綁定簽署者與內容。|Encrypt with Bob's public key only.~可保機密，未驗證寄件者。|Sign with Bob's public key.~公開金鑰用於驗證。|Publish Alice's private key.~外流會讓他人代簽。
security|117|流程|encryption|Alice wants only Bob to decrypt her message. Which key should she use to encrypt it?|Bob's public key~Bob 的相對私鑰才能解密。|Alice's public key~會由 Alice 私鑰解開。|Alice's private key~機密性使用收件者公鑰。|Bob's private key shared with Alice~Bob 應保密私鑰。
security|118|判讀|lecture-laws|Which lecture law concerns bad-faith registration of trademark-related domain names?|ACPA~與惡意網域搶註相關。|CALEA~與業者協助合法監聽能力相關。|CFAA~涉及未授權存取等。|ECPA~涉及通訊及其隱私。
security|119|情境|privacy|An app encrypts location data but collects more precise location than needed. Which concern remains?|Privacy and data minimization~蒐集範圍仍須合理。|Only link MTU~MTU 是封包大小限制。|None, because encryption proves appropriate collection.~加密無法證明必要性。|Only browser DNS.~與資料蒐集保留無關。
scope|10|情境|storage-network|A server needs shared block storage that the operating system can treat like a disk. Which deployment fits this use?|SAN linking servers to a storage array~SAN 提供主機可存取的區塊儲存。|A PAN of a phone and watch~PAN 描述個人裝置範圍。|A Wi-Fi guest network~訪客 WLAN 與區塊儲存用途不同。|A DNS resolver~DNS 解析名稱。
topology|14|判讀|physical-logical|Five PCs connect by individual cables to a hub. They share the same transmission medium logically. What is the physical topology?|Star~每台 PC 的線都接同一個中心。|Ring~各站並未首尾相接。|Bus~題目沒有共用的一條實體主幹。|Full mesh~各電腦並未彼此直連。
wireless|29|流程|wifi-backoff|A Wi-Fi station still has three backoff slots left when it detects another transmission. What should it do?|Freeze the counter at three and resume after the required idle interval.~忙碌期間暫停倒數，符合空閒條件後再續數。|Keep counting during the transmission.~媒介忙碌時不繼續倒數。|Send as soon as it hears a collision.~Wi-Fi 先做碰撞避免。|Reset its counter to zero and send at once.~不能跳過等待時槽。
devices|31|觀念|poe|What does PoE let an Ethernet switch supply to a compatible access point over its network cable?|Electrical power along with data~PoE 可讓乙太網路線同時傳資料與供電。|A public IP address by itself~分配 IP 是另一項功能。|Wi-Fi encryption keys~PoE 是供電方式。|A route to every Internet destination~路由不由供電方式決定。
devices|32|情境|interface-address|A laptop is connected through Wi-Fi, then uses its separate Ethernet interface. Why might the switch see a different source MAC?|The two network interfaces can use different MAC addresses.~MAC 用於介面識別，同一主機的不同介面可用不同位址。|Ethernet uses the router's public IP as a MAC.~MAC 與 IP 是不同層的位址。|The switch writes its own MAC into every incoming frame.~交換機從 frame 讀取來源 MAC。|The DNS resolver assigns one MAC per website.~DNS 名稱解析與 MAC 指派無關。
devices|38|流程|switch-source|A switch receives a frame from MAC M to MAC N on port 5. Its table already lists N on port 2. Which entry is learned from this frame?|M → port 5~Switch 依來源 MAC 與入埠更新表項。|N → port 5~N 是目的 MAC，不能拿來學入埠。|M → port 2~埠 2 是目的 N 所在的埠。|N → port 2 as a newly learned entry~N 原本已知，轉送查表與來源學習是不同步驟。
devices|38|流程|switch-destination|A frame for destination MAC Y arrives on port 1. A switch knows Y is on port 4 in the same VLAN. Where does it forward the frame?|Only port 4~查目的 MAC 得到已知單播的出埠。|Every port except port 1~查不到目的時才需泛洪。|Only port 1~同一入埠不是此處的目的方向。|Every port including port 1~交換機不會把此已知單播送到所有埠。
devices|40|判讀|router-ip|A router receives an IP packet whose source is on network A and destination is on network B. Which field selects a matching route in its routing table?|The packet's destination IP address~一般路由依目的 IP 比對目的網路。|The packet's source IP address~一般轉送以目的地選路。|The source Ethernet MAC address~來源 MAC 用於鏈路層。|The TCP source port~傳輸層埠號不是一般路由查表的依據。
devices|40|流程|reframing|An ordinary router forwards an IPv4 packet from one Ethernet segment to another. What does it put in the outgoing frame's destination MAC field?|The MAC address of the next hop on the outgoing link~路由器在新鏈路上重新封裝，目的 MAC 指向該鏈路的下一跳。|The MAC address from the incoming frame in all cases~入站 frame 的目的位址僅對原鏈路有意義。|The source host's IP address~IP 不會填進 MAC 欄位。|The frame check sequence of the incoming link~FCS 用來檢查 frame。
devices|42|情境|default-gateway|A PC has a valid IP address and mask, can ping neighbors, and has no route for other subnets. Which configuration allows it to reach them?|A reachable default gateway on its local subnet~到非本地網路的封包可交給預設閘道。|A different switch port number~埠號不提供跨子網路由。|A new hostname alone~改名稱不新增路由。|A longer Ethernet frame~frame 長度與路由設定無關。
devices|43|情境|firewall|A lab wants incoming SSH allowed only from its management subnet. Which firewall rule meets the goal?|Allow SSH from the management subnet and deny other inbound SSH.~同時限制服務與來源。|Allow SSH from every source.~這會讓管理子網以外也可連入。|Block all SSH including the management subnet.~管理子網將無法登入。|Allow any port from anywhere.~這沒有設定所需的限制。
media|45|觀念|attenuation|A receiver measures less signal power at the far end of a longer cable. What describes that loss?|Attenuation~衰減描述訊號沿媒介傳播時的強度損失。|Multiplexing~多工是共享傳輸資源。|Encapsulation~封裝是加上協定控制資訊。|Peering~對等互連是網路營運關係。
internet|63|觀念|address-allocation|In the lecture's address allocation hierarchy, what do RIRs manage for their regions?|Internet number resources such as IP address blocks~區域網際網路註冊管理機構負責區域的號碼資源。|Private Wi-Fi passphrases~無線密碼由網路使用者管理。|Website HTML files~網頁由站方維護。|Every end host's local routing table~本地主機自行管理轉送設定。
subnet|67|判讀|subnet-count|Three routers are joined in a triangle by three point-to-point subnets. Each router also has one separate LAN subnet. How many subnets are there?|6~三條路由器間鏈路加三個 LAN，共六個子網。|3~只數到其中一類子網。|5~會漏掉一條鏈路或一個 LAN。|9~每條點對點鏈路只算一個子網。
subnet|68|計算|cidr-mask|Which dotted-decimal subnet mask corresponds to /26?|255.255.255.192~前三個 octet 全為 1，第四個前兩位為 1，即 128+64。|255.255.255.128~這是 /25。|255.255.255.224~這是 /27。|255.255.255.0~這是 /24。
subnet|71|流程|dhcp-relay|A router's DHCP relay receives a client's local Discover. What is the relay's role?|Pass the request to a DHCP server on another subnet.~Relay 代為轉送請求，使伺服器可跨子網提供設定。|Choose a DNS name for the client.~Relay 不負責命名。|Discard all Discover messages by design.~Relay 的用途就是傳遞 DHCP 訊息。|Turn the source MAC into a public IP address.~這不是 DHCP relay 的功能。
dns|75|判讀|dns-transport|A resolver gets a truncated UDP DNS reply. Which transport can it use to ask again for the complete DNS reply?|TCP on port 53~標準 DNS 也可使用 TCP 53 取得完整回覆。|ICMP echo~ICMP echo 不承載這個 DNS 查詢。|ARP~ARP 用於本地鏈路位址解析。|SMTP on port 25~SMTP 是郵件協定。
dns|75|情境|dns-cache|A resolver's cached A record has expired. What should it normally do before answering a new query with that record?|Resolve it again to obtain a current answer.~TTL 到期後通常要重新查詢。|Treat the expired record as permanently valid.~TTL 限定一般快取可直接重用的時間。|Convert the A record to AAAA.~兩種記錄分別對應 IPv4 和 IPv6。|Delete the authoritative zone.~本地快取到期不會修改權威區域。
dns|76|判讀|anycast|Two DNS sites in different cities announce the same service IP. A client reaches one of them based on routing. Which delivery method is this?|Anycast~多站提供同一位址，路由把流量送到其中一站。|Broadcast~廣播送到同一範圍內的接收者。|Multicast~多播送給群組成員。|DHCP~DHCP 配置網路參數。
web|97|情境|server-side|A shop must verify a coupon against a database before applying a discount. Where should the final decision run?|On the server~伺服器可查權威資料，也能避免由用戶端決定折扣。|Only in the browser's CSS~CSS 控制外觀。|In the DNS resolver~DNS 解析名稱。|On the Ethernet switch~Switch 不負責商店業務邏輯。
protocols|110|流程|tcp-handshake|A TCP client has sent SYN and just received SYN-ACK. Which segment does the client send to complete the ordinary handshake?|ACK~第三步由發起端確認收到 SYN-ACK。|FIN~FIN 用於關閉傳送方向。|RST~RST 用於重設連線。|SYN-ACK~第二步才由被動端送出 SYN-ACK。
security|117|情境|encryption|Alice encrypts a file with Bob's public key in the lecture's public-key example. Which key is needed to recover the file?|Bob's private key~只有與加密所用公鑰配對的私鑰能解密。|Bob's public key~公鑰供他人加密。|Alice's public key~此處加密目的是讓 Bob 解密。|Alice's private key~Alice 的金鑰不與 Bob 的公鑰配對。
security|118|判讀|lecture-laws|In the lecture's list of U.S. laws, which acronym is associated with unauthorized access to computers?|CFAA~投影片將 CFAA 與未授權存取等行為連結。|ACPA~投影片的 ACPA 情境是惡意網域搶註。|CALEA~投影片將 CALEA 與電信業者協助監聽能力連結。|ECPA~投影片的 ECPA 情境是電子通訊及隱私。
security|119|情境|privacy|A campus map can show buildings without storing a user's past locations. Which change best follows data minimization?|Avoid collecting location history that the feature does not need.~資料最小化要求依用途減少不必要的蒐集。|Keep every location indefinitely after encrypting it.~加密無法減少蒐集或保留範圍。|Collect more precise coordinates whenever possible.~提高精度可能增加無關的蒐集。|Store a copy with a second provider for no defined purpose.~複製資料也需要正當用途。
`;

function readPractice(text) {
  return text.trim().split("\n").filter(Boolean).map((row, index) => {
    const [unit, page, level, concept, prompt, ...values] = row.split("|");
    const options = values.map((value, position) => {
      const [label, explanation] = value.split("~");
      return { label, explanation, correct: position === 0 };
    });
    const order = [[2, 0, 3, 1], [0, 3, 1, 2], [1, 3, 0, 2], [2, 1, 3, 0]];
    return { id: `practice-${index + 1}`, unit, page: Number(page), level, concept, prompt, options: order[index % 4].map(i => options[i]) };
  });
}

const practice05 = readPractice(baseQuestions);

const part = (points, prompt, model, criteria, trap) => ({
  points, prompt, model, criteria, trap
});

const exam05 = [
  {
    title: "Medium access and the hidden terminal",
    pages: [29, 30],
    setup: "A and C are Wi-Fi stations that can both reach the same access point B. They cannot hear each other's transmissions.",
    parts: [
      part(5, "What is CSMA/CD? Briefly describe what a station does before transmission and after detecting a collision on classic shared Ethernet.",
        "傳送前先做 carrier sense。媒介空閒才傳，傳送同時監測 collision。偵測到碰撞後停止傳送，各站等獨立的 random backoff，再重新感測並嘗試。",
        [[1,"先感測共用媒介。"],[1,"媒介空閒才送。"],[1,"傳送過程偵測碰撞。"],[1,"碰撞後停止此次傳送。"],[1,"各站獨立隨機退避後重試。"]],
        "只寫『先聽再送』可得前兩個觀念的分數；要交代碰撞後做什麼。"),
      part(5, "Explain why A and C can still collide at B. Name the Wi-Fi medium access approach and explain how optional RTS/CTS can reduce this problem.",
        "A、C 彼此聽不到，可能各以為 channel idle。兩者都可到達 B，因此同時傳送會在 B 碰撞。Wi-Fi 用 CSMA/CA。若 A 發 RTS，B 回 CTS，C 聽到 CTS 後就暫緩發送。",
        [[1,"A、C 彼此聽不到。"],[1,"兩者都能到 B，訊號在 B 重疊。"],[1,"正確寫 CSMA/CA。"],[1,"由發送端提出 RTS、B 回 CTS。"],[1,"另一端聽到 CTS 後等待。"]],
        "只列 RTS/CTS 名稱時，還欠共同接收端回覆和另一站退避的因果。")
    ]
  },
  {
    title: "Forwarding through a switch and a router",
    pages: [35, 38, 40, 43],
    setup: "A switch knows B's MAC is on port 2. It has no entry for A. A frame from A to B arrives on port 1. In a separate transmission, A sends an IP packet to a host outside its subnet.",
    parts: [
      part(5, "What does the switch learn, and where does it send the first frame? How would a hub behave instead?",
        "Switch 看到來源 MAC A 從 port 1 進來，記 A→1。查目的 MAC B 後，只向 port 2 送。Hub 將輸入訊號重送至其餘連接埠。",
        [[2,"學來源 MAC A → 入埠 1。"],[2,"查目的 MAC B，只從 port 2 轉送。"],[1,"Hub 把訊號重送到其他埠。"]],
        "把『學目的 MAC』和『查目的 MAC』寫成同一件事會失分。"),
      part(5, "Describe how the router forwards A's off-subnet packet. Specify the address it checks and what happens to the link-layer frame.",
        "Router 取出原 frame 內的 IP packet，查 destination IP 和 routing table 選下一跳／出埠，再依下一條鏈路重新封裝 frame。",
        [[1,"取出 IP packet 或拆除入站 frame。"],[2,"以目的 IP 查路由表，選下一跳或輸出介面。"],[2,"依新鏈路重建 link-layer frame。"]],
        "只寫『router 用 IP』還沒有說明解封裝、下一跳及重新封裝。")
    ]
  },
  {
    title: "IPv4, IPv6 and subnet calculations",
    pages: [62, 65, 66, 68],
    setup: "A host is configured with IPv4 address 198.51.100.142/27. Use conventional IPv4 subnetting.",
    parts: [
      part(5, "Give the theoretical number of addresses for IPv4 and IPv6. Show why.",
        "IPv4 位址長 32 bits，所以有 2^32 種。IPv6 長 128 bits，所以有 2^128 種。這是理論位址總數。",
        [[2,"IPv4 為 32 bits、共 2^32 種。"],[2,"IPv6 為 128 bits、共 2^128 種。"],[1,"說明每個 bit 有兩種可能。"]],
        "題目問理論總數，不扣除保留用途或子網的兩個位址。"),
      part(5, "Find the subnet's network address, broadcast address and number of assignable host addresses. Show how you obtained the range.",
        "/27 留 5 個 host bits，區塊大小 32。142 位在 128～159，因此 network = 198.51.100.128，broadcast = 198.51.100.159，可配置 2^5−2 = 30 個。",
        [[1,"算出 5 個 host bits 或 32 的區塊大小。"],[1,"辨認 128～159 的範圍。"],[1,"network 為 198.51.100.128。"],[1,"broadcast 為 198.51.100.159。"],[1,"可配置 30 個一般主機位址。"]],
        "把 32 直接當可配置主機數，會少扣 network 和 broadcast。")
    ]
  },
  {
    title: "DHCP on a newly joined network",
    pages: [69, 70, 71, 72, 73],
    setup: "A laptop has just joined a new IPv4 LAN and has no usable address. A DHCP server on the LAN is ready to serve it.",
    parts: [
      part(10, "Explain the initial DHCP message exchange, including who sends each message. Give the client's source and destination IPv4 addresses for the initial broadcast, and name two additional settings DHCP can return.",
        "Client 廣播 Discover 找 server；server 回 Offer 提出 IP 和租期；client 送 Request 選擇該方案；server 回 ACK 確認。初始來源 0.0.0.0，目的 255.255.255.255。另可提供 subnet mask 與 default gateway，也可提供 DNS server。",
        [[1,"Client Discover 找 server。"],[1,"Server Offer 提出設定。"],[1,"Client Request 指定所選方案。"],[1,"Server ACK 確認租約。"],[2,"初始來源 0.0.0.0、目的 255.255.255.255，各 1 分。"],[2,"任兩項：mask、default gateway、DNS server，各 1 分。"],[2,"清楚說明 Offer 只是提出、Request/ACK 後才確認配置，並依正確順序說明。"]],
        "只背 DORA 四字母且無方向與用途，無法拿滿分。")
    ]
  },
  {
    title: "Tracing a DNS lookup",
    pages: [74, 75, 76, 80, 81, 82],
    setup: "Assume there is no cached answer for library.example.edu and that the local resolver knows where to reach a root server.",
    parts: [
      part(10, "Describe the usual lookup from the laptop to the local resolver and from that resolver to the authoritative answer. Name the record type for an IPv4 result and contrast iterative with recursive queries.",
        "Laptop 對 local resolver 要最終答案，是 recursive request。Resolver 問 root 得到 .edu 的 referral，問 .edu 得到 example.edu 權威伺服器線索，再問該權威取得 A record，最後回給 laptop。Upstream iterative 是查詢方自行追 referral；recursive 則由受詢者代查並給最終結果。",
        [[2,"Laptop 對本地 resolver 提出 recursive request，取得最終結果。"],[2,"Root 轉介 .edu。"],[2,".edu 轉介 example.edu 權威。"],[2,"向權威取得 IPv4 A record 並回覆。"],[2,"分辨誰追下一站，以及 referral 與最終答案。"]],
        "寫『問 root，root 直接給網站 IP』漏掉 TLD 與權威分工。")
    ]
  },
  {
    title: "Distributing a large update",
    pages: [12, 13, 50, 51, 85],
    setup: "A game studio must deliver the same large patch to a million users. It can run one central server, or let users exchange verified patch pieces. Many users have spare upload bandwidth.",
    parts: [
      part(10, "Which of the two distribution models would you recommend under these conditions? Explain the roles, the effect on the studio's network load, and one practical condition needed for your proposal.",
        "建議 P2P 分發。每個 peer 能下載缺少的區塊，也能上傳已有區塊。部分流量從其他玩家來，分攤 central server 上傳壓力。官方需有可信的原始種子，並可用官方簽署的清單驗證區塊，避免取得遭竄改的檔案。",
        [[2,"明確選 P2P 並連結題目條件。"],[3,"peer 可下載缺塊、上傳已有區塊。"],[3,"說明分攤中心上傳或增加總供應能力的原因。"],[2,"具體提出區塊驗證、初始種子、頻寬或在線率等條件。"]],
        "只寫『P2P 比較快』，未交代哪個資源被分攤。若選中央模式，須提出題目下更重要的條件與可行解法才有論證分。")
    ]
  },
  {
    title: "Cloud service models",
    pages: [52, 53, 55, 56, 57],
    setup: "A: rent virtual machines and patch the guest OS. B: upload your own application while the provider maintains the runtime and OS. C: use an online document editor supplied by the provider.",
    parts: [
      part(10, "Name the service model for A, B and C. For each, describe the main responsibility left to the user.",
        "A 是 IaaS，使用者管理 guest OS 與應用；B 是 PaaS，使用者部署及管理自己的應用，供應商維護 runtime/OS；C 是 SaaS，使用者直接操作成品軟體及自身設定。",
        [[1,"A 是 IaaS。"],[2,"A 使用者自管 guest OS、部署的應用。"],[1,"B 是 PaaS。"],[2,"B 使用者管理應用、平台代管 OS/runtime。"],[1,"C 是 SaaS。"],[2,"C 直接使用成品、管理個人設定。"],[1,"清楚說明 A 與 B 的 OS 控制差異。"]],
        "只填三個縮寫只能拿模型辨認分。")
    ]
  },
  {
    title: "IPv4 fragmentation",
    pages: [102, 103, 104],
    setup: "An IPv4 datagram is 3500 bytes long including its 20-byte header. It has no options, DF=0 and the next link has MTU 1000 bytes. Assume each fragment has a 20-byte header.",
    parts: [
      part(5, "How many fragments are produced? Give the total length of each fragment in bytes and show your arithmetic.",
        "原資料 3500−20=3480 bytes。非末片可容納的最大 8 倍數是 floor((1000−20)/8)×8=976。前三片各有 976 data，末片 3480−3×976=552。總共 4 片，total lengths 為 996、996、996、572。",
        [[1,"算出原 payload 3480。"],[1,"非末片上限取 976，含 8-byte 對齊。"],[1,"正確算出四片與末片 payload 552。"],[2,"總長 996、996、996、572，前三片與最後一片各 1 分。"]],
        "1000−20=980 是容納量；非末片還要往下取 8 的倍數。"),
      part(5, "Give each fragment's offset and MF flag. Where are the fragments normally reassembled?",
        "每片 offset 為前方累積 data 除 8：0、122、244、366。MF 依序 1、1、1、0。目的主機依 ID、位址、協定與 offset 重組。",
        [[1,"清楚寫出 offset 用 8 bytes 為單位。"],[2,"正確列出 offsets 0、122、244、366。"],[1,"MF 為 1、1、1、0。"],[1,"在最終目的主機重組。"]],
        "offset 看 payload 的起點，不能把各片 header 加進去。")
    ]
  },
  {
    title: "Explain or compare the following terms",
    pages: [83, 86, 87, 105, 111, 115, 116, 119],
    setup: "Give the distinguishing function of each item. Short Chinese answers using the English terms are acceptable.",
    parts: [
      part(5, "Compare TCP and UDP. Give one workload suited to each and explain why.",
        "TCP 提供可靠有序 byte stream，適合檔案傳輸，遺失時會重送。UDP 是 connectionless datagram，無內建重送和排序，可給自行處理遺失、重視延遲的即時語音使用。",
        [[2,"TCP 可靠、有序，或明確寫重送機制。"],[2,"UDP 資料報且無內建重送或排序。"],[1,"兩個適用例子都合理，並連結需求。"]],
        "不要只寫『TCP 慢，UDP 快』，實際差異是傳送語意及機制。"),
      part(5, "Compare SMTP and IMAP for a message that travels between mail servers and is then read on two devices.",
        "SMTP 提交及轉送郵件，伺服器對伺服器也用 SMTP。IMAP 讓兩個裝置存取同一個伺服器信箱並同步資料夾與已讀狀態。",
        [[2,"SMTP 寄送／郵件伺服器間轉送。"],[2,"IMAP 存取伺服器上的信箱。"],[1,"指出兩裝置可同步狀態。"]],
        "用『IMAP 寄信』會把方向寫反。"),
      part(5, "For https://notes.example.org/course/5?q=dns#terms, give the scheme, hostname, path, query and fragment.",
        "Scheme = https；hostname = notes.example.org；path = /course/5；query = q=dns；fragment = terms。",
        [[1,"Scheme: https。"],[1,"Hostname: notes.example.org。"],[1,"Path: /course/5。"],[1,"Query: q=dns。"],[1,"Fragment: terms。"]],
        "問號後到井字前是 query，井字後才是 fragment。"),
      part(5, "Explain how an app can protect security but still raise a privacy concern. Give a concrete example.",
        "App 把定位加密且限制存取，提升 security。即使加密，若功能不需要定位卻蒐集並長期保留，仍有 privacy 問題。可改為只收完成目的所需的資料。",
        [[2,"Security 交代保護資料或系統的具體方法。"],[2,"Privacy 交代蒐集、用途、分享或保留的問題。"],[1,"同一情境同時說明二者。"]],
        "只寫『資料都加密，所以沒有隱私問題』無法回答蒐集合理性。")
    ]
  },
  {
    title: "Bonus · Public-key encryption and signatures",
    pages: [116, 117],
    bonus: true,
    setup: "Alice sends a confidential course file to Bob. Bob must also be able to verify that Alice sent it and that it was not modified. Both parties already trust each other's public keys.",
    parts: [
      part(10, "Specify whose key is used for encryption, decryption, signing and verification. Explain which goal each pair of operations serves.",
        "機密性：Alice 用 Bob public key 加密，Bob 用 Bob private key 解密。來源和完整性：Alice 用 Alice private key 簽章，Bob 用 Alice public key 驗證。實務常用混合加密傳檔，此題著重金鑰方向。",
        [[2,"加密用 Bob 的 public key。"],[2,"解密用 Bob 的 private key。"],[2,"簽署用 Alice 的 private key。"],[2,"驗證用 Alice 的 public key。"],[2,"把 confidentiality 與 origin/integrity 的目標分開，各 1 分。"]],
        "用 Bob 公鑰加密只能建立收件端機密性。任何持有公鑰的人都能加密，因此還要 Alice 的簽章。")
    ]
  }
];


const examCalculations = {
  "q3-2": {
    ...exam05[2].parts[1],
    prompt: "Calculate the subnet for the host above. Enter each result and briefly show how you found the address range.",
    model: "/27 的遮罩為 255.255.255.224，剩 5 個 host bits，區塊大小 32。142 落在 128～159；可配置主機數為 32−2 = 30。",
    criteria: [[1, "由 /27 推得 32 個位址一組，並說明 142 落在 128～159。"]],
    fields: [
      { id: "mask", label: "Subnet mask", format: "ipv4", answer: "255.255.255.224", points: 1 },
      { id: "network", label: "Network address", format: "ipv4", answer: "198.51.100.128", points: 1 },
      { id: "broadcast", label: "Broadcast address", format: "ipv4", answer: "198.51.100.159", points: 1 },
      { id: "hosts", label: "Assignable host addresses", format: "integer", answer: 30, points: 1 }
    ]
  },
  "q8-1": {
    ...exam05[7].parts[0],
    prompt: "Find the fragment count and total lengths in order. Briefly show your arithmetic.",
    criteria: [[1, "算出原 payload 3480。"], [1, "非末片上限取 976，含 8-byte 對齊。"]],
    fields: [
      { id: "count", label: "Number of fragments", format: "integer", answer: 4, points: 1 },
      { id: "lengths", label: "Total lengths in bytes, in order", format: "integer-list", answer: [996, 996, 996, 572], points: 2 }
    ]
  },
  "q8-2": {
    ...exam05[7].parts[1],
    prompt: "Enter each fragment's offset and MF flag in order. Explain the offset unit and where fragments are normally reassembled.",
    criteria: [[1, "說明 offset 以 8 bytes 為單位。"], [1, "在最終目的主機重組。"]],
    fields: [
      { id: "offsets", label: "Fragment offsets, in order", format: "integer-list", answer: [0, 122, 244, 366], points: 2 },
      { id: "flags", label: "MF flags, in order", format: "integer-list", answer: [1, 1, 1, 0], points: 1 }
    ]
  }
};

const figurePages = new Set(lecture05.slides.map(slide => slide.page));

const illustrations = {
  14: {
    file: "topologies.png", width: 960, height: 471,
    alt: "七種網路拓撲的節點連線，包括環狀、網狀、星狀、全互連、線形、樹狀和匯流排。",
    caption: "比對 Ring、Star 和 Bus 的接線。Star 的各節點連到中心，Bus 共用一條主幹。",
    credit: "Maksim／Malyszkz",
    source: "https://commons.wikimedia.org/wiki/File:NetworkTopologies.svg",
    license: "公有領域"
  },
  38: {
    file: "ethernet-switch.jpg", width: 960, height: 640,
    alt: "乙太網路交換器的面板，插著多條不同顏色的網路線。",
    caption: "交換器面板上的每個連接埠都是獨立的介面。對照原投影片，想想交換器如何把來源 MAC 位址記到收到資料的埠。",
    credit: "Raysonho @ Open Grid Scheduler / Grid Engine",
    source: "https://commons.wikimedia.org/wiki/File:EthernetSwitch.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  44: {
    file: "optical-fiber.jpg", width: 960, height: 452,
    alt: "單模光纖剝開外護套後，露出金黃色補強纖維與中央細纜。",
    caption: "單模光纖實物。外護套和補強纖維提供保護，光訊號沿中央光纖的纖芯傳遞。",
    credit: "Stewe007／Till.niermann",
    source: "https://commons.wikimedia.org/wiki/File:Optical_cable.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  81: {
    file: "dns-iteration.png", width: 960, height: 342,
    alt: "DNS 解析器依序詢問根伺服器、.org 頂級網域伺服器與 wikipedia.org 權威伺服器。",
    caption: "沿著三個編號看迭代查詢。解析器收到轉介後會詢問下一站，直到權威伺服器回覆。圖中的位址供示意。",
    credit: "Lion Kimbro／Mfwitten",
    source: "https://commons.wikimedia.org/wiki/File:Example_of_an_iterative_DNS_resolver.svg",
    license: "公有領域"
  },
  100: {
    file: "encapsulation.png", width: 1280, height: 906,
    alt: "左側電腦逐層向下封裝資料，中間經過路由，右側電腦逐層向上解封裝。",
    caption: "沿左側箭頭看送端往下封裝，沿右側箭頭看收端往上解封裝。",
    credit: "BJSZ",
    source: "https://commons.wikimedia.org/wiki/File:Encapsulation_and_decapsulation_in_networking.svg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  }
};

function flow(steps) {
  return `<div class="diagram-flow">${steps.map(step => `<span>${step}</span>`).join('<i aria-hidden="true">→</i>')}</div>`;
}

const widgets = {
  14: `<section class="study-widget"><h3>拓撲速查</h3>
    <div class="table-wrap"><table class="study-table"><thead><tr><th>拓撲</th><th>連接特徵</th><th>故障重點</th></tr></thead><tbody>
      <tr><th>Bus</th><td>共用一條主幹</td><td>主幹故障可影響整段</td></tr>
      <tr><th>Ring</th><td>首尾接合成環</td><td>簡單單環斷點可中斷全環</td></tr>
      <tr><th>Star</th><td>各支線通往中央</td><td>支線局部，中央影響全星</td></tr>
      <tr><th>Tree</th><td>多層中心形成分支</td><td>越高層故障，受影響分支越多</td></tr>
      <tr><th>Mesh</th><td>多條互連或替代路徑</td><td>可繞路，布線及埠成本高</td></tr>
    </tbody></table></div></section>`,
  30: `<section class="study-widget"><h3>在接收端看碰撞</h3>
    <div class="hidden-diagram"><span>A</span><b aria-hidden="true">→</b><span>AP</span><b aria-hidden="true">←</b><span>C</span></div>
    <p>A 和 C 彼此聽不到，兩者的訊號都會到 AP。</p></section>`,
  38: `<section class="study-widget"><h3>已知單播範例</h3>${flow(["A → B 進入埠 1","學來源 MAC A → 1","查目的 B → 3","從埠 3 送出"])}</section>`,
  57: `<section class="study-widget"><h3>三種服務模型的管理責任</h3>
    <div class="table-wrap"><table class="study-table"><thead><tr><th>模型</th><th>使用者主要做什麼</th><th>供應商主要做什麼</th></tr></thead>
    <tbody><tr><th>IaaS</th><td>管理 OS 與應用</td><td>機房、硬體、虛擬化</td></tr>
    <tr><th>PaaS</th><td>部署、維護自己的應用</td><td>基礎設施、OS、執行平台</td></tr>
    <tr><th>SaaS</th><td>使用軟體、調整自身設定</td><td>代管整個應用與平台</td></tr></tbody></table></div></section>`,
  70: `<section class="study-widget"><h3>DORA 往返</h3>${flow(["Client：Discover","Server：Offer","Client：Request","Server：ACK"])}</section>`,
  81: `<section class="study-widget"><h3>快取沒有結果時的上游查詢</h3>${flow(["Resolver 問 Root","Root 指向 TLD","TLD 指向權威","權威回傳記錄"])}</section>`,
  89: `<pre class="code-example"><code>&lt;!doctype html&gt;
&lt;html lang="zh-Hant"&gt;
  &lt;head&gt;&lt;title&gt;講義示範&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;我的網頁&lt;/h1&gt;
    &lt;p&gt;點選下方連結。&lt;/p&gt;
    &lt;a href="notes.html"&gt;查看筆記&lt;/a&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>`,
  100: `<section class="study-widget"><h3>送端逐層封裝</h3>${flow(["HTTP 訊息","TCP segment","IP packet","Ethernet frame","Bits"])}</section>`,
  116: `<section class="study-widget"><h3>兩種用途的金鑰方向</h3>
    ${flow(["收件者公鑰加密","收件者私鑰解密"])}
    ${flow(["簽署者私鑰簽章","簽署者公鑰驗證"])}</section>`
};

StudySite.registerCourse({

  ...lecture05, terms: terms05, termAliases: {
  "internet": "Internet",
  "Network of Networks": "Internet",
  "Network Adapter": "NIC",
  "Active Hub": "Hub",
  "First-hop Router": "Default Gateway",
  "Host Identifier": "Host Portion",
  "Network Identifier": "Network Prefix",
  "UDP Port": "Port Number",
  "Source Port": "Port Number",
  "Destination Port": "Port Number",
  "Port": "Port Number",
  "TCP/IP Protocol Suite": "Protocol Stack",
  "Internet Protocol Suite": "Protocol Stack",
  "SYN Flag": "Three-way Handshake",
  "SYN": "Three-way Handshake",
  "SYN-ACK": "Three-way Handshake",
  "Stateful Firewall": "Firewall",
  "Packet Filtering": "Firewall",
  "SSL": "TLS",
  "Ethernet Switch": "Switch"
}, practice: practice05, concepts,

  exam: exam05, examCalculations, figurePages, illustrations, widgets,
  activityLinks: {
    38: ["switch-router-packets"], 41: ["switch-router-packets"], 65: ["dhcp-packet-trace"], 73: ["dhcp-packet-trace"],
    75: ["dns-packet-trace"], 82: ["dns-packet-trace", "web-packet-journey"],
    98: ["packet-wrap-unwrap"], 101: ["packet-wrap-unwrap", "switch-router-packets"],
    103: ["ipv4-fragment-trace"], 105: ["transport-packet-trace"], 110: ["transport-packet-trace", "web-packet-journey"],
    117: ["web-packet-journey"]
  }

});

})();
