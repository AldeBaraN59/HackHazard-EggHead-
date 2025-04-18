'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains'; // add baseSepolia for testing

export function Providers({ children }) { // Destructure `children` directly
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} 
      chain={base} // add baseSepolia for testing
    >
      {children} {/* Use the destructured `children` */}
    </OnchainKitProvider>
  );
}
