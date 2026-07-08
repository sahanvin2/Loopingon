export const SITE_NAME = "Kandyam";
export const SITE_TAGLINE = "Your global marketplace for premium digital products";
export const SITE_DESCRIPTION =
  "Kandyam connects talented digital creators with customers worldwide. " +
  "Discover a curated selection of 100+ premium digital items, including software, game keys, and gift cards.";
export const SITE_URL = "https://kandyam.com";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Artisans", href: "/artisans" },
  { label: "Competitions", href: "/competitions" },
  { label: "Blog", href: "/blog" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=bestsellers" },
    { label: "On Sale", href: "/shop?filter=sale" },
    { label: "Gifts", href: "/gift" },
  ],
  categories: [
    { label: "Games", href: "/products?category=games" },
    { label: "Software", href: "/products?category=software" },
    { label: "Gift Cards", href: "/products?category=gift-cards" },
    { label: "Templates", href: "/products?category=templates" },
    { label: "Courses", href: "/products?category=courses" },
    { label: "E-Books", href: "/products?category=ebooks" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/our-story" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Order Tracking", href: "/orders/track" },
    { label: "FAQs", href: "/faq" },
  ],
  sell: [
    { label: "Start Selling", href: "/vendor/register" },
    { label: "Vendor Dashboard", href: "/vendor/dashboard" },
    { label: "Seller Guidelines", href: "/seller-guidelines" },
    { label: "Commission Structure", href: "/commission" },
    { label: "Vendor Resources", href: "/vendor-resources" },
  ],
  legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Return Policy", href: "/legal/returns" },
    { label: "Intellectual Property", href: "/legal/ip" },
  ],
} as const;

export const SRI_LANKAN_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Kegalle",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Moneragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
] as const;

export const SRI_LANKAN_PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
] as const;

export const CRAFT_TYPES = [
  { value: "games", label: "Games", icon: "Gamepad2" },
  { value: "software", label: "Software", icon: "Monitor" },
  { value: "gift_cards", label: "Gift Cards", icon: "Gift" },
  { value: "templates", label: "Templates", icon: "Code" },
  { value: "courses", label: "Courses", icon: "GraduationCap" },
  { value: "audio", label: "Audio", icon: "Headphones" },
  { value: "ebooks", label: "E-Books", icon: "BookOpen" },
  { value: "ai_prompts", label: "AI Prompts", icon: "Server" },
  { value: "digital_art", label: "Digital Art", icon: "Palette" },
  { value: "other", label: "Other Digital Products", icon: "MoreHorizontal" },
] as const;

export const MATERIALS = [
  "Clay",
  "Terracotta",
  "Porcelain",
  "Stoneware",
  "Wood (Teak)",
  "Wood (Mahogany)",
  "Wood (Ebony)",
  "Wood (Sandalwood)",
  "Wood (Jackfruit)",
  "Bamboo",
  "Rattan",
  "Cane",
  "Coir",
  "Cotton",
  "Silk",
  "Linen",
  "Hemp",
  "Brass",
  "Bronze",
  "Copper",
  "Silver",
  "Gold",
  "Iron",
  "Stainless Steel",
  "Aluminum",
  "Leather",
  "Paper",
  "Recycled Paper",
  "Glass",
  "Beads",
  "Semiprecious Stones",
  "Precious Gems",
  "Shells",
  "Coconut Shell",
  "Palm Leaf",
  "Banana Fiber",
  "Jute",
  "Reed",
  "Grass",
  "Wax",
  "Essential Oils",
  "Natural Dyes",
  "Acrylic",
  "Oil Paint",
  "Watercolor",
  "Lacquer",
  "Resin",
  "Natural Fibers",
  "Upcycled Materials",
] as const;

