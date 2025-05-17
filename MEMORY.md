# TalentSpottingAI - Rebuild Memory

## Project Mission
A modern platform for connecting employers with talent, using AI to improve matching between candidates and job opportunities. The goal is to preserve the existing visual design while modernizing and modularizing the codebase for maintainability, scalability, and deployment readiness.

## Tech Stack (Committed)
- **Frontend:** Next.js (React, TypeScript, App Router)
- **Styling:** TailwindCSS, Shadcn UI
- **Backend:** Node.js (Express, TypeScript)
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Custom JWT-based (no Supabase), with secure session management
- **Testing:** Jest (unit/integration), Playwright (e2e)
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), Render.com or Railway (backend), Docker-ready

## Architecture Principles
- Strict modularity: Each file/folder < 300-400 lines, single-responsibility, no duplication
- Code scanning before writing to avoid duplication
- MEMORY.md maintained and updated on every significant change
- Documentation-first: All major decisions, routes, features, and modules documented here
- Visual parity: UI must match original screenshots unless improvement is justified

## Frontend: Component Architecture

### Reusable UI Components
Modular, shared UI components to maintain consistency and avoid duplication:

| Component | File Path | Purpose | Variants |
|-----------|-----------|---------|----------|
| Button | frontend/src/app/components/Button.tsx | Reusable button with variants | primary, secondary, outline |
| Input | frontend/src/app/components/Input.tsx | Form input with label and error handling | N/A |
| NavBar | frontend/src/app/components/NavBar.tsx | Global navigation | N/A |
| RoleCard | frontend/src/app/role-selector/RoleCard.tsx | Role selection card with icon | Customizable background |
| DashboardLayout | frontend/src/app/components/DashboardLayout.tsx | Shared dashboard shell with sidebar | Role-specific styling |

### Dashboard Components
Modular, reusable components for dashboards:

| Component | File Path | Purpose |
|-----------|-----------|--------|
| StatCard | frontend/src/app/components/dashboard/StatCard.tsx | KPI/metric display with optional change indicator |
| ActivityCard | frontend/src/app/components/dashboard/ActivityCard.tsx | Activity feed with configurable items and status indicators |
| JobListCard | frontend/src/app/components/dashboard/JobListCard.tsx | Job listing with apply/manage actions |

### Page Components
Each page is modular and composed of smaller components:

| Page | Primary Components | Status |
|------|-------------------|--------|
| Homepage | HeroSection | Completed |
| Login | LoginForm | Completed |
| Create Account | CreateAccountForm | Completed |
| Role Selector | RoleCard | Completed |
| Admin Dashboard | DashboardStats, ActivityFeed | Completed |
| Student Dashboard | RecommendedJobs, ApplicationStatus | Completed |
| Organization Dashboard | ActiveJobs, TopCandidates | Completed |
| University Dashboard | StudentMetrics, StudentPlacement, EmployerPartners | Completed |

### Dashboard Modularity Strategy
Each dashboard follows a modular pattern to prevent large files and enable reuse:

1. **Base Layout**: `DashboardLayout.tsx` provides the shell with role-specific styling and navigation.
2. **Page Component**: Each dashboard page (e.g., `admin-dashboard/page.tsx`) is kept minimal, primarily composing other components.
3. **Feature Components**: Dashboard elements are split into focused feature components (e.g., `DashboardStats.tsx`, `ActivityFeed.tsx`).
4. **Shared UI Elements**: Common patterns like stat cards and lists are extracted into the shared dashboard component directory.

This approach ensures no file exceeds 300-400 lines while maintaining clear separation of concerns.

### Color System
Interim color palette using Tailwind's built-in colors until the original project's exact theme is extracted:

- **Primary:** blue-600/700 (buttons, links, headings)
- **Secondary:** gray-200/300 (secondary buttons, backgrounds)
- **Role Colors:**
  - Admin: gray-800 (sidebar), blue-600 (accents)
  - Student: blue-700 (sidebar), blue-600 (accents)
  - Employer: green-700 (sidebar), blue-600 (accents)
  - University: purple-700 (sidebar), blue-600 (accents)
- **Status Colors:**
  - Success: green-600 (text), green-100 (bg)
  - Warning: yellow-600 (text), yellow-100 (bg)
  - Error: red-600 (text), red-100 (bg)
  - Default: gray-600 (text), gray-100 (bg)
