"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { LoyaltyProgressBar } from "@/components/loyalty/loyalty-progress-bar";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { VendorBadge } from "@/components/vendor/vendor-badge";
import { RatingStars } from "@/components/shared/rating-stars";
import {
  Ruler,
  Scale,
  Package,
  Clock,
  Leaf,
  ShieldCheck,
  Award,
  Sparkles,
  Factory,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
} from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

const COMMON_FAQS = [
  { q: "Is this product genuinely handmade?", a: "Yes. Every product on Kandyam is verified as authentically handmade by Sri Lankan artisans. Each piece is crafted individually using traditional techniques passed down through generations." },
  { q: "Can I request a custom size or color?", a: "Many of our artisans accept custom orders. Use the 'Chat with Seller' button to ask the artisan directly about customizations. Custom orders may take additional processing time." },
  { q: "How do I care for this handcrafted item?", a: "Handcrafted items need gentle care. Avoid harsh chemicals and prolonged direct sunlight. Specific care instructions vary by material — feel free to message the seller for details about this specific piece." },
  { q: "What if the item arrives damaged?", a: "We've got you covered. Take photos of the damage within 48 hours of delivery and contact our support. We'll arrange a replacement or full refund at no cost to you." },
];

export function ProductDetail({ product }: ProductDetailProps) {
  const images = product.images || [];
  const videos = product.videos || [];
  const reviews = product.reviews || [];
  const variants = product.variants || [];
  const primaryCategory = product.categories?.[0]?.category;
  const [faqOpen, setFaqOpen] = React.useState<number | null>(null);

  const hasSpecs = product.materials?.length > 0 || product.dimensions || product.weight || product.craftType || product.processingTime;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-24 lg:pb-0 relative"
    >
      <ProductBreadcrumb
        productTitle={product.title}
        categoryName={primaryCategory?.name}
        categorySlug={primaryCategory?.slug}
      />

      {/* Discount Banner */}
      {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
        <div className="mb-4 p-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-700">
              Special Offer — Save {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)}%
            </p>
            <p className="text-xs text-rose-600">
              Limited time discount. Buy now at the best price.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Images */}
        <div className="w-full">
          <ProductImages images={images} videos={videos} />
        </div>

        {/* Right Column: Info & Checkout */}
        <div className="w-full lg:sticky lg:top-24 space-y-6">
          <ProductInfo product={product} />
          <LoyaltyProgressBar />
          <ProductBuyBox product={product} />
        </div>
      </div>

      <div className="mt-12 pt-12 border-t border-accent-200">
        {/* Product Specs */}
        {hasSpecs && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-text-900 mb-6">Product Details & Specs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.craftType && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Craft Type</p>
                    <p className="text-sm font-semibold text-text-900">{product.craftType}</p>
                  </div>
                </div>
              )}
              {product.materials && product.materials.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Materials</p>
                    <p className="text-sm font-semibold text-text-900">{product.materials.join(", ")}</p>
                  </div>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-muted-50 text-muted-600 flex items-center justify-center shrink-0">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Dimensions</p>
                    <p className="text-sm font-semibold text-text-900">
                      {Object.entries(product.dimensions).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </p>
                  </div>
                </div>
              )}
              {product.weight != null && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Weight</p>
                    <p className="text-sm font-semibold text-text-900">{product.weight} kg</p>
                  </div>
                </div>
              )}
              {product.processingTime != null && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Processing Time</p>
                    <p className="text-sm font-semibold text-text-900">{product.processingTime} business days</p>
                  </div>
                </div>
              )}
              {product.madeToOrder && (
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-accent-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-500 uppercase tracking-wide">Made To</p>
                    <p className="text-sm font-semibold text-text-900">Order</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tags Banner */}
        {(product.isHandmade || product.isEcoFriendly || product.isFairTrade || product.isCustomizable) && (
          <section className="mb-12 flex flex-wrap gap-3">
            {product.isHandmade && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
                <Award className="w-3.5 h-3.5" /> Authentic Handmade
              </span>
            )}
            {product.isEcoFriendly && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-800">
                <Leaf className="w-3.5 h-3.5" /> Eco-Friendly
              </span>
            )}
            {product.isFairTrade && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Fair Trade
              </span>
            )}
            {product.isCustomizable && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-xs font-semibold text-purple-800">
                <Sparkles className="w-3.5 h-3.5" /> Customizable
              </span>
            )}
          </section>
        )}

        {/* Description */}
        {product.description && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-text-900 mb-6">Description</h2>
            <div
              className="prose prose-sm max-w-none text-muted-600 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}

        {/* Shipping & Returns Info */}
        <section className="mb-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
          <h2 className="font-serif text-xl text-text-900 mb-4">Shipping & Returns</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-900">
                  {product.freeShippingDomestic ? "Free SL Post Delivery" : `SL Post — Rs. ${product.shippingPrice ? Number(product.shippingPrice).toLocaleString() : "400"}`}
                </p>
                <p className="text-xs text-muted-600">
                  1-3 business days island-wide. Express delivery available at checkout for Rs. 600 (next day).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-900">Easy Returns</p>
                <p className="text-xs text-muted-600">
                  7-day return policy. Items must be unused and in original packaging. Full refund or exchange.
                </p>
              </div>
            </div>
            <Link href="/shipping-policy" className="text-xs text-primary-600 hover:underline font-medium">
              View full shipping & returns policy →
            </Link>
          </div>
        </section>

        {/* Chat with Seller */}
        {product.vendor && (
          <section className="mb-12 text-center p-8 bg-surface-50 rounded-2xl border border-accent-200">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-xl text-text-900 mb-2">Have a Question?</h2>
            <p className="text-sm text-muted-600 mb-5 max-w-sm mx-auto">
              Chat directly with {product.vendor.storeName} about this product. Ask about customizations, materials, or delivery.
            </p>
            <Link
              href={`/dashboard/messages?vendor=${product.vendorId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with Seller
            </Link>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-text-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {COMMON_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-accent-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-text-900 pr-4">{faq.q}</span>
                  {faqOpen === idx ? (
                    <ChevronUp className="w-4 h-4 text-muted-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-400 shrink-0" />
                  )}
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-sm text-muted-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Vendor / Artisan Info */}
        {product.vendor && (
          <section className="mb-12 bg-surface-50 rounded-xl p-6 border border-accent-200">
            <h2 className="font-serif text-2xl text-text-900 mb-6">About the Artisan</h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-accent-200 bg-white overflow-hidden shrink-0">
                {product.vendor.storeLogo ? (
                  <Image
                    src={getImageUrl(product.vendor.storeLogo)}
                    alt={product.vendor.storeName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-primary-600">
                    {product.vendor.storeName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-text-900">{product.vendor.storeName}</h3>
                  <VendorBadge />
                </div>
                <p className="text-sm text-muted-500 mb-2">
                  {product.vendor.workshopCity}, {product.vendor.workshopDistrict}
                  &nbsp;&middot;&nbsp;
                  {product.vendor.yearsOfExperience}+ years experience
                </p>
                <p className="text-sm text-muted-600 line-clamp-3 mb-3">{product.vendor.storeDescription}</p>
                <Link
                  href={`/vendors/${product.vendor.storeSlug}`}
                  className={cn("text-sm font-medium text-primary-600 hover:text-primary-700", "hover:underline")}
                >
                  Visit Store &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <ProductReviews productId={product.id} reviews={reviews} averageRating={product.averageRating} reviewCount={product.reviewCount} />

        {/* Related Products */}
        <RelatedProducts productId={product.id} categoryId={primaryCategory?.id} />
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-accent-200 p-4 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-500 line-clamp-1">{product.title}</span>
            <span className="font-bold text-text-900">{parseFloat(product.price).toLocaleString('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 })}</span>
          </div>
          <button
            type="button"
            className="px-6 py-3 bg-text-900 text-white text-sm uppercase tracking-widest font-bold rounded-xl whitespace-nowrap active:scale-95 transition-transform"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
