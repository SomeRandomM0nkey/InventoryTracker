import { Link } from "wouter";
import { Package2, LayoutDashboard, Receipt } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="bg-primary dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold flex items-center gap-2 text-white dark:text-gray-200">
                <img
                  src="https://adorapos.com/wp-content/uploads/2020/01/Blue-and-White-Adora-Horizontal-POS.png"
                  alt="Adora POS"
                  className="h-8 dark:invert dark:brightness-75"
                />
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="flex items-center gap-2 text-white dark:text-gray-200 hover:text-white/80 dark:hover:text-gray-400">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/products">
              <a className="flex items-center gap-2 text-white dark:text-gray-200 hover:text-white/80 dark:hover:text-gray-400">
                <Package2 className="h-5 w-5" />
                <span>Products</span>
              </a>
            </Link>
            <Link href="/invoices">
              <a className="flex items-center gap-2 text-white dark:text-gray-200 hover:text-white/80 dark:hover:text-gray-400">
                <Receipt className="h-5 w-5" />
                <span>Invoices</span>
              </a>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}