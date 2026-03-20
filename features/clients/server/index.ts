import { prisma } from '@/shared/lib/prisma'
import { createClient } from '@/shared/lib/supabase/server'
import { UnauthorizedError, NotFoundError } from '@/shared/lib/api-error'
import type { ZCreateClient, ZUpdateClient } from '../schemas'
import type { ClientWithStats, ClientWithInvoices } from '../types'

export async function _getClients(params: {
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ clients: ClientWithStats[]; total: number }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  const { search, page = 1, pageSize = 20 } = params
  const skip = (page - 1) * pageSize

  const where = {
    profileId: user.id,
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { company: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [rawClients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      include: {
        _count: { select: { invoices: true } },
        invoices: {
          select: { total: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.client.count({ where }),
  ])

  const clients: ClientWithStats[] = rawClients.map((client) => {
    const totalBilled = client.invoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalPaid = client.invoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.total, 0)

    const { invoices: _invoices, ...rest } = client
    return { ...rest, totalBilled, totalPaid }
  })

  return { clients, total }
}

export async function _getClientById(id: string): Promise<ClientWithInvoices> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  const client = await prisma.client.findFirst({
    where: { id, profileId: user.id, deletedAt: null },
    include: {
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          total: true,
          issueDate: true,
          dueDate: true,
          currency: true,
        },
        orderBy: { issueDate: 'desc' },
      },
    },
  })

  if (!client) throw new NotFoundError('Client not found')
  return client
}

export async function _createClient(
  data: ZCreateClient
): Promise<{ client: { id: string; name: string }; warning?: 'duplicate_email' }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  let warning: 'duplicate_email' | undefined

  if (data.email) {
    const existing = await prisma.client.findFirst({
      where: { profileId: user.id, email: data.email, deletedAt: null },
    })
    if (existing) warning = 'duplicate_email'
  }

  const client = await prisma.client.create({
    data: {
      profileId: user.id,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      country: data.country ?? null,
    },
    select: { id: true, name: true },
  })

  return { client, ...(warning ? { warning } : {}) }
}

export async function _updateClient(
  data: ZUpdateClient
): Promise<{ client: { id: string; name: string }; warning?: 'duplicate_email' }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  const existing = await prisma.client.findFirst({
    where: { id: data.id, profileId: user.id, deletedAt: null },
  })
  if (!existing) throw new NotFoundError('Client not found')

  let warning: 'duplicate_email' | undefined

  if (data.email) {
    const duplicate = await prisma.client.findFirst({
      where: {
        profileId: user.id,
        email: data.email,
        deletedAt: null,
        NOT: { id: data.id },
      },
    })
    if (duplicate) warning = 'duplicate_email'
  }

  const client = await prisma.client.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      country: data.country ?? null,
    },
    select: { id: true, name: true },
  })

  return { client, ...(warning ? { warning } : {}) }
}

export async function _deleteClient(id: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  const existing = await prisma.client.findFirst({
    where: { id, profileId: user.id, deletedAt: null },
  })
  if (!existing) throw new NotFoundError('Client not found')

  await prisma.client.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}
