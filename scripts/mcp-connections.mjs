import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { root } from "./sync-connect.mjs";

export async function readConnections() {
  const connections = JSON.parse(await readFile(new URL("catalog/connections.json", root), "utf8"));
  assert.equal(connections.schema_version, 1);
  for (const connection of Object.values(connections.services)) validateConnection(connection);
  const names = Object.values(connections.services).map((connection) => connection.server);
  assert.equal(new Set(names).size, names.length, "Each plugin needs an independent MCP server identifier");
  return connections;
}

export function validateConnection(connection) {
  const allowed = ["server", "provider", "transport", "url", "authentication", "documentation", "toolkit", "note", "command", "args", "requirements"];
  for (const key of Object.keys(connection)) assert.ok(allowed.includes(key), "Unexpected connection field: " + key);
  assert.match(connection.server, /^nmking-[a-z][a-z0-9-]*$/);
  assert.ok(["official", "composio"].includes(connection.provider));
  assert.equal(new URL(connection.documentation).protocol, "https:");
  if (connection.transport === "streamable-http") {
    const url = new URL(connection.url);
    assert.equal(url.protocol, "https:");
    assert.ok(!url.username && !url.password && !url.search && !url.hash);
    assert.ok(["oauth", "oauth_and_toolkit"].includes(connection.authentication));
    assert.equal(connection.command, undefined);
    assert.equal(connection.args, undefined);
  } else {
    assert.equal(connection.transport, "stdio");
    assert.equal(connection.command, "uvx");
    assert.equal(connection.authentication, "colab_browser_session");
    assert.equal(connection.args.length, 5);
    assert.equal(connection.args[0], "--python");
    assert.equal(connection.args[1], "3.13");
    assert.equal(connection.args[2], "--from");
    assert.match(connection.args[3], /^git\+https:\/\/github.com\/googlecolab\/colab-mcp@[a-f0-9]{40}$/);
    assert.equal(connection.args[4], "colab-mcp");
    assert.equal(connection.url, undefined);
  }
  if (connection.provider === "composio") {
    assert.equal(connection.url, "https://connect.composio.dev/mcp");
    assert.equal(connection.authentication, "oauth_and_toolkit");
    assert.match(connection.toolkit, /^[a-z_]+$/);
  } else assert.equal(connection.toolkit, undefined);
  for (const key of ["headers", "env", "clientId", "clientSecret", "api_key", "access_token", "bearer_token"]) {
    assert.equal(connection[key], undefined, "Credentials do not belong in a package: " + key);
  }
  return connection;
}

