"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/components/action-feedback";

export async function submitOrderAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  try { await rateLimit(`checkout-${user.id}`, 6, 300); } catch (e) { return { message: e instanceof Error ? e.message : "Try again later." }; }
  const parsed = z.object({
    productId: z.string().uuid(),
    paymentMethod: z.enum(["bkash", "nagad"]),
    payerNumber: z.string().regex(/^01[3-9][0-9]{8}$/, "Use a valid Bangladesh mobile number"),
    reference: z.string().trim().min(4).max(100),
    confirmPaid: z.literal("on"),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Invalid checkout details." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order_with_payment", {
    p_product_id: parsed.data.productId,
    p_payment_method: parsed.data.paymentMethod,
    p_payer_number: parsed.data.payerNumber,
    p_reference: parsed.data.reference,
  });
  if (error || !data?.[0]) return { message: error?.message || "Could not create the order." };
  redirect(`/orders?created=${encodeURIComponent(data[0].order_number)}`);
}
