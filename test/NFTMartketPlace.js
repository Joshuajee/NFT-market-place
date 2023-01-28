const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  
describe("NFT Market Place", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

    const nftMarketplace = await NFTMarketplace.deploy();

    return { nftMarketplace, owner, otherAccount };
  }

  describe("Deployment", () => {

    it("Should have zero listed tokens", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      //listedTokenIds
      expect(await nftMarketplace.listedTokenIds()).to.equal(0);
    });

    // it("Should set the right owner", async function () {
    //   const { nftMarketplace, owner } = await loadFixture(deploy);

    //   expect(await nftMarketplace.owner()).to.equal(owner.address);
    // });

   
  });


  // describe("Events", function () {
  //   it("Should emit an event on withdrawals", async function () {
  //     const { nftMarketplace  } = await loadFixture(deploy);

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw())
  //       .to.emit(lock, "Withdrawal")
  //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //   });
  // });

  // describe("Transfers", function () {
  //   it("Should transfer the funds to the owner", async function () {
  //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw()).to.changeEtherBalances(
  //       [owner, lock],
  //       [lockedAmount, -lockedAmount]
  //     );
  //   });
  // });
});
