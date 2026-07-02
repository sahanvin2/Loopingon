import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Store, CreditCard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Become a Seller | Kandyam",
  description: "Join the Kandyam community and start selling your handcrafted, vintage, and unique goods to millions of buyers worldwide.",
};

export default function SellOnKandyamPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFD]">
      {/* Hero Section */}
      <section className="relative bg-[#0A2342] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1600&h=800&fit=crop" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Turn what you love into what you do.</h1>
          <p className="text-lg md:text-xl font-medium text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of independent sellers making a living on Kandyam. Setup your shop today for just Rs. 0.00.
          </p>
          <Link href="/vendor/register" className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D92D3A] text-white font-bold text-lg px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Open Your Shop <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="py-24 border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
             <h2 className="font-serif text-3xl font-bold text-navy-900">Why sell on Kandyam?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E2F0F1] flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-[#62A7B0]" />
              </div>
              <h3 className="font-bold text-xl text-navy-900 mb-3">Reach Millions</h3>
              <p className="text-text-600 font-medium">Get your products in front of a massive audience actively looking for unique items.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EAE1] flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-[#F4A261]" />
              </div>
              <h3 className="font-bold text-xl text-navy-900 mb-3">Low Fees</h3>
              <p className="text-text-600 font-medium">Keep more of what you earn with our transparent and competitive fee structure.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FCECEE] flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#E63946]" />
              </div>
              <h3 className="font-bold text-xl text-navy-900 mb-3">Seller Protection</h3>
              <p className="text-text-600 font-medium">Shop with peace of mind knowing our dedicated team has your back on every order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Steps */}
      <section className="py-24 bg-[#F8F5F1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-16">How it works</h2>
          
          <div className="space-y-8">
            {[
              { title: "Register and List", desc: "Create your account and start uploading your amazing products in minutes." },
              { title: "Sell and Ship", desc: "When a customer buys your item, package it with love and ship it directly to them." },
              { title: "Get Paid", desc: "Funds are deposited securely into your bank account on a regular schedule." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#E63946] text-white font-bold flex items-center justify-center text-xl">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-text-600 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
