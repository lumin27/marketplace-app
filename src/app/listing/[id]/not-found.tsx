import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-grow container mx-auto px-4 py-16'>
        <div className='max-w-md mx-auto bg-white shadow-md rounded-lg p-8 text-center'>
          <div className='mb-4'>
            <Package className='h-12 w-12 mx-auto text-gray-400' />
          </div>

          <h2 className='text-2xl font-bold mb-2'>Listing Not Found</h2>
          <p className='text-gray-500 mb-6'>
            The listing you're looking for doesn't exist or has been removed.
          </p>

          <div className='flex flex-col gap-2'>
            <Link
              href='/browse'
              className='w-full inline-block py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors'>
              Browse All Listings
            </Link>

            <Link
              href='/'
              className='w-full inline-block py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors'>
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
