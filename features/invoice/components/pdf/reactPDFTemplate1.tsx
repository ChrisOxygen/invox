/* eslint-disable jsx-a11y/alt-text */
"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { DUMMY_SENT_INVOICE } from "@/features/invoice/constants/";
import { Client, Invoice, PaymentAccount } from "@prisma/client";
import { UserWithBusiness } from "@/types";
import { validateAndConvertInvoiceItems } from "../../utils";

// Format DUMMY_SENT_INVOICE data for PDF template
const formatInvoiceData = (invoice: typeof DUMMY_SENT_INVOICE) => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    invoiceNumber: invoice.invoiceNumber || "N/A",
    invoiceDate: invoice.invoiceDate ? formatDate(invoice.invoiceDate) : "N/A",
    paymentDueDate: invoice.paymentDueDate
      ? formatDate(invoice.paymentDueDate)
      : "N/A",
    subtotal: formatCurrency(invoice.subtotal || 0),
    tax: formatCurrency(invoice.tax || 0),
    discount: formatCurrency(invoice.discount || 0),
    total: formatCurrency(invoice.total || 0),
    items: invoice.invoiceItems || [],
    customNote: invoice.customNote || "",
    lateFeeTerms: invoice.lateFeeTerms || "",
    // Extract data from related business/client objects
    clientName: invoice.client?.BusinessName || "Client Name",
    clientAddress: invoice.client?.address || "Client Address",
    clientContactPerson: invoice.client?.contactPersonName || "",
    clientEmail: invoice.client?.email || "",
    businessName: invoice.business?.businessName || "Business Name",
    businessEmail: invoice.business?.email || "business@email.com",
    businessAddress:
      [
        invoice.business?.addressLine1,
        invoice.business?.addressLine2,
        invoice.business?.city,
        invoice.business?.state,
        invoice.business?.zipCode,
      ]
        .filter(Boolean)
        .join(", ") || "Business Address",
    businessPhone: invoice.business?.phone || "",
    businessLogo: invoice.business?.logo || "/assets/invox-v-logo.png",
    paymentInfo: {
      gatewayType: invoice.paymentAccount?.gatewayType || "BANK_TRANSFER",
      accountName: invoice.paymentAccount?.accountName || "Payment Account",
      // Handle different gateway types with their specific data structures
      ...(invoice.paymentAccount?.gatewayType === "PAYPAL" && {
        paypalEmail:
          (invoice.paymentAccount?.accountData as any)?.email ||
          "paypal@business.com",
        merchantId:
          (invoice.paymentAccount?.accountData as any)?.merchantId || "",
      }),
      ...(invoice.paymentAccount?.gatewayType === "NIGERIAN_BANK" && {
        bankName:
          (invoice.paymentAccount?.accountData as any)?.bankName || "Bank Name",
        accountNumber:
          (invoice.paymentAccount?.accountData as any)?.accountNumber ||
          "0000000000",
        accountType:
          (invoice.paymentAccount?.accountData as any)?.accountType ||
          "Current",
        sortCode: (invoice.paymentAccount?.accountData as any)?.sortCode || "",
      }),
      ...(invoice.paymentAccount?.gatewayType === "ACH" && {
        bankName:
          (invoice.paymentAccount?.accountData as any)?.bankName || "Bank Name",
        routingNumber:
          (invoice.paymentAccount?.accountData as any)?.routingNumber ||
          "000000000",
        accountNumber:
          (invoice.paymentAccount?.accountData as any)?.accountNumber ||
          "0000000000",
        accountType:
          (invoice.paymentAccount?.accountData as any)?.accountType ||
          "Checking",
      }),
      ...(invoice.paymentAccount?.gatewayType === "WISE" && {
        wiseEmail:
          (invoice.paymentAccount?.accountData as any)?.email ||
          "wise@business.com",
        accountNumber:
          (invoice.paymentAccount?.accountData as any)?.accountNumber || "",
        currency:
          (invoice.paymentAccount?.accountData as any)?.currency || "USD",
      }),
      ...(invoice.paymentAccount?.gatewayType === "BANK_TRANSFER" && {
        bankName:
          (invoice.paymentAccount?.accountData as any)?.bankName || "Bank Name",
        accountNumber:
          (invoice.paymentAccount?.accountData as any)?.accountNumber ||
          "0000000000",
        swiftCode:
          (invoice.paymentAccount?.accountData as any)?.swiftCode || "",
        iban: (invoice.paymentAccount?.accountData as any)?.iban || "",
      }),
      // Fallback for any gateway type
      fallbackInfo: {
        bankName:
          (invoice.paymentAccount?.accountData as any)?.bankName ||
          invoice.paymentAccount?.accountName ||
          "Payment Provider",
        accountNumber:
          (invoice.paymentAccount?.accountData as any)?.accountNumber ||
          (invoice.paymentAccount?.accountData as any)?.email ||
          "Account Details",
      },
    },
  };
};

