import Link from 'next/link';
import { shortenAddress } from '../../utils/web3';

export default function CreatorCard({ creator }) {
  if (!creator) return null;
  const { id, wallet, metadataURI, totalSubscribers, isVerified } = creator;
  
  // In a real app, you would fetch and parse the metadata from IPFS
  const metadata = {
    name: `Creator ${id}`,
    description: 'This is a placeholder description. In a real app, this would be fetched from IPFS.',
    image: '/vercel.svg',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold truncate">{metadata.name}</h3>
          {isVerified && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{metadata.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{totalSubscribers} subscribers</span>
          <span>Address: {shortenAddress(wallet)}</span>
        </div>
        
        <Link 
          href={`/creator/${id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
        >
          View Creator
        </Link>
      </div>
    </div>
  );
}