"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Package,
  BarChart3,
  Clock,
  Truck,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import type { Vendor } from "@/types";
import { Badge } from "@/components/shared/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { VendorBadge } from "@/components/vendor/vendor-badge";

interface VendorStorefrontHeaderProps {
  vendor: Vendor;
}

const tabs = ["Products", "About", "Reviews", "Policies"];

const stats = [
  { label: "Rating", value: "4.9", icon: Star },
  { label: "Products", value: "245", icon: Package },
  { label: "Sales", value: "1.2k", icon: BarChart3 },
  { label: "Response", value: "98%", icon: MessageSquare },
  { label: "Delivery", value: "99%", icon: Truck },
];

export function VendorStorefrontHeader({ vendor }: VendorStorefrontHeaderProps) {
  const [activeTab, setActiveTab] = useState("Products");

  return (
    <div>
      <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-text-800 mb-0">
        {vendor.storeBanner && (
          <Image
            src={getImageUrl(vendor.storeBanner)}
            alt={`${vendor.storeName} banner`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-text-900/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
          <div className="w-28 h-28 rounded-full border-4 border-accent-100 bg-white overflow-hidden shadow-md">
            {vendor.storeLogo ? (
              <Image
                src={getImageUrl(vendor.storeLogo)}
                alt={vendor.storeName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-primary-600 bg-surface-50">
                {vendor.storeName.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-serif text-2xl text-text-900">
                {vendor.storeName}
              </h1>
              <VendorBadge />
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              {vendor.craftType.slice(0, 4).map((craft) => (
                <Badge key={craft} variant="blush" size="sm">
                  {craft}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-500">
              {vendor.workshopCity}
              {vendor.workshopDistrict && `, ${vendor.workshopDistrict}`}
              &nbsp;&middot;&nbsp;Crafting since {new Date(vendor.storeSince).getFullYear()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                "bg-primary-600 text-white hover:bg-primary-700",
              )}
            >
              Follow
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                "border border-accent-300 text-text-700 hover:bg-accent-50",
              )}
            >
              Contact
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border border-accent-200 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent-500" />
              <div>
                <p className="text-lg font-bold text-text-900">4.9</p>
                <p className="text-xs text-muted-500">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-lg font-bold text-text-900">{vendor.totalProducts}</p>
                <p className="text-xs text-muted-500">Products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-600" />
              <div>
                <p className="text-lg font-bold text-text-900">{vendor.totalOrders}</p>
                <p className="text-xs text-muted-500">Sales</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-text-900">{vendor.responseRate}%</p>
                <p className="text-xs text-muted-500">Response</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-lg font-bold text-text-900">
                  {vendor.onTimeDeliveryRate}%
                </p>
                <p className="text-xs text-muted-500">Delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto mt-6 border-b border-accent-200 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors border-b-2 shrink-0",
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-muted-600 hover:text-text-700",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
