import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "@auth/core/adapters";
export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export const categoryEnum = pgEnum("categories", [
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
]);
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  roles: rolesEnum().default("user"),
});

export const accounts = pgTable(
  "account",
  {
    id: text("id")
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  category: categoryEnum().default("Uncategorized").notNull(),
  description: text("description"),

  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),

  inStock: boolean("in_stock").notNull().default(true),

  // featureImage: jsonb("featureImage").$type<string[]>().default([]),
  galleryImages: jsonb("galleryImages").$type<string[]>().default([]),

  // Supplement-specific
  form: varchar("form", { length: 50 }), // powder | capsule | tablet | liquid
  goal: jsonb("goal").$type<string[]>(), // ["weight-loss"] / ["muscle-gain"]
  ingredients: jsonb("ingredients").$type<string[]>(),
  allergens: jsonb("allergens").$type<string[]>(),

  // Regulatory
  warnings: jsonb("warnings").$type<string[]>(),
  directions: text("directions"),
  certifications: jsonb("certifications").$type<string[]>(),

  expiryDate: timestamp("expiry_date", { mode: "date" }),
  manufacturedDate: timestamp("manufactured_date", { mode: "date" }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull(),
  comments: jsonb("comments").$type<string[]>(),
  images: jsonb("images").$type<string[]>(),
});
export const cart = pgTable("cart", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .notNull(),
  userId: text("userId")
    .references(() => users.id)
    .unique(),
});

export const cartItems = pgTable("cartItems", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  cartId: text("cartId")
    .notNull()
    .references(() => cart.id),

  productId: text("productId")
    .notNull()
    .references(() => products.id),

  quantity: integer("quantity").notNull().default(1),
});

export default { users, products };
