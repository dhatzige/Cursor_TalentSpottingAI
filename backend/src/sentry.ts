import * as Sentry from "@sentry/node";
// Note: Profiling disabled temporarily due to native binary compatibility issues on Apple Silicon
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry() {
  Sentry.init({
    dsn: "https://5bf4da7ca78fe6d7dcf0ba45877b47e2@o4509535955648513.ingest.de.sentry.io/4509536137445456",
    integrations: [
      // Add profiling integration to set of integrations
      // nodeProfilingIntegration(), // Disabled temporarily
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    // profilesSampleRate: 1.0, // Disabled with profiling
    
    // Enable Sentry in all environments temporarily to debug
    enabled: true,
  });
} 