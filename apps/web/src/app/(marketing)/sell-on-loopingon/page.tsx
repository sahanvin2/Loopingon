import Image from "next/image";
import Link from "next/link";
import { Globe, Gift, Store, Megaphone, Shield, MessageCircle, Lock, TrendingUp, DollarSign } from "lucide-react";

export const metadata = {
  title: "Sell on Loopingon - Turn Your Craft Into Income",
  description: "Join 4,500+ Sri Lankan artisans selling handmade crafts on Loopingon. 80% profit to you, global customer reach, free store setup, and dedicated support.",
  openGraph: {
    title: "Sell on Loopingon - Turn Your Craft Into Income",
    description: "Join 4,500+ Sri Lankan artisans selling handmade crafts on Loopingon. Keep 80% of your earnings.",
  },
};

const benefits = [
  { icon: DollarSign, title: "80% Profit to You", description: "Keep the vast majority of your earnings. Only a 20% commission — no hidden fees, listing charges, or monthly subscriptions." },
  { icon: Globe, title: "Global Customer Reach", description: "Your crafts reach customers in 35+ countries. We handle international marketing, SEO, and translation so you can focus on creating." },
  { icon: Store, title: "Free Store Setup", description: "Create your storefront at zero cost. Customize your banner, add your story, showcase your workshop — all included." },
  { icon: Megaphone, title: "Marketing & Promotion", description: "Your products appear in our featured sections, email campaigns, and social media promotions. We invest in driving traffic to your store." },
  { icon: Shield, title: "Secure Fortnight Payouts", description: "Get paid directly to your Sri Lankan bank account every two weeks. Transparent earnings dashboard with full transaction history." },
  { icon: MessageCircle, title: "Dedicated WhatsApp Support", description: "Have questions? Reach our vendor support team directly via WhatsApp. Fast, personal help when you need it." },
];

const successStories = [
  {
    name: "Sunil Perera",
    craft: "Wood Carving - Moratuwa",
    image: "/images/artisans/artisan-1.jpg",
    story: "Before Loopingon, I sold only at local fairs. Now my hand-carved ebony elephants are in homes in Australia, Canada, and Germany. My income has tripled.",
    earnings: "රු 2.4M+ earned",
    orders: "320+ orders",
  },
  {
    name: "Kumudini Jayawardena",
    craft: "Batik Artist - Galle",
    image: "/images/artisans/artisan-2.jpg",
    story: "Loopingon gave me the confidence to quit my day job and pursue batik full-time. The platform handles everything so I can focus on what I love.",
    earnings: "රු 1.8M+ earned",
    orders: "250+ orders",
  },
  {
    name: "Mohamed Rizwan",
    craft: "Brass Work - Kandy",
    image: "/images/artisans/artisan-3.jpg",
    story: "My family has been doing brass work for four generations. Through Loopingon, our traditional oil lamps now light homes across the world.",
    earnings: "රු 3.1M+ earned",
    orders: "400+ orders",
  },
];

export default function SellOnLoopingonPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-text-900">
        <div className="absolute inset-0">
          <Image src="/images/sell/artisan-working.jpg" alt="Sri Lankan artisan at work" fill className="object-cover opacity-40" priority sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Turn Your Craft Into Income
            </h1>
            <p className="mt-6 text-lg text-surface-200">
              Join 4,500+ Sri Lankan artisans already selling on Loopingon. Keep 80% of your
              earnings, reach customers worldwide, and grow your craft business.
            </p>
            <Link
              href="/sign-up/vendor"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-400 px-8 py-3.5 text-sm font-bold text-text-900 shadow-soft transition-all hover:bg-accent-500"
            >
              Apply Now
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900 md:text-4xl">
            Why Sell on Loopingon?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl bg-white p-6 shadow-soft-sm transition-shadow hover:shadow-soft">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <b.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-900">Transparent Commission</h2>
              <p className="mt-4 text-lg text-muted-600">No hidden fees. No surprises. Just a simple, fair model.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-muted-200 bg-muted-50 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted-100">
                    <TrendingUp className="h-7 w-7 text-muted-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-muted-700">80%</p>
                    <p className="text-sm text-muted-600">Goes directly to you</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-text-200 bg-text-50 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-text-100">
                    <Lock className="h-7 w-7 text-text-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-700">20%</p>
                    <p className="text-sm text-text-500">Platform commission (marketing, payment, support)</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  "No listing fees — list unlimited products for free",
                  "No monthly subscription or hidden charges",
                  "Fortnightly payouts directly to your bank account",
                  "Full transparency: track every transaction in real-time",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-muted-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    <span className="text-sm text-muted-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 p-10 text-white">
              <div className="relative z-10">
                <p className="text-lg font-medium text-surface-200">For example</p>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span>Product sold for</span>
                    <span className="font-bold">රු 10,000</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span>Loopingon commission (20%)</span>
                    <span className="font-bold text-accent-300">- රු 2,000</span>
                  </div>
                  <div className="flex justify-between pt-2 text-xl">
                    <span className="font-bold">You receive</span>
                    <span className="font-bold">රු 8,000</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-accent-400/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">Artisan Success Stories</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {successStories.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-xl bg-white shadow-soft-sm">
                <div className="relative aspect-[4/3] bg-muted-200">
                  <Image src={s.image} alt={s.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <div className="mb-2 inline-block rounded-full bg-muted-50 px-3 py-1 text-xs font-medium text-muted-700">{s.craft}</div>
                  <h3 className="font-serif text-xl font-bold text-text-900">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-600">{s.story}</p>
                  <div className="mt-4 flex gap-4 border-t border-text-100 pt-4 text-sm">
                    <span className="font-semibold text-primary-600">{s.earnings}</span>
                    <span className="text-muted-500">{s.orders}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">Ready to Start Selling?</h2>
          <p className="mt-4 text-lg text-primary-200">
            Join thousands of Sri Lankan artisans who have found their global audience on Loopingon.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up/vendor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-primary-600 shadow-soft transition-all hover:bg-surface-50 sm:w-auto"
            >
              Apply Now
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-lg border border-primary-400 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 sm:w-auto"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
