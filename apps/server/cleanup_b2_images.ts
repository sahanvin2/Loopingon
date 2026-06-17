import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
const STORAGE_REGION = process.env.STORAGE_REGION || "us-east-005";
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "";
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || "";
const BUCKET = process.env.STORAGE_BUCKET || "movia-prod";

const s3Client = new S3Client({
  endpoint: STORAGE_ENDPOINT,
  region: STORAGE_REGION,
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY,
    secretAccessKey: STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function main() {
  console.log("Listing objects under 'categories/' prefix...");
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: "categories/",
    });

    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log("No category images found in B2.");
      return;
    }

    const objectsToDelete = listResponse.Contents.map((item) => ({
      Key: item.Key as string,
    }));

    console.log(`Found ${objectsToDelete.length} images to delete. Removing...`);

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false,
      },
    });

    const deleteResponse = await s3Client.send(deleteCommand);

    if (deleteResponse.Deleted && deleteResponse.Deleted.length > 0) {
      console.log(`Successfully deleted ${deleteResponse.Deleted.length} category images from B2.`);
    }
  } catch (error) {
    console.error("Error connecting to B2:", error);
  }
}

main().catch(console.error);
