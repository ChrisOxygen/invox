import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ClientsLoadingStateProps {
  view?: "table" | "grid";
}

export const ClientsLoadingState = ({
  view = "table",
}: ClientsLoadingStateProps) => {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="border-blue-200 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-1/3" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-white shadow-sm">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="grid grid-cols-7 gap-4">
          {[
            "Name",
            "Email",
            "Phone",
            "Company",
            "Status",
            "Created",
            "Actions",
          ].map((header) => (
            <Skeleton key={header} className="h-4 w-full" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
