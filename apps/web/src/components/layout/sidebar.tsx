"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  MessageSquare,
  Star,
  Store,
  Settings,
  Truck,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Users,
  Ticket,
  Trophy,
  Megaphone,
  PenTool,
  FileText,
  Percent,
  AlertTriangle,
  Shield,
  Server,
  ClipboardList,
  X,
  Heart,
  MapPin,
  Bell,
  Gift,
  Crown,
  LifeBuoy,
  UserCog,
  Wallet,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
  badge?: string;
}

interface SidebarSection {
  heading: string;
  items: SidebarItem[];
}

const customerItems: SidebarSection[] = [
  {
    heading: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
      { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
      { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    ],
  },
  {
    heading: "Communication",
    items: [
      { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    heading: "Rewards",
    items: [
      { label: "Referrals", href: "/dashboard/referrals", icon: Share2 },
      { label: "Loyalty", href: "/dashboard/loyalty", icon: Crown },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Payment Methods", href: "/dashboard/payment-methods", icon: Wallet },
      { label: "Settings", href: "/dashboard/settings", icon: UserCog },
      { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    ],
  },
];

const vendorItems: SidebarSection[] = [
  {
    heading: "Main",
    items: [
      { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
      {
        label: "Products",
        icon: Package,
        children: [
          { label: "All Products", href: "/vendor/products" },
          { label: "Add New", href: "/vendor/products/new" },
        ],
      },
      { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
      { label: "Inventory", href: "/vendor/inventory", icon: BarChart3 },
    ],
  },
  {
    heading: "Business",
    items: [
      { label: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
      { label: "Payments", href: "/vendor/payments", icon: DollarSign },
      { label: "Messages", href: "/vendor/messages", icon: MessageSquare },
      { label: "Reviews", href: "/vendor/reviews", icon: Star },
      { label: "Storefront", href: "/vendor/storefront", icon: Store },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Settings", href: "/vendor/settings", icon: Settings },
      { label: "Shipping", href: "/vendor/shipping", icon: Truck },
      { label: "Bank Details", href: "/vendor/bank-details", icon: CreditCard },
    ],
  },
];

const adminItems: SidebarSection[] = [
  {
    heading: "Main",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Vendors", href: "/admin/vendors", icon: Users },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    heading: "Finance",
    items: [
      { label: "Payments", href: "/admin/payments", icon: DollarSign },
      { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
      { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Competitions", href: "/admin/competitions", icon: Trophy },
      { label: "Banners", href: "/admin/banners", icon: Megaphone },
      { label: "Blog", href: "/admin/blog", icon: PenTool },
      { label: "Content", href: "/admin/content", icon: FileText },
    ],
  },
  {
    heading: "Management",
    items: [
      { label: "Commissions", href: "/admin/commissions", icon: Percent },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Support", href: "/admin/support", icon: AlertTriangle },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "System", href: "/admin/system", icon: Server },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
    ],
  },
];

interface SidebarProps {
  variant?: "customer" | "vendor" | "admin";
  className?: string;
}

export function Sidebar({ variant = "vendor", className }: SidebarProps) {
  const pathname = usePathname();
  const sections =
    variant === "customer"
      ? customerItems
      : variant === "admin"
        ? adminItems
        : vendorItems;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 h-full bg-white border-r border-accent-200 overflow-y-auto",
        className,
      )}
    >
      <nav className="flex-1 px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.heading}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-500 uppercase tracking-wider">
              {section.heading}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isItemExpanded = expandedItems.has(item.label);
                const isChildActive =
                  item.children?.some((c) => isActive(c.href)) ?? false;
                const isItemActive = item.href ? isActive(item.href) : isChildActive;

                return (
                  <li key={item.label}>
                    {item.href && !hasChildren ? (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isItemActive
                            ? "bg-primary-50 text-primary-700 font-medium border-l-2 border-primary-500"
                            : "text-text-600 hover:bg-accent-50 border-l-2 border-transparent",
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : hasChildren ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleExpanded(item.label)}
                          className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                            isItemActive
                              ? "bg-primary-50 text-primary-700 font-medium border-l-2 border-primary-500"
                              : "text-text-600 hover:bg-accent-50 border-l-2 border-transparent",
                          )}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isItemExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isItemExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden ml-7 border-l-2 border-accent-200"
                            >
                              {item.children?.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className={cn(
                                    "block py-2 pl-4 text-sm transition-colors",
                                    isActive(child.href)
                                      ? "text-primary-700 font-medium bg-primary-50/50"
                                      : "text-muted-600 hover:text-text-700",
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
