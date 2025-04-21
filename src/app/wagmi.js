// app/wagmi-config.js
import { createConfig, http } from 'wagmi';
import { base } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Your App Name',
    })
  ],
  transports: {
    [base.id]: http(),
  },
});