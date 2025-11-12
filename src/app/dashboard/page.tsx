import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Package, DollarSign, Eye, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  const startOfThisMonth = startOfMonth(new Date());
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const [earningsThisMonth, earningsLastMonth] = await Promise.all([
    prisma.listing.aggregate({
      where: { sellerId: user.id, createdAt: { gte: startOfThisMonth } },
      _sum: { price: true },
    }),
    prisma.listing.aggregate({
      where: {
        sellerId: user.id,
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
      _sum: { price: true },
    }),
  ]);

  const totalThisMonth = earningsThisMonth._sum.price?.toNumber() ?? 0;
  const totalLastMonth = earningsLastMonth._sum.price?.toNumber() ?? 0;

  const [viewsThisMonth, viewsLastMonth] = await Promise.all([
    prisma.listingView.count({
      where: {
        listing: { sellerId: user.id },
        createdAt: { gte: startOfThisMonth },
      },
    }),
    prisma.listingView.count({
      where: {
        listing: { sellerId: user.id },
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),
  ]);

  const [listingThisMonth, listingLastMonth] = await Promise.all([
    prisma.listing.count({
      where: { sellerId: user.id, createdAt: { gte: startOfThisMonth } },
    }),
    prisma.listing.count({
      where: {
        sellerId: user.id,
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),
  ]);

  const calcGrowth = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth === 0 ? 0 : null;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  };

  const viewsGrowth = calcGrowth(viewsThisMonth, viewsLastMonth);
  const listingsGrowth = calcGrowth(listingThisMonth, listingLastMonth);

  const [listingsCount, messagesCount, recentListings, recentMessages] =
    await Promise.all([
      prisma.listing.count({ where: { sellerId: user.id } }),
      prisma.message.count({ where: { receiverId: user.id } }),
      prisma.listing.findMany({
        where: { sellerId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { images: true },
      }),
      prisma.message.findMany({
        where: { receiverId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { sender: true, listing: true },
      }),
    ]);

  function getGrowth(thisMonth: number, lastMonth: number) {
    if (lastMonth === 0) return thisMonth > 0 ? `+${thisMonth} (new)` : "0";
    const diff = thisMonth - lastMonth;
    const percent = Math.round((diff / lastMonth) * 100);
    return `${diff >= 0 ? "+" : ""}${percent}% from last month`;
  }

  return (
    <main className='flex-1 p-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      {/* Header */}
      <header className='mb-10'>
        <h1 className='text-4xl font-extrabold tracking-tight'>Dashboard</h1>
        <p className='text-gray-600 dark:text-gray-400 mt-1'>
          Welcome back, {profile?.full_name || "User"}
        </p>
      </header>

      <section className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        {[
          {
            label: "Total Listings",
            value: listingsCount,
            growth: listingsGrowth,
            icon: Package,
          },
          {
            label: "Total Views",
            value: viewsThisMonth,
            growth: viewsGrowth,
            icon: Eye,
          },
          {
            label: "Messages",
            value: messagesCount,
            growthText: "Active conversations",
            icon: MessageSquare,
          },
          {
            label: "Total Earnings",
            value: `$${totalThisMonth}`,
            growthText: getGrowth(totalThisMonth, totalLastMonth),
            icon: DollarSign,
          },
        ].map(({ label, value, growth, growthText, icon: Icon }, i) => (
          <div
            key={i}
            className='p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:scale-[1.02] hover:shadow-lg transition-transform'>
            <div className='flex justify-between items-center mb-3'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                {label}
              </span>
              <Icon className='h-5 w-5 text-gray-600 dark:text-gray-300' />
            </div>
            <div className='text-3xl font-semibold'>{value}</div>
            <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
              {growthText ??
                (growth === null
                  ? "New this month"
                  : `${growth >= 0 ? "+" : ""}${growth}% from last month`)}
            </p>
          </div>
        ))}
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10'>
        <div className='p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]'>
          <h3 className='text-lg font-semibold mb-1'>Recent Listings</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Your latest items for sale
          </p>
          <div className='space-y-4'>
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className='flex items-center space-x-4 hover:bg-white/10 rounded-xl p-2 transition'>
                <div className='w-12 h-12 overflow-hidden rounded-xl bg-gray-200 dark:bg-white/10 flex items-center justify-center'>
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].imageUrl}
                      alt={listing.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-500 dark:text-gray-300 text-sm font-medium'>
                      {listing.title.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>{listing.title}</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    ${listing.price.toString()} •{" "}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]'>
          <h3 className='text-lg font-semibold mb-1'>Recent Messages</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Latest inquiries about your items
          </p>
          <div className='space-y-4'>
            {recentMessages.map((m) => (
              <div
                key={m.id}
                className='flex items-center space-x-4 hover:bg-white/10 rounded-xl p-2 transition'>
                <div className='w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-semibold text-gray-700 dark:text-white'>
                    {(m.sender.fullName || m.sender.email)
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>
                    {m.sender.id === user.id ? "You" : m.sender.fullName}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                    {m.content}
                  </p>
                </div>
                <span className='text-xs text-gray-400'>
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
