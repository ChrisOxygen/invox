import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";
import SignatureDropZone from "@/components/SignatureDropZone";

interface User {
  signature?: string | null;
}

interface SignatureUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
}

export function SignatureUploadModal({
  isOpen,
  onClose,
  user,
  onUploadSuccess,
  onUploadError,
}: SignatureUploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiEdit3 className="h-5 w-5" />
            {user.signature ? "Change Your Signature" : "Upload Your Signature"}
          </DialogTitle>
          <DialogDescription>
            {user.signature
              ? "Update your signature that appears on invoices and documents."
              : "Add your signature that will appear on invoices and documents."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <SignatureDropZone
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
