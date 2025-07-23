import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuPencilLine } from "react-icons/lu";
import { RiPaypalLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { SiStripe } from "react-icons/si";
import { VscCreditCard } from "react-icons/vsc";

interface PaymentAccount {
  id: string;
  gatewayType: string;
  accountName: string;
  isActive: boolean;
  accountData?: Record<string, unknown> | null;
}

interface PaymentInformationCardProps {
  paymentAccounts: PaymentAccount[];
  defaultPaymentAccount?: PaymentAccount;
  isLoadingPaymentAccounts: boolean;
  isUpdatingPaymentAccount: boolean;
  onEditPaymentInfo: () => void;
  onConnectGateway: () => void;
}

export function PaymentInformationCard({
  paymentAccounts,
  defaultPaymentAccount,
  isLoadingPaymentAccounts,
  isUpdatingPaymentAccount,
  onEditPaymentInfo,
  onConnectGateway,
}: PaymentInformationCardProps) {
  return (
    <Card
      className={`border border-blue-100/60 h-max bg-gradient-to-br from-white/95 to-cyan-50/20 backdrop-blur-sm shadow-sm transition-opacity duration-200 ${
        isUpdatingPaymentAccount ? "opacity-60" : "opacity-100"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100">
              <VscCreditCard className="h-4 w-4 text-blue-600" />
            </div>
            Payment Information
            {isUpdatingPaymentAccount && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
            )}
          </CardTitle>
          <Button
            onClick={onEditPaymentInfo}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            disabled={
              isUpdatingPaymentAccount ||
              paymentAccounts.length === 0 ||
              !defaultPaymentAccount
            }
          >
            <LuPencilLine className="h-4 w-4 mr-2" />
            {isUpdatingPaymentAccount ? "Updating..." : "Edit"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoadingPaymentAccounts ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading payment accounts...</p>
          </div>
        ) : paymentAccounts.length === 0 ? (
          <div className="text-center py-8">
            <VscCreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Payment Accounts
            </h3>
            <p className="text-gray-500 mb-4">
              Set up a payment account to receive payments from clients.
            </p>
            <Button
              onClick={onConnectGateway}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            >
              Add Payment Account
            </Button>
          </div>
        ) : defaultPaymentAccount ? (
          <>
            {/* Payment Gateway Overview */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="size-12 lg:size-14 text-xl lg:text-2xl rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 flex items-center justify-center shadow-sm">
                  {defaultPaymentAccount.gatewayType === "stripe" ? (
                    <SiStripe />
                  ) : (
                    <RiPaypalLine />
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-base lg:text-lg font-semibold text-gray-900">
                    {defaultPaymentAccount.gatewayType === "stripe"
                      ? "Stripe"
                      : defaultPaymentAccount.gatewayType === "paypal"
                      ? "PayPal"
                      : defaultPaymentAccount.gatewayType
                          .charAt(0)
                          .toUpperCase() +
                        defaultPaymentAccount.gatewayType.slice(1)}
                  </h4>
                  <span className="text-xs lg:text-sm text-gray-500">
                    Payment Gateway
                  </span>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 font-semibold border-green-200 shadow-sm">
                {defaultPaymentAccount.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <Separator />

            {/* Account Details */}
            <div
              className={`space-y-4 transition-opacity duration-200 ${
                isUpdatingPaymentAccount ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Account Name
                  {isUpdatingPaymentAccount && (
                    <span className="ml-2 text-xs text-blue-600 font-normal normal-case">
                      Updating...
                    </span>
                  )}
                </label>
                <p className="text-gray-900">
                  {defaultPaymentAccount.accountName}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Account Details
                </label>
                <div className="space-y-1">
                  {Object.entries(defaultPaymentAccount.accountData || {}).map(
                    ([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-gray-600 capitalize">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </span>
                        <span className="text-gray-900 ml-2">
                          {key.toLowerCase().includes("secret") ||
                          key.toLowerCase().includes("key")
                            ? "••••••••••••••••••••••••••••••"
                            : (value as string)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Connect Another Gateway */}
            <Button
              onClick={onConnectGateway}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-md transition-all duration-200"
            >
              <FiUpload className="h-4 w-4 mr-2" />
              Connect Another Gateway
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No default payment account found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
