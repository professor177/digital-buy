"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples] = useState<number[]>([]);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 20, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 250, damping: 20, mass: 0.45 });

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener?.("change", update);

    if (!media.matches) return () => media.removeEventListener?.("change", update);

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a,button,input,textarea,select,[role='button'],.magnetic-target")));
    };
    const down = () => {
      const id = Date.now() + Math.random();
      setRipples((items) => [...items, id]);
      window.setTimeout(() => setRipples((items) => items.filter((item) => item !== id)), 650);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      media.removeEventListener?.("change", update);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[260] hidden md:block">
      <motion.div
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_6px_rgba(34,211,238,0.65)]"
        style={{ left: x, top: y }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-cyan-300/5"
        style={{
          left: ringX,
          top: ringY,
          width: hovering ? 62 : 34,
          height: hovering ? 62 : 34,
          borderColor: hovering ? "rgba(34,211,238,.95)" : "rgba(255,255,255,.5)",
          boxShadow: hovering ? "0 0 35px rgba(34,211,238,.45), inset 0 0 20px rgba(168,85,247,.18)" : "0 0 18px rgba(34,211,238,.16)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
      {ripples.map((id) => (
        <motion.span
          key={id}
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/80"
          style={{ left: x, top: y }}
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 9, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
