const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Contract = await ethers.getContractFactory('Degen')

  console.log('Deploying PERC20 token...')
  const contract = await Contract.deploy()

  await contract.waitForDeployment()
  const contractAddress = await contract.getAddress()
  fs.writeFileSync("contract.txt", contractAddress);
  console.log(`Contract deployed to ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
