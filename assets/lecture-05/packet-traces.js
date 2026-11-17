"use strict";

const Chapter04PacketTraces = (() => {
  const field = (label, value, note, hex) => ({ label, value, note, hex });
  const layer = (name, ...fields) => ({ name, fields });
  const node = (id, label, x, y) => ({ id, label, x, y });
  const graph = (nodes, links) => ({ nodes, links });
  const event = (phase, label, title, note, path = [], layers = [], extra = {}) =>
    ({ phase, label, title, note, path, layers, ...extra });
  const check = (question, options, correct, hint, reason) => ({ question, options, correct, hint, reason });
  const mode = (label, task, events) => ({ label, task, events });

  const clientIP = "192.0.2.10";
  const gatewayIP = "192.0.2.1";
  const resolverIP = "192.0.2.53";
  const webIP = "198.51.100.24";
  const clientMac = "02:00:00:00:00:0A";
  const neighborMac = "02:00:00:00:00:0B";
  const routerIn = "02:00:00:00:00:01";
  const routerOut = "02:00:00:00:01:01";
  const serverMac = "02:00:00:00:01:24";
  const broadcast = "FF:FF:FF:FF:FF:FF";
  const clientPort = 51514;
  const domain = "example.com";
  const dnsNames = ["client", "resolver", "root", "tld", "authority"];
  const sharedActors = {
    client: "用戶端", resolver: "DNS 解析器", root: "根伺服器", tld: ".com 伺服器",
    authority: "權威伺服器", gateway: "路由器", server: "網站伺服器"
  };
  const actor = (id, x, y) => node(id, sharedActors[id], x, y);
  const dnsGraph = graph([
    actor("client", 17, 51), actor("resolver", 48, 51), actor("root", 81, 22),
    actor("tld", 81, 51), actor("authority", 81, 80)
  ], dnsNames.slice(2).map(id => ["resolver", id]).concat([["client", "resolver"]]));
  const webGraph = graph([
    actor("client", 16, 67), actor("resolver", 44, 42), actor("root", 22, 17), actor("tld", 62, 17),
    actor("authority", 83, 42), actor("gateway", 47, 79), actor("server", 83, 79)
  ], dnsGraph.links.concat([["client", "gateway"], ["gateway", "server"]]));
  const pairGraph = graph([actor("client", 22, 54), actor("server", 78, 54)], [["client", "server"]]);
  const forwardGraph = graph([
    actor("client", 16, 55), node("switch", "交換器", 42, 55), actor("gateway", 66, 55),
    actor("server", 82, 82), node("peer", "同網段主機", 56, 19)
  ], [["client", "switch"], ["switch", "gateway"], ["switch", "peer"], ["gateway", "server"]]);
  const dhcpGraph = graph([
    actor("client", 20, 50), node("segment", "區域網路", 49, 50), node("dhcp", "DHCP 伺服器", 80, 50)
  ], [["client", "segment"], ["segment", "dhcp"]]);
  const arpGraph = graph([
    actor("client", 16, 51), node("switch", "交換器", 48, 51), actor("gateway", 81, 23),
    node("peer", "同網段主機", 81, 78)
  ], [["client", "switch"], ["switch", "gateway"], ["switch", "peer"]]);
  const ipGraph = graph([
    actor("client", 20, 52), actor("gateway", 50, 52), actor("server", 80, 52)
  ], [["client", "gateway"], ["gateway", "server"]]);

  const udp = (from, to, length) => layer("UDP",
    field("來源埠", from, "送出資料的應用程式所使用的埠。"),
    field("目的埠", to, "接收端用目的埠把資料交給相應的服務。"),
    ...(length ? [field("UDP Length", length + " bytes", "8 bytes 的 UDP 標頭加上資料。", word(length))] : []));
  function word(value) {
    return value.toString(16).toUpperCase().padStart(4, "0").match(/../g).join(" ");
  }
  const ipv4 = (from, to, ttl) => layer("IPv4",
    field("目的 IP", to, "路由器用這個欄位查路由，決定往哪裡轉送。"),
    field("來源 IP", from, "原本送出這個封包的主機。"),
    ...(ttl === undefined ? [] : [field("TTL", ttl, "IPv4 封包經過一台路由器時，通常減 1。", word(ttl).slice(-2))]));
  const ethernet = (from, to, type = "0800") => layer("Ethernet",
    field("目的 MAC", to, "同一跳上應該接收這個訊框的介面。"),
    field("來源 MAC", from, "這一跳送出訊框的介面。"),
    field("EtherType", type === "0800" ? "IPv4" : "ARP", "標示 Ethernet 資料欄中裝的是什麼。", type.match(/../g).join(" ")));
  const tcpBits = { SYN: "02", "SYN-ACK": "12", ACK: "10" };
  function tcp(out, flags, seq, ack, length = 0, service = 443) {
    return layer("TCP",
      field("Flags", flags, "控制旗標。SYN 同步初始序號，ACK 表示確認號有效。", tcpBits[flags]),
      field("Sequence", seq, "目前這段資料在位元組流中的起點。SYN 也占一個序號。"),
      ...(ack === undefined ? [] : [field("Acknowledgment", ack, "確認號是下一個期待收到的序號。")]),
      field("目的埠", out ? service : clientPort, "接收端用目的埠識別對應的連線。"),
      field("來源埠", out ? clientPort : service, "由這一端的應用程式所使用。"),
      field("資料長度", length + " bytes", "此處只計算 TCP 資料欄。"));
  }
  function handshake(path, service = 443) {
    const reverse = [...path].reverse();
    return [
      event("TCP", "SYN", "用戶端要求建立連線", "用戶端宣告初始序號 1000，讓對端知道接下來從哪裡接資料。", path,
        [tcp(true, "SYN", 1000, undefined, 0, service)]),
      event("TCP", "SYN-ACK", "伺服器回應 SYN-ACK", "伺服器宣告自己的初始序號 7000，同時確認用戶端的 SYN。用戶端下一個序號是 1001。", reverse,
        [tcp(false, "SYN-ACK", 7000, 1001, 0, service)]),
      event("TCP", "ACK", "用戶端確認伺服器的初始序號", "用戶端回 ACK 7001。雙方已同步序號，可以開始傳輸。", path,
        [tcp(true, "ACK", 1001, 7001, 0, service)], { summary: "TCP 連線已建立" })
    ];
  }

  function dnsTrace(cacheHit) {
    const dnsQuestion = field("Question", domain + " · A", "A 記錄查詢要找這個名稱的 IPv4 位址。");
    const answer = layer("DNS", field("Answer", domain + " → " + webIP, "A 記錄提供網站的 IPv4 位址。"),
      field("TTL", cacheHit ? "180 秒" : "300 秒", "這筆記錄還能留在 DNS 快取裡多久。"));
    const trace = [
      event("DNS", "DNS Query", "先把網域名稱交給解析器", "應用程式請系統解析 example.com。這次由用戶端向設定好的 DNS 解析器提出遞迴查詢。",
        ["client", "resolver"], [layer("DNS", dnsQuestion, field("RD", "1", "用戶端請解析器代為取得最終答案。")),
          udp(54000, 53), ipv4(clientIP, resolverIP)], {
          check: check("這個查詢下一站要交給誰？", ["DNS 解析器", "根伺服器", "網站伺服器"], 0,
            "看用戶端已經知道哪一台服務的位址。",
            "用戶端設定的 DNS 解析器位址是 " + resolverIP + "。它會代為整理答案，必要時再問上游。")
        })
    ];
    if (!cacheHit) {
      const referrals = [
        ["root", "根伺服器", ".com 的名稱伺服器", "根伺服器指出負責 .com 的伺服器。"],
        ["tld", ".com 伺服器", "example.com 的權威名稱伺服器", ".com 伺服器指出負責 example.com 的權威伺服器。"],
        ["authority", "權威伺服器", "", "這次是掌管 example.com 記錄的伺服器。"]
      ];
      for (const [id, label, referral, explanation] of referrals) {
        trace.push(event("DNS", "上游查詢", "解析器詢問" + label, explanation, ["resolver", id],
          [layer("DNS", dnsQuestion, field("RD", "0", "這裡用迭代查詢，接受下一站線索或答案。"))]));
        trace.push(event("DNS", referral ? "Referral" : "A 記錄",
          referral ? label + "回傳下一站" : "權威伺服器回傳網站 IP",
          referral ? "解析器收到「" + referral + "」，接著向那一站查詢。" : "這次收到 A 記錄，解析器可以先暫存，再把答案交回用戶端。",
          [id, "resolver"], referral ? [layer("DNS", field("Authority · NS", referral, "列出下一層的名稱伺服器。"),
            field("Answer", "空", "這則轉介提供伺服器線索。"))] : [answer]));
      }
    }
    trace.push(event("DNS", cacheHit ? "快取答案" : "DNS Response", "用戶端取得網站 IP",
      cacheHit ? "解析器裡的 A 記錄還有效，直接回傳。這輪省下根、.com 和權威伺服器的三次上游往返。" :
        "解析器回傳最終答案。用戶端已知道網站的位置，接下來才會建立傳輸連線。",
      ["resolver", "client"], [answer, udp(53, 54000), ipv4(resolverIP, clientIP)], {
        summary: cacheHit ? "DNS 快取命中 · 上游查詢 0 次" : "取得網站 IPv4 · " + webIP
      }));
    return trace;
  }

  function dnsLesson(cacheHit) {
    return [
      event("準備", "輸入網域", "手上只有名稱，先找網站的位址",
        "瀏覽器已知道 example.com 這個名稱。下一步會由系統向設定好的解析器送出 DNS 查詢。"),
      ...dnsTrace(cacheHit)
    ];
  }

  const tls = (label, ...fields) => layer("TLS 1.3",
    field("訊息", label, "交握先協商連線參數並驗證對端，再用協商產生的金鑰保護應用資料。"), ...fields);
  const webPath = ["client", "gateway", "server"];
  const webReverse = [...webPath].reverse();
  function webDelivery(secure) {
    const port = secure ? 443 : 80;
    const httpFields = request => [
      ...(secure ? [layer("TLS", field("線上的資料", "加密的 Application Data", "鏈路上的旁觀者只能看見加密後的資料和外層標頭。"))] : []),
      layer(secure ? "HTTP · 端點解密後" : "HTTP · 明文", request ? field("請求", "GET /", "表示讀取網站根路徑的資源。") :
        field("回應狀態", "200 OK", "網站回應這次 HTTP 請求成功。")),
      layer("TCP", field("來源埠", request ? clientPort : port, "這是本條 TCP 連線送出端的埠。"),
        field("目的埠", request ? port : clientPort, "這是接收端對應的埠。")),
      ipv4(request ? clientIP : webIP, request ? webIP : clientIP)
    ];
    return [
      event("HTTP", "GET /", "瀏覽器送出網頁請求",
        secure ? "端點看到的是 GET /。路上的設備轉送的是裝有加密資料的封包。" : "TCP 連線建立後就送出 GET /。這次沒有 TLS 保護，沿途可讀到 HTTP 請求內容。",
        webPath, httpFields(true)),
      event("HTTP", "200 OK", "伺服器回傳網頁內容",
        secure ? "瀏覽器解密 TLS 資料，讀到 HTTP 200 OK 與 HTML。這次示意只取一份 HTML。" : "瀏覽器從 TCP 讀到明文的 HTTP 200 OK 與 HTML。",
        webReverse, httpFields(false), { summary: "收到 HTML · 瀏覽器可開始呈現" })
    ];
  }

  function webTrace(cacheHit, secure = true) {
    const protocol = secure ? "https" : "http";
    const url = protocol + "://" + domain;
    const opening = [
      event("網址", "按 Enter", "打開 " + url, "先想像把網址輸入瀏覽器。這台電腦已有 IP 和預設閘道，現在要把網域名稱解析成網站位址。", [],
        [layer("URL", field("協定", protocol, secure ? "在此範例用 TLS 保護 HTTP，底層走 TCP。" : "在此範例直接以 TCP 傳送明文 HTTP，不會重新導向。"),
          field("網域", domain, "這是 DNS 要查的名稱。"), field("路徑", "/", "想讀取網站根目錄的資源。"))]),
      ...dnsTrace(cacheHit), ...handshake(webPath, secure ? 443 : 80)
    ];
    if (!secure) return [...opening, ...webDelivery(false)];
    return [
      ...opening,
      event("TLS", "ClientHello", "瀏覽器提出 TLS 連線參數", "用戶端先提供可用的版本和金鑰交換資訊。TCP 連線已經在前一階段建立。",
        webPath, [tls("ClientHello", field("Server Name", domain, "提示網站端想連到的主機名稱。")),
          ipv4(clientIP, webIP)]),
      event("TLS", "ServerHello", "伺服器回覆選定的參數", "ServerHello 選定參數並提供伺服器的金鑰交換資訊。雙方可推導保護後續交握訊息的金鑰。",
        webReverse, [tls("ServerHello", field("選定版本", "TLS 1.3", "此示意使用 TLS 1.3 的完整交握。"))]),
      event("TLS", "憑證與 Finished", "網站證明身分並確認交握", "伺服器送出受交握金鑰保護的後續訊息。瀏覽器驗證憑證、網站名稱及伺服器的簽章與 Finished。",
        webReverse, [tls("EncryptedExtensions、Certificate、CertificateVerify、Finished",
          field("驗證名稱", domain, "瀏覽器核對憑證允許使用的名稱。"))]),
      event("TLS", "Client Finished", "瀏覽器完成這一輪 TLS 交握", "瀏覽器回傳自己的 Finished。這次新連線已準備好以應用流量金鑰保護 HTTP。",
        webPath, [tls("Finished")], { summary: "已建立受 TLS 保護的連線" }),
      ...webDelivery(true)
    ];
  }

  const forwardingTrace = (flood = false) => {
    const ingress = ethernet(clientMac, routerIn);
    const output = ethernet(routerOut, serverMac);
    const table = (learned, target) => ({
      title: "MAC 表", headings: ["MAC", "交換器埠"],
      rows: [[clientMac, learned ? "1 · 剛學到" : "1"], ...(flood ? [] : [[routerIn, target ? "2 · 選用" : "2 · 已知"]])]
    });
    return [
      event("LAN", "準備", "封包的 IP 和訊框的 MAC 各有用途", "用戶端在 192.0.2.0/24，網站在 198.51.100.0/24。此例已知道閘道的 MAC，兩側都是 Ethernet，沒有 NAT。",
        [], [ipv4(clientIP, webIP, 64), ingress]),
      event("LAN", "進入埠 1", "交換器先學來源 MAC", "訊框從埠 1 進來，交換器把用戶端的來源 MAC 記到埠 1。它接著會查目的 MAC。",
        ["client", "switch"], [ingress, ipv4(clientIP, webIP, 64)], {
          table: table(true, false),
          check: check("交換器這時會把哪一個位址記到埠 1？", ["用戶端的來源 MAC", "預設閘道的目的 MAC", "網站的目的 IP"], 0,
            "看進來的訊框是哪一台設備送的。", "埠 1 收到由用戶端送出的訊框，所以把來源 MAC " + clientMac + " 記在埠 1。")
        }),
      event("LAN", flood ? "向其他埠泛洪" : "從埠 2 轉送",
        flood ? "尚未學到閘道的目的 MAC，向其他埠泛洪" : "交換器比對目的 MAC，選擇埠 2",
        flood ? "這仍是單播訊框，目的 MAC 沒變成廣播位址。交換器將它複製到同一 VLAN 的其他埠，同網段主機收到後會忽略。" :
          "MAC 表已有閘道位址的紀錄。這次已知單播只往埠 2，旁邊的主機不會收到。",
        ["switch", "gateway"], [ingress, ipv4(clientIP, webIP, 64)], {
          table: table(false, true),
          ...(flood ? { branches: [["switch", "peer"]] } : {})
        }),
      event("路由", "改寫外層", "路由器依目的 IP 選路，換上新訊框", "目的 IP 落在 198.51.100.0/24，走直接相連的介面。送出前，TTL 從 64 減為 63，IPv4 標頭 checksum 隨之重算。",
        ["gateway", "server"], [output, ipv4(clientIP, webIP, 63)], {
          table: { title: "路由器的進站／出站比較", headings: ["欄位", "進站", "出站"], rows: [
            ["來源 MAC", clientMac, routerOut], ["目的 MAC", routerIn, serverMac],
            ["目的 IP", webIP, webIP], ["IPv4 TTL", "64", "63"]
          ], changed: [0, 1, 3] },
          check: check("路由器查路由時依據哪個欄位？", ["目的 IP", "來源 MAC", "目的 TCP 埠"], 0,
            "看哪個欄位代表跨網路送達的最終主機。", "這次的目的 IP 是 " + webIP + "，落在路由器直接連到的 198.51.100.0/24。")
        }),
      event("收件", "送達", "網站伺服器接收這一跳的訊框", "伺服器拆掉 Ethernet 外層後處理 IP 封包。兩段鏈路用了不同的 MAC，最終目的 IP 都是同一個。",
        [], [output, ipv4(clientIP, webIP, 63)], { summary: "同一個 IP 封包走過兩段 Ethernet 鏈路" })
    ];
  };

  const arp = (reply, targetIP, targetMac) => layer("ARP",
    field("操作", reply ? "Reply" : "Request", "Request 詢問某個 IPv4 位址對應的 MAC，Reply 提供對應。", reply ? "00 02" : "00 01"),
    field("Sender IP / MAC", (reply ? targetIP : clientIP) + " / " + (reply ? targetMac : clientMac), "這則 ARP 訊息的發送者。"),
    field("Target IP", reply ? clientIP : targetIP, "Request 裡要找這個 IPv4 位址對應的 MAC。"),
    field("Target MAC", reply ? clientMac : "尚未得知", "發出 Request 時，要查的 MAC 還未知。"));
  function arpTrace(remote) {
    const id = remote ? "gateway" : "peer";
    const ip = remote ? gatewayIP : "192.0.2.20";
    const mac = remote ? routerIn : neighborMac;
    const dest = remote ? webIP : ip;
    const note = remote ? "網站在本地子網外，先查預設閘道的 MAC，讓訊框能交給它。" : "目的 IP 在同一子網，直接查那台主機的 MAC。";
    return [
      event("下一跳", "選擇對象", "先決定要查誰的 MAC", note, [], [ipv4(clientIP, dest)], {
        check: check("這次 ARP 要查哪個 IP？", [gatewayIP, "192.0.2.20", webIP], remote ? 0 : 1,
          "用 /24 比較用戶端和最終收件者是否在同一子網。", note + "這次會詢問 " + ip + "。")
      }),
      event("ARP", "廣播 Request", "在同一 LAN 問誰擁有 " + ip,
        "交換器把廣播訊框送往其他埠。收到的人都能看，但只有擁有目標 IP 的介面需要回覆。",
        ["client", "switch", id], [arp(false, ip, mac), ethernet(clientMac, broadcast, "0806")], {
          branches: [["switch", remote ? "peer" : "gateway"]]
        }),
      event("ARP", "單播 Reply", "持有該 IP 的設備回覆自己的 MAC",
        "回覆直接交給用戶端。用戶端暫存 IP 到 MAC 的對應，接著就能送出自己的 IPv4 封包。",
        [id, "switch", "client"], [arp(true, ip, mac), ethernet(mac, clientMac, "0806")]),
      event("傳送", "IPv4 封包", "用查到的 MAC 放進 Ethernet 標頭",
        remote ? "這一跳送給閘道，Ethernet 的目的 MAC 是閘道的。IPv4 的目的 IP 仍是遠端網站。" :
          "訊框直接送給同網段的主機。目的 IP 和目的 MAC 都指向這台收件主機。",
        ["client", "switch", id], [ethernet(clientMac, mac), ipv4(clientIP, dest)], { summary: "下一跳 MAC 已查到" })
    ];
  }

  const bootIP = "0.0.0.0";
  const broadcastIP = "255.255.255.255";
  const dhcpServer = "192.0.2.2";
  function dhcpPacket(out, message, configuration = []) {
    return [layer("DHCP", field("Message Type", message, "辨認 DORA 四步中的哪一步。"),
      field("Transaction ID", "0x3A6F1C20", "同一輪交換的識別碼，讓用戶端比對回覆。", "3A 6F 1C 20"),
      ...configuration), udp(out ? 68 : 67, out ? 67 : 68), ipv4(out ? bootIP : dhcpServer, broadcastIP)];
  }
  function dhcpTrace(available) {
    const query = ["client", "segment", "dhcp"];
    const reply = ["dhcp", "segment", "client"];
    const config = [
      field("提供的 IPv4", clientIP, "用戶端將設定在網路介面上的位址。"),
      field("子網遮罩", "255.255.255.0", "本例使用 /24。"),
      field("預設閘道", gatewayIP, "當目的在其他子網，把訊框交給這台路由器。"),
      field("DNS 解析器", resolverIP, "用來替應用程式查名稱。"),
      field("Lease", "3600 秒", "租約有效期限，系統通常在到期前嘗試續租。")
    ];
    const trace = [
      event("接線", "等待設定", "新裝置還沒有 IPv4 設定", "在這個同一 LAN 的範例中，用戶端會廣播訊息找 DHCP 伺服器。這次假設用戶端要求伺服器也以廣播回覆。"),
      event("DHCP", "Discover", "廣播尋找 DHCP 伺服器",
        "用戶端還沒有可用的 IPv4 位址，所以來源用 0.0.0.0，目的用本地廣播位址。",
        available ? query : ["client", "segment"], dhcpPacket(true, "Discover"))
    ];
    if (!available) return trace.concat(event("等待", "逾時", "用戶端沒有收到 Offer",
      "本例沒有可用的 DHCP 伺服器。用戶端等到逾時後可以再送 Discover，這次尚未取得 DHCP 租約。", [], [],
      { summary: "沒有 Offer · 尚無 DHCP 租約" }));
    return trace.concat([
      event("DHCP", "Offer", "伺服器提出一份位址設定", "伺服器提出 192.0.2.10 與其他設定。用戶端接著要表明採用哪一份提議。", reply,
        dhcpPacket(false, "Offer", config), { check: check("收到 Offer 後，下一則該由誰送什麼？",
          ["用戶端送 Request", "用戶端送 ACK", "伺服器再送 Discover"], 0, "先分辨提出和確認之間還少了誰的選擇。",
          "Offer 只是伺服器的提議。用戶端要送 Request 指明所選伺服器和提出的位址。") }),
      event("DHCP", "Request", "用戶端請求採用這份設定", "用戶端廣播 Request，指明選了哪台伺服器提出的位址。",
        query, dhcpPacket(true, "Request", [field("Requested IP", clientIP, "採用 Offer 提出的位址。"),
          field("Server Identifier", dhcpServer, "讓同一網段上的 DHCP 伺服器辨認用戶端選擇哪一台。")])),
      event("DHCP", "ACK", "伺服器確認租約",
        "用戶端收到 ACK，完成配置流程。這次跳過使用前的位址衝突檢查。",
        reply, dhcpPacket(false, "ACK", config), { summary: "已取得 IPv4、閘道與 DNS" })
    ]);
  }

  function transportTrace(mode) {
    const path = ["client", "server"], reply = ["server", "client"];
    const lost = mode !== "normal";
    const udpMode = mode === "udp";
    const service = 9000;
    const trace = [event("準備", "準備傳送", "把應用資料分成三份各 100 bytes 的示意單位",
      udpMode ? "示意應用在 UDP 9000 交換資料報，第二份會遺失。" :
        "示意應用在 TCP 9000 傳輸。交握後追蹤序號 1001、1101、1201。此例為方便觀察，單獨列出用到的確認。"),
      ...(udpMode ? [] : handshake(path, service))];
    trace.push(event(udpMode ? "UDP" : "TCP", "資料 1", "第一份資料正常抵達",
      udpMode ? "應用收到第一個完整 UDP 資料報。" : "收到序號 1001 到 1100，下一個期待 1101。",
      path, [udpMode ? udp(clientPort, service, 108) : tcp(true, "ACK", 1001, 7001, 100, service)]));
    if (!udpMode) trace.push(event("TCP", "ACK 1101", "接收端確認收到前 100 bytes", "ACK 1101 表示已連續收到至 1100。",
      reply, [tcp(false, "ACK", 7001, 1101, 0, service)]));
    trace.push(event(udpMode ? "UDP" : "TCP", "資料 2", lost ? "第二份資料途中遺失" : "第二份資料正常抵達",
      lost ? "第二份沒有抵達，因此接收端看不到它。" : "第二份接在第一份後面，下一個期待序號 1201。", path,
      [udpMode ? udp(clientPort, service, 108) : tcp(true, "ACK", 1101, 7001, 100, service)], { lost }));
    trace.push(event(udpMode ? "UDP" : "TCP", "資料 3", "第三份資料抵達",
      udpMode ? "應用可以收到資料報 1、3。UDP 自己沒有為第 2 份重傳。" : lost ?
        "第三份從 1201 開始，接收端可先暫存，但仍缺 1101 到 1200。" : "資料連續接上，下一個期待序號 1301。",
      path, [udpMode ? udp(clientPort, service, 108) : tcp(true, "ACK", 1201, 7001, 100, service)], {
        packetSlots: [1, 2, 3].map(i => [String(i), i === 2 && lost ? "遺失" : i === 3 && !udpMode && lost ? "暫存" : "收到"]),
        summary: udpMode ? "應用收到資料報 1、3" : "",
        ...(lost && !udpMode ? { check: check("第三份已到，但中間缺 100 bytes。接收端現在回哪個 ACK？",
          ["1101", "1201", "1301"], 0, "確認號指下一個期待連續收到的位置。",
          "1101 到 1200 還沒收到，所以即使第三份在暫存區，連續部分也只到 1100。") } : {})
      }));
    if (udpMode) return trace;
    if (lost) trace.push(
      event("TCP", "重複 ACK 1101", "還在等原本缺的資料", "接收端回 ACK 1101。這次只有一個重複 ACK，示意由重傳計時器到期觸發補送。",
        reply, [tcp(false, "ACK", 7001, 1101, 0, service)]),
      event("TCP", "重傳資料 2", "送出端補回序號 1101 的資料", "缺口補上後，第 2 份和暫存的第 3 份就能依序交付。",
        path, [tcp(true, "ACK", 1101, 7001, 100, service)], {
          packetSlots: [["1", "收到"], ["2", "重傳已收到"], ["3", "可交付"]]
        })
    );
    trace.push(event("TCP", "ACK 1301", "連續的 300 bytes 都已收到",
      "接收端回累積確認 ACK 1301，表示資料已連續到序號 1300。", reply,
      [tcp(false, "ACK", 7001, 1301, 0, service)], { summary: "TCP 依序交付 300 bytes" }));
    return trace;
  }

  function encapsulationTrace() {
    const app = layer("應用資料", field("內容", "GET / HTTP/1.1", "應用程式想傳給網站的 HTTP 請求起始行。此例用明文 HTTP 方便對照各層。"));
    const transport = layer("TCP", field("目的埠", "80", "這次明文 HTTP 服務的 TCP 埠。"),
      field("資料", "應用訊息", "TCP 把應用程式的資料放入連線的位元組流。"));
    const ip = ipv4(clientIP, webIP, 64);
    const eth = ethernet(clientMac, routerIn);
    const fcs = layer("FCS", field("位置", "Ethernet 訊框尾端", "發送端用這個欄位提供錯誤檢查。接收端可以用它檢查訊框在這一跳是否受損。"));
    const wrap = (title, note, layers, path = [], phase = "送出端", extra = {}) =>
      event(phase, title, title, note, path, layers, { outline: layers.map(item => item.name), ...extra });
    return [
      wrap("應用程式準備資料", "先觀察應用資料。後面每按一次下一步，就會新增一層標頭。", [app]),
      wrap("加上 TCP 標頭", "加上 TCP 資訊後形成 segment。接收端用連線資訊找到對應的應用程式。", [transport, app]),
      wrap("加上 IPv4 標頭", "形成 IP packet。路由器依目的 IP 轉送。", [ip, transport, app]),
      wrap("裝入 Ethernet 訊框", "Ethernet 的目的 MAC 是這一跳的閘道。訊框尾端還有 FCS，協助檢查傳輸錯誤。",
        [eth, ip, transport, app, fcs], ["client", "gateway"]),
      wrap("路由器換一層 Ethernet", "路由器移除進站訊框，轉送時換上新一跳的 Ethernet 標頭。IPv4 TTL 減為 63。",
        [ethernet(routerOut, serverMac), ipv4(clientIP, webIP, 63), transport, app, fcs], ["gateway", "server"], "途中"),
      wrap("拆掉 Ethernet 外層", "接收端利用 EtherType 得知內容是 IPv4，把 IP 封包交給上一層。", [ipv4(clientIP, webIP, 63), transport, app], [], "接收端"),
      wrap("拆掉 IPv4 標頭", "IPv4 的 Protocol 欄位是 6，接收端把內容交給 TCP。", [transport, app], [], "接收端"),
      wrap("把應用資料交出去", "TCP 依照連線狀態重建位元組流。HTTP 服務讀到應用訊息。", [app], [], "接收端",
        { summary: "接收端讀到原本的應用資料" })
    ];
  }

  function fragmentTrace(blocked) {
    const path = ["client", "gateway"], onward = ["gateway", "server"];
    const mtu = 1000, total = 2500, header = 20, payload = total - header;
    const firstSize = Math.floor((mtu - header) / 8) * 8;
    const fragment = (size, offset, more, ttl, dontFragment = false) => layer("IPv4",
      field("Total Length", (size + header) + " bytes", "每片的標頭與資料長度相加。", word(size + header)),
      field("Identification", "0x42AF", "若進行分片，各片沿用這個識別值。目的端搭配來源、目的及協定辨認是同一份原始封包。", "42 AF"),
      field("DF / MF / Offset", Number(dontFragment) + " / " + Number(more) + " / " + offset,
        "DF 等於 1 禁止分片。MF 等於 1 表示後面還有片。Offset 以 8 bytes 為單位。", word((dontFragment ? 0x4000 : 0) + (more ? 0x2000 : 0) + offset)),
      field("資料位置", "byte " + (offset * 8) + "–" + (offset * 8 + size - 1), "從原始 IPv4 資料起點開始計算，從 0 起算。"),
      field("TTL", ttl, "這次經路由器轉送後減 1。", word(ttl).slice(-2)));
    const trace = [
      event("原始封包", "2500 bytes", "一個封包要跨過較小的 MTU", "原始 IPv4 標頭 20 bytes，資料 2480 bytes。看路由器遇到出口 MTU 1000 bytes 時怎麼處理。",
        path, [fragment(payload, 0, false, 64, blocked)]),
      event("MTU", "遇到 MTU 1000", blocked ? "DF 已設定，路由器不能分片" : "路由器把資料切成可轉送的大小",
        blocked ? "封包超過出口 MTU 且 DF 等於 1，這個路由器會丟棄它並回報需要分片。" :
          "每片需留 20 bytes 給 IPv4 標頭。除了最後一片，每片資料要是 8 的倍數，所以先取 976 bytes。", [],
        [fragment(payload, 0, false, 64, blocked)], blocked ? {} : {
          check: check("第一片資料裝 976 bytes，第二片的 Offset 是多少？", ["122", "976", "125"], 0,
            "Offset 數的是 8-byte 單位。", "第二片從原始資料 byte 976 開始，976 ÷ 8 = 122。")
        })
    ];
    if (blocked) return trace.concat(event("ICMP", "需要分片", "通知來源調整封包大小",
      "這是 ICMP Destination Unreachable 的 Fragmentation Needed 訊息，回報下一跳 MTU。原始封包沒有送達。",
      ["gateway", "client"], [layer("ICMP", field("Type / Code", "3 / 4", "目的地不可達類型中的需要分片。", "03 04"),
        field("Next-Hop MTU", mtu + " bytes", "來源端可依這個大小調整後續封包。", word(mtu)))], { summary: "封包被丟棄 · 已通知來源" }));
    const sizes = [firstSize, firstSize, payload - firstSize * 2];
    sizes.forEach((size, index) => {
      const offset = index * firstSize / 8, more = index < sizes.length - 1;
      trace.push(event("分片", "第 " + (index + 1) + " 片",
        "送出第 " + (index + 1) + " 片 · Offset " + offset,
        "這片含 " + size + " bytes 原始資料。MF = " + Number(more) + (more ? "，後面還有片。" : "，已是最後一片。"),
        onward, [fragment(size, offset, more, 63)], {
          packetSlots: sizes.map((bytes, part) => [(bytes + header) + " B", part === index ? "正在轉送" :
            part < index ? "已送出" : "待送出", bytes])
        }));
    });
    return trace.concat(event("重組", "全部收到", "目的端依 Offset 放回原本的位置",
      "目的端拼回 2480 bytes 的資料，再交給上層。片段分別帶各自的 IPv4 標頭。", [],
      sizes.map((size, index) => ({ ...fragment(size, index * firstSize / 8, index < 2, 63), name: "第 " + (index + 1) + " 片" })),
      { summary: "目的端已重組 2480 bytes 的資料" }));
  }

  return [
    { concept: "web-packet-journey", page: 86, title: "打開一個網頁", summary: "從輸入網址走到收到 HTML", graph: webGraph,
      intro: "輸入網址後，追蹤 DNS、TCP、TLS 和 HTTP 各自傳了什麼。預設是 IPv4 的 HTTPS over TCP，可切換快取狀態或對照明文 HTTP。",
      modes: [
        mode("DNS 快取無答案", "按「下一步」，看看用戶端先把 DNS 查詢交給誰。收到網站 IP 後再往下走。", () => webTrace(false)),
        mode("DNS 快取命中", "這次解析器已經有有效的 A 記錄。找出比上一輪少了哪些往返。", () => webTrace(true)),
        mode("HTTP 明文對照 · 快取命中", "先比較 TCP 的目的埠，再看看哪個階段消失了。打開 HTTP 檢查請求內容。", () => webTrace(true, false))
      ] },
    { concept: "switch-router-packets", page: 40, title: "封包怎麼經過交換器與路由器", summary: "並排比對進出站的 MAC、IP 和 TTL", graph: forwardGraph,
      intro: "追同一個 IPv4 封包，看交換器怎麼更新 MAC 表，路由器轉送時又改了哪些欄位。",
      modes: [
        mode("交換器已知目的 MAC", "先跟著用戶端送一個訊框。看到交換器收下時，找出 MAC 表哪一列被新增。", () => forwardingTrace(false)),
        mode("交換器還沒學到目的 MAC", "按到交換器要轉送的那一步，找找看哪些埠收到複製的訊框。", () => forwardingTrace(true))
      ] },
    { concept: "dns-packet-trace", page: 81, title: "跟著 DNS 查出網站的 IP", summary: "轉介、A 記錄和快取", graph: dnsGraph,
      intro: "在同一張圖比較解析器問上游拿答案，與直接使用快取的差異。",
      modes: [
        mode("快取無答案", "按「下一步」跟著解析器查一次，找出第一次直接給 A 記錄的是誰。", () => dnsLesson(false)),
        mode("快取命中", "按到 DNS 回覆，打開 TTL 欄位看這個答案還能暫存多久。", () => dnsLesson(true))
      ] },
    { concept: "dhcp-packet-trace", page: 70, title: "新裝置怎麼拿到 IP", summary: "看 DHCP Discover、Offer、Request、ACK", graph: dhcpGraph,
      intro: "跟著新裝置的 DHCPv4 廣播，從沒有位址走到取得 IP、DNS 與預設閘道。",
      modes: [
        mode("有可用的 DHCP 伺服器", "按「下一步」送出 Discover。留意 Offer 只提出設定，直到哪一步租約才確認？", () => dhcpTrace(true)),
        mode("伺服器未回應", "送出同樣的 Discover，注意沒有收到哪一則訊息。", () => dhcpTrace(false))
      ] },
    { concept: "transport-packet-trace", page: 111, title: "TCP 和 UDP 遇到丟包", summary: "看序號、累積確認與重傳", graph: pairGraph,
      intro: "用同一份示意資料看 TCP 三向交握，以及第二份資料遺失時，TCP 和 UDP 各自如何處理。",
      modes: [
        mode("TCP · 遺失第二份", "先走過三向交握。看到第三份資料抵達時，找出接收端還在等哪個序號。", () => transportTrace("lost")),
        mode("UDP · 遺失第二份", "按到資料 3，檢查應用最後收到了哪幾份資料報。", () => transportTrace("udp")),
        mode("TCP · 三份都送達", "試一次沒有丟包的情形，把最後的 ACK 和第一份資料的序號對照。", () => transportTrace("normal"))
      ] },
    { concept: "packet-wrap-unwrap", page: 100, title: "封裝與解封裝", summary: "一路看 Ethernet、IP 和 TCP 怎麼包進去", graph: ipGraph,
      intro: "沿用同一份應用資料，在送出端加標頭，經過路由器後到接收端逐層拆開。",
      modes: [mode("從送出到接收", "先按一次「下一步」加上 TCP。再找出在哪一步會出現 MAC。", encapsulationTrace)] },
    { concept: "arp-packet-trace", page: 42, title: "第一跳的 MAC 從哪裡來", summary: "用 ARP 比較同子網與跨子網", graph: arpGraph,
      intro: "看 Ethernet 訊框出發前，電腦怎麼找相鄰設備的 MAC，再比較同子網與跨子網的差異。",
      modes: [
        mode("網站在其他子網", "先猜這次會用 ARP 查網站還是閘道，再按「下一步」看廣播。", () => arpTrace(true)),
        mode("主機在同一子網", "換成同網段收件者。看看 ARP Request 的 Target IP 怎麼改。", () => arpTrace(false))
      ] },
    { concept: "ipv4-fragment-trace", page: 104, title: "追著 IPv4 分片走", summary: "從 MTU、Offset、MF 到重組", graph: ipGraph,
      intro: "帶一個 2500 bytes 的 IPv4 封包通過 MTU 1000 的鏈路。逐片查看 Length、Offset 和 MF。",
      modes: [
        mode("允許分片 · DF = 0", "按到路由器遇到 MTU 的那一步，先猜第二片 Offset，再打開欄位核對。", () => fragmentTrace(false)),
        mode("禁止分片 · DF = 1", "用同一份封包走一次，點開路由器回傳的 ICMP 欄位。", () => fragmentTrace(true))
      ] }
  ];
})();
