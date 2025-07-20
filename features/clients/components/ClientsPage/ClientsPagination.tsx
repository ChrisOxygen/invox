import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { PaginationInfo } from "../../types/clientTypes";
import { generatePaginationNumbers } from "../../utils/clientUtils";

interface ClientsPaginationProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
}

export const ClientsPagination = ({
  paginationInfo,
  onPageChange,
}: ClientsPaginationProps) => {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalCount,
    hasNextPage,
    hasPrevPage,
  } = paginationInfo;

  if (totalPages <= 1) return null;

  const visiblePages = generatePaginationNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {endIndex} of {totalCount} clients
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={typeof page !== "number"}
              className={
                page === currentPage
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0"
                  : "border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              }
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
