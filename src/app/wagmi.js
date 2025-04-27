// app/wagmi-config.js
import { createConfig, http } from 'wagmi';
import { base } from 'viem/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Your App Name',
    }),
    injected({ target: 'metaMask' }) // Explicitly add MetaMask
  ],
  transports: {
    [base.id]: http(),
  },
});