#!/usr/bin/env python3
"""
Kandiyam A2Z Product Ingestion Pipeline
========================================
1. Reads a2z_products_new.xlsx
2. Filters products with stock > 0
3. Applies pricing: round(price * 1.25 / 50) * 50 - 1
4. Matches images from product_images/Uncategorized by product code
5. Uploads images to Backblaze B2 (served via Bunny CDN)
6. Generates SQL or JSON for database import

Usage:
  python scripts/ingest_a2z.py --generate-sql        # Generate SQL file only
  python scripts/ingest_a2z.py --upload              # Upload images + generate SQL
  python scripts/ingest_a2z.py --upload --execute    # Upload + execute SQL against DB
"""

import os
import sys
import json
import hashlib
import argparse
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional

import pandas as pd
import boto3
from botocore.config import Config

# ─── Configuration ───────────────────────────────────────────────
EXCEL_PATH = r"D:\Python\Data scrap\a2z_products_new.xlsx"
IMAGES_DIR = Path(r"D:\Python\Data scrap\product_images\Uncategorized")
OUTPUT_DIR = Path(r"D:\Mern\Loopingon\loopingon\scripts\output")

# B2 / Backblaze Storage (from apps/server/.env)
B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
B2_REGION = "us-east-005"
B2_KEY_ID = "0053aaa597862ee0000000001"
B2_APP_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs"
B2_BUCKET = "movia-prod"
CDN_URL = "https://kandyam.b-cdn.net"  # Bunny CDN
B2_UPLOAD_FOLDER = "products/a2z"       # Folder prefix in bucket

# Database
DB_URL = os.environ.get("DATABASE_URL", "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")

# Concurrency
MAX_UPLOAD_WORKERS = 20
BATCH_SIZE = 100  # SQL batch size

# Vendor - use existing vendor from database
DEFAULT_VENDOR_ID = "d7c0ae2a-8ac5-457f-a713-6d45fc4f6daa"
DEFAULT_VENDOR_NAME = "Deepani Guathilake Creations"


def apply_pricing(original_price: float) -> int:
    """Apply Kandiyam pricing: round(price * 1.25 / 50) * 50 - 1"""
    marked_up = original_price * 1.25
    rounded = round(marked_up / 50) * 50
    return max(int(rounded - 1), 49)  # minimum price of 49 LKR


def slugify(text: str) -> str:
    """Create URL-safe slug from text"""
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text[:200]


def get_s3_client():
    """Create boto3 S3 client for Backblaze B2"""
    return boto3.client(
        "s3",
        endpoint_url=B2_ENDPOINT,
        region_name=B2_REGION,
        aws_access_key_id=B2_KEY_ID,
        aws_secret_access_key=B2_APP_KEY,
        config=Config(signature_version="s3v4", max_pool_connections=MAX_UPLOAD_WORKERS, retries={'max_attempts': 3}),
    )


# Cache directory listing globally
_ALL_IMAGES = []
_IMAGES_CACHED = False

def find_product_images(product_code: str) -> list[Path]:
    """Find all image files in IMAGES_DIR that start with the product code"""
    global _ALL_IMAGES, _IMAGES_CACHED
    if not IMAGES_DIR.exists():
        return []
        
    if not _IMAGES_CACHED:
        _ALL_IMAGES = [f for f in IMAGES_DIR.iterdir() if f.is_file()]
        _IMAGES_CACHED = True
    
    matches = []
    code_upper = product_code.upper()
    for f in _ALL_IMAGES:
        if f.name.upper().startswith(code_upper):
            # Must match exactly: P00001_xxx.jpg (not P000011_xxx.jpg)
            base = f.stem.upper()
            if base == code_upper or base.startswith(code_upper + "_") or base.startswith(code_upper + "-"):
                matches.append(f)
    
    # Sort for consistent ordering
    matches.sort(key=lambda x: x.name)
    return matches


