/**
 * Per-product referral code.
 * Format: DB-<first 4 letters of the product title, lowercase><suffix>
 *   - Gaming accounts → suffix 990   e.g. "Forza Horizon 5"  → DB-forz990
 *   - OTT subscriptions → suffix 110 e.g. "Netflix"          → DB-netf110
 *
 * The code is derived purely from the title, so it never needs to be stored —
 * renaming a product's `title` in catalog.ts automatically changes its code.
 */
export type ReferralKind = "game" | "ott";

export function getReferralCode(kind: ReferralKind, title: string): string {
  const letters = title
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase()
    .padEnd(4, "x")
    .slice(0, 4);
  const suffix = kind === "game" ? "990" : "110";
  return `DB-${letters}${suffix}`;
}
