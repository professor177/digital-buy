"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export type ModeOption = {
  href: string;
  label: string;
  tagline: string;
  bullets: string[];
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-4 max-w-lg text-sm text-text-secondary"
      >
        {subtitle}
      </motion.p>

      <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
        {options.map((option, index) => (
          <motion.div
            key={option.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <Link
              href={option.href}
              className="card group block p-8 text-left hover:border-accent transition-all duration-200"
            >
              <span className="block text-2xl font-bold tracking-widest text-text-primary uppercase">
                {option.label}
              </span>
              <span className="mt-2 block text-sm text-text-secondary">
                {option.tagline}
              </span>
              <div className="mt-6 space-y-3">
                {option.bullets.map((bullet) => (
                  <span key={bullet} className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-sm bg-accent opacity-50" />
                    {bullet}
                  </span>
                ))}
              </div>
              <span className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
                Select Option
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ModeChooser;
