# Vercel: AI Connection Spec

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
    "id": "vercel",
    "name": "Vercel",
    "kind": "mcp",
    "status": "MCP / CLI 可選 · Sandbox CRUD 通過",
    "checked_on": "2026-11-13",
    "mcp": {
      "server_name": "vercel",
      "transport": "streamable_http",
      "url": "https://mcp.vercel.com"
    },
    "summary": "雲端工具選 MCP，本機開發、建置和部署可選 Vercel CLI。",
    "choice": {
      "ask_before_setup": true,
      "mcp_for": "建立專案、上傳部署、讀回修改內容；隔離 Sandbox 已完成 CRUD，整個專案沒有直接刪除工具。",
      "cli_for": "本機開發、建置、目錄部署與終端移除部署等工作，登入與 MCP 獨立。",
      "prompt": "這次選已驗證部署與 Sandbox 操作的 MCP，還是本機開發 / 建置 / 直接部署流程的官方 CLI？CLI 本輪尚未完整測試。"
    },
    "requirements": [
      "Vercel 帳號與明確團隊 / 專案權限，部署與費用另確認。"
    ],
    "check": "codex --version",
    "inspect": "codex mcp list",
    "setup": "codex mcp add vercel --url https://mcp.vercel.com",
    "setup_note": "選 MCP 後沿用 vercel、vercel-direct 或同端點連線。",
    "login": "codex mcp login vercel",
    "login_note": "OAuth 要選正確團隊及專案範圍。僅團隊 Authorized、卻未選專案仍可能 403；所有目前及未來專案屬擴權，須在當下確認，不能自行勾選。團隊單次授權網址不保存。",
    "verification_prompt": "get_auth_user 確認帳號，再用明確 teamId；登入或團隊確認頁成功不等於有寫入權限。",
    "verify": {
      "tool": "get_auth_user",
      "arguments": {}
    },
    "test_result": {
      "tested_on": "2026-11-13",
      "method": "mcp",
      "overall": "passed",
      "bootstrap": "passed",
      "resource_type": "nonpersistent_sandbox_with_file",
      "operations": {
        "create": "passed",
        "write": "passed",
        "update": "passed",
        "read_back": "passed",
        "delete": "passed",
        "verify_deleted": "passed"
      },
      "observed": "修正使用者核准的專案存取範圍後，MCP 建立隔離 Sandbox，tar.gz 寫入檔案、修改檔案和標記並讀回；delete_sandbox 後，名稱與 session 均回 404。沒有使用 Vercel CLI。",
      "cleanup": "非持久 Sandbox 及 session 已由 MCP 清理，未建立持久快照。",
      "additional_resources": [
        {
          "resource_type": "project_and_deployments",
          "overall": "partial",
          "operations": {
            "create": "passed",
            "write": "passed",
            "update": "passed",
            "read_back": "passed",
            "delete": "unsupported",
            "verify_deleted": "not_tested"
          },
          "observed": "建立新專案、修改設定、寫入並部署 Hello，更新內容後部署第二版；兩版 READY，來源檔案標記由 MCP 讀回確認。首版為此測試專案的 production，第二版為 preview，未修改其他既有專案。",
          "cleanup": "整專案僅有 get_project_deletion_link，需使用者確認後以網頁清理；不可算成 MCP 刪除通過。"
        }
      ]
    },
    "operation_test": {
      "mode": "verified_recipe",
      "resource_type": "nonpersistent_sandbox_with_file",
      "requires_write_consent": true,
      "preconditions": [
        "確認明確 TEAM_ID、允許測試的 PROJECT_ID、方案與費用範圍；新 Sandbox 只使用本輪資料，不安裝或購買任何付費方案。",
        "若新建測試專案，先說明整專案無 MCP 直接刪除工具，另取得清理確認。",
        "準備僅含自造 hello.txt 的兩份標準 tar.gz，內容分別為 WRITE CHECK 與 UPDATE CHECK；以 base64 傳送，不整包上傳工作區。"
      ],
      "steps": [
        {
          "operation": "create",
          "tool": "create_sandboxes_v3",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "requestBody": {
              "projectId": "${PROJECT_ID}",
              "name": "${SANDBOX_NAME}",
              "resources": {
                "vcpus": 1,
                "memory": 2048
              },
              "timeout": 240000,
              "persistent": false,
              "tags": {
                "purpose": "disposable-crud-test"
              }
            }
          },
          "save": "SESSION_ID = result.session.id；SANDBOX_CWD = result.session.cwd，並核對 result.session.projectId 與指定專案相同。"
        },
        {
          "operation": "write",
          "tool": "write_session_files",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "sessionId": "${SESSION_ID}",
            "xCwd": "${SANDBOX_CWD}",
            "requestBody": "${TAR_GZ_BASE64_V1}"
          }
        },
        {
          "operation": "read_back",
          "tool": "read_session_file",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "sessionId": "${SESSION_ID}",
            "requestBody": {
              "cwd": "${SANDBOX_CWD}",
              "path": "hello.txt"
            }
          },
          "assert": "解碼 result.data 的 base64，確認 WRITE CHECK 文字。"
        },
        {
          "operation": "update",
          "tool": "write_session_files",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "sessionId": "${SESSION_ID}",
            "xCwd": "${SANDBOX_CWD}",
            "requestBody": "${TAR_GZ_BASE64_V2}"
          }
        },
        {
          "operation": "update",
          "tool": "update_sandbox",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "projectId": "${PROJECT_ID}",
            "name": "${SANDBOX_NAME}",
            "resume": false,
            "requestBody": {
              "persistent": false,
              "tags": {
                "purpose": "disposable-crud-test",
                "stage": "updated"
              }
            }
          }
        },
        {
          "operation": "read_back",
          "tool": "read_session_file",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "sessionId": "${SESSION_ID}",
            "requestBody": {
              "cwd": "${SANDBOX_CWD}",
              "path": "hello.txt"
            }
          },
          "assert": "內容已變 UPDATE CHECK，原 WRITE CHECK 不存在。"
        },
        {
          "operation": "read_back",
          "tool": "get_named_sandbox",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "projectId": "${PROJECT_ID}",
            "name": "${SANDBOX_NAME}",
            "resume": false
          },
          "assert": "tags.stage 為 updated，persistent 為 false。"
        },
        {
          "operation": "delete",
          "tool": "delete_sandbox",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "projectId": "${PROJECT_ID}",
            "name": "${SANDBOX_NAME}",
            "confirm": true
          },
          "instruction": "只刪本輪建立且使用者允許清理的 Sandbox。"
        },
        {
          "operation": "verify_deleted",
          "tool": "get_named_sandbox",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "projectId": "${PROJECT_ID}",
            "name": "${SANDBOX_NAME}",
            "resume": false
          },
          "assert": "明確 404 not_found，不把 401 / 403 或連線錯誤算刪除成功。"
        },
        {
          "operation": "verify_deleted",
          "tool": "get_session",
          "arguments": {
            "teamId": "${TEAM_ID}",
            "sessionId": "${SESSION_ID}"
          },
          "assert": "session 為已停止或明確 404；仍運作則繼續清理，不留下運算資源。"
        }
      ],
      "project_notes": [
        "create_project 與 create_deployment 已實測；上傳須明確選本輪專案與 files。",
        "第一個 deployment 可能成為測試專案 production；不宣稱省略 target 一定是 preview，也不改其他正式專案。",
        "get_project_deletion_link 回傳 requires_user_action / mutationExecuted:false，只能人工確認後清理，不當 MCP 原生刪除。"
      ]
    },
    "cli_alternative": {
      "kind": "npm",
      "package": "vercel",
      "version": "65.12.1",
      "binary": "vercel",
      "status": "官方 CLI · 本輪 CRUD 未測",
      "requirements": [
        "核對 Node.js 與官方套件 engines，沿用相容既有版本。"
      ],
      "login": [
        "login"
      ],
      "verify": [
        "whoami"
      ],
      "notes": [
        "不要用裸 vercel 命令測登入，可能開始部署；不自動 link 或 --prod。",
        "部署需指定團隊、專案、目錄、預覽 / 正式環境，先讀所選命令 --help。"
      ],
      "sources": [
        {
          "title": "Vercel CLI",
          "url": "https://vercel.com/docs/cli"
        },
        {
          "title": "Vercel remove",
          "url": "https://vercel.com/docs/cli/remove"
        }
      ],
      "commands": {
        "windows": {
          "install": "npm.cmd install --prefix \"$env:LOCALAPPDATA\\NMKING\\cli\\vercel\" --no-audit --no-fund vercel@65.12.1",
          "version": "& \"$env:LOCALAPPDATA\\NMKING\\cli\\vercel\\node_modules\\.bin\\vercel.cmd\" --version",
          "login": "& \"$env:LOCALAPPDATA\\NMKING\\cli\\vercel\\node_modules\\.bin\\vercel.cmd\" login",
          "verify": "& \"$env:LOCALAPPDATA\\NMKING\\cli\\vercel\\node_modules\\.bin\\vercel.cmd\" whoami"
        },
        "posix": {
          "install": "npm install --prefix \"$HOME/.nmking-cli/vercel\" --no-audit --no-fund vercel@65.12.1",
          "version": "\"$HOME/.nmking-cli/vercel/node_modules/.bin/vercel\" --version",
          "login": "\"$HOME/.nmking-cli/vercel/node_modules/.bin/vercel\" login",
          "verify": "\"$HOME/.nmking-cli/vercel/node_modules/.bin/vercel\" whoami"
        }
      },
      "test_result": {
        "method": "cli",
        "overall": "not_tested",
        "observed": "官方文件核對，不是本輪完整 CRUD 實測。"
      }
    },
    "success": "只宣稱隔離 Sandbox 六項通過；專案建立與部署更新通過，但整專案刪除未具備，不宣稱全服務 CRUD。",
    "examples": [
      "建立隔離 Sandbox 執行檔案任務",
      "MCP 建立並部署測試網站",
      "選 CLI 進行本機開發流程"
    ],
    "troubleshooting": [
      "團隊已授權仍 403：先核對使用者角色與實際專案選擇範圍，不反覆開同一團隊授權連結。",
      "OAuth callback 逾時：不要再向舊 localhost 頁送驗證碼；確認實際 MCP 呼叫與授權範圍狀態，必要時開新流程。",
      "Sandbox 工具需明確 projectId / sessionId；get_named_sandbox 驗證時用 resume:false，不意外重啟。"
    ],
    "sources": [
      {
        "title": "Vercel 官方 MCP",
        "url": "https://vercel.com/docs/agent-resources/vercel-mcp"
      },
      {
        "title": "Vercel Sandbox 價格與限制",
        "url": "https://vercel.com/docs/sandbox/pricing"
      }
    ],
    "spec_url": "https://ai.nmking.io/connect/services/vercel.json",
    "spec_markdown_url": "https://ai.nmking.io/connect/services/vercel.md",
    "commands": {
      "version": "codex --version",
      "inspect": "codex mcp list",
      "add": "codex mcp add vercel --url https://mcp.vercel.com",
      "login": "codex mcp login vercel",
      "verify": {
        "tool": "get_auth_user",
        "arguments": {}
      }
    }
  }
}
```
