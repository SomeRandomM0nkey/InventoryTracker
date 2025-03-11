import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import CreateProduct from "@/pages/products/create";
import EditProduct from "@/pages/products/edit";
import Invoices from "@/pages/invoices";
import CreatePurchaseOrder from "@/pages/invoices/purchase/create";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/products/create" component={CreateProduct} />
      <Route path="/products/:id/edit" component={EditProduct} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/invoices/purchase/create" component={CreatePurchaseOrder} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="adora-theme">
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;