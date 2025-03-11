import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ProductForm } from "@/components/product/product-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertProduct } from "@shared/schema";

export default function CreateProduct() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: InsertProduct) => {
    try {
      await apiRequest("POST", "/api/products", data);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      });
      navigate("/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the product. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
