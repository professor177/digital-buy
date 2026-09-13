/**
 * ───────────────────────────────────────────────────────────────
 * PLACEHOLDER CATALOG DATA
 * Replace prices / trailers / descriptions with your real values.
 * `price` is intentionally kept as "৳ TBD".
 * `trailerId` = YouTube video id → swap with the official trailer id.
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
  trailerId: string; // YouTube id — PLACEHOLDER
  price: string; // PLACEHOLDER
  sharedValidity: string;
  rating: number;
  tone: [string, string, string]; // procedural cover-art gradient
};

export const GAMES: Game[] = [
  {
    slug: "forza-horizon-5",
    title: "Forza Horizon 5",
    studio: "Playground Games",
    genres: ["Racing", "Open World"],
    platforms: ["steam", "xbox"],
    description:
      "Explore the vibrant, ever-evolving open-world landscapes of Mexico with limitless, fun driving action in hundreds of the world's greatest cars.",
    trailerId: "FYH9n37B7Yw",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.9,
    tone: ["#ff7a18", "#af002d", "#319197"],
  },
  {
    slug: "call-of-duty-black-ops-6",
    title: "Call of Duty: Black Ops 6",
    studio: "Treyarch",
    genres: ["FPS", "Action"],
    platforms: ["steam", "xbox"],
    description:
      "Black Ops 6 delivers a gripping spy-action campaign, a signature multiplayer experience and a brand-new Zombies chapter.",
    trailerId: "iEnCFFTHS5A",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.6,
    tone: ["#f97316", "#111827", "#64748b"],
  },
  {
    slug: "grand-theft-auto-v",
    title: "Grand Theft Auto V",
    studio: "Rockstar Games",
    genres: ["Action", "Open World"],
    platforms: ["steam", "xbox"],
    description:
      "Three very different criminals risk everything in a series of daring heists across the sun-soaked streets of Los Santos and Blaine County.",
    trailerId: "QkkoHAzjnUs",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.8,
    tone: ["#22d3ee", "#0ea5e9", "#f59e0b"],
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    studio: "Rockstar Games",
    genres: ["Adventure", "Western"],
    platforms: ["steam", "xbox"],
    description:
      "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run in a sprawling, cinematic frontier world.",
    trailerId: "gmA6MrX81z4",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.9,
    tone: ["#b45309", "#7f1d1d", "#1f2937"],
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    studio: "CD PROJEKT RED",
    genres: ["RPG", "Sci-Fi"],
    platforms: ["steam", "xbox"],
    description:
      "An open-world action-adventure set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    trailerId: "8X2kIfS6fb8",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.5,
    tone: ["#fde047", "#e11d48", "#06b6d4"],
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    studio: "FromSoftware",
    genres: ["Souls-like", "RPG"],
    platforms: ["steam", "xbox"],
    description:
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring in the Lands Between.",
    trailerId: "E3Huy2cdih0",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.9,
    tone: ["#fbbf24", "#78350f", "#111827"],
  },
  {
    slug: "assassins-creed-mirage",
    title: "Assassin's Creed Mirage",
    studio: "Ubisoft Bordeaux",
    genres: ["Stealth", "Action"],
    platforms: ["ubisoft", "xbox"],
    description:
      "Experience the story of Basim, a cunning street thief seeking answers and justice in ninth-century Baghdad.",
    trailerId: "8AF6Vp0Ozmk",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.3,
    tone: ["#f8fafc", "#0ea5e9", "#1e293b"],
  },
  {
    slug: "far-cry-6",
    title: "Far Cry 6",
    studio: "Ubisoft Toronto",
    genres: ["FPS", "Open World"],
    platforms: ["ubisoft", "steam", "xbox"],
    description:
      "Become a guerrilla fighter and liberate the tropical paradise of Yara from the grip of dictator Antón Castillo.",
    trailerId: "bHwjZDTdcyY",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.2,
    tone: ["#f43f5e", "#facc15", "#16a34a"],
  },
  {
    slug: "rainbow-six-siege",
    title: "Tom Clancy's Rainbow Six Siege",
    studio: "Ubisoft Montreal",
    genres: ["Tactical", "FPS"],
    platforms: ["ubisoft", "steam", "xbox"],
    description:
      "Master the art of destruction and gadgetry in intense 5v5 close-quarters tactical combat.",
    trailerId: "6wlvYh0h63k",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.4,
    tone: ["#0ea5e9", "#1e40af", "#0f172a"],
  },
  {
    slug: "watch-dogs-legion",
    title: "Watch Dogs: Legion",
    studio: "Ubisoft Toronto",
    genres: ["Action", "Hacking"],
    platforms: ["ubisoft", "steam", "xbox"],
    description:
      "Build a resistance from virtually anyone in a near-future, dystopian London and take back the city.",
    trailerId: "aTN9vrbrMj4",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.1,
    tone: ["#e879f9", "#7c3aed", "#0f172a"],
  },
  {
    slug: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    studio: "Avalanche Software",
    genres: ["RPG", "Magic"],
    platforms: ["steam", "xbox"],
    description:
      "Live the unwritten: an immersive, open-world action RPG set in the 1800s wizarding world.",
    trailerId: "1O6Qstncpnc",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.6,
    tone: ["#f59e0b", "#7c2d12", "#111827"],
  },
  {
    slug: "ea-sports-fc-25",
    title: "EA SPORTS FC 25",
    studio: "EA Vancouver",
    genres: ["Sports", "Football"],
    platforms: ["steam", "xbox"],
    description:
      "Win as one in EA SPORTS FC 25 with FC IQ, Rush 5v5 and the most authentic football experience yet.",
    trailerId: "sMBBdyBf7Kw",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.0,
    tone: ["#22c55e", "#0ea5e9", "#052e16"],
  },
  {
    slug: "halo-infinite",
    title: "Halo Infinite",
    studio: "343 Industries",
    genres: ["FPS", "Sci-Fi"],
    platforms: ["steam", "xbox"],
    description:
      "When all hope is lost and humanity's fate hangs in the balance, the Master Chief is ready to confront the Banished.",
    trailerId: "PyMlV5_HRWk",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.3,
    tone: ["#38bdf8", "#1d4ed8", "#052e16"],
  },
  {
    slug: "ghost-recon-breakpoint",
    title: "Ghost Recon Breakpoint",
    studio: "Ubisoft Paris",
    genres: ["Tactical", "Shooter"],
    platforms: ["ubisoft", "xbox"],
    description:
      "Injured, hunted down and surrounded by enemies, you must survive the wild island of Auroa alone or in co-op.",
    trailerId: "Pm3kOSjy2Qs",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 3.9,
    tone: ["#f97316", "#0f766e", "#0f172a"],
  },
  {
    slug: "forza-motorsport",
    title: "Forza Motorsport",
    studio: "Turn 10 Studios",
    genres: ["Racing", "Simulation"],
    platforms: ["steam", "xbox"],
    description:
      "The most technically advanced racing game ever made — built from the ground up for the new generation.",
    trailerId: "zqIlZFcX4AU",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.2,
    tone: ["#60a5fa", "#a855f7", "#020617"],
  },
  {
    slug: "starfield",
    title: "Starfield",
    studio: "Bethesda Game Studios",
    genres: ["RPG", "Space"],
    platforms: ["steam", "xbox"],
    description:
      "In this next-generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom.",
    trailerId: "zmb2FJGvnAw",
    price: "৳ TBD",
    sharedValidity: "1 Month",
    rating: 4.0,
    tone: ["#f8fafc", "#6366f1", "#020617"],
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
    accent: "#66c0f4",
    accent2: "#1b2838",
    surface: "#1b2838",
    ui: "Steam-style dark blue store UI with capsule art",
  },
  xbox: {
    slug: "xbox",
    name: "Xbox",
    tagline: "Play thousands of games across devices",
    accent: "#107c10",
    accent2: "#0e7a0d",
    surface: "#0b160b",
    ui: "Xbox-style green tile layout",
  },
  ubisoft: {
    slug: "ubisoft",
    name: "Ubisoft Connect",
    tagline: "Your Ubisoft games, rewards and friends in one place",
    accent: "#0082e6",
    accent2: "#00a8ff",
    surface: "#0b1b2b",
    ui: "Ubisoft Connect-style light-on-navy UI",
  },
};

export function gamesForPlatform(platform: StorePlatform): Game[] {
  return GAMES.filter((game) => game.platforms.includes(platform));
}

export function getGame(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}

/* ───────────────────────── OTT ───────────────────────── */

