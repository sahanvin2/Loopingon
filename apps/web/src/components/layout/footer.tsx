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
    <footer className="mt-0 border-t border-surface-200 bg-white">
      <div className="container-page mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group mb-6"
              aria-label="Kandyam home"
            >
              <span className="grid h-10 w-10 place-items-center text-primary-500 group-hover:scale-105 transition-transform bg-primary-50 rounded-xl">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                   <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
                 </svg>
              </span>
              <span className="font-serif text-3xl tracking-tight text-navy-900 font-bold">
                Kandyam
              </span>
            </Link>
            <p className="text-sm text-text-500 mb-8 leading-relaxed">
              Your global marketplace for unique, handcrafted, and luxury goods from sellers worldwide.
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

          {/* Links Grid: 4 Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-serif text-lg font-bold text-navy-900 mb-6">Shop</h4>
              <ul className="space-y-4 text-sm text-text-600">
                <li><Link href="/categories/home-decor" className="hover:text-primary-600 hover:underline underline-offset-4">Home Decor</Link></li>
                <li><Link href="/categories/jewelry" className="hover:text-primary-600 hover:underline underline-offset-4">Jewelry</Link></li>
                <li><Link href="/categories/fashion" className="hover:text-primary-600 hover:underline underline-offset-4">Fashion</Link></li>
                <li><Link href="/categories/art" className="hover:text-primary-600 hover:underline underline-offset-4">Art & Collectibles</Link></li>
                <li><Link href="/categories" className="hover:text-primary-600 hover:underline underline-offset-4">All Categories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif text-lg font-bold text-navy-900 mb-6">Help</h4>
              <ul className="space-y-4 text-sm text-text-600">
                <li><Link href="/help-center" className="hover:text-primary-600 hover:underline underline-offset-4">Help Center</Link></li>
                <li><Link href="/trust" className="hover:text-primary-600 hover:underline underline-offset-4">Trust & Safety</Link></li>
                <li><Link href="/privacy-settings" className="hover:text-primary-600 hover:underline underline-offset-4">Privacy Settings</Link></li>
                <li><Link href="/contact" className="hover:text-primary-600 hover:underline underline-offset-4">Contact Us</Link></li>
                <li><Link href="/returns" className="hover:text-primary-600 hover:underline underline-offset-4">Returns</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-bold text-navy-900 mb-6">Sellers</h4>
              <ul className="space-y-4 text-sm text-text-600">
                <li><Link href="/sell" className="hover:text-primary-600 hover:underline underline-offset-4">Start Selling</Link></li>
                <li><Link href="/handbook" className="hover:text-primary-600 hover:underline underline-offset-4">Seller Handbook</Link></li>
                <li><Link href="/community" className="hover:text-primary-600 hover:underline underline-offset-4">Community</Link></li>
                <li><Link href="/seller-policy" className="hover:text-primary-600 hover:underline underline-offset-4">Seller Policies</Link></li>
                {isSeller && <li><Link href="/vendor/dashboard" className="hover:text-primary-600 hover:underline underline-offset-4">Seller Dashboard</Link></li>}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-bold text-navy-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-text-600">
                <li><Link href="/about" className="hover:text-primary-600 hover:underline underline-offset-4">About Kandyam</Link></li>
                <li><Link href="/policies" className="hover:text-primary-600 hover:underline underline-offset-4">Policies</Link></li>
                <li><Link href="/careers" className="hover:text-primary-600 hover:underline underline-offset-4">Careers</Link></li>
                <li><Link href="/press" className="hover:text-primary-600 hover:underline underline-offset-4">Press</Link></li>
                <li><Link href="/impact" className="hover:text-primary-600 hover:underline underline-offset-4">Impact</Link></li>
              </ul>
            </div>
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
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/terms" className="hover:text-navy-900 hover:underline underline-offset-4">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-navy-900 hover:underline underline-offset-4">Privacy</Link>
            <Link href="/cookies" className="hover:text-navy-900 hover:underline underline-offset-4">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
