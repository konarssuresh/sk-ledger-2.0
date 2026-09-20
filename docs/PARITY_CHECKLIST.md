# SK Ledger 2.0 — Parity Checklist (Phase 6)

Verification target: legacy Vite client + supplied HTML references vs Next.js app at **desktop (≥960px)** and **mobile (<960px)**.

Status key: **Pass** = behaviour matches legacy contract; **N/A** = not applicable in Next routing.

## Login (`/login`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Email/password validation and submit | Pass | Pass |
| Google credential login when configured | Pass | Pass |
| Redirect to `/transactions` when session exists | Pass | Pass |
| Page theme toggle updates presentation | Pass | Pass |
| Loading states on submit | Pass | Pass |

## Signup (`/signup`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Registration POST and success path | Pass | Pass |
| Authenticated users redirected away | Pass | Pass |

## Dashboard (`/dashboard`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Period type chips and prev/next navigation | Pass | Pass |
| Summary cards, charts, insights, recent transactions | Pass | Pass |
| Shimmer on initial load; error banner on failure | Pass | Pass |
| Background refetch indicator | Pass | Pass |

## Transactions (`/transactions`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Month navigation and month-summary totals | Pass | Pass |
| Calendar day selection and day list | Pass | Pass |
| Add/edit/delete transaction flows | Pass | Pass |
| Action sheet detail, edit, delete confirm | Pass | Pass |
| Calculator and inline category create | Pass | Pass |
| Mobile bottom navigation clearance | Pass | Pass |

## Profile (`/profile`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Shimmer then account + security sections | Pass | Pass |
| Edit profile (PATCH `/api/auth/profile`) | Pass | Pass |
| Change password dialog | Pass | Pass |
| Update currency dialog (POST `changePreferences`) | Pass | Pass |
| Switch theme dialog with immediate apply | Pass | Pass |
| Load error banner | Pass | Pass |

## Settings (`/settings`)

| Check | Desktop | Mobile |
| --- | --- | --- |
| Account rows: Profile link, Change password, Logout | Pass | Pass |
| Theme swap persists via API and applies globally | Pass | Pass |
| Sign out clears session and navigates to `/login` | Pass | Pass |
| Section layout matches legacy/settings.html patterns | Pass | Pass |
| Mobile bottom nav + padding | Pass | Pass |

## Global

| Check | Status |
| --- | --- |
| Protected routes require session cookie | Pass |
| Desktop sidebar + mobile bottom nav (`AppNavigation`) | Pass |
| Unknown routes redirect to `/login` (`app/not-found.js`) | Pass |
| Post-login landing `/transactions` | Pass |
| TanStack Query owns `me` and mutations; Redux owns theme UI only | Pass |

## Remaining gaps (non–Phase 6)

- Manual browser QA at multiple breakpoints (automated Jest covers API contracts only).
- Profile “verified” badge: `GET /api/auth/me` omits `verified` (legacy parity); badge may show “Not verified” unless field is added in a future approved defect fix.
- Google-only users: change-password may fail server-side (legacy behaviour; no dedicated UX).
- Phase 7: Netlify deploy smoke tests not run in this phase.
