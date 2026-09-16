export const SUPPORT_URL =
  "https://www.instagram.com/direct/t/17843350626608873/";

export type AccountMode = "shared" | "personal";
export type OrderStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "bkash" | "nagad";
export type ItemType = "game" | "ott_package" | "ubisoft";

export interface PublicUser {
  id: number;
  phone: string;
  nickname: string | null;
}

export interface OrderDto {
  id: string;
  itemType: ItemType;
  itemId: number;
  accountType: AccountMode | null;
  itemLabel: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amountBdt: number;
  referralCode: string;
  status: OrderStatus;
  credentials: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameDto {
  id: number;
  platform: "steam" | "xbox";
  accountType: AccountMode;
  title: string;
  thumbnail: string;
  trailerUrl: string | null;
  description: string;
  priceBdt: number | null;
  referralCode: string;
}

export interface PlatformDto {
  id: number;
  name: string;
  slug: string;
  introMedia: string;
  tagline: string;
}

export interface PackageDto {
  id: number;
  platformId: number;
  title: string;
  thumbnail: string;
  details: string;
  priceBdt: number | null;
  referralCode: string;
}

export interface UbisoftDto {
  id: number;
  title: string;
  tagline: string;
  description: string;
  includes: string[];
  media: string;
  trailerUrl: string | null;
  priceBdt: number;
  referralCode: string;
}

export const paymentNumbers: Record<PaymentMethod, string> = {
  bkash: process.env.NEXT_PUBLIC_BKASH_NUMBER ?? "",
  nagad: process.env.NEXT_PUBLIC_NAGAD_NUMBER ?? "",
};

export function bdt(amount: number): string {
  return `BDT ${amount.toLocaleString("en-US")}`;
}

export function first4Alpha(input: string): string {
  const letters = input.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return (letters + "XXXX").slice(0, 4);
}

export function gameReferral(title: string): string {
  return `DB-${first4Alpha(title)}990`;
}

export function packageReferral(platformName: string): string {
  return `DB-${first4Alpha(platformName)}110`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toE164Bd(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (/^8801[3-9]\d{8}$/.test(digits)) return `+${digits}`;
  if (/^01[3-9]\d{8}$/.test(digits)) return `+880${digits.slice(1)}`;
  return null;
}

export function isValidTxnId(input: string): boolean {
  return /^[A-Za-z0-9]{6,32}$/.test(input.trim());
}
