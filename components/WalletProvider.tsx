'use client'

import { useMemo, type ComponentType } from 'react'
import {
  ConnectionProvider as RawConnectionProvider,
  WalletProvider as RawWalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { WalletModalProvider as RawWalletModalProvider } from '@solana/wallet-adapter-react-ui'

const ConnectionProvider = RawConnectionProvider as unknown as ComponentType<any>
const WalletProvider = RawWalletProvider as unknown as ComponentType<any>
const WalletModalProvider = RawWalletModalProvider as unknown as ComponentType<any>

const RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com'

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
