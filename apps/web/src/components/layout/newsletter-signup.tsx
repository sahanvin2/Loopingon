"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  variant?: "embedded" | "popup" | "footer";
  className?: string;
}

export function NewsletterSignup({
  variant = "embedded",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isVisible, setIsVisible] = useState(variant !== "popup");

  useEffect(() => {
    if (variant !== "popup") return;

    const dismissed = localStorage.getItem("newsletter-popup-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent >= 0.5) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const dismiss = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("newsletter-popup-dismissed", "true");
  }, []);

  if (!isVisible) return null;

  if (variant === "popup") {
    return (
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              aria-hidden="true"
            />
            <motion.div
              className={cn(
                "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]",
                "bg-white rounded-xl shadow-soft-lg border border-blush-200 p-6",
              )}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                type="button"
                onClick={dismiss}
                className="absolute top-3 right-3 p-1 rounded text-muted-500 hover:text-charcoal-700"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-serif text-lg text-charcoal-900 mb-1">
                  Stay Inspired
                </h3>
                <p className="text-sm text-muted-600">
                  Get 10% off your first order + exclusive artisan stories
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={cn(
                    "w-full px-5 py-3 rounded-full border border-blush-200 text-sm mb-3 shadow-inner-soft",
                    "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent",
                  )}
                  aria-label="Email address"
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={cn(
                    "w-full py-3 rounded-full text-sm font-medium text-white shadow-sm",
                    "bg-rose-500 hover:bg-rose-600 transition-colors",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </span>
                  ) : status === "success" ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Welcome! Check your email for 10% off
                    </span>
                  ) : (
                    "Subscribe & Save 10%"
                  )}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="mt-3 text-xs text-muted-400 text-center">
                No spam, unsubscribe anytime.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={cn(className)}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-rose-600" />
        </div>
        <h3 className="font-serif text-2xl text-charcoal-900 mb-2">
          Stay Inspired
        </h3>
        <p className="text-sm text-muted-600 max-w-md mx-auto">
          Join our community and receive artisan stories, new arrivals, and exclusive offers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={cn(
            "flex-1 px-5 py-3 rounded-full border border-blush-200 text-sm shadow-inner-soft",
            "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent",
          )}
          aria-label="Email address"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={cn(
            "px-8 py-3 rounded-full text-sm font-medium text-white shadow-sm",
            "bg-rose-500 hover:bg-rose-600 transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === "success" ? (
            "Welcome!"
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-3 text-sm text-muted-600 text-center font-medium">
          Welcome! Check your email for 10% off your first order.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600 text-center flex items-center gap-1 justify-center">
          <AlertCircle className="w-3.5 h-3.5" />
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
