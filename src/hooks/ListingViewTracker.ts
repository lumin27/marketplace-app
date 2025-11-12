"use client";
import { useEffect, useRef } from "react";

export default function ListingViewTracker({
  listingId,
}: {
  listingId: string;
}) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    fetch(`/api/listings/${listingId}/view`, { method: "POST" }).catch((err) =>
      console.error("Failed to record view:", err)
    );
  }, [listingId]);

  return null;
}
