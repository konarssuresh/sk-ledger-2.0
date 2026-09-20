# SK Ledger 2.0 — Development Plan

## 1. How to Use This Plan

Implement phases in order. `docs/PRD.md` defines required behaviour; `docs/ARCHITECTURE.md` defines how it is built. A phase is complete only after its completion criteria pass. Do not start redesign work until behaviour parity is complete.

## 2. Delivery Sequence

| Phase | Outcome | Depends on |
| --- | --- | --- |
| 0 | Migration inventory and Netlify-ready foundation | Existing scaffold and legacy repositories |
| 1 | MongoDB connection, models, validation, and shared auth helpers | Phase 0 |
| 2 | Auth API parity, Google account creation/linking, protected routes | Phase 1 |
| 3 | Category and transaction API parity with core calendar/add-transaction UI | Phases 1–2 |
| 4 | Selected-day transaction action sheet, edit, and delete flow | Phase 3 |
| 5 | Dashboard analytics API and dashboard UI parity | Phases 1–4 |
| 6 | Profile, settings, responsive parity, and defect regression | Phases 2–5 |
| 7 | Route-level page loading fallbacks and navigation feedback | Phases 2–6 |
| 8 | Netlify preview validation, production cutover, and legacy retirement plan | Phases 0–7 |

## Phase 0 — Inventory and Foundation

### Goal

Prepare the JavaScript scaffold without changing product behaviour.

### Tasks

- Build an endpoint contract matrix from legacy routes, controllers, OpenAPI document, frontend API calls, and Jest tests.
- Capture each legacy page's routes, states, and acceptance checks. Use the legacy frontend as visual reference; use `index.html` and `settings.html` for supplied desktop/mobile transaction/settings detail.
- Add the JavaScript-only folder boundaries in `ARCHITECTURE.md`.
- Add only dependencies needed to replace legacy runtime needs in Next.js: Mongoose, bcrypt, JWT, Google credential verification, Redux Toolkit, React Redux, TanStack React Query, and existing test tooling. Record every dependency before installation.
- Create the root Redux Toolkit store and React Redux provider for shared client-only UI state.
- Create the root TanStack Query client/provider for API reads, mutation lifecycle, caching, invalidation, loading, and API errors.
- Establish the state boundary: Redux Toolkit never stores API response data; TanStack Query never owns local UI state such as dialog visibility or calendar selection.
- Create `.env.example` with existing required variable names only.
- Configure Netlify-compatible local verification with the Netlify CLI; do not add a separate Netlify Function directory for Next.js API routes.
- Keep Jest configuration until each migrated test has a working Next.js-compatible home.

### Completion Criteria

- The scaffold remains JavaScript-only and starts, lints, and builds.
- Redux Toolkit and TanStack Query are available to Client Components through root providers.
- No fetched API record is stored in Redux.
- Every legacy endpoint and frontend screen has a migration checklist item.
- No secret or database value is committed.

## Phase 1 — Server Foundation

### Goal

Move shared server concerns into reusable Next.js-compatible modules before endpoints are migrated.

### Tasks

- Create a cached Mongoose connection helper suitable for development reloads and serverless invocations.
- Port User, Category, and Transaction Mongoose models without changing existing collection names or transaction/category fields.
- Adapt User to support password-only, Google-only, and linked accounts; add a unique Google subject ID.
- Port validators and shared error mapping.
- Implement JWT sign/verify, secure `token` cookie set/clear, and `requireCurrentUser()`.
- Port test fixtures and test database setup so no test uses production MongoDB.
- Add tests for connection reuse, sessions, ownership, and Google-identity uniqueness.

### Completion Criteria

- Server code reaches the existing data model through one helper.
- Password hashes and secrets never appear in ordinary API output.
- Protected operations reject missing/invalid sessions and cross-user access.

## Phase 2 — Authentication and Account Migration

### Goal

