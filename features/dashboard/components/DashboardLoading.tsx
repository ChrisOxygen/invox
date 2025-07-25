/**
 * Dashboard Loading Component
 * Shows skeleton loading state that mimics the actual dashboard layout
 */

import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLoadingProps {
  className?: string;
}

export function DashboardLoading({ className }: DashboardLoadingProps) {
  return (
    <div
      className={`h-full grid gap-6 grid-rows-[auto_auto_1fr_1fr] lg:grid-rows-[80px_140px_380px_1fr] ${
        className || ""
      }`}
    >
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4 sm:gap-0">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <Skeleton className="h-8 sm:h-10 lg:h-12 w-80 max-w-full bg-gradient-to-r from-blue-100 to-cyan-100" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-11 flex-1 sm:w-32" />
          <Skeleton className="h-11 flex-1 sm:w-32" />
        </div>
      </div>

      {/* Stats Cards Section Skeleton */}
      <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 bg-green-100" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 lg:h-10 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main Chart Skeleton */}
        <div className="flex-1 lg:flex-[2] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm">
          <div className="h-full flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-8 bg-gradient-to-t from-blue-200 to-cyan-200"
                  style={{
                    height: `${Math.random() * 60 + 40}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Radial Chart Skeleton */}
        <div className="flex-1 lg:flex-[1] bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm">
          <div className="h-full flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <Skeleton className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200" />
                <Skeleton className="w-20 h-20 rounded-full bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table Skeleton */}
      <div className="w-full bg-white border-2 border-blue-100 rounded-xl shadow-sm">
        <div className="p-4 lg:p-6 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="p-2 lg:p-4">
          <div className="space-y-3">
            {/* Table Header Skeleton */}
            <div className="hidden md:flex items-center gap-4 px-4 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Table Rows Skeleton */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-4 py-3 border border-gray-100 rounded-lg"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2 md:ml-auto">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
