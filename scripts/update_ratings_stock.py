import psycopg2
import pandas as pd
import random
import math

DB = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"
EXCEL = r"D:\Python\Data scrap\a2z_products_complete.xlsx"

random.seed(42)

c = psycopg2.connect(DB)
cur = c.cursor()

# 1. Read Excel for stock updates
df = pd.read_excel(EXCEL)
df = df[df["Product Code"].notna()].copy()
df = df.drop_duplicates(subset="Product Code", keep="first")
df["qty"] = df["Available Qty"].fillna(0).astype(int)

# 2. Update stock quantities from Excel
updated = 0
for _, row in df.iterrows():
    sku = str(row["Product Code"]).strip()
    qty = int(row["qty"])
    cur.execute("""UPDATE products SET quantity = %s WHERE sku = %s""", (qty, sku))
    if cur.rowcount > 0:
        updated += 1
print(f"Stock updated: {updated} products")

# 3. Generate realistic ratings based on quantity and price
# Products with more stock → slightly higher rating (more popular = more reviews = better rating)
# Price is a weak signal for quality
cur.execute("""SELECT id, sku, price, quantity FROM products WHERE sku LIKE 'P0%'""")
products = cur.fetchall()

ratings_updated = 0
for prod_id, sku, price, qty in products:
    price_num = float(price) if price else 1000
    
    # Base rating: 3.5-4.2, adjusted by:
    # - Higher stock → slightly higher rating (available = popular)
    # - Higher price → slightly higher rating (more expensive = better quality perception)
    base = 3.8
    stock_bonus = min(math.log(max(qty, 1)) * 0.15, 0.5)
    price_bonus = min(math.log(max(price_num, 100)) * 0.08, 0.4)
    
    # Add randomness for uniqueness
    noise = random.gauss(0, 0.25)
    
    rating = round(base + stock_bonus + price_bonus + noise, 1)
    rating = max(1.0, min(5.0, rating))
    
    # Review count correlates with stock and rating
    review_count = int(abs(qty * 0.3 + random.gauss(5, 15)))
    review_count = max(0, min(review_count, 500))
    
    # Sales count = roughly review_count * 20-50
    sales_count = int(review_count * random.uniform(20, 50)) if review_count > 0 else random.randint(0, 50)
    
    # Views count
    views_count = int(sales_count * random.uniform(3, 8))
    
    cur.execute("""UPDATE products SET 
        "averageRating" = %s, 
        "reviewCount" = %s, 
        "salesCount" = %s, 
        "viewsCount" = %s
        WHERE id = %s""", (rating, review_count, sales_count, views_count, prod_id))
    ratings_updated += 1

print(f"Ratings generated: {ratings_updated} products")

c.commit()

# Show stats
cur.execute("""SELECT 
    COUNT(*) as total,
    ROUND(AVG("averageRating")::numeric, 1) as avg_rating,
    SUM("reviewCount") as total_reviews,
    SUM("salesCount") as total_sales
    FROM products""")
r = cur.fetchone()
print(f"\nFinal stats: {r[0]} products, avg rating: {r[1]}, {r[2]:,} reviews, {r[3]:,} sales")

cur.execute("""SELECT "averageRating"::int as stars, COUNT(*) 
    FROM products GROUP BY stars ORDER BY stars""")
print("Rating distribution:")
for r in cur.fetchall():
    print(f"  {r[0]}★: {r[1]:,}")

cur.execute("""SELECT quantity > 0 as in_stock, COUNT(*) 
    FROM products GROUP BY in_stock ORDER BY in_stock DESC""")
print("Stock status:")
for r in cur.fetchall():
    print(f"  {'In stock' if r[0] else 'Out of stock'}: {r[1]:,}")

cur.close()
c.close()
print("\nDone!")
