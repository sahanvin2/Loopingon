import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Kandyam Terms of Service: Rules and guidelines for buying and selling Premium Products on our platform. Protect your rights as a buyer or seller.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:text-text-800 [&_h3]:mt-6 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Kandyam (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Platform. These Terms constitute a legally binding agreement between you and Kandyam (Pvt) Ltd, a company registered in Sri Lanka.</p>
          </section>

          <section>
            <h2>2. Account Terms</h2>
            <ul>
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity under your account.</li>
              <li>You must provide accurate, complete, and current information.</li>
              <li>One person or entity may maintain only one account unless authorized.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2>3. Buying Terms</h2>
            <h3>3.1 Order Placement</h3>
            <p>All orders are subject to acceptance by the vendor. Prices are listed in Sri Lankan Rupees (LKR) unless otherwise displayed in your chosen currency. We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud.</p>
            <h3>3.2 Payment</h3>
            <p>Payment is processed at the time of order. Funds are held in escrow until you confirm satisfactory receipt or the 7-day inspection period expires. This protects both buyers and sellers.</p>
            <h3>3.3 Inspection Period</h3>
            <p>You have 7 days from delivery to inspect your item and raise any issues. If no dispute is raised within 7 days, funds are automatically released to the vendor.</p>
          </section>

          <section>
            <h2>4. Selling Terms</h2>
            <h3>4.1 Eligibility</h3>
            <p>To sell on Kandyam, you must complete the vendor application process, including identity verification and craft documentation. We reserve the right to reject any application.</p>
            <h3>4.2 Product Requirements</h3>
            <ul>
              <li>All products must be premium or handcrafted, primarily by you or your team.</li>
              <li>Products must be accurately described with truthful images and details.</li>
              <li>Prohibited items include mass-produced goods, counterfeit items, weapons, drugs, and items illegal under Sri Lankan law.</li>
              <li>Vendors must maintain a minimum average rating of 3.0 stars.</li>
            </ul>
            <h3>4.3 Fulfillment</h3>
            <p>Vendors must ship orders within the stated processing time (typically 1-7 business days). Delays must be communicated to the buyer promptly. Repeated late shipments may result in account penalties.</p>
          </section>

          <section>
            <h2>5. Payments & Fees</h2>
            <h3>5.1 Platform Commission</h3>
            <p>Kandyam charges a 10% commission on each completed sale (including shipping fees). This is the only fee — there are no listing fees, subscription fees, or hidden charges.</p>
            <h3>5.2 Payouts</h3>
            <p>Vendor payouts are processed once your balance reaches Rs. 10,000 to registered Sri Lankan bank accounts. This equates to approximately Rs. 11,111 in sales (10% platform commission applied). The minimum threshold helps reduce per-transaction bank charges and government taxes. Payouts are processed within 5 working days of the threshold being met.</p>
            <h3>5.3 Refunds</h3>
            <p>In case of refunds, the platform commission is also refunded proportionally. Refunds are processed to the buyer&apos;s original payment method within 3-5 business days.</p>
          </section>

          <section>
            <h2>6. Disputes & Returns</h2>
            <p>Buyers may request returns within 7 days of delivery. Disputes are first mediated between buyer and vendor through our messaging system. If unresolved, Kandyam will review evidence from both parties and make a binding decision. See our <a href="/return-policy" className="text-primary-600 hover:underline">Return Policy</a> for full details.</p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>Vendors retain all rights to their product photos, descriptions, and brand assets. By listing on Kandyam, vendors grant us a limited license to display, market, and promote their products on the Platform and in marketing materials. See our <a href="/intellectual-property" className="text-primary-600 hover:underline">IP Policy</a>.</p>
          </section>

          <section>
            <h2>8. Prohibited Conduct</h2>
            <ul>
              <li>Harassing, threatening, or defrauding other users</li>
              <li>Listing prohibited or illegal items</li>
              <li>Creating fake accounts or reviews</li>
              <li>Circumventing the platform for off-platform transactions (&quot;fee avoidance&quot;)</li>
              <li>Attempting to breach platform security or scrape data</li>
              <li>Spam, phishing, or malware distribution</li>
            </ul>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>You may close your account at any time. We may suspend or terminate your account for violations of these Terms, with or without notice. Upon termination, pending orders will be completed or refunded at our discretion. Vendor payout balances will be settled within 30 days.</p>
          </section>

          <section>
            <h2>10. Disclaimers & Limitations</h2>
            <p>THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE ARE NOT RESPONSIBLE FOR THE QUALITY, SAFETY, OR LEGALITY OF PRODUCTS LISTED BY VENDORS. OUR LIABILITY IS LIMITED TO THE AMOUNT OF FEES PAID BY YOU IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </section>

          <section>
            <h2>11. Governing Law</h2>
            <p>These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes shall be resolved exclusively in the courts of Colombo, Sri Lanka.</p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              Kandyam (Pvt) Ltd<br />
              42 Galle Road, Colombo 03, Sri Lanka<br />
              Email: legal@kandyam.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
