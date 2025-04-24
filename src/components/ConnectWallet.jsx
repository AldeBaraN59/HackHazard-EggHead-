'use client';

import { useWeb3 } from './Web3Provider';
import { shortenAddress } from '../../utils/web3';

export default function ConnectWallet() {
  const { account, isConnected, isConnecting, error, connectWallet, disconnectWallet, connectors } = useWeb3();

  return (
    <div className="flex items-center">
      {isConnected ? (
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-md bg-gray-100">
            {shortenAddress(account)}
          </span>
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              onClick={() => connectWallet(connector.id)}
              disabled={isConnecting}
            >
              {isConnecting && connector.id === connector.id
                ? 'Connecting...'
                : `Connect with ${connector.name}`}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}