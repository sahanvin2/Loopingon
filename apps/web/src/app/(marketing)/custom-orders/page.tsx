import React from "react";
import { Package, Phone, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Custom Orders | Kandyam",
  description: "Request a custom order for any product you need. We'll find it for you at the best price in Sri Lanka.",
};

export default function CustomOrdersPage() {
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">Custom Orders</h1>
          <p className="text-lg text-muted-600 max-w-2xl mx-auto">
            Can&apos;t find the product you&apos;re looking for? Tell us what you need and we&apos;ll source it from our network of trusted suppliers across Sri Lanka.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-accent-100">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Request a Product</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Your Name</label>
                <input type="text" className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="07X XXX XXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Product Category</label>
                <select className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                  <option>Electronics</option>
                  <option>Home & Living</option>
                  <option>Kids & Baby</option>
                  <option>Fashion & Clothing</option>
                  <option>Beauty & Personal Care</option>
                  <option>Sports & Outdoors</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Describe what you need</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Tell us about the product, brand, size, color, or any other details..."></textarea>
              </div>
              <button type="button" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors mt-2">
                Submit Request
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4">How it works</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">1. Tell us what you need</h4>
                    <p className="text-sm text-muted-600">Describe the product you're looking for — brand, model, size, budget, or any specific requirements.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">2. We find it for you</h4>
                    <p className="text-sm text-muted-600">Our team searches our supplier network across Sri Lanka. We&apos;ll contact you with available options, prices, and delivery timelines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">3. Order & deliver</h4>
                    <p className="text-sm text-muted-600">Once you approve, we process your order. Pay Cash on Delivery when it arrives at your doorstep via Koombiyo.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
              <h4 className="font-bold text-primary-900 mb-2">Why request a custom order?</h4>
              <ul className="text-sm text-primary-800 space-y-2">
                <li>✓ Access to products not listed on our site</li>
                <li>✓ Best prices from our supplier network</li>
                <li>✓ Cash on Delivery — pay when you receive</li>
                <li>✓ Koombiyo delivery island-wide</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
