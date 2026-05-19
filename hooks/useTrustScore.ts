'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getTrustLevel } from '@/lib/items'
import { computeCommunitySignal, type ChamberStats } from '@/lib/chamberStats'

export function useTrustScore(walletAddress: string | null, chamberStats: ChamberStats | null) {
  const [baseScore, setBaseScore] = useState(0)
  const [levelUp, setLevelUp] = useState<string | null>(null)
  const communityScoreRef = useRef(0)
  const lastLevelRef = useRef(getTrustLevel(0).label)
  const timerRef = useRef<number | null>(null)

  const communityScore = useMemo(() => {
    if (!chamberStats) return 0
    return typeof chamberStats.communitySignal === 'number'
      ? chamberStats.communitySignal
      : computeCommunitySignal(chamberStats)
  }, [chamberStats])

  useEffect(() => {
    communityScoreRef.current = communityScore
  }, [communityScore])

  useEffect(() => {
    if (!walletAddress) {
      setBaseScore(0)
      setLevelUp(null)
      lastLevelRef.current = getTrustLevel(0).label
      return
    }

    const stored = localStorage.getItem(`ftl_trust_${walletAddress}`)
    const parsed = stored ? Number.parseInt(stored, 10) : 0
    const safeBase = Number.isFinite(parsed) ? parsed : 0

    setBaseScore(safeBase)
    lastLevelRef.current = getTrustLevel(Math.max(0, safeBase + communityScoreRef.current)).label
  }, [walletAddress])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const announceLevel = useCallback((effectiveScore: number) => {
    const nextLabel = getTrustLevel(Math.max(0, effectiveScore)).label
    if (nextLabel === lastLevelRef.current) return

    lastLevelRef.current = nextLabel
    setLevelUp(nextLabel)

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      setLevelUp(null)
    }, 4000)
  }, [])

  const addScore = useCallback(
    (boost: number) => {
      if (!walletAddress) return

      setBaseScore((prev) => {
        const nextBase = Math.max(0, prev + boost)
        localStorage.setItem(`ftl_trust_${walletAddress}`, String(nextBase))
        announceLevel(nextBase + communityScoreRef.current)
        return nextBase
      })
    },
    [walletAddress, announceLevel],
  )

  const applySpamPenalty = useCallback(
    (amount = 3) => {
      if (!walletAddress) return

      setBaseScore((prev) => {
        const nextBase = Math.max(0, prev - amount)
        localStorage.setItem(`ftl_trust_${walletAddress}`, String(nextBase))
        announceLevel(nextBase + communityScoreRef.current)
        return nextBase
      })
    },
    [walletAddress, announceLevel],
  )

  const applyCommunityBonus = useCallback(
    (bonus = 2) => {
      addScore(bonus)
    },
    [addScore],
  )

  const score = Math.max(0, baseScore + communityScore)

  return {
    score,
    baseScore,
    communityScore,
    addScore,
    applySpamPenalty,
    applyCommunityBonus,
    currentLevel: getTrustLevel(score),
    levelUp,
  }
}
