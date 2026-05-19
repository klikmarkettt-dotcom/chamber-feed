'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ChamberStats } from '@/lib/chamberStats'

export function useChamberStats() {
  const [stats, setStats] = useState<ChamberStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/chamber-stats', {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('fetch failed')
      }

      const data = (await res.json()) as ChamberStats
      setStats(data)
      setError(null)
    } catch {
      setError('failed to reach chamber')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const iv = window.setInterval(refresh, 12000)
    return () => window.clearInterval(iv)
  }, [refresh])

  return { stats, loading, error, refresh }
}
