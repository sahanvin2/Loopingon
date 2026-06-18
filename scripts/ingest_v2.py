#!/usr/bin/env python3
"""
Kandiyam A2Z Product Ingestion v2
- Uses a2z_products_complete.xlsx with real descriptions + Buy Price
- Auto-categorizes products into 17 categories via keyword matching
- Applies pricing: BuyPrice * 1.25 → round to 50 → subtract 1
- Marks all products as PUBLISHED (no OUT_OF_STOCK filtering on frontend)
"""

import os, sys, json, re, hashlib
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional
import argparse

import pandas as pd
import boto3
import psycopg2
from psycopg2.extras import execute_values

# ─── Config ─────────────────────────────────────────────
EXCEL_PATH = r"D:\Python\Data scrap\a2z_products_complete.xlsx"
IMAGES_DIR = Path(r"D:\Mern\Loopingon\loopingon\Assets\product_images_final")

B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
B2_REGION = "us-east-005"
B2_KEY_ID = "0053aaa597862ee0000000001"
B2_APP_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs"
B2_BUCKET = "movia-prod"
CDN_URL = "https://kandyam.b-cdn.net"
B2_UPLOAD_FOLDER = "products/a2z"

DB_URL = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"
DEFAULT_VENDOR_ID = "d7c0ae2a-8ac5-457f-a713-6d45fc4f6daa"
MAX_UPLOAD_WORKERS = 20
BATCH_SIZE = 100

