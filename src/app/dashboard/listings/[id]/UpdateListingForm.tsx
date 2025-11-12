"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingFormData } from "@/lib/validations";
import { ImageUpload } from "@/components/ImgeUpload";
import { updateListing } from "@/lib/actions";
import { toast } from "react-toastify";

export interface Category {
  id: string;
  name: string;
  description: string;
}

interface Listings {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: string;
  images: { id: string; imageUrl: string }[];
}

interface UpdateFormProps {
  categories: Category[];
  listing: Listings;
}

export default function ListingUpdateForm({
  categories,
  listing,
}: UpdateFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(listing.images);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
    defaultValues: {
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      location: listing.location,
      categoryId: listing.categoryId,
      images: listing.images.map((img) => img.imageUrl),
    },
  });

  useEffect(() => {
    setValue("images", [
      ...existingImages.map((img) => img.imageUrl),
      ...files.map((f) => f.name),
    ]);
  }, [existingImages, files, setValue]);

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("location", data.location);
      formData.append("categoryId", data.categoryId || "");

      existingImages.forEach((img) =>
        formData.append("existingImages", img.imageUrl)
      );

      files.forEach((file) => formData.append("image", file));

      const result = await updateListing(listing.id, formData);

      if (!result?.success) {
        setError(result?.error || "Failed to update listing");
        return;
      }

      router.push("/dashboard/listings");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      toast.success("Listing updated successfully!");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 p-6 rounded shadow border border-gray-200'
      noValidate>
      <div>
        <label htmlFor='title' className='block font-medium mb-1'>
          Title
        </label>
        <input
          id='title'
          {...register("title")}
          placeholder='Item title'
          className='w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none'
        />
        {errors.title && (
          <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='description' className='block font-medium mb-1'>
          Description
        </label>
        <textarea
          id='description'
          {...register("description")}
          rows={4}
          placeholder='Describe your item'
          className='w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none'
        />
        {errors.description && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className='block font-medium mb-1'>Photos</label>
        <ImageUpload
          files={files}
          onFilesChange={setFiles}
          existingImages={existingImages}
          onRemoveExisting={(idOrUrl) =>
            setExistingImages((prev) =>
              prev.filter(
                (img) => img.id !== idOrUrl && img.imageUrl !== idOrUrl
              )
            )
          }
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor='price' className='block font-medium mb-1'>
          Price
        </label>
        <input
          id='price'
          type='number'
          step='0.01'
          placeholder='0.00'
          {...register("price", { valueAsNumber: false })}
          className='w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none'
        />
        {errors.price && (
          <p className='text-red-500 text-sm mt-1'>{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='categoryId' className='block font-medium mb-1'>
          Category
        </label>
        <select
          id='categoryId'
          {...register("categoryId")}
          className='w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none'>
          <option value=''>Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor='location' className='block font-medium mb-1'>
          Location
        </label>
        <input
          id='location'
          {...register("location")}
          placeholder='City, State'
          className='w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none'
        />
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}

      <div className='flex items-center gap-4 pt-4'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='relative px-4 py-2 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 disabled:bg-gray-400 transition-colors'>
          {isSubmitting ? "Updating..." : "Update Listing"}
        </button>

        <button
          type='button'
          onClick={() => router.back()}
          disabled={isSubmitting}
          className='px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors'>
          Cancel
        </button>
      </div>
    </form>
  );
}
