import Image from "next/image";
import Link from "next/link";
import { Globe, Gift, Store, Megaphone, Shield, MessageCircle, Lock, TrendingUp, DollarSign, CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sell on Kandyam - Turn Your Passion Into Income",
  description: "Join thousands of sellers on Kandyam. 80% profit to you, global customer reach, free store setup, and dedicated support.",
  openGraph: {
    title: "Sell on Kandyam - Turn Your Passion Into Income",
    description: "Join thousands of sellers on Kandyam. Keep 80% of your earnings.",
  },
};

const benefits = [
  { icon: DollarSign, title: "90% Profit to You", description: "Keep the vast majority of your earnings. Only a 10% commission — no hidden fees, listing charges, or monthly subscriptions." },
  { icon: Globe, title: "Global Customer Reach", description: "Your products reach customers everywhere. We handle marketing, SEO, and visibility so you can focus on your business." },
  { icon: Store, title: "Free Store Setup", description: "Create your storefront at zero cost. Customize your banner, add your story, and showcase your products — all included." },
  { icon: Megaphone, title: "Marketing & Promotion", description: "Your products appear in our featured sections, email campaigns, and social media promotions. We invest in driving traffic to your store." },
  { icon: Shield, title: "Secure Fortnight Payouts", description: "Get paid directly to your registered bank account every two weeks. Transparent earnings dashboard with full transaction history." },
  { icon: MessageCircle, title: "Dedicated WhatsApp Support", description: "Have questions? Reach our vendor support team directly via WhatsApp. Fast, personal help when you need it." },
];

const steps = [
  { step: "01", title: "Apply for a Store", description: "Fill out our simple application form. We review all applications within 24 hours to ensure high quality on our marketplace." },
  { step: "02", title: "Set Up Your Shop", description: "Customize your store profile, upload your logo, and tell your unique brand story to connect with buyers." },
  { step: "03", title: "List Your Digital Products", description: "Upload your digital assets, write detailed descriptions, and set your prices. Listing is always 100% free." },
  { step: "04", title: "Automated Instant Delivery", description: "We market your products. When a customer buys, our platform securely and instantly delivers the license key or file to them." },
];

const faqs = [
  { q: "Are there any listing fees?", a: "No, listing digital products on Kandyam is completely free. You can list as many products as you want without ever paying a listing fee." },
  { q: "When do I get paid?", a: "Payments are processed every fortnight (14 days) directly to your bank account, provided your balance exceeds Rs. 10,000." },
  { q: "What can I sell?", a: "Kandyam is for premium digital products, including software licenses, video games, digital gift cards, and templates." },
  { q: "Do I need to handle delivery?", a: "No, Kandyam handles secure, instant digital delivery of all your sold files and license keys to the buyer automatically." },
];

export default function SellOnKandyamPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-text-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-navy-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Monetize Your <br />
              <span className="text-primary-300">Digital Assets.</span>
            </h1>
            <p className="mt-6 text-lg text-surface-200">
              Join thousands of digital creators on Kandyam. Keep 80% of your
              earnings, reach gamers and software users globally, and grow your digital business today.
            </p>
            <Link
              href="/sign-up/vendor"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-400 px-8 py-4 text-sm font-bold text-text-900 shadow-soft transition-all hover:bg-accent-500 hover:-translate-y-1"
            >
              Start Your Free Shop
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-primary-900 py-8 text-white border-y border-primary-800">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap justify-between items-center gap-8 text-center sm:text-left">
          <div>
            <p className="text-3xl font-bold font-serif">80%</p>
            <p className="text-primary-200 text-sm">Profit to Seller</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif">0</p>
            <p className="text-primary-200 text-sm">Listing Fees</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif">Global</p>
            <p className="text-primary-200 text-sm">Customer Reach</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif">24/7</p>
            <p className="text-primary-200 text-sm">Seller Support</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">
              Why Independent Sellers Choose Kandyam
            </h2>
            <p className="mt-4 text-muted-600">We built our platform from the ground up to support independent sellers. No hidden rules, just tools to help you succeed.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-white p-8 shadow-soft-sm transition-all hover:shadow-soft-lg hover:-translate-y-1">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-800">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-24 border-y border-surface-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-600">Getting started is easier than you think. You can have your shop up and running today.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-bold text-surface-200 mb-4">{s.step}</div>
                <h3 className="font-serif text-xl font-bold text-text-900 mb-2">{s.title}</h3>
                <p className="text-muted-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="bg-surface-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">Transparent & Fair Commission</h2>
              <p className="mt-4 text-lg text-muted-600 leading-relaxed">We only make money when you make a sale. Our straightforward 20% commission covers everything from secure digital delivery to payment processing.</p>
              
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-6 rounded-2xl border border-muted-200 bg-white p-6 shadow-soft-sm">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <TrendingUp className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-text-900">80%</p>
                    <p className="font-medium text-muted-600">Goes directly to your bank account</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 rounded-2xl border border-text-200 bg-text-50 p-6 shadow-soft-sm">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white">
                    <Lock className="h-8 w-8 text-text-700" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-text-900">20%</p>
                    <p className="font-medium text-text-700">Platform commission</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  "No listing fees ever",
                  "No monthly subscriptions",
                  "Secure fortnight payouts",
                  "Transparent dashboard",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="font-medium text-text-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-primary-900 p-10 text-white shadow-soft-xl">
              <div className="relative z-10 flex flex-col h-full justify-center">
                <p className="text-xl font-medium text-primary-200 mb-8 font-serif">Earnings Example</p>
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="text-lg">Product Sale Price</span>
                    <span className="text-xl font-bold">Rs. 10,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="text-lg text-primary-200">Kandyam Fee (20%)</span>
                    <span className="text-xl font-bold text-primary-300">- Rs. 2,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-bold font-serif">You Receive</span>
                    <span className="text-3xl font-bold text-accent-300">Rs. 8,000</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-surface-200 bg-surface-50 p-8 hover:border-primary-200 transition-colors">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-6 w-6 text-primary-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-text-900 text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-600 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-400 via-primary-600 to-primary-800" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-4xl font-bold md:text-5xl">Ready to open your shop?</h2>
          <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Join the premium marketplace for independent sellers. Setup is free, and you can start listing products immediately.
          </p>
          <Link
            href="/sign-up/vendor"
            className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-primary-700 shadow-soft-xl transition-all hover:bg-surface-50 hover:scale-105 hover:shadow-primary"
          >
            Apply to Sell Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