def upload_file_to_b2(s3_client, local_path: Path, remote_key: str, content_type: str = "image/jpeg") -> Optional[str]:
    """Upload a single file to B2. Returns CDN URL or None on failure."""
    try:
        with open(local_path, "rb") as f:
            data = f.read()
        
        s3_client.put_object(
            Bucket=B2_BUCKET,
            Key=remote_key,
            Body=data,
            ContentType=content_type,
            CacheControl="public, max-age=31536000, immutable",
        )
        return f"{CDN_URL}/{remote_key}"
    except Exception as e:
        print(f"  [ERROR] Failed to upload {local_path.name}: {e}")
        return None


def generate_uuid(seed: str) -> str:
    """Generate a deterministic UUID v5-like ID from a seed string"""
    h = hashlib.md5(seed.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


# ─── Main Pipeline ──────────────────────────────────────────────

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    parser = argparse.ArgumentParser(description="Kandiyam A2Z Product Ingestion")
    parser.add_argument("--generate-sql", action="store_true", help="Generate SQL file only (no uploads)")
    parser.add_argument("--upload", action="store_true", help="Upload images to B2")
    parser.add_argument("--execute", action="store_true", help="Execute SQL against database (requires psycopg2)")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of products to process (0 = all)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without uploading or generating SQL")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("KANDIYAM A2Z PRODUCT INGESTION PIPELINE")
    print("=" * 60)

    # ── Step 1: Read Excel ──
    print("\n[1/5] Reading Excel file...")
    df = pd.read_excel(EXCEL_PATH)
    print(f"  Total rows: {len(df)}")

    # Filter: must have product code, keep ALL (including 0 stock)
    df = df[df["Product Code"].notna()].copy()
    
    # Merge duplicates (same product code): sum quantities, keep first occurrence
    dup_count = df.duplicated(subset="Product Code").sum()
    if dup_count > 0:
        print(f"  Merging {dup_count} duplicate product codes...")
        df = df.groupby("Product Code", as_index=False).agg({
            "Name": "first",
            "Price (LKR)": "first",
            "Available Qty": "sum",
            "Description": "first",
            "Category": "first",
            "Brand": "first",
        })
    
    df = df.reset_index(drop=True)
    
    # Determine stock status
    in_stock = (df["Available Qty"] > 0).sum()
    out_of_stock = len(df) - in_stock
    print(f"  In stock: {in_stock}, Out of stock: {out_of_stock}, Total: {len(df)}")

    if args.limit > 0:
        df = df.head(args.limit)
        print(f"  Limited to: {len(df)}")

    # Apply pricing
    df["price"] = df["Price (LKR)"].apply(apply_pricing)
    df["compare_at_price"] = df["Price (LKR)"].apply(lambda p: int(round(p * 1.499)))  # Strike-through: ~1.5x original
    
    # Generate slugs
    df["slug"] = df.apply(lambda r: f"{slugify(r['Name'])}-{r['Product Code'].lower()}", axis=1)
    
    print(f"  Price range: LKR {df['price'].min():,} - LKR {df['price'].max():,}")
    print(f"  Price examples: {df['price'].head(10).tolist()}")

    # ── Step 2: Match Images ──
    print(f"\n[2/5] Matching images from {IMAGES_DIR}...")
    if not IMAGES_DIR.exists():
        print(f"  [WARN] Image directory not found: {IMAGES_DIR}")
    
    products = []
    total_images_found = 0
    products_with_images = 0

    for _, row in df.iterrows():
        code = str(row["Product Code"]).strip()
        images = find_product_images(code) if IMAGES_DIR.exists() else []
        
        if images:
            total_images_found += len(images)
            products_with_images += 1
        
        desc = str(row.get("Description", "") or "")
        name = str(row.get("Name", "")).strip()
        if pd.isna(row.get("Description")) or not desc or desc == "nan":
            desc = f"Premium {name} - Available at Kandiyam. Quality guaranteed."
        
        products.append({
            "product_code": code,
            "name": name,
            "price": int(row["price"]),
            "compare_at_price": int(row["compare_at_price"]),
            "stock": int(row["Available Qty"]),
            "description": desc,
            "slug": row["slug"],
            "images": [str(p) for p in images],
            "image_count": len(images),
            "status": "PUBLISHED" if int(row["Available Qty"]) > 0 else "OUT_OF_STOCK",
        })

    print(f"  Products with images: {products_with_images} / {len(products)}")
    print(f"  Total images matched: {total_images_found}")

    if args.dry_run:
        print("\n[Dry Run] Sample products:")
        for p in products[:5]:
            print(f"  {p['product_code']}: {p['name'][:50]} | LKR {p['price']} | {p['image_count']} images")
        print(f"\n  Total products: {len(products)}")
        print(f"  Total images to upload: {total_images_found}")
        return

    # ── Step 3: Upload Images to B2 ──
    product_image_urls = {}  # product_code -> list of CDN URLs
    
    urls_file = OUTPUT_DIR / "image_urls.json"
    if urls_file.exists():
        try:
            with open(urls_file, "r", encoding="utf-8") as f:
                product_image_urls = json.load(f)
            print(f"  Loaded {sum(len(urls) for urls in product_image_urls.values())} existing image URLs from previous run.")
        except Exception as e:
            print(f"  [WARN] Failed to load existing image_urls.json: {e}")

    if args.upload:
        print(f"\n[3/5] Uploading images to B2 (bucket: {B2_BUCKET})...")
        s3 = get_s3_client()
        
        upload_tasks = []
        for p in products:
            existing_urls = product_image_urls.get(p["product_code"], [])
            for img_path_str in p["images"]:
                img_path = Path(img_path_str)
                remote_key = f"{B2_UPLOAD_FOLDER}/{p['product_code']}/{img_path.name}"
                expected_url = f"{CDN_URL}/{remote_key}"
                
                if expected_url in existing_urls:
                    continue # Skip already uploaded
                    
                ext = img_path.suffix.lower()
                content_type = "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png" if ext == ".png" else "image/webp" if ext == ".webp" else "application/octet-stream"
                upload_tasks.append((p["product_code"], img_path, remote_key, content_type))
        
        print(f"  Uploading {len(upload_tasks)} images with {MAX_UPLOAD_WORKERS} workers...")
        
        uploaded = 0
        failed = 0
        
        def do_upload(task):
            code, path, key, ct = task
            url = upload_file_to_b2(s3, path, key, ct)
            return code, url
        
        with ThreadPoolExecutor(max_workers=MAX_UPLOAD_WORKERS) as executor:
            futures = {executor.submit(do_upload, t): t for t in upload_tasks}
            for i, future in enumerate(as_completed(futures)):
                code, url = future.result()
                if url:
                    if code not in product_image_urls:
                        product_image_urls[code] = []
                    product_image_urls[code].append(url)
                    uploaded += 1
                else:
                    failed += 1
                
                if (i + 1) % 50 == 0:
                    print(f"  Progress: {i + 1}/{len(upload_tasks)} (OK: {uploaded}, Failed: {failed})", flush=True)
                    # Periodically save
                    with open(OUTPUT_DIR / "image_urls.json", "w", encoding="utf-8") as f:
                        json.dump(product_image_urls, f, indent=2, ensure_ascii=False)
        
        print(f"  Upload complete: {uploaded} OK, {failed} failed")
        print(f"  Products with uploaded images: {len(product_image_urls)}")

        # Save mapping
        with open(OUTPUT_DIR / "image_urls.json", "w", encoding="utf-8") as f:
            json.dump(product_image_urls, f, indent=2, ensure_ascii=False)
        print(f"  Saved image mapping to: {OUTPUT_DIR / 'image_urls.json'}")
    else:
        print(f"\n[3/5] Skipping uploads (use --upload to upload images)")
        # Still build the image_urls map from existing files (for SQL generation without CDN)
        for p in products:
            code = p["product_code"]
            product_image_urls[code] = [
                f"{CDN_URL}/{B2_UPLOAD_FOLDER}/{code}/{Path(ip).name}"
                for ip in p["images"]
            ]

    # ── Step 4: Generate SQL (batch INSERTs for performance) ──
    print(f"\n[4/5] Generating SQL...")
    
    sql_lines = []
    sql_lines.append("-- ============================================================")
    sql_lines.append("-- Kandiyam A2Z Product Import - Auto-generated")
    sql_lines.append(f"-- Generated: {datetime.now(timezone.utc).isoformat()}")
    sql_lines.append(f"-- Products: {len(products)}")
    sql_lines.append("-- ============================================================")
    sql_lines.append("")
    sql_lines.append("BEGIN;")
    sql_lines.append("")
    
    # Batch INSERT products (100 per batch)
    sql_lines.append(f"-- Products ({len(products)} items, batched)")
    
    for batch_start in range(0, len(products), BATCH_SIZE):
        batch = products[batch_start:batch_start + BATCH_SIZE]
        values_parts = []
        for p in batch:
            product_id = generate_uuid(f"a2z-prod-{p['product_code']}")
            desc_escaped = p["description"].replace("'", "''")[:2000]
            name_escaped = p["name"].replace("'", "''")[:255]
            values_parts.append(
                f"('{product_id}', '{DEFAULT_VENDOR_ID}', '{name_escaped}', '{p['slug']}', "
                f"'{desc_escaped}', {p['price']}, {p['compare_at_price']}, 'LKR', "
                f"{p['stock']}, '{p['product_code']}', 'PUBLISHED', false, false, NOW(), NOW(), NOW())"
            )
        
        sql_lines.append(f"""
INSERT INTO products (
  id, "vendorId", title, slug, description, price, "compareAtPrice",
  currency, quantity, sku, status, "isFeatured", "isHandmade",
  "createdAt", "updatedAt", "publishedAt"
) VALUES
  {',\n  '.join(values_parts)}
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  "compareAtPrice" = EXCLUDED."compareAtPrice",
  quantity = EXCLUDED.quantity,
  description = EXCLUDED.description,
  "updatedAt" = NOW();
""")
    
    # Batch INSERT product images (100 per batch)
    sql_lines.append(f"\n-- Product Images (batched)")
    image_sql_count = 0
    all_images = []
    for p in products:
        code = p["product_code"]
        urls = product_image_urls.get(code, [])
        product_id = generate_uuid(f"a2z-prod-{code}")
        for idx, url in enumerate(urls):
            img_id = generate_uuid(f"a2z-img-{code}-{idx}")
            all_images.append((img_id, product_id, url, idx))
    
    image_sql_count = len(all_images)
    for batch_start in range(0, len(all_images), BATCH_SIZE):
        batch = all_images[batch_start:batch_start + BATCH_SIZE]
        values_parts = []
        for img_id, product_id, url, idx in batch:
            values_parts.append(
                f"('{img_id}', '{product_id}', '{url}', '{url}', '{url}', '{url}', "
                f"{idx}, {str(idx == 0).lower()}, NOW())"
            )
        
        sql_lines.append(f"""
INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "sortOrder", "isPrimary", "createdAt")
VALUES
  {',\n  '.join(values_parts)}
ON CONFLICT (id) DO NOTHING;
""")
    
    sql_lines.append(f"\n-- Total product images: {image_sql_count}")
    
    sql_lines.append("\nCOMMIT;")
    sql_lines.append(f"\n-- Done. {len(products)} products, {image_sql_count} images inserted into vendor: {DEFAULT_VENDOR_NAME}")
    
    sql_output = "\n".join(sql_lines)
    sql_path = OUTPUT_DIR / "import_products.sql"
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(sql_output)
    print(f"  SQL saved to: {sql_path}")
    print(f"  SQL file size: {sql_path.stat().st_size / 1024 / 1024:.1f} MB")

    # Also save a JSON version for easier parsing
    products_json = []
    for p in products:
        code = p["product_code"]
        products_json.append({
            "product_code": code,
            "name": p["name"],
            "price": p["price"],
            "compare_at_price": p["compare_at_price"],
            "stock": p["stock"],
            "slug": p["slug"],
            "description": p["description"],
            "image_urls": product_image_urls.get(code, []),
        })
    
    json_path = OUTPUT_DIR / "products.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products_json, f, indent=2, ensure_ascii=False)
    print(f"  JSON saved to: {json_path}")

    # ── Step 5: Execute SQL via psycopg2 with batch parameterization ──
    if args.execute:
        print(f"\n[5/5] Executing inserts directly via psycopg2 (parameterized, batched)...")
        try:
            import psycopg2
            from psycopg2.extras import execute_values
            
            conn = psycopg2.connect(DB_URL)
            conn.autocommit = False  # Manual transaction
            cur = conn.cursor()
            
            try:
                # Batch INSERT products
                print(f"  Inserting {len(products)} products...")
                product_rows = []
                for p in products:
                    product_id = generate_uuid(f"a2z-prod-{p['product_code']}")
                    product_rows.append((
                        product_id, DEFAULT_VENDOR_ID, p["name"], p["slug"],
                        p["description"], p["price"], p["compare_at_price"],
                        "LKR", p["stock"], p["product_code"], p.get("status", "PUBLISHED"),
                        False, False, datetime.now(timezone.utc), datetime.now(timezone.utc), datetime.now(timezone.utc)
                    ))
                
                execute_values(cur, """
                    INSERT INTO products (
                        id, "vendorId", title, slug, description, price, "compareAtPrice",
                        currency, quantity, sku, status, "isFeatured", "isHandmade",
                        "createdAt", "updatedAt", "publishedAt"
                    ) VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        slug = EXCLUDED.slug,
                        description = EXCLUDED.description,
                        price = EXCLUDED.price,
                        "compareAtPrice" = EXCLUDED."compareAtPrice",
                        quantity = EXCLUDED.quantity,
                        sku = EXCLUDED.sku,
                        "updatedAt" = NOW()
                """, product_rows, page_size=BATCH_SIZE)
                print(f"  Products: {cur.rowcount} inserted/updated")
                
                # Batch INSERT product images
                print(f"  Inserting {image_sql_count} product images...")
                image_rows = []
                for p in products:
                    code = p["product_code"]
                    urls = product_image_urls.get(code, [])
                    product_id = generate_uuid(f"a2z-prod-{code}")
                    for idx, url in enumerate(urls):
                        img_id = generate_uuid(f"a2z-img-{code}-{idx}")
                        image_rows.append((
                            img_id, product_id, url, url, url, url, idx, idx == 0,
                            datetime.now(timezone.utc)
                        ))
                
                if image_rows:
                    execute_values(cur, """
                        INSERT INTO product_images (
                            id, "productId", url, thumbnail, medium, large,
                            "sortOrder", "isPrimary", "createdAt"
                        ) VALUES %s
                        ON CONFLICT (id) DO UPDATE SET
                            url = EXCLUDED.url,
                            thumbnail = EXCLUDED.thumbnail,
                            medium = EXCLUDED.medium,
                            large = EXCLUDED.large
                    """, image_rows, page_size=BATCH_SIZE)
                    print(f"  Images: {cur.rowcount} inserted/updated")
                
                conn.commit()
                print(f"  COMMIT - All data inserted successfully!")
                
            except Exception as e:
                conn.rollback()
                print(f"  ROLLBACK - Error: {str(e)[:500]}")
                raise
            
            cur.close()
            conn.close()
            
        except ImportError:
            print(f"  [ERROR] psycopg2 not installed. Run: pip install psycopg2-binary")
        except Exception as e:
            print(f"  [ERROR] Database error: {str(e)[:500]}")

    # Summary
    print(f"\n{'=' * 60}")
    print(f"SUMMARY")
    print(f"  Products processed: {len(products)}")
    print(f"  Images matched: {total_images_found}")
    if args.upload:
        print(f"  Images uploaded to B2: {uploaded} OK, {failed} failed")
    print(f"  SQL file: {sql_path}")
    print(f"  CDN Base: {CDN_URL}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
