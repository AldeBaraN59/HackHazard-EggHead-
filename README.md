# Web3 Subscription Platform

A decentralized subscription platform built on Base blockchain, allowing creators to monetize their content through crypto subscriptions.

## Features

- Creator registration and profile management
- Subscription tier creation and management
- On-chain subscription payments
- Content access control
- Creator analytics dashboard
- User subscription management
- Multi-wallet support (MetaMask, Coinbase Wallet)
- IPFS integration for content storage

## Tech Stack

- **Frontend**: Next.js 13, TailwindCSS, Coinbase OnchainKit
- **Smart Contracts**: Solidity, Hardhat
- **Blockchain**: Base
- **Storage**: IPFS
- **Authentication**: Web3 wallets
- **UI Components**: Shadcn/ui, Framer Motion

## Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or Coinbase Wallet
- Base Sepolia testnet ETH

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/web3-subscription-platform.git
cd web3-subscription-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in the required environment variables in `.env.local`

4. Start the development server:
```bash
npm run dev
```

## Smart Contract Deployment

1. Compile contracts:
```bash
npx hardhat compile
```

2. Deploy to Base Sepolia:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

## Project Structure

```
├── contracts/           # Smart contracts
├── scripts/            # Deployment scripts
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── utils/         # Helper functions
├── public/            # Static assets
└── tests/            # Test files
```

## Smart Contracts

- `CreatorRegistry.sol`: Manages creator profiles and verification
- `SubscriptionManager.sol`: Handles subscription logic and payments
- `ContentNFT.sol`: Manages content access and subscription tiers

## Frontend Features

- Modern, responsive design
- Dark/light mode support
- Wallet connection with multiple providers
- Creator dashboard
- User subscription management
- Content viewing interface
- Analytics and insights

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or join our Discord community.

## Acknowledgments

- Base Network
- Coinbase OnchainKit
- IPFS
- Hardhat
- Next.js
