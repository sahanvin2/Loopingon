import psycopg2
c = psycopg2.connect("postgresql://loopingon:loopingon_dev@localhost:5433/loopingon")
cur = c.cursor()

# Fix Kandyam vendor details using parameterized query
cur.execute("""
    UPDATE vendors SET 
        "craftType" = %s,
        "craftDescription" = %s,
        "storeDescription" = %s,
        "workshopLocation" = %s,
        "workshopCity" = %s,
        "workshopDistrict" = %s,
        "businessType" = %s,
        "totalProducts" = (SELECT count(*) FROM products WHERE "vendorId" = %s),
        "yearsOfExperience" = %s,
        "websiteUrl" = %s,
        "status" = %s,
        "rating" = %s,
        "reviewCount" = %s,
        "onTimeDeliveryRate" = %s,
        "responseRate" = %s
    WHERE id = %s
""", (
    ['Electronics', 'Home & Living', 'Kids & Baby', 'Bath & Beauty', 'Fashion', 'Jewelry', 'Accessories', 'Books', 'Toys', 'Pet Supplies', 'Shoes', 'Gifts'],
    'Your trusted online marketplace with 8,500+ products across all categories. Fast delivery via Koombiyo - Cash on Delivery.',
    "Sri Lanka's largest online marketplace. Electronics, Home & Living, Kids & Baby, Beauty, Fashion and more. Island-wide delivery with Cash on Delivery.",
    'Kandiyam Marketplace',
    'Kegalle',
    'Kegalle',
    'private_limited',
    'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa',
    1,
    'https://kandyam.com',
    'VERIFIED',
    4.5,
    1000,
    98,
    95,
    'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa'
))
print("Vendor updated:", cur.rowcount)

# Verify
cur.execute("""SELECT "storeName", "workshopCity", "workshopDistrict", "craftType", "craftDescription" FROM vendors WHERE id = 'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa'""")
r = cur.fetchone()
print(f"  Name: {r[0]}")
print(f"  Location: {r[1]}, {r[2]}")
print(f"  Categories: {r[3][:3]}...")
print(f"  Desc: {r[4][:80]}")

# Fix stock statuses
cur.execute("""
    UPDATE products SET 
        status = CASE WHEN quantity <= 0 THEN 'OUT_OF_STOCK'::"ProductStatus" ELSE 'PUBLISHED'::"ProductStatus" END
""")
print(f"\nStock status updated: {cur.rowcount}")

cur.execute("SELECT status, count(*) FROM products GROUP BY status")
for r in cur.fetchall():
    print(f"  {r[0]}: {r[1]}")

c.commit()
cur.close()
c.close()
print("\nDone!")
