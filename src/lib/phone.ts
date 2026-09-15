/** Bangladesh mobile numbers only: +8801XXXXXXXXX. */
export function normalizeBdPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const local = digits.startsWith("880")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;
  if (!/^1[3-9]\d{8}$/.test(local)) return null;
  return `+880${local}`;
}

export function prettyBdPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const local = phone.replace("+880", "0");
  return local.replace(/(\d{5})(\d{6})/, "$1-$2");
}
