"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing } from "lucide-react";
import { getMessages, setReadMessages } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function NotificationBell({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchMessages = async () => {
    if (!userId) return;
    const msgs = await getMessages(userId);
    setMessages(msgs);
    console.log(msgs, "afjaljfalfjlajf");
    const unread = msgs.filter((msg) => !msg.readAt).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    const handleRefresh = () => fetchMessages();

    window.addEventListener("message-sent", handleRefresh);

    const channel = new BroadcastChannel("message_updates");
    channel.onmessage = (event) => {
      if (event.data === "new-message") fetchMessages();
    };

    return () => {
      window.removeEventListener("message-sent", handleRefresh);
      channel.close();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleMessageClick = (msg: any) => {
    const listingId = msg?.listingId;
    if (!listingId) {
      console.warn("No listingId for message:", msg);
      return;
    }
    router.push(`/dashboard/messages/${listingId}`);
    setOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className='relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
        {unreadCount > 0 ? (
          <BellRing className='h-5 w-5 text-gray-900 dark:text-white' />
        ) : (
          <Bell className='h-5 w-5 text-gray-900 dark:text-white' />
        )}
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center'>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50'>
          <div className='flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-sm text-gray-900 dark:text-white'>
              Messages
            </h3>
            {unreadCount > 0 && (
              <button
                className='text-xs text-gray-500 dark:text-gray-300 hover:underline'
                onClick={async () => {
                  try {
                    const unreadIds = messages
                      .filter((msg) => !msg.readAt)
                      .map((msg) => msg.id);

                    if (unreadIds.length > 0) {
                      await setReadMessages(unreadIds, userId);
                    }

                    setMessages((prev) =>
                      prev.map((msg) => ({
                        ...msg,
                        readAt: new Date().toISOString(),
                      }))
                    );
                    setUnreadCount(0);
                  } catch (err) {
                    console.error("Failed to mark all read:", err);
                  }
                }}>
                Mark all read
              </button>
            )}
          </div>

          {messages.length === 0 ? (
            <div className='p-4 text-center text-sm text-gray-500 dark:text-gray-300'>
              No messages yet
            </div>
          ) : (
            <div className='max-h-80 overflow-y-auto'>
              {messages.length > 0 ? (
                messages.slice(0, 10).map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleMessageClick(msg)}
                    className={`cursor-pointer p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded ${
                      !msg.readAt ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}>
                    <div className='flex items-start space-x-3'>
                      <div className='text-lg'>💬</div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <p
                            className={`text-sm font-medium ${
                              !msg.readAt
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-gray-100"
                            }`}>
                            {msg.senderName || "Unknown Sender"}
                          </p>
                        </div>
                        <p className='text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2'>
                          {msg.content}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                          {formatTime(msg.createdAt)} • {msg.listingTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-center text-gray-500 py-4'>
                  No new messages 🎉
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
