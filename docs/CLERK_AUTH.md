# Clerk Authentication System

## Overview
TalentSpottingAI uses **Clerk v4** for complete authentication and user management across both frontend and backend systems.

## Environment Variables
Required environment variables for Clerk integration:

```env
# Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend (.env)
CLERK_SECRET_KEY=sk_test_...
```

## Architecture

### Frontend Authentication
- **Middleware**: `src/middleware.ts` handles basic authentication redirects server-side
- **Hook**: `useProtectedRoute` manages client-side role validation and permissions
- **Development Bypass**: `?dev_bypass=true` parameter allows skipping auth in development

### Backend Authentication
- **Middleware**: `clerkAuth` validates Clerk tokens on all protected routes
- **Token Validation**: Uses `@clerk/clerk-sdk-node` to verify JWT tokens from Clerk
- **Routes**: All API routes now use `clerkAuth` instead of legacy JWT `authenticateToken`

## API Authentication Flow

### Frontend API Calls
```typescript
// Services now accept getToken function from useAuth()
const { getToken } = useAuth();
const stats = await StudentService.getDashboardStats(getToken);
```

### Backend Route Protection
```typescript
// All routes use clerkAuth middleware
import { clerkAuth } from '../middleware/clerkAuth';
router.use(clerkAuth);
```

## User Onboarding Flow

1. **Sign Up/Sign In**: Users authenticate via Clerk
2. **Role Selection**: New users redirected to `/onboarding` to select role
3. **Metadata Storage**: Role stored in `user.unsafeMetadata.role`
4. **Dashboard Redirect**: Users redirected to appropriate role-based dashboard

## Role-Based Dashboards

| Role | Dashboard Route |
|------|----------------|
| Student | `/student-dashboard` |
| Employer | `/organization-dashboard` |
| University | `/university-dashboard` |
| Admin | `/admin-dashboard` |

## Middleware Logic

### Server-Side (`src/middleware.ts`)
- Redirects unauthenticated users from protected routes to `/sign-in`
- Allows all users to access public routes (/, /blog, /jobs, etc.)
- Minimal logic to avoid conflicts with client-side handling

### Client-Side (`useProtectedRoute`)
- Validates user roles and permissions
- Handles role-based redirects after authentication
- Manages loading states during auth checks

## Recent Fixes (2025-06-21)

### Problem Resolved
- **Issue**: Redirect loops between `/sign-in`, `/onboarding`, and dashboards
- **Root Cause**: Frontend (Clerk tokens) and backend (JWT tokens) authentication mismatch
- **Solution**: Unified all routes to use Clerk authentication

### Files Updated
- `backend/src/routes/*.ts` - All routes now use `clerkAuth` middleware
- `frontend/src/lib/api/*.service.ts` - Services accept `getToken` parameter
- `frontend/src/app/student-dashboard/page.tsx` - Passes `getToken` to API calls

## Development Guidelines

### Testing Authentication
- Use `?dev_bypass=true` for UI development without authentication
- Test role-based access by switching user roles in Clerk dashboard
- Verify API calls include proper Authorization headers

### Adding New Protected Routes

#### Frontend
```typescript
// Add to middleware.ts protected routes
const isProtectedRoute = createRouteMatcher([
  '/your-new-route(.*)',
]);
```

#### Backend
```typescript
// Use clerkAuth middleware
import { clerkAuth } from '../middleware/clerkAuth';
router.use(clerkAuth);
```

### API Service Pattern
```typescript
// Accept getToken parameter
export const YourService = {
  getData: async (getToken: () => Promise<string | null>) => {
    const axios = await createAuthenticatedRequest(getToken);
    return axios.get('/your-endpoint');
  }
};

// Use in components
const { getToken } = useAuth();
const data = await YourService.getData(getToken);
```

## Security Notes

- **Token Expiration**: Clerk handles token refresh automatically
- **Role Validation**: Both client and server validate user roles
- **Public Routes**: Accessible without authentication
- **Development Mode**: `dev_bypass` only works in `NODE_ENV=development`

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check if route uses `clerkAuth` and API call includes token
2. **Redirect Loops**: Verify middleware and client-side logic don't conflict
3. **Role Access**: Ensure user has correct role in Clerk metadata

### Debug Steps
1. Check browser console for authentication errors
2. Verify Clerk environment variables are set
3. Test API endpoints with proper Authorization headers
4. Use Clerk dashboard to inspect user metadata

---
*Last updated: 2025-06-21*
