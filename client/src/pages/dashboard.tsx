import { useQuery } from "@tanstack/react-query";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import type { Product } from "@shared/schema";

export default function Dashboard() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory management system
        </p>
      </div>

      <MetricsCards products={products} />
      <StockAlerts products={products} />
    </div>
  );
}
