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
  const isSeller = user?.role === "VENDOR";

  const footerColumns = [
    {
      title: "Shop",
      links: [
        { label: "All items", href: "/products" },
        { label: "Wood Crafts", href: "/categories/wood-crafts" },
        { label: "Batik", href: "/categories/batik" },
        { label: "Hand Loom", href: "/categories/hand-loom" },
        { label: "Our Makers", href: "/makers" },
        { label: "Gifts", href: "/gift" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help-center" },
        { label: "FAQs", href: "/faq" },
        { label: "Shipping & Delivery", href: "/shipping-policy" },
        { label: "Returns & Exchanges", href: "/return-policy" },
        { label: "Contact Us", href: "/contact" },
        { label: "Intellectual Property", href: "/intellectual-property" },
        { label: "Community Guidelines", href: "/community-guidelines" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About · Our Story", href: "/about-us" },
        { label: "Meet the Makers", href: "/makers" },
        { label: "Referral Program", href: "/referral" },
        { label: "Become an Artisan", href: "/sell-on-kandyam" },
        ...(isSeller ? [{ label: "Artisan Dashboard", href: "/vendor/dashboard" }] : []),
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-surface-50">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between py-14 gap-12">
          {/* Brand & Social */}
          <div className="lg:w-1/3">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group mb-4"
              aria-label="Kandyam home"
            >
              <span className="grid h-6 w-6 place-items-center text-primary-500 group-hover:scale-105 transition-transform">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                   <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
                 </svg>
              </span>
              <span className="font-serif text-xl tracking-tight text-navy-900 font-bold">
                kandyam
              </span>
            </Link>
            <p className="max-w-xs text-xs text-text-500 mb-6 leading-relaxed font-medium">
              Empowering Sri Lankan artisans and bringing handmade to your fingertips.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-full bg-surface-200 text-text-500 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="font-serif text-sm font-bold text-navy-900 mb-4">{col.title}</h4>
                <ul className="space-y-3 text-xs text-text-500 font-medium">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-primary-600 transition-colors"
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
        <div className="border-t border-surface-200 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-text-400 font-medium">
          <p>© {new Date().getFullYear()} Kandyam, all rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-primary-600">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-primary-600">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-primary-600">Cookies</Link>
          </div>
          <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-primary-500 fill-primary-500" /> in Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
