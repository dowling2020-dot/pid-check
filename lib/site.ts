// Central site constants. Update SITE_URL to the production domain once known.
export const SITE_URL = "https://pid-check.vercel.app";

export const SITE_NAME = "PID Check";
export const SITE_TAGLINE =
  "EU Product Identifier readiness for non-EU sellers — check your SKUs before 1 November 2026.";

// The mandatory PID deadline for EU customs declarations on distance sales.
export const PID_DEADLINE_ISO = "2026-11-01T00:00:00Z";

// Lead-capture endpoint (Supabase Edge Function). Stateless from this app's
// point of view — we POST the email + validation summary and forget it. No
// database or client library is bundled here; it's a plain fetch.
export const LEAD_CAPTURE_ENDPOINT =
  "https://gzcsyuuszqihktjktzfw.supabase.co/functions/v1/lead-capture";

// mailto fallback used when the endpoint POST fails for any reason.
export const FALLBACK_EMAIL = "dowling2020@gmail.com";
export const FALLBACK_SUBJECT = "PID full-catalogue validation";
