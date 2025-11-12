"use client";

import { createClient } from "@/lib/supabase/client";
import { User, Settings, LogOut, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
export function DashboardHeader({
  email,
  fullName,
  profileImageUrl,
}: {
  email: string;
  fullName: string;
  profileImageUrl: string;
}) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathName = usePathname();

  const isDashboardRoot = pathName === "/dashboard";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-gradient-to-r dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] border-b border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-6 ml-15 md:ml-0 cursor-pointer'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src='/favicon.ico'
              alt='Logo'
              width={32}
              height={32}
              className='h-8 w-8'
            />
            <span className='font-semibold text-lg text-gray-900 dark:text-white'>
              Marketplace
            </span>
          </Link>

          <Link
            href='/'
            className='hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition'>
            <Home className='h-4 w-4' /> Home
          </Link>
        </div>
        {!isDashboardRoot && (
          <button
            onClick={() => router.back()}
            className='md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer'>
            <ArrowLeft className='h-5 w-5' />
            <span className='hidden md:inline'>Back</span>
          </button>
        )}

        <div className='relative'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='relative h-10 w-10 rounded-full overflow-hidden border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 transition'>
            <img
              src={profileImageUrl || "/noAvatar.png"}
              alt={fullName || email}
              className='h-full w-full object-cover'
            />
          </button>

          {isDropdownOpen && (
            <div className='absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl z-50 overflow-hidden'>
              <div className='px-4 py-3 border-b border-gray-100'>
                <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                  {fullName || "User"}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {email}
                </p>
              </div>
              <div className='flex flex-col py-2'>
                <Link
                  href='/dashboard/profile'
                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                  onClick={() => setIsDropdownOpen(false)}>
                  <User className='h-4 w-4 text-gray-600 dark:text-gray-400' />{" "}
                  Profile
                </Link>
                <Link
                  href='/dashboard/settings'
                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                  onClick={() => setIsDropdownOpen(false)}>
                  <Settings className='h-4 w-4 text-gray-600 dark:text-gray-400' />{" "}
                  Settings
                </Link>
                <hr className='my-1 border-gray-200 dark:border-gray-600' />
                <button
                  onClick={handleSignOut}
                  className='flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left'>
                  <LogOut className='h-4 w-4 text-red-600 dark:text-red-400' />{" "}
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
