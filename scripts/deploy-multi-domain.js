const hre = require("hardhat");

async function main() {
  console.log("Deploying SkillChainMultiDomain contract...");
  
  const SkillChainMultiDomain = await hre.ethers.getContractFactory("SkillChainMultiDomain");
  const skillChain = await SkillChainMultiDomain.deploy();
  
  await skillChain.waitForDeployment();
  
  const contractAddress = await skillChain.getAddress();
  console.log(`SkillChainMultiDomain deployed to: ${contractAddress}`);
  
  // Set the deployer as a verified issuer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Setting deployer as verified issuer...");
  await skillChain.setVerifiedIssuer(deployer.address, true);
  
  console.log("Deployment completed successfully!");
  console.log(`Update CONTRACT_ADDRESS in your frontend config to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});