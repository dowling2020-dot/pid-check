import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="font-semibold text-ink">PID Check</p>
          <p>
            An independent readiness tool for the EU Product Identifier rules taking effect on
            1&nbsp;November&nbsp;2026. All checks run in your browser — nothing you paste is uploaded
            or stored.
          </p>
          <p className="text-xs text-slate-500">
            Not legal advice. PID Check is an independent tool and is not affiliated with, endorsed
            by, or connected to the European Commission, GS1, or any carrier (including FedEx or
            DHL). Verify your obligations with a customs professional.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="hover:text-ink">Home</Link>
          <Link href="/check" className="hover:text-ink">SKU checker</Link>
          <Link href="/guide" className="hover:text-ink">Readiness guide</Link>
        </nav>
      </div>
    </footer>
  );
}
