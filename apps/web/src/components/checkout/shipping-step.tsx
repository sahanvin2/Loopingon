"use client";

import React, { useState } from "react";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface ShippingFormData {
  fullName: string;
  phone: string;
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
  className?: string;
}

export function ShippingStep({ initialData, onNext, selectedMethod = "SL_POST", className }: ShippingStepProps) {
  const { items, subtotal } = useCartStore();

  const standardShippingPrice = items.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    if (p.freeShippingDomestic) return acc;
    const cost = p.shippingPrice ? Number(p.shippingPrice) : 400; // default to 400
    return acc + (cost * item.quantity);
  }, 0);

  const shippingMethods = [
    { id: "SL_POST", label: "SL Post Delivery", description: "1-3 business days • Sri Lanka-wide", price: standardShippingPrice },
    { id: "EXPRESS", label: "Express One-Day Delivery", description: "Next business day delivery", price: standardShippingPrice + 300 },
    { id: "FREE", label: "Free Delivery", description: "1-3 business days • Orders over Rs. 5,000", price: 0 },
  ];

  const [form, setForm] = useState<ShippingFormData>(initialData || {
    fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", district: "", postalCode: "", country: "Sri Lanka",
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
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.district.trim()) newErrors.district = "District is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required";
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

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="font-serif text-xl text-text-900 mb-1">Shipping Address</h2>
        <p className="text-sm text-muted-500 mb-4">Enter your delivery address</p>

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
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+94 XXX XXX XXXX" className={inputClass("phone")} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-700 mb-1">Address Line 1 *</label>
              <input type="text" value={form.addressLine1} onChange={(e) => handleChange("addressLine1", e.target.value)} placeholder="Street address, house number" className={inputClass("addressLine1")} />
              {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-700 mb-1">Address Line 2</label>
              <input type="text" value={form.addressLine2} onChange={(e) => handleChange("addressLine2", e.target.value)} placeholder="Apartment, suite, etc." className={cn("w-full px-3 py-2 rounded-lg border border-accent-300 text-sm", "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="block text-xs font-medium text-text-700 mb-1">Postal Code *</label>
                <input type="text" value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} placeholder="Postal code" className={inputClass("postalCode")} />
                {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-text-900 mb-4">Shipping Method</h2>
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
              <Truck className="w-5 h-5 text-muted-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-700">{m.label}</p>
                <p className="text-xs text-muted-500">{m.description}</p>
              </div>
              <span className="text-sm font-medium text-text-700">{m.price === 0 ? "Free" : `Rs. ${m.price}`}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={handleSubmit}
        className={cn("w-full py-3.5 rounded-lg text-base font-medium transition-colors", "bg-primary-600 text-white hover:bg-primary-700 shadow-rose")}
      >
        Continue to Payment
      </button>
    </div>
  );
}
