import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Loopingon Cookie Policy: Types of cookies we use, third-party cookies, how to manage and disable cookies, and our cookie consent mechanism.",
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-cream-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-charcoal-900">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-charcoal-900 [&_h3]:font-semibold [&_h3]:text-charcoal-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_table]:w-full [&_table]:mt-4 [&_th]:border [&_th]:border-charcoal-200 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-cream-50 [&_th]:text-left [&_td]:border [&_td]:border-charcoal-200 [&_td]:px-4 [&_td]:py-2">
          <section>
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Cookies may be &quot;session cookies&quot; (deleted when you close your browser) or &quot;persistent cookies&quot; (remain until they expire or you delete them).</p>
          </section>

          <section>
            <h2>Types of Cookies We Use</h2>
            <table>
              <thead><tr><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
              <tbody>
                <tr><td><strong>Essential</strong></td><td>Required for core functionality: authentication, cart, checkout, security</td><td>Session / 30 days</td></tr>
                <tr><td><strong>Functional</strong></td><td>Remember your preferences: language, currency, recently viewed items</td><td>1 year</td></tr>
                <tr><td><strong>Analytics</strong></td><td>Understand how visitors use our site to improve the experience</td><td>2 years</td></tr>
                <tr><td><strong>Marketing</strong></td><td>Deliver relevant ads and measure campaign performance</td><td>90 days</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Third-Party Cookies</h2>
            <h3>Google Analytics</h3>
            <p>We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect anonymous usage data. You can opt out at <a href="https://tools.google.com/dlpage/gaoptout" className="text-rose-600 hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>.</p>
            <h3>Facebook Pixel</h3>
            <p>We use Facebook Pixel to measure the effectiveness of our advertising and to show relevant ads to people who have visited our site. You can manage your Facebook ad preferences in your Facebook account settings.</p>
            <h3>Stripe</h3>
            <p>Our payment processor Stripe uses cookies for fraud prevention and security. These are essential for processing payments securely.</p>
          </section>

          <section>
            <h2>How to Manage Cookies</h2>
            <h3>Browser Settings</h3>
            <p>Most browsers allow you to control cookies through settings. You can:</p>
            <ul>
              <li>View and delete existing cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Set cookies to be cleared when you close your browser</li>
            </ul>
            <h3>Disabling Cookies by Browser</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
            <p className="mt-3 rounded-lg bg-blush-50 border border-blush-200 p-4"><strong>Note:</strong> Blocking all cookies may prevent some features from working correctly, including the shopping cart, checkout, and account login.</p>
          </section>

          <section>
            <h2>Cookie Consent</h2>
            <p>When you first visit Loopingon, we show a cookie consent banner. Essential cookies are always active. You can accept or decline analytics and marketing cookies. You can change your preferences at any time by clicking &quot;Cookie Settings&quot; in the footer.</p>
          </section>

          <section>
            <h2>Updates</h2>
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
