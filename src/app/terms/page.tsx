import Link from "next/link";

export const metadata = { title: "Terms & Conditions | Digital Buy" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">Legal</p>
      <h1
        className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-xs text-white/40">Last updated: [add date when you publish]</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-white/70">
        <section>
          <h2 className="text-base font-semibold text-white">1. Acceptance</h2>
          <p className="mt-2">
            By creating an account or placing an order on Digital Buy, you agree to these terms.
            If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">2. What we sell</h2>
          <p className="mt-2">
            We sell two kinds of products: <strong>shared</strong> accounts/profiles (access to a
            game library or streaming plan for a fixed period, shared with other buyers) and{" "}
            <strong>personal</strong> accounts (created or transferred exclusively for you, with no
            expiry). The product page always states which type you are buying, and its validity
            period if any.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">3. Payment &amp; verification</h2>
          <p className="mt-2">
            Payment is accepted via bKash and Nagad &ldquo;Send Money&rdquo;. After sending payment,
            you submit the transaction ID through checkout. Orders are manually verified before
            credentials are released, which can take time; the site shows an estimate on the
            checkout page. Submitting a false or unrelated transaction ID may result in the order
            being marked failed and the account being suspended.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">4. Delivery</h2>
          <p className="mt-2">
            Once an order is verified, login credentials (or account details) appear on the{" "}
            <Link href="/orders" className="text-cyan-300 underline underline-offset-2">
              My Orders
            </Link>{" "}
            page. It is your responsibility to check that page after paying.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">5. Shared account rules</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Do not change the password on a shared account; this locks out other buyers and you.</li>
            <li>Shared access is valid only for the period stated at purchase and is not guaranteed to continue after it expires.</li>
            <li>We may replace or rotate shared credentials as needed to keep the account working for all buyers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">6. Refunds &amp; warranty</h2>
          <p className="mt-2">
            [State your actual policy here. For example: replacement offered if a delivered
            account stops working within the stated validity period, provided the password was not
            changed; no refunds once credentials have been delivered and used, except where required
            by law.]
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">7. Acceptable use</h2>
          <p className="mt-2">
            Accounts are sold for personal use. Reselling, sharing beyond what a plan allows, or
            using purchased accounts for fraud is not permitted and may lead to the order being
            cancelled without refund.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">8. Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of the site after a change
            means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">9. Contact</h2>
          <p className="mt-2">Questions about these terms can be sent through our Messenger support link.</p>
        </section>
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-xs text-white/45">
        This page is a starting template, not legal advice. Review it (ideally with a lawyer
        familiar with Bangladeshi consumer/e-commerce rules) and fill in the bracketed details,
        especially your refund policy, before you launch.
      </div>
    </div>
  );
}
