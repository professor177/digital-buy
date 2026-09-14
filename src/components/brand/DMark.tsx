"use client";

import { motion } from "framer-motion";

/**
 * Stylized "D" logo mark.
 * `animated` draws the letter with an SVG stroke-dashoffset (pathLength) draw,
 * exactly like the loading animation used between page transitions.
 */
export function DMark({
  size = 40,
  animated = false,
  duration = 1.1,
  loop = false,
  strokeWidth = 9,
  className = "",
  glow = true,
}: {
  size?: number;
  animated?: boolean;
  duration?: number;
  loop?: boolean;
  strokeWidth?: number;
  className?: string;
  glow?: boolean;
}) {
  const gradientId = `dmark-grad-${animated ? "a" : "s"}-${size}`;

  return (
    <svg
      viewBox="0 0 140 150"
      width={size}
      height={size * (150 / 140)}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4d4" />
          <stop offset="100%" stopColor="#f2b134" />
        </linearGradient>
        {glow ? (
          <filter id={`${gradientId}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>

      <motion.path
        d="M34 132 L34 18 C96 18 122 44 122 75 C122 106 96 132 34 132"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? `url(#${gradientId}-glow)` : undefined}
        initial={animated ? { pathLength: 0, opacity: 0.2 } : false}
        animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
        transition={
          animated
            ? {
                duration,
                ease: [0.22, 0.61, 0.36, 1],
                repeat: loop ? Infinity : 0,
                repeatType: "loop",
                repeatDelay: loop ? 0.25 : 0,
              }
            : undefined
        }
      />
      <motion.circle
        cx="34"
        cy="132"
        r="5.5"
        fill="#f2b134"
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: [0, 1.35, 1], opacity: 1 } : undefined}
        transition={
          animated
            ? { duration: 0.45, delay: duration * 0.82, repeat: loop ? Infinity : 0, repeatDelay: loop ? duration * 0.6 : 0 }
            : undefined
        }
      />
    </svg>
  );
}

export default DMark;
