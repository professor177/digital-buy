import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProductBySlug } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{slug:string}> }) {
  const user = await requireUser(); const { slug } = await params; const product = await getProductBySlug(slug); if (!product) notFound();
  const available = product.available && (product.stock === null || product.stock > 0); if (!available) notFound();
  const supabase = await createClient(); const { data: profile } = await supabase.from("user_profiles").select("name").eq("id",user.id).single();
  return <div className="container py-14"><div className="mx-auto max-w-3xl"><p className="eyebrow">Secure checkout</p><h1 className="title-lg mt-3">Submit your payment details.</h1><p className="muted mt-4 leading-7">Digital Buy currently uses manual bKash and Nagad payment verification. No order is represented as paid until an administrator verifies the reference.</p><div className="surface mt-8 p-5 sm:p-8"><CheckoutForm productId={product.id} productName={product.name} price={product.price_bdt} customerName={profile?.name || "Customer"} email={user.email || ""} bkash={process.env.NEXT_PUBLIC_BKASH_MERCHANT_NUMBER} nagad={process.env.NEXT_PUBLIC_NAGAD_MERCHANT_NUMBER}/></div></div></div>;
}
