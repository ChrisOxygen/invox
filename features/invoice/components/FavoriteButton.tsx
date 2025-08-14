"use client";

import { Button } from "@/components/ui/button";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  disabled = false,
  className,
}: FavoriteButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        onToggle();
      }}
      disabled={disabled}
      className={cn(
        "h-8 w-8 sm:h-9 sm:w-9 p-0 transition-all duration-200 border-2",
        isFavorite
          ? "bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-400 hover:from-yellow-500 hover:to-orange-500 hover:border-yellow-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          : "border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transform hover:scale-105",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
    >
      {isFavorite ? (
        <IoStar className="h-3 w-3 sm:h-4 sm:w-4" />
      ) : (
        <IoStarOutline className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
