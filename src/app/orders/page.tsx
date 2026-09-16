import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/data";
import { OrdersList } from "@/components/orders-client";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/orders");
  const orders = await listOrdersForUser(user.id);
  return (
    <div className="wrap fade-up py-12 sm:py-16">
      <OrdersList initialOrders={orders} nickname={user.nickname} />
    </div>
  );
}
