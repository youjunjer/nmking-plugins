# NMKING Plugin Marketplace

This repository distributes NMKING-authored service-connection guidance. It does
not contain provider credentials, production code, a running MCP server, or
authorization to act on a user account.

- Marketplace: `.agents/plugins/marketplace.json`.
- Each service is an independently installable `plugins/nmking-<service>/`
  package, registered separately in `catalog/services.json`. New services must
  follow this pattern; never add them only to the old all-in-one guide.
- Each package owns its version, Skill, icon and Markdown/JSON references.
  Portable and Codex compatibility manifests must agree. Rebuild derived files
  with `npm run build:services`; keep updates scoped to the selected service.
- Follow `docs/ADDING_A_SERVICE.md`. No shared external file may be required
  after installing a single package.
- `plugins/nmking-connect/` is a frozen legacy package retained for existing
  version references; do not add it back as a fourteenth main-catalog entry.
- `sync:connect` is the older aggregate importer, not a publisher for independent
  packages. Review and copy selected public service documents into the selected
  package before rebuilding; preserve their historical results and dates.
- Validate with `npm test` and `npm run check`; no dependencies are required.
- Do not reset historical test dates, promote untested operations, include local
  paths/account IDs/secrets, or add automatic MCP/hooks/authentication on install.
- Publishing changes to GitHub and running real provider operations are separate
  actions. Follow the current user request; a documentation edit is not OAuth,
  billing, production-deployment or resource-mutation authorization.
