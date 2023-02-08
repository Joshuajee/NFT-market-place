const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");




// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
async function deploy() {

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const LM = await ethers.getContractFactory("LM")
  const lm = await LM.deploy();


  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace", {
    libraries: {
      LM: lm.address,
    },
  });

  const nftMarketplace = await NFTMarketplace.deploy();

  return { nftMarketplace, owner, otherAccount };

}


async function deployToken() {

  const [owner, second, third] = await ethers.getSigners();

  const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");

  const royaltyToken = await RoyaltyToken.deploy();

  await royaltyToken.connect(owner).safeMint(owner.address, "owner")
  await royaltyToken.safeMint(second.address, "second")
  await royaltyToken.safeMint(third.address, "third")  

  // const object = Array(20).fill(1)

  // for await(const iterator of object) {

  // }

  return { royaltyToken, owner, second, third };

}


async function ListNFT(nftMarketplace, royaltyToken) {

  const amount = 2_000_000_000_000
  const tokenId = 0

  await approveToken(nftMarketplace.address, royaltyToken);

  await nftMarketplace.listItem(royaltyToken.address, tokenId, amount)

  return { amount, tokenId }

}

async function approveToken(operatorAddress, royaltyToken) {

  const [owner, second, third] = await ethers.getSigners();

  await royaltyToken.connect(owner).approve(operatorAddress, 0)
  await royaltyToken.connect(second).approve(operatorAddress, 1)
  await royaltyToken.connect(third).approve(operatorAddress,  2)

}


  
describe("NFT Market Place", function () {

  describe("Deployment", () => {

    it("Should have zero listed tokens", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      expect(await nftMarketplace.listSize()).to.equal(0);
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
        nftMarketplace.listItem(royaltyToken.address, 0, 2000000)
      ).to.be.revertedWith("NotApprovedForMarketplace")

    });

    it("Should List (with correct details) if the nft has been approved", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, owner } = await loadFixture(deployToken);

      await approveToken(nftMarketplace.address, royaltyToken);
      await nftMarketplace.listItem(royaltyToken.address, 0, 2000000);
      expect(await nftMarketplace.listSize()).to.equal(1);
      const listings = await nftMarketplace.getTokenDetails(royaltyToken.address, 0)
      // seller is the owner of the person that listed the nft
      expect(listings.seller).to.equal(owner.address);
      // token address is the same
      expect(listings.nftAddress).to.equal(royaltyToken.address);
      // token id is the same
      expect(listings.tokenId).to.equal(0);
      // price is the same
      expect(listings.price).to.equal(2000000);
      //make sure ownership is not transfered
      expect(await royaltyToken.ownerOf(0)).to.equal(owner.address)
    });


    it("Should List Should Increase only seller NFT count", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, owner, second, third } = await loadFixture(deployToken);

      await approveToken(nftMarketplace.address, royaltyToken);

      await nftMarketplace.listItem(royaltyToken.address, 0, 2000000);

      expect(await nftMarketplace.sellerSize(owner.address)).to.equal(1);
      expect(await nftMarketplace.sellerSize(second.address)).to.equal(0);
      expect(await nftMarketplace.sellerSize(third.address)).to.equal(0);

    });


    it("Should List Should Increase only NFT collection count", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second, third } = await loadFixture(deployToken);

      await approveToken(nftMarketplace.address, royaltyToken);

      await nftMarketplace.listItem(royaltyToken.address, 0, 2000000);
      
      expect(await nftMarketplace.collectionSize(royaltyToken.address)).to.equal(1);
      expect(await nftMarketplace.collectionSize(second.address)).to.equal(0);
      expect(await nftMarketplace.collectionSize(third.address)).to.equal(0);

    });


    it("Should List Should revert with Error when the seller is not the owner", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);

      await approveToken(nftMarketplace.address, royaltyToken);

      // expect(
      //   await nftMarketplace.connect(second).listItem(royaltyToken.address, 0, 2000000)
      // ).to.revertedWithCustomError('NotOwner()');

    });

   
  });


  describe("Buying NFTs", () => {

    it("Should Be able to Buy NFT, and be the new owner", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);

      const { amount, tokenId } = await ListNFT(nftMarketplace, royaltyToken)

      await nftMarketplace.connect(second).buyItem(royaltyToken.address, tokenId, {
        value: amount
      })

      // check ownership if ownership is transfered
      expect(await royaltyToken.ownerOf(tokenId)).to.equal(second.address)
      // check ownership if ownership is transfered
      expect(await royaltyToken.ownerOf(tokenId)).to.equal(second.address)

    });

    it("Should Be remove nft from listed tokens once bought", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);

      const { amount, tokenId } = await ListNFT(nftMarketplace, royaltyToken)

      const listSize = await nftMarketplace.listSize()

      await nftMarketplace.connect(second).buyItem(royaltyToken.address, tokenId, {
        value: amount
      })

      const addressZero = ethers.constants.AddressZero

      const listings = await nftMarketplace.getTokenDetails(royaltyToken.address, 1)

      // ListSize decreases
      expect(await nftMarketplace.listSize()).to.equal(listSize - 1)
      // seller is the owner of the person that listed the nft
      expect(listings.seller).to.equal(addressZero);
      // price is the same
      expect(listings.price).to.equal(0);

    });

    it("Should Be remove nft from sellers and collection list once bought", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, owner, second } = await loadFixture(deployToken);

      const { amount, tokenId } = await ListNFT(nftMarketplace, royaltyToken)

      const sellerSize = await nftMarketplace.sellerSize(owner.address)

      const collectionSize = await nftMarketplace.collectionSize(royaltyToken.address)

      await nftMarketplace.connect(second).buyItem(royaltyToken.address, tokenId, {
        value: amount
      })

      //  Seller Listed Tokens show decrease
      expect(await nftMarketplace.sellerSize(owner.address)).to.equal(sellerSize - 1);
      // Collection Listed Tokens show decrease
      expect(await nftMarketplace.collectionSize(royaltyToken.address)).to.equal(collectionSize - 1);

    });

   
  });

  describe("Can update and cancel listing", () => {

    it("Price should update", async () => {
      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);

      const { tokenId } = await ListNFT(nftMarketplace, royaltyToken)

      const listingInitial = await nftMarketplace.getTokenDetails(royaltyToken.address, 0)

      await time.increase(3600);

      await nftMarketplace.updateListing(royaltyToken.address, tokenId, 1000)

      const listing = await nftMarketplace.getTokenDetails(royaltyToken.address, 0)

      expect(listing.price).to.equal(1000)

      expect(listing.tokenId).to.equal(0)

      // updated timestamp should increase
      expect(Number(listing.updatedAt)).to.greaterThan(Number(listingInitial.updatedAt))

    });



    it("Should delete listing once canceled", async () => {

      const { nftMarketplace } = await loadFixture(deploy);
      const { royaltyToken, second } = await loadFixture(deployToken);

      const { tokenId } = await ListNFT(nftMarketplace, royaltyToken)

      const initialListSize = await nftMarketplace.listSize()

      await nftMarketplace.cancelListing(royaltyToken.address, tokenId)

      const listSize = await nftMarketplace.listSize()

      const listing = await nftMarketplace.getTokenDetails(royaltyToken.address, tokenId)

      expect(listSize).to.equal(initialListSize - 1)

    });


  });



});
