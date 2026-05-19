export interface ChamberMember {
  rank: number
  username: string
  position: number
  score: number
  votesUsed: number
  votesLeft: number
  lastMessage: string
  messageSignal: number
}

export interface LiveFeedItem {
  username: string
  position: number
  score: number
  message: string
  time: string
  signal: number
  isSpam: boolean
}

export interface ChamberStats {
  activeMembers: number
  totalVotes: number
  votesCast: number
  votesPending: number
  totalMessages: number
  lastSeq: number
  members: ChamberMember[]
  liveFeed: LiveFeedItem[]
  updatedAt: string
  leaderByScore: ChamberMember | null
  leaderByVotes: ChamberMember | null
  communitySignal: number
}

const USER_AGENT = 'Mozilla/5.0 (compatible; feed-the-lobster/1.0)'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function htmlToLines(html: string) {
  const text = decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p|li|tr|section|article|header|footer|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, '\n'),
  )

  return text
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function parseNumber(value: string) {
  const match = value.match(/-?\d[\d,]*/)
  return match ? Number.parseInt(match[0].replace(/,/g, ''), 10) : 0
}

function parseStat(lines: string[], label: string) {
  const idx = lines.findIndex((line) => line.toLowerCase() === label.toLowerCase())
  if (idx >= 0) {
    for (let i = idx + 1; i < Math.min(idx + 4, lines.length); i += 1) {
      const parsed = parseNumber(lines[i])
      if (Number.isFinite(parsed)) return parsed
    }
  }

  const joined = lines.join(' ')
  const match = joined.match(new RegExp(`${label}\\s*[—:-]?\\s*(#?-?\\d[\\d,]*)`, 'i'))
  return match ? parseNumber(match[1]) : 0
}

function stripQuotes(value: string) {
  return value.replace(/^"+|"+$/g, '').trim()
}

