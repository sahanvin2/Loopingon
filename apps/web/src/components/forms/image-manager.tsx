"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, GripVertical, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { post, del, patch } from "@/lib/api-client";

export interface ProductImage {
  id: string;
  url: string;
  thumbnail?: string;
  sortOrder?: number;
}

interface ImageManagerProps {
  productId: string;
  initialImages: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
  maxFiles?: number;
}

export function ImageManager({ productId, initialImages, onImagesChange, maxFiles = 10 }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(
    [...initialImages].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  );
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (images.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      
      const res = await post<{ data: ProductImage[] }>(
        `/vendor/dashboard/products/${productId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const newImages = [...images, ...(res.data || [])];
      setImages(newImages);
      onImagesChange?.(newImages);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await del(`/vendor/dashboard/products/images/${imageId}`);
      const newImages = images.filter((img) => img.id !== imageId);
      setImages(newImages);
      onImagesChange?.(newImages);
      toast.success("Image removed");
    } catch (err) {
      toast.error("Failed to remove image");
    }
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);

  const handleDragEnter = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newImages = [...images];
    const draggedImg = newImages[draggedIdx];
    newImages.splice(draggedIdx, 1);
    newImages.splice(idx, 0, draggedImg);
    setDraggedIdx(idx);
    setImages(newImages);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    onImagesChange?.(images);
    try {
      await patch(`/vendor/dashboard/products/${productId}/images/reorder`, {
        imageIds: images.map(img => img.id)
      });
    } catch (err) {
      toast.error("Failed to save new order");
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors relative",
          isUploading ? "border-primary-500 bg-primary-50 opacity-70" : "border-accent-300 hover:border-primary-500 hover:bg-surface-50 cursor-pointer"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={handleUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-sm font-medium text-primary-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-400" />
            <p className="text-sm font-medium text-text-700">Click or drag images to upload</p>
            <p className="text-xs text-muted-500">Up to {maxFiles} images. PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "relative group aspect-square rounded-xl border overflow-hidden cursor-move transition-transform duration-200",
                draggedIdx === idx ? "opacity-50 scale-95 border-primary-500" : "border-accent-200 shadow-sm hover:shadow-md"
              )}
            >
              <img 
                src={img.thumbnail || img.url} 
                alt="Product" 
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <GripVertical className="text-white w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded flex items-center gap-1 z-10 pointer-events-none">
                  <ImageIcon className="w-3 h-3" /> Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
