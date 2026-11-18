---
name: nmking-google-drive-connect
description: "Onboard and use the bundled Google Drive MCP server. Complete this plugin's user-owned login, verify the selected account, and use its actual MCP tools without adding duplicate global servers."
---

# Google Drive MCP

此外掛包含真正的 MCP 宣告。優先使用此外掛提供的獨立 MCP 識別名稱 `nmking-google-drive`，不重複執行 codex mcp add、不覆寫使用者的全域設定，也不改用內建連接器或 CLI 後宣稱 MCP 成功。

## 現行連線

先讀 [connection.json](references/connection.json)，這是本版實際端點、傳輸與登入方式。
透過 Composio 第三方 MCP：先登入 Composio，再只授權 googledrive。不是 Google 官方 MCP；不同服務的帳號和權限需分別確認。

使用者要求連接時，可在此外掛介面啟動登入，或執行 `codex mcp login nmking-google-drive`。這是已安裝外掛的識別名稱，不需要另加全域伺服器。

## 安裝後登入與查證

1. 先完成此外掛所帶 Composio MCP 的 OAuth。連上 Composio 不等於服務已授權；不得把內建連接器登入當成此外掛成功。
2. 只為 toolkit `googledrive` 查詢現有連線。先讀目前 COMPOSIO_SEARCH_TOOLS、COMPOSIO_MANAGE_CONNECTIONS 等實際 schema，不硬套歷史參數。相同帳號且 ACTIVE 時先沿用；多個帳號時先請使用者選擇。
3. 若所選 toolkit 尚未連線，說明 Composio 是第三方及實際權限，取得使用者對該服務的確認，再產生新的 Connect Link；讓使用者在瀏覽器登入並親自確認。不要替其他 toolkit 開授權。
4. 用目前可用的 WAIT_FOR_CONNECTIONS 或連線查詢確認 ACTIVE，再呼叫此服務的唯讀身分／帳號工具，明確綁定本輪 ACCOUNT_ID。Composio meta-tool 與內層 tool_slug／arguments 分開，先讀完整 schema。不同 toolkit 不得誤用同一個帳號 ID；文件中的歷史值與變數不能直接送出。
5. 只有需要跨服務任務時，才另請使用者選擇其他外掛／帳號與授權；共用 Composio 端點不是跨服務全權授權。

## 任務與驗證界線

- 先確認正確帳號與任務。密碼、驗證碼與 Passkey 由使用者在服務介面輸入，不要求貼進對話；Token、secret 與臨時授權連結不得記錄或回傳。
- 安裝只加入此外掛的 MCP，不自動替使用者確認 OAuth 同意、購買方案、啟用 GCP 或建立計費資源。新增／擴大權限仍須當次確認。
- OAuth 成功、工具清單或唯讀只代表各自階段，不是完整操作通過。寫入、刪除、部署與費用依本次任務授權，完整測試前先確認新建測試資料及清理範圍。
- 執行前讀目前工具清單與完整 schema；401／403／缺工具／帳號不符時停止該步並回報，不盲目重試或以另一方案補做。寫入結果不明先讀回，避免重複建立。
- [service.md](references/service.md) 與同目錄 service.json 保留舊版公開規格、CLI 選項及歷史測試結果。它們不是本版登入結果；若歷史端點或安裝命令與 connection.json 不同，以現行連線檔和已捆綁 MCP 為準，不照舊命令重複加伺服器。
- 保留原 test_result 日期與限制，依 report_contract 分別回報驗證結果及剩餘物件。不把 MCP 設定、套件安裝或原個人連線的測試誤稱為本外掛已通過帳號操作。

此套件由 NMKING 包裝，非服務供應商官方外掛；不代表 NMKING Chat 已完成相同整合。
