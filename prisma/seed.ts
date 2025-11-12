import { PrismaClient, ListingStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  const users = await prisma.user.createMany({
    data: [
      {
        email: "buyer1@example.com",
        fullName: "Alice Buyer",
        role: UserRole.BUYER,
        profileImageUrl: "https://i.pravatar.cc/150?img=1",
      },
      {
        email: "seller1@example.com",
        fullName: "Bob Seller",
        role: UserRole.SELLER,
        profileImageUrl: "https://i.pravatar.cc/150?img=2",
      },
      {
        email: "admin@example.com",
        fullName: "Charlie Admin",
        role: UserRole.ADMIN,
        profileImageUrl: "https://i.pravatar.cc/150?img=3",
      },
    ],
    skipDuplicates: true,
  });

  // Fetch created users
  const buyer = await prisma.user.findUnique({
    where: { email: "buyer1@example.com" },
  });
  const seller = await prisma.user.findUnique({
    where: { email: "seller1@example.com" },
  });

  // --- Categories ---
  const categories = await prisma.category.createMany({
    data: [
      { name: "Books", description: "All kinds of books" },
      { name: "Electronics", description: "Gadgets, phones, and more" },
      { name: "Fashion", description: "Clothes, shoes, accessories" },
    ],
    skipDuplicates: true,
  });

  const booksCategory = await prisma.category.findUnique({
    where: { name: "Books" },
  });
  const electronicsCategory = await prisma.category.findUnique({
    where: { name: "Electronics" },
  });

  // --- Listings ---
  const listings = await prisma.listing.createMany({
    data: [
      {
        sellerId: seller!.id,
        categoryId: booksCategory!.id,
        title: "The Great Gatsby",
        description: "Classic novel in good condition",
        price: 9.99,
        location: "New York",
        status: ListingStatus.ACTIVE,
      },
      {
        sellerId: seller!.id,
        categoryId: electronicsCategory!.id,
        title: "iPhone 13 Pro",
        description: "Used but works perfectly",
        price: 699.99,
        location: "San Francisco",
        status: ListingStatus.ACTIVE,
      },
    ],
    skipDuplicates: true,
  });

  const gatsbyListing = await prisma.listing.findFirst({
    where: { title: "The Great Gatsby" },
  });
  const iphoneListing = await prisma.listing.findFirst({
    where: { title: "iPhone 13 Pro" },
  });

  // --- Listing Images ---
  await prisma.listingImage.createMany({
    data: [
      {
        listingId: gatsbyListing!.id,
        imageUrl: "https://placekitten.com/400/400",
        isPrimary: true,
      },
      {
        listingId: iphoneListing!.id,
        imageUrl: "https://placekitten.com/500/500",
        isPrimary: true,
      },
    ],
  });

  // --- Favorites ---
  await prisma.favorite.create({
    data: {
      userId: buyer!.id,
      listingId: gatsbyListing!.id,
    },
  });

  // --- Messages ---
  await prisma.message.create({
    data: {
      listingId: gatsbyListing!.id,
      senderId: buyer!.id,
      receiverId: seller!.id,
      content: "Hi, is this book still available?",
    },
  });

  // --- Listing Views ---
  await prisma.listingView.create({
    data: {
      listingId: gatsbyListing!.id,
      viewerId: buyer!.id,
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
