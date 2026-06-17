import { Metadata } from "next";
import { HelpCircle, Package, RefreshCw, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Kandyan",
  description: "Find answers to common questions about buying and selling on Kandyan.",
};

const FAQ_CATEGORIES = [
  {
    title: "Orders & Shipping",
    icon: <Package className="w-6 h-6 text-primary-500" />,
    faqs: [
      { q: "How long does delivery take?", a: "Standard delivery takes 1-3 business days island-wide. Some custom or made-to-order items may require an additional processing time which is stated on the product page." },
      { q: "Do you ship internationally?", a: "Currently, Kandyan operates exclusively within Sri Lanka. However, we are actively working on expanding to international shipping in the near future." },
      { q: "How can I track my order?", a: "Once your order is shipped, you will receive an SMS and email with the tracking link. You can also view the status from your Dashboard > Orders page." }
    ]
  },
  {
    title: "Returns & Refunds",
    icon: <RefreshCw className="w-6 h-6 text-teal-500" />,
    faqs: [
      { q: "What is your return policy?", a: "We offer a 7-day easy return policy for most items. Items must be in their original packaging and unused. Custom-made items cannot be returned unless they arrived damaged." },
      { q: "How do I request a refund?", a: "Go to your Orders page, select the specific order, and click 'Request Return'. Our support team will process it within 24 hours." },
      { q: "What if my item arrives damaged?", a: "Please take a clear photo of the damaged item and packaging, and submit a return request immediately. We will arrange a free replacement or a full refund." }
    ]
  },
  {
    title: "Payments",
    icon: <CreditCard className="w-6 h-6 text-blue-500" />,
    faqs: [
      { q: "Is it safe to pay online?", a: "Yes, absolutely! We use PayHere as our payment gateway, which is highly secure and fully compliant with Central Bank regulations in Sri Lanka." },
      { q: "Do you offer Cash on Delivery (COD)?", a: "No, currently we only accept online payments via Card, Bank Transfer, or mobile wallets to ensure security for both buyers and artisans." },
      { q: "Can I use multiple promo codes?", a: "Only one promo code can be applied per order. However, loyalty discounts can sometimes be stacked with specific store promotions depending on the artisan." }
    ]
  },
  {
    title: "Safety & Authenticity",
    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
    faqs: [
      { q: "Are all products genuinely handmade?", a: "Yes! Every single artisan on Kandyan goes through a strict verification process to ensure their products are authentically handmade or crafted locally." },
      { q: "How are sellers vetted?", a: "We verify the national identity and business registration of our sellers, and review their production processes before they are allowed to list items on Kandyan." }
    ]
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-surface-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-900 mb-6 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Questions</span>
          </h1>
          <p className="text-lg text-muted-600 max-w-2xl mx-auto">
            Everything you need to know about buying, shipping, and returns on Kandyan. Can't find the answer you're looking for? <Link href="/contact" className="text-primary-600 font-medium hover:underline">Contact our support team.</Link>
          </p>
        </div>

        <div className="space-y-12">
          {FAQ_CATEGORIES.map((category, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-accent-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center shrink-0">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-serif text-text-900">{category.title}</h2>
              </div>
              
              <div className="space-y-6">
                {category.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="border-b border-accent-100 last:border-b-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-text-900 mb-3">{faq.q}</h3>
                    <p className="text-muted-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 bg-gradient-to-br from-primary-900 to-indigo-900 rounded-3xl text-white">
          <h2 className="text-2xl font-serif mb-4">Still have questions?</h2>
          <p className="text-primary-100 mb-8 max-w-md mx-auto">Our dedicated support team is here to help you with anything you need.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-white text-primary-900 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg">
              Contact Support
            </Link>
            <Link href="/dashboard/messages" className="px-8 py-3 bg-primary-800 border border-primary-700 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
              Message an Artisan
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
