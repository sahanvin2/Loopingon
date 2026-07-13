"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { post } from "@/lib/api-client";
import { cn, getImageUrl } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { ProductPriceArea, ProductActionArea } from "@/components/product/product-buy-box";
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

const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  electronics: [
    { q: "Is this product covered by warranty?", a: "Most electronics on Kandiyam include a manufacturer warranty. Check the product description for specific warranty details, or message the seller directly." },
    { q: "Is this compatible with Sri Lankan voltage (230V)?", a: "Yes, all electronics sold on Kandiyam are compatible with Sri Lanka's 230V power standard. Please verify the plug type matches your socket." },
    { q: "What if the item is defective?", a: "We offer a 7-day return policy for defective electronics. Contact the seller within 48 hours of receiving the item with photos of the defect." },
  ],
  "home-living": [
    { q: "What materials are used in this product?", a: "Our home & living products use quality materials including wood, metal, ceramics, and textiles. The exact materials are listed in the product description above." },
    { q: "Can I return this if it doesn't match my decor?", a: "Yes, we accept returns within 14 days if the item is unused and in original packaging. Return shipping costs may apply." },
    { q: "Is assembly required?", a: "Assembly requirements vary by product. Check the product description for details. Most items come partially assembled with clear instructions." },
  ],
  "kids-baby": [
    { q: "Is this product safe for children?", a: "Yes, all kids & baby products on Kandiyam meet safety standards. They are made with non-toxic materials and have no small parts for choking hazards unless age-specified." },
    { q: "Can I wash or clean this item?", a: "Most kids items are washable. Check the care instructions in the product description for specific washing guidelines." },
    { q: "What age range is this suitable for?", a: "The recommended age range is specified in the product description. Always supervise young children during use." },
  ],
  jewelry: [
    { q: "Is this real gold/silver?", a: "The material composition is listed in the product description. We have both precious metal jewelry and fashion jewelry — check the materials section for specifics." },
    { q: "Will this tarnish over time?", a: "Proper care prevents tarnishing. Store in a dry place, avoid contact with water and perfumes. The seller can provide specific care instructions." },
    { q: "Can I resize this ring/bracelet?", a: "Resizing availability depends on the product. Message the seller to inquire about resizing options and any additional costs." },
  ],
  clothing: [
    { q: "What size should I order?", a: "Refer to the size chart in the product images. Sri Lankan sizes may differ from international standards. When in doubt, message the seller with your measurements." },
    { q: "Can I return if it doesn't fit?", a: "Yes, size exchanges are accepted within 7 days. The item must be unworn with tags attached. Buyer covers return shipping." },
    { q: "How do I wash this garment?", a: "Care instructions vary by fabric. Handloom and delicate fabrics require gentle hand washing. Check the product description for specific care guidelines." },
  ],
};

function getFAQs(categorySlug: string | undefined): { q: string; a: string }[] {
  if (!categorySlug) return [];
  const match = Object.entries(CATEGORY_FAQS).find(([key]) => categorySlug.includes(key));
  return match ? match[1] : [
    { q: "Is this product available for immediate delivery?", a: "Digital products are delivered instantly after payment confirmation. You'll receive access details in your orders page immediately." },
    { q: "Can I pay with Cash on Delivery?", a: "Yes! All orders on Kandiyam are Cash on Delivery. Pay only when you receive your order at your doorstep." },
    { q: "How do I contact the seller?", a: "Use the Chat with Seller button on this page to directly message the seller. Most sellers respond within a few hours." },
  ];
}

