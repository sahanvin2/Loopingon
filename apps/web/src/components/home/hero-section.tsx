"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-navy-900">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Premium Marketplace"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-8xl px-4 py-24 sm:px-6 md:py-32 lg:px-8 xl:py-40">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/20">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>Discover the World's Best Independent Creators</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl leading-[1.1]">
            Extraordinary <br />
            <span className="text-primary-400">Discoveries</span> <br />
            Every Day.
          </h1>
          
          <p className="mt-6 max-w-xl text-lg text-navy-100 leading-relaxed md:text-xl">
            Join thousands of shoppers finding unique, high-quality items directly from independent sellers around the globe.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-primary hover:-translate-y-0.5"
            >
              Shop the Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sell-on-kandyam"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/10"
            >
              Become a Seller
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-6 text-sm text-navy-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary-400" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary-400" />
              <span>Global Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
