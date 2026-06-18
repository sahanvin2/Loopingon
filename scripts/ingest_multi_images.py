import psycopg2, boto3, os, re
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
from botocore.config import Config
from collections import defaultdict

DB = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"
IMAGES_DIR = Path(r"D:\Python\Data scrap\product_images_multi")
B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
B2_KEY_ID = "0053aaa597862ee0000000001"
B2_APP_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs"
B2_BUCKET = "movia-prod"
CDN_URL = "https://kandyam.b-cdn.net"
B2_FOLDER = "products/a2z"
MAX_WORKERS = 30
BATCH_SIZE = 100

print("=" * 60)
print("KANDIYAM MULTI-IMAGE INGESTION")
print("=" * 60)

# Step 1: Map images to products by SKU
print("\n[1/4] Mapping images...")
sku_images = defaultdict(list)
for f in IMAGES_DIR.iterdir():
    if not f.is_file():
        continue
    stem = f.stem
    # Match SKU_N pattern (e.g., C0001_1, P08406_2, KD00010_1)
    m = re.match(r'^([A-Z]+\d+)_(\d+)', stem, re.IGNORECASE)
    if m:
        sku = m.group(1).upper()
        sort_order = int(m.group(2))
        sku_images[sku].append((sort_order, f))
    else:
        # Simple filename without number (e.g., P00001.jpg)
        sku = stem.upper()
        sku_images[sku].append((1, f))

# Sort images within each SKU by number
for sku in sku_images:
    sku_images[sku].sort(key=lambda x: x[0])

total_products = len(sku_images)
total_images = sum(len(v) for v in sku_images.values())
print(f"  Products: {total_products}")
print(f"  Images: {total_images}")
print(f"  Avg per product: {total_images/total_products:.1f}")

# Show multi-image examples
multi = {k: v for k, v in sku_images.items() if len(v) > 3}
print(f"  Products with 4+ images: {len(multi)}")
for sku in list(multi.keys())[:5]:
    print(f"    {sku}: {len(sku_images[sku])} images")

# Step 2: Match to database products
print("\n[2/4] Matching to database...")
c = psycopg2.connect(DB)
cur = c.cursor()

cur.execute("SELECT sku, id FROM products WHERE sku IS NOT NULL")
db_skus = {r[0].upper(): r[1] for r in cur.fetchall()}
print(f"  DB products: {len(db_skus)}")

matched = 0
unmatched = 0
for sku in sku_images:
    if sku in db_skus:
        matched += 1
    else:
        unmatched += 1

print(f"  Matched: {matched}")
print(f"  Unmatched: {unmatched}")

# Step 3: Upload images to B2
print(f"\n[3/4] Uploading {total_images} images to B2...")
s3 = boto3.client("s3", endpoint_url=B2_ENDPOINT, region_name="us-east-005",
    aws_access_key_id=B2_KEY_ID, aws_secret_access_key=B2_APP_KEY,
    config=Config(signature_version="s3v4"))

def upload_file(sku, sort_order, filepath):
    ext = filepath.suffix.lower()
    ct = "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png" if ext == ".png" else "image/webp" if ext == ".webp" else "application/octet-stream"
    key = f"{B2_FOLDER}/{sku}/{filepath.name}"
    try:
        with open(filepath, "rb") as f:
            s3.put_object(Bucket=B2_BUCKET, Key=key, Body=f.read(),
                ContentType=ct, CacheControl="public, max-age=31536000, immutable")
        return (sku, sort_order, f"{CDN_URL}/{key}", True)
    except Exception as e:
        return (sku, sort_order, None, False)

tasks = []
for sku, images in sku_images.items():
    for sort_order, filepath in images:
        tasks.append((sku, sort_order, filepath))

uploaded = 0
failed = 0
product_urls = defaultdict(list)

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
    futures = {ex.submit(upload_file, t[0], t[1], t[2]): t for t in tasks}
    for i, f in enumerate(as_completed(futures)):
        sku, sort_order, url, ok = f.result()
        if ok:
            product_urls[sku].append((sort_order, url))
            uploaded += 1
        else:
            failed += 1
        if (i + 1) % 500 == 0:
            print(f"  {i+1}/{len(tasks)} (OK: {uploaded}, Failed: {failed})")

print(f"  Done: {uploaded} OK, {failed} failed")
print(f"  Products with images: {len(product_urls)}")

# Step 4: Update database
print(f"\n[4/4] Updating database...")

# Delete old images for matching products
sku_list = [s for s in sku_images.keys() if s in db_skus]
product_ids = [db_skus[s] for s in sku_list]

# Batch delete old images
for i in range(0, len(product_ids), 500):
    batch = product_ids[i:i+500]
    cur.execute("""DELETE FROM product_images WHERE "productId" = ANY(%s)""", (batch,))
print(f"  Old images deleted: {cur.rowcount}")

# Batch insert new images
img_rows = []
import hashlib
def gen_id(seed):
    h = hashlib.md5(seed.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

for sku, urls in product_urls.items():
    if sku not in db_skus:
        continue
    pid = db_skus[sku]
    for idx, (sort_order, url) in enumerate(sorted(urls)):
        img_id = gen_id(f"multi-{sku}-{idx}")
        img_rows.append((img_id, pid, url, url, url, url, sort_order - 1, sort_order == 1, datetime.now(timezone.utc)))

if img_rows:
    from psycopg2.extras import execute_values
    execute_values(cur, """
        INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "sortOrder", "isPrimary", "createdAt")
        VALUES %s ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url, thumbnail=EXCLUDED.thumbnail, medium=EXCLUDED.medium, large=EXCLUDED.large, "sortOrder"=EXCLUDED."sortOrder", "isPrimary"=EXCLUDED."isPrimary"
    """, img_rows, page_size=100)
    print(f"  Images inserted: {cur.rowcount}")

c.commit()

# Verify
cur.execute("SELECT COUNT(*) FROM product_images")
total_imgs = cur.fetchone()[0]
cur.execute("""SELECT COUNT(DISTINCT "productId") FROM product_images""")
total_prods = cur.fetchone()[0]
print(f"\n  Final: {total_imgs} images across {total_prods} products")

cur.close()
c.close()
print("\nDone!")