Recreate auth endpoints and pages with the same external contracts.

### Tasks

- Implement every auth Route Handler named in the PRD.
- Migrate signup, login, logout, current-user, preferences, profile, and change-password controller behaviour.
- Recreate Login, Signup, protected-layout, and navigation behaviour from the legacy frontend.
- Use TanStack Query for current-user reads and auth mutation lifecycle. Keep shared auth-page UI-only state in Redux only when it is genuinely shared.
- Port Google credential verification. On first verified Google use, create a Google-only account; on verified matching email, link the existing password account; reject Google-subject conflicts.
- Retain the legacy Google endpoint path and successful response shape while adding account-creation coverage.
- Port current Jest controller/route tests and add Google creation/linking tests.

### Completion Criteria

- Password sign-up, login, logout, and protected-page access work through Next.js.
- Google creates a first-time account and links a matching existing account without duplicates.
- Auth tests verify session-cookie behaviour without Express.

## Phase 3 — Categories, Transactions, and Core Calendar

### Goal

Recreate core ledger APIs and the transaction experience before dashboard reporting.

### Tasks

- Implement category Route Handlers with legacy paths, methods, response shapes, and ownership rules.
- Implement transaction Route Handlers for create, update, delete, list, month summary, and one-record lookup.
- Port controller logic and Jest tests feature by feature.
- Explicitly test and fix legacy update defects, including valid zero-valued updates, while preserving public contracts.
- Recreate the Transactions route, calendar, selected-day list, add-transaction dialog, inline category flow, and calculator from legacy code and `index.html`.
- Implement the edit/delete API mutations and cache-invalidation paths required by the next phase, but do not build the selected-transaction action sheet in this phase.
- Use TanStack Query for category/transaction reads and mutations. Use Redux Toolkit only for shared transaction UI state such as selected date, active dialog, or calculator visibility.
- Maintain loading, empty, error, keyboard, mobile, and desktop states.

### Completion Criteria

- A user can create categories and transactions and browse their own selected-day/monthly transaction data.
- Calendar/day/month data agrees with the transaction list.
- Existing and new regression tests pass for category and transaction endpoints.

## Phase 4 — Selected-Day Transaction Actions

### Goal

Recreate the selected-day transaction detail and action flow before dashboard work.

### Tasks

- Make each selected-day transaction row interactive, using the legacy `DayTransactions` flow as the behaviour reference.
- On selection, open a bottom action sheet with the selected transaction's name, category emoji/name, type, signed formatted amount, transaction date, currency, created time, and optional note.
- Provide a reliable close path: backdrop interaction, Escape key, and an accessible close control where the ported dialog primitive requires it.
- Store only the selected transaction identifier and action-sheet UI state in Redux Toolkit; resolve/render transaction records through TanStack Query data.
- Edit opens the existing populated transaction form from the action sheet. On a successful update, close transient UI and invalidate/update the selected-day, month-summary, and any affected transaction caches.
- Delete opens an explicit confirmation dialog from the action sheet. Do not delete until confirmation succeeds. On success, close transient UI and invalidate/update the same affected caches.
- Preserve ownership protection through the existing update/delete API handlers and add interaction/regression coverage for open, close, edit, cancel delete, confirm delete, and refresh behaviour.
- Verify the sheet/action controls on narrow mobile and desktop widths using the legacy layout as reference.

### Completion Criteria

- Clicking a selected-day transaction opens its detail/action sheet without changing the selected calendar day.
- The sheet displays the complete legacy detail set and presents Edit and Delete actions.
- Edit uses the existing populated form and refreshes affected views after success.
- Delete requires confirmation, leaves records intact on cancel/failure, and removes only the authenticated user's confirmed transaction on success.
- No fetched transaction/category data is copied into Redux.

## Phase 5 — Dashboard and Analytics

### Goal

Port analytics calculations and the Dashboard screen.

### Tasks

