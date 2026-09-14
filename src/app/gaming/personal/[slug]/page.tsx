import { notFound } from "next/navigation";

import GameDetail from "@/components/game/GameDetail";
import { getGame } from "@/lib/catalog";

export default async function PersonalGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <div className="relative bg-bg min-h-screen">
      <GameDetail game={game} mode="personal" />
    </div>
  );
}
