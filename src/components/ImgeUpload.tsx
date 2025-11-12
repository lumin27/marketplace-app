"use client";

import { X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: (string | { id: string; imageUrl: string })[];
  onRemoveExisting?: (idOrUrl: string) => void;
  maxFiles?: number;
}

export function ImageUpload({
  files,
  onFilesChange,
  existingImages = [],
  onRemoveExisting,
  maxFiles = 5,
}: ImageUploadProps) {
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const remainingSlots = maxFiles - files.length - existingImages.length;
    const newFiles = Array.from(selectedFiles).slice(0, remainingSlots);
    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const getImageUrl = (img: string | { imageUrl: string }) =>
    typeof img === "string" ? img : img.imageUrl;

  const getImageId = (img: string | { id?: string; imageUrl: string }) =>
    typeof img === "string" ? img : img.id || img.imageUrl;

  return (
    <div className={cn("space-y-2")}>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {existingImages.map((img) => {
          const imageUrl = getImageUrl(img);
          const imageId = getImageId(img);
          return (
            <div key={imageId} className='relative group'>
              <img
                src={imageUrl}
                alt='Existing image'
                className='w-full h-32 object-cover rounded-lg border'
              />
              {onRemoveExisting && (
                <button
                  type='button'
                  className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1'
                  onClick={() => onRemoveExisting(imageId)}>
                  <X className='h-4 w-4 text-red-500' />
                </button>
              )}
            </div>
          );
        })}

        {files.map((file, idx) => (
          <div key={idx} className='relative group'>
            <img
              src={URL.createObjectURL(file)}
              alt={`Upload ${idx + 1}`}
              className='w-full h-32 object-cover rounded-lg border'
            />
            <button
              type='button'
              className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1'
              onClick={() => removeFile(idx)}>
              <X className='h-4 w-4 text-red-500' />
            </button>
          </div>
        ))}

        {files.length + existingImages.length < maxFiles && (
          <div className='relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-gray-400'>
            <input
              type='file'
              accept='image/*'
              multiple
              className='absolute inset-0 opacity-0 cursor-pointer'
              onChange={(e) => handleFiles(e.target.files)}
            />
            <ImageIcon className='h-6 w-6 text-gray-400 mb-2' />
            <span className='text-sm text-gray-500'>Add Photo</span>
          </div>
        )}
      </div>

      <p className='text-sm text-gray-500'>
        {files.length + existingImages.length}/{maxFiles} photos selected
      </p>
    </div>
  );
}
