"use client";

import React from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

interface FavoriteIconProps {
  isFavorite: boolean;
  className?: string;
}

export function FavoriteIcon({ isFavorite, className }: FavoriteIconProps) {
  return isFavorite ? (
    <IoStar className={cn("h-4 w-4 text-yellow-400", className)} />
  ) : (
    <IoStarOutline className={cn("h-4 w-4 text-gray-400", className)} />
  );
}
