"use client";

import React, { useState } from "react";
import { Loader2, ShieldCheck, Mail, CreditCard, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BillingFormData {
  email: string;
  fullName: string;
  phone: string;
}

interface ShippingStepProps {
  initialData?: BillingFormData;
  onNext: (data: BillingFormData) => void;
  orderError?: string | null;
  isSubmitting?: boolean;
  className?: string;
}

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  colSpan?: number;
}

const InputField = ({ label, type = "text", placeholder, value, error, onChange, colSpan = 1 }: InputFieldProps) => (
  <div className={cn(colSpan === 2 && "sm:col-span-2")}>
    <label className="block text-[13px] font-semibold text-text-700 mb-1.5 ml-0.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full px-4 py-3 rounded-xl border bg-surface-50 text-sm shadow-sm transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white",
        error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-surface-300 hover:border-surface-400"
      )}
    />
    {error && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{error}</p>}
  </div>
);

export function ShippingStep({ initialData, onNext, orderError, isSubmitting, className }: ShippingStepProps) {
  const [form, setForm] = useState<BillingFormData>(initialData || {
    email: "", fullName: "", phone: ""
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BillingFormData, string>>>({});

  const handleChange = (field: keyof BillingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BillingFormData, string>> = {};
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Valid phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext(form);
    else {
      const firstError = document.querySelector('.border-red-400');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={cn("space-y-10", className)}>
      
      {/* 1. Contact Information */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-text-900" />
          <h2 className="font-serif text-2xl font-bold text-text-900">Contact & Billing</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm space-y-4">
          <InputField label="Email Address" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} type="email" placeholder="you@example.com" />
          <p className="text-xs text-muted-500 ml-1 mb-4">We'll use this to send you access to your digital products.</p>
          
          <div className="pt-2 border-t border-surface-100 mb-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InputField label="Full Name" value={form.fullName} onChange={(v) => handleChange("fullName", v)} error={errors.fullName} placeholder="First and Last name" colSpan={2} />
            <InputField label="Phone Number" value={form.phone} onChange={(v) => handleChange("phone", v)} error={errors.phone} type="tel" placeholder="07X XXX XXXX" colSpan={2} />
          </div>
        </div>
      </section>

      {/* 2. Payment */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-900">Payment</h2>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-surface-200 shadow-soft-sm">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 border border-blue-200 rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:shadow-sm hover:border-blue-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="pt-1">
                <p className="text-lg font-bold text-blue-900 mb-1">Secure Online Payment</p>
                <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
                  Pay securely with your credit/debit card. Your payment is processed instantly and you will receive your digital products right away.
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
            "group relative overflow-hidden w-full py-4 sm:py-5 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3",
            "bg-gradient-to-r from-primary-600 to-rose-600 text-white hover:from-primary-700 hover:to-rose-700",
            "shadow-[0_8px_30px_rgba(247,68,78,0.25)] hover:shadow-[0_8px_30px_rgba(247,68,78,0.4)] hover:-translate-y-1",
            isSubmitting && "opacity-70 cursor-not-allowed hover:translate-y-0"
          )}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-muted-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Secure Encrypted Checkout</span>
        </div>
      </div>

    </div>
  );
}
