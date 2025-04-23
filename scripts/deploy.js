// deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Set your treasury wallet address (using deployer as treasury in this example)
  const treasuryWallet = deployer.address;
  
  // Deploy the DeployerContract factory
  const DeployerContract = await ethers.getContractFactory("DeployerContract");
  const deployer_contract = await DeployerContract.deploy(treasuryWallet);
  
  await deployer_contract.deployed();
  
  console.log("DeployerContract deployed to:", deployer_contract.address);
  console.log("CreatorRegistry deployed to:", await deployer_contract.creatorRegistry());
  console.log("ContentNFT deployed to:", await deployer_contract.contentNFT());
  console.log("SubscriptionManager deployed to:", await deployer_contract.subscriptionManager());
  
  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });