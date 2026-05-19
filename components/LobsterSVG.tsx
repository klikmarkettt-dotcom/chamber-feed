'use client'
import { useEffect, useState } from 'react'
import type { LobsterReaction } from '@/lib/items'

export function LobsterSVG({ reaction, speech, onReactionEnd }: {
  reaction: LobsterReaction; speech: string; onReactionEnd?: () => void
}) {
  const [isGold, setIsGold] = useState(false)
  const [showCrown, setShowCrown] = useState(false)
  const [bodyClass, setBodyClass] = useState('animate-bob')
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (reaction === 'idle') { setBodyClass('animate-bob'); setIsGold(false); setShowCrown(false); setShowOverlay(false); return }
    const map: Record<LobsterReaction, string> = {
      idle: 'animate-bob', nibble: 'animate-nibble', 'happy-dance': 'animate-wiggle',
      'excited-claws': 'animate-wiggle', 'content-sway': 'animate-sway', slurp: 'animate-sway',
      'big-celebration': 'animate-spin360', 'mega-dance': 'animate-megaDance', crown: 'animate-bob',
      'screen-shake': 'animate-shake', 'royal-feast': 'animate-megaDance', sad: 'animate-droopIn',
    }
    setBodyClass(map[reaction] || 'animate-bob')
    if (reaction === 'crown') { setShowCrown(true); setTimeout(() => setShowCrown(false), 5000) }
    if (reaction === 'royal-feast') {
      setIsGold(true); setShowOverlay(true)
      launchConfetti()
      setTimeout(() => { setShowOverlay(false); setTimeout(() => { setIsGold(false); setBodyClass('animate-bob'); onReactionEnd?.() }, 500) }, 5000)
      return
    }
    if (reaction === 'screen-shake') {
      document.body.style.animation = 'shake 0.8s ease-in-out'
      setTimeout(() => { document.body.style.animation = '' }, 800)
    }
    const dur: Record<LobsterReaction, number> = {
      idle: 0, nibble: 1600, 'happy-dance': 600, 'excited-claws': 600, 'content-sway': 1200,
      slurp: 1200, 'big-celebration': 800, 'mega-dance': 3000, crown: 5000, 'screen-shake': 800,
      'royal-feast': 6000, sad: 2000,
    }
    const t = setTimeout(() => { setBodyClass('animate-bob'); onReactionEnd?.() }, dur[reaction] || 1500)
    return () => clearTimeout(t)
  }, [reaction, onReactionEnd])

  const bc = isGold ? '#FFD700' : '#C0392B'
  const sc = isGold ? '#F4C430' : '#9B2222'
  const cc = isGold ? '#FFD700' : '#B03020'
  const ac = isGold ? '#DAA520' : '#8B1A1A'

  return (
    <div className="relative flex flex-col items-center">
      {showOverlay && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, rgba(0,0,0,0.6) 100%)' }}>
          <div className="text-center animate-scaleIn">
            <div className="text-8xl mb-4">👑</div>
            <div className="text-4xl font-bold text-yellow-400 tracking-widest" style={{ textShadow: '0 0 30px gold' }}>CHAMBER LEGEND</div>
          </div>
        </div>
      )}
      {showCrown && <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-scaleIn z-10 text-4xl">✨👑✨</div>}
      <div className="mb-4">
        <div className="px-4 py-2 rounded-2xl text-sm font-bold border"
          style={{ background: 'rgba(20,8,8,0.9)', borderColor: isGold ? '#FFD700' : '#9B2222', color: isGold ? '#FFD700' : '#FFF' }}>
          {speech}
        </div>
      </div>
      <div className={bodyClass} style={{ filter: isGold ? 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' : 'drop-shadow(0 0 8px rgba(200,60,40,0.4))' }}>
        <svg viewBox="0 0 200 220" width="200" height="220" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="30" x2="40" y2="0" stroke={ac} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="120" y1="30" x2="160" y2="0" stroke={ac} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="52" cy="95" rx="12" ry="8" fill={cc} transform="rotate(-30 52 95)" />
          <ellipse cx="30" cy="108" rx="20" ry="10" fill={cc} transform="rotate(-20 30 108)" />
          <ellipse cx="22" cy="98" rx="15" ry="7" fill={bc} transform="rotate(-30 22 98)" />
          <ellipse cx="148" cy="95" rx="12" ry="8" fill={cc} transform="rotate(30 148 95)" />
          <ellipse cx="170" cy="108" rx="20" ry="10" fill={cc} transform="rotate(20 170 108)" />
          <ellipse cx="178" cy="98" rx="15" ry="7" fill={bc} transform="rotate(30 178 98)" />
          <ellipse cx="100" cy="90" rx="46" ry="52" fill={bc} />
          <ellipse cx="100" cy="72" rx="36" ry="16" fill={sc} opacity="0.6" />
          <ellipse cx="100" cy="88" rx="40" ry="14" fill={sc} opacity="0.4" />
          <ellipse cx="100" cy="104" rx="36" ry="12" fill={sc} opacity="0.3" />
          <ellipse cx="100" cy="45" rx="32" ry="24" fill={bc} />
          <polygon points="100,10 94,32 106,32" fill={cc} />
          <circle cx="84" cy="38" r="8" fill={isGold ? '#8B6914' : '#1a1a1a'} />
          <circle cx="116" cy="38" r="8" fill={isGold ? '#8B6914' : '#1a1a1a'} />
          <circle cx="84" cy="38" r="4" fill="#000" />
          <circle cx="116" cy="38" r="4" fill="#000" />
          <circle cx="86" cy="36" r="1.5" fill="white" opacity="0.8" />
          <circle cx="118" cy="36" r="1.5" fill="white" opacity="0.8" />
          <line x1="68" y1="110" x2="42" y2="135" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="118" x2="46" y2="148" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="128" x2="50" y2="158" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <line x1="132" y1="110" x2="158" y2="135" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="118" x2="154" y2="148" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="128" x2="150" y2="158" stroke={cc} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="100" cy="148" rx="32" ry="22" fill={bc} />
          <ellipse cx="100" cy="165" rx="26" ry="18" fill={bc} />
          <ellipse cx="100" cy="180" rx="20" ry="14" fill={bc} />
          <ellipse cx="80" cy="196" rx="14" ry="7" fill={cc} transform="rotate(-20 80 196)" />
          <ellipse cx="100" cy="200" rx="14" ry="7" fill={cc} />
          <ellipse cx="120" cy="196" rx="14" ry="7" fill={cc} transform="rotate(20 120 196)" />
        </svg>
      </div>
      <p className="mt-2 text-xs font-mono tracking-widest" style={{ color: isGold ? '#DAA520' : '#9B2222' }}>— Klik —</p>
    </div>
  )
}

function launchConfetti() {
  const colors = ['#FFD700', '#FF6B2B', '#E8271A', '#FF4422', '#FFF']
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed;width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}vw;top:-20px;border-radius:2px;animation:confettiFall ${2+Math.random()*3}s ${Math.random()}s linear forwards;z-index:45;pointer-events:none`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 5000)
  }
}
