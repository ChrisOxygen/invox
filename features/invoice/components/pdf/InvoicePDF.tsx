/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { InvoiceFormState } from "../../types/invoiceForm";
import { InvoiceWithRelations } from "@/types/invoice";
import { formatInvoiceData } from "../../utils";

// Register fonts if needed (optional)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
// });

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 60,
    objectFit: "contain",
    marginRight: 10,
  },
  noLogo: {
    width: 100,
    height: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    border: "1 solid #D1D5DB",
    marginRight: 10,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#000000",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  horizontalLine: {
    height: 2,
    backgroundColor: "#000000",
    flex: 1,
    marginRight: 10,
  },
  clientSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientDetails: {
    width: "60%",
  },
  invoiceDetails: {
    width: "35%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 20,
  },
  table: {
    marginTop: 25,
    marginBottom: 20,
    border: "1 solid #D1D5DB",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  col1: { width: "8%", textAlign: "center" },
  col2: { width: "42%", paddingLeft: 20 },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "10%", textAlign: "center", paddingHorizontal: 5 },
  col5: { width: "15%", textAlign: "right" },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  notesSection: {
    width: "55%",
  },
  calculationsSection: {
    width: "40%",
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    paddingHorizontal: 5,
    borderTop: "2 solid #000000",
    fontWeight: "bold",
    fontSize: 12,
  },
  paymentSection: {
    marginTop: 15,
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  signatureSection: {
    marginTop: 60,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 150,
    height: 60,
    objectFit: "contain",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 12,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    borderTop: "2 solid #000000",
    paddingTop: 5,
    width: 150,
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTop: "8 solid #000000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerDivider: {
    borderLeft: "1 solid #D1D5DB",
    paddingLeft: 8,
    marginLeft: 8,
  },
  pageNumber: {
    fontSize: 10,
    color: "#6B7280",
  },
});

interface InvoicePDFProps {
  invoiceData: InvoiceFormState | InvoiceWithRelations;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to split items into pages
const splitItemsIntoPages = (
  items: { description: string; quantity: number; unitPrice: number }[],
  itemsPerPage: number = 25
) => {
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
};

export const InvoicePDF = ({ invoiceData }: InvoicePDFProps) => {
  if (!invoiceData) {
    return null;
  }

  const formattedData = formatInvoiceData(invoiceData);

  const {
    invoiceNumber,
    invoiceDate,
    invoiceDueDate,
    clientName,
    clientBusinessName,
    clientAddress,
    items,
    paymentAccount,
    businessDetails,
    calculations,
    discount,
    tax,
    lateFeeText,
    customNotes,
  } = formattedData;

  const { subtotal, finalTotal } = calculations;
  const { accountData, gatewayType } = paymentAccount || {
    accountData: {},
    gatewayType: "",
  };
  const { businessName, email } = businessDetails || {};

  // Split items into pages if necessary
  const itemPages = splitItemsIntoPages(items);
  const totalPages = itemPages.length;

  return (
    <Document>
      {itemPages.map((pageItems, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header - only on first page */}
          {pageIndex === 0 && (
            <View style={styles.header}>
              {businessDetails?.logo ? (
                <Image style={styles.logo} src={businessDetails.logo} />
              ) : (
                <View style={styles.noLogo}>
                  <Text style={{ fontSize: 8, color: "#6B7280" }}>No Logo</Text>
                </View>
              )}
              <View style={styles.horizontalLine} />
              <Text style={styles.invoiceTitle}>INVOICE</Text>
            </View>
          )}

          {/* Client and Invoice Details - only on first page */}
          {pageIndex === 0 && (
            <View style={styles.clientSection}>
              <Text style={styles.sectionTitle}>Invoice to:</Text>
              <View style={styles.clientInfo}>
                <View style={styles.clientDetails}>
                  <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
                    {clientBusinessName}
                  </Text>
                  <Text style={{ marginBottom: 3 }}>{clientName}</Text>
                  <Text>{clientAddress}</Text>
                </View>
                <View style={styles.invoiceDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Invoice #</Text>
                    <Text>{invoiceNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Invoice Date</Text>
                    <Text>{invoiceDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <Text>{invoiceDueDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Items Table */}
          <View style={styles.table}>
            {/* Table Header - show on every page */}
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, { fontWeight: "bold" }]}>SL.</Text>
              <Text style={[styles.col2, { fontWeight: "bold" }]}>
                Item description
              </Text>
              <Text style={[styles.col3, { fontWeight: "bold" }]}>Price</Text>
              <Text style={[styles.col4, { fontWeight: "bold" }]}>Qty.</Text>
              <Text style={[styles.col5, { fontWeight: "bold" }]}>Total</Text>
            </View>

            {/* Table Rows */}
            {pageItems.map((item, itemIndex) => {
              const globalIndex = pageIndex * 25 + itemIndex;
              const isEven = globalIndex % 2 === 0;
              return (
                <View
                  key={itemIndex}
                  style={isEven ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.col1}>{globalIndex + 1}</Text>
                  <Text style={styles.col2}>{item.description}</Text>
                  <Text style={styles.col3}>
                    {formatCurrency(item.unitPrice)}
                  </Text>
                  <Text style={styles.col4}>{item.quantity}</Text>
                  <Text style={styles.col5}>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Totals Section - only on last page */}
          {pageIndex === totalPages - 1 && (
            <>
              <View style={styles.totalsSection}>
                <View style={styles.notesSection}>
                  {customNotes && (
                    <View style={{ marginBottom: 15 }}>
                      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                        Custom Notes:
                      </Text>
                      <Text>{customNotes}</Text>
                    </View>
                  )}
                  {lateFeeText && (
                    <View>
                      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                        Terms & Conditions:
                      </Text>
                      <Text>{lateFeeText}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.calculationsSection}>
                  <View style={styles.calculationRow}>
                    <Text>Subtotal:</Text>
                    <Text>{formatCurrency(subtotal)}</Text>
                  </View>
                  {tax > 0 && (
                    <View style={styles.calculationRow}>
                      <Text>Tax:</Text>
                      <Text>{formatCurrency(tax)}</Text>
                    </View>
                  )}
                  {discount > 0 && (
                    <View style={styles.calculationRow}>
                      <Text>Discount:</Text>
                      <Text>-{formatCurrency(discount)}</Text>
                    </View>
                  )}
                  <View style={styles.totalRow}>
                    <Text>Total:</Text>
                    <Text>{formatCurrency(finalTotal)}</Text>
                  </View>
                </View>
              </View>

              {/* Payment Information */}
              {paymentAccount && (
                <View style={styles.paymentSection}>
                  <Text style={styles.paymentTitle}>
                    Payment info - {gatewayType}
                  </Text>
                  <View style={styles.paymentRow}>
                    <Text style={{ fontWeight: "bold" }}>Pay to:</Text>
                    <Text>{gatewayType}</Text>
                  </View>
                  {Object.entries(accountData || {}).map(([key, value]) => (
                    <View key={key} style={styles.paymentRow}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </Text>
                      <Text>{String(value)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Signature Section */}
              <View style={styles.signatureSection}>
                {businessDetails?.signature ? (
                  <Image
                    style={styles.signatureImage}
                    src={businessDetails.signature}
                  />
                ) : (
                  <Text style={styles.signatureName}>
                    {businessName || "Business Name"}
                  </Text>
                )}
                <Text style={styles.signatureLabel}>Authorized Signature</Text>
              </View>
            </>
          )}

          {/* Footer - on every page */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              {businessName && (
                <Text style={{ fontWeight: "bold", marginRight: 8 }}>
                  {businessName}
                </Text>
              )}
              {email && <Text style={styles.footerDivider}>{email}</Text>}
            </View>
            {totalPages > 1 && (
              <Text style={styles.pageNumber}>
                Page {pageIndex + 1} of {totalPages}
              </Text>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};
