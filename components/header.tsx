import Link from "next/link";
import { getUserOrNull } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export async function Header() {
  const user = await getUserOrNull();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-lockup" aria-label="Digital Buy home">
          <span className="brand-mark">DB</span>
          <span className="brand-copy">
            <strong>Digital Buy</strong>
            <small>Gaming + OTT</small>
          </span>
        </Link>

        <nav className="store-nav" aria-label="Store navigation">
          <Link href="/gaming">Gaming</Link>
          <Link href="/ott">OTT</Link>
          <span className="locked-nav" aria-disabled="true">Top Up</span>
        </nav>

        <nav className="account-nav" aria-label="Account navigation">
          <Link href="/orders">My Orders</Link>
          <a
            href="https://www.instagram.com/direct/t/17843350626608873/"
            target="_blank"
            rel="noreferrer"
          >
            Support
          </a>
          {user ? (
            <form action={logoutAction}>
              <button className="header-login" type="submit">Logout</button>
            </form>
          ) : (
            <Link className="header-login" href="/auth/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
