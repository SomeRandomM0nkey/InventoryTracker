import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import type { Product } from "@shared/schema";

interface StockAlertsProps {
  products: Product[];
}

export function StockAlerts({ products }: StockAlertsProps) {
  const lowStockProducts = products
    .filter((p) => p.quantity <= p.reorderPoint)
    .sort((a, b) => a.quantity - b.quantity);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="destructive">
                  {product.quantity} remaining
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Reorder at: {product.reorderPoint}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
