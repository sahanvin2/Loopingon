"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, HeadphonesIcon, ChevronDown } from "lucide-react";
import Link from "next/link";

const faqSections = [
  {
    title: "Orders & Payments",
    icon: "📦",
    questions: [
      { q: "How do I place an order?", a: "Browse products, add items to your cart, then proceed to checkout. You'll need to provide your shipping address and select a payment method. Once confirmed, the artisan will begin preparing your order." },
      { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, American Express, local Sri Lankan bank transfers, PayPal, and Stripe for international payments. All payments are processed securely through our escrow system." },
      { q: "Is my payment secure?", a: "Yes. All payments are processed through PCI-DSS compliant payment gateways with SSL encryption. Funds are held in escrow and only released to the vendor after you confirm receipt." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement if the artisan hasn't started production. Custom and made-to-order items cannot be cancelled once production begins." },
      { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also view order status in your account dashboard under 'My Orders'." },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: "🚚",
    questions: [
      { q: "How long does shipping take?", a: "Domestic (Sri Lanka): 2-5 business days. International: 7-21 business days depending on destination. Express shipping is available for select destinations." },
      { q: "Do you ship internationally?", a: "Yes! We ship to over 35 countries worldwide. International shipping costs are calculated at checkout based on destination, weight, and dimensions." },
      { q: "Is free shipping available?", a: "Free domestic shipping is available on orders over Rs. 5,000. Some vendors also offer free shipping on specific products. Look for the 'Free Shipping' badge." },
      { q: "What about customs and duties?", a: "International orders may be subject to customs duties and import taxes. These charges are the buyer's responsibility. Check your country's import regulations before ordering." },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: "↩️",
    questions: [
      { q: "What is your return policy?", a: "You have 7 days from delivery to request a return. Items must be unused, in original condition, and in original packaging. Custom orders and digital items are non-returnable." },
      { q: "How do I initiate a return?", a: "Go to 'My Orders' in your account, select the order, and click 'Request Return'. Provide the reason and upload photos if there's damage. Our team will review within 24 hours." },
      { q: "When will I receive my refund?", a: "Once the returned item is received and inspected, refunds are processed within 3-5 business days to your original payment method." },
      { q: "What if my item arrives damaged?", a: "Take photos immediately upon delivery and contact us within 48 hours. We'll arrange a replacement or full refund, including shipping costs, at no charge to you." },
    ],
  },
  {
    title: "Account & Profile",
    icon: "👤",
    questions: [
      { q: "How do I create an account?", a: "Click 'Sign Up' on the top right, enter your email and password, or sign up using Google or Facebook. Both buyer and vendor accounts are free." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password?' on the sign-in page. Enter your email address and we'll send you a password reset link valid for 1 hour." },
      { q: "Can I change my email address?", a: "Yes. Go to Account Settings → Profile to update your email. You'll need to verify the new email address before the change takes effect." },
    ],
  },
  {
    title: "Selling on Loopingon",
    icon: "🏪",
    questions: [
      { q: "How do I become a vendor?", a: "Visit 'Sell on Loopingon' and complete the vendor application. You'll need to provide craft details, identification documents, and workshop photos. Approval typically takes 3-5 business days." },
      { q: "What is the commission structure?", a: "Loopingon takes a 20% commission on each sale. You keep 80%. There are no listing fees, monthly charges, or hidden costs." },
      { q: "How do payouts work?", a: "Payouts are processed every two weeks directly to your Sri Lankan bank account. You can track all earnings and upcoming payouts from your vendor dashboard." },
      { q: "Can I sell internationally?", a: "Yes! Your products are automatically available to customers worldwide. We handle international marketing, pricing conversion, and logistics support." },
      { q: "What support do vendors get?", a: "Vendors get dedicated WhatsApp support, free marketing and promotion, product photography tips, and access to vendor training webinars." },
    ],
  },
  {
    title: "Technical Issues",
    icon: "🔧",
    questions: [
      { q: "I'm having trouble logging in", a: "First, try resetting your password. If you're using social login, ensure the provider is not blocking pop-ups. Clear browser cache and cookies if the issue persists. Contact support if still unresolved." },
      { q: "Images are not loading", a: "Try refreshing the page or clearing your browser cache. If on mobile, ensure you have a stable internet connection. Some school or office networks may block image CDNs." },
      { q: "Payment failed but money was deducted", a: "Don't worry - this is usually a temporary authorization hold that will be automatically reversed within 24-48 hours. If you don't see the reversal, contact your bank and our support team." },
    ],
  },
  {
    title: "Security & Privacy",
    icon: "🔒",
    questions: [
      { q: "How is my personal data protected?", a: "We use industry-standard encryption (SSL/TLS) for all data transmission. Personal data is stored securely and never sold to third parties. See our Privacy Policy for full details." },
      { q: "Is my payment information stored?", a: "No. We do not store full credit card numbers. Payment processing is handled by PCI-DSS compliant third-party processors (Stripe, PayPal, bank gateways)." },
      { q: "How do I report a security concern?", a: "Email security@loopingon.com with details. We take security reports seriously and will respond within 24 hours. Please do not publicly disclose security issues." },
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
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Help Center</h1>
          <p className="mt-4 text-lg text-muted-600">How can we help you today?</p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full rounded-xl border border-charcoal-200 bg-cream-50 py-3.5 pl-12 pr-4 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16">
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
                    <span className="font-serif text-lg font-semibold text-charcoal-900">{section.title}</span>
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
                          <details key={faq.q} className="group border-t border-charcoal-100 pt-3 first:border-t-0 first:pt-0">
                            <summary className="cursor-pointer py-2 text-sm font-medium text-charcoal-700 hover:text-rose-600">
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
          <div className="rounded-2xl bg-cream-50 p-8 md:p-10">
            <HeadphonesIcon className="mx-auto h-10 w-10 text-rose-600" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-charcoal-900">Still Need Help?</h2>
            <p className="mt-2 text-muted-600">Our support team is here to help you with any questions or issues.</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-rose-700 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" /> Contact Us
              </Link>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-charcoal-300 px-6 py-3 text-sm font-semibold text-charcoal-700 transition-all hover:bg-charcoal-50 sm:w-auto">
                <MessageCircle className="h-4 w-4" /> Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