import { useAnalytics } from "@/hooks/use-analytics";

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeTab, setActiveTab] = React.useState("description");
  const [faqOpen, setFaqOpen] = React.useState<number | null>(null);
  const router = useRouter();

  const contactVendorMutation = useMutation({
    mutationFn: (vendorUserId: string) => 
      post(`/messages/threads`, { 
        participantId: vendorUserId, 
        subject: `Regarding Product: ${product.title}`,
        productId: product.id 
      }),
    onSuccess: (res: any) => {
      if (res.data?.id) {
        router.push(`/dashboard/messages?threadId=${res.data.id}`);
      } else {
        router.push(`/dashboard/messages`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to start conversation. Please try again.");
    },
  });

  const images = product.images || [];
  const videos = product.videos || [];
  const reviews = product.reviews || [];
  const variants = product.variants || [];
  const primaryCategory = product.categories?.[0]?.category;
  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);
  const [quantity, setQuantity] = React.useState(1);

  const { trackInteraction } = useAnalytics();

  React.useEffect(() => {
    if (product.id) {
      trackInteraction({ type: "VIEW", productId: product.id });
    }
  }, [product.id, trackInteraction]);

  const hasSpecs = product.materials?.length > 0 || product.dimensions || product.weight || product.craftType || product.processingTime;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-24 lg:pb-0 relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Images */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <ProductImages images={images} videos={videos} />
          </div>

          {/* Middle Column: Info & Description */}
          <div className="lg:col-span-4 xl:col-span-4 w-full space-y-8">
            <ProductInfo product={product} />

            <div className="pt-2">
              <ProductPriceArea 
                product={product} 
                selectedVariant={selectedVariant} 
                setSelectedVariant={setSelectedVariant} 
              />
            </div>

            {/* Description */}
            {!!product.description && product.description !== "0" && (
              <section className="pt-8 border-t border-accent-200">
                <h2 className="font-serif text-2xl text-text-900 mb-6">Description</h2>
                <div
                  className="prose prose-sm max-w-none text-muted-600 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: String(product.description) }}
                />
              </section>
            )}

            {/* Product Specs */}
            {hasSpecs && (
              <section className="pt-8 border-t border-accent-200">
                <h2 className="font-serif text-2xl text-text-900 mb-6">Product Details & Specs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                        <p className="text-sm font-semibold text-text-900">{product.isDigital ? "Within 6 hours" : `${product.processingTime} business days`}</p>
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
            {(product.isEcoFriendly || product.isFairTrade || product.isCustomizable) && (
              <section className="pt-8 border-t border-accent-200 flex flex-wrap gap-3">
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
          </div>

          {/* Right Column: Checkout & Shipping */}
          <div className="lg:col-span-3 xl:col-span-3 w-full lg:sticky lg:top-24 space-y-6">
            <LoyaltyProgressBar />
            
            <div className="bg-white rounded-2xl border border-accent-200 p-5 shadow-sm">
              <ProductActionArea 
                product={product} 
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </div>

            {/* Shipping & Delivery Info */}
            <div className="bg-gradient-to-br from-teal-50/80 to-blue-50/80 rounded-2xl p-5 border border-teal-100 shadow-sm">
              <h3 className="font-serif text-lg text-text-900 mb-4">Delivery</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-teal-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-900">Digital Delivery</p>
                    <p className="text-xs text-muted-600 mt-0.5">
                      Delivered within 6 hours of payment confirmation. Instant access via your orders page.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-900">Instant Access</p>
                    <p className="text-xs text-muted-600 mt-0.5">
                      No shipping fees. Digital items are delivered directly to your account.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-900 mb-2">Secure Payments</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="w-10 h-7 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                        <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 w-auto object-contain" />
                      </div>
                      <div className="w-10 h-7 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                        <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" />
                      </div>
                      <div className="w-10 h-7 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                        <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-5 w-auto object-contain" />
                      </div>
                      <div className="w-10 h-7 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                        <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" className="h-5 w-auto object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {product.vendor && (
              <div className="bg-surface-50 rounded-2xl p-5 border border-accent-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-500 mb-3">Sold By</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border border-accent-200 bg-white overflow-hidden shrink-0">
                    {product.vendor.storeLogo ? (
                      <Image
                        src={getImageUrl(product.vendor.storeLogo)}
                        alt={product.vendor.storeName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-serif text-primary-600">
                        {product.vendor.storeName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-serif text-base text-text-900 truncate">{product.vendor.storeName}</h4>
                      <VendorBadge />
                    </div>
                    <Link
                      href={`/vendors/${product.vendor.storeSlug}`}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      Visit Store &rarr;
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-accent-200">
                  <button
                    onClick={() => {
                      if (product.vendor?.userId) {
                        contactVendorMutation.mutate(product.vendor.userId);
                      }
                    }}
                    disabled={contactVendorMutation.isPending || !product.vendor?.userId}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-accent-300 text-text-700 rounded-lg text-xs font-semibold hover:bg-surface-100 transition-colors disabled:opacity-50"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {contactVendorMutation.isPending ? "Connecting..." : "Message Seller"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      <div className="mt-16 pt-16 border-t border-accent-200">
        {/* FAQ */}
        <section className="mb-16">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-text-900 tracking-tight text-center uppercase mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {getFAQs(primaryCategory?.slug).map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="bg-neutral-100/60 hover:bg-neutral-100/85 transition-all duration-200 rounded-2xl overflow-hidden border border-neutral-200/20 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors"
                  >
                    <span className="text-sm font-bold text-text-900 pr-4">{faq.q}</span>
                    <span className="text-lg font-bold text-text-500 shrink-0 select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-600 leading-relaxed border-t border-neutral-200/10 pt-2 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Reviews */}
        <ProductReviews productId={product.id} reviews={reviews} averageRating={product.averageRating} reviewCount={product.reviewCount} />

        {/* Related Products */}
        <RelatedProducts productId={product.id} categoryId={primaryCategory?.id} />
      </div>
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
