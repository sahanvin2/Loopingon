import React from "react";
import { ShieldCheck, Truck, RotateCcw, HeartHandshake, ShieldAlert } from "lucide-react";

export function TrustBar() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "100% secure processing",
    },
    {
      icon: Truck,
      title: "Loyalty Programme",
      description: "Earn points & rewards",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: ShieldAlert,
      title: "Buyer Protection",
      description: "Full purchase coverage",
    },
    {
      icon: HeartHandshake,
      title: "Support Sellers",
      description: "Empowering local sellers",
    },
  ];

  return (
    <section className="w-full bg-white border-b border-surface-200 py-6 relative z-20 shadow-sm -mt-2">
      <div className="container-page mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 md:gap-4 justify-center group">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-50 text-primary-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-navy-900 leading-tight">
                  {item.title}
                </span>
                <span className="text-xs md:text-sm text-text-500 hidden sm:block mt-0.5">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
