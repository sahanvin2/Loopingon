import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Kandyam shipping policy. Domestic and international shipping times, costs, tracking, free shipping conditions, and customs information for Sri Lankan handmade crafts.",
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
            <p>All products on Kandyam are handmade, which means each item is crafted with care. After you place an order, the artisan needs time to prepare, package, and hand over your item to the courier.</p>
            <ul>
              <li>Ready-to-ship items: 1-3 business days processing</li>
              <li>Made-to-order items: 3-10 business days processing (as noted on product page)</li>
              <li>Custom orders: Processing time agreed between buyer and vendor</li>
            </ul>
          </section>

          <section>
            <h2>Domestic Shipping (Sri Lanka)</h2>
            <p>We primarily use Koombiyo for all domestic deliveries, offering reliable island-wide service. For urgent deliveries, an express option is available. All orders are Cash on Delivery.</p>
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
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">SL Post</td><td className="border border-text-200 px-4 py-2">All Sri Lanka</td><td className="border border-text-200 px-4 py-2">1-3 business days</td><td className="border border-text-200 px-4 py-2">Dynamic (calculated at checkout based on item)</td></tr>
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">Express Courier</td><td className="border border-text-200 px-4 py-2">Island-wide</td><td className="border border-text-200 px-4 py-2">Next business day</td><td className="border border-text-200 px-4 py-2">Up to Rs. 600</td></tr>
                  <tr><td className="border border-text-200 px-4 py-2 font-medium">Free Delivery</td><td className="border border-text-200 px-4 py-2">All Sri Lanka</td><td className="border border-text-200 px-4 py-2">1-3 business days</td><td className="border border-text-200 px-4 py-2">Free (orders over Rs. 5,000)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-500">Shipping costs may vary based on product weight and dimensions. Additional weight above 1kg is charged at Rs. 50 per kg for SL Post.</p>
          </section>

          <section>
            <h2>International Shipping</h2>
            <p>We ship to over 35 countries worldwide. International shipping is handled by DHL, FedEx, and Sri Lanka Post EMS.</p>
            <ul>
              <li><strong>South Asia (India, Maldives, Bangladesh):</strong> 5-10 business days</li>
              <li><strong>Middle East (UAE, Qatar, Saudi Arabia):</strong> 7-12 business days</li>
              <li><strong>Europe (UK, Germany, France, etc.):</strong> 10-18 business days</li>
              <li><strong>North America (USA, Canada):</strong> 10-21 business days</li>
              <li><strong>Australia & New Zealand:</strong> 10-18 business days</li>
            </ul>
            <p className="mt-3">Shipping costs are calculated at checkout based on destination, package weight, dimensions, and shipping method.</p>
          </section>

          <section>
            <h2>Tracking</h2>
            <p>All shipments include tracking. Once your order ships, you will receive an email with your tracking number and a link to track your package. You can also view tracking information in your account under &quot;My Orders.&quot;</p>
          </section>

          <section>
            <h2>Free Shipping</h2>
            <p>Free domestic shipping is automatically applied to orders over Rs. 5,000. Some vendors also offer free shipping on specific products — look for the &quot;Free Shipping&quot; badge on product pages. International orders do not qualify for free shipping due to high courier costs.</p>
          </section>

          <section>
            <h2>Customs, Duties & Taxes</h2>
            <p>International orders may be subject to customs duties, import taxes, and handling fees imposed by the destination country. These charges are the buyer&apos;s responsibility. Kandyam is not responsible for delays caused by customs clearance. Please check your country&apos;s import regulations and duty thresholds before ordering.</p>
            <p className="mt-3">We declare the actual purchase value on customs forms as required by law. We cannot mark items as &quot;gifts&quot; or undervalue them.</p>
          </section>

          <section>
            <h2>Delayed or Lost Packages</h2>
            <p>If your package hasn&apos;t arrived within the estimated timeframe, first check the tracking information. If the tracking shows no movement for 7+ days, contact us at support@kandyam.com. We will investigate with the courier and arrange a replacement or refund if the package is confirmed lost.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
