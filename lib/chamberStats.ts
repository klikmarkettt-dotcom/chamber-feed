export interface ChamberMember {
  rank: number
  username: string
  position: number
  score: number
  votesUsed: number
  votesLeft: number
  lastMessage: string
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
}

export interface LiveFeedItem {
  username: string
  position: number
  score: number
  message: string
  time: string
}

function parseStat(text: string, label: string): number {
  const regex = new RegExp(label + '[^\\d]*(\\d[\\d,]*)')
  const m = text.match(regex)
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0
}

export async function fetchChamberStats(): Promise<ChamberStats> {
  const res = await fetch('https://chamber-stats.vercel.app/', {
    next: { revalidate: 15 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; feed-the-lobster/1.0)' }
  })
  const html = await res.text()

  // Parse key stats from text
  const activeMembers = parseStat(html, 'Active Members')
  const totalVotes = parseStat(html, 'Total Votes')
  const votesCast = parseStat(html, 'Cast')
  const votesPending = parseStat(html, 'Pending')
  const totalMessages = parseStat(html, 'Messages')
  const lastSeqM = html.match(/#([\d,]+)/)
  const lastSeq = lastSeqM ? parseInt(lastSeqM[1].replace(/,/g, ''), 10) : 0

  const updatedM = html.match(/updated —(\d+)/)
  const updatedAt = updatedM ? updatedM[1] : '0'

  // Parse members table - look for rows with @username pattern
  const members: ChamberMember[] = []
  // Match table rows: #N @username #pos score votes left message
  const rowRegex = /#(\d+)\s+@(\w+)\s+#([\d,]+)\s+(-?\d+)\s+(\d+)\s+(\d+)\s+"([^"]*?)"/g
  let m: RegExpExecArray | null
  while ((m = rowRegex.exec(html)) !== null) {
    members.push({
      rank: parseInt(m[1], 10),
      username: m[2],
      position: parseInt(m[3].replace(/,/g, ''), 10),
      score: parseInt(m[4], 10),
      votesUsed: parseInt(m[5], 10),
      votesLeft: parseInt(m[6], 10),
      lastMessage: m[7],
    })
  }

  // Parse live feed
  const liveFeed: LiveFeedItem[] = []
  const feedRegex = /@(\w+)#([\d,]+)\+(-?\d+)\s+—\s+"([^"]+)"/g
  let f: RegExpExecArray | null
  while ((f = feedRegex.exec(html)) !== null && liveFeed.length < 20) {
    liveFeed.push({
      username: f[1],
      position: parseInt(f[2].replace(/,/g, ''), 10),
      score: parseInt(f[3], 10),
      message: f[4],
      time: new Date().toISOString(),
    })
  }

  return {
    activeMembers,
    totalVotes,
    votesCast,
    votesPending,
    totalMessages,
    lastSeq,
    members,
    liveFeed,
    updatedAt,
  }
}
