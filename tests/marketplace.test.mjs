import assert from "node:assert/strict";
import { access, lstat, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { assertPublicDocument, checkPackage, references, root, serviceIds } from "../scripts/sync-connect.mjs";

const read = (path) => readFile(new URL(path, root), "utf8");
const json = async (path) => JSON.parse(await read(path));
const directory = "plugins/nmking-connect/";
const skillRoot = directory + "skills/nmking-service-connect/";
const marketplace = await json(".agents/plugins/marketplace.json");
const portable = await json(directory + "plugin.json");
const compatibility = await json(directory + ".codex-plugin/plugin.json");
const skill = await read(skillRoot + "SKILL.md");

test("one discoverable marketplace entry resolves inside the repository", async () => {
  assert.equal(marketplace.name, "nmking-plugins");
  assert.equal(marketplace.interface.displayName, "NMKING 外掛市集");
  assert.equal(marketplace.plugins.length, 1);
  const entry = marketplace.plugins[0];
  assert.equal(entry.name, "nmking-connect");
  assert.deepEqual(entry.source, { source: "local", path: "./plugins/nmking-connect" });
  assert.equal(entry.policy.installation, "AVAILABLE");
  assert.equal(entry.policy.authentication, "ON_INSTALL");
  assert.equal(entry.category, "Productivity");
  await access(new URL(entry.source.path + "/plugin.json", root));
});

test("portable and compatibility manifests agree on identity and presentation", () => {
  assert.equal(portable.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.match(portable.version, /^\d+\.\d+\.\d+$/);
  for (const key of ["name", "version", "description", "author", "homepage", "repository"]) {
    assert.deepEqual(portable[key], compatibility[key], key);
  }
  assert.deepEqual(portable.extensions["com.openai"].interface, compatibility.interface);
  assert.equal(portable.extensions["com.openai"].onboardingSkill, compatibility.onboardingSkill);
  assert.equal(compatibility.skills, "./skills/");
});

test("listing and composer icons are bundled square assets in both themes", async () => {
  const ui = portable.extensions["com.openai"].interface;
  for (const key of ["logo", "logoDark", "composerIcon", "composerIconDark"]) {
    assert.equal(ui[key], "./skills/nmking-service-connect/assets/icon.svg", key);
    const url = new URL(ui[key], new URL(directory, root));
    assert.equal((await lstat(url)).isFile(), true);
    const bytes = await readFile(url);
    assert.ok(bytes.length < 5 * 1024 * 1024);
    const svg = bytes.toString("utf8");
    assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 64 64">/);
    assert.doesNotMatch(svg, /<script|<foreignObject|href=|url\(/i);
  }
  for (const key of ["brandColor", "brandColorDark"]) assert.match(ui[key], /^#[0-9A-F]{6}$/);
});

test("Skill interface points to the same bundled icon without adding tool dependencies", async () => {
  const agent = await read(skillRoot + "agents/openai.yaml");
  assert.match(agent, /display_name: "NMKING Connect"/);
  for (const key of ["icon_small", "icon_large"]) {
    assert.ok(agent.includes(`${key}: "./assets/icon.svg"`));
  }
  assert.match(agent, /\$nmking-service-connect/);
  assert.doesNotMatch(agent, /dependencies:|tools:|mcp:/);
  await access(new URL(skillRoot + "assets/icon.svg", root));
});

test("Skill routes to bundled references without loading all services", async () => {
  const frontmatter = skill.match(/^---\nname: ([a-z0-9-]+)\ndescription: (.+)\n---\n/);
  assert.ok(frontmatter);
  assert.equal(frontmatter[1], "nmking-service-connect");
  assert.ok(JSON.parse(frontmatter[2]).includes("user-selected service"));
  assert.match(skill, /只讀 `references\/services\/\{id\}.md`/);
  assert.match(skill, /不必同時讀取或載入全部 13 項/);
  await access(new URL("index.md", references));
  const names = await readdir(new URL("skills/", new URL(directory, root)));
  assert.deepEqual(names, ["nmking-service-connect"]);
});

test("installation ships no automatically enabled MCP, hooks or credential configuration", async () => {
  for (const name of ["mcp.json", ".mcp.json", ".app.json", "hooks", "scripts", ".env", ".codex"]) {
    await assert.rejects(access(new URL(directory + name, root)));
  }
  assert.equal(portable.extensions["com.openai"].hooks, undefined);
  assert.equal(compatibility.mcpServers, undefined);
  assert.match(skill, /取得使用者對選定服務設定的同意後/);
  assert.match(skill, /新增或擴大存取權限時/);
  assert.match(skill, /只算 bootstrap/);
});

test("all thirteen Markdown/JSON pairs retain their source digest and exact contract", async () => {
  const result = await checkPackage();
  assert.equal(result.services, 13);
  assert.equal(result.documents, 26);
  const index = await read(skillRoot + "references/index.md");
  for (const id of serviceIds) assert.ok(index.includes(`services/${id}.md`));
});

test("MCP/CLI alternatives and separate Google identities remain intact", async () => {
  for (const id of ["github", "notion", "vercel", "netlify", "cloudflare"]) {
    const spec = await json(skillRoot + `references/services/${id}.json`);
    assert.equal(spec.service.choice.ask_before_setup, true);
    assert.ok(spec.service.cli_alternative);
  }
  for (const id of ["google-classroom", "google-drive", "google-calendar", "gmail"]) {
    const spec = await json(skillRoot + `references/services/${id}.json`);
    assert.equal(spec.service.provider, "composio");
    assert.equal(spec.composio_protocol.publisher, "third_party_not_google");
    assert.equal(spec.composio_protocol.account_routing.GOOGLE_CLASSROOM_, "CLASSROOM_ACCOUNT_ID");
    assert.equal(spec.composio_protocol.account_routing.GOOGLEDRIVE_, "DRIVE_ACCOUNT_ID");
  }
});

test("packaging does not upgrade historical test results or clear blockers", async () => {
  const classroom = (await json(skillRoot + "references/services/google-classroom.json")).service;
  assert.equal(classroom.test_result.overall, "partial");
  assert.equal(classroom.test_result.teaching_checks.student_visible_95_of_100, "passed");
  assert.equal(classroom.test_result.teaching_checks.student_enrollment_via_mcp, "not_tested");
  assert.match(classroom.test_result.additional_resources.find((s) => s.resource_type === "course").error, /403/);
  for (const id of ["gmail", "google-calendar"]) {
    const s = (await json(skillRoot + `references/services/${id}.json`)).service;
    assert.equal(s.test_result.overall, "not_tested");
    assert.equal(s.test_result.tested_on, undefined);
  }
  const drive = (await json(skillRoot + "references/services/google-drive.json")).service;
  assert.equal(drive.test_result.resource_type, "synthetic_text_file_soft_delete");
});

test("public-document guard rejects credential and private-workspace leakage", () => {
  for (const text of [
    "-----BEGIN OPENSSH PRIVATE KEY-----",
    "ghp_" + "x".repeat(35),
    "https://example.invalid/callback?code=fixture",
    "https://example.invalid/file?X-Amz-Signature=fixture",
    "/Users/example/private",
  ]) assert.throws(() => assertPublicDocument(text));
  assert.doesNotThrow(() => assertPublicDocument("https://mcp.example.invalid/mcp; GITHUB_PAT_TOKEN"));
});

test("README provides Git marketplace setup and does not claim universal directory listing", async () => {
  const readme = await read("README.md");
  assert.match(readme, /codex plugin marketplace add youjunjer\/nmking-plugins --ref main/);
  assert.match(readme, /codex plugin add nmking-connect@nmking-plugins/);
  assert.match(readme, /不是 OpenAI 內建公開目錄/);
  assert.match(readme, /稀疏路徑 \| 留空/);
});
