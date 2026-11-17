# NMKING Connect: Service Index

Plugin: 0.1.1
Guide revision: 2026-11-14.1
Packaged on: 2026-11-16 (Asia/Taipei)
Source: https://ai.nmking.io/connect

Read only the selected service Markdown, or its matching JSON. These are historical, resource-scoped test results, not current login status or full-service guarantees. Composio is a third-party provider, not Google official MCP.

| ID | Service specification | Provider | Historical overall | Tested on |
| --- | --- | --- | --- | --- |
| canva | [Canva](services/canva.md) | official | partial | 2026-11-13 |
| github | [GitHub](services/github.md) | official | blocked | 2026-11-13 |
| notion | [Notion](services/notion.md) | official | passed | 2026-11-13 |
| padlet | [Padlet](services/padlet.md) | official | passed | 2026-11-13 |
| kahoot | [Kahoot!](services/kahoot.md) | official | passed | 2026-11-13 |
| vercel | [Vercel](services/vercel.md) | official | passed | 2026-11-13 |
| netlify | [Netlify](services/netlify.md) | official | partial | 2026-11-13 |
| cloudflare | [Cloudflare](services/cloudflare.md) | official | deferred | 2026-11-13 |
| colab | [Google Colab](services/colab.md) | official | blocked | 2026-11-13 |
| google-classroom | [Google Classroom](services/google-classroom.md) | composio | partial | 2026-11-13 |
| google-drive | [Google Drive](services/google-drive.md) | composio | passed | 2026-11-13 |
| google-calendar | [Google Calendar](services/google-calendar.md) | composio | not_tested | not_tested |
| gmail | [Gmail](services/gmail.md) | composio | not_tested | not_tested |

## Aliases

- Google Drive / 雲端硬碟: google-drive
- Google Calendar / 日曆 / 行事曆: google-calendar
- Google Classroom / 課堂: google-classroom
- Kahoot / Kahoot!: kahoot
- Google Colab / Colab: colab

## Interpretation

- passed: only the exact resource and operations described by test_result.
- partial: some operations passed; read the remaining blockers.
- blocked: a specific authorization or capability requirement failed.
- deferred: testing was explicitly deferred; do not resume automatically.
- not_tested: documentation or tool availability is not operation success.

Classroom teaching checks and Drive text-file checks have separate evidence; course creation still has a recorded 403 scope blocker. Gmail and Calendar remain untested in the Composio scenario. Native Chat integrations and personal Codex MCP connections are separate scopes.
