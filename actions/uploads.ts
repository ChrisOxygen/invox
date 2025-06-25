"use server";

import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { ApiResponse } from "@/types/api";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Types for file uploads
type FileUploadType = "businessLogo" | "userSignature";

// Accepted file formats
const ACCEPTED_IMAGE_FORMATS = ["webp", "jpg", "png", "jpeg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

// Helper function to get file extension
function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// Helper function to create filename from business name
function createBusinessLogoFilename(businessName: string): string {
  return (
    businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, "") + // Remove leading/trailing hyphens
    "-logo"
  );
}

// Helper function to delete existing file from Cloudinary
async function _deleteExistingFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Don't throw error if file doesn't exist, just log it
    console.log("File not found in Cloudinary or deletion failed:", error);
  }
}

export async function _uploadFile(
  formData: FormData,
  type: FileUploadType
): Promise<ApiResponse<string>> {
  try {
    // Check if user is logged in
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get the file from FormData
    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    // Check file size (3MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "File size must be less than 3MB",
      };
    }

    // Check file format
    const fileExtension = getFileExtension(file.name);
    if (!ACCEPTED_IMAGE_FORMATS.includes(fileExtension)) {
      return {
        success: false,
        message:
          "File format not supported. Please use webp, jpg, png, or jpeg",
      };
    }

    // Handle business logo upload
    if (type === "businessLogo") {
      // Get user's business
      const userWithBusiness = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { business: true },
      });

      if (!userWithBusiness?.business) {
        return {
          success: false,
          message: "No business found for this user",
        };
      }

      const business = userWithBusiness.business;

      // Create filename from business name
      const filename = createBusinessLogoFilename(business.businessName);
      const publicId = `business-logos/${filename}`; // Delete existing logo if it exists
      if (business.logo) {
        await _deleteExistingFile(publicId);
      } // Convert file to buffer for Cloudinary upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // create image path
      const imagePath = `data:${file.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary using the simpler upload method
      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
        public_id: publicId,
        folder: "business-logos",
      });

      // Update business logo in database
      await prisma.business.update({
        where: { id: business.id },
        data: { logo: uploadResult.secure_url },
      });

      return {
        success: true,
        message: "Business logo uploaded successfully",
        data: uploadResult.secure_url,
      };
    }

    // Handle user signature upload (placeholder for future implementation)
    if (type === "userSignature") {
      return {
        success: false,
        message: "User signature upload not yet implemented",
      };
    }

    return {
      success: false,
      message: "Invalid upload type",
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      message: "Failed to upload file. Please try again.",
    };
  } finally {
    await prisma.$disconnect();
  }
}
