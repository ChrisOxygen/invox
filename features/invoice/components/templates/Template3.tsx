"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

/* eslint-disable jsx-a11y/alt-text */

// Define custom FormattedInvoiceData interface to match our sample data
interface FormattedInvoiceData {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  clientName: string;
  clientBusinessName: string;
  clientAddress: string;
  clientEmail: string;
  items: Array<{
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  tax: number;
  discount: number;
  customNotes: string;
  lateFeeText: string;
  businessDetails: {
    businessName: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  paymentAccount: {
    accountName: string;
    gatewayType: string;
    accountData: Record<string, string | number | boolean>;
  } | null;
  calculations: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    finalTotal: number;
  };
}

// Define interface for the invoice template data
interface InvoiceTemplateData {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  clientName: string;
  clientBusinessName: string;
  clientAddress: string;
  items: Array<{
    id: string | number;
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  paymentAccount?: {
    accountData: Record<string, string | number | boolean>;
    gatewayType: string;
  } | null;
  businessDetails?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  calculations: {
    subtotal: number;
    finalTotal: number;
  };
  discount: number;
  tax: number;
  lateFeeText?: string;
  customNotes?: string;
  logo?: string | null;
  signature?: string | null;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#677782",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1pt solid #E5E7EB",
  },
  headerLogo: {
    width: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#677782",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCompany: {
    width: "50%",
  },
  infoInvoice: {
    width: "40%",
    backgroundColor: "#F9FAFB",
    padding: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  value: {
    marginBottom: 3,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
  },
  tableCol1: { width: "5%", textAlign: "center" },
  tableCol2: { width: "45%" },
  tableCol3: { width: "15%", textAlign: "right" },
  tableCol4: { width: "15%", textAlign: "center" },
  tableCol5: { width: "20%", textAlign: "right" },
  tableCellHeader: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  tableCell: {
    color: "#6B7280",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderTopStyle: "solid",
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 8,
  },
  paymentInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  totals: {
    width: "40%",
    alignSelf: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontWeight: "bold",
    marginTop: 5,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#9CA3AF",
    borderTopStyle: "solid",
    width: 150,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 8,
    textAlign: "center",
  },
  notes: {
    marginTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    fontSize: 9,
  },
  terms: {
    marginTop: 10,
    fontSize: 9,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Invoice Template Component
const InvoiceTemplate: React.FC<{ data: InvoiceTemplateData }> = ({ data }) => {
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
    logo,
    signature,
  } = data;

  const { subtotal, finalTotal } = calculations;
  const { accountData, gatewayType } = paymentAccount || {
    accountData: {},
    gatewayType: "",
  };
  const { email, phone, address } = businessDetails || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          {logo && (
            <View style={styles.headerLogo}>
              <Image src={logo} />
            </View>
          )}
          <Text style={styles.headerTitle}>INVOICE</Text>
        </View>

        {/* Business & Client Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCompany}>
            {address && (
              <>
                <Text style={styles.label}>From:</Text>
                <Text style={styles.value}>{address}</Text>
              </>
            )}

            {clientBusinessName && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>To:</Text>
                <Text style={styles.value}>{clientBusinessName}</Text>
                {clientName && <Text style={styles.value}>{clientName}</Text>}
                {clientAddress && (
                  <Text style={styles.value}>{clientAddress}</Text>
                )}
              </>
            )}
          </View>

          <View style={styles.infoInvoice}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice #:</Text>
              <Text>{invoiceNumber || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text>{invoiceDate || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Due Date:</Text>
              <Text>{invoiceDueDate || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol1, styles.tableCellHeader]}>No.</Text>
            <Text style={[styles.tableCol2, styles.tableCellHeader]}>
              Description
            </Text>
            <Text style={[styles.tableCol3, styles.tableCellHeader]}>
              Unit Price
            </Text>
            <Text style={[styles.tableCol4, styles.tableCellHeader]}>
              Quantity
            </Text>
            <Text style={[styles.tableCol5, styles.tableCellHeader]}>
              Amount
            </Text>
          </View>

          {items &&
            items.map((item, index) => (
              <View key={`item-${index}`} style={styles.tableRow}>
                <Text style={[styles.tableCol1, styles.tableCell]}>
                  {index + 1}
                </Text>
                <Text style={[styles.tableCol2, styles.tableCell]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCol3, styles.tableCell]}>
                  ${item.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.tableCol4, styles.tableCell]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCol5, styles.tableCell]}>
                  ${item.total.toFixed(2)}
                </Text>
              </View>
            ))}
        </View>

        {/* Totals Section */}
        <View style={styles.flexRow}>
          {/* Payment Information and Notes */}
          <View style={{ width: "55%" }}>
            {customNotes && (
              <View style={styles.notes}>
                <Text style={styles.label}>Notes:</Text>
                <Text>{customNotes}</Text>
              </View>
            )}

            {lateFeeText && (
              <View style={styles.terms}>
                <Text style={styles.label}>Terms:</Text>
                <Text>Late payment fee: {lateFeeText}</Text>
              </View>
            )}

            {gatewayType && (
              <View style={styles.paymentInfo}>
                <Text style={styles.label}>Payment Information:</Text>
                <Text>Method: {gatewayType}</Text>

                {accountData &&
                  Object.entries(accountData).map(([key, value], index) => (
                    <Text key={`payment-${index}`}>
                      {key}: {String(value)}
                    </Text>
                  ))}
              </View>
            )}
          </View>

          {/* Totals */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.label}>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </View>

            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.label}>Tax:</Text>
                <Text>${tax.toFixed(2)}</Text>
              </View>
            )}

            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.label}>Discount:</Text>
                <Text>-${discount.toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.totalFinal}>
              <Text>Total Due:</Text>
              <Text>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Signature Section - Optional */}
        {signature && (
          <View style={styles.signatureSection}>
            <View>
              <View style={styles.signatureLine}>
                {signature && <Image src={signature} />}
              </View>
              <Text style={styles.signatureText}>Authorized Signature</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            {email && <Text style={styles.footerText}>Email: {email}</Text>}
            {phone && <Text style={styles.footerText}>Phone: {phone}</Text>}
          </View>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

// Define the props interface for Template3
interface Template3Props {
  invoiceData?: FormattedInvoiceData;
}

function Template3({ invoiceData }: Template3Props) {
  // Use provided invoice data or create a sample one for demonstration
  const formattedData = invoiceData || {
    invoiceId: "INV-001",
    invoiceNumber: "INV-001",
    invoiceDate: "June 29, 2025",
    invoiceDueDate: "July 29, 2025",
    clientName: "John Doe",
    clientBusinessName: "Acme Corporation",
    clientAddress: "123 Main St, City, Country",
    clientEmail: "client@example.com",
    items: [
      {
        id: 1,
        description: "Web Design Services",
        unitPrice: 150,
        quantity: 1,
        total: 150,
      },
      {
        id: 2,
        description: "Hosting (Monthly)",
        unitPrice: 20,
        quantity: 12,
        total: 240,
      },
    ],
    tax: 5,
    discount: 0,
    customNotes: "Thank you for your business!",
    lateFeeText: "2% per month on unpaid balance",
    businessDetails: {
      businessName: "Your Company",
      email: "contact@company.com",
      phone: "(123) 456-7890",
      address: "456 Business Ave, City, Country",
    },
    paymentAccount: {
      accountName: "Company Inc.",
      gatewayType: "Bank Transfer",
      accountData: {
        "Account Name": "Company Inc.",
        "Account Number": "1234567890",
        "Bank Name": "First National Bank",
      },
    },
    calculations: {
      subtotal: 390,
      taxAmount: 19.5,
      discountAmount: 0,
      finalTotal: 409.5,
    },
  };

  // Create safe template data that matches our interface
  const templateData: InvoiceTemplateData = {
    invoiceNumber: formattedData.invoiceNumber,
    invoiceDate: formattedData.invoiceDate,
    invoiceDueDate: formattedData.invoiceDueDate,
    clientName: formattedData.clientName,
    clientBusinessName: formattedData.clientBusinessName,
    clientAddress: formattedData.clientAddress,
    items: formattedData.items,
    calculations: {
      subtotal: formattedData.calculations.subtotal,
      finalTotal: formattedData.calculations.finalTotal,
    },
    discount: formattedData.discount,
    tax: formattedData.tax,
    customNotes: formattedData.customNotes,
    lateFeeText: formattedData.lateFeeText,
    // Convert payment account data to match our interface
    paymentAccount: formattedData.paymentAccount
      ? {
          gatewayType: formattedData.paymentAccount.gatewayType,
          accountData: formattedData.paymentAccount.accountData as Record<
            string,
            string | number | boolean
          >,
        }
      : null,
    businessDetails: formattedData.businessDetails
      ? {
          email: formattedData.businessDetails.email,
          phone: formattedData.businessDetails.phone,
          address: formattedData.businessDetails.address,
        }
      : undefined,
    // The following fields would come from your form or API in a real scenario
    logo: null, // Set to a URL or imported image when available
    signature: null, // Set to a URL or imported image when available
  };

  return (
    <div className="max-w-[794px] w-full bg-white">
      <PDFViewer width="100%" height={800}>
        <InvoiceTemplate data={templateData} />
      </PDFViewer>
    </div>
  );
}

export default Template3;
