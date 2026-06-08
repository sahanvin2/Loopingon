import React from "react";
import { Hammer, PenTool, Ruler, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Custom Orders | Kandyam",
  description: "Request bespoke, handcrafted items from our Sri Lankan artisans.",
};

export default function CustomOrdersPage() {
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-navy-900 mb-4">Custom Orders</h1>
          <p className="text-lg text-muted-600 max-w-2xl mx-auto">
            Can&apos;t find exactly what you&apos;re looking for? Work directly with our talented Sri Lankan artisans to create a bespoke masterpiece tailored specifically to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-accent-100">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Request a Custom Piece</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Your Name</label>
                <input type="text" className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Craft Category</label>
                <select className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                  <option>Wood Carving</option>
                  <option>Batik</option>
                  <option>Handloom</option>
                  <option>Jewelry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Describe your idea</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Tell us about the size, colors, materials, and overall vision..."></textarea>
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
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">1. Share your vision</h4>
                    <p className="text-sm text-muted-600">Tell us what you want to create. Provide as many details as possible including dimensions, materials, and inspiration.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">2. Connect with an artisan</h4>
                    <p className="text-sm text-muted-600">We&apos;ll match your request with the perfect artisan who specializes in your desired craft. They will provide a quote and timeline.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-900 mb-1">3. Creation process</h4>
                    <p className="text-sm text-muted-600">Once approved, the artisan begins crafting your piece. Custom orders typically take 2-4 weeks to complete.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
              <h4 className="font-bold text-primary-900 mb-2">Need inspiration?</h4>
              <p className="text-sm text-primary-800 mb-4">Browse our gallery of past custom orders to see what our artisans are capable of creating.</p>
              <a href="/products" className="text-sm font-medium text-primary-700 hover:text-primary-800 underline">View Gallery</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
