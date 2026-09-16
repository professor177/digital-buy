import { db } from "@/db";
import { games, ottPackages, ottPlatforms, ubisoftRental } from "@/db/schema";
import { gameReferral, packageReferral } from "@/lib/shared";
import { count } from "drizzle-orm";

const TRAILERS = {
  cityA: "https://videos.pexels.com/video-files/35925419/15241163_3840_2160_30fps.mp4",
  cityB: "https://videos.pexels.com/video-files/34682746/14700177_3840_2160_30fps.mp4",
  cityC: "https://videos.pexels.com/video-files/30118694/12917332_3840_2160_25fps.mp4",
  road: "https://videos.pexels.com/video-files/4066332/4066332-uhd_3840_2160_24fps.mp4",
  aerial: "https://videos.pexels.com/video-files/6377660/6377660-uhd_3840_2160_30fps.mp4",
  valley: "https://videos.pexels.com/video-files/32076498/13673036_1920_1080_60fps.mp4",
  twilight: "https://videos.pexels.com/video-files/39370153/16760021_3840_2160_60fps.mp4",
  nightBW: "https://videos.pexels.com/video-files/30997958/13250846_3840_2160_60fps.mp4",
};

const steamGames: Array<{
  title: string;
  thumbnail: string;
  trailerUrl: string;
  description: string;
}> = [
  {
    title: "Neon Divide",
    thumbnail:
      "https://images.pexels.com/photos/8107826/pexels-photo-8107826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.cityB,
    description:
      "Open world action RPG set in a rain soaked megacity. Build your merc, pick a side, and take the grid back block by block.",
  },
  {
    title: "Chrome Alley",
    thumbnail:
      "https://images.pexels.com/photos/8108524/pexels-photo-8108524.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.cityC,
    description:
      "Stealth action through the black markets of the Sprawl. Every contract has three ways in and one way out.",
  },
  {
    title: "Night Terminal",
    thumbnail:
      "https://images.pexels.com/photos/35171253/pexels-photo-35171253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.cityA,
    description:
      "Survival horror inside a station that should not exist. Trains keep arriving on time, but nothing ever leaves.",
  },
  {
    title: "Redline District",
    thumbnail:
      "https://images.pexels.com/photos/18545010/pexels-photo-18545010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.aerial,
    description:
      "Street racing RPG across a neon harbor city. Tune your build, drift the docks, and own the midnight ladder.",
  },
  {
    title: "Ashenpeak",
    thumbnail:
      "https://images.pexels.com/photos/18261765/pexels-photo-18261765.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.valley,
    description:
      "High fantasy open world. Climb the shattered peaks, forge alliances, and bring an end to the long winter.",
  },
  {
    title: "Duskmarch",
    thumbnail:
      "https://images.pexels.com/photos/15469407/pexels-photo-15469407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.twilight,
    description:
      "Tactical dark fantasy campaign. Lead a company of exiles across a dying empire, one hard fight at a time.",
  },
  {
    title: "Fogbound Vale",
    thumbnail:
      "https://images.pexels.com/photos/38757793/pexels-photo-38757793.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.valley,
    description:
      "Atmospheric mystery adventure. Map the valley, read the fog, and find what the old mines buried down there.",
  },
  {
    title: "The Hollow Range",
    thumbnail:
      "https://images.pexels.com/photos/14227625/pexels-photo-14227625.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.twilight,
    description:
      "Gritty frontier survival. Hunt, trade, and hold your claim when the range wars finally reach your valley.",
  },
];

const xboxGames: Array<{
  title: string;
  thumbnail: string;
  trailerUrl: string;
  description: string;
}> = [
  {
    title: "Apex Circuit",
    thumbnail:
      "https://images.pexels.com/photos/14905479/pexels-photo-14905479.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.road,
    description:
      "Simulation racing across 40 circuits. Full career mode with dynamic weather, tire strategy, and night endurance events.",
  },
  {
    title: "Midnight Grand Prix",
    thumbnail:
      "https://images.pexels.com/photos/29309757/pexels-photo-29309757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.road,
    description:
      "Arcade formula racing at 300 km/h through closed city circuits. Climb weekly ladders solo or in split screen.",
  },
  {
    title: "Drift Protocol",
    thumbnail:
      "https://images.pexels.com/photos/25637488/pexels-photo-25637488.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.cityC,
    description:
      "Underground drift league. Build your car from the frame up, chain impossible corners, and take the city boards.",
  },
  {
    title: "Starward",
    thumbnail:
      "https://images.pexels.com/photos/7662943/pexels-photo-7662943.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.nightBW,
    description:
      "Deep space exploration epic. Chart unmapped systems, land on every world, and answer what keeps calling from the dark.",
  },
  {
    title: "Helios Descent",
    thumbnail:
      "https://images.pexels.com/photos/12668878/pexels-photo-12668878.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.cityB,
    description:
      "Cinematic sci-fi shooter. Fight your way down a failing orbital colony and uncover the Helios incident log by log.",
  },
  {
    title: "Deep Orbit",
    thumbnail:
      "https://images.pexels.com/photos/7662306/pexels-photo-7662306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    trailerUrl: TRAILERS.nightBW,
    description:
      "Hard sci-fi survival on a derelict station. Manage oxygen, reroute power, and avoid the thing living in the vents.",
  },
];

