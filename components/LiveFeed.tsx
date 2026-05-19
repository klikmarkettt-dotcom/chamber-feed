'use client'

export interface FeedItem {
  id: string
  wallet: string
  itemName: string
  itemEmoji: string
  price: number
  trustBoost: number
  signature?: string
  when: number
}

function timeAgo(ts: number) {
  const d = Math.floor((Date.now() - ts) / 1000)
  if (d < 60) return `${d}s ago`
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  return `${Math.floor(d / 3600)}h ago`
}

export function LiveFeed({ events }: { events: FeedItem[] }) {
  if (!events.length) return (
    <p style={{ color: 'var(--dimmer)', fontSize: 11, textAlign: 'center', padding: '16px 0', fontStyle: 'italic' }}>
      no feeds yet — be the first 🦞
    </p>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {events.slice(0, 8).map((ev) => (
        <div key={ev.id} style={{
          display: 'grid',
          gridTemplateColumns: '28px 1fr auto',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          border: '1px solid var(--border)',
          borderRadius: 4,
          background: 'rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
        }}>
          <span style={{ fontSize: 18, textAlign: 'center' }}>{ev.itemEmoji}</span>
          <div>
            <div style={{ color: 'var(--text)', fontSize: 11, fontWeight: 500 }}>{ev.itemName}</div>
            <div style={{ color: 'var(--dimmer)', fontSize: 10, fontFamily: 'monospace' }}>
              {ev.wallet.slice(0, 4)}…{ev.wallet.slice(-4)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--green)', fontSize: 10, fontWeight: 600 }}>+{ev.trustBoost}pt</div>
            <div style={{ color: 'var(--dimmer)', fontSize: 9 }}>{timeAgo(ev.when)}</div>
            {ev.signature && (
              <a href={`https://solscan.io/tx/${ev.signature}`} target="_blank" rel="noreferrer"
                style={{ color: 'var(--dimmer)', fontSize: 9, textDecoration: 'none' }}>↗</a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
