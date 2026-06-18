import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()
cur.execute("SELECT id, email, \"fullName\", role, \"isActive\", \"createdAt\" FROM users ORDER BY \"createdAt\"")
print("=== ALL USERS ===")
for r in cur.fetchall():
    print(f"  {r[1]:35s} role={str(r[3]):15s} active={r[4]}  {str(r[2])[:25]}  created={str(r[5])[:19]}")
cur.close()
c.close()
