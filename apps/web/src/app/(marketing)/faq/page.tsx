"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Truck, RefreshCw, CreditCard, Store, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
  { id: "orders", label: "Orders & Shipping", icon: Truck },
  { id: "returns", label: "Returns", icon: RefreshCw },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "selling", label: "Selling", icon: Store },
  { id: "security", label: "Security", icon: Shield },
];

const faqs = [
  {
    category: "orders",
    question: "How long does shipping take?",
    answer: "Standard domestic shipping within Sri Lanka takes 2-4 business days. International shipping takes 7-14 business days depending on the destination. You'll receive a tracking number once your order ships.",
  },
  {
    category: "orders",
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free shipping on all domestic orders over Rs. 5,000. For international orders, shipping costs are calculated at checkout based on weight and destination.",
  },
  {
    category: "orders",
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking link. You can also view the status of your order at any time by visiting your Dashboard and clicking on 'Orders'.",
  },
  {
    category: "returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return window for all items in their original condition. Because many of our items are handmade, slight variations are normal and not considered defects.",
  },
  {
    category: "returns",
    question: "How do I return an item?",
    answer: "To initiate a return, go to your Orders dashboard, select the item you wish to return, and click 'Request Return'. You will be provided with a prepaid shipping label.",
  },
  {
    category: "returns",
    question: "How long do refunds take?",
    answer: "Once the artisan receives and inspects your returned item, your refund will be processed within 5 business days to your original payment method.",
  },
  {
    category: "payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, Mastercard), bank transfers, and mobile wallets. All payments are securely processed through PayHere, Sri Lanka's leading payment gateway.",
  },
  {
    category: "payments",
    question: "Can I pay with multiple gift cards?",
    answer: "Yes, you can apply multiple Kandyam gift cards to a single order at checkout. If the total exceeds the gift card balance, you can pay the remainder with a credit card.",
  },
  {
    category: "selling",
    question: "How do I become an artisan on Kandyam?",
    answer: "It's free and easy! Click 'Sell on Kandyam' in the navigation menu, fill out the application, and once approved, you can set up your shop. We charge a small 5% commission only when you make a sale.",
  },
  {
    category: "selling",
    question: "Who handles shipping for artisans?",
    answer: "Artisans are responsible for packaging their items securely. Kandyam provides discounted, integrated shipping labels that you can easily print from your dashboard.",
  },
  {
    category: "security",
    question: "Is my personal information secure?",
    answer: "Absolutely. Kandyam uses industry-standard SSL encryption to protect your data. We never sell your personal information to third parties.",
  },
  {
    category: "security",
    question: "Are the artisans verified?",
    answer: "Yes! Every single artisan on Kandyam undergoes a strict verification process to ensure their products are genuinely handcrafted and meet our quality standards.",
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <main className="min-h-screen bg-surface-50 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-text-500 text-lg">Everything you need to know about shopping and selling on Kandyam.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border",
                activeCategory === cat.id 
                  ? "bg-primary-500 text-white border-primary-500" 
                  : "bg-white text-text-600 border-accent-200 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-soft-xl border border-accent-100 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="border border-accent-200 rounded-xl overflow-hidden bg-surface-50/50">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex items-center justify-between w-full p-5 text-left bg-white hover:bg-surface-50 transition-colors"
                    >
                      <span className="font-semibold text-text-800">{faq.question}</span>
                      <ChevronDown className={cn("w-5 h-5 text-muted-400 transition-transform duration-300", isOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 text-text-600 leading-relaxed bg-white border-t border-surface-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-3">Still have questions?</h2>
          <p className="text-text-500 mb-8 max-w-md mx-auto">Can't find the answer you're looking for? Please chat with our friendly team.</p>
          <a href="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 hover:scale-105 transition-all shadow-md">
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