- Implement `GET /api/analytics/dashboard` with legacy query parameters, periods, output fields, and ownership scope.
- Port analytics behaviour and tests for daily, weekly, monthly, and yearly ranges.
- Recreate dashboard summary cards, charts, insights, recent transactions, period controls, shimmers, and empty/error states from legacy frontend.
- Use TanStack Query for dashboard data and period-query cache keys. Keep presentation-only controls in component state or Redux Toolkit when shared across dashboard UI.
- Reconcile dashboard output against controlled transaction fixtures and document each defect correction.

### Completion Criteria

- Dashboard output matches its endpoint contract and test fixtures.
- Period navigation and charts/cards work on desktop and mobile.

## Phase 6 — Profile, Settings, and Parity Review

### Goal

Finish account UI and verify complete legacy behaviour parity.

### Tasks

- Recreate Profile and Settings from legacy frontend and `settings.html`.
- Validate profile edits, currency/theme preference updates, password changes, signout, and theme persistence.
- Use TanStack Query for persisted profile/preferences and mutations; use Redux Toolkit only for immediate shared UI state such as the active theme presentation before/refetch after persistence.
- Verify Login, Signup, Dashboard, Transactions, Profile, and Settings against a page-by-page parity checklist at desktop and mobile widths.
- Record each intentional defect fix with regression coverage.

### Completion Criteria

- Every retained legacy flow is present in Next.js and backed by migrated APIs.
- Settings mirror the supplied responsive design and persist user choices.
- No redesign work was introduced.

## Phase 7 — Route-Level Page Loading Fallbacks

### Goal

Provide immediate, accessible page-shaped loading feedback during browser navigation to authenticated App Router pages.

### Tasks

- Use `/Users/sureshkonar/projects/sk-tube/app/(protected)/channels/[channelId]/loading.js` as the implementation-pattern reference: a route-level `loading.js` wraps a layout-shaped skeleton in a reusable animated page fallback.
- Create a reusable shared page-loading wrapper and only the skeleton primitives genuinely shared across SK Ledger pages. Do not use a generic full-page spinner as the default fallback.
- Add `loading.js` boundaries for Dashboard, Transactions, Profile, and Settings. Add auth-route fallbacks only when their page navigation has server-pending work; do not create redundant loaders without a route-level need.
- Make each fallback resemble its destination page: dashboard cards/chart areas, transaction summary/calendar/list areas, profile blocks, and settings rows.
- Ensure skeleton decoration is hidden from assistive technology and provide a concise screen-reader loading status.
- Retain the existing TanStack Query loading/error states within interactive components. Do not replace them with Redux state or route-level loading boundaries.
- Verify direct navigation and client-side navigation at desktop and mobile widths, including reduced-motion behaviour if the shared animation uses motion.

### Completion Criteria

- Navigation to each protected page immediately renders its matching `loading.js` fallback until the route is ready.
- Fallbacks are visually consistent with the final page layout and do not cause inaccessible or misleading screen-reader output.
- Route loading and TanStack Query loading work together without duplicated full-page spinners or data stored in Redux.
- The app still lints and builds successfully after adding the loading boundaries.

## Phase 8 — Netlify Release

### Goal

Deploy the single app safely without changing its data source.

### Tasks

- Connect the repository to Netlify and configure build/runtime environment values in Netlify, including preview values where needed.
- Validate MongoDB network access from a Netlify preview.
- Configure Google permitted origins/credentials for local, preview, and production use as required by the credential flow.
- Run deployed smoke checks: signup, password login, Google creation/login, cookie persistence, protected APIs, transactions, dashboard, settings, and logout.
- Keep legacy app available until the Next.js version passes the full smoke checklist and rollback plan is documented.

### Completion Criteria

- Production uses the existing MongoDB data with no data loss.
- Runtime secrets are present only in Netlify environment configuration.
- Release checklist, test results, and rollback decision are documented.
