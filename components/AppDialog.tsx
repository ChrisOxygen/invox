import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  onClose?: () => void;
}

const AppDialog: React.FC<AppDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  maxWidth = "lg",
  onClose,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
  };

  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          ${maxWidthClasses[maxWidth]} 
          bg-white border-gray-200 shadow-lg
          font-inter
        `}
      >
        {/* Custom Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}

        {/* Header - Always present for accessibility */}
        <DialogHeader
          className={title || description ? "space-y-3" : "sr-only"}
        >
          {/* Title is always present for accessibility, but hidden if not provided */}
          <DialogTitle
            className={
              title
                ? "font-space-grotesk text-xl font-semibold text-gray-900 leading-tight"
                : "sr-only"
            }
          >
            {title || "Dialog"}
          </DialogTitle>

          {description && (
            <DialogDescription className="font-inter text-sm text-gray-600 leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
