'use client'

import { useState } from 'react'
import type { ShopItem } from '@/lib/items'

export function BuyModal({
  item,
  onConfirm,
  onCancel,
  loading,
}: {
  item: ShopItem
  onConfirm: (payload: { tip: number; grantTrust: boolean }) => void
  onCancel: () => void
  loading: boolean
}) {
  const [tip, setTip] = useState(0)
  const [custom, setCustom] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [grantTrust, setGrantTrust] = useState(true)

  const activeTip = useCustom ? Number.parseFloat(custom) || 0 : tip
  const total = item.price + activeTip
  const trustDelta = grantTrust ? item.trustBoost : 0

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--panel)',
          border: '1px solid var(--border2)',
          borderRadius: 8,
          padding: 22,
          boxShadow: '0 0 40px rgba(123,156,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <span style={{ fontSize: 40 }}>{item.emoji}</span>
          <div>
            <div style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>
              {item.name}
            </div>
            <div style={{ color: 'var(--dim)', fontSize: 11, marginTop: 2 }}>
              {item.description}
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 6,
                border: '1px solid var(--green)',
                borderRadius: 3,
                padding: '1px 7px',
                color: 'var(--green)',
                fontSize: 10,
                letterSpacing: '0.08em',
              }}
            >
              TRUST {grantTrust ? `+${item.trustBoost}` : '+0'}
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'rgba(0,0,0,0.3)',
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: 'var(--dim)', fontSize: 11 }}>{item.name}</span>
            <span style={{ color: 'var(--text)', fontSize: 11 }}>{item.price}◎</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            <div style={{ color: 'var(--dim)', fontSize: 10, marginBottom: 8 }}>
              💛 tip creator (optional)
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[0, 0.01, 0.05].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTip(t)
                    setUseCustom(false)
                  }}
                  style={{
                    fontSize: 10,
                    padding: '4px 10px',
                    border: '1px solid',
                    borderColor: !useCustom && tip === t ? 'var(--gold)' : 'var(--border2)',
                    borderRadius: 4,
                    background: !useCustom && tip === t ? 'rgba(232,200,74,0.1)' : 'transparent',
                    color: !useCustom && tip === t ? 'var(--gold)' : 'var(--dim)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.1s',
                  }}
                >
                  {t === 0 ? 'no tip' : `${t}◎`}
                </button>
              ))}

              <button
                onClick={() => setUseCustom(true)}
                style={{
                  fontSize: 10,
                  padding: '4px 10px',
                  border: '1px solid',
                  borderColor: useCustom ? 'var(--gold)' : 'var(--border2)',
                  borderRadius: 4,
                  background: useCustom ? 'rgba(232,200,74,0.1)' : 'transparent',
                  color: useCustom ? 'var(--gold)' : 'var(--dim)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                custom
              </button>
            </div>

            {useCustom && (
              <input
                type="number"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={{
                  marginTop: 8,
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border2)',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 11,
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
            <div style={{ color: 'var(--dim)', fontSize: 10, marginBottom: 8 }}>
              trust mode
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setGrantTrust(true)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  border: '1px solid',
                  borderColor: grantTrust ? 'var(--accent)' : 'var(--border2)',
                  borderRadius: 6,
                  background: grantTrust ? 'rgba(123,156,255,0.12)' : 'transparent',
                  color: grantTrust ? 'var(--accent)' : 'var(--dim)',
                  fontSize: 10,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                trust on
              </button>

              <button
                onClick={() => setGrantTrust(false)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  border: '1px solid',
                  borderColor: !grantTrust ? 'var(--gold)' : 'var(--border2)',
                  borderRadius: 6,
                  background: !grantTrust ? 'rgba(232,200,74,0.12)' : 'transparent',
                  color: !grantTrust ? 'var(--gold)' : 'var(--dim)',
                  fontSize: 10,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                feed only
              </button>
            </div>

            <div style={{ color: 'var(--dimmer)', fontSize: 9, marginTop: 8 }}>
              feed only keeps the lobster happy, but your trust score stays still.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 10 }}>
            <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>total</span>
            <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
              {total.toFixed(4)}◎
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ color: 'var(--dim)', fontSize: 10 }}>trust effect</span>
            <span style={{ color: 'var(--green)', fontSize: 10, fontWeight: 600 }}>
              +{trustDelta}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid var(--border2)',
              borderRadius: 6,
              background: 'transparent',
              color: 'var(--dim)',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            cancel
          </button>

          <button
            onClick={() => onConfirm({ tip: activeTip, grantTrust })}
            disabled={loading}
            style={{
              flex: 2,
              padding: '10px',
              border: '1px solid var(--accent)',
              borderRadius: 6,
              background: 'rgba(123,156,255,0.12)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.5 : 1,
              letterSpacing: '0.05em',
            }}
          >
            {loading ? '⏳ confirming…' : '🟣 confirm · phantom'}
          </button>
        </div>
      </div>
    </div>
  )
}
