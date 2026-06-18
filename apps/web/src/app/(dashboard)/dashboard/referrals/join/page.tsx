"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  DollarSign,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Shield,
  TrendingUp,
  Clock,
  Building,
  CreditCard,
  User,
  Hash,
  MapPin,
} from "lucide-react";
import { post } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const STEPS = ["Welcome", "Terms", "Payout", "Share"];

const BENEFITS = [
  {
    icon: DollarSign,
    title: "5% Commission",
    description: "Earn 5% on every purchase made by someone you refer. No cap on earnings.",
  },
  {
    icon: TrendingUp,
    title: "Unlimited Referrals",
    description: "Share your link with as many people as you want. The more you refer, the more you earn.",
  },
  {
    icon: Shield,
    title: "Secure Tracking",
    description: "Every click and sign-up is tracked. You can see exactly who signed up through your link.",
  },
  {
    icon: Clock,
    title: "Easy Withdrawals",
    description: "Withdraw when your balance reaches Rs. 10,000 (Rs. 200,000 in referred sales at 5%). Processed within 5 working days.",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description: "Share via WhatsApp, Facebook, email, or just copy your unique link. Works everywhere.",
  },
  {
    icon: Gift,
    title: "Exclusive Rewards",
    description: "Top referrers get access to exclusive seller previews, early sale access, and special discounts.",
  },
];

const TERMS_SECTIONS = [
  {
    title: "1. Referral Commission",
    content:
      "You will earn a 5% commission on the total purchase value (excluding tax and shipping) of every order placed by a customer you referred. Commission is calculated on the product subtotal only. There is no maximum cap on total earnings.",
  },
  {
    title: "2. Referral Attribution",
    content:
      "A referral is attributed to you when a new customer signs up using your unique referral link or enters your referral code during registration. Attribution lasts for 30 days from the first click on your link. If the same customer clicks another referrer's link, the most recent click takes priority.",
  },
  {
    title: "3. Commission Payouts",
      content:
        "Commission earnings are held in your referral balance. You may request a payout once your balance reaches Rs. 10,000 — this threshold helps reduce banking fees and government taxes on small transactions. Payouts are processed within 5 working days to the bank account you provide. A valid bank account with your name is required for withdrawal.",
  },
  {
    title: "4. Commission Reversal",
    content:
      "If a referred customer returns or cancels their order within the 7-day return window, the corresponding commission will be deducted from your referral balance. If your balance goes negative due to reversals, future earnings will offset the negative balance first.",
  },
  {
    title: "5. Prohibited Activities",
    content:
      "Self-referral (creating accounts to refer yourself) is strictly prohibited and will result in immediate termination from the program and forfeiture of all pending earnings. Spam, misleading advertising, or claiming to represent Kandyam officially without authorization is also prohibited. You may not use paid search advertising that includes Kandyam's trademark in the keywords.",
  },
  {
    title: "6. Referral Link Usage",
    content:
      "Your referral link is for personal, non-commercial use. You may share it on social media, blogs, messaging apps, and personal websites. You may not use your referral link on coupon or deal aggregation sites, or in any way that could damage Kandyam's brand reputation.",
  },
  {
    title: "7. Program Changes & Termination",
    content:
      "Kandyam reserves the right to modify the commission rate, minimum withdrawal amount, or any other program terms with 30 days notice. Kandyam may terminate your participation in the program for violation of these terms, with forfeiture of any unpaid earnings in cases of fraudulent activity.",
  },
];

const OCCASIONS = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Father's Day",
  "Mother's Day",
  "Baby Shower",
  "Housewarming",
  "Sinhala & Tamil New Year",
  "Vesak",
  "Christmas",
  "Valentine's Day",
  "Thank You",
  "Just Because",
  "Other",
];

