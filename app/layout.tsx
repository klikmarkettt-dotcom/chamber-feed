import type { Metadata } from 'next'
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { SolanaWalletProvider } from '@/components/WalletProvider'

export const metadata: Metadata = {
  title: 'FEED THE LOBSTER · ☿',
  description: 'Feed Klik. Earn trust. Become a Chamber Legend.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: '#05060a' }}>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  )
}
