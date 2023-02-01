require("@nomicfoundation/hardhat-toolbox");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
