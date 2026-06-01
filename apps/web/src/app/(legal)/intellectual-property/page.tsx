import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intellectual Property Policy",
  description: "Loopingon Intellectual Property Policy: Copyright ownership, trademark guidelines, reporting infringement, DMCA process, and user-generated content licensing.",
};

export default function IntellectualPropertyPage() {
  return (
    <div className="bg-cream-100 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-charcoal-900">Intellectual Property Policy</h1>
        <p className="mt-2 text-sm text-warm-gray-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-warm-gray-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-charcoal-900 [&_h3]:font-semibold [&_h3]:text-charcoal-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Respect for Intellectual Property</h2>
            <p>Loopingon respects the intellectual property rights of others and expects our users to do the same. We are committed to protecting the creative works of artisans, designers, and content creators on our platform.</p>
          </section>

          <section>
            <h2>Copyright Ownership</h2>
            <p>Vendors retain full copyright ownership of their product photos, product descriptions, store branding elements, and any original content they upload to the Platform. Loopingon does not claim ownership of vendor content.</p>
            <p>By listing products on Loopingon, vendors grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote their product listings on the Platform and in associated marketing materials (social media, email campaigns, advertisements). This license ends when the content is removed from the Platform.</p>
          </section>

          <section>
            <h2>Trademark Guidelines</h2>
            <ul>
              <li>The name &quot;Loopingon&quot; and the Loopingon logo are registered trademarks of Loopingon (Pvt) Ltd.</li>
              <li>You may not use our trademarks in a way that suggests endorsement, sponsorship, or affiliation without our written permission.</li>
              <li>Vendors are responsible for ensuring their store names do not infringe on others&apos; trademarks.</li>
            </ul>
          </section>

          <section>
            <h2>Reporting Infringement</h2>
            <p>If you believe your copyright or trademark has been infringed by content on Loopingon, please send a notice to ip@loopingon.com with:</p>
            <ul>
              <li>Your full name and contact information</li>
              <li>Identification of the copyrighted or trademarked work</li>
              <li>The URL of the infringing content on Loopingon</li>
              <li>A statement that you have a good faith belief the use is not authorized</li>
              <li>A statement under penalty of perjury that the information is accurate</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2>Counter-Notice Process</h2>
            <p>If your content was removed due to an infringement claim that you believe is mistaken, you may file a counter-notice with:</p>
            <ul>
              <li>Identification of the removed content and its location before removal</li>
              <li>A statement under penalty of perjury that you believe the removal was a mistake</li>
              <li>Your consent to jurisdiction of the courts in Colombo, Sri Lanka</li>
              <li>Your contact information and signature</li>
            </ul>
            <p>Upon receiving a valid counter-notice, we may restore the content within 10-14 business days unless the complaining party files a court action.</p>
          </section>

          <section>
            <h2>User-Generated Content</h2>
            <p>When you post reviews, comments, photos, or other content on Loopingon, you retain ownership but grant us and other users a non-exclusive license to view and interact with that content on the Platform. You are responsible for ensuring your content does not infringe on others&apos; rights.</p>
          </section>

          <section>
            <h2>Repeat Infringer Policy</h2>
            <p>We terminate the accounts of users who are repeat infringers of intellectual property rights. Accounts with multiple valid infringement claims may be suspended or permanently terminated.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
