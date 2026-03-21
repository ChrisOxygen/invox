'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZCreatePayment } from '../schemas'

interface PaymentApiError extends Error {
  code?: string
}

interface UseMarkInvoicePaidOptions {
  onSuccess?: () => void
}

export function useMarkInvoicePaid(options?: UseMarkInvoicePaidOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ invoiceId, data }: { invoiceId: string; data: ZCreatePayment }) => {
      const res = await fetch(`/api/v1/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: PaymentApiError = new Error(json?.error?.message ?? 'Failed to record payment')
        error.code = json?.error?.code
        throw error
      }
      return res.json()
    },
    onSuccess: (_data, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      options?.onSuccess?.()
    },
  })
}
