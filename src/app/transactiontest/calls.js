export const clickContractAddress = '0xA9b02320a890ef9AF8A0abA9147CCe5844496be7';

export const clickContractAbi = [
  {
    type: 'function',
    name: 'click',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Clicked',
    inputs: [
      {
        indexed: true,
        name: 'sender',
        type: 'address'
      }
    ],
  }
];

export const calls = [
  {
    address: clickContractAddress,
    abi: clickContractAbi,
    functionName: 'click',
    args: [],
    // Optional: Add gas estimation buffer
    // gasLimit: 300000 
  }
];