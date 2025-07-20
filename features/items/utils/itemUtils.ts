/**
 * Format currency amount to USD format
 */
export const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Generate pagination numbers for display
 */
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const leftSide = Math.max(1, currentPage - 2);
    const rightSide = Math.min(totalPages, currentPage + 2);

    if (leftSide > 1) {
      pages.push(1);
      if (leftSide > 2) pages.push("ellipsis-left");
    }

    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(i);
    }

    if (rightSide < totalPages) {
      if (rightSide < totalPages - 1) pages.push("ellipsis-right");
      pages.push(totalPages);
    }
  }

  return pages;
};
