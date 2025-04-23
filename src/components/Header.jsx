import Link from 'next/link';
import ConnectWallet from './ConnectWallet';
import { useWeb3 } from './Web3Provider';

export default function Header() {
  const { isConnected } = useWeb3();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Web3 Patreon
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/creator" className="text-gray-600 hover:text-gray-900">
              Creators
            </Link>
            {isConnected && (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  My Subscriptions
                </Link>
                <Link href="/creator/register" className="text-gray-600 hover:text-gray-900">
                  Become a Creator
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <ConnectWallet />
      </div>
    </header>
  );
}