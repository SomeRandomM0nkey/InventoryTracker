import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductTable } from "@/components/product/product-table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Products() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleDelete = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/products/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the product. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product inventory
        </p>
      </div>

      <ProductTable products={products} onDelete={handleDelete} />
    </div>
  );
}
