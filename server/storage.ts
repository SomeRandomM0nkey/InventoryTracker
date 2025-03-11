import { products, type Product, type InsertProduct, type PurchaseOrder, type SalesOrder } from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;

  // Order operations
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  getSalesOrders(): Promise<SalesOrder[]>;
  createPurchaseOrder(order: PurchaseOrder): Promise<PurchaseOrder>;
  createSalesOrder(order: SalesOrder): Promise<SalesOrder>;
  updateOrderStatus(orderId: string, status: string): Promise<PurchaseOrder | SalesOrder | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private purchaseOrders: Map<string, PurchaseOrder>;
  private salesOrders: Map<string, SalesOrder>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.purchaseOrders = new Map();
    this.salesOrders = new Map();
    this.currentId = 1;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = {
      ...insertProduct,
      id,
      lastUpdated: new Date(),
      price: insertProduct.price.toString(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...update,
      price: update.price?.toString() ?? existing.price,
      lastUpdated: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.sku.toLowerCase().includes(lowercaseQuery) ||
        product.serialNumbers?.some(serial => serial.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Order operations
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Array.from(this.purchaseOrders.values());
  }

  async getSalesOrders(): Promise<SalesOrder[]> {
    return Array.from(this.salesOrders.values());
  }

  async createPurchaseOrder(order: PurchaseOrder): Promise<PurchaseOrder> {
    this.purchaseOrders.set(order.id, order);
    return order;
  }

  async createSalesOrder(order: SalesOrder): Promise<SalesOrder> {
    this.salesOrders.set(order.id, order);
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<PurchaseOrder | SalesOrder | undefined> {
    let order = this.purchaseOrders.get(orderId);
    if (order) {
      order = { ...order, status };
      this.purchaseOrders.set(orderId, order);
      return order;
    }

    order = this.salesOrders.get(orderId);
    if (order) {
      order = { ...order, status };
      this.salesOrders.set(orderId, order);
      return order;
    }

    return undefined;
  }
}

export const storage = new MemStorage();