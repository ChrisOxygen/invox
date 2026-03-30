import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { ZCreateInvoice } from '../schemas'
import type { InvoiceDetail } from '../types'

function zeroPad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

export async function _createInvoice(profileId: string, data: ZCreateInvoice): Promise<InvoiceDetail> {
  const [invoiceCount, profile] = await Promise.all([
    prisma.invoice.count({ where: { profileId } }),
    prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        invoicePrefix: true,
        businessName: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        logoUrl: true,
        brandColor: true,
        taxNumber: true,
        rcNumber: true,
        currency: true,
      },
    }),
  ])

  if (!profile) throw new NotFoundError('Profile not found')

  const year = new Date().getFullYear()
  const invoiceNumber = `${profile.invoicePrefix}-${year}-${zeroPad(invoiceCount + 1, 4)}`

  const invoice = await prisma.invoice.create({
    data: {
        profileId,
        clientId: data.clientId,
        invoiceNumber,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        currency: data.currency ?? 'NGN',
        taxRate: data.taxRate ?? 0,
        taxType: data.taxType ?? 'PERCENTAGE',
        discount: data.discount ?? 0,
        discountType: data.discountType ?? 'PERCENTAGE',
        subtotal: data.subtotal ?? 0,
        taxAmount: data.taxAmount ?? 0,
        discountAmount: data.discountAmount ?? 0,
        total: data.total ?? 0,
        notes: data.notes ?? null,
        internalNotes: data.internalNotes ?? null,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            datePaid: true,
            method: true,
            note: true,
            createdAt: true,
          },
          orderBy: { datePaid: 'desc' },
        },
      },
    })

  return {
    ...invoice,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    sentAt: invoice.sentAt?.toISOString() ?? null,
    paidAt: invoice.paidAt?.toISOString() ?? null,
    shareTokenExp: invoice.shareTokenExp?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
    payments: invoice.payments.map((p) => ({
      ...p,
      datePaid: p.datePaid.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
    profile: {
      businessName: profile.businessName,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      logoUrl: profile.logoUrl,
      brandColor: profile.brandColor,
      taxNumber: profile.taxNumber,
      rcNumber: profile.rcNumber,
      invoicePrefix: profile.invoicePrefix,
      currency: profile.currency,
    },
  }
}
