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
import { InvoiceWithRelations } from "../types/invoiceTypes";
import { FavoriteIcon } from "./FavoriteIcon";

// Status badge color map
const statusColorMap = {
  DRAFT:
    "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200",
  SENT: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg",
  PAID: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg",
  OVERDUE: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
  CANCELLED:
    "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300",
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
  className = "h-full flex flex-col",
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
      <div className="hidden md:flex md:flex-col md:flex-1 md:min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-blue-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/80">
                <TableHead className="w-[120px] text-blue-700 font-semibold">
                  Invoice #
                </TableHead>
                <TableHead className="w-[200px] text-blue-700 font-semibold">
                  Client
                </TableHead>
                <TableHead className="w-[120px] text-blue-700 font-semibold">
                  Amount
                </TableHead>
                <TableHead className="w-[100px] text-blue-700 font-semibold">
                  Status
                </TableHead>
                <TableHead className="w-[120px] text-blue-700 font-semibold">
                  Due Date
                </TableHead>
                <TableHead className="w-[120px] text-blue-700 font-semibold">
                  Created
                </TableHead>
                {showFavorites && (
                  <TableHead className="w-[50px]">
                    <IoStar className="h-4 w-4 text-cyan-400" />
                  </TableHead>
                )}
                {showActions && (
                  <TableHead className="w-[100px] text-right text-blue-700 font-semibold">
                    Actions
                  </TableHead>
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
                    colSpan={
                      6 + (showFavorites ? 1 : 0) + (showActions ? 1 : 0)
                    }
                    className="text-center py-10 text-red-600 bg-red-50/50"
                  >
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      6 + (showFavorites ? 1 : 0) + (showActions ? 1 : 0)
                    }
                    className="text-center py-10 text-blue-600 bg-blue-50/50"
                  >
                    No invoices found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-cyan-50/40 transition-all duration-200 border-b border-blue-100/50"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/app/invoices/${invoice.id}`}
                        className="font-medium text-blue-700 hover:text-blue-900 cursor-pointer transition-colors duration-200"
                      >
                        {invoice.invoiceNumber ||
                          `INV-${invoice.id.slice(0, 8)}`}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {invoice.client?.BusinessName || "N/A"}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      {formatCurrency(invoice.subtotal || 0)}
                    </TableCell>
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
                    <TableCell className="text-gray-600">
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
                            className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200"
                          >
                            <Link href={`/app/invoices/${invoice.id}`}>
                              <FiEye className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-2 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-600 hover:text-cyan-700 transition-all duration-200"
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
                              className="border-2 border-red-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-red-500 transition-all duration-200"
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-2 border-blue-200 rounded-xl p-4 bg-white/90 backdrop-blur-sm"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-24 bg-blue-100" />
                    <Skeleton className="h-6 w-16 bg-cyan-100" />
                  </div>
                  <Skeleton className="h-4 w-32 bg-blue-100" />
                  <Skeleton className="h-4 w-20 bg-cyan-100" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-16 bg-blue-100" />
                    <Skeleton className="h-4 w-20 bg-cyan-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-600 p-4 bg-red-50/50 rounded-xl border-2 border-red-200 mx-4">
            Error: {error}
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-10 p-4 text-blue-600 bg-blue-50/50 rounded-xl border-2 border-blue-200 mx-4">
            No invoices found. Try adjusting your filters.
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border-2 border-blue-200 rounded-xl p-4 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-cyan-50/40 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {showFavorites && (
                        <FavoriteIcon isFavorite={invoice.isFavorite} />
                      )}
                      <Link
                        href={`/app/invoices/${invoice.id}`}
                        className="font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200"
                      >
                        {invoice.invoiceNumber ||
                          `INV-${invoice.id.slice(0, 8)}`}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {invoice.client?.BusinessName || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={cn(
                          statusColorMap[invoice.status] ||
                            statusColorMap.DRAFT,
                          "text-xs font-medium"
                        )}
                      >
                        {invoice.status}
                      </Badge>
                      <span className="text-sm font-semibold text-blue-600">
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
                          className="border-2 border-blue-200 hover:border-blue-400 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                        >
                          <FiMoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-40 p-2 border-2 border-blue-200 bg-white/95 backdrop-blur-sm"
                      >
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
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
                            className="w-full justify-start hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200"
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
                              className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-all duration-200"
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
                <div className="flex justify-between items-center pt-2 border-t-2 border-blue-100 text-xs text-gray-600">
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
