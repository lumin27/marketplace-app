import CategoryClient from "@/components/CategoryClient";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

const CategoryListPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          listings: {
            where: { status: "ACTIVE" },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <CategoryClient categories={categories} />
    </div>
  );
};

export default CategoryListPage;
