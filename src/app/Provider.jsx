'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import { base } from 'viem/chains';
import { useEffect, useState } from 'react';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
          chain={base}
          config={{
            appearance: {
              name: 'Dapp',
              logo: '/logo.png',
              theme: 'dark',
              colors: {
                primary: '#3B82F6',
                background: '#1E293B',
                text: '#FFFFFF',
                border: '#334155',
              },
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