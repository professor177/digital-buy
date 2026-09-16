import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SUPPORT_URL } from "@/lib/shared";

const DOCS: Record<
  string,
  { title: string; updated: string; sections: Array<{ h: string; body: string[] }> }
> = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "What we collect",
        body: [
          "When you sign in we store your phone number, which is verified through Firebase Authentication (a Google service). We also store the nickname you choose, your orders, the payment method you select, and the transaction ID you submit.",
          "We do not store passwords, card numbers, or bKash/Nagad PINs. Ever.",
        ],
      },
      {
        h: "How we use it",
        body: [
          "Your phone number identifies your account and lets us match payments to orders. Your transaction ID is used only to verify that specific payment with our bKash or Nagad merchant statement.",
          "We do not sell, rent, or share your personal data with advertisers. Credentials we issue are visible only inside your signed-in account.",
        ],
      },
      {
        h: "Third party services",
        body: [
          "Authentication runs on Firebase (Google). reCAPTCHA may set security cookies to confirm you are human. Media thumbnails and trailers are loaded from public CDNs.",
          "Support conversations happen on Instagram and are governed by Meta's privacy policy.",
        ],
      },
      {
        h: "Retention and deletion",
        body: [
          "Order records are kept so we can honor replacements and resolve disputes. You can ask us on support to delete your account; this removes your profile and sign-in, while anonymized payment references may be retained for bookkeeping as required by law.",
        ],
      },
      {
        h: "Contact",
        body: [
          "Questions about this policy: message us on Instagram support and we will answer within a day.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "The service",
        body: [
          "Digital Buy sells game account access (Steam, Xbox, and the Ubisoft library pass) and OTT subscription packages (Netflix, Spotify, and others as added). All prices are listed and charged in Bangladeshi Taka (BDT).",
          "We are an independent reseller. Steam, Xbox, Ubisoft, Netflix, Spotify, bKash, and Nagad are trademarks of their respective owners and appear here only to describe the products.",
        ],
      },
      {
        h: "Orders and payment",
        body: [
          "Payment is made manually by sending the exact amount through bKash or Nagad Send Money to the merchant number shown at checkout, then submitting the Transaction ID. An order is confirmed only after a human verifies the transaction, normally within 24 hours.",
          "If the transaction cannot be verified, the order is rejected. You may submit a corrected Transaction ID or contact support with payment proof. After three failed verification attempts on the same order, the order is closed pending a support review.",
        ],
      },
      {
        h: "Account rules",
        body: [
          "Shared accounts: the password and registered email remain with Digital Buy. Changing account security details, reselling access, or sharing credentials outside your household voids the order without refund.",
          "Personal accounts: credentials and recovery access are transferred to you after verification. Once transferred, account safety is your responsibility.",
          "Ubisoft library pass: access is a monthly rental. Sharing the login, attempting to modify the account, or abuse that triggers platform enforcement ends the rental without refund.",
        ],
      },
      {
        h: "Refunds and replacements",
        body: [
          "If we cannot verify your payment or deliver the product you paid for, you receive a full refund to the same bKash or Nagad number the payment came from.",
          "If delivered credentials fail on first login, we replace them at no cost. Platform-side bans caused by the buyer's actions (cheating, region abuse, credential sharing) are not covered.",
        ],
      },
      {
        h: "Acceptable use",
        body: [
          "You must be at least 18 or have a guardian's consent to purchase. Fraudulent transaction IDs, chargeback abuse, or attempts to bypass verification lead to a permanent account ban.",
        ],
      },
      {
        h: "Changes",
        body: [
          "We may update these terms as the store evolves. The current version is always published on this page with its revision date.",
        ],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  return { title: DOCS[doc]?.title ?? "Legal" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const content = DOCS[doc];
  if (!content) notFound();

  return (
    <div className="wrap fade-up max-w-3xl py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
      >
        <ChevronLeft size={15} /> Home
      </Link>
      <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white">
        {content.title}
      </h1>
      <p className="mt-2 text-sm text-fog">{content.updated}</p>
      <div className="mt-10 space-y-9">
        {content.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-extrabold tracking-tight text-white">
              {s.h}
            </h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-[15px] leading-7 text-fog">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-12 rounded-lg border border-line bg-panel p-5 text-sm leading-6 text-fog">
        Anything unclear?{" "}
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-brand hover:underline"
        >
          Message support on Instagram
        </a>{" "}
        before placing an order.
      </div>
    </div>
  );
}
