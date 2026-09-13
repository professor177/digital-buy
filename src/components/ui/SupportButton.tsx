"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { SUPPORT_MESSENGER_URL } from "@/lib/catalog";

/**
 * Floating center-bottom support button.
 * TODO: replace SUPPORT_MESSENGER_URL in src/lib/catalog.ts with
 * your real Facebook page inbox link, e.g. https://m.me/digitalbuybd
 */
export function SupportButton() {
  return (
    <motion.a
      href={SUPPORT_MESSENGER_URL}
      target="_blank"
      rel="noreferrer"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="group fixed bottom-5 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur-xl"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/40 to-orange-400/40 opacity-70 blur-md transition group-hover:opacity-100" />
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#00b2ff] to-[#006aff]">
        <MessageCircle size={13} className="text-white" fill="white" />
      </span>
      Support
      <span className="hidden text-xs text-white/50 sm:inline">• Messenger</span>
      <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400" />
      </span>
    </motion.a>
  );
}

export default SupportButton;
