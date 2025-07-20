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
import { Edit, Trash2, Eye } from "lucide-react";
import { Client } from "@prisma/client";
import { formatDate } from "../../utils/clientUtils";

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onView: (client: Client) => void;
  loading?: boolean;
}

export const ClientsTable = ({
  clients,
  onEdit,
  onDelete,
  onView,
  loading = false,
}: ClientsTableProps) => {
  if (loading) {
    return (
      <div className=" bg-white">
        <Table className="shadow-none border-none rounded-none">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-50 hover:to-cyan-50">
              <TableHead className="text-blue-700 font-semibold">
                Name
              </TableHead>
              <TableHead className="text-blue-700 font-semibold">
                Email
              </TableHead>
              <TableHead className="text-blue-700 font-semibold">
                Phone
              </TableHead>
              <TableHead className="text-blue-700 font-semibold">
                Company
              </TableHead>
              <TableHead className="text-blue-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-blue-700 font-semibold">
                Created
              </TableHead>
              <TableHead className="text-blue-700 font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className=" bg-white  overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-50 hover:to-cyan-50">
            <TableHead className="text-blue-700 font-semibold">Name</TableHead>
            <TableHead className="text-blue-700 font-semibold">Email</TableHead>
            <TableHead className="text-blue-700 font-semibold">Phone</TableHead>
            <TableHead className="text-blue-700 font-semibold">
              Company
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              Status
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              Created
            </TableHead>
            <TableHead className="text-blue-700 font-semibold text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="hover:bg-blue-50/50 transition-colors duration-150"
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-gray-900">{client.BusinessName}</span>
                  {client.contactPersonName && (
                    <span className="text-sm text-gray-500">
                      Contact: {client.contactPersonName}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{client.email}</TableCell>
              <TableCell className="text-gray-600">-</TableCell>
              <TableCell className="text-gray-600">
                {client.BusinessName}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200"
                >
                  Active
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDate(client.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(client)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(client)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(client)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
