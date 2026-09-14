import { notFound } from "next/navigation";

import OttGrid from "@/components/ott/OttGrid";
import { type Mode } from "@/lib/catalog";

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
    <div className="relative bg-bg min-h-screen">
      <OttGrid mode={mode as Mode} />
    </div>
  );
}
