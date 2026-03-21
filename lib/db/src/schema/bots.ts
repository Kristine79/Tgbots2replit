import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  emoji: text("emoji").notNull(),
  count: integer("count").notNull().default(0),
});

export const botsTable = pgTable("bots", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  isPremium: boolean("is_premium").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  monthlyUsers: integer("monthly_users").notNull().default(0),
  iconEmoji: text("icon_emoji").notNull().default("🤖"),
  telegramUrl: text("telegram_url").notNull(),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;

export const insertBotSchema = createInsertSchema(botsTable).omit({ id: true });
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Bot = typeof botsTable.$inferSelect;
