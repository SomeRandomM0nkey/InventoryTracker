import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { SalesOrderForm } from "@/components/order/sales-order-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CreateSalesOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/orders/sales", data);
      queryClient.invalidateQueries({ queryKey: ["/api/orders/sales"] });
      toast({
        title: "Sales order created",
        description: "The sales order has been successfully created.",
      });
      navigate("/invoices");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the sales order. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Sales Order</h1>
        <p className="text-muted-foreground">
          Create a new sales order for your customers
        </p>
      </div>

      <SalesOrderForm onSubmit={handleSubmit} />
    </div>
  );
}
