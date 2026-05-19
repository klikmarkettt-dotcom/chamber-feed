'use client'
import type { ChamberStats } from '@/lib/chamberStats'

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ borderRight: '1px solid var(--border)', padding: '12px 16px', minWidth: 80 }}>
      <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </div>
  )
}

export function ChamberStatsPanel({ stats, loading, error }: {
  stats: ChamberStats | null
  loading: boolean
  error: string | null
}) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
        <span style={{ color: 'var(--accent)', fontSize: 11 }}>☿</span>
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>THE CHAMBER</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          {loading
            ? <span style={{ color: 'var(--dimmer)', fontSize: 10 }}>syncing…</span>
            : error
            ? <span style={{ color: 'var(--red)', fontSize: 10 }}>{error}</span>
            : <>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ color: 'var(--dim)', fontSize: 10 }}>LIVE · 15s</span>
              </>
          }
        </span>
      </div>

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          <StatBox label="ACTIVE" value={stats.activeMembers} />
          <StatBox label="VOTES" value={stats.totalVotes} />
          <StatBox label="CAST" value={stats.votesCast} />
          <StatBox label="MSGS" value={stats.totalMessages} />
          <div style={{ padding: '12px 16px', minWidth: 80 }}>
            <div style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.1em', marginBottom: 2 }}>LAST SEQ</div>
            <div style={{ color: 'var(--dim)', fontSize: 16, fontWeight: 600 }}>#{stats.lastSeq.toLocaleString()}</div>
          </div>
        </div>
      )}
      {!stats && !loading && (
        <div style={{ padding: '16px', color: 'var(--dimmer)', fontSize: 11 }}>unable to reach chamber</div>
      )}
    </div>
  )
}

export function ChamberLeaderboard({ stats }: { stats: ChamberStats | null }) {
  if (!stats || !stats.members.length) return null
  const top = stats.members.slice(0, 10)

  function scoreColor(score: number) {
    if (score >= 40) return 'var(--gold)'
    if (score >= 20) return 'var(--purple)'
    if (score >= 10) return 'var(--accent)'
    if (score >= 5) return 'var(--green)'
    if (score < 0) return 'var(--red)'
    return 'var(--dim)'
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
        <span style={{ color: 'var(--gold)', fontSize: 11 }}>🏆</span>
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Top Scored · Chamber</span>
        <a href="https://chamber-stats.vercel.app/" target="_blank" rel="noreferrer"
          style={{ marginLeft: 'auto', color: 'var(--dimmer)', fontSize: 10, textDecoration: 'none' }}>
          ↗ full stats
        </a>
      </div>
      <div style={{ padding: '4px 0' }}>
        {top.map((m, i) => (
          <div key={m.username} style={{
            display: 'grid',
            gridTemplateColumns: '24px 1fr 40px 50px',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderBottom: i < top.length - 1 ? '1px solid rgba(26,32,48,0.5)' : 'none',
            animation: 'fadeIn 0.3s ease-out',
          }}>
            <span style={{ color: 'var(--dimmer)', fontSize: 10, textAlign: 'right' }}>#{m.rank}</span>
            <div>
              <span style={{ color: 'var(--text)', fontSize: 11 }}>@{m.username}</span>
              {m.lastMessage && (
                <div style={{ color: 'var(--dimmer)', fontSize: 9, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 160 }}>
                  "{m.lastMessage}"
                </div>
              )}
            </div>
            <span style={{ color: scoreColor(m.score), fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
              {m.score > 0 ? '+' : ''}{m.score}
            </span>
            <span style={{ color: 'var(--dimmer)', fontSize: 9, textAlign: 'right' }}>
              {m.votesUsed}v used
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChamberLiveFeed({ stats }: { stats: ChamberStats | null }) {
  if (!stats || !stats.liveFeed.length) return null

  function scoreColor(score: number) {
    if (score >= 5) return 'var(--gold)'
    if (score >= 1) return 'var(--green)'
    if (score < 0) return 'var(--red)'
    return 'var(--dim)'
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--panel)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
        <span style={{ color: 'var(--dim)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Chamber · live feed</span>
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto', padding: '4px 0' }}>
        {stats.liveFeed.map((item, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 32px',
            gap: 8,
            alignItems: 'start',
            padding: '5px 14px',
            borderBottom: i < stats.liveFeed.length - 1 ? '1px solid rgba(26,32,48,0.4)' : 'none',
          }}>
            <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 500 }}>@{item.username}</span>
            <span style={{ color: 'var(--dim)', fontSize: 10, lineHeight: 1.4 }}>"{item.message}"</span>
            <span style={{ color: scoreColor(item.score), fontSize: 10, fontWeight: 600, textAlign: 'right' }}>
              {item.score > 0 ? '+' : ''}{item.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
