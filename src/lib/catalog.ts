/**
 * ───────────────────────────────────────────────────────────────
 * PRODUCT CATALOG DATA
 * Centralized configuration for all products.
 * ───────────────────────────────────────────────────────────────
 */

export type StorePlatform = "steam" | "xbox" | "ubisoft";
export type Mode = "shared" | "personal";

export type Game = {
  slug: string;
  title: string;
  studio: string;
  genres: string[];
  platforms: StorePlatform[];
  description: string;
  trailerId: string;
  videoUrl?: string;
  /** Optional real thumbnail image. Put the file in /public/games/ and set this
   *  to its path, e.g. "/games/forza-horizon-5.jpg". Leave unset to keep the
   *  auto-generated color art. */
  image?: string;
  price: string;
  sharedValidity: string;
  rating: number;
  referralCode: string;
  tone: [string, string, string];
};

export type OttPlan = {
  name: string;
  screens: string;
  quality: string;
  price: string;
  validity: string;
};

export type OttService = {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  description: string;
  brand: string;
  brand2: string;
  videoUrl?: string;
  referralCode: string;
  perks: string[];
  sharedPlans: OttPlan[];
  personalPlans: OttPlan[];
};

function genRefCode(name: string, type: "game" | "ott"): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4);
  const suffix = type === "game" ? "990" : "110";
  return `DB-${clean}${suffix}`;
}

export const GAMES: Game[] = [
  {
    slug: "forza-horizon-5",
    title: "Forza Horizon 5",
    studio: "Playground Games",
    genres: ["Racing", "Open World"],
    platforms: ["steam", "xbox"],
    description: "Explore the vibrant landscapes of Mexico with fun driving action.",
    trailerId: "FYH9n37B7Yw",
    videoUrl: "https://videos.pexels.com/video-files/27152555/12085630_3840_2160_25fps.mp4",
    price: "990 BDT",
    sharedValidity: "1 Month",
    rating: 4.9,
    referralCode: genRefCode("Forza Horizon 5", "game"),
    tone: ["#10b981", "#064e3b", "#022c22"],
  },
  {
    slug: "call-of-duty-black-ops-6",
    title: "Call of Duty: Black Ops 6",
    studio: "Treyarch",
    genres: ["FPS", "Action"],
    platforms: ["steam", "xbox"],
    description: "Gripping spy-action campaign and signature multiplayer experience.",
    trailerId: "iEnCFFTHS5A",
    videoUrl: "https://videos.pexels.com/video-files/6606215/6606215-uhd_4096_2160_24fps.mp4",
    price: "1290 BDT",
    sharedValidity: "1 Month",
    rating: 4.6,
    referralCode: genRefCode("Call of Duty: Black Ops 6", "game"),
    tone: ["#3f3f46", "#18181b", "#09090b"],
  },
];

const sharedPlan = (
  name: string,
  screens: string,
  quality: string,
  price: string,
  validity = "1 Month",
): OttPlan => ({ name, screens, quality, price: `${price} BDT`, validity });

const personalPlan = (
  name: string,
  screens: string,
  quality: string,
  price: string,
): OttPlan => ({
  name,
  screens,
  quality,
  price: `${price} BDT`,
  validity: "Permanent",
});

export const OTT_SERVICES: OttService[] = [
  {
    slug: "netflix",
    name: "Netflix",
    category: "Movies & Series",
    blurb: "Unlimited movies and series in 4K UHD.",
    description: "Premium Netflix access with pre-configured profiles.",
    brand: "#10b981",
    brand2: "#064e3b",
    videoUrl: "https://videos.pexels.com/video-files/27239437/12100535_3840_2160_24fps.mp4",
    referralCode: genRefCode("Netflix", "ott"),
    perks: ["4K UHD + HDR", "Dolby Atmos", "Downloads", "Ad-free"],
    sharedPlans: [
      sharedPlan("Shared Profile", "1 profile", "4K UHD", "250"),
      sharedPlan("Shared Profile", "1 profile", "4K UHD", "690", "3 Months"),
    ],
    personalPlans: [
      personalPlan("Private Full Account", "5 profiles", "4K UHD", "1100"),
    ],
  },
  {
    slug: "spotify",
    name: "Spotify Premium",
    category: "Music",
    blurb: "Ad-free music and offline downloads.",
    description: "Premium Spotify upgrade on your own email.",
    brand: "#10b981",
    brand2: "#064e3b",
    referralCode: genRefCode("Spotify", "ott"),
    perks: ["Ad-free", "Offline Mode", "Very High Audio", "Group Session"],
    sharedPlans: [
      sharedPlan("Family Slot", "1 slot", "320kbps", "150"),
    ],
    personalPlans: [
      personalPlan("Private Premium", "1 account", "320kbps", "990"),
    ],
  },
];

export const STORE_META: Record<
  StorePlatform,
  {
    slug: StorePlatform;
    name: string;
    tagline: string;
    accent: string;
    accent2: string;
    surface: string;
    ui: string;
  }
> = {
  steam: {
    slug: "steam",
    name: "Steam",
    tagline: "The ultimate destination for playing PC games",
    accent: "#10b981",
    accent2: "#064e3b",
    surface: "#141416",
    ui: "Steam-style dark store UI",
  },
  xbox: {
    slug: "xbox",
    name: "Xbox",
    tagline: "Play thousands of games across devices",
    accent: "#10b981",
    accent2: "#064e3b",
    surface: "#141416",
    ui: "Xbox-style tile layout",
  },
  ubisoft: {
    slug: "ubisoft",
    name: "Ubisoft Connect",
    tagline: "Your Ubisoft games and rewards",
    accent: "#10b981",
    accent2: "#064e3b",
    surface: "#141416",
    ui: "Ubisoft-style clean UI",
  },
};

export function gamesForPlatform(platform: StorePlatform): Game[] {
  return GAMES.filter((game) => game.platforms.includes(platform));
}

export function getGame(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}

export function getOttService(slug: string): OttService | undefined {
  return OTT_SERVICES.find((service) => service.slug === slug);
}

export const GAMING_BG_VIDEOS = [
  "https://videos.pexels.com/video-files/27152555/12085630_3840_2160_25fps.mp4",
];

export const OTT_BG_VIDEOS = [
  "https://videos.pexels.com/video-files/27239437/12100535_3840_2160_24fps.mp4",
];

export const SUPPORT_MESSENGER_URL = "https://m.me/YOUR_PAGE";
export const MERCHANT = {
  bkash: "01XXXXXXXXX",
  nagad: "01XXXXXXXXX",
};
