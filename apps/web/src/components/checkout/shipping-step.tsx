"use client";

import React, { useState } from "react";
import { Truck, Package, Loader2, ShieldCheck, Mail, MapPin, CreditCard, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export interface ShippingFormData {
  email: string;
  fullName: string;
  phone: string;
  contactNumberTwo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  facebookPage: string;
  orderNote: string;
  dueDate: string;
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
    { id: "KOOMBIYO", label: "Koombiyo", description: "1-3 business days", price: isFreeEligible ? 0 : 400, icon: Package },
  ];

  const [form, setForm] = useState<ShippingFormData>(initialData || {
    email: "", fullName: "", phone: "", contactNumberTwo: "", addressLine1: "", addressLine2: "", city: "", district: "", postalCode: "", country: "Sri Lanka", facebookPage: "", orderNote: "", dueDate: ""
  });
  
  const [method, setMethod] = useState(selectedMethod);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Valid phone required";
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.district.trim()) newErrors.district = "District is required";
    if (!form.dueDate?.trim()) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext(form, method);
    else {
      // scroll to first error
      const firstError = document.querySelector('.border-red-400');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const InputField = ({ label, field, type = "text", placeholder, colSpan = 1, optional = false }: { label: string, field: keyof ShippingFormData, type?: string, placeholder?: string, colSpan?: number, optional?: boolean }) => (
    <div className={cn(colSpan === 2 && "sm:col-span-2")}>
      <label className="block text-[13px] font-semibold text-text-700 mb-1.5 ml-0.5">
        {label} {optional && <span className="text-muted-400 font-normal">(Optional)</span>}
      </label>
      <input
        type={type}
        value={form[field] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-surface-50 text-sm shadow-sm transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white",
          errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-surface-300 hover:border-surface-400"
        )}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors[field]}</p>}
    </div>
  );

  return (
    <div className={cn("space-y-10", className)}>
      
      {/* 1. Contact Information */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-text-900" />
          <h2 className="font-serif text-2xl font-bold text-text-900">Contact</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm space-y-4">
          <InputField label="Email Address" field="email" type="email" placeholder="you@example.com" />
          <p className="text-xs text-muted-500 ml-1">We'll use this to send you order updates and receipts.</p>
        </div>
      </section>

      {/* 2. Delivery Address */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-text-900" />
          <h2 className="font-serif text-2xl font-bold text-text-900">Delivery</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InputField label="Full Name" field="fullName" placeholder="First and Last name" colSpan={2} />
            <InputField label="Phone Number" field="phone" type="tel" placeholder="07X XXX XXXX" />
            <InputField label="Contact Number Two" field="contactNumberTwo" type="tel" placeholder="Optional" optional />
          </div>

          <div className="pt-2 border-t border-surface-100"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InputField label="Address Line 1" field="addressLine1" placeholder="House/Apt number, Street name" colSpan={2} />
            <InputField label="Address Line 2" field="addressLine2" placeholder="Apartment, suite, unit, etc." optional colSpan={2} />
            <InputField label="City" field="city" placeholder="Colombo" />
            <InputField label="District" field="district" placeholder="Colombo" />
            <InputField label="Postal Code" field="postalCode" placeholder="00100" />
            <InputField label="Expected Delivery (Due Date)" field="dueDate" type="date" placeholder="Select date" />
            
            <div className="sm:col-span-2 mt-2">
              <label className="block text-[13px] font-semibold text-text-700 mb-1.5 ml-0.5">
                Order Note / Delivery Instructions <span className="text-muted-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={form.orderNote}
                onChange={(e) => handleChange("orderNote", e.target.value)}
                placeholder="E.g., Leave at the front door, call before arriving..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-surface-50 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white hover:border-surface-400 resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shipping Method */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-text-900" />
          <h2 className="font-serif text-2xl font-bold text-text-900">Shipping Method</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm space-y-3">
          {shippingMethods.map((m) => {
            const isSelected = method === m.id;
            return (
              <button 
                key={m.id} 
                type="button" 
                onClick={() => setMethod(m.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200",
                  isSelected 
                    ? "border-primary-500 bg-primary-50/50 shadow-sm" 
                    : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", 
                    isSelected ? "border-primary-600 bg-primary-600" : "border-surface-300 bg-white"
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-bold", isSelected ? "text-primary-900" : "text-text-900")}>{m.label}</span>
                    <span className="text-xs text-muted-500 mt-0.5">{m.description}</span>
                  </div>
                </div>
                <span className={cn("text-sm font-bold", m.price === 0 ? "text-teal-600" : "text-text-900")}>
                  {m.price === 0 ? "FREE" : `Rs. ${m.price}`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Payment */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-text-900" />
          <h2 className="font-serif text-2xl font-bold text-text-900">Payment</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 relative overflow-hidden">
            {/* Active highlight border top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-green-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-text-900 mb-1">Cash on Delivery (COD)</p>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Pay with cash when your order is delivered to your doorstep. No online payment required today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission */}
      <div className="pt-6">
        {orderError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{orderError}</p>
          </div>
        )}

        <button 
          type="button" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 sm:py-5 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3",
            "bg-primary-600 text-white hover:bg-primary-700 shadow-[0_8px_30px_rgb(247,68,78,0.2)] hover:shadow-[0_8px_30px_rgb(247,68,78,0.3)] hover:-translate-y-0.5",
            isSubmitting && "opacity-70 cursor-not-allowed hover:translate-y-0"
          )}
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
          {isSubmitting ? "Processing Order..." : `Complete Order — Pay on Delivery`}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-muted-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Secure Encrypted Checkout</span>
        </div>
      </div>

    </div>
  );
}
