import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import FavoriteClientPage from "@/components/FavoriteClientPage";
import { redirect } from "next/navigation";
import { serializePrisma } from "@/lib/utils";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  let favorites: any[] = [];

  if (user) {
    favorites = await prisma.favorite.findMany({
      where: { userId: user?.id },
      include: { listing: true },
    });
  }

  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: true,
      category: true,
      favorites: true,
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const safeListing = serializePrisma(listings);

  return (
    <div className='min-h-screen '>
      <Header />
      <FavoriteClientPage
        user={user as any}
        favorites={favorites}
        listings={safeListing}
      />
      <Footer />
    </div>
  );
}
