import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "@/components/Countdown";

export const metadata: Metadata = {
  title: "EU Product Identifier (PID) requirements from 1 November 2026",
  description:
    "From 1 November 2026 EU customs declarations for distance sales must carry Product Identifiers (M-PID, NS-PID, S-PID) per line. Check your SKU catalogue is ready — free, in-browser.",
  alternates: { canonical: "/" },
};

const pids = [
  {
    tag: "M-PID",
    name: "Merchant PID",
    body: "Your own identifier for the item — seller SKU, ASIN, or variant ID. Must be consistent with your IOSS registration.",
    example: "SKU-40021-BLK",
  },
  {
    tag: "NS-PID",
    name: "Non-Standardised Manufacturer PID",
    body: "The manufacturer's part or model number. Sourced from the factory that makes the product — not the same as your SKU.",
    example: "MFR: TP-8840A",
  },
  {
    tag: "S-PID",
    name: "Standardised PID",
    body: "A GTIN / EAN / UPC / ISBN barcode number, required where one exists. Must pass the GS1 check digit or it is rejected.",
    example: "5012345678900",
  },
];

const faqs = [
  {
    q: "What is a PID?",
    a: "A Product Identifier is a value that identifies a product on a customs declaration. From 1 November 2026 the EU requires up to three per line item: the Merchant PID (M-PID), the Non-Standardised Manufacturer PID (NS-PID), and — where one exists — the Standardised PID (S-PID, a GTIN/EAN/UPC/ISBN).",
  },
  {
    q: "Doesn't my carrier (FedEx / DHL) handle this for me?",
    a: "No. Carriers already require you to supply these values, but they do not source them from your catalogue and do not validate them. If your data is missing or malformed, the declaration is rejected at electronic submission and the parcel cannot be tendered. The obligation to have correct PID data sits with you, the seller.",
  },
  {
    q: "What happens on 1 November 2026?",
    a: "Customs declarations for distance sales into the EU must include the required Product Identifiers per line item. Declarations with missing or malformed PID data are rejected at electronic submission — meaning the parcel simply cannot be shipped until the data is fixed.",
  },
  {
    q: "Can I test before the deadline?",
    a: "Yes. PIDs can be declared voluntarily from 1 July 2026, so you can run live consignments through the process during the July–October window and fix problems before they become blocking.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              EU distance-sales customs · effective 1 November 2026
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Is your SKU catalogue ready for EU Product Identifiers?
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              From 1&nbsp;November&nbsp;2026, EU customs declarations for distance sales must carry a
              Product Identifier per line — M-PID, NS-PID and, where one exists, a valid S-PID
              (GTIN). Missing or malformed data is rejected at submission and the parcel can&apos;t
              ship. Paste a sample of your SKUs and see where you stand.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/check"
                className="rounded-lg bg-brand px-5 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
              >
                Check my SKUs — free, in-browser
              </Link>
              <Link
                href="/guide"
                className="rounded-lg border border-white/25 px-5 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
              >
                Read the readiness guide
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/50">
              Nothing you paste is uploaded. All validation runs on your device.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Countdown />
            <hr className="my-6 border-white/10" />
            <p className="text-sm text-white/70">
              The EUR&nbsp;150 duty exemption was abolished on 1&nbsp;July&nbsp;2026 (Council
              Regulation (EU)&nbsp;2026/382); a EUR&nbsp;3 flat duty now applies per tariff line on
              consignments up to EUR&nbsp;150. PID declaration becomes mandatory four months later.
            </p>
          </div>
        </div>
      </section>

      {/* Three PIDs */}
      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          The three identifiers you&apos;ll be asked for
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Each consignment line needs these fields. The most common failures are an empty
          manufacturer number, a manufacturer number copied from the SKU, and a GTIN that fails its
          check digit.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pids.map((p) => (
            <div key={p.tag} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <span className="rounded bg-ink px-2 py-1 text-xs font-bold tracking-wide text-white">
                  {p.tag}
                </span>
                <code className="text-xs text-slate-400">{p.example}</code>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Failure mode */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container-page grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              What &quot;rejected at submission&quot; actually means
            </h2>
            <p className="mt-3 text-slate-600">
              The rejection happens electronically, before the parcel is tendered to the carrier.
              There is no manual review, no grace, and no one fixing the data on your behalf. A
              single malformed GTIN on a line blocks that declaration.
            </p>
          </div>
          <ol className="space-y-3">
            {[
              "You submit the customs declaration with your PID values per line.",
              "The system checks each PID field is present and well-formed.",
              "If any required field is missing or malformed, the declaration is rejected.",
              "The parcel cannot be tendered until you correct the data and resubmit.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA band */}
      <section className="container-page py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Find your problem rows in about a minute
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Paste up to 50 rows of merchant SKU, manufacturer part number and GTIN. We&apos;ll flag
          the empties, the duplicates and the failing check digits — right in your browser.
        </p>
        <Link
          href="/check"
          className="mt-7 inline-block rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          Open the SKU checker
        </Link>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="container-page py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Frequently asked</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                  <span className="flex items-center justify-between">
                    {f.q}
                    <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
