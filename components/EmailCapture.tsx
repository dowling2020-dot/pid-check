"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { FALLBACK_EMAIL, FALLBACK_SUBJECT, LEAD_CAPTURE_ENDPOINT } from "@/lib/site";
import type { CheckSummary } from "@/lib/validate";

// Email capture posts to a stateless Supabase Edge Function. This app stores
// nothing itself — no database, no client library, just a fetch. If the POST
// fails for any reason we degrade to a plain mailto link.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mailtoHref = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
  FALLBACK_SUBJECT
)}&body=${encodeURIComponent(
  "I'd like full-catalogue PID validation and GTIN remediation before the 1 November 2026 deadline. My store / catalogue size:"
)}`;

export default function EmailCapture({ summary }: { summary: CheckSummary }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [invalid, setInvalid] = useState(false);

  const failCount = summary.fail;
  const heading =
    failCount > 0
      ? `This checked a sample and found ${failCount} row${failCount === 1 ? "" : "s"} that would be rejected.`
      : "This checked a sample.";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setState("sending");
    try {
      const res = await fetch(LEAD_CAPTURE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "pid-check",
          payload: {
            rows_checked: summary.total,
            pass: summary.pass,
            warn: summary.warn,
            fail: summary.fail,
          },
        }),
      });
      if (res.status === 200) {
        setState("done");
        track("lead_submit_success");
      } else {
        setState("error");
        track("lead_submit_error", { status: res.status });
      }
    } catch {
      setState("error");
      track("lead_submit_error", { status: 0 });
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-ink p-6 text-white sm:p-8">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/75">
        For full-catalogue validation and GTIN remediation before 31&nbsp;October&nbsp;2026, leave
        your email and we&apos;ll be in touch. No spam, no account required.
      </p>

      {state === "done" ? (
        <p className="mt-5 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200">
          Thanks — we&apos;ll be in touch before the 1&nbsp;November deadline.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row" noValidate>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (invalid) setInvalid(false);
            }}
            placeholder="you@yourstore.com"
            aria-invalid={invalid}
            className="w-full flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Notify me"}
          </button>
        </form>
      )}

      {invalid && (
        <p className="mt-3 text-sm text-amber-300">Enter a valid email address.</p>
      )}

      {state === "error" && (
        <p className="mt-3 text-sm text-rose-300">
          Something went wrong sending that. Please email{" "}
          <a className="underline" href={mailtoHref}>
            {FALLBACK_EMAIL}
          </a>{" "}
          instead.
        </p>
      )}
    </section>
  );
}
