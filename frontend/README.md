# Talent Spotting AI Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Key Features

- **Next.js App Router**: Modern routing system with server and client components
- **TypeScript**: Type-safe code throughout the application
- **TailwindCSS**: Utility-first CSS framework for styling
- **Custom Hooks**: Safe client-side hooks for handling search parameters and protected routes
- **Dashboard Layouts**: Unified dashboard layouts for different user roles

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Client-Side Hooks and Build Optimizations

This project implements a robust solution for handling client-side hooks in Next.js App Router:

### Safe Client-Side Hooks

We've created custom hooks that safely handle client-side functionality:

```typescript
// Use this instead of useSearchParams from next/navigation
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';

function MyComponent() {
  const searchParams = useSafeSearchParams();
  const query = searchParams.get('q');
  // Rest of your component
}
```

### Force Dynamic Rendering

For pages that use client-side hooks (directly or indirectly):

```typescript
'use client';

// Add this directive to disable prerendering
export const dynamic = 'force-dynamic';

// Rest of your page component
```

### Automatic Script

We've created a script that automatically adds the `dynamic = 'force-dynamic'` directive to client-side pages:

```bash
node scripts/add-dynamic-directive.js
```

For more detailed information, see the [CLIENT_SIDE_HOOKS.md](/docs/CLIENT_SIDE_HOOKS.md) documentation.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Feature Carousel Component (2025-06-18)

Landing pages now use a reusable horizontally-scrollable carousel to showcase features.

### Usage
```tsx
import FeatureCarousel from '@/components/home/FeatureCarousel';

const FEATURES = [
  { icon: '🤖', title: 'AI Talent Matching', description: 'Find the best candidates automatically.' },
  { icon: '📈', title: 'Analytics', description: 'Track key hiring metrics.' },
  // …
];

<FeatureCarousel features={FEATURES} />
```

The component accepts an array of objects with the keys `icon`, `title`, and `description` (all required). Icons can be emoji strings or React nodes.

### Styling / Behaviour
* Built with Tailwind CSS.
* Uses CSS `scroll-snap` for neat card alignment.
* Works with mouse wheel, drag, and touch swipe.

Add or adjust Tailwind classes in `FeatureCarousel.tsx` to customize appearance.
