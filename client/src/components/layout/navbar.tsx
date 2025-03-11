import { Link } from "wouter";
import { Package2, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold flex items-center gap-2">
                <Package2 className="h-6 w-6" />
                <span>Inventory Manager</span>
              </a>
            </Link>
          </div>
          
          <div className="flex gap-6">
            <Link href="/">
              <a className="flex items-center gap-2 hover:text-primary">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/products">
              <a className="flex items-center gap-2 hover:text-primary">
                <Package2 className="h-5 w-5" />
                <span>Products</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
