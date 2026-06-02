export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "VENDOR"
  | "CUSTOMER"
  | "SUPPORT"
  | "MODERATOR";

export type VendorStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED"
  | "BANNED";

export type ProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "OUT_OF_STOCK"
  | "DISCONTINUED"
  | "FLAGGED";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "HELD_IN_ESCROW"
  | "RELEASED_TO_VENDOR";

export type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type ShippingMethod =
  | "STANDARD"
  | "EXPRESS"
  | "FREE"
  | "SAME_DAY"
  | "INTERNATIONAL"
  | "PICKUP";

export type NotificationType =
  | "ORDER_CONFIRMATION"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "PAYMENT_RECEIVED"
  | "PAYOUT_PROCESSED"
  | "NEW_MESSAGE"
  | "NEW_REVIEW"
  | "VENDOR_VERIFIED"
  | "VENDOR_REJECTED"
  | "PRODUCT_APPROVED"
  | "PRODUCT_REJECTED"
  | "COMPETITION_ANNOUNCEMENT"
  | "PROMOTIONAL"
  | "SYSTEM_ALERT"
  | "REMINDER"
  | "REFERRAL_EARNED"
  | "LOYALTY_POINTS";

export type NotificationChannel = "EMAIL" | "SMS" | "WHATSAPP" | "PUSH" | "IN_APP";

export type CompetitionStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "JUDGING"
  | "COMPLETED"
  | "CANCELLED";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED_AMOUNT"
  | "FREE_SHIPPING"
  | "BUY_X_GET_Y";

export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  passwordHash: string | null;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  phoneVerified: boolean;
  avatar: string | null;
  role: UserRole;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorBackupCodes: string[];
  googleId: string | null;
  facebookId: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor | null;
  customerProfile?: CustomerProfile | null;
  addresses?: Address[];
  cart?: Cart | null;
  wishlists?: Wishlist[];
}

export interface CustomerProfile {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  gender: string | null;
  preferredLanguage: string;
  currency: string;
  marketingOptIn: boolean;
  newsletterOptIn: boolean;
  interests: string[];
  totalOrders: number;
  totalSpent: string;
  lifetimeValue: string;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo: string | null;
  storeBanner: string | null;
  storeSince: string;
  status: VendorStatus;
  verificationNotes: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  businessName: string | null;
  businessRegistrationNo: string | null;
  businessType: string | null;
  taxId: string | null;
  craftType: string[];
  craftDescription: string | null;
  yearsOfExperience: number | null;
  employeeCount: number | null;
  workshopLocation: string | null;
  workshopCity: string | null;
  workshopDistrict: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  rating: number;
  reviewCount: number;
  responseRate: number;
  avgResponseTime: number;
  onTimeDeliveryRate: number;
  returnRate: number;
  commissionRate: number;
  nextPayoutDate: string | null;
  lastPayoutDate: string | null;
  pendingPayoutAmount: string;
  totalPayoutAmount: string;
  vacationMode: boolean;
  freeShippingEnabled: boolean;
  freeShippingMinOrder: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  bankDetails?: VendorBankDetail[];
  verificationDocs?: VendorVerificationDoc[];
  products?: Product[];
}

