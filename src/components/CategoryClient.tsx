"use client";

import { getCategoryUrl } from "@/lib/CategoryUtils";
import {
  Smartphone,
  Car,
  Home,
  Shirt,
  BookOpen,
  Heart,
  Wrench,
  Search,
  Activity,
  Diamond,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export const categoryIcons: Record<string, any> = {
  Books: BookOpen,
  Electronics: Smartphone,
  Fashion: Shirt,
  "Home & Garden": Home,
  "Pets & Animals": Heart,
  Services: Wrench,
  Vehicles: Car,
  "Toys & Games": Activity,
  "Health & Beauty": Heart,
  "Jewelry & Watches": Diamond,
};

export interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: {
    listings: number;
  };
}

interface CategoryClientProps {
  categories: Category[];
}

const CategoryClient = ({ categories }: CategoryClientProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  const normalizedIcons = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(categoryIcons).map(([key, value]) => [
        key.toLowerCase().trim(),
        value,
      ])
    ) as Record<string, any>;
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Category names from DB:",
        categories.map((c) => c.name)
      );
    }
  }, [categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <div className='p-2'>
      <form onSubmit={handleSearch} className='max-w-2xl mx-auto m-6'>
        <div className='relative flex-1 px-2'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5' />
          <input
            type='text'
            placeholder='What are you looking for?'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full border border-input bg-background px-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition'
          />
        </div>
      </form>

      <div className='flex flex-wrap gap-3 justify-center max-w-4xl mx-auto'>
        {categories.map((category) => {
          const rawName = category?.name ?? "";
          const lookupKey = rawName.toLowerCase().trim();
          const IconComponent = normalizedIcons[lookupKey] ?? Home;

          if (
            process.env.NODE_ENV !== "production" &&
            !normalizedIcons[lookupKey]
          ) {
            console.warn(
              `[CategoryClient] missing icon for category "${rawName}". Using fallback icon.`
            );
          }

          return (
            <Link
              key={category.id}
              href={getCategoryUrl(category.name)}
              className='w-[30%] max-w-[30%] md:w-[180px] snap-start'>
              <div className='border rounded-lg p-3 text-center hover:shadow-lg transition-shadow cursor-pointer group'>
                <div className='flex justify-center mb-2'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors'>
                    <IconComponent className='h-4 w-4 text-blue-600' />
                  </div>
                </div>
                <h3 className='font-medium text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                  {category.name}
                </h3>
                <p className='text-sm text-gray-500'>
                  {category._count.listings} items
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryClient;
