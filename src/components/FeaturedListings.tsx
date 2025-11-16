export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import FeaturedListingsClient from "./FeaturedListingsClient";

export async function FeaturedListings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: true,
      category: true,
      favorites: true,
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const listingsWithNumberPrice: any = listings.map((listing) => ({
    ...listing,
    price: Number(listing.price),
    images: listing.images.map((img) => ({
      ...img,
      createdAt: new Date(img.createdAt),
    })),
    favorites: listing.favorites.map((fav) => ({ ...fav })),
    _count: { favorites: listing._count.favorites },
    category: listing.category ? { ...listing.category } : null,
  }));

  return (
    <div className='my-10 px-1'>
      <FeaturedListingsClient
        listings={listingsWithNumberPrice}
        userId={user?.id}
      />
    </div>
  );
}
