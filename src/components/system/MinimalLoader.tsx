"use client";

import { motion } from "framer-motion";
import DMark from "@/components/brand/DMark";

/**
 * Minimal rotating logo loader as requested.
 * No spinner rings, no decoration, just the D logo rotating.
 */
export function MinimalLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg">
      <div className="animate-logo-spin">
        <DMark size={80} glow={false} strokeWidth={8} />
      </div>
    </div>
  );
}

export default MinimalLoader;
