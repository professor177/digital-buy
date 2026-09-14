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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold hover:bg-surface-hover transition-colors"
    >
      <MessageCircle size={18} className="text-accent" />
      <span>Support</span>
    </motion.a>
  );
}

export default SupportButton;
