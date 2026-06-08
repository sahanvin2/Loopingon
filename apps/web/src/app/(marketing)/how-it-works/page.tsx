import Link from "next/link";
import { Search, CreditCard, Truck, Star, ClipboardCheck, Store, Package, Wallet, BadgeCheck } from "lucide-react";

export const metadata = {
  title: "How It Works",
  description: "Learn how Kandyam works for buyers and sellers. Secure payments, global shipping, and fair trade for Sri Lankan handmade crafts.",
};

const buyerSteps = [
  { icon: Search, title: "Browse Unique Crafts", description: "Explore thousands of handmade products across 20+ craft categories — from traditional batik to intricate wood carvings." },
  { icon: CreditCard, title: "Place Your Order", description: "Found something you love? Place your order securely. We accept all major payment methods including international cards." },
  { icon: Truck, title: "Pay via Escrow", description: "Your payment is held securely in escrow until you confirm satisfactory receipt of your order. Shop with confidence." },
  { icon: Star, title: "Receive & Review", description: "Receive your handcrafted treasure, inspect it, and release payment. Share your experience by leaving a review for the artisan." },
];

const sellerSteps = [
  { icon: ClipboardCheck, title: "Apply to Become an Artisan", description: "Submit your application with details about your craft. Our team reviews every application carefully — typically within 3-5 business days." },
  { icon: Store, title: "Set Up Your Store", description: "Once approved, create your personalized storefront. Add your story, workshop photos, and craft process details to connect with buyers." },
  { icon: Package, title: "List Your Handmade Products", description: "Upload photos, set prices, and describe your products. We handle product photography tips and SEO optimization for maximum visibility." },
  { icon: Wallet, title: "Earn & Grow", description: "Receive payouts to your bank account once your balance reaches Rs. 10,000. Track your earnings, manage orders, and grow your business with our seller tools." },
];

const faqs = [
  { q: "How does the escrow payment system work?", a: "When you place an order, your payment is held securely by Kandyam. The artisan ships your product, and funds are only released to them once you confirm satisfactory receipt. This protects both buyers and sellers." },
  { q: "How long does shipping take?", a: "Domestic shipping (within Sri Lanka) takes 2-5 business days. International shipping typically takes 7-21 business days depending on the destination country and shipping method selected." },
  { q: "What is Kandyam's commission on sales?", a: "Kandyam takes a 20% commission on each sale. Artisans keep 80% of the sale price. There are no hidden fees, listing fees, or monthly charges." },
  { q: "Can I return a product if I'm not satisfied?", a: "Yes. We have a 7-day return policy for most products. Items must be unused and in original packaging. Custom orders and digital items are non-returnable." },
  { q: "How do I know the products are genuinely handmade?", a: "Every vendor on Kandyam goes through a verification process. We require photos of the workshop, craft process documentation, and verification documents. Products are reviewed before being published." },
  { q: "How are artisans paid?", a: "Artisans receive payouts to their registered Sri Lankan bank account once their balance reaches Rs. 10,000. Payouts are processed within 5 working days. You can track all earnings, commissions, and payout history from your vendor dashboard." },
  { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, and local bank transfers through PayHere, Sri Lanka's leading payment gateway. All transactions are processed securely in Sri Lankan Rupees (LKR)." },
  { q: "Is there customer support available?", a: "Absolutely. We offer 24/7 AI chat support plus human support during business hours (Mon-Fri, 9 AM - 6 PM IST). Vendors get dedicated WhatsApp support." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-text-900 md:text-5xl">How It Works</h1>
          <p className="mt-4 text-lg text-muted-600">A fair, transparent marketplace connecting Sri Lankan artisans with the world.</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5">
            <BadgeCheck className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">For Buyers</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-text-900">Find Your Perfect Handmade Treasure</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {buyerSteps.map((step, i) => (
              <div key={step.title} className="relative rounded-xl bg-surface-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-400 text-sm font-bold text-text-900">
                  {i + 1}
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 inline-flex items-center rounded-full bg-muted-50 px-4 py-1.5">
            <BadgeCheck className="mr-2 h-4 w-4 text-muted-600" />
            <span className="text-sm font-medium text-muted-700">For Sellers</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-text-900">Turn Your Craft Into Income</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {sellerSteps.map((step, i) => (
              <div key={step.title} className="relative rounded-xl bg-white p-6 shadow-soft-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted-600 text-white">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-400 text-sm font-bold text-text-900">
                  {i + 1}
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">Frequently Asked Questions</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-text-200 bg-surface-50">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left text-sm font-medium text-text-800">
                  {faq.q}
                  <svg className="h-5 w-5 shrink-0 text-muted-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-muted-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-900">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-muted-600">Whether you&apos;re buying or selling, Kandyam makes it simple.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/products" className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 sm:w-auto">Start Shopping</Link>
            <Link href="/sign-up/vendor" className="inline-flex w-full items-center justify-center rounded-lg border border-primary-300 px-8 py-3.5 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-50 sm:w-auto">Start Selling</Link>
          </div>
        </div>
      </section>
    </>
  );
}
