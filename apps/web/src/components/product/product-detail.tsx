"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { VendorBadge } from "@/components/vendor/vendor-badge";
import Image from "next/image";
import { RatingStars } from "@/components/shared/rating-stars";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const images = product.images || [];
  const videos = product.videos || [];
  const reviews = product.reviews || [];
  const primaryCategory = product.categories?.[0]?.category;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ProductBreadcrumb
        productTitle={product.title}
        categoryName={primaryCategory?.name}
        categorySlug={primaryCategory?.slug}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Images */}
        <div className="w-full">
          <ProductImages images={images} videos={videos} />
        </div>

        {/* Right Column: Info & Checkout */}
        <div className="w-full lg:sticky lg:top-24 space-y-8">
          <ProductInfo product={product} />
          <ProductBuyBox product={product} />
        </div>
      </div>

      <div className="mt-12 pt-12 border-t border-blush-200">
        {product.description && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-charcoal-900 mb-6">
              Description
            </h2>
            <div
              className="prose prose-sm max-w-none text-muted-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}

        {product.vendor && (
          <section className="mb-12 bg-cream-50 rounded-xl p-6 border border-blush-200">
            <h2 className="font-serif text-2xl text-charcoal-900 mb-6">
              About the Artisan
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-blush-200 bg-white overflow-hidden shrink-0">
                {product.vendor.storeLogo ? (
                  <Image
                    src={getImageUrl(product.vendor.storeLogo)}
                    alt={product.vendor.storeName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-rose-600">
                    {product.vendor.storeName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-charcoal-900">
                    {product.vendor.storeName}
                  </h3>
                  <VendorBadge />
                </div>
                <p className="text-sm text-muted-500 mb-2">
                  {product.vendor.workshopCity}, {product.vendor.workshopDistrict}
                  &nbsp;&middot;&nbsp;
                  {product.vendor.yearsOfExperience}+ years experience
                </p>
                <p className="text-sm text-muted-600 line-clamp-3 mb-3">
                  {product.vendor.storeDescription}
                </p>
                <Link
                  href={`/vendors/${product.vendor.storeSlug}`}
                  className={cn(
                    "text-sm font-medium text-rose-600 hover:text-rose-700",
                    "hover:underline",
                  )}
                >
                  Visit Store &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        <ProductReviews
          reviews={reviews}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />

        <RelatedProducts productId={product.id} />
      </div>
    </motion.div>
  );
}
