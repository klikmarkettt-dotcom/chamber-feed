export type LobsterReaction =
  | 'idle' | 'nibble' | 'happy-dance' | 'excited-claws'
  | 'content-sway' | 'slurp' | 'big-celebration' | 'mega-dance'
  | 'crown' | 'screen-shake' | 'royal-feast' | 'sad'

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
  { id: 'algae-snack', name: 'Algae Snack', emoji: '🌿', price: 0.01, trustBoost: 5, description: 'A humble offering.', reaction: 'nibble', speech: 'Mmm, tasty!' },
  { id: 'shrimp-meal', name: 'Shrimp Meal', emoji: '🦐', price: 0.02, trustBoost: 8, description: 'Klik loves shrimp!', reaction: 'happy-dance', speech: 'Oh yesss! 🦐' },
  { id: 'crab-cake', name: 'Crab Cake', emoji: '🦀', price: 0.05, trustBoost: 12, description: 'No questions asked.', reaction: 'excited-claws', speech: 'CLAWS GO BRRR 🦀' },
  { id: 'seaweed-wrap', name: 'Seaweed Wrap', emoji: '🍱', price: 0.03, trustBoost: 10, description: 'Wholesome meal.', reaction: 'content-sway', speech: 'So... content... 🍱' },
  { id: 'plankton-soup', name: 'Plankton Soup', emoji: '🍵', price: 0.04, trustBoost: 11, description: 'Smooth and warm.', reaction: 'slurp', speech: 'SLURRRP 🍵' },
  { id: 'coral-feast', name: 'Coral Feast', emoji: '🪸', price: 0.08, trustBoost: 18, description: 'A proper feast!', reaction: 'big-celebration', speech: 'FEAST MODE 🪸' },
  { id: 'lobster-ripa', name: 'Lobster Ripa', emoji: '🦞', price: 0.10, trustBoost: 25, description: 'Ultimate respect.', reaction: 'mega-dance', speech: 'YOU ARE TRUSTED 🦞' },
  { id: 'golden-kelp', name: 'Golden Kelp', emoji: '🟡', price: 0.15, trustBoost: 30, description: 'Rare and prestigious.', reaction: 'crown', speech: '✨ ROYALTY RECOGNIZED ✨' },
  { id: 'deep-sea-deluxe', name: 'Deep Sea Deluxe', emoji: '🌊', price: 0.20, trustBoost: 40, description: 'The ocean shakes.', reaction: 'screen-shake', speech: 'THE DEEP TREMBLES 🌊' },
  { id: 'royal-feast', name: 'Royal Feast 👑', emoji: '👑', price: 0.50, trustBoost: 100, description: 'You are a Legend.', reaction: 'royal-feast', speech: 'I NAME YOU CHAMBER LEGEND 👑' },
]

export const TRUST_LEVELS = [
  { min: 200, label: 'CHAMBER LEGEND', emoji: '👑', color: '#FFD700', bg: 'bg-yellow-900/40', border: 'border-yellow-500', text: 'text-yellow-400' },
  { min: 121, label: 'LOBSTER FRIEND', emoji: '🟣', color: '#A855F7', bg: 'bg-purple-900/40', border: 'border-purple-500', text: 'text-purple-400' },
  { min: 81, label: 'CHAMBER ALLY', emoji: '🔵', color: '#3B82F6', bg: 'bg-blue-900/40', border: 'border-blue-500', text: 'text-blue-400' },
  { min: 61, label: 'TRUSTED', emoji: '🟢', color: '#22C55E', bg: 'bg-green-900/40', border: 'border-green-500', text: 'text-green-400' },
  { min: 41, label: 'MEMBER', emoji: '🟡', color: '#EAB308', bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-400' },
  { min: 21, label: 'LURKER', emoji: '🟠', color: '#F97316', bg: 'bg-orange-900/30', border: 'border-orange-600', text: 'text-orange-400' },
  { min: 0, label: 'UNKNOWN', emoji: '🔴', color: '#EF4444', bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-400' },
]

export function getTrustLevel(score: number) {
  return TRUST_LEVELS.find((l) => score >= l.min) ?? TRUST_LEVELS[TRUST_LEVELS.length - 1]
}
