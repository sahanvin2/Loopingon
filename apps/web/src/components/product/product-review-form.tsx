"use client";

import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductReviewFormProps {
  productId: string;
}

export function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useUIStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const submitReview = useMutation({
    mutationFn: async () => {
      return post(`/reviews/${productId}`, {
        rating,
        content,
      });
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setRating(0);
      setContent("");
      setIsExpanded(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openModal("signin");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    submitReview.mutate();
  };

  return (
    <div className="bg-white border-2 border-surface-200 rounded-3xl p-8 mb-10 shadow-soft-sm">
      <h3 className="font-serif text-2xl text-text-900 mb-2">Write a Review</h3>
      <p className="text-base text-muted-600 mb-6">Share your thoughts with the community and help others make great choices.</p>
      
      {!isExpanded && (
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openModal("signin");
            } else {
              setIsExpanded(true);
            }
          }}
          className="px-8 py-3.5 bg-navy-900 text-white rounded-full font-medium text-sm hover:scale-105 transition-transform shadow-md"
        >
          {isAuthenticated ? "Write a Review" : "Sign in to Review"}
        </button>
      )}

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
            <label className="block text-base font-semibold text-text-800 mb-3 text-center">Tap to Rate</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-10 h-10 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-primary-500 text-primary-500 drop-shadow-sm"
                        : "fill-transparent text-muted-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-medium text-primary-600 mt-3">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good!" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-text-800 mb-2">Your Review</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              rows={5}
              className="w-full px-5 py-4 rounded-2xl border-2 border-surface-200 focus:outline-none focus:border-primary-500 bg-white resize-none text-base transition-colors"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-surface-200">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-6 py-3 rounded-full text-text-700 text-sm font-medium hover:bg-surface-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitReview.isPending || rating === 0}
              className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {submitReview.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
