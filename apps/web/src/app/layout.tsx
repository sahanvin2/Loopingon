import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/providers";
import "@/styles/globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1E1E" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Loopingon - Sri Lanka's Handmade Craft Marketplace",
    template: "%s | Loopingon",
  },
  description:
    "Loopingon connects skilled Sri Lankan artisans with customers worldwide. " +
    "Discover unique handcrafted treasures made with traditional techniques and authentic materials.",
  keywords: [
    "Sri Lanka",
    "handmade crafts",
    "artisan marketplace",
    "handicrafts",
    "pottery",
    "wood carving",
    "batik",
    "textiles",
    "brass work",
    "jewelry",
    "traditional crafts",
    "fair trade",
    "ethical shopping",
    "Sri Lankan artisans",
    "loopingon",
  ],
  authors: [{ name: "Loopingon", url: "https://loopingon.com" }],
  creator: "Loopingon",
  publisher: "Loopingon",
  metadataBase: new URL("https://loopingon.com"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      si: "/si",
      ta: "/ta",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Loopingon",
    title: "Loopingon - Sri Lanka's Handmade Craft Marketplace",
    description:
      "Discover unique handcrafted treasures made by skilled Sri Lankan artisans. " +
      "Shop pottery, wood carving, textiles, jewelry, and more.",
    url: "https://loopingon.com",
    images: [
      {
        url: "https://cdn.loopingon.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Loopingon - Handmade Crafts from Sri Lanka",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loopingon - Sri Lanka's Handmade Craft Marketplace",
    description:
      "Discover unique handcrafted treasures made by skilled Sri Lankan artisans.",
    images: ["https://cdn.loopingon.com/og-image.jpg"],
    creator: "@loopingon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: undefined,
    yandex: undefined,
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Loopingon" />
        <meta name="application-name" content="Loopingon" />
      </head>
      <body className="min-h-screen bg-cream-100 font-sans text-charcoal-900 antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-terracotta-600 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-soft-lg focus:outline-none"
            >
              Skip to main content
            </a>

            {/* Header - loaded dynamically via layout group */}
            <header id="site-header" className="sticky top-0 z-40" />

            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Footer - loaded dynamically via layout group */}
            <footer id="site-footer" />
          </div>

          {/* Floating action buttons */}
          <div className="pointer-events-none fixed inset-0 z-50">
            <div className="pointer-events-auto absolute bottom-6 right-6 flex flex-col items-end gap-3">
              {/* AI Chatbot FAB */}
              <button
                aria-label="Open chat assistant"
                className="group flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-600 text-white shadow-terracotta transition-all duration-300 hover:scale-110 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h6" />
                </svg>
                <span className="sr-only">Open AI Chat Assistant</span>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-charcoal-900">
                  AI
                </span>
              </button>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
