'use client'

import { useQuery } from '@tanstack/react-query'

interface UseClientsParams {
  search?: string
  page?: number
  pageSize?: number
}

export function useClients(params: UseClientsParams = {}) {
  const { search = '', page = 1, pageSize = 20 } = params

  return useQuery({
    queryKey: ['clients', { search, page, pageSize }],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.set('search', params.search)
      if (params?.page) searchParams.set('page', String(params.page))
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize))
      const res = await fetch(`/api/v1/clients?${searchParams}`)
      if (!res.ok) throw new Error('Failed to fetch clients')
      return res.json()
    },
    staleTime: 1000 * 60 * 2,
  })
}
