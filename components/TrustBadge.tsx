'use client'
import { getTrustLevel } from '@/lib/items'

export function TrustBadge({ score }: { score: number }) {
  const level = getTrustLevel(score)
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: '1px solid',
      borderColor: level.color + '44',
      borderRadius: 4,
      padding: '3px 8px',
      background: level.color + '11',
    }}>
      <span style={{ fontSize: 10 }}>{level.emoji}</span>
      <span style={{ color: level.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em' }}>{level.label}</span>
      <span style={{ color: 'var(--dimmer)', fontSize: 10, marginLeft: 2 }}>· {score}pt</span>
    </div>
  )
}
