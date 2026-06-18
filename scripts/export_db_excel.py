import psycopg2
import pandas as pd

DB = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"
OUT = r"D:\Mern\Loopingon\loopingon\scripts\output\kandiyam_full_export.xlsx"

c = psycopg2.connect(DB)
cur = c.cursor()

cur.execute("""
    SELECT id, sku, title, slug, price, "compareAtPrice", currency, quantity, status,
           "salesCount", "reviewCount", "averageRating", "viewsCount",
           "isHandmade", "createdAt", "publishedAt"
    FROM products ORDER BY sku
""")
df = pd.DataFrame(cur.fetchall(), columns=[d[0] for d in cur.description])

cur.execute("""
    SELECT pi."productId", pi.url, pi."isPrimary", pi."sortOrder", p.sku, p.title
    FROM product_images pi JOIN products p ON pi."productId" = p.id
    ORDER BY pi."productId", pi."sortOrder"
""")
img_df = pd.DataFrame(cur.fetchall(), columns=[d[0] for d in cur.description])

with pd.ExcelWriter(OUT, engine="openpyxl") as w:
    df.to_excel(w, sheet_name="Products", index=False)
    img_df.to_excel(w, sheet_name="Images", index=False)

print(f"Exported {len(df)} products + {len(img_df)} images to {OUT}")
cur.close()
c.close()
