const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");



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


async function deployToken() {

  const [owner, second, third] = await ethers.getSigners();

  const RoyaltyToken = await ethers.getContractFactory("MyToken");

  const royaltyToken = await RoyaltyToken.deploy();

  await royaltyToken.connect(owner).safeMint(owner.address, 1, "owner")
  await royaltyToken.safeMint(second.address, 2, "second")
  await royaltyToken.safeMint(third.address,  3, "third")

  return { royaltyToken, owner, second, third };

}


async function ListNFT(nftMarketplace, royaltyToken) {

  const amount = 2_000_000_000_000

  await approveToken(nftMarketplace.address, royaltyToken);

  await nftMarketplace.listItem(royaltyToken.address, 1, amount)

  return { amount }

}

async function approveToken(operatorAddress, royaltyToken) {

  const [owner, second, third] = await ethers.getSigners();

  await royaltyToken.connect(owner).approve(operatorAddress, 1)
  await royaltyToken.connect(second).approve(operatorAddress, 2)
  await royaltyToken.connect(third).approve(operatorAddress,  3)

}


  
describe("NFT Market Place", function () {

  describe("Deployment", () => {

    it("Should have zero listed tokens", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      expect(await nftMarketplace.listedTokenIds()).to.equal(0);
    });

    it("Should have the right owner", async () => {
      const { nftMarketplace, owner } = await loadFixture(deploy);
      expect(await nftMarketplace.owner()).to.equal(owner.address);
    });
   
  });


  describe("Listing NFTs", () => {

    it("Should Revert if the nft has not been approved", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken } = await loadFixture(deployToken);

      await expect(
        nftMarketplace.listItem(royaltyToken.address, 1, 2000000)
      ).to.be.revertedWith("NotApprovedForMarketplace")

    });

    it("Should List if the nft has been approved", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, owner } = await loadFixture(deployToken);

      await approveToken(nftMarketplace.address, royaltyToken);

      await nftMarketplace.listItem(royaltyToken.address, 1, 2000000)

      expect(await nftMarketplace.listedTokenIds()).to.equal(1);

      expect(await nftMarketplace.i_listings(1)) 

      const listings = await nftMarketplace.s_listings(royaltyToken.address, 1)

      // seller is the owner of the person that listed the nft
      expect(listings.seller).to.equal(owner);

    });

   
  });


  describe("Buying NFTs", () => {

    it("Should Be able to Buy NFT", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);
      
      const { amount } = await ListNFT(nftMarketplace, royaltyToken)

      await nftMarketplace.connect(second).buyItem(royaltyToken.address, 1, {
        value: amount
      })

    });

   
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
