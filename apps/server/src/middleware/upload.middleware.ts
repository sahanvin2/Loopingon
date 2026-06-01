import multer, { type FileFilterCallback } from "multer";
import { type Request } from "express";
import { AppError } from "./errorHandler.middleware.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(
      `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
      400,
      "INVALID_FILE_TYPE"
    ));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
});

export function uploadSingle(fieldName: string) {
  return upload.single(fieldName);
}

export function uploadMultiple(fieldName: string, maxCount: number = 5) {
  return upload.array(fieldName, maxCount);
}

export function uploadMultipleFields(
  fields: Array<{ name: string; maxCount?: number }>
) {
  return upload.fields(fields);
}

export function uploadAny() {
  return upload.any();
}

export function uploadNone() {
  return upload.none();
}

export const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES: 10,
} as const;
