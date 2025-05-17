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

### Job Application System Components
Modular components for the application system, split to maintain file size under 400 lines:

| Component | File Path | Purpose |
|-----------|-----------|--------|
| ApplicationDetails | frontend/src/app/organization-dashboard/applications/components/ApplicationDetails.tsx | Detailed view of a selected application with status update functionality |
| ApplicationsList | frontend/src/app/organization-dashboard/applications/components/ApplicationsList.tsx | List of applications with selection capability |
| StatusBadge | frontend/src/app/organization-dashboard/applications/components/StatusBadge.tsx | Visual indicator for application status (pending, reviewing, interview, accepted, rejected) |
| StatusFilter | frontend/src/app/organization-dashboard/applications/components/StatusFilter.tsx | Filter control for application status |
| JobApplicationForm | frontend/src/app/job/[id]/components/JobApplicationForm.tsx | Form for students to apply for jobs with resume upload |

### Candidate Comparison Feature
Modular components for comparing multiple applications side-by-side:

| Component | File Path | Purpose |
|-----------|-----------|--------|
| ComparisonView | frontend/src/app/organization-dashboard/applications/components/comparison/ComparisonView.tsx | Container component for the comparison feature |
| CandidateCard | frontend/src/app/organization-dashboard/applications/components/comparison/CandidateCard.tsx | Card showing individual candidate details with skills match highlighting |
| SkillsMatchChart | frontend/src/app/organization-dashboard/applications/components/comparison/SkillsMatchChart.tsx | Bar chart visualizing skills match percentages between candidates |
| ComparisonHeader | frontend/src/app/organization-dashboard/applications/components/comparison/ComparisonHeader.tsx | Header with comparison controls and information |


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
- **Application:** Student applications to jobs with the following fields:
  - id: Unique identifier
  - jobId: Associated job
  - studentId: Applicant reference
  - status: Current stage (pending, reviewing, interview, accepted, rejected)
  - resume: Uploaded resume file
  - coverLetter: Student's statement of interest
  - feedback: Employer response/feedback
  - createdAt/updatedAt: Timestamp tracking

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

## Type System and Error Handling

### Type Definitions
The project uses TypeScript for type safety with the following organization:

| Type File | Path | Purpose |
|-----------|------|--------|
| application.ts | frontend/src/types/application.ts | Types for job applications, statuses, and component props |
| globals.d.ts | frontend/src/types/globals.d.ts | Global type declarations for JSX elements and common components |
| react.d.ts | frontend/src/types/react.d.ts | React and Next.js module type declarations |

### Service Layer
The project implements a service layer to handle business logic:

| Service | Path | Purpose |
|---------|------|--------|
| MatchingService | frontend/src/lib/services/MatchingService.ts | Advanced algorithms for candidate-job matching and ranking |

### TypeScript Configuration
The project uses a well-configured tsconfig.json with:
- ES2017 as the compilation target
- Strict type checking enabled
- Path aliases (@/* resolves to ./src/*)  
- Module resolution set to 'bundler'

## Implemented Features

### Job Management for Employers
- **Enhanced EmployerService API** with methods for job operations
- **JobForm component** with comprehensive fields
- **Jobs management interface** in organization dashboard

### Student Job Application System
- **Application Form** with resume upload and cover letter
- **Application Tracking** for students to monitor status
- **Application Review** for employers with status updates
- **Status Management** with visual indicators (badges, filters)
- **Candidate Comparison** for employers to compare up to 3 applicants with:
  - Side-by-side comparison of applications
  - Skills match visualization with required vs. preferred skills
  - Match percentage calculation based on job requirements
  - Visual highlighting of matching skills

### AI-Enhanced Matching Algorithm
- **Comprehensive Matching Service** with advanced algorithms for:
  - Detailed candidate-job compatibility scoring
  - Multi-factor matching (skills, experience, education, location)
  - Skills gap analysis for candidates
  - Weighted scoring system prioritizing critical requirements
  - Candidate ranking for efficient applicant review

## Next Steps
1. Add applicant analytics for employers (application statistics, pipeline visualization)
2. Improve mobile responsiveness of application interfaces
3. Implement bulk actions for applications (e.g., batch status updates)
4. Enhance the user experience with guided tours and tooltips

---

*This file is the canonical reference for project architecture, features, and decisions. Always consult and update it before and after major changes.*
