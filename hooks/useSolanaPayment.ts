'use client'
import { useCallback, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { CREATOR_WALLET, SOLSCAN_BASE } from '@/lib/constants'

export function useSolanaPayment() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  const [loading, setLoading] = useState(false)

  const pay = useCallback(async ({ amountSol, tipSol = 0 }: { amountSol: number; tipSol?: number }) => {
    if (!publicKey || !connected) throw new Error('Wallet not connected')
    setLoading(true)
    try {
      const lamports = Math.round((amountSol + tipSol) * LAMPORTS_PER_SOL)
      const tx = new Transaction().add(
        SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: new PublicKey(CREATOR_WALLET), lamports })
      )
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = publicKey
      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, 'confirmed')
      return { signature, explorerUrl: `${SOLSCAN_BASE}/${signature}` }
    } finally {
      setLoading(false)
    }
  }, [publicKey, connected, connection, sendTransaction])

  return { pay, loading, connected, publicKey }
}
