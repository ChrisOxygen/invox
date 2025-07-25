"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceStatus } from "@prisma/client";

interface InvoiceFiltersProps {
  statusFilter: InvoiceStatus | "ALL";
  onStatusFilterChange: (value: InvoiceStatus | "ALL") => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  sortOptions?: Array<{ label: string; value: string }>;
  className?: string;
}

const defaultSortOptions = [
  { label: "Newest First", value: "created_desc" },
  { label: "Oldest First", value: "created_asc" },
  { label: "Amount: High to Low", value: "amount_desc" },
  { label: "Amount: Low to High", value: "amount_asc" },
  { label: "Due Date: Nearest", value: "due_date_asc" },
  { label: "Client Name: A-Z", value: "client_asc" },
];

export function InvoiceFilters({
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange,
  sortOptions = defaultSortOptions,
  className = "flex flex-wrap gap-3",
}: InvoiceFiltersProps) {
  return (
    <div className={className}>
      <Select
        value={statusFilter}
        onValueChange={(value: InvoiceStatus | "ALL") =>
          onStatusFilterChange(value)
        }
      >
        <SelectTrigger className="w-full md:w-40 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-blue-700">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-sm">
          <SelectItem value="ALL" className="hover:bg-blue-50 focus:bg-blue-50">
            All Statuses
          </SelectItem>
          <SelectItem
            value="DRAFT"
            className="hover:bg-blue-50 focus:bg-blue-50"
          >
            Draft
          </SelectItem>
          <SelectItem
            value="SENT"
            className="hover:bg-blue-50 focus:bg-blue-50"
          >
            Sent
          </SelectItem>
          <SelectItem
            value="PAID"
            className="hover:bg-blue-50 focus:bg-blue-50"
          >
            Paid
          </SelectItem>
          <SelectItem
            value="OVERDUE"
            className="hover:bg-blue-50 focus:bg-blue-50"
          >
            Overdue
          </SelectItem>
          <SelectItem
            value="CANCELLED"
            className="hover:bg-blue-50 focus:bg-blue-50"
          >
            Cancelled
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-full md:w-52 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-blue-700">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-sm">
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-blue-50 focus:bg-blue-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
