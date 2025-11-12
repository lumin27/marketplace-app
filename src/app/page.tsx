import { HeroSection } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedListings } from "@/components/FeaturedListings";
import { CTASection } from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import FeaturedListingsLoading from "@/components/FeaturedListingsLoading";
export default function HomePage() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <Header />
      <main className='container mx-auto px-4 bg-#f5f5f5'>
        <HeroSection />
        <CategoryGrid />
        <Suspense fallback={<FeaturedListingsLoading />}>
          <FeaturedListings />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
