"use client";

export default function FeaturedListingsLoading() {
  return (
    <div className='my-10 px-1'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='animate-pulse border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800'>
            <div className='w-full h-48 bg-gray-200 dark:bg-gray-700' />
            <div className='p-4 space-y-2'>
              <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
