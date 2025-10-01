import { defaultWagmiConfig } from '@web3modal/ethereum'
import { createWeb3Modal } from '@web3modal/react'
import { http, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'

const projectId = '783814c87013fdf816ac5dd729da58b6' // あなたのProjectID

const metadata = {
  name: 'Crypto Payment Demo',
  description: 'WalletConnect + Polygon Demo',
  url: 'https://crypto-payment-demo.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = createConfig(
  defaultWagmiConfig({
    chains: [polygon],
    projectId,
    metadata,
    transports: {
      [polygon.id]: http('https://polygon-rpc.com')
    }
  })
)

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains: [polygon]
})

