import { toast } from "sonner";
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";
import { InfoToast } from "./InfoToast";
import { WarningToast } from "./WarningToast";
import { LoadingToast } from "./LoadingToast";

// Success Toast
export const showSuccessToast = (title?: string, description?: string) => {
  return toast.custom(
    () => <SuccessToast title={title} description={description} />,
    {
      unstyled: true,
      duration: 5000,
    }
  );
};

// Error Toast
export const showErrorToast = (title?: string, description?: string) => {
  return toast.custom(
    () => <ErrorToast title={title} description={description} />,
    {
      unstyled: true,
      duration: 6000, // Longer duration for errors
    }
  );
};

// Info Toast
export const showInfoToast = (title?: string, description?: string) => {
  return toast.custom(
    () => <InfoToast title={title} description={description} />,
    {
      unstyled: true,
      duration: 4000,
    }
  );
};

// Warning Toast
export const showWarningToast = (title?: string, description?: string) => {
  return toast.custom(
    () => <WarningToast title={title} description={description} />,
    {
      unstyled: true,
      duration: 5000,
    }
  );
};

// Loading Toast
export const showLoadingToast = (title?: string, description?: string) => {
  return toast.custom(
    () => <LoadingToast title={title} description={description} />,
    {
      unstyled: true,
      duration: Infinity, // Loading toasts should persist until manually dismissed
    }
  );
};

// Advanced versions with additional options
interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export const showCustomSuccessToast = (
  title?: string,
  description?: string,
  options?: ToastOptions
) => {
  return toast.custom(
    (t) => (
      <div className="relative">
        <SuccessToast title={title} description={description} />
        {/* Optional action button */}
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              toast.dismiss(t);
            }}
            className="absolute top-2 right-12 text-xs text-green-600 hover:text-green-700 font-medium"
          >
            {options.action.label}
          </button>
        )}
        {/* Custom close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    ),
    {
      unstyled: true,
      duration: options?.duration || 5000,
      onDismiss: options?.onDismiss,
    }
  );
};

export const showCustomErrorToast = (
  title?: string,
  description?: string,
  options?: ToastOptions
) => {
  return toast.custom(
    (t) => (
      <div className="relative">
        <ErrorToast title={title} description={description} />
        {/* Optional action button */}
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              toast.dismiss(t);
            }}
            className="absolute top-2 right-12 text-xs text-red-600 hover:text-red-700 font-medium"
          >
            {options.action.label}
          </button>
        )}
        {/* Custom close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    ),
    {
      unstyled: true,
      duration: options?.duration || 6000,
      onDismiss: options?.onDismiss,
    }
  );
};

export const showCustomInfoToast = (
  title?: string,
  description?: string,
  options?: ToastOptions
) => {
  return toast.custom(
    (t) => (
      <div className="relative">
        <InfoToast title={title} description={description} />
        {/* Optional action button */}
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              toast.dismiss(t);
            }}
            className="absolute top-2 right-12 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {options.action.label}
          </button>
        )}
        {/* Custom close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    ),
    {
      unstyled: true,
      duration: options?.duration || 4000,
      onDismiss: options?.onDismiss,
    }
  );
};

export const showCustomWarningToast = (
  title?: string,
  description?: string,
  options?: ToastOptions
) => {
  return toast.custom(
    (t) => (
      <div className="relative">
        <WarningToast title={title} description={description} />
        {/* Optional action button */}
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              toast.dismiss(t);
            }}
            className="absolute top-2 right-12 text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            {options.action.label}
          </button>
        )}
        {/* Custom close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    ),
    {
      unstyled: true,
      duration: options?.duration || 5000,
      onDismiss: options?.onDismiss,
    }
  );
};

export const showCustomLoadingToast = (
  title?: string,
  description?: string,
  options?: Omit<ToastOptions, "duration"> // Loading toasts shouldn't have custom duration
) => {
  return toast.custom(
    (t) => (
      <div className="relative">
        <LoadingToast title={title} description={description} />
        {/* Optional action button */}
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              toast.dismiss(t);
            }}
            className="absolute top-2 right-12 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {options.action.label}
          </button>
        )}
        {/* Custom close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    ),
    {
      unstyled: true,
      duration: Infinity,
      onDismiss: options?.onDismiss,
    }
  );
};
