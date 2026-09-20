# SK Ledger 2.0 — Migration Inventory

Authoritative checklist for API and UI parity migration. Legacy references live in sibling repos:

- Server: `../../skledger-server/`
- Client: `../../skledger-client/`
- Design supplements: `../../index.html` (Transactions), `../../settings.html` (Settings)

Status key: `[ ]` not started · `[~]` in progress · `[x]` complete

---

## 1. Endpoint contract matrix

| Status | Method | Path | Auth | Query / body | OpenAPI | Legacy controller | Legacy route | Frontend caller | Jest tests | Target Next handler |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | POST | `/api/auth/signup` | Public | Body: `fullName`, `email`, `password`, optional `baseCurrency` | `/api/auth/signup` | `authController.signup` | `authRouter.js` | `userSlice` `signup` | `authRouter.test.js`, `authController.test.js` | `app/api/auth/signup/route.js` |
| [x] | POST | `/api/auth/login` | Public | Body: `email`, `password`; sets `token` cookie | `/api/auth/login` | `authController.login` | `authRouter.js` | `userSlice` `login` | same | `app/api/auth/login/route.js` |
| [x] | POST | `/api/auth/login/google` | Public | Body: `credential`; sets `token` cookie; PRD: create/link account | `/api/auth/login/google` | `authController.signinWithGoogle` | `authRouter.js` | `userSlice` `loginWithGoogle` | same (+ new Google create/link tests in Phase 2) | `app/api/auth/login/google/route.js` |
| [x] | POST | `/api/auth/signout` | Public | Clears `token` cookie | `/api/auth/signout` | `authController.signout` | `authRouter.js` | `userSlice` `signout` | same | `app/api/auth/signout/route.js` |
| [x] | GET | `/api/auth/me` | Cookie JWT | — | `/api/auth/me` | `authController.getCurrentUser` | `authRouter.js` + `validateUser` | `userSlice` `me` | same, `validateUser.test.js` | `app/api/auth/me/route.js` |
| [x] | POST | `/api/auth/changePreferences` | Cookie JWT | Body: `currency`, `theme` | `/api/auth/changePreferences` | `authController.updatePreference` | `authRouter.js` | `userSlice` `changePreferences` | same | `app/api/auth/changePreferences/route.js` |
| [x] | PATCH | `/api/auth/profile` | Cookie JWT | Body: `fullName`, optional `email` | `/api/auth/profile` | `authController.updateProfile` | `authRouter.js` | `userSlice` `updateProfile` | same | `app/api/auth/profile/route.js` |
| [x] | POST | `/api/auth/change-password` | Cookie JWT | Body: `currentPassword`, `newPassword` | `/api/auth/change-password` | `authController.changePassword` | `authRouter.js` | `userSlice` `changePassword` | same | `app/api/auth/change-password/route.js` |
| [x] | POST | `/api/categories/create-default` | Header `x-internal-key` | — | `/api/categories/create-default` | `categoryController.createDefaultCategories` | `categoryRouter.js` + `internalAuth` | *(internal only)* | `categoryRouter.test.js`, `internalAuth.test.js`, `categoryController.test.js` | `app/api/categories/create-default/route.js` |
| [x] | POST | `/api/categories/create` | Cookie JWT | Body: category fields | `/api/categories/create` | `categoryController.createCategory` | `categoryRouter.js` | `categorySlice` `createCategory` | same | `app/api/categories/create/route.js` |
| [x] | GET | `/api/categories` | Cookie JWT | — | `/api/categories` | `categoryController.getCategories` | `categoryRouter.js` | `categorySlice` `fetchCategories` | same | `app/api/categories/route.js` |
| [x] | PATCH | `/api/categories/:id` | Cookie JWT | Body: patch fields | `/api/categories/{id}` | `categoryController.updateCategory` | `categoryRouter.js` | *(not used in legacy UI)* | same | `app/api/categories/[id]/route.js` |
| [x] | DELETE | `/api/categories/:id` | Cookie JWT | — | `/api/categories/{id}` | `categoryController.deleteCategory` | `categoryRouter.js` | *(not used in legacy UI)* | same | `app/api/categories/[id]/route.js` |
| [x] | POST | `/api/transactions/create` | Cookie JWT | Body: transaction fields | `/api/transactions/create` | `transactionController.createTransaction` | `transactionRouter.js` | `transactionSlice` `addTransaction` | `transactionRouter.test.js`, `transactionController.test.js` | `app/api/transactions/create/route.js` |
| [x] | GET | `/api/transactions` | Cookie JWT | Optional `?date=YYYY-MM-DD` | `/api/transactions` | `transactionController.getTransactions` | `transactionRouter.js` | `fetchTransactions`, `fetchTransactionsForDay` | same | `app/api/transactions/route.js` |
| [x] | GET | `/api/transactions/month-summary` | Cookie JWT | `year`, `month` | `/api/transactions/month-summary` | `transactionController.getMonthlyTransactionSummary` | `transactionRouter.js` | `fetchMonthlyTransactionSummary` | same | `app/api/transactions/month-summary/route.js` |
| [x] | GET | `/api/transactions/:id` | Cookie JWT | — | `/api/transactions/{id}` | `transactionController.getTransactionById` | `transactionRouter.js` | *(indirect via mutations)* | same | `app/api/transactions/[id]/route.js` |
| [x] | PATCH | `/api/transactions/:id` | Cookie JWT | Body: patch fields; defect: allow zero values | `/api/transactions/{id}` | `transactionController.updateTransaction` | `transactionRouter.js` | `updateTransaction` | same | `app/api/transactions/[id]/route.js` |
| [x] | DELETE | `/api/transactions/:id` | Cookie JWT | — | `/api/transactions/{id}` | `transactionController.deleteTransaction` | `transactionRouter.js` | `deleteTransaction` | same | `app/api/transactions/[id]/route.js` |
| [x] | GET | `/api/analytics/dashboard` | Cookie JWT | `periodType`, `date` | `/api/analytics/dashboard` | `analyticsController.getDashboardAnalytics` | `analyticsRouter.js` | `analyticsSlice` `fetchDashboardAnalytics` | `analyticsRouter.test.js`, `analyticsController.test.js` | `app/api/analytics/dashboard/route.js` |

