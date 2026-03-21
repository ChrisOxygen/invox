import { StyleSheet } from '@react-pdf/renderer'

export const BRAND_FALLBACK = '#2B4BF2'
export const INK_900 = '#0D0D1A'
export const INK_700 = '#1C1C3A'
export const INK_400 = '#5A5A8A'
export const INK_200 = '#ADADC8'
export const INK_50 = '#F0F0F8'
export const BORDER_DEFAULT = '#E3E3EE'
export const SUCCESS = '#0ECB7A'

export function createPdfStyles(brandColor: string = BRAND_FALLBACK) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 9,
      color: INK_900,
      backgroundColor: '#FFFFFF',
      paddingBottom: 56,
    },

    // ─── Header strip ──────────────────────────────────────────────────────────
    header: {
      backgroundColor: brandColor,
      paddingHorizontal: 32,
      paddingVertical: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLogo: {
      width: 56,
      height: 56,
      objectFit: 'contain',
    },
    headerBusinessName: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 16,
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    headerBusinessSub: {
      fontSize: 8,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 2,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    headerInvoiceLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 22,
      color: '#FFFFFF',
      letterSpacing: -1,
      textTransform: 'uppercase',
    },
    headerInvoiceNumber: {
      fontFamily: 'Courier-Bold',
      fontSize: 10,
      color: 'rgba(255,255,255,0.85)',
      marginTop: 4,
      letterSpacing: 0.5,
    },

    // ─── Info block ────────────────────────────────────────────────────────────
    infoBlock: {
      flexDirection: 'row',
      paddingHorizontal: 32,
      paddingTop: 24,
      paddingBottom: 20,
      gap: 32,
    },
    infoColumn: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 7,
      fontFamily: 'Helvetica-Bold',
      color: INK_400,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 6,
    },
    infoName: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 11,
      color: INK_900,
      marginBottom: 3,
    },
    infoLine: {
      fontSize: 9,
      color: INK_700,
      marginBottom: 2,
      lineHeight: 1.4,
    },
    infoMuted: {
      fontSize: 8,
      color: INK_400,
      marginTop: 2,
    },

    // ─── Dates block ───────────────────────────────────────────────────────────
    datesBlock: {
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: BORDER_DEFAULT,
      paddingTop: 10,
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    dateLabel: {
      fontSize: 8,
      color: INK_400,
    },
    dateValue: {
      fontFamily: 'Courier',
      fontSize: 8,
      color: INK_900,
    },

    // ─── Divider ───────────────────────────────────────────────────────────────
    divider: {
      height: 1,
      backgroundColor: BORDER_DEFAULT,
      marginHorizontal: 32,
    },

    // ─── Line items table ──────────────────────────────────────────────────────
    tableWrapper: {
      paddingHorizontal: 32,
      paddingTop: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: brandColor,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 4,
      marginBottom: 2,
    },
    tableHeaderCell: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 7,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_DEFAULT,
    },
    tableRowAlt: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: INK_50,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_DEFAULT,
    },
    colDescription: { flex: 4 },
    colQty: { flex: 1, alignItems: 'flex-end' },
    colUnitPrice: { flex: 1.5, alignItems: 'flex-end' },
    colAmount: { flex: 1.5, alignItems: 'flex-end' },
    cellText: {
      fontSize: 9,
      color: INK_900,
      lineHeight: 1.4,
    },
    cellMono: {
      fontFamily: 'Courier',
      fontSize: 9,
      color: INK_900,
    },

    // ─── Totals ────────────────────────────────────────────────────────────────
    totalsWrapper: {
      paddingHorizontal: 32,
      paddingTop: 16,
      alignItems: 'flex-end',
    },
    totalsTable: {
      width: 220,
    },
    totalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    totalsLabel: {
      fontSize: 9,
      color: INK_400,
    },
    totalsValue: {
      fontFamily: 'Courier',
      fontSize: 9,
      color: INK_900,
    },
    totalsDivider: {
      height: 1,
      backgroundColor: BORDER_DEFAULT,
      marginVertical: 6,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    totalLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 12,
      color: INK_900,
    },
    totalValue: {
      fontFamily: 'Courier-Bold',
      fontSize: 13,
      color: INK_900,
    },

    // ─── Notes ─────────────────────────────────────────────────────────────────
    notesWrapper: {
      paddingHorizontal: 32,
      paddingTop: 20,
    },
    notesLabel: {
      fontSize: 7,
      fontFamily: 'Helvetica-Bold',
      color: INK_400,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 6,
    },
    notesText: {
      fontSize: 9,
      color: INK_700,
      lineHeight: 1.6,
    },

    // ─── Footer (fixed — repeats every page) ──────────────────────────────────
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 32,
      right: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: BORDER_DEFAULT,
      paddingTop: 10,
    },
    footerLeft: {
      fontSize: 7,
      color: INK_400,
    },
    footerCenter: {
      fontSize: 7,
      color: INK_400,
    },
    footerPageNumber: {
      fontFamily: 'Courier',
      fontSize: 7,
      color: INK_400,
    },

    // ─── Paid stamp ────────────────────────────────────────────────────────────
    paidStamp: {
      position: 'absolute',
      top: 100,
      right: 32,
      borderWidth: 3,
      borderColor: SUCCESS,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 5,
      transform: 'rotate(-15deg)',
    },
    paidStampText: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 22,
      color: SUCCESS,
      letterSpacing: 3,
    },
  })
}
