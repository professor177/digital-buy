"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, label[for], [role="button"], [role="tab"], .magnetic-target';

/** Distance (px) from a target's centre at which the ring starts to lock on. */
const MAGNET_PULL = 0.34;

/**
 * Static custom cursor icon/shape.
 * Changes on hover for clickable elements.
 * No trails or particles.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    setEnabled(query.matches);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('a, button, input, [role="button"]')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    if (query.matches) {
      document.documentElement.classList.add("cursor-none-root");
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, [cursorX, cursorY, visible]);

  if (!enabled || !visible) return null;

  return (
    <motion.div
      className={`custom-cursor ${hovering ? "hover" : ""}`}
      style={{
        left: cursorX,
        top: cursorY,
      }}
    />
  );
}

export default CustomCursor;
