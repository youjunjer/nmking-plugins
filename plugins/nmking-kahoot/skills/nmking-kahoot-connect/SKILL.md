---
name: nmking-kahoot-connect
description: "Onboard and use the bundled Kahoot! MCP server. Complete this plugin's user-owned login, verify the selected account, and use its actual MCP tools without adding duplicate global servers."
---

# Kahoot! MCP

此外掛包含真正的 MCP 宣告。優先使用此外掛提供的獨立 MCP 識別名稱 `nmking-kahoot`，不重複執行 codex mcp add、不覆寫使用者的全域設定，也不改用內建連接器或 CLI 後宣稱 MCP 成功。

## 現行連線

先讀 [connection.json](references/connection.json)，這是本版實際端點、傳輸與登入方式。
連接服務供應商官方遠端 MCP，由 Codex 依 OAuth discovery 引導使用者在瀏覽器登入並確認權限。

使用者要求連接時，可在此外掛介面啟動登入，或執行 `codex mcp login nmking-kahoot`。這是已安裝外掛的識別名稱，不需要另加全域伺服器。

## 安裝後登入與查證

1. 此套件已宣告 Kahoot! 遠端 MCP。在此外掛的連線介面啟動登入／重新連接，讓 Codex 根據服務的 OAuth discovery 開啟瀏覽器；使用者核對帳號、團隊及實際權限後自行確認。
2. 若已有效登入且帳號正確，直接沿用；只有過期、撤銷或使用者要求切換帳號時才重新登入。遇到用戶端註冊、redirect URI 或 scope 錯誤，回報服務與客戶端的實際阻礙，不借用其他應用程式的 client ID、secret、Token 或已核准 loopback 流程繞過。
3. 完成 OAuth 後重新列出此外掛工具，執行此服務可用的唯讀帳號／工作區確認。MCP 授權、工具清單與帳號查證分開回報，不以其他方案的結果代替。

## 任務與驗證界線

- 先確認正確帳號與任務。密碼、驗證碼與 Passkey 由使用者在服務介面輸入，不要求貼進對話；Token、secret 與臨時授權連結不得記錄或回傳。
- 安裝只加入此外掛的 MCP，不自動替使用者確認 OAuth 同意、購買方案、啟用 GCP 或建立計費資源。新增／擴大權限仍須當次確認。
- OAuth 成功、工具清單或唯讀只代表各自階段，不是完整操作通過。寫入、刪除、部署與費用依本次任務授權，完整測試前先確認新建測試資料及清理範圍。
- 執行前讀目前工具清單與完整 schema；401／403／缺工具／帳號不符時停止該步並回報，不盲目重試或以另一方案補做。寫入結果不明先讀回，避免重複建立。
- [service.md](references/service.md) 與同目錄 service.json 保留舊版公開規格、CLI 選項及歷史測試結果。它們不是本版登入結果；若歷史端點或安裝命令與 connection.json 不同，以現行連線檔和已捆綁 MCP 為準，不照舊命令重複加伺服器。
- 保留原 test_result 日期與限制，依 report_contract 分別回報驗證結果及剩餘物件。不把 MCP 設定、套件安裝或原個人連線的測試誤稱為本外掛已通過帳號操作。

此套件由 NMKING 包裝，非服務供應商官方外掛；不代表 NMKING Chat 已完成相同整合。
