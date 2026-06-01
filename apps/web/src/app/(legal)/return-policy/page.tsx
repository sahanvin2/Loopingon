import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Loopingon's 7-day return policy. Learn about return conditions, the return process, refund timelines, damaged items policy, and exchange options.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-cream-100 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-charcoal-900">Return & Refund Policy</h1>
        <p className="mt-2 text-sm text-warm-gray-500">Last updated: June 2026</p>

        <div className="mt-8 rounded-xl bg-teal-50 border border-teal-200 p-6">
          <p className="text-sm font-semibold text-teal-800">7-Day Return Window</p>
          <p className="mt-1 text-sm text-teal-700">You have 7 days from the date of delivery to request a return. Items must be unused, in original condition, and in original packaging.</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-warm-gray-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-charcoal-900 [&_h3]:font-semibold [&_h3]:text-charcoal-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Return Conditions</h2>
            <p>To be eligible for a return, your item must meet the following criteria:</p>
            <ul>
              <li>Item is unused and in the same condition that you received it</li>
              <li>Item is in its original packaging with all tags and labels attached</li>
              <li>Return request is initiated within 7 days of delivery</li>
              <li>Proof of purchase (order number) is provided</li>
            </ul>
          </section>

          <section>
            <h2>Non-Returnable Items</h2>
            <p>The following items cannot be returned:</p>
            <ul>
              <li>Custom or personalized orders made specifically for you</li>
              <li>Made-to-order items where production has already begun</li>
              <li>Digital products and downloadable content</li>
              <li>Perishable goods (food items, spices, teas, incense)</li>
              <li>Items marked as &quot;Final Sale&quot; or &quot;Clearance&quot;</li>
              <li>Intimate or sanitary goods (for health/hygiene reasons)</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section>
            <h2>Return Process</h2>
            <ol className="mt-3 list-decimal pl-6 space-y-3">
              <li><strong>Initiate Return:</strong> Go to &quot;My Orders&quot; in your account, select the order, and click &quot;Request Return.&quot; Upload photos if the item arrived damaged.</li>
              <li><strong>Review:</strong> Our team reviews your request within 24 hours and may contact the vendor for additional information.</li>
              <li><strong>Approval:</strong> If approved, you&apos;ll receive return shipping instructions. Return shipping costs for defective/damaged items are covered by us. For change-of-mind returns, the buyer pays return shipping.</li>
              <li><strong>Ship Back:</strong> Ship the item back within 5 business days of approval. Keep your shipping receipt with tracking number.</li>
              <li><strong>Inspection:</strong> Once received, the vendor inspects the item within 2 business days.</li>
              <li><strong>Refund:</strong> Upon approval, refunds are processed within 3-5 business days to your original payment method.</li>
            </ol>
          </section>

          <section>
            <h2>Refund Timeline</h2>
            <ul>
              <li>Credit/Debit Cards: 3-5 business days</li>
              <li>PayPal: 1-3 business days</li>
              <li>Bank Transfer (Sri Lanka): 2-5 business days</li>
              <li>Store Credit: Instant</li>
            </ul>
            <p className="mt-3">Refunds are issued to the original payment method. If the original method is unavailable, store credit will be issued.</p>
          </section>

          <section>
            <h2>Damaged or Defective Items</h2>
            <p>If your item arrives damaged, take clear photos of the damaged item and packaging immediately upon delivery. Contact us within 48 hours via the order page or support@loopingon.com. We will arrange a full refund or replacement (including all shipping costs) at no cost to you.</p>
          </section>

          <section>
            <h2>Exchange Policy</h2>
            <p>If you received a defective or damaged item and would prefer a replacement rather than a refund, select &quot;Exchange&quot; when initiating your return. Exchange availability depends on the vendor&apos;s current stock. Exchanges for size or color preference are at the vendor&apos;s discretion.</p>
          </section>

          <section>
            <h2>Disputes</h2>
            <p>If you and the vendor cannot agree on a return resolution, Loopingon will mediate. Our decision is binding. Escrow funds will not be released to the vendor until the dispute is resolved.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
