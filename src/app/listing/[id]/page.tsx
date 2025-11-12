import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingViewTracker from "@/hooks/ListingViewTracker";
import ListingDetailsClient from "@/components/ListingDetailsClient";

interface ListingPageProps {
  params: { id: string };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          profileImageUrl: true,
          createdAt: true,
        },
      },
      favorites: true,
      category: true,
      images: { orderBy: { isPrimary: "desc" } },
      _count: { select: { favorites: true } },
    },
  });

  const relatedListings = await prisma.listing.findMany({
    where: {
      categoryId: listing?.categoryId,
      id: { not: id },
      status: "ACTIVE",
    },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      category: true,
      favorites: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (!listing) throw new Error("Listing not found");

  return (
    <div className='min-h-screen'>
      <Header />
      <main className='container mx-auto px-4 lg:px-8 py-8'>
        <ListingViewTracker listingId={id} />
        <ListingDetailsClient
          listing={listing}
          currentUser={user}
          relatedListings={relatedListings}
        />
      </main>
      <Footer />
    </div>
  );
}
