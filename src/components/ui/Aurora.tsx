"use client";

/** Animated aurora blobs + starfield used as the ambient site background. */
const STARS = [
  [8, 18], [17, 62], [24, 31], [31, 78], [39, 12], [46, 54], [53, 87],
  [58, 24], [64, 68], [71, 40], [77, 91], [83, 15], [88, 57], [94, 34],
  [12, 88], [28, 6], [43, 96], [67, 4], [90, 74], [5, 47],
] as const;

export function Aurora({ dense = false }: { dense?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#05040c]" />

      <div className="animate-blob absolute -left-[12vw] top-[-10vh] h-[52vmax] w-[52vmax] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.32),transparent_62%)] blur-[90px]" />
      <div className="animate-blob absolute right-[-14vw] top-[8vh] h-[46vmax] w-[46vmax] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.26),transparent_62%)] blur-[90px] [animation-delay:-8s]" />
      <div className="animate-blob absolute bottom-[-18vh] left-[18vw] h-[48vmax] w-[48vmax] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.24),transparent_62%)] blur-[90px] [animation-delay:-14s]" />
      {dense ? (
        <div className="animate-blob absolute bottom-[6vh] right-[12vw] h-[34vmax] w-[34vmax] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.2),transparent_62%)] blur-[90px] [animation-delay:-19s]" />
      ) : null}

      {STARS.map(([left, top], index) => (
        <span
          key={`${left}-${top}`}
          className="animate-twinkle absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${(index % 7) * 0.6}s`,
          }}
        />
      ))}

      {/* grid + grain */}
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,4,12,0.85)_100%)]" />
    </div>
  );
}

export default Aurora;
