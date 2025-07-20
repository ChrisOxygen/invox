import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientsErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ClientsErrorState = ({
  error,
  onRetry,
}: ClientsErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="max-w-md p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">
            {error || "Something went wrong while loading clients."}
          </p>
        </div>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
