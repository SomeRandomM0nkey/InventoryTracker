import { Link } from "wouter";
import { Package2, LayoutDashboard, Receipt } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold flex items-center gap-2 text-white">
                <Package2 className="h-6 w-6" />
                <span>Inventory Manager</span>
              </a>
            </Link>
          </div>

          <div className="flex gap-6">
            <Link href="/">
              <a className="flex items-center gap-2 text-white hover:text-white/80">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/products">
              <a className="flex items-center gap-2 text-white hover:text-white/80">
                <Package2 className="h-5 w-5" />
                <span>Products</span>
              </a>
            </Link>
            <Link href="/invoices">
              <a className="flex items-center gap-2 text-white hover:text-white/80">
                <Receipt className="h-5 w-5" />
                <span>Invoices</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}