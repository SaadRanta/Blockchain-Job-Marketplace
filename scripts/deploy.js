const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const JobMarketplace = await hre.ethers.getContractFactory("JobMarketplace");
  const contract = await JobMarketplace.deploy();
  await contract.deployed();

  console.log(`JobMarketplace deployed at: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
