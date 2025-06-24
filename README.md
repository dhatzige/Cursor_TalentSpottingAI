# TalentSpottingAI – Monorepo

> Next-Gen platform connecting employers with talent, powered by AI-driven matching and modern UX.

---

## 1. Repository Layout

| Path | Description |
|------|-------------|
| `/frontend` | Next.js 15 (App Router, TS, Tailwind, Shadcn-UI) |
| `/backend`  | Node/Express REST API (TS) & Prisma ORM |
| `/docker`   | Compose scripts for local full-stack spin-up |
| `MEMORY.md` | Living architecture & decision log (documentation-first) |


## 2. Quick Start (Frontend-only)

```bash
pnpm i          # or npm i/yarn install – workspace-aware
pnpm dev -F frontend   # starts Next.js dev server on :3000
```

Open `http://localhost:3000`.

### Protected Routes – **dev_bypass**
For faster UI testing, append `?dev_bypass=true` to any dashboard URL in development. This triggers the `useProtectedRoute` hook to inject a mock user and skip auth/role checks.

Examples:
- Student Settings: `http://localhost:3000/student-dashboard-noauth/settings?dev_bypass=true`
- Employer Settings: `http://localhost:3000/organization-dashboard-noauth/settings?dev_bypass=true`

> **Note:** `dev_bypass` is ignored outside `NODE_ENV=development`.


## 3. Student Onboarding System

### Profile Completion Step (January 2025)

The final onboarding step features a comprehensive skills selection system designed to help students build complete profiles:

#### Skills Database
- **500+ Skills** across 18 professional categories
- **Intelligent Recommendations** based on academic level (Bachelor's/Master's/PhD) and field of study
- **Real-time Autocomplete** with smart search and filtering
- **Tag-based Selection** with visual feedback

#### Key Features
```typescript
// Example skill recommendations for Computer Science Bachelor's students
const recommendations = [
  'Programming Fundamentals', 'JavaScript', 'Python', 'Java', 
  'Data Structures', 'Algorithms', 'Version Control (Git)'
];

// General skills for all Bachelor's students
const generalSkills = [
  'Communication Skills', 'Teamwork', 'Problem Solving', 
  'Time Management', 'Critical Thinking'
];
```

#### Profile Summary
- **Accurate Data Display**: Shows actual university name, city, and user information
- **Real-time Updates**: Profile preview updates as users modify their details
- **Comprehensive Validation**: Ensures data accuracy before submission

### Usage in Development
```bash
# Test the onboarding flow
cd frontend && npm run dev
# Navigate to: http://localhost:3000/onboarding?dev_bypass=true
```


## 4. Dashboard Settings – New Save Flow (June 2025)

Both Student & Employer dashboards now feature real **Save Settings** buttons with visual feedback.

### What changed
1. **State key update:** `email` ➜ `weeklySummary` (SMS toggles removed).
2. **`useSaveSettings` Hook** – Located at `src/lib/hooks/useSaveSettings.ts`.
   - Exposes `{ saveSettings, saving, saved }`.
   - POSTs the complete settings object to `/api/settings` (mock endpoint for now).
3. **Mock API route** – `src/app/api/settings/route.ts` simply logs the payload; replace with real persistence when backend is ready.
4. **Dirty flag** – Save buttons remain inactive until a change is made, then show _Saving… → Saved!_

### Adding save support to future pages
```tsx
const { saveSettings, saving, saved } = useSaveSettings<MySettingsType>();
const [dirty, setDirty] = useState(false);
// …update handlers setDirty(true)
<button disabled={!dirty || saving} onClick={() => saveSettings(data)}>
  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
</button>
```


## 5. Lint & Formatting

```bash
pnpm lint -F frontend   # ESLint (Next.js preset + project rules)
pnpm format             # Prettier
```

Common warnings (`no-explicit-any`) will be addressed incrementally.


## 6. Testing

| Command | Description |
|---------|-------------|
| `pnpm test` | Jest unit/integration (backend & shared utils) |
| `pnpm playwright` | E2E (frontend) – scripts WIP |


## 7. Deployment

The repo is Netlify/Vercel-ready. CI/CD pipelines will build the workspace graph and deploy independently:
- **Frontend:** Vercel (preview + prod)
- **Backend:** Render.com or Railway (Docker image)

See `.github/workflows/*` for pipeline templates.


## 8. Contributing

1. Follow the **modular code** principle – keep files < 400 lines.
2. Before coding, scan for existing utils/components to avoid duplication.
3. Document significant decisions in `MEMORY.md`.
4. Run `pnpm lint` & `pnpm format` before opening a PR.

Enjoy hacking! :rocket:


