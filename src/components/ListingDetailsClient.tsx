"use client";

import { FavoriteButton } from "@/components/FavoriteButton";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { MapPin, Calendar, User, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@prisma/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface ListingDetailsClientProps {
  listing: Listing & {
    seller: {
      id: string;
      fullName: string | null;
      email: string | null;
      phone: string | null;
      profileImageUrl: string | null;
      createdAt: Date;
    };
    favorites: { userId: string }[];
    category: { name: string } | null;
    images: { imageUrl: string | null }[];
    _count: { favorites: number };
  };
  currentUser: SupabaseUser | null;
  relatedListings?: (Listing & {
    images: { imageUrl: string | null }[];
    category: { name: string } | null;
    favorites: { userId: string }[];
  })[];
}

export default function ListingDetailsClient({
  listing,
  currentUser,
  relatedListings = [],
}: ListingDetailsClientProps) {
  return (
    <div className='space-y-8 bg-gray-50 dark:bg-gray-900 w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-4 '>
          <div className='relative aspect-video rounded-lg overflow-hidden dark:bg-gray-800'>
            <Image
              src={listing.images[0]?.imageUrl || ""}
              alt={listing.title}
              fill
              className='object-cover'
              priority
            />
            <div className='absolute top-4 right-4 drop-shadow-md'>
              <FavoriteButton
                listingId={listing.id}
                initialFavorited={listing.favorites.some(
                  (fav) => fav.userId === currentUser?.id
                )}
              />
            </div>
            <div className='absolute top-4 left-4 bg-secondary text-white px-2 py-1 rounded text-sm font-medium uppercase tracking-wide'>
              {listing.category?.name || "Uncategorized"}
            </div>
          </div>

          {listing.images.length > 1 && (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2'>
              {listing.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className='relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${listing.title} ${index + 2}`}
                    fill
                    className='object-cover cursor-pointer hover:opacity-80 transition-opacity'
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='space-y-6'>
          <div className='border rounded-lg p-6 shadow bg-white dark:bg-gray-900 dark:border-gray-700 space-y-4'>
            <div>
              <h1 className='text-3xl font-bold'>{listing.title}</h1>
              <p className='text-4xl font-bold text-secondary'>
                ${listing.price.toString()}
              </p>
            </div>

            <div className='flex items-center text-gray-500 dark:text-gray-300 gap-2'>
              <MapPin className='h-4 w-4' />
              {listing.location}
            </div>
            <div className='flex items-center text-gray-500 dark:text-gray-300 gap-2'>
              <Calendar className='h-4 w-4' />
              Listed {new Date(listing.createdAt).toLocaleDateString()}
            </div>
            <div className='flex items-center text-gray-500 dark:text-gray-300 gap-2'>
              <Eye className='h-4 w-4' />
              {listing._count.favorites} favorites
            </div>

            <div
              className={`inline-block px-2 py-1 rounded text-white text-sm font-medium ${
                listing.status === "ACTIVE"
                  ? "bg-green-600"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}>
              {listing.status === "ACTIVE" ? "Available" : "Sold"}
            </div>
          </div>

          {listing.seller.id !== currentUser?.id && (
            <div className='border rounded-lg p-6 shadow bg-white dark:bg-gray-900 dark:border-gray-700'>
              <h3 className='text-lg font-semibold mb-4'>Seller Information</h3>
              <div className='flex items-center gap-3 mb-4'>
                {listing.seller.profileImageUrl ? (
                  <Image
                    src={
                      listing.seller.profileImageUrl || "/placeholder-user.jpg"
                    }
                    alt={listing.seller.fullName || "Seller"}
                    width={48}
                    height={48}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center text-secondary/70'>
                    <User className='h-6 w-6' />
                  </div>
                )}
                <div>
                  <p className='font-medium'>
                    {listing.seller.fullName || "Anonymous Seller"}{" "}
                    {listing.seller.phone}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Member since{" "}
                    {new Date(listing.seller.createdAt).getFullYear()}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {listing.seller.phone}
                  </p>
                </div>
              </div>
              <ContactSellerButton
                listingId={listing.id}
                sellerId={listing.sellerId}
              />
            </div>
          )}
        </div>
      </div>

      <div className='border rounded-lg shadow p-6 bg-white dark:bg-gray-800 dark:border-gray-700'>
        <h2 className='text-2xl font-bold mb-4 dark:text-gray-200'>
          Description
        </h2>
        <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap prose prose-gray dark:prose-invert'>
          {listing.description}
        </p>
      </div>

      {relatedListings.length > 0 && (
        <div className='mt-12'>
          <h2 className='text-2xl font-bold mb-6'>Similar Items</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8'>
            {relatedListings.map((related) => (
              <Link key={related.id} href={`/listing/${related.id}`}>
                <div className='border rounded-lg overflow-hidden shadow group hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900 dark:border-gray-700'>
                  <div className='relative rounded-t-lg overflow-hidden'>
                    <Image
                      src={related.images[0]?.imageUrl || "/placeholder.svg"}
                      alt={related.title}
                      width={300}
                      height={200}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200'
                    />
                    <div className='absolute top-3 right-3 drop-shadow-md'>
                      <FavoriteButton
                        listingId={related.id}
                        initialFavorited={related.favorites.some(
                          (fav) => fav.userId === currentUser?.id
                        )}
                      />
                    </div>
                    <div className='absolute top-3 left-3 bg-secondary text-white px-2 py-1 rounded text-sm font-medium uppercase tracking-wide'>
                      {related.category?.name}
                    </div>
                  </div>
                  <div className='p-4 space-y-1'>
                    <h3 className='font-semibold text-lg line-clamp-1'>
                      {related.title}
                    </h3>
                    <p className='text-2xl font-bold text-secondary'>
                      ${related.price.toString()}
                    </p>
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1'>
                      <MapPin className='h-4 w-4' />
                      {related.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
