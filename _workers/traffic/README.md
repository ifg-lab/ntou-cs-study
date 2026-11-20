# 造訪統計與全站公告

GitHub Pages 使用 `/count` 更新造訪統計，讀取 `/announcements` 取得短時間內的全站公告。兩個端點使用獨立的 Durable Objects 和頻率限制。

會播放公告的網域需符合 Wrangler 設定中的 `SITE_ORIGIN`。Worker 讀取環境密鑰 `STUDY_ANNOUNCEMENT_KEYS`。值是一份 JSON 物件，鍵是管理用名稱，值是每組發布碼的 SHA-256 十六進位摘要。不同使用者可以有各自的固定碼，換碼與停用時只需更新對應項目。

發布碼可用 Node.js 生成 24 個隨機位元組後轉成 Base64url。原始碼交給發布者保存。摘要放入 Worker 密鑰。若要從已保存的摘要清單更新上線設定，可在此目錄執行：

```powershell
Get-Content -Raw -LiteralPath "C:/private/study-announcement-key-hashes.json" | wrangler secret put STUDY_ANNOUNCEMENT_KEYS
```

每次更新給 Wrangler 的 JSON 應包含所有仍有效的發布碼摘要。未設定任何有效摘要時，網站不顯示發布入口，Worker 也會拒絕發布。

公告最多 100 字，供前景分頁輪詢 3 分鐘。短時間內重試相同內容會沿用同一則公告。不同公告間隔 20 秒，每次成功送出都保留一個短期的重試識別碼。
