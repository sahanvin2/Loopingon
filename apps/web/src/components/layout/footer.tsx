"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Music2, Heart } from "lucide-react";
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSeller = mounted && user?.role === "VENDOR";

  const footerColumns = [
    {
      title: "Shop",
      links: [
        { label: "Electronics", href: "/categories/electronics" },
        { label: "Home & Living", href: "/categories/home-living" },
        { label: "Clothing", href: "/categories/clothing" },
        { label: "Jewelry & Accessories", href: "/categories/jewelry" },
        { label: "Art & Collectibles", href: "/categories/art" },
        { label: "All Categories", href: "/categories" },
      ],
    },
    {
      title: "Sell",
      links: [
        { label: "Start Selling", href: "/sell-on-kandyam" },
        { label: "Seller Handbook", href: "/help-center/seller" },
        { label: "Teams & Community", href: "/community" },
        { label: "Seller Policies", href: "/seller-policy" },
        ...(isSeller ? [{ label: "Seller Dashboard", href: "/vendor/dashboard" }] : []),
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Kandyam", href: "/about-us" },
        { label: "Policies", href: "/policies" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Impact", href: "/impact" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Help Center", href: "/help-center" },
        { label: "Trust & Safety", href: "/trust" },
        { label: "Privacy Settings", href: "/privacy-settings" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-surface-200 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group mb-6"
              aria-label="Kandyam home"
            >
              <span className="grid h-8 w-8 place-items-center text-primary-500 group-hover:scale-105 transition-transform bg-primary-50 rounded-lg">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
                 </svg>
              </span>
              <span className="font-serif text-2xl tracking-tight text-navy-900 font-bold">
                Kandyam
              </span>
            </Link>
            <p className="text-sm text-text-500 mb-8 leading-relaxed">
              Your global marketplace for unique and creative goods.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-surface-100 text-text-600 hover:text-white hover:bg-navy-900 transition-all shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="font-medium text-navy-900 mb-6">{col.title}</h4>
                <ul className="space-y-4 text-sm text-text-600">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-primary-600 hover:underline underline-offset-4 transition-all"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="border-t border-surface-200 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-500">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-navy-900">Sri Lanka</span>
            <span>English (US)</span>
            <span>LKR</span>
          </div>
          <p>© {new Date().getFullYear()} Kandyam. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms-of-service" className="hover:text-navy-900 underline underline-offset-4">Terms of Use</Link>
            <Link href="/privacy-policy" className="hover:text-navy-900 underline underline-offset-4">Privacy</Link>
            <Link href="/cookie-policy" className="hover:text-navy-900 underline underline-offset-4">Interest-based ads</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
