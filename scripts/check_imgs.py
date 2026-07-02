import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()
cur.execute("SELECT count(*) FROM product_images")
print(f"Total images: {cur.fetchone()[0]}")
cur.execute("""SELECT p.sku, count(pi.id) as cnt FROM products p 
    JOIN product_images pi ON p.id = pi."productId" 
    GROUP BY p.sku ORDER BY cnt DESC LIMIT 10""")
for r in cur.fetchall():
    print(f"  {r[0]:12s} {r[1]} images")
cur.execute("""SELECT count(DISTINCT p.id) FROM products p 
    JOIN product_images pi ON p.id = pi."productId" """)
print(f"Products with images: {cur.fetchone()[0]}")
cur.close()
c.close()
