export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getCategories } from "@/lib/actions";
import SellForm from "./SellForm";

export default async function SellItemPage() {
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

  const categoriesResult = await getCategories();
  const categories = categoriesResult.data || [];
  return (
    <main className='flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      <div className='max-w-2xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Sell an Item
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Create a new listing for your item
          </p>
        </div>

        <SellForm categories={categories as any} />
      </div>
    </main>
  );
}
