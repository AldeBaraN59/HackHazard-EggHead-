'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '../../../components/Web3Provider';
import { getCreatorRegistryContract, uploadToIPFS } from '../../../../utils/web3';

export default function CreatorRegistrationPage() {
  const router = useRouter();
  const { signer, isConnected } = useWeb3();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: null,
    socialLinks: {
      twitter: '',
      instagram: '',
      website: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    // In a real app, you'd handle file uploads
    setFormData(prev => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isConnected || !signer) {
      alert('Please connect your wallet first');
      return;
    }
  
    try {
      setIsSubmitting(true);
      setError(null);
  
      // 1. Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
  
      // 2. Prepare and validate metadata
      const metadata = {
        name: formData.name.trim(),
        description: formData.bio.trim(),
        image: 'ipfs://QmPlaceholderHash',
        socialLinks: formData.socialLinks
      };
      
      const metadataURI = JSON.stringify(metadata);
      if (!metadataURI.startsWith('{')) {
        throw new Error('Invalid metadata format');
      }
  
      // 3. Get contract with enhanced validation
      const creatorRegistry = getCreatorRegistryContract(signer);
      
      // Debug logs
      console.log('Signer address:', await signer.getAddress());
      console.log('Contract address:', creatorRegistry.address);
      console.log('Contract methods:', Object.keys(creatorRegistry.functions));
      
      if (!creatorRegistry.registerCreator) {
        throw new Error('registerCreator function not found in contract');
      }
  
      // 4. Call with proper error handling
      const tx = await creatorRegistry.registerCreator(metadataURI, {
        gasLimit: 500000
      });
      
      const receipt = await tx.wait();
      if (receipt.status !== 1) {
        throw new Error('Transaction failed');
      }
  
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.reason?.replace('execution reverted: ', '') || 
        err.message || 
        'Registration failed. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Become a Creator</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your creator name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell your audience about yourself"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended: Square image, at least 500x500px
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Twitter (optional)
              </label>
              <input
                type="text"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Instagram (optional)
              </label>
              <input
                type="text"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Website (optional)
              </label>
              <input
                type="text"
                name="socialLinks.website"
                value={formData.socialLinks.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register as Creator'}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}