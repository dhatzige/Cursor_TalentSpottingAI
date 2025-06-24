import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://aee7ad795cbb1825667b9fe44c0c51c3@o4509535955648513.ingest.de.sentry.io/4509536137052240",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Enable Sentry in all environments temporarily to debug
  enabled: true,
}); 