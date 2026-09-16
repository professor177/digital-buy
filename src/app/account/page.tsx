import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, refreshVerification } from "@/lib/auth";
import { AccountCard } from "@/components/account-client";
import { VerifyEmailCard } from "@/components/verify-email";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  // Gate account settings on a verification state that is re-read fresh
  // from Firebase on every visit.
  const verification = await refreshVerification(user);

  return (
    <div className="wrap fade-up flex justify-center py-14 sm:py-20">
      {verification.verified ? (
        <AccountCard
          user={{
            id: user.id,
            email: verification.email,
            nickname: user.nickname,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      ) : (
        <VerifyEmailCard email={verification.email ?? ""} />
      )}
    </div>
  );
}
