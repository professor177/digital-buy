import { notFound } from "next/navigation";

import GameDetail from "@/components/game/GameDetail";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { GAMING_BG_VIDEOS, getGame, type StorePlatform } from "@/lib/catalog";

const VALID: StorePlatform[] = ["steam", "xbox", "ubisoft"];

export default async function SharedGamePage({
  params,
}: {
  params: Promise<{ platform: string; slug: string }>;
}) {
  const { platform, slug } = await params;
  const game = getGame(slug);
  if (!game || !VALID.includes(platform as StorePlatform)) notFound();

  return (
    <div className="relative">
      <VideoBackdrop sources={GAMING_BG_VIDEOS} tint="rgba(5,4,12,0.9)" />
      <GameDetail game={game} mode="shared" platform={platform as StorePlatform} />
    </div>
  );
}
