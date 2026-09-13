"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DMark from "@/components/brand/DMark";

type Props = {
  active: boolean;
  onComplete: () => void;
};

export default function EFootballLoader({ active, onComplete }: Props) {
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    if (!active) {
      setSkipping(false);
      return;
    }

    const timer = window.setTimeout(() => setSkipping(true), 1050);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!skipping) return;
    const timer = window.setTimeout(onComplete, 620);
    return () => window.clearTimeout(timer);
  }, [skipping, onComplete]);

  function skip() {
    if (active) setSkipping(true);
  }

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="efootball-loader"
          role="status"
          aria-label="Loading Digital Buy"
          onPointerDown={skip}
          className="fixed inset-0 z-[190] grid cursor-pointer place-items-center overflow-hidden bg-[#05040c]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)", scale: 1.04 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="loader-aurora loader-aurora-one" />
          <div className="loader-aurora loader-aurora-two" />
          <div className="loader-speed-lines" />

          <motion.div
            className="relative grid h-44 w-44 place-items-center sm:h-56 sm:w-56"
            initial={{ scale: 0.72, opacity: 0, rotateY: -35 }}
            animate={
              skipping
                ? { scale: 7.5, rotateY: 360, opacity: 0, filter: "blur(20px)" }
                : { scale: 1, opacity: 1, rotateY: 360 }
            }
            transition={
              skipping
                ? { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
                : { scale: { duration: 0.45 }, rotateY: { duration: 2.4, repeat: Infinity, ease: "linear" } }
            }
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 rounded-full border border-cyan-200/30 bg-white/[0.035] shadow-[0_0_90px_rgba(34,211,238,0.25),inset_0_0_55px_rgba(168,85,247,0.25)] backdrop-blur-xl" />
            <div className="absolute inset-3 rounded-full border border-dashed border-fuchsia-300/35" />
            <div className="absolute inset-[-14px] rounded-full border border-cyan-300/20" />
            <div className="absolute inset-[-30px] rounded-full border border-white/5" />
            <div className="relative grid h-28 w-28 place-items-center rounded-[30%] bg-gradient-to-br from-white/20 via-cyan-300/10 to-fuchsia-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_45px_rgba(34,211,238,0.22)] sm:h-36 sm:w-36">
              <DMark size={92} animated={false} glow={true} strokeWidth={10} />
            </div>
            <motion.div
              className="absolute inset-[-52px] rounded-full border border-cyan-300/20"
              animate={{ rotate: -360, scale: [1, 1.08, 1] }}
              transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-6 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65 backdrop-blur-xl sm:right-10"
            animate={{ opacity: [0.45, 1, 0.45], y: [0, -3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Tap anywhere to skip
          </motion.div>

          <div className="absolute bottom-8 left-6 text-[9px] uppercase tracking-[0.35em] text-white/30 sm:left-10">
            Digital Buy / Loading experience
          </div>

          {skipping ? (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.42, times: [0, 0.28, 1] }}
            />
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
