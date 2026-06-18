"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kandyam:cookie-consent";
const CONSENT_EXPIRY_DAYS = 365;

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.expiry && new Date(parsed.expiry) > new Date()) {
        setDismissed(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = useCallback((prefs: CookiePreferences) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + CONSENT_EXPIRY_DAYS);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ preferences: prefs, expiry: expiry.toISOString(), timestamp: Date.now() }),
    );

    if (prefs.analytics) {
      window.dispatchEvent(new CustomEvent("kandyam:cookies-accepted", { detail: prefs }));
    }

    setVisible(false);
    setDismissed(true);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleAcceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(essentialOnly);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-text-900/40 backdrop-blur-sm"
              onClick={() => setShowPreferences(false)}
            />
          )}

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70]",
              "bg-white border-t border-accent-200",
              "shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]",
              showPreferences ? "rounded-t-3xl" : "rounded-t-2xl",
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
              {!showPreferences ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Cookie className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-900 text-sm mb-1">
                        We value your privacy
                      </h3>
                      <p className="text-xs text-text-600 leading-relaxed max-w-2xl">
                        We use cookies to enhance your browsing experience, analyze site traffic, and
                        personalize content. By clicking &quot;Accept All&quot;, you consent to our use of
                        cookies. You can customize your preferences or read our{" "}
                        <a
                          href="/cookie-policy"
                          className="text-primary-600 underline hover:text-primary-700"
                        >
                          Cookie Policy
                        </a>
                        {" "}for more information.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2.5 text-xs font-medium text-text-600 hover:text-text-900 hover:bg-surface-100 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptEssential}
                      className="px-4 py-2.5 text-xs font-medium text-text-700 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Essential Only
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-900 text-sm">Cookie Preferences</h3>
                        <p className="text-xs text-text-500">
                          Choose which cookies you allow
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreferences(false)}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-accent-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="mt-0.5 h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-900">Essential Cookies</p>
                        <p className="text-xs text-text-500 mt-0.5">
                          Required for the site to function. Include authentication, cart, and security.
                        </p>
                      </div>
                      <span className="text-xs text-muted-400 bg-accent-100 px-2 py-0.5 rounded-full">
                        Always On
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-accent-100 cursor-pointer hover:border-accent-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => togglePreference("functional")}
                        className="mt-0.5 h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-900">Functional Cookies</p>
                        <p className="text-xs text-text-500 mt-0.5">
                          Remember your preferences like language, currency, and saved items.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-accent-100 cursor-pointer hover:border-accent-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => togglePreference("analytics")}
                        className="mt-0.5 h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-900">Analytics Cookies</p>
                        <p className="text-xs text-text-500 mt-0.5">
                          Help us understand how you use the site so we can improve your shopping experience.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-accent-100 cursor-pointer hover:border-accent-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => togglePreference("marketing")}
                        className="mt-0.5 h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-900">Marketing Cookies</p>
                        <p className="text-xs text-text-500 mt-0.5">
                          Used to show you relevant product recommendations and seller promotions you might
                          like.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleAcceptEssential}
                      className="px-4 py-2.5 text-xs font-medium text-text-600 hover:text-text-900 rounded-xl transition-colors"
                    >
                      Essential Only
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptSelected}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
