"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import {
  getFirebaseAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { toE164Bd } from "@/lib/shared";

function mapAuthError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code?: string }).code)
      : "";
  switch (code) {
    case "auth/invalid-phone-number":
      return "That phone number does not look right. Enter your 11 digit bKash era number like 01XXXXXXXXX.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Please wait a few minutes and try again.";
    case "auth/quota-exceeded":
      return "SMS quota reached for today. Please try again tomorrow.";
    case "auth/invalid-verification-code":
      return "That code is not correct. Check the SMS and enter it again.";
    case "auth/code-expired":
      return "That code has expired. Request a fresh code.";
    case "auth/captcha-check-failed":
    case "auth/invalid-app-credential":
      return "reCAPTCHA could not verify this browser. Refresh the page and try again.";
    case "auth/network-request-failed":
      return "Network error while contacting the verification service. Check your connection and retry.";
    default:
      return "Something went wrong while signing you in. Please try again.";
  }
}

export function LoginCard({ next }: { next: string }) {
  const router = useRouter();
  const [stage, setStage] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaSlot = useRef<HTMLDivElement | null>(null);

  if (!isFirebaseClientConfigured()) {
    return (
      <div className="w-full max-w-md rounded-lg border border-line bg-panel p-8 text-center">
        <ShieldCheck size={26} className="mx-auto text-fog" />
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
          Sign in is being configured
        </h1>
        <p className="mt-3 text-sm leading-6 text-fog">
          Phone verification is not connected on this deployment yet. Once the
          Firebase keys are added to the environment, sign in with OTP will
          work here exactly as designed. No test codes and no bypasses are
          wired in.
        </p>
      </div>
    );
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const e164 = toE164Bd(phone);
    if (!e164) {
      setError("Enter a valid Bangladeshi number like 01XXXXXXXXX.");
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (verifierRef.current) {
        try {
          verifierRef.current.clear();
        } catch {
          /* already cleared */
        }
        verifierRef.current = null;
      }
      const verifier = new RecaptchaVerifier(auth, recaptchaSlot.current!, {
        size: "invisible",
      });
      verifierRef.current = verifier;
      const confirmation = await signInWithPhoneNumber(auth, e164, verifier);
      confirmationRef.current = confirmation;
      setSentTo(e164);
      setStage("code");
    } catch (err) {
      setError(mapAuthError(err));
      try {
        verifierRef.current?.clear();
      } catch {
        /* noop */
      }
      verifierRef.current = null;
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = code.replace(/\D/g, "");
    if (cleaned.length !== 6) {
      setError("Enter the 6 digit code from the SMS.");
      return;
    }
    const confirmation = confirmationRef.current;
    if (!confirmation) {
      setStage("phone");
      setError("Session expired. Please request a new code.");
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const credential = PhoneAuthProvider.credential(
        confirmation.verificationId,
        cleaned,
      );
      const userCred = await signInWithCredential(auth, credential);
      const idToken = await userCred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        await signOut(auth).catch(() => undefined);
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "session_failed");
      }
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "auth_not_configured"
          ? "The server could not verify your sign in because server keys are not configured yet. Please contact support."
          : err instanceof Error && err.message === "session_failed"
            ? "Signed in on your phone, but the server session could not be created. Please try again."
            : mapAuthError(err),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-line bg-panel p-7 sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          {stage === "phone" ? "Sign in" : "Enter the SMS code"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-fog">
          {stage === "phone"
            ? "We verify your phone with a one time code over SMS. No passwords to remember."
            : `A 6 digit code was sent to ${sentTo}. It usually arrives within a minute.`}
        </p>

        {stage === "phone" ? (
          <form onSubmit={sendCode} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow mb-2 block" htmlFor="phone">
                Phone number
              </label>
              <div className="flex items-stretch gap-2">
                <span className="grid place-items-center rounded-md border border-line bg-panel2 px-3 text-sm font-bold text-fog">
                  +880
                </span>
                <input
                  id="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                  maxLength={11}
                />
              </div>
            </div>
            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn btn-brand w-full px-5 py-3 text-sm"
            >
              <Smartphone size={16} />
              {busy ? "Sending code..." : "Send verification code"}
            </button>
            <p className="text-xs leading-5 text-fog/70">
              Protected by reCAPTCHA. Standard SMS charges from your operator
              may apply.
            </p>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow mb-2 block" htmlFor="otp">
                Verification code
              </label>
              <input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6 digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="field text-center text-lg tracking-[0.5em]"
                maxLength={6}
              />
            </div>
            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn btn-brand w-full px-5 py-3 text-sm"
            >
              <KeyRound size={16} />
              {busy ? "Verifying..." : "Verify and sign in"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStage("phone");
                  setCode("");
                  setError(null);
                }}
                className="font-semibold text-fog hover:text-white"
              >
                Use a different number
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => sendCode()}
                className="font-semibold text-brand hover:underline"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        type="button"
        disabled
        className="btn btn-dark mt-3 w-full px-5 py-3 text-sm"
        title="Not available yet"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.8 3-4.4 3-7.5z M12 22c2.7 0 5-.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22z M6.4 13.8a6 6 0 0 1 0-3.8V7.4H3.1a10 10 0 0 0 0 9z M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4l3.3 2.6C7.2 7.8 9.4 6 12 6z"
          />
        </svg>
        Continue with Google
        <span className="ml-auto rounded-sm border border-line px-1.5 py-px text-[9px] font-bold tracking-widest text-fog/70">
          NOT AVAILABLE YET
        </span>
      </button>

      {/* reCAPTCHA mounts here (invisible) */}
      <div ref={recaptchaSlot} />
    </div>
  );
}
