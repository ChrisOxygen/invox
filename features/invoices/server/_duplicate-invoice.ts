import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'

function zeroPad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

export async function _duplicateInvoice(
  profileId: string,
  invoiceId: string
): Promise<{ id: string; invoiceNumber: string }> {
  const [source, profile, invoiceCount] = await Promise.all([
    prisma.invoice.findFirst({
      where: { id: invoiceId, profileId },
      include: { items: true },
    }),
    prisma.profile.findUnique({
      where: { id: profileId },
      select: { invoicePrefix: true },
    }),
    prisma.invoice.count({ where: { profileId } }),
  ])

  if (!source) throw new NotFoundError('Invoice not found')
  if (!profile) throw new NotFoundError('Profile not found')

  const year = new Date().getFullYear()
  const invoiceNumber = `${profile.invoicePrefix}-${year}-${zeroPad(invoiceCount + 1, 4)}`

  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(dueDate.getDate() + 30)

  const duplicate = await prisma.invoice.create({
    data: {
      profileId,
      clientId: source.clientId,
      invoiceNumber,
      status: 'DRAFT',
      issueDate: today,
      dueDate,
      currency: source.currency,
      taxRate: source.taxRate,
      taxType: source.taxType,
      discount: source.discount,
      discountType: source.discountType,
      subtotal: source.subtotal,
      taxAmount: source.taxAmount,
      discountAmount: source.discountAmount,
      total: source.total,
      notes: source.notes,
      items: {
        create: source.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    },
    select: { id: true, invoiceNumber: true },
  })

  return duplicate
}
