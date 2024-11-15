const hre = require("hardhat");

async function main() {
  const EnhancedChatDApp = await hre.ethers.getContractFactory("EnhancedChatDApp");
  const chatDApp = await EnhancedChatDApp.deploy();

  await chatDApp.deployed();

  console.log("EnhancedChatDApp deployed to:", chatDApp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });