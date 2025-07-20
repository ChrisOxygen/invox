import { Skeleton } from "@/components/ui/skeleton";

export const ItemsLoadingState = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-blue-100 rounded-xl shadow-sm">
        <div className="border-b border-blue-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-4 w-20 bg-blue-100" />
            <Skeleton className="h-4 w-24 bg-blue-100" />
            <Skeleton className="h-4 w-16 bg-blue-100" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 border-b border-blue-50 last:border-b-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-4 w-32 bg-blue-100" />
              <Skeleton className="h-4 w-20 bg-blue-100" />
              <Skeleton className="h-4 w-8 bg-blue-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
