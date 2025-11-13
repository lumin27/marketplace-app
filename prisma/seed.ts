import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Other Categories ---
  const categories = [
    { name: "Books", description: "All kinds of books" },
    { name: "Electronics", description: "Gadgets, phones, and more" },
    { name: "Fashion", description: "Clothes, shoes, accessories" },
    { name: "Home & Garden", description: "Furniture, decor, and more" },
    { name: "Pets & Animals", description: "Pets, accessories, and more" },
    { name: "Services", description: "Cleaning, plumbing, and more" },
    {
      name: "Sports & Recreation",
      description: "Sports gear, equipment, and more",
    },
    { name: "Vehicles", description: "Cars, trucks, and more" },
    { name: "Toys & Games", description: "Toys, games, and more" },
    { name: "Tools & Hardware", description: "Tools, hardware, and more" },
    {
      name: "Health & Beauty",
      description: "Health products, beauty products, and more",
    },
    { name: "Jewelry & Watches", description: "Jewelry, watches, and more" },
    { name: "Musical Instruments", description: "Guitars, drums, and more" },
    { name: "Collectibles", description: "Antiques, coins, and more" },
    { name: "Antiques", description: "Antiques, coins, and more" },
    { name: "Coins", description: "Antiques, coins, and more" },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // prevents errors if categories already exist
  });

  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
