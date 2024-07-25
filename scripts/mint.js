const hardhat = require("hardhat");
const fs = require("fs");

const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddr = fs.readFileSync("contract.txt", "utf-8").trim();
  const contractFactory = await hardhat.ethers.getContractFactory("Degen");
  const [signer] = await hardhat.ethers.getSigners();
  const contract = contractFactory.attach(contractAddr);
  const functionName = "mint";

  const setMessageTx = await sendShieldedTransaction(
    signer,
    contractAddr,
    contract.interface.encodeFunctionData(functionName),
    0
  );
  await setMessageTx.wait();

  console.log("Transaction Receipt: ", setMessageTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
