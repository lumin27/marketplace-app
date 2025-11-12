import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getListings } from "@/lib/actions";
import { slugToCategory } from "@/lib/CategoryUtils";
import { createClient } from "@/lib/supabase/server";

interface BrowsePageProps {
  searchParams: {
    search?: string;
    category?: string;
    sort?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { search, category, sort } = searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];
  const filters: any = { status: "ACTIVE" };

  let categoryName: string | undefined;
  if (category && category !== "all") {
    categoryName = slugToCategory(category, categories || []);
    const foundCategory = categories?.find(
      (cat) => cat.name.toLowerCase() === categoryName?.toLowerCase()
    );
    if (foundCategory) {
      filters.categoryId = foundCategory.id;
    }
  }

  const listingsResult = await getListings({
    status: "ACTIVE",
    categoryId: filters.categoryId,
    search,
    sort,
    limit: 20,
  });
  const filteredListings = listingsResult.success
    ? listingsResult.data || []
    : [];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-6'>Browse Listings</h1>
          <div className='mb-4'>
            <p className='text-muted-foreground'>
              Showing {filteredListings?.length || 0} listings
              {category &&
                category !== "all" &&
                ` in ${categoryName || category}`}
              {search && ` matching "${search}"`}
            </p>
          </div>
        </div>

        {filteredListings && filteredListings.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredListings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <div className='group border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-200'>
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
                        className='fill-red-500 hover:fill-red-600'
                        listingId={listing.id}
                        initialFavorited={listing.favorites.some(
                          (fav) => fav.userId === user?.id
                        )}
                      />
                    </div>
                    {listing.category?.name && (
                      <span className='absolute top-3 left-3 bg-secondary text-white text-xs font-medium px-2 py-1 rounded'>
                        {listing.category.name}
                      </span>
                    )}
                  </div>
                  <div className='p-4'>
                    <h3 className='font-semibold text-lg mb-2 line-clamp-1 dark:text-gray-200'>
                      {listing.title}
                    </h3>
                    <p className='text-2xl font-bold text-secondary mb-2'>
                      ${listing.price.toString()}
                    </p>
                    <div className='flex items-center text-sm text-muted-foreground dark:text-gray-400'>
                      <MapPin className='h-4 w-4 mr-1' />
                      {listing.location}
                    </div>
                    <div className='mt-2 text-xs text-muted-foreground dark:text-gray-400'>
                      {listing._count.favorites} favorites
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <h3 className='text-xl font-semibold mb-2'>No listings found</h3>
            <p className='text-muted-foreground mb-4'>
              Try adjusting your search or browse all categories
            </p>
            <Link href='/browse'>
              <button className='px-6 py-2 border rounded-md hover:bg-gray-100'>
                View All Listings
              </button>
            </Link>
          </div>
        )}

        {filteredListings && filteredListings.length >= 20 && (
          <div className='text-center mt-12'>
            <button className='px-6 py-2 border rounded-md hover:bg-gray-100'>
              Load More Listings
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
