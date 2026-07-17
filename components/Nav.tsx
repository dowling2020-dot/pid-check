import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <nav className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span className="grid h-6 w-6 place-items-center rounded bg-brand text-[11px] font-bold text-white">
            PID
          </span>
          <span>PID Check</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/guide" className="hidden text-slate-600 hover:text-ink sm:inline">
            Guide
          </Link>
          <Link
            href="/check"
            className="rounded-md bg-brand px-3 py-1.5 font-medium text-white transition hover:bg-brand-dark"
          >
            Check my SKUs
          </Link>
        </div>
      </nav>
    </header>
  );
}
