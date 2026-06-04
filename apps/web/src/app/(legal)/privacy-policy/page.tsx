import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Loopingon Privacy Policy: How we collect, use, and protect your personal information. GDPR compliant. Transparent data practices for our Sri Lankan craft marketplace.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-8 rounded-xl bg-surface-50 border border-accent-200 p-6">
          <h2 className="text-sm font-semibold text-accent-800 uppercase tracking-wide">Plain Language Summary</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-700">
            <li>We collect only the information needed to provide our marketplace services (name, email, shipping address, payment info).</li>
            <li>Your payment information is processed by PCI-compliant third parties — we never store full card numbers.</li>
            <li>We don&apos;t sell your personal data to anyone. Ever.</li>
            <li>You can request a copy of your data or ask us to delete it at any time.</li>
            <li>We use cookies to keep you logged in and improve your shopping experience.</li>
          </ul>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:text-text-800 [&_h3]:mt-6 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
          <section>
            <h2>1. Information We Collect</h2>
            <h3>1.1 Account Information</h3>
            <p>When you create an account, we collect your full name, email address, phone number (optional), and a hashed password. If you sign up via Google or Facebook, we receive your name and email from those providers.</p>
            <h3>1.2 Order Information</h3>
            <p>When you place an order, we collect your shipping address, billing address, phone number, and order details. Payment information is processed securely by our payment partners (Stripe, PayPal, local bank gateways) — we never store your full credit card number.</p>
            <h3>1.3 Vendor Information</h3>
            <p>For vendor applications, we collect business registration details, National ID, craft descriptions, workshop photos, and bank account information for payouts. These documents are stored securely and only accessible to our verification team.</p>
            <h3>1.4 Automatically Collected Information</h3>
            <p>We automatically collect your IP address, browser type, device information, pages visited, and referring URLs. This helps us improve our platform and detect fraud.</p>
          </section>

          <section>
            <h2>2. How We Use Information</h2>
            <ul>
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about orders, products, and promotions</li>
              <li>To verify vendor identities and maintain marketplace quality</li>
              <li>To improve our platform through analytics and user research</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
              <li>To prevent fraud, abuse, and security incidents</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We share your information only in these limited circumstances:</p>
            <ul>
              <li><strong>With vendors:</strong> When you place an order, the vendor receives your shipping address and phone number to fulfill your order.</li>
              <li><strong>With payment processors:</strong> Stripe, PayPal, and Sri Lankan bank gateways process your payments.</li>
              <li><strong>With shipping carriers:</strong> Domestic and international courier services receive your shipping address and phone number.</li>
              <li><strong>With service providers:</strong> Cloud hosting (AWS), email delivery (SendGrid), analytics (Google Analytics).</li>
              <li><strong>Legal compliance:</strong> If required by law, court order, or to protect our rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies & Tracking</h2>
            <p>We use essential cookies to keep you logged in and remember your cart. We also use analytics cookies (Google Analytics) and marketing pixels (Facebook Pixel) with your consent. See our <a href="/cookie-policy" className="text-primary-600 hover:underline">Cookie Policy</a> for details.</p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>We retain your personal data as long as your account is active. Inactive accounts are retained for 24 months before anonymization. Order records are retained for 7 years per Sri Lankan tax law. Vendor verification documents are retained for the duration of the vendor relationship plus 5 years.</p>
          </section>

          <section>
            <h2>6. Your Rights (GDPR Compliant)</h2>
            <p>Under applicable data protection laws, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (&quot;right to be forgotten&quot;)</li>
              <li>Restrict or object to processing</li>
              <li>Data portability (receive your data in a machine-readable format)</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>To exercise these rights, email privacy@loopingon.com.</p>
          </section>

          <section>
            <h2>7. Security</h2>
            <p>We implement industry-standard security measures including SSL/TLS encryption for all data transmission, encrypted data storage, access controls, and regular security audits. However, no method of electronic storage is 100% secure.</p>
          </section>

          <section>
            <h2>8. Children&apos;s Privacy</h2>
            <p>Loopingon is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal data, please contact us immediately.</p>
          </section>

          <section>
            <h2>9. International Transfers</h2>
            <p>Your data is stored on servers in Sri Lanka and Singapore. If you&apos;re accessing Loopingon from outside Sri Lanka, your data may be transferred across borders. We ensure appropriate safeguards (Standard Contractual Clauses) are in place for international transfers.</p>
          </section>

          <section>
            <h2>10. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We&apos;ll notify you of material changes via email or a notice on our website. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              Loopingon (Pvt) Ltd<br />
              42 Galle Road, Colombo 03, Sri Lanka<br />
              Email: privacy@loopingon.com<br />
              Phone: +94 11 234 5678
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
