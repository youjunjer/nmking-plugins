import assert from "node:assert/strict";
import test from "node:test";
import { mcpConfigurations, onboardingMarkdown, readConnections, validateConnection } from "../scripts/mcp-connections.mjs";
import { pluginName, readCatalog } from "../scripts/build-service-plugins.mjs";

const catalog = await readCatalog();
const connections = await readConnections();

test("each independently installed plugin declares exactly one distinct MCP server", () => {
  assert.deepEqual(Object.keys(connections.services).sort(), catalog.services.map((s) => s.id).sort());
  const names = new Set();
  for (const service of catalog.services) {
    const profile = connections.services[service.id];
    assert.equal(profile.server, pluginName(service.id));
    names.add(profile.server);
    const result = mcpConfigurations(profile);
    assert.deepEqual(Object.keys(result.portable), ["$schema", "mcpServers"]);
    assert.deepEqual(Object.keys(result.portable.mcpServers), [profile.server]);
    assert.deepEqual(Object.keys(result.compatibility.mcpServers), [profile.server]);
    const modern = result.portable.mcpServers[profile.server];
    const legacy = result.compatibility.mcpServers[profile.server];
    if (profile.transport === "streamable-http") {
      assert.deepEqual(modern, { type: "streamable-http", url: profile.url });
      assert.deepEqual(legacy, { type: "http", url: profile.url });
    } else {
      assert.deepEqual(modern, { type: "stdio", command: "uvx", args: profile.args });
      assert.deepEqual(legacy, { command: "uvx", args: profile.args });
    }
  }
  assert.equal(names.size, catalog.services.length);
});

test("remote logins rely on provider OAuth discovery, not distributed credentials", () => {
  const remotes = Object.values(connections.services).filter((c) => c.transport === "streamable-http");
  assert.equal(remotes.length, 12);
  for (const profile of remotes) {
    assert.ok(["oauth", "oauth_and_toolkit"].includes(profile.authentication));
    for (const key of ["headers", "env", "clientId", "clientSecret"]) assert.equal(profile[key], undefined);
  }
});

test("Composio aliases are independent while consent is scoped to the selected toolkit", () => {
  const expected = { github: "github", "google-classroom": "google_classroom", "google-drive": "googledrive", "google-calendar": "googlecalendar", gmail: "gmail" };
  for (const [id, toolkit] of Object.entries(expected)) {
    const profile = connections.services[id];
    assert.equal(profile.provider, "composio");
    assert.equal(profile.toolkit, toolkit);
    assert.equal(profile.url, "https://connect.composio.dev/mcp");
    const skill = onboardingMarkdown(catalog.services.find((s) => s.id === id), profile);
    assert.ok(skill.includes(`toolkit \`${toolkit}\``));
    assert.match(skill, /兩|不是|不等於/);
    assert.match(skill, /不要替其他 toolkit 開授權/);
    assert.match(skill, /ACTIVE/);
    assert.match(skill, /ACCOUNT_ID/);
    assert.match(skill, /不重複執行 codex mcp add/);
  }
});

test("Colab is a pinned genuine local server, not mislabeled remote OAuth", () => {
  const profile = connections.services.colab;
  assert.equal(profile.authentication, "colab_browser_session");
  assert.equal(profile.transport, "stdio");
  assert.ok(profile.requirements.includes("Git"));
  assert.match(profile.args[3], /@[a-f0-9]{40}$/);
  const skill = onboardingMarkdown(catalog.services.find((s) => s.id === "colab"), profile);
  assert.match(skill, /open_colab_browser_connection/);
  assert.match(skill, /notifications\/tools\/list_changed/);
  assert.match(skill, /首次下載/);
  assert.match(skill, /不是雲端遠端 API OAuth/);
});

test("connection validation rejects unsafe or credential-bearing package defaults", () => {
  const original = connections.services.canva;
  for (const url of ["http://example.invalid/mcp", "https://name:fixture@example.invalid/mcp", "https://example.invalid/mcp?access_token=fixture", "https://example.invalid/mcp#fragment"]) {
    assert.throws(() => validateConnection({ ...original, url }));
  }
  for (const property of ["headers", "env", "clientId", "clientSecret", "access_token", "credentials"]) {
    assert.throws(() => validateConnection({ ...original, [property]: "fixture" }));
  }
  const local = connections.services.colab;
  assert.throws(() => validateConnection({ ...local, command: "sh" }));
  assert.throws(() => validateConnection({ ...local, args: [...local.args, "--with", "unreviewed"] }));
  assert.throws(() => validateConnection({ ...local, args: local.args.map((a) => a.startsWith("git+") ? "git+https://example.invalid/source" : a) }));
});
