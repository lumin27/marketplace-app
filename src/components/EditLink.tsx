"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Loader2 } from "lucide-react";

interface EditListingLinkProps {
  listingId: string;
}

export default function EditListing({ listingId }: EditListingLinkProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <Link
      href={`/dashboard/listings/${listingId}`}
      onClick={handleClick}
      className={`inline-flex items-center rounded-md border px-3 py-2 text-sm transition-colors ${
        loading
          ? "cursor-not-allowed bg-purple-400 text-white"
          : "hover:bg-purple-400 hover:text-white"
      }`}>
      {loading ? (
        <Loader2 className='h-5 w-10 mr-1 animate-spin' />
      ) : (
        <>
          <Edit className='h-4 w-4 mr-1' />
          Edit
        </>
      )}
    </Link>
  );
}
