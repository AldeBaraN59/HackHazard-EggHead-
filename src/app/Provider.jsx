// app/Provider.jsx
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';

const queryClient = new QueryClient();

// Convert API key to string and provide fallback
const apiKey = String(process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '');

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {apiKey ? (
          <OnchainKitProvider
            apiKey={apiKey}
            chain="base"
            config={{
              appearance: {
                name: 'My App',
                theme: 'light',
              },
            }}
          >
            {children}
          </OnchainKitProvider>
        ) : (
          // Fallback without OnchainKit if API key is empty
          children
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}