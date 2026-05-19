'use client'

import { useEffect, useState } from 'react'
import type { LobsterReaction } from '@/lib/items'

const reactionClass: Record<LobsterReaction, string> = {
  idle: 'animate-bob',
  nibble: 'animate-nibble',
  'happy-dance': 'animate-wiggle',
  'excited-claws': 'animate-wiggle',
  'content-sway': 'animate-sway',
  slurp: 'animate-sway',
  'big-celebration': 'animate-spin360',
  'mega-dance': 'animate-megaDance',
  crown: 'animate-bob',
  'screen-shake': 'animate-shake',
  'royal-feast': 'animate-megaDance',
  sad: 'animate-droopIn',
}

const reactionDuration: Record<LobsterReaction, number> = {
  idle: 0,
  nibble: 1400,
  'happy-dance': 700,
  'excited-claws': 700,
  'content-sway': 1200,
  slurp: 1200,
  'big-celebration': 900,
  'mega-dance': 2600,
  crown: 2200,
  'screen-shake': 800,
  'royal-feast': 4200,
  sad: 1800,
}

export function LobsterSVG({
  reaction,
  speech,
  onReactionEnd,
}: {
  reaction: LobsterReaction
  speech: string
  onReactionEnd?: () => void
}) {
  const [isGold, setIsGold] = useState(false)
  const [showCrown, setShowCrown] = useState(false)
  const [bodyClass, setBodyClass] = useState('animate-bob')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (reaction === 'idle') {
      setBodyClass('animate-bob')
      setIsGold(false)
      setShowCrown(false)
      setShowBanner(false)
      return
    }

    setBodyClass(reactionClass[reaction] || 'animate-bob')

    let timer: number | undefined
    let crownTimer: number | undefined

    if (reaction === 'crown') {
      setShowCrown(true)
      crownTimer = window.setTimeout(() => setShowCrown(false), 1800)
    }

    if (reaction === 'screen-shake') {
      document.body.style.animation = 'shake 0.8s ease-in-out'
      window.setTimeout(() => {
        document.body.style.animation = ''
      }, 800)
    }

    if (reaction === 'royal-feast') {
      setIsGold(true)
      setShowBanner(true)
      timer = window.setTimeout(() => {
        setShowBanner(false)
        setIsGold(false)
        setBodyClass('animate-bob')
        onReactionEnd?.()
      }, reactionDuration[reaction])
      return () => {
        if (timer) window.clearTimeout(timer)
        if (crownTimer) window.clearTimeout(crownTimer)
      }
    }

    timer = window.setTimeout(() => {
      setBodyClass('animate-bob')
      onReactionEnd?.()
    }, reactionDuration[reaction] || 1500)

    return () => {
      if (timer) window.clearTimeout(timer)
      if (crownTimer) window.clearTimeout(crownTimer)
    }
  }, [reaction, onReactionEnd])

  const body = isGold ? '#FFD700' : '#C0392B'
  const shell = isGold ? '#F4C430' : '#9B2222'
  const claws = isGold ? '#FFD700' : '#B03020'
  const accent = isGold ? '#DAA520' : '#8B1A1A'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showBanner && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginBottom: 6,
            padding: '6px 12px',
            border: '1px solid var(--gold)',
            borderRadius: 999,
            color: 'var(--gold)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            background: 'rgba(20,15,0,0.85)',
          }}
        >
          👑 chamber legend
        </div>
      )}

      {showCrown && (
        <div style={{ marginBottom: 4, fontSize: 22, animation: 'animate-scaleIn 0.5s ease-out' }}>
          ✨👑✨
        </div>
      )}

      <div
        style={{
          marginBottom: 8,
          maxWidth: 260,
          padding: '8px 12px',
          borderRadius: 12,
          textAlign: 'center',
          border: `1px solid ${isGold ? '#FFD700' : 'var(--border2)'}`,
          background: 'rgba(20,8,8,0.9)',
          color: isGold ? '#FFD700' : 'var(--text)',
          fontSize: 11,
          lineHeight: 1.45,
        }}
      >
        {speech}
      </div>

      <div
        className={bodyClass}
        style={{
          transformOrigin: 'center top',
          filter: isGold
            ? 'drop-shadow(0 0 16px rgba(255,215,0,0.75))'
            : 'drop-shadow(0 0 6px rgba(200,60,40,0.35))',
        }}
      >
        <svg viewBox="0 0 200 220" width="150" height="165" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="30" x2="40" y2="0" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="120" y1="30" x2="160" y2="0" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />

          <ellipse cx="52" cy="95" rx="12" ry="8" fill={claws} transform="rotate(-30 52 95)" />
          <ellipse cx="30" cy="108" rx="20" ry="10" fill={claws} transform="rotate(-20 30 108)" />
          <ellipse cx="22" cy="98" rx="15" ry="7" fill={body} transform="rotate(-30 22 98)" />

          <ellipse cx="148" cy="95" rx="12" ry="8" fill={claws} transform="rotate(30 148 95)" />
          <ellipse cx="170" cy="108" rx="20" ry="10" fill={claws} transform="rotate(20 170 108)" />
          <ellipse cx="178" cy="98" rx="15" ry="7" fill={body} transform="rotate(30 178 98)" />

          <ellipse cx="100" cy="90" rx="46" ry="52" fill={body} />
          <ellipse cx="100" cy="72" rx="36" ry="16" fill={shell} opacity="0.6" />
          <ellipse cx="100" cy="88" rx="40" ry="14" fill={shell} opacity="0.4" />
          <ellipse cx="100" cy="104" rx="36" ry="12" fill={shell} opacity="0.3" />

          <ellipse cx="100" cy="45" rx="32" ry="24" fill={body} />
          <polygon points="100,10 94,32 106,32" fill={claws} />

          <circle cx="84" cy="38" r="8" fill={isGold ? '#8B6914' : '#1a1a1a'} />
          <circle cx="116" cy="38" r="8" fill={isGold ? '#8B6914' : '#1a1a1a'} />
          <circle cx="84" cy="38" r="4" fill="#000" />
          <circle cx="116" cy="38" r="4" fill="#000" />
          <circle cx="86" cy="36" r="1.5" fill="white" opacity="0.8" />
          <circle cx="118" cy="36" r="1.5" fill="white" opacity="0.8" />

          <line x1="68" y1="110" x2="42" y2="135" stroke={claws} strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="118" x2="46" y2="148" stroke={claws} strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="128" x2="50" y2="158" stroke={claws} strokeWidth="3" strokeLinecap="round" />

          <line x1="132" y1="110" x2="158" y2="135" stroke={claws} strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="118" x2="154" y2="148" stroke={claws} strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="128" x2="150" y2="158" stroke={claws} strokeWidth="3" strokeLinecap="round" />

          <ellipse cx="100" cy="148" rx="32" ry="22" fill={body} />
          <ellipse cx="100" cy="165" rx="26" ry="18" fill={body} />
          <ellipse cx="100" cy="180" rx="20" ry="14" fill={body} />

          <ellipse cx="80" cy="196" rx="14" ry="7" fill={claws} transform="rotate(-20 80 196)" />
          <ellipse cx="100" cy="200" rx="14" ry="7" fill={claws} />
          <ellipse cx="120" cy="196" rx="14" ry="7" fill={claws} transform="rotate(20 120 196)" />
        </svg>
      </div>

      <p style={{ marginTop: 6, fontSize: 10, letterSpacing: '0.35em', color: isGold ? '#DAA520' : '#9B2222' }}>
        — Klik —
      </p>
    </div>
  )
}
