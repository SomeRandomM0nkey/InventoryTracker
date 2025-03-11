import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order/order-table";
import { type PurchaseOrder, type SalesOrder } from "@shared/schema";

export default function Invoices() {
  const [activeTab, setActiveTab] = useState("purchase");

  const { data: purchaseOrders, isLoading: loadingPurchase } = useQuery<PurchaseOrder[]>({
    queryKey: ["/api/orders/purchase"],
  });

  const { data: salesOrders, isLoading: loadingSales } = useQuery<SalesOrder[]>({
    queryKey: ["/api/orders/sales"],
  });

  if (loadingPurchase || loadingSales) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage your purchase and sales orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="purchase" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link href="/invoices/purchase/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </Link>
          </div>
          <OrderTable orders={purchaseOrders || []} type="purchase" />
        </TabsContent>
        <TabsContent value="sales" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link href="/invoices/sales/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Sales Order
              </Button>
            </Link>
          </div>
          <OrderTable orders={salesOrders || []} type="sales" />
        </TabsContent>
      </Tabs>
    </div>
  );
}