"use client";
import { useEffect, useState } from "react";

export function IntroGate() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const key = "digital-buy-intro-v1";
    if (window.localStorage.getItem(key)) return;
    setShow(true);
    window.localStorage.setItem(key, "1");
    const timer = window.setTimeout(() => setShow(false), 950);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="intro-screen" role="status" aria-label="Loading Digital Buy"><div><div className="intro-mark">DB</div><div className="intro-line" /></div></div>;
}
