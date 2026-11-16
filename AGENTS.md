# NMKING Plugin Marketplace

This repository distributes NMKING-authored service-connection guidance. It does
not contain provider credentials, production code, a running MCP server, or
authorization to act on a user account.

- Marketplace: `.agents/plugins/marketplace.json`.
- Plugin: `plugins/nmking-connect/`; portable and Codex compatibility manifests
  must keep identity, version and UI metadata consistent.
- Skill: `plugins/nmking-connect/skills/nmking-service-connect/SKILL.md`.
- Generated references: run `node scripts/sync-connect.mjs` against the public
  NMKING Connect feed, or pass `--source /absolute/path/to/public/connect`.
- Validate with `npm test` and `npm run check`; no dependencies are required.
- Do not reset historical test dates, promote untested operations, include local
  paths/account IDs/secrets, or add automatic MCP/hooks/authentication on install.
- Publishing changes to GitHub and running real provider operations are separate
  actions. Follow the current user request; a documentation edit is not OAuth,
  billing, production-deployment or resource-mutation authorization.
