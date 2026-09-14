import { notFound } from "next/navigation";

import OttGrid from "@/components/ott/OttGrid";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { OTT_BG_VIDEOS, type Mode } from "@/lib/catalog";

export function generateStaticParams() {
  return [{ mode: "shared" }, { mode: "personal" }];
}

export default async function OttModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (mode !== "shared" && mode !== "personal") notFound();

  return (
    <div className="relative">
      <VideoBackdrop sources={OTT_BG_VIDEOS} tint="rgba(12,10,18,0.84)" />
      <OttGrid mode={mode as Mode} />
    </div>
  );
}
