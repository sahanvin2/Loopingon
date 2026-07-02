"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

interface InteractionPayload {
  productId: string;
  type: "VIEW" | "ADD_TO_CART" | "REMOVE_FROM_CART" | "PURCHASE" | "WISHLIST";
  metadata?: Record<string, any>;
}

interface SearchPayload {
  query: string;
  resultsCount: number;
}

const COOKIE_NAME = "kandyam_tracking_session";
const COOKIE_EXPIRY_DAYS = 365; // 1 year

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const maxScrollDepth = useRef(0);
  const startTime = useRef(Date.now());
  
  // Interactions queue
  const interactions = useRef<InteractionPayload[]>([]);
  const searches = useRef<SearchPayload[]>([]);

  const getCookieId = () => {
    let cookieId = Cookies.get(COOKIE_NAME);
    if (!cookieId) {
      cookieId = uuidv4();
      Cookies.set(COOKIE_NAME, cookieId, { expires: COOKIE_EXPIRY_DAYS });
    }
    return cookieId;
  };

  const trackInteraction = (payload: InteractionPayload) => {
    interactions.current.push(payload);
  };

  const trackSearch = (payload: SearchPayload) => {
    searches.current.push(payload);
  };

  useEffect(() => {
    // Reset metrics on page change
    maxScrollDepth.current = 0;
    startTime.current = Date.now();
    const currentPath = pathname;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPos = window.scrollY;
      const currentScrollPercent = Math.min(100, Math.round(((scrollPos + windowHeight) / docHeight) * 100));
      
      if (currentScrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = currentScrollPercent;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Send payload when leaving the page (beforeunload) or when path changes
    const sendTelemetry = () => {
      const durationSeconds = Math.round((Date.now() - startTime.current) / 1000);
      
      const payload = {
        cookieId: getCookieId(),
        path: currentPath,
        title: document.title,
        referrer: document.referrer || undefined,
        durationSeconds,
        maxScrollDepth: maxScrollDepth.current,
        interactions: interactions.current,
        searchQueries: searches.current
      };

      // Use navigator.sendBeacon if possible so it works when tab closes
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/analytics/track`, blob);
      
      // Clear queues
      interactions.current = [];
      searches.current = [];
    };

    window.addEventListener("beforeunload", sendTelemetry);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", sendTelemetry);
      sendTelemetry(); // Trigger on route change unmount
    };
  }, [pathname, searchParams]);

  return { getCookieId, trackInteraction, trackSearch };
}
