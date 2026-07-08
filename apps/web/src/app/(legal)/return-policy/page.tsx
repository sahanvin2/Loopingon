import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Kandyam's refund policy for digital goods. Learn about refund conditions, process, and exceptions.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Refund Policy</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-8 rounded-xl bg-muted-50 border border-muted-200 p-6">
          <p className="text-sm font-semibold text-muted-800">Digital Goods Policy</p>
          <p className="mt-1 text-sm text-muted-700">Since Kandyam deals exclusively in digital goods (software, keys, templates, etc.), all sales are generally considered final. Refunds are only issued under specific technical circumstances.</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Refund Conditions</h2>
            <p>You may be eligible for a refund only if one of the following conditions is met:</p>
            <ul>
              <li>The digital product key or download link provided is invalid or already used before your purchase.</li>
              <li>The file is corrupted and cannot be opened or used as intended.</li>
              <li>The product is significantly different from its description.</li>
              <li>You have not downloaded or accessed the product yet (for eligible items).</li>
            </ul>
            <p className="mt-3">A refund request must be made within 7 days of your purchase.</p>
          </section>

          <section>
            <h2>Non-Refundable Scenarios</h2>
            <p>We cannot issue refunds for the following reasons:</p>
            <ul>
              <li>Change of mind after the product has been downloaded or the key has been viewed.</li>
              <li>Incompatibility with your software/hardware (please check system requirements before purchasing).</li>
              <li>Lack of expertise to use the digital product.</li>
              <li>Purchases made by mistake if the item has already been downloaded/viewed.</li>
            </ul>
          </section>

          <section>
            <h2>Refund Process</h2>
            <ol className="mt-3 list-decimal pl-6 space-y-3">
              <li><strong>Initiate Request:</strong> Go to &quot;My Orders&quot; in your account, select the order, and click &quot;Request Refund.&quot; Provide a detailed explanation of the issue and attach any relevant screenshots (e.g., error messages).</li>
              <li><strong>Review:</strong> Our team will review your request within 24-48 hours. We may contact the vendor for verification.</li>
              <li><strong>Resolution:</strong> If approved, the refund will be processed immediately. The vendor's payout for that order will be cancelled or reversed.</li>
            </ol>
          </section>

          <section>
            <h2>Refund Timeline</h2>
            <ul>
              <li>Credit/Debit Cards: 3-5 business days</li>
              <li>Bank Transfer (Sri Lanka): 2-5 business days</li>
              <li>Store Credit: Instant</li>
            </ul>
            <p className="mt-3">Refunds are issued to the original payment method. If the original method is unavailable, store credit will be issued.</p>
          </section>

          <section>
            <h2>Disputes</h2>
            <p>If you and the vendor cannot agree on a resolution, Kandyam will mediate the dispute. Our decision is final and binding based on the evidence provided by both parties.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
