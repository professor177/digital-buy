import Link from "next/link";

export const metadata = { title: "Privacy Policy | Digital Buy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">Legal</p>
      <h1
        className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs text-white/40">Last updated: [add date when you publish]</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-white/70">
        <section>
          <h2 className="text-base font-semibold text-white">1. Who we are</h2>
          <p className="mt-2">
            Digital Buy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website to sell
            digital gaming accounts and OTT streaming subscriptions in Bangladesh.
            [Replace this paragraph with your registered business name and address.]
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">2. Information we collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Account details you provide: name, email, and/or phone number, via Google sign-in or phone OTP.</li>
            <li>Order details: the products you buy, the payment method (bKash/Nagad), sender number, and transaction ID you submit to verify payment.</li>
            <li>Basic technical data such as browser type and device, used only to keep the site working correctly and securely.</li>
          </ul>
          <p className="mt-2">
            We do not collect your bKash/Nagad PIN or password. Payments are made directly through your
            bKash/Nagad app; we only ask you to share the transaction ID so we can verify it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">3. How we use your information</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>To create and manage your account.</li>
            <li>To process orders, verify payments, and deliver purchased credentials.</li>
            <li>To respond to support requests sent via Messenger.</li>
            <li>To detect and prevent fraud or abuse of the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">4. Sharing your information</h2>
          <p className="mt-2">
            We do not sell your personal information. We only share it with service providers that
            help us run the site (for example, our hosting and database providers, and Firebase for
            sign-in), and only to the extent needed to operate the store.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">5. Data retention</h2>
          <p className="mt-2">
            We keep account and order records for as long as your account is active, and afterward
            only as needed for accounting, fraud prevention, or legal requirements.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">6. Your choices</h2>
          <p className="mt-2">
            You can ask us to review, correct, or delete your personal data by contacting support
            through Messenger. Note that some order records may need to be kept for legal or
            accounting reasons even after a deletion request.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">7. Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent through our{" "}
            <Link href="/" className="text-cyan-300 underline underline-offset-2">
              Messenger support
            </Link>{" "}
            link, or to [add a support email here].
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-xs text-white/45">
        This page is a starting template, not legal advice. Review it (ideally with a lawyer
        familiar with Bangladeshi e-commerce/data rules) and fill in the bracketed details before
        you launch.
      </div>
    </div>
  );
}
