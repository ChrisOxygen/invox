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
  className = "flex flex-wrap gap-2",
}: InvoiceFiltersProps) {
  return (
    <div className={className}>
      <Select
        value={statusFilter}
        onValueChange={(value: InvoiceStatus | "ALL") =>
          onStatusFilterChange(value)
        }
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
          <SelectItem value="SENT">Sent</SelectItem>
          <SelectItem value="PAID">Paid</SelectItem>
          <SelectItem value="OVERDUE">Overdue</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-full md:w-52">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
