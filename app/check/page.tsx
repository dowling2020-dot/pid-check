import type { Metadata } from "next";
import Checker from "@/components/Checker";

export const metadata: Metadata = {
  title: "PID checker — validate your SKU sample for EU customs",
  description:
    "Paste up to 50 SKUs (merchant SKU, manufacturer part number, GTIN) and check them against the EU Product Identifier rules. GS1 check-digit validation runs entirely in your browser.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  return (
    <div className="container-page py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Check your SKU sample
        </h1>
        <p className="mt-3 text-slate-600">
          Paste up to 50 rows below — comma or tab separated, in the order{" "}
          <strong>merchant SKU, manufacturer part number, GTIN</strong>. A header row is optional.
          Everything runs in your browser; nothing is uploaded.
        </p>
      </header>
      <Checker />
    </div>
  );
}
