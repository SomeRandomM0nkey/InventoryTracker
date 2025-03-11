import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sku: text("sku").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(10),
  imageUrl: text("image_url").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, lastUpdated: true })
  .extend({
    price: z.number().positive(),
    quantity: z.number().int().min(0),
    reorderPoint: z.number().int().min(0),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
