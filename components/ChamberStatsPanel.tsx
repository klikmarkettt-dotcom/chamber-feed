'use client'

import type { ChamberMember, ChamberStats, LiveFeedItem } from '@/lib/chamberStats'

function fmt(value: number) {
  return value.toLocaleString()
}

function scoreColor(score: number) {
  if (score >= 8) return 'var(--gold)'
  if (score >= 4) return 'var(--green)'
  if (score >= 1) return 'var(--accent)'
  if (score < 0) return 'var(--red)'
  return 'var(--dim)'
}

function signalLabel(signal: number) {
  if (signal >= 10) return 'clean'
  if (signal >= 4) return 'good'
  if (signal >= 0) return 'steady'
  if (signal >= -4) return 'noisy'
  return 'spammy'
}

function signalColor(signal: number) {
  if (signal >= 10) return 'var(--green)'
  if (signal >= 4) return 'var(--accent)'
  if (signal >= 0) return 'var(--dim)'
  if (signal >= -4) return 'var(--gold)'
  return 'var(--red)'
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ borderRight: '1px solid var(--border)', padding: '10px 14px', minWidth: 84 }}>
      <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.1em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>
        {typeof value === 'number' ? fmt(value) : value}
      </div>
    </div>
  )
}

function MiniLeaderCard({
  title,
  member,
}: {
  title: string
  member: ChamberMember | null
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'rgba(0,0,0,0.25)',
        padding: 12,
        minHeight: 96,
      }}
    >
      <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {title}
      </div>

      {!member ? (
        <div style={{ color: 'var(--dimmer)', fontSize: 11, marginTop: 10 }}>no data</div>
      ) : (
        <>
          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            @{member.username}
          </div>
          <div style={{ color: 'var(--dimmer)', fontSize: 10, marginTop: 4 }}>
            pos #{fmt(member.position)} · votes {fmt(member.votesUsed)} · left {fmt(member.votesLeft)}
          </div>
          <div style={{ color: scoreColor(member.score), fontSize: 11, fontWeight: 600, marginTop: 6 }}>
            score {member.score > 0 ? '+' : ''}
            {member.score}
          </div>
        </>
      )}
    </div>
  )
}

export function ChamberStatsPanel({
  stats,
  loading,
  error,
}: {
  stats: ChamberStats | null
  loading: boolean
  error: string | null
}) {
  const voteLeader = stats?.leaderByVotes ?? null
  const scoreLeader = stats?.leaderByScore ?? null

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
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
        <span style={{ color: 'var(--accent)', fontSize: 11 }}>☿</span>
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          THE CHAMBER
        </span>

        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading ? (
            <span style={{ color: 'var(--dimmer)', fontSize: 10 }}>syncing…</span>
          ) : error ? (
            <span style={{ color: 'var(--red)', fontSize: 10 }}>{error}</span>
          ) : (
            <>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  display: 'inline-block',
                  animation: 'blink 1.5s infinite',
                }}
              />
              <span style={{ color: 'var(--dim)', fontSize: 10 }}>LIVE · 12s</span>
            </>
          )}
        </span>
      </div>

      {stats && (
        <>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <StatBox label="ACTIVE" value={stats.activeMembers} />
            <StatBox label="VOTES" value={stats.totalVotes} />
            <StatBox label="CAST" value={stats.votesCast} />
            <StatBox label="PENDING" value={stats.votesPending} />
            <StatBox label="MSGS" value={stats.totalMessages} />
            <StatBox label="LAST SEQ" value={`#${fmt(stats.lastSeq)}`} />
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
            }}
          >
            <MiniLeaderCard title="top scored" member={scoreLeader} />
            <MiniLeaderCard title="vote leader" member={voteLeader} />
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'rgba(0,0,0,0.25)',
                padding: 12,
                minHeight: 96,
              }}
            >
              <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                community signal
              </div>
              <div style={{ color: signalColor(stats.communitySignal), fontSize: 26, fontWeight: 700, marginTop: 8 }}>
                {stats.communitySignal >= 0 ? '+' : ''}
                {stats.communitySignal}
              </div>
              <div style={{ color: 'var(--dimmer)', fontSize: 10, marginTop: 4 }}>
                {signalLabel(stats.communitySignal)}
              </div>
            </div>
          </div>
        </>
      )}

      {!stats && !loading && (
        <div style={{ padding: '16px', color: 'var(--dimmer)', fontSize: 11 }}>unable to reach chamber</div>
      )}
    </div>
  )
}

export function ChamberLeaderboard({ stats }: { stats: ChamberStats | null }) {
  if (!stats || !stats.members.length) return null

  const top = [...stats.members]
    .sort((a, b) => b.score - a.score || b.votesUsed - a.votesUsed || a.rank - b.rank)
    .slice(0, 10)

  const voteLeader = stats.leaderByVotes ?? null

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
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
        <span style={{ color: 'var(--gold)', fontSize: 11 }}>🏆</span>
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Top scored · chamber
        </span>
        {voteLeader && (
          <span
            style={{
              marginLeft: 'auto',
              color: 'var(--dimmer)',
              fontSize: 10,
            }}
          >
            vote leader @{voteLeader.username} · {fmt(voteLeader.votesUsed)} votes
          </span>
        )}
      </div>

      <div style={{ padding: '4px 0' }}>
        {top.map((m, i) => {
          const isVoteLeader = voteLeader?.username === m.username

          return (
            <div
              key={`${m.username}-${m.rank}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr 56px 52px',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderBottom: i < top.length - 1 ? '1px solid rgba(26,32,48,0.5)' : 'none',
                animation: 'fadeIn 0.3s ease-out',
                background: isVoteLeader ? 'rgba(232,200,74,0.06)' : 'transparent',
              }}
            >
              <span style={{ color: 'var(--dimmer)', fontSize: 10, textAlign: 'right' }}>
                #{m.rank}
              </span>

              <div>
                <span style={{ color: 'var(--text)', fontSize: 11 }}>@{m.username}</span>
                {m.lastMessage && (
                  <div
                    style={{
                      color: 'var(--dimmer)',
                      fontSize: 9,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: 170,
                    }}
                  >
                    "{m.lastMessage}"
                  </div>
                )}
              </div>

              <span style={{ color: scoreColor(m.score), fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                {m.score > 0 ? '+' : ''}
                {m.score}
              </span>

              <span style={{ color: 'var(--dimmer)', fontSize: 9, textAlign: 'right' }}>
                {m.votesUsed}v
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChamberLiveFeed({ stats }: { stats: ChamberStats | null }) {
  if (!stats || !stats.liveFeed.length) return null

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
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
            animation: 'blink 1.5s infinite',
          }}
        />
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Chamber · live feed
        </span>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
        {stats.liveFeed.map((item: LiveFeedItem, i: number) => (
          <div
            key={`${item.username}-${i}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '104px 1fr 58px',
              gap: 8,
              alignItems: 'start',
              padding: '5px 14px',
              borderBottom: i < stats.liveFeed.length - 1 ? '1px solid rgba(26,32,48,0.4)' : 'none',
            }}
          >
            <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 500 }}>
              @{item.username}
            </span>

            <span style={{ color: 'var(--dim)', fontSize: 10, lineHeight: 1.4 }}>
              "{item.message}"
            </span>

            <span
              style={{
                color: signalColor(item.signal),
                fontSize: 10,
                fontWeight: 600,
                textAlign: 'right',
              }}
            >
              {item.signal > 0 ? '+' : ''}
              {item.signal} · {signalLabel(item.signal)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
