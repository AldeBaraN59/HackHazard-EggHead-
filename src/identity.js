// IdentityComponent.js (Client Component)
'use client'; // Client-side only

import { useState, useEffect } from 'react';
import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

export default function IdentityComponent({ address, schemaId }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate some delay for loading
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        {/* Placeholder for loading state */}
        Loading Identity...
      </div>
    );
  }

  return (
    <Identity address={address} schemaId={schemaId}>
      <Avatar />
      <Name>
        <Badge />
      </Name>
      <Address />
    </Identity>
  );
}
