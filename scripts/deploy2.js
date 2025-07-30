const hre = require("hardhat");

async function main() {
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const myContract = await MyContract.deploy();
  await myContract.waitForDeployment();

  console.log("✅ Contract deployed at:", await myContract.getAddress());

  const tx = await myContract.setValue(100);
  await tx.wait();

  const val = await myContract.getValue();
  console.log("✅ Stored value:", val.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
