import psycopg2
import boto3
from botocore.config import Config

DB = "postgresql://loopingon:loopingon_dev@localhost:5433/loopingon"

# Update Sahan's display name
c = psycopg2.connect(DB)
cur = c.cursor()
cur.execute("""UPDATE users SET "fullName" = 'Sahan Nawarathne' WHERE email = 'sahannawarathne2004@gmail.com'""")
print(f"Name updated: {cur.rowcount}")

cur.execute("""UPDATE users SET "fullName" = 'Kandyam Team' WHERE email = 'support@loopingon.com'""")
print(f"Support name: {cur.rowcount}")

# Generate and upload a simple SVG logo as store logo
import os
logo_path = r"D:\Mern\Loopingon\loopingon\Assets\kandyam_logo.svg"
logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#002C3E"/>
      <stop offset="100%" style="stop-color:#F7444E"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="80" fill="url(#bg)"/>
  <text x="200" y="215" text-anchor="middle" font-family="Georgia,serif" font-size="72" font-weight="bold" fill="#F7F8F3">K</text>
  <text x="200" y="310" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#78BCC4" letter-spacing="8">KANDIYAM</text>
</svg>"""

with open(logo_path, "w") as f:
    f.write(logo_svg)
print(f"Logo saved: {os.path.getsize(logo_path)} bytes")

# Upload logo to B2
B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
B2_KEY_ID = "0053aaa597862ee0000000001"
B2_APP_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs"
B2_BUCKET = "movia-prod"
CDN_URL = "https://kandyam.b-cdn.net"

s3 = boto3.client("s3", endpoint_url=B2_ENDPOINT, region_name="us-east-005",
    aws_access_key_id=B2_KEY_ID, aws_secret_access_key=B2_APP_KEY,
    config=Config(signature_version="s3v4"))

with open(logo_path, "rb") as f:
    s3.put_object(Bucket=B2_BUCKET, Key="site/kandyam-logo.svg", Body=f.read(),
        ContentType="image/svg+xml", CacheControl="public, max-age=31536000, immutable")

logo_url = f"{CDN_URL}/site/kandyam-logo.svg"
print(f"Logo uploaded: {logo_url}")

# Update vendor storeLogo in DB
cur.execute("""UPDATE vendors SET "storeLogo" = %s WHERE id = 'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa'""", (logo_url,))
print(f"Logo set: {cur.rowcount}")

c.commit()

# Verify final state
cur.execute("""SELECT v."storeName", v."storeLogo", u."fullName", u.email, u.phone 
    FROM vendors v JOIN users u ON v."userId" = u.id 
    WHERE v.id = 'd7c0ae2a-8ac5-457f-a713-6d45fc4f6daa'""")
r = cur.fetchone()
print(f"\n=== FINAL VENDOR PROFILE ===")
print(f"  Store: {r[0]}")
print(f"  Logo: {r[1]}")
print(f"  Owner: {r[2]}")
print(f"  Email: {r[3]}")
print(f"  Phone: {r[4]}")

cur.close()
c.close()
print("Done!")
