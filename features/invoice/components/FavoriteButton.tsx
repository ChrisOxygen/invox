"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  isFavorite = false,
  onToggle,
  disabled = false,
  className,
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    const newFavoriteState = !favorite;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFavorite(newFavoriteState);
      onToggle?.(newFavoriteState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isLoading}
      className={cn(
        "h-9 w-9 p-0 border-gray-300 transition-all duration-200",
        favorite
          ? "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400"
          : "hover:bg-gray-50 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400",
          isLoading && "animate-pulse"
        )}
      />
      <span className="sr-only">
        {favorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
