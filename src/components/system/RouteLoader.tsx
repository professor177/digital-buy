"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import EFootballLoader from "@/components/brand/eFootballLoader";

export function RouteLoader({ duration = 1200 }: { duration?: number }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const firstRender = useRef(true);

  const finish = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(finish, duration);
    return () => window.clearTimeout(timer);
  }, [pathname, duration, finish]);

  return <EFootballLoader active={visible} onComplete={finish} />;
}

export default RouteLoader;
