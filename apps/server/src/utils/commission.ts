export interface CommissionResult {
  orderTotal: number;
  commissionRate: number;
  commissionAmount: number;
  vendorPayoutAmount: number;
  platformFee: number;
  taxAmount: number;
}

export function calculateCommission(
  orderTotal: number,
  commissionRate: number = 20,
  includeTax: boolean = false,
  taxRate: number = 0
): CommissionResult {
  const rate = commissionRate / 100;
  const commissionAmount = Math.round((orderTotal * rate) * 100) / 100;
  const vendorPayoutAmount = Math.round((orderTotal - commissionAmount) * 100) / 100;

  let taxAmount = 0;
  let platformFee = commissionAmount;

  if (includeTax && taxRate > 0) {
    taxAmount = Math.round((commissionAmount * (taxRate / 100)) * 100) / 100;
    platformFee = commissionAmount - taxAmount;
  }

  return {
    orderTotal: Math.round(orderTotal * 100) / 100,
    commissionRate,
    commissionAmount,
    vendorPayoutAmount,
    platformFee: Math.round(platformFee * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
  };
}

export function calculateVendorPayout(
  items: Array<{ total: number; vendorId: string; commissionRate?: number }>,
  defaultCommissionRate: number = 20
): Array<{
  vendorId: string;
  subtotal: number;
  commissionRate: number;
  commissionAmount: number;
  payoutAmount: number;
}> {
  const vendorTotals = new Map<
    string,
    {
      vendorId: string;
      subtotal: number;
      commissionRate: number;
      commissionAmount: number;
      payoutAmount: number;
    }
  >();

  for (const item of items) {
    const existing = vendorTotals.get(item.vendorId);
    const rate = item.commissionRate ?? defaultCommissionRate;
    const commission = calculateCommission(item.total, rate);

    if (existing) {
      existing.subtotal += item.total;
      existing.commissionAmount += commission.commissionAmount;
      existing.payoutAmount += commission.vendorPayoutAmount;
    } else {
      vendorTotals.set(item.vendorId, {
        vendorId: item.vendorId,
        subtotal: item.total,
        commissionRate: rate,
        commissionAmount: commission.commissionAmount,
        payoutAmount: commission.vendorPayoutAmount,
      });
    }
  }

  return Array.from(vendorTotals.values());
}

export function formatCurrency(amount: number, currency: string = "LKR"): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
