"use client";

import React from "react";
import { Shield, Lock, Truck, Users, CreditCard, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const trustItems = [
  {
    icon: Shield,
    text: "100% Authentic Sri Lankan Handmade",
  },
  {
    icon: Lock,
    text: "Secure Checkout & Buyer Protection",
  },
  {
    icon: Truck,
    text: "Free Delivery Over Rs. 5,000",
  },
  {
    icon: Users,
    text: "4,500+ Verified Artisans",
  },
  {
    icon: CreditCard,
    text: "Fortnight Secure Payouts",
  },
  {
    icon: RotateCcw,
    text: "Easy 7-Day Returns",
  },
];

export function TrustBadges() {
  return (
    <section className="py-8 bg-surface-50 border-y border-accent-200 overflow-hidden">
      <div className="relative">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...trustItems, ...trustItems].map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className="flex items-center gap-3 px-2 text-text-700"
            >
              <div className="w-10 h-10 rounded-full bg-accent-50/80 border border-accent-200/50 flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="w-4 h-4 text-accent-600" />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
              {index < trustItems.length * 2 - 1 && (
                <div className="w-px h-6 bg-surface-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
