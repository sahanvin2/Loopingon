import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Kandyam Community Guidelines: Standards for buyers, sellers, and visitors. Prohibited items, behavior standards, review authenticity, and enforcement.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Community Guidelines</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-6 rounded-xl bg-accent-50 border border-accent-200 p-6">
          <p className="text-sm text-accent-800">Our community is built on trust, respect, and a shared passion for Premium Products. These guidelines help ensure Kandyam remains a safe, fair, and inspiring marketplace for everyone.</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Prohibited Items</h2>
            <p>The following items are strictly prohibited on Kandyam:</p>
            <ul>
              <li>Mass-produced or factory-made items misrepresented as premium</li>
              <li>Counterfeit, replica, or unauthorized copies of branded goods</li>
              <li>Weapons, firearms, ammunition, and weapon accessories</li>
              <li>Illegal drugs, drug paraphernalia, and controlled substances</li>
              <li>Items made from endangered or protected species (ivory, tortoiseshell, etc.)</li>
              <li>Hate speech material or items promoting violence/discrimination</li>
              <li>Stolen goods or items obtained through illegal means</li>
              <li>Adult content, pornography, or sexually explicit items</li>
              <li>Human remains or body parts</li>
              <li>Items that violate Sri Lankan law, export regulations, or international sanctions</li>
            </ul>
          </section>

          <section>
            <h2>Behavior Standards</h2>
            <h3>For Everyone</h3>
            <ul>
              <li>Communicate respectfully — no harassment, threats, hate speech, or bullying</li>
              <li>Be honest in all transactions and communications</li>
              <li>Do not spam or send unsolicited promotional messages</li>
              <li>Respect the privacy of other users — do not share personal information without consent</li>
              <li>Report violations rather than engaging in conflicts</li>
            </ul>
            <h3>For Buyers</h3>
            <ul>
              <li>Read product descriptions carefully before purchasing</li>
              <li>Understand that premium items may have natural variations — that&apos;s part of their charm</li>
              <li>Leave honest, constructive reviews based on your actual experience</li>
              <li>Do not attempt to negotiate off-platform transactions to avoid fees</li>
              <li>Pay promptly and communicate clearly with vendors</li>
            </ul>
            <h3>For Vendors</h3>
            <ul>
              <li>List only your own premium products with accurate descriptions and photos</li>
              <li>Set fair prices and honor your listed prices</li>
              <li>Ship orders within your stated processing time</li>
              <li>Respond to buyer messages within 24 hours during business days</li>
              <li>Package items securely to prevent damage during shipping</li>
              <li>Maintain a professional and respectful tone in all communications</li>
              <li>Do not attempt to take transactions off-platform to avoid commission fees</li>
            </ul>
          </section>

          <section>
            <h2>Review Authenticity</h2>
            <p>Reviews are essential for building trust in our marketplace. The following review practices are prohibited:</p>
            <ul>
              <li>Posting fake reviews (positive or negative) for yourself or competitors</li>
              <li>Paying or incentivizing customers for positive reviews (offering discounts for 5-star reviews)</li>
              <li>Using multiple accounts to post reviews</li>
              <li>Threatening or coercing buyers to change or remove reviews</li>
              <li>Posting reviews that contain personal attacks, hate speech, or irrelevant content</li>
              <li>Removing and reposting reviews to reset rating history</li>
            </ul>
            <p>We use automated and manual systems to detect fake reviews. Violations result in review removal and may lead to account suspension.</p>
          </section>

          <section>
            <h2>Vendor Standards</h2>
            <p>Vendors are expected to maintain high standards of quality and service:</p>
            <ul>
              <li>Minimum average rating of 3.0 stars (vendors below this threshold may be reviewed)</li>
              <li>On-time shipping rate of at least 90%</li>
              <li>Response rate to buyer messages within 24 hours</li>
              <li>Return/damage rate below 10%</li>
              <li>Accurate product listings with real photos of the actual product</li>
            </ul>
          </section>

          <section>
            <h2>Communication Guidelines</h2>
            <p>Our messaging system is for transaction-related communication only. Do not:</p>
            <ul>
              <li>Share personal contact information (email, phone, social media) to conduct off-platform transactions</li>
              <li>Send promotional or advertising messages unrelated to a transaction</li>
              <li>Use the messaging system for harassment, spam, or phishing</li>
            </ul>
          </section>

          <section>
            <h2>Enforcement</h2>
            <p>Violations of these guidelines may result in:</p>
            <ul>
              <li>Warning and request to correct the violation</li>
              <li>Temporary suspension of buying/selling privileges</li>
              <li>Removal of violating content or listings</li>
              <li>Permanent account termination for severe or repeated violations</li>
              <li>Legal action in cases of fraud, theft, or other criminal activity</li>
            </ul>
            <p>We reserve the right to take action based on the severity of the violation. Account terminations include forfeiture of any pending payouts for fraud-related violations.</p>
          </section>

          <section>
            <h2>Reporting Violations</h2>
            <p>If you see content or behavior that violates these guidelines, please report it:</p>
            <ul>
              <li>Use the &quot;Report&quot; button on product pages, reviews, or user profiles</li>
              <li>Email community@kandyam.com with details and evidence</li>
              <li>Contact our support team via live chat</li>
            </ul>
            <p>We review all reports and take appropriate action. Your report is confidential — we never share reporter information with the reported party.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
