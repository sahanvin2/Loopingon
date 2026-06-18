"use client";

import React, { useState } from "react";
import { Package, Phone, Clock, Search, MapPin, Weight, Truck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "Electronics & Gadgets",
  "Home & Living",
  "Kids & Baby",
  "Fashion & Clothing",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Kitchen & Dining",
  "Automotive",
  "Books & Stationery",
  "Pet Supplies",
  "Other",
];

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mullaitivu",
  "Vavuniya", "Mannar", "Trincomalee", "Batticaloa", "Ampara", "Kurunegala",
  "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle",
];

export default function CustomOrdersPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    email: "",
    category: "Electronics & Gadgets",
    productName: "",
    brand: "",
    quantity: "1",
    budget: "",
    size: "",
    color: "",
    description: "",
    city: "",
    district: "Colombo",
    address: "",
    postalCode: "",
    deliveryMethod: "standard",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const weight = Math.max(1, parseInt(form.quantity) || 1);
  const standardDelivery = Math.max(400, weight * 150);
  const expressDelivery = 650;
  const deliveryCost = form.deliveryMethod === "express" ? expressDelivery : standardDelivery;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.productName) {
      toast.error("Please fill in your name, phone, and product details.");
      return;
    }
    setSubmitted(true);
    toast.success("Request submitted! We'll contact you within 24 hours.");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-accent-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">Request Submitted!</h2>
            <p className="text-muted-600 mb-6">
              We'll search our supplier network and contact you at <strong>{form.phone}</strong> within 24 hours with product options and pricing.
            </p>
            <div className="bg-surface-50 rounded-xl p-5 text-left space-y-2 text-sm mb-6">
              <p><strong>Product:</strong> {form.productName} {form.brand && `(${form.brand})`}</p>
              <p><strong>Quantity:</strong> {form.quantity}</p>
              <p><strong>Category:</strong> {form.category}</p>
              <p><strong>Delivery:</strong> {form.district} — {form.deliveryMethod === "express" ? `Express (Rs. ${expressDelivery})` : `Standard (Rs. ${standardDelivery})`}</p>
            </div>
            <a href="/products" className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-navy-900 mb-3">Custom Order</h1>
          <p className="text-lg text-muted-600 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Tell us exactly what you need — we'll source it from our supplier network and deliver to your doorstep with Cash on Delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-accent-100 p-8 space-y-8">
          {/* Personal Info */}
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-500" /> Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Phone Number *</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="07X XXX XXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Alternate Phone</label>
                <input type="tel" value={form.altPhone} onChange={(e) => handleChange("altPhone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Backup number" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-surface-200 pt-8">
            <h2 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-500" /> Product Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-700 mb-1">Product Name *</label>
                <input type="text" value={form.productName} onChange={(e) => handleChange("productName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="What product are you looking for?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Brand / Model</label>
                <input type="text" value={form.brand} onChange={(e) => handleChange("brand", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Any specific brand or model?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Quantity</label>
                <input type="number" value={form.quantity} onChange={(e) => handleChange("quantity", e.target.value)} min="1"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Budget (Rs.)</label>
                <input type="number" value={form.budget} onChange={(e) => handleChange("budget", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your budget range" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Size / Dimensions</label>
                <input type="text" value={form.size} onChange={(e) => handleChange("size", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Any size requirements?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Color / Variant</label>
                <input type="text" value={form.color} onChange={(e) => handleChange("color", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Preferred color or variant" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-700 mb-1">Additional Details</label>
                <textarea rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                  placeholder="Any other specifications, features, or requirements..."></textarea>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="border-t border-surface-200 pt-8">
            <h2 className="font-serif text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary-500" /> Delivery Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your city" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">District</label>
                <select value={form.district} onChange={(e) => handleChange("district", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="House number, street name, landmark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Postal Code</label>
                <input type="text" value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Postal code" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Delivery Method</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleChange("deliveryMethod", "standard")}
                    className={cn("flex-1 px-3 py-3 rounded-xl border text-sm font-medium transition-colors",
                      form.deliveryMethod === "standard" ? "border-primary-500 bg-primary-50 text-primary-700" : "border-surface-300 text-text-600 hover:bg-surface-50")}>
                    <div className="text-xs">Standard</div>
                    <div className="font-bold">Rs. {standardDelivery}</div>
                  </button>
                  <button type="button" onClick={() => handleChange("deliveryMethod", "express")}
                    className={cn("flex-1 px-3 py-3 rounded-xl border text-sm font-medium transition-colors",
                      form.deliveryMethod === "express" ? "border-primary-500 bg-primary-50 text-primary-700" : "border-surface-300 text-text-600 hover:bg-surface-50")}>
                    <div className="text-xs">Express</div>
                    <div className="font-bold">Rs. {expressDelivery}</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-700 text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Cash on Delivery</p>
                <p className="text-xs text-green-700">Pay Rs. {deliveryCost} for delivery when your order arrives. No upfront payment.</p>
              </div>
            </div>
          </div>

          <button type="submit"
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-2xl transition-colors shadow-lg hover:shadow-xl">
            Submit Custom Order Request
          </button>
          <p className="text-center text-xs text-muted-500 -mt-2">
            We'll contact you within 24 hours. No payment required to submit.
          </p>
        </form>
      </div>
    </div>
  );
}
