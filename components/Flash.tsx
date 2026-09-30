"use client";
import { useEffect, useState } from "react";
export default function Flash({ sp }: { sp: { msg?: string; err?: string } }) {
  const t = sp.err || sp.msg; const [open, set] = useState(true);
  useEffect(() => { set(true); if (!sp.err) { const id = setTimeout(() => set(false), 7000); return () => clearTimeout(id); } }, [t, sp.err]);
  return t && open ? <p role={sp.err ? "alert" : "status"} className={`toast ${sp.err ? "err" : ""}`}>{t.slice(0, 200)} <button className="o" style={{ padding: "0 8px", marginLeft: 8 }} onClick={() => set(false)} aria-label="Dismiss">x</button></p> : null;
}
