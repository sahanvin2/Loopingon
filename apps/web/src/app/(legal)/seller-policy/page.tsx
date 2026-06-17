import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Policies - Kandyam",
  description: "Read the Kandyam Seller Policies. Learn about prohibited items, fees, payments, and seller obligations.",
};

export default function SellerPolicyPage() {
  return (
    <div className="bg-surface-50 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-soft-sm md:p-12">
        <h1 className="font-serif text-3xl font-bold text-text-900 md:text-5xl">
          Seller Policies
        </h1>
        <p className="mt-4 text-sm text-muted-500">
          Last Updated: June 2026
        </p>

        <div className="prose prose-primary mt-12 max-w-none text-muted-600">
          <p className="lead text-lg">
            Welcome to Kandyam. We are committed to building a trusted, premium marketplace for independent sellers and buyers. 
            By opening a shop on Kandyam, you agree to these policies and our general Terms of Service.
          </p>

          <h2 className="text-2xl font-bold text-text-900 mt-8 mb-4">1. What Can Be Sold</h2>
          <p>
            Kandyam is a marketplace for premium, unique, and high-quality products. We encourage original creations, vintage items, and carefully curated boutique goods.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li><strong>Original Goods:</strong> Items designed, made, or produced by you.</li>
            <li><strong>Vintage:</strong> Items must be at least 20 years old.</li>
            <li><strong>Supplies:</strong> Tools, materials, or ingredients whose primary purpose is for the creation of an item or special occasion.</li>
          </ul>

          <h2 className="text-2xl font-bold text-text-900 mt-8 mb-4">2. Prohibited Items</h2>
          <p>
            To maintain a safe environment, the following items are strictly prohibited on Kandyam:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li>Counterfeit or unauthorized replica items.</li>
            <li>Weapons, hazardous materials, or illegal goods.</li>
            <li>Items that promote violence, hate speech, or discrimination.</li>
            <li>Mass-produced electronics and generic drop-shipped items without added value.</li>
            <li>Services or intangible goods that cannot be digitally delivered through the platform.</li>
          </ul>

          <h2 className="text-2xl font-bold text-text-900 mt-8 mb-4">3. Fees and Payments</h2>
          <p>
            Joining Kandyam and opening a shop is free. We only make money when you make a sale.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li><strong>Commission Fee:</strong> We charge a flat 20% commission on the total sale price (including shipping) of each transaction.</li>
            <li><strong>Payouts:</strong> Payments are processed weekly and transferred directly to your designated bank account once the buyer has confirmed delivery.</li>
            <li><strong>Taxes:</strong> Sellers are responsible for collecting and paying any applicable taxes related to their sales.</li>
          </ul>

          <h2 className="text-2xl font-bold text-text-900 mt-8 mb-4">4. Seller Obligations</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li><strong>Accurate Representation:</strong> All listings must accurately describe the item. Photos must be of the actual item being sold.</li>
            <li><strong>Timely Shipping:</strong> Sellers must ship items within the processing time stated on their listing. Tracking numbers must be provided when available.</li>
            <li><strong>Customer Service:</strong> Sellers must respond to customer inquiries within 24-48 hours and handle disputes professionally.</li>
            <li><strong>Returns:</strong> Sellers must clearly state their return policy and honor it consistently.</li>
          </ul>

          <h2 className="text-2xl font-bold text-text-900 mt-8 mb-4">5. Account Termination</h2>
          <p>
            Kandyam reserves the right to suspend or terminate any seller account that violates these policies, engages in fraudulent behavior, or provides a consistently poor customer experience. We will typically issue warnings and provide an opportunity to correct issues before termination, except in cases of severe violations.
          </p>

          <hr className="my-12 border-surface-200" />
          
          <p className="text-sm">
            If you have any questions regarding these policies, please reach out to our dedicated seller support team.
          </p>
        </div>
      </div>
    </div>
  );
}
