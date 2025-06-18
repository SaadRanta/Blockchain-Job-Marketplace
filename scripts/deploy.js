// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  const JobMarketplace = await ethers.getContractFactory("JobMarketplace");
  const contract = await JobMarketplace.deploy();

  await contract.waitForDeployment(); // ✅ Correct for Hardhat + Ethers v6

  const address = await contract.getAddress();
  console.log("Contract deployed at:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
