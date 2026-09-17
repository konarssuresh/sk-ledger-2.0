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
3. Copy the full client ID into both `OAUTH_CLIENT` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`.
4. `NEXT_PUBLIC_*` values are embedded when the client bundle is built. After changing them, restart `next dev` or run `npm run build` before `npm run start`.

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