export default function ReferralJoinPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    branch: "",
  });

  const handleNext = () => {
    if (step === 1 && !acceptedTerms) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    setError("");
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setTermsScrolledToBottom(true);
    }
  };

  const handleBankChange = (field: string, value: string) => {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  };

  const isBankFormValid = () => {
    return (
      bankDetails.bankName.trim().length >= 2 &&
      bankDetails.accountHolderName.trim().length >= 3 &&
      bankDetails.accountNumber.trim().length >= 6 &&
      bankDetails.branch.trim().length >= 2
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await post("/referrals/apply", {
        acceptedTerms: true,
        bankDetails: {
          bankName: bankDetails.bankName,
          accountHolderName: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          branch: bankDetails.branch,
        },
      });

      const data = res as any;
      setReferralCode(data.code || data.data?.code || "");
      setReferralLink(
        data.referralLink ||
          data.data?.referralLink ||
          `${window.location.origin}/sign-up?ref=${data.code || data.data?.code || ""}`,
      );
      setStep(3);
    } catch (err: any) {
      setError(err?.message || err?.data?.message || "Failed to join referral program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Join%20Kandyam,%20Sri%20Lanka's%20handcrafted%20marketplace!%20Use%20my%20code%20${referralCode}%20to%20get%20started.%20${encodeURIComponent(referralLink)}`,
      "_blank",
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-surface-50 py-8 sm:py-12"
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((label, idx) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                      idx < step
                        ? "bg-primary-500 text-white"
                        : idx === step
                          ? "bg-primary-500 text-white ring-4 ring-primary-100"
                          : "bg-surface-200 text-muted-400",
                    )}
                  >
                    {idx < step ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block transition-colors",
                      idx <= step ? "text-primary-600" : "text-muted-400",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-colors duration-300",
                      idx < step ? "bg-primary-500" : "bg-surface-200",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Welcome & Benefits */}
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-accent-200 p-6 sm:p-10 shadow-soft-lg"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6">
                  <Gift className="w-4 h-4" />
                  <span>Referral Program</span>
                </div>
                <h1 className="text-3xl font-serif font-bold text-navy-900 mb-4">
                  Earn While You Share
                </h1>
                <p className="text-lg text-text-600 max-w-lg mx-auto">
                  Join the Kandyam Referral Program and earn 5% commission on every purchase
                  made by someone you refer. Share Sri Lankan craftsmanship and get rewarded.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="p-5 rounded-xl border border-accent-100 hover:border-primary-200 hover:shadow-soft-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-text-900 mb-1 text-sm">{benefit.title}</h3>
                    <p className="text-xs text-text-500 leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Start Earning Now
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-muted-400 mt-3">Free to join · No commitments · Cancel anytime</p>
              </div>
            </motion.div>
          )}

          {/* Step 1: Terms & Conditions */}
          {step === 1 && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-accent-200 p-6 sm:p-10 shadow-soft-lg"
            >
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">
                Referral Program Terms
              </h2>
              <p className="text-sm text-text-500 mb-6">
                Please read and accept the terms below to join the Kandyam Referral Program.
              </p>

              <div
                onScroll={handleTermsScroll}
                className="h-80 overflow-y-auto rounded-xl border border-accent-200 bg-surface-50 p-6 mb-6 text-sm text-text-600 space-y-6 scrollbar-thin"
              >
                {TERMS_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-semibold text-text-900 mb-2">{section.title}</h3>
                    <p className="leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              {!termsScrolledToBottom && (
                <p className="text-xs text-amber-600 mb-4 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                  Please scroll to the bottom of the terms to continue
                </p>
              )}

              <label
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer",
                  acceptedTerms
                    ? "border-primary-300 bg-primary-50"
                    : "border-accent-200 hover:border-accent-300",
                )}
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={!termsScrolledToBottom}
                  className="mt-0.5 h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-text-700">
                  I have read and agree to the Kandyam Referral Program Terms &amp; Conditions. I understand that
                  commission is paid at 5% of referred purchases, with a minimum withdrawal of Rs. 10,000, and
                  that commissions may be reversed for returned orders.
                </span>
              </label>

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-600 hover:text-text-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!acceptedTerms}
                  className={cn(
                    "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors",
                    acceptedTerms
                      ? "bg-primary-600 text-white hover:bg-primary-700 shadow-md"
                      : "bg-surface-200 text-muted-400 cursor-not-allowed",
                  )}
                >
                  Accept &amp; Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payout Details */}
          {step === 2 && (
            <motion.div
              key="payout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-accent-200 p-6 sm:p-10 shadow-soft-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-navy-900">Payout Details</h2>
                  <p className="text-sm text-text-500">
                    Where should we send your earnings when they reach Rs. 10,000?
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
                  Your bank details are securely stored and only used for commission payouts. Withdrawals are
                  available when your balance reaches Rs. 10,000 (equivalent to Rs. 200,000 in referred sales)
                  and are processed within 5 working days.
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1.5">
                    Bank Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => handleBankChange("bankName", e.target.value)}
                      placeholder="e.g., Bank of Ceylon, Commercial Bank"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1.5">
                    Account Holder Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
                    <input
                      type="text"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => handleBankChange("accountHolderName", e.target.value)}
                      placeholder="Must match your Kandyam account"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1.5">
                    Account Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => handleBankChange("accountNumber", e.target.value)}
                      placeholder="Enter your bank account number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1.5">
                    Branch <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
                    <input
                      type="text"
                      value={bankDetails.branch}
                      onChange={(e) => handleBankChange("branch", e.target.value)}
                      placeholder="e.g., Colombo Fort, Kandy City Centre"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-600 hover:text-text-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isBankFormValid() || loading}
                  className={cn(
                    "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors",
                    isBankFormValid() && !loading
                      ? "bg-primary-600 text-white hover:bg-primary-700 shadow-md"
                      : "bg-surface-200 text-muted-400 cursor-not-allowed",
                  )}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Share Your Link (Confirmation) */}
          {step === 3 && (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-accent-200 p-6 sm:p-10 shadow-soft-lg text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">
                You're All Set!
              </h2>
              <p className="text-text-600 mb-8 max-w-md mx-auto">
                Your referral account is active. Share your unique code and start earning 5% on every referred purchase.
              </p>

              <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-3">
                  Your Referral Code
                </h3>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <code className="px-6 py-3 bg-white/20 rounded-xl text-3xl font-mono font-bold tracking-widest">
                    {referralCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(referralCode)}
                    className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    aria-label="Copy code"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-white/70 break-all mb-6">{referralLink}</p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-5 py-2.5 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleShareFacebook}
                    className="px-5 py-2.5 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(referralLink)}
                    className="px-5 py-2.5 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/dashboard/referrals"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Go to Referral Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
