"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";

const socialLinks = [
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
  { icon: Music2, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
];

export function Footer() {
  const { user } = useAuthStore();
  const isSeller = user?.role === "VENDOR";

  const footerColumns = [
    {
      title: "Shop",
      links: [
        { label: "All items", href: "/products" },
        { label: "Home & Living", href: "/products?category=home-living" },
        { label: "Jewelry", href: "/products?category=jewelry" },
        { label: "Gifts", href: "/products?category=gifts" },
        { label: "Art & Prints", href: "/products?category=art-prints" },
      ],
    },
    {
      title: "Sell",
      links: [
        ...(isSeller
          ? [
              { label: "Open a shop", href: "/vendor/register" },
              { label: "Seller dashboard", href: "/vendor/dashboard" },
            ]
          : []),
        { label: "How it works", href: "/how-it-works" },
        { label: "Success stories", href: "/success-stories" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our story", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Careers", href: "/careers" },
        { label: "Contact us", href: "/contact" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Help center", href: "/help" },
        { label: "Shipping policy", href: "/shipping" },
        { label: "Return policy", href: "/legal/returns" },
        { label: "Privacy policy", href: "/legal/privacy" },
        { label: "Terms of service", href: "/legal/terms" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-blush-200 bg-blush-100/40">
      <div className="max-w-8xl mx-auto px-4">
        <div className="grid gap-10 py-14 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-serif text-lg shadow-[0_8px_20px_-8px_rgba(176,86,110,0.7)]">
                L
              </span>
              <span className="font-serif text-2xl tracking-tight text-charcoal-900">
                loopingo
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-500">
              A softer marketplace for handmade things, made by Sri Lankan artisans who care.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-lg text-charcoal-800">{col.title}</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-500">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-charcoal-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="border-t border-blush-200 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border border-blush-200 bg-white text-muted-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm",
                )}
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {["Visa / MC", "Amex", "PayHere"].map((method) => (
              <span
                key={method}
                className="h-8 px-3 rounded-full bg-white border border-blush-200 flex items-center text-muted-500 text-xs font-medium tracking-wider shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="pb-6 text-center text-xs text-muted-400">
          <p>© {new Date().getFullYear()} Loopingo. Made with care in Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}
