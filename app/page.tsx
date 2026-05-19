'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton as RawWalletMultiButton } from '@solana/wallet-adapter-react-ui'

const WalletMultiButton: any = RawWalletMultiButton

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
  const [speech, setSpeech] = useState('Support Klik 🦞')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [noWalletModal, setNoWalletModal] = useState(false)

  const tid = useRef(0)

  const toast = useCallback((text: string, type: Toast['type'], href?: string) => {
    const id = ++tid.current
    setToasts((p) => [...p, { id, text, type, href }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5000)
  }, [])

  useEffect(() => {
    if (levelUp) toast(`🎉 LEVEL UP · ${levelUp}`, 'levelup')
  }, [levelUp, toast])

  useEffect(() => {
    if (reaction !== 'idle') return
    const phrases = [
      'Support Klik 🦞',
      'chamber is watching 👁',
      'donations fuel the mission 🌊',
      'trust is earned, not given 🦐',
      'claws ready... 🦀',
    ]
    const iv = setInterval(() => {
      setSpeech(phrases[Math.floor(Math.random() * phrases.length)])
    }, 4000)
    return () => clearInterval(iv)
  }, [reaction])

  function handleItemClick(item: ShopItem) {
    if (!wallet) {
      setNoWalletModal(true)
      return
    }
    setSelected(item)
  }

  async function handleBuy({ tip, grantTrust }: { tip: number; grantTrust: boolean }) {
    if (!selected) return
    try {
      const result = await pay({ amountSol: selected.price, tipSol: tip })
      setReaction(selected.reaction)
      setSpeech(selected.speech)
      if (grantTrust) addScore(selected.trustBoost)
      if (wallet) {
        setFeed((p) => [
          {
            id: result.signature,
            wallet,
            itemName: selected.name,
            itemEmoji: selected.emoji,
            price: selected.price,
            trustBoost: selected.trustBoost,
            grantTrust,
            signature: result.signature,
            when: Date.now(),
          },
          ...p,
        ].slice(0, 10))
      }
      toast(`✓ donated! +${selected.trustBoost} trust`, 'success', result.explorerUrl)
      setSelected(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setReaction('sad')
      setSpeech('Oof... 😢')
      toast(
        `✗ ${msg.includes('rejected') ? 'rejected' : msg.includes('funds') ? 'insufficient funds' : 'transaction failed'}`,
        'error'
      )
      setSelected(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* TOASTS */}
      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 60, display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
            style={{
              border: '1px solid',
              borderColor: t.type === 'success' ? 'rgba(74,255,154,0.3)' : t.type === 'levelup' ? 'rgba(184,123,255,0.4)' : 'rgba(255,74,110,0.3)',
              borderRadius: 5,
              padding: '8px 12px',
              fontSize: 11,
              cursor: 'pointer',
              animation: 'slideUp 0.3s ease-out',
              background: 'var(--panel)',
              color: t.type === 'success' ? 'var(--green)' : t.type === 'levelup' ? 'var(--purple)' : 'var(--red)',
            }}
          >
            {t.text}
            {t.href && (
              
                href={t.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'block', fontSize: 9, color: 'var(--dimmer)', marginTop: 2 }}
              >
                solscan ↗
              </a>
            )}
          </div>
        ))}
      </div>

      {/* NO WALLET MODAL */}
      {noWalletModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={() => setNoWalletModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 360, background: 'var(--panel)', border: '1px solid var(--border2)', borderRadius: 8, padding: 24, textAlign: 'center' }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🟣</div>
            <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>connect your wallet</div>
            <div style={{ color: 'var(--dim)', fontSize: 11, marginBottom: 20, lineHeight: 1.6 }}>
              to donate you need a Phantom wallet connected. it takes 10 seconds.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <WalletMultiButton />
            </div>
            <button
              onClick={() => setNoWalletModal(false)}
              style={{ fontSize: 10, color: 'var(--dimmer)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              maybe later
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 30, background: 'rgba(5,6,10,0.97)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--accent)', fontSize: 14 }}>☿</span>
          <div>
            <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em' }}>
              LOBSTER WILDE
            </div>
            <div style={{ color: 'var(--dimmer)', fontSize: 9, letterSpacing: '0.08em' }}>
              
                href="https://chamber-stats.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                · chamber-stats.vercel.app
              </a>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {wallet && <TrustBadge score={score} />}
          <WalletMultiButton />
        </div>
      </header>

      {/* CHAMBER STATS */}
      <div style={{ padding: '12px 20px 0', maxWidth: 1200, margin: '0 auto' }}>
        <ChamberStatsPanel stats={stats} loading={statsLoading} error={statsError} />
      </div>

      {/* MAIN GRID */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) minmax(0,1fr)', gap: 16 }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 12px' }}>
              <LobsterSVG
                reaction={reaction}
                speech={speech}
                onReactionEnd={() => { setReaction('idle'); setSpeech('Support Klik 🦞') }}
              />
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
                <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>trust levels</span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {TRUST_LEVELS.map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px' }}>
                    <span style={{ fontSize: 11 }}>{l.emoji}</span>
                    <span style={{ color: l.color, fontSize: 10, fontWeight: 600, flex: 1 }}>{l.label}</span>
                    <span style={{ color: 'var(--dimmer)', fontSize: 9 }}>{l.min === 120 ? '120+' : `${l.min}+`}</span>
                  </div>
                ))}
              </div>
            </div>

            <ChamberLeaderboard stats={stats} />
          </div>

          {/* MIDDLE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
                <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>◆ support klik · donate SOL</span>
              </div>
              <div style={{ padding: '10px 14px 6px', color: 'var(--dimmer)', fontSize: 10, lineHeight: 1.6 }}>
                all donations go directly to the creator wallet. no login required — just connect &amp; send.
              </div>
              <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {SHOP_ITEMS.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    disabled={false}
                  />
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
                <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>session donations</span>
              </div>
              <div style={{ padding: 12 }}>
                <LiveFeed events={feed} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChamberLiveFeed stats={stats} />

            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', padding: 14 }}>
              <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                how trust works
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['🏆', 'chamber top voters earn the highest trust score'],
                  ['📉', 'spamming the chat reduces your trust'],
                  ['💡', 'smart messages that get upvoted = +trust'],
                  ['👑', '120+ pts = CHAMBER LEGEND status'],
                  ['🦞', 'donating supports klik directly'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
                    <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: 'var(--dim)', fontSize: 10, lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', padding: 14 }}>
              <div style={{ color: 'var(--dimmer)', fontSize: 9, lineHeight: 1.8 }}>
                <div>donations go directly to creator wallet</div>
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
