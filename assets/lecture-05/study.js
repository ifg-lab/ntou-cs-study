"use strict";

(() => {
const terms = {
  "Half-duplex": {
    "explanation": "半雙工像對講機：兩邊都能說話，但同一時間只有一邊可以傳。舊式共享乙太網路的裝置同時傳送時，訊號可能在共用媒介碰撞。",
    "related": [
      [
        "Full-duplex",
        "比較能否同時雙向傳送。"
      ],
      [
        "CSMA/CD",
        "共享半雙工 Ethernet 使用的碰撞偵測方式。"
      ]
    ]
  },
  "Full-duplex": {
    "explanation": "全雙工允許連線兩端同時傳送和接收。例如主機與交換器之間一條正常運作的全雙工乙太網路連線，可以同時上傳及下載。",
    "related": [
      [
        "Half-duplex",
        "同一時間只允許一個方向傳送。"
      ]
    ]
  },
  "NAT": {
    "explanation": "NAT 讓封包經過邊界設備時使用另一組 IP。家用路由器常把不同內網裝置的來源 IP 和埠號映射到同一個公用 IP，再依映射把回覆交回正確裝置。",
    "related": [
      [
        "IP Address",
        "NAT 會改寫封包使用的 IP 位址。"
      ],
      [
        "Port Number",
        "多台裝置共用公用 IP 時，可藉由埠號區分連線。"
      ]
    ]
  },
  "MX Record": {
    "explanation": "寄信伺服器會查收件網域的 MX，找出應聯絡的收信伺服器。若有多條記錄，例如優先值 10 與 20，通常會先嘗試數值較小的 10。",
    "related": [
      [
        "DNS",
        "MX 是 DNS 能查詢的一種記錄。"
      ],
      [
        "SMTP",
        "寄信端找出目的伺服器後，可用 SMTP 交付郵件。"
      ]
    ]
  },
  "DSCP": {
    "explanation": "DSCP 在 IP 標頭標記流量類別。設備可以依自己的服務政策，讓即時語音和一般下載進不同佇列。標記能否影響轉送，取決於經過的設備如何配置。",
    "related": [
      [
        "Packet",
        "分類標記隨 IP 封包傳送。"
      ],
      [
        "ECN",
        "同在 IP 標頭，ECN 用來回報壅塞。"
      ]
    ]
  },
  "ECN": {
    "explanation": "支援 ECN 的傳送端可以標示封包能接收壅塞通知。網路設備可能在壅塞時標示封包，接收端再把訊號回報給傳送端，例如由 TCP 傳送端降低送速。",
    "related": [
      [
        "DSCP",
        "對照用來分類流量的 IP 欄位。"
      ],
      [
        "TCP",
        "TCP 端點可以合作傳遞壅塞訊號、調整速度。"
      ]
    ]
  },
  "Public Cloud": {
    "explanation": "多個不相干的客戶可向供應商使用公有雲服務。例如個人或公司可租用同一供應商的運算服務，各自用帳號控制其資源。",
    "related": [
      [
        "Private Cloud",
        "以服務的使用對象來區別部署方式。"
      ],
      [
        "Hybrid Cloud",
        "可以把公有雲與其他雲端環境接在一起。"
      ]
    ]
  },
  "Private Cloud": {
    "explanation": "私有雲供單一組織專用。例如學校可以建置提供旗下各系使用的雲端平台。專用環境可以自建，也可以委外代管。",
    "related": [
      [
        "Public Cloud",
        "公有雲向廣泛客戶提供服務。"
      ],
      [
        "Hybrid Cloud",
        "私有雲可與其他雲端環境協作。"
      ]
    ]
  },
  "Community Cloud": {
    "explanation": "有共同要求的多個組織共用一套雲端部署，例如多家醫院共同使用符合其資料管理規範的平台。使用範圍由參與的組織共同定義。",
    "related": [
      [
        "Private Cloud",
        "私有雲的服務範圍通常是一個組織。"
      ],
      [
        "Public Cloud",
        "公有雲的服務範圍可以更廣。"
      ]
    ]
  },
  "Hybrid Cloud": {
    "explanation": "將不同的雲端部署串接，讓應用或資料可以配合需求協作。例如把敏感資料留在專用環境，同時使用公有雲的運算資源處理可外移的工作。",
    "related": [
      [
        "Private Cloud",
        "可承載組織專用的部分。"
      ],
      [
        "Public Cloud",
        "可提供按需求擴充的外部資源。"
      ]
    ]
  },
  "FCS": {
    "explanation": "發送端根據訊框內容算出校驗值，接收端再次計算並比對。例如乙太網路的 CRC 校驗失敗時，接收端可丟棄這個遭破壞的訊框。",
    "related": [
      [
        "Frame",
        "FCS 位在乙太網路訊框的尾端。"
      ],
      [
        "Encapsulation",
        "資料加上鏈結層標頭與尾端後成為訊框。"
      ]
    ]
  },
  "Switch": {
    "explanation": "交換器在同一個 VLAN 裡轉送 Ethernet 訊框。收到訊框時，先記錄來源 MAC 和進入的埠；要送出去時，再用目的 MAC 查表。",
    "exam": "先回答學到了哪一筆，再回答從哪些埠送出。目的已知且與入埠相同時會過濾；目的未知時，在同一 VLAN 泛洪並排除入埠。",
    "example": "A 從埠 1 傳給 B，而表裡有 B → 埠 3：先學 A → 1，再只從埠 3 送出。",
    "related": [
      [
        "MAC Table",
        "記住 MAC 位址在哪個埠。"
      ],
      [
        "Hub",
        "可對照不查 MAC 的訊號重送方式。"
      ],
      [
        "Router",
        "跨網路轉送時使用目的 IP 查路由。"
      ]
    ],
    "concept": "switch-source"
  },
  "MAC Table": {
    "explanation": "MAC 位址表把交換器學到的 MAC 位址對應到連接埠。同一張表也用來查目的 MAC。",
    "exam": "新紀錄是來源 MAC → 入埠。若同一裝置換到新埠並送出訊框，交換器會更新紀錄。",
    "example": "先從埠 1 收到 A，再從埠 4 收到 A，表中的 A → 1 會改為 A → 4。",
    "related": [
      [
        "Switch",
        "收到訊框時更新這張表。"
      ],
      [
        "Unknown Unicast",
        "查不到目的 MAC 時形成的情況。"
      ]
    ],
    "concept": "switch-source"
  },
  "MAC Address": {
    "explanation": "MAC 位址放在鏈結層訊框的標頭，供同一條鏈路或同一個交換網路辨識收發端。",
    "exam": "跨子網時，主機送出的訊框目的 MAC 通常是預設閘道的 MAC，內層封包的目的 IP 仍是遠端主機。",
    "example": "筆電要送到外網伺服器，第一跳的訊框交給路由器；伺服器的 MAC 不會跨 Internet 被拿來查表。",
    "related": [
      [
        "Frame",
        "Ethernet 訊框帶有來源和目的 MAC。"
      ],
      [
        "IP Address",
        "路由器用 IP 辨識目的網路。"
      ],
      [
        "Next Hop",
        "決定這一跳要交給誰。"
      ]
    ],
    "concept": "reframing"
  },
  "Router": {
    "explanation": "路由器把 IP 封包從一個網路轉送到另一個網路。它取出入站訊框內的封包，用目的 IP 查路由表，再為出站鏈路建立新的訊框。",
    "exam": "解題依序交代「取出封包 → 查目的 IP／下一跳 → 重新封裝」。無 NAT 的一般轉送中，來源與目的 IP 通常保留，但 IPv4 TTL 會遞減。",
    "example": "A 的封包要去 B。路由器轉送到 B 所在的 Ethernet 網段時，新訊框的目的 MAC 是 B，封包的目的 IP 仍是 B。",
    "related": [
      [
        "Routing Table",
        "選擇下一跳或出站介面的依據。"
      ],
      [
        "Switch",
        "查目的 MAC 決定出埠的設備。"
      ],
      [
        "Frame",
        "路由器會為下一條鏈路重新建立訊框。"
      ]
    ],
    "concept": "router-ip"
  },
  "Routing Table": {
    "explanation": "路由表列出目的網路的前綴及其下一跳或出站介面。一般 IPv4 轉送會從符合目的位址的路由中優先選擇最長前綴。",
    "exam": "先找所有能匹配的路由，再比前綴長度。最長指有效位元數最多，與列在表中的順序無關。",
    "example": "10.0.1.25 同時符合 10.0.0.0/8 和 10.0.1.0/24，會選 /24。",
    "related": [
      [
        "Next Hop",
        "選中路由後要交付的下一站。"
      ],
      [
        "CIDR",
        "路由表用斜線前綴表示目的範圍。"
      ],
      [
        "Router",
        "依目的 IP 查這張表。"
      ]
    ],
    "concept": "router-ip"
  },
  "Next Hop": {
    "explanation": "下一跳是目前裝置接著要交付封包的對象。它可能是另一台路由器，也可能是已經在出站網段上的最終主機。",
    "related": [
      [
        "Routing Table",
        "通常可從選中的路由找出下一跳。"
      ],
      [
        "Default Gateway",
        "本機要去其他網段時常用的第一跳。"
      ]
    ]
  },
  "Default Gateway": {
    "explanation": "主機要送到外部子網，且沒有更明確的路由時，會把封包交給本地可達的預設閘道。",
    "exam": "先用遮罩判斷目的地是否同子網。跨子網時，第一跳用閘道的 MAC，內層仍填最終主機的 IP。",
    "example": "192.168.1.10/24 要找 192.168.2.20，可先交給本地閘道 192.168.1.1。",
    "related": [
      [
        "Subnet Mask",
        "用來判斷目的 IP 是否同子網。"
      ],
      [
        "Next Hop",
        "閘道可作為出站第一跳。"
      ],
      [
        "DHCP",
        "可提供預設閘道設定。"
      ]
    ],
    "concept": "default-gateway"
  },
  "Frame": {
    "explanation": "訊框是鏈結層的傳輸單位。以上一層的 IP 封包為例，Ethernet 會加上本段鏈路使用的 MAC 標頭與錯誤偵測欄位。",
    "related": [
      [
        "Packet",
        "IP 封包可以放在訊框裡當承載資料。"
      ],
      [
        "Encapsulation",
        "描述訊框如何把封包包起來。"
      ],
      [
        "MAC Address",
        "Ethernet 訊框用這類位址識別鏈結層的收發端。"
      ]
    ]
  },
  "Packet": {
    "explanation": "在網路分層中，IP 封包是網路層資料單位，標頭有來源與目的 IP，通常再交給鏈結層包成訊框。",
    "related": [
      [
        "Frame",
        "逐跳傳輸時封包由訊框承載。"
      ],
      [
        "Router",
        "依封包的目的 IP 選路。"
      ],
      [
        "IPv4 Fragmentation",
        "封包超過出站 MTU 時可能需要切片。"
      ]
    ]
  },
  "IP Address": {
    "explanation": "IP 位址供網路層辨識介面與選路，並配合前綴表示所在網路。IPv4 與 IPv6 使用不同的位址長度和寫法。",
    "related": [
      [
        "MAC Address",
        "區別跨網路的 IP 和本鏈路的 MAC。"
      ],
      [
        "Subnet Mask",
        "IPv4 可用遮罩找出網路部分。"
      ],
      [
        "Router",
        "依目的 IP 查路由。"
      ]
    ]
  },
  "Hub": {
    "explanation": "集線器把輸入訊號重送到其他埠，不讀訊框的 MAC 來決定目的埠。在傳統共享式半雙工 Ethernet 裡，各設備共用媒介。",
    "related": [
      [
        "Switch",
        "交換器能靠 MAC 表只轉送到需要的埠。"
      ],
      [
        "CSMA/CD",
        "適用於傳統共享 Ethernet 的碰撞偵測。"
      ]
    ]
  },
  "Unknown Unicast": {
    "explanation": "目的 MAC 是單播位址，但交換器的表中沒有對應埠。一般會在同一 VLAN 內從其他可用埠送出。",
    "related": [
      [
        "Flooding",
        "查不到目的埠時採用的轉送方式。"
      ],
      [
        "MAC Table",
        "交換器在這張表上找目的 MAC。"
      ]
    ]
  },
  "Flooding": {
    "explanation": "交換器在同一 VLAN 內，從其餘可轉送的埠送出一份訊框。來源埠不必再收一份。",
    "related": [
      [
        "Unknown Unicast",
        "目的為單播且查不到 MAC 時會泛洪。"
      ],
      [
        "VLAN",
        "定義多份訊框可送到的範圍。"
      ]
    ]
  },
  "VLAN": {
    "explanation": "VLAN 將同一組交換設備上的裝置分成不同的鏈結層廣播範圍。同一個 VLAN 的泛洪不會因此直接跨到別的 VLAN。",
    "related": [
      [
        "Switch",
        "依 VLAN 範圍學習和轉送。"
      ],
      [
        "Router",
        "跨 VLAN 通訊通常需要第三層轉送。"
      ]
    ]
  },
  "Subnet Mask": {
    "explanation": "子網路遮罩的前段 1 指定網路位元，後段 0 對應主機位元。IPv4 位址與遮罩做 AND 可得網路位址。",
    "exam": "換算 /n、找區塊大小，再找題目位址落在哪一段。一般子網的網路位址是區塊第一個，廣播位址是最後一個。",
    "example": "192.168.1.70/26 的遮罩是 255.255.255.192。區塊每 64 個，70 落在 64～127：網路 .64、廣播 .127，可分配 62 個主機位址。",
    "related": [
      [
        "CIDR",
        "用 /26 等前綴長度表示相同的網路位元。"
      ],
      [
        "Network Address",
        "將主機位元設為 0 得到。"
      ],
      [
        "Broadcast Address",
        "一般 IPv4 子網將主機位元設為 1 得到。"
      ]
    ],
    "concept": "cidr-mask"
  },
  "CIDR": {
    "explanation": "CIDR 用 IP/前綴長度表示範圍，讓網路位元數不必受傳統 A、B、C 類別限制，也能合併可聚合的路由。",
    "exam": "n 越大，匹配範圍越小。IPv4 的 /n 有 2^(32−n) 個位址；一般有廣播的子網才用「總數減 2」算可分配主機數。",
    "example": "/23 的遮罩是 255.255.254.0，共 512 個位址；/26 共 64 個位址。",
    "related": [
      [
        "Prefix Length",
        "斜線後的數字就是網路位元數。"
      ],
      [
        "Subnet Mask",
        "IPv4 前綴也能寫成點分十進位遮罩。"
      ],
      [
        "Routing Table",
        "路由器用前綴比對並選路。"
      ]
    ],
    "concept": "cidr-mask"
  },
  "Network Address": {
    "explanation": "將主機位元全部設成 0，就得到代表整個 IPv4 子網的網路位址。在一般子網中，它是該區塊的第一個位址。",
    "related": [
      [
        "Subnet Mask",
        "指出哪些位元要保留。"
      ],
      [
        "Broadcast Address",
        "一般子網的另一個邊界。"
      ]
    ]
  },
  "Broadcast Address": {
    "explanation": "一般 IPv4 子網把主機位元全設為 1，得到可送到該子網各主機的廣播位址。例如 192.168.1.64/26 的廣播位址是 192.168.1.127。",
    "related": [
      [
        "Network Address",
        "同一個子網區塊的起始位址。"
      ],
      [
        "DHCP",
        "初始 Discover 使用有限廣播 255.255.255.255。"
      ]
    ]
  },
  "IPv4": {
    "explanation": "IPv4 位址有 32 位元，常寫成四個 0 到 255 的十進位數。理論上有 2³² 種位址組合，與實際可分配數量不同。",
    "related": [
      [
        "IPv6",
        "對照 128 位元位址空間。"
      ],
      [
        "Subnet Mask",
        "將 IPv4 分為網路與主機位元。"
      ]
    ]
  },
  "IPv6": {
    "explanation": "IPv6 位址有 128 位元，理論上有 2¹²⁸ 種組合，常以冒號分隔十六進位欄位。",
    "related": [
      [
        "IPv4",
        "位址長度為 32 位元。"
      ],
      [
        "AAAA Record",
        "DNS 用這類記錄回覆 IPv6 位址。"
      ]
    ]
  },
  "DHCP": {
    "explanation": "DHCPv4 讓剛加入網路的裝置取得 IPv4 租約，以及遮罩、預設閘道、DNS 伺服器等設定。",
    "exam": "記 DORA 的順序、發送者與用途。無位址時的初始 Discover 通常用 0.0.0.0 → 255.255.255.255，UDP 用戶端 68 → 伺服器 67。",
    "example": "用戶端 Discover 找伺服器 → 伺服器 Offer 提案 → 用戶端 Request 選定方案 → 伺服器 ACK 確認租約。",
    "related": [
      [
        "DHCP Discover",
        "新裝置找 DHCP 伺服器的第一步。"
      ],
      [
        "DHCP ACK",
        "伺服器確認租約的步驟。"
      ],
      [
        "DNS",
        "DHCP 可給 DNS 伺服器位址；域名解析由 DNS 做。"
      ]
    ],
    "concept": "dhcp-exchange"
  },
  "DNS": {
    "explanation": "DNS 是分層的名稱查詢系統，可以查到位址、郵件伺服器等不同記錄。裝置通常交給解析器處理，不必自己找各層伺服器。",
    "exam": "無快取時，分清楚誰在追轉介。根與 TLD 通常指出下一站，權威伺服器才提供它負責區域的記錄。",
    "example": "查 www.example.com 的 IPv4 時，解析器沿根 → .com → 權威伺服器找到 A 記錄，再回給用戶端。",
    "related": [
      [
        "DNS Resolver",
        "負責查快取或追上游轉介。"
      ],
      [
        "A Record",
        "查 IPv4 位址時需要的記錄類型。"
      ],
      [
        "Iterative Query",
        "解釋解析器怎麼跟著上游轉介走。"
      ]
    ],
    "concept": "dns-referral"
  },
  "DNS Resolver": {
    "explanation": "DNS 解析器收到用戶端查詢後，會先看快取。沒有可用答案時，它可以依轉介繼續問下一台伺服器，再把結果回給用戶端。",
    "exam": "解析器追轉介。根伺服器不是查詢的代辦人，通常也不直接回最終網站 IP。",
    "example": "查 library.example.edu：根指向 .edu，.edu 指向 example.edu 的權威伺服器，解析器再去查 A 記錄。",
    "related": [
      [
        "Root Name Server",
        "無快取時，通常提供頂級網域的轉介。"
      ],
      [
        "Authoritative Name Server",
        "提供指定區域的權威記錄。"
      ],
      [
        "DNS Cache",
        "有效的快取可以省去部分上游查詢。"
      ]
    ],
    "concept": "dns-referral"
  },
  "Iterative Query": {
    "explanation": "查詢方收到現有答案或轉介後，自己決定再問哪一台。例如解析器收到 .com 的轉介，就另向 .com 伺服器發出查詢。",
    "related": [
      [
        "Recursive Query",
        "對照要求受詢者代查最終結果的做法。"
      ],
      [
        "DNS Resolver",
        "通常由它追蹤上游的轉介。"
      ]
    ]
  },
  "Recursive Query": {
    "explanation": "查詢方要求受詢者負責找出最終答案或回覆錯誤。常見情境是用戶端請本地解析器代查。",
    "related": [
      [
        "Iterative Query",
        "對照查詢方自行追下一站的做法。"
      ],
      [
        "DNS Resolver",
        "可接受用戶端的遞迴查詢。"
      ]
    ]
  },
  "Root Name Server": {
    "explanation": "根名稱伺服器提供根區的 DNS 資料。對一般網站查詢，它通常指出負責相應頂級網域的名稱伺服器。",
    "related": [
      [
        "TLD Name Server",
        "根回覆的轉介通常指向這一層。"
      ],
      [
        "DNS Resolver",
        "由解析器解讀轉介並繼續查詢。"
      ]
    ]
  },
  "TLD Name Server": {
    "explanation": "負責像 .com、.edu 這類頂級網域的 DNS 資料，通常回覆某個下層網域的權威伺服器線索。",
    "related": [
      [
        "Root Name Server",
        "上層提供 TLD 的委派資訊。"
      ],
      [
        "Authoritative Name Server",
        "查詢常沿委派前往下一層的權威伺服器。"
      ]
    ]
  },
  "Authoritative Name Server": {
    "explanation": "權威名稱伺服器管理指定區域的正式 DNS 記錄。查詢落在它管理的區域時，它可以回覆該區域的記錄。",
    "related": [
      [
        "A Record",
        "權威伺服器可回覆的 IPv4 位址記錄。"
      ],
      [
        "DNS Resolver",
        "代用戶端向權威伺服器取答案。"
      ]
    ]
  },
  "A Record": {
    "explanation": "A 記錄把名稱對應到 IPv4 位址；要查 IPv6 則看 AAAA。",
    "related": [
      [
        "AAAA Record",
        "用 IPv6 回答同類型的位址查詢。"
      ],
      [
        "DNS",
        "提供 A 等不同種類的記錄。"
      ]
    ]
  },
  "DNS Cache": {
    "explanation": "解析器會暫存答案或轉介，有效期限內可重用。到期後通常需要再次查詢。",
    "related": [
      [
        "TTL",
        "在 DNS 中表示記錄可快取多久。"
      ],
      [
        "DNS Resolver",
        "通常利用快取減少上游查詢。"
      ]
    ]
  },
  "TTL": {
    "explanation": "DNS 的 TTL 指記錄可以快取的秒數。IPv4 的 TTL 也是存活上限，但在轉送時通常每經一台路由器扣 1，兩者用在不同地方。",
    "related": [
      [
        "DNS Cache",
        "DNS 的 TTL 到期後，快取不再直接當作新鮮答案。"
      ],
      [
        "Router",
        "轉送 IPv4 封包時會減少該封包的 TTL。"
      ]
    ]
  },
  "DHCP Discover": {
    "explanation": "剛加入本地網路的 DHCPv4 用戶端可廣播 Discover，讓本地 DHCP 伺服器或 Relay 發現它需要設定。",
    "related": [
      [
        "DHCP Offer",
        "伺服器收到 Discover 後提出可用位址。"
      ]
    ]
  },
  "DHCP Offer": {
    "explanation": "DHCP 伺服器提出可租用的 IPv4 位址與設定。用戶端可能收到多個 Offer，再選擇其中一個。",
    "related": [
      [
        "DHCP Discover",
        "此提案通常回應用戶端尋找伺服器的訊息。"
      ],
      [
        "DHCP Request",
        "用戶端接受其中一份提案時會送出。"
      ]
    ]
  },
  "DHCP Request": {
    "explanation": "在首次取得租約的流程中，用戶端送 Request 表明選定的伺服器和位址。在續租時，Request 也可用來請求延長租約。",
    "related": [
      [
        "DHCP Offer",
        "首次配置時，用戶端從提案中選一份。"
      ],
      [
        "DHCP ACK",
        "伺服器同意後回覆確認。"
      ]
    ]
  },
  "DHCP ACK": {
    "explanation": "DHCP 伺服器以 ACK 確認租約和配置。一般新裝置在完成確認後才使用分配的網路參數。",
    "related": [
      [
        "DHCP Request",
        "ACK 回覆用戶端選定方案或續租的請求。"
      ],
      [
        "DHCP",
        "初始 DORA 流程的最後一則訊息。"
      ]
    ]
  },
  "TCP": {
    "explanation": "TCP 提供可靠、有序的位元組流。遺失時可以重傳，接收端依序把位元組交給應用程式。",
    "exam": "比較 TCP、UDP 時，要寫傳送特性和適合的應用。TCP 位元組流本身不保留每次寫入的訊息邊界。",
    "example": "下載檔案時遺失一段，TCP 可以補送，讓收件端得到完整且順序正確的資料。",
    "related": [
      [
        "UDP",
        "對照無內建重傳及排序的資料報傳輸。"
      ],
      [
        "Three-way Handshake",
        "一般 TCP 連線建立前的同步流程。"
      ],
      [
        "Port Number",
        "傳輸層用埠號區分應用程式。"
      ]
    ],
    "concept": "transport"
  },
  "UDP": {
    "explanation": "UDP 傳送一個個獨立資料報，不必先建立 TCP 那樣的連線，協定本身也沒有重傳與順序保證。",
    "exam": "寫出不重傳、不保證依序，以及應用為何可容忍遺失或有自己的處理方法。速度仍取決於實際設計。",
    "example": "即時語音的一個舊資料報來不及播放時，應用可能略過它，繼續播放後面的聲音。",
    "related": [
      [
        "TCP",
        "對照可靠且有序的位元組流。"
      ],
      [
        "DHCP",
        "DHCPv4 以 UDP 傳送訊息。"
      ],
      [
        "Port Number",
        "UDP 同樣需要埠號區分應用端點。"
      ]
    ],
    "concept": "transport"
  },
  "Three-way Handshake": {
    "explanation": "一般 TCP 連線由用戶端送出 SYN，伺服器回 SYN-ACK，用戶端再回 ACK，讓雙方同步並確認起始序號。",
    "exam": "把方向也寫出來。第二則訊息同時確認用戶端的 SYN 並送出伺服器自己的 SYN；第三則由用戶端確認。",
    "example": "用戶端初始序號 100，伺服器回的 ACK 是 101。伺服器初始序號 300，用戶端最後回 ACK 301。",
    "related": [
      [
        "TCP",
        "使用三向交握建立一般連線。"
      ]
    ],
    "concept": "tcp-handshake"
  },
  "Encapsulation": {
    "explanation": "資料往下傳時，各協定層加上本層資訊。以 TCP over IPv4 over Ethernet 為例，應用資料依序包成 TCP segment、IP packet、Ethernet frame。",
    "exam": "說清楚每層用哪種識別資訊：TCP/UDP 用埠號，IP 用來源與目的 IP，Ethernet 用本鏈路的 MAC。",
    "example": "路由器拆掉舊 Ethernet 訊框並換上新的。正常轉送時，TCP 應用資料仍在 IP 封包內。",
    "related": [
      [
        "Payload",
        "某層包著的上層資料。"
      ],
      [
        "Frame",
        "送上 Ethernet 時的最外層單位。"
      ],
      [
        "Packet",
        "可由不同鏈路的訊框逐跳承載。"
      ]
    ],
    "concept": "encapsulation"
  },
  "IPv4 Fragmentation": {
    "explanation": "在允許分片的情況下，IPv4 封包過大可拆成帶有各自標頭的分片。Offset 以原始資料的偏移計算，由目的端重組。",
    "exam": "先從原始總長扣標頭。非末片的資料量受 MTU 限制，還要往下對齊 8 bytes。末片的 MF 為 0。",
    "example": "總長 3500 B、標頭 20 B、MTU 1000 B：非末片放 976 B 資料，四片總長為 996、996、996、572 B，Offset 為 0、122、244、366。",
    "related": [
      [
        "MTU",
        "限制每片的總長。"
      ],
      [
        "Fragment Offset",
        "指出分片資料在原封包中的起點。"
      ],
      [
        "DF",
        "為 1 時禁止中途分片。"
      ]
    ],
    "concept": "fragmentation"
  },
  "Fragment Offset": {
    "explanation": "Fragment Offset 表示這一片的承載資料從原始 IPv4 資料的哪個位置開始，單位是 8 bytes。",
    "exam": "累加的是前面各片的資料長度，標頭不計入。",
    "example": "第 1 片放 976 B 資料，第 2 片的 Offset 是 976 ÷ 8 = 122。",
    "related": [
      [
        "IPv4 Fragmentation",
        "分片時填此欄位供目的端重組。"
      ],
      [
        "MF",
        "指出本片後面是否還有分片。"
      ]
    ],
    "concept": "fragmentation"
  },
  "Port Number": {
    "explanation": "TCP 與 UDP 把埠號放在傳輸層標頭中，用來把資料交給正確的應用端點。它和交換器上的實體埠是不同概念。",
    "related": [
      [
        "TCP",
        "用 TCP 埠號區分連線上的應用端點。"
      ],
      [
        "UDP",
        "UDP 有自己的埠號空間。"
      ]
    ]
  },
  "MTU": {
    "explanation": "MTU 是單一鏈路能承載的網路層資料單位上限。IPv4 分片題裡，每片的 IPv4 標頭和資料加起來都不能超過它。",
    "related": [
      [
        "IPv4 Fragmentation",
        "分片可讓各片符合出站 MTU。"
      ],
      [
        "DF",
        "禁止分片時，超大的封包無法經該鏈路送出。"
      ]
    ]
  },
  "DF": {
    "explanation": "IPv4 標頭的 Don't Fragment 旗標。DF＝1 時中途不得分片，若封包超過出站鏈路的 MTU，路由器會丟棄並可回送 ICMP。",
    "related": [
      [
        "MTU",
        "比較它和封包總長判斷能否直接送出。"
      ],
      [
        "MF",
        "另一個旗標，表示是否還有後續分片。"
      ]
    ]
  },
  "MF": {
    "explanation": "IPv4 標頭的 More Fragments 旗標。除了最後一片，其他分片的 MF 應設為 1；最後一片設為 0。",
    "related": [
      [
        "Fragment Offset",
        "由偏移量找資料位置，搭配 MF 判斷末片。"
      ],
      [
        "DF",
        "標示是否禁止分片。"
      ]
    ]
  },
  "CSMA/CD": {
    "explanation": "傳統共享、半雙工 Ethernet 先聽媒介、空閒才送，發送時也監測碰撞。偵測碰撞後停止本次傳送，隨機退避再試。",
    "exam": "答案要分傳送前、傳送中、碰撞後三段。現代交換式全雙工 Ethernet 一般不需要這套碰撞偵測。",
    "example": "A、B 幾乎同時開始送，察覺碰撞後各自等待一段隨機時間，避免立刻一起重送。",
    "related": [
      [
        "CSMA/CA",
        "對照 Wi‑Fi 的碰撞避免方式。"
      ],
      [
        "Hub",
        "用來理解傳統的共享碰撞範圍。"
      ]
    ],
    "concept": "csma-cd"
  },
  "CSMA/CA": {
    "explanation": "Wi‑Fi 先感測媒介並用退避計數降低同時送出的機會。忙碌時倒數暫停，符合空閒等待條件才繼續。",
    "related": [
      [
        "Hidden Terminal",
        "顯示感測媒介仍可能漏掉另一個發送端。"
      ],
      [
        "RTS/CTS",
        "可用控制訊框通知其他站先等候。"
      ]
    ]
  },
  "Hidden Terminal": {
    "explanation": "A、C 都能傳給同一台 AP，卻收不到彼此的訊號。各自聽到空閒時，可能同時送出，在共同接收端重疊。",
    "exam": "要交代比較的兩條連線：A 和 C 彼此聽不到，但兩者都能到 AP。碰撞發生在 AP。",
    "example": "A 先發 RTS、AP 成功回 CTS 後，C 即使聽不到 A，仍可聽見 AP 並延後傳送。",
    "related": [
      [
        "RTS/CTS",
        "解釋 AP 的 CTS 如何讓另一台裝置等待。"
      ],
      [
        "Access Point",
        "本例兩路訊號抵達的共同接收端。"
      ]
    ],
    "concept": "hidden-terminal"
  },
  "RTS/CTS": {
    "explanation": "發送端用 RTS 請求傳送，接收端回 CTS。能收到 CTS 的其他裝置會依其資訊暫緩傳送；控制訊框本身仍可能競爭。",
    "related": [
      [
        "Hidden Terminal",
        "這個機制可降低隱藏終端造成的資料碰撞。"
      ],
      [
        "CSMA/CA",
        "Wi‑Fi 可搭配的媒介存取方式。"
      ]
    ]
  },
  "P2P": {
    "explanation": "P2P 把提供資料的工作分給各節點。節點可以同時下載缺少的區塊、上傳自己已有的區塊。",
    "exam": "說清楚分攤的是誰的負載，並說明需要足夠的分享者、上傳頻寬或內容驗證。",
    "example": "遊戲更新的部分區塊由其他玩家供應，官方可用簽章或雜湊驗證區塊。",
    "related": [
      [
        "Client/Server",
        "對照集中由伺服器供應的方式。"
      ],
      [
        "Digital Signature",
        "可驗證發布者及內容完整性。"
      ]
    ],
    "concept": "service-roles"
  },
  "IaaS": {
    "explanation": "租用基礎運算、儲存或網路資源。租用虛擬機時，使用者通常仍管理客體 OS 與自己部署的軟體。",
    "exam": "分辨誰要更新 OS、誰管理執行環境、是否自己寫應用。",
    "example": "租一台 VM 並自行更新 Linux 與 Web 程式，是 IaaS 的典型例子。",
    "related": [
      [
        "PaaS",
        "平台可代管 OS 和執行環境。"
      ],
      [
        "SaaS",
        "往上到直接使用平台提供的成品。"
      ]
    ],
    "concept": "cloud-models"
  },
  "PaaS": {
    "explanation": "供應商提供執行平台，使用者部署與管理自己的應用，平台通常代管底層作業系統和執行環境。",
    "related": [
      [
        "IaaS",
        "租 VM 往往需要自己照顧客體 OS。"
      ],
      [
        "SaaS",
        "直接使用成品，無須部署自己的應用。"
      ]
    ]
  },
  "SaaS": {
    "explanation": "使用者經網路直接操作供應商提供的成品應用，通常只需管理自己的內容和設定。",
    "related": [
      [
        "PaaS",
        "使用者仍需要自行部署應用。"
      ],
      [
        "IaaS",
        "主要租用基礎資源。"
      ]
    ]
  },
  "SMTP": {
    "explanation": "SMTP 用來提交或轉送郵件，郵件伺服器之間也可用它傳遞信件。",
    "exam": "題目問的是寄出、轉送，還是讀取伺服器信箱？前兩者常對應 SMTP；同步信箱狀態對應 IMAP。",
    "example": "你寄信到同學的郵件伺服器，伺服器之間使用 SMTP；同學在兩台裝置查看同一封信，可使用 IMAP。",
    "related": [
      [
        "IMAP",
        "對照收件者存取與同步信箱的工作。"
      ]
    ],
    "concept": "mail"
  },
  "IMAP": {
    "explanation": "IMAP 讓用戶端操作伺服器上的信箱，並能在多台裝置同步資料夾或已讀狀態。",
    "related": [
      [
        "SMTP",
        "寄出或在郵件伺服器間轉送使用的協定。"
      ]
    ]
  },
  "URL": {
    "explanation": "URL 指出資源所在的位置及存取方式。常見網頁 URL 可以拆成 scheme、主機名稱、路徑、查詢、片段。",
    "exam": "問號開始 query，井字號開始 fragment。一般 HTTP 請求不會把 fragment 送給伺服器。",
    "example": "https://notes.example.org/course/5?q=dns#terms 的 query 是 q=dns，fragment 是 terms，path 是 /course/5。",
    "related": [
      [
        "HTTP",
        "瀏覽器可依 URL 發出 HTTP 請求。"
      ]
    ],
    "concept": "url"
  },
  "Digital Signature": {
    "explanation": "數位簽章可驗證來源與完整性。簽署者用自己的私鑰簽署，驗證者用簽署者可信的公鑰驗證。",
    "exam": "題目問的是給誰看，還是證明誰簽的？前者是加密的機密性，後者是簽章的來源與完整性。",
    "example": "Alice 署名給 Bob：Alice 私鑰簽、Alice 公鑰驗。若另要求只有 Bob 看得懂，還要為 Bob 加密。",
    "related": [
      [
        "Private Key",
        "簽署者用自己的私鑰簽署。"
      ],
      [
        "Public Key",
        "驗證者需要可信的簽署者公鑰。"
      ],
      [
        "Security",
        "簽章涵蓋完整性與來源驗證的需求。"
      ]
    ],
    "concept": "trust-signing"
  },
  "Public Key": {
    "explanation": "可分享的金鑰。用於公鑰加密時選收件者的公鑰；用於驗證簽章時選簽署者的公鑰。",
    "related": [
      [
        "Private Key",
        "公鑰的配對金鑰，必須保密。"
      ],
      [
        "Digital Signature",
        "驗章時使用簽署者的公鑰。"
      ]
    ]
  },
  "Privacy": {
    "explanation": "隱私關心個資是否有必要被蒐集，以及後續怎麼使用、分享與保存。",
    "exam": "用同一個例子分辨安全性與隱私。資料受到保護，仍可能被過度蒐集。",
    "example": "借書系統把精確定位加密，但借書只需要帳號。多收定位仍會造成隱私問題。",
    "related": [
      [
        "Security",
        "安全措施保護已收集的資料。"
      ]
    ],
    "concept": "privacy"
  },
  "Security": {
    "explanation": "安全性關心如何保護系統與資料，主要目標包括機密性、完整性和可用性。",
    "related": [
      [
        "Privacy",
        "還會問資料該不該收、能保存多久。"
      ],
      [
        "Digital Signature",
        "可提供完整性與來源驗證。"
      ]
    ]
  },
  "IETF": {
    "explanation": "IETF 透過工作小組與公開流程制定 Internet 技術標準，例如 IP、DNS、TCP 的相關 RFC。",
    "related": [
      [
        "ICANN",
        "對照標準制定與名稱、號碼等資源協調。"
      ]
    ]
  },
  "ICANN": {
    "explanation": "ICANN 協調網域名稱與 Internet 唯一識別資源。",
    "related": [
      [
        "DNS",
        "網域名稱系統是它參與協調的基礎之一。"
      ]
    ]
  }
};

const guide = [
  {
    id: "dhcp", title: "先取得 IP", protocol: "DHCP", concept: "dhcp-exchange", question: "practice-78", minutes: 3,
    why: "筆電剛接上 Wi‑Fi，需要取得可以使用的 IPv4 位址和網路設定。",
    prompt: "筆電第一次向本地 DHCP 伺服器取得位址，正常的訊息順序是什麼？"
  },
  {
    id: "dns", title: "把網址變成 IP", protocol: "DNS", concept: "dns-referral", question: "practice-91", minutes: 4,
    why: "取得設定後，筆電要把網站名稱查成位址，才能知道要連到哪裡。",
    prompt: "解析器依序問根、.edu，再問權威伺服器。是誰一直跟著轉介去問下一站？",
    options: ["給出答案後的權威伺服器", "替筆電代查的根伺服器", "逐次發出查詢的解析器", "筆電的網路介面卡"]
  },
  {
    id: "tcp", title: "建立連線", protocol: "TCP", concept: "tcp-handshake", question: "practice-124", minutes: 3,
    why: "現在知道伺服器的 IP 了。這個例子假設網站使用 TCP，先建立連線才能送應用資料。",
    prompt: "一般 TCP 連線的三向交握，訊息依照什麼順序送出？"
  }
];

const forwarding = [
  { actor: "筆電 A", action: "看筆電送出", summary: "目的 IP 不在本地子網，筆電把第一跳的訊框交給預設閘道。",
    mac: "A → R 的左側介面", ip: "192.168.1.10 → 192.168.2.20", ttl: 64, from: 0, to: 1 },
  { actor: "Switch", action: "看 Switch 轉送", summary: "Switch 學來源 MAC A，再查目的 MAC R，從對應埠送出同一個訊框。此處假設目的 MAC 已在表中。",
    mac: "A → R 的左側介面", ip: "192.168.1.10 → 192.168.2.20", ttl: 64, from: 1, to: 2 },
  { actor: "Router R", action: "看 Router 重包", summary: "Router 取出封包，以目的 IP 查路由，在右側網段重建訊框，把它交給主機 B。",
    mac: "R 的右側介面 → B", ip: "192.168.1.10 → 192.168.2.20", ttl: 63, from: 2, to: 3 }
];

const lessons = {
  58: {
    summary: "小寫 internet 泛指多個網路互連形成的系統，大寫 The Internet 指全球互連的網際網路。只要還有可用的替代路徑，局部斷線後仍可能繼續通訊。",
    sections: [
      {
        title: "從兩個區域網路理解 Internet",
        paragraphs: [
          "想像校園有自己的 LAN，公司也有一套 LAN。各自的設備可以在自己的網路裡交換資料。當兩邊透過路由器和中間網路互連，校園電腦就能把封包送到公司網路的裝置。",
          "把這個例子擴大到全球，就能理解投影片說的 Network of Networks。校園、企業、電信業者和其他組織各自營運網路，透過共同的 IP 協定和網路互連交換資料。"
        ],
        flow: { label: "資料如何跨網路", items: ["校園 LAN", "路由器與中間網路", "公司 LAN"] }
      },
      {
        title: "一段連線斷了，資料還能怎麼走？",
        paragraphs: [
          "假設 A 可以經 B 到 D，也有一條經 C 到 D 的路。當經 B 的鏈路中斷，路由資訊更新後，後續封包仍可能經 C 到 D。投影片要你抓住的是局部故障下維持通訊的設計目標。",
          "繞路的前提是替代路徑確實存在。如果目的端與其他網路的唯一連線斷掉，封包暫時就送不到。"
        ],
        flow: { label: "原路中斷後的一條替代路徑", items: ["網路 A", "網路 C", "網路 D"] }
      },
      {
        title: "為什麼投影片同時列 PAN、LAN、MAN、WAN？",
        paragraphs: [
          "這些名稱描述網路的涵蓋範圍。個人裝置周圍的小範圍連線是 PAN，校園或辦公室內常見 LAN，MAN 涵蓋都會區，WAN 可跨城市或更遠。Internet 把不同規模的網路互連，參與者也可以是不同的營運組織。"
        ]
      }
    ],
    exam: "The Internet 是跨越全球的 Network of Networks，由不同規模的網路互連而成。早期設計目標之一，是讓局部鏈路故障時，仍有機會經由 Alternative Paths 傳輸封包。"
  },
  59: {
    summary: "開啟網站時，請求經接取 ISP 和多台 Router 一跳一跳到 Web Server。每台 Router 會用目的 IP 查轉送資訊，決定封包的下一跳。",
    sections: [
      {
        title: "跟著一次網站請求走",
        paragraphs: [
          "假設你已知道課程網站的 IP。瀏覽器要向 Web Server 取得內容，電腦把資料放入封包，交給接取網路。進入 ISP 後，沿路的 Router 逐一接手，把封包轉送到目的伺服器所在的網路。",
          "伺服器再送回回應。投影片的去程與回程箭頭畫出資料交換的兩個方向。實際上，回程取決於從伺服器往你所在網路的路由。"
        ],
        flow: { label: "原投影片的傳送方向", items: ["你的電腦", "接取 ISP", "沿路的 Router", "Web Server"] }
      },
      {
        title: "封包交換如何使用共用網路？",
        paragraphs: [
          "Packet Switching 把資料分成封包。每段鏈路可以輪流傳送許多使用者的封包，Router 依目前的轉送資訊處理手上的封包。路由穩定時，多個封包可能走同一路徑。路由更新時，之後的封包也可能改走其他路徑。",
          "以 TCP 為例，兩端可以維持一條邏輯連線，讓瀏覽器接收有順序的資料。底下的 IP 封包仍透過共用鏈路傳送。"
        ]
      },
      {
        title: "從目的 IP 到實際送出",
        paragraphs: [
          "以 p.39～40 的 Router 為基礎，可以把查表理解成「這個目的網路應該往哪邊送」。Routing Table 提供可達網路和路徑資訊。實際轉送時，設備通常查由路由資訊產生的 Forwarding Table。"
        ],
        steps: [
          "讀取 IP 標頭的 Destination IP Address。",
          "查找能覆蓋這個位址的網路前綴。IPv4 一般優先用最長的相符前綴。",
          "從查到的項目取得 Next Hop（下一跳）或 Outgoing Interface（送出介面），再轉送封包。"
        ],
        pages: [[39, "回看 p.39 的 Router"], [40, "回看 p.40 的逐跳轉送"]]
      },
      {
        title: "投影片說的最佳路徑",
        paragraphs: [
          "路由協定和政策決定哪些路徑能被選進路由表，例如鏈路成本、上游關係和當前可用性。這裡的最佳路徑是依這些條件選出的路由。"
        ]
      }
    ],
    check: "回答「Router 怎麼轉送」時，寫完目的 IP，接著交代查表、下一跳或送出介面，最後寫它把封包交給下一站。",
    exam: "資料透過 ISP 接入 Internet，以 Packets 經多個 Routers 送往 Web Server。Router 依目的 IP 查轉送表，決定 Next Hop 或 Outgoing Interface，再逐跳轉送封包。",
    sources: [["IPv4 路由器轉送 · RFC 1812", "https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4"]]
  },
  60: {
    summary: "ISP 提供接入 Internet 的服務。看 Tier 1、Tier 2、Access ISP 的分類時，先分清楚網路之間是對等互連（Peering），還是購買轉接（Transit）。",
    sections: [
      {
        title: "Peering 和 Transit 是兩種互連方式",
        paragraphs: [
          "Peering 是兩個網路直接交換彼此與客戶網路的流量。例如兩家 ISP 都有本地用戶，雙方可以互連，讓那些用戶間的流量直接進對方的網路。",
          "Transit 是向上游購買可達性。接取 ISP 將去遠端的封包交給上游，由上游透過自己的互連把封包送往更廣的 Internet。"
        ]
      },
      {
        title: "用可達性判斷講義的三種 ISP",
        table: {
          caption: "投影片的 ISP 分級",
          headings: ["分類", "從哪些互連取得可達性"],
          rows: [
            ["Tier 1", "以免費互惠的 Peering 取得整體可達性，無須向上游購買 Transit。"],
            ["Tier 2", "可與部分網路 Peering，仍購買 Transit 以到達其他目的地。"],
            ["Access／Tier 3", "依講義的分類，只靠購買 Transit 取得對外可達性，將終端使用者接到 Internet。"]
          ]
        },
        paragraphs: [
          "例如某 ISP 和附近夥伴直接交換流量，但要連到另外一批遠端網路仍得買 Transit，就對應講義的 Tier 2。真實公司的互連關係可能因地區和契約而更複雜，作答時先說明這三種角色。"
        ]
      },
      {
        title: "接入方式回答的是最後一段怎麼連",
        paragraphs: [
          "投影片列出無線熱點、電話線、纜線、衛星、DSL 和光纖。宿舍裡的筆電可能用 Wi-Fi 接到室內設備，學校再透過光纖連出。這些媒介和接入技術回答的是裝置如何接到網路，ISP 分級則看網路之間的互連關係。"
        ]
      }
    ],
    check: "題目提到一家公司有 Peering 時，再看它是否仍購買 Transit。為部分目的地購買 Transit 是講義區分 Tier 2 的線索。",
    exam: "ISP 提供 Internet Connectivity。Tier 1 以免費互惠的 Peering 取得整體可達性。Tier 2 會購買 Transit 以到達部分目的地，也可以 Peering。Access ISP 主要向上游買 Transit，將終端使用者接入。"
  },
  61: {
    summary: "從圖下方的 End Systems 往上讀，先看到 Access ISP，再看到 Tier 2 與 Tier 1。圖中的橫線與斜線表示網路之間有多種互連。",
    sections: [
      {
        title: "從最下面的裝置開始讀圖",
        paragraphs: [
          "最下方的小方塊是 End Systems，也就是使用或提供網路服務的端點，例如筆電、手機和 Web Server。它們先接到圖中的 Access ISP。圖上中間是 Tier 2，上方是 Tier 1，代表講義用來說明接取與上游互連的角色。",
          "可以先追一條簡化路線。你要讀取遠端伺服器時，你的電腦先把資料送進自己的接取網，接著由各網路依路由資訊轉送，最後到伺服器所在的網路。"
        ],
        flow: { label: "從使用者到遠端網路的簡化路線", items: ["使用者裝置", "Access ISP", "上游或對等網路", "目的端網路"] }
      },
      {
        title: "沿著原圖找橫向與斜向連線",
        paragraphs: [
          "原圖上層有同層互連，中間與下層也有交叉連線。這些線能幫你看到，一個網路可能連到不同上游，也可能和同層的網路交換流量。",
          "假設兩個 Access ISP 透過同一個上游就能互通，封包可以在那個上游轉到目的網路。路由怎麼走，取決於可用互連、目的地和路由政策。"
        ]
      },
      {
        title: "把這張圖和上一頁接起來",
        paragraphs: [
          "p.60 的 Peering 與 Transit 用來解釋連線背後的關係。圖中一條線只表示互連，要判定是 Peering 還是 Transit，還要知道兩邊的協議。"
        ],
        pages: [[60, "回看 Peering 與 Transit"]]
      }
    ],
    exam: "圖中由下而上是 End Systems、Access ISPs、Tier 2 ISPs 和 Tier 1 ISPs。端點先接入本地網路，ISP 之間的上游和對等互連提供到達其他網路的路徑。"
  },
  62: {
    summary: "IP Address 讓網路能把封包送往目的介面，Domain Name 讓人容易記住服務的位置。DNS 用名稱查資料，常見的結果之一是 IP 位址。",
    sections: [
      {
        title: "IPv4 和 IPv6 的長度與寫法",
        paragraphs: [
          "原投影片把 32-bit、128-bit 和 Dotted Decimal 寫在一起。分開記會更清楚。IPv4 用四組十進位表示，每組 8 bits。IPv6 通常將 128 bits 分成八組，每組最多四個十六進位數字，以冒號分隔。",
          "例如 2001:db8::1 完整展開是 2001:0db8:0000:0000:0000:0000:0000:0001。短寫保留了三組，讀到 :: 時補上五組 0，就能還原八組。"
        ],
        table: {
          caption: "兩代 IP 位址的例子",
          headings: ["版本", "長度", "常見寫法"],
          rows: [
            ["IPv4", "32 bits", "192.0.2.10"],
            ["IPv6", "128 bits", "2001:db8::1"]
          ]
        }
      },
      {
        title: "從網址的右邊找 Top-Level Domain",
        paragraphs: [
          "以 www.example.org 為例，最右邊的 org 是 Top-Level Domain（TLD）。往左的 example 組成 example.org，www 則是再下一層的名稱。投影片把這種方便人記憶的名稱稱為 Mnemonic Address。",
          "講義同時列出 .org、.com 和 .au、.ca 等例子。後兩個是國碼頂級網域。遇到新名稱時，先從最右側找 TLD，再往左找更具體的名稱。"
        ]
      },
      {
        title: "DNS Lookup 接在什麼地方？",
        paragraphs: [
          "假設你輸入 www.example.org，瀏覽器需要先知道可以連到哪個 IP。系統透過 DNS 查詢名稱的記錄，取得應用程式可使用的位址，再建立後續通訊。DNS 也可回傳其他類型的資料，後面 p.74～82 會再讀解析流程。"
        ],
        flow: { label: "用名稱取得位址", items: ["www.example.org", "DNS 查詢", "取得 IP 位址"] },
        pages: [[74, "前往 DNS 章節"]]
      }
    ],
    check: "題目問表示法時，把 IPv4 和 IPv6 分兩句寫。遇到網域相關題目，先辨認是在問人使用的名稱、查詢程序，還是網路送封包用的位址。",
    exam: "IPv4 是 32-bit 位址，通常採 Dotted Decimal。IPv6 是 128-bit 位址，常用冒號分隔的十六進位表示。Domain Name 方便記憶，DNS 可將名稱查成對應的 IP 位址等記錄。",
    sources: [["IPv6 位址表示法 · RFC 4291", "https://www.rfc-editor.org/rfc/rfc4291.html#section-2.2"]]
  },
  63: {
    summary: "ICANN 協調全球網路的名稱和號碼資源。位址分配經由 IANA 職能和各地 RIR 分層處理，網域註冊也有各自的管理與服務角色。",
    sections: [
      {
        title: "為什麼需要協調識別資源？",
        paragraphs: [
          "想像兩個互相獨立的網路同時把同一段公用 IPv4 宣告成自己的網段，其他網路就難以判斷該往哪裡送。公用位址的分配和全球 DNS 名稱空間，都需要一致的協調規則。",
          "ICANN 的全名是 Internet Corporation for Assigned Names and Numbers。投影片要記的兩個方向是 IP 位址資源與 Domain Name 的協調。"
        ]
      },
      {
        title: "IP 位址資源怎麼逐層分配？",
        paragraphs: [
          "投影片用 ICANN 分配到 ISP 來概括。實務上，IANA 職能會依政策將位址區塊配置給各區的 Regional Internet Registries（RIR）。RIR 和相關註冊機構再依區域政策配置給 ISP 或其他組織。"
        ],
        flow: { label: "位址分配的簡化層級", items: ["IANA 職能", "區域註冊機構 RIR", "ISP 或其他組織"] }
      },
      {
        title: "網域註冊和 DNS 查詢各由誰做？",
        table: {
          caption: "常見角色與工作",
          headings: ["角色", "負責的事"],
          rows: [
            ["Registry", "營運某個頂級網域的登錄資料庫。"],
            ["Registrar", "提供使用者註冊、續約和管理網域名的服務。"],
            ["DNS 解析器", "代使用者查名稱的 DNS 記錄。"],
            ["ISP", "提供網路接入與連線服務。"]
          ]
        },
        paragraphs: [
          "例如註冊 example.org 時，使用者通常找 Registrar，域名登錄資料進入 .org 的 Registry。之後瀏覽器查 www.example.org 的位址，是另一個 DNS 解析流程。"
        ]
      }
    ],
    exam: "ICANN 協調 Internet 的全球唯一識別資源，涵蓋 IP Address 和 Domain Name。位址通常依 IANA 和各區 RIR 的分層機制分配，網域由相應的 Registry 和 Registrar 處理登錄與註冊。",
    sources: [["IANA 號碼資源與區域分配", "https://www.iana.org/numbers"]]
  },
  64: {
    summary: "這頁的位址屬於 IPv4。每個 IPv4 位址有 32 bits，圖上的 IP 標在網路介面（Interface）上，一台路由器可以有多個介面。",
    sections: [
      {
        title: "在原圖上找路由器的三個介面",
        paragraphs: [
          "Interface 是裝置接到某段網路的介面。看原圖中央的 Router，由左、右、下三條線接到不同區域。線靠近 Router 的位址分別是 223.1.1.4、223.1.2.9 和 223.1.3.27。把一條線配上一個介面，就能看懂為什麼同一台 Router 上會出現三個 IP。",
          "看最左邊的筆電 223.1.1.1，它在示意圖裡只畫了一個網路介面。真實筆電可以同時有 Wi-Fi、有線網路或虛擬介面，各介面都可能配置位址。"
        ]
      },
      {
        title: "把 223.1.1.1 拆成四個 Octet",
        paragraphs: [
          "Octet 是 8 bits。以第一段 223 為例，將它拆成 128＋64＋16＋8＋4＋2＋1。從左往右對照 128、64、32、16、8、4、2、1，只有 32 的位置沒有用到，所以寫成 11011111。",
          "另外三段都是 1，寫成 00000001。每段補成 8 位，四段合計 32 位。每段最大值是 255，因為 8 位全部填 1 的和就是 255。"
        ],
        bits: {
          caption: "223.1.1.1 的四組位元",
          groups: [["11011111", "", "223"], ["00000001", "", "1"], ["00000001", "", "1"], ["00000001", "", "1"]]
        }
      },
      {
        title: "下一頁會用到這張圖",
        paragraphs: [
          "先記住同一台 Router 的三個介面分別接到三段網路。p.65 沿用同一張圖，會把每個介面和它能直接到達的端點圈成一組。"
        ]
      }
    ],
    check: "看圖時逐條對照介面旁的 IP。一台電腦有幾個位址，要看它有哪些介面以及如何配置。",
    exam: "IPv4 Address 是 32-bit 位址，通常以四組點分十進位表示。位址與 Network Interface 關聯。Router 的不同 Interface 可接到不同網路，並有各自的 IP 位址。"
  },
  65: {
    summary: "子網路的介面共享同一段前綴。前綴位於 IP 的高位元，主機部分位於低位元。判斷同一子網時，要連同前綴長度一起看。",
    sections: [
      {
        title: "先看原圖的三塊藍色區域",
        paragraphs: [
          "原圖左、右、下三組各有自己的鏈路。每一組都將 Router 接過來的那個介面一起圈進去。例如右側由 223.1.2.1、223.1.2.2 和 Router 的 223.1.2.9 組成。圈裡的介面在這個模型下可以直接互通，跨出圈才要經過 Router 的轉送。"
        ],
        table: {
          caption: "圖中的三組介面",
          headings: ["區域", "投影片上的位址"],
          rows: [
            ["左側", "223.1.1.1、223.1.1.2、223.1.1.3、223.1.1.4"],
            ["右側", "223.1.2.1、223.1.2.2、223.1.2.9"],
            ["下方", "223.1.3.1、223.1.3.2、223.1.3.27"]
          ]
        }
      },
      {
        title: "同一個前綴怎麼判斷？",
        paragraphs: [
          "搭配 p.66 標出的 /24，先畫分界線。每段是 8 bits，前 24 bits 正好是前三段十進位。223.1.1.1 和 223.1.1.4 的前三段都等於 223.1.1，因此它們共享同一個 /24 前綴。最後一段不同，用來區別介面。",
          "比較 223.1.1.1/24 和 223.1.2.9/24 時，第三段分別是 1 和 2，所以落在兩個子網。若題目給 /23 或 /26，先畫位元分界，前綴可能在某個 Octet 中間結束。"
        ],
        pages: [[66, "看 p.66 的 /24 遮罩"]]
      }
    ],
    check: "解題順序是先讀前綴長度，再取出要比較的前綴位元。前三段相同的速判法只適用於 /24。",
    exam: "Subnet 是由共享相同 Network Prefix 的介面構成的 IP 網路區段。高位元是 Subnet Part，低位元是 Host Part。同一子網的介面在此模型中可直接透過本地鏈路通訊。"
  },
  66: {
    summary: "投影片把三個區段標成 /24。前 24 bits 視為網路部分、後 8 bits 視為主機部分，對應的遮罩是 255.255.255.0。",
    sections: [
      {
        title: "先依鏈路找出三座網路小島",
        paragraphs: [
          "投影片教你在想像中把每個介面和 Router 機身分開，只保留介面原本接到的那一段鏈路。原圖就分成三座小島，分別標成 223.1.1.0/24、223.1.2.0/24、223.1.3.0/24。每座島的介面可以在同一段網路上直接互通。"
        ]
      },
      {
        title: "從 /24 寫出 Subnet Mask",
        paragraphs: [
          "遮罩在每個前綴位置填 1、主機位置填 0。前 24 位就是三組 11111111，每組換成十進位是 255。最後一組是 00000000，所以遮罩寫成 255.255.255.0。"
        ],
        bits: {
          caption: "/24 的遮罩位元",
          split: true,
          groups: [["11111111", "", "255"], ["11111111", "", "255"], ["11111111", "", "255"], ["", "00000000", "0"]]
        }
      },
      {
        title: "算一次 Network Address 和可用範圍",
        paragraphs: [
          "拿右側的 223.1.2.9 跟遮罩做 bitwise AND。前面三段與 255 做 AND，保留原值。最後一段與 0 做 AND，變成 0，因此網路位址是 223.1.2.0。",
          "8 個 host bits 一共有 2⁸＝256 種組合。這個例子使用一般 IPv4 子網的算法，主機部分全 0 是 Network Address，全 1 是 Broadcast Address，其餘 254 個是可分配給主機的位址。"
        ],
        table: {
          caption: "223.1.2.0/24 的位址分布",
          headings: ["項目", "位址或數量"],
          rows: [
            ["網路位址", "223.1.2.0"],
            ["可用主機範圍", "223.1.2.1～223.1.2.254"],
            ["廣播位址", "223.1.2.255"],
            ["總計／可用", "256 個／254 個"]
          ]
        }
      }
    ],
    check: "遇到「有多少地址」時，先看題目問總位址還是可用主機位址，並寫清楚 256 與 254 的差別。",
    exam: "在 /24 IPv4 子網中，前 24 bits 是網路、後 8 bits 是主機，遮罩為 255.255.255.0。將 IP 與遮罩做 AND 得到 Network Address。一般 /24 有 256 個位址，其中 254 個可用於主機。"
  },
  67: {
    summary: "每一段獨立的 IP 網路都要算進去。原圖有 3 段 LAN，也有 3 條 Router-to-Router Link，所以共有 6 個子網路。",
    sections: [
      {
        title: "先找端點群，再找三角形的邊",
        paragraphs: [
          "看原圖，先圈上方、左下、右下三群終端設備。每群和連向該群的 Router 介面各算一段 LAN。接著只看三台 Router，它們的互連形成三角形，每一條邊都是獨立的鏈路，有自己兩端的 IP 介面。"
        ],
        table: {
          caption: "照原圖逐一核對 6 個區段",
          headings: ["區段", "圖上的位址線索"],
          rows: [
            ["上方 LAN", "223.1.1.x"],
            ["左下 LAN", "223.1.2.x"],
            ["右下 LAN", "223.1.3.x"],
            ["Router 互連 · 右斜邊", "223.1.7.0、223.1.7.1"],
            ["Router 互連 · 底邊", "223.1.8.0、223.1.8.1"],
            ["Router 互連 · 左斜邊", "223.1.9.1、223.1.9.2"]
          ]
        }
      },
      {
        title: "一台 Router 可以接好幾段子網",
        paragraphs: [
          "每台 Router 在圖上有三個方向的介面。以最上方那台為例，它接上方的 LAN，也接往另外兩台 Router 的鏈路。判斷時讓每個介面跟著它所在的鏈路，就能把六段分清楚。"
        ]
      },
      {
        title: "為什麼要先看前綴才判斷 .0？",
        paragraphs: [
          "圖上出現了 223.1.7.0、223.1.8.0，但題目沒有交代每條鏈路的遮罩。個別位址的角色要依前綴與使用情境判斷。舉例來說，點對點鏈路使用 /31 時，兩個位址都可作為端點。這題的計數依圖上的鏈路分組即可。"
        ]
      }
    ],
    check: "數完三群電腦後，再沿著三角形掃一圈。每條 Router-to-Router Link 也算一段。",
    exam: "原圖共有 6 個 Subnets，包括 3 段 LAN 與 3 條 Router-to-Router Links。每條連接 Router 的獨立 IP 鏈路都構成一個子網。",
    sources: [["點對點鏈路的 /31 · RFC 3021", "https://www.rfc-editor.org/rfc/rfc3021.html"]]
  },
  68: {
    summary: "CIDR 的 /x 表示網路前綴有 x 個 bits。講義的 200.23.16.0/23 把第三段的最後一位留給主機，因此位址涵蓋 200.23.16.x 和 200.23.17.x。",
    sections: [
      {
        title: "先畫位元分界，再讀 /23",
        paragraphs: [
          "CIDR（Classless Inter-Domain Routing）允許使用不同長度的網路前綴。以 a.b.c.d/x 表示 IPv4 前綴時，x 告訴你要從左往右固定幾個位元。講義例子 /23 固定前兩組共 16 位，再固定第三組的前 7 位。第三組最後 1 位和第四組全部 8 位都在主機部分。"
        ],
        bits: {
          caption: "200.23.16.0/23 的前綴與主機部分",
          split: true,
          groups: [["11001000", "", "200"], ["00010111", "", "23"], ["0001000", "0", "16"], ["", "00000000", "0"]]
        }
      },
      {
        title: "第三段遮罩為什麼是 254？",
        paragraphs: [
          "把全部 23 個前綴位元換成 1，其餘 9 個主機位元換成 0。遮罩四段會是 11111111、11111111、11111110、00000000。第三段只少了最右邊權重為 1 的位元，所以是 255 減 1，等於 254。整個遮罩就是 255.255.254.0。"
        ]
      },
      {
        title: "推導最小與最大位址",
        steps: [
          "主機部分全設為 0。第三段維持 00010000（16），第四段為 0，得到網路位址 200.23.16.0。",
          "主機部分全設為 1。第三段變成 00010001（17），第四段為 255，得到廣播位址 200.23.17.255。",
          "主機部分有 9 位，總位址數是 2⁹＝512。用一般 IPv4 子網規則扣除網路與廣播位址，可用主機位址為 510 個。"
        ],
        table: {
          caption: "200.23.16.0/23 的完整結果",
          headings: ["項目", "結果"],
          rows: [
            ["Subnet Mask", "255.255.254.0"],
            ["Network Address", "200.23.16.0"],
            ["第一個可用主機", "200.23.16.1"],
            ["最後一個可用主機", "200.23.17.254"],
            ["Broadcast Address", "200.23.17.255"],
            ["總位址／可用主機", "512 個／510 個"]
          ]
        }
      },
      {
        title: "換一個 IP 試判斷",
        paragraphs: [
          "200.23.17.4 屬於這個 /23，因為 17 與 16 只差第三段的最低位，那一位屬於主機部分。200.23.18.4 的第三段是 18，改到了已固定的前綴位元，因此落在下一個區段。",
          "也可以比較範圍大小。/23 留 9 位主機，跨兩個 /24；/24 留 8 位主機；/25 留 7 位主機。每多固定一個前綴位元，可用來變動的位址組合就減半。"
        ]
      }
    ],
    check: "算完遮罩後，把主機部分全設 1 再核對廣播位址。/23 的主機部分跨兩個 Octet，第三段的最後一位也會改變。",
    exam: "CIDR 以 a.b.c.d/x 表示前 x 個位元為網路前綴。200.23.16.0/23 留 9 個 host bits，遮罩為 255.255.254.0，位址範圍從 200.23.16.0 到 200.23.17.255，共 512 個，一般可用於主機的有 510 個。",
    sources: [["CIDR 前綴表示 · RFC 4632", "https://www.rfc-editor.org/rfc/rfc4632.html#section-3.1"]]
  }
};

StudySite.registerCourseStudy("lecture-05", { terms, guide, forwarding, lessons });
})();
