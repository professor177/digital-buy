import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase-admin";
import Flash from "@/components/Flash";
import { setBan } from "@/app/actions";
export const metadata = { title: "Customers", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Customers({ searchParams }: { searchParams: Promise<{ msg?: string; err?: string; t?: string }> }) {
  if (!(await requireAdmin())) notFound();
  const sp = await searchParams; let res: any = null;
  try { res = await adminAuth().listUsers(50, sp.t || undefined); } catch {}
  return (
    <main><a href="/admin" className="mu">Back to admin</a><h1>Customers</h1><Flash sp={sp} />
      {!res ? <p className="toast err">Could not load users.</p> : !res.users.length ? <div className="empty">No customers.</div> :
        <div style={{ display: "grid", gap: 8 }}>{res.users.map((u: any) => (
          <form action={setBan} className="card row" key={u.uid}><input type="hidden" name="user_id" value={u.uid} /><input type="hidden" name="ban" value={u.disabled ? "0" : "1"} />
            <span style={{ flex: 1 }}><b>{u.displayName ?? "No name"}</b> <span className="mu">{u.email}</span></span>
            <span className="tag">{u.emailVerified ? "Verified" : "Unverified"}</span>{u.disabled && <span className="tag">Suspended</span>}
            <span className="mu">{new Date(u.metadata.creationTime).toLocaleDateString("en-GB")}</span><button className="o">{u.disabled ? "Restore" : "Suspend"}</button></form>))}</div>}
      {res?.pageToken && <a className="btn o" style={{ marginTop: 16 }} href={`?t=${encodeURIComponent(res.pageToken)}`}>Next</a>}</main>
  );
}
