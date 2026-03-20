'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ShareTokenResponse {
  shareToken: string
  shareTokenExp: string
}

interface ShareTokenApiError extends Error {
  code?: string
}

export function useGenerateShareToken() {
  const queryClient = useQueryClient()

  return useMutation<ShareTokenResponse, ShareTokenApiError, { invoiceId: string }>({
    mutationFn: async ({ invoiceId }) => {
      const res = await fetch(`/api/v1/invoices/${invoiceId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: ShareTokenApiError = new Error(json?.error?.message ?? 'Failed to generate share link')
        error.code = json?.error?.code
        throw error
      }
      return res.json()
    },
    onSuccess: (_data, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] })
    },
  })
}
