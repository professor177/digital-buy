"use client";
import { useEffect, useState } from "react";
export default function Intro() {
  const [show, set] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem("db_intro") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("db_intro", "1"); set(true); setTimeout(() => set(false), 1400);
    }
  }, []);
  return show ? <div className="intro" aria-hidden>Digital<span style={{ color: "var(--ac)" }}>Buy</span></div> : null;
}
