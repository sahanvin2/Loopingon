"use client";

import React from "react";
import { Shield, Truck, RotateCcw, Headset, ShieldCheck } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Secure Payments",
    subtitle: "100% secure checkout",
  },
  {
    icon: Truck,
    title: "Loyalty Programme",
    subtitle: "On orders over $50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "Within 30 days",
  },
  {
    icon: Headset,
    title: "Support 24/7",
    subtitle: "We're always here",
  },
  {
    icon: ShieldCheck,
    title: "Buyer Protection",
    subtitle: "Shop with confidence",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white py-12 border-b border-surface-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 lg:gap-4">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-surface-50 border border-surface-200 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-text-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-900">{item.title}</span>
                <span className="text-xs text-muted-500 mt-0.5">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
