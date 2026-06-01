"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Music2,
  Mail,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "Deals", href: "/shop?filter=sale" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Featured", href: "/shop?sort=featured" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Start Selling", href: "/vendor/register" },
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Success Stories", href: "/success-stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return Policy", href: "/legal/returns" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
  { icon: Music2, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
];

export function Footer() {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-charcoal-900 text-cream-100">
      <div
        className="h-1 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(90deg, #C75B39 0px, #C75B39 16px, #D4A843 16px, #D4A843 32px, #2D8B7D 32px, #2D8B7D 48px)",
        }}
      />

      <div className="max-w-8xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {footerColumns.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h4 className="font-serif text-gold-500 text-sm font-semibold mb-4 tracking-wider uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cream-300 hover:text-cream-100 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-serif text-gold-500 text-sm font-semibold mb-4 tracking-wider uppercase">
              Stay Inspired
            </h4>
            <p className="text-cream-300 text-sm mb-4">
              Subscribe to receive updates on new artisans, exclusive offers, and
              Sri Lankan craft stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm",
                    "bg-charcoal-800 border border-charcoal-700 text-cream-100",
                    "placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500",
                  )}
                  aria-label="Email for newsletter"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-medium",
                  "bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors",
                )}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-charcoal-800">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "bg-charcoal-800 text-cream-400 hover:bg-terracotta-600 hover:text-white",
                  "transition-colors",
                )}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {["visa-mastercard", "amex", "payhere"].map((method) => (
              <div
                key={method}
                className="h-8 px-3 rounded bg-charcoal-800 flex items-center text-cream-500 text-xs font-medium uppercase tracking-wider"
              >
                {method === "visa-mastercard"
                  ? "Visa / MC"
                  : method === "payhere"
                    ? "PayHere"
                    : "Amex"}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-cream-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Loopingon. All rights reserved.
            Made with love in Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
}