export interface VendorBankDetail {
  id: string;
  vendorId: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  isPrimary: boolean;
  verifiedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VendorVerificationDoc {
  id: string;
  vendorId: string;
  docType: string;
  docUrl: string;
  docName: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  notes: string | null;
  createdAt: string;
}

export interface StorefrontSettings {
  id: string;
  vendorId: string;
  themeColor: string | null;
  customCss: string | null;
  featuredProducts: string[];
  aboutSection: string | null;
  policies: Record<string, unknown> | null;
  storySection: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  level: number;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  productCount: number;
  seoKeywords: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: Category | null;
  children?: Category[];
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  currency: string;
  quantity: number;
  sku: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  isHandmade: boolean;
  isCustomizable: boolean;
  isDigital: boolean;
  isEcoFriendly: boolean;
  isFairTrade: boolean;
  craftType: string | null;
  materials: string[];
  dimensions: Record<string, unknown> | null;
  weight: number | null;
  processingTime: number | null;
  shippingPrice: string | null;
  shippingPriceInternational: string | null;
  freeShippingDomestic: boolean;
  madeToOrder: boolean;
  maxOrderQuantity: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  viewsCount: number;
  salesCount: number;
  reviewCount: number;
  averageRating: number;
  wishlistCount: number;
  deletedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  categories?: ProductCategory[];
  images?: ProductImage[];
  videos?: ProductVideo[];
  variants?: ProductVariant[];
  tags?: ProductTag[];
  reviews?: Review[];
}

export interface ProductCategory {
  productId: string;
  categoryId: string;
  product?: Product;
  category?: Category;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnail: string;
  medium: string;
  large: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  createdAt: string;
}

export interface ProductVideo {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl: string | null;
  duration: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: string | null;
  quantity: number;
  attributes: Record<string, unknown> | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTag {
  id: string;
  productId: string;
  tag: string;
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  status: OrderStatus;
  subtotal: string;
  shippingCost: string;
  taxAmount: string;
  discountAmount: string;
  couponCode: string | null;
  totalAmount: string;
  currency: string;
  commissionRate: number;
  commissionAmount: string;
  vendorPayoutAmount: string;
  vendorPayoutStatus: PayoutStatus | null;
  shippingMethod: ShippingMethod | null;
  shippingAddressId: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courierName: string | null;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  shippingLabelUrl: string | null;
  customerNotes: string | null;
  giftMessage: string | null;
  isGift: boolean;
  giftWrap: boolean;
  paymentId: string | null;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  processingAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  vendor?: Vendor;
  shippingAddress?: Address;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  shipments?: Shipment[];
  dispute?: OrderDispute | null;
  couponUsages?: CouponUsage[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  productTitle: string;
  productImage: string | null;
  price: string;
  quantity: number;
  totalPrice: string;
  vendorId: string;
  order?: Order;
  product?: Product;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierName: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: string;
  statusUpdatedAt: string | null;
  shippedAt: string | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDispute {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  status: ReportStatus;
  resolution: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  addedPrice: string | null;
  createdAt: string;
  product?: Product;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  customerId: string;
  vendorId: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  isVerified: boolean;
  isHidden: boolean;
  hiddenReason: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  vendorReply: string | null;
  vendorRepliedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  customer?: User;
  vendor?: Vendor;
}

export interface MessageThread {
  id: string;
  subject: string | null;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  lastMessage: string | null;
  participants?: User[];
  messages?: Message[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  attachments: string[];
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  thread?: MessageThread;
  sender?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  deliveredAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string | null;
  userId: string;
  vendorId: string | null;
  amount: string;
  currency: string;
  gatewayName: string;
  gatewayTransactionId: string | null;
  gatewayResponse: Record<string, unknown> | null;
  status: PaymentStatus;
  paymentMethod: string | null;
  commissionAmount: string;
  vendorAmount: string;
  platformFee: string;
  refundAmount: string | null;
  refundedAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutSchedule {
  id: string;
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  totalOrders: number;
  totalRevenue: string;
  totalCommission: string;
  payoutAmount: string;
  status: PayoutStatus;
  transactionId: string | null;
  bankDetailUsed: string;
  processedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string | null;
  maxDiscountAmount: string | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  startsAt: string | null;
  expiresAt: string;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableVendors: string[];
  forNewCustomersOnly: boolean;
  createdAt: string;
  updatedAt: string;
  usages?: CouponUsage[];
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountAmount: string;
  createdAt: string;
  coupon?: Coupon;
  order?: Order;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerImage: string | null;
  craftType: string | null;
  theme: string | null;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  judgingStartDate: string | null;
  judgingEndDate: string | null;
  prizeDescription: string;
  prizeValue: string | null;
  rules: string;
  maxEntries: number;
  entryFee: string | null;
  isFreeEntry: boolean;
  createdAt: string;
  updatedAt: string;
  entries?: CompetitionEntry[];
}

export interface CompetitionEntry {
  id: string;
  competitionId: string;
  userId: string;
  productId: string;
  title: string;
  description: string;
  images: string[];
  voteCount: number;
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  competition?: Competition;
  user?: User;
  product?: Product;
  votes?: CompetitionVote[];
}

export interface CompetitionVote {
  id: string;
  entryId: string;
  userId: string;
  createdAt: string;
  entry?: CompetitionEntry;
  user?: User;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  totalPoints: number;
  availablePoints: number;
  tier: string;
  lifetimePoints: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  transactions?: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  accountId: string;
  points: number;
  type: string;
  reference: string | null;
  description: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  totalReferrals: number;
  totalEarnings: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCodeStr: string;
  referralCodeId: string | null;
  status: string;
  rewardAmount: string | null;
  rewardClaimed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  orderId: string | null;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: SupportTicketReply[];
}

export interface SupportTicketReply {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  attachments: string[];
  isInternal: boolean;
  createdAt: string;
  ticket?: SupportTicket;
  user?: User;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  authorId: string;
  category: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string | null;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  province: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  isBilling: boolean;
  latitude: number | null;
  longitude: number | null;
  deliveryNotes: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface SearchFilters {
  query: string;
  category?: string;
  craftType?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  district?: string;
  materials?: string[];
  shipping?: string;
  features?: string[];
  onSale?: boolean;
  inStock?: boolean;
}

export interface ProductFilters extends SearchFilters {
  isHandmade?: boolean;
  isEcoFriendly?: boolean;
  isFairTrade?: boolean;
  isCustomizable?: boolean;
  vendorId?: string;
  status?: ProductStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export type ViewMode = "grid" | "list";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  isChatbotOpen: boolean;
  isNewsletterVisible: boolean;
  theme: "light" | "dark" | "system";
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: string;
  view: ViewMode;
  page: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

declare global {
  interface Window {
    __NEXT_PUBLIC_API_URL__?: string;
  }
}
