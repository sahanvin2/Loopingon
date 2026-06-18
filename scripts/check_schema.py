import psycopg2

conn = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = conn.cursor()

# Check products columns
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position")
print("=== products ===")
for c in cur.fetchall():
    print(f"  {c[0]:35s} {c[1]}")

print()
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'product_images' ORDER BY ordinal_position")
print("=== product_images ===")
for c in cur.fetchall():
    print(f"  {c[0]:35s} {c[1]}")

print()
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'vendors' ORDER BY ordinal_position")
print("=== vendors ===")
for c in cur.fetchall():
    print(f"  {c[0]:35s} {c[1]}")

print()
cur.execute("SELECT id, \"storeName\" FROM vendors LIMIT 5")
print("=== Existing vendors ===")
for v in cur.fetchall():
    print(f"  {v[0]}  {v[1]}")

cur.close()
conn.close()
