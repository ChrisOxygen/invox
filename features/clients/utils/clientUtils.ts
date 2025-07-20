// Format date utility
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

// Generate pagination numbers utility
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

// Format client display name utility
export const formatClientDisplayName = (client: {
  BusinessName: string;
  contactPersonName?: string | null;
}): string => {
  return client.contactPersonName
    ? `${client.BusinessName} (${client.contactPersonName})`
    : client.BusinessName;
};
