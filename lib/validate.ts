// Client-side PID sample validation.
// Parses pasted CSV / tab-separated rows and validates each against the three
// PID fields required for EU customs declarations from 1 November 2026:
//   - M-PID  (Merchant PID)             : seller SKU / ASIN / variant id
//   - NS-PID (Non-Standardised Mfr PID) : manufacturer part / model number
//   - S-PID  (Standardised PID)         : GTIN / EAN / UPC / ISBN, where one exists
//
// Everything here is pure and runs in the browser. No data leaves the device.

import { validateGtin } from "./gtin";

export const MAX_ROWS = 50;

export type Severity = "pass" | "warn" | "fail";

export interface FieldFinding {
  severity: Severity;
  message: string;
}

export interface RowResult {
  line: number;
  mpid: string;
  nspid: string;
  spid: string;
  severity: Severity; // worst severity across findings
  findings: FieldFinding[];
}

export interface CheckSummary {
  total: number;
  pass: number;
  warn: number;
  fail: number;
  score: number; // 0-100, share of rows that are not failing
}

// Header tokens we recognise so a header row can be skipped gracefully.
const HEADER_TOKENS = [
  "sku",
  "merchant",
  "mpid",
  "m-pid",
  "part",
  "manufacturer",
  "nspid",
  "ns-pid",
  "gtin",
  "ean",
  "upc",
  "barcode",
  "spid",
  "s-pid",
];

function splitLine(line: string): string[] {
  // Tab wins if present; otherwise comma. Semicolons tolerated as a fallback
  // because some EU locale spreadsheet exports use them.
  if (line.includes("\t")) return line.split("\t");
  if (line.includes(",")) return line.split(",");
  if (line.includes(";")) return line.split(";");
  return [line];
}

function looksLikeHeader(cells: string[]): boolean {
  const joined = cells.join(" ").toLowerCase();
  const hits = HEADER_TOKENS.filter((t) => joined.includes(t)).length;
  // Two or more header-ish tokens and no obvious data → treat as header.
  return hits >= 2;
}

function hasEmbeddedSpace(v: string): boolean {
  return /\S\s+\S/.test(v.trim());
}

function validateRow(line: number, cells: string[]): RowResult {
  const mpid = (cells[0] ?? "").trim();
  const nspid = (cells[1] ?? "").trim();
  const spid = (cells[2] ?? "").trim();

  const findings: FieldFinding[] = [];

  // (a) M-PID present and non-empty.
  if (mpid === "") {
    findings.push({
      severity: "fail",
      message:
        "M-PID (merchant SKU) is empty. Every consignment line must carry a merchant identifier consistent with your IOSS registration.",
    });
  } else if (hasEmbeddedSpace(mpid)) {
    findings.push({
      severity: "warn",
      message:
        "M-PID contains embedded spaces — check the field was not split or concatenated on export.",
    });
  }

  // (b) NS-PID present; flag if identical to M-PID.
  if (nspid === "") {
    findings.push({
      severity: "fail",
      message:
        "NS-PID (manufacturer part/model number) is empty. Request the part number from your factory or supplier.",
    });
  } else if (mpid !== "" && nspid.toLowerCase() === mpid.toLowerCase()) {
    findings.push({
      severity: "fail",
      message:
        "NS-PID is identical to the M-PID. These must be distinct identifiers — the manufacturer part number is not your SKU.",
    });
  } else if (hasEmbeddedSpace(nspid)) {
    findings.push({
      severity: "warn",
      message:
        "NS-PID contains embedded spaces — verify the manufacturer part number is exactly as issued.",
    });
  }

  // (c) S-PID: validate GTIN structure + check digit if present; soft-flag if absent.
  if (spid === "") {
    findings.push({
      severity: "warn",
      message:
        "S-PID (GTIN/EAN/UPC) is empty. Confirm no GTIN exists for this product — S-PID is required only where one exists. If the product has a barcode, add it.",
    });
  } else {
    const gtin = validateGtin(spid);
    if (gtin.valid) {
      if (/\s/.test(spid)) {
        findings.push({
          severity: "warn",
          message:
            "S-PID check digit is valid but the value contained whitespace. Store the GTIN as a clean digit string.",
        });
      } else if (spid.startsWith("0") && (spid.length === 12 || spid.length === 13)) {
        findings.push({
          severity: "warn",
          message:
            "S-PID has leading zeros. Ensure these are preserved — spreadsheets often strip them and corrupt the GTIN.",
        });
      }
    } else {
      findings.push({
        severity: "fail",
        message: `S-PID is not a valid GTIN: ${gtin.reason}. A malformed identifier is rejected at electronic submission.`,
      });
    }
  }

  const severity: Severity = findings.some((f) => f.severity === "fail")
    ? "fail"
    : findings.some((f) => f.severity === "warn")
    ? "warn"
    : "pass";

  if (findings.length === 0) {
    findings.push({ severity: "pass", message: "All three PID fields present and well-formed." });
  }

  return { line, mpid, nspid, spid, severity, findings };
}

export interface CheckResult {
  rows: RowResult[];
  summary: CheckSummary;
  truncated: boolean;
}

export function checkInput(input: string): CheckResult {
  const rawLines = input
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");

  const rows: RowResult[] = [];
  let truncated = false;
  let skippedHeader = false;

  for (let i = 0; i < rawLines.length; i++) {
    const cells = splitLine(rawLines[i]);

    if (i === 0 && !skippedHeader && looksLikeHeader(cells)) {
      skippedHeader = true;
      continue;
    }

    if (rows.length >= MAX_ROWS) {
      truncated = true;
      break;
    }

    rows.push(validateRow(rows.length + 1, cells));
  }

  const pass = rows.filter((r) => r.severity === "pass").length;
  const warn = rows.filter((r) => r.severity === "warn").length;
  const fail = rows.filter((r) => r.severity === "fail").length;
  const total = rows.length;
  const score = total === 0 ? 0 : Math.round(((pass + warn) / total) * 100);

  return {
    rows,
    summary: { total, pass, warn, fail, score },
    truncated,
  };
}
