"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  MessageSquare,
  Heart,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", href: "/dashboard/listings", icon: Package },
  { title: "Sell Item", href: "/dashboard/sell", icon: Plus },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const SidebarContent = ({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) => (
  <div className='flex flex-col h-full bg-white dark:bg-gradient-to-b dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700'>
    <div className='space-y-3 py-6 px-3'>
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center w-full p-2 rounded-lg transition-all duration-150 ${
              isActive
                ? "bg-amber-100 dark:bg-white/15 text-amber-700 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
            }`}>
            <item.icon
              className={`mr-2 h-5 w-5 ${
                isActive
                  ? "text-amber-600 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
              }`}
            />
            <span className='text-sm font-medium'>{item.title}</span>
          </Link>
        );
      })}
    </div>
  </div>
);

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className='md:hidden absolute top-4 left-4 z-50'>
        <button
          className='p-2 border border-white/20 rounded bg-white dark:bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364] text-white border-r shadow-xl fixed top-4 left-4'
          onClick={() => setMobileOpen(true)}>
          <Menu className='h-6 w-6 text-black dark:text-white' />
        </button>

        {mobileOpen && (
          <div className='fixed inset-0 z-50 flex transition-all duration-300'>
            <div
              className='fixed inset-0 bg-black/40'
              onClick={() => setMobileOpen(false)}
            />
            <div className='relative w-64 bg-white dark:bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364] text-white border-r border-white/20 '>
              <div className='flex justify-between items-center px-4 py-4.5 border-b border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-2'>
                  <img src='/favicon.ico' alt='Logo' className='w-8 h-8' />
                  <span className='font-semibold text-lg tracking-wide text-gray-900 dark:text-white'>
                    Marketplace
                  </span>
                </div>
                <button
                  className='p-2 rounded-md transition'
                  onClick={() => setMobileOpen(false)}>
                  <X className='h-6 w-6 text-black dark:text-white' />
                </button>
              </div>

              <SidebarContent
                pathname={pathname}
                onLinkClick={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}
      </div>

      <div className='hidden md:block w-64 h-screen sticky top-0'>
        <SidebarContent pathname={pathname} />
      </div>
    </>
  );
}
