"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/lib/utils";
import { InvoiceStatusBadge } from "@/features/invoices/components/list/InvoiceStatusBadge";
import type { RecentInvoice } from "../server/_get-dashboard-stats";
import type { InvoiceStatus } from "@/prisma/generated/client/enums";

interface DashboardRecentInvoicesProps {
  invoices: RecentInvoice[];
  isPending: boolean;
}

function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM yyyy");
  } catch {
    return "—";
  }
}

function DueDateCell({
  dueDate,
  status,
}: {
  dueDate: string;
  status: InvoiceStatus;
}) {
  const isOverdue = status === "OVERDUE";
  return (
    <span className={`font-body text-[13px] ${isOverdue ? "text-(--error)" : "text-(--ink-400)"}`}>
      {formatDisplayDate(dueDate)}
    </span>
  );
}

const columnHelper = createColumnHelper<RecentInvoice>();

const thClassName =
  "text-(--ink-400) font-display text-[11px] font-semibold tracking-[0.08em] uppercase py-3";

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-b border-(--border-default)">
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-3.5 w-20 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-14 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function DashboardRecentInvoices({
  invoices,
  isPending,
}: DashboardRecentInvoicesProps) {
  const router = useRouter();

  const columns = [
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice #",
      cell: (info) => (
        <Link
          href={`/invoices/${info.row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-[13px] font-medium text-(--blue-600) no-underline"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("client", {
      header: "Client",
      cell: (info) => {
        const client = info.getValue();
        return (
          <div>
            <p className="font-display text-[14px] font-semibold text-(--ink-900) tracking-[-0.01em] leading-[1.3]">
              {client.name}
            </p>
            {client.company && (
              <p className="font-body text-[12px] text-(--ink-400) mt-0.5 leading-[1.2]">
                {client.company}
              </p>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: (info) => (
        <DueDateCell
          dueDate={info.getValue()}
          status={info.row.original.status}
        />
      ),
    }),
    columnHelper.accessor("total", {
      header: "Amount",
      cell: (info) => (
        <span className="font-mono text-[13px] font-medium text-(--ink-900)">
          {formatCurrency(info.getValue(), info.row.original.currency)}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} size="sm" />,
    }),
  ];

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-(--surface-base) border border-(--border-default) rounded overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-(--surface-raised) border-b border-(--border-default)">
            {table.getHeaderGroups().map((hg) =>
              hg.headers.map((header) => (
                <TableHead key={header.id} className={thClassName}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              )),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <SkeletonRows />
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-[40px]">
                <p className="font-body text-[13px] text-(--ink-300)">
                  No invoices yet
                </p>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer transition-colors duration-100 hover:bg-(--surface-raised) [&:not(:last-child)]:border-b [&:not(:last-child)]:border-(--border-default)"
                  onClick={() => router.push(`/invoices/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