# ─── Auto-Categorization Engine ──────────────────────────
CATEGORY_KEYWORDS = {
    "Electronics & Accessories": [
        "watch", "smart", "cable", "charger", "adapter", "headphone", "earphone", "earbud",
        "bluetooth", "speaker", "led", "lamp", "light", "torch", "bulb", "clock", "alarm",
        "fan", "power", "usb", "hdmi", "audio", "camera", "mouse", "keyboard", "laptop",
        "phone", "mobile", "tablet", "screen", "display", "monitor", "tv", "solar",
        "battery", "charging", "wireless", "router", "modem", "sensor", "remote",
        "electric", "digital", "electronic", "smartwatch", "fitness tracker",
        "air pod", "airpod", "type-c", "type c", "lightning", "iphone", "android",
        "selfie", "tripod", "ring light", "power bank", "powerbank", "memory card",
        "sd card", "pendrive", "flash drive", "card reader", "adaptor",
    ],
    "Home & Living": [
        "home", "kitchen", "cook", "bake", "food", "storage", "organizer", "rack",
        "shelf", "basket", "tray", "bowl", "plate", "cup", "mug", "glass", "jug",
        "bottle", "container", "jar", "canister", "dispenser", "cutter", "slicer",
        "chopper", "grinder", "peeler", "grater", "spoon", "fork", "knife", "utensil",
        "pot", "pan", "fry", "kettle", "cooker", "stove", "toaster", "blender",
        "furniture", "chair", "table", "stool", "mat", "rug", "carpet", "curtain",
        "pillow", "cushion", "bedsheet", "blanket", "towel", "napkin", "cloth",
        "laundry", "cleaning", "mop", "broom", "brush", "scrub", "soap", "toilet",
        "bathroom", "shower", "faucet", "tap", "hanger", "hook", "mirror", "vase",
        "flower", "plant", "decoration", "decor", "ornament", "candle", "diffuser",
        "clock", "wall", "frame", "photo", "album",
    ],
    "Fashion": [
        "fashion", "dress", "shirt", "t-shirt", "tshirt", "top", "blouse", "skirt",
        "pant", "jean", "short", "legging", "jacket", "coat", "hoodie", "sweater",
        "sweatshirt", "jumpsuit", "romper", "suit", "tie", "belt", "scarf", "hat",
        "cap", "glove", "sock", "stocking", "underwear", "bra", "lingerie",
        "swimwear", "swimsuit", "bikini", "beachwear", "saree", "sari", "salwar",
        "kurti", "lehenga", "dupatta", "handloom", "textile", "fabric",
    ],
    "Clothing": [
        "clothing", "apparel", "wear", "garment", "uniform", "costume",
        "raincoat", "rain coat", "poncho", "overall",
    ],
    "Jewelry": [
        "jewelry", "jewellery", "necklace", "bracelet", "bangle", "ring", "earring",
        "pendant", "chain", "anklet", "brooch", "cufflink", "gem", "diamond",
        "gold", "silver", "platinum", "pearl", "crystal", "bead", "watch",
    ],
    "Bags & Purses": [
        "bag", "purse", "handbag", "backpack", "wallet", "clutch", "tote", "sling",
        "luggage", "suitcase", "travel bag", "duffel", "briefcase", "lunch bag",
        "lunch box", "pencil case", "pouch", "organizer",
    ],
    "Shoes": [
        "shoe", "sneaker", "sandal", "slipper", "heel", "boot", "loafer", "flip flop",
        "footwear", "insole", "shoe lace", "shoelace", "shoe rack",
    ],
    "Beauty & Personal Care": [
        "beauty", "makeup", "cosmetic", "lipstick", "foundation", "eyeshadow",
        "mascara", "eyeliner", "blush", "powder", "cream", "lotion", "serum",
        "moisturizer", "sunscreen", "sunscreen", "face wash", "cleanser", "toner",
        "shampoo", "conditioner", "hair", "comb", "brush", "dryer", "straightener",
        "curler", "trimmer", "shaver", "razor", "nail", "manicure", "pedicure",
        "perfume", "deodorant", "fragrance", "body wash", "soap", "spa", "massage",
        "wax", "threading", "tweezer", "facial", "mask", "peel", "scrub",
    ],
    "Bath & Beauty": [
        "bath", "bathing", "shower gel", "bath bomb", "bath salt", "loofah",
        "sponge", "pumice", "bath brush", "exfoliate",
    ],
    "Kids & Baby": [
        "baby", "kids", "child", "toddler", "infant", "newborn", "nursery", "crib",
        "stroller", "pacifier", "bottle", "diaper", "nappy", "bib", "onesie",
        "toy", "doll", "car", "truck", "block", "puzzle", "play", "game",
        "coloring", "crayon", "drawing", "activity", "learning", "educational",
        "alphabet", "number", "flash card", "book", "school", "backpack",
        "lunch box", "water bottle", "feeding", "sippy", "teether", "rattle",
    ],
    "Toys & Games": [
        "toy", "game", "puzzle", "playing", "board game", "card game", "chess",
        "carrom", "dart", "ball", "frisbee", "kite", "yo-yo", "rubik", "lego",
        "action figure", "barbie", "dinosaur", "robot", "drone", "rc car",
        "remote control", "stuffed", "plush", "teddy", "soft toy", "dough",
        "slime", "putty", "fidget", "pop it", "squishy", "stress ball",
    ],
    "Pet Supplies": [
        "pet", "dog", "cat", "bird", "fish", "hamster", "rabbit", "leash",
        "collar", "harness", "bowl", "feeder", "cage", "aquarium", "litter",
        "grooming", "chew", "treat", "pet food", "scratch", "kennel", "carrier",
    ],
    "Sports & Outdoors": [
        "sport", "exercise", "fitness", "gym", "yoga", "workout", "training",
        "outdoor", "camping", "hiking", "fishing", "cycling", "bike", "bicycle",
        "skate", "swimming", "diving", "surfing", "climbing", "running",
        "jogging", "tennis", "badminton", "cricket", "football", "basketball",
        "volleyball", "golf", "boxing", "martial", "skipping", "dumbbell",
        "resistance", "jump rope",
    ],
    "Books, Movies & Music": [
        "book", "novel", "magazine", "journal", "notebook", "diary", "planner",
        "stationery", "pen", "pencil", "marker", "highlighter", "eraser", "ruler",
        "sticker", "stamp", "ink", "painting", "canvas", "art", "craft",
        "movie", "music", "cd", "dvd", "poster", "calendar",
    ],
    "Paper & Party Supplies": [
        "paper", "envelope", "card", "invitation", "wrapping", "gift wrap",
        "ribbon", "bow", "balloon", "banner", "streamer", "confetti", "party",
        "celebration", "wedding", "birthday", "anniversary", "festival",
        "decoration", "tablecloth", "plate", "cup", "napkin",
    ],
    "Craft Supplies & Tools": [
        "craft", "diy", "handmade", "sewing", "knitting", "crochet", "embroidery",
        "yarn", "thread", "needle", "pin", "scissor", "cutter", "glue", "tape",
        "tool", "drill", "screwdriver", "hammer", "wrench", "plier", "measure",
        "level", "sander", "saw", "paint", "brush", "roller", "spray",
        "hardware", "repair", "fix", "adhesive", "silicone", "sealant",
    ],
    "Automotive": [
        "car", "vehicle", "auto", "motorcycle", "bike", "scooter", "helmet",
        "tire", "tyre", "engine", "oil", "filter", "cleaner", "polish", "wax",
        "cover", "mat", "charger", "holder", "mount", "phone holder",
        "dashcam", "camera", "sensor", "parking", "keychain", "key",
    ],
    "Food & Beverages": [
        "food", "drink", "beverage", "snack", "candy", "chocolate", "cookie",
        "biscuit", "cake", "bread", "rice", "spice", "tea", "coffee", "juice",
        "water", "oil", "sauce", "noodle", "pasta", "cereal", "honey", "jam",
        "fruit", "vegetable", "meat", "fish", "seafood", "herb", "supplement",
    ],
    "Gifts": [
        "gift", "present", "surprise", "valentine", "anniversary", "birthday",
        "graduation", "housewarming", "keepsake", "souvenir", "memento",
        "personalized", "custom", "engraved", "monogram",
    ],
    "Art & Collectibles": [
        "art", "painting", "print", "poster", "sculpture", "statue", "figurine",
        "collectible", "antique", "vintage", "rare", "limited", "numbered",
        "handmade", "handcrafted", "ceramic", "pottery", "wood carving",
        "metal work", "glass art", "mosaic", "tapestry",
    ],
}

