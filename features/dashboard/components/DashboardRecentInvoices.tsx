"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO, differenceInDays } from "date-fns";
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
  if (status === "OVERDUE") {
    const days = differenceInDays(new Date(), parseISO(dueDate));
    return (
      <div>
        <span className="[font-family:var(--font-body)] text-[13px] text-(--error)">
          {formatDisplayDate(dueDate)}
        </span>
        <br />
        <span className="[font-family:var(--font-body)] text-[11px] text-(--error) opacity-75">
          {days > 0 ? `${days}d overdue` : "Due today"}
        </span>
      </div>
    );
  }
  return (
    <span className="[font-family:var(--font-body)] text-[13px] text-(--ink-400)">
      {formatDisplayDate(dueDate)}
    </span>
  );
}

const columnHelper = createColumnHelper<RecentInvoice>();

const thClassName =
  "text-(--ink-400) [font-family:var(--font-display)] text-[11px] font-semibold tracking-[0.08em] uppercase py-[10px]";

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
          className="[font-family:var(--font-mono)] text-[13px] font-medium text-(--blue-600) no-underline"
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
            <p className="[font-family:var(--font-display)] text-[13px] font-semibold text-(--ink-900) tracking-[-0.01em]">
              {client.name}
            </p>
            {client.company && (
              <p className="[font-family:var(--font-body)] text-[11px] text-(--ink-400) mt-[1px]">
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
        <span className="block text-right [font-family:var(--font-mono)] text-[13px] font-medium text-(--ink-900)">
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
                <p className="[font-family:var(--font-body)] text-[13px] text-(--ink-300)">
                  No invoices yet
                </p>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, idx) => {
              const isOverdue = row.original.status === "OVERDUE";
              return (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer"
                  style={{
                    borderBottom:
                      idx < table.getRowModel().rows.length - 1
                        ? "1px solid var(--border-default)"
                        : "none",
                    backgroundColor: isOverdue
                      ? "rgba(245,58,58,0.025)"
                      : undefined,
                  }}
                  onClick={() => router.push(`/invoices/${row.original.id}`)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      isOverdue
                        ? "rgba(245,58,58,0.05)"
                        : "var(--surface-raised)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      isOverdue ? "rgba(245,58,58,0.025)" : "";
                  }}
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
