// GTIN structural + GS1 check-digit validation.
// Supports GTIN-8, GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-14.
// The check digit is the standard GS1 modulo-10 algorithm — pure arithmetic,
// no external service required.

export type GtinResult =
  | { valid: true; length: number; normalised: string }
  | { valid: false; reason: string; normalised: string };

const VALID_LENGTHS = [8, 12, 13, 14];

/**
 * Compute the GS1 modulo-10 check digit for the data portion of a GTIN
 * (i.e. every digit except the trailing check digit).
 * Weights alternate 3,1,3,1... starting from the rightmost data digit.
 */
export function gs1CheckDigit(dataDigits: string): number {
  let sum = 0;
  // Walk right-to-left over the data digits. Rightmost data digit gets weight 3.
  for (let i = 0; i < dataDigits.length; i++) {
    const digit = dataDigits.charCodeAt(dataDigits.length - 1 - i) - 48;
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate a candidate GTIN string. Only the raw value is inspected — the
 * caller is responsible for surfacing formatting warnings (spaces etc.).
 */
export function validateGtin(raw: string): GtinResult {
  const normalised = raw.replace(/\s+/g, "");

  if (normalised === "") {
    return { valid: false, reason: "empty", normalised };
  }
  if (!/^[0-9]+$/.test(normalised)) {
    return { valid: false, reason: "non-numeric characters", normalised };
  }
  if (!VALID_LENGTHS.includes(normalised.length)) {
    return {
      valid: false,
      reason: `length ${normalised.length} is not a valid GTIN (need 8, 12, 13 or 14 digits)`,
      normalised,
    };
  }

  const data = normalised.slice(0, -1);
  const provided = normalised.charCodeAt(normalised.length - 1) - 48;
  const expected = gs1CheckDigit(data);

  if (provided !== expected) {
    return {
      valid: false,
      reason: `check digit mismatch (expected ${expected}, got ${provided})`,
      normalised,
    };
  }

  return { valid: true, length: normalised.length, normalised };
}
