"use client";

import { useState } from "react";
import { deleteListing } from "@/lib/actions";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface DeletListingButtonProps {
  listingId: string;
}

const DeletListingButton = ({ listingId }: DeletListingButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setLoading(true);
      try {
        await deleteListing(listingId);
      } catch (err) {
        console.error(err);
        alert("Failed to delete listing.");
      } finally {
        toast.success("Listing deleted successfully.");
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`inline-flex items-center rounded-md border px-3 py-2 text-sm transition-colors ${
        loading
          ? "bg-red-600 text-white cursor-not-allowed"
          : "hover:bg-red-600 hover:text-white"
      }`}>
      {loading ? (
        <>
          <Loader2 className='h-5 w-5 mr-1 animate-spin' />
        </>
      ) : (
        <>
          <Trash2 className='h-4 w-4 mr-1' />
          Delete
        </>
      )}
    </button>
  );
};

export default DeletListingButton;
