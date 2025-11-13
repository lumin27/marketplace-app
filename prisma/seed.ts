import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Books", description: "All kinds of books" },
    { name: "Electronics", description: "Gadgets, phones, and more" },
    { name: "Fashion", description: "Clothes, shoes, accessories" },
    { name: "Home & Garden", description: "Furniture, decor, and more" },
    { name: "Pets & Animals", description: "Pets, accessories, and more" },
    { name: "Services", description: "Cleaning, plumbing, and more" },
    { name: "Vehicles", description: "Cars, trucks, and more" },
    { name: "Toys & Games", description: "Toys, games, and more" },
    {
      name: "Health & Beauty",
      description: "Health products, beauty products, and more",
    },
    { name: "Jewelry & Watches", description: "Jewelry, watches, and more" },
  ];

  const existing = await prisma.category.findMany();
  const existingNames = existing.map((c) => c.name);
  const toDelete = existingNames.filter(
    (name) => !categories.find((c) => c.name === name)
  );

  if (toDelete.length > 0) {
    await prisma.category.deleteMany({
      where: { name: { in: toDelete } },
    });
    console.log(` Removed outdated categories: ${toDelete.join(", ")}`);
  }

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log("Categories synced successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
