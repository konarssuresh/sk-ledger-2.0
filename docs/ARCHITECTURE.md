# SK Ledger 2.0 — Architecture

## 1. Purpose

This document defines implementation of the approved parity migration. `docs/PRD.md` is the product source of truth and `docs/DEVELOPMENT_PLAN.md` defines implementation order.

## 2. Locked Technology Choices

| Area | Choice | Rule |
| --- | --- | --- |
| Framework | Next.js App Router with JavaScript | Reuse the existing `app/` scaffold. Use Client Components only for browser interaction. |
| Hosting | Netlify | Deploy the Next.js app directly. Netlify provisions SSR and Route Handlers through its Next.js adapter. |
| Database | Existing MongoDB + Mongoose | Preserve existing data and models; use one cached connection helper. |
| API | Next.js Route Handlers | Recreate Express API paths/contracts. No Express server, router, CORS layer, or `app.listen`. |
| Authentication | Custom JWT in HTTP-only `token` cookie | Preserve the existing session contract; do not introduce an auth framework. |
| Passwords | bcrypt | Retain secure hashing/comparison. Password hashes are server-only. |
| Google sign-in | `google-auth-library` + credential-post endpoint | Verify credentials server-side; support account creation and email-based linking. |
| Validation | Migrated legacy validators | Preserve validation behaviour first; record every defect fix and its tests. |
| Testing | Jest + current test suite | Port backend contract/controller tests with each API area. |
| Client state | Redux Toolkit | Store shared client-only UI and preference state. Do not use Redux as an API cache. |
| Server state | TanStack React Query | Own API reads, mutation lifecycle, cache invalidation, loading, and error state. |
| Styling | Tailwind CSS v4 and legacy visual rules | Recreate existing UI first; defer new design system work. |

## 3. High-Level Request Flow

```text
Browser
  ├── Next.js pages, layouts, Client Components and legacy-equivalent UI
  └── same-origin fetch('/api/...', { credentials: 'include' })
                         |
                         v
Next.js on Netlify
  ├── App Router pages and protected layouts
  ├── app/api/**/route.js endpoint adapters
  ├── server controllers, validators, models and auth helpers
  └── cached Mongoose connection
                         |
                         v
Existing MongoDB deployment
  ├── users
  ├── categories
  └── transactions
```

Same-origin deployment removes the legacy cross-origin browser call and CORS requirement. It does not remove authorization: every protected handler resolves the JWT cookie and scopes database queries to the current user.

## 4. State Ownership

| State | Owner |
| --- | --- |
| Users, categories, transactions, analytics, and profile records | MongoDB via Next.js APIs |
| API queries, mutations, cache, invalidation, loading, and API errors | TanStack React Query |
| Shared browser-only UI state such as open dialogs, calendar/transaction selection, action-sheet visibility, and transient filters | Redux Toolkit |
| Theme/currency preferences while editing or rendering locally | Redux Toolkit; the authenticated persisted value is refetched through TanStack Query |
| Individual form inputs and validation feedback | Local component/form state |
| JWT session | HTTP-only `token` cookie |

Redux Toolkit must not duplicate TanStack Query data. Do not store fetched transactions, categories, dashboard results, profile records, session tokens, or API responses in Redux. After a successful mutation, invalidate or update the relevant TanStack Query cache rather than manually synchronizing a Redux copy.

## 5. Route-Handler Pattern

Route Handlers cannot use Express routers, `next()`, `cookie-parser`, `req.cookies`, `res.cookie`, or `app.listen`. Preserve controller separation with a thin adapter per endpoint:

```text
Route Handler
  -> parse JSON/query/params into a request-shaped input
  -> resolve authenticated user through requireCurrentUser()
  -> call migrated controller/service
  -> return legacy-compatible JSON, status, and cookie changes
```

Create shared helpers once for:

- cached Mongoose connection;
- JWT sign/verify and `token` cookie set/clear;
- current-user resolution;
- response/error mapping;
- request validation;
- Google credential verification;
- ownership checks for user-owned resources.

The adapter is not authorization. Controllers/services must always query user-owned records with both `_id` and `userId`.

### Route-level loading pattern

Use App Router `loading.js` files for route navigation/loading boundaries. They are distinct from TanStack Query loading states: `loading.js` provides immediate page-shaped feedback while a route's server-rendered content is pending; TanStack Query represents API state inside interactive Client Components after the route is available.

Each protected route receives a focused fallback matching its final layout rather than a generic spinner. Reuse a shared animated page-fallback wrapper and focused skeleton components where the visual structure is shared. Skeleton-only decoration is hidden from assistive technology; expose a concise loading status to screen readers.

## 6. Project Structure

