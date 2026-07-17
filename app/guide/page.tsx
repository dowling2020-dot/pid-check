import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EU PID readiness guide — how to prepare your catalogue for November 2026",
  description:
    "A step-by-step guide for non-EU sellers: inventory your SKUs, source manufacturer part numbers, register missing GTINs with GS1, and test with your carrier during the voluntary July–October 2026 window.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return (
    <div className="container-page py-12">
      <article className="prose-block max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">Readiness guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Getting your catalogue ready for EU Product Identifiers
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          If you sell into the EU from outside it, the rules for customs declarations on distance
          sales change during 2026. This guide walks through what to do, in order, so your parcels
          keep shipping after 1&nbsp;November&nbsp;2026.
        </p>

        <h2>The two dates that matter</h2>
        <ul>
          <li>
            <strong>1 July 2026</strong> — the EUR&nbsp;150 customs duty exemption is abolished
            (Council Regulation (EU)&nbsp;2026/382). A EUR&nbsp;3 flat duty applies per tariff line
            on consignments valued up to EUR&nbsp;150. From this date you may also declare Product
            Identifiers <em>voluntarily</em> — use this to test.
          </li>
          <li>
            <strong>1 November 2026</strong> — Product Identifiers become <em>mandatory</em> on
            customs declarations for distance sales. Declarations with missing or malformed PID data
            are rejected at electronic submission and the parcel cannot be tendered.
          </li>
        </ul>

        <h2>The three identifiers, briefly</h2>
        <ul>
          <li>
            <strong>M-PID (Merchant PID)</strong> — your identifier for the item: seller SKU, ASIN,
            or variant ID. Keep it consistent with your IOSS registration.
          </li>
          <li>
            <strong>NS-PID (Non-Standardised Manufacturer PID)</strong> — the manufacturer&apos;s
            part or model number. This is a distinct value from your SKU and usually has to be
            requested from the factory.
          </li>
          <li>
            <strong>S-PID (Standardised PID)</strong> — a GTIN / EAN / UPC / ISBN. Required only
            where one exists, but if the product has a barcode it must be present and pass its GS1
            check digit.
          </li>
        </ul>

        <h2>Step 1 — Inventory your SKUs</h2>
        <p>
          Export your full catalogue to a spreadsheet with one row per sellable variant. You need,
          at minimum, three columns: merchant SKU, manufacturer part number, and GTIN. Most sellers
          discover the manufacturer and GTIN columns are patchy — that is exactly the gap to close
          now, not in October.
        </p>
        <p>
          Watch for spreadsheet corruption while you do this: leading zeros stripped from GTINs,
          barcodes reformatted into scientific notation, and part numbers with stray spaces. A GTIN
          that looks right but has lost a leading zero will fail its check digit.
        </p>

        <h2>Step 2 — Source manufacturer part numbers (NS-PID)</h2>
        <p>
          For every SKU without a manufacturer part number, request it from the factory or supplier.
          Ask for the exact part/model number as it appears on the manufacturer&apos;s own
          documentation. Do not substitute your own SKU — an NS-PID identical to the M-PID is a
          common and detectable error.
        </p>

        <h2>Step 3 — Register missing GTINs with GS1 (S-PID)</h2>
        <p>
          Where a product should have a barcode but doesn&apos;t, obtain a GTIN from GS1 (the
          standards body that issues them) in the relevant country. If a product genuinely has no
          GTIN — for example a bespoke or unbranded item — that is acceptable; the S-PID is required
          only where one exists. Record explicitly which SKUs have &quot;no GTIN&quot; so it&apos;s a
          decision, not an oversight.
        </p>
        <p>
          Validate every GTIN you already hold. A GTIN-8, 12, 13 or 14 must pass the standard GS1
          modulo-10 check digit. You can paste a sample into the{" "}
          <Link href="/check" className="font-medium text-brand underline">
            checker
          </Link>{" "}
          to see which ones fail.
        </p>

        <h2>Step 4 — Test during the voluntary window (Jul–Oct 2026)</h2>
        <p>
          Because PIDs can be declared voluntarily from 1&nbsp;July&nbsp;2026, run real consignments
          through your carrier with the PID fields populated. Your carrier (FedEx, DHL and others)
          will accept the values, but remember they do not source or validate your catalogue — a
          declaration that is accepted operationally can still be built on data that will be rejected
          once validation is enforced. Treat the voluntary window as your rehearsal.
        </p>

        <h2>Step 5 — Lock it down before 31 October 2026</h2>
        <p>
          By the end of October you want: every SKU with a merchant identifier, every SKU with a
          distinct manufacturer part number, and every GTIN validated or explicitly marked as
          &quot;no GTIN exists&quot;. Re-run a sample check after each catalogue export, because the
          spreadsheet round-trip is where clean data quietly breaks.
        </p>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mt-0 text-lg font-semibold text-ink">Check a sample now</h3>
          <p className="mb-4 text-slate-600">
            See where your catalogue stands in about a minute. Nothing is uploaded.
          </p>
          <Link
            href="/check"
            className="inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
          >
            Open the SKU checker
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          This guide is general information, not legal or customs advice. Dates and rules cited:
          abolition of the EUR&nbsp;150 duty exemption and the EUR&nbsp;3 flat duty from
          1&nbsp;July&nbsp;2026 (Council Regulation (EU)&nbsp;2026/382); mandatory Product Identifier
          declaration from 1&nbsp;November&nbsp;2026. Confirm your specific obligations with a
          licensed customs professional.
        </p>
      </article>
    </div>
  );
}
