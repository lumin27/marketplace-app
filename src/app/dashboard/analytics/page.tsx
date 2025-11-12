import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Eye, MessageSquare, Heart, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";
import { AnalyticsCard } from "@/components/AnalyticsCard";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) redirect("/auth/login");

  const startOfThisMonth = startOfMonth(new Date());
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));

  const [
    messagesThisMonth,
    messagesLastMonth,
    messagesCount,
    favoritesThisMonth,
    favoritesLastMonth,
    favoritesCount,
    viewsThisMonth,
    viewsLastMonth,
    totalViews,
  ] = await Promise.all([
    prisma.message.count({
      where: { createdAt: { gte: startOfThisMonth }, receiverId: user.id },
    }),
    prisma.message.count({
      where: {
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        receiverId: user.id,
      },
    }),
    prisma.message.count({ where: { receiverId: user.id } }),
    prisma.favorite.count({
      where: {
        createdAt: { gte: startOfThisMonth },
        listing: { sellerId: user.id },
      },
    }),
    prisma.favorite.count({
      where: {
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        listing: { sellerId: user.id },
      },
    }),
    prisma.favorite.count({ where: { listing: { sellerId: user.id } } }),
    prisma.listingView.count({
      where: {
        createdAt: { gte: startOfThisMonth },
        listing: { sellerId: user.id },
      },
    }),
    prisma.listingView.count({
      where: {
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        listing: { sellerId: user.id },
      },
    }),
    prisma.listingView.count({ where: { listing: { sellerId: user.id } } }),
  ]);

  const conversionRate =
    totalViews > 0 ? Math.round((favoritesCount / totalViews) * 100) : 0;

  const calcGrowth = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth === 0 ? 0 : null;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  };

  const messageGrowth = calcGrowth(messagesThisMonth, messagesLastMonth);
  const favoritesGrowth = calcGrowth(favoritesThisMonth, favoritesLastMonth);
  const viewsGrowth = calcGrowth(viewsThisMonth, viewsLastMonth);

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const formatGrowth = (growth: number | null) => {
    if (growth === null) return "New";
    return growth >= 0
      ? `+${growth}% from last month`
      : `${growth}% from last month`;
  };

  const topListing = await prisma.listing.findFirst({
    where: { sellerId: user.id },
    orderBy: { views: { _count: "desc" } },
    include: {
      images: true,
      views: true,
      messages: true,
      favorites: true,
    },
  });

  const analytics = {
    topPerformingListing: topListing
      ? {
          title: topListing.title,
          views: topListing.views.length,
          messages: topListing.messages.length,
          favorites: topListing.favorites.length,
          imageUrl: topListing.images[0]?.imageUrl ?? null,
        }
      : {
          title: "No listings",
          views: 0,
          messages: 0,
          favorites: 0,
          imageUrl: null,
        },
    recentActivity: await prisma.$queryRaw`
      SELECT 'Viewed' AS action, l.title AS listing, v.created_at AS time
      FROM listing_views v
      JOIN listings l ON v.listing_id = l.id
      WHERE l.seller_id = ${user.id}
      ORDER BY v.created_at DESC
      LIMIT 5
    `.then((rows: unknown) =>
      (rows as any[]).map((r) => ({
        action: r.action,
        listing: r.listing,
        time: new Date(r.time).toLocaleString(),
      }))
    ),
  };

  return (
    <main className='flex-1 p-8 space-y-10 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Analytics
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Track the performance of your listings
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <AnalyticsCard
          title='Total Views'
          value={totalViews}
          growth={formatGrowth(viewsGrowth)}
          icon={Eye}
          className='bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md hover:shadow-lg transition'
        />
        <AnalyticsCard
          title='Messages Received'
          value={messagesCount}
          growth={formatGrowth(messageGrowth)}
          icon={MessageSquare}
          className='bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md hover:shadow-lg transition'
        />
        <AnalyticsCard
          title='Favorites Received'
          value={favoritesCount}
          growth={formatGrowth(favoritesGrowth)}
          icon={Heart}
          className='bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md hover:shadow-lg transition'
        />
        <AnalyticsCard
          title='Conversion Rate'
          value={`${conversionRate}%`}
          growth={`${
            conversionRate >= 0 ? "+" : ""
          }${conversionRate}% engagement`}
          icon={TrendingUp}
          className='bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md hover:shadow-lg transition'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='p-6 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 backdrop-blur-md shadow-sm hover:shadow-lg transition'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Top Performing Listing
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Your most viewed item this month
          </p>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden'>
              {analytics.topPerformingListing.imageUrl ? (
                <img
                  src={analytics.topPerformingListing.imageUrl}
                  alt={analytics.topPerformingListing.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  IMG
                </span>
              )}
            </div>
            <div className='flex-1'>
              <p className='font-medium text-gray-900 dark:text-white'>
                {analytics.topPerformingListing.title}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {analytics.topPerformingListing.views} views •{" "}
                {analytics.topPerformingListing.messages} messages •{" "}
                {analytics.topPerformingListing.favorites} favorites
              </p>
            </div>
          </div>
        </div>

        <div className='p-6 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 backdrop-blur-md shadow-sm hover:shadow-lg transition'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Recent Activity
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Latest interactions with your listings
          </p>
          <div className='space-y-4'>
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {activity.action}
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    {activity.listing} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
