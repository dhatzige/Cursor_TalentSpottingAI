# Client-Side Hooks in Next.js App Router

## Problem

Next.js App Router precompiles pages for better performance, but this can cause issues with client-side hooks like `useSearchParams()` that are only available in the browser. When these hooks are used directly in pages or components that are rendered during server-side rendering (SSR), you'll encounter errors like:

```
useSearchParams() should be wrapped in a suspense boundary at page "/path". 
Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
```

## Solution

We've implemented a comprehensive approach to handle client-side hooks safely:

### 1. Custom Safe Hooks

We created custom hooks that safely handle client-side functionality:

- `useSafeSearchParams`: A wrapper around `useSearchParams` that only accesses the search parameters on the client side.

### 2. Force Dynamic Rendering

For pages that use client-side hooks (directly or indirectly):

```typescript
'use client';

// Add this directive to disable prerendering
export const dynamic = 'force-dynamic';

// Rest of your page component
```

This directive tells Next.js not to prerender the page, avoiding SSR-related errors with client-side hooks.

### 3. Best Practices

- **Always use `useSafeSearchParams` instead of `useSearchParams`** in any component that might be rendered during SSR.
- **Add `export const dynamic = 'force-dynamic';`** to pages that use client-side hooks or components that use them.
- **Keep client-side logic in useEffect hooks** to ensure it only runs in the browser.

## Implementation Details

### useSafeSearchParams Hook

Our custom hook safely handles search parameters by:

1. Initializing with safe default values
2. Only accessing `useSearchParams` inside a `useEffect` hook
3. Providing a consistent API that matches the original `useSearchParams`

```typescript
// Example usage
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';

function MyComponent() {
  const searchParams = useSafeSearchParams();
  const query = searchParams.get('q');
  
  // Rest of your component
}
```

### Automatic Dynamic Directive

We've created a script (`scripts/add-dynamic-directive.js`) that automatically adds the `dynamic = 'force-dynamic'` directive to client-side pages. Run it with:

```bash
node scripts/add-dynamic-directive.js
```

## Protected Routes with Clerk

Route protection is handled by the `useProtectedRoute` hook located in `src/lib/hooks`. This hook is powered by [Clerk](https://clerk.com/) and ensures a consistent and secure authentication flow.

### Usage

```typescript
// In a page or layout component
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

export default function DashboardPage() {
  // Protect this route, only allowing users with the 'admin' role.
  const { loading } = useProtectedRoute(['admin']);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render page content for authorized users
  return <h1>Admin Dashboard</h1>;
}
```

### How it Works

1.  **Authentication Check**: The hook first checks if the user is signed in using Clerk's `useAuth()` hook. If not, it redirects them to the sign-in page.
2.  **Role-Based Authorization**: If `allowedRoles` are specified, the hook checks the user's role (stored in `user.unsafeMetadata.role`). If the user's role is not in the allowed list, they are redirected to their default dashboard.
3.  **Loading State**: The hook returns a `loading` state, which is true while Clerk is initializing and checking the user's session. This can be used to show a loading indicator and prevent content from flashing.

With the move to Clerk, the previous development authentication bypass (`?dev_bypass=true`) has been removed. Developers should now use Clerk's user management features for testing different roles.

## Troubleshooting

If you encounter build errors related to client-side hooks:

1. Check if the page has `export const dynamic = 'force-dynamic';`
2. Ensure all components are using `useSafeSearchParams` instead of `useSearchParams`
3. Check if any other client-side hooks are being used directly during SSR
4. Run the automatic script to add dynamic directives to all client pages

## References

- [Next.js Documentation on Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js Documentation on Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)
- [Next.js Documentation on useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
