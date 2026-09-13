"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

/**
 * Magnetic + ripple button. Renders as a Link when `href` is provided.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 22,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * strength, y: relY * strength });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  function spawnRipple(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(
      () => setRipples((prev) => prev.filter((item) => item.id !== ripple.id)),
      700,
    );
  }

  const inner = (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-white/35"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, opacity: 0.55, x: 0, y: 0 }}
          animate={{ width: 520, height: 520, opacity: 0, x: -260, y: -260 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
      {children}
    </>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={spawnRipple}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
      className="relative inline-block"
    >
      {href ? (
        <Link href={href} className={`relative block overflow-hidden ${className}`}>
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`relative block overflow-hidden ${className}`}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export default MagneticButton;
