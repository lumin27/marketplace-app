"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  User,
  Heart,
  Plus,
  LogOut,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { getUser } from "@/lib/actions";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const dbUser = await getUser(user?.id || "");
      setProfile(dbUser.user?.profileImageUrl);
      setUser(dbUser.user);

      if (!user) return;
    };

    setup();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-[#E4E5E7] bg-[#F8F9FA]/95 backdrop-blur-md shadow-sm'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between text-[#1C1F23]'>
        <Link href='/' className='flex items-center space-x-2'>
          <Image src='/favicon.ico' alt='Logo' width={32} height={32} />
          <span className='font-bold text-xl hidden md:inline text-[#1C1F23]'>
            Marketplace
          </span>
        </Link>

        <form onSubmit={handleSearch} className='flex-1 mx-2 md:mx-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4' />
            <input
              type='text'
              placeholder='Search listings...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full border border-[#E4E5E7] bg-white px-10 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent transition'
            />
          </div>
        </form>

        <div className='hidden md:flex items-center gap-3'>
          <Link href='/favorites'>
            <button className='p-2 rounded hover:text-[#6C63FF] transition-colors '>
              <Heart className='h-5 w-5' />
            </button>
          </Link>
          {user ? <NotificationBell userId={user.id} /> : null}
          {user ? (
            <>
              <Link href='/dashboard/sell'>
                <button className='flex items-center gap-1 border border-[#E4E5E7] px-3 py-1.5 rounded-md bg-[#6C63FF] text-white hover:bg-[#5A54E8] transition'>
                  <Plus className='h-4 w-4' /> Sell Item
                </button>
              </Link>

              <div className='relative'>
                <button
                  className='h-10 w-10 rounded-full overflow-hidden border border-[#E4E5E7] flex items-center justify-center hover:ring-2 hover:ring-[#6C63FF]/50 transition'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {profile ? (
                    <Image
                      src={profile}
                      alt='Avatar'
                      width={40}
                      height={40}
                      className='rounded-full'
                    />
                  ) : (
                    <span className='uppercase font-bold text-[#6C63FF]'>
                      {profile?.full_name
                        ? profile.full_name.charAt(0)
                        : user.email.charAt(0)}
                    </span>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-56 bg-white border border-[#E4E5E7] shadow-lg rounded-lg z-50'>
                    <div className='px-4 py-2 border-b border-[#E4E5E7]'>
                      <p className='text-sm font-medium'>
                        {user.fullName || "User"}
                      </p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </div>
                    <Link
                      href='/dashboard'
                      className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                      <LayoutDashboard className='mr-2 h-4 w-4 text-[#6C63FF]' />{" "}
                      Dashboard
                    </Link>
                    <Link
                      href='/dashboard/profile'
                      className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                      <User className='mr-2 h-4 w-4 text-[#6C63FF]' /> Profile
                    </Link>
                    <Link
                      href='/dashboard/settings'
                      className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                      <Settings className='mr-2 h-4 w-4 text-[#6C63FF]' />{" "}
                      Settings
                    </Link>
                    <div className='border-t border-[#E4E5E7]' />
                    <button
                      onClick={handleSignOut}
                      className='flex items-center px-4 py-2 w-full hover:bg-[#FFE9EC] text-[#FF6584] transition'>
                      <LogOut className='mr-2 h-4 w-4' /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href='/auth/login'>
                <button className='flex items-center gap-1 border border-[#E4E5E7] px-3 py-1.5 rounded-md hover:bg-[#F1F0FE] hover:text-[#6C63FF] transition'>
                  <User className='h-4 w-4' /> Sign In
                </button>
              </Link>
              <Link href='/dashboard/sell'>
                <button className='flex items-center gap-1 border border-[#E4E5E7] px-3 py-1.5 rounded-md bg-[#6C63FF] text-white hover:bg-[#5A54E8] transition'>
                  <Plus className='h-4 w-4' /> Sell Item
                </button>
              </Link>
            </>
          )}
        </div>

        <div className='flex md:hidden items-center gap-2'>
          <Link href='/favorites'>
            <button className='p-2 rounded hover:text-[#6C63FF]'>
              <Heart className='h-5 w-5' />
            </button>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='p-2 border border-[#E4E5E7] rounded-md'>
            {isMobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </button>
          {isMobileMenuOpen && (
            <div className='absolute top-14 right-3 w-56 bg-white border border-[#E4E5E7] shadow-lg rounded-lg z-50'>
              <Link
                href='/dashboard'
                className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                <LayoutDashboard className='mr-2 h-4 w-4 text-[#6C63FF]' />{" "}
                Dashboard
              </Link>
              <Link
                href='/dashboard/profile'
                className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                <User className='mr-2 h-4 w-4 text-[#6C63FF]' /> Profile
              </Link>
              <Link
                href='/dashboard/settings'
                className='flex items-center px-4 py-2 hover:bg-[#F1F0FE] transition'>
                <Settings className='mr-2 h-4 w-4 text-[#6C63FF]' /> Settings
              </Link>
              <div className='border-t border-[#E4E5E7]' />
              <button
                onClick={handleSignOut}
                className='flex items-center px-4 py-2 w-full hover:bg-[#FFE9EC] text-[#FF6584] transition'>
                <LogOut className='mr-2 h-4 w-4' /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
