"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addToFavorites, removeFromFavorites } from "@/lib/actions";

interface FavoriteButtonProps {
  listingId: string;
  initialFavorited: boolean;
  className?: string;
  onUnfavorite?: () => void;
}

export function FavoriteButton({
  listingId,
  initialFavorited,
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(user?.id, listingId);
        setIsFavorited(false);
      } else {
        await addToFavorites(user?.id, listingId);
        setIsFavorited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 transition-colors ${className}`}>
      <Heart
        className={`h-4 w-4 ${
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-gray-800 dark:text-gray-200"
        }`}
      />
    </button>
  );
}
