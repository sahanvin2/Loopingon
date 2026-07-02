-- Kandyam Supabase Schema
-- Core tables for e-commerce platform

-- ============ EXTENSIONS ============
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ ENUMS ============
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPER_ADMIN','ADMIN','VENDOR','CUSTOMER','SUPPORT','MODERATOR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE vendor_status AS ENUM ('PENDING','UNDER_REVIEW','VERIFIED','REJECTED','SUSPENDED','BANNED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('DRAFT','PENDING_REVIEW','PUBLISHED','REJECTED','OUT_OF_STOCK','DISCONTINUED','FLAGGED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING_PAYMENT','PAYMENT_CONFIRMED','PROCESSING','READY_TO_SHIP','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED','REFUNDED','COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED','PARTIALLY_REFUNDED','HELD_IN_ESCROW','RELEASED_TO_VENDOR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('PERCENTAGE','FIXED_AMOUNT','FREE_SHIPPING','BUY_X_GET_Y');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ PUBLIC PROFILE TABLE ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT false,
  avatar TEXT,
  role user_role DEFAULT 'CUSTOMER'::user_role,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE,
  last_login_at TIMESTAMPTZ,
  last_login_ip TEXT,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ ADDRESSES ============
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'LK',
  is_default BOOLEAN DEFAULT false,
  is_billing BOOLEAN DEFAULT false,
  latitude FLOAT,
  longitude FLOAT,
  delivery_notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- ============ CUSTOMER PROFILES ============
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  preferred_language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'LKR',
  marketing_opt_in BOOLEAN DEFAULT false,
  newsletter_opt_in BOOLEAN DEFAULT false,
  interests TEXT[],
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  lifetime_value DECIMAL(12,2) DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  level INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  product_count INTEGER DEFAULT 0,
  seo_keywords TEXT[],
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);

-- ============ VENDORS ============
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_name TEXT UNIQUE NOT NULL,
  store_slug TEXT UNIQUE NOT NULL,
  store_description TEXT NOT NULL,
  store_logo TEXT,
  store_banner TEXT,
  store_since TIMESTAMPTZ DEFAULT now(),
  status vendor_status DEFAULT 'PENDING'::vendor_status,
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  business_name TEXT,
  business_registration_no TEXT,
  business_type TEXT,
  tax_id TEXT,
  craft_type TEXT[],
  craft_description TEXT,
  years_of_experience INTEGER,
  workshop_location TEXT,
  workshop_city TEXT,
  workshop_district TEXT,
  website_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  response_rate FLOAT DEFAULT 0,
  avg_response_time FLOAT DEFAULT 0,
  on_time_delivery_rate FLOAT DEFAULT 0,
  return_rate FLOAT DEFAULT 0,
  commission_rate FLOAT DEFAULT 20.0,
  next_payout_date TIMESTAMPTZ,
  last_payout_date TIMESTAMPTZ,
  pending_payout_amount DECIMAL(12,2) DEFAULT 0,
  total_payout_amount DECIMAL(12,2) DEFAULT 0,
  vacation_mode BOOLEAN DEFAULT false,
  free_shipping_enabled BOOLEAN DEFAULT false,
  free_shipping_min_order DECIMAL(10,2),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(store_slug);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_craft ON public.vendors(craft_type);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON public.vendors(rating);

-- ============ VENDOR BANK DETAILS ============
CREATE TABLE IF NOT EXISTS public.vendor_bank_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  currency TEXT DEFAULT 'LKR',
  quantity INTEGER DEFAULT 1,
  sku TEXT,
  status product_status DEFAULT 'DRAFT'::product_status,
  is_featured BOOLEAN DEFAULT false,
  is_handmade BOOLEAN DEFAULT true,
  is_customizable BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  is_eco_friendly BOOLEAN DEFAULT false,
  is_fair_trade BOOLEAN DEFAULT false,
  craft_type TEXT,
  materials TEXT[],
  dimensions JSONB,
  weight FLOAT,
  processing_time INTEGER,
  shipping_price DECIMAL(10,2),
  shipping_price_international DECIMAL(10,2),
  free_shipping_domestic BOOLEAN DEFAULT false,
  made_to_order BOOLEAN DEFAULT false,
  max_order_quantity INTEGER DEFAULT 10,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  average_rating FLOAT DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_craft ON public.products(craft_type);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(average_rating);
CREATE INDEX IF NOT EXISTS idx_products_sales ON public.products(sales_count);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured, status);

-- ============ PRODUCT IMAGES ============
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  medium TEXT NOT NULL,
  large TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- ============ PRODUCT CATEGORIES ============
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- ============ PRODUCT TAGS ============
CREATE TABLE IF NOT EXISTS public.product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON public.product_tags(tag);
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON public.product_tags(product_id);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  status order_status DEFAULT 'PENDING_PAYMENT'::order_status,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'LKR',
  commission_rate FLOAT DEFAULT 20.0,
  commission_amount DECIMAL(12,2) DEFAULT 0,
  vendor_payout_amount DECIMAL(12,2) DEFAULT 0,
  vendor_payout_status payout_status,
  shipping_method TEXT,
  shipping_address_id UUID NOT NULL REFERENCES public.addresses(id),
  tracking_number TEXT,
  tracking_url TEXT,
  courier_name TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  shipping_label_url TEXT,
  customer_notes TEXT,
  gift_message TEXT,
  is_gift BOOLEAN DEFAULT false,
  gift_wrap BOOLEAN DEFAULT false,
  payment_id TEXT,
  payment_method TEXT,
  payment_status payment_status DEFAULT 'PENDING'::payment_status,
  paid_at TIMESTAMPTZ,
  processing_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON public.orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ============ ORDER ITEMS ============
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID,
  product_title TEXT NOT NULL,
  product_image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  vendor_id UUID NOT NULL
);

-- ============ CARTS ============
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  abandoned_email_stage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (cart_id, product_id, variant_id)
);

-- ============ WISHLISTS ============
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Wishlist',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (wishlist_id, product_id)
);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  order_id UUID UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  hidden_reason TEXT,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  vendor_reply TEXT,
  vendor_replied_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ COUPONS ============
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_products TEXT[],
  applicable_categories TEXT[],
  applicable_vendors TEXT[],
  for_new_customers_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ SYSTEM SETTINGS ============
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ BANNERS ============
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ RLS POLICIES ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access on published content
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (status = 'PUBLISHED'::product_status OR status = 'OUT_OF_STOCK'::product_status);
CREATE POLICY "Public read access for product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read access for product categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for vendors" ON public.vendors FOR SELECT USING (status = 'VERIFIED'::vendor_status);
CREATE POLICY "Public read access for banners" ON public.banners FOR SELECT USING (is_active = true);

-- Users can read/update their own profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Users manage their own addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Users manage their own cart
CREATE POLICY "Users manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart items" ON public.cart_items FOR ALL USING (cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()));

-- Users manage their own wishlist
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist items" ON public.wishlist_items FOR ALL USING (wishlist_id IN (SELECT id FROM public.wishlists WHERE user_id = auth.uid()));

-- Grant public access (anon/authenticated) to exposed tables
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT SELECT ON public.vendors TO anon, authenticated;
GRANT SELECT ON public.banners TO anon, authenticated;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.addresses TO authenticated;
GRANT ALL ON public.carts TO authenticated;
GRANT ALL ON public.cart_items TO authenticated;
GRANT ALL ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlist_items TO authenticated;
GRANT SELECT ON public.coupons TO authenticated;
