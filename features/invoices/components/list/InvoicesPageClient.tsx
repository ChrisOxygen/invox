"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useInvoices } from "../../hooks/use-invoices";
import type { InvoiceFilters } from "../../types";
import { InvoiceFilters as InvoiceFiltersComponent } from "./InvoiceFilters";
import { InvoicesTable } from "./InvoicesTable";
import { InvoicesEmptyState } from "./InvoicesEmptyState";

const PAGE_SIZE = 20;

export function InvoicesPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<InvoiceFilters>({
    status: undefined,
    search: undefined,
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(
    null,
  );
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending } = useInvoices(filters);

  const invoices = data?.invoices ?? [];
  const total = data?.total ?? 0;
  const page = filters.page ?? 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const hasFilters = Boolean(
    (filters.status && filters.status !== "ALL") ||
    (filters.search && filters.search.trim().length > 0),
  );

  const isEmpty = !isPending && invoices.length === 0;

  const handleFilterChange = useCallback((next: InvoiceFilters) => {
    setFilters(next);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: undefined,
      search: undefined,
      page: 1,
      pageSize: PAGE_SIZE,
    });
  }, []);

  const handleDuplicate = useCallback(
    async (id: string) => {
      setIsDuplicating(true);
      try {
        const res = await fetch(`/api/v1/invoices/${id}/duplicate`, {
          method: "POST",
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(
            json?.error?.message ?? "Failed to duplicate invoice",
          );
        }
        const newInvoice = await res.json();
        await queryClient.invalidateQueries({ queryKey: ["invoices"] });
        toast.success("Invoice duplicated");
        router.push(`/invoices/${newInvoice.id}`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to duplicate invoice",
        );
      } finally {
        setIsDuplicating(false);
      }
    },
    [queryClient, router],
  );

  const handleDeleteConfirm = async () => {
    if (!deletingInvoiceId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/invoices/${deletingInvoiceId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Failed to delete invoice");
      }
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted");
      setDeletingInvoiceId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete invoice",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const startFrom = (page - 1) * PAGE_SIZE + 1;
  const endAt = Math.min(page * PAGE_SIZE, total);

  return (
    <ScrollArea className="h-[calc(100vh-90px)]">
      <div className=" pr-4">
        {/* Filters */}
        <div className="mb-5">
          <InvoiceFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Table or empty state */}
        {isEmpty ? (
          <InvoicesEmptyState
            status={filters.status ?? "ALL"}
            hasFilters={hasFilters}
            onClearFilters={hasFilters ? handleClearFilters : undefined}
          />
        ) : (
          <>
            <InvoicesTable
              invoices={invoices}
              isPending={isPending || isDuplicating}
              onDuplicate={handleDuplicate}
              onDelete={(id) => setDeletingInvoiceId(id)}
            />

            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-4 font-body text-[13px] text-(--ink-400)">
                <span>
                  Showing{" "}
                  <span className="font-mono font-medium text-(--ink-700)">
                    {startFrom}–{endAt}
                  </span>{" "}
                  of{" "}
                  <span className="font-mono font-medium text-(--ink-700)">
                    {total}
                  </span>{" "}
                  invoices
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(1, (prev.page ?? 1) - 1),
                      }))
                    }
                    disabled={page <= 1 || isPending}
                    className="font-display font-semibold text-[12px] border-(--border-default) text-(--ink-700) rounded h-8"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.min(totalPages, (prev.page ?? 1) + 1),
                      }))
                    }
                    disabled={page >= totalPages || isPending}
                    className="font-display font-semibold text-[12px] border-(--border-default) text-(--ink-700) rounded h-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete confirmation dialog */}
        <Dialog
          open={!!deletingInvoiceId}
          onOpenChange={(open) => {
            if (!open) setDeletingInvoiceId(null);
          }}
        >
          <DialogContent className="bg-(--surface-base) border border-(--border-default) rounded max-w-105">
            <DialogHeader>
              <DialogTitle className="font-display text-[18px] font-bold text-(--ink-900) tracking-[-0.02em]">
                Delete invoice?
              </DialogTitle>
              <DialogDescription className="font-body text-[14px] text-(--ink-400) leading-normal mt-1.5">
                This will permanently delete the invoice. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setDeletingInvoiceId(null)}
                disabled={isDeleting}
                className="font-display font-semibold text-[13px] border-(--border-default) text-(--ink-700) rounded h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="font-display font-semibold text-[13px] bg-(--error) text-white border-none rounded h-9"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
