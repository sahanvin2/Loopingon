"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MessageSquare } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import type { Review, PaginatedResponse } from "@/types";

export default function VendorReviewsPage() {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "reviews"],
    queryFn: () =>
      get<PaginatedResponse<Review>>("/vendor/reviews", { limit: 50 }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      post(`/vendor/reviews/${reviewId}/reply`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "reviews"] });
      setReplyingTo(null);
      setReplyText("");
    },
  });

  const reviews = data?.data || [];
  const pendingReplies = reviews.filter((r) => !r.vendorReply).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-text-900">Reviews</h1>
        {pendingReplies > 0 && (
          <Badge variant="rose">{pendingReplies} pending replies</Badge>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<Star className="w-12 h-12" />}
          title="No reviews yet"
          description="Customer reviews will appear here once they start reviewing your products."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-accent-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-xs text-muted-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-text-700">
                    <span className="font-medium">
                      {review.customer?.fullName || "Customer"}
                    </span>
                    {review.product && (
                      <span className="text-muted-500">
                        {" "}
                        - {review.product.title}
                      </span>
                    )}
                  </p>
                </div>
                {!review.vendorReply && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(review.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply
                  </button>
                )}
              </div>

              {review.content && (
                <p className="text-sm text-text-700 mb-3">
                  {review.content}
                </p>
              )}

              {review.vendorReply && (
                <div className="p-3 bg-surface-50 rounded-lg text-sm text-muted-600">
                  <span className="font-medium text-text-700">
                    Your reply:
                  </span>{" "}
                  {review.vendorReply}
                </div>
              )}

              {replyingTo === review.id && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="Write your reply..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-surface-50 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        replyMutation.mutate({
                          reviewId: review.id,
                          content: replyText,
                        })
                      }
                      disabled={!replyText.trim() || replyMutation.isPending}
                      className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      {replyMutation.isPending ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
