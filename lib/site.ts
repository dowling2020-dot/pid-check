// Central site constants. Update SITE_URL to the production domain once known.
export const SITE_URL = "https://pid-check.vercel.app";

export const SITE_NAME = "PID Check";
export const SITE_TAGLINE =
  "EU Product Identifier readiness for non-EU sellers — check your SKUs before 1 November 2026.";

// The mandatory PID deadline for EU customs declarations on distance sales.
export const PID_DEADLINE_ISO = "2026-11-01T00:00:00Z";

// Formspree-style endpoint for the email capture form.
// TODO(john): replace with a real Formspree (or equivalent static form) endpoint.
// While this is null the checker falls back to a mailto link — no database, ever.
export const FORM_ENDPOINT: string | null = null;
export const FALLBACK_EMAIL = "hello@pid-check.example";