- **Text:** gray-800 (headings), gray-600 (body), white (on dark backgrounds)

## Frontend: Screenshot-to-Route Mapping
All major UI pages are scaffolded as modular Next.js components, each referencing the corresponding screenshot and the original GitHub repo for visual fidelity. Each page/component is kept under 300–400 lines for maintainability.

| Screenshot                | Route Path                | Component File                                    |
|---------------------------|---------------------------|---------------------------------------------------|
| Homepage.jpg              | /homepage                 | frontend/src/app/homepage/page.tsx                |
| Login.jpg                 | /login                    | frontend/src/app/login/page.tsx                   |
| Createa_an_account.jpg    | /create-account           | frontend/src/app/create-account/page.tsx          |
| Role_selector.jpg         | /role-selector            | frontend/src/app/role-selector/page.tsx           |
| Admin_dashboard.jpg       | /admin-dashboard          | frontend/src/app/admin-dashboard/page.tsx         |
| Student_dashboard.jpg     | /student-dashboard        | frontend/src/app/student-dashboard/page.tsx       |
| Organization_dashboard.jpg| /organization-dashboard   | frontend/src/app/organization-dashboard/page.tsx  |
| University_dashboard.jpg  | /university-dashboard     | frontend/src/app/university-dashboard/page.tsx    |
| Employers.jpg             | /employers                | frontend/src/app/employers/page.tsx               |
| Students.jpg              | /students                 | frontend/src/app/students/page.tsx                |
| Universities.jpg          | /universities             | frontend/src/app/universities/page.tsx            |
| Blog.jpg                  | /blog                     | frontend/src/app/blog/page.tsx                    |

## Backend Architecture

### API Structure
The backend follows a modular architecture with clear separation of concerns:

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Routes | Define API endpoints | Express Router modules |
| Controllers | Business logic | Role-specific controller files |
| Middleware | Request processing | Authentication, authorization, error handling |
| Database | Data storage | Prisma ORM with PostgreSQL |

### Authentication System
A complete JWT-based authentication system has been implemented:

- **Token Generation:** JWT tokens contain user ID and role for secure, stateless authentication
- **Middleware:** `authenticateToken` middleware validates tokens on protected routes
- **Role-Based Authorization:** `authorizeRoles` middleware restricts access based on user roles
- **User Management:** Registration, login, and profile endpoints for all user operations

### Role-Based Controllers
Each user role has dedicated controllers with tailored functionality:

| Role | Controller | Endpoints |
|------|------------|----------|
| Admin | admin.controller.ts | Dashboard stats, activity tracking |
| Student | student.controller.ts | Recommended jobs, application tracking |
| Employer | employer.controller.ts | Job management, candidate matching |
| University | university.controller.ts | Student metrics, placement data, employer partnerships |

### Database Models
The Prisma schema defines core models with relationships:

- **User:** Central entity with role-based access
- **Organization:** Companies hiring students
- **Job:** Position listings created by employers
- **Application:** Student applications to jobs

### Frontend-Backend Connection
The frontend dashboard pages connect to corresponding backend endpoints:

| Frontend Page | Backend Endpoint | Data Exchange |
|---------------|-----------------|---------------|
| Login/Register | `/api/auth/*` | User credentials, JWT token |
| Admin Dashboard | `/api/admin/dashboard/*` | Statistics, activity data |
| Student Dashboard | `/api/student/*` | Job recommendations, application status |
| Organization Dashboard | `/api/employer/*` | Active jobs, candidate matches |
| University Dashboard | `/api/university/*` | Student metrics, placement data |

## Features
- Complete REST API with role-based access control
- JWT authentication with secure middleware
- Role-specific dashboard data endpoints
- Comprehensive error handling
- Connection to PostgreSQL via Prisma ORM
- Master admin account auto-creation
- Environment configuration via .env.example

## Next Steps
1. Scaffold project structure (frontend, backend, shared, docs)
2. Map each screenshot to a route/component
3. Recreate UI and features, referencing MEMORY.md and documentation
4. Update MEMORY.md with every major architectural or feature change

---

*This file is the canonical reference for project architecture, features, and decisions. Always consult and update it before and after major changes.*
