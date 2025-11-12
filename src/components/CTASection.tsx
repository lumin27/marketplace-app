import { Plus, Search } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className='py-16 dark:bg-gray-900 transition-colors'>
      <div className='container mx-auto px-0 md:px-4'>
        <div className='grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto'>
          <div className='text-center max-h-[220px] md:min-h-[300px] rounded-lg shadow-2xl bg-white dark:bg-gray-800 p-6 md:p-8 flex flex-col justify-between transition-colors'>
            <div className='mb-4 md:mb-6'>
              <div className='mx-auto w-8 h-8 md:w-10 md:h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-2 md:mb-4 transition-colors'>
                <Plus className='h-6 w-6 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400' />
              </div>
              <h3 className='font-semibold md:font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors'>
                Start Selling
              </h3>
              <p className='text-gray-600 dark:text-gray-300 line-clamp-2 transition-colors'>
                Turn your unused items into cash. It's free and easy to get
                started.
              </p>
            </div>
            <Link
              href='/dashboard/sell'
              className='inline-block mt-2 px-2 md:px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium'>
              List Your Item
            </Link>
          </div>

          <div className='text-center max-h-[220px] md:min-h-[300px] rounded-lg shadow-2xl bg-white dark:bg-gray-800 py-6 px-2 md:p-8 flex flex-col justify-between transition-colors'>
            <div className='mb-3 md:mb-6'>
              <div className='mx-auto w-8 h-8 md:w-10 md:h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-2 md:mb-4 transition-colors'>
                <Search className='h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400' />
              </div>
              <h3 className='font-semibold md:font-bold mb-3 text-gray-900 dark:text-gray-100 transition-colors'>
                Keep Browsing
              </h3>
              <p className='text-gray-600 dark:text-gray-300 line-clamp-2 transition-colors'>
                Discover amazing deals from your local community.
              </p>
            </div>
            <Link
              href='/browse'
              className='inline-flex mt-2 items-center justify-center py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-md hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors text-sm font-medium'>
              Browse All Items
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
