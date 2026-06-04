"use client";

import React from "react";
import { MapPin, Truck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingMapProps {
  trackingNumber?: string;
  trackingUrl?: string;
  courierName?: string;
  className?: string;
}

export function TrackingMap({
  trackingNumber,
  trackingUrl,
  courierName,
  className,
}: TrackingMapProps) {
  return (
    <div className={cn("", className)}>
      <div
        className={cn(
          "relative rounded-lg overflow-hidden bg-surface-50 border border-accent-200",
          "flex flex-col items-center justify-center",
          "min-h-[280px]",
        )}
      >
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <pattern id="map-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#c86482" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#map-dots)" />
          </svg>
        </div>

        {!trackingNumber ? (
          <div className="relative text-center px-6 py-12">
            <div className="w-16 h-16 rounded-full bg-muted-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-muted-400" />
            </div>
            <h4 className="font-serif text-lg text-text-900 mb-2">
              Tracking Coming Soon
            </h4>
            <p className="text-sm text-muted-500 max-w-xs mx-auto">
              Tracking information will be available once your order has been
              shipped. You&apos;ll receive a notification with the tracking details.
            </p>
          </div>
        ) : (
          <div className="relative text-center px-6 py-12">
            <div className="w-16 h-16 rounded-full bg-muted-100 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 text-muted-600" />
            </div>
            <p className="text-sm text-muted-500 mb-1">Via {courierName || "Courier"}</p>
            <h4 className="font-mono text-lg text-text-900 font-bold tracking-wider mb-1">
              {trackingNumber}
            </h4>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  "text-primary-600 hover:text-primary-700 transition-colors",
                  "mt-3",
                )}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Track on Courier Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
