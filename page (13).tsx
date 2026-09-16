import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, refreshVerification } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/data";
import { OrdersList } from "@/components/orders-client";
import { VerifyEmailCard } from "@/components/verify-email";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/orders");

  // Orders are gated on a verification state re-read fresh from Firebase.
  const verification = await refreshVerification(user);
  if (!verification.verified) {
    return (
      <div className="wrap fade-up flex justify-center py-16 sm:py-24">
        <VerifyEmailCard email={verification.email ?? ""} />
      </div>
    );
  }

  const orders = await listOrdersForUser(user.id);
  return (
    <div className="wrap fade-up py-12 sm:py-16">
      <OrdersList initialOrders={orders} nickname={user.nickname} />
    </div>
  );
}
