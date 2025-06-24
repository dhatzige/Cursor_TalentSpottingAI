import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }

  // For client-side initialization, we'll use the instrumentation-client.ts file
  // This replaces the deprecated sentry.client.config.ts approach
  if (typeof window !== 'undefined') {
    await import('./instrumentation-client');
  }
}

export const onRequestError = Sentry.captureRequestError; 