import React from "react";
import { PaymentAccount } from "@prisma/client";
import { InvoiceTemplateProps } from "../pdf/reactPDFTemplate1";
import {
  validateAndConvertInvoiceItems,
  extractPaymentAccountDisplayData,
  formatDate,
  formatCurrency,
  getThemeColors,
  createWebStyles,
} from "../../utils";

function Template1({
  invoice,
  client,
  userAndBusiness,
  paymentAccount,
  theme = "classic",
}: InvoiceTemplateProps) {
  if (!userAndBusiness?.business) {
    return null;
  }

  if (!client) {
    return null;
  }

  // Get theme colors and web styles
  const colors = getThemeColors(theme);
  const styles = createWebStyles(theme);

  const { business, signature } = userAndBusiness;
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
        <div className={`flex ${styles.paymentInfoRowView}`}>
          <span
            className={styles.paymentInfoText}
            style={{ color: colors.text }}
          >
            Account Name:
          </span>
          <span
            className={styles.paymentInfoText}
            style={{ color: colors.text }}
          >
            {paymentAccount.accountName}
          </span>
        </div>
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
          <div className={`flex ${styles.paymentInfoRowView}`}>
            <span
              className={styles.paymentInfoText}
              style={{ color: colors.text }}
            >
              Account Name:
            </span>
            <span
              className={styles.paymentInfoText}
              style={{ color: colors.text }}
            >
              {paymentAccount.accountName}
            </span>
          </div>
          <div className={`flex ${styles.paymentInfoRowView}`}>
            <span className="text-[11px]" style={{ color: colors.textLight }}>
              Data validation error
            </span>
          </div>
        </>
      );
    }

    // Render validated account data
    return (
      <>
        <div className={`flex ${styles.paymentInfoRowView}`}>
          <span
            className={styles.paymentInfoText}
            style={{ color: colors.text }}
          >
            Account Name:
          </span>
          <span
            className={styles.paymentInfoText}
            style={{ color: colors.text }}
          >
            {paymentAccount.accountName}
          </span>
        </div>
        {Object.entries(displayData).map(([key, value], index) => (
          <div key={index} className={`flex ${styles.paymentInfoRowView}`}>
            <span
              className={styles.paymentInfoText}
              style={{ color: colors.text }}
            >
              {key}:
            </span>
            <span
              className={styles.paymentInfoText}
              style={{ color: colors.text }}
            >
              {value}
            </span>
          </div>
        ))}
      </>
    );
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div
          className={styles.headerTitle}
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <span>INVOICE</span>
        </div>
        {logo && (
          <div className={styles.logoView}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.logo} src={logo} alt="Business Logo" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.bodyView}>
        {/* Details Section */}
        <div className={styles.detailsSectionView}>
          <div className={styles.invoiceToView}>
            <h2
              className={styles.sectionTitle}
              style={{ color: colors.primary }}
            >
              Invoice to:
            </h2>
            {client.contactPersonName && (
              <p className={styles.clientText} style={{ color: colors.text }}>
                {client.contactPersonName}
              </p>
            )}
            <p
              className={styles.clientBusinessName}
              style={{ color: colors.text }}
            >
              {client.BusinessName}
            </p>
            {client.address && (
              <p className={styles.clientText} style={{ color: colors.text }}>
                {client.address}
              </p>
            )}
          </div>
          <div className={styles.invoiceDetailsView}>
            <div className={styles.invoiceDetailsRowView}>
              <span
                className={styles.invoiceLabel}
                style={{ color: colors.primary }}
              >
                Invoice #
              </span>
              <span
                className={styles.invoiceValue}
                style={{ color: colors.text }}
              >
                {invoice.invoiceNumber}
              </span>
            </div>
            <div className={styles.invoiceDetailsRowView}>
              <span
                className={styles.invoiceLabel}
                style={{ color: colors.primary }}
              >
                Invoice Date
              </span>
              <span
                className={styles.invoiceValue}
                style={{ color: colors.text }}
              >
                {formatDate(invoice.createdAt)}
              </span>
            </div>
            <div className={styles.invoiceDetailsRowView}>
              <span
                className={styles.invoiceLabel}
                style={{ color: colors.primary }}
              >
                Due Date
              </span>
              <span
                className={styles.invoiceValue}
                style={{ color: colors.text }}
              >
                {formatDate(invoice.paymentDueDate!)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className={styles.itemsTableView}>
          <div
            className={styles.tableHeaderView}
            style={{ backgroundColor: colors.accent }}
          >
            <span
              className={`${styles.tableHeader} ${styles.itemDescription}`}
              style={{ color: colors.primary }}
            >
              Item description
            </span>
            <span
              className={`${styles.tableHeader} ${styles.itemPrice}`}
              style={{ color: colors.primary }}
            >
              Price
            </span>
            <span
              className={`${styles.tableHeader} ${styles.itemQuantity}`}
              style={{ color: colors.primary }}
            >
              Qty.
            </span>
            <span
              className={`${styles.tableHeader} ${styles.itemTotal}`}
              style={{ color: colors.primary }}
            >
              Total
            </span>
          </div>

          {/* Dynamic items rows */}
          <div className={styles.tableRowContainerView}>
            {validatedItems &&
              validatedItems.map((item, index) => {
                const notLastItem = index !== validatedItems.length - 1;
                const borderClass = notLastItem ? styles.itemBorder : "";
                const borderStyle = notLastItem
                  ? { borderColor: colors.border }
                  : {};

                return (
                  <div
                    key={index}
                    className={`${styles.tableRowView} ${borderClass}`}
                    style={borderStyle}
                  >
                    <span
                      className={styles.itemDescription}
                      style={{ color: colors.text }}
                    >
                      {item.description}
                    </span>
                    <span
                      className={styles.itemPrice}
                      style={{ color: colors.text }}
                    >
                      {formatCurrency(item.unitPrice)}
                    </span>
                    <span
                      className={styles.itemQuantity}
                      style={{ color: colors.text }}
                    >
                      {item.quantity}
                    </span>
                    <span
                      className={styles.itemTotal}
                      style={{ color: colors.text }}
                    >
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Terms and Total */}
        <div className={styles.termsAndTotalView}>
          <div className={styles.termsView}>
            {invoice.lateFeeTerms && (
              <div className={styles.TermsRowView}>
                <h3
                  className={styles.termsTitle}
                  style={{ color: colors.primary }}
                >
                  Late Payment Terms:
                </h3>
                <p
                  className={styles.termsText}
                  style={{ color: colors.textLight }}
                >
                  {invoice.lateFeeTerms}
                </p>
              </div>
            )}
            {invoice.customNote && (
              <div className={styles.TermsRowView}>
                <h3
                  className={styles.termsTitle}
                  style={{ color: colors.primary }}
                >
                  custom note:
                </h3>
                <p
                  className={styles.termsText}
                  style={{ color: colors.textLight }}
                >
                  {invoice.customNote}
                </p>
              </div>
            )}
            <div className={`${styles.TermsRowView} mt-5`}>
              <div
                className={styles.paymentInfoHeader}
                style={{ backgroundColor: colors.primary }}
              >
                <h3
                  className={styles.paymentInfoTitle}
                  style={{ color: colors.background }}
                >
                  Payment Info:
                </h3>
              </div>

              <div className={`flex ${styles.paymentInfoRowView}`}>
                <span
                  className={styles.paymentInfoText}
                  style={{ color: colors.text }}
                >
                  Gateway:
                </span>
                {paymentAccount?.gatewayType && (
                  <span
                    className={styles.paymentInfoText}
                    style={{ color: colors.text }}
                  >
                    {paymentAccount.gatewayType}
                  </span>
                )}
              </div>
              {paymentAccount && renderPaymentAccountData(paymentAccount)}
            </div>
          </div>

          <div className={styles.totalView}>
            <div className={styles.totalRowView}>
              <span
                className={styles.totalLabel}
                style={{ color: colors.primary }}
              >
                Subtotal:
              </span>
              <span
                className={styles.totalValue}
                style={{ color: colors.text }}
              >
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className={styles.totalRowView}>
              <span
                className={styles.totalLabel}
                style={{ color: colors.primary }}
              >
                Tax:
              </span>
              <span
                className={styles.totalValue}
                style={{ color: colors.text }}
              >
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className={styles.totalRowView}>
              <span
                className={styles.totalLabel}
                style={{ color: colors.primary }}
              >
                Discount:
              </span>
              <span
                className={styles.totalValue}
                style={{ color: colors.text }}
              >
                -{formatCurrency(discountAmount)}
              </span>
            </div>
            <div
              className={styles.divider}
              style={{ backgroundColor: colors.primary }}
            ></div>
            <div className={styles.totalRowView}>
              <span
                className={styles.grandTotalLabel}
                style={{ color: colors.primary }}
              >
                Total:
              </span>
              <span
                className={styles.grandTotalValue}
                style={{ color: colors.primary }}
              >
                {formatCurrency(finalTotal)}
              </span>
            </div>
            <div
              className={styles.divider}
              style={{ backgroundColor: colors.primary }}
            ></div>

            {signature && (
              <div className={styles.signatureView}>
                <div className={styles.signatureImageView}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.signature}
                    src={signature}
                    alt="Signature"
                  />
                </div>
                <div
                  className={styles.divider}
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <p
                  className="text-xs text-center italic mt-1.5"
                  style={{ color: colors.textLight }}
                >
                  authorized signatory
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={styles.footerView}
        style={{
          color: colors.background,
          backgroundColor: colors.primary,
        }}
      >
        <span className={styles.footerText}>{businessName}</span>
        <span className={styles.footerEmail}>{email}</span>
      </div>
    </main>
  );
}

export default Template1;
