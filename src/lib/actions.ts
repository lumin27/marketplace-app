"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCloudinary } from "./cloudinary";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase/admin";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createListingAction(formData: FormData) {
  const cloudinary = getCloudinary();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const location = formData.get("location") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const files = formData.getAll("image") as File[];

  if (!title || !description || !price || !location) {
    return { success: false, error: "Missing required fields" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  let imagesData: { imageUrl: string; publicId: string; isPrimary: boolean }[] =
    [
      {
        imageUrl:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg",
        publicId: "",
        isPrimary: true,
      },
    ];

  if (files.length > 0) {
    imagesData = [];

    for (let i = 0; i < files.length; i++) {
      const buffer = await files[i].arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:${files[i].type};base64,${base64}`;

      const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
        folder: "blog_images",
      });

      imagesData.push({
        imageUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        isPrimary: i === 0,
      });
    }
  }

  const listing = await prisma.listing.create({
    data: {
      sellerId: user?.id,
      title,
      description,
      price: parseFloat(price),
      location,
      categoryId,
      status: "ACTIVE",
      images: {
        create: imagesData,
      },
    },
    include: { images: true, category: true },
  });

  return { success: true, data: listing };
}

export async function getListings(filters: {
  status?: string;
  categoryId?: string;
  search?: string;
  sort?: "price-low" | "price-high" | "oldest" | "newest" | string;
  limit?: number;
}) {
  try {
    const where: any = {
      status: filters.status || "ACTIVE",
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      where.OR = [
        { title: { contains: searchLower, mode: "insensitive" } },
        { description: { contains: searchLower, mode: "insensitive" } },
        { location: { contains: searchLower, mode: "insensitive" } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
        favorites: true,
        category: true,
        images: {
          orderBy: { isPrimary: "desc" },
        },
        _count: {
          select: { favorites: true },
        },
      },
      orderBy:
        filters.sort === "price-low"
          ? { price: "asc" }
          : filters.sort === "price-high"
          ? { price: "desc" }
          : filters.sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" },
      take: Math.min(filters.limit || 20, 50),
    });

    return { success: true, data: listings };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { success: false, error: "Failed to fetch listings" };
  }
}

export async function updateListing(id: string, formData: FormData) {
  const cloudinary = getCloudinary();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = formData.get("location") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const files = formData.getAll("image") as File[];
  const existingImages = formData.getAll("existingImages") as string[];

  if (!id) {
    throw new Error("Unauthorized or missing user ID");
  }

  if (!title || !description || !price || !location) {
    return { success: false, error: "Missing required fields" };
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) return { success: false, error: "Listing not found" };

  const imagesToDelete = listing.images.filter(
    (img) => !existingImages.includes(img.imageUrl)
  );
  for (const img of imagesToDelete) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }
  await prisma.listingImage.deleteMany({
    where: { listingId: id, imageUrl: { notIn: existingImages } },
  });

  const uploadedImages: {
    imageUrl: string;
    publicId: string;
    isPrimary: boolean;
  }[] = [];
  for (let i = 0; i < files.length; i++) {
    const buffer = await files[i].arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${files[i].type};base64,${base64}`;

    const uploadRes = await cloudinary.uploader.upload(dataUrl, {
      folder: "blog_images",
    });

    uploadedImages.push({
      imageUrl: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      isPrimary: i === 0,
    });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title,
      description,
      price,
      location,
      categoryId,
      images: { create: uploadedImages },
    },
    include: { images: true, category: true },
  });

  revalidatePath("/dashboard/listings");

  return { success: true, data: updated };
}

export const deleteListing = async (listingId: string) => {
  try {
    const cloudinary = getCloudinary();

    const images = await prisma.listingImage.findMany({
      where: { listingId },
      select: { publicId: true },
    });

    const publicIds = images
      .map((img) => img.publicId)
      .filter((id): id is string => Boolean(id));

    if (publicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIds);
        console.log("Cloudinary images deleted successfully");
      } catch (err) {
        console.error(" Error deleting images from Cloudinary:", err);
      }
    }

    await prisma.listingImage.deleteMany({ where: { listingId } });
    await prisma.listing.delete({ where: { id: listingId } });

    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { success: false, error: "Failed to delete listing" };
  }
};

