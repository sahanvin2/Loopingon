import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

# Fix NaN (IEEE NaN is different from NULL)
cur.execute("UPDATE products SET price = 99 WHERE price = 'NaN'::numeric OR price IS NULL")
print("Fixed NaN/NULL:", cur.rowcount)

# Also check if any are literally the string NaN
cur.execute("SELECT sku, title, price FROM products WHERE price::text = 'NaN' OR price IS NULL")
nans = cur.fetchall()
print(f"Remaining NaN/NULL: {len(nans)}")
for r in nans:
    print(f"  {r[0]} price={r[2]} {r[1][:50]}")

c.commit()

cur.execute("SELECT MIN(price), MAX(price) FROM products")
r = cur.fetchone()
print(f"\nPrice range: LKR {r[0]:.0f} - {r[1]:.0f}")

cur.close()
c.close()
