import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientsHeaderProps {
  onCreateClient: () => void;
}

export const ClientsHeader = ({ onCreateClient }: ClientsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Clients
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your client information and contacts
        </p>
      </div>
      <Button
        onClick={onCreateClient}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Client
      </Button>
    </div>
  );
};
