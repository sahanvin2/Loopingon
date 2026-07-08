import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description: "Kandiyam delivery policy — Instant access and downloads for digital goods and software.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl font-bold text-text-900">Delivery Policy</h1>
        <p className="mt-2 text-sm text-muted-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-700 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <section>
            <h2>Instant Digital Delivery</h2>
            <p>All products sold on Kandyam are digital goods. We do not ship physical products.</p>
            <ul>
              <li>Upon successful payment, your digital products will be immediately available.</li>
              <li>You can access your purchased items from your Account Dashboard under "My Orders" or "Library".</li>
              <li>An email confirmation containing access instructions or license keys will also be sent to your registered email address.</li>
            </ul>
          </section>

          <section>
            <h2>Accessing Your Purchases</h2>
            <p>To download your digital goods:</p>
            <ol className="mt-3 list-decimal pl-6 space-y-2">
              <li>Log in to your Kandyam account.</li>
              <li>Navigate to your Dashboard.</li>
              <li>Find the relevant order and click "Download" or view your activation keys.</li>
            </ol>
            <p>If you checked out as a guest, please refer to the email receipt we sent you for a direct download link or instructions on how to claim your purchase.</p>
          </section>

          <section>
            <h2>Issues with Delivery</h2>
            <p>If you experience any issues accessing your digital products (e.g., download link is broken, license key is invalid, or email was not received):</p>
            <ul>
              <li>First, please check your spam or junk email folder for the confirmation email.</li>
              <li>Verify that your payment was completed successfully.</li>
              <li>If the issue persists, contact our support team at <a href="mailto:support@kandyam.com" className="text-primary-600 hover:underline">support@kandyam.com</a> with your order number.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
