import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from './Web3Provider';
import { 
  getSubscriptionManagerContract, 
  parseEther, 
  formatEther 
} from '../utils/web3';

export default function SubscriptionTier({ tier, creatorId }) {
  const { id, name, metadataURI, price, createdAt } = tier;
  const router = useRouter();
  const { signer, isConnected } = useWeb3();
  
  const [months, setMonths] = useState(1);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState(null);

  // In a real app, you would fetch and parse the metadata from IPFS
  const metadata = {
    description: 'This is a placeholder description. In a real app, this would be fetched from IPFS.',
    perks: ['Access to exclusive content', 'Members-only community', 'Monthly Q&A sessions']
  };

  const handleSubscribe = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubscribing(true);
      setError(null);
      
      const subscriptionManager = getSubscriptionManagerContract(signer);
      const totalPrice = price * months;
      
      const tx = await subscriptionManager.subscribe(
        creatorId,
        id,
        months,
        { value: totalPrice }
      );
      
      await tx.wait();
      router.push('/dashboard');
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-3xl font-bold text-blue-600 mb-4">
          {formatEther(price)} ETH
          <span className="text-gray-500 text-sm font-normal"> / month</span>
        </p>
        
        <p className="text-gray-600 mb-4">{metadata.description}</p>
        
        <ul className="mb-6 space-y-2">
          {metadata.perks.map((perk, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex items-center mb-4">
          <label className="mr-2">Months:</label>
          <select 
            value={months} 
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[1, 3, 6, 12].map(m => (
              <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleSubscribe}
          disabled={isSubscribing || !isConnected}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
        >
          {isSubscribing ? 'Processing...' : `Subscribe for ${formatEther(price * months)} ETH`}
        </button>
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}