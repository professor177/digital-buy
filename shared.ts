export const SUPPORT_URL =
  "https://www.instagram.com/direct/t/17843350626608873/";

export type AccountMode = "shared" | "personal";
export type OrderStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "bkash" | "nagad";
export type ItemType = "game" | "ott_package" | "ubisoft";

export interface PublicUser {
  id: number;
  email: string | null;
  emailVerified: boolean;
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
  return `৳ ${amount.toLocaleString("en-US")}`;
}

/** Display string for an unset price. Used everywhere a price would render. */
export const PRICE_COMING_SOON = "Price coming soon";

export interface PlatformBrand {
  accent: string;
  bg: string;
}

const DEFAULT_BRAND: PlatformBrand = { accent: "#35e27f", bg: "#101413" };

/**
 * Brand colors used to render the solid-color placeholder art for OTT
 * platforms until rights-appropriate key art is supplied per platform.
 */
export const PLATFORM_BRAND: Record<string, PlatformBrand> = {
  netflix: { accent: "#e50914", bg: "#0a0a0a" },
  spotify: { accent: "#1db954", bg: "#121212" },
  "prime-video": { accent: "#00a8e1", bg: "#0f171e" },
  "disney-hotstar": { accent: "#1f80e0", bg: "#0c1b2a" },
  "youtube-premium": { accent: "#ff0033", bg: "#0f0f0f" },
  "apple-tv": { accent: "#f5f5f7", bg: "#000000" },
};

export function platformBrand(slug: string): PlatformBrand {
  return PLATFORM_BRAND[slug] ?? DEFAULT_BRAND;
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

export function isValidTxnId(input: string): boolean {
  return /^[A-Za-z0-9]{6,32}$/.test(input.trim());
}
