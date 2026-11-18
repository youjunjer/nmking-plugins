# Gmail MCP

NMKING 包裝的獨立 MCP 外掛，內含可被 Codex 載入的真正 MCP 伺服器宣告與登入引導 Skill。可個別安裝、停用及更新，不會安裝其他服務。

## 登入與使用

透過 Composio 第三方 MCP：先登入 Composio，再只授權 gmail。不是 Google 官方 MCP；不同服務的帳號和權限需分別確認。

安裝後先連接 Composio，再讓 Codex 完成 gmail 的帳號授權。這是兩個獨立步驟；只有 Composio 登入不代表服務已可用。



```sh
codex plugin add nmking-gmail@nmking-plugins
```

安裝後可要求 Codex：「完成 Gmail MCP 的連線，先核對帳號並做唯讀確認。」不需要另外手動新增全域 MCP。

- [現行連線與授權方式](skills/nmking-gmail-connect/references/connection.json)
- [登入與操作入口](skills/nmking-gmail-connect/SKILL.md)
- [原始服務規格與歷史結果](skills/nmking-gmail-connect/references/service.md)
- [供應商說明](https://docs.composio.dev/docs/composio-connect)

安裝設定不是帳號授權，也不是本版完整操作測試。服務工具、帳號政策、付費方案與寫入權限以實際連線為準。此套件由 NMKING 包裝，非供應商官方外掛。
