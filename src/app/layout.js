// RootLayout.server.js (Server Component)
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers'; // Server-side only
import { cookieToInitialState } from 'wagmi';
import { getConfig } from './wagmi.js';
import { Providers } from './Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Wagmi',
  description: 'Generated by create-wagmi',
};

export default async function RootLayout({ children }) {
  // Server-side logic to get cookies
  const cookies = headers().get('cookie'); // Get cookies server-side

  // Get initial state from cookies
  const initialState = cookieToInitialState(getConfig(), cookies);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Passing initialState to the client-side component */}
        <Providers initialState={initialState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
