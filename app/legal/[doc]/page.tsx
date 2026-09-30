import { notFound } from "next/navigation";
const docs: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy Policy", body: [
    "Digital Buy collects your name and email to create your account, and your payment sender number and transaction ID to verify orders. We do not collect card data.",
    "Your data is stored with our database and authentication provider and is used only to run your account, verify payments, deliver orders and answer support requests. We do not sell your data.",
    "Delivered login details are encrypted at rest and shown only to the account that placed the order.",
    "To request access to or deletion of your data, contact us through Support." ] },
  terms: { title: "Terms & Conditions", body: [
    "Prices are in BDT. An order is confirmed only after we manually verify your bKash or Nagad payment. Orders with unverifiable or reused transaction IDs are rejected.",
    "Shared accounts give multiple users access for the stated duration. Do not change the password, email or settings of a shared account. Personal accounts are for your own use.",
    "Rental and subscription products end when their duration ends. Permanent products remain yours where the platform allows it.",
    "Do not resell or share delivered login details. We may withdraw access for misuse.",
    "If a delivered account does not work, contact Support with your order ID and we will fix or replace it. Refunds are not given after a working account is delivered.",
    "Digital Buy is not affiliated with Steam, Xbox, Ubisoft, Netflix, Spotify, HBO, YouTube or OpenAI. Names belong to their owners." ] },
};
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) { const d = docs[(await params).doc]; return { title: d?.title }; }
export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const d = docs[(await params).doc]; if (!d) notFound();
  return <main style={{ maxWidth: 720 }}><h1>{d.title}</h1>{d.body.map((t, i) => <p key={i}>{t}</p>)}</main>;
}
