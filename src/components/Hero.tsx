"use client";

import type React from "react";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  return (
    <section className='relative bg-white dark:bg-gray-900 py-12 md:py-24'>
      <div className='container mx-auto px-4 text-center'>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
          Find what you love,{" "}
          <span className='text-secondary'>sell what you don’t</span>
        </h1>
        <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto'>
          Discover amazing deals from your local community — or turn your unused
          items into cash.
        </p>

        <form
          onSubmit={handleSearch}
          className='max-w-2xl mx-auto hidden md:block'>
          <div className='flex gap-2 items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5' />
              <input
                type='text'
                placeholder='What are you looking for?'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors'
              />
            </div>
            <button
              type='submit'
              className='px-6 py-3 rounded-md bg-secondary text-white text-sm font-medium hover:bg-secondary/90 active:scale-[0.98] transition-all'>
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
