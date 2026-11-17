# 啟用帳號與單元討論

網站使用原本的 GitHub Pages 網址。帳號、學習紀錄、頭像和討論資料由你名下的 Supabase 專案保存。

1. 用 GitHub 登入 [Supabase 控制台](https://supabase.com/dashboard)，建立專案。在 SQL Editor 依序執行 [001-community.sql](001-community.sql)、[002-units.sql](002-units.sql)、[003-material-reports.sql](003-material-reports.sql)、[004-discussion.sql](004-discussion.sql)、[005-community-inbox.sql](005-community-inbox.sql)、[006-profile-details.sql](006-profile-details.sql)、[007-hide-deleted-replies.sql](007-hide-deleted-replies.sql)、[008-reaction-names.sql](008-reaction-names.sql) 、[009-standard-departments.sql](009-standard-departments.sql) 和 [010-lecture-06-units.sql](010-lecture-06-units.sql)。既有專案從尚未執行的第一份開始補上。
2. 在 Authentication 啟用 Email 登入和新使用者註冊。在 URL Configuration 填入網站的 GitHub Pages 網址。
3. 在 Authentication 設好 [自訂 SMTP](https://supabase.com/docs/guides/auth/auth-smtp)，再把 **Confirm signup** 和 **Magic Link** 兩份郵件範本改為驗證碼，例如 `<p>海洋大學計算機概論複習站驗證碼：<strong>{{ .Token }}</strong></p>`。寄信憑證只填在 Supabase 控制台。
4. 從專案的 Connect 面板複製 Project URL 和以 `sb_publishable_` 開頭的 Publishable key，填入 [community-config.js](../assets/community-config.js)。推送到 GitHub Pages 後，頁首會顯示討論入口。寄信設定完成後，將 `emailLoginReady` 設為 `true` 並發布，以開啟登入入口。請各測一次註冊與再次登入。
5. 要管理檢舉，先在網站登入站主帳號，再到 Authentication → Users 複製該使用者的 UUID，於 SQL Editor 執行下列指令並替換 UUID。重新登入網站後，帳號選單會顯示「管理檢舉」。

```sql
insert into public.study_moderators (user_id)
values ('YOUR-USER-UUID') on conflict do nothing;

insert into public.study_site_owner (user_id)
select user_id from public.study_moderators where user_id = 'YOUR-USER-UUID';
```

公開討論會顯示使用者自行設定的暱稱、頭像和簡介。學習資料由資料庫權限限制為本人可讀，且訪客紀錄依使用者選擇匯入。同步包含已讀頁、閱讀位置、選擇題作答、筆記和複習清單。模擬小考可透過既有 JSON 備份轉移。

已登入的同學可從教材或選擇題頁面送出回報。管理員可從「管理檢舉」下的「教材與題目回報」查看原頁並標為已處理。

發文、回覆與使用表情前需填妥八碼學號、系所、年級和班別。站主可在帳號選單的「成員管理」授予或撤銷管理員。通知鈴鐺會顯示自己的討論回覆，管理員也可查看檢舉通知。快捷表情使用全站的反應次數排行，個人常用表情仍由帳號各自保存。選擇器的備用圖示來自 [Noto Emoji](https://github.com/googlefonts/noto-emoji)。

學號、系級班和個人檔案的選填資料僅向登入且已填妥學籍的帳號顯示。資料表的直接讀寫限本人，討論署名與個人檔案透過資料庫函式取得允許顯示的欄位。

「我的帳號」從 `study_departments` 讀取正式系所名稱與搜尋用的簡稱。清單依[海洋大學學術單位一覽表](https://www.ntou.edu.tw/academics)整理。無法辨識的舊寫法留在帳號資料，等使用者從清單重新選擇。

站主可移除已刪除回覆的顯示提示。其他回覆及原有檢舉資料會保留。

新增一講或調整單元時，在儲存庫根目錄執行 `node scripts/seed-discussion-units.cjs`，把輸出的 SQL 貼到 Supabase SQL Editor 執行，並更新 002-units.sql。
