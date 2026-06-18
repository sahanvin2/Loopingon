import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, formatDistance, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "LKR"): string {
  const currencySymbols: Record<string, string> = {
    LKR: "රු",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
    INR: "₹",
  };

  const symbol = currencySymbols[currency] || currency;
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol} ${formatted}`;
}

export function formatPriceWithoutDecimals(amount: number, currency: string = "LKR"): string {
  const currencySymbols: Record<string, string> = {
    LKR: "රු",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
    INR: "₹",
  };

  const symbol = currencySymbols[currency] || currency;
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${symbol} ${formatted}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatRelativeTimeSinhala(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return formatDistance(d, new Date());
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LOOP-${timestamp}-${random}`;
}

export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    published: "bg-teal-100 text-teal-800",
    active: "bg-teal-100 text-teal-800",
    verified: "bg-teal-100 text-teal-800",
    completed: "bg-teal-100 text-teal-800",
    delivered: "bg-teal-100 text-teal-800",
    processing: "bg-gold-100 text-gold-800",
    pending: "bg-gold-100 text-gold-800",
    pending_review: "bg-gold-100 text-gold-800",
    shipped: "bg-blue-100 text-blue-800",
    in_transit: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    failed: "bg-red-100 text-red-800",
    suspended: "bg-red-100 text-red-800",
    banned: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
    draft: "bg-text-100 text-text-700",
    out_of_stock: "bg-text-100 text-text-700",
    discontinued: "bg-text-100 text-text-700",
  };
  return statusColors[status] || "bg-text-100 text-text-700";
}

export function getInitialsColor(name: string): string {
  const colors = [
    "bg-terracotta-500",
    "bg-gold-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-green-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

const PLACEHOLDER_PRODUCT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100' rx='50'/%3E%3Ctext fill='%239ca3af' x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28'%3E?%3C/text%3E%3C/svg%3E";

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER_PRODUCT;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_CDN_URL || ""}/${path}`;
}

export function getAvatarUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER_AVATAR;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_CDN_URL || ""}/${path}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  return count === 1 ? singular : plural || `${singular}s`;
}
