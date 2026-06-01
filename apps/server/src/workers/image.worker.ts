import { Worker, Queue, type Job } from "bullmq";
import sharp from "sharp";
import { REDIS_URL } from "../config/redis.js";
import { uploadFile } from "../config/storage.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "image";

const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, fit: "cover" as const },
  medium: { width: 600, height: 600, fit: "inside" as const },
  large: { width: 1200, height: 1200, fit: "inside" as const },
} as const;

const OUTPUT_FORMATS = [
  { format: "webp" as const, quality: 80 },
  { format: "avif" as const, quality: 65 },
  { format: "jpeg" as const, quality: 85 },
] as const;

interface ImageJobData {
  imageBuffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
  productId?: string;
  generateSizes?: Array<"thumbnail" | "medium" | "large">;
  generateFormats?: Array<"webp" | "avif" | "jpeg">;
}

interface ImageJobResult {
  original: { key: string; url: string; size: number };
  sizes: Record<string, { key: string; url: string; width: number; height: number; size: number }>;
  metadata: { width: number; height: number; format: string };
}

let imageQueue: Queue<ImageJobData, ImageJobResult> | null = null;

export function getImageQueue(): Queue<ImageJobData, ImageJobResult> {
  if (!imageQueue) {
    imageQueue = new Queue<ImageJobData, ImageJobResult>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { age: 86400 },
        removeOnFail: { age: 604800 },
      },
    });
  }
  return imageQueue;
}

const imageWorker = new Worker<ImageJobData, ImageJobResult>(
  QUEUE_NAME,
  async (job: Job<ImageJobData>) => {
    const { imageBuffer, originalName, mimeType, folder, generateSizes, generateFormats } = job.data;
    logger.info(`Processing image job ${job.id} for ${originalName}`);

    const metadata = await sharp(imageBuffer).metadata();

    const sizesToGenerate = generateSizes || (["thumbnail", "medium", "large"] as const);
    const formatsToGenerate = generateFormats || (["webp", "avif", "jpeg"] as const);

    const optimizedOriginal = await sharp(imageBuffer)
      .rotate()
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    const ext = originalName.split(".").pop() || "jpg";
    const baseName = originalName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    const originalUpload = await uploadFile({
      buffer: optimizedOriginal,
      originalname: `${baseName}.${ext}`,
      mimetype: mimeType,
      folder: folder ? `${folder}/original` : "products/original",
    });

    const sizes: ImageJobResult["sizes"] = {};

    for (const sizeName of sizesToGenerate) {
      const sizeConfig = IMAGE_SIZES[sizeName];
      let pipeline = sharp(optimizedOriginal)
        .rotate()
        .resize(sizeConfig.width, sizeConfig.height, { fit: sizeConfig.fit, withoutEnlargement: true });

      const primaryFormat = formatsToGenerate[0];

      if (primaryFormat === "avif") {
        pipeline = pipeline.avif({ quality: 65, effort: 4 });
      } else if (primaryFormat === "webp") {
        pipeline = pipeline.webp({ quality: 80, effort: 6 });
      } else {
        pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
      }

      const sizedBuffer = await pipeline.toBuffer();
      const sizedMetadata = await sharp(sizedBuffer).metadata();

      const formatExt = primaryFormat === "jpeg" ? "jpg" : primaryFormat;
      const sizeUpload = await uploadFile({
        buffer: sizedBuffer,
        originalname: `${baseName}_${sizeName}.${formatExt}`,
        mimetype: `image/${primaryFormat === "jpeg" ? "jpeg" : primaryFormat}`,
        folder: folder ? `${folder}/${sizeName}` : `products/${sizeName}`,
      });

      sizes[sizeName] = {
        key: sizeUpload.key,
        url: sizeUpload.cdnUrl,
        width: sizedMetadata.width || sizeConfig.width,
        height: sizedMetadata.height || sizeConfig.height,
        size: sizedBuffer.length,
      };

      if (formatsToGenerate.length > 1) {
        for (let i = 1; i < formatsToGenerate.length; i++) {
          const format = formatsToGenerate[i];
          let altPipeline = sharp(optimizedOriginal)
            .rotate()
            .resize(sizeConfig.width, sizeConfig.height, { fit: sizeConfig.fit, withoutEnlargement: true });

          if (format === "avif") {
            altPipeline = altPipeline.avif({ quality: 65, effort: 4 });
          } else if (format === "webp") {
            altPipeline = altPipeline.webp({ quality: 80, effort: 6 });
          } else {
            altPipeline = altPipeline.jpeg({ quality: 85, mozjpeg: true });
          }

          const altBuffer = await altPipeline.toBuffer();
          const altFormatExt = format === "jpeg" ? "jpg" : format;
          await uploadFile({
            buffer: altBuffer,
            originalname: `${baseName}_${sizeName}.${altFormatExt}`,
            mimetype: `image/${format === "jpeg" ? "jpeg" : format}`,
            folder: folder ? `${folder}/${sizeName}` : `products/${sizeName}`,
          });
        }
      }
    }

    const result: ImageJobResult = {
      original: { key: originalUpload.key, url: originalUpload.cdnUrl, size: optimizedOriginal.length },
      sizes,
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "jpeg",
      },
    };

    logger.info(`Completed image job ${job.id}: ${originalName}`);
    return result;
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 4,
    limiter: { max: 20, duration: 1000 },
  }
);

imageWorker.on("failed", (job, err) => {
  logger.error(`Image job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

imageWorker.on("completed", (job) => {
  logger.info(`Image job ${job.id} completed`);
});

export async function addImageJob(data: {
  imageBuffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
  productId?: string;
  generateSizes?: Array<"thumbnail" | "medium" | "large">;
  generateFormats?: Array<"webp" | "avif" | "jpeg">;
}) {
  return getImageQueue().add("optimize", data);
}

export { imageWorker };
export type { ImageJobResult };
