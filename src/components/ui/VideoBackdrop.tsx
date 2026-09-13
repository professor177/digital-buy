"use client";

import { useEffect, useState } from "react";

/**
 * Muted, looping, auto-playing HTML5 video montage backdrop.
 * TODO: swap `sources` in src/lib/catalog.ts with your own gameplay /
 * series montages (Forza, COD, GTA · Money Heist, Stranger Things…).
 */
export function VideoBackdrop({
  sources,
  tint = "rgba(5,4,12,0.78)",
  poster,
}: {
  sources: string[];
  tint?: string;
  poster?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (sources.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % sources.length),
      12000,
    );
    return () => window.clearInterval(timer);
  }, [sources.length]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0620] via-[#05040c] to-[#12071f]" />
      <video
        key={sources[index]}
        className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={sources[index]} type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: tint }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,4,12,0.92)_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]" />
    </div>
  );
}

export default VideoBackdrop;