// first break should happen after the 13th item, second break, and subsiquent breaks should happen after 26 items

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "30px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "70%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 30,
    backgroundColor: "#000",
    color: "#fff",
    letterSpacing: 10,
    textAlign: "center",
    fontWeight: "semibold",
  },
  logoView: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 100,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    objectFit: "contain",
  },
  bodyView: {
    display: "flex",
    flexDirection: "column",
    padding: 30,
    gap: 30,
    marginBottom: 300, // Ensure space for footer
  },
  detailsSectionView: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 40,
  },
  invoiceToView: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "40%",
    gap: 4,
  },
  invoiceDetailsView: {
    display: "flex",
    flexBasis: "40%",
    flexDirection: "column",
    gap: 4,
  },
  invoiceDetailsRowView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  itemsTableView: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  tableHeaderView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableRowContainerView: {
    display: "flex",
    flexDirection: "column",
  },
  tableRowView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  termsAndTotalView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 40,
  },
  termsView: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "40%",
    gap: 20,
  },
  TermsRowView: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  paymentInfoRowView: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  totalView: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "40%",
    gap: 10,
  },
  totalRowView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  footerView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 30,
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#000",
    gap: 10,
  },
});

type ReactPDFTemplateProps = {
  invoice: Invoice;
  client: Client | null;
  userAndBusiness: UserWithBusiness | null;
  paymentAccount: PaymentAccount | null;
};