export type OttPlan = {
  name: string;
  screens: string;
  quality: string;
  price: string; // PLACEHOLDER
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
  perks: string[];
  sharedPlans: OttPlan[];
  personalPlans: OttPlan[];
};

const sharedPlan = (
  name: string,
  screens: string,
  quality: string,
  validity = "1 Month",
): OttPlan => ({ name, screens, quality, price: "৳ TBD", validity });

const personalPlan = (
  name: string,
  screens: string,
  quality: string,
): OttPlan => ({
  name,
  screens,
  quality,
  price: "৳ TBD",
  validity: "Permanent",
});

export const OTT_SERVICES: OttService[] = [
  {
    slug: "netflix",
    name: "Netflix",
    category: "Movies & Series",
    blurb: "Stranger Things, Money Heist, Squid Game & more",
    description:
      "Unlimited movies, TV shows and originals in up to 4K UHD. Profiles are pre-configured and delivered instantly after approval.",
    brand: "#e50914",
    brand2: "#7f1d1d",
    perks: ["4K UHD + HDR", "Dolby Atmos", "Downloads", "Ad-free"],
    sharedPlans: [
      sharedPlan("Shared Profile • Premium 4K", "1 profile", "4K UHD"),
      sharedPlan("Shared Profile • Premium 4K", "1 profile", "4K UHD", "3 Months"),
      sharedPlan("Duo Profile", "2 profiles", "4K UHD", "1 Month"),
    ],
    personalPlans: [
      personalPlan("Private Full Account", "5 profiles", "4K UHD"),
      personalPlan("Private Account + Extra Member", "6 profiles", "4K UHD"),
    ],
  },
  {
    slug: "prime-video",
    name: "Prime Video",
    category: "Movies & Series",
    blurb: "The Boys, Reacher, Fallout & Amazon Originals",
    description:
      "Amazon Prime Video with Originals, live sport and thousands of titles in 4K UHD.",
    brand: "#00a8e1",
    brand2: "#0f3443",
    perks: ["4K UHD", "X-Ray", "Downloads", "Prime Originals"],
    sharedPlans: [
      sharedPlan("Shared Profile", "1 profile", "4K UHD"),
      sharedPlan("Shared Profile", "1 profile", "4K UHD", "6 Months"),
    ],
    personalPlans: [personalPlan("Private Full Account", "6 profiles", "4K UHD")],
  },
  {
    slug: "hbo-max",
    name: "HBO Max",
    category: "Movies & Series",
    blurb: "House of the Dragon, The Last of Us, DC & WB",
    description:
      "Every HBO original plus Warner Bros. blockbusters, DC universe and Max Originals.",
    brand: "#7b2bf9",
    brand2: "#2d0a5e",
    perks: ["4K UHD", "Dolby Vision", "3 Streams", "Max Originals"],
    sharedPlans: [sharedPlan("Shared Profile • Ultimate", "1 profile", "4K UHD")],
    personalPlans: [personalPlan("Private Ultimate Account", "5 profiles", "4K UHD")],
  },
  {
    slug: "disney-plus-hotstar",
    name: "Disney+ Hotstar",
    category: "Movies, Series & Sports",
    blurb: "Marvel, Star Wars, Pixar + live cricket",
    description:
      "Disney, Pixar, Marvel, Star Wars, National Geographic and live cricket in one subscription.",
    brand: "#0f4ff5",
    brand2: "#061a52",
    perks: ["4K UHD", "Live Sports", "4 Streams", "Kids Profiles"],
    sharedPlans: [sharedPlan("Shared Super Plan", "1 profile", "Full HD")],
    personalPlans: [personalPlan("Private Premium Account", "4 profiles", "4K UHD")],
  },
  {
    slug: "spotify",
    name: "Spotify Premium",
    category: "Music",
    blurb: "Ad-free music, offline downloads, Spotify Connect",
    description:
      "Spotify Premium upgrade on your own email or a ready-made account. Ad-free listening with unlimited skips.",
    brand: "#1db954",
    brand2: "#064e3b",
    perks: ["Ad-free", "Offline Mode", "Very High Audio", "Group Session"],
    sharedPlans: [
      sharedPlan("Family Slot", "1 slot", "320kbps"),
      sharedPlan("Family Slot", "1 slot", "320kbps", "3 Months"),
    ],
    personalPlans: [personalPlan("Private Premium (own email)", "1 account", "320kbps")],
  },
  {
    slug: "youtube-premium",
    name: "YouTube Premium",
    category: "Video & Music",
    blurb: "Ad-free YouTube + YouTube Music + background play",
    description:
      "Upgrade your own Google account to YouTube Premium — ad-free videos, background play and YouTube Music included.",
    brand: "#ff0033",
    brand2: "#450a0a",
    perks: ["Ad-free", "Background Play", "YT Music", "Downloads"],
    sharedPlans: [sharedPlan("Family Slot (own Gmail)", "1 slot", "1080p+")],
    personalPlans: [personalPlan("Private Individual (own Gmail)", "1 account", "4K")],
  },
  {
    slug: "apple-tv-plus",
    name: "Apple TV+",
    category: "Movies & Series",
    blurb: "Ted Lasso, Severance, Silo & Apple Originals",
    description:
      "Apple Originals in stunning 4K Dolby Vision with Spatial Audio support.",
    brand: "#e5e7eb",
    brand2: "#111827",
    perks: ["4K Dolby Vision", "Spatial Audio", "6 Streams", "Apple Originals"],
    sharedPlans: [sharedPlan("Shared Family Slot", "1 profile", "4K UHD")],
    personalPlans: [personalPlan("Private Full Account", "6 profiles", "4K UHD")],
  },
  {
    slug: "crunchyroll",
    name: "Crunchyroll",
    category: "Anime",
    blurb: "Jujutsu Kaisen, One Piece, Solo Leveling",
    description:
      "The world's largest anime library with simulcasts one hour after Japan.",
    brand: "#f47521",
    brand2: "#431407",
    perks: ["Simulcast", "Ad-free", "Offline", "Mega Fan"],
    sharedPlans: [sharedPlan("Shared Mega Fan", "1 profile", "1080p")],
    personalPlans: [personalPlan("Private Ultimate Fan", "1 account", "1080p")],
  },
  {
    slug: "zee5",
    name: "ZEE5",
    category: "Regional",
    blurb: "Bangla, Hindi & regional originals",
    description:
      "ZEE5 Premium with Bangla originals, movies, and live TV channels.",
    brand: "#8230c6",
    brand2: "#2e1065",
    perks: ["Bangla Originals", "Live TV", "4K", "Downloads"],
    sharedPlans: [sharedPlan("Shared Premium", "1 profile", "4K")],
    personalPlans: [personalPlan("Private Premium Account", "5 profiles", "4K")],
  },
  {
    slug: "chorki",
    name: "Chorki",
    category: "Bangladeshi OTT",
    blurb: "Homegrown Bangladeshi originals & films",
    description:
      "Chorki premium — Bangladeshi web films, originals and exclusive series.",
    brand: "#ff3b5c",
    brand2: "#4c0519",
    perks: ["BD Originals", "Full HD", "Downloads", "Ad-free"],
    sharedPlans: [sharedPlan("Shared Premium", "1 profile", "Full HD")],
    personalPlans: [personalPlan("Private Premium Account", "3 profiles", "Full HD")],
  },
  {
    slug: "canva-pro",
    name: "Canva Pro",
    category: "Creative Tools (placeholder)",
    blurb: "Premium templates, brand kit, magic studio",
    description:
      "Placeholder product slot — swap this for any other digital subscription you resell.",
    brand: "#00c4cc",
    brand2: "#083344",
    perks: ["Magic Studio", "Brand Kit", "100GB Cloud", "Premium Assets"],
    sharedPlans: [sharedPlan("Team Slot", "1 seat", "Pro")],
    personalPlans: [personalPlan("Private Pro (own email)", "1 seat", "Pro")],
  },
  {
    slug: "more-coming-soon",
    name: "Add Your Own",
    category: "Placeholder",
    blurb: "Duplicate this entry in src/lib/catalog.ts",
    description:
      "This is an empty placeholder card — copy any OTT_SERVICES entry and edit the fields to launch a new product.",
    brand: "#94a3b8",
    brand2: "#1e293b",
    perks: ["Editable", "Placeholder", "Ready", "—"],
    sharedPlans: [sharedPlan("Shared Plan", "1 profile", "HD")],
    personalPlans: [personalPlan("Private Plan", "1 account", "HD")],
  },
];

export function getOttService(slug: string): OttService | undefined {
  return OTT_SERVICES.find((service) => service.slug === slug);
}

/* ───────────────── Background video clips ─────────────────
 * Replace these with your own Forza / COD / GTA & series montages.
 * (Muted, looping, autoplaying HTML5 <video> sources.)
 */
export const GAMING_BG_VIDEOS = [
  "https://videos.pexels.com/video-files/27152555/12085630_3840_2160_25fps.mp4",
  "https://videos.pexels.com/video-files/6606215/6606215-uhd_4096_2160_24fps.mp4",
];

export const OTT_BG_VIDEOS = [
  "https://videos.pexels.com/video-files/27239437/12100535_3840_2160_24fps.mp4",
  "https://videos.pexels.com/video-files/29417147/12666922_3840_2160_30fps.mp4",
];

/* ───────────────── Merchant / integration placeholders ───────────────── */
export const SUPPORT_MESSENGER_URL = "https://m.me/YOUR_PAGE"; // TODO: your FB page
export const MERCHANT = {
  bkash: "01XXXXXXXXX", // TODO: your personal/merchant bKash number
  nagad: "01XXXXXXXXX", // TODO: your personal/merchant Nagad number
};