const platforms = [
  {
    name: "Netflix",
    slug: "netflix",
    introMedia:
      "https://images.pexels.com/photos/7991436/pexels-photo-7991436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tagline: "Series, films, and documentaries in up to 4K.",
    packages: [
      {
        title: "Standard with ads, 1 screen",
        thumbnail:
          "https://images.pexels.com/photos/7991394/pexels-photo-7991394.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "Full HD on 1 screen at a time. Works on mobile, TV, laptop, and tablet. Ad supported.",
      },
      {
        title: "Standard 1080p, 2 screens",
        thumbnail:
          "https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "Full HD on 2 screens at a time. Downloads on 2 devices. No ads.",
      },
      {
        title: "Premium 4K, 5 profiles",
        thumbnail:
          "https://images.pexels.com/photos/7991486/pexels-photo-7991486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "4K and HDR on 4 screens at a time. 5 personal profiles, spatial audio, downloads on 6 devices.",
      },
    ],
  },
  {
    name: "Spotify",
    slug: "spotify",
    introMedia:
      "https://images.pexels.com/photos/20557241/pexels-photo-20557241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tagline: "Ad free music, podcasts, and offline listening.",
    packages: [
      {
        title: "Individual",
        thumbnail:
          "https://images.pexels.com/photos/12560346/pexels-photo-12560346.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "1 Premium account. Ad free music, offline listening, play any track in any order.",
      },
      {
        title: "Duo",
        thumbnail:
          "https://images.pexels.com/photos/24181456/pexels-photo-24181456.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "2 Premium accounts for two people at the same address. Duo Mix playlist included.",
      },
      {
        title: "Family, 6 accounts",
        thumbnail:
          "https://images.pexels.com/photos/4306895/pexels-photo-4306895.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        details:
          "6 Premium accounts for family members under one roof. Explicit content controls included.",
      },
    ],
  },
];

export async function applyCatalogSeed(): Promise<void> {
  const [{ value: gameCount }] = await db.select({ value: count() }).from(games);
  if (gameCount > 0) return;

  const gameRows: Array<typeof games.$inferInsert> = [];
  for (const accountType of ["shared", "personal"] as const) {
    steamGames.forEach((g, i) =>
      gameRows.push({
        platform: "steam",
        accountType,
        title: g.title,
        thumbnail: g.thumbnail,
        trailerUrl: g.trailerUrl,
        description: g.description,
        priceBdt: null,
        referralCode: gameReferral(g.title),
        sortOrder: i,
      }),
    );
    xboxGames.forEach((g, i) =>
      gameRows.push({
        platform: "xbox",
        accountType,
        title: g.title,
        thumbnail: g.thumbnail,
        trailerUrl: g.trailerUrl,
        description: g.description,
        priceBdt: null,
        referralCode: gameReferral(g.title),
        sortOrder: i,
      }),
    );
  }
  await db.insert(games).values(gameRows);

  for (const [pi, p] of platforms.entries()) {
    const [platform] = await db
      .insert(ottPlatforms)
      .values({
        name: p.name,
        slug: p.slug,
        introMedia: p.introMedia,
        tagline: p.tagline,
        sortOrder: pi,
      })
      .returning();
    for (const [i, pkg] of p.packages.entries()) {
      await db.insert(ottPackages).values({
        platformId: platform.id,
        title: pkg.title,
        thumbnail: pkg.thumbnail,
        details: pkg.details,
        priceBdt: null,
        referralCode: packageReferral(p.name),
        sortOrder: i,
      });
    }
  }

  await db.insert(ubisoftRental).values({
    id: 1,
    title: "Ubisoft Library Pass",
    tagline: "Full library. One account. 30 days.",
    description:
      "One rental account with the whole Ubisoft catalog unlocked. You receive maintained login access for one month, and renewals keep your cloud saves and progress.",
    includes: [
      "Access to the full Ubisoft PC library, 100+ titles",
      "Most new releases included on day one",
      "Cloud saves on the rental profile",
      "Swap games any time during the rental month",
      "Renews monthly at BDT 150",
    ],
    media: "/media/ubi-library.jpg",
    trailerUrl: TRAILERS.valley,
    priceBdt: 150,
    referralCode: "DB-UBIS990",
  });
}
