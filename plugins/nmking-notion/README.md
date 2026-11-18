# Notion MCP

NMKING 包裝的獨立 MCP 外掛，內含可被 Codex 載入的真正 MCP 伺服器宣告與登入引導 Skill。可個別安裝、停用及更新，不會安裝其他服務。

## 登入與使用

連接服務供應商官方遠端 MCP，由 Codex 依 OAuth discovery 引導使用者在瀏覽器登入並確認權限。

安裝後在此外掛的連線介面點選連接／登入，於服務提供者的瀏覽器頁面核對帳號與權限並確認。已有效登入時可沿用。



```sh
codex plugin add nmking-notion@nmking-plugins
```

安裝後可要求 Codex：「完成 Notion MCP 的連線，先核對帳號並做唯讀確認。」不需要另外手動新增全域 MCP。

- [現行連線與授權方式](skills/nmking-notion-connect/references/connection.json)
- [登入與操作入口](skills/nmking-notion-connect/SKILL.md)
- [原始服務規格與歷史結果](skills/nmking-notion-connect/references/service.md)
- [供應商說明](https://developers.notion.com/guides/mcp/overview)

安裝設定不是帳號授權，也不是本版完整操作測試。服務工具、帳號政策、付費方案與寫入權限以實際連線為準。此套件由 NMKING 包裝，非供應商官方外掛。
