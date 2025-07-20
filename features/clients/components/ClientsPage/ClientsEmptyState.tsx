import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientsEmptyStateProps {
  onCreateClient: () => void;
}

export const ClientsEmptyState = ({
  onCreateClient,
}: ClientsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-blue-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No clients found
      </h3>

      <p className="text-gray-500 mb-6 max-w-sm">
        You haven&apos;t added any clients yet. Start by creating your first
        client to manage your business relationships.
      </p>

      <Button
        onClick={onCreateClient}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Client
      </Button>
    </div>
  );
};