export const SHIPPING_METHODS = [
  {
    value: "STANDARD",
    label: "Standard Shipping",
    description: "Estimated delivery within 5-7 business days",
    estimatedDays: "5-7",
  },
  {
    value: "EXPRESS",
    label: "Express Shipping",
    description: "Estimated delivery within 2-3 business days",
    estimatedDays: "2-3",
  },
  {
    value: "FREE",
    label: "Free Shipping",
    description: "Free standard shipping on qualifying orders",
    estimatedDays: "5-7",
  },
  {
    value: "SAME_DAY",
    label: "Same Day Delivery",
    description: "Available within Kegalle and suburbs",
    estimatedDays: "Same day",
  },
  {
    value: "INTERNATIONAL",
    label: "International Shipping",
    description: "Worldwide delivery via international courier",
    estimatedDays: "7-21",
  },
  {
    value: "PICKUP",
    label: "Store Pickup",
    description: "Pick up directly from the artisan",
    estimatedDays: "By arrangement",
  },
] as const;

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string; description: string }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "bg-gold-100 text-gold-800",
    description: "Order placed, awaiting payment confirmation",
  },
  PAYMENT_CONFIRMED: {
    label: "Payment Confirmed",
    color: "bg-teal-100 text-teal-800",
    description: "Payment received and verified",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    description: "Artisan is preparing your order",
  },
  READY_TO_SHIP: {
    label: "Ready to Ship",
    color: "bg-indigo-100 text-indigo-800",
    description: "Order packaged and ready for collection",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    description: "Package handed to courier",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "bg-purple-100 text-purple-800",
    description: "Package moving through delivery network",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-800",
    description: "Package out with delivery driver",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-teal-100 text-teal-800",
    description: "Package delivered successfully",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    description: "Order has been cancelled",
  },
  RETURN_REQUESTED: {
    label: "Return Requested",
    color: "bg-gray-100 text-gray-800",
    description: "Return/refund has been requested",
  },
  RETURNED: {
    label: "Returned",
    color: "bg-gray-100 text-gray-800",
    description: "Item returned to vendor",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    description: "Refund has been processed",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-teal-100 text-teal-800",
    description: "Order completed successfully",
  },
};

export const PAYMENT_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "bg-gold-100 text-gold-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", color: "bg-teal-100 text-teal-800" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
  PARTIALLY_REFUNDED: {
    label: "Partially Refunded",
    color: "bg-gray-100 text-gray-800",
  },
  HELD_IN_ESCROW: {
    label: "Held in Escrow",
    color: "bg-purple-100 text-purple-800",
  },
  RELEASED_TO_VENDOR: {
    label: "Released",
    color: "bg-teal-100 text-teal-800",
  },
};

export const VENDOR_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "bg-gold-100 text-gold-800" },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-blue-100 text-blue-800",
  },
  VERIFIED: { label: "Verified", color: "bg-teal-100 text-teal-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  SUSPENDED: { label: "Suspended", color: "bg-orange-100 text-orange-800" },
  BANNED: { label: "Banned", color: "bg-red-100 text-red-800" },
};

export const PRODUCT_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  DRAFT: { label: "Draft", color: "bg-text-100 text-text-700" },
  PENDING_REVIEW: {
    label: "Pending Review",
    color: "bg-gold-100 text-gold-800",
  },
  PUBLISHED: { label: "Published", color: "bg-teal-100 text-teal-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    color: "bg-orange-100 text-orange-800",
  },
  DISCONTINUED: {
    label: "Discontinued",
    color: "bg-text-100 text-text-700",
  },
  FLAGGED: { label: "Flagged", color: "bg-red-100 text-red-800" },
};

export const COMPETITION_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  UPCOMING: { label: "Upcoming", color: "bg-blue-100 text-blue-800" },
  ACTIVE: { label: "Active", color: "bg-teal-100 text-teal-800" },
  JUDGING: { label: "Judging", color: "bg-purple-100 text-purple-800" },
  COMPLETED: { label: "Completed", color: "bg-text-100 text-text-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export const PLATFORM_COMMISSION_RATE = 20;

export const CURRENCIES = [
  { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
] as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12,
  maxLimit: 100,
} as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "bestsellers", label: "Best Sellers" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
] as const;

export const REVIEW_RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/kandyam",
  instagram: "https://instagram.com/kandyam",
  twitter: "https://twitter.com/kandyam",
  youtube: "https://youtube.com/@kandyam",
  tiktok: "https://tiktok.com/@kandyam",
  pinterest: "https://pinterest.com/kandyam",
} as const;

export const CONTACT_INFO = {
  email: "hello@kandyam.com",
  phone: "+94 11 234 5678",
  whatsapp: "+94 77 123 4567",
  address: {
    line1: "42 Galle Road",
    line2: "Rambukkana",
    city: "Kegalle",
    district: "Kegalle",
    country: "Sri Lanka",
  },
} as const;

export const FILE_UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024,
  maxFiles: 10,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  allowedDocTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;
