import React from "react";
import Link from "next/link";
import { Gift, DollarSign, Share2, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Referral Program | Kandyam",
  description: "Share Kandyam with your friends and earn a 5% commission on their first purchase.",
};

export default function ReferralPortalPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-dots.svg')] bg-repeat" />
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-2xl">
            <Badge className="bg-primary-500/20 text-primary-300 border-primary-500/30 mb-6">Kandyam Referral Program</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Share the Beauty of Sri Lanka, <span className="text-primary-400">Earn 5% Cash</span>
            </h1>
            <p className="text-lg text-accent-100 mb-8 max-w-xl">
              Invite your friends to discover authentic Sri Lankan handcrafted goods. When they make a purchase, you earn a 5% cash commission on their order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/referrals/join" className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                Join Program Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-muted-600 max-w-2xl mx-auto">Start earning in three simple steps. There&apos;s no limit to how much you can earn.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">1. Share Your Link</h3>
              <p className="text-muted-600">Get your unique referral link from your dashboard and share it with friends, family, or your followers.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">2. They Shop</h3>
              <p className="text-muted-600">Your friends click your link and discover beautiful handmade goods from Sri Lankan artisans.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">3. You Earn 5%</h3>
              <p className="text-muted-600">When they buy, you get 5% of their order value credited to your account. Generate Rs. 200,000 in referred sales to reach the Rs. 10,000 withdrawal threshold.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 bg-surface-100 border-t border-accent-200">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-8 text-center">Program Details</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-accent-100 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
              <div>
                <h4 className="font-bold text-text-900 mb-1">Minimum Withdrawal</h4>
                <p className="text-sm text-muted-600">You can request a payout to your bank account once your balance reaches Rs. 10,000. We set this threshold to minimize bank fees and taxes.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-accent-100 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
              <div>
                <h4 className="font-bold text-text-900 mb-1">Fast Payouts</h4>
                <p className="text-sm text-muted-600">Once requested, payouts are processed and sent to your bank account within 5 working days.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-accent-100 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
              <div>
                <h4 className="font-bold text-text-900 mb-1">Return Window Policy</h4>
                <p className="text-sm text-muted-600">Commissions remain &apos;pending&apos; during the 7-day return window. If the referred customer returns or refunds the item, the commission will be reversed.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/referral-terms" className="text-primary-600 hover:text-primary-700 font-medium underline">
              Read the full Referral Terms & Conditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inline Badge component for this static page
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className || ""}`}>
      {children}
    </span>
  );
}
