import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { purchaseOrderSchema, type Product, type OrderItem } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface OrderFormProps {
  type: "purchase" | "sales";
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function OrderForm({ type, onSubmit, isSubmitting }: OrderFormProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      type,
      partyName: "",
      date: new Date().toISOString().split("T")[0],
      items: [],
      status: "Draft",
      total: 0,
    },
  });

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        productId: 0,
        quantity: 1,
        price: 0,
        serialNumbers: [],
      },
    ]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "productId") {
      const product = products?.find((p) => p.id === Number(value));
      if (product) {
        newItems[index].price = Number(product.price);
      }
    }

    setOrderItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    form.setValue("total", total);
  };

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      items: orderItems,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="partyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{type === "purchase" ? "Vendor Name" : "Customer Name"}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Button type="button" onClick={addItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {orderItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        value={item.productId.toString()}
                        onValueChange={(value) => updateItem(index, "productId", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products?.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>

                  <div className="col-span-2">
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      />
                    </FormItem>
                  </div>

                  <div className="col-span-2">
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                      />
                    </FormItem>
                  </div>

                  <div className="col-span-2">
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <Input
                        type="number"
                        value={(item.price * item.quantity).toFixed(2)}
                        disabled
                      />
                    </FormItem>
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    disabled
                    className="text-right font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting || orderItems.length === 0}>
            {isSubmitting ? "Saving..." : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
