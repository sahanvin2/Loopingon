"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  className?: string;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryNotes: string;
  saveAddress: boolean;
}

const emptyForm: AddressFormData = {
  fullName: "",
  phone: "+94",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  postalCode: "",
  deliveryNotes: "",
  saveAddress: false,
};

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  className,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const updateField = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = "Valid phone number required";
    if (!form.addressLine1.trim()) errs.addressLine1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.district) errs.district = "District is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border text-sm",
            errors.fullName ? "border-red-500" : "border-cream-300",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="Full name"
        />
        {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border text-sm",
            errors.phone ? "border-red-500" : "border-cream-300",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="+94 XXX XXX XXXX"
        />
        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.addressLine1}
          onChange={(e) => updateField("addressLine1", e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border text-sm",
            errors.addressLine1 ? "border-red-500" : "border-cream-300",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="Street address, house number"
        />
        {errors.addressLine1 && <p className="text-xs text-red-600 mt-1">{errors.addressLine1}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          value={form.addressLine2}
          onChange={(e) => updateField("addressLine2", e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="Apartment, landmark (optional)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={cn(
              "w-full px-3 py-2.5 rounded-lg border text-sm",
              errors.city ? "border-red-500" : "border-cream-300",
              "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
            )}
            placeholder="City"
          />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            className={cn(
              "w-full px-3 py-2.5 rounded-lg border text-sm bg-white",
              errors.district ? "border-red-500" : "border-cream-300",
              "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
            )}
          >
            <option value="">Select district</option>
            {SRI_LANKAN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          value={form.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="Postal code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1">
          Delivery Notes
        </label>
        <textarea
          value={form.deliveryNotes}
          onChange={(e) => updateField("deliveryNotes", e.target.value)}
          rows={2}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm resize-none",
            "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
          )}
          placeholder="Instructions for delivery (optional)"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.saveAddress}
          onChange={(e) => updateField("saveAddress", e.target.checked)}
          className="w-4 h-4 rounded border-cream-300 text-terracotta-600 focus:ring-terracotta-500"
        />
        <span className="text-sm text-charcoal-700">Save this address for future orders</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className={cn(
            "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-terracotta-600 text-white hover:bg-terracotta-700",
          )}
        >
          Save Address
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "border border-cream-300 text-charcoal-700 hover:bg-warm-gray-50",
            )}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
