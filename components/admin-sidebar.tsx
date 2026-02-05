"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Store,
  Ticket,
  User,
  X,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: any;
};

const items: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    href: "/admin/ticket",
    icon: Ticket,
  },
  {
    title: "Add Product",
    href: "/admin/addproduct",
    icon: ShoppingBag,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Store,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Settings,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: User,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between h-16 px-4 border-b">
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-bold">Home</span>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <aside className="w-64 h-full bg-background border-r p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold">Admin Panel</span>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                      active
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen border-r bg-background flex-col">
        <div className="h-16 flex items-center px-6 font-bold border-b">
          <Link href="/">Admin Panel</Link>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
