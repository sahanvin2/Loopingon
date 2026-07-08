import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Kandyam Terms of Service: Rules and guidelines for buying and selling digital products on our platform. Protect your rights as a buyer or seller.",
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
            <p>By accessing or using Kandyam (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Platform. These Terms constitute a legally binding agreement between you and Kandyam Inc.</p>
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
            <p>All orders are subject to acceptance by the vendor. Prices are listed in USD unless otherwise displayed in your chosen currency. We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud.</p>
            <h3>3.2 Payment & Delivery</h3>
            <p>Payment is processed at the time of order. Digital products are delivered immediately upon successful payment verification. Funds are held in escrow to protect buyers.</p>
            <h3>3.3 Inspection Period</h3>
            <p>You have 7 days from purchase to inspect your digital item and raise any issues (e.g., file corruption, misrepresentation). If no dispute is raised, funds are released to the vendor.</p>
          </section>

          <section>
            <h2>4. Selling Terms</h2>
            <h3>4.1 Eligibility</h3>
            <p>To sell on Kandyam, you must complete the vendor application process, including identity verification and portfolio review. We reserve the right to reject any application.</p>
            <h3>4.2 Product Requirements</h3>
            <ul>
              <li>All products must be high-quality digital assets created by you or your team.</li>
              <li>Products must be accurately described with truthful previews and details.</li>
              <li>Prohibited items include stolen assets, malware, illegal content, and anything violating global copyright laws.</li>
              <li>Vendors must maintain a minimum average rating of 3.0 stars.</li>
            </ul>
            <h3>4.3 Delivery</h3>
            <p>Vendors must ensure all digital files are properly uploaded and accessible. Broken links or corrupted files may result in account penalties.</p>
          </section>

          <section>
            <h2>5. Payments & Fees</h2>
            <h3>5.1 Platform Commission</h3>
            <p>Kandyam charges a 10% commission on each completed sale. This is the only fee — there are no listing fees, subscription fees, or hidden charges.</p>
            <h3>5.2 Payouts</h3>
            <p>Vendor payouts are processed once your balance reaches $50 to your registered bank or PayPal account. Payouts are processed within 5 working days of the threshold being met.</p>
            <h3>5.3 Refunds</h3>
            <p>In case of refunds, the platform commission is also refunded proportionally. Refunds are processed to the buyer&apos;s original payment method within 3-5 business days.</p>
          </section>

          <section>
            <h2>6. Disputes & Returns</h2>
            <p>Buyers may request refunds within 7 days of purchase for valid reasons (e.g., defective files). Disputes are first mediated between buyer and vendor through our messaging system. If unresolved, Kandyam will review evidence from both parties and make a binding decision. See our <a href="/return-policy" className="text-primary-600 hover:underline">Refund Policy</a> for full details.</p>
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
            <p>These Terms are governed by global e-commerce standard laws. Any disputes shall be resolved exclusively through arbitration or applicable courts.</p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              Kandyam Inc.<br />
              Email: legal@kandyam.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
