import { PrismaClient, UserRole, ListingStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      fullName: "Admin User",
      role: UserRole.ADMIN,
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@example.com" },
    update: {},
    create: {
      email: "seller1@example.com",
      fullName: "John Seller",
      role: UserRole.SELLER,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@example.com" },
    update: {},
    create: {
      email: "seller2@example.com",
      fullName: "Jane Seller",
      role: UserRole.SELLER,
    },
  });

  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer1@example.com" },
    update: {},
    create: {
      email: "buyer1@example.com",
      fullName: "Alice Buyer",
      role: UserRole.BUYER,
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: "buyer2@example.com" },
    update: {},
    create: {
      email: "buyer2@example.com",
      fullName: "Bob Buyer",
      role: UserRole.BUYER,
    },
  });

  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics", description: "Phones, laptops, gadgets" },
  });

  const books = await prisma.category.upsert({
    where: { name: "Books" },
    update: {},
    create: { name: "Books", description: "Fiction and non-fiction books" },
  });

  const fashion = await prisma.category.upsert({
    where: { name: "Fashion" },
    update: {},
    create: { name: "Fashion", description: "Clothes and accessories" },
  });

  const phone = await prisma.listing.create({
    data: {
      sellerId: seller1.id,
      categoryId: electronics.id,
      title: "iPhone 15 Pro",
      description: "Latest Apple iPhone with amazing features.",
      price: new Decimal(1200.0),
      location: "New York",
      status: ListingStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl: "https://picsum.photos/300?random=1",
            isPrimary: true,
          },
          { imageUrl: "https://picsum.photos/300?random=2" },
        ],
      },
    },
  });

  const novel = await prisma.listing.create({
    data: {
      sellerId: seller2.id,
      categoryId: books.id,
      title: "The Great Gatsby",
      description: "Classic novel by F. Scott Fitzgerald.",
      price: new Decimal(15.99),
      location: "Los Angeles",
      status: ListingStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl: "https://picsum.photos/300?random=3",
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.favorite.create({
    data: { userId: buyer1.id, listingId: phone.id },
  });

  await prisma.favorite.create({
    data: { userId: buyer2.id, listingId: novel.id },
  });

  await prisma.message.create({
    data: {
      listingId: phone.id,
      senderId: buyer1.id,
      receiverId: seller1.id,
      content: "Is this still available?",
    },
  });

  await prisma.message.create({
    data: {
      listingId: novel.id,
      senderId: buyer2.id,
      receiverId: seller2.id,
      content: "Can you ship internationally?",
    },
  });

  await prisma.listingView.createMany({
    data: [
      {
        listingId: phone.id,
        viewerId: buyer1.id,
        ip: "192.168.1.10",
        userAgent: "Mozilla/5.0",
      },
      {
        listingId: novel.id,
        viewerId: buyer2.id,
        ip: "192.168.1.11",
        userAgent: "Mozilla/5.0",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
