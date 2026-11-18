# 逐頁 AI 部署

逐頁教學的「問這一頁」和「AI 情境題」使用 Cloudflare Workers AI。GitHub Pages 仍提供教材、原有題庫和計算練習。

1. 使用 Cloudflare 免費方案。在本資料夾登入 Wrangler，然後部署。

   ```sh
   npx wrangler login
   npx wrangler deploy
   ```

2. 把部署產生的 Workers 網址加上 `/study`，填進 `assets/page-ai-config.js` 的 `studyPageAiEndpoint`，並更新 `assets/site.js` 載入該設定檔的版本參數後發布 GitHub Pages。若網站換網域，將 Wrangler 設定的 `SITE_ORIGIN` 改成新的來源，包含協定和主機。
3. 打開 Chapter 4 p.38，試問「來源 MAC 和目的 MAC 各用在哪裡？」。再到 Chapter 5 p.37，確認指定頁碼能生成新的英文題與繁中解析。

Worker 從教材原始資料建立頁碼索引。修改教學內容後重新部署 Worker 即可更新索引。網站送出的資料為問題、目前章次和頁碼、回答方式，以及追問時最近三輪對話的節錄。頁碼索引只含公開站內筆記，不含原投影片 PDF 或個人學習紀錄。

Worker 預設每個 IP 一分鐘 4 次，全站每天最多 200 次 AI 呼叫，按 UTC 零點重設。Cloudflare 的免費推論額度也適用，可能更早用完。全站計數器只儲存日期與次數。維持免費方案，Cloudflare 的免費額度用完時會停止推論。 [Cloudflare 免費額度](https://developers.cloudflare.com/workers-ai/platform/pricing/)
