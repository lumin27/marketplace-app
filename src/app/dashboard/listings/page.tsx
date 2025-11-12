import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Plus, Eye, Package } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletListingButton from "@/components/DeletListingButton";
import EditListing from "@/components/EditLink";

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.id) {
    redirect("/auth/login");
  }
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  const listings = await prisma.listing.findMany({
    where: { sellerId: user?.id },
    include: { images: true, category: true, seller: true },
  });

  return (
    <main className='flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              My Listings
            </h1>
            <p className='text-gray-600 dark:text-gray-300'>
              Manage your items for sale
            </p>
          </div>
          <Link
            href='/dashboard/sell'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200'>
            <Plus className='h-4 w-4 mr-2' />
            New Listing
          </Link>
        </div>

        {/* Listings */}
        {listings.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {listings.map((listing) => (
              <div
                key={listing.id}
                className='border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 p-5 flex flex-col justify-between'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg line-clamp-1 text-gray-900 dark:text-white'>
                      {listing.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                      {listing.description}
                    </p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      listing.status === "ACTIVE"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                    {listing.status}
                  </span>
                </div>

                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                      $
                      {listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      {listing.location}
                    </span>
                  </div>

                  <div className='flex gap-2 flex-wrap'>
                    <Link
                      href={`/listing/${listing.id}`}
                      className='inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm hover:bg-blue-600 hover:text-white transition-all duration-200'>
                      <Eye className='h-4 w-4 mr-1' />
                      View
                    </Link>
                    <EditListing listingId={listing.id} />
                    <DeletListingButton listingId={listing.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='border border-gray-200 dark:border-gray-700 rounded-xl text-center py-12 px-6 mx-auto max-w-md bg-white dark:bg-gray-800'>
            <Package className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
              No listings yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Start selling by creating your first listing
            </p>
            <Link
              href='/dashboard/sell'
              className='inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200'>
              <Plus className='h-4 w-4 mr-2' />
              Create Your First Listing
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
