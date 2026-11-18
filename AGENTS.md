# NMKING Plugin Marketplace

This repository distributes independently installable MCP plugins with
NMKING-authored onboarding Skills. It does not contain provider credentials,
platform production code or authorization to act on a user's account.

- Marketplace: `.agents/plugins/marketplace.json`.
- Each service is an independently installable `plugins/nmking-<service>/`
  package, registered separately in `catalog/services.json`. New services must
  follow this pattern; never add them only to the old all-in-one guide.
- Each package owns its version, MCP declaration, onboarding Skill, icon and
  Markdown/JSON references. `catalog/connections.json` controls current bundled
  transports/authentication, separately from preserved historical guide results.
  Portable and Codex compatibility manifests must agree. Rebuild derived files
  with `npm run build:services`; keep updates scoped to the selected service.
- Follow `docs/ADDING_A_SERVICE.md`. No shared external file may be required
  after installing a single package.
- `plugins/nmking-connect/` is a frozen legacy package retained for existing
  version references; do not add it back as a fourteenth main-catalog entry.
- `sync:connect` is the older aggregate importer, not a publisher for independent
  packages. Review and copy selected public service documents into the selected
  package before rebuilding; preserve their historical results and dates.
- Validate with `npm test` and `npm run check`; Node checks need no npm
  dependencies. Colab's separate runtime prerequisites still apply.
- Do not reset historical test dates, promote untested operations, include local
  paths/account IDs/secrets, silently replace a user's global MCP configuration,
  add hooks or grant account consent. The user explicitly authorized bundled
  MCP declarations on 2026-11-18; actual browser consent remains per user/service.
- Prefer the bundled namespaced MCP. Do not add duplicate global servers during
  onboarding. Clearly distinguish Composio OAuth from toolkit consent, and
  Colab local browser linking from remote OAuth. Never borrow another app's
  client credentials or user tokens to bypass provider registration requirements.
- Publishing changes to GitHub and running real provider operations are separate
  actions. Follow the current user request; a documentation edit is not OAuth,
  billing, production-deployment or resource-mutation authorization.
