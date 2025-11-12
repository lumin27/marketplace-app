"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { getConversation, sendMessage } from "@/lib/actions";
import { ArrowLeft, SendHorizontalIcon } from "lucide-react";

interface ReplyPageProps {
  params: { id: string };
}

export default function ReplyPage({ params }: ReplyPageProps) {
  const { id: listingId } = params;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUserId, setOtherUserId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getConversation(listingId);
      setMessages(data);

      if (data.length > 0 && !otherUserId) {
        const firstMsg = data[0];
        const userId = firstMsg.sender
          ? firstMsg.receiverId
          : firstMsg.senderId;
        setOtherUserId(userId);
      }
    };
    fetchMessages();
  }, [listingId]);

  useEffect(() => {
    if (autoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScrollEnabled]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setAutoScrollEnabled(isAtBottom);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !otherUserId) return;

    startTransition(async () => {
      await sendMessage(listingId, otherUserId, newMessage);
      setNewMessage("");
      window.dispatchEvent(new Event("message-received"));
      window.dispatchEvent(new Event("message-sent"));

      const updated = await getConversation(listingId, otherUserId);
      setMessages(updated);
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300'>
      <div className='w-full flex flex-col border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg bg-white dark:bg-[#161b22] transition-all duration-300'>
        <div className='relative flex items-center justify-center border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-100 dark:bg-[#1c2128] rounded-t-2xl'>
          <ArrowLeft className='absolute left-4 w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition' />
          <div className='font-semibold text-lg tracking-wide'>Chat</div>
        </div>

        <div
          onScroll={handleScroll}
          className='flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-[#0d1117] dark:via-[#161b22] dark:to-[#1c2128] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent'>
          {messages.length === 0 ? (
            <p className='text-sm text-gray-400 text-center mt-10 h-screen'>
              No messages yet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-sm ${
                    msg.sender
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-[#2d333b] text-gray-900 dark:text-gray-100 rounded-bl-none"
                  }`}>
                  <p className='text-sm leading-relaxed'>{msg.content}</p>
                  <div className='text-[10px] mt-1 opacity-70 text-right'>
                    {new Date(msg.createdAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-100 dark:bg-[#1c2128] rounded-b-2xl'>
          <div className='relative flex items-center'>
            <input
              type='text'
              className='flex-1 pr-12 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 bg-white dark:bg-[#161b22] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300'
              placeholder='Type your message...'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMessage.trim() && !isPending)
                  handleSend();
              }}
            />
            <button
              onClick={() => {
                if (newMessage.trim() && !isPending) handleSend();
              }}
              className={`absolute right-2 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
                newMessage.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              } ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
              <SendHorizontalIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
