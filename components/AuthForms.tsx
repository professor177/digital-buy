"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";

const nice = (e: any) => ({ "auth/invalid-credential": "Incorrect email or password.", "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Use a stronger password (8+ characters).", "auth/too-many-requests": "Too many attempts. Try again later." } as Record<string, string>)[e?.code] ?? "Something went wrong. Try again.";

export default function AuthForms({ next }: { next: string }) {
  const [note, setNote] = useState<{ err?: string; msg?: string }>({}); const [busy, setBusy] = useState(false);
  const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/orders";
  const run = (fn: (f: FormData) => Promise<void>) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setNote({});
    try { await fn(new FormData(e.currentTarget)); } catch (x) { setNote({ err: nice(x) }); } finally { setBusy(false); }
  };
  const login = run(async (f) => {
    const a = clientAuth(); const { user } = await signInWithEmailAndPassword(a, String(f.get("email")), String(f.get("password")));
    if (!user.emailVerified) { await sendEmailVerification(user); await signOut(a); return setNote({ err: "Verify your email first. We sent a new link to your inbox." }); }
    const r = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await user.getIdToken() }) });
    await signOut(a);
    if (!r.ok) return setNote({ err: "Could not start your session. Try again." });
    window.location.assign(dest);
  });
  const signup = run(async (f) => {
    const name = String(f.get("name")).trim(); if (name.length < 2) return setNote({ err: "Enter your name." });
    const a = clientAuth(); const { user } = await createUserWithEmailAndPassword(a, String(f.get("email")), String(f.get("password")));
    await updateProfile(user, { displayName: name }); await sendEmailVerification(user); await signOut(a);
    setNote({ msg: "Account created. Open the verification link we emailed you, then log in." });
  });
  const forgot = run(async (f) => { try { await sendPasswordResetEmail(clientAuth(), String(f.get("email"))); } catch {} setNote({ msg: "If that email has an account, a reset link is on its way." }); });
  return (<>
    {(note.err || note.msg) && <p role={note.err ? "alert" : "status"} className={`toast ${note.err ? "err" : ""}`}>{note.err || note.msg}</p>}
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
      <form onSubmit={login} className="card"><h2 style={{ marginTop: 0 }}>Existing account</h2>
        <label htmlFor="le">Email</label><input id="le" name="email" type="email" required autoComplete="email" />
        <label htmlFor="lp">Password</label><input id="lp" name="password" type="password" required autoComplete="current-password" /><button disabled={busy}>Login</button></form>
      <form onSubmit={signup} className="card"><h2 style={{ marginTop: 0 }}>Create account</h2>
        <label htmlFor="sn">Name</label><input id="sn" name="name" required minLength={2} maxLength={80} autoComplete="name" />
        <label htmlFor="se">Email</label><input id="se" name="email" type="email" required autoComplete="email" />
        <label htmlFor="sp">Password (8+ characters)</label><input id="sp" name="password" type="password" required minLength={8} autoComplete="new-password" /><button disabled={busy}>Create account</button></form>
      <form onSubmit={forgot} className="card"><h2 style={{ marginTop: 0 }}>Forgot password</h2>
        <label htmlFor="fe">Email</label><input id="fe" name="email" type="email" required /><button className="o" disabled={busy}>Send reset link</button></form>
    </div></>);
}
