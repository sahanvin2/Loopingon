"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LifeBuoy,
  Search,
  Package,
  DollarSign,
  Truck,
  RotateCcw,
  UserCog,
  Store,
  ChevronRight,
  Plus,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import { supportTicketSchema, type SupportTicketInput } from "@/lib/validators";
import { FileUpload } from "@/components/forms/file-upload";
import type { SupportTicket, ApiResponse, PaginatedResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";

const commonTopics = [
  { label: "Order Issues", icon: Package },
  { label: "Payment & Refunds", icon: DollarSign },
  { label: "Shipping & Delivery", icon: Truck },
  { label: "Returns & Exchanges", icon: RotateCcw },
  { label: "Account & Settings", icon: UserCog },
  { label: "Vendor & Product Qs", icon: Store },
];

export default function SupportPage() {
  const queryClient = useQueryClient();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () =>
      get<ApiResponse<SupportTicket[]>>("/support/tickets", { limit: 10 }),
  });

  const createTicketMutation = useMutation({
    mutationFn: (data: SupportTicketInput) =>
      post("/support/tickets", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setShowTicketModal(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportTicketInput>({
    resolver: zodResolver(supportTicketSchema),
  });

  const tickets = ticketsData?.data || [];

  const onSubmitTicket = (data: SupportTicketInput) => {
    createTicketMutation.mutate(data);
    reset();
  };

  const openChatWithAI = () => {
    // Opens chatbot widget
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-900">
          Support Center
        </h1>
        <p className="text-muted-600 mt-2">
          How can we help you today?
        </p>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles and FAQs..."
            className="w-full pl-12 pr-4 py-3 border border-accent-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {commonTopics.map((topic) => (
          <div
            key={topic.label}
            className="bg-white rounded-lg border border-accent-200 p-5 text-center hover:shadow-soft transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
              <topic.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-text-900">
              {topic.label}
            </h3>
            <button
              type="button"
              className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Articles
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={openChatWithAI}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-muted-500 to-muted-600 text-white rounded-xl hover:from-muted-600 hover:to-muted-700 transition-all"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="font-semibold">Chat with AI Assistant</span>
          <span className="text-xs text-muted-100">Get instant answers</span>
        </button>

        <button
          type="button"
          onClick={() => setShowTicketModal(true)}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          <Plus className="w-8 h-8" />
          <span className="font-semibold">Create New Ticket</span>
          <span className="text-xs text-primary-100">
            Our team will help
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          My Recent Tickets
        </h2>
        {isLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No support tickets"
            description="You haven't created any support tickets yet."
          />
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-900">
                      {ticket.subject}
                    </span>
                    <Badge
                      variant={
                        ticket.status === "RESOLVED"
                          ? "muted"
                          : ticket.status === "OPEN"
                            ? "amber"
                            : "gray"
                      }
                      size="sm"
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-500">
                    {ticket.ticketNumber} - {formatDate(ticket.createdAt)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-text-900/50"
              onClick={() => setShowTicketModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="text-lg font-semibold text-text-900 mb-4">
                Create New Ticket
              </h2>
              <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Subject *
                  </label>
                  <input
                    {...register("subject")}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief summary of your issue"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Category *
                  </label>
                  <CustomSelect
                    {...register("category")}
                    options={[
                      { value: "order", label: "Order" },
                      { value: "payment", label: "Payment" },
                      { value: "product", label: "Product" },
                      { value: "shipping", label: "Shipping" },
                      { value: "account", label: "Account" },
                      { value: "vendor", label: "Vendor" },
                      { value: "technical", label: "Technical" },
                      { value: "other", label: "Other" },
                    ]}
                    placeholder="Select a category"
                    className="border-accent-200 focus:ring-2 focus:ring-primary-500 py-2 px-3"
                  />
                  {errors.category && (
                    <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your issue in detail..."
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Related Order ID (optional)
                  </label>
                  <input
                    {...register("orderId")}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., LOOP-..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Attachments
                  </label>
                  <FileUpload maxFiles={3} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
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
