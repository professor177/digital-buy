import { notFound } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { bdt, dur } from "@/lib/fmt";
import Flash from "@/components/Flash";
import { createOrder } from "@/app/actions";

export default async function Checkout({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ err?: string }> }) {
  const { slug } = await params; const sp = await searchParams;
  const p = (await db().doc(`products/${slug}`).get()).data();
  if (!p || !p.isAvailable || p.stock < 1) notFound();
  return (
    <main>
      <h1>Checkout</h1><Flash sp={sp} />
      <div className="card" style={{ marginBottom: 20 }}><b>{p.name}</b><p className="mu" style={{ margin: 0 }}>{p.accountType} / {dur(p.durationDays)}</p><p><b>{bdt(p.priceBdt)}</b></p></div>
      <form action={createOrder} className="box">
        <input type="hidden" name="slug" value={slug} />
        <label htmlFor="m">Payment method</label>
        <select id="m" name="method" required><option value="bkash">bKash</option><option value="nagad">Nagad</option></select>
        <p className="mu">Send {bdt(p.priceBdt)} using Send Money to:<br />bKash: <b>{process.env.BKASH_NUMBER}</b><br />Nagad: <b>{process.env.NAGAD_NUMBER}</b><br />Then enter the details below. We check every payment manually.</p>
        <label htmlFor="s">Your bKash/Nagad number</label><input id="s" name="sender" inputMode="numeric" pattern="01[0-9]{9}" required placeholder="01XXXXXXXXX" />
        <label htmlFor="t">Transaction ID</label><input id="t" name="txn" pattern="[A-Za-z0-9]{6,20}" required />
        <label htmlFor="n">Note (optional)</label><textarea id="n" name="note" maxLength={300} rows={2} />
        <button>Submit order</button>
      </form>
    </main>
  );
}
