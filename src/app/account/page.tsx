import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AccountCard } from "@/components/account-client";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  return (
    <div className="wrap fade-up flex justify-center py-14 sm:py-20">
      <AccountCard
        user={{
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
