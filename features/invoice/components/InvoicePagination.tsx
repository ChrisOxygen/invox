"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface InvoicePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

const defaultItemsPerPageOptions = [10, 25, 50, 100];

export function InvoicePagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = defaultItemsPerPageOptions,
  className = "flex flex-col items-center justify-between gap-4 md:flex-row mt-auto p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl border-2 border-blue-200",
}: InvoicePaginationProps) {
  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="text-sm text-blue-600 font-medium">
        Showing {startItem} to {endItem} of {totalCount} invoices
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            onItemsPerPageChange(Number(value));
            onPageChange(1); // Reset to first page when changing items per page
          }}
        >
          <SelectTrigger className="w-[100px] h-9 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-blue-700">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-sm">
            {itemsPerPageOptions.map((option) => (
              <SelectItem
                key={option}
                value={option.toString()}
                className="hover:bg-blue-50 focus:bg-blue-50"
              >
                {option} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50",
                  "cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200"
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "ellipsis" ? (
                  <PaginationEllipsis className="text-blue-400" />
                ) : (
                  <PaginationLink
                    isActive={currentPage === pageNumber}
                    onClick={() => onPageChange(pageNumber as number)}
                    className={cn(
                      "cursor-pointer border-2 transition-all duration-200",
                      currentPage === pageNumber
                        ? "border-blue-600 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                    )}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(currentPage + 1, totalPages))
                }
                className={cn(
                  currentPage === totalPages &&
                    "pointer-events-none opacity-50",
                  "cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
