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
        { label: "All Products", href: "/products" },
        { label: "Best Sellers", href: "/products?sort=salesCount" },
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Deals", href: "/deals" },
        { label: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQs", href: "/faq" },
        { label: "Shipping & Delivery", href: "/shipping" },
        { label: "Returns & Exchanges", href: "/returns" },
        { label: "Contact Us", href: "/contact" },
        { label: "Track Order", href: "/track-order" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Our Story", href: "/our-story" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Sell on Kandyam",
      links: [
        { label: "Become a Seller", href: "/sell" },
        { label: "Seller Handbook", href: "/handbook" },
        { label: "Creator Community", href: "/community" },
        { label: "Affiliate Program", href: "/affiliate" },
        ...(isSeller ? [{ label: "Seller Dashboard", href: "/vendor/dashboard" }] : []),
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FCFDFD] border-t border-surface-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 py-16">
          
          {/* Brand & Social */}
          <div className="lg:col-span-1 flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none mb-4"
              aria-label="Kandyam home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F7444E" className="w-8 h-8 shrink-0">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
              </svg>
              <span className="font-serif text-2xl tracking-tight text-navy-900 font-bold hidden sm:block">Kandyam</span>
            </Link>
            <p className="text-xs font-medium text-text-500 mb-6 leading-relaxed pr-4">
              A global marketplace for unique, creative and one-of-a-kind items from independent sellers around the world.
            </p>
            <div className="flex items-center gap-3 mt-auto">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-400 hover:text-[#E63946] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid: 4 Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerColumns.map((col, idx) => (
              <div key={idx}>
                <h4 className="font-serif text-sm font-bold text-navy-900 mb-5">{col.title}</h4>
                <ul className="space-y-3 text-[13px] font-medium text-text-500">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link href={link.href} className="hover:text-[#E63946] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Secure Payments */}
          <div className="lg:col-span-1 flex flex-col lg:items-end">
             <h4 className="font-serif text-sm font-bold text-navy-900 mb-5 text-left lg:text-right w-full">Secure Payments</h4>
             <div className="flex items-center gap-2 flex-wrap lg:justify-end">
               <div className="w-10 h-7 bg-white border border-surface-200 rounded flex items-center justify-center overflow-hidden">
                 <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 w-auto object-contain" />
               </div>
               <div className="w-10 h-7 bg-white border border-surface-200 rounded flex items-center justify-center overflow-hidden">
                 <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" />
               </div>
               <div className="w-10 h-7 bg-white border border-surface-200 rounded flex items-center justify-center overflow-hidden">
                 <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-5 w-auto object-contain" />
               </div>
               <div className="w-10 h-7 bg-white border border-surface-200 rounded flex items-center justify-center overflow-hidden">
                 <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" className="h-5 w-auto object-contain" />
               </div>
             </div>
          </div>

        </div>

        {/* Bottom text */}
        <div className="border-t border-surface-200 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-text-400">
          <p>© {new Date().getFullYear()} Kandyam. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-navy-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-navy-900 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-navy-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
