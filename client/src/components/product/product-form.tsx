import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getRandomImage } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

interface ProductFormProps {
  defaultValues?: Partial<InsertProduct>;
  onSubmit: (data: InsertProduct) => void;
  isSubmitting?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isSubmitting }: ProductFormProps) {
  const [serialInput, setSerialInput] = useState("");
  const [duplicateSerials, setDuplicateSerials] = useState<string[]>([]);

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      quantity: 0,
      reorderPoint: 10,
      imageUrl: getRandomImage(),
      serialNumbers: [],
      ...defaultValues,
    },
  });

  const handleSerialInput = () => {
    const serials = serialInput
      .split(/[\n,]/) // Split by newline or comma
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Check for duplicates
    const seen = new Set<string>();
    const duplicates = serials.filter(serial => {
      if (seen.has(serial)) return true;
      seen.add(serial);
      return false;
    });

    setDuplicateSerials(duplicates);

    if (duplicates.length === 0) {
      form.setValue("serialNumbers", serials);
      form.setValue("quantity", serials.length);
    }
  };

  const handleSubmit = (data: InsertProduct) => {
    if (duplicateSerials.length > 0) return;
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serialNumbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Numbers (one per line or comma-separated)</FormLabel>
              <FormControl>
                <Textarea 
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  onBlur={handleSerialInput}
                  placeholder="Enter serial numbers here..."
                  className="font-mono"
                />
              </FormControl>
              {duplicateSerials.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Duplicate serial numbers found: {duplicateSerials.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reorderPoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reorder Point</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || duplicateSerials.length > 0}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}