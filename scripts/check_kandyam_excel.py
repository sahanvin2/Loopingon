import pandas as pd

df = pd.read_excel(r"D:\Mern\Loopingon\loopingon\Assets\kandyam_products.xlsx")

# Check the key pricing columns
price_cols = ["Price (LKR - A2Z)", "Listed Price (LKR)", "Kandyam Store Price", "Compare At Price"]
print("Price column samples:")
for i in range(10):
    row = df.iloc[i]
    print(f"  {row['Product Code']}: A2Z={row['Price (LKR - A2Z)']:.0f} Listed={row['Listed Price (LKR)']:.0f} Kandyam={row['Kandyam Store Price']:.0f} Compare={row['Compare At Price']:.0f}  {str(row['Name'])[:40]}")

print()

# Check which price column to use
for col in price_cols:
    print(f"  {col}: non-null={df[col].notna().sum()} min={df[col].min():.0f} max={df[col].max():.0f}")

# Check Stock Qty
print(f"\nStock Qty: non-null={df['Stock Qty'].notna().sum()} min={df['Stock Qty'].min():.0f} max={df['Stock Qty'].max():.0f}")
print(f"Available Qty: non-null={df['Available Qty'].notna().sum()} min={df['Available Qty'].min():.0f} max={df['Available Qty'].max():.0f}")

# Check which stock column to use
stock_qty = df["Stock Qty"].fillna(0)
avail_qty = df["Available Qty"].fillna(0)
print(f"\nStock Qty > 0: {(stock_qty > 0).sum()}")
print(f"Available Qty > 0: {(avail_qty > 0).sum()}")

# Seller info
if "Seller" in df.columns:
    print(f"\nSeller samples: {df['Seller'].dropna().head(5).tolist()}")
    print(f"Unique sellers: {df['Seller'].nunique()}")

# Description
print(f"\nDescription non-null: {df['Description'].notna().sum()} / {len(df)}")
print(f"Description sample: {str(df['Description'].dropna().iloc[0])[:150]}")

# Rating and reviews
if "Rating" in df.columns:
    print(f"\nRating: non-null={df['Rating'].notna().sum()} min={df['Rating'].min():.1f} max={df['Rating'].max():.1f}")
if "Reviews" in df.columns:
    print(f"Reviews: non-null={df['Reviews'].notna().sum()} min={df['Reviews'].min():.0f} max={df['Reviews'].max():.0f}")
if "Sales Count" in df.columns:
    print(f"Sales Count: non-null={df['Sales Count'].notna().sum()} max={df['Sales Count'].max():.0f}")

# Delivery charge
if "Delivery Charge (LKR)" in df.columns:
    dc = df["Delivery Charge (LKR)"].fillna(0)
    print(f"\nDelivery Charge: non-null={df['Delivery Charge (LKR)'].notna().sum()} min={dc.min():.0f} max={dc.max():.0f}")
