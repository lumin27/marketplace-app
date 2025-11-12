import { prisma } from "@/lib/prisma";
import ListingUpdateForm from "./UpdateListingForm";
import { DashboardHeader } from "@/components/DashboardHeader";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { serializePrisma } from "@/lib/utils";

const UpdateListingPage = async ({ params }: { params: { id: string } }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const id = params.id;

  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      email: true,
      publicId: true,
      fullName: true,
      profileImageUrl: true,
      phone: true,
    },
  });

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
          createdAt: true,
        },
      },
      favorites: true,
      category: true,
      images: true,
      _count: { select: { favorites: true } },
    },
  });

  const categories = await prisma.category.findMany();

  if (!listing) return <div>Listing not found</div>;

  const safeListing = serializePrisma(listing);
  const safeCategories = serializePrisma(categories);

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader
        email={userData?.email || ""}
        fullName={userData?.fullName as string}
        profileImageUrl={userData?.profileImageUrl as string}
      />

      <div className='flex'>
        <DashboardSidebar />
        <main className='flex-1 p-6 space-y-8 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white min-h-screen'>
          <div className='max-w-2xl'>
            <div className='mb-6'>
              <h1 className='text-3xl font-bold'>Update Listing</h1>
              <p className='text-muted-foreground'>
                Update your item listing details
              </p>
            </div>
            <ListingUpdateForm
              listing={safeListing}
              categories={serializePrisma(safeCategories)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateListingPage;
