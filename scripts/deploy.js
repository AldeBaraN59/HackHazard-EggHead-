// deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CreatorRegistry
  const CreatorRegistry = await hre.ethers.getContractFactory("CreatorRegistry");
  const creatorRegistry = await CreatorRegistry.deploy();
  await creatorRegistry.waitForDeployment();
  console.log("CreatorRegistry deployed to:", await creatorRegistry.getAddress());

  // Deploy SubscriptionManager
  const SubscriptionManager = await hre.ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy();
  await subscriptionManager.waitForDeployment();
  console.log("SubscriptionManager deployed to:", await subscriptionManager.getAddress());

  // Deploy ContentNFT
  const ContentNFT = await hre.ethers.getContractFactory("ContentNFT");
  const contentNFT = await ContentNFT.deploy();
  await contentNFT.waitForDeployment();
  console.log("ContentNFT deployed to:", await contentNFT.getAddress());

  // Save contract addresses to a file
  const fs = require("fs");
  const path = require("path");
  const addresses = {
    creatorRegistry: await creatorRegistry.getAddress(),
    subscriptionManager: await subscriptionManager.getAddress(),
    contentNFT: await contentNFT.getAddress(),
  };
  fs.writeFileSync(
    path.join(__dirname, "../deployed-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  console.log("Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });