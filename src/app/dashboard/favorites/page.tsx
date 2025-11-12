import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function DashboardFavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        include: {
          images: true,
          category: true,
          seller: { select: { id: true, fullName: true, email: true } },
          _count: { select: { favorites: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className='flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            My Favorites
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Items you&apos;ve saved for later
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {favorites.map((favorite) => {
              const listing = favorite.listing;
              if (!listing) return null;

              return (
                <div
                  key={favorite.id}
                  className='group border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200 overflow-hidden'>
                  <div className='relative'>
                    <Image
                      src={listing.images[0]?.imageUrl || "/placeholder.svg"}
                      alt={listing.title}
                      width={300}
                      height={200}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200'
                    />
                    <span className='absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                      {listing.status === "ACTIVE" ? "Available" : "Sold"}
                    </span>
                    {listing.category && (
                      <span className='absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                        {listing.category.name}
                      </span>
                    )}
                  </div>

                  <div className='p-4'>
                    <h3 className='font-semibold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white'>
                      {listing.title}
                    </h3>
                    <p className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                      ${listing.price.toString()}
                    </p>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2'>
                      <MapPin className='h-4 w-4 mr-1' />
                      {listing.location}
                    </div>
                    <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      <span>
                        by {listing.seller.fullName || listing.seller.email}
                      </span>
                      <span>{listing._count.favorites} favorites</span>
                    </div>

                    <div className='flex gap-2'>
                      <Link
                        href={`/listing/${listing.id}`}
                        className='flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-medium text-white transition-colors'>
                        View Details
                      </Link>
                      <button
                        type='button'
                        className='inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                        <Heart className='h-4 w-4 text-red-500 fill-red-500' />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800'>
            <div className='text-center py-12 px-4'>
              <div className='mb-4'>
                <Heart className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-500' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
                No favorites yet
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Start browsing and save items you&apos;re interested in
              </p>
              <Link
                href='/browse'
                className='inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors'>
                Browse Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
