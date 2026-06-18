import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

cur.execute("""SELECT p.sku, p.title, COUNT(pi.id) as cnt 
    FROM products p JOIN product_images pi ON p.id = pi."productId" 
    GROUP BY p.id, p.sku, p.title HAVING COUNT(pi.id) > 1 
    ORDER BY cnt DESC LIMIT 15""")
print("Multi-image products:")
for r in cur.fetchall():
    print(f"  {r[0]:12s} {r[2]} images  {r[1][:60]}")

cur.execute("""SELECT COUNT(DISTINCT p.id) as prods, COUNT(pi.id) as imgs 
    FROM products p JOIN product_images pi ON p.id = pi."productId" """)
r = cur.fetchone()
print(f"\nTotal: {r[0]:,} products with {r[1]:,} images")

# Check for products appearing as duplicates (same title)
cur.execute("""SELECT title, COUNT(*) FROM products 
    GROUP BY title HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC LIMIT 10""")
dups = cur.fetchall()
if dups:
    print(f"\nDuplicate product titles: {len(dups)}")
    for r in dups:
        print(f"  {r[1]}x: {r[0][:60]}")
else:
    print("\nNo duplicate product titles found")

cur.close()
c.close()
