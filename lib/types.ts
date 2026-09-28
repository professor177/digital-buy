export type AccountType = "shared" | "personal";
export type ProductKind = "rental" | "permanent" | "subscription";
export type DurationUnit = "day" | "week" | "month" | "year" | "permanent";
export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus = "pending" | "payment_submitted" | "confirmed" | "processing" | "completed" | "failed" | "cancelled";
export type PaymentMethod = "bkash" | "nagad";
export type PaymentStatus = "submitted" | "verified" | "rejected";

export interface Category { id: string; name: string; slug: string; description: string | null; active: boolean; sort_order: number; }
export interface Platform { id: string; category_id: string; name: string; slug: string; description: string | null; active: boolean; accent: string | null; }
export interface Product {
  id: string;
  category_id: string;
  platform_id: string;
  name: string;
  slug: string;
  account_type: AccountType;
  kind: ProductKind;
  description: string;
  genre: string[] | null;
  image_url: string | null;
  trailer_url: string | null;
  price_bdt: number;
  duration_value: number | null;
  duration_unit: DurationUnit;
  stock: number | null;
  available: boolean;
  status: ProductStatus;
  customer_instructions: string | null;
  created_at: string;
  updated_at: string;
  platform?: Platform;
  category?: Category;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  total_bdt: number;
  status: OrderStatus;
  failure_reason: string | null;
  created_at: string;
  item?: {
    product_name: string;
    duration_label: string;
  };
}
