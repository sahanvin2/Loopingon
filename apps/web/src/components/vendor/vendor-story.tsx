"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VendorStoryProps {
  story: string;
  image?: string;
  videoUrl?: string;
  className?: string;
}

export function VendorStory({ story, image, videoUrl, className }: VendorStoryProps) {
  return (
    <section className={cn("py-8", className)}>
      <h2 className="font-serif text-2xl text-text-900 mb-6">Our Story</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div
            className="prose prose-sm max-w-none text-muted-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story }}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          {image && (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted-100">
              <Image
                src={image}
                alt="Artisan workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          )}

          {videoUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-text-900">
              <iframe
                src={videoUrl}
                title="Artisan story video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
