import type { AccountMode } from "@/lib/shared";

/**
 * Starter catalog. Thumbnails use each game's public Steam store header art.
 * Prices are BDT starting points: edit them any time from Admin > Games.
 */
export interface SeedGame {
  title: string;
  steamAppId: number;
  platforms: Array<"steam" | "xbox">;
  price: Record<AccountMode, number>;
  description: string;
}

export const steamHeader = (appId: number): string =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

export const SEED_GAMES: SeedGame[] = [
  {
    title: "Forza Horizon 6",
    steamAppId: 2483190,
    platforms: ["steam", "xbox"],
    price: { shared: 400, personal: 1200 },
    description:
      "The Horizon Festival arrives in Japan. Race over 550 cars across neon cities, mountain passes and countryside in the biggest open-world Forza yet.",
  },
  {
    title: "Forza Horizon 5",
    steamAppId: 1551360,
    platforms: ["steam", "xbox"],
    price: { shared: 250, personal: 700 },
    description:
      "Open-world racing across a huge, vibrant recreation of Mexico with hundreds of cars, seasonal events and online co-op.",
  },
  {
    title: "Forza Horizon 4",
    steamAppId: 1293830,
    platforms: ["steam", "xbox"],
    price: { shared: 200, personal: 500 },
    description:
      "Race through a living British countryside where the seasons change every week. A fan favourite with a big car list.",
  },
  {
    title: "Grand Theft Auto V",
    steamAppId: 271590,
    platforms: ["steam"],
    price: { shared: 200, personal: 500 },
    description:
      "Three criminals, one sprawling open world. Story mode plus GTA Online, one of the most played games ever made.",
  },
  {
    title: "Red Dead Redemption 2",
    steamAppId: 1174180,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "An epic Western open world following Arthur Morgan and the Van der Linde gang, with a story-driven campaign and Red Dead Online.",
  },
  {
    title: "Cyberpunk 2077",
    steamAppId: 1091500,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "An open-world action RPG set in Night City. Build your own mercenary V with deep customization and branching choices.",
  },
  {
    title: "Elden Ring",
    steamAppId: 1245620,
    platforms: ["steam"],
    price: { shared: 350, personal: 900 },
    description:
      "A vast fantasy action RPG from FromSoftware and George R. R. Martin. Explore the Lands Between and take on legendary bosses.",
  },
  {
    title: "The Witcher 3: Wild Hunt",
    steamAppId: 292030,
    platforms: ["steam"],
    price: { shared: 150, personal: 400 },
    description:
      "Play Geralt of Rivia in a massive story-rich RPG with monster hunts, deep quests and a huge open world.",
  },
  {
    title: "Baldur's Gate 3",
    steamAppId: 1086940,
    platforms: ["steam"],
    price: { shared: 350, personal: 900 },
    description:
      "A story-rich party-based RPG set in the Dungeons & Dragons universe. Your choices shape a huge branching adventure, solo or co-op.",
  },
  {
    title: "Hogwarts Legacy",
    steamAppId: 990080,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "An open-world action RPG set in the wizarding world in the 1800s. Attend Hogwarts, learn spells and uncover a hidden secret.",
  },
  {
    title: "God of War",
    steamAppId: 1593500,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "Kratos and his son Atreus journey through the Norse realms in a cinematic, combat-driven adventure.",
  },
  {
    title: "Marvel's Spider-Man Remastered",
    steamAppId: 1817070,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "Swing through a detailed New York City as an experienced Peter Parker in a fast, polished open-world action adventure.",
  },
  {
    title: "Resident Evil 4",
    steamAppId: 2050650,
    platforms: ["steam"],
    price: { shared: 300, personal: 800 },
    description:
      "A modern reimagining of the survival horror classic. Leon S. Kennedy must rescue the president's daughter from a hostile village.",
  },
  {
    title: "Black Myth: Wukong",
    steamAppId: 2358720,
    platforms: ["steam"],
    price: { shared: 350, personal: 900 },
    description:
      "An action RPG rooted in Chinese mythology. Fight through stunning, boss-heavy chapters inspired by Journey to the West.",
  },
  {
    title: "Sekiro: Shadows Die Twice",
    steamAppId: 814380,
    platforms: ["steam"],
    price: { shared: 300, personal: 750 },
    description:
      "A precise, skill-based action adventure in Sengoku-era Japan. Master swordplay and stealth as a shinobi seeking revenge.",
  },
  {
    title: "Palworld",
    steamAppId: 1623730,
    platforms: ["steam"],
    price: { shared: 200, personal: 500 },
    description:
      "Catch, raise and battle creatures called Pals while building a base and surviving in an open world, solo or with friends.",
  },
  {
    title: "Halo: The Master Chief Collection",
    steamAppId: 976730,
    platforms: ["xbox"],
    price: { shared: 250, personal: 700 },
    description:
      "Six Halo campaigns and huge multiplayer in one package. The complete Master Chief story, remastered.",
  },
  {
    title: "Halo Infinite",
    steamAppId: 1240440,
    platforms: ["xbox"],
    price: { shared: 200, personal: 500 },
    description:
      "Master Chief returns in an open-world campaign, plus free-to-play arena multiplayer with ranked and social modes.",
  },
  {
    title: "Gears 5",
    steamAppId: 1097840,
    platforms: ["xbox"],
    price: { shared: 200, personal: 500 },
    description:
      "A big-budget third-person shooter with a story campaign, Horde mode and competitive multiplayer.",
  },
  {
    title: "Starfield",
    steamAppId: 1716740,
    platforms: ["xbox"],
    price: { shared: 300, personal: 800 },
    description:
      "Bethesda's space-faring RPG. Explore hundreds of planets, build outposts and join the Constellation.",
  },
  {
    title: "Sea of Thieves",
    steamAppId: 1172620,
    platforms: ["xbox"],
    price: { shared: 200, personal: 500 },
    description:
      "Sail, fight and hunt treasure in a shared pirate world. Best played with a crew of friends.",
  },
  {
    title: "Microsoft Flight Simulator 2024",
    steamAppId: 2537590,
    platforms: ["xbox"],
    price: { shared: 300, personal: 800 },
    description:
      "Fly detailed aircraft over a photorealistic Earth with career mode, live weather and thousands of airports.",
  },
];
