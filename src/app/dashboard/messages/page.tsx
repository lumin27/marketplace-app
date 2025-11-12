import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageReadTracker } from "./message-read-tracker";
import ReplyContainer from "@/components/ReplyContainer";

type GroupedMessages = Record<
  string,
  {
    listing: any;
    messages: {
      id: string;
      content: string;
      created_at: Date;
      readAt: Date | null;
      senderId: string;
      receiverId: string;
      sender: { id: string; fullName: string | null; email: string } | null;
      receiver: { id: string; fullName: string | null; email: string } | null;
    }[];
  }
>;

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) redirect("/auth/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user?.id } });
  const messagesData = await prisma.message.findMany({
    where: { OR: [{ senderId: user?.id }, { receiverId: user?.id }] },
    include: { listing: true, sender: true, receiver: true },
    orderBy: { createdAt: "desc" },
  });

  const messages = messagesData.map((msg) => ({
    id: msg.id,
    content: msg.content,
    created_at: msg.createdAt,
    readAt: msg.readAt,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    listingId: msg.listingId,
    listing: msg.listing,
    sender: msg.sender
      ? {
          id: msg.senderId,
          fullName: msg.sender.fullName,
          email: msg.sender.email,
        }
      : null,
    receiver: msg.receiver
      ? {
          id: msg.receiver.id,
          fullName: msg.receiver.fullName,
          email: msg.receiver.email,
        }
      : null,
  }));

  const messagesByListing: GroupedMessages = messages.reduce((acc, message) => {
    const listingId = message.listingId ?? "unknown";
    if (!acc[listingId]) {
      acc[listingId] = { listing: message.listing, messages: [] };
    }
    acc[listingId].messages.push(message);
    return acc;
  }, {} as GroupedMessages);

  return (
    <main className='flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364] text-gray-900 dark:text-white min-h-screen'>
      <MessageReadTracker
        messageIds={messages.map((m) => m.id)}
        userId={user.id}
      />

      <div className='space-y-6'>
        <header>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Messages
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Conversations about your listings
          </p>
        </header>

        {Object.keys(messagesByListing).length > 0 ? (
          <div className='space-y-4'>
            {Object.entries(messagesByListing).map(([listingId, data]) => {
              const latestMessage = [...data.messages].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0];

              const receiverId =
                latestMessage.senderId === user.id
                  ? latestMessage.receiverId
                  : latestMessage.senderId;

              return (
                <div
                  key={listingId}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm'>
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {data.listing?.title ?? "Deleted Listing"}
                      </h2>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {data.listing ? `$${data.listing.price}` : "No details"}
                      </p>
                    </div>
                    <span className='text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                      {data.messages.length}
                      {data.messages.length === 1 ? " message" : " messages"}
                    </span>
                  </div>

                  <div className='space-y-4'>
                    {[...data.messages]
                      .slice(0, 3)
                      .sort(
                        (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                      )
                      .map((message) => {
                        const isFromUser = message.senderId === user.id;
                        const isUnread = !message.readAt && !isFromUser;
                        const otherUser = isFromUser
                          ? message.receiver
                          : message.sender;

                        return (
                          <div
                            key={message.id}
                            className={`flex items-start space-x-3 ${
                              isUnread
                                ? "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                                : ""
                            }`}>
                            <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
                              <User
                                className={`w-5 h-5 ${
                                  isUnread
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              />
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                <span className='font-medium text-sm text-gray-900 dark:text-white'>
                                  {isFromUser
                                    ? "You"
                                    : otherUser?.fullName || "Anonymous"}
                                </span>
                                {isUnread && (
                                  <span className='text-xs px-2 py-0.5 bg-red-500 text-white rounded'>
                                    New
                                  </span>
                                )}
                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                  {new Date(
                                    message.created_at
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <p className='text-sm text-gray-700 dark:text-gray-300'>
                                {message.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                    <div className='pt-2 flex justify-between'>
                      <Link
                        href={`/listing/${listingId}`}
                        className='inline-block px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'>
                        View Listing
                      </Link>

                      {receiverId && (
                        <ReplyContainer
                          listingId={listingId}
                          receiverId={receiverId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center bg-white dark:bg-gray-800'>
            <MessageSquare className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
              No messages yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Messages from buyers interested in your items will appear here
            </p>
            <Link
              href='/dashboard/listings'
              className='inline-block px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'>
              View My Listings
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
