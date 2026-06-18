import pandas as pd

df = pd.read_excel(r"D:\Python\Data scrap\a2z_products_new.xlsx")
df2 = df[df["Available Qty"] > 0].copy()

# Check for duplicate Product Codes
dup_codes = df2[df2.duplicated(subset="Product Code", keep=False)]
print(f"Duplicate product codes in filtered data: {len(dup_codes)}")
if len(dup_codes) > 0:
    for _, r in dup_codes.head(20).iterrows():
        print(f"  {r['Product Code']} qty={r['Available Qty']} name={r['Name']}")

# Check for duplicate slugs in the python processing
import re
def slugify(text):
    text = str(text).lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text[:200]

df2["slug"] = df2.apply(lambda r: f"{slugify(r['Name'])}-{r['Product Code'].lower()}", axis=1)
dup_slugs = df2[df2.duplicated(subset="slug", keep=False)]
print(f"\nDuplicate slugs: {len(dup_slugs)}")
if len(dup_slugs) > 0:
    for _, r in dup_slugs.head(10).iterrows():
        print(f"  {r['slug']} code={r['Product Code']}")

print(f"\nTotal filtered products: {len(df2)}")
print(f"Unique product codes: {df2['Product Code'].nunique()}")
