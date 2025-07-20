"use client";

import { useState } from "react";
import {
  useGetItems,
  useItemsSearch,
  useItemsDialog,
  useItemsPagination,
  useItemsActions,
} from "@/features/items/hooks";
import {
  ItemForm,
  ItemPreviewDialog,
  DeleteConfirmationDialog,
  ItemsHeader,
  ItemsSearchAndFilters,
  ItemsLoadingState,
  ItemsErrorState,
  ItemsEmptyState,
  ItemsTable,
  ItemsGrid,
  ItemsPagination,
} from "@/features/items/components";

const ITEMS_PER_PAGE = 10;

function ItemsPage() {
  // Additional state for filters
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState("all");

  // Custom hooks for managing state and logic
  const {
    searchTerm,
    debouncedSearchTerm,
    currentPage,
    setCurrentPage,
    handleSearch,
  } = useItemsSearch();

  const {
    dialogState,
    formMode,
    selectedItem,
    closeDialog,
    openPreview,
    openForm,
    openDelete,
  } = useItemsDialog();

  // Fetch items using the updated hook with pagination
  const {
    items,
    pagination,
    isPending: gettingItems,
    isError,
    error,
  } = useGetItems({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm,
  });

  // Pagination logic
  const {
    paginationNumbers,
    goToPrevious,
    goToNext,
    goToPage,
    canGoPrevious,
    canGoNext,
  } = useItemsPagination({
    currentPage,
    totalPages: pagination.totalPages,
    setCurrentPage,
  });

  // Item actions
  const {
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleRowClick,
    handleSaveItem,
    handleDeleteConfirm,
    handleEditFromPreview,
  } = useItemsActions({
    items,
    openForm,
    openDelete,
    openPreview,
    closeDialog,
  });

  // Handle sort toggle
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle date filter change
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
  };

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6">
      <div className="space-y-6">
        {/* Row 1 - Header Section */}
        <div className="w-full">
          <ItemsHeader onAddItem={handleAddItem} />
        </div>

        {/* Row 2 - Search and Filter Bar */}
        <div className="w-full">
          <ItemsSearchAndFilters
            searchTerm={searchTerm}
            onSearch={handleSearch}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            isLoading={gettingItems}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        </div>

        {/* Row 3 - Data Table Container */}
        <div className="w-full">
          {isError ? (
            <ItemsErrorState error={error || "Unknown error"} />
          ) : gettingItems ? (
            <ItemsLoadingState />
          ) : items.length === 0 ? (
            <ItemsEmptyState
              hasSearchTerm={!!debouncedSearchTerm}
              searchTerm={debouncedSearchTerm}
              onAddItem={handleAddItem}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <ItemsTable
                items={items}
                onRowClick={handleRowClick}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />

              {/* Mobile Cards */}
              <ItemsGrid
                items={items}
                onRowClick={handleRowClick}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />

              {/* Pagination */}
              <ItemsPagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                paginationNumbers={paginationNumbers}
                onPageChange={goToPage}
                onPrevious={goToPrevious}
                onNext={goToNext}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ItemPreviewDialog
        open={dialogState === "preview"}
        onOpenChange={closeDialog}
        item={selectedItem}
        onEdit={handleEditFromPreview}
      />
      <ItemForm
        open={dialogState === "form"}
        onOpenChange={closeDialog}
        item={selectedItem}
        mode={formMode}
        onSuccess={handleSaveItem}
      />
      <DeleteConfirmationDialog
        open={dialogState === "delete"}
        onOpenChange={closeDialog}
        item={selectedItem}
        onSuccess={handleDeleteConfirm}
      />
    </div>
  );
}

export default ItemsPage;
