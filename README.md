# NMKING 外掛市集

供 Codex 引入的 Git 市集。第一個外掛 **NMKING Connect** 將現有 13 項服務的 AI
連線規格打包為可安裝 Skill，協助選擇 MCP／CLI、沿用既有連線、完成個人授權與驗證。

此外掛不包含服務登入憑證、第三方工具實作、平台後端、Hooks 或預先啟用的 MCP。
安裝不會自動連接全部帳號，也不代表所有操作都已測試通過。

## 加入市集

在 Codex「外掛程式 → 新增外掛市集」填入：

| 欄位 | 內容 |
| --- | --- |
| 來源 | `youjunjer/nmking-plugins` |
| Git 參照 | `main`；固定版本可用 `v0.1.0` |
| 稀疏路徑 | 留空 |

加入後選擇 **NMKING 外掛市集**，安裝 **NMKING Connect**。
若設定稀疏路徑，必須同時包含 `.agents/plugins` 與 `plugins/nmking-connect`，
只取市集目錄會缺少外掛內容。

支援相關命令的 Codex CLI 也可使用：

```sh
codex plugin marketplace add youjunjer/nmking-plugins --ref main
codex plugin add nmking-connect@nmking-plugins
```

安裝後在新對話輸入，例如：

> 使用 NMKING Connect 幫我連接 Padlet。先比較可用方案，沿用正確既有連線；
> 需要新增或擴大權限時，先讓我確認。

只檢查可否連線時，不會自動執行寫入測試。需要完整操作驗證時，再指定可拋棄資料、
費用與清理範圍。帳號登入與授權仍由各位使用者自行確認。

## 13 項服務

Canva、GitHub、Notion、Padlet、Kahoot!、Vercel、Netlify、Cloudflare、Google Colab、
Google Classroom、Google Drive、Google Calendar、Gmail。

- [打包服務索引與歷史測試狀態](plugins/nmking-connect/skills/nmking-service-connect/references/index.md)
- [AI Skill 入口](plugins/nmking-connect/skills/nmking-service-connect/SKILL.md)
- [網頁版連線規格](https://ai.nmking.io/connect)

Google Classroom／Drive／Calendar／Gmail 的此方案由 **Composio 第三方 MCP** 提供，
不是 Google 官方 MCP。Classroom 建課受限、部分服務尚未測試等狀態會保留在規格中。
歷史測試通過不保證新使用者仍已登入、具有相同權限或可執行所有功能。

## 更新與開發

使用 Node.js 20.19 以上版本，不需安裝 npm 相依套件：

```sh
npm test
npm run check
```

維護者更新公開規格後，先同步並驗證，再更新兩份 manifest 的外掛版本、Git 版本標籤
與本文件的固定版本範例：

```sh
npm run sync:connect
npm test
npm run check
```

`sync:connect` 僅讀取 `https://ai.nmking.io/connect` 的公開文件，不會連接任何使用者帳號。
要使用既有公開產物資料夾，可加 `-- --source /absolute/path/to/public/connect`。
不要為了更新文件而改寫原有 `tested_on`、執行 Google 授權或重跑真實資源測試。

本儲存庫是 **使用者自行加入的自訂市集**，不是 OpenAI 內建公開目錄的上架／審查結果。
第三方名稱與商標屬各自權利人；NMKING 發行的是自己的操作規格與導引。

## 聯絡

小霸王有限公司 · [NMKING AI Gateway](https://ai.nmking.io)

- LINE：[@nmkingtw](https://line.me/R/ti/p/%40nmkingtw)
- Email：nmkingtw@gmail.com
