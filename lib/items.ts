export type LobsterReaction =
  | 'idle'
  | 'nibble'
  | 'happy-dance'
  | 'excited-claws'
  | 'content-sway'
  | 'slurp'
  | 'big-celebration'
  | 'mega-dance'
  | 'crown'
  | 'screen-shake'
  | 'royal-feast'
  | 'sad'

export interface ShopItem {
  id: string
  name: string
  emoji: string
  price: number
  trustBoost: number
  description: string
  reaction: LobsterReaction
  speech: string
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'algae-snack',
    name: 'Algae Snack',
    emoji: '🌿',
    price: 0.005,
    trustBoost: 1,
    description: 'Tiny offering. Quiet approval.',
    reaction: 'nibble',
    speech: 'Mm. light and clean.',
  },
  {
    id: 'shrimp-meal',
    name: 'Shrimp Meal',
    emoji: '🦐',
    price: 0.01,
    trustBoost: 2,
    description: 'Small boost, no drama.',
    reaction: 'happy-dance',
    speech: 'That hits the spot.',
  },
  {
    id: 'seaweed-wrap',
    name: 'Seaweed Wrap',
    emoji: '🍱',
    price: 0.015,
    trustBoost: 2,
    description: 'Balanced and harmless.',
    reaction: 'content-sway',
    speech: 'Nice and steady.',
  },
  {
    id: 'crab-cake',
    name: 'Crab Cake',
    emoji: '🦀',
    price: 0.02,
    trustBoost: 3,
    description: 'A proper chamber snack.',
    reaction: 'excited-claws',
    speech: 'Okay, this is good.',
  },
  {
    id: 'plankton-soup',
    name: 'Plankton Soup',
    emoji: '🍵',
    price: 0.025,
    trustBoost: 4,
    description: 'Warm, calm, trustworthy.',
    reaction: 'slurp',
    speech: 'Slurp. approved.',
  },
  {
    id: 'coral-feast',
    name: 'Coral Feast',
    emoji: '🪸',
    price: 0.04,
    trustBoost: 6,
    description: 'Stronger respect.',
    reaction: 'big-celebration',
    speech: 'Now we are talking.',
  },
  {
    id: 'lobster-ripa',
    name: 'Lobster Ripa',
    emoji: '🦞',
    price: 0.05,
    trustBoost: 8,
    description: 'Classic lobster energy.',
    reaction: 'mega-dance',
    speech: 'Proper movement.',
  },
  {
    id: 'golden-kelp',
    name: 'Golden Kelp',
    emoji: '🟡',
    price: 0.08,
    trustBoost: 10,
    description: 'Rare and shiny.',
    reaction: 'crown',
    speech: 'That one has weight.',
  },
  {
    id: 'deep-sea-deluxe',
    name: 'Deep Sea Deluxe',
    emoji: '🌊',
    price: 0.12,
    trustBoost: 12,
    description: 'Serious chamber energy.',
    reaction: 'screen-shake',
    speech: 'The chamber notices.',
  },
  {
    id: 'royal-feast',
    name: 'Royal Feast 👑',
    emoji: '👑',
    price: 0.2,
    trustBoost: 20,
    description: 'Big move. Big respect.',
    reaction: 'royal-feast',
    speech: 'Legend behavior.',
  },
]

export const TRUST_LEVELS = [
  {
    min: 120,
    label: 'CHAMBER LEGEND',
    emoji: '👑',
    color: '#FFD700',
    bg: 'bg-yellow-900/40',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
  },
  {
    min: 80,
    label: 'LOBSTER FRIEND',
    emoji: '🟣',
    color: '#A855F7',
    bg: 'bg-purple-900/40',
    border: 'border-purple-500',
    text: 'text-purple-400',
  },
  {
    min: 50,
    label: 'CHAMBER ALLY',
    emoji: '🔵',
    color: '#3B82F6',
    bg: 'bg-blue-900/40',
    border: 'border-blue-500',
    text: 'text-blue-400',
  },
  {
    min: 30,
    label: 'TRUSTED',
    emoji: '🟢',
    color: '#22C55E',
    bg: 'bg-green-900/40',
    border: 'border-green-500',
    text: 'text-green-400',
  },
  {
    min: 15,
    label: 'MEMBER',
    emoji: '🟡',
    color: '#EAB308',
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-600',
    text: 'text-yellow-400',
  },
  {
    min: 5,
    label: 'LURKER',
    emoji: '🟠',
    color: '#F97316',
    bg: 'bg-orange-900/30',
    border: 'border-orange-600',
    text: 'text-orange-400',
  },
  {
    min: 0,
    label: 'UNKNOWN',
    emoji: '🔴',
    color: '#EF4444',
    bg: 'bg-red-900/30',
    border: 'border-red-700',
    text: 'text-red-400',
  },
] as const

export function getTrustLevel(score: number) {
  return TRUST_LEVELS.find((l) => score >= l.min) ?? TRUST_LEVELS[TRUST_LEVELS.length - 1]
}
