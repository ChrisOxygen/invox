import { generatePaginationNumbers } from "../utils";

interface UseItemsPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  maxVisiblePages?: number;
}

export const useItemsPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  maxVisiblePages = 5,
}: UseItemsPaginationProps) => {
  const paginationNumbers = generatePaginationNumbers(
    currentPage,
    totalPages,
    maxVisiblePages
  );

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    paginationNumbers,
    goToPrevious,
    goToNext,
    goToPage,
    canGoPrevious,
    canGoNext,
  };
};
