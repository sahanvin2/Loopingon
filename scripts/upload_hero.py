import boto3
from botocore.config import Config
import os

B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
B2_KEY_ID = "0053aaa597862ee0000000001"
B2_APP_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs"
B2_BUCKET = "movia-prod"
CDN_URL = "https://kandyam.b-cdn.net"

LOCAL = r"D:\Mern\Loopingon\loopingon\Assets\hero_bg.webp"
KEY = "site/hero-bg.webp"

s3 = boto3.client("s3", endpoint_url=B2_ENDPOINT, region_name="us-east-005",
    aws_access_key_id=B2_KEY_ID, aws_secret_access_key=B2_APP_KEY,
    config=Config(signature_version="s3v4"))

with open(LOCAL, "rb") as f:
    s3.put_object(Bucket=B2_BUCKET, Key=KEY, Body=f.read(),
        ContentType="image/webp", CacheControl="public, max-age=31536000, immutable")

url = f"{CDN_URL}/{KEY}"
print(f"Uploaded: {url}")
print(f"Size: {os.path.getsize(LOCAL)/1024:.1f} KB")
