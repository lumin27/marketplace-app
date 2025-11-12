import SettingForm from "@/components/SettingForm";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const SettingPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const dbUser = await prisma.user.findUnique({
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
    <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white'>
      <div className='container mx-auto px-6 py-8'>
        <SettingForm userId={user?.id} userProfile={dbUser?.profileImageUrl} />
      </div>
    </main>
  );
};

export default SettingPage;
