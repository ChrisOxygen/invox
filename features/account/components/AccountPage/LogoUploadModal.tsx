import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiImage } from "react-icons/fi";
import LogoDropZone from "@/components/LogoDropZone";

interface Business {
  logo?: string | null;
}

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  business?: Business | null;
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
}

export function LogoUploadModal({
  isOpen,
  onClose,
  business,
  onUploadSuccess,
  onUploadError,
}: LogoUploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiImage className="h-5 w-5" />
            {business?.logo ? "Change Business Logo" : "Upload Business Logo"}
          </DialogTitle>
          <DialogDescription>
            {business?.logo
              ? "Update your business logo that appears on invoices and documents."
              : "Add your business logo that will appear on invoices and documents."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <LogoDropZone
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
