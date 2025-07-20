import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ItemsPaginationProps {
  currentPage: number;
  totalPages: number;
  paginationNumbers: (number | string)[];
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const ItemsPagination = ({
  currentPage,
  totalPages,
  paginationNumbers,
  onPageChange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: ItemsPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div className="bg-gradient-to-r from-white to-blue-50 border border-blue-200 rounded-xl p-3 shadow-lg">
        <Pagination>
          <PaginationContent className="flex items-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoPrevious) onPrevious();
                }}
                className={
                  !canGoPrevious
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                }
              />
            </PaginationItem>

            {paginationNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {typeof page === "number" ? (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={currentPage === page}
                    className={`
                      relative overflow-hidden rounded-lg transition-all duration-200 min-w-[40px] h-10 flex items-center justify-center font-medium
                      ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105 border-0"
                          : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md"
                      }
                    `}
                  >
                    {page}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis className="text-blue-600" />
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoNext) onNext();
                }}
                className={
                  !canGoNext
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