```text
app/
├── (auth)/
│   ├── login/page.js
│   └── signup/page.js
├── (protected)/
│   ├── layout.js
│   ├── dashboard/
│   │   ├── page.js
│   │   └── loading.js
│   ├── transactions/
│   │   ├── page.js
│   │   └── loading.js
│   ├── profile/
│   │   ├── page.js
│   │   └── loading.js
│   └── settings/
│       ├── page.js
│       └── loading.js
├── api/
│   ├── auth/
│   │   ├── signup/route.js
│   │   ├── login/route.js
│   │   ├── login/google/route.js
│   │   ├── signout/route.js
│   │   ├── me/route.js
│   │   ├── changePreferences/route.js
│   │   ├── profile/route.js
│   │   └── change-password/route.js
│   ├── categories/
│   ├── transactions/
│   └── analytics/dashboard/route.js
├── globals.css
└── layout.js
components/
└── shared/                  reusable UI, page fallback and common loading primitives
features/                    feature UI, API client, hooks, tests
store/                       Redux Toolkit store, slices, selectors
lib/
├── auth/                    JWT, cookie, require-current-user helpers
├── db.js                    cached Mongoose connection
├── google-auth.js
├── errors.js
└── validators/
models/                      User, Category, Transaction Mongoose models
server/
├── controllers/             migrated legacy behaviour
└── services/                shared domain operations when needed
docs/
__tests__/                   Jest setup and cross-feature contract tests
```

Do not introduce an Express compatibility layer merely to keep old imports unchanged.

### JavaScript-only boundaries

- Application source uses `.js` only under `app/`, `components/`, `features/`, `lib/`, `models/`, `server/`, and `__tests__/`. Do not add TypeScript (`tsconfig`, `.ts`/`.tsx` app files, or `@types/*` for app code).
- Next.js may emit generated types under `.next/`; do not treat those as application source.

### Folder ownership and imports

| Location | Allowed imports | Must not import |
| --- | --- | --- |
| `app/**/page.js`, `layout.js` (Server Components by default) | `components/`, `features/` server-safe modules | `mongoose`, `jsonwebtoken`, `bcrypt`, raw `process.env` secrets |
| `app/**` with `"use client"` | Same-origin `/api` via `fetch` or feature clients; UI state | `lib/db.js`, `models/`, `server/controllers/`, JWT secrets, Google server verification |
| `app/api/**/route.js` | `lib/*`, `models/`, `server/controllers/`, `server/services/` | React, browser APIs |
| `lib/`, `models/`, `server/` | Node/Mongoose/JWT/Google libraries | React client hooks, `"use client"` modules |
| `components/`, `features/` | Other UI modules, client-safe utilities | Mongoose, server controllers, env secrets |

- One cached connection: only `lib/db.js` (or helpers it exports) calls `mongoose.connect`.
- Secrets (`MONGO_URI`, `JWT_SECRET`, `INTERNAL_KEY`, Google server IDs) are read only in Route Handlers, `lib/`, `models/`, or `server/` — never in Client Components or committed files.

See `docs/MIGRATION_INVENTORY.md` for per-endpoint and per-screen checklists.

## 7. Data and Authentication Rules

### Existing data

The existing MongoDB database is retained. Do not rename collections, rewrite records, or alter transaction/category data as a by-product of migration.

### User model change required for Google creation

The legacy model requires `password`, but Google-created accounts have none. The replacement model must support password-only, Google-only, and linked accounts. Store a stable Google subject identifier separately from email and enforce its uniqueness when present.

Password login rejects accounts without a password credential. A verified matching email links a Google identity to an existing account; a Google subject already linked elsewhere is rejected. This is an intentional PRD behaviour improvement and requires migration tests.

Do not create a password-setup API or UX during parity work. That later feature needs explicit product and design approval.

### Cookies and secrets

- JWT preserves the existing user identity contract and seven-day expiry.
- The `token` cookie remains HTTP-only and is set/cleared only in server code.
- `MONGO_URI`, `JWT_SECRET`, Google configuration, and internal category keys are runtime secrets.
- Configure function-runtime secrets in Netlify UI, CLI, or API. Do not rely on `netlify.toml` for function secrets or prefix a secret with `NEXT_PUBLIC_`.

## 8. Netlify Deployment Rules

- Let Netlify detect the Next.js app; do not add or pin a legacy Next.js runtime/plugin.
- Use the Netlify CLI for deployment-faithful local verification; use `next dev` for UI iteration.
- Configure MongoDB, JWT, Google, and production cookie/domain variables in Netlify environment settings.
- Use `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (same public Web client ID). Do not set `OAUTH_CLIENT` on Netlify when it duplicates the public ID — secrets scanning flags the client bundle. `SECRETS_SCAN_OMIT_PATHS` in `netlify.toml` excludes server-only output where runtime secrets are expected.
- Confirm MongoDB network access accepts Netlify functions before production cutover.
- Smoke-test a deployed preview for login, cookie persistence, database access, and protected endpoints before production.

## 9. Defect-Fix Policy

Defect fixes must preserve endpoint paths and successful response shapes. For each fix, record:

1. the legacy behaviour and why it is defective;
2. the corrected behaviour;
3. regression tests, including ownership/security impact where relevant.

Expected migration fixes include valid zero-valued transaction updates, cookie clearing with intended attributes, and first-time Google-account creation. Do not add other behavioural changes without agreement.
