// app/Providers.jsx
'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import { base } from 'viem/chains';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
          chain={base}
          config={{
            appearance: {
              name: 'Dapp',
              logo: '/logo.png', // Update path
              theme: 'light',
            },
            wallet: {
              display: 'modal',
              signUp: {
                subtitle: 'or continue with an existing wallet',
              },
              termsUrl: 'https://example.com/terms',
              privacyUrl: 'https://example.com/privacy',
            },
          }}
          connectOptions={{
            enableCoinbaseWallet: true,
            enableInjected: true,
            enableWalletConnect: true,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}