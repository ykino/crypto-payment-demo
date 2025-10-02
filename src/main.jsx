import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './walletConfig'   // ✅ wagmiConfig に修正

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
)

