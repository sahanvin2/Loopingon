"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ThumbsUp,
  Flag,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Review } from "@/types";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

function ratingBreakdown(reviews: Review[]) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[5 - r.rating]++;
  });
  return counts.map((count, i) => ({
    stars: 5 - i,
    count,
    percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
  }));
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-6 border-b border-blush-200 last:border-b-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted-200 flex items-center justify-center text-charcoal-600 font-medium text-sm">
            {review.customer?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-charcoal-700 font-medium text-sm">
              {review.customer?.fullName || "Anonymous"}
            </p>
            <p className="text-xs text-muted-500">
              {formatRelativeTime(review.createdAt)}
            </p>
          </div>
        </div>
        {review.isVerified && (
          <span className="text-xs text-muted-600 font-medium bg-muted-50 px-2 py-0.5 rounded-full">
            Verified Purchase
          </span>
        )}
      </div>

      <RatingStars rating={review.rating} size="sm" />

      {review.title && (
        <h4 className="font-medium text-charcoal-900 mt-2">{review.title}</h4>
      )}
      {review.content && (
        <p className="text-muted-600 mt-1 text-sm leading-relaxed">
          {review.content}
        </p>
      )}

      {review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-md bg-muted-100 overflow-hidden"
            >
              <img
                src={img}
                alt={`Review image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-muted-500 hover:text-charcoal-700 transition-colors"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({review.helpfulCount})
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-muted-500 hover:text-charcoal-700 transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>

      {review.vendorReply && (
        <div className="mt-3 ml-6 p-4 bg-cream-50 rounded-lg border border-blush-200">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-muted-600" />
            <span className="text-xs font-medium text-muted-600">
              Vendor Response
            </span>
          </div>
          <p className="text-sm text-muted-600">{review.vendorReply}</p>
        </div>
      )}
    </div>
  );
}

export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("recent");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const breakdown = ratingBreakdown(reviews);

  return (
    <section id="reviews" className="py-8">
      <h2 className="font-serif text-2xl text-charcoal-900 mb-8">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <EmptyState
          title="No Reviews Yet"
          description="Be the first to review this product and help other shoppers."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-charcoal-900">
                {averageRating.toFixed(1)}
              </span>
              <div>
                <RatingStars rating={averageRating} size="md" />
                <p className="text-sm text-muted-500 mt-1">
                  {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {breakdown.map((bar) => (
                <div key={bar.stars} className="flex items-center gap-2">
                  <span className="text-xs text-muted-600 w-8">
                    {bar.stars} <Star className="w-3 h-3 inline fill-blush-500 text-blush-500" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-muted-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-blush-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-muted-500 w-6 text-right">
                    {bar.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={cn(
                    "text-sm border border-blush-300 rounded-lg px-3 py-1.5 bg-white",
                    "text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-rose-500",
                  )}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            <div>
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
