'use client'
import type { ShopItem } from '@/lib/items'

export function ShopItemCard({ item, onClick, disabled }: {
  item: ShopItem
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'var(--panel)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s, background 0.15s',
        width: '100%',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'
          ;(e.currentTarget as HTMLElement).style.background = 'rgba(123,156,255,0.04)'
        }
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--panel)'
      }}
    >
      <span style={{ fontSize: 28 }}>{item.emoji}</span>
      <div style={{ color: 'var(--text)', fontSize: 11, fontWeight: 500 }}>{item.name}</div>
      <div style={{ color: 'var(--dimmer)', fontSize: 9, lineHeight: 1.4 }}>{item.description}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
        <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>{item.price}◎</span>
        <span style={{ color: 'var(--green)', fontSize: 9, border: '1px solid rgba(74,255,154,0.3)', borderRadius: 3, padding: '1px 5px' }}>+{item.trustBoost}</span>
      </div>
    </button>
  )
}
