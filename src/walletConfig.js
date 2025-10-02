import { defaultWagmiConfig, createWeb3Modal } from '@web3modal/wagmi/react'
import { polygon } from 'wagmi/chains'

const projectId = '783814c87013fdf816ac5dd729da58b6'

const metadata = {
  name: 'Crypto Payment Demo',
  description: 'WalletConnect + Polygon Demo',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://crypto-payment-demo.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// ✅ wagmiConfig をエクスポート
export const wagmiConfig = defaultWagmiConfig({
  chains: [polygon],
  projectId,
  metadata
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains: [polygon]
})

