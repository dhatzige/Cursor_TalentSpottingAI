# MEMORY

## 2025-06-18 UI Redesign: FeatureCarousel Component

### Summary
- Added reusable `FeatureCarousel` component (`frontend/src/components/home/FeatureCarousel.tsx`).
- Replaced legacy coloured feature grids on landing pages (Employers, Students, Universities) with the new carousel.
- Removed duplicate/legacy markup sections and the `.hero-bg-animation` overlay divs.

### Usage Snippet
```tsx
import FeatureCarousel from '@/components/home/FeatureCarousel';

const FEATURES = [
  { icon: '🤖', title: 'AI Talent Matching', description: 'Our algorithm finds perfect candidates.' },
  { icon: '📈', title: 'Advanced Analytics', description: 'Track hiring metrics in real-time.' },
  // ...
];

<FeatureCarousel features={FEATURES} />
```

### Outstanding Tasks
1. Remove unused `.hero-bg-animation` CSS from stylesheets.
2. Resolve remaining ESLint `any`-type warnings.
3. Consider adding gentle fade-in or auto-scroll animations to the carousel.

---
_Last updated: 2025-06-18_
