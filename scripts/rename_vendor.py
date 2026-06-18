import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()
cur.execute("""UPDATE vendors SET "storeName" = 'Kandyam', "storeSlug" = 'kandyam' WHERE id = 'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa'""")
print("Vendor updated:", cur.rowcount)
c.commit()
cur.execute("""SELECT id, "storeName", "storeSlug" FROM vendors""")
for r in cur.fetchall():
    print(f"  {r[0][:20]}... {r[1]}")
cur.close()
c.close()
