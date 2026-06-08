import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "You're Offline",
  description: "It looks like you're offline. Check back when you have internet access.",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy-900 mb-3">You&apos;re Offline</h1>
        <p className="text-text-600 mb-8 leading-relaxed">
          It looks like you don&apos;t have an internet connection right now. Don&apos;t worry — your cart is
          saved, and you can browse previously viewed items offline.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            Try Again
          </button>
          <p className="text-xs text-muted-500">
            or{" "}
            <Link href="/" className="text-primary-600 underline">
              go back home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
