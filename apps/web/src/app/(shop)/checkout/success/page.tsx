"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Copy, Package, MapPin, Calendar, CreditCard, Truck, ShoppingBag, ArrowRight, Share2, Facebook, Twitter } from "lucide-react";
import { get } from "@/lib/api-client";
import type { Order, ApiResponse } from "@/types";
import { formatDate, formatPrice, getImageUrl, copyToClipboard } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const timelineSteps = [
  { label: "Order Confirmed", icon: Check, done: true },
  { label: "Crafting", icon: Package, done: false },
  { label: "Quality Check", icon: Check, done: false },
  { label: "Shipped", icon: Truck, done: false },
  { label: "Delivered", icon: MapPin, done: false },
];

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    get<ApiResponse<Order>>(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCopy = useCallback(async () => {
    if (!order?.orderNumber) return;
    const ok = await copyToClipboard(order.orderNumber);
    if (ok) { setCopied(true); toast.success("Order number copied!"); setTimeout(() => setCopied(false), 2000); }
  }, [order]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-text-200 border-t-primary-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-text-900">Order Not Found</h1>
          <p className="mt-2 text-muted-600">We couldn&apos;t find this order. Please check your email for confirmation.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const deliveryEstimate = order.estimatedDelivery ? format(new Date(order.estimatedDelivery), "MMM d, yyyy") : "Pending";

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted-100"
        >
          <Check className="h-10 w-10 text-muted-600" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center font-serif text-3xl font-bold text-text-900">
          Order Confirmed!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 text-center text-muted-600">
          Thank you! Your order has been placed successfully.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 rounded-2xl bg-white p-6 shadow-soft-sm">
          <div className="flex items-center justify-between border-b border-text-100 pb-4">
            <div>
              <p className="text-xs text-muted-500">Order Number</p>
              <button onClick={handleCopy} className="flex items-center gap-2 font-mono text-lg font-bold text-text-900 hover:text-primary-600">
                {order.orderNumber} <Copy className="h-4 w-4 text-muted-400" />
              </button>
              {copied && <span className="text-xs text-muted-600">Copied!</span>}
            </div>
            <span className="rounded-full bg-muted-50 px-3 py-1 text-xs font-medium text-muted-700 capitalize">{order.paymentStatus?.replace(/_/g, " ").toLowerCase()}</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-400" />
              <div><p className="text-xs text-muted-500">Order Date</p><p className="text-sm font-medium text-text-800">{formatDate(order.createdAt)}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-muted-400" />
              <div><p className="text-xs text-muted-500">Est. Delivery</p><p className="text-sm font-medium text-text-800">{deliveryEstimate}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-400" />
              <div><p className="text-xs text-muted-500">Shipping To</p><p className="text-sm font-medium text-text-800">{order.shippingAddress?.city}, {order.shippingAddress?.district}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 text-muted-400" />
              <div><p className="text-xs text-muted-500">Payment</p><p className="text-sm font-medium text-text-800">{order.paymentMethod || "Online Payment"}</p></div>
            </div>
          </div>
        </motion.div>

        {order.items && order.items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 rounded-2xl bg-white p-6 shadow-soft-sm">
            <h2 className="font-serif text-lg font-bold text-text-900">Order Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-text-100 pb-3 last:border-0 last:pb-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted-100">
                    {item.productImage && <Image src={getImageUrl(item.productImage)} alt={item.productTitle} width={64} height={64} className="object-cover" />}
                  </div>
                  <div className="flex-1"><p className="text-sm font-medium text-text-800">{item.productTitle}</p><p className="text-xs text-muted-500">Qty: {item.quantity}</p></div>
                  <p className="text-sm font-semibold text-text-900">{formatPrice(parseFloat(item.totalPrice))}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-text-100 pt-4 text-right">
              <p className="text-lg font-bold text-text-900">Total: {formatPrice(parseFloat(order.totalAmount))}</p>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/dashboard/orders/${order.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-primary-700">
            <Package className="h-4 w-4" /> Track Your Order
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-lg border border-text-300 px-6 py-3 text-sm font-semibold text-text-700 hover:bg-text-50">
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-text-200 px-6 py-3 text-sm font-medium text-text-600 hover:bg-text-50">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 rounded-2xl bg-white p-6 shadow-soft-sm">
          <h2 className="font-serif text-lg font-bold text-text-900">What&apos;s Next?</h2>
          <div className="mt-6 flex justify-between">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex-1 text-center">
                <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${step.done ? "bg-muted-100 text-muted-600" : "bg-text-100 text-muted-400"}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs text-muted-600">{step.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 rounded-2xl bg-accent-50 p-6 text-center">
          <h2 className="font-serif text-lg font-bold text-accent-800">Share the Love</h2>
          <p className="mt-1 text-sm text-accent-600">Tell your friends about Kandyam and earn rewards!</p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="rounded-lg bg-[#1877F2] p-2 text-white hover:bg-[#166FE5]"><Facebook className="h-5 w-5" /></button>
            <button className="rounded-lg bg-[#1DA1F2] p-2 text-white hover:bg-[#1a8cd8]"><Twitter className="h-5 w-5" /></button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
