// Test setup file for component and integration tests

// Mock Next.js components and hooks that are commonly used
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn(key => {
      if (key === 'id') return 'test-job-id';
      return null;
    })
  }),
  useParams: () => ({
    id: 'test-id'
  })
}));

// Mock Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Using createElement instead of JSX since this is a .ts file, not .tsx
    return {
      type: 'img',
      props: { ...props, alt: props.alt || '' }
    };
  }
}));

// Mock API services
jest.mock('../lib/api', () => ({
  EmployerService: {
    getJobById: jest.fn(() => Promise.resolve({
      id: 'test-job-id',
      title: 'Test Job',
      description: 'Job description',
      location: 'Remote',
      skills: ['React', 'TypeScript'],
      status: 'open',
      postDate: '2023-01-01'
    })),
    createJob: jest.fn(() => Promise.resolve({ success: true })),
    updateJob: jest.fn(() => Promise.resolve({ success: true })),
    updateJobStatus: jest.fn(() => Promise.resolve({ success: true }))
  }
}));

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
