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

import { Client, Invoice, PaymentAccount } from "@prisma/client";
import { UserWithBusiness } from "@/types";
import { ColorTheme, getThemeColors } from "@/constants";
import {
  validateAndConvertInvoiceItems,
  extractPaymentAccountDisplayData,
  formatDate,
  formatCurrency,
} from "../../utils";

// Function to create theme-based styles
const createThemedStyles = (theme: ColorTheme = "classic") => {
  const colors = getThemeColors(theme);

  return StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
      paddingTop: "30px",
      backgroundColor: colors.background,
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
      backgroundColor: colors.primary,
      color: colors.background,
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
      backgroundColor: colors.accent,
      paddingVertical: 8,
      paddingHorizontal: 5,
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
      color: colors.background,
      backgroundColor: colors.primary,
      gap: 10,
    },
    // Text styles with theme colors
    sectionTitle: {
      fontSize: 13,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: 5,
      color: colors.primary,
    },
    clientText: {
      fontSize: 13,
      color: colors.text,
    },
    clientBusinessName: {
      fontSize: 13,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.text,
    },
    invoiceLabel: {
      fontSize: 13,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.primary,
    },
    invoiceValue: {
      fontSize: 13,
      color: colors.text,
    },
    tableHeader: {
      fontSize: 16,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.primary,
    },
    itemDescription: {
      fontSize: 13,
      flexBasis: "50%",
      paddingLeft: 5,
      color: colors.text,
    },
    itemPrice: {
      fontSize: 13,
      textAlign: "center",
      flexBasis: "20%",
      color: colors.text,
    },
    itemQuantity: {
      fontSize: 13,
      textAlign: "center",
      flexBasis: "10%",
      color: colors.text,
    },
    itemTotal: {
      fontSize: 13,
      textAlign: "right",
      paddingRight: 5,
      flexBasis: "20%",
      color: colors.text,
    },
    termsTitle: {
      fontSize: 13,
      fontWeight: "semibold",
      textTransform: "capitalize",
      color: colors.primary,
    },
    termsText: {
      fontSize: 12,
      color: colors.textLight,
    },
    paymentInfoHeader: {
      position: "relative",
      paddingVertical: 5,
      backgroundColor: colors.primary,
    },
    paymentInfoTitle: {
      fontSize: 12,
      fontWeight: "semibold",
      textTransform: "capitalize",
      color: colors.background,
    },
    paymentInfoText: {
      fontSize: 13,
      color: colors.text,
    },
    totalLabel: {
      fontSize: 13,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "right",
      flexBasis: "60%",
      color: colors.primary,
    },
    totalValue: {
      fontSize: 13,
      textAlign: "right",
      fontWeight: "semibold",
      flexBasis: "40%",
      color: colors.text,
    },
    grandTotalLabel: {
      fontSize: 15,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "right",
      flexBasis: "60%",
      color: colors.primary,
    },
    grandTotalValue: {
      fontSize: 15,
      textAlign: "right",
      fontWeight: "semibold",
      flexBasis: "40%",
      color: colors.primary,
    },
    divider: {
      backgroundColor: colors.primary,
      width: "100%",
      height: 1,
    },
    itemBorder: {
      borderBottom: `1px solid ${colors.border}`,
    },
    footerText: {
      fontSize: 13,
      color: colors.background,
      fontWeight: "bold",
    },
    footerEmail: {
      fontSize: 13,
      color: colors.background,
      paddingLeft: 10,
      borderLeft: `1px solid ${colors.background}`,
    },
    footerPageNumber: {
      fontSize: 13,
      color: colors.background,
      marginLeft: "auto",
    },
  });
};

type ReactPDFTemplateProps = {
  invoice: Invoice;
  client: Client | null;
  userAndBusiness: UserWithBusiness | null;
  paymentAccount: PaymentAccount | null;
  theme?: ColorTheme;
};

