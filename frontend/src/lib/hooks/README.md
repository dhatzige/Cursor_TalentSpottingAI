# Custom Hooks

This directory contains custom React hooks used throughout the application. These hooks are designed to handle common patterns and provide consistent behavior across components.

## Safe Client-Side Hooks

### useSafeSearchParams

A wrapper around Next.js's `useSearchParams` that safely handles search parameters in both client and server environments. This hook prevents the "useSearchParams() should be wrapped in a suspense boundary" error during server-side rendering by only accessing search parameters on the client side.

```typescript
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';

function MyComponent() {
  const searchParams = useSafeSearchParams();
  const query = searchParams.get('q');
  
  // Use query safely
}
```

### useProtectedRoute

Protects routes based on authentication and user roles. This hook uses `useSafeSearchParams` internally to avoid SSR issues.

```typescript
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

function ProtectedPage() {
  const { loading } = useProtectedRoute(['admin']);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Protected content
}
```

## Other Hooks

### useAuth

Manages authentication state and provides login/logout functionality.

### useSaveSettings

Reusable hook for persisting dashboard settings.

## Best Practices

1. **Always use safe versions of client-side hooks** in any component that might be rendered during SSR.
2. **Add `export const dynamic = 'force-dynamic';`** to pages that use client-side hooks.
3. **Keep client-side logic in useEffect hooks** to ensure it only runs in the browser.

For more detailed information about handling client-side hooks in Next.js, see the [CLIENT_SIDE_HOOKS.md](/docs/CLIENT_SIDE_HOOKS.md) documentation.
