import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email"),
  emailVerified: boolean("email_verified").notNull().default(false),
  // Legacy column from the retired phone-OTP flow; kept nullable so old
  // rows stay intact. New accounts use email only.
  phone: text("phone"),
  nickname: text("nickname"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  platform: text("platform", { enum: ["steam", "xbox"] }).notNull(),
  accountType: text("account_type", { enum: ["shared", "personal"] }).notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  trailerUrl: text("trailer_url"),
  description: text("description").notNull().default(""),
  priceBdt: integer("price_bdt"),
  referralCode: text("referral_code").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ottPlatforms = pgTable("ott_platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  introMedia: text("intro_media").notNull(),
  tagline: text("tagline").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ottPackages = pgTable("ott_packages", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id")
    .notNull()
    .references(() => ottPlatforms.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull().default(""),
  details: text("details").notNull().default(""),
  priceBdt: integer("price_bdt"),
  referralCode: text("referral_code").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ubisoftRental = pgTable("ubisoft_rental", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  includes: text("includes")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  media: text("media").notNull().default(""),
  trailerUrl: text("trailer_url"),
  priceBdt: integer("price_bdt").notNull().default(150),
  referralCode: text("referral_code").notNull().default("DB-UBIS990"),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemType: text("item_type", {
      enum: ["game", "ott_package", "ubisoft"],
    }).notNull(),
    itemId: integer("item_id").notNull(),
    accountType: text("account_type", { enum: ["shared", "personal"] }),
    itemLabel: text("item_label").notNull(),
    paymentMethod: text("payment_method", { enum: ["bkash", "nagad"] }).notNull(),
    transactionId: text("transaction_id").notNull(),
    amountBdt: integer("amount_bdt").notNull(),
    referralCode: text("referral_code").notNull(),
    status: text("status", { enum: ["pending", "verified", "rejected"] })
      .notNull()
      .default("pending"),
    credentials: text("credentials"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_one_active_per_item")
      .on(t.userId, t.itemType, t.itemId)
      .where(sql`${t.status} <> 'rejected'`),
  ],
);

export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type OttPlatform = typeof ottPlatforms.$inferSelect;
export type OttPackage = typeof ottPackages.$inferSelect;
export type UbisoftRental = typeof ubisoftRental.$inferSelect;
export type Order = typeof orders.$inferSelect;
