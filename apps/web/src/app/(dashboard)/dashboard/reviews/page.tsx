"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import { reviewSchema, type ReviewInput } from "@/lib/validators";
import type { Review, ApiResponse, PaginatedResponse } from "@/types";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"submitted" | "pending">("submitted");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [pendingProduct, setPendingProduct] = useState<{ id: string; title: string; image: string | null } | null>(null);

  const { data: submittedData, isLoading: submittedLoading } = useQuery({
    queryKey: ["reviews", "submitted"],
    queryFn: () => get<ApiResponse<Review[]>>("/users/reviews"),
    enabled: activeTab === "submitted",
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["reviews", "pending"],
    queryFn: () => get<ApiResponse<{ id: string; title: string; image: string | null; orderId: string }[]>>("/users/reviews/pending"),
    enabled: activeTab === "pending",
  });

  const submitReviewMutation = useMutation({
    mutationFn: (input: ReviewInput & { productId: string; orderId: string }) =>
      post("/users/reviews", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setShowReviewModal(false);
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReviewInput }) =>
      patch(`/users/reviews/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setEditingReview(null);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => del(`/users/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const rating = watch("rating");

  const onSubmitReview = (input: ReviewInput) => {
    if (editingReview) {
      updateReviewMutation.mutate({ id: editingReview.id, input });
    } else if (pendingProduct) {
      submitReviewMutation.mutate({
        ...input,
        productId: pendingProduct.id,
        orderId: "",
      });
    }
  };

  const isLoading = activeTab === "submitted" ? submittedLoading : pendingLoading;
  const submitted = submittedData?.data || [];
  const pending = pendingData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-text-900">My Reviews</h1>

      <div className="flex gap-1 bg-white rounded-lg border border-accent-200 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("submitted")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "submitted"
              ? "bg-primary-600 text-white"
              : "text-muted-600 hover:text-text-700",
          )}
        >
          Submitted Reviews ({submitted.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "pending"
              ? "bg-primary-600 text-white"
              : "text-muted-600 hover:text-text-700",
          )}
        >
          Pending Reviews ({pending.length})
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={4} />
      ) : activeTab === "pending" ? (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <EmptyState
              title="No pending reviews"
              description="You've reviewed all your eligible purchases!"
            />
          ) : (
            pending.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg border border-accent-200 p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-md border border-accent-200 overflow-hidden bg-surface-50 flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-900 truncate">
                    {p.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPendingProduct(p);
                    setShowReviewModal(true);
                    reset({ rating: 5 });
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Write Review
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {submitted.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Your reviews help other craft lovers discover great products!"
            />
          ) : (
            submitted.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg border border-accent-200 p-5"
              >
                <div className="flex items-start gap-4">
                  {review.product && (
                    <div className="w-16 h-16 rounded-md border border-accent-200 overflow-hidden bg-surface-50 flex-shrink-0">
                      {review.product.images?.[0]?.url ? (
                        <img
                          src={review.product.images[0].url}
                          alt={review.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-50" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.title && (
                      <h3 className="font-semibold text-text-900">
                        {review.title}
                      </h3>
                    )}
                    {review.content && (
                      <p className="text-sm text-text-700 mt-1">
                        {review.content}
                      </p>
                    )}
                    {review.vendorReply && (
                      <div className="mt-3 p-3 bg-surface-50 rounded-lg text-sm text-muted-600">
                        <span className="font-medium text-text-700">
                          Vendor reply:
                        </span>{" "}
                        {review.vendorReply}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReview(review);
                          reset({
                            rating: review.rating,
                            title: review.title || undefined,
                            content: review.content || undefined,
                          });
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-muted-600 hover:text-primary-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Delete this review?")) {
                            deleteReviewMutation.mutate(review.id);
                          }
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-muted-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {(showReviewModal || editingReview) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-text-900/50"
              onClick={() => {
                setShowReviewModal(false);
                setEditingReview(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            >
              <h2 className="text-lg font-semibold text-text-900 mb-4">
                {editingReview ? "Edit Review" : "Write a Review"}
              </h2>
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star, { shouldValidate: true })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= (rating || 0)
                            ? "fill-accent-400 text-accent-400"
                            : "text-surface-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-xs text-red-600">{errors.rating.message}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Title (optional)
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Summary of your review"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    {...register("content")}
                    rows={4}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Share your experience with this product..."
                  />
                  {errors.content && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setEditingReview(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : editingReview ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
