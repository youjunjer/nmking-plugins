# Canva: AI Connection Spec

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
    "id": "canva",
    "name": "Canva",
    "kind": "mcp",
    "status": "官方遠端 MCP · 部分驗證",
    "checked_on": "2026-11-13",
    "mcp": {
      "server_name": "canva",
      "transport": "streamable_http",
      "url": "https://mcp.canva.com/mcp"
    },
    "summary": "搜尋、建立與編輯 Canva 設計及簡報。",
    "requirements": [
      "Canva 帳號與支援遠端 MCP / OAuth 的 Codex；連線本身不需 Canva CLI 或 Node.js。"
    ],
    "check": "codex --version",
    "inspect": "codex mcp list",
    "setup": "codex mcp add canva --url https://mcp.canva.com/mcp",
    "setup_note": "沿用 canva、canva-direct 或其他同網址連線，不重複新增。同名不同網址先詢問，不覆寫。",
    "login": "codex mcp login canva",
    "login_note": "尚未有效授權時登入，核對 Canva 帳號與權限。",
    "verification_prompt": "使用此遠端 MCP 的 search-designs，不改用內建 Canva 連接器；唯讀只算 bootstrap。",
    "verify": {
      "tool": "search-designs",
      "arguments": {
        "ownership": "owned",
        "sort_by": "modified_descending",
        "user_intent": "確認 Canva 遠端 MCP，查詢自己的設計。"
      }
    },
    "test_result": {
      "tested_on": "2026-11-13",
      "method": "mcp",
      "overall": "partial",
      "bootstrap": "passed",
      "resource_type": "presentation",
      "operations": {
        "create": "passed",
        "write": "passed",
        "update": "not_tested",
        "read_back": "passed",
        "delete": "not_tested",
        "verify_deleted": "not_tested"
      },
      "observed": "直接 MCP 建立三頁簡報並讀回文字、設計及搜尋結果；修改與刪除回驗未完成。",
      "cleanup": "先前測試簡報保留，不自動當成本輪可刪資料。"
    },
    "operation_test": {
      "mode": "discover_missing_operations",
      "resource_type": "presentation",
      "requires_write_consent": true,
      "next_actions": [
        "讀 create-design schema，獲准後建立本輪設計，保存 design ID。",
        "讀 start-editing-transaction、perform-editing-operations、commit-editing-transaction schema，僅編輯本輪設計；提交後 get-design-content 核對。這段尚未實測，不猜參數。",
        "先查當前目錄有無設計刪除工具；缺少則記 unsupported，不用網頁刪除冒充 MCP 通過。"
      ]
    },
    "success": "六項操作皆有同一測試簡報的證據才通過，目前屬部分驗證。",
    "examples": [
      "依大綱建立簡報",
      "修改指定設計文字與版面"
    ],
    "troubleshooting": [
      "401：檢查此遠端 MCP 的 OAuth，不用內建連接器登入代替。",
      "工具未載入：處理 Codex 載入狀態，不重複新增同網址。"
    ],
    "sources": [
      {
        "title": "Canva MCP",
        "url": "https://www.canva.dev/docs/apps/mcp/"
      }
    ],
    "spec_url": "https://ai.nmking.io/connect/services/canva.json",
    "spec_markdown_url": "https://ai.nmking.io/connect/services/canva.md",
    "commands": {
      "version": "codex --version",
      "inspect": "codex mcp list",
      "add": "codex mcp add canva --url https://mcp.canva.com/mcp",
      "login": "codex mcp login canva",
      "verify": {
        "tool": "search-designs",
        "arguments": {
          "ownership": "owned",
          "sort_by": "modified_descending",
          "user_intent": "確認 Canva 遠端 MCP，查詢自己的設計。"
        }
      }
    }
  }
}
```
