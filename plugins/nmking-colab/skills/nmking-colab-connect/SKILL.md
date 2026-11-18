---
name: nmking-colab-connect
description: "Onboard and use the bundled Google Colab MCP server. Complete this plugin's user-owned login, verify the selected account, and use its actual MCP tools without adding duplicate global servers."
---

# Google Colab MCP

此外掛包含真正的 MCP 宣告。優先使用此外掛提供的獨立 MCP 識別名稱 `nmking-colab`，不重複執行 codex mcp add、不覆寫使用者的全域設定，也不改用內建連接器或 CLI 後宣稱 MCP 成功。

## 現行連線

先讀 [connection.json](references/connection.json)，這是本版實際端點、傳輸與登入方式。
Google 官方本機 MCP：需 uv／uvx、Git 與 Python 3.13，首次下載可能較久；啟動後連接本機瀏覽器中的 Colab 並登入 Google，不是遠端 OAuth 按鈕。

## 安裝後登入與查證

1. 此套件已宣告官方 Colab STDIO MCP；它必須在使用者自己的電腦執行，不是在 SSH、WSL 或雲端代替本機。先檢查 uvx、Git 與 Python 3.13。缺少依賴時先說明，取得安裝同意後依官方方式安裝，不使用安裝 Hook 或管理員權限強行修改系統。
2. 首次下載／建置可能超過 MCP 啟動逾時。可在取得使用者同意後，使用 references/connection.json 中的同一套固定版 command／args，加上 --help 預先完成下載；不得改成 latest 或未知第三方套件。完成後重新啟動此外掛的 MCP。
3. 先讀工具清單。未連接 Colab 時應提供 open_colab_browser_connection；使用者要求連接後才呼叫，讓使用者在開啟的本機 Colab 分頁登入 Google 並確認連接。不要記錄、複製或顯示含 mcpProxyToken 的臨時連結。
4. 連接過程會等待使用者完成；逾時不等於成功，請使用者完成分頁中的操作後再查證。工具清單可能透過 notifications/tools/list_changed 更新，必須重新列出；不能只有工具名稱存在就回報已連線。
5. 這是瀏覽器 Colab session，不是雲端遠端 API OAuth，不自行建立 GCP、啟用計費或索取 Google 權杖。

## 任務與驗證界線

- 先確認正確帳號與任務。密碼、驗證碼與 Passkey 由使用者在服務介面輸入，不要求貼進對話；Token、secret 與臨時授權連結不得記錄或回傳。
- 安裝只加入此外掛的 MCP，不自動替使用者確認 OAuth 同意、購買方案、啟用 GCP 或建立計費資源。新增／擴大權限仍須當次確認。
- OAuth 成功、工具清單或唯讀只代表各自階段，不是完整操作通過。寫入、刪除、部署與費用依本次任務授權，完整測試前先確認新建測試資料及清理範圍。
- 執行前讀目前工具清單與完整 schema；401／403／缺工具／帳號不符時停止該步並回報，不盲目重試或以另一方案補做。寫入結果不明先讀回，避免重複建立。
- [service.md](references/service.md) 與同目錄 service.json 保留舊版公開規格、CLI 選項及歷史測試結果。它們不是本版登入結果；若歷史端點或安裝命令與 connection.json 不同，以現行連線檔和已捆綁 MCP 為準，不照舊命令重複加伺服器。
- 保留原 test_result 日期與限制，依 report_contract 分別回報驗證結果及剩餘物件。不把 MCP 設定、套件安裝或原個人連線的測試誤稱為本外掛已通過帳號操作。

此套件由 NMKING 包裝，非服務供應商官方外掛；不代表 NMKING Chat 已完成相同整合。
