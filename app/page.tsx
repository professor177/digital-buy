import Link from "next/link";
export default function Home() {
  return (
    <main>
      <h1>Gaming accounts and OTT subscriptions, paid in BDT</h1>
      <p className="mu" style={{ maxWidth: 620 }}>Digital Buy sells shared and personal game accounts and streaming subscriptions. Pay with bKash or Nagad. We verify each payment by hand, then deliver your login details in My Orders.</p>
      <div className="grid" style={{ marginTop: 28 }}>
        <Link href="/shop/gaming" className="card"><h2 style={{ margin: 0 }}>Gaming</h2><p className="mu">Steam, Xbox and Ubisoft. Shared rentals or personal accounts.</p></Link>
        <Link href="/shop/ott" className="card"><h2 style={{ margin: 0 }}>OTT</h2><p className="mu">Netflix, Spotify, HBO, YouTube Premium, ChatGPT and more.</p></Link>
        <div className="card lock" aria-disabled="true"><h2 style={{ margin: 0 }}>Top Up</h2><p className="mu">Locked.</p><span className="tag">Coming Soon</span></div>
      </div>
    </main>
  );
}
