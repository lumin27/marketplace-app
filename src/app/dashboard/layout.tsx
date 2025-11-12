import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      email: true,
      publicId: true,
      fullName: true,
      profileImageUrl: true,
      phone: true,
    },
  });

  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-background text-foreground flex flex-col`}>
      <DashboardHeader
        email={userData?.email || ""}
        fullName={userData?.fullName as string}
        profileImageUrl={userData?.profileImageUrl as string}
      />

      <div className='flex flex-1'>
        <DashboardSidebar />

        <main className='flex-1 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
          {children}
        </main>
      </div>
    </div>
  );
}
