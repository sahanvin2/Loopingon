"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, CheckCircle, Copy, Shield, AlertTriangle,
  Download, ChevronRight, Lock, Eye, EyeOff, Upload,
  Timer, RefreshCw, XCircle, FileText,
} from "lucide-react";
import {
  useP2POrder, useBankDetails, useSubmitPayment,
  useCompleteOrder, useDisputeOrder,
  P2P_STATUS_CONFIG, P2P_STEPS,
  type P2POrder,
  type P2POrderItem,
} from "@/hooks/use-p2p-orders";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPrice, formatDateTime, copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

function Btn({ children, className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "destructive"; size?: "sm" | "lg" | "md" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "text-xs px-3 py-1.5 gap-1" : size === "lg" ? "text-base px-8 py-4 gap-2" : "text-sm px-4 py-2.5 gap-1.5",
        variant === "outline" ? "border border-surface-300 text-text-700 hover:bg-surface-100 bg-surface-50" :
        variant === "ghost" ? "text-text-600 hover:bg-surface-100" :
        variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700" :
        "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-600/25",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface Props {
  orderId: string;
}

export function P2POrderPortal({ orderId }: Props) {
  const { data: orderData, isLoading, isError, refetch } = useP2POrder(orderId);
  const { data: bankData } = useBankDetails();
  const submitPayment = useSubmitPayment();
  const completeOrder = useCompleteOrder();
  const disputeOrder = useDisputeOrder();

  const [showPayload, setShowPayload] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  const order = orderData?.data;
  const bank = bankData?.data;
  const statusConfig = order ? P2P_STATUS_CONFIG[order.status] : null;

  const currentStepIndex = order ? P2P_STEPS.indexOf(
    order.status === "EXPIRED" || order.status === "CANCELLED" ? "PENDING_PAYMENT" :
    order.status === "DISPUTED" ? (order.orderEvents?.findLast((e: any) => e.toStatus !== "DISPUTED")?.toStatus as any || "PAYMENT_SUBMITTED") :
    order.status as any
  ) : 0;

  // Countdown timer
  const updateTimer = useCallback(() => {
    if (!order?.expiresAt) return;
    const expiry = new Date(order.expiresAt).getTime();
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) {
      setTimeLeft("Expired");
      setIsExpired(true);
      return;
    }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
  }, [order?.expiresAt]);

  useEffect(() => {
    if (!order?.expiresAt || order.status !== "PENDING_PAYMENT") return;
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.expiresAt, order?.status, updateTimer]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !order) return <EmptyState title="Order not found" description="The order could not be loaded." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 p-4"
    >
      {/* Header */}
      <div className="bg-surface-100 rounded-2xl p-6 shadow-soft-sm border border-surface-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-text-500">Order</p>
            <h1 className="text-xl font-bold text-text-900 font-sans">{order.orderNumber}</h1>
          </div>
          <span className={cn("px-3 py-1.5 rounded-full text-sm font-medium", statusConfig?.bg, statusConfig?.color)}>
            {statusConfig?.label}
          </span>
        </div>

        {/* Countdown Timer */}
        {order.status === "PENDING_PAYMENT" && order.expiresAt && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Clock className={cn("w-4 h-4", isExpired ? "text-red-500" : timeLeft.includes(":") && parseInt(timeLeft) < 5 ? "text-orange-500" : "text-text-500")} />
            <span className={cn(isExpired ? "text-red-500 font-bold" : "text-text-600")}>
              {isExpired ? "Expired" : `Time remaining: ${timeLeft}`}
            </span>
          </div>
        )}
      </div>

      {/* Status Stepper */}
      <div className="bg-surface-100 rounded-2xl p-6 shadow-soft-sm border border-surface-200">
        <h2 className="text-sm font-semibold text-text-700 mb-4 uppercase tracking-wide">Order Progress</h2>
        <div className="flex items-center justify-between">
          {P2P_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || (order.status === "COMPLETED" && idx === P2P_STEPS.length - 1);
            const isActive = idx === currentStepIndex && order.status !== "EXPIRED" && order.status !== "CANCELLED";
            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isCompleted ? "bg-primary-600 text-white" :
                    isActive ? "bg-primary-100 text-primary-600 ring-2 ring-primary-600" :
                    "bg-surface-200 text-text-400"
                  )}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  {idx < P2P_STEPS.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-1", isCompleted ? "bg-primary-600" : "bg-surface-200")} />
                  )}
                </div>
                <span className={cn("text-[10px] mt-1 text-center", isActive ? "text-primary-600 font-medium" : "text-text-500")}>
                  {step === "PENDING_PAYMENT" ? "Payment" :
                   step === "PAYMENT_SUBMITTED" ? "Submitted" :
                   step === "PAYMENT_CONFIRMED" ? "Confirmed" :
                   step === "DELIVERED" ? "Delivered" : "Completed"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Instructions - only during PENDING_PAYMENT */}
      {order.status === "PENDING_PAYMENT" && bank && (
        <div className="bg-accent-50 rounded-2xl p-6 shadow-soft-sm border border-accent-200">
          <h2 className="text-sm font-semibold text-text-700 mb-3 uppercase tracking-wide">Payment Instructions</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
            Pay the exact amount shown and include the reference code, or your payment may not be matched automatically.
          </div>

          <div className="space-y-3 mb-4">
            <CopyField label="Amount" value={`Rs. ${formatPrice(Number(order.totalAmount))}`} />
            <CopyField label="Bank" value={bank.bankName} />
            <CopyField label="Account Name" value={bank.accountName} />
            <CopyField label="Account Number" value={bank.accountNumber} />
            <CopyField label="Branch" value={bank.branch} />
            {order.referenceCode && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="text-xs text-text-500 mb-1">Reference Code (Include in transfer)</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600 font-mono">{order.referenceCode}</span>
                  <Btn variant="outline" size="sm" onClick={() => copyToClipboard(order.referenceCode!)}>
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Btn>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-text-400">{bank.instructions}</div>

          {/* Pay button */}
          <Btn
            className="w-full mt-4"
            size="lg"
            onClick={() => submitPayment.mutate({ orderId: order.id })}
            disabled={submitPayment.isPending || isExpired}
          >
            {submitPayment.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            I&apos;ve Paid
          </Btn>
        </div>
      )}

      {/* Waiting for confirmation message */}
      {order.status === "PAYMENT_SUBMITTED" && (
        <div className="bg-blue-50 rounded-2xl p-6 shadow-soft-sm border border-blue-200 text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
          <h3 className="font-semibold text-blue-700">Payment Submitted</h3>
          <p className="text-sm text-blue-600 mt-1">Waiting for seller to confirm your payment. This usually takes a few minutes.</p>
        </div>
      )}

      {/* Item Delivery Panel */}
      {order.status !== "DELIVERED" && order.status !== "COMPLETED" && order.status !== "DISPUTED" && (
        <div className="bg-surface-100 rounded-2xl p-6 shadow-soft-sm border border-surface-200">
          <h2 className="text-sm font-semibold text-text-700 mb-3 uppercase tracking-wide">Digital Item</h2>
          <div className="bg-surface-50 rounded-lg p-8 text-center border border-dashed border-surface-300">
            <Lock className="w-6 h-6 text-text-400 mx-auto mb-2" />
            <p className="text-sm text-text-500">Item will appear here once payment is confirmed</p>
          </div>
        </div>
      )}

      {/* Delivered Payload */}
      {(order.status === "DELIVERED" || order.status === "COMPLETED" || order.status === "DISPUTED") && order.deliveredPayload && (
        <div className="bg-green-50 rounded-2xl p-6 shadow-soft-sm border border-green-200">
          <h2 className="text-sm font-semibold text-text-700 mb-3 uppercase tracking-wide">Your Digital Item</h2>
          <div className="bg-surface-100 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap relative">
            {showPayload ? atob(order.deliveredPayload) : "••••••••••••••••••••••••••••••"}
            <div className="mt-3 flex gap-2">
              <Btn variant="outline" size="sm" onClick={() => setShowPayload(!showPayload)}>
                {showPayload ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {showPayload ? "Hide" : "Reveal"}
              </Btn>
              <Btn variant="outline" size="sm" onClick={() => copyToClipboard(atob(order.deliveredPayload!))}>
                <Copy className="w-3 h-3 mr-1" /> Copy All
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Actions after delivery */}
      {order.status === "DELIVERED" && (
        <div className="flex gap-3">
          <Btn
            className="flex-1"
            onClick={() => completeOrder.mutate(order.id)}
            disabled={completeOrder.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Receipt
          </Btn>
          <Btn
            variant="outline"
            className="flex-1"
            onClick={() => setShowDisputeForm(true)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report an Issue
          </Btn>
        </div>
      )}

      {/* Dispute Form */}
      <AnimatePresence>
        {showDisputeForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 rounded-2xl p-6 shadow-soft-sm border border-red-200"
          >
            <h3 className="font-semibold text-red-700 mb-3">Report an Issue</h3>
            <textarea
              className="w-full border border-red-200 rounded-lg p-3 text-sm mb-3 min-h-[80px]"
              placeholder="Describe the issue (minimum 10 characters)..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Btn
                variant="destructive"
                onClick={() => {
                  disputeOrder.mutate({ orderId: order.id, reason: disputeReason });
                  setShowDisputeForm(false);
                }}
                disabled={disputeReason.length < 10 || disputeOrder.isPending}
              >
                Submit Report
              </Btn>
              <Btn variant="outline" onClick={() => setShowDisputeForm(false)}>
                Cancel
              </Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Summary */}
      <div className="bg-surface-100 rounded-2xl p-6 shadow-soft-sm border border-surface-200">
        <h2 className="text-sm font-semibold text-text-700 mb-3 uppercase tracking-wide">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-500">Subtotal</span><span>Rs. {formatPrice(Number(order.subtotal))}</span></div>
          {Number(order.shippingCost) > 0 && (
            <div className="flex justify-between"><span className="text-text-500">Shipping</span><span>Rs. {formatPrice(Number(order.shippingCost))}</span></div>
          )}
          <div className="flex justify-between font-semibold text-base border-t border-surface-200 pt-2">
            <span>Total</span><span>Rs. {formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 space-y-2">
          {order.items?.map((item: P2POrderItem) => (
            <div key={item.id} className="flex items-center gap-3 p-2 bg-surface-50 rounded-lg">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center text-xs font-bold text-accent-700 shrink-0">
                {item.productTitle.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productTitle}</p>
                <p className="text-xs text-text-500">Qty: {item.quantity} x Rs. {formatPrice(Number(item.price))}</p>
              </div>
              <span className="text-sm font-medium">Rs. {formatPrice(Number(item.totalPrice))}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Events / Audit Trail */}
      {order.orderEvents?.length > 0 && (
        <div className="bg-surface-100 rounded-2xl p-6 shadow-soft-sm border border-surface-200">
          <h2 className="text-sm font-semibold text-text-700 mb-3 uppercase tracking-wide">Activity Log</h2>
          <div className="space-y-3">
            {[...order.orderEvents].reverse().map((event) => (
              <div key={event.id} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    event.toStatus === "COMPLETED" ? "bg-green-500" :
                    event.toStatus === "DISPUTED" ? "bg-red-500" :
                    event.toStatus === "EXPIRED" ? "bg-gray-400" :
                    "bg-primary-500"
                  )} />
                  <div className="flex-1 w-px bg-surface-200" />
                </div>
                <div className="flex-1 pb-3">
                  <p className="text-text-800">{event.note || `${event.actor} moved order to ${event.toStatus}`}</p>
                  <p className="text-xs text-text-400">{formatDateTime(event.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-surface-100 rounded-lg">
      <div>
        <p className="text-xs text-text-500">{label}</p>
        <p className="text-sm font-medium text-text-800">{value}</p>
      </div>
      <Btn variant="ghost" size="sm" onClick={() => copyToClipboard(value)}>
        <Copy className="w-3 h-3" />
      </Btn>
    </div>
  );
}
