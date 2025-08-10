import { useMutation } from "@tanstack/react-query";
import { _uploadFile } from "@/shared/actions/uploads";

// Types for file uploads
type FileUploadType = "businessLogo" | "userSignature";

interface UploadImageData {
  file: File;
  type: FileUploadType;
}

interface UseUploadImageOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

export function useUploadImage(options?: UseUploadImageOptions) {
  const mutation = useMutation({
    mutationFn: async (data: UploadImageData) => {
      // Create FormData for the server action
      const formData = new FormData();
      formData.append("file", data.file);

      const result = await _uploadFile(formData, data.type);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      if (result.data) {
        options?.onSuccess?.(result.data);
      }
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data?.data, // The uploaded image URL
  };
}

// Export types for convenience
export type { UploadImageData, FileUploadType };
