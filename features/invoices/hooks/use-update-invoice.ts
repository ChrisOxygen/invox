'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZUpdateInvoice } from '../schemas'
import type { InvoiceDetail } from '../types'

interface InvoiceApiError extends Error {
  code?: string
}

export function useUpdateInvoice(options?: { onSuccess?: (data: InvoiceDetail) => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ZUpdateInvoice) => {
      const { id, ...rest } = data
      const res = await fetch(`/api/v1/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) {
        const json = await res.json()
        const err: InvoiceApiError = new Error(json.error?.message ?? 'Failed to update invoice')
        err.code = json.error?.code
        throw err
      }
      return res.json() as Promise<InvoiceDetail>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] })
      options?.onSuccess?.(data)
    },
  })
}
