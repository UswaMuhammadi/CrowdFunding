const hre = require("hardhat");

async function main() {
  const Crowdfunding = await hre.ethers.getContractFactory("crowdfundingg");
  const crowdfunding = await Crowdfunding.deploy();

  await crowdfunding.waitForDeployment(); 
  console.log("Crowdfunding deployed at:", await crowdfunding.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
