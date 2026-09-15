"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, looping, auto-playing HTML5 video montage backdrop.
 * TODO: swap `sources` in src/lib/catalog.ts with your own gameplay /
 * series montages (Forza, COD, GTA · Money Heist, Stranger Things…).
 *
 * Performance notes:
 * - The placeholder sources are 4K files — great quality, heavy download.
 *   For production, re-export your montage clips at 1080p (or 720p for
 *   mobile) so low-end phones don't stutter or burn data.
 * - Video is skipped entirely (falls back to a still gradient) when the
 *   visitor has "reduce motion" on, or their browser reports a slow / limited
 *   ("save data") connection — both are strong signals a low-end device or
 *   metered connection is on the other end.
 * - Playback pauses automatically when the tab isn't visible, so it doesn't
 *   burn battery/CPU in a background tab.
 */
export function VideoBackdrop({
  sources,
  tint = "rgba(12,10,18,0.78)",
  poster,
}: {
  sources: string[];
  tint?: string;
  poster?: string;
}) {
  const [index, setIndex] = useState(0);
  const [allowVideo, setAllowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    type NetworkInformation = {
      saveData?: boolean;
      effectiveType?: string;
    };
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    const slowConnection =
      connection?.saveData ||
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g";

    setAllowVideo(!reduceMotion && !slowConnection);
  }, []);

  useEffect(() => {
    if (sources.length < 2 || !allowVideo) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % sources.length),
      12000,
    );
    return () => window.clearInterval(timer);
  }, [sources.length, allowVideo]);

  useEffect(() => {
    if (!allowVideo) return;
    function onVisibility() {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [allowVideo]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0620] via-[#0c0a12] to-[#12071f]" />
      {allowVideo ? (
        <video
          ref={videoRef}
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
      ) : null}
      <div className="absolute inset-0" style={{ background: tint }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,10,18,0.92)_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]" />
    </div>
  );
}

export default VideoBackdrop;
