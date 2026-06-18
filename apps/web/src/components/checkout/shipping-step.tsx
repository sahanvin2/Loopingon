"use client";

import React, { useState } from "react";
import { Truck, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ShippingFormData {
  fullName: string;
  phone: string;
  altPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

interface ShippingStepProps {
  initialData?: ShippingFormData;
  onNext: (data: ShippingFormData, method: string) => void;
  selectedMethod?: string;
  orderError?: string | null;
  isSubmitting?: boolean;
  className?: string;
}

export function ShippingStep({ initialData, onNext, selectedMethod = "KOOMBIYO", orderError, isSubmitting, className }: ShippingStepProps) {
  const { items, subtotal } = useCartStore();

  const freeThreshold = 5000;
  const isFreeEligible = subtotal >= freeThreshold;

  const shippingMethods = [
    { id: "KOOMBIYO", label: "Koombiyo Standard", description: "1-3 days • Rs. 150/kg (min Rs. 400) • COD", price: isFreeEligible ? 0 : 400, icon: Package },
    { id: "EXPRESS", label: "Koombiyo Express", description: "Next day • Rs. 650 flat", price: isFreeEligible ? 300 : 650, icon: Truck },
  ];

  const [form, setForm] = useState<ShippingFormData>(initialData || {
    fullName: "", phone: "", altPhone: "", addressLine1: "", addressLine2: "", city: "", district: "", postalCode: "", country: "Sri Lanka",
  });
  const [method, setMethod] = useState(selectedMethod);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Valid phone required (min 10 digits)";
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.district.trim()) newErrors.district = "District is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext(form, method);
  };

  const inputClass = (field: keyof ShippingFormData) =>
    cn(
      "w-full px-3 py-2 rounded-lg border text-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
      "transition-colors",
      errors[field] ? "border-red-400 bg-red-50" : "border-accent-300",
    );

  const selectedShip = shippingMethods.find(m => m.id === method);
  const shipPrice = selectedShip?.price || 0;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Order Summary Banner */}
      <div className="bg-surface-50 rounded-xl p-4 border border-accent-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-700">{items.length} item{items.length > 1 ? "s" : ""} in cart</p>
            <p className="text-xs text-muted-500">Subtotal: Rs. {subtotal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-500">Delivery</p>
            <p className="text-sm font-bold text-text-700">{shipPrice === 0 ? "FREE" : `Rs. ${shipPrice}`}</p>
          </div>
        </div>
        {isFreeEligible && shipPrice === 0 && (
          <div className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
            Free delivery on orders over Rs. 5,000
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div>
        <h2 className="font-serif text-xl text-text-900 mb-1">Delivery Address</h2>
        <p className="text-sm text-muted-500 mb-4">Where should we deliver your order?</p>
        <div className="p-4 rounded-lg border border-accent-300 bg-surface-50">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">Full Name *</label>
                <input type="text" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Full name" className={inputClass("fullName")} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="07X XXX XXXX" className={inputClass("phone")} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">Alternate Phone</label>
                <input type="tel" value={form.altPhone} onChange={(e) => handleChange("altPhone", e.target.value)} placeholder="Alternative number" className="w-full px-3 py-2 rounded-lg border border-accent-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-700 mb-1">Address *</label>
              <input type="text" value={form.addressLine1} onChange={(e) => handleChange("addressLine1", e.target.value)} placeholder="House number, street name" className={inputClass("addressLine1")} />
              {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
            </div>
            <div>
              <input type="text" value={form.addressLine2} onChange={(e) => handleChange("addressLine2", e.target.value)} placeholder="Landmark, nearby location (optional)" className="w-full px-3 py-2 rounded-lg border border-accent-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">City *</label>
                <input type="text" value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="City" className={inputClass("city")} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">District *</label>
                <input type="text" value={form.district} onChange={(e) => handleChange("district", e.target.value)} placeholder="District" className={inputClass("district")} />
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-700 mb-1">Postal Code</label>
                <input type="text" value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} placeholder="Postal code" className="w-full px-3 py-2 rounded-lg border border-accent-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <h2 className="font-serif text-xl text-text-900 mb-4">Delivery Method</h2>
        <div className="space-y-3">
          {shippingMethods.map((m) => (
            <button key={m.id} type="button" onClick={() => setMethod(m.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                method === m.id ? "border-primary-500 bg-primary-50" : "border-accent-300 hover:border-muted-400",
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", method === m.id ? "border-primary-600" : "border-muted-300")}>
                {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
              </div>
              <m.icon className="w-5 h-5 text-muted-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-700">{m.label}</p>
                <p className="text-xs text-muted-500">{m.description}</p>
              </div>
              <span className={cn("text-sm font-medium", m.price === 0 ? "text-green-600" : "text-text-700")}>
                {m.price === 0 ? "FREE" : `Rs. ${m.price}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Cash on Delivery</p>
            <p className="text-xs text-green-700 mt-0.5">Pay only when you receive your order. No online payment required.</p>
          </div>
        </div>
      </div>

      {orderError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{orderError}</div>
      )}

      <button type="button" onClick={handleSubmit} disabled={isSubmitting}
        className={cn(
          "w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2",
          "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl",
          isSubmitting && "opacity-50 cursor-not-allowed",
        )}
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {isSubmitting ? "Placing Order..." : `Place Order — Pay on Delivery`}
      </button>
    </div>
  );
}
