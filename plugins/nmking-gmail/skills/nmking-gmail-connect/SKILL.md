---
name: nmking-gmail-connect
description: "Set up Gmail using its NMKING Connect guide. Compare available MCP and CLI options, reuse the correct connection, and verify only user-authorized operations for this service."
---

# Gmail - NMKING Connect

這是 Gmail 專用連線指南。外掛可獨立安裝與停用，不會安裝其他服務，不會預先啟用 MCP 或代替使用者授權。

## 操作

1. 讀 [此服務規格](references/service.md)。同目錄的 service.json 是等價機器可讀版本，不必同時讀兩份。來源與文件雜湊見 references/source.json。
2. 確認本次任務、執行電腦、OS、正確帳號與既有連線；相容且帳號正確時先沿用，不覆寫其他設定。
3. 依 choice 與 cli_alternative 比較 MCP／CLI；使用者已選方案就沿用，否則先詢問。只在取得選定服務設定的同意後執行必要安裝命令，不自動安裝兩種方案。
4. 密碼、驗證碼與 Passkey 由使用者在服務介面輸入；新增或擴大存取權限時，說明實際權限並取得當次確認。不要求貼憑證，不自行建立 GCP 或計費資源。
5. 先讀實際工具清單、完整 schema 或 CLI --help，再核對帳號與唯讀 bootstrap。OAuth、工具清單或唯讀成功不代表完整操作通過。
6. 完整測試依 operation_test；先確認新建測試資料、公開範圍、費用與刪除清理授權。只操作本輪綁定的測試 ID，寫入結果不明先讀回，不拿真實學生、客戶或郵件當測試資料。
7. 按 report_contract 回報建立、寫入、修改、讀回、刪除、刪後確認與保留資源。MCP、CLI、網頁證據分開；401／403／缺工具即記錄阻礙，不盲目換方案。


此 Google 服務透過 Composio 第三方 MCP，不是 Google 官方 MCP。依本文件的 toolkit 與 account_routing 綁定正確帳號；連上 Composio 不等於已取得 Google 授權。需要其他 Google 服務時，另請使用者選擇對應外掛與確認權限，不在此自動啟用。

保留原 test_result 日期與限制。安裝外掛不是新的服務實測，也不代表 NMKING Chat 已整合此服務。品牌圖示只用於辨識服務，此外掛由 NMKING 編寫，非服務供應商官方外掛。
