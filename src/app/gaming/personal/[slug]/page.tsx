import { notFound } from "next/navigation";

import GameDetail from "@/components/game/GameDetail";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { GAMING_BG_VIDEOS, getGame } from "@/lib/catalog";

export default async function PersonalGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <div className="relative">
      <VideoBackdrop sources={GAMING_BG_VIDEOS} tint="rgba(12,10,18,0.9)" />
      <GameDetail game={game} mode="personal" />
    </div>
  );
}
