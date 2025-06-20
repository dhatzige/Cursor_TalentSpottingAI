# Authentication Overhaul with Clerk

_Last updated: 2025-06-20_

## Overview
The legacy JWT/localStorage authentication has been fully replaced by **Clerk** across the TalentSpottingAI monorepo.  This document captures the high-level design, environment requirements, and integration touch-points.

## 1. Packages
| Workspace | Package | Version |
|-----------|---------|---------|
| `frontend` | `@clerk/nextjs` | ^5.x |
| `backend`  | `@clerk/clerk-sdk-node` | ^5.x |

Run `pnpm i` (root-level) to ensure the workspaces pick up the new deps.

## 2. Environment Variables
Add the following keys to your local `.env` / `.env.local` (examples exist in version control):
```
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

Back-end `.env` now only needs:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5433/talentspotting
```

## 3. Frontend Integration
1. **Provider** – The root `app/layout.tsx` wraps the HTML body in `<ClerkProvider>`.  The former custom `AuthProvider` has been removed.
2. **Middleware** – `src/middleware.ts` exports `clerkMiddleware()` to protect all routes under `/student-dashboard`, `/organization-dashboard`, etc.
3. **Hooks**
   * `useAuth`, `useUser` – Provided by Clerk for session & profile data.
   * `useProtectedRoute` – Unified wrapper (`src/lib/hooks/useProtectedRoute.tsx`) that:
     - Redirects unauthenticated users to `/sign-in`.
     - Guards role-restricted pages (admin, student, employer, university).
     - Supports `?dev_bypass=true` in **development** for quick UI testing.
4. **Onboarding** – First-time users are redirected to `/onboarding` to choose a role.  The role + generated `dashboardCode` are stored in `user.unsafeMetadata` then synced to Postgres via `/api/clerk/sync`.

## 4. Backend Integration
* `middleware/clerkAuth.ts` validates Clerk JWTs.
* `controllers/user/syncClerkUser.ts` upserts user/role/dashboardCode into Postgres.
* All private routes should wrap handler logic with `clerkAuth()`.

## 5. Removing Legacy Auth
* `src/app/login`, `src/app/create-account`, `lib/hooks/useAuth.tsx`, and any `/login` redirects are deprecated.  They will be deleted after downstream pages update their imports (tracked in ROADMAP).

## 6. Dev Bypass
Append `?dev_bypass=true` to any protected page URL while `NODE_ENV=development` to inject a mock user with the first allowed role.  Useful for local design reviews.

---
_For detailed call-flow diagrams see `docs/ARCHITECTURE.md#authentication`._
