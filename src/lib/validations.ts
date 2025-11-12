import { z } from "zod";

// Listing
export const listingSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a valid positive number",
    }),
  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  categoryId: z.string().min(1, "Category is required"),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

// Message
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message is required")
    .min(5, "Message must be at least 5 characters")
    .max(500, "Message must be less than 500 characters"),
  listingId: z.string().min(1, "Listing ID is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
});

// Search
export const searchSchema = z.object({
  search: z
    .string()
    .max(100, "Search term must be less than 100 characters")
    .optional(),
  category: z.string().optional(),
  sort: z.enum(["newest", "oldest", "price-low", "price-high"]).optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
