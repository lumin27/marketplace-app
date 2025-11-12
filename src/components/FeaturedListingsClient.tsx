"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FavoriteButton } from "./FavoriteButton";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: { imageUrl: string }[];
  category?: { name: string };
  favorites: { userId: string }[];
  _count: { favorites: number };
}

interface FeaturedListingsClientProps {
  listings: Listing[];
  userId?: string;
  isLoading?: boolean;
}

export default function FeaturedListingsClient({
  listings,
  userId,
  isLoading = false,
}: FeaturedListingsClientProps) {
  if (isLoading) {
    return (
      <div className='my-10 px-1'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='animate-pulse border rounded-lg overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800'>
              <div className='w-full h-48 bg-gray-200 dark:bg-gray-700' />
              <div className='p-4 space-y-2'>
                <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>
          No listings available
        </h3>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>
          Be the first to create a listing!
        </p>
        <Link href='/dashboard/sell'>
          <button className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors'>
            Create Listing
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          <Link href={`/listing/${listing.id}`}>
            <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer bg-white dark:bg-gray-800'>
              <div className='relative'>
                <Image
                  src={listing.images[0]?.imageUrl || "/placeholder.svg"}
                  alt={listing.title}
                  width={300}
                  height={200}
                  className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200'
                />
                <div className='absolute top-3 right-3'>
                  <FavoriteButton
                    listingId={listing.id}
                    initialFavorited={listing.favorites.some(
                      (fav) => fav.userId === userId
                    )}
                  />
                </div>
                {listing.category?.name && (
                  <span className='absolute top-3 left-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium'>
                    {listing.category.name}
                  </span>
                )}
              </div>
              <div className='p-4'>
                <h3 className='font-semibold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-gray-100'>
                  {listing.title}
                </h3>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                  ${listing.price.toFixed(2)}
                </p>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <MapPin className='h-4 w-4 mr-1' />
                  {listing.location}
                </div>
                <div className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
                  {listing._count.favorites} favorites
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
