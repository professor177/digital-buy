"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DMark from "@/components/brand/DMark";

type Props = {
  active: boolean;
  onComplete: () => void;
};

/**
 * Lightweight loading screen — the D mark spins in place.
 * No blur filters, no full-screen animated blobs: kept cheap so it stays
 * smooth on low-end phones.
 */
export default function EFootballLoader({ active, onComplete }: Props) {
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    if (!active) {
      setSkipping(false);
      return;
    }
    const timer = window.setTimeout(() => setSkipping(true), 900);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!skipping) return;
    const timer = window.setTimeout(onComplete, 320);
    return () => window.clearTimeout(timer);
  }, [skipping, onComplete]);

  function skip() {
    if (active) setSkipping(true);
  }

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading Digital Buy"
          onPointerDown={skip}
          className="fixed inset-0 z-[190] grid cursor-pointer place-items-center bg-[#0c0a12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="relative grid h-28 w-28 place-items-center">
            <div className="loader-ring" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            >
              <DMark size={72} animated={false} glow />
            </motion.div>
          </div>

          <div className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-white/35">
            Digital Buy
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
