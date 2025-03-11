import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const products = await storage.searchProducts(query);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertProductSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    const product = await storage.updateProduct(id, result.data);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteProduct(id);
    if (!success) return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
