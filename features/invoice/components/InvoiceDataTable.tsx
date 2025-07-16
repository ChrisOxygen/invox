"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FiEdit2, FiEye, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import { formatCurrency } from "@/utils";
import { InvoiceWithRelations } from "@/types/invoice";
import { FavoriteIcon } from "./FavoriteIcon";

// Status badge color map
const statusColorMap = {
  DRAFT: "bg-gray-200 text-gray-800",
  SENT: "bg-gray-800 text-white",
  PAID: "bg-gray-500 text-white",
  OVERDUE: "bg-gray-900 text-white",
  CANCELLED: "bg-white text-gray-800 border border-gray-800",
};

interface InvoiceDataTableProps {
  invoices: InvoiceWithRelations[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
  onDeleteInvoice?: (invoice: InvoiceWithRelations) => void;
  showActions?: boolean;
  showFavorites?: boolean;
  className?: string;
}

export function InvoiceDataTable({
  invoices,
  isLoading,
  isError,
  error,
  onDeleteInvoice,
  showActions = true,
  showFavorites = true,
  className = "rounded-md border border-gray-200",
}: InvoiceDataTableProps) {
  const handleDeleteClick = (
    e: React.MouseEvent,
    invoice: InvoiceWithRelations
  ) => {
    e.stopPropagation();
    onDeleteInvoice?.(invoice);
  };

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Invoice #</TableHead>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead className="w-[120px]">Amount</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              {showFavorites && (
                <TableHead className="w-[50px]">
                  <IoStar className="h-4 w-4 text-black" />
                </TableHead>
              )}
              {showActions && (
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    {showFavorites && (
                      <TableCell>
                        <Skeleton className="h-6 w-6" />
                      </TableCell>
                    )}
                    {showActions && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6 + (showFavorites ? 1 : 0) + (showActions ? 1 : 0)}
                  className="text-center py-10 text-red-500"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6 + (showFavorites ? 1 : 0) + (showActions ? 1 : 0)}
                  className="text-center py-10"
                >
                  No invoices found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/app/invoices/${invoice.id}`}
                      className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                    >
                      {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.client?.BusinessName || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(invoice.subtotal || 0)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        statusColorMap[invoice.status] || statusColorMap.DRAFT
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.paymentDueDate
                      ? new Date(invoice.paymentDueDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  {showFavorites && (
                    <TableCell>
                      <FavoriteIcon isFavorite={invoice.isFavorite} />
                    </TableCell>
                  )}
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-300 hover:border-black hover:bg-gray-50"
                        >
                          <Link href={`/app/invoices/${invoice.id}`}>
                            <FiEye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-300 hover:border-black hover:bg-gray-50"
                        >
                          <Link href={`/app/invoices/edit/${invoice.id}`}>
                            <FiEdit2 className="h-3 w-3" />
                          </Link>
                        </Button>
                        {onDeleteInvoice && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, invoice)}
                            className="border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 p-4">
            Error: {error}
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-10 p-4">
            No invoices found. Try adjusting your filters.
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {showFavorites && (
                        <FavoriteIcon isFavorite={invoice.isFavorite} />
                      )}
                      <Link
                        href={`/app/invoices/${invoice.id}`}
                        className="font-medium text-black hover:text-gray-700"
                      >
                        {invoice.invoiceNumber ||
                          `INV-${invoice.id.slice(0, 8)}`}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {invoice.client?.BusinessName || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={cn(
                          statusColorMap[invoice.status] ||
                            statusColorMap.DRAFT,
                          "text-xs"
                        )}
                      >
                        {invoice.status}
                      </Badge>
                      <span className="text-sm font-medium text-black">
                        {formatCurrency(invoice.subtotal || 0)}
                      </span>
                    </div>
                  </div>
                  {showActions && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-black"
                        >
                          <FiMoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-2">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <Link href={`/app/invoices/${invoice.id}`}>
                              <FiEye className="mr-2 h-3 w-3" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <Link href={`/app/invoices/edit/${invoice.id}`}>
                              <FiEdit2 className="mr-2 h-3 w-3" />
                              Edit
                            </Link>
                          </Button>
                          {onDeleteInvoice && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteInvoice(invoice)}
                              className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 className="mr-2 h-3 w-3" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <span>
                    Due:{" "}
                    {invoice.paymentDueDate
                      ? new Date(invoice.paymentDueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span>
                    Created:{" "}
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
