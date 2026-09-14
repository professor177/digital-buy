import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Users can be created via Google OAuth (see /api/auth/google) or via
 * Bangladesh phone-number OTP (see /api/auth/otp/*).
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Digital Buy User"),
  email: text("email"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  provider: text("provider").notNull().default("otp"), // "google" | "otp"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    token: text("token").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

/** Short lived OTP codes for the +880 phone signup flow. */
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: serial("id").primaryKey(),
    phone: text("phone").notNull(),
    code: text("code").notNull(),
    consumed: boolean("consumed").notNull().default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("otp_phone_idx").on(table.phone)],
);

/**
 * Orders placed through the manual bKash / Nagad checkout.
 * status: "pending" | "success" | "failed"
 */
export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reference: text("reference").notNull(),
    productType: text("product_type").notNull(), // "game" | "ott"
    productSlug: text("product_slug").notNull(),
    productTitle: text("product_title").notNull(),
    mode: text("mode").notNull(), // "shared" | "personal"
    platform: text("platform"), // steam | xbox | ubisoft | ott slug
    planLabel: text("plan_label"),
    validity: text("validity").notNull().default("Permanent"),
    priceLabel: text("price_label").notNull().default("৳ TBD"),
    paymentMethod: text("payment_method").notNull(), // "bkash" | "nagad"
    senderNumber: text("sender_number"),
    transactionId: text("transaction_id"),
    status: text("status").notNull().default("pending"),
    note: text("note"),
    credentialEmail: text("credential_email"),
    credentialPassword: text("credential_password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("orders_user_idx").on(table.userId)],
);

export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
