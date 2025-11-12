import ProfileInputForm from "@/components/ProfileInputForm";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      id: true,
      publicId: true,
      fullName: true,
      email: true,
      phone: true,
      profileImageUrl: true,
    },
  });

  return (
    <div className='p-6 w-screen md:w-full bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white min-h-screen'>
      <ProfileInputForm user={{ ...userData, id: userData?.id }} />
    </div>
  );
};

export default ProfilePage;
