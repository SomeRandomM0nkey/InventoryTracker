import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { OrderForm } from "@/components/order/order-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CreatePurchaseOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/orders/purchase", data);
      queryClient.invalidateQueries({ queryKey: ["/api/orders/purchase"] });
      toast({
        title: "Purchase order created",
        description: "The purchase order has been successfully created.",
      });
      navigate("/invoices");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the purchase order. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
        <p className="text-muted-foreground">
          Create a new purchase order for inventory items
        </p>
      </div>

      <OrderForm type="purchase" onSubmit={handleSubmit} />
    </div>
  );
}
