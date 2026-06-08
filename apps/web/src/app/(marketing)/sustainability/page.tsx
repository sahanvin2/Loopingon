import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Leaf, Package, Trees, Ship, Recycle, GraduationCap, Truck, Heart } from "lucide-react";
import { get } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { ProductGrid } from "@/components/product/product-grid";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Sustainability - Our Commitment to the Planet",
  description: "Learn about Kandyam's sustainability initiatives: eco-friendly packaging, tree planting program, carbon-neutral shipping, and artisan education.",
};

const stats = [
  { label: "Eco-Friendly Packaging", value: "80%", icon: Package },
  { label: "Trees Planted", value: "15,000+", icon: Trees },
  { label: "Certified Sustainable Materials", value: "60%", icon: Leaf },
];

const initiatives = [
  { icon: Package, title: "Plastic-Free Packaging", description: "All Kandyam shipments use biodegradable, recycled, or reusable packaging materials. We've eliminated single-use plastics from our entire supply chain." },
  { icon: Trees, title: "Tree Planting Program", description: "For every 100 orders, we plant a tree in Sri Lanka's central highlands. Working with local reforestation partners, we've planted over 15,000 trees since 2021." },
  { icon: Ship, title: "Carbon-Neutral Shipping", description: "We offset 100% of carbon emissions from international shipping through certified carbon offset programs. Every international order is climate-neutral." },
  { icon: GraduationCap, title: "Artisan Education", description: "We provide free workshops to our artisans on sustainable material sourcing, waste reduction, and eco-friendly production methods." },
];

const tips = [
  "Choose locally sourced, natural materials whenever possible",
  "Support artisans who use traditional, low-waste production methods",
  "Opt for consolidated shipping to reduce carbon footprint",
  "Look for our 'Eco-Friendly' badge on sustainable products",
  "Buy quality handmade items that last a lifetime, not fast fashion",
  "Reuse or repurpose packaging materials from your orders",
  "Share your sustainable purchases on social media to inspire others",
];

async function EcoFriendlyProducts() {
  let products: Product[] = [];
  try {
    const res = await get<PaginatedResponse<Product>>("/products", { limit: 8, isEcoFriendly: true });
    products = res.data;
  } catch {}
  return <ProductGrid products={products} />;
}

export default function SustainabilityPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-text-900">
        <div className="absolute inset-0">
          <Image src="/images/sustainability/sri-lanka-nature.jpg" alt="Sri Lanka nature" fill className="object-cover opacity-25" priority sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Our Commitment</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-200">
            Handmade is inherently sustainable. We&apos;re building on that foundation to ensure
            every aspect of Kandyam leaves a positive impact on our planet.
          </p>
        </div>
      </section>

      <section className="bg-primary-600 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto mb-3 h-8 w-8 text-primary-200" />
                <p className="font-serif text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-primary-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">Our Initiatives</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {initiatives.map((i) => (
              <div key={i.title} className="rounded-xl border border-accent-300 bg-surface-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted-100">
                  <i.icon className="h-6 w-6 text-muted-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{i.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-text-900">Shop Eco-Friendly</h2>
            <Link href="/products?isEcoFriendly=true" className="text-sm font-medium text-primary-600 hover:underline">View All</Link>
          </div>
          <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="mt-8" />}>
            <div className="mt-8">
              <EcoFriendlyProducts />
            </div>
          </Suspense>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">Tips for Sustainable Shopping</h2>
          <div className="mt-8 space-y-3">
            {tips.map((tip) => (
              <div key={tip} className="flex items-start gap-3 rounded-xl bg-surface-50 p-4">
                <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-muted-600" />
                <span className="text-sm text-muted-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-900">Our Partners</h2>
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {["Eco-Pack Lanka", "Reforest Sri Lanka", "Green Carbon Fund", "Sustainable Crafts Council"].map((name) => (
              <div key={name} className="rounded-xl bg-white p-6 shadow-soft-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted-50">
                  <Heart className="h-8 w-8 text-muted-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-text-700">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
