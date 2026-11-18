# GitHub MCP

NMKING 包裝的獨立 MCP 外掛，內含可被 Codex 載入的真正 MCP 伺服器宣告與登入引導 Skill。可個別安裝、停用及更新，不會安裝其他服務。

## 登入與使用

透過 Composio 第三方 MCP：先登入 Composio，再只授權 github。不是 GitHub 官方 MCP；不同服務的帳號和權限需分別確認。

安裝後先連接 Composio，再讓 Codex 完成 github 的帳號授權。這是兩個獨立步驟；只有 Composio 登入不代表服務已可用。

本外掛預設透過 Composio 第三方 MCP，以瀏覽器登入 GitHub。GitHub 官方遠端 MCP 的 Codex 設定目前要求 PAT；不把它誤稱為免權杖 OAuth 登入。

```sh
codex plugin add nmking-github@nmking-plugins
```

安裝後可要求 Codex：「完成 GitHub MCP 的連線，先核對帳號並做唯讀確認。」不需要另外手動新增全域 MCP。

- [現行連線與授權方式](skills/nmking-github-connect/references/connection.json)
- [登入與操作入口](skills/nmking-github-connect/SKILL.md)
- [原始服務規格與歷史結果](skills/nmking-github-connect/references/service.md)
- [供應商說明](https://docs.composio.dev/docs/composio-connect)

安裝設定不是帳號授權，也不是本版完整操作測試。服務工具、帳號政策、付費方案與寫入權限以實際連線為準。此套件由 NMKING 包裝，非供應商官方外掛。
