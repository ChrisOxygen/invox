"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

interface InvoiceSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function InvoiceSearch({
  searchQuery,
  onSearchChange,
  placeholder = "Search invoices...",
  className = "w-full md:w-80",
}: InvoiceSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg bg-white text-gray-900 placeholder:text-blue-400"
      />
    </div>
  );
}
