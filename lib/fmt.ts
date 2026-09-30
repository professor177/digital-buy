export const bdt = (n: number | string) => `${Number(n).toLocaleString("en-US")} BDT`;
export const dur = (d: number | null) => d == null ? "Permanent" : d % 30 === 0 ? `${d / 30} month${d > 30 ? "s" : ""}` : `${d} days`;
export const embed = (u?: string | null) => (u && /^https:\/\/(www\.youtube(-nocookie)?\.com\/embed\/|player\.vimeo\.com\/)/.test(u) ? u : null);
