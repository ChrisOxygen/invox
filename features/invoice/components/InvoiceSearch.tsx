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
  className = "w-full md:w-64",
}: InvoiceSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
