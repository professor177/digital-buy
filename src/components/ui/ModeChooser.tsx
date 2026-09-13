"use client";

import { motion } from "framer-motion";

import MagneticButton from "@/components/ui/MagneticButton";

export type ModeOption = {
  href: string;
  label: string;
  emoji: string;
  tagline: string;
  bullets: string[];
  from: string;
  to: string;
};

export function ModeChooser({
  title,
  subtitle,
  options,
}: {
  title: string;
  subtitle: string;
  options: ModeOption[];
}) {
  return (
    <div className="relative mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl font-semibold tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mt-3 max-w-lg text-sm text-white/55"
      >
        {subtitle}
      </motion.p>

      <div className="mt-12 grid w-full gap-5 sm:grid-cols-2">
        {options.map((option, index) => (
          <motion.div
            key={option.href}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.25 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <MagneticButton
              href={option.href}
              className="group w-full rounded-[26px] p-[1.5px] text-left transition-transform duration-300 hover:scale-[1.02]"
            >
              <span
                className="absolute inset-0 rounded-[26px] opacity-70 blur-lg transition group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${option.from}, ${option.to})` }}
              />
              <span
                className="animate-gradient-pan absolute inset-0 rounded-[26px]"
                style={{ background: `linear-gradient(135deg, ${option.from}, ${option.to})` }}
              />
              <span className="relative block rounded-[24px] bg-[#07061a]/88 p-6 backdrop-blur-xl transition group-hover:bg-[#07061a]/72">
                <span className="mb-3 block text-3xl">{option.emoji}</span>
                <span className="block text-xl font-bold tracking-[0.2em]">
                  {option.label}
                </span>
                <span className="mt-1.5 block text-xs text-white/55">
                  {option.tagline}
                </span>
                <span className="mt-4 block space-y-1.5">
                  {option.bullets.map((bullet) => (
                    <span key={bullet} className="flex items-center gap-2 text-[12px] text-white/65">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: option.to }}
                      />
                      {bullet}
                    </span>
                  ))}
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 transition group-hover:gap-3">
                  Continue →
                </span>
              </span>
            </MagneticButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ModeChooser;
