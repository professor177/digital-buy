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
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      <motion.path
        d="M34 132 L34 18 C96 18 122 44 122 75 C122 106 96 132 34 132"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={
          animated
            ? {
                duration,
                ease: "linear",
                repeat: loop ? Infinity : 0,
              }
            : undefined
        }
      />
      <motion.circle
        cx="34"
        cy="132"
        r="6"
        fill="var(--color-accent)"
      />
    </svg>
  );
}

export default DMark;
