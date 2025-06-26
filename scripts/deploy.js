const hre = require("hardhat");

async function main() {
  const SkillChain = await hre.ethers.getContractFactory("SkillChain");
  const certifier = await SkillChain.deploy();
  await certifier.waitForDeployment();
  console.log(`Contract deployed to ${await certifier.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
