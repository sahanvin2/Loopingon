"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsEvent {
  type: string;
  timestamp: string;
  path: string;
  data?: Record<string, unknown>;
}

const STORAGE_KEY = "kandyam:analytics";
const SESSION_KEY = "kandyam:session";
const MAX_EVENTS = 100;
const SYNC_INTERVAL = 30000;

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getConsent(): boolean {
  try {
    const stored = localStorage.getItem("kandyam:cookie-consent");
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed?.preferences?.analytics === true;
  } catch {
    return false;
  }
}

export function usePageView() {
  const pathname = usePathname();
  const hasConsent = useRef(getConsent());

  useEffect(() => {
    if (!hasConsent.current) return;

    trackEvent("page_view", { title: document.title, referrer: document.referrer });
  }, [pathname]);
}

let eventQueue: AnalyticsEvent[] = [];
let syncTimer: ReturnType<typeof setTimeout> | null = null;

function trackEvent(type: string, data?: Record<string, unknown>) {
  if (!getConsent()) return;

  const event: AnalyticsEvent = {
    type,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    data,
  };

  eventQueue.push(event);

  const sessionId = getSessionId();

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    stored[sessionId] = stored[sessionId] || [];
    stored[sessionId].push(event);
    if (stored[sessionId].length > MAX_EVENTS) {
      stored[sessionId] = stored[sessionId].slice(-MAX_EVENTS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}

  if (eventQueue.length >= 10) {
    flushEvents();
  } else if (!syncTimer) {
    syncTimer = setTimeout(flushEvents, SYNC_INTERVAL);
  }
}

function flushEvents() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    fetch(`${apiUrl}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events, sessionId: getSessionId() }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function trackProductView(productId: string, productTitle: string, vendorId?: string) {
  trackEvent("product_view", { productId, title: productTitle, vendorId });
}

export function trackAddToCart(productId: string, productTitle: string, price: string, quantity?: number) {
  trackEvent("add_to_cart", { productId, title: productTitle, price, quantity: quantity || 1 });
}

export function trackRemoveFromCart(productId: string) {
  trackEvent("remove_from_cart", { productId });
}

export function trackSearch(query: string, resultsCount?: number) {
  trackEvent("search", { query, results: resultsCount });
}

export function trackCheckoutStep(step: string, data?: Record<string, unknown>) {
  trackEvent("checkout_step", { step, ...data });
}

export function trackPurchase(orderId: string, total: number, items: number) {
  trackEvent("purchase", { orderId, total, items });
}

export function trackSignup(method: string) {
  trackEvent("signup", { method });
}

export function trackSignin(method: string) {
  trackEvent("signin", { method });
}

export function trackWishlistAdd(productId: string, productTitle: string) {
  trackEvent("wishlist_add", { productId, title: productTitle });
}

export function trackShare(platform: string, link: string) {
  trackEvent("share", { platform, link });
}

export function useClickTracker(elementId: string, action: string) {
  return useCallback(
    (data?: Record<string, unknown>) => {
      trackEvent("click", { element: elementId, action, ...data });
    },
    [elementId, action],
  );
}

export { flushEvents, trackEvent };
