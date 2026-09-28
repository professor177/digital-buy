import { Clapperboard, MonitorPlay, Music2, Play, Tv } from "lucide-react";
import { platformBrand } from "@/lib/shared";

/**
 * Solid-color brand placeholder for an OTT platform card or header.
 * Rendered only when the platform has no rights-appropriate key art in the
 * database yet (introMedia is empty). Never substitutes unrelated photos.
 */
export function PlatformArt({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const brand = platformBrand(slug);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: brand.bg }}
      aria-hidden="true"
    >
      <span
        className="pointer-events-none absolute -bottom-12 -right-4 select-none font-editorial italic leading-none"
        style={{ color: brand.accent, opacity: 0.16, fontSize: "12rem" }}
      >
        {name.charAt(0)}
      </span>
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: brand.accent }}
      />
      <span
        className="absolute left-5 top-5 text-[10px] font-bold uppercase tracking-[0.32em]"
        style={{ color: brand.accent }}
      >
        Stream via Digital Buy
      </span>
    </div>
  );
}

/** Neutral placeholder for an OTT package thumbnail (solid brand tint + icon). */
export function PackageArt({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const brand = platformBrand(slug);
  const Icon =
    slug === "spotify"
      ? Music2
      : slug === "youtube-premium"
        ? Play
        : slug === "apple-tv"
          ? Tv
          : slug === "prime-video"
            ? MonitorPlay
            : Clapperboard;
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{ background: brand.bg }}
      aria-hidden="true"
    >
      <Icon size={34} strokeWidth={1.5} style={{ color: brand.accent }} />
      <span
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ background: brand.accent, opacity: 0.6 }}
      />
    </div>
  );
}
