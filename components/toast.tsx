"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };
type ToastContextValue = { push: (message: string, tone?: Toast["tone"]) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => setToasts((items) => items.filter((x) => x.id !== id)), 4200);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return <ToastContext.Provider value={value}>{children}<div aria-live="polite" className="fixed right-4 top-4 z-[120] flex w-[min(360px,calc(100%-32px))] flex-col gap-2">{toasts.map((t) => <div key={t.id} className={`border p-3 text-sm shadow-xl ${t.tone === "success" ? "border-emerald-700 bg-emerald-950 text-emerald-100" : t.tone === "error" ? "border-red-800 bg-red-950 text-red-100" : "border-slate-700 bg-slate-950 text-slate-100"}`}>{t.message}</div>)}</div></ToastContext.Provider>;
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
