import type { Metadata, Viewport } from "next";
import { Lora, Outfit } from "next/font/google";
import { Providers } from "@/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthModal } from "@/components/shared/auth-modal";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { PwaProvider } from "@/components/shared/pwa-provider";
import { PageTracker } from "@/components/shared/page-tracker";
import "@/styles/globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfaf5" },
    { media: "(prefers-color-scheme: dark)", color: "#1e191c" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Kandyam - A global marketplace for unique, creative and one-of-a-kind items",
    template: "%s | Kandyam",
  },
  description:
    "A global marketplace for unique, creative and one-of-a-kind items from independent sellers around the world. Shop digital assets, software, templates, gift cards, and more.",
  keywords: [
    "global marketplace",
    "digital products",
    "software",
    "game keys",
    "gift cards",
    "templates",
    "digital assets",
    "creative assets",
    "subscriptions",
    "AI prompts",
    "e-books",
    "online courses",
    "digital services",
    "independent creators",
    "kandyam",
  ],
  authors: [{ name: "Kandyam", url: "https://kandyam.com" }],
  creator: "Kandyam",
  publisher: "Kandyam",
  metadataBase: new URL("https://kandyam.com"),
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
    locale: "en_US",
    siteName: "Kandyam",
    title: "Kandyam - A global marketplace for unique, creative and one-of-a-kind items",
    description:
      "A global marketplace for unique, creative and one-of-a-kind items from independent sellers around the world.",
    url: "https://kandyam.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kandyam - Digital Marketplace",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kandyam - A global marketplace for unique, creative and one-of-a-kind items",
    description:
      "A global marketplace for unique, creative and one-of-a-kind items from independent sellers around the world.",
    images: ["/og-image.jpg"],
    creator: "@kandyam",
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
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Kandyam",
    statusBarStyle: "default",
  },
  applicationName: "Kandyam",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface-50 font-sans text-text-900 antialiased">
        <Providers>
          <PwaProvider />
          <PageTracker />
          <div className="relative flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-soft-lg focus:outline-none"
            >
              Skip to main content
            </a>

            {/* Header */}
            <Header />

            {/* Mobile Navigation Drawer */}
            <MobileNav />

            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>

          {/* Auth Modal */}
          <AuthModal />
          <CookieConsent />

        </Providers>
      </body>
    </html>
  );
}
