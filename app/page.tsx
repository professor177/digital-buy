import Link from "next/link";
import { ArrowIcon, GameIcon, LockIcon, PlayIcon } from "@/components/icons";

const platformGroups = [
  { label: "STEAM", tone: "steam" },
  { label: "XBOX", tone: "xbox" },
  { label: "UBISOFT", tone: "ubisoft" },
];

const ottGroups = ["NETFLIX", "SPOTIFY", "HBO", "YOUTUBE", "CHATGPT"];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-grid-overlay" />
        <div className="container hero-layout">
          <div className="hero-copy-block">
            <p className="hero-kicker">DIGITAL BUY / GAMING + OTT</p>
            <h1 className="hero-title">
              Buy gaming access and subscriptions.
              <span> Pay in BDT. Track every order.</span>
            </h1>
            <p className="hero-copy">
              Shared rentals, personal accounts and duration-based subscriptions
              with bKash or Nagad payment submission, manual verification and
              protected delivery inside My Orders.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary" href="/gaming">
                Browse Gaming <ArrowIcon />
              </Link>
              <Link className="btn btn-secondary" href="/ott">
                Browse OTT
              </Link>
            </div>

            <div className="service-rail" aria-label="Store features">
              <div>
                <strong>BDT</strong>
                <span>Local pricing</span>
              </div>
              <div>
                <strong>bKash + Nagad</strong>
                <span>Manual verification</span>
              </div>
              <div>
                <strong>My Orders</strong>
                <span>Protected delivery</span>
              </div>
            </div>
          </div>

          <div className="store-console" aria-label="Digital Buy store overview">
            <div className="console-topbar">
              <div>
                <span className="console-dot" />
                <span className="console-dot" />
                <span className="console-dot" />
              </div>
              <span>DIGITAL BUY / STORE</span>
            </div>

            <div className="console-display">
              <div className="console-heading">
                <p>GAMING ACCESS</p>
                <span>SHARED / PERSONAL</span>
              </div>

              <div className="platform-stack">
                {platformGroups.map((item, index) => (
                  <div className="platform-row" key={item.label}>
                    <span className={"platform-symbol " + item.tone}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong>{item.label}</strong>
                    <span>Catalog managed from admin</span>
                  </div>
                ))}
              </div>

              <div className="console-divider" />

              <div className="console-heading">
                <p>OTT ACCESS</p>
                <span>DURATION-BASED</span>
              </div>
              <div className="ott-strip">
                {ottGroups.map((item) => <span key={item}>{item}</span>)}
              </div>

              <div className="payment-block">
                <div>
                  <small>PAYMENT</small>
                  <strong>bKash / Nagad</strong>
                </div>
                <div>
                  <small>FULFILLMENT</small>
                  <strong>Verified by admin</strong>
                </div>
              </div>
            </div>

            <div className="console-footer">
              <span>NO AUTO-VERIFICATION CLAIMS</span>
              <span>SECURE ORDER DELIVERY</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container category-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Store categories</p>
            <h2 className="category-heading">Choose what you need.</h2>
          </div>
          <p className="section-note">
            Products, prices, duration and stock are controlled from the admin panel.
          </p>
        </div>

        <div className="category-grid">
          <Link href="/gaming" className="category-card gaming-card">
            <div className="category-topline">
              <GameIcon className="h-7 w-7" />
              <span>01 / GAMING</span>
            </div>
            <div className="category-main">
              <h3>Gaming Accounts</h3>
              <p>Shared rentals and personal products for Steam, Xbox and Ubisoft.</p>
            </div>
            <div className="category-platforms">
              <span>STEAM</span><span>XBOX</span><span>UBISOFT</span>
            </div>
            <div className="category-link">Explore Gaming <ArrowIcon /></div>
          </Link>

          <Link href="/ott" className="category-card ott-card">
            <div className="category-topline">
              <PlayIcon className="h-7 w-7" />
              <span>02 / OTT</span>
            </div>
            <div className="category-main">
              <h3>OTT Subscriptions</h3>
              <p>Shared and personal duration-based access across configurable platforms.</p>
            </div>
            <div className="category-platforms">
              <span>NETFLIX</span><span>SPOTIFY</span><span>HBO</span><span>MORE</span>
            </div>
            <div className="category-link">Explore OTT <ArrowIcon /></div>
          </Link>

          <div className="category-card locked-card" aria-disabled="true">
            <div className="category-topline">
              <LockIcon className="h-7 w-7" />
              <span>03 / TOP UP</span>
            </div>
            <div className="category-main">
              <h3>Top Up</h3>
              <p>This category stays locked until Digital Buy is ready to fulfill top-up orders.</p>
            </div>
            <div className="locked-panel">
              <span>LOCKED</span>
              <strong>COMING SOON</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="container order-flow-section">
        <div className="flow-panel">
          <div className="flow-copy">
            <p className="eyebrow">Checkout flow</p>
            <h2>Clear from purchase to delivery.</h2>
            <p>
              Digital Buy does not fake payment success. Your payment reference is
              submitted, reviewed and then fulfilled through the real order workflow.
            </p>
          </div>
          <div className="flow-steps">
            {[
              ["01", "Select", "Choose the exact product and access type."],
              ["02", "Pay", "Use the displayed bKash or Nagad instructions."],
              ["03", "Verify", "Admin confirms the submitted payment reference."],
              ["04", "Receive", "Credentials and instructions appear in My Orders."],
            ].map(([n, title, body]) => (
              <div className="flow-step" key={n}>
                <span>{n}</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
