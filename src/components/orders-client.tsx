"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Check,
  Clock3,
  Copy,
  LifeBuoy,
  PackageOpen,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { bdt, SUPPORT_URL, type OrderDto } from "@/lib/shared";

function MethodDot({ method }: { method: "bkash" | "nagad" }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: method === "bkash" ? "#e2136e" : "#f6921e" }}
      />
      {method === "bkash" ? "bKash" : "Nagad"}
    </span>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="btn btn-dark px-2.5 py-1.5 text-xs"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function StatusPanel({ order }: { order: OrderDto }) {
  if (order.status === "pending") {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-md border border-amber-500/25 bg-amber-500/10 p-4">
        <Clock3 size={18} className="mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-bold text-amber-200">
            Verification in progress
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-200/70">
            We are confirming your transaction ID manually. Most orders clear
            within 24 hours. Your access will appear here the moment it is
            confirmed.
          </p>
        </div>
      </div>
    );
  }
  if (order.status === "verified") {
    return (
      <div className="mt-4 rounded-md border border-brand/30 bg-brand/10 p-4">
        <div className="flex items-start gap-3">
          <BadgeCheck size={18} className="mt-0.5 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand">
              Payment verified. Your access is ready.
            </p>
            {order.credentials ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-brand/20 bg-ink px-3 py-2.5 font-mono text-[13px] leading-6 text-mist">
                  {order.credentials}
                </code>
                <CopyButton text={order.credentials} />
              </div>
            ) : (
              <p className="mt-1 text-sm text-brand/80">
                Access granted. Credentials are attached to this order.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-start gap-3 rounded-md border border-red-500/25 bg-red-500/10 p-4">
      <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
      <div>
        <p className="text-sm font-bold text-red-300">
          We could not verify this payment
        </p>
        <p className="mt-1 text-sm leading-6 text-red-300/70">
          The transaction ID did not match our records. If you believe this is
          a mistake, message us on support with a screenshot of the payment
          and we will re-check it.
        </p>
      </div>
    </div>
  );
}

export function OrdersList({
  initialOrders,
  nickname,
}: {
  initialOrders: OrderDto[];
  nickname: string | null;
}) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const orders = initialOrders;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {nickname ? `Signed in as ${nickname}` : "Your purchase history"}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            My Orders
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setSpinning(true);
            router.refresh();
            setTimeout(() => setSpinning(false), 700);
          }}
          className="btn btn-outline px-4 py-2 text-sm"
        >
          <RefreshCcw size={14} className={spinning ? "animate-spin" : ""} />
          Refresh status
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed border-line bg-panel/50 px-6 py-16 text-center">
          <PackageOpen size={30} className="text-fog/60" />
          <p className="mt-4 font-bold text-white">No orders yet</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-fog">
            When you buy a game account, an OTT package, or the Ubisoft library
            pass, it shows up here with its verification status.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/games" className="btn btn-brand px-5 py-2.5 text-sm">
              Browse games
            </Link>
            <Link href="/ott" className="btn btn-dark px-5 py-2.5 text-sm">
              Browse OTT
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => (
            <article
              key={o.id}
              className="rounded-lg border border-line bg-panel p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold tracking-tight text-white">
                    {o.itemLabel}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fog">
                    <MethodDot method={o.paymentMethod} />
                    <span>{bdt(o.amountBdt)}</span>
                    <span>Ref {o.referralCode}</span>
                    <span>TrxID {o.transactionId}</span>
                    {o.accountType && (
                      <span className="capitalize">{o.accountType} account</span>
                    )}
                    <span>
                      {new Date(o.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`chip ${
                    o.status === "verified"
                      ? "border-brand/40 text-brand"
                      : o.status === "pending"
                        ? "border-amber-500/40 text-amber-300"
                        : "border-red-500/40 text-red-300"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <StatusPanel order={o} />
            </article>
          ))}
          <div className="flex items-center gap-2 pt-2 text-sm text-fog">
            <LifeBuoy size={14} />
            Something wrong with an order?
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand hover:underline"
            >
              Message support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
