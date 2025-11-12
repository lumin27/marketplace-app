"use client";

export default function BrowseLoading() {
  return (
    <div className='min-h-screen container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <div className='h-8 w-48 bg-muted rounded animate-pulse mb-4' />
        <div className='h-4 w-64 bg-muted rounded animate-pulse' />
      </div>

      <div className='bg-white dark:bg-gray-900 border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg'>
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='overflow-hidden animate-pulse'>
              <div className='h-48 bg-muted' />
              <div className='p-4'>
                <div className='h-4 bg-muted rounded mb-2 w-3/4' />
                <div className='h-4 bg-muted rounded w-1/2' />
                <div className='h-3 bg-muted rounded mt-2 w-1/3' />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
