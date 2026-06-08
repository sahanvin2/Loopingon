import React from "react";

export const metadata = {
  title: "Referral Terms | Kandyam",
  description: "Terms and conditions for the Kandyam Referral Program.",
};

export default function ReferralTermsPage() {
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-navy-900 mb-6">Referral Program Terms</h1>
        <div className="prose prose-navy max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-accent-100">
          <p className="text-muted-600 mb-8">Last Updated: June 2026</p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">1. Program Overview</h2>
          <p className="mb-4 text-text-700">
            The Kandyam Referral Program allows registered users ("Referrers") to earn promotional rewards by referring friends and followers ("Referees") to purchase handmade goods from Kandyam.lk.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">2. Earning Commissions</h2>
          <ul className="list-disc pl-6 mb-4 text-text-700 space-y-2">
            <li>Referrers will earn a <strong>5% commission</strong> on the total product price (excluding shipping and taxes) of a referred customer&apos;s first purchase.</li>
            <li>The referred customer must click on the Referrer&apos;s unique tracking link and complete a purchase.</li>
            <li>Self-referrals (referring yourself using a different email address) are strictly prohibited and will result in immediate termination of your account.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">3. Withdrawals and Payouts</h2>
          <ul className="list-disc pl-6 mb-4 text-text-700 space-y-2">
            <li>Referrers can request a payout only when their "Confirmed" balance reaches a minimum of <strong>Rs. 10,000</strong> (equivalent to Rs. 200,000 in referred sales at 5% commission). This threshold exists to minimize per-transaction bank fees and government taxes.</li>
            <li>All requested payouts are processed within <strong>5 working days</strong> to the bank account provided in the referral dashboard.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">4. Commission Reversals and Return Policy</h2>
          <p className="mb-4 text-text-700">
            Commissions are held in a "Pending" state until the product has been delivered and the 7-day return window has passed. If the referred customer returns the product or requests a refund during this 7-day window, the pending commission will be <strong>reversed</strong> and deducted from the Referrer&apos;s balance.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">5. Termination</h2>
          <p className="mb-4 text-text-700">
            Kandyam reserves the right to suspend or terminate a Referrer&apos;s participation in the program if we suspect fraudulent activity, spam, or violation of these Terms.
          </p>

          <div className="mt-12 p-6 bg-surface-50 rounded-xl border border-accent-200 text-sm text-muted-600">
            If you have questions about these terms, please contact us at hello@kandyam.lk.
          </div>
        </div>
      </div>
    </div>
  );
}
