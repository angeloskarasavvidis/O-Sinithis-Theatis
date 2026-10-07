export const SITE_NAME = "Ο Συνήθης Θεατής";
export const SITE_DESCRIPTION = "Κριτικές, αφιερώματα και νέα κινηματογράφου";

// Server-side only: the public address of the site, without a trailing slash.
// Set NEXT_PUBLIC_SITE_URL to override; on Vercel the production domain is picked up automatically.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