---

## 2. Screen migration checklist

### Protected shell

| Status | Next target | Legacy route | Legacy files | Acceptance checks |
| --- | --- | --- | --- | --- |
| [x] | `app/(protected)/layout.js` | — | `RouteProtector.jsx`, `AuthenticatedLayout.jsx`, `AppNavigation.jsx` | Phase 3: session gate + `AppNavigation` shell (Dashboard/Settings pages still Phase 4–5) |

### Auth pages

| Status | Next target | Legacy route | Legacy files | Acceptance checks |
| --- | --- | --- | --- | --- |
| [x] | `app/(auth)/login/page.js` | `/login` | `pages/login/index.jsx` | Email/password form validation; submit calls login API; Google button posts credential; redirect to `/transactions` when session exists; auth hero styling; loading states; keyboard-accessible controls |
| [x] | `app/(auth)/signup/page.js` | `/signup` | `pages/signup/index.jsx` | Signup form; POST signup; redirect authenticated users away from page |

### Protected pages

| Status | Next target | Legacy route | Legacy files | Design reference | Acceptance checks |
| --- | --- | --- | --- | --- | --- |
| [x] | `app/(protected)/dashboard/page.js` | `/dashboard` | `pages/dashboard/index.jsx`, `DashboardHeader.jsx`, `SummaryCards.jsx`, `ChartsSection.jsx`, `InsightsSection.jsx`, `DashboardShimmer.jsx` | — | Period type chips and prev/next; `GET /api/analytics/dashboard`; summary cards; pie/bar charts; insights; recent transactions; shimmer while loading; error state |
| [x] | `app/(protected)/transactions/page.js` | `/transactions` | `pages/transactions/index.jsx`, `Calendar.jsx`, `DayTransactions.jsx`, `AddTransactionDialog.jsx`, `DeleteTransactionDialog.jsx`, `AddCategoryInlineDialog.jsx`, `CalculatorDialog.jsx`, `TransactionsShimmer.jsx`, `common-components/Calculator.jsx` | `../../index.html` | Month navigation; `month-summary` totals; calendar day balances; selected day list via `?date=`; add/edit/delete transactions; inline category create; calculator in amount flow; loading/empty states; desktop and mobile layout |
| [x] | `app/(protected)/profile/page.js` | `/profile` | `pages/profile/index.jsx`, `AccountDetails.jsx`, `SecurityInfo.jsx`, `ProfileActions.jsx`, `EditProfileDialog.jsx`, `ChangePasswordDialog.jsx`, `UpdateCurrencyDialog.jsx`, `SwitchThemeDialog.jsx`, `ProfileShimmer.jsx` | — | Load user via `me`; account and security sections; edit profile PATCH; change password; currency/theme dialogs; error banner on load failure |
| [x] | `app/(protected)/settings/page.js` | `/settings` | `pages/settings/index.jsx` (reuses profile dialogs) | `../../settings.html` | Theme toggle persists via `changePreferences`; currency selection; change password entry; signout clears session and navigates to login; responsive desktop/mobile per supplied HTML |

### Routing parity

| Status | Behaviour | Legacy | Next |
| --- | --- | --- | --- |
| [x] | Unknown paths | `Navigate` to `/login` | `app/not-found.js` → `/login` |
| [x] | Post-login landing | `/transactions` | Same default (`LoginForm`, auth redirect) |
| [x] | Google client ID | `VITE_GOOGLE_CLIENT_ID` in `main.jsx` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_ID` in `.env.example`; `OAUTH_CLIENT` legacy alias |

---

## 3. Jest test migration map

Port from `skledger-server` into `sk-ledger-2.0/__tests__/` as Route Handlers land. Phase 0 only provides shared setup.

| Legacy test file | Scope | Target phase |
| --- | --- | --- |
| `src/routes/__tests__/authRouter.test.js` | Auth HTTP contracts | Done → `__tests__/auth-routes.test.js` |
| `src/routes/__tests__/categoryRouter.test.js` | Category HTTP contracts | Done → `__tests__/category-routes.test.js` |
| `src/routes/__tests__/transactionRouter.test.js` | Transaction HTTP contracts | Done → `__tests__/transaction-routes.test.js` (+ zero-amount regression) |
| `src/routes/__tests__/analyticsRouter.test.js` | Analytics HTTP contracts | 4 |
| `src/controllers/__tests__/authController.test.js` | Auth controller logic | Done → `__tests__/auth-controller.test.js` (+ `__tests__/google-auth.test.js`) |
| `src/controllers/__tests__/categoryController.test.js` | Category controller logic | Done → `__tests__/category-controller.test.js` |
| `src/controllers/__tests__/transactionController.test.js` | Transaction controller logic | Done → `__tests__/transaction-controller.test.js` |
| `src/controllers/__tests__/analyticsController.test.js` | Analytics controller logic | 4 |
| `src/middlewares/__tests__/validateUser.test.js` | JWT cookie resolution | 1–2 |
| `src/middlewares/__tests__/internalAuth.test.js` | Internal key guard | Done → `__tests__/internal-auth.test.js` |
| `src/utils/__tests__/validators.test.js` | Input validators | 1 |
| `src/__tests__/testApp.js` | Express test app | Replace with Next route test harness per phase |
| `src/__tests__/setup.js` | In-memory Mongo + env | Env defaults in `__tests__/setup.js`; Mongo hooks in `__tests__/mongoSetup.js` (enable per suite or in Jest config when API tests port) |
| `src/__tests__/helpers.js` | Fixtures | Port with models in Phase 1 |

---

## 4. Dependency record (Phase 0)

Installed in `sk-ledger-2.0` to support upcoming migration work. Not all are imported until later phases.

### Production

| Package | Version policy | Purpose | First use |
| --- | --- | --- | --- |
| `mongoose` | Align with legacy `^9` | MongoDB ODM, existing collections | Phase 1 |
| `bcrypt` | Align with legacy `^6` | Password hash/compare | Phase 1–2 |
| `jsonwebtoken` | Align with legacy `^9` | JWT session in `token` cookie | Phase 1–2 |
| `google-auth-library` | Align with legacy `^10` | Verify Google ID tokens | Phase 2 |

### Development

| Package | Purpose | First use |
| --- | --- | --- |
| `jest` | Contract and controller tests | Phase 0 smoke; port tests per phase |
| `mongodb-memory-server` | Isolated MongoDB in tests | Phase 1+ |
| `supertest` | HTTP assertions (legacy pattern) | Phases 2–4 until Next-native harness |
| `netlify-cli` | Local Netlify-compatible dev/build | Phase 0 verification |

### Deferred (documented, not installed in Phase 0)

| Package | Purpose | Phase |
| --- | --- | --- |
| `validator` | Legacy input validation | 1 |
| `lodash` | Legacy controller utilities | 1+ |
| `@react-oauth/google` | Google sign-in button | 2 |
| Redux Toolkit / RTK Query | Legacy client data layer | Replaced or reimplemented in feature modules |

### Explicitly excluded

TypeScript, Express, Supabase, Postgres, `dotenv` (Next loads env files), CORS/cookie-parser/swagger stack, separate backend deploy.

---

## 5. Environment variables

Committed template: `.env.example` (names only). Runtime values belong in Netlify or local `.env.local` (gitignored).

| Variable | Used by | Notes |
| --- | --- | --- |
| `MONGO_URI` | Mongoose connection | Existing deployment URI |
| `JWT_SECRET` | Sign/verify session JWT | Server only |
| `INTERNAL_KEY` | `create-default` categories | Header `x-internal-key` |
| `GOOGLE_CLIENT_ID` | Google token verification | Preferred server name; same value as `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| `OAUTH_CLIENT` | Google token verification | Optional legacy alias (omit on Netlify if it duplicates the public client ID) |
| `GOOGLE_CLIENT_ID` | Google token verification | Accepted alias in legacy code |
| `COOKIE_DOMAIN` | Production cookie domain | Optional; e.g. `.example.com` |

Browser Google button (Phase 2): legacy `VITE_GOOGLE_CLIENT_ID` maps to a Next public env var; not duplicated in `.env.example` until UI migration defines the exact name.