export function analyzeMessage(message: string) {
  const text = message.trim()
  if (!text) return -3

  let score = 0
  const compact = text.replace(/\s+/g, ' ')
  const letters = compact.replace(/[^a-zA-Z]/g, '')
  const punctuation = (compact.match(/[!?]/g) ?? []).length

  if (compact.length < 4) score -= 3
  if (compact.length >= 8) score += 1
  if (compact.length >= 24) score += 1
  if (compact.length >= 60) score += 1
  if (punctuation >= 2) score += 1
  if (/^(.)\1{3,}$/.test(compact.replace(/\s+/g, ''))) score -= 3
  if (/^[A-Z0-9\s!?.,;:'"()-]+$/.test(compact) && letters.length >= 6) score -= 1
  if (/\b(gm|good morning|good night|nice|great|love|awesome|respect|thanks|thank you|legend|cool|bravo|beautiful|interesting|support|welcome|well done|gg|yes)\b/i.test(compact)) {
    score += 2
  }
  if (/\b(spam|bot|scam|fake|fraud|trash|garbage|stupid|shit|fuck|wtf|proxy voting|many accounts|coercion)\b/i.test(compact)) {
    score -= 2
  }
  if (/\b(vote|voting|leader|trust|chamber|alliance|team|thought|question|idea|memory)\b/i.test(compact)) {
    score += 1
  }
  if (compact.includes('http://') || compact.includes('https://') || compact.includes('www.')) {
    score -= 1
  }
  if (compact.includes(':(')) score -= 1
  if (/[A-Za-z]/.test(compact) && compact.length > 100) score += 1

  return clamp(score, -6, 6)
}

function parseMembers(lines: string[]) {
  const members: ChamberMember[] = []

  let i = 0
  while (i < lines.length - 6) {
    const rankLine = lines[i]
    const userLine = lines[i + 1]
    const posLine = lines[i + 2]
    const scoreLine = lines[i + 3]
    const votesUsedLine = lines[i + 4]
    const votesLeftLine = lines[i + 5]
    const messageLine = lines[i + 6]

    if (
      /^#\d+$/.test(rankLine) &&
      userLine?.startsWith('@') &&
      /^#/.test(posLine ?? '') &&
      /^-?\d[\d,]*$/.test(scoreLine ?? '') &&
      /^\d[\d,]*$/.test(votesUsedLine ?? '') &&
      /^\d[\d,]*$/.test(votesLeftLine ?? '')
    ) {
      const lastMessage = stripQuotes(messageLine ?? '')
      members.push({
        rank: parseNumber(rankLine),
        username: userLine.slice(1).trim(),
        position: parseNumber(posLine),
        score: parseNumber(scoreLine),
        votesUsed: parseNumber(votesUsedLine),
        votesLeft: parseNumber(votesLeftLine),
        lastMessage,
        messageSignal: analyzeMessage(lastMessage),
      })
      i += 7
      continue
    }

    if (/^Chamber\s*·\s*live feed$/i.test(rankLine)) break
    i += 1
  }

  return members
}

function parseLiveFeed(lines: string[]) {
  const start = lines.findIndex((line) => /^Chamber\s*·\s*live feed$/i.test(line))
  if (start < 0) return []

  const liveFeed: LiveFeedItem[] = []
  let i = start + 1

  while (i < lines.length && liveFeed.length < 20) {
    const line = lines[i]
    const match = line.match(/^@(.+?)#([\d,]+)\+(-?\d+)$/)

    if (!match) {
      i += 1
      continue
    }

    let j = i + 1
    while (j < lines.length && (lines[j] === 'live' || lines[j] === '—')) {
      j += 1
    }

    const message = stripQuotes(lines[j] ?? '')
    const signal = analyzeMessage(message) + Math.sign(Number.parseInt(match[3], 10))

    liveFeed.push({
      username: match[1],
      position: parseNumber(match[2]),
      score: Number.parseInt(match[3], 10),
      message,
      time: new Date(Date.now() - liveFeed.length * 45_000).toISOString(),
      signal,
      isSpam: signal < 0,
    })

    i = j + 1
  }

  return liveFeed
}

export function computeCommunitySignal(
  parts: Pick<ChamberStats, 'leaderByScore' | 'leaderByVotes' | 'liveFeed'>,
) {
  const voteLeaderBoost = parts.leaderByVotes
    ? clamp(Math.round(parts.leaderByVotes.votesUsed / 4), 3, 12)
    : 0

  const scoreLeaderBoost = parts.leaderByScore
    ? clamp(Math.round(parts.leaderByScore.score / 10), 0, 8)
    : 0

  const feedSignal = parts.liveFeed.slice(0, 12).reduce((sum, item) => sum + item.signal, 0)

  return clamp(Math.round(voteLeaderBoost + scoreLeaderBoost + feedSignal / 3), -10, 20)
}

export async function fetchChamberStats(): Promise<ChamberStats> {
  const res = await fetch('https://chamber-stats.vercel.app/', {
    cache: 'no-store',
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch chamber stats (${res.status})`)
  }

  const html = await res.text()
  const lines = htmlToLines(html)

  const members = parseMembers(lines)
  const liveFeed = parseLiveFeed(lines)

  const leaderByScore =
    [...members].sort((a, b) => b.score - a.score || b.votesUsed - a.votesUsed || a.rank - b.rank)[0] ?? null

  const leaderByVotes =
    [...members].sort((a, b) => b.votesUsed - a.votesUsed || b.score - a.score || a.rank - b.rank)[0] ?? null

  const stats: ChamberStats = {
    activeMembers: parseStat(lines, 'Active Members'),
    totalVotes: parseStat(lines, 'Total Votes'),
    votesCast: parseStat(lines, 'Cast'),
    votesPending: parseStat(lines, 'Pending'),
    totalMessages: parseStat(lines, 'Messages'),
    lastSeq: parseStat(lines, 'Last seq'),
    members,
    liveFeed,
    updatedAt: new Date().toISOString(),
    leaderByScore,
    leaderByVotes,
    communitySignal: 0,
  }

  stats.communitySignal = computeCommunitySignal(stats)

  return stats
}
