import Link from "next/link";
import { getUserOrNull } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export async function Header() {
  const user = await getUserOrNull();
  return <header className="border-b border-slate-800/90 bg-[#090d14]/90 backdrop-blur sticky top-0 z-40">
    <div className="container flex h-16 items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-3 font-black tracking-tight"><span className="grid h-8 w-8 place-items-center border border-sky-400/40 bg-sky-400/10 text-sm">DB</span><span>Digital Buy</span></Link>
      <nav className="flex items-center gap-1 text-sm font-bold" aria-label="Primary navigation">
        <Link className="px-3 py-2 text-slate-300 hover:text-white" href="/orders">My Orders</Link>
        <a className="px-3 py-2 text-slate-300 hover:text-white" href="https://www.instagram.com/direct/t/17843350626608873/" target="_blank" rel="noreferrer">Support</a>
        {user ? <form action={logoutAction}><button className="btn btn-secondary !min-h-9 !px-3 !py-1.5" type="submit">Logout</button></form> : <Link className="btn btn-primary !min-h-9 !px-3 !py-1.5" href="/auth/login">Login</Link>}
      </nav>
    </div>
  </header>;
}
