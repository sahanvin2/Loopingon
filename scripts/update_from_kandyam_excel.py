import psycopg2
import pandas as pd
import random
import math

random.seed(42)

DB = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"
EXCEL = r"D:\Mern\Loopingon\loopingon\Assets\kandyam_products.xlsx"

df = pd.read_excel(EXCEL)
print(f"Excel: {len(df)} products")

c = psycopg2.connect(DB)
cur = c.cursor()

# Clean test products first
cur.execute("DELETE FROM product_categories WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR sku LIKE 'PC-%' OR sku LIKE 'p0-%')")
cur.execute("DELETE FROM product_images WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR sku LIKE 'PC-%' OR sku LIKE 'p0-%')")
cur.execute("DELETE FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR sku LIKE 'PC-%' OR sku LIKE 'p0-%'")
print(f"Cleaned test products")

# Build lookup from Excel
excel_data = {}
for _, row in df.iterrows():
    code = str(row["Product Code"]).strip()
    if not code or pd.isna(code):
        continue
    
    price = float(row.get("Kandyam Store Price", 0) or 0)
    compare = float(row.get("Compare At Price", 0) or 0)
    stock = int(float(row.get("Stock Qty", 0) or 0))
    desc = str(row.get("Description", "") or "").strip()
    if not desc or desc == "nan":
        name = str(row.get("Name", ""))
        desc = f"{name} - Premium quality product available at Kandiyam."
    delivery = float(row.get("Delivery Charge (LKR)", 400) or 400)
    
    # Ensure minimum price of 99
    if price < 99:
        price = 99
    
    excel_data[code] = {
        "price": price,
        "compare": compare,
        "stock": stock,
        "description": desc[:2000],
        "delivery": delivery,
    }

print(f"Excel lookup: {len(excel_data)} products")

# Update all matching products
updated = 0
updated_desc = 0
updated_stock = 0

for sku, data in excel_data.items():
    cur.execute("""
        UPDATE products SET 
            price = %s, 
            "compareAtPrice" = %s, 
            quantity = %s, 
            description = %s,
            "shippingPrice" = %s,
            status = CASE WHEN %s > 0 THEN 'PUBLISHED'::"ProductStatus" ELSE 'OUT_OF_STOCK'::"ProductStatus" END,
            "updatedAt" = NOW()
        WHERE sku = %s
    """, (data["price"], data["compare"], data["stock"], 
          data["description"], data["delivery"], data["stock"], sku))
    
    if cur.rowcount > 0:
        updated += 1
        if data["description"] and len(data["description"]) > 30:
            updated_desc += 1
        if data["stock"] > 0:
            updated_stock += 1

print(f"Updated: {updated} products")
print(f"With descriptions: {updated_desc}")
print(f"In stock: {updated_stock}")

# Generate realistic ratings for ALL products (if not already set)
cur.execute("""UPDATE products SET 
    "averageRating" = ROUND((3.5 + RANDOM() * 1.5)::numeric, 1),
    "reviewCount" = FLOOR(RANDOM() * 200 + 5)::int,
    "salesCount" = FLOOR(RANDOM() * 500 + 10)::int,
    "viewsCount" = FLOOR(RANDOM() * 3000 + 50)::int
    WHERE "averageRating" = 0 OR "averageRating" IS NULL""")
print(f"Ratings generated: {cur.rowcount}")

c.commit()

# Final stats
cur.execute("""SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE quantity > 0) as in_stock,
    MIN(price) as min_price,
    MAX(price) as max_price,
    ROUND(AVG("averageRating")::numeric, 1) as avg_rating
    FROM products""")
r = cur.fetchone()
print(f"\nFinal: {r[0]} products, {r[1]} in stock, LKR {r[2]:.0f}-{r[3]:.0f}, {r[4]} avg rating")

# Show price samples
cur.execute("""SELECT sku, title, price, quantity FROM products ORDER BY price LIMIT 10""")
print("\nLowest priced:")
for r in cur.fetchall():
    print(f"  {r[0]:12s} LKR {r[2]:6.0f} qty={r[3]:4d} {r[1][:40]}")

cur.execute("""SELECT sku, title, price, quantity FROM products WHERE price > 10000 ORDER BY price DESC LIMIT 5""")
print("\nHighest priced:")
for r in cur.fetchall():
    print(f"  {r[0]:12s} LKR {r[2]:6.0f} qty={r[3]:4d} {r[1][:40]}")

cur.close()
c.close()
print("\nDone!")
