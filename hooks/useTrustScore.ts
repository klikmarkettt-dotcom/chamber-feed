'use client'
import { useCallback, useEffect, useState } from 'react'
import { getTrustLevel } from '@/lib/items'
import type { ChamberStats } from '@/lib/chamberStats'

export function useTrustScore(walletAddress: string | null, chamberStats: ChamberStats | null) {
  const [score, setScore] = useState(0)
  const [levelUp, setLevelUp] = useState<string | null>(null)

  // Load from localStorage on wallet connect
  useEffect(() => {
    if (!walletAddress) { setScore(0); return }
    const stored = localStorage.getItem('ftl_trust_' + walletAddress)
    setScore(stored ? parseInt(stored, 10) : 0)
  }, [walletAddress])

  // Boost from chamber: if wallet's twitter handle is top-scored, get bonus
  // We store a mapping of wallet->twitter in localStorage optionally
  const addScore = useCallback((boost: number) => {
    if (!walletAddress) return
    setScore((prev) => {
      const next = prev + boost
      localStorage.setItem('ftl_trust_' + walletAddress, String(next))
      const prevLvl = getTrustLevel(prev)
      const nextLvl = getTrustLevel(next)
      if (nextLvl.label !== prevLvl.label) {
        setLevelUp(nextLvl.label)
        setTimeout(() => setLevelUp(null), 4000)
      }
      return next
    })
  }, [walletAddress])

  // Spam penalty from chamber: if top spammer loses votes, apply penalty
  const applySpamPenalty = useCallback(() => {
    if (!walletAddress) return
    setScore((prev) => {
      const next = Math.max(0, prev - 3)
      localStorage.setItem('ftl_trust_' + walletAddress, String(next))
      return next
    })
  }, [walletAddress])

  // Chamber trust bonus: if feed has smart messages (high score posts), boost
  const applyChamberBonus = useCallback((bonus: number) => {
    addScore(bonus)
  }, [addScore])

  return { score, addScore, applySpamPenalty, applyChamberBonus, currentLevel: getTrustLevel(score), levelUp }
}
