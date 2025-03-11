import { useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductForm } from "@/components/product/product-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, InsertProduct } from "@shared/schema";

export default function EditProduct() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const handleSubmit = async (data: InsertProduct) => {
    try {
      await apiRequest("PATCH", `/api/products/${id}`, data);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      navigate("/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the product. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product information
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm
          defaultValues={product}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
