export type LineItem = {
  description: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type TotalsInput = {
  items: LineItem[]
  taxRate: number
  taxType: 'PERCENTAGE' | 'FIXED'
  discount: number
  discountType: 'PERCENTAGE' | 'FIXED'
}

export type TotalsResult = {
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
}

export function calculateTotals(input: TotalsInput): TotalsResult {
  const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const discountAmount =
    input.discountType === 'PERCENTAGE'
      ? (subtotal * input.discount) / 100
      : input.discount

  const afterDiscount = subtotal - discountAmount

  const taxAmount =
    input.taxType === 'PERCENTAGE'
      ? (afterDiscount * input.taxRate) / 100
      : input.taxRate

  const total = afterDiscount + taxAmount

  return {
    subtotal: Math.max(0, subtotal),
    taxAmount: Math.max(0, taxAmount),
    discountAmount: Math.max(0, discountAmount),
    total: Math.max(0, total),
  }
}

export { formatCurrency } from '@/shared/lib/utils'
