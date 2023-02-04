require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require("dotenv").config()
const chai = require("chai");
const { solidity } = require("ethereum-waffle");


chai.use(solidity);


/** @type import('hardhat/config').HardhatUserConfig */


const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: '0.8.17',
  settings: {
    optimizer: { enabled: true, runs: 200 }
  },
  networks: {
    mainnet: {
      url: "https://mainnet.infura.io/v3/",
      accounts: [PRIVATE_KEY]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/",
      accounts: [PRIVATE_KEY]
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: [PRIVATE_KEY]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [PRIVATE_KEY]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [PRIVATE_KEY]
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [PRIVATE_KEY]
    },
  },
  abiExporter: [
    {
      path: './src/abi',
      pretty: false,
      flat: true,
      runOnCompile: true,
      only: ["NFTMarketplace", "RoyaltyToken"]
    }
  ]
}