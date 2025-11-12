"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardSkeleton() {
  return (
    <main className='flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] min-h-screen'>
      <div className='mb-6 space-y-2'>
        <div className='h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse'></div>
        <div className='h-4 w-1/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse'></div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='space-y-4 border border-gray-200 dark:border-white/20 rounded-xl p-4 bg-white/10 dark:bg-white/5 shadow-md'>
            <div className='h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
            <div className='space-y-2'>
              <div className='h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
              <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
            </div>
            <div className='flex justify-between items-center pt-2'>
              <div className='h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
              <div className='h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {[1, 2].map((i) => (
          <div
            key={i}
            className='p-4 border border-gray-200 dark:border-white/20 rounded-lg bg-white/10 dark:bg-white/5 space-y-4'>
            <div className='h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
            <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />

            <div className='flex items-center space-x-4 pt-2'>
              <div className='w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
                <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='space-y-4 mt-4'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex items-center space-x-4'>
            <div className='w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse'></div>
            <div className='flex-1 space-y-1'>
              <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse'></div>
              <div className='h-3 w-1/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse'></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
