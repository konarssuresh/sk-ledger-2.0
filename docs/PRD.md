# SK Ledger 2.0 — Product Requirements Document

## 1. Product Overview

SK Ledger 2.0 is the single Next.js replacement for the existing SK Ledger Vite frontend and Express/MongoDB backend. It remains a personal ledger where authenticated users record income, expenses, and savings; manage categories; review transactions by month; see dashboard analytics; and manage account preferences.

The first release is a behaviour-parity migration. The legacy frontend is the visual reference for Login, Signup, Dashboard, Transactions, Profile, and Settings. `/Users/sureshkonar/projects/SKLedger/index.html` supplies additional Transactions desktop/mobile calendar and form detail. `/Users/sureshkonar/projects/SKLedger/settings.html` supplies additional Settings desktop/mobile detail.

## 2. Goals

- Replace two deployables with one JavaScript Next.js App Router application on Netlify.
- Connect to the existing MongoDB deployment through Mongoose.
- Recreate every legacy API path, HTTP method, and successful response shape under the same `/api` paths.
- Preserve existing user-facing behaviour and frontend design before new design work.
- Correct defects discovered during migration without breaking established API contracts.
- Retain email/password login and add first-time Google-account creation.

## 3. Non-Goals for the Migration

- Replacing MongoDB or Mongoose.
- Introducing Supabase, Postgres, a new hosted backend, or an authentication framework.
- Redesigning existing screens or adding unreferenced product areas.
- Changing existing data formats, money/date rules, currencies, transaction types, or reporting definitions unless approved as a defect fix.
- Adding a Google-only password-setup screen before its UX is designed and approved. Google-only users cannot use password login until that later dedicated flow exists.

## 4. Users and Authentication

### Email/password user

- Can sign up, log in, log out, edit profile details, update preferences, and change a password.
- Receives the existing HTTP-only `token` JWT session cookie on successful login.

### Google user

- Supplies a Google credential to `POST /api/auth/login/google`.
- A first-time verified Google identity creates a user using the Google profile name and email, without a password.
- A verified Google email matching an existing password user links Google sign-in to that same account rather than creating a duplicate.
- The stable Google subject ID is unique to one SK Ledger user.
- A Google-only account cannot use password login until a future, separately designed password-setup flow is implemented.

## 5. Functional Requirements

### Authentication and profile

- Preserve `signup`, `login`, `signout`, `me`, `changePreferences`, `profile`, and `change-password` behaviour and response contracts.
- Preserve same-origin cookie authentication and protect every user-owned API operation.
- Correct the legacy Google-login limitation by creating an account when a verified Google identity is not represented.

### Categories

- Preserve default-category creation and category create/read/update/delete operations.
- A user may read or use only default categories and categories they own.
- Category operations must not affect another user's categories.

### Transactions

- Preserve transaction create, read, update, delete, day query, monthly summary, and single-transaction behaviour.
- Preserve the income, expense, and savings transaction types and existing stored fields.
- Recreate the transactions calendar/list UI, add/edit/delete flows, inline category entry, and calculator behaviour from the legacy frontend and supplied design.

### Dashboard and analytics

- Preserve daily, weekly, monthly, and yearly dashboard analytics.
- Preserve summary totals, previous-period comparisons, category summaries, trends, insights, and recent transactions returned by the existing endpoint.
- Dashboard figures must be scoped to the authenticated user and reconcile with that user's transaction data.

### Settings and presentation

- Preserve profile, password, currency, theme, and logout flows.
- Recreate the responsive desktop/mobile treatment from legacy UI and the supplied Settings design.
- Preserve light/dark theme support.

## 6. API Compatibility Contract

Implementation moves from Express routers to Next.js Route Handlers. Browser callers must not need to change their URLs, methods, or successful response shapes.

| Area | Paths |
| --- | --- |
| Auth | `POST /api/auth/signup`, `/login`, `/login/google`, `/signout`, `/changePreferences`, `/change-password`; `GET /api/auth/me`; `PATCH /api/auth/profile` |
| Categories | `POST /api/categories/create-default`, `/create`; `GET /api/categories`; `PATCH` and `DELETE /api/categories/:id` |
| Transactions | `POST /api/transactions/create`; `GET /api/transactions`, `/month-summary`, `/:id`; `PATCH` and `DELETE /api/transactions/:id` |
| Analytics | `GET /api/analytics/dashboard` |

## 7. Acceptance Criteria

The migration release is complete when:

- The Next.js app deploys to Netlify and connects to the existing MongoDB database.
- Legacy frontend flows operate from the Next.js app with desktop/mobile visual and behavioural parity.
- Every listed endpoint is available at the same path/method and passes its migrated Jest contract tests.
- Email/password and Google sign-in establish the same HTTP-only application session.
- Google sign-in creates first-time users and links matching password accounts without duplicates.
- A user cannot read, update, or delete another user's categories or transactions.
- Defect fixes are documented and do not intentionally break public API contracts.
- Lint, production build, and relevant migrated tests pass before deployment.
