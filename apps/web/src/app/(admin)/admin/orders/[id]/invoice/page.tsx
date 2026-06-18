"use client";

import { use } from "react";
import { Printer, ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { ApiResponse } from "@/types";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data, isLoading } = useQuery({
    queryKey: ["admin-order-details", resolvedParams.id],
    queryFn: () => get<ApiResponse<any>>(`/admin/orders/${resolvedParams.id}`),
  });

  const order = data?.data;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <LoadingSkeleton variant="detail" />;

  if (!order) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-text-900">Order Not Found</h2>
        <Link href="/admin/orders" className="text-primary-600 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Non-printable controls */}
      <div className="flex items-center justify-between print:hidden mb-6">
        <Link 
          href={`/admin/orders/${order.id}`}
          className="inline-flex items-center gap-2 text-sm text-text-600 hover:text-text-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="relative bg-white p-12 rounded-2xl shadow-lg border border-accent-200 overflow-hidden print:shadow-none print:border-none print:p-0">
        
        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
          <span className="font-serif text-[200px] font-black tracking-tighter">KANDYAM</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-accent-900 pb-8 mb-8 relative z-10">
          <div>
            <h1 className="text-5xl font-serif font-black text-primary-900 tracking-tight mb-2 uppercase">Invoice</h1>
            <p className="text-lg font-medium text-text-600 tracking-wider">#{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <div className="font-serif text-3xl font-bold tracking-tight text-text-900 mb-2">Kandyam</div>
            <p className="text-sm text-text-600 leading-relaxed">
              123 Seller Lane<br />
              Colombo 03, Sri Lanka<br />
              hello@kandyam.com<br />
              +94 112 345 678
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12 relative z-10">
          <div className="col-span-5 bg-surface-50 p-6 rounded-xl border border-accent-100">
            <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-4">Billed To</h3>
            <p className="text-lg font-bold text-text-900 mb-1">{order.shippingAddress?.fullName || 'Customer'}</p>
            <p className="text-sm text-text-600 leading-relaxed">
              {order.shippingAddress?.addressLine1}<br />
              {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.district}<br />
              {order.shippingAddress?.country} {order.shippingAddress?.postalCode}
            </p>
          </div>
          <div className="col-span-4 bg-surface-50 p-6 rounded-xl border border-accent-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Invoice Date</h3>
              <p className="text-sm font-semibold text-text-900 mb-4">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: '2-digit'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Payment Info</h3>
              <p className="text-sm font-semibold text-text-900">{order.paymentMethod || 'Credit Card'}</p>
              <p className="text-xs text-text-500 mt-1">{order.paymentStatus || 'Paid'}</p>
            </div>
          </div>
          <div className="col-span-3 flex flex-col items-center justify-center p-6 border-2 border-dashed border-accent-200 rounded-xl">
             <QrCode className="w-20 h-20 text-accent-800 mb-2" strokeWidth={1.5} />
             <span className="text-[10px] font-medium text-text-500 uppercase tracking-wider">Scan to Track</span>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse mb-12 relative z-10">
          <thead>
            <tr className="border-b-2 border-accent-900 text-xs uppercase tracking-wider font-bold text-primary-900">
              <th className="py-4 px-2">Item Description</th>
              <th className="py-4 px-2 text-center">Qty</th>
              <th className="py-4 px-2 text-right">Unit Price</th>
              <th className="py-4 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-accent-100 hover:bg-surface-50 transition-colors">
                <td className="py-5 px-2">
                  <p className="font-semibold text-text-900">{item.productTitle}</p>
                  {item.variantId && <p className="text-xs text-text-500 mt-1 font-medium">Variant: {item.variantId}</p>}
                </td>
                <td className="py-5 px-2 text-center font-bold text-text-700">{item.quantity}</td>
                <td className="py-5 px-2 text-right text-text-600 font-medium">
                  LKR {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-5 px-2 text-right font-bold text-text-900">
                  LKR {Number(item.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 space-y-3">
            <div className="flex justify-between text-sm text-text-600">
              <span>Subtotal</span>
              <span>LKR {Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(order.shippingCost) > 0 && (
              <div className="flex justify-between text-sm text-text-600">
                <span>Shipping</span>
                <span>LKR {Number(order.shippingCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(order.taxAmount) > 0 && (
              <div className="flex justify-between text-sm text-text-600">
                <span>Tax</span>
                <span>LKR {Number(order.taxAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>- LKR {Number(order.discountAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-accent-900 pt-3 mt-3">
              <span className="font-bold text-text-900 uppercase">Total Due</span>
              <span className="text-xl font-bold text-primary-700">
                LKR {Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-accent-200 pt-8 text-center text-sm text-text-500">
          <p className="font-medium text-text-900 mb-1">Thank you for supporting Sri Lankan sellers!</p>
          <p>For questions concerning this invoice, please contact support@kandyam.com</p>
        </div>

      </div>
    </div>
  );
}
