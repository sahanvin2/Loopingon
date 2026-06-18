import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

# Delete everything except seed products (keep vendor's original products)
# Seed products don't have SKUs starting with P0 or KD
cur.execute("DELETE FROM product_categories WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'P0%' OR sku LIKE 'KD%' OR sku LIKE 'C0%')")
print("Cat links:", cur.rowcount)

cur.execute("DELETE FROM product_images WHERE \"productId\" IN (SELECT id FROM products WHERE sku LIKE 'P0%' OR sku LIKE 'KD%' OR sku LIKE 'C0%')")
print("Images:", cur.rowcount)

cur.execute("DELETE FROM products WHERE sku LIKE 'P0%' OR sku LIKE 'KD%' OR sku LIKE 'C0%'")
print("Products:", cur.rowcount)

c.commit()

cur.execute("SELECT count(*), string_agg(DISTINCT substring(sku,1,2), ', ') FROM products")
r = cur.fetchone()
print(f"Remaining: {r[0]} products, SKU prefixes: {r[1]}")

cur.close()
c.close()
