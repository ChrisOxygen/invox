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
        "h-9 w-9 p-0 border-gray-300 transition-all duration-200",
        isFavorite
          ? "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400"
          : "hover:bg-gray-50 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isFavorite ? (
        <IoStar className="h-4 w-4 text-yellow-400" />
      ) : (
        <IoStarOutline className="h-4 w-4 text-gray-400" />
      )}
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
