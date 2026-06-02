"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File as FileIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  preview?: boolean;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function FileUpload({
  onUpload,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = "image/*",
  preview = true,
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatBytes(maxSize)}`;
    }
    return null;
  };

  const processFiles = useCallback(
    (files: FileList) => {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => {
        const error = validateFile(file);
        let previewUrl: string | undefined;
        if (preview && file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file);
        }
        return { file, preview: previewUrl, progress: 0, error: error || undefined };
      });

      const validFiles = newFiles.filter((f) => !f.error);
      const errors = newFiles.filter((f) => f.error);

      setUploadedFiles((prev) => {
        const combined = [...prev, ...newFiles].slice(0, maxFiles);
        return combined;
      });

      if (validFiles.length > 0) {
        validFiles.forEach((uf) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            setUploadedFiles((prev) =>
              prev.map((p) =>
                p.file === uf.file
                  ? { ...p, progress: Math.min(progress, 100) }
                  : p,
              ),
            );
            if (progress >= 100) clearInterval(interval);
          }, 200);
        });

        if (onUpload) {
          setTimeout(() => {
            onUpload(validFiles.map((f) => f.file));
          }, 1200);
        }
      }
    },
    [maxFiles, maxSize, preview, onUpload, validateFile],
  );

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file));
    if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-rose-500 bg-rose-50"
            : "border-muted-300 hover:border-rose-400 hover:bg-rose-50/50",
          uploadedFiles.length >= maxFiles && "pointer-events-none opacity-50",
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadedFiles.length >= maxFiles}
          aria-label="Upload files"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <p className="text-charcoal-700 font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-muted-500 mt-1">
              {accept === "image/*" ? "Images" : "Files"} up to{" "}
              {formatBytes(maxSize)} • Max {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadedFiles.map((uploadedFile, idx) => (
              <motion.div
                key={`${uploadedFile.file.name}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  uploadedFile.error
                    ? "border-red-200 bg-red-50"
                    : "border-blush-200 bg-white",
                )}
              >
                {preview && uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-muted-100 flex items-center justify-center shrink-0">
                    <FileIcon className="w-5 h-5 text-muted-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-500">
                    {formatBytes(uploadedFile.file.size)}
                  </p>
                  {uploadedFile.error ? (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {uploadedFile.error}
                    </p>
                  ) : (
                    <div className="mt-1.5 h-1 rounded-full bg-muted-200 overflow-hidden">
                      <motion.div
                        className="h-full bg-rose-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadedFile.progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(uploadedFile)}
                  className="p-1 rounded-md text-muted-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${uploadedFile.file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
