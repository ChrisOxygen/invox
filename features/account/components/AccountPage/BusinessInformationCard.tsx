import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import { FiImage } from "react-icons/fi";
import { HiOutlinePencil } from "react-icons/hi";
import Image from "next/image";

interface Business {
  businessName?: string | null;
  email?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  logo?: string | null;
}

interface BusinessInformationCardProps {
  business?: Business | null;
  isUpdatingBusiness: boolean;
  onEditBusinessInfo: () => void;
  onEditLogo: () => void;
}

export function BusinessInformationCard({
  business,
  isUpdatingBusiness,
  onEditBusinessInfo,
  onEditLogo,
}: BusinessInformationCardProps) {
  return (
    <Card
      className={`xl:col-span-2 border border-blue-100/60 bg-gradient-to-br from-white/95 to-blue-50/20 backdrop-blur-sm shadow-sm transition-opacity duration-200 ${
        isUpdatingBusiness ? "opacity-60" : "opacity-100"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
              <MdOutlineBusinessCenter className="h-4 w-4 text-blue-600" />
            </div>
            Business Information
            {isUpdatingBusiness && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
            )}
          </CardTitle>
          <Button
            onClick={onEditBusinessInfo}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            disabled={isUpdatingBusiness}
          >
            <LuPencilLine className="h-4 w-4 mr-2" />
            {isUpdatingBusiness ? "Updating..." : "Edit"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Business Overview */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
            isUpdatingBusiness ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex gap-3 items-center">
            <div className="size-12 lg:size-14 text-xl lg:text-2xl rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 flex items-center justify-center shadow-sm">
              <MdOutlineBusinessCenter />
            </div>
            <div className="flex flex-col">
              <h4 className="text-base lg:text-lg font-semibold text-gray-900">
                {business?.businessName || "Not provided"}
              </h4>
              <span className="text-xs lg:text-sm text-gray-500">
                Business Name
              </span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="size-12 lg:size-14 text-xl lg:text-2xl rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <MdAlternateEmail />
            </div>
            <div className="flex flex-col">
              <h4 className="text-base lg:text-lg font-semibold text-gray-900">
                {business?.email || "Not provided"}
              </h4>
              <span className="text-xs lg:text-sm text-gray-500">
                Business Email
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information */}
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            isUpdatingBusiness ? "opacity-50" : "opacity-100"
          }`}
        >
          <h4 className="text-lg font-semibold text-gray-900">
            Address & Contact
            {isUpdatingBusiness && (
              <span className="ml-2 text-sm text-blue-600 font-normal">
                Updating...
              </span>
            )}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Address Line 1
              </label>
              <p className="text-gray-900">
                {business?.addressLine1 || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Address Line 2
              </label>
              <p className="text-gray-900">
                {business?.addressLine2 || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                City
              </label>
              <p className="text-gray-900">
                {business?.city || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                State/Province
              </label>
              <p className="text-gray-900">
                {business?.state || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Zip/Postal Code
              </label>
              <p className="text-gray-900">
                {business?.zipCode || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Phone Number
              </label>
              <p className="text-gray-900">
                {business?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Business Logo Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Business Logo</h4>
          <div className="relative w-fit">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onEditLogo}
                  size="sm"
                  variant="outline"
                  className="absolute -top-3 -right-3 size-8 rounded-full p-0 border-2 bg-white hover:bg-gray-50 shadow-sm z-10"
                >
                  <HiOutlinePencil className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit or add logo</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-72 h-32 bg-gradient-to-br from-gray-50 to-blue-50/40 border-2 border-dashed border-blue-200/60 rounded-lg flex flex-col items-center justify-center hover:from-blue-50/30 hover:to-cyan-50/30 transition-all duration-200">
              {business?.logo ? (
                <Image
                  src={business.logo}
                  alt="Business logo"
                  width={300}
                  height={100}
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <>
                  <FiImage className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-sm text-blue-600 font-medium">
                    Add Business Logo
                  </span>
                  <span className="text-xs text-blue-500 mt-1">
                    Upload your company logo
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
