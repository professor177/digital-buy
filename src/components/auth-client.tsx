"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { KeyRound, LogIn, Mail, ShieldCheck, UserPlus } from "lucide-react";
import {
  getFirebaseAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { VerifyEmailCard } from "@/components/verify-email";

function authErrorCode(err: unknown): string {
  return typeof err === "object" && err !== null && "code" in err
    ? String((err as { code?: string }).code)
    : "";
}

/**
 * Error codes that mean the Firebase project itself is misconfigured for
 * this deployment. Only these (or missing env vars) may surface the
 * "sign in is being configured" screen. Everything else shows an inline
 * error so the real cause never gets hidden.
 */
const CONFIG_ERROR_CODES = new Set([
  "auth/invalid-api-key",
  "auth/api-key-not-valid",
  "auth/app-not-authorized",
  "auth/project-not-found",
  "auth/operation-not-allowed",
  "auth/unauthorized-domain",
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function mapAuthError(err: unknown, context: "login" | "signup"): string {
  const code = authErrorCode(err);
  switch (code) {
    case "auth/invalid-email":
      return "That email address does not look right. Check for typos.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Switch to Log in and use your password, or reset it below.";
    case "auth/weak-password":
      return "That password is too weak. Use at least 8 characters with letters and numbers.";
    case "auth/user-not-found":
      return "No account exists with that email. Create one first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return context === "login"
        ? "Email or password is incorrect. Double check, or use Forgot password to reset it."
        : "Those credentials were rejected. Check the email and password.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for help.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error while contacting the sign-in service. Check your connection and retry.";

    default:
      return context === "signup"
        ? "Could not create the account right now. Please try again."
        : "Could not log you in right now. Please try again.";
  }
}

function ConfigNoticePanel() {
  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-panel p-8 text-center">
      <ShieldCheck size={26} className="mx-auto text-fog" />
      <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
        Sign in is being configured
      </h1>
      <p className="mt-3 text-sm leading-6 text-fog">
        Email sign-in is not connected on this deployment yet. Once the
        Firebase keys are added to the environment, creating an account and
        logging in will work here exactly as designed.
      </p>
    </div>
  );
}

export function LoginCard({ next }: { next: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [stage, setStage] = useState<"auth" | "verify">("auth");
  const [configBroken, setConfigBroken] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState("");

  if (!isFirebaseClientConfigured() || configBroken) {
    return <ConfigNoticePanel />;
  }

  function handleFailure(err: unknown, context: "login" | "signup") {
    if (CONFIG_ERROR_CODES.has(authErrorCode(err))) {
      setConfigBroken(true);
      return;
    }
    setError(mapAuthError(err, context));
  }

  /** Creates the server session and routes to verify gate or destination. */
  async function finalizeAndRoute() {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("no_user");
    // Reload so emailVerified is fresh from Firebase, not a cached claim.
    await user.reload();
    const idToken = await user.getIdToken(true);
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
    if (user.emailVerified) {
      router.replace(next);
      router.refresh();
    } else {
      setVerifyEmail(user.email ?? email.trim());
      setStage("verify");
    }
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (trimmedName.length < 2) {
      setError("Enter your name (at least 2 characters).");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("Use at least 8 characters with a mix of letters and numbers.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) await signOut(auth).catch(() => undefined);
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      try {
        await updateProfile(cred.user, { displayName: trimmedName });
      } catch {
        /* nickname can be set later from account settings */
      }
      try {
        await sendEmailVerification(cred.user);
        setNotice(`Verification email sent to ${trimmedEmail}.`);
      } catch (verifyErr) {
        setNotice(
          authErrorCode(verifyErr) === "auth/too-many-requests"
            ? "Account created. Verification email could not be sent yet due to rate limits; use Resend on the next screen."
            : "Account created. The verification email did not send; use Resend on the next screen.",
        );
      }
      await finalizeAndRoute();
    } catch (err) {
      if (err instanceof Error && err.message === "session_failed") {
        setError("Signed up on Firebase, but the server session failed. Try logging in once.");
      } else if (err instanceof Error && err.message === "auth_not_configured") {
        setConfigBroken(true);
      } else {
        handleFailure(err, "signup");
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const trimmedEmail = email.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) await signOut(auth).catch(() => undefined);
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      await finalizeAndRoute();
    } catch (err) {
      if (err instanceof Error && err.message === "session_failed") {
        setError("Logged in on Firebase, but the server session failed. Please try again.");
      } else if (err instanceof Error && err.message === "auth_not_configured") {
        setConfigBroken(true);
      } else {
        handleFailure(err, "login");
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const trimmed = resetEmail.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter the email you used to create your account.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), trimmed);
      setNotice(
        `If an account exists for ${trimmed}, a password reset link is on its way. Check inbox and spam.`,
      );
      setShowReset(false);
    } catch (err) {
      const code = authErrorCode(err);
      setError(
        code === "auth/too-many-requests"
          ? "Too many reset emails requested. Wait a few minutes and try again."
          : code === "auth/network-request-failed"
            ? "Network error. Check your connection and try again."
            : code === "auth/invalid-email"
              ? "That email address does not look right. Check for typos."
              : code === "auth/user-not-found"
                ? "No account exists with that email."
                : "Could not send the reset email right now. Try again in a moment.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (stage === "verify") {
    return (
      <VerifyEmailCard
        email={verifyEmail}
        onVerified={async () => {
          router.replace(next);
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-line bg-panel p-7 sm:p-8">
        {/* Tab switch: Create account / Log in */}
        <div className="grid grid-cols-2 gap-1 rounded-md border border-line bg-ink p-1">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
              setNotice(null);
              setShowReset(false);
            }}
            className={`flex items-center justify-center gap-2 rounded-[5px] px-3 py-2.5 text-sm font-bold transition-colors ${
              tab === "login" ? "bg-brand text-[#06140c]" : "text-fog hover:text-white"
            }`}
          >
            <LogIn size={15} /> Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError(null);
              setNotice(null);
              setShowReset(false);
            }}
            className={`flex items-center justify-center gap-2 rounded-[5px] px-3 py-2.5 text-sm font-bold transition-colors ${
              tab === "signup" ? "bg-brand text-[#06140c]" : "text-fog hover:text-white"
            }`}
          >
            <UserPlus size={15} /> Create account
          </button>
        </div>

        <p className="mt-5 text-sm leading-6 text-fog">
          Create an account with your email, or log in if you already have
          one. Verification and password reset emails come straight from
          Firebase.
        </p>

        {tab === "signup" ? (
          <form onSubmit={submitSignup} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow mb-2 block" htmlFor="name">Name</label>
              <input
                id="name"
                className="field"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                className="field"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="field"
                autoComplete="new-password"
                placeholder="At least 8 characters, letters and numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                className="field"
                autoComplete="new-password"
                placeholder="Repeat the password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {error && <ErrorNote>{error}</ErrorNote>}
            {notice && <OkNote>{notice}</OkNote>}
            <button type="submit" disabled={busy} className="btn btn-brand w-full px-5 py-3 text-sm">
              <UserPlus size={16} />
              {busy ? "Creating account..." : "Create account"}
            </button>
            <p className="text-xs leading-5 text-fog/70">
              We email you a verification link right away. You need it before
              placing orders.
            </p>
          </form>
        ) : (
          <form onSubmit={submitLogin} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow mb-2 block" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="field"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="eyebrow" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowReset((s) => !s);
                    setResetEmail((prev) => prev || email);
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-xs font-bold text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                className="field"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {showReset && (
              <div className="rounded-md border border-line bg-ink p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <KeyRound size={14} className="text-brand" /> Reset your password
                </p>
                <p className="mt-1 text-xs leading-5 text-fog">
                  We will email you a reset link. It comes from Firebase and
                  works even if you cannot log in.
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    className="field"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={submitReset}
                    className="btn btn-brand shrink-0 px-4 py-2 text-sm"
                  >
                    <Mail size={14} /> Send
                  </button>
                </div>
              </div>
            )}

            {error && <ErrorNote>{error}</ErrorNote>}
            {notice && <OkNote>{notice}</OkNote>}
            <button type="submit" disabled={busy} className="btn btn-brand w-full px-5 py-3 text-sm">
              <LogIn size={16} />
              {busy ? "Logging in..." : "Log in"}
            </button>
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
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {children}
    </p>
  );
}

function OkNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
      {children}
    </p>
  );
}
