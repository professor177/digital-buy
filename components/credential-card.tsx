"use client";
import { useState } from "react";
import { EyeIcon } from "@/components/icons";
export function CredentialCard({ username, password, instructions }: { username:string|null; password:string|null; instructions:string|null }) {
  const [show, setShow] = useState(false);
  return <div className="mt-4 border border-emerald-900/60 bg-emerald-950/20 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">Delivered access</p><button className="btn btn-secondary !min-h-8 !px-2 !py-1 text-xs" type="button" onClick={()=>setShow(v=>!v)}><EyeIcon className="h-4 w-4"/>{show ? "Hide" : "Reveal"}</button></div>{show ? <dl className="mt-4 grid gap-3 text-sm"><div><dt className="muted">Username / email</dt><dd className="mt-1 break-all font-mono">{username || "Not required"}</dd></div><div><dt className="muted">Password</dt><dd className="mt-1 break-all font-mono">{password || "Not required"}</dd></div>{instructions && <div><dt className="muted">Instructions</dt><dd className="mt-1 whitespace-pre-line leading-6">{instructions}</dd></div>}</dl> : <p className="muted mt-3 text-sm">Credentials are hidden on screen until you choose to reveal them.</p>}</div>;
}
