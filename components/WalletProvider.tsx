'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import '@solana/wallet-adapter-react-ui/styles.css'

const WalletConnectionProvider = dynamic(
  async () => {
    const mod = await import('@solana/wallet-adapter-react')

    return function ProviderWrapper(props: any) {
      const { ConnectionProvider, WalletProvider } = mod

      const wallets = [new PhantomWalletAdapter()]
      const endpoint =
        process.env.NEXT_PUBLIC_RPC_URL ||
        'https://api.mainnet-beta.solana.com'

      return (
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            {props.children}
          </WalletProvider>
        </ConnectionProvider>
      )
    }
  },
  { ssr: false }
)

const WalletModalProviderDynamic = dynamic(
  async () => {
    const mod = await import('@solana/wallet-adapter-react-ui')

    return function ModalWrapper(props: any) {
      const { WalletModalProvider } = mod

      return (
        <WalletModalProvider>
          {props.children}
        </WalletModalProvider>
      )
    }
  },
  { ssr: false }
)

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <WalletConnectionProvider>
      <WalletModalProviderDynamic>
        {children}
      </WalletModalProviderDynamic>
    </WalletConnectionProvider>
  )
}
