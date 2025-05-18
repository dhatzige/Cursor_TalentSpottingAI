# Talent Spotting AI Frontend Architecture

## Overview

The Talent Spotting AI frontend is built with a modular, component-based architecture using Next.js, React, and TypeScript. The application follows a clear separation of concerns and emphasizes type safety and reusability.

## Core Architectural Principles

1. **Modularity**: Components are self-contained with clear interfaces
2. **Type Safety**: Comprehensive TypeScript definitions for all components and data
3. **Performance**: Optimized rendering with memoization and code splitting
4. **Testability**: Components designed for easy unit and integration testing

## Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Application pages and components
│   │   ├── components/         # Shared UI components
│   │   │   ├── ui/             # Basic UI elements
│   │   │   └── layout/         # Layout components
│   │   ├── [feature]/          # Feature-specific pages
│   │       └── components/     # Feature-specific components
│   ├── lib/                    # Shared utilities and services
│   │   ├── api/                # API service modules
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # Utility functions
│   ├── test/                   # Test setup and utilities
│   └── types/                  # Global TypeScript type definitions
└── docs/                       # Project documentation
```

## React 19 Compatibility

The application has been refactored to work with React 19, which introduces several breaking changes from previous versions. To ensure compatibility, we've implemented the following strategies:

### Type Definitions

Custom type definitions have been created to handle React 19's evolved type system:

```typescript
// src/types/react.d.ts - Example of React 19 event type definitions
declare module 'react' {
  export interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {}
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }
  
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, KeyboardEvent> {
    key: string;
    code: string;
    // Other keyboard event properties
  }
}
```

### Compatibility Layer

A compatibility layer (`react-compat.tsx`) has been implemented to bridge API differences:

```typescript
// Simple implementation of memo for React 19
export function memo<P extends object>(
  Component: React.FC<P>,
  areEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.FC<P> {
  const MemoComponent: React.FC<P> = (props) => {
    return <Component {...props} />;
  };
  
  (MemoComponent as any).displayName = `Memo(${(Component as any).name || 'Component'})`;
  
  return MemoComponent;
}
```

### Dynamic Imports

Code splitting is implemented using dynamic imports with proper loading states:

```typescript
export function dynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: { loading?: boolean } = {}
) {
  const LoadingComponent = createLoadingComponent(options.loading);
  return dynamic(importFn, { loading: LoadingComponent });
}
```

## Testing Infrastructure

The application uses Jest and React Testing Library for comprehensive testing:

- **Test Configuration**: A separate TypeScript configuration (`tsconfig.test.json`) is used for tests
- **Type Definitions**: Custom type definitions for testing libraries ensure TypeScript compatibility
- **Jest Setup**: Mocks for Next.js components and API services are configured in the Jest setup file

## Component Patterns

### UI Components

Basic UI components follow a consistent pattern:
- Clear TypeScript interfaces for props
- Default exports for simpler imports
- Minimal dependencies on other components
- Designed for reusability across features

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, onClick, disabled }: ButtonProps) {
  // Component implementation
}

export default Button;
```

### Feature Components

Feature-specific components:
- Organized by feature domain
- May compose multiple UI components
- Handle specific business logic
- Typically connected to API services

### Form Handling

Forms follow a consistent pattern:
- Controlled inputs with React state
- Clear validation logic
- Typed form data interfaces
- Consistent error handling

## TypeScript Patterns

### Base Interfaces and Extension

We use interface extension to build on base types:

```typescript
// Base interface
interface JobDataBase {
  title: string;
  description: string;
  location: string;
  skills: string[];
}

// Extended for form usage
interface JobFormData extends Omit<JobDataBase, 'skills'> {
  skillsInput: string;
  status: JobStatus;
}

// Extended for API responses
interface JobData extends JobDataBase {
  id: string;
  status: JobStatus;
}
```

### Type Guards

Type guards are used to validate data at runtime:

```typescript
function isValidJobStatus(status: string): status is JobStatus {
  return ['open', 'closed', 'draft'].includes(status);
}
```

### Discriminated Unions

For complex state management:

```typescript
type JobEditState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: JobData }
  | { status: 'error', error: string };
```

## Performance Optimizations

### Memoization

Components that render frequently use memoization:

```typescript
import { memoize } from '@/lib/utils/performance';

const MemoizedComponent = memoize(MyComponent);
```

### Code Splitting

Large features use dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});
```

## Testing Strategy

### Unit Tests

Simple components are tested in isolation:

```typescript
test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Tests

Complex components are tested with their dependencies:

```typescript
test('JobEditForm submits data correctly', async () => {
  render(<JobEditForm jobId="123" initialData={mockData} />);
  
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
  fireEvent.click(screen.getByText(/update/i));
  
  await waitFor(() => {
    expect(mockApiService.updateJob).toHaveBeenCalledWith('123', expect.objectContaining({
      title: 'New Title'
    }));
  });
});
```

## API Integration

Services are organized by domain and use TypeScript for request/response typing:

```typescript
export const EmployerService = {
  async getJobs(): Promise<JobsResponse> {
    const response = await fetch('/api/employer/jobs');
    return response.json();
  },
  
  async createJob(data: JobPostRequest): Promise<JobResponse> {
    const response = await fetch('/api/employer/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```
