import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className='bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors dark:border-t-2'>
      <div className='container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div>
          <div className='flex items-center space-x-2 mb-4'>
            <Image
              src={"/favicon.ico"}
              width={30}
              height={32}
              alt='Logo'
              className='h-7 w-8 bg-transparent'
            />
            <span className='font-bold text-xl'>Marketplace</span>
          </div>
          <p className='text-gray-700 dark:text-gray-300'>
            Your local marketplace for buying and selling amazing items.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-8 md:contents'>
          <div className='flex flex-col'>
            <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              For Sellers
            </h4>
            <ul className='space-y-2 text-gray-700 dark:text-gray-300'>
              <li>
                <Link
                  href='/dashboard/sell'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  My Listings
                </Link>
              </li>
              <li>
                <Link
                  href='/selling'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Selling Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Buyers */}
          <div className='flex flex-col'>
            <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              For Buyers
            </h4>
            <ul className='space-y-2 text-gray-700 dark:text-gray-300'>
              <li>
                <Link
                  href='/browse'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Browse Items
                </Link>
              </li>
              <li>
                <Link
                  href='/favorites'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  My Favorites
                </Link>
              </li>
              <li>
                <Link
                  href='/buying'
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Buying Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='flex flex-col'>
          <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>
            Support
          </h4>
          <ul className='space-y-2 text-gray-700 dark:text-gray-300'>
            <li>
              <Link
                href='/help'
                className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href='/privacy'
                className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href='/terms'
                className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-gray-500 dark:border-gray-700 pt-6 pb-6 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors'>
        <p className='text-sm'>&copy; 2024 Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}
