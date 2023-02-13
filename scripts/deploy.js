// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
  const royaltyToken = await RoyaltyToken.deploy();
  
  const LM = await ethers.getContractFactory("LM")
  const lm = await LM.deploy();


  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace", {
    libraries: {
      LM: lm.address,
    },
  });

  const nftMarketplace = await NFTMarketplace.deploy();

  console.log(
    `Deployed MarketPlace to ${nftMarketplace.address}`
  );

  console.log(
    `Deployed Royalty to ${royaltyToken.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
