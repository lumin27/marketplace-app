"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, type MessageFormData } from "@/lib/validations";
import { sendMessage } from "@/lib/actions";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "react-toastify";

interface ContactSellerButtonProps {
  listingId: string;
  sellerId: string;
}

export function ContactSellerButton({
  listingId,
  sellerId,
}: ContactSellerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", listingId, receiverId: sellerId },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
    };
    fetchUser();
  }, []);

  const onSubmit = async (data: MessageFormData) => {
    console.log(data, "Daataafa");
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage(
        data.listingId,
        data.receiverId,
        data.content
      );

      if (result) {
        toast.success("Message sent successfully!");
        reset();
        setIsOpen(false);
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => (user ? setIsOpen(true) : router.push("/auth/login"))}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all'>
        <MessageSquare className='h-4 w-4' />
        Contact Seller
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsOpen(false)}
          />

          <div className='relative bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 transition-all'>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition'
              aria-label='Close Modal'>
              <X className='w-5 h-5' />
            </button>

            <h2 className='text-xl font-semibold mb-2'>Contact Seller</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Send a message to the seller about this item.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='flex flex-col space-y-1'>
                <label htmlFor='message' className='font-medium'>
                  Your Message
                </label>
                <textarea
                  id='message'
                  rows={4}
                  placeholder="Hi, I'm interested in this item..."
                  className='border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 rounded-lg p-2 resize-none focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition w-full'
                  {...register("content")}
                />
                {errors.content && (
                  <p className='text-sm text-red-500'>
                    {errors.content.message}
                  </p>
                )}
              </div>

              {error && (
                <p className='text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded'>
                  {error}
                </p>
              )}

              <div className='flex gap-2'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition disabled:opacity-50'>
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
