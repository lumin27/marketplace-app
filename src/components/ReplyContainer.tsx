"use client";

import { sendMessage } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  listingId: string;
  receiverId: string;
};

const ReplyContainer = ({ listingId, receiverId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendMessage(listingId, receiverId, content);

      window.dispatchEvent(new Event("message-sent"));

      const channel = new BroadcastChannel("message_updates");
      channel.postMessage("new-message");
      channel.close();

      setContent("");
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className='px-3 py-1 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
        Reply
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4'>
          <div className='bg-white dark:bg-[#1E2A35] text-gray-900 dark:text-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 transition-all'>
            {/* Header */}
            <div className='flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-2'>
              <h2 className='text-lg font-semibold'>Quick Reply</h2>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'>
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-3'>
              <textarea
                className='w-full h-28 p-2 rounded-md bg-gray-50 dark:bg-[#2B3A47] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all'
                placeholder='Type your message...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className='flex justify-end space-x-2'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center transition-colors disabled:opacity-70'>
                  {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  Send
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className='text-right'>
              <a
                href={`/dashboard/messages/${listingId}`}
                className='text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 underline transition-colors'>
                View full conversation →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyContainer;
