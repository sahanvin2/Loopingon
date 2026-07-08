import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Policies - Kandyam",
  description: "Read the Kandyam Seller Policies. Learn about prohibited items, fees, payments, and seller obligations for digital products.",
};

export default function SellerPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Seller Policies</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <p className="text-base">
              Welcome to Kandyam. We are committed to building a trusted, premium marketplace for independent sellers and buyers of digital goods. 
              By opening a shop on Kandyam, you agree to these policies and our general Terms of Service.
            </p>
          </section>

          <section>
            <h2>1. What Can Be Sold</h2>
            <p>
              Kandyam is a marketplace for premium, unique, and high-quality digital products. We encourage software, digital art, templates, game keys, and educational content.
            </p>
            <ul>
              <li><strong>Software & Tools:</strong> Original software, plugins, scripts, and utilities.</li>
              <li><strong>Game Keys:</strong> Legally obtained game keys, gift cards, and in-game items.</li>
              <li><strong>Creative Assets:</strong> Templates, fonts, digital art, music, and stock photos.</li>
              <li><strong>Educational:</strong> E-Books, courses, and guides.</li>
            </ul>
          </section>

          <section>
            <h2>2. Prohibited Items</h2>
            <p>
              To maintain a safe environment, the following items are strictly prohibited on Kandyam:
            </p>
            <ul>
              <li>Pirated software, cracked games, or unauthorized accounts.</li>
              <li>Malware, viruses, or any malicious code.</li>
              <li>Stolen goods, illegally acquired keys, or carded items.</li>
              <li>Physical items or anything requiring shipping.</li>
              <li>Content that promotes violence, hate speech, or discrimination.</li>
            </ul>
          </section>

          <section>
            <h2>3. Fees and Payments</h2>
            <p>
              Joining Kandyam and opening a shop is free. We only make money when you make a sale.
            </p>
            <ul>
              <li><strong>Commission Fee:</strong> We charge a flat 20% commission on the total sale price of each transaction.</li>
              <li><strong>Payouts:</strong> Payments are processed bi-weekly and transferred directly to your designated bank account.</li>
              <li><strong>Taxes:</strong> Sellers are responsible for collecting and paying any applicable taxes related to their sales.</li>
            </ul>
          </section>

          <section>
            <h2>4. Seller Obligations</h2>
            <ul>
              <li><strong>Accurate Representation:</strong> All listings must accurately describe the digital product. The delivered file or key must match the description perfectly.</li>
              <li><strong>Instant Delivery:</strong> Sellers must ensure that the digital file or key is uploaded correctly so that it can be delivered instantly to the buyer upon payment.</li>
              <li><strong>Customer Service:</strong> Sellers must respond to customer inquiries within 24-48 hours and provide technical support if the product does not work as advertised.</li>
            </ul>
          </section>

          <section>
            <h2>5. Account Termination</h2>
            <p>
              Kandyam reserves the right to suspend or terminate any seller account that violates these policies, engages in fraudulent behavior, sells pirated content, or provides a consistently poor customer experience. We will immediately ban sellers caught selling unauthorized or stolen digital goods.
            </p>
          </section>

          <section>
            <hr className="my-8 border-surface-200" />
            <p>
              If you have any questions regarding these policies, please reach out to our dedicated seller support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
