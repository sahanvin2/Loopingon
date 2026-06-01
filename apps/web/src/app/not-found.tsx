import Link from "next/link";
import { Home, Search, ShoppingBag, HelpCircle } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="relative mx-auto mb-10 h-48 w-48">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="95" fill="#FDF3D3" />
            <path
              d="M60 80 L70 70 L75 60 L85 70 L90 80 L80 90 L65 95 Z"
              fill="#C75B39"
              opacity="0.8"
            />
            <path
              d="M65 95 C65 110 80 120 100 120 C120 120 135 110 135 95"
              stroke="#C75B39"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M80 120 L85 140 L115 140 L120 120"
              stroke="#C75B39"
              strokeWidth="2.5"
              fill="#FBE6DE"
            />
            <path
              d="M75 100 L80 140"
              stroke="#C75B39"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M125 100 L120 140"
              stroke="#C75B39"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M60 60 C50 50 60 40 70 45"
              stroke="#D4A843"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M130 55 C140 45 150 50 145 60"
              stroke="#D4A843"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M50 80 C40 85 35 100 45 110"
              stroke="#D4A843"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M150 80 C160 85 165 100 155 110"
              stroke="#D4A843"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <text x="100" y="175" textAnchor="middle" fill="#D4A843" fontSize="12" fontFamily="serif">
              Kintsugi
            </text>
          </svg>
        </div>

        <h1 className="mb-3 font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">
          Page Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-md text-warm-gray-600">
          Like a piece of pottery that has slipped from our hands, this page
          seems to have shattered into pieces. But just as kintsugi mends broken
          pottery with gold, let us guide you to something beautiful.
        </p>

        <div className="mx-auto mb-10 max-w-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-gray-400" />
            <input
              type="text"
              placeholder="Search for handmade crafts..."
              className="w-full rounded-lg border border-charcoal-200 bg-white py-3 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-warm-gray-400 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value.trim();
                  if (query) {
                    window.location.href = `/shop?query=${encodeURIComponent(query)}`;
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 font-serif text-lg font-semibold text-charcoal-800">
            Popular Destinations
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "All Products", href: "/shop" },
              { label: "New Arrivals", href: "/shop?sort=newest" },
              { label: "Best Sellers", href: "/shop?sort=bestsellers" },
              { label: "Clay & Pottery", href: "/categories/clay-pottery" },
              { label: "Wood Carving", href: "/categories/wood-carving" },
              { label: "Textiles & Batik", href: "/categories/textiles-batik" },
              { label: "Jewelry", href: "/categories/jewelry" },
              { label: "Artisans", href: "/artisans" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-white px-4 py-2 text-sm text-warm-gray-600 shadow-soft-sm transition-all hover:bg-terracotta-50 hover:text-terracotta-700 hover:shadow-soft"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-terracotta-600 px-6 py-3 text-sm font-medium text-white shadow-soft transition-all hover:bg-terracotta-700 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go Back Home
          </Link>

          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gold-400 bg-gold-50 px-6 py-3 text-sm font-medium text-gold-700 transition-all hover:bg-gold-100 sm:w-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Shop
          </Link>

          <Link
            href="/help"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-warm-gray-600 transition-all hover:text-charcoal-800 sm:w-auto"
          >
            <HelpCircle className="h-4 w-4" />
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
