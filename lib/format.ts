import type { DurationUnit } from "@/lib/types";

export function money(amount: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);
}

export function durationLabel(value: number | null, unit: DurationUnit) {
  if (unit === "permanent") return "Permanent";
  if (!value) return "Duration set by admin";
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}