# Product name -> Category override (exact matches from analysis)
PRODUCT_CATEGORY_OVERRIDES = {}

# Map non-existent categories to existing DB categories
CATEGORY_FALLBACK = {
    "fashion": "Clothing",
    "automotive": "Accessories",
    "sports & outdoors": "Accessories",
    "food & beverages": "Home & Living",
    "beauty & personal care": "Bath & Beauty",
}

def categorize_product(name: str, description: str = "") -> str:
    """Auto-categorize a product based on name and description keywords."""
    text = f"{name} {description}".lower()
    
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for kw in keywords:
            if kw in text:
                score += 1 + (len(kw) / 10)
        if score > 0:
            scores[category] = score
    
    if not scores:
        return "Home & Living"
    
    cat = max(scores, key=scores.get)
    return CATEGORY_FALLBACK.get(cat.lower(), cat)


# ─── Utilities ──────────────────────────────────────────
def apply_pricing(original_price: float) -> int:
    marked_up = original_price * 1.25
    rounded = round(marked_up / 50) * 50
    return max(int(rounded - 1), 49)

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    return re.sub(r'-+', '-', text)[:200]

def generate_uuid(seed: str) -> str:
    h = hashlib.md5(seed.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def get_s3_client():
    return boto3.client("s3", endpoint_url=B2_ENDPOINT, region_name=B2_REGION,
        aws_access_key_id=B2_KEY_ID, aws_secret_access_key=B2_APP_KEY)

def find_product_images(code: str) -> list:
    if not IMAGES_DIR.exists():
        return []
    matches = []
    code_upper = code.upper()
    for f in IMAGES_DIR.iterdir():
        if f.is_file():
            stem_upper = f.stem.upper()
            # Match: P00001.jpg, P00001_anything.jpg, P00001-anything.jpg
            if stem_upper == code_upper or stem_upper.startswith(code_upper + "_") or stem_upper.startswith(code_upper + "-") or stem_upper.startswith(code_upper + "."):
                matches.append(f)
    return sorted(matches, key=lambda x: x.name)

def upload_to_b2(s3, local_path: Path, remote_key: str, ct: str = "image/jpeg") -> Optional[str]:
    try:
        with open(local_path, "rb") as f:
            s3.put_object(Bucket=B2_BUCKET, Key=remote_key, Body=f.read(),
                ContentType=ct, CacheControl="public, max-age=31536000, immutable")
        return f"{CDN_URL}/{remote_key}"
    except:
        return None


# ─── Main ──────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true")
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    print("=" * 60)
    print("KANDIYAM A2Z INGESTION v2 (Categorized + Descriptions)")
    print("=" * 60)

    # 1. Read Excel
    print("\n[1/6] Reading Excel...")
    df = pd.read_excel(EXCEL_PATH)
    df = df[df["Product Code"].notna()].copy()
    df = df.drop_duplicates(subset="Product Code", keep="first")
    print(f"  Total unique products: {len(df)}")

    if args.limit > 0:
        df = df.head(args.limit)

    # 2. Apply pricing using Buy Price
    print("\n[2/6] Applying pricing + categorization...")
    df["buy_price"] = df["Buy Price"].fillna(df["Price (LKR)"]).fillna(0).astype(float)
    df["price"] = df["buy_price"].apply(apply_pricing)
    df["compare_at_price"] = df["Price (LKR)"].fillna(df["buy_price"]).astype(float).apply(lambda p: int(p * 1.5))

    df["Available Qty"] = df["Available Qty"].fillna(0).astype(int)
    
    # Categorize
    categories_count = {}
    def cat_product(row):
        name = str(row.get("Name", ""))
        desc = str(row.get("Description", "") or "")
        cat = categorize_product(name, desc)
        categories_count[cat] = categories_count.get(cat, 0) + 1
        return cat
    
    df["category"] = df.apply(cat_product, axis=1)
    
    print(f"  Pricing: LKR {df['price'].min()} - {df['price'].max()}")
    print(f"  Category distribution:")
    for cat, count in sorted(categories_count.items(), key=lambda x: -x[1]):
        print(f"    {cat}: {count}")

    # 3. Match images
    print("\n[3/6] Matching images...")
    products = []
    total_imgs = 0
    for _, row in df.iterrows():
        code = str(row["Product Code"]).strip()
        images = find_product_images(code)
        total_imgs += len(images)
        
        name = str(row.get("Name", "")).strip()
        desc = str(row.get("Description", "") or "").strip()
        if not desc or desc == "nan":
            desc = f"{name} - Premium quality product available at Kandiyam."
        
        products.append({
            "code": code, "name": name, "price": int(row["price"]),
            "compare_at": int(row["compare_at_price"]), "stock": int(row["Available Qty"]),
            "description": desc[:2000], "category": row["category"],
            "slug": f"{slugify(name)}-{code.lower()}-a2z",
            "images": [str(p) for p in images],
        })
    
    print(f"  Products: {len(products)}, Images: {total_imgs}")

    if args.dry_run:
        print("\n[Dry Run] Samples:")
        for p in products[:10]:
            print(f"  {p['code']}: {p['name'][:50]} | {p['category'][:30]} | LKR {p['price']} | {len(p['images'])} imgs")
        return

    # 4. Upload images
    product_image_urls = {}
    if args.upload:
        print(f"\n[4/6] Uploading {total_imgs} images to B2...")
        s3 = get_s3_client()
        tasks = []
        for p in products:
            for ip in p["images"]:
                pp = Path(ip)
                ext = pp.suffix.lower()
                ct = "image/jpeg" if ext in (".jpg",".jpeg") else "image/png" if ext==".png" else "image/webp"
                tasks.append((p["code"], pp, f"{B2_UPLOAD_FOLDER}/{p['code']}/{pp.name}", ct))
        
        uploaded = 0
        with ThreadPoolExecutor(max_workers=MAX_UPLOAD_WORKERS) as ex:
            futures = {ex.submit(upload_to_b2, s3, t[1], t[2], t[3]): t for t in tasks}
            for i, f in enumerate(as_completed(futures)):
                code = futures[f][0]
                url = f.result()
                if url:
                    product_image_urls.setdefault(code, []).append(url)
                    uploaded += 1
                if (i+1) % 500 == 0:
                    print(f"  Progress: {i+1}/{len(tasks)} (OK: {uploaded})")
        print(f"  Uploaded: {uploaded} images")
    else:
        for p in products:
            product_image_urls[p["code"]] = [
                f"{CDN_URL}/{B2_UPLOAD_FOLDER}/{p['code']}/{Path(ip).name}"
                for ip in p["images"]
            ]

    # 5. Insert into DB
    if args.execute:
        print(f"\n[5/6] Inserting {len(products)} products into DB...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        try:
            # Get category ID mapping
            cur.execute("SELECT id, LOWER(name) FROM categories")
            cat_map = {name: cid for cid, name in cur.fetchall()}
            
            # Products
            prod_rows = []
            for p in products:
                pid = generate_uuid(f"a2z-v2-{p['code']}")
                desc_esc = p["description"].replace("'", "''")[:2000]
                name_esc = p["name"].replace("'", "''")[:255]
                prod_rows.append((pid, DEFAULT_VENDOR_ID, name_esc, p["slug"], desc_esc,
                    p["price"], p["compare_at"], "LKR", p["stock"], p["code"],
                    "PUBLISHED", False, False, datetime.now(timezone.utc),
                    datetime.now(timezone.utc), datetime.now(timezone.utc)))
            
            execute_values(cur, """
                INSERT INTO products (id, "vendorId", title, slug, description, price, "compareAtPrice",
                    currency, quantity, sku, status, "isFeatured", "isHandmade",
                    "createdAt", "updatedAt", "publishedAt")
                VALUES %s
                ON CONFLICT (id) DO UPDATE SET
                    title=EXCLUDED.title, slug=EXCLUDED.slug, description=EXCLUDED.description,
                    price=EXCLUDED.price, "compareAtPrice"=EXCLUDED."compareAtPrice",
                    quantity=EXCLUDED.quantity, sku=EXCLUDED.sku, "updatedAt"=NOW()
            """, prod_rows, page_size=BATCH_SIZE)
            print(f"  Products: {cur.rowcount} inserted/updated")
            
            # Product Images
            img_rows = []
            for p in products:
                pid = generate_uuid(f"a2z-v2-{p['code']}")
                for idx, url in enumerate(product_image_urls.get(p["code"], [])):
                    iid = generate_uuid(f"a2z-v2-img-{p['code']}-{idx}")
                    img_rows.append((iid, pid, url, url, url, url, idx, idx==0, datetime.now(timezone.utc)))
            
            if img_rows:
                execute_values(cur, """
                    INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "sortOrder", "isPrimary", "createdAt")
                    VALUES %s ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url, thumbnail=EXCLUDED.thumbnail, medium=EXCLUDED.medium, large=EXCLUDED.large
                """, img_rows, page_size=BATCH_SIZE)
                print(f"  Images: {cur.rowcount} inserted/updated")
            
            # Product-Category links
            cat_link_rows = []
            for p in products:
                pid = generate_uuid(f"a2z-v2-{p['code']}")
                cat_lower = p["category"].lower()
                cat_id = cat_map.get(cat_lower)
                if cat_id:
                    cat_link_rows.append((pid, cat_id))
            
            if cat_link_rows:
                execute_values(cur, """
                    INSERT INTO product_categories ("productId", "categoryId")
                    VALUES %s ON CONFLICT DO NOTHING
                """, cat_link_rows, page_size=BATCH_SIZE)
                print(f"  Category links: {cur.rowcount}")
            
            # Delete old A2Z v1 products
            # Keep only v2 products
            cur.execute("DELETE FROM product_images WHERE id LIKE 'a2z-img-%'")
            cur.execute("DELETE FROM products WHERE id LIKE 'a2z-prod-%'")
            cur.execute("DELETE FROM product_images WHERE id LIKE 'a2z-v1-img-%'")
            cur.execute("DELETE FROM products WHERE id LIKE 'a2z-v1-prod-%'")
            
            conn.commit()
            print("  COMMIT - Done!")
        except Exception as e:
            conn.rollback()
            print(f"  ROLLBACK - Error: {str(e)[:500]}")
            raise
        finally:
            cur.close()
            conn.close()

    # 6. Summary
    print(f"\n[6/6] Summary")
    print(f"  Products: {len(products)}")
    print(f"  Images linked: {sum(len(v) for v in product_image_urls.values())}")
    cat_counts = {}
    for p in products:
        cat_counts[p["category"]] = cat_counts.get(p["category"], 0) + 1
    for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    print("=" * 60)


if __name__ == "__main__":
    main()
