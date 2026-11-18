import assert from "node:assert/strict";
import { access, lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertPublicDocument, references, root, sha256 } from "./sync-connect.mjs";

const read = (path) => readFile(new URL(path, root), "utf8");
const json = async (path) => JSON.parse(await read(path));
const format = (value) => JSON.stringify(value, null, 2) + "\n";
export const pluginName = (id) => `nmking-${id}`;
export const skillName = (id) => `${pluginName(id)}-connect`;
export const pluginPath = (id) => `plugins/${pluginName(id)}/`;
export const skillPath = (id) => `${pluginPath(id)}skills/${skillName(id)}/`;

export async function readCatalog() {
  const catalog = await json("catalog/services.json");
  assert.equal(catalog.schema_version, 1);
  assert.match(catalog.marketplace_version, /^\d+\.\d+\.\d+$/);
  assert.ok(catalog.services.length > 0);
  assert.equal(new Set(catalog.services.map((s) => s.id)).size, catalog.services.length);
  for (const service of catalog.services) {
    assert.match(service.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(service.version, /^\d+\.\d+\.\d+$/);
    assert.match(service.icon, /^[a-z0-9]+$/);
    assert.match(service.accent, /^#[0-9A-F]{6}$/);
    assert.ok(service.name && service.name.length <= 25);
    assert.doesNotMatch(service.name, /[\r\n<>]/);
  }
  return catalog;
}

export function serviceIcon(service, icon) {
  assert.ok(icon);
  assert.match(icon.hex, /^[0-9A-F]{6}$/);
  let body;
  if (icon.kind === "monogram") {
    assert.match(icon.letter, /^[A-Z]$/);
    body = `<text x="32" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#${icon.hex}">${icon.letter}</text>`;
  } else {
    assert.equal(icon.kind, "paths");
    assert.ok(icon.paths.length);
    const paths = icon.paths.map((path) => {
      assert.match(path.d, /^[MmZzLlHhVvCcSsQqTtAaEe0-9., +\-]+$/);
      for (const key of Object.keys(path)) assert.ok(["d", "fill-rule", "clip-rule"].includes(key));
      let attrs = `d="${path.d}"`;
      for (const key of ["fill-rule", "clip-rule"]) {
        if (path[key]) {
          assert.ok(["evenodd", "nonzero"].includes(path[key]));
          attrs += ` ${key}="${path[key]}"`;
        }
      }
      return `<path ${attrs}/>`;
    }).join("");
    body = `<g transform="translate(12 12) scale(1.6666666667)" fill="#${icon.hex}">${paths}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n  <title>${service.name.replace(/&/g, "&amp;")}</title>\n  <rect x="1" y="1" width="62" height="62" rx="8" fill="#ffffff" stroke="#dbe3eb" stroke-width="1.5"/>\n  ${body}\n</svg>\n`;
}

export function skillMarkdown(service, provider) {
  const google = provider === "composio"
    ? "\n此 Google 服務透過 Composio 第三方 MCP，不是 Google 官方 MCP。依本文件的 toolkit 與 account_routing 綁定正確帳號；連上 Composio 不等於已取得 Google 授權。需要其他 Google 服務時，另請使用者選擇對應外掛與確認權限，不在此自動啟用。\n"
    : "";
  return `---\nname: ${skillName(service.id)}\ndescription: ${JSON.stringify(`Set up ${service.name} using its NMKING Connect guide. Compare available MCP and CLI options, reuse the correct connection, and verify only user-authorized operations for this service.`)}\n---\n\n# ${service.name} - NMKING Connect\n\n這是 ${service.name} 專用連線指南。外掛可獨立安裝與停用，不會安裝其他服務，不會預先啟用 MCP 或代替使用者授權。\n\n## 操作\n\n1. 讀 [此服務規格](references/service.md)。同目錄的 service.json 是等價機器可讀版本，不必同時讀兩份。來源與文件雜湊見 references/source.json。\n2. 確認本次任務、執行電腦、OS、正確帳號與既有連線；相容且帳號正確時先沿用，不覆寫其他設定。\n3. 依 choice 與 cli_alternative 比較 MCP／CLI；使用者已選方案就沿用，否則先詢問。只在取得選定服務設定的同意後執行必要安裝命令，不自動安裝兩種方案。\n4. 密碼、驗證碼與 Passkey 由使用者在服務介面輸入；新增或擴大存取權限時，說明實際權限並取得當次確認。不要求貼憑證，不自行建立 GCP 或計費資源。\n5. 先讀實際工具清單、完整 schema 或 CLI --help，再核對帳號與唯讀 bootstrap。OAuth、工具清單或唯讀成功不代表完整操作通過。\n6. 完整測試依 operation_test；先確認新建測試資料、公開範圍、費用與刪除清理授權。只操作本輪綁定的測試 ID，寫入結果不明先讀回，不拿真實學生、客戶或郵件當測試資料。\n7. 按 report_contract 回報建立、寫入、修改、讀回、刪除、刪後確認與保留資源。MCP、CLI、網頁證據分開；401／403／缺工具即記錄阻礙，不盲目換方案。\n\n${google}\n保留原 test_result 日期與限制。安裝外掛不是新的服務實測，也不代表 NMKING Chat 已整合此服務。品牌圖示只用於辨識服務，此外掛由 NMKING 編寫，非服務供應商官方外掛。\n`;
}

async function ownDocument(service, ext, bootstrapLegacy) {
  const path = `${skillPath(service.id)}references/service.${ext}`;
  try {
    assert.equal((await lstat(new URL(path, root))).isFile(), true);
    return await readFile(new URL(path, root));
  } catch (error) {
    if (error.code !== "ENOENT" || !bootstrapLegacy) throw error;
    return readFile(new URL(`services/${service.id}.${ext}`, references));
  }
}

export async function serviceOutputs({ bootstrapLegacy = false, catalog: selectedCatalog } = {}) {
  const catalog = selectedCatalog ?? await readCatalog();
  const icons = await json("catalog/icon-sources.json");
  const license = await readFile(new URL("third_party/simple-icons/LICENSE.md", root));
  assert.equal(sha256(license), icons.license_sha256);
  const author = { name: "小霸王有限公司 / NMKING", email: "nmkingtw@gmail.com", url: "https://ai.nmking.io" };
  const outputs = new Map();
  for (const service of catalog.services) {
    const folder = pluginPath(service.id);
    const skill = skillPath(service.id);
    const documents = {};
    for (const ext of ["md", "json"]) {
      documents[ext] = await ownDocument(service, ext, bootstrapLegacy);
      assertPublicDocument(documents[ext].toString("utf8"));
    }
    const spec = JSON.parse(documents.json);
    assert.equal(spec.schema_version, 2);
    assert.equal(spec.service.id, service.id);
    const embedded = documents.md.toString("utf8").match(/```json\n([\s\S]+?)\n```/);
    assert.ok(embedded);
    assert.deepEqual(JSON.parse(embedded[1]), spec);
    const provider = spec.service.provider ?? "official";
    const icon = icons.icons[service.icon];
    const image = serviceIcon(service, icon);
    const imagePath = `./skills/${skillName(service.id)}/assets/icon.svg`;
    const onboardingSkill = `./skills/${skillName(service.id)}/SKILL.md`;
    const ui = {
      displayName: service.name,
      shortDescription: `${service.name} 連線指南`,
      longDescription: `NMKING 整理的 ${service.name} 連線與驗證指南。${spec.service.summary} 此版本只提供專屬 Skill 與文件，不內建或預先啟用 MCP；帳號與權限需個別確認。${provider === "composio" ? "此方案透過 Composio 第三方 MCP，不是 Google 官方 MCP。" : "非服務供應商官方外掛。"}`,
      developerName: author.name, category: "Productivity", capabilities: [],
      websiteURL: `https://ai.nmking.io/connect#${service.id}`,
      logo: imagePath, logoDark: imagePath, composerIcon: imagePath, composerIconDark: imagePath,
      brandColor: service.accent,
      defaultPrompt: [`協助我連接 ${service.name}，先確認既有連線及 MCP／CLI 方案，需要授權時讓我確認。`],
    };
    const identity = {
      name: pluginName(service.id), version: service.version,
      description: `NMKING-authored ${service.name} connection guide. Skills only; no preconfigured MCP or authorization.`,
      author, homepage: `https://ai.nmking.io/connect#${service.id}`,
      repository: "https://github.com/youjunjer/nmking-plugins",
      keywords: ["nmking", "service-guide", service.id],
    };
    outputs.set(folder + "plugin.json", format({
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", ...identity,
      extensions: { "com.openai": { onboardingSkill, interface: ui } },
    }));
    outputs.set(folder + ".codex-plugin/plugin.json", format({ ...identity, skills: "./skills/", onboardingSkill, interface: ui }));
    outputs.set(skill + "SKILL.md", skillMarkdown(service, provider));
    outputs.set(skill + "agents/openai.yaml", `interface:\n  display_name: ${JSON.stringify(service.name)}\n  short_description: ${JSON.stringify(`使用 NMKING 專屬指南，協助設定與驗證 ${service.name} 的 MCP／CLI 服務連線`)}\n  icon_small: "./assets/icon.svg"\n  icon_large: "./assets/icon.svg"\n  brand_color: "${service.accent}"\n  default_prompt: ${JSON.stringify(`使用 $${skillName(service.id)} 協助我連接 ${service.name}，先確認方案，需要授權時讓我確認。`)}\n`);
    outputs.set(skill + "assets/icon.svg", image);
    outputs.set(skill + "assets/NOTICE.md", `# Icon Source\n\nService: ${service.name}\nPublisher of this guide: NMKING\n\n${icon.kind === "monogram" ? icon.source : `Glyph source: ${icon.source}\n\nSimple Icons contributors, CC0-1.0. License: https://github.com/simple-icons/simple-icons/blob/${icons.revision}/LICENSE.md\n\nOriginal brand source: ${icon.upstream_brand_source}`}\n\nThe image identifies the service; it does not imply that the service provider published or endorsed this NMKING guide. Trademark rights remain with their respective owners.\n`);
    for (const ext of ["md", "json"]) outputs.set(skill + `references/service.${ext}`, documents[ext]);
    outputs.set(skill + "references/source.json", format({
      schema_version: 1, service_id: service.id, plugin_version: service.version,
      guide_revision: spec.revision, source_url: `https://ai.nmking.io/connect/services/${service.id}.json`,
      files: { "service.md": sha256(documents.md), "service.json": sha256(documents.json), "../assets/icon.svg": sha256(image) },
    }));
    outputs.set(folder + "README.md", `# ${service.name}\n\nNMKING 發行的獨立連線指南外掛。可個別安裝、停用及更新，不安裝其他服務。\n\n此外掛僅提供 Skill 和文件，不包含 MCP 伺服器設定，也不會自動登入。${provider === "composio" ? "此 Google 服務透過 Composio 第三方 MCP，不是 Google 官方 MCP。" : "非服務供應商官方外掛。"}\n\n安裝命令：\n\n\`\`\`sh\ncodex plugin add ${pluginName(service.id)}@nmking-plugins\n\`\`\`\n\n- [AI 操作入口](skills/${skillName(service.id)}/SKILL.md)\n- [完整服務規格](skills/${skillName(service.id)}/references/service.md)\n- [圖示來源](skills/${skillName(service.id)}/assets/NOTICE.md)\n\n原有測試日期與限制保留；此套件發布或安裝不是新的服務實測。\n`);
  }
  outputs.set(".agents/plugins/marketplace.json", format({
    name: "nmking-plugins", interface: { displayName: "NMKING 外掛市集" },
    plugins: catalog.services.map((service) => ({
      name: pluginName(service.id), source: { source: "local", path: `./${pluginPath(service.id).replace(/\/$/, "")}` },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity",
    })),
  }));
  return { catalog, outputs };
}

export async function buildServicePlugins({ check = false, bootstrapLegacy = false } = {}) {
  assert.ok(!(check && bootstrapLegacy), "Check mode must not bootstrap files");
  const { catalog, outputs } = await serviceOutputs({ bootstrapLegacy });
  for (const [path, content] of outputs) {
    const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
    assertPublicDocument(bytes.toString("utf8"));
    const url = new URL(path, root);
    if (check) {
      assert.equal((await lstat(url)).isFile(), true, path);
      assert.deepEqual(await readFile(url), bytes, path + " needs regeneration");
    } else {
      await mkdir(new URL(".", url), { recursive: true });
      await writeFile(url, bytes);
    }
  }
  if (check) {
    for (const service of catalog.services) {
      const skills = await readdir(new URL(pluginPath(service.id) + "skills/", root));
      assert.deepEqual(skills, [skillName(service.id)]);
      for (const name of ["mcp.json", ".mcp.json", ".app.json", "hooks", "scripts", ".env"]) {
        await assert.rejects(access(new URL(pluginPath(service.id) + name, root)));
      }
    }
  }
  return { marketplace_version: catalog.marketplace_version, plugins: catalog.services.length, unique_icons: catalog.services.length, generated_files: outputs.size, mcp_servers: 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  assert.ok(args.every((arg) => ["--check", "--bootstrap-legacy"].includes(arg)));
  console.log(JSON.stringify(await buildServicePlugins({ check: args.includes("--check"), bootstrapLegacy: args.includes("--bootstrap-legacy") })));
}
