"use client";

import { useState } from "react";
import { FALLBACK_EMAIL, FORM_ENDPOINT } from "@/lib/site";

// Email capture with ZERO backend infrastructure.
// - If FORM_ENDPOINT is configured (a Formspree-style static form endpoint),
//   we POST the email there.
// - If it is null (the default), we fall back to a plain mailto link.
// Either way there is no database and nothing is stored by this app.

export default function EmailCapture({ failCount }: { failCount: number }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const heading =
    failCount > 0
      ? `This checked a sample and found ${failCount} row${failCount === 1 ? "" : "s"} that would be rejected.`
      : "This checked a sample.";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!FORM_ENDPOINT) return; // mailto path handles it
    setState("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "pid-check /check" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
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
          Thanks — we&apos;ve got your email and will reach out about full-catalogue validation.
        </p>
      ) : FORM_ENDPOINT ? (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourstore.com"
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
      ) : (
        // No endpoint configured yet — mailto fallback, still zero infrastructure.
        <a
          href={`mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
            "Full-catalogue PID validation"
          )}&body=${encodeURIComponent(
            "I'd like full-catalogue PID validation and GTIN remediation before the 1 November 2026 deadline. My store / catalogue size:"
          )}`}
          className="mt-5 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Email us about full-catalogue validation
        </a>
      )}

      {state === "error" && (
        <p className="mt-3 text-sm text-rose-300">
          Something went wrong sending that. Please email{" "}
          <a className="underline" href={`mailto:${FALLBACK_EMAIL}`}>
            {FALLBACK_EMAIL}
          </a>{" "}
          instead.
        </p>
      )}
    </section>
  );
}
