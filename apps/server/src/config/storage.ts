import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { logger } from "../middleware/errorHandler.middleware.js";

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
const STORAGE_REGION = process.env.STORAGE_REGION || "us-east-005";
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "";
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || "";

const s3Client = new S3Client({
  region: STORAGE_REGION,
  endpoint: STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY,
    secretAccessKey: STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.STORAGE_BUCKET || "movia-prod";
const CDN_URL = process.env.STORAGE_CDN_URL || process.env.CDN_URL || `https://f005.backblazeb2.com/file/${BUCKET_NAME}`;

export interface UploadResult {
  key: string;
  url: string;
  cdnUrl: string;
  size: number;
  mimeType: string;
}

export interface UploadFileParams {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  folder?: string;
  isPublic?: boolean;
}

export async function uploadFile(params: UploadFileParams): Promise<UploadResult> {
  const ext = path.extname(params.originalname) || ".bin";
  const filename = `${uuidv4()}${ext}`;
  const folder = params.folder ? `${params.folder.replace(/^\/+|\/+$/g, "")}/` : "";
  const key = `${folder}${filename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: params.buffer,
    ContentType: params.mimetype,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3Client.send(command);

  return {
    key,
    url: `${CDN_URL}/${key}`,
    cdnUrl: `${CDN_URL}/${key}`,
    size: params.buffer.length,
    mimeType: params.mimetype,
  };
}

export async function uploadMultipleFiles(
  files: UploadFileParams[]
): Promise<UploadResult[]> {
  const results = await Promise.allSettled(files.map((f) => uploadFile(f)));

  const uploaded: UploadResult[] = [];
  const failed: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      uploaded.push(result.value);
    } else {
      failed.push(files[index].originalname);
      logger.error(`Failed to upload ${files[index].originalname}:`, result.reason);
    }
  });

  if (failed.length > 0 && uploaded.length === 0) {
    throw new Error(`Failed to upload all files: ${failed.join(", ")}`);
  }

  return uploaded;
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getSignedFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getPublicUrl(key: string): Promise<string> {
  return `${CDN_URL}/${key}`;
}

export function isValidStorageConfigured(): boolean {
  return !!(STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY && BUCKET_NAME);
}
