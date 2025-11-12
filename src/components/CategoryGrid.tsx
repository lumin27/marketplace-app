import { getCategoryUrl } from "@/lib/CategoryUtils";
import {
  Smartphone,
  Car,
  Home,
  Shirt,
  Dumbbell,
  BookOpen,
  Heart,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categoryIcons: Record<string, any> = {
  Electronics: Smartphone,
  Vehicles: Car,
  "Home & Garden": Home,
  Fashion: Shirt,
  "Sports & Recreation": Dumbbell,
  "Books & Media": BookOpen,
  "Pets & Animals": Heart,
  Services: Wrench,
};

export async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          listings: { where: { status: "ACTIVE" } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <section className=' dark:bg-gray-900 transition-colors'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between mb-6 items-center'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors text-center'>
            Browse by Category
          </h2>
          <button className='mx-auto md:hidden text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline'>
            <Link href='/categories'>See All</Link>
          </button>
        </div>

        <div className='block md:hidden'>
          <div className='flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory'>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || Home;
              return (
                <Link
                  key={category.id}
                  href={getCategoryUrl(category.name)}
                  className='min-w-[30%] max-w-[30%] snap-start'>
                  <div className='group border rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer'>
                    <div className='p-1 text-center'>
                      <div className='mb-2 flex justify-center'>
                        <div className='p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700 transition-colors'>
                          <IconComponent className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                        </div>
                      </div>
                      <h3 className='font-medium text-sm mb-1 text-gray-900 dark:text-gray-100 overflow-hidden text-ellipsis whitespace-nowrap transition-colors'>
                        {category.name}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300 transition-colors'>
                        {category._count.listings} items
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className='hidden md:grid grid-cols-6 gap-2'>
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name] || Home;
            return (
              <Link key={category.id} href={getCategoryUrl(category.name)}>
                <div className='group border rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer py-4'>
                  <div className='text-center'>
                    <div className='mb-4 flex justify-center'>
                      <div className='p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700 transition-colors'>
                        <IconComponent className='h-6 w-6 text-indigo-600 dark:text-indigo-400' />
                      </div>
                    </div>
                    <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100 overflow-hidden text-ellipsis whitespace-nowrap transition-colors'>
                      {category.name}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 transition-colors'>
                      {category._count.listings} items
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
