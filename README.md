# SK Ledger 2.0

JavaScript Next.js App Router replacement for the legacy Vite frontend and Express backend. Behaviour parity, MongoDB retention, and Netlify hosting are defined in `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `docs/DEVELOPMENT_PLAN.md`.

Migration checklists live in [`docs/MIGRATION_INVENTORY.md`](docs/MIGRATION_INVENTORY.md).

## Prerequisites

- Node.js (LTS recommended)
- Copy `.env.example` to `.env.local` and fill in values for local server work (Phase 1+). Never commit secrets.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `next dev` for UI iteration.

### Google Sign-In

1. Create a **Web application** OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Set **Authorized JavaScript origins** to `http://localhost:3000` (and your production URL when deployed). No redirect callback route is required for this app’s ID-token button flow.
3. Copy the full client ID into `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local` (same value). `OAUTH_CLIENT` still works locally as a legacy alias for server verification.
4. `NEXT_PUBLIC_*` values are embedded when the client bundle is built. After changing them, restart `next dev` or run `npm run build` before `npm run start`.

## Netlify deployment

Set these in the Netlify site **Environment variables** UI (production and preview as needed):

| Variable | Notes |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Session signing secret |
| `INTERNAL_KEY` | Protects `POST /api/categories/create-default` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public Web client ID (browser + server Google verification via `lib/google-auth.js` fallback) |

**Remove from Netlify if present** (they break secrets scanning or are legacy Express-only):

| Variable | Why |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Same value as `NEXT_PUBLIC_*` is inlined in client JS — scanner flags it as a leaked secret |
| `OAUTH_CLIENT` | Same false positive as above |
| `PORT` | Legacy Express (`skledger-server`); not used by Next on Netlify |

**Scopes (important):** In Netlify, set `MONGO_URI`, `JWT_SECRET`, and `INTERNAL_KEY` for **Functions** (and/or **Runtime**) only — **not** for **Build**, unless required. When those secrets are present during `npm run build`, the Next/Netlify adapter can embed them in server build artifacts; [`netlify.toml`](netlify.toml) excludes those paths from scanning, but runtime-only scoping avoids baking secrets into build output at all.

Locally you may still set optional `GOOGLE_CLIENT_ID` or `OAUTH_CLIENT` in `.env.local` (same Web client ID). Do not duplicate those names on Netlify when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set.

[`netlify.toml`](netlify.toml) sets `SECRETS_SCAN_OMIT_PATHS` for server build output and `SECRETS_SCAN_OMIT_KEYS` for `PORT` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (the Google Web client ID is public and is inlined into client bundles by design).

After deploy, smoke-test login, Google sign-in, protected routes, and logout. See Phase 8 in `docs/DEVELOPMENT_PLAN.md`.

## Netlify-compatible local run

Requires [Netlify CLI](https://docs.netlify.com/cli/get-started/) (included as a dev dependency):

```bash
npm run netlify:dev
```

API routes will be served through Netlify's Next.js integration when deployed; do not add a separate `netlify/functions` tree for `/api`.

## Quality checks

```bash
npm run lint
npm run build
npm test
```

## Agent contract

See [`AGENTS.md`](AGENTS.md) before making changes.
