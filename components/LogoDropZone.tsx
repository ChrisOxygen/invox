import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { FiUpload, FiImage, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/images/useUploadImage";
import { toast } from "sonner";
import Image from "next/image";

interface LogoDropZoneProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

function LogoDropZone({ onUploadSuccess, onUploadError }: LogoDropZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadImage = useUploadImage({
    onSuccess: (imageUrl) => {
      toast.success("Logo uploaded successfully!");
      onUploadSuccess?.(imageUrl);
      // Reset the component
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error) => {
      toast.error(error);
      onUploadError?.(error);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors?.some((e) => e.code === "file-too-large")) {
          toast.error("File size must be less than 3MB");
        } else if (
          rejection.errors?.some((e) => e.code === "file-invalid-type")
        ) {
          toast.error("Only JPG, PNG, and WebP files are supported");
        } else {
          toast.error("Invalid file. Please try again.");
        }
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadImage.mutate({
      file: selectedFile,
      type: "businessLogo",
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // If a file is selected, show the preview
  if (selectedFile && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
          <Button
            onClick={handleRemoveFile}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white shadow-sm hover:bg-gray-100"
          >
            <FiX className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center space-y-3">
            <div className="relative max-h-32 max-w-full">
              <Image
                src={previewUrl}
                alt="Logo preview"
                width={200}
                height={128}
                className="object-contain rounded-lg"
                style={{ maxHeight: "128px", width: "auto" }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploadImage.isPending}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {uploadImage.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <FiUpload className="h-4 w-4 mr-2" />
              Upload Logo
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "border-2 rounded-xl shadow-none min-h-[200px] grid place-items-center p-6 cursor-pointer transition-colors",
        isDragActive
          ? "bg-gray-100 border-gray-400 border-solid"
          : "border-gray-300 border-dashed hover:border-gray-400 hover:bg-gray-50"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <FiImage className="h-6 w-6 text-gray-400" />
        </div>

        <div className="space-y-2">
          {isDragActive ? (
            <p className="text-lg font-medium text-gray-700">
              Drop your logo here
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900">
                Drop your business logo here
              </p>
              <p className="text-sm text-gray-500">
                or{" "}
                <span className="font-medium text-black underline">
                  click to browse
                </span>
              </p>
            </>
          )}

          <div className="text-xs text-gray-400 space-y-1">
            <p>Supports: JPG, PNG, WebP</p>
            <p>Maximum size: 3MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoDropZone;