export async function addToFavorites(userId: string, listingId: string) {
  try {
    await prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, error: "Failed to add to favorites" };
  }
}

export async function removeFromFavorites(userId: string, listingId: string) {
  try {
    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, error: "Failed to remove from favorites" };
  }
}

export async function checkFavoriteStatus(userId: string, listingId: string) {
  try {
    if (!userId) {
      throw new Error("Unauthorized or missing userId");
    }
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
    return { success: true, data: !!favorite };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { success: false, error: "Failed to check favorite status" };
  }
}

export async function getMessages(userId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ receiverId: userId }],
      },
      include: {
        sender: { select: { fullName: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      readAt: msg.readAt,
      senderName: msg.sender?.fullName || "Unknown",
      listingTitle: msg.listing?.title || "Listing",
      listingId: msg.listing?.id ?? null,
    }));
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
}

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, profileImageUrl: true },
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function createUser(data: {
  id: string;
  email: string;
  fullName: string;
  role: "BUYER" | "SELLER";
}) {
  try {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const cloudinary = getCloudinary();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !id) throw new Error("Unauthorized");

  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const profileImageFile = formData.get("profileImage") as File | null;

    const notifications = formData.get("notifications") === "true";
    const isDarkMode = formData.get("isDarkMode") === "true";

    const oldProfile = await prisma.user?.findUnique({
      where: {
        id: id,
      },
      select: {
        publicId: true,
        profileImageUrl: true,
      },
    });

    let newImageUrl: string | undefined = undefined;
    let newPublicId: string | undefined = undefined;

    if (profileImageFile) {
      if (oldProfile?.publicId)
        try {
          await cloudinary.uploader.destroy(oldProfile?.publicId);
        } catch (error) {
          console.error("Error deleting profile image:", error);
        }

      const arrayBuffer = await profileImageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${profileImageFile.type};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataUrl, {
        folder: "blog_images",
      });

      newImageUrl = uploadResult.secure_url;
      newPublicId = uploadResult.public_id;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        fullName,
        phone,
        notifications,
        isDarkMode,
        profileImageUrl: newImageUrl ?? oldProfile?.profileImageUrl,
        publicId: newPublicId ?? oldProfile?.publicId,
      },
    });

    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone,
        profile_image_url: newImageUrl,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(userId: string) {
  const cloudinary = getCloudinary();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { listings: { include: { images: true } } },
    });

    if (!user) return { success: false, error: "User not found" };

    if (user.publicId) {
      try {
        await cloudinary.uploader.destroy(user.publicId);
        console.log(`Deleted profile image: ${user.publicId}`);
      } catch (err) {
        console.error("Failed to delete profile image:", err);
      }
    }

    const allListingPublicIds: string[] = user.listings.flatMap((listing) =>
      listing.images
        .map((img) => img.publicId)
        .filter((id): id is string => !!id)
    );

    if (allListingPublicIds.length > 0) {
      await cloudinary.api.delete_resources(allListingPublicIds);
    }

    await prisma.favorite.deleteMany({ where: { userId } });
    await prisma.message.deleteMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    });
    await prisma.listing.deleteMany({ where: { sellerId: userId } });
    await prisma.user.delete({ where: { id: userId } });

    const { error: supabaseError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (supabaseError) {
      console.error("Supabase Auth deletion error:", supabaseError);
    } else {
      console.log(`✅ Deleted Supabase Auth user: ${userId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getConversation(listingId: string, otherUserId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: {
      listingId,
      OR: [
        { senderId: user?.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: user?.id },
      ],
    },
    include: {
      sender: true,
      receiver: true,
      listing: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((msg) => ({ ...msg, sender: msg.senderId === user.id }));
}

export async function sendMessage(
  listingId: string,
  receiverId: string,
  content: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const message = await prisma.message.create({
    data: {
      listingId,
      senderId: user?.id,
      receiverId,
      content,
    },
  });
  return message;
}
export async function setReadMessages(messageIds: string[], userId: string) {
  try {
    await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        receiverId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error setting read messages:", error);
    return { success: false, error: "Failed to set read messages" };
  }
}