export function mcpConfigurations(connection) {
  validateConnection(connection);
  const portable = connection.transport === "stdio"
    ? { type: "stdio", command: connection.command, args: connection.args }
    : { type: "streamable-http", url: connection.url };
  const compatibility = connection.transport === "stdio"
    ? { command: connection.command, args: connection.args }
    : { type: "http", url: connection.url };
  return {
    portable: { $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", mcpServers: { [connection.server]: portable } },
    compatibility: { mcpServers: { [connection.server]: compatibility } },
  };
}

export function authenticationSummary(connection) {
  if (connection.provider === "composio") {
    const provider = connection.toolkit === "github" ? "GitHub" : "Google";
    return `透過 Composio 第三方 MCP：先登入 Composio，再只授權 ${connection.toolkit}。不是 ${provider} 官方 MCP；不同服務的帳號和權限需分別確認。`;
  }
  if (connection.transport === "stdio") {
    return "Google 官方本機 MCP：需 uv／uvx、Git 與 Python 3.13，首次下載可能較久；啟動後連接本機瀏覽器中的 Colab 並登入 Google，不是遠端 OAuth 按鈕。";
  }
  return "連接服務供應商官方遠端 MCP，由 Codex 依 OAuth discovery 引導使用者在瀏覽器登入並確認權限。";
}

export function pluginReadme(service, connection) {
  const local = connection.transport === "stdio"
    ? "首次使用需要 uv／uvx、Git 與 Python 3.13。未安裝這些依賴時，外掛雖可安裝，MCP 尚不能啟動；請先讓 Codex 協助核對並經同意安裝。之後以 open_colab_browser_connection 開啟本機 Colab 分頁登入及連接。"
    : connection.provider === "composio"
      ? `安裝後先連接 Composio，再讓 Codex 完成 ${connection.toolkit} 的帳號授權。這是兩個獨立步驟；只有 Composio 登入不代表服務已可用。`
      : "安裝後在此外掛的連線介面點選連接／登入，於服務提供者的瀏覽器頁面核對帳號與權限並確認。已有效登入時可沿用。";
  return `# ${service.name} MCP\n\nNMKING 包裝的獨立 MCP 外掛，內含可被 Codex 載入的真正 MCP 伺服器宣告與登入引導 Skill。可個別安裝、停用及更新，不會安裝其他服務。\n\n## 登入與使用\n\n${authenticationSummary(connection)}\n\n${local}\n\n${connection.note ?? ""}\n\n\`\`\`sh\ncodex plugin add nmking-${service.id}@nmking-plugins\n\`\`\`\n\n安裝後可要求 Codex：「完成 ${service.name} MCP 的連線，先核對帳號並做唯讀確認。」不需要另外手動新增全域 MCP。\n\n- [現行連線與授權方式](skills/nmking-${service.id}-connect/references/connection.json)\n- [登入與操作入口](skills/nmking-${service.id}-connect/SKILL.md)\n- [原始服務規格與歷史結果](skills/nmking-${service.id}-connect/references/service.md)\n- [供應商說明](${connection.documentation})\n\n安裝設定不是帳號授權，也不是本版完整操作測試。服務工具、帳號政策、付費方案與寫入權限以實際連線為準。此套件由 NMKING 包裝，非供應商官方外掛。\n`;
}

export function onboardingMarkdown(service, connection) {
  const name = `nmking-${service.id}-connect`;
  const onboarding = connection.provider === "composio"
    ? `1. 先完成此外掛所帶 Composio MCP 的 OAuth。連上 Composio 不等於服務已授權；不得把內建連接器登入當成此外掛成功。\n2. 只為 toolkit \`${connection.toolkit}\` 查詢現有連線。先讀目前 COMPOSIO_SEARCH_TOOLS、COMPOSIO_MANAGE_CONNECTIONS 等實際 schema，不硬套歷史參數。相同帳號且 ACTIVE 時先沿用；多個帳號時先請使用者選擇。\n3. 若所選 toolkit 尚未連線，說明 Composio 是第三方及實際權限，取得使用者對該服務的確認，再產生新的 Connect Link；讓使用者在瀏覽器登入並親自確認。不要替其他 toolkit 開授權。\n4. 用目前可用的 WAIT_FOR_CONNECTIONS 或連線查詢確認 ACTIVE，再呼叫此服務的唯讀身分／帳號工具，明確綁定本輪 ACCOUNT_ID。Composio meta-tool 與內層 tool_slug／arguments 分開，先讀完整 schema。不同 toolkit 不得誤用同一個帳號 ID；文件中的歷史值與變數不能直接送出。\n5. 只有需要跨服務任務時，才另請使用者選擇其他外掛／帳號與授權；共用 Composio 端點不是跨服務全權授權。`
    : connection.transport === "stdio"
      ? `1. 此套件已宣告官方 Colab STDIO MCP；它必須在使用者自己的電腦執行，不是在 SSH、WSL 或雲端代替本機。先檢查 uvx、Git 與 Python 3.13。缺少依賴時先說明，取得安裝同意後依官方方式安裝，不使用安裝 Hook 或管理員權限強行修改系統。\n2. 首次下載／建置可能超過 MCP 啟動逾時。可在取得使用者同意後，使用 references/connection.json 中的同一套固定版 command／args，加上 --help 預先完成下載；不得改成 latest 或未知第三方套件。完成後重新啟動此外掛的 MCP。\n3. 先讀工具清單。未連接 Colab 時應提供 open_colab_browser_connection；使用者要求連接後才呼叫，讓使用者在開啟的本機 Colab 分頁登入 Google 並確認連接。不要記錄、複製或顯示含 mcpProxyToken 的臨時連結。\n4. 連接過程會等待使用者完成；逾時不等於成功，請使用者完成分頁中的操作後再查證。工具清單可能透過 notifications/tools/list_changed 更新，必須重新列出；不能只有工具名稱存在就回報已連線。\n5. 這是瀏覽器 Colab session，不是雲端遠端 API OAuth，不自行建立 GCP、啟用計費或索取 Google 權杖。`
      : `1. 此套件已宣告 ${service.name} 遠端 MCP。在此外掛的連線介面啟動登入／重新連接，讓 Codex 根據服務的 OAuth discovery 開啟瀏覽器；使用者核對帳號、團隊及實際權限後自行確認。\n2. 若已有效登入且帳號正確，直接沿用；只有過期、撤銷或使用者要求切換帳號時才重新登入。遇到用戶端註冊、redirect URI 或 scope 錯誤，回報服務與客戶端的實際阻礙，不借用其他應用程式的 client ID、secret、Token 或已核准 loopback 流程繞過。\n3. 完成 OAuth 後重新列出此外掛工具，執行此服務可用的唯讀帳號／工作區確認。MCP 授權、工具清單與帳號查證分開回報，不以其他方案的結果代替。`;
  return `---\nname: ${name}\ndescription: ${JSON.stringify(`Onboard and use the bundled ${service.name} MCP server. Complete this plugin's user-owned login, verify the selected account, and use its actual MCP tools without adding duplicate global servers.`)}\n---\n\n# ${service.name} MCP\n\n此外掛包含真正的 MCP 宣告。優先使用此外掛提供的獨立 MCP 識別名稱 \`${connection.server}\`，不重複執行 codex mcp add、不覆寫使用者的全域設定，也不改用內建連接器或 CLI 後宣稱 MCP 成功。\n\n## 現行連線\n\n先讀 [connection.json](references/connection.json)，這是本版實際端點、傳輸與登入方式。\n${authenticationSummary(connection)}\n${connection.transport === "streamable-http" ? `\n使用者要求連接時，可在此外掛介面啟動登入，或執行 \`codex mcp login ${connection.server}\`。這是已安裝外掛的識別名稱，不需要另加全域伺服器。\n` : ""}\n## 安裝後登入與查證\n\n${onboarding}\n\n## 任務與驗證界線\n\n- 先確認正確帳號與任務。密碼、驗證碼與 Passkey 由使用者在服務介面輸入，不要求貼進對話；Token、secret 與臨時授權連結不得記錄或回傳。\n- 安裝只加入此外掛的 MCP，不自動替使用者確認 OAuth 同意、購買方案、啟用 GCP 或建立計費資源。新增／擴大權限仍須當次確認。\n- OAuth 成功、工具清單或唯讀只代表各自階段，不是完整操作通過。寫入、刪除、部署與費用依本次任務授權，完整測試前先確認新建測試資料及清理範圍。\n- 執行前讀目前工具清單與完整 schema；401／403／缺工具／帳號不符時停止該步並回報，不盲目重試或以另一方案補做。寫入結果不明先讀回，避免重複建立。\n- [service.md](references/service.md) 與同目錄 service.json 保留舊版公開規格、CLI 選項及歷史測試結果。它們不是本版登入結果；若歷史端點或安裝命令與 connection.json 不同，以現行連線檔和已捆綁 MCP 為準，不照舊命令重複加伺服器。\n- 保留原 test_result 日期與限制，依 report_contract 分別回報驗證結果及剩餘物件。不把 MCP 設定、套件安裝或原個人連線的測試誤稱為本外掛已通過帳號操作。\n\n此套件由 NMKING 包裝，非服務供應商官方外掛；不代表 NMKING Chat 已完成相同整合。\n`;
}
