import pandas as pd

df = pd.read_excel(r"D:\Python\Data scrap\a2z_products_complete.xlsx")
print("Shape:", df.shape)
print("Columns:", list(df.columns))
print()

print("First 3 rows:")
for i in range(3):
    print(dict(df.iloc[i]))
print()

cat_col = None
for c in df.columns:
    if "categ" in str(c).lower():
        cat_col = c
        break

desc_col = None
for c in df.columns:
    if "desc" in str(c).lower():
        desc_col = c
        break

if cat_col:
    print(f"Category column: '{cat_col}' - non-null: {df[cat_col].notna().sum()}")
    print(f"Unique categories: {df[cat_col].dropna().unique()[:50]}")
else:
    print("NO category column found")
    print("First 20 column names:", list(df.columns)[:20])

if desc_col:
    print(f"\nDescription column: '{desc_col}' - non-null: {df[desc_col].notna().sum()}")
else:
    print("\nNO description column found")

# Also check product code and price
for c in df.columns:
    if "code" in str(c).lower() or "product" in str(c).lower():
        print(f"Product ID column: '{c}'")

for c in df.columns:
    if "price" in str(c).lower():
        print(f"Price column: '{c}' - sample: {df[c].head(3).tolist()}")
