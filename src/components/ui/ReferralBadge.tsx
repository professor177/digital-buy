"use client";

import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";

export function ReferralBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op, code is still visible on screen
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-left transition hover:border-[var(--brand-gold)]/50"
    >
      <span className="flex items-center gap-2 text-xs text-white/45">
        <Tag size={14} className="text-[var(--brand-gold)]" />
        Referral code
      </span>
      <span className="flex items-center gap-2 text-sm font-semibold tracking-wide">
        {code}
        {copied ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Copy size={14} className="text-white/40" />
        )}
      </span>
    </button>
  );
}

export default ReferralBadge;
