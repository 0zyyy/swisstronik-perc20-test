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
  const [signer] = await hardhat.ethers.getSigners();

  const contractFactory = await hardhat.ethers.getContractFactory("Degen");
  const contract = contractFactory.attach(contractAddr);
  const functionName = 'transfer';
  const receiptAddress = '0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1';
  const amount = 1 * 10 ** 18;
  const functionArgs = [receiptAddress, `${amount}`];
  const sendTx = await sendShieldedTransaction(
    signer,
    contractAddr,
    contract.interface.encodeFunctionData(functionName,functionArgs),
    0
  );

  await sendTx.wait();
  console.log("Transaction: ", sendTx.hash);
  fs.writeFileSync("tx-hash.txt",`Tx hash : https://explorer-evm.testnet.swisstronik.com/tx/${sendTx.hash}\n`, {
    flag: 'a',
  })
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
