"use client";

import { setReadMessages } from "@/lib/actions";
import { useEffect } from "react";

export async function markAllMessagesAsRead(
  messageIds: string[],
  userId: string
) {
  if (!messageIds.length || !userId) return;
  try {
    await setReadMessages(messageIds, userId);
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
}

interface MessageReadTrackerProps {
  messageIds: string[];
  userId: string;
}

export function MessageReadTracker({
  messageIds,
  userId,
}: MessageReadTrackerProps) {
  useEffect(() => {
    markAllMessagesAsRead(messageIds, userId);
  }, [messageIds, userId]);

  return null;
}
