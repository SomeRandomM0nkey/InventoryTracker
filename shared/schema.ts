import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Order status enum
export const OrderStatus = {
  Draft: "Draft",
  Pending: "Pending",
  Approved: "Approved",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type OrderStatusType = keyof typeof OrderStatus;

// Order item schema
export const orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  serialNumbers: z.array(z.string()),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Base order schema
const baseOrderSchema = z.object({
  partyName: z.string().min(1, "Party name is required"),
  date: z.string(),
  items: z.array(orderItemSchema),
  status: z.enum(Object.keys(OrderStatus) as [OrderStatusType, ...OrderStatusType[]]),
  total: z.number().positive(),
});

// Sales orders specific fields
export const salesOrderSchema = baseOrderSchema.extend({
  type: z.literal("sales"),
  orderNumber: z.string(),
  referenceNumber: z.string().optional(),
  expectedShipmentDate: z.string(),
  paymentTerms: z.string(),
  deliveryMethod: z.string(),
  salesperson: z.string(),
  warrantyStartDate: z.string().optional(),
});

// Purchase orders specific fields
export const purchaseOrderSchema = baseOrderSchema.extend({
  type: z.literal("purchase"),
  orderNumber: z.string(),
  referenceNumber: z.string().optional(),
  expectedDeliveryDate: z.string(),
  paymentTerms: z.string(),
  deliveryMethod: z.string(),
});


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
  serialNumbers: text("serial_numbers").array().notNull().default([]),
});

// Product schemas
export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, lastUpdated: true })
  .extend({
    price: z.number().positive(),
    quantity: z.number().int().min(0),
    reorderPoint: z.number().int().min(0),
    serialNumbers: z.array(z.string()),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;
export type SalesOrder = z.infer<typeof salesOrderSchema>;