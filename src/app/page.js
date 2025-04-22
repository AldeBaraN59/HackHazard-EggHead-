// app/page.jsx
'use client';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-50">
      <Wallet>
        <ConnectWallet>
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-blue-700 transition-colors">
            Connect Wallet
          </button>
        </ConnectWallet>
      </Wallet>
    </main>
  );
}