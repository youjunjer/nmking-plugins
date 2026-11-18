# NMKING 外掛市集

供 Codex 引入的 Git 市集。**一項服務、一個圖示、一個可獨立安裝的外掛。**
目前 13 個獨立外掛都**包含真正的 MCP 宣告**，不再只有操作指南。
安裝後 Codex 可直接載入該服務的 MCP，並提供登入引導；不必另外手動新增伺服器。
每個套件有不同的 `nmking-<service>` MCP 識別名稱，不覆寫既有全域設定。

帳號授權仍須由使用者在瀏覽器核對並確認。安裝設定、登入完成、工具可用與實際操作成功
是不同階段，不代表所有服務都已替新使用者授權或完成實測。

## 加入市集

在 Codex「外掛程式 → 新增外掛市集」填入：

| 欄位 | 內容 |
| --- | --- |
| 來源 | `youjunjer/nmking-plugins` |
| Git 參照 | `main`；固定版本可用 `v0.3.0` |
| 稀疏路徑 | 留空 |

加入後選擇 **NMKING 外掛市集**，只安裝需要的服務，再於該外掛選擇連接／登入。不要只取
`plugins/nmking-connect`，那是舊版整合包；若使用稀疏路徑，需包含
`.agents/plugins` 及所需的個別外掛目錄。

支援相關命令的 Codex CLI 也可使用，例如只安裝 Padlet：

```sh
codex plugin marketplace add youjunjer/nmking-plugins --ref main
codex plugin add nmking-padlet@nmking-plugins
codex mcp login nmking-padlet
```

已加入 `main` 市集時，先更新清單：

```sh
codex plugin marketplace upgrade nmking-plugins
```

固定在舊版的 Git 參照需改成 `main` 或 `v0.3.0`，才會取得真正的 MCP 套件。
更新市集後，還要在外掛介面更新已安裝的服務；CLI 使用者可重新執行該服務的 `plugin add`。

## 登入方式

| 服務 | 安裝後的登入方式 |
| --- | --- |
| Canva、Notion、Padlet、Kahoot!、Vercel、Netlify、Cloudflare | 連接官方遠端 MCP，由 Codex 啟動 OAuth，使用者在瀏覽器登入並確認權限。 |
| GitHub、Google Classroom、Google Drive、Google Calendar、Gmail | 透過 Composio 第三方 MCP；先登入 Composio，再個別授權指定服務與帳號。 |
| Google Colab | Google 官方本機 MCP；需要 uv／uvx、Git、Python 3.13，並在本機瀏覽器登入 Google、連接 Colab 分頁。 |

**GitHub 預設不是官方遠端 MCP**：官方的 Codex 遠端設定目前仍要求 PAT。
本版採 Composio 讓使用者走瀏覽器授權，不包含 PAT 或共用憑證；需要官方直連時，應另外選擇方案。
參考 [GitHub 官方 Codex 設定](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md)。

**Colab 不是遠端 OAuth 按鈕**：缺少本機依賴時，安裝外掛還不能直接啟動 MCP。
登入引導會先核對依賴，在取得同意後協助準備，再使用官方 `open_colab_browser_connection`
工具連接 Colab。首次下載較久時，需先完成準備並重新啟動 MCP。無須為這個本機方案自行建立 GCP。
參考 [Google 官方 Colab 本機 MCP](https://github.com/googlecolab/colab-mcp)。

Composio 的五項外掛各有自己的 MCP 識別名稱及指定 toolkit，避免彼此覆蓋；
它們仍共用 Composio 後端。toolkit 的選擇是登入／操作引導，不是硬性的伺服器層工具隔離。
不得因登入 Composio 就自動替全部服務開授權，也不能把它們稱為 Google／GitHub 官方 MCP。

## 13 項服務

| 圖示 | 服務 | 獨立外掛名稱 |
| --- | --- | --- |
| ![Canva](plugins/nmking-canva/skills/nmking-canva-connect/assets/icon.svg) | [Canva](plugins/nmking-canva/README.md) | `nmking-canva` |
| ![GitHub](plugins/nmking-github/skills/nmking-github-connect/assets/icon.svg) | [GitHub](plugins/nmking-github/README.md) | `nmking-github` |
| ![Notion](plugins/nmking-notion/skills/nmking-notion-connect/assets/icon.svg) | [Notion](plugins/nmking-notion/README.md) | `nmking-notion` |
| ![Padlet](plugins/nmking-padlet/skills/nmking-padlet-connect/assets/icon.svg) | [Padlet](plugins/nmking-padlet/README.md) | `nmking-padlet` |
| ![Kahoot!](plugins/nmking-kahoot/skills/nmking-kahoot-connect/assets/icon.svg) | [Kahoot!](plugins/nmking-kahoot/README.md) | `nmking-kahoot` |
| ![Vercel](plugins/nmking-vercel/skills/nmking-vercel-connect/assets/icon.svg) | [Vercel](plugins/nmking-vercel/README.md) | `nmking-vercel` |
| ![Netlify](plugins/nmking-netlify/skills/nmking-netlify-connect/assets/icon.svg) | [Netlify](plugins/nmking-netlify/README.md) | `nmking-netlify` |
| ![Cloudflare](plugins/nmking-cloudflare/skills/nmking-cloudflare-connect/assets/icon.svg) | [Cloudflare](plugins/nmking-cloudflare/README.md) | `nmking-cloudflare` |
| ![Google Colab](plugins/nmking-colab/skills/nmking-colab-connect/assets/icon.svg) | [Google Colab](plugins/nmking-colab/README.md) | `nmking-colab` |
| ![Google Classroom](plugins/nmking-google-classroom/skills/nmking-google-classroom-connect/assets/icon.svg) | [Google Classroom](plugins/nmking-google-classroom/README.md) | `nmking-google-classroom` |
| ![Google Drive](plugins/nmking-google-drive/skills/nmking-google-drive-connect/assets/icon.svg) | [Google Drive](plugins/nmking-google-drive/README.md) | `nmking-google-drive` |
| ![Google Calendar](plugins/nmking-google-calendar/skills/nmking-google-calendar-connect/assets/icon.svg) | [Google Calendar](plugins/nmking-google-calendar/README.md) | `nmking-google-calendar` |
| ![Gmail](plugins/nmking-gmail/skills/nmking-gmail-connect/assets/icon.svg) | [Gmail](plugins/nmking-gmail/README.md) | `nmking-gmail` |

例如安裝 Padlet 後，在新對話輸入：

> 完成 Padlet MCP 的登入連線。沿用正確帳號，先做唯讀確認；需要新增或擴大權限時，先讓我確認。

Google Classroom／Drive／Calendar／Gmail 的此方案由 **Composio 第三方 MCP** 提供，
不是 Google 官方 MCP。舊版服務規格與歷史測試保留；本版實際端點、傳輸與登入方式請以
每個外掛的 `references/connection.json` 為準，不能把舊規格的安裝命令再加成重複的全域 MCP。

## 新增與更新

往後新服務一律建立獨立外掛。各自管理版本、圖示、MCP 設定、登入 Skill 與服務文件；
不再只加進舊版總覽。請看 [新增服務規則](docs/ADDING_A_SERVICE.md)。

使用 Node.js 20.19 以上版本，不需 npm 相依套件：

```sh
npm run build:services
npm test
npm run check
```

平常建置與檢查不連網、不執行帳號授權。`catalog/services.json` 控制主清單與每個服務的版本，
`catalog/connections.json` 控制現行 MCP 端點、傳輸與登入方式。產生 portable `mcp.json`
及相容格式 `.mcp.json`，並在 manifest 中明確引用；不把憑證寫進套件。
每個外掛自己的 `references/service.md`、`service.json` 保留歷史文件，建置不會從舊包覆寫它們。
只修改某項服務時，僅提高該服務版本，再建置與驗證。

`sync:connect` 是舊版整合包的公開文件匯入器，不會發布到各獨立外掛。
不要為了更新文件而改寫原有 `tested_on`、執行 Google 授權或重跑真實資源測試。

## 舊版與來源

舊版 [NMKING Connect 整合包](plugins/nmking-connect/) 與固定標籤 `v0.1.0`、`v0.1.1` 保留，
但新版主清單只列 13 項個別服務，不多放一個整合入口。不會替使用者解除安裝舊包。
需要舊整合包時可使用原固定版本；新使用者請選個別服務。

- [原始網頁連線規格](https://ai.nmking.io/connect)
- [圖示來源與授權](third_party/simple-icons/README.md)

本儲存庫是 **使用者自行加入的自訂市集**，不是 OpenAI 內建公開目錄的上架／審查結果。
所有指南由 NMKING 整理，非第三方服務供應商官方外掛；品牌名稱與商標屬各自權利人。

## 版本紀錄

- `0.3.0`：13 個服務加入真正的 MCP 宣告，外掛各為 `0.2.0`；包含 12 個遠端 OAuth 連線及 1 個官方 Colab 本機 MCP，附個別登入引導。
- `0.2.0`：主市集拆為 13 個可獨立安裝的服務圖示；每個服務外掛初版為 `0.1.0`。
- `0.1.1`：補上舊整合包的清單、輸入區與 Skill 圖示。
- `0.1.0`：首次發布 13 項服務的整合指南。

## 聯絡

小霸王有限公司 · [NMKING AI Gateway](https://ai.nmking.io)

- LINE：[@nmkingtw](https://line.me/R/ti/p/%40nmkingtw)
- Email：nmkingtw@gmail.com
