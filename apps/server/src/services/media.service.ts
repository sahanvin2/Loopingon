import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../middleware/errorHandler.middleware.js";

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT || "https://sfo3.digitaloceanspaces.com",
  region: process.env.SPACES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY || "",
    secretAccessKey: process.env.SPACES_SECRET_KEY || "",
  },
});

const BUCKET = process.env.SPACES_BUCKET || "loopingon";
const CDN_URL = process.env.CDN_URL || `https://${BUCKET}.sfo3.digitaloceanspaces.com`;

export async function uploadSingle(
  file: Express.Multer.File,
  folder: string
): Promise<{ original: string; thumb: string; medium: string; large: string }> {
  const ext = "webp";
  const baseKey = `${folder}/${uuidv4()}`;

  const sizes = [
    { suffix: "original", width: null, height: null },
    { suffix: "large", width: 1200, height: null },
    { suffix: "medium", width: 600, height: null },
    { suffix: "thumb", width: 150, height: 150 },
  ];

  const results: Record<string, string> = {};

  for (const size of sizes) {
    let buffer = file.buffer;

    if (size.width || size.height) {
      buffer = await sharp(file.buffer)
        .resize(size.width, size.height, { fit: "cover", withoutEnlargement: true })
        .webp({ quality: 80 })
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
          ACL: "public-read",
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
    .resize(1200, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}
