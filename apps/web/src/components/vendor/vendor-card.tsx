"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, Package } from "lucide-react";
import { cn, getAvatarUrl, getImageUrl } from "@/lib/utils";
import type { Vendor } from "@/types";
import { Badge } from "@/components/shared/badge";
import { RatingStars } from "@/components/shared/rating-stars";

interface VendorCardProps {
  vendor: Vendor;
  className?: string;
}

export function VendorCard({ vendor, className }: VendorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={cn(
        "bg-white rounded-lg border border-accent-300 shadow-sm overflow-hidden",
        "hover:shadow-md transition-shadow duration-300",
        className,
      )}
    >
      <Link
        href={`/vendors/${vendor.storeSlug}`}
        className="block p-6 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full border-2 border-accent-200 overflow-hidden bg-muted-100 mb-4">
          {vendor.storeLogo ? (
            <Image
              src={getImageUrl(vendor.storeLogo)}
              alt={vendor.storeName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-primary-600">
              {vendor.storeName.charAt(0)}
            </div>
          )}
        </div>

        <h3 className="font-serif text-lg text-text-900 mb-1">
          {vendor.storeName}
        </h3>

        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {vendor.craftType.slice(0, 3).map((craft) => (
            <Badge key={craft} variant="blush" size="sm">
              {craft}
            </Badge>
          ))}
          {vendor.craftType.length > 3 && (
            <Badge variant="outline" size="sm">
              +{vendor.craftType.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-500 mb-3">
          <MapPin className="w-3 h-3" />
          {vendor.workshopCity || "Sri Lanka"}
          {vendor.workshopDistrict && `, ${vendor.workshopDistrict}`}
        </div>

        <div className="flex items-center justify-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1">
            <RatingStars rating={vendor.rating} size="sm" />
            <span className="text-muted-500">({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-500">
            <Package className="w-3.5 h-3.5" />
            {vendor.totalProducts}
          </div>
        </div>

        <p className="text-sm text-muted-600 line-clamp-1 mb-4">
          {vendor.storeDescription}
        </p>

        <span
          className={cn(
            "inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-primary-600 text-white hover:bg-primary-700",
          )}
        >
          View Store
        </span>
      </Link>
    </motion.div>
  );
}
