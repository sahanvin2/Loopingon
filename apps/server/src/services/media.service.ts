import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../middleware/errorHandler.middleware.js";

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
const STORAGE_REGION = process.env.STORAGE_REGION || "us-east-005";
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "";
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || "";

const s3Client = new S3Client({
  endpoint: STORAGE_ENDPOINT,
  region: STORAGE_REGION,
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY,
    secretAccessKey: STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.STORAGE_BUCKET || "movia-prod";
const CDN_URL = process.env.STORAGE_CDN_URL || process.env.CDN_URL || `https://f005.backblazeb2.com/file/${BUCKET}`;

export async function uploadSingle(
  file: Express.Multer.File,
  folder: string
): Promise<{ original: string; thumb: string; medium: string; large: string }> {
  const ext = "webp";
  // If folder is empty, avoid starting with a slash, which B2 hates.
  const cleanFolder = folder ? folder.replace(/^\/+|\/+$/g, '') : '';
  const prefix = cleanFolder ? `${cleanFolder}/` : '';
  const baseKey = `${prefix}${uuidv4()}`;

  const sizes = [
    { suffix: "original", width: null, height: null },
    { suffix: "large", width: 800, height: null }, // Reduced from 1200px to save bandwidth
    { suffix: "medium", width: 400, height: null }, // Reduced from 600px
    { suffix: "thumb", width: 150, height: 150 },
  ];

  const results: Record<string, string> = {};

  for (const size of sizes) {
    let buffer = file.buffer;

    if (size.width || size.height) {
      buffer = await sharp(file.buffer)
        .resize(size.width, size.height, { fit: "cover", withoutEnlargement: true })
        .webp({ quality: 60 }) // Reduced quality from 70 to 60 for better egress savings
        .toBuffer();
    }

    const key = `${baseKey}_${size.suffix}.${ext}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
    } catch (error) {
      throw new AppError("Failed to upload file", 500, "UPLOAD_FAILED");
    }

    results[size.suffix] = `${CDN_URL}/${key}`;
  }

  return {
    original: results.original,
    thumb: results.thumb,
    medium: results.medium,
    large: results.large,
  };
}

export async function uploadMultiple(
  files: Express.Multer.File[],
  folder: string
): Promise<Array<{ original: string; thumb: string; medium: string; large: string }>> {
  return Promise.all(files.map((file) => uploadSingle(file, folder)));
}

export async function deleteMedia(key: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    throw new AppError("Failed to delete file", 500, "DELETE_FAILED");
  }
}

export async function optimizeImage(file: Express.Multer.File): Promise<Buffer> {
  return sharp(file.buffer)
    .resize(800, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 60 })
    .toBuffer();
}
