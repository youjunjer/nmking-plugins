# Google Classroom: AI Connection Spec

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
  "composio_protocol": {
    "provider": "Composio",
    "publisher": "third_party_not_google",
    "endpoint": "https://connect.composio.dev/mcp",
    "audience": "personal_Codex_client_setup",
    "schema_policy": "以下為 2026-11-13 實測的 meta-tool 輸入格式；先取得當前清單與完整 input_schema，若不同先停止核對，不套用 schemaRef 覆蓋完整 schema。",
    "auth_stages": [
      "Codex 對 Composio 的 OAuth",
      "使用者選定 Google toolkit 的獨立 Connect Link 授權",
      "帳號 ACTIVE 與唯讀 provider 身分確認；前兩步都不算 CRUD 通過"
    ],
    "managed_oauth": "本文件四個 Google toolkit 均列有 Composio 代管 OAuth，通常不需使用者自建 GCP。這不保證所有自訂 scope 或帳號政策都可用；特殊權限受阻時回報，不自動建 GCP 或改網站現有 OAuth。",
    "search_example": {
      "tool": "COMPOSIO_SEARCH_TOOLS",
      "arguments": {
        "queries": [
          {
            "use_case": "Read the authenticated Google Drive account profile"
          }
        ],
        "session": {
          "generate_id": true
        }
      },
      "save": "SESSION_ID = result 的實際 session.id；後續沿用同一工作流程，不能硬編碼。"
    },
    "list_connections": "依 service.verify 明確使用 action:list。action:add 會產生新授權連結，只有使用者要求連接且確認所選 toolkit 與權限時才可使用。",
    "authorize_example": {
      "tool": "COMPOSIO_MANAGE_CONNECTIONS",
      "arguments": {
        "toolkits": [
          {
            "name": "${TOOLKIT}",
            "action": "add"
          }
        ],
        "session_id": "${SESSION_ID}"
      },
      "precondition": "先確認使用者選定此服務；將 TOOLKIT 綁定為 service.connection.toolkit，不替未選服務開授權。",
      "instruction": "有效且帳號正確的 ACTIVE 連線先沿用。只有需要新增／補授權時產生連結，交給使用者登入並確認實際 Google scope；臨時授權 URL 不寫公開紀錄。完成後再 action:list 驗證 ACTIVE，再執行 verification_prompt 的 provider 身分查詢。"
    },
    "schema_example": {
      "tool": "COMPOSIO_GET_TOOL_SCHEMAS",
      "arguments": {
        "tool_slugs": [
          "${TOOL_SLUG}"
        ],
        "include": [
          "input_schema",
          "output_schema"
        ],
        "session_id": "${SESSION_ID}"
      }
    },
    "execute_template": {
      "tool": "COMPOSIO_MULTI_EXECUTE_TOOL",
      "arguments": {
        "tools": [
          {
            "tool_slug": "${TOOL_SLUG}",
            "arguments": {},
            "account": "${ACCOUNT_ID}"
          }
        ],
        "session_id": "${SESSION_ID}",
        "sync_response_to_workbench": false
      },
      "bind": "把當前 step.tool 與已綁定的 step.arguments 放入 tools[0].tool_slug / tools[0].arguments；空物件不是可直接執行的範例。ACCOUNT_ID 取自本輪 selected toolkit 的 ACTIVE 帳號。"
    },
    "result_binding": "先讀 MCP structuredContent；只有 content[0].text 時以 JSON parser 解碼。逐項核對 data.results[i] 與呼叫相符；Google 步驟的 response.data 指對應內層 data.results[i].response.data，不是外層 JSON。",
    "account_routing": {
      "GOOGLE_CLASSROOM_": "CLASSROOM_ACCOUNT_ID",
      "GOOGLEDRIVE_": "DRIVE_ACCOUNT_ID",
      "GOOGLECALENDAR_": "CALENDAR_ACCOUNT_ID",
      "GMAIL_": "GMAIL_ACCOUNT_ID",
      "instruction": "依每個 tool_slug 所屬 toolkit 使用本輪正確帳號；跨服務任務不沿用前一服務的 ACCOUNT_ID。需要其他服務時才讀對應 Markdown 並另確認授權，例如 Classroom 附件下載另讀 /connect/services/google-drive.md。"
    },
    "success_checks": [
      "檢查外層與每個內層 response 的 successful / isError；外層回傳成功不代表 provider 操作成功。",
      "寫入後以獨立查詢核對內容與 ID；刪後驗證 DELETED、404 或明確 trashed:true。401/403 不算刪除證據。"
    ],
    "approval": "取得新增／擴大 Google 權限的當次確認。過期連結重新產生，不重複操作舊 callback；不用個人既有廣泛授權替其他人授權。",
    "downloads": "下載工具回傳暫存簽名 URL 時，必須實際取得檔案 bytes 並核對內容或 checksum；只列附件連結不算下載。URL 僅在記憶體使用，不寫公開文件或紀錄。",
    "sources": [
      {
        "title": "Composio consumer MCP endpoint",
        "url": "https://docs.composio.dev/docs/single-toolkit-mcp"
      },
      {
        "title": "Composio managed OAuth",
        "url": "https://docs.composio.dev/toolkits/managed-auth"
      },
      {
        "title": "Composio per-user authentication",
        "url": "https://docs.composio.dev/docs/authentication"
      },
      {
        "title": "Codex MCP configuration",
        "url": "https://learn.chatgpt.com/docs/extend/mcp"
      }
    ]
  },
  "service": {
    "id": "google-classroom",
    "name": "Google Classroom",
    "kind": "mcp",
    "provider": "composio",
    "status": "Composio 第三方 MCP · 教學操作通過，建課受限",
    "checked_on": "2026-11-14",
    "mcp": {
      "server_name": "composio",
      "transport": "streamable_http",
      "url": "https://connect.composio.dev/mcp"
    },
    "summary": "管理指定課程的作業、文字教材與公告，下載學生附件並評分；不要將課程建立的 403 誤當整個 Classroom 不支援。",
    "requirements": [
      "使用者自己的 Composio 與 Google 帳號、可管理的隔離測試課程；新增 Google 權限要當次確認。",
      "本方案使用代管 OAuth，不要求先建立 GCP。缺 classroom.courses 時不可承諾能建課。"
    ],
    "check": "codex --version",
    "inspect": "codex mcp list",
    "setup": "codex mcp add composio --url https://connect.composio.dev/mcp",
    "setup_note": "四個 Google 服務共用同一 Composio MCP 連線；沿用任何同網址既有設定，不為每個 toolkit 重複新增。",
    "login": "codex mcp login composio",
    "login_note": "這只完成 Codex 對 Composio 的登入，之後仍須選定 Google toolkit 並授權；已有效授權不重登。",
    "connection": {
      "toolkit": "google_classroom",
      "account_binding": "CLASSROOM_ACCOUNT_ID",
      "managed_oauth": true,
      "scope_by_task": {
        "view_courses": "classroom.courses.readonly",
        "create_update_delete_courses": "classroom.courses",
        "announcements": "classroom.announcements",
        "teacher_work_and_grades": "classroom.coursework.students",
        "course_materials": "classroom.courseworkmaterials"
      },
      "consent": "先比較目前 Google 同意畫面與任務需求；本輪代管流程未提供 classroom.courses。不能只在 Codex 對 Composio 的登入加 --scopes 就宣稱 Google 已補權限。",
      "attachment_download": "Google Drive 是獨立 toolkit 與帳號綁定；只為附件下載授權時也須揭露實際可能要求的全碟權限。"
    },
    "verification_prompt": "先列出 Classroom 的 ACTIVE 連線，再探索 GOOGLE_CLASSROOM_USER_PROFILES_GET 完整 schema，以 me 查詢 Google 身分；獨立取得並核對指定 COURSE_ID。只讀成功不是完整通過。",
    "verify": {
      "tool": "COMPOSIO_MANAGE_CONNECTIONS",
      "arguments": {
        "toolkits": [
          {
            "name": "google_classroom",
            "action": "list"
          }
        ]
      }
    },
    "test_result": {
      "tested_on": "2026-11-13",
      "method": "mcp",
      "overall": "partial",
      "bootstrap": "passed",
      "resource_type": "assignment_in_existing_test_course",
      "operations": {
        "create": "passed",
        "write": "passed",
        "update": "passed",
        "read_back": "passed",
        "delete": "passed",
        "verify_deleted": "passed"
      },
      "observed": "新草稿作業完成六項操作；文字型草稿教材、草稿公告也分別六項通過。另一新發布作業完成學生附件下載、評分 80 改 95、獨立讀回與發還，學生頁顯示 95/100。測試課程建立、學生加入和繳交是網頁操作，不計入 MCP 通過。",
      "additional_resources": [
        {
          "resource_type": "course",
          "overall": "blocked",
          "operations": {
            "create": "failed",
            "write": "not_tested",
            "update": "not_tested",
            "read_back": "passed",
            "delete": "not_tested",
            "verify_deleted": "not_tested"
          },
          "error": "403 ACCESS_TOKEN_SCOPE_INSUFFICIENT",
          "observed": "目前授權缺 classroom.courses，另由網頁建立測試課程；網頁成功不算 MCP 建課成功。能否補上代管 scope 尚未確認。"
        },
        {
          "resource_type": "text_only_draft_course_material",
          "overall": "passed",
          "operations": {
            "create": "passed",
            "write": "passed",
            "update": "passed",
            "read_back": "passed",
            "delete": "passed",
            "verify_deleted": "passed"
          }
        },
        {
          "resource_type": "draft_announcement",
          "overall": "passed",
          "operations": {
            "create": "passed",
            "write": "passed",
            "update": "passed",
            "read_back": "passed",
            "delete": "passed",
            "verify_deleted": "passed"
          }
        }
      ],
      "teaching_checks": {
        "student_submission_attachment_download": "passed",
        "grade_write_80_read_back": "passed",
        "grade_update_95_read_back": "passed",
        "return_submission": "passed",
        "student_visible_95_of_100": "passed",
        "clear_grade_independently": "not_tested",
        "student_enrollment_via_mcp": "not_tested",
        "student_turn_in_via_mcp": "not_tested"
      },
      "cleanup": "作業、教材、公告已由 MCP 刪除並讀回 DELETED；測試課程及使用者指定的測試學生身分保留。學生合成附件未另外刪除，也未在刪作業後重查。"
    },
    "operation_test": {
      "mode": "verified_recipe",
      "resource_type": "assignment_in_existing_test_course",
      "requires_write_consent": true,
      "preconditions": [
        "取得使用者指定的可拋棄課程，透過 GET 核對名稱、擁有者與 COURSE_ID；沒有課程就先處理建課授權或經同意由網頁準備，不操作真實班級。",
        "以下 tool 均為 Composio tool_slug，須經 composio_protocol.execute_template 呼叫；先讀完整 schema。",
        "只建立草稿，不通知真實學生；發布、學生繳交、成績與發還必須另有指定測試學生與同意。"
      ],
      "steps": [
        {
          "operation": "create",
          "tool": "GOOGLE_CLASSROOM_COURSE_WORK_CREATE",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "title": "NMKING MCP TEST ${RUN_ID}",
            "workType": "ASSIGNMENT",
            "state": "DRAFT",
            "maxPoints": 100,
            "description": "CREATE CHECK ${RUN_ID}"
          },
          "save": "ASSIGNMENT_ID = response.data.id；核對 state DRAFT 與 associatedWithDeveloper。"
        },
        {
          "operation": "write",
          "tool": "GOOGLE_CLASSROOM_COURSES_COURSE_WORK_PATCH",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}",
            "updateMask": "description",
            "description": "WRITE CHECK ${RUN_ID}"
          }
        },
        {
          "operation": "read_back",
          "tool": "GOOGLE_CLASSROOM_COURSE_WORK_GET",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}"
          },
          "assert": "description 含 WRITE CHECK 且仍為 DRAFT。"
        },
        {
          "operation": "update",
          "tool": "GOOGLE_CLASSROOM_COURSES_COURSE_WORK_PATCH",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}",
            "updateMask": "title,description",
            "title": "NMKING MCP TEST ${RUN_ID} UPDATED",
            "description": "UPDATE CHECK ${RUN_ID}"
          }
        },
        {
          "operation": "read_back",
          "tool": "GOOGLE_CLASSROOM_COURSE_WORK_GET",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}"
          },
          "assert": "核對修改後標題、UPDATE CHECK 與 DRAFT。"
        },
        {
          "operation": "delete",
          "tool": "GOOGLE_CLASSROOM_COURSE_WORK_DELETE",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}"
          }
        },
        {
          "operation": "verify_deleted",
          "tool": "GOOGLE_CLASSROOM_COURSE_WORK_GET",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "id": "${ASSIGNMENT_ID}"
          },
          "assert": "明確 DELETED 或可識別的 404；401/403 不算。"
        }
      ]
    },
    "task_recipes": {
      "materials": {
        "resource_type": "text_only_draft_course_material",
        "schema_required": true,
        "tools": [
          "GOOGLE_CLASSROOM_COURSE_WORK_MATERIALS_CREATE",
          "GOOGLE_CLASSROOM_COURSES_WORK_MATERIALS_PATCH",
          "GOOGLE_CLASSROOM_COURSE_WORK_MATERIALS_GET",
          "GOOGLE_CLASSROOM_COURSES_COURSE_WORK_MATERIALS_DELETE"
        ],
        "instruction": "只用本輪 MATERIAL_ID；分別寫 WRITE CHECK、改 UPDATE CHECK、GET 核對，刪後 GET DELETED。"
      },
      "announcements": {
        "resource_type": "draft_announcement",
        "schema_required": true,
        "tools": [
          "GOOGLE_CLASSROOM_COURSES_ANNOUNCEMENTS_CREATE",
          "GOOGLE_CLASSROOM_COURSES_ANNOUNCEMENTS_PATCH",
          "GOOGLE_CLASSROOM_COURSES_ANNOUNCEMENTS_GET",
          "GOOGLE_CLASSROOM_COURSES_ANNOUNCEMENTS_DELETE"
        ],
        "instruction": "state DRAFT；只用本輪 ANNOUNCEMENT_ID 做六項操作，不發布給真實學生。"
      },
      "student_work_and_grading": {
        "schema_required": true,
        "preconditions": [
          "指定使用者控制的測試學生與合成作業，記錄學生加入／繳交究竟是 browser 還是 MCP。",
          "只評本輪由同一 Composio OAuth developer project 建立的作業；GET 核對 associatedWithDeveloper:true。",
          "以 submission.userId 核對指定學生；解析該 submission 的附件 ID，再另用 Drive 帳號下載並核對 bytes，不掃描其他學生或檔案。"
        ],
        "tools": [
          "GOOGLE_CLASSROOM_COURSE_WORK_STUDENT_SUBMISSIONS_LIST",
          "GOOGLE_CLASSROOM_GET_STUDENT_SUBMISSION",
          "GOOGLEDRIVE_DOWNLOAD_FILE",
          "GOOGLE_CLASSROOM_UPDATE_STUDENT_SUBMISSION",
          "GOOGLE_CLASSROOM_RETURN_STUDENT_SUBMISSION"
        ],
        "grade_example": {
          "tool": "GOOGLE_CLASSROOM_UPDATE_STUDENT_SUBMISSION",
          "arguments": {
            "courseId": "${COURSE_ID}",
            "courseWorkId": "${ASSIGNMENT_ID}",
            "id": "${SUBMISSION_ID}",
            "updateMask": "draftGrade,assignedGrade",
            "draftGrade": 80,
            "assignedGrade": 80
          }
        },
        "instruction": "先 GET 讀回 80，再改兩欄為 95 並 GET 讀回；RETURN 後 GET 驗證 RETURNED 與 assignedGrade 95。return 不會自動把 draftGrade 複製至 assignedGrade。學生畫面另確認 95/100；不能把 maxPoints 當實得分數。清空成績未測；刪除測試作業是另一個明確授權動作。"
      }
    },
    "success": "分別回報作業、教材、公告、學生附件與評分結果；目前不得宣稱 MCP 可建課或整個服務全部通過。",
    "examples": [
      "在指定課程建立草稿作業與教材",
      "下載指定學生合成作業並評分、發還"
    ],
    "troubleshooting": [
      "403 ACCESS_TOKEN_SCOPE_INSUFFICIENT：建課需 classroom.courses；工具清單有 create 不等於目前可用。",
      "ProjectPermissionDenied：核對作業與 OAuth developer project 的關聯，勿以真實作業驗證。",
      "學生附件不可讀：確認繳交狀態、原檔案權限、Drive 個別授權與正確帳號。"
    ],
    "sources": [
      {
        "title": "Composio Classroom toolkit",
        "url": "https://docs.composio.dev/toolkits/google_classroom"
      },
      {
        "title": "Google Classroom grading",
        "url": "https://developers.google.com/workspace/classroom/guides/classroom-api/manage-grades"
      }
    ],
    "spec_url": "https://ai.nmking.io/connect/services/google-classroom.json",
    "spec_markdown_url": "https://ai.nmking.io/connect/services/google-classroom.md",
    "commands": {
      "version": "codex --version",
      "inspect": "codex mcp list",
      "add": "codex mcp add composio --url https://connect.composio.dev/mcp",
      "login": "codex mcp login composio",
      "verify": {
        "tool": "COMPOSIO_MANAGE_CONNECTIONS",
        "arguments": {
          "toolkits": [
            {
              "name": "google_classroom",
              "action": "list"
            }
          ]
        }
      }
    }
  }
}
```
