"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, HeadphonesIcon, ChevronDown, Package, CreditCard, RefreshCw, ShieldCheck, UserCircle, Store } from "lucide-react";
import Link from "next/link";

const faqSections = [
  {
    title: "Orders & Payments",
    icon: <Package className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "How do I place an order?", a: "Browse products, add items to your cart, then proceed to checkout. You'll need to provide your shipping address and select a payment method. Once confirmed, the seller will begin preparing your order." },
      { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, AMEX, and major digital wallets. All payments are securely processed through our trusted payment gateway." },
      { q: "Is my payment secure?", a: "Yes. All payments are processed through PCI-DSS compliant payment gateways with SSL encryption. Funds are held in escrow and only released to the vendor after you confirm receipt." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement if the seller hasn't started processing it. Custom and made-to-order items cannot be cancelled once production begins." },
      { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also view order status in your account dashboard under 'My Orders'." },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: <Package className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "How long does shipping take?", a: "Standard shipping typically takes 2-5 business days domestically. International orders take 7-21 business days depending on destination. Express shipping is available for select items." },
      { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. International shipping costs are calculated at checkout based on destination, weight, and dimensions." },
      { q: "Is free shipping available?", a: "Many of our sellers offer free shipping on select items or orders over a certain threshold. Look for the 'Free Shipping' badge on product listings." },
      { q: "What about customs and duties?", a: "International orders may be subject to customs duties and import taxes. These charges are the buyer's responsibility. Check your country's import regulations before ordering." },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: <RefreshCw className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "What is your return policy?", a: "You have 14 days from delivery to request a return for most items. Items must be unused, in original condition, and in original packaging. Custom orders and digital items are generally non-returnable." },
      { q: "How do I initiate a return?", a: "Go to 'My Orders' in your account, select the order, and click 'Request Return'. Provide the reason and upload photos if there's damage. Our team will review within 24-48 hours." },
      { q: "When will I receive my refund?", a: "Once the returned item is received and inspected by the seller, refunds are processed within 3-5 business days to your original payment method." },
      { q: "What if my item arrives damaged?", a: "Take photos immediately upon delivery and contact us within 48 hours. We'll arrange a replacement or full refund, including shipping costs, at no charge to you." },
    ],
  },
  {
    title: "Account & Profile",
    icon: <UserCircle className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "How do I create an account?", a: "Click 'Sign In' on the top right, enter your email, or sign up using Google or Facebook. Creating a buyer account is completely free." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password?' on the sign-in page. Enter your email address and we'll send you a password reset link valid for 1 hour." },
      { q: "Can I change my email address?", a: "Yes. Go to Account Settings → Profile to update your email. You'll need to verify the new email address before the change takes effect." },
    ],
  },
  {
    title: "Selling on Kandyam",
    icon: <Store className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "How do I become a seller?", a: "Visit 'Sell on Kandyam' and complete the seller application. You'll need to provide store details and verification documents. Approval typically takes 1-3 business days." },
      { q: "What are the fees?", a: "We charge a competitive, flat commission rate on successful sales. There are no monthly subscription fees or hidden costs." },
      { q: "How do payouts work?", a: "Payouts are processed weekly. Funds are transferred directly to your registered bank account once your items are delivered." },
      { q: "What support do sellers get?", a: "Sellers get dedicated support, access to our community forums, marketing resources, and a comprehensive seller handbook." },
    ],
  },
  {
    title: "Technical Issues",
    icon: <HeadphonesIcon className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "I'm having trouble logging in", a: "First, try resetting your password. If you're using social login, ensure the provider is not blocking pop-ups. Clear browser cache and cookies if the issue persists." },
      { q: "Images are not loading", a: "Try refreshing the page or clearing your browser cache. If on mobile, ensure you have a stable internet connection." },
      { q: "Payment failed but money was deducted", a: "This is usually a temporary authorization hold that will be automatically reversed by your bank within 24-48 hours. If you don't see the reversal, contact your bank and our support team." },
    ],
  },
  {
    title: "Security & Privacy",
    icon: <ShieldCheck className="w-5 h-5 text-primary-500" />,
    questions: [
      { q: "How is my personal data protected?", a: "We use industry-standard encryption (SSL/TLS) for all data transmission. Personal data is stored securely and never sold to third parties. See our Privacy Policy for full details." },
      { q: "Is my payment information stored?", a: "No. We do not store full credit card numbers. Payment processing is handled by certified PCI-DSS compliant payment processors." },
      { q: "How do I report a security concern?", a: "Email security@kandyam.com with details. We take security reports seriously and will respond promptly." },
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filteredSections = search
    ? faqSections.map((section) => ({
        ...section,
        questions: section.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(search.toLowerCase()) ||
            q.a.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((s) => s.questions.length > 0)
    : faqSections;

  return (
    <>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-text-900 md:text-5xl">Help Center</h1>
          <p className="mt-4 text-lg text-muted-600">How can we help you today?</p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full rounded-xl border border-text-200 bg-surface-50 py-3.5 pl-12 pr-4 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          {filteredSections.length === 0 && (
            <p className="py-12 text-center text-muted-500">No results found. Try different keywords or browse the categories below.</p>
          )}
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div key={section.title} className="overflow-hidden rounded-xl bg-white shadow-soft-sm">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-serif text-lg font-semibold text-text-900">{section.title}</span>
                    <span className="text-sm text-muted-400">({section.questions.length})</span>
                  </span>
                  <motion.div
                    animate={{ rotate: openSections[section.title] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSections[section.title] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 px-6 pb-4">
                        {section.questions.map((faq) => (
                          <details key={faq.q} className="group border-t border-text-100 pt-3 first:border-t-0 first:pt-0">
                            <summary className="cursor-pointer py-2 text-sm font-medium text-text-700 hover:text-primary-600">
                              {faq.q}
                            </summary>
                            <p className="pb-2 text-sm leading-relaxed text-muted-600">{faq.a}</p>
                          </details>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-2xl bg-surface-50 p-8 md:p-10">
            <HeadphonesIcon className="mx-auto h-10 w-10 text-primary-600" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-text-900">Still Need Help?</h2>
            <p className="mt-2 text-muted-600">Our support team is here to help you with any questions or issues.</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" /> Contact Us
              </Link>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-text-300 px-6 py-3 text-sm font-semibold text-text-700 transition-all hover:bg-text-50 sm:w-auto">
                <MessageCircle className="h-4 w-4" /> Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
