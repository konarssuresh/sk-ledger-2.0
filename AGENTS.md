<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SK Ledger 2.0 — Agent Contract

## Source of truth

- `docs/PRD.md` defines the product and behaviour to reproduce.
- `docs/ARCHITECTURE.md` defines the approved JavaScript, MongoDB, Next.js, and Netlify architecture.
- `docs/DEVELOPMENT_PLAN.md` defines the implementation order.
- The legacy folders are the reference implementation. Preserve their API paths, HTTP methods, successful response shapes, and existing frontend behaviour unless a task explicitly fixes a defect.

## Locked choices

- Build one JavaScript Next.js App Router application and deploy it on Netlify.
- Retain MongoDB and Mongoose. Connect to the existing MongoDB deployment; do not create a replacement database.
- Recreate the existing API under `/api/**` with Next.js Route Handlers. Do not run Express, call `app.listen`, or deploy a separate backend.
- Retain the JWT in the HTTP-only `token` cookie, email/password authentication, and Google credential login.
- Google credential login creates a new account on first verified use, links to a matching email/password account, and prevents one Google subject from belonging to two users.
- Retain Jest and migrate the current backend tests as endpoint contracts are moved.

## Working rules

1. Write new application files in JavaScript. Do not introduce TypeScript.
2. Before editing a feature, identify its legacy frontend, server controller, routes, models, and tests. State planned defect fixes separately from parity work.
3. A Route Handler must validate input, resolve the authenticated user when required, enforce ownership in its database query, and preserve the documented endpoint contract.
4. Use one cached Mongoose connection helper. Never connect to MongoDB from a component or create a fresh connection for every request.
5. Keep browser UI and server code separate. Client Components call same-origin `/api` endpoints; server-only code, Mongoose, JWT secrets, and Google verification never enter a client bundle.
6. Do not change persisted MongoDB fields, money/date semantics, category defaults, or cookie semantics unless the task is an explicitly approved defect fix.
7. Do not expose `MONGO_URI`, `JWT_SECRET`, Google credentials, password hashes, or internal category keys. Runtime secrets are configured in the Netlify UI/CLI, not committed.
8. Preserve semantic HTML, keyboard access, visible focus, labelled controls, loading, empty, and error states while porting the legacy UI.
9. Keep work narrowly scoped. Do not combine migration, redesign, dependency replacement, and unrelated cleanup in a single task.
10. Run lint, build, and the relevant Jest tests before declaring a task complete; report anything not run.

## Escalation rule

Ask before choosing a new product behaviour, adding a third-party service, changing the database schema beyond the Google-account support required by the PRD, or designing a screen that has no legacy reference.
