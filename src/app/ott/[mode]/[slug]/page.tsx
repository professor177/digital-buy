import { notFound } from "next/navigation";

import OttServiceView from "@/components/ott/OttServiceView";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { OTT_BG_VIDEOS, getOttService, type Mode } from "@/lib/catalog";

export default async function OttServicePage({
  params,
}: {
  params: Promise<{ mode: string; slug: string }>;
}) {
  const { mode, slug } = await params;
  if (mode !== "shared" && mode !== "personal") notFound();

  const service = getOttService(slug);
  if (!service) notFound();

  return (
    <div className="relative">
      <VideoBackdrop sources={OTT_BG_VIDEOS} tint="rgba(5,4,12,0.9)" />
      <OttServiceView service={service} mode={mode as Mode} />
    </div>
  );
}
