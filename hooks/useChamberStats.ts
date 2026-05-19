'use client'
import { useEffect, useState, useCallback } from 'react'
import type { ChamberStats } from '@/lib/chamberStats'

export function useChamberStats() {
  const [stats, setStats] = useState<ChamberStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/chamber-stats')
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
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
    const iv = setInterval(refresh, 15000)
    return () => clearInterval(iv)
  }, [refresh])

  return { stats, loading, error, refresh }
}
