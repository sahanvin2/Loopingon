import psycopg2

conn = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = conn.cursor()

# Identify A2Z products by SKU (starts with 'P0') - seed products don't have these SKUs
cur.execute("SELECT id, sku, title FROM products WHERE sku LIKE 'P0%'")
a2z = cur.fetchall()
print(f"A2Z products to delete: {len(a2z)}")
for p in a2z[:5]:
    print(f"  {p[0][:20]}... {p[1]} {p[2][:40]}")

# Delete product images for these products
cur.execute("""
    DELETE FROM product_images 
    WHERE "productId" IN (SELECT id FROM products WHERE sku LIKE 'P0%')
""")
print(f"Product images deleted: {cur.rowcount}")

cur.execute("DELETE FROM products WHERE sku LIKE 'P0%'")
print(f"Products deleted: {cur.rowcount}")

conn.commit()

cur.execute("SELECT count(*) FROM products")
print(f"Total products remaining: {cur.fetchone()[0]}")

cur.close()
conn.close()
print("Cleanup complete.")
