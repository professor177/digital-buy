"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import MinimalLoader from "@/components/system/MinimalLoader";

/**
 * Page-transition loading screen.
 * Minimal rotating D logo.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setVisible(true);
    // Auto-hide after a short delay since we don't have a data-ready signal here
    setTimeout(() => setVisible(false), 800);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="minimal-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalLoader />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default RouteLoader;
