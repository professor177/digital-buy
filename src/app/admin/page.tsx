import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { AdminApp } from "@/components/admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  const authed = await isAdmin();
  return (
    <div className="wrap fade-up py-10 sm:py-14">
      <AdminApp initialAuthed={authed} />
    </div>
  );
}
