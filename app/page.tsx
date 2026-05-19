'use client'

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { useWallet, WalletMultiButton as RawWalletMultiButton } from '@solana/wallet-adapter-react'
import { LobsterSVG } from '@/components/LobsterSVG'
import { ShopItemCard } from '@/components/ShopItem'
import { BuyModal } from '@/components/BuyModal'
import { TrustBadge } from '@/components/TrustBadge'
import { LiveFeed, type FeedItem } from '@/components/LiveFeed'
import {
  ChamberStatsPanel,
  ChamberLeaderboard,
  ChamberLiveFeed,
} from '@/components/ChamberStatsPanel'
import { useTrustScore } from '@/hooks/useTrustScore'
import { useSolanaPayment } from '@/hooks/useSolanaPayment'
import { useChamberStats } from '@/hooks/useChamberStats'
import {
  SHOP_ITEMS,
  type ShopItem,
  type LobsterReaction,
  TRUST_LEVELS,
} from '@/lib/items'

const WalletMultiButton = RawWalletMultiButton as unknown as ComponentType<any>

interface Toast {
  id: number
  text: string
  type: 'success' | 'error' | 'levelup'
  href?: string
}

export default function Page() {
  const { publicKey } = useWallet()
  const wallet = publicKey?.toBase58() ?? null

  const { stats, loading: statsLoading, error: statsError } = useChamberStats()
  const { score, addScore, levelUp } = useTrustScore(wallet, stats)
  const { pay, loading } = useSolanaPayment()

  const [selected, setSelected] = useState<ShopItem | null>(null)
  const [reaction, setReaction] = useState<LobsterReaction>('idle')
  const [speech, setSpeech] = useState('Feed me... 🦞')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])

  const tid = useRef(0)

  const toast = useCallback((text: string, type: Toast['type'], href?: string) => {
    const id = ++tid.current
    setToasts((p) => [...p, { id, text, type, href }])

    window.setTimeout(() => {
      setToasts((p) => p.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  useEffect(() => {
    if (levelUp) {
      toast(`🎉 LEVEL UP · ${levelUp}`, 'levelup')
    }
  }, [levelUp, toast])

  useEffect(() => {
    if (reaction !== 'idle') return

    const phrases = [
      'Feed me... 🦞',
      'hungry for SOL 🌊',
      'SOL accepted 🦐',
      'claws ready... 🦀',
      'chamber is watching 👁',
    ]

    const iv = window.setInterval(() => {
      setSpeech(phrases[Math.floor(Math.random() * phrases.length)])
    }, 4000)

    return () => window.clearInterval(iv)
  }, [reaction])

  async function handleBuy({
    tip,
    grantTrust,
  }: {
    tip: number
    grantTrust: boolean
  }) {
    if (!selected) return

    try {
      const result = await pay({ amountSol: selected.price, tipSol: tip })
      const trustDelta = grantTrust ? selected.trustBoost : 0

      setReaction(selected.reaction)
      setSpeech(selected.speech)

      if (grantTrust) {
        addScore(selected.trustBoost)
      }

      if (wallet) {
        setFeed((p) => [
          {
            id: result.signature,
            wallet,
            itemName: selected.name,
            itemEmoji: selected.emoji,
            price: selected.price,
            trustBoost: trustDelta,
            grantTrust,
            signature: result.signature,
            when: Date.now(),
          },
          ...p,
        ].slice(0, 10))
      }

      toast(
        grantTrust
          ? `✓ fed! +${trustDelta} trust earned`
          : '✓ fed! no trust added',
        'success',
        result.explorerUrl,
      )

      setSelected(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''

      setReaction('sad')
      setSpeech('Oof... 😢')

      toast(
        `✗ ${
          msg.includes('rejected')
            ? 'rejected'
            : msg.includes('funds')
              ? 'insufficient funds'
              : 'transaction failed'
        }`,
        'error',
      )

      setSelected(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxWidth: 320,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
            style={{
              border: '1px solid',
              borderColor:
                t.type === 'success'
                  ? 'rgba(74,255,154,0.3)'
                  : t.type === 'levelup'
                    ? 'rgba(184,123,255,0.4)'
                    : 'rgba(255,74,110,0.3)',
              borderRadius: 5,
              padding: '8px 12px',
              fontSize: 11,
              cursor: 'pointer',
              animation: 'slideUp 0.3s ease-out',
              background: 'var(--panel)',
              color:
                t.type === 'success'
                  ? 'var(--green)'
                  : t.type === 'levelup'
                    ? 'var(--purple)'
                    : 'var(--red)',
            }}
          >
            {t.text}
            {t.href && (
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'block',
                  fontSize: 9,
                  color: 'var(--dimmer)',
                  marginTop: 2,
                }}
              >
                solscan ↗
              </a>
            )}
          </div>
        ))}
      </div>

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(5,6,10,0.97)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--accent)', fontSize: 14 }}>☿</span>
          <div>
            <div
              style={{
                color: 'var(--text)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
              }}
            >
              FEED THE LOBSTER
            </div>
            <div style={{ color: 'var(--dimmer)', fontSize: 9, letterSpacing: '0.08em' }}>
              · live chamber score
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {wallet && <TrustBadge score={score} />}
          <WalletMultiButton />
        </div>
      </header>

      <div style={{ padding: '12px 20px 0', maxWidth: 1180, margin: '0 auto' }}>
        <ChamberStatsPanel stats={stats} loading={statsLoading} error={statsError} />
      </div>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 20px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,280px) minmax(0,1fr) minmax(0,320px)',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '14px 10px',
              }}
            >
              <LobsterSVG
                reaction={reaction}
                speech={speech}
                onReactionEnd={() => {
                  setReaction('idle')
                  setSpeech('Feed me... 🦞')
                }}
              />
            </div>

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    color: 'var(--dim)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  trust levels
                </span>
              </div>

              <div style={{ padding: '8px 0' }}>
                {TRUST_LEVELS.map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 14px',
                      background:
                        score >= l.min && TRUST_LEVELS.find((x) => x.min <= score) === l
                          ? 'rgba(123,156,255,0.05)'
                          : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: 11 }}>{l.emoji}</span>
                    <span style={{ color: l.color, fontSize: 10, fontWeight: 600, flex: 1 }}>
                      {l.label}
                    </span>
                    <span style={{ color: 'var(--dimmer)', fontSize: 9 }}>
                      {l.min === 0 ? '0+' : `${l.min}+`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ChamberLeaderboard stats={stats} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!wallet && (
              <div
                style={{
                  border: '1px dashed var(--border2)',
                  borderRadius: 6,
                  background: 'var(--panel)',
                  padding: '18px 16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🟣</div>
                <div style={{ color: 'var(--dim)', fontSize: 12, marginBottom: 14 }}>
                  connect phantom to feed klik
                </div>
                <WalletMultiButton />
              </div>
            )}

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    color: 'var(--dim)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  ◆ choose what to feed
                </span>
              </div>

              <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {SHOP_ITEMS.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelected(item)}
                    disabled={!wallet}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--red)',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    color: 'var(--dim)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  session feed
                </span>
              </div>

              <div style={{ padding: 12 }}>
                <LiveFeed events={feed} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChamberLiveFeed stats={stats} />

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                padding: 14,
              }}
            >
              <div
                style={{
                  color: 'var(--dim)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                how it works
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['🦞', 'feed klik with SOL'],
                  ['🏆', 'top chamber votes get signal bonus'],
                  ['📉', 'spammy messages drag trust down'],
                  ['💬', 'strong messages and votes lift it up'],
                  ['👑', 'trustless feed only mode is optional'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
                    <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: 'var(--dim)', fontSize: 10, lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--panel)',
                padding: 14,
              }}
            >
              <div style={{ color: 'var(--dimmer)', fontSize: 9, lineHeight: 1.8 }}>
                <div>all txns go directly to creator wallet</div>
                <div style={{ color: 'var(--dimmer)', wordBreak: 'break-all', marginTop: 4 }}>
                  Ghz2RotTtZKJeUFFNVfYV8NrB6TW5ZkJKQGcVYx31PvD
                </div>
                <div style={{ marginTop: 8 }}>non-custodial · no login · phantom only</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <BuyModal
          item={selected}
          onConfirm={handleBuy}
          onCancel={() => setSelected(null)}
          loading={loading}
        />
      )}
    </div>
  )
}
