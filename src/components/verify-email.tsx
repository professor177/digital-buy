"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, signOut } from "firebase/auth";
import { BadgeCheck, MailCheck, RefreshCcw } from "lucide-react";
import {
  getFirebaseAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";

const RESEND_COOLDOWN = 60;

/**
 * The "check your email" gate shown after signup, after unverified logins,
 * and wherever purchases/orders/account settings require a verified email.
 * Uses Firebase's built-in verification email. "Continue" always reloads the
 * user object first, so the flag is fresh from Firebase, never cached.
 */
export function VerifyEmailCard({
  email,
  onVerified,
}: {
  email: string;
  /** Custom continuation. Defaults to a server refresh of the current page. */
  onVerified?: () => Promise<void> | void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function firebaseUserOrError() {
    if (!isFirebaseClientConfigured()) {
      setError(
        "The email service is not configured on this deployment yet, so messages cannot be sent right now.",
      );
      return null;
    }
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      setError(
        "Your sign-in session has ended in this browser. Log in again to resend the verification email.",
      );
      return null;
    }
    return user;
  }

  async function resend() {
    setError(null);
    setNotice(null);
    const user = firebaseUserOrError();
    if (!user) return;
    setBusy(true);
    try {
      await sendEmailVerification(user);
      setNotice(`Verification email sent to ${user.email ?? email}.`);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";
      setError(
        code === "auth/too-many-requests"
          ? "Too many emails were requested recently. Wait a few minutes before resending."
          : code === "auth/network-request-failed"
            ? "Network error while sending the email. Check your connection and try again."
            : "Could not send the verification email right now. Try again in a moment.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function continueVerified() {
    setError(null);
    setNotice(null);
    if (!isFirebaseClientConfigured()) {
      setError(
        "The email service is not configured on this deployment yet. Verification status cannot be refreshed here.",
      );
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Your sign-in session has ended. Log in again to continue.");
        return;
      }
      // Fresh flag from Firebase, per requirement: reload, never trust cache.
      await user.reload();
      if (!user.emailVerified) {
        setError(
          "Still unverified. Open the newest verification email, click the link, wait a few seconds, then try again.",
        );
        return;
      }
      const idToken = await user.getIdToken(true);
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        setError(
          "Verified, but the server session could not be updated. Refresh the page once.",
        );
        return;
      }
      if (onVerified) {
        await onVerified();
      } else {
        router.refresh();
      }
    } catch {
      setError("Could not check your verification status. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function useDifferentEmail() {
    try {
      if (isFirebaseClientConfigured()) {
        await signOut(getFirebaseAuth());
      }
    } catch {
      /* noop */
    }
    await fetch("/api/auth/session", { method: "DELETE" }).catch(
      () => undefined,
    );
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-panel p-7 text-center sm:p-8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-brand/30 bg-brand/10">
        <MailCheck size={22} className="text-brand" />
      </span>
      <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
        Check your email to verify your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-fog">
        We sent a verification link to{" "}
        <span className="font-bold text-white">{email || "your email"}</span>.
        Open it and click the link inside. You can close this page while you
        do that.
      </p>
      {notice && (
        <p className="mt-4 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        onClick={continueVerified}
        disabled={busy}
        className="btn btn-brand mt-6 w-full px-5 py-3 text-sm"
      >
        <BadgeCheck size={16} />
        {busy ? "Checking..." : "I have verified my email, continue"}
      </button>
      <button
        onClick={resend}
        disabled={busy || cooldown > 0}
        className="btn btn-dark mt-3 w-full px-5 py-2.5 text-sm"
      >
        <RefreshCcw size={14} />
        {cooldown > 0
          ? `Resend verification email (${cooldown}s)`
          : "Resend verification email"}
      </button>
      <p className="mt-4 text-xs leading-5 text-fog/70">
        Nothing arrived? Check spam and promotions folders. The email comes
        from Firebase on behalf of Digital Buy.
      </p>
      <button
        onClick={useDifferentEmail}
        className="mt-3 text-xs font-semibold text-fog hover:text-white"
      >
        Use a different email
      </button>
    </div>
  );
}
