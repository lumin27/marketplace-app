"use client";

import { useEffect, useState } from "react";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  status: "ACTIVE" | "SOLD";
  images?: { imageUrl?: string }[];
}

interface Favorite {
  id: string;
  listing: Listing;
}

interface FavoriteClientPageProps {
  listings: Listing[];
  user: User | null;
  favorites: Favorite[];
}

const FavoriteClientPage = ({
  user,
  favorites: initialFavorites,
  listings,
}: FavoriteClientPageProps) => {
  const [favorites, setFavorites] = useState<Favorite[]>(
    initialFavorites || []
  );

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  if (!user) {
    return (
      <main className='container mx-auto px-4 py-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>My Favorites</h1>
        <p className='text-gray-500 mb-6'>
          Sign in to view your favorite items
        </p>
        <Link
          href='/auth/login'
          className='inline-block bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90'>
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8 min-h-screen'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>My Favorites</h1>
        <p className='text-gray-500'>Items you've saved for later</p>
      </div>

      {favorites.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {favorites.map((favorite) => {
            const listing = listings.find((l) => l.id === favorite.listing.id);
            if (!listing) return null;

            const listingImage =
              listing.images?.[0]?.imageUrl || "/placeholder.svg";

            return (
              <div
                key={favorite.id}
                className='border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow'>
                <div className='relative'>
                  <Image
                    src={listingImage}
                    alt={listing.title}
                    width={300}
                    height={200}
                    className='w-full h-48 object-cover'
                  />
                  <FavoriteButton
                    listingId={listing.id}
                    initialFavorited={true}
                    className='absolute top-3 right-3'
                  />
                  <span className='absolute top-3 left-3 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded'>
                    {listing.status === "ACTIVE" ? "Available" : "Sold"}
                  </span>
                </div>

                <div className='p-4'>
                  <h3 className='font-semibold text-lg mb-1 truncate'>
                    {listing.title}
                  </h3>
                  <p className='text-xl font-bold text-secondary mb-2'>
                    ${listing.price}
                  </p>
                  <div className='flex items-center text-sm text-gray-500 mb-4'>
                    <MapPin className='h-4 w-4 mr-1' />
                    {listing.location}
                  </div>
                  <div className='flex gap-2'>
                    <Link
                      href={`/listing/${listing.id}`}
                      className='flex-1 bg-secondary text-white text-center py-2 rounded hover:bg-secondary/90'>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='border rounded-lg p-12 text-center'>
          <Heart className='h-12 w-12 mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold mb-2'>No favorites yet</h3>
          <p className='text-gray-500 mb-4'>
            Start browsing and save items you're interested in
          </p>
          <Link
            href='/browse'
            className='inline-block bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90'>
            Browse Items
          </Link>
        </div>
      )}
    </main>
  );
};

export default FavoriteClientPage;
