"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Apple-style "hello" boot animation.
 * The path data is the real cursive "hello" lettering, drawn with an
 * SVG stroke-dashoffset (pathLength) animation over ~2.5s, using a
 * cyan → purple → pink → orange → yellow-green gradient stroke.
 */
const HELLO_PATH =
  "M227.3,493.4 C329,392.7 285.7,451.4 329,392.7 C362.4,347.5 379.8,286.7 366.4,260.5 C317.7,165.3 288.7,512.3 295.8,512.3 C302.9,512.4 302.5,411.4 338.3,388.4 C374.1,365.5 386.8,396 388.4,410.3 C391.1,433.3 380.2,469.7 382.1,483 C389.7,538.5 513.4,484 523.2,421 C533.7,353.3 442,356.6 460.1,464.7 C466.7,504.5 508.2,514.7 530.2,508.8 C609.8,487.3 664.4,377.5 662.4,293.2 C659.9,183.9 574.3,294.3 594.9,462.6 C602.8,527.4 670.1,506.3 690,489.1 C726.8,457.2 791.6,365.2 779.7,276 C767.4,182.9 674.2,336.3 716.9,475.8 C731.2,522.4 774,506.6 785.8,499.4 C813.6,482.4 822.6,420.7 845.7,393.8 C874.9,359.8 920.9,385.2 922.8,425.7 C927,514.8 865.9,514.9 843.2,494.8 C823.5,477.5 818.9,425.8 845.4,393.8 C863.4,372 892.4,371.4 930.4,396 C945.9,406 959.2,404.2 969.7,388.1";

const DRAW_MS = 2500;
const WELCOME_MS = 1900;

export function HelloIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"hello" | "welcome" | "done">("hello");

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("welcome"), DRAW_MS + 350);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      onFinish();
    }, DRAW_MS + 350 + WELCOME_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#05040c]"
          exit={{ opacity: 0, filter: "blur(14px)", scale: 1.06 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ambient aurora behind the lettering */}
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-blob absolute -left-24 top-10 h-[42vmax] w-[42vmax] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.35),transparent_65%)] blur-3xl" />
            <div className="animate-blob absolute -right-20 bottom-0 h-[38vmax] w-[38vmax] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.28),transparent_65%)] blur-3xl [animation-delay:-7s]" />
            <div className="animate-blob absolute left-1/3 top-1/2 h-[34vmax] w-[34vmax] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.25),transparent_65%)] blur-3xl [animation-delay:-13s]" />
          </div>

          <AnimatePresence mode="wait">
            {phase === "hello" ? (
              <motion.div
                key="hello"
                className="relative w-[88vw] max-w-4xl"
                exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <svg viewBox="190 140 820 450" className="w-full" fill="none">
                  <defs>
                    <linearGradient id="helloGradient" x1="0%" y1="0%" x2="100%" y2="20%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="26%" stopColor="#a855f7" />
                      <stop offset="52%" stopColor="#ec4899" />
                      <stop offset="78%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#a3e635" />
                    </linearGradient>
                    <filter id="helloGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="12" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* soft ghost trail */}
                  <motion.path
                    d={HELLO_PATH}
                    stroke="url(#helloGradient)"
                    strokeWidth={34}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.28}
                    filter="url(#helloGlow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: DRAW_MS / 1000, ease: [0.35, 0.1, 0.25, 1] }}
                  />
                  {/* the crisp handwriting stroke */}
                  <motion.path
                    d={HELLO_PATH}
                    stroke="url(#helloGradient)"
                    strokeWidth={22}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: DRAW_MS / 1000, ease: [0.35, 0.1, 0.25, 1] }}
                  />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                className="relative px-6 text-center"
                initial={{ opacity: 0, y: 38, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  className="mb-4 text-xs uppercase tracking-[0.55em] text-white/45"
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.55em" }}
                  transition={{ duration: 1, delay: 0.15 }}
                >
                  Welcome to
                </motion.p>
                <h1 className="text-gradient animate-gradient-pan text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl">
                  Digital Buy
                </h1>
                <motion.p
                  className="mt-6 text-sm text-white/50 sm:text-base"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                >
                  Premium gaming accounts &amp; OTT subscriptions — delivered instantly.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default HelloIntro;
