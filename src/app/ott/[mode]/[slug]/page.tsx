import { notFound } from "next/navigation";

import OttServiceView from "@/components/ott/OttServiceView";
import { getOttService, type Mode } from "@/lib/catalog";

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
    <div className="relative bg-bg min-h-screen">
      <OttServiceView service={service} mode={mode as Mode} />
    </div>
  );
}
