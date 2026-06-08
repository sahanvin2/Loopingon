"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Gift,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  MessageSquare,
  CalendarHeart,
  Package,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Trash2,
  ShieldAlert,
  Check,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

const OCCASIONS = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Father's Day",
  "Mother's Day",
  "Baby Shower",
  "Housewarming",
  "Sinhala & Tamil New Year",
  "Vesak",
  "Christmas",
  "Valentine's Day",
  "Thank You",
  "Get Well Soon",
  "Graduation",
  "Just Because",
  "Other",
];

export default function GiftPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(0);
  const [recipient, setRecipient] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    district: "",
    postalCode: "",
  });
  const [giftMessage, setGiftMessage] = useState("");
  const [occasion, setOccasion] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [fromName, setFromName] = useState("");

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 5000 ? 0 : 250;
  }, [subtotal, items.length]);

  const giftWrapCost = giftWrap ? items.length * 150 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  const isRecipientValid = recipient.name.trim().length >= 2 && recipient.phone.trim().length >= 9;
  const isAddressValid =
    deliveryAddress.street.trim().length >= 5 &&
    deliveryAddress.city.trim().length >= 2 &&
    deliveryAddress.district.trim().length >= 2;
  const isFormValid = isRecipientValid && isAddressValid;

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      router.push("/sign-in?redirect=/gift");
      return;
    }

    const giftData = {
      recipient,
      deliveryAddress,
      giftMessage,
      occasion,
      giftWrap,
      fromName,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    localStorage.setItem("kandyam:gift-order", JSON.stringify(giftData));
    router.push(`/checkout?gift=true&total=${total}`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface-50 py-16 sm:py-24">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy-900 mb-4">Your cart is empty</h1>
          <p className="text-text-600 mb-8">
            Add some beautiful Sri Lankan handcrafted items to your cart first, then come back
            to send them as a gift.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            <span>Send as Gift</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">
            Send a Gift of Handmade
          </h1>
          <p className="text-text-600 max-w-lg mx-auto">
            Surprise someone special with a handcrafted Sri Lankan treasure. We'll deliver it
            directly to them with your personal message.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Cart", "Gift Details", "Review"].map((label, idx) => (
            <React.Fragment key={label}>
              <button
                type="button"
                onClick={() => idx < step && setStep(idx)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  idx === step
                    ? "bg-primary-500 text-white"
                    : idx < step
                      ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                      : "bg-surface-200 text-muted-400",
                )}
              >
                {idx < step && <Check className="w-3 h-3 inline mr-1" />}
                {label}
              </button>
              {idx < 2 && <ChevronRight className="w-4 h-4 text-muted-300" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 0: Cart Items */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <h2 className="text-lg font-semibold text-navy-900 mb-1">
                    Items in Your Gift ({items.length})
                  </h2>
                  <p className="text-sm text-text-500 mb-5">
                    These items will be sent as a gift. You can remove items you don't want to include.
                  </p>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-accent-100 bg-surface-50/50"
                      >
                        <div className="w-16 h-16 rounded-xl bg-surface-200 flex items-center justify-center text-muted-400 shrink-0">
                          <Package className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-900 truncate">
                            {item.product?.title || "Product"}
                          </h3>
                          {item.variant && (
                            <p className="text-xs text-muted-500 mt-0.5">
                              {item.variant.name || ""}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg border border-accent-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg border border-accent-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-text-900">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-500">
                            {formatPrice(parseFloat(item.price))} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Gift Details */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* From */}
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-navy-900">From (You)</h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="How should the recipient know who sent this?"
                      className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-navy-900">Recipient Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-1.5">
                        Recipient's Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={recipient.name}
                        onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                        placeholder="Full name of the person receiving this gift"
                        className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={recipient.phone}
                          onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                          placeholder="+94 7X XXX XXXX"
                          className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          value={recipient.email}
                          onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                          placeholder="For delivery updates"
                          className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-muted-50 text-muted-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-navy-900">
                      Delivery Address
                    </h2>
                  </div>
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      This is where the gift will be delivered. Make sure it's the
                      recipient's address, not yours.
                    </span>
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-1.5">
                        Street Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                        }
                        placeholder="House number, street name"
                        className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">
                          City / Town <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.city}
                          onChange={(e) =>
                            setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                          }
                          placeholder="e.g., Kandy, Colombo"
                          className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">
                          District <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={deliveryAddress.district}
                          onChange={(e) =>
                            setDeliveryAddress({ ...deliveryAddress, district: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm bg-white"
                        >
                          <option value="">Select district</option>
                          {SRI_LANKAN_DISTRICTS.map((d: string) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.postalCode}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })
                        }
                        placeholder="e.g., 20000"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Gift Message */}
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-navy-900">Gift Message</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-1.5">
                        Occasion (optional)
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm bg-white"
                      >
                        <option value="">Select occasion</option>
                        {OCCASIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write a personal message to the recipient..."
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm resize-none"
                      />
                      <p className="text-xs text-muted-400 mt-1 text-right">
                        {giftMessage.length}/500
                      </p>
                    </div>
                    <label
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                        giftWrap
                          ? "border-primary-300 bg-primary-50"
                          : "border-accent-200 hover:border-accent-300",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-text-900 text-sm">Gift Wrapping</p>
                          <p className="text-xs text-text-500">
                            Beautiful handcrafted wrapping — Rs. 150 per item
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="h-5 w-5 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-sm">
                  <h2 className="text-lg font-semibold text-navy-900 mb-5">Review Your Gift</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-accent-100">
                      <span className="text-muted-500">From</span>
                      <span className="font-medium text-text-900">{fromName || "You"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-accent-100">
                      <span className="text-muted-500">Recipient</span>
                      <span className="font-medium text-text-900">{recipient.name}</span>
                    </div>
                    {occasion && (
                      <div className="flex justify-between py-2 border-b border-accent-100">
                        <span className="text-muted-500">Occasion</span>
                        <span className="font-medium text-text-900">{occasion}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-accent-100">
                      <span className="text-muted-500">Delivery To</span>
                      <span className="font-medium text-text-900 text-right max-w-[60%]">
                        {deliveryAddress.street}, {deliveryAddress.city},{" "}
                        {deliveryAddress.district}
                        {deliveryAddress.postalCode && ` ${deliveryAddress.postalCode}`}
                      </span>
                    </div>
                    {giftMessage && (
                      <div className="py-2 border-b border-accent-100">
                        <span className="text-muted-500 block mb-1">Message</span>
                        <p className="text-text-700 italic">"{giftMessage}"</p>
                      </div>
                    )}
                    <div className="py-2">
                      <span className="text-muted-500 block mb-2">Items</span>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between py-1 text-text-700">
                          <span>
                            {item.product?.title || "Product"} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {giftWrap && (
                      <div className="flex justify-between py-2 border-b border-accent-100">
                        <span className="text-muted-500">Gift Wrapping ({items.length} items)</span>
                        <span className="font-medium text-text-900">
                          {formatPrice(giftWrapCost)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-600 hover:text-text-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-600 hover:text-text-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-accent-200 p-6 shadow-soft-lg">
                <h3 className="text-lg font-semibold text-navy-900 mb-5">Gift Summary</h3>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-text-500">
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span className="font-medium text-text-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-500">Shipping</span>
                    <span className={cn("font-medium", shippingCost === 0 && "text-primary-600")}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {giftWrap && (
                    <div className="flex justify-between">
                      <span className="text-text-500">Gift Wrapping</span>
                      <span className="font-medium text-text-900">{formatPrice(giftWrapCost)}</span>
                    </div>
                  )}
                  <div className="border-t border-accent-200 pt-3 flex justify-between">
                    <span className="font-semibold text-text-900">Total</span>
                    <span className="font-bold text-lg text-navy-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {shippingCost === 0 && (
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 text-xs text-primary-700 mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    Free SL Post delivery on orders over Rs. 5,000
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    <p className="font-semibold mb-1">Gift orders — Card payment only</p>
                    <p>
                      Cash on Delivery is not available for gift orders. Please pay by credit/debit
                      card to ensure the gift is delivered to your recipient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
