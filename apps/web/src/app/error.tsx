"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MessageCircle, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-100">
          <AlertTriangle className="h-12 w-12 text-rose-600" />
        </div>

        <h1 className="mb-2 font-serif text-3xl font-bold text-charcoal-900">
          Something went wrong
        </h1>

        <p className="mb-6 text-muted-600">
          We encountered an unexpected error while preparing your page. Our team
          has been notified. Please try again or contact support if the problem
          persists.
        </p>

        {error.digest && (
          <div className="mx-auto mb-6 max-w-xs rounded-lg border border-charcoal-200 bg-charcoal-50 px-4 py-3">
            <p className="text-xs text-muted-500">
              Error reference:{" "}
              <code className="font-mono text-charcoal-700">
                {error.digest}
              </code>
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-soft transition-all hover:bg-rose-700 active:bg-rose-800 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-charcoal-200 px-6 py-3 text-sm font-medium text-charcoal-700 transition-all hover:bg-charcoal-50 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Link>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-muted-600 transition-all hover:text-charcoal-800 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        <div className="mt-10 text-xs text-muted-400">
          <p>If this issue persists, please reach out to us:</p>
          <a
            href="mailto:support@loopingon.com"
            className="text-rose-600 hover:underline"
          >
            support@loopingon.com
          </a>
          {" "}&middot;{" "}
          <span>+94 11 234 5678</span>
        </div>
      </div>
    </div>
  );
}
