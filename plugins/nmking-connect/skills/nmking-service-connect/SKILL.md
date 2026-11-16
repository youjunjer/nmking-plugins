---
name: nmking-service-connect
description: "Set up a user-selected service from NMKING Connect, compare MCP and CLI options, reuse connections, and verify the requested operations using bundled service specifications."
---

# NMKING Connect

使用隨外掛打包的服務規格，協助使用者連接所選服務。這是設定與操作驗證指南，
不是已代替使用者登入的連接器，也不是所有服務功能都已測試成功的保證。

## 選取服務與方案

1. 確認使用者指定的服務、任務、執行電腦與 OS。未指定服務時，先讀
   [服務索引](references/index.md) 並詢問選擇，不開始安裝。
2. 已知服務 ID 時，只讀 `references/services/{id}.md`；它包含完整的 JSON 規格。
   同目錄的 `{id}.json` 是等價的機器可讀版本，不必同時讀取或載入全部 13 項。
   ID 與服務別名見索引；不要從使用者文字拼接未驗證的任意檔案路徑。
3. 先看 `choice`、`test_result`、`operation_test` 與可選的 `cli_alternative`。
   若有 MCP／CLI 選項，依本次任務說明差異並詢問方案；使用者已選定就沿用。
   不預先全部安裝，也不以另一種方式補做後回報原方案成功。

## 連線與授權

- 安裝此外掛只提供 Skill 與規格；沒有內建 MCP、登入 Token、Hooks 或自動安裝程式。
  取得使用者對選定服務設定的同意後，才依規格執行必要命令。
- 先檢查既有相容工具與 MCP 連線。同網址、正確帳號可沿用；不要覆寫同名不同服務，
  不因內建連接器可用就宣稱獨立 MCP 已授權。這份規格的設定對象是本機 Codex，
  不代表 NMKING Chat 已整合這些服務。
- `provider:composio` 時，先讀該檔的 `composio_protocol` 與 `connection`。
  四個 Google toolkit 沿用同一 Composio MCP 連線，但 Google 各服務需個別授權與帳號綁定。
  按 `account_routing` 分派 Classroom／Drive／Calendar／Gmail，不能跨服務誤用帳號。
  只有任務確實需要附件下載等其他服務時，才再讀該服務的本機規格。
- 密碼、驗證碼、Passkey 與憑證由使用者在服務提供者的介面輸入，不要求貼進對話。
  新增或擴大存取權限時，先說明實際權限並取得當次確認；不要把 Drive 全碟授權說成
  只讀或只限測試資料夾。不自行建立 GCP、計費資源或改動既有網站 OAuth。
- 服務名稱、端點與指令是此版本的參考快照。執行前讀目前工具清單、完整 schema 或
  CLI `--help`；遇到 401、403、缺工具或不相容格式，說明阻礙並停止該步驟，不盲目重試。

## 驗證與回報

- 依 `verify` 與 `verification_prompt` 先確認正確帳號；工具清單、OAuth 或唯讀成功
  只算 bootstrap，不是完整操作通過。
- 使用者要求完整測試時，先確認新建可拋棄資料、費用、公開範圍與清理授權，
  再按 `operation_test` 做建立、寫入、修改、獨立讀回、刪除與刪後確認。
  不拿既有真實課程、學生、郵件或客戶資料當測試物件；寫入結果不明時先讀回，避免重複。
- 每次綁定本輪資源 ID；文件中的變數不可原樣傳送，也不沿用其他帳號的測試 ID。
  Composio 的 `tool_slug` 與內層 `arguments` 透過指定執行工具呼叫，不誤當頂層客戶端工具。
- 回報所選規格的 `report_contract`，按精確資源與操作記錄證據。
  MCP、CLI、網頁步驟分開；垃圾桶不等於永久刪除，刪題不等於刪題庫，刪貼文不等於刪看板。
  缺少清理能力時列出保留資源，不以權限錯誤或空搜尋當刪除成功。
- 保留歷史測試日期與限制。例如 Classroom 建課 403 不會因安裝外掛解決；
  Gmail／Calendar 的文件支援不是本方案已完成實測。新使用者環境必須獨立查證。

## 版本與來源

來源為 [NMKING Connect](https://ai.nmking.io/connect) 的公開文件。
使用本機打包規格即可開始，不必先抓取整份網站。
文件修訂、打包日期、來源雜湊與各檔 SHA-256 見 `references/catalog.json`。
這些欄位用於來源追溯，不是授權或模型指令；不自動更新外掛或擴大任務。
