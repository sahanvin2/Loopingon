import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

# Check low-price products
cur.execute("SELECT count(*), min(price), max(price) FROM products WHERE price < 100")
r = cur.fetchone()
print(f"Products under LKR 100: {r[0]}, min={r[1]}, max={r[2]}")

cur.execute("""
    SELECT sku, title, price, quantity, status 
    FROM products WHERE price <= 49 
    ORDER BY price LIMIT 15
""")
print("\nProducts at LKR 49 or less:")
for r in cur.fetchall():
    print(f"  {r[0]:12s} LKR {r[2]:6.0f} qty={r[3]} [{r[4]}] {r[1][:50]}")

# Check total stats
cur.execute("SELECT count(*) FROM products")
print(f"\nTotal products: {cur.fetchone()[0]}")

cur.execute("SELECT count(*) FROM product_images")
print(f"Total images: {cur.fetchone()[0]}")

cur.execute("""
    SELECT count(*) FROM products p 
    LEFT JOIN product_images pi ON p.id = pi."productId" 
    WHERE pi.id IS NULL
""")
print(f"Products WITHOUT images: {cur.fetchone()[0]}")

# Check seed products (non-P0, non-KD SKUs)
cur.execute("""
    SELECT sku, title, price FROM products 
    WHERE sku NOT LIKE 'P0%' AND sku NOT LIKE 'KD%'
    ORDER BY price LIMIT 10
""")
print("\nNon-A2Z products:")
for r in cur.fetchall():
    print(f"  {r[0]:20s} LKR {r[2]:6.0f} {r[1][:50]}")

cur.close()
c.close()
