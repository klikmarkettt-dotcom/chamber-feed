'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
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

const WalletMultiButton = dynamic(
  async () => {
    const mod = await import('@solana/wallet-adapter-react-ui')
    return mod.WalletMultiButton as any
  },
  { ssr: false }
)

interface Toast {
  id: number
  text: string
  type: 'success' | 'error' | 'levelup'
  href?: string
}

export default function Page() {
  const { publicKey } = useWallet()
  const wallet = publicKey?.toBase58() ?? null

  const { stats, loading: statsLoading, error: statsError } =
    useChamberStats()

  const { score, addScore, levelUp } = useTrustScore(wallet, stats)

  const { pay, loading } = useSolanaPayment()

  const [selected, setSelected] = useState<ShopItem | null>(null)
  const [reaction, setReaction] =
    useState<LobsterReaction>('idle')

  const [speech, setSpeech] =
    useState('Feed me... 🦞')

  const [toasts, setToasts] = useState<Toast[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])

  const tid = useRef(0)

  const toast = useCallback(
    (
      text: string,
      type: Toast['type'],
      href?: string
    ) => {
      const id = ++tid.current

      setToasts((p) => [
        ...p,
        { id, text, type, href },
      ])

      setTimeout(() => {
        setToasts((p) =>
          p.filter((t) => t.id !== id)
        )
      }, 5000)
    },
    []
  )

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

    const iv = setInterval(() => {
      setSpeech(
        phrases[
          Math.floor(Math.random() * phrases.length)
        ]
      )
    }, 4000)

    return () => clearInterval(iv)
  }, [reaction])

  async function handleBuy(tip: number) {
    if (!selected) return

    try {
      const result = await pay({
        amountSol: selected.price,
        tipSol: tip,
      })

      setReaction(selected.reaction)
      setSpeech(selected.speech)

      addScore(selected.trustBoost)

      if (wallet) {
        setFeed((p) => [
          {
            id: result.signature,
            wallet,
            itemName: selected.name,
            itemEmoji: selected.emoji,
            price: selected.price,
            trustBoost: selected.trustBoost,
            signature: result.signature,
            when: Date.now(),
          },
          ...p,
        ].slice(0, 10))
      }

      toast(
        `✓ fed! +${selected.trustBoost} trust earned`,
        'success',
        result.explorerUrl
      )

      setSelected(null)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : ''

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
        'error'
      )

      setSelected(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <div>🦞</div>
          <div>FEED THE LOBSTER</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {wallet && <TrustBadge score={score} />}
          <WalletMultiButton />
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 20,
        }}
      >
        <ChamberStatsPanel
          stats={stats}
          loading={statsLoading}
          error={statsError}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr 1fr',
            gap: 16,
            marginTop: 20,
          }}
        >
          <div>
            <LobsterSVG
              reaction={reaction}
              speech={speech}
              onReactionEnd={() => {
                setReaction('idle')
                setSpeech('Feed me... 🦞')
              }}
            />

            <ChamberLeaderboard stats={stats} />
          </div>

          <div>
            {!wallet && (
              <div style={{ marginBottom: 20 }}>
                <WalletMultiButton />
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 10,
              }}
            >
              {SHOP_ITEMS.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  onClick={() =>
                    setSelected(item)
                  }
                  disabled={!wallet}
                />
              ))}
            </div>
          </div>

          <div>
            <ChamberLiveFeed stats={stats} />

            <div style={{ marginTop: 20 }}>
              <LiveFeed events={feed} />
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <BuyModal
          item={selected}
          onConfirm={handleBuy}
          onCancel={() =>
            setSelected(null)
          }
          loading={loading}
        />
      )}
    </div>
  )
              }
