import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const serviceIds = [
  "canva", "github", "notion", "padlet", "kahoot", "vercel", "netlify",
  "cloudflare", "colab", "google-classroom", "google-drive", "google-calendar", "gmail",
];
export const root = new URL("../", import.meta.url);
export const references = new URL("plugins/nmking-connect/skills/nmking-service-connect/references/", root);
export const sourceUrl = "https://ai.nmking.io/connect";
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function assertPublicDocument(text) {
  assert.doesNotMatch(text, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
  assert.doesNotMatch(text, /(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_-]{30,}/);
  assert.doesNotMatch(text, /[?&](?:code|access_token|refresh_token|X-Amz-Signature)=/i);
  assert.doesNotMatch(text, /\/Users\/|\/home\/youadmin|youjunjer@gmail\.com/);
  assert.doesNotMatch(text, /891190186263|899278368862|google_classroom_puss-beardy|googledrive_oyer-indict/);
}

function markdownSpec(text) {
  const match = text.match(/```json\n([\s\S]+?)\n```/);
  assert.ok(match, "Selected-service Markdown must contain a JSON contract");
  return JSON.parse(match[1]);
}

export function indexMarkdown(catalog) {
  const rows = catalog.services.map((s) =>
    `| ${s.id} | [${s.name}](services/${s.id}.md) | ${s.provider} | ${s.overall} | ${s.tested_on ?? "not_tested"} |`,
  );
  return `# NMKING Connect: Service Index\n\nPlugin: ${catalog.plugin_version}\nGuide revision: ${catalog.guide_revision}\nPackaged on: ${catalog.packaged_on} (Asia/Taipei)\nSource: ${catalog.source_url}\n\nRead only the selected service Markdown, or its matching JSON. These are historical, resource-scoped test results, not current login status or full-service guarantees. Composio is a third-party provider, not Google official MCP.\n\n| ID | Service specification | Provider | Historical overall | Tested on |\n| --- | --- | --- | --- | --- |\n${rows.join("\n")}\n\n## Aliases\n\n- Google Drive / 雲端硬碟: google-drive\n- Google Calendar / 日曆 / 行事曆: google-calendar\n- Google Classroom / 課堂: google-classroom\n- Kahoot / Kahoot!: kahoot\n- Google Colab / Colab: colab\n\n## Interpretation\n\n- passed: only the exact resource and operations described by test_result.\n- partial: some operations passed; read the remaining blockers.\n- blocked: a specific authorization or capability requirement failed.\n- deferred: testing was explicitly deferred; do not resume automatically.\n- not_tested: documentation or tool availability is not operation success.\n\nClassroom teaching checks and Drive text-file checks have separate evidence; course creation still has a recorded 403 scope blocker. Gmail and Calendar remain untested in the Composio scenario. Native Chat integrations and personal Codex MCP connections are separate scopes.\n`;
}

export async function checkPackage() {
  const catalog = JSON.parse(await readFile(new URL("catalog.json", references), "utf8"));
  const plugin = JSON.parse(await readFile(new URL("plugins/nmking-connect/plugin.json", root), "utf8"));
  assert.equal(catalog.plugin_version, plugin.version);
  assert.equal(catalog.service_count, serviceIds.length);
  assert.equal(catalog.source_url, sourceUrl);
  assert.deepEqual(catalog.services.map((s) => s.id), serviceIds);
  assert.equal(Object.keys(catalog.files).length, serviceIds.length * 2);
  const names = await readdir(new URL("services/", references));
  assert.deepEqual(names.sort(), serviceIds.flatMap((id) => [id + ".md", id + ".json"]).sort());
  for (const id of serviceIds) {
    const texts = {};
    for (const ext of ["md", "json"]) {
      const path = `services/${id}.${ext}`;
      const file = new URL(path, references);
      assert.equal((await lstat(file)).isSymbolicLink(), false);
      const bytes = await readFile(file);
      assert.equal(sha256(bytes), catalog.files[path].sha256, path + " digest mismatch");
      const text = bytes.toString("utf8");
      assertPublicDocument(text);
      texts[ext] = text;
    }
    const parsed = JSON.parse(texts.json);
    assert.equal(parsed.service.id, id);
    assert.equal(parsed.revision, catalog.guide_revision);
    assert.deepEqual(markdownSpec(texts.md), parsed);
    const summary = catalog.services.find((s) => s.id === id);
    assert.equal(summary.overall, parsed.service.test_result.overall);
    assert.equal(summary.tested_on, parsed.service.test_result.tested_on ?? null);
  }
  assert.equal(await readFile(new URL("index.md", references), "utf8"), indexMarkdown(catalog));
  return { plugin: plugin.name, version: plugin.version, guideRevision: catalog.guide_revision, services: serviceIds.length, documents: serviceIds.length * 2 };
}

export async function sync({ source, date } = {}) {
  async function readSource(path) {
    if (source) return readFile(resolve(source, path));
    const response = await fetch(`${sourceUrl}/${path}`, { redirect: "error", signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, "Public guide HTTP status: " + path);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length < 2 * 1024 * 1024, "Public document too large");
    return bytes;
  }
  const manifestBytes = await readSource("manifest.json");
  assertPublicDocument(manifestBytes.toString("utf8"));
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.schema_version, 2);
  assert.equal(manifest.canonical_url, sourceUrl);
  assert.deepEqual(manifest.services.map((s) => s.id), serviceIds, "Review a changed service set before packaging");
  const plugin = JSON.parse(await readFile(new URL("plugins/nmking-connect/plugin.json", root), "utf8"));
  const packagedOn = date ?? new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  assert.match(packagedOn, /^\d{4}-\d{2}-\d{2}$/);
  const catalog = {
    schema_version: 1,
    plugin_version: plugin.version,
    service_count: serviceIds.length,
    guide_revision: manifest.revision,
    packaged_on: packagedOn,
    source_url: sourceUrl,
    source_manifest_sha256: sha256(manifestBytes),
    source_content_sha256: manifest.content_sha256,
    files: {},
    services: [],
  };
  const outputs = new Map();
  for (const service of manifest.services) {
    for (const ext of ["md", "json"]) {
      const path = `services/${service.id}.${ext}`;
      const bytes = await readSource(path);
      const expected = manifest.generated_files[path];
      assert.ok(expected, "Missing source digest: " + path);
      assert.equal(sha256(bytes), expected.sha256, "Source digest mismatch: " + path);
      assertPublicDocument(bytes.toString("utf8"));
      catalog.files[path] = { sha256: expected.sha256, type: expected.type };
      outputs.set(path, bytes);
    }
    const spec = JSON.parse(outputs.get(`services/${service.id}.json`));
    assert.deepEqual(spec.service, service, "Source manifest/service mismatch");
    assert.deepEqual(markdownSpec(outputs.get(`services/${service.id}.md`).toString("utf8")), spec);
    catalog.services.push({
      id: service.id, name: service.name, provider: service.provider ?? "official",
      overall: service.test_result.overall, resource_type: service.test_result.resource_type,
      tested_on: service.test_result.tested_on ?? null,
    });
  }
  // Validate the complete source set before replacing any packaged document.
  await mkdir(new URL("services/", references), { recursive: true });
  for (const [path, bytes] of outputs) await writeFile(new URL(path, references), bytes);
  await writeFile(new URL("catalog.json", references), JSON.stringify(catalog, null, 2) + "\n");
  await writeFile(new URL("index.md", references), indexMarkdown(catalog));
  return checkPackage();
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--check") options.check = true;
    else if (["--source", "--date"].includes(args[i])) {
      assert.ok(args[i + 1], "Missing argument value");
      options[args[i].slice(2)] = args[++i];
    } else throw new Error("Unknown argument: " + args[i]);
  }
  if (options.check) assert.equal(options.source, undefined, "--check is offline; do not pass --source");
  const result = options.check ? await checkPackage() : await sync(options);
  console.log(JSON.stringify({ mode: options.check ? "offline_check" : "sync", ...result }));
}
