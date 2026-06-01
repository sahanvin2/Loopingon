"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, del } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { ApiResponse } from "@/types";

interface SavedCard {
  id: string;
  cardType: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const queryClient = useQueryClient();
  const [showAddCard, setShowAddCard] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => get<ApiResponse<SavedCard[]>>("/users/payment-methods"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/users/payment-methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      setDeletingId(null);
    },
  });

  const cards = data?.data || [];

  const cardIcons: Record<string, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">
          Payment Methods
        </h1>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={2} />
      ) : isError ? (
        <EmptyState
          title="Error loading payment methods"
          description="Something went wrong. Please try again later."
        />
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg border border-cream-200 p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gradient-to-r from-charcoal-700 to-charcoal-900 flex items-center justify-center text-white text-xs font-bold">
                  {cardIcons[card.cardType?.toLowerCase()] || card.cardType}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal-900">
                    •••• {card.lastFour}
                  </p>
                  <p className="text-xs text-warm-gray-500">
                    Expires {String(card.expiryMonth).padStart(2, "0")}/
                    {card.expiryYear}
                  </p>
                </div>
                {card.isDefault && (
                  <Badge variant="teal" size="sm">
                    Default
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDeletingId(card.id)}
                className="p-2 rounded-md text-warm-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {cards.length === 0 && (
            <EmptyState
              icon={<CreditCard className="w-12 h-12" />}
              title="No saved cards"
              description="Add a payment method for faster checkout."
            />
          )}

          <button
            type="button"
            onClick={() => setShowAddCard(true)}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-cream-300 rounded-lg hover:border-terracotta-300 hover:bg-terracotta-50/30 transition-all"
          >
            <Plus className="w-5 h-5 text-warm-gray-500" />
            <span className="text-sm font-medium text-warm-gray-600">
              Add New Card
            </span>
          </button>

          <div className="p-4 bg-cream-50 rounded-lg">
            <p className="text-xs text-warm-gray-500 text-center">
              Cards are tokenized securely via PayHere. We never store your full
              card details.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={() => setShowAddCard(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
                Add New Card
              </h2>
              <p className="text-sm text-warm-gray-500 mb-6 text-center py-8">
                Card form will be rendered via PayHere embedded checkout.
                This is a placeholder for the PayHere card tokenization widget.
              </p>
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="w-full px-4 py-2.5 border border-cream-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={() => setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                Remove Card?
              </h3>
              <p className="text-sm text-warm-gray-600 mb-6">
                This card will be removed from your saved payment methods.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 border border-cream-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deletingId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Removing..." : "Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
