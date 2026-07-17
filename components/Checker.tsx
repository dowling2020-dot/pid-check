"use client";

import { useState } from "react";
import { checkInput, MAX_ROWS, type CheckResult, type Severity } from "@/lib/validate";
import EmailCapture from "@/components/EmailCapture";

const SAMPLE = `merchant_sku,manufacturer_part,gtin
SKU-40021-BLK,TP-8840A,5012345678900
SKU-40022-RED,SKU-40022-RED,5012345678900
SKU-40023-GRN,QX-119,5012345678901
SKU-40024-BLU,,
,ZR-500,00123456
SKU-40026-WHT,LM-77 A,501234 5678900`;

const badge: Record<Severity, string> = {
  pass: "bg-emerald-100 text-emerald-800",
  warn: "bg-amber-100 text-amber-800",
  fail: "bg-rose-100 text-rose-800",
};

const dot: Record<Severity, string> = {
  pass: "bg-emerald-500",
  warn: "bg-amber-500",
  fail: "bg-rose-500",
};

export default function Checker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  function run() {
    setResult(checkInput(input));
  }

  return (
    <div className="mt-8">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={"merchant_sku, manufacturer_part, gtin\nSKU-40021-BLK, TP-8840A, 5012345678900"}
        className="w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={run}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
          disabled={input.trim() === ""}
        >
          Validate {MAX_ROWS > 0 ? `(up to ${MAX_ROWS} rows)` : ""}
        </button>
        <button
          onClick={() => {
            setInput(SAMPLE);
            setResult(null);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Load example data
        </button>
        {(input || result) && (
          <button
            onClick={() => {
              setInput("");
              setResult(null);
            }}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {result && <Results result={result} />}
    </div>
  );
}

function Results({ result }: { result: CheckResult }) {
  const { summary, rows, truncated } = result;

  if (summary.total === 0) {
    return (
      <p className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No data rows found. Paste at least one row of merchant SKU, manufacturer part number and
        GTIN.
      </p>
    );
  }

  const scoreColor =
    summary.fail === 0 ? "text-emerald-600" : summary.fail <= summary.total / 2 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="mt-10">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Readiness score</p>
          <p className={`mt-1 text-3xl font-bold ${scoreColor}`}>{summary.score}%</p>
          <p className="mt-1 text-xs text-slate-500">rows without a blocking failure</p>
        </div>
        <Stat label="Pass" value={summary.pass} tone="pass" />
        <Stat label="Warn" value={summary.warn} tone="warn" />
        <Stat label="Fail" value={summary.fail} tone="fail" />
      </div>

      {truncated && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Only the first {MAX_ROWS} rows were checked — this is a sample tool. Trim your paste or use
          full-catalogue validation for larger sets.
        </p>
      )}

      {/* Row table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">M-PID</th>
              <th className="px-4 py-3 font-medium">NS-PID</th>
              <th className="px-4 py-3 font-medium">S-PID</th>
              <th className="px-4 py-3 font-medium">Findings &amp; remediation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.line} className="align-top">
                <td className="px-4 py-3 text-slate-400">{r.line}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${badge[r.severity]}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${dot[r.severity]}`} />
                    {r.severity}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.mpid || <em className="text-slate-300">empty</em>}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.nspid || <em className="text-slate-300">empty</em>}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.spid || <em className="text-slate-300">empty</em>}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-1.5">
                    {r.findings.map((f, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                        <span className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${dot[f.severity]}`} />
                        <span>{f.message}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results CTA */}
      <EmailCapture failCount={summary.fail} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: Severity }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tone === "pass" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : "text-rose-600"}`}>
        {value}
      </p>
    </div>
  );
}