function ReactPDFTemplate1({
  invoice,
  client,
  userAndBusiness,
  paymentAccount,
}: ReactPDFTemplateProps) {
  const invoiceData = formatInvoiceData(DUMMY_SENT_INVOICE);

  if (!userAndBusiness?.business) {
    return null;
  }

  if (!client) {
    return null;
  }

  const { business } = userAndBusiness;

  const { email, logo, businessName } = business;

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const validatedItems = validateAndConvertInvoiceItems(invoice.invoiceItems);

  if (!validatedItems || validatedItems.length === 0) {
    return null;
  }

  const paypalGateway = (paymentAccount: PaymentAccount) => {
    return (
      <View style={styles.paymentInfoRowView}>
        <Text style={{ fontSize: 13 }}>Account Name:</Text>
        <Text style={{ fontSize: 13 }}>{paymentAccount.accountName}</Text>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text>INVOICE</Text>
          </View>
          {logo && (
            <View style={styles.logoView}>
              <Image style={styles.logo} src={logo} />
            </View>
          )}
        </View>
        <View style={styles.bodyView}>
          <View style={styles.detailsSectionView}>
            <View style={styles.invoiceToView}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Invoice to:
              </Text>
              {client.contactPersonName && (
                <Text
                  style={{
                    fontSize: 13,
                  }}
                >
                  {client.contactPersonName}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {client.BusinessName}
              </Text>
              {client.address && (
                <Text
                  style={{
                    fontSize: 13,
                  }}
                >
                  {client.address}
                </Text>
              )}
            </View>
            <View style={styles.invoiceDetailsView}>
              <View style={styles.invoiceDetailsRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Invoice #
                </Text>
                <Text style={{ fontSize: 13 }}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.invoiceDetailsRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Invoice Date
                </Text>
                <Text style={{ fontSize: 13 }}>
                  {formatDate(invoice.createdAt)}
                </Text>
              </View>
              <View style={styles.invoiceDetailsRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Due Date
                </Text>
                <Text style={{ fontSize: 13 }}>
                  {formatDate(invoice.paymentDueDate!)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.itemsTableView}>
            <View style={styles.tableHeaderView}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  flexBasis: "50%",
                }}
              >
                Item description
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  flexBasis: "20%",
                }}
              >
                Price
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  flexBasis: "10%",
                }}
              >
                Qty.
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "right",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  flexBasis: "20%",
                }}
              >
                Total
              </Text>
            </View>

            {/* Dynamic items rows */}
            <View style={styles.tableRowContainerView}>
              {validatedItems &&
                validatedItems.map((item, index) => {
                  // Determine if this item should trigger a page break
                  const shouldBreak =
                    index === 10 || (index > 10 && (index - 10) % 15 === 0);

                  const notLastItem = index !== invoiceData.items.length - 1;

                  const borderStyle = notLastItem
                    ? { borderBottom: "1px solid #ccc" }
                    : {};

                  return (
                    <View
                      key={index}
                      break={shouldBreak}
                      style={{ ...styles.tableRowView, ...borderStyle }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          flexBasis: "50%",
                          paddingLeft: 5,
                        }}
                      >
                        {item.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "center",
                          flexBasis: "20%",
                        }}
                      >
                        ${item.unitPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "center",
                          flexBasis: "10%",
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "right",
                          paddingRight: 5,
                          flexBasis: "20%",
                        }}
                      >
                        {item.total}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
          <View break style={styles.termsAndTotalView}>
            <View style={styles.termsView}>
              {invoice.lateFeeTerms && (
                <View style={styles.TermsRowView}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "semibold",
                      textTransform: "capitalize",
                    }}
                  >
                    Late Payment Terms:
                  </Text>

                  <Text style={{ fontSize: 12 }}>{invoice.lateFeeTerms}</Text>
                </View>
              )}
              {invoice.customNote && (
                <View style={styles.TermsRowView}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "semibold",
                      textTransform: "capitalize",
                    }}
                  >
                    custom note:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{invoice.customNote}</Text>
                </View>
              )}
              <View
                style={{
                  ...styles.TermsRowView,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    position: "relative",
                    paddingVertical: 5,
                    backgroundColor: "#000",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-50%",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#000",
                      zIndex: -1,
                    }}
                  ></View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "semibold",
                      textTransform: "capitalize",

                      color: "#fff",
                    }}
                  >
                    Payment Info:
                  </Text>
                </View>

                <View style={styles.paymentInfoRowView}>
                  <Text style={{ fontSize: 13 }}>Gateway:</Text>
                  {paymentAccount?.gatewayType && (
                    <Text style={{ fontSize: 13 }}>
                      {paymentAccount.gatewayType}
                    </Text>
                  )}
                </View>
                {paymentAccount?.gatewayType && paypalGateway(paymentAccount)}
              </View>
            </View>
            <View style={styles.totalView}>
              <View style={styles.totalRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textAlign: "right",
                    flexBasis: "60%",
                  }}
                >
                  Subtotal:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "right",
                    fontWeight: "semibold",
                    flexBasis: "40%",
                  }}
                >
                  {invoice.subtotal}
                </Text>
              </View>
              <View style={styles.totalRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textAlign: "right",
                    flexBasis: "60%",
                  }}
                >
                  Tax:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "right",
                    fontWeight: "semibold",
                    flexBasis: "40%",
                  }}
                >
                  {invoice.tax}
                </Text>
              </View>
              <View style={styles.totalRowView}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textAlign: "right",
                    flexBasis: "60%",
                  }}
                >
                  Discount:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "right",
                    fontWeight: "semibold",
                    flexBasis: "40%",
                  }}
                >
                  -{invoice.discount}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#000",
                  width: "100%",
                  height: 1,
                }}
              ></View>
              <View style={styles.totalRowView}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textAlign: "right",
                    flexBasis: "60%",
                  }}
                >
                  Total:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "right",
                    fontWeight: "semibold",
                    flexBasis: "40%",
                  }}
                >
                  {invoice.total}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#000",
                  width: "100%",
                  height: 1,
                }}
              ></View>
            </View>
          </View>
        </View>
        {/* Footer positioned at bottom of page content */}
        <View style={styles.footerView} fixed>
          <Text style={{ fontSize: 13, color: "#fff", fontWeight: "bold" }}>
            {businessName}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#fff",
              paddingLeft: 10,
              borderLeft: "1px solid #fff",
            }}
          >
            {email}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#fff",
              marginLeft: "auto",
            }}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export default ReactPDFTemplate1;
