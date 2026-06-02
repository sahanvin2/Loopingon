"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import type { ProductImage, ProductVideo } from "@/types";

interface ProductImagesProps {
  images: ProductImage[];
  videos?: ProductVideo[];
}

export function ProductImages({ images, videos = [] }: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const activeImage = images[activeIndex];
  const hasVideos = videos.length > 0;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted-100 cursor-zoom-in"
        onClick={() => openLightbox(activeIndex)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") openLightbox(activeIndex);
        }}
        aria-label="Open image lightbox"
      >
        <Image
          src={getImageUrl(activeImage?.large || activeImage?.url)}
          alt={activeImage?.alt || "Product image"}
          fill
          className="object-cover"
          sizes="60vw"
          priority
        />

        {hasVideos && (
          <div className="absolute bottom-4 left-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                "bg-charcoal-900/60 backdrop-blur-sm text-white text-xs font-medium",
              )}
            >
              <Play className="w-3 h-3 fill-current" />
              {videos.length} video{videos.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors",
                index === activeIndex
                  ? "border-rose-500"
                  : "border-transparent hover:border-muted-300",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={getImageUrl(image.thumbnail || image.url)}
                alt={image.alt || `Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}

          {videos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 border-transparent",
                "hover:border-muted-300",
              )}
              aria-label={`Watch video ${index + 1}`}
            >
              <Image
                src={getImageUrl(video.thumbnailUrl)}
                alt={`Video ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              <div className="absolute inset-0 bg-charcoal-900/30 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal-900/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-charcoal-800 text-white hover:bg-charcoal-700 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxPrev();
              }}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg",
                "bg-charcoal-800 text-white hover:bg-charcoal-700 transition-colors z-10",
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxNext();
              }}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg",
                "bg-charcoal-800 text-white hover:bg-charcoal-700 transition-colors z-10",
              )}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-[4/5] max-h-[85vh]"
            >
              <Image
                src={getImageUrl(images[lightboxIndex]?.large || images[lightboxIndex]?.url)}
                alt={images[lightboxIndex]?.alt || "Product image"}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(index);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-md overflow-hidden border-2 transition-colors",
                    index === lightboxIndex
                      ? "border-rose-500"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={getImageUrl(image.thumbnail || image.url)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
