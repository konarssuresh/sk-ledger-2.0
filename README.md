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
