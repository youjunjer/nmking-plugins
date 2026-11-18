# 新增獨立服務外掛

每一項新服務都必須可以單獨安裝、停用及更新。不要將新服務只加入
`plugins/nmking-connect` 舊版總覽，也不要要求安裝它才能讀取其他外掛的文件或圖示。

## 必備內容

1. 在 `catalog/services.json` 新增一項服務，設定唯一 `id`、名稱、該服務自己的
   `version`、圖示 ID 與可讀的品牌強調色，並更新 README 的清單與數量。版本不必與其他服務同步。
2. 建立 `plugins/nmking-<id>/skills/nmking-<id>-connect/references/`，放入
   `service.md`、`service.json`。目前使用公開 Connect schema v2；Markdown 內的
   JSON contract 必須與 JSON 檔相同，且 `service.id` 必須是該服務的 ID。
3. 文件只包含公開規格、授權步驟與精確歷史結果；先檢查並移除私人帳號、資源 ID、
   簽名連結與憑證。保留來源 revision、測試日期、未測試狀態與實際限制。
4. 在 `catalog/icon-sources.json` 提供可追溯的 SVG path 或自製識別字母。
   使用 Simple Icons 時，由維護者明確執行 `python3 scripts/vendor-service-icons.py`，
   核對固定來源版本、品牌資訊與授權；建置與安裝時都不下載圖示。
5. 執行 `npm run build:services`，產生該服務的兩種 manifest、Skill、圖示與出處。
   每個安裝包都必須自足，所有路徑指向自己包內的檔案。
6. 執行 `npm test`、`npm run check`，再用獨立 Codex 設定目錄測試主清單、
   單獨安裝、圖示解析及移除隔離。發布前確認 GitHub 匿名讀取與固定版本。

## 更新單一服務

只修改那個服務的 `references/service.md`、`service.json`，並提高
`catalog/services.json` 中該服務自己的版本。圖示或 Skill 模板變更也需要
提高受影響服務的版本。執行建置後檢查差異，不應無故修改其他服務與舊整合包。

`--bootstrap-legacy` 只用於首次遷移時從舊整合包補齊尚不存在的服務文件，
不是日常更新命令；已存在的個別文件不會被舊包覆寫。新增服務不需要改舊整合包。

## 未來加入 MCP

目前的 13 項是可獨立安裝的 Skill 指南，不包含 `mcp.json` 或 `.mcp.json`。
未來要將某項升級為真正的 MCP 外掛，須另行核對該服務目前支援的格式、端點、
OAuth、權限與客戶端相容性，更新描述並新增對應測試。不能只加圖示就宣稱 MCP 已連線。

授權範圍、費用、真正資料寫入與刪除仍須按本次使用者授權執行；發布外掛不等於
取得操作帳號的許可。Google 的 Composio 方案必須標示第三方來源與個別帳號綁定。
