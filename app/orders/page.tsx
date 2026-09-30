import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { decrypt } from "@/lib/crypto";
import { bdt, dur } from "@/lib/fmt";
import Flash from "@/components/Flash";
export const metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";
const label: Record<string, string> = { pending: "Pending", payment_submitted: "Payment submitted", confirmed: "Confirmed", processing: "Processing", completed: "Completed", failed: "Failed", cancelled: "Cancelled" };

export default async function Orders({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const user = await getUser(); if (!user) redirect("/login?next=/orders");
  let data: any[] = []; let failed = false;
  try {
    const s = await db().collection("orders").where("userId", "==", user.uid).get();
    data = s.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch { failed = true; }
  const groups: [string, string[]][] = [["Completed", ["completed"]], ["Pending", ["pending", "payment_submitted", "confirmed", "processing"]], ["Failed or cancelled", ["failed", "cancelled"]]];
  return (
    <main><h1>My Orders</h1><Flash sp={await searchParams} />
      {failed ? <p className="toast err">Could not load your orders.</p> : !data.length ? <div className="empty">You have no orders yet.</div> :
        groups.map(([title, st]) => { const list = data.filter((o) => st.includes(o.status)); return list.length ? (
          <section key={title}><h2>{title}</h2><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>{list.map((o) => (
            <div className="card" key={o.id}>
              <b>Order {o.code}</b> <span className="tag">{label[o.status]}</span>
              <p className="mu" style={{ margin: "4px 0" }}>{o.createdAt.toDate().toLocaleDateString("en-GB")} / {bdt(o.totalBdt)}</p>
              {o.statusReason && <p>Reason: {o.statusReason}</p>}
              {o.items.map((i: any, k: number) => <p key={k} style={{ margin: "8px 0 0" }}>{i.name} ({dur(i.durationDays)})</p>)}
              {o.status === "completed" && o.credentials.map((c: any, k: number) => (<div key={k} className="toast"><div>Username: <b>{c.username}</b></div><div>Password: <b>{decrypt(c.passwordEnc)}</b></div>{c.instructions && <p>{c.instructions}</p>}</div>))}
            </div>))}</div></section>) : null; })}
    </main>
  );
}
