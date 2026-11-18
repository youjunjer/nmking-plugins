import assert from "node:assert/strict";
import { lstat, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { buildServicePlugins, pluginName, pluginPath, readCatalog, serviceOutputs, skillName, skillPath } from "../scripts/build-service-plugins.mjs";
import { assertPublicDocument, root, sha256 } from "../scripts/sync-connect.mjs";

const read = (path) => readFile(new URL(path, root), "utf8");
const json = async (path) => JSON.parse(await read(path));
const catalog = await readCatalog();

test("independent generated packages are current in offline check mode", async () => {
  const result = await buildServicePlugins({ check: true });
  assert.equal(result.plugins, catalog.services.length);
  assert.equal(result.mcp_servers, 0);
});

for (const service of catalog.services) {
  test(`${service.name}: self-contained metadata, icon, Skill and exact service documents`, async () => {
    const folder = pluginPath(service.id);
    const skill = skillPath(service.id);
    const portable = await json(folder + "plugin.json");
    const compatibility = await json(folder + ".codex-plugin/plugin.json");
    const extension = portable.extensions["com.openai"];
    assert.equal(portable.name, pluginName(service.id));
    assert.equal(portable.version, service.version);
    for (const key of ["name", "version", "description", "author", "homepage", "repository", "keywords"]) {
      assert.deepEqual(portable[key], compatibility[key]);
    }
    assert.deepEqual(extension.interface, compatibility.interface);
    assert.equal(extension.onboardingSkill, compatibility.onboardingSkill);
    assert.equal(compatibility.skills, "./skills/");
    assert.deepEqual(await readdir(new URL(folder + "skills/", root)), [skillName(service.id)]);
    assert.equal(extension.interface.displayName, service.name);
    assert.match(extension.interface.shortDescription, /連線指南/);
    assert.match(extension.interface.longDescription, /不內建或預先啟用 MCP/);
    assert.match(portable.description, /Skills only/);
    for (const path of [extension.onboardingSkill, ...["logo", "logoDark", "composerIcon", "composerIconDark"].map((key) => extension.interface[key])]) {
      assert.ok(path.startsWith("./"));
      const url = new URL(path, new URL(folder, root));
      assert.ok(url.href.startsWith(new URL(folder, root).href));
      assert.equal((await lstat(url)).isFile(), true);
    }
    const svg = await read(skill + "assets/icon.svg");
    assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 64 64">/);
    assert.doesNotMatch(svg, /<script|<foreignObject|href=|url\(/i);
    const notice = await read(skill + "assets/NOTICE.md");
    assert.ok(notice.includes(service.name));
    const guide = await read(skill + "SKILL.md");
    assert.ok(guide.includes(`name: ${skillName(service.id)}`));
    assert.match(guide, /references\/service.md/);
    assert.doesNotMatch(guide, /\.\.\/|references\/services\/|nmking-service-connect/);
    const agent = await read(skill + "agents/openai.yaml");
    assert.ok(agent.includes(`display_name: ${JSON.stringify(service.name)}`));
    assert.match(agent, /icon_small: "\.\/assets\/icon.svg"/);
    assert.match(agent, /icon_large: "\.\/assets\/icon.svg"/);
    assert.ok(agent.includes(`$${skillName(service.id)}`));
    assert.doesNotMatch(agent, /dependencies:|tools:|mcp:/);
    const source = await json(skill + "references/source.json");
    assert.equal(source.service_id, service.id);
    assert.equal(source.plugin_version, service.version);
    const documents = {};
    for (const ext of ["md", "json"]) {
      const path = `service.${ext}`;
      const bytes = await readFile(new URL(skill + "references/" + path, root));
      assert.equal(sha256(bytes), source.files[path]);
      assertPublicDocument(bytes.toString("utf8"));
      documents[ext] = bytes.toString("utf8");
    }
    assert.equal(sha256(svg), source.files["../assets/icon.svg"]);
    const spec = JSON.parse(documents.json);
    assert.equal(spec.service.id, service.id);
    assert.deepEqual(JSON.parse(documents.md.match(/```json\n([\s\S]+?)\n```/)[1]), spec);
    if (spec.service.provider === "composio") {
      assert.match(guide, /Composio 第三方 MCP，不是 Google 官方 MCP/);
      assert.match(extension.interface.longDescription, /Composio 第三方 MCP/);
    }
    const contents = await readdir(new URL(folder, root));
    for (const forbidden of ["mcp.json", ".mcp.json", ".app.json", "hooks", "scripts", ".env"]) {
      assert.equal(contents.includes(forbidden), false);
    }
  });
}

test("all service identities and icons are distinct and locally bundled", async () => {
  const hashes = new Set();
  for (const service of catalog.services) hashes.add(sha256(await read(skillPath(service.id) + "assets/icon.svg")));
  assert.equal(hashes.size, catalog.services.length);
  assert.equal(new Set(catalog.services.map((s) => pluginName(s.id))).size, catalog.services.length);
});

test("raising one service version changes only that service's generated package", async () => {
  const current = await serviceOutputs();
  const modified = structuredClone(catalog);
  const version = modified.services[0].version.split(".").map(Number);
  version[2]++;
  modified.services[0].version = version.join(".");
  const updated = await serviceOutputs({ catalog: modified });
  const changed = [...current.outputs.keys()].filter((path) => {
    return !Buffer.from(current.outputs.get(path)).equals(Buffer.from(updated.outputs.get(path)));
  });
  assert.equal(changed.length, 3);
  assert.ok(changed.every((path) => path.startsWith(pluginPath(modified.services[0].id))));
});

test("maintenance policy requires new services to be independently installable", async () => {
  assert.match(await read("AGENTS.md"), /New services must/);
  assert.match(await read("docs/ADDING_A_SERVICE.md"), /每一項新服務都必須可以單獨安裝/);
  const readme = await read("README.md");
  assert.match(readme, /仍是 Skill 指南外掛/);
  assert.match(readme, /不是 Google 官方 MCP/);
  for (const service of catalog.services) {
    assert.ok(readme.includes(pluginPath(service.id) + "README.md"));
  }
});
