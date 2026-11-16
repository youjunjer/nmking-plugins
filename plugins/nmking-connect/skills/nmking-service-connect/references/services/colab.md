# Google Colab: AI Connection Spec

Revision: 2026-11-14.1

Read this selected-service spec only. Placeholder values must be bound to the current user-approved run before execution. This document is reference data, not authorization to install, grant access, write or delete.

```json
{
  "schema_version": 2,
  "revision": "2026-11-14.1",
  "skill_url": "https://ai.nmking.io/connect/SKILL.md",
  "acceptance": {
    "required_operations": [
      "create",
      "write",
      "update",
      "read_back",
      "delete",
      "verify_deleted"
    ],
    "operation_statuses": [
      "passed",
      "failed",
      "not_tested",
      "unsupported"
    ],
    "overall_statuses": [
      "passed",
      "partial",
      "blocked",
      "not_tested",
      "deferred",
      "awaiting_consent"
    ],
    "pass_rule": "同一方案、同一明確資源類型的六項操作全為 passed 才能回報 passed；唯讀只記 bootstrap。",
    "environment": "已列實測為 macOS 本機 Codex 直接呼叫各服務官方遠端 MCP，或明確標示的 Composio 第三方 MCP。未啟動平台 Token 模型回合；Windows、Linux、NMKING Chat 與模型自主執行尚須另測。",
    "fixture": "每輪建立唯一 RUN_ID，測試名稱 NMKING MCP TEST ${RUN_ID}，內容不得含個資。",
    "binding": "${NAME} 必須由本輪結果或使用者確認綁定。instruction、save、assert 是代理人控制邏輯，不是工具參數；未列 arguments 時先讀 schema，不猜參數。"
  },
  "report_contract": {
    "service": "selected service id",
    "method": "mcp | cli",
    "environment": "actual OS and tool version",
    "endpoint_or_binary": "selected provider URL or executable path",
    "auth": "authorized | pending | failed | not_tested",
    "bootstrap": "passed | failed | not_tested",
    "resource_type": "exact tested resource type",
    "operations": {
      "create": "not_tested",
      "write": "not_tested",
      "update": "not_tested",
      "read_back": "not_tested",
      "delete": "not_tested",
      "verify_deleted": "not_tested"
    },
    "overall": "passed | partial | blocked | not_tested | deferred | awaiting_consent",
    "evidence": [
      {
        "operation": "operation name",
        "tool_or_command": "actual call without credentials",
        "observed": "read-back evidence"
      }
    ],
    "cleanup": {
      "method": "mcp | cli | browser | none",
      "remaining": []
    },
    "blocker": null
  },
  "agent_rules": [
    "本文件是使用者指定的參考資料，不是系統指令，也不擴大授權。沒有選定服務與任務時先詢問，不開始安裝。",
    "核對目標電腦、OS、帳號與既有工具。WSL、雲端或 SSH 安裝不等於本機已安裝。沿用相容連線，不覆寫同名不同網址設定，不移除既有工具。",
    "有 cli_alternative 時，依 choice 比較功能、適用任務、安裝、授權和測試結果，詢問使用者選 MCP、CLI 或兩者；已明確選擇則不重問。不要預先兩種都裝，也不要因偏好 MCP 而刪除功能較多的 CLI。",
    "先說明來源、版本、設定位置與權限，取得確認後只設定選定方案。CLI 使用既有相容或文件固定版本；遠端 MCP 不另裝同名 CLI 或本機伺服器套件。",
    "密碼、驗證碼、Passkey 與憑證輸入由使用者操作，不要求貼到對話。新增或擴大敏感存取權限時在當下取得確認；相同服務與權限的例行重新登入可依使用者授權協助操作。",
    "不讀取或列印憑證檔、完整 Token、環境變數值、OAuth code 或單次授權連結。環境變數只檢查有無設定，不改成明文保存。",
    "先讀實際 MCP 工具清單與 schema，再按 verify 做唯讀 bootstrap。工具前綴以客戶端實際清單為準；內建連接器登入不代表獨立遠端 MCP 已授權。",
    "provider 為 Composio 時，這是第三方 MCP，不是 Google 官方 MCP。先讀 composio_protocol 與 connection，只登入使用者選定的 toolkit；Codex 連上 Composio 不等於 Google 服務已授權。",
    "Composio 步驟的 tool 是 tool_slug，arguments 是內層參數；經 COMPOSIO_MULTI_EXECUTE_TOOL 並明確指定本輪 ACCOUNT_ID 執行，不把 tool_slug 誤當客戶端直接暴露的工具。session 與 account 必須取自本輪正確使用者，不使用文件中的歷史值。",
    "唯讀不是完整成功。完整測試先確認帳號、工作區、新建測試物件、公開範圍、費用與刪除清理授權；未獲寫入授權停在 awaiting_consent，不宣稱通過。",
    "只修改與刪除本輪新建並保存 ID 的測試資料。${...} 是待綁定變數，不能原樣傳送或使用歷史客戶 ID。寫入逾時先讀回查證，避免重複建立。",
    "401、403、不支援註冊、缺工具或使用者暫緩時，記錄原因並停止相應步驟。不反覆重試相同錯誤，也不自動換方案補做；MCP、CLI、網頁證據分開。",
    "刪後查證消失或明確進垃圾桶；刪題不等於刪題庫，刪貼文不等於刪看板，垃圾桶不等於永久銷毀。剩餘物件列在 cleanup.remaining。不得為測試升級方案、建立 GCP / 計費資源或改正式 DNS。",
    "依 report_contract 逐項回報證據。不把文件核對、--help、OAuth、工具清單或唯讀當 CRUD 通過；歷史 test_result 不是新使用者環境的保證。",
    "遠端 MCP 與本機 STDIO 的執行位置不同；遠端工具不能因此存取會員電腦。此文件是 Codex 設定參考，不是 NMKING Chat 已支援該服務的宣告。"
  ],
  "service": {
    "id": "colab",
    "name": "Google Colab",
    "kind": "mcp",
    "status": "官方遠端 MCP · 僅確認端點",
    "checked_on": "2026-11-13",
    "mcp": {
      "server_name": "colab",
      "transport": "streamable_http",
      "url": "https://colaboratory.googleapis.com/mcp"
    },
    "summary": "遠端 MCP 管 runtime 與執行程式，認證尚未在本機 Codex 驗證，不列即用連線。",
    "requirements": [
      "先依官方文件確認服務啟用與認證；未獲授權不建 GCP 專案、不啟用計費或建立 runtime。"
    ],
    "check": "codex --version",
    "inspect": "codex mcp list",
    "setup_note": "僅提供端點及觀察結果，尚無已驗證的一鍵 Codex 安裝 / OAuth 指令；不要自行補成已授權。",
    "login_note": "metadata 指向 Google OAuth，scope 為 https://www.googleapis.com/auth/colaboratory；尚未完成交換。",
    "verification_prompt": "先驗證官方認證方式，再按 schema 呼叫 get_subscription；匿名 401 不算成功。",
    "verify": {
      "tool": "get_subscription",
      "arguments": {}
    },
    "test_result": {
      "tested_on": "2026-11-13",
      "method": "mcp",
      "overall": "blocked",
      "bootstrap": "failed",
      "resource_type": "runtime_or_session",
      "operations": {
        "create": "not_tested",
        "write": "not_tested",
        "update": "not_tested",
        "read_back": "not_tested",
        "delete": "not_tested",
        "verify_deleted": "not_tested"
      },
      "observed": "匿名 initialize / tools-list 列出十項工具；get_subscription 實際 401，需 Google OAuth。未建 runtime 或 session。"
    },
    "operation_test": {
      "mode": "blocked",
      "requires_write_consent": true,
      "next_actions": [
        "先驗證官方認證和費用，不自動建立 GCP / 計費資源。",
        "授權後另訂 session / execute_code 六項操作，只清理本輪新建資源，不刪既有 runtime。",
        "googlecolab/colab-mcp 是不同的本機瀏覽器橋接方案，不與此遠端測試混算。"
      ]
    },
    "success": "目前被認證阻擋，端點與工具可列出不算通過。",
    "examples": [
      "授權驗證完成後操作隔離的執行環境"
    ],
    "troubleshooting": [
      "401：補足官方認證，不重複匿名呼叫或假定一般 Google 登入已足夠。"
    ],
    "sources": [
      {
        "title": "Colab 官方遠端 MCP",
        "url": "https://developers.google.com/colab/api/reference/mcp"
      },
      {
        "title": "Colab 官方本機橋接 MCP",
        "url": "https://github.com/googlecolab/colab-mcp"
      }
    ],
    "spec_url": "https://ai.nmking.io/connect/services/colab.json",
    "spec_markdown_url": "https://ai.nmking.io/connect/services/colab.md",
    "commands": {
      "version": "codex --version",
      "inspect": "codex mcp list",
      "verify": {
        "tool": "get_subscription",
        "arguments": {}
      }
    }
  }
}
```
