import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Kandiyam shipping policy — Koombiyo delivery, Cash on Delivery, shipping costs, and tracking information for Sri Lanka.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Shipping Policy</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Processing Time</h2>
            <p>After you place an order, the seller prepares, packages, and hands over your item to our delivery partner.</p>
            <ul>
              <li>Ready-to-ship items: 1-3 business days processing</li>
              <li>Made-to-order items: 3-10 business days processing (as noted on product page)</li>
              <li>Custom orders: Processing time agreed between buyer and seller</li>
            </ul>
          </section>

          <section>
            <h2>Domestic Shipping (Sri Lanka)</h2>
            <p>We partner with <strong>Koombiyo</strong> for all domestic deliveries — reliable island-wide service with Cash on Delivery. Every order is COD — you pay only when your package arrives.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50">
                    <th className="border border-text-200 px-4 py-2 font-semibold text-text-800">Method</th>
                    <th className="border border-text-200 px-4 py-2 font-semibold text-text-800">Coverage</th>
                    <th className="border border-text-200 px-4 py-2 font-semibold text-text-800">Time</th>
                    <th className="border border-text-200 px-4 py-2 font-semibold text-text-800">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">Koombiyo Standard</td><td className="border border-text-200 px-4 py-2">Island-wide</td><td className="border border-text-200 px-4 py-2">1-3 business days</td><td className="border border-text-200 px-4 py-2">Rs. 400</td></tr>
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">Koombiyo Express</td><td className="border border-text-200 px-4 py-2">Island-wide</td><td className="border border-text-200 px-4 py-2">Next business day</td><td className="border border-text-200 px-4 py-2">Rs. 600 - 650</td></tr>
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">Free Delivery</td><td className="border border-text-200 px-4 py-2">Island-wide</td><td className="border border-text-200 px-4 py-2">1-3 business days</td><td className="border border-text-200 px-4 py-2"><span className="text-green-600 font-semibold">FREE</span> (orders over Rs. 5,000)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Cash on Delivery</h2>
            <p>All orders on Kandiyam are <strong>Cash on Delivery (COD)</strong>. No online payment is required. You pay in cash only when the Koombiyo courier delivers your package to your doorstep. Please have the exact amount ready for a smooth delivery experience.</p>
          </section>

          <section>
            <h2>Tracking</h2>
            <p>All shipments include tracking via Koombiyo. Once your order ships, you will receive an SMS and email with your tracking number. You can also view tracking information in your account under &quot;My Orders.&quot;</p>
          </section>

          <section>
            <h2>Free Delivery</h2>
            <p>Free delivery is automatically applied to orders over Rs. 5,000. You'll see the free delivery option at checkout — no code needed.</p>
          </section>

          <section>
            <h2>Delayed or Lost Packages</h2>
            <p>If your package hasn&apos;t arrived within the estimated timeframe, first check the tracking information. If the tracking shows no movement for 7+ days, contact us at support@kandyam.com. We will investigate with Koombiyo and arrange a replacement or refund if the package is confirmed lost.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
