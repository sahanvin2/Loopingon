"use client";

import { use } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { ApiResponse } from "@/types";

export default function CustomerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data, isLoading } = useQuery({
    queryKey: ["order", resolvedParams.id],
    queryFn: () => get<ApiResponse<any>>(`/users/orders/${resolvedParams.id}`),
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
        <Link href="/dashboard/orders" className="text-primary-600 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Print styles - force single page */}
      <style>{`
        @media print {
          @page { margin: 5mm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          nav, header, footer, aside, .print\\:hidden { display: none !important; }
          .print-invoice { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important; 
            margin: 0 !important;
            page-break-inside: avoid;
            transform: scale(0.95);
            transform-origin: top left;
            width: 105%;
          }
          .print-invoice * { font-size: 90% !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Non-printable controls */}
        <div className="flex items-center justify-between print:hidden mb-6">
          <Link 
            href={`/dashboard/orders/${order.id}`}
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
        <div className="print-invoice relative bg-white p-10 rounded-2xl shadow-lg border border-accent-200 overflow-hidden">
          
          {/* Subtle Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
            <span className="font-serif text-[180px] font-black tracking-tighter">KANDYAM</span>
          </div>

          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-accent-900 pb-6 mb-6 relative z-10">
            <div>
              <h1 className="text-4xl font-serif font-black text-primary-900 tracking-tight mb-1 uppercase">Invoice</h1>
              <p className="text-base font-medium text-text-600 tracking-wider">#{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold tracking-tight text-text-900 mb-1">Kandyam</div>
              <p className="text-xs text-text-600 leading-relaxed">
                kandyam.com<br />
                hello@kandyam.com<br />
                +94 70 303 1636
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-12 gap-6 mb-8 relative z-10">
            <div className="col-span-6 bg-surface-50 p-5 rounded-xl border border-accent-100">
              <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">Billed To</h3>
              <p className="text-base font-bold text-text-900 mb-1">{order.shippingAddress?.fullName || 'Customer'}</p>
              <p className="text-sm text-text-600 leading-relaxed">
                {order.shippingAddress?.addressLine1}<br />
                {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                {order.shippingAddress?.city}, {order.shippingAddress?.district}<br />
                Sri Lanka {order.shippingAddress?.postalCode}
              </p>
              {order.shippingAddress?.phone && (
                <p className="text-sm text-text-500 mt-1">📞 {order.shippingAddress.phone}</p>
              )}
            </div>
            <div className="col-span-6 bg-surface-50 p-5 rounded-xl border border-accent-100">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Invoice Date</h3>
                <p className="text-sm font-semibold text-text-900">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: '2-digit'
                  })}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Payment Method</h3>
                <p className="text-sm font-semibold text-text-900">{order.paymentMethod === 'COD' || order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : (order.paymentMethod || 'COD')}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Status</h3>
                <p className="text-sm font-semibold text-text-900">{order.status?.replace(/_/g, ' ') || 'Pending'}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse mb-8 relative z-10">
            <thead>
              <tr className="border-b-2 border-accent-900 text-xs uppercase tracking-wider font-bold text-primary-900">
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Unit Price</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} className="border-b border-accent-100">
                  <td className="py-4 px-2">
                    <p className="font-semibold text-text-900">{item.productTitle}</p>
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-text-700">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-text-600 font-medium">
                    Rs. {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-text-900">
                    Rs. {Number(item.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-1/2 space-y-2">
              <div className="flex justify-between text-sm text-text-600">
                <span>Subtotal</span>
                <span>Rs. {Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {Number(order.shippingCost) > 0 && (
                <div className="flex justify-between text-sm text-text-600">
                  <span>Shipping</span>
                  <span>Rs. {Number(order.shippingCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- Rs. {Number(order.discountAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t-2 border-accent-900 pt-3 mt-2">
                <span className="font-bold text-text-900 uppercase">Total Due</span>
                <span className="text-lg font-bold text-primary-700">
                  Rs. {Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-accent-200 pt-6 text-center text-sm text-text-500">
            <p className="font-medium text-text-900 mb-1">Thank you for shopping with Kandyam!</p>
            <p>For questions, contact support@kandyam.com | kandyam.com</p>
          </div>

        </div>
      </div>
    </>
  );
}
