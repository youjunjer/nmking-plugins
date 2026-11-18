# Google Colab MCP

NMKING 包裝的獨立 MCP 外掛，內含可被 Codex 載入的真正 MCP 伺服器宣告與登入引導 Skill。可個別安裝、停用及更新，不會安裝其他服務。

## 登入與使用

Google 官方本機 MCP：需 uv／uvx、Git 與 Python 3.13，首次下載可能較久；啟動後連接本機瀏覽器中的 Colab 並登入 Google，不是遠端 OAuth 按鈕。

首次使用需要 uv／uvx、Git 與 Python 3.13。未安裝這些依賴時，外掛雖可安裝，MCP 尚不能啟動；請先讓 Codex 協助核對並經同意安裝。之後以 open_colab_browser_connection 開啟本機 Colab 分頁登入及連接。

使用 Google 官方本機 MCP，而非需要額外 Cloud 認證的遠端 API。啟動後以 open_colab_browser_connection 在本機瀏覽器登入 Google 並連接 Colab；這不是 Codex 的遠端 OAuth 按鈕。首次安裝仍需具備 uv 與 Git。

```sh
codex plugin add nmking-colab@nmking-plugins
```

安裝後可要求 Codex：「完成 Google Colab MCP 的連線，先核對帳號並做唯讀確認。」不需要另外手動新增全域 MCP。

- [現行連線與授權方式](skills/nmking-colab-connect/references/connection.json)
- [登入與操作入口](skills/nmking-colab-connect/SKILL.md)
- [原始服務規格與歷史結果](skills/nmking-colab-connect/references/service.md)
- [供應商說明](https://github.com/googlecolab/colab-mcp)

安裝設定不是帳號授權，也不是本版完整操作測試。服務工具、帳號政策、付費方案與寫入權限以實際連線為準。此套件由 NMKING 包裝，非供應商官方外掛。
