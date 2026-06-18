import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

# Delete test/placeholder products
cur.execute("DELETE FROM product_categories WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR title IN ('REFUND','REPLACE','EXCHANGE'))")
print("Cat links:", cur.rowcount)

cur.execute("DELETE FROM product_images WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR title IN ('REFUND','REPLACE','EXCHANGE'))")
print("Images:", cur.rowcount)

cur.execute("DELETE FROM products WHERE sku LIKE 'ttt%' OR sku LIKE 'test%' OR title IN ('REFUND','REPLACE','EXCHANGE')")
print("Products:", cur.rowcount)

# Set minimum price: any price < 99 gets bumped to 99
cur.execute("UPDATE products SET price = 99 WHERE price < 99")
print(f"Min-priced: {cur.rowcount}")

# Ensure all A2Z products are PUBLISHED
cur.execute("UPDATE products SET status = 'PUBLISHED' WHERE sku LIKE 'P0%' AND status != 'PUBLISHED'")
print(f"Published: {cur.rowcount}")

c.commit()

cur.execute("SELECT count(*) FROM products")
print(f"Final count: {cur.fetchone()[0]}")

cur.close()
c.close()
