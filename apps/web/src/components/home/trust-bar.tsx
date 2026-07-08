"use client";

import React from "react";
import { ShieldCheck, Truck, RefreshCcw, HeadphonesIcon, BadgeCheck, Wand2 } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-text-700" />,
    title: "Secure Payments",
    subtitle: "100% secure checkout",
  },
  {
    icon: <Wand2 className="w-5 h-5 text-text-700" />,
    title: "Instant Delivery",
    subtitle: "Automated via email",
  },
  {
    icon: <RefreshCcw className="w-5 h-5 text-[#E63946]" />,
    title: "Easy Returns",
    subtitle: "Within 30 days",
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5 text-text-700" />,
    title: "Support 24/7",
    subtitle: "We're always here",
  },
  {
    icon: <BadgeCheck className="w-5 h-5 text-text-700" />,
    title: "Buyer Protection",
    subtitle: "Shop with confidence",
  },
];

export function TrustBar() {
  return (
    <section className="w-full bg-[#FCFDFD] py-8 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-6 lg:gap-4 bg-white border border-surface-200 rounded-2xl shadow-sm py-6 px-4 md:px-8">
          {TRUST_ITEMS.map((item, index) => (
            <React.Fragment key={item.title}>
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-50 border border-surface-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">{item.title}</h4>
                  <p className="text-xs text-text-500 font-medium">{item.subtitle}</p>
                </div>
              </div>
              
              {/* Divider for all but last item, hidden on mobile for better wrapping */}
              {index < TRUST_ITEMS.length - 1 && (
                <div className="hidden lg:block w-px h-10 bg-surface-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