function ReactPDFTemplate1({
  invoice,
  client,
  userAndBusiness,
  paymentAccount,
  theme = "classic",
}: ReactPDFTemplateProps) {
  if (!userAndBusiness?.business) {
    return null;
  }

  if (!client) {
    return null;
  }

  // Generate theme-based styles
  const styles = createThemedStyles(theme);
  const colors = getThemeColors(theme);

  const { business } = userAndBusiness;
  const { email, logo, businessName } = business;

  const validatedItems = validateAndConvertInvoiceItems(invoice.invoiceItems);

  if (!validatedItems || validatedItems.length === 0) {
    return null;
  }

  // Calculate totals from validated items, with fallback to stored values
  const calculatedSubtotal = validatedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const subtotal = invoice.subtotal ?? calculatedSubtotal;
  const taxAmount = invoice.tax ?? 0;
  const discountAmount = invoice.discount ?? 0;
  const finalTotal = invoice.total ?? subtotal + taxAmount - discountAmount;

  const renderPaymentAccountData = (paymentAccount: PaymentAccount) => {
    if (!paymentAccount.gatewayType || !paymentAccount.accountData) {
      return (
        <View style={styles.paymentInfoRowView}>
          <Text style={styles.paymentInfoText}>Account Name:</Text>
          <Text style={styles.paymentInfoText}>
            {paymentAccount.accountName}
          </Text>
        </View>
      );
    }

    const displayData = extractPaymentAccountDisplayData(
      paymentAccount.gatewayType,
      paymentAccount.accountData
    );

    // If there's an error in validation, show basic info
    if (displayData.error) {
      return (
        <>
          <View style={styles.paymentInfoRowView}>
            <Text style={styles.paymentInfoText}>Account Name:</Text>
            <Text style={styles.paymentInfoText}>
              {paymentAccount.accountName}
            </Text>
          </View>
          <View style={styles.paymentInfoRowView}>
            <Text style={{ fontSize: 11, color: colors.textLight }}>
              Data validation error
            </Text>
          </View>
        </>
      );
    }

    // Render validated account data
    return (
      <>
        <View style={styles.paymentInfoRowView}>
          <Text style={styles.paymentInfoText}>Account Name:</Text>
          <Text style={styles.paymentInfoText}>
            {paymentAccount.accountName}
          </Text>
        </View>
        {Object.entries(displayData).map(([key, value], index) => (
          <View key={index} style={styles.paymentInfoRowView}>
            <Text style={styles.paymentInfoText}>{key}:</Text>
            <Text style={styles.paymentInfoText}>{value}</Text>
          </View>
        ))}
      </>
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
              <Text style={styles.sectionTitle}>Invoice to:</Text>
              {client.contactPersonName && (
                <Text style={styles.clientText}>
                  {client.contactPersonName}
                </Text>
              )}
              <Text style={styles.clientBusinessName}>
                {client.BusinessName}
              </Text>
              {client.address && (
                <Text style={styles.clientText}>{client.address}</Text>
              )}
            </View>
            <View style={styles.invoiceDetailsView}>
              <View style={styles.invoiceDetailsRowView}>
                <Text style={styles.invoiceLabel}>Invoice #</Text>
                <Text style={styles.invoiceValue}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.invoiceDetailsRowView}>
                <Text style={styles.invoiceLabel}>Invoice Date</Text>
                <Text style={styles.invoiceValue}>
                  {formatDate(invoice.createdAt)}
                </Text>
              </View>
              <View style={styles.invoiceDetailsRowView}>
                <Text style={styles.invoiceLabel}>Due Date</Text>
                <Text style={styles.invoiceValue}>
                  {formatDate(invoice.paymentDueDate!)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.itemsTableView}>
            <View style={styles.tableHeaderView}>
              <Text
                style={{
                  ...styles.tableHeader,
                  flexBasis: "50%",
                }}
              >
                Item description
              </Text>
              <Text
                style={{
                  ...styles.tableHeader,
                  textAlign: "center",
                  flexBasis: "20%",
                }}
              >
                Price
              </Text>
              <Text
                style={{
                  ...styles.tableHeader,
                  textAlign: "center",
                  flexBasis: "10%",
                }}
              >
                Qty.
              </Text>
              <Text
                style={{
                  ...styles.tableHeader,
                  textAlign: "right",
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

                  const notLastItem = index !== validatedItems.length - 1;

                  const borderStyle = notLastItem ? styles.itemBorder : {};

                  return (
                    <View
                      key={index}
                      break={shouldBreak}
                      style={{ ...styles.tableRowView, ...borderStyle }}
                    >
                      <Text style={styles.itemDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.unitPrice)}
                      </Text>
                      <Text style={styles.itemQuantity}>{item.quantity}</Text>
                      <Text style={styles.itemTotal}>
                        {formatCurrency(item.total)}
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
                  <Text style={styles.termsTitle}>Late Payment Terms:</Text>
                  <Text style={styles.termsText}>{invoice.lateFeeTerms}</Text>
                </View>
              )}
              {invoice.customNote && (
                <View style={styles.TermsRowView}>
                  <Text style={styles.termsTitle}>custom note:</Text>
                  <Text style={styles.termsText}>{invoice.customNote}</Text>
                </View>
              )}
              <View
                style={{
                  ...styles.TermsRowView,
                  marginTop: 20,
                }}
              >
                <View style={styles.paymentInfoHeader}>
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
                  <Text style={styles.paymentInfoTitle}>Payment Info:</Text>
                </View>

                <View style={styles.paymentInfoRowView}>
                  <Text style={styles.paymentInfoText}>Gateway:</Text>
                  {paymentAccount?.gatewayType && (
                    <Text style={styles.paymentInfoText}>
                      {paymentAccount.gatewayType}
                    </Text>
                  )}
                </View>
                {paymentAccount && renderPaymentAccountData(paymentAccount)}
              </View>
            </View>
            <View style={styles.totalView}>
              <View style={styles.totalRowView}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
              <View style={styles.totalRowView}>
                <Text style={styles.totalLabel}>Tax:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(taxAmount)}
                </Text>
              </View>
              <View style={styles.totalRowView}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.totalValue}>
                  -{formatCurrency(discountAmount)}
                </Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.totalRowView}>
                <Text style={styles.grandTotalLabel}>Total:</Text>
                <Text style={styles.grandTotalValue}>
                  {formatCurrency(finalTotal)}
                </Text>
              </View>
              <View style={styles.divider}></View>
            </View>
          </View>
        </View>
        {/* Footer positioned at bottom of page content */}
        <View style={styles.footerView} fixed>
          <Text style={styles.footerText}>{businessName}</Text>
          <Text style={styles.footerEmail}>{email}</Text>
          <Text
            style={styles.footerPageNumber}
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
