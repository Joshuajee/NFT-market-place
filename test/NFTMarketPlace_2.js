const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");




// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.

const ListCounts = 20

async function deploy() {

    const object = Array(ListCounts).fill("NFT").map((value, index) => index)

    // Contracts are deployed using the first signer/account by default
    const [owner, second, third] = await ethers.getSigners();

    // deploy tokens
    const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
    const royaltyToken = await RoyaltyToken.deploy(); 

    //Deploying MarketPlace
    const LM = await ethers.getContractFactory("LM")
    const lm = await LM.deploy();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace", {
        libraries: {
        LM: lm.address,
        },
    });
    const nftMarketplace = await NFTMarketplace.deploy();

    // Minting NFTs 
    for await(const iterator of object) {
        await royaltyToken.connect(owner).safeMint(owner.address, `${iterator} - 1`)
        await royaltyToken.safeMint(second.address, `${iterator} - 2`)
        await royaltyToken.safeMint(third.address, `${iterator} - 3`) 
    }

    // Approving NFTs
    const operatorAddress = nftMarketplace.address
    for await(const iterator of object) {
        const index = iterator * 3
        await royaltyToken.connect(owner).approve(operatorAddress, index)
        await royaltyToken.connect(second).approve(operatorAddress, 1 + index)
        await royaltyToken.connect(third).approve(operatorAddress, 2 + index)
    }

    // Listing NFTs
    const price = 2_000_000_000_000
    const Listed = []
    const Listed_1 = []
    const Listed_2 = []
    const Listed_3 = []
    const nftAddress = royaltyToken.address
    for await(const iterator of object) {
      const tokenId = iterator * 3
      await nftMarketplace.connect(owner).listItem(royaltyToken.address, tokenId, price)
      await nftMarketplace.connect(second).listItem(royaltyToken.address, tokenId + 1, price)
      await nftMarketplace.connect(third).listItem(royaltyToken.address, tokenId + 2, price)

      Listed.push({ seller: owner.address, tokenId, price, nftAddress })
      Listed_1.push({ seller: owner.address, tokenId, price, nftAddress })

      Listed.push({ seller: second.address, tokenId: tokenId + 1, price, nftAddress })
      Listed_2.push({ seller: second.address, tokenId: tokenId + 1, price, nftAddress })

      Listed.push({ seller: third.address, tokenId: tokenId + 2, price, nftAddress })
      Listed_3.push({ seller: third.address, tokenId: tokenId + 2, price, nftAddress })
    }

    return { nftMarketplace, royaltyToken, Listed, owner, second, third, price, Listed_1, Listed_2, Listed_3 };

}


  
describe("NFT Market Place Test 2 (Getting Listings)", function () {


    describe("Testing the Listing of NFTs", () => {

        it("Should List the right numbers of NFTs", async () => {
            const { nftMarketplace } = await loadFixture(deploy);
            expect(await nftMarketplace.listSize()).to.equal(ListCounts * 3);
        });
    
        it("Should List the right numbers of NFTs per seller", async () => {
            const { nftMarketplace, owner, second, third } = await loadFixture(deploy);
            expect(await nftMarketplace.sellerSize(owner.address)).to.equal(ListCounts);
            expect(await nftMarketplace.sellerSize(second.address)).to.equal(ListCounts);
            expect(await nftMarketplace.sellerSize(third.address)).to.equal(ListCounts);
        });

    })


    describe("Testing the Fetching of Listed NFTs", () => {

        it("Should Get All NFTs with right Details", async () => {
            const { nftMarketplace, Listed, price } = await loadFixture(deploy);
            const listings = await nftMarketplace.getAllNFTs();

            expect(listings.length).to.equal(ListCounts * 3);

            Listed.reverse().map((list, index) => {
                expect(listings[index].nftAddress).to.equal(Listed[index].nftAddress);
                expect(listings[index].tokenId).to.equal(Listed[index].tokenId)
                expect(listings[index].price).to.equal(Listed[index].price)
                expect(listings[index].seller).to.equal(Listed[index].seller)
            })

        });

        it("Should Get Listed NFTs count according to range", async () => {
            const { nftMarketplace } = await loadFixture(deploy);
            expect((await nftMarketplace.getNFTsByRange(ListCounts * 3, 10)).length).to.equal(10)
            expect((await nftMarketplace.getNFTsByRange(ListCounts * 2, 10)).length).to.equal(10)
            expect((await nftMarketplace.getNFTsByRange(ListCounts * 3, 30)).length).to.equal(30)
            expect((await nftMarketplace.getNFTsByRange(ListCounts, 5)).length).to.equal(5)
            expect((await nftMarketplace.getNFTsByRange(10, 10)).length).to.equal(10)
            expect((await nftMarketplace.getNFTsByRange(10, 4)).length).to.equal(4)
        });


        it("Should get Expected Listed NFTs` according to range", async () => {
            const { nftMarketplace, Listed } = await loadFixture(deploy);

            const firstStart = ListCounts * 3
            const firstLimit = 20;
            let firstCount = 0;

            const secondStart = ListCounts * 2
            const secondLimit = 11;
            let secondCount = 0;

            const first = await nftMarketplace.getNFTsByRange(firstStart, firstLimit)
            const second = await nftMarketplace.getNFTsByRange(secondStart, secondLimit)

            const Listed_R = Listed.reverse()

            for (let i = firstStart - 1;  i > firstStart - firstLimit; i--) {
                expect(first[firstCount].nftAddress).to.equal(Listed_R[i].nftAddress);
                expect(first[firstCount].tokenId).to.equal(Listed_R[i].tokenId)
                expect(first[firstCount].price).to.equal(Listed_R[i].price)
                expect(first[firstCount].seller).to.equal(Listed_R[i].seller)
                firstCount++;
            }

            for (let i = secondStart - 1;  i > secondStart - secondLimit; i--) {
                expect(second[secondCount].nftAddress).to.equal(Listed_R[i].nftAddress);
                expect(second[secondCount].tokenId).to.equal(Listed_R[i].tokenId)
                expect(second[secondCount].price).to.equal(Listed_R[i].price)
                expect(second[secondCount].seller).to.equal(Listed_R[i].seller)
                secondCount++;
            }

        });

    })


    describe("Testing the Fetching of Listed NFTs for a seller", () => {

        it("Should Get All NFTs for seller 1, 2, and 3 with the right Details", async () => {
            const { nftMarketplace, owner, second, third, Listed_1, Listed_2, Listed_3 } = await loadFixture(deploy);

            const listings_1 = await nftMarketplace.getAllSellerNFTs(owner.address);
            const listings_2 = await nftMarketplace.getAllSellerNFTs(second.address);
            const listings_3 = await nftMarketplace.getAllSellerNFTs(third.address);
            
            expect(listings_1.length).to.equal(ListCounts);
            Listed_1.reverse().map((list, index) => {
                expect(listings_1[index].nftAddress).to.equal(list.nftAddress);
                expect(listings_1[index].tokenId).to.equal(list.tokenId)
                expect(listings_1[index].price).to.equal(list.price)
                expect(listings_1[index].seller).to.equal(list.seller)
            })

            expect(listings_2.length).to.equal(ListCounts);
            Listed_2.reverse().map((list, index) => {
                expect(listings_2[index].nftAddress).to.equal(list.nftAddress);
                expect(listings_2[index].tokenId).to.equal(list.tokenId)
                expect(listings_2[index].price).to.equal(list.price)
                expect(listings_2[index].seller).to.equal(list.seller)
            })

            expect(listings_3.length).to.equal(ListCounts);
            Listed_3.reverse().map((list, index) => {
                expect(listings_3[index].nftAddress).to.equal(list.nftAddress);
                expect(listings_3[index].tokenId).to.equal(list.tokenId)
                expect(listings_3[index].price).to.equal(list.price)
                expect(listings_3[index].seller).to.equal(list.seller)
            })

        });

        it("Should Get Listed NFTs count according to range", async () => {
            const { nftMarketplace, owner } = await loadFixture(deploy);
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, ListCounts, 3)).length).to.equal(3)
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, ListCounts, 10)).length).to.equal(10)
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, ListCounts, 20)).length).to.equal(20)
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, ListCounts, 5)).length).to.equal(5)
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, 10, 10)).length).to.equal(10)
            expect((await nftMarketplace.getSellerNFTsByRange(owner.address, 10, 4)).length).to.equal(4)
        });


        it("Should get Expected Listed NFTs according to range", async () => {
            const { nftMarketplace, Listed_1, owner } = await loadFixture(deploy);

            const firstStart = ListCounts
            const firstLimit = 20;
            let firstCount = 0;

            const secondStart = ListCounts
            const secondLimit = 11;
            let secondCount = 0;

            const first = await nftMarketplace.getSellerNFTsByRange(owner.address, firstStart, firstLimit)
            const second = await nftMarketplace.getSellerNFTsByRange(owner.address, secondStart, secondLimit)

            const Listed = Listed_1.reverse()

            for (let i = firstStart - 1;  i > firstStart - firstLimit; i--) {
                expect(first[firstCount].nftAddress).to.equal(Listed[i].nftAddress);
                expect(first[firstCount].tokenId).to.equal(Listed[i].tokenId)
                expect(first[firstCount].price).to.equal(Listed[i].price)
                expect(first[firstCount].seller).to.equal(Listed[i].seller)
                firstCount++;
            }

            for (let i = secondStart - 1;  i > secondStart - secondLimit; i--) {
                expect(second[secondCount].nftAddress).to.equal(Listed[i].nftAddress);
                expect(second[secondCount].tokenId).to.equal(Listed[i].tokenId)
                expect(second[secondCount].price).to.equal(Listed[i].price)
                expect(second[secondCount].seller).to.equal(Listed[i].seller)
                secondCount++;
            }

        });

    })



    describe("Testing the Fetching of Listed NFTs for a collection", () => {

        it("Should Get All NFTs for collection with the right Details", async () => {

            const { nftMarketplace, Listed, royaltyToken } = await loadFixture(deploy);

            const listings = await nftMarketplace.getAllCollectionNFTs(royaltyToken.address);
            
            expect(listings.length).to.equal(ListCounts * 3);
 
            Listed.reverse().map((list, index) => {
                expect(listings[index].nftAddress).to.equal(list.nftAddress);
                expect(listings[index].tokenId).to.equal(list.tokenId)
                expect(listings[index].price).to.equal(list.price)
                expect(listings[index].seller).to.equal(list.seller)
            })

        });

        it("Should Get Listed NFTs count according to range", async () => {
            const { nftMarketplace, royaltyToken } = await loadFixture(deploy);
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, ListCounts, 3)).length).to.equal(3)
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, ListCounts, 10)).length).to.equal(10)
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, ListCounts, 20)).length).to.equal(20)
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, ListCounts, 5)).length).to.equal(5)
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, 10, 10)).length).to.equal(10)
            expect((await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, 10, 4)).length).to.equal(4)
        });


        it("Should get Expected Listed NFTs according to range", async () => {
            const { nftMarketplace, Listed, royaltyToken } = await loadFixture(deploy);

            const firstStart = ListCounts * 3
            const firstLimit = 20;
            let firstCount = 0;

            const secondStart = ListCounts * 2
            const secondLimit = 11;
            let secondCount = 0;

            const Listed_R = Listed.reverse()

            const first = await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, firstStart, firstLimit)
            const second = await nftMarketplace.getCollectionNFTsByRange(royaltyToken.address, secondStart, secondLimit)

            for (let i = firstStart - 1;  i > firstStart - firstLimit; i--) {
                expect(first[firstCount].nftAddress).to.equal(royaltyToken.address);
                expect(first[firstCount].tokenId).to.equal(Listed_R[i].tokenId)
                expect(first[firstCount].price).to.equal(Listed_R[i].price)
                expect(first[firstCount].seller).to.equal(Listed_R[i].seller)
                firstCount++;
            }

            for (let i = secondStart - 1;  i > secondStart - secondLimit; i--) {
                expect(second[secondCount].nftAddress).to.equal(royaltyToken.address);
                expect(second[secondCount].tokenId).to.equal(Listed_R[i].tokenId)
                expect(second[secondCount].price).to.equal(Listed_R[i].price)
                expect(second[secondCount].seller).to.equal(Listed_R[i].seller)
                secondCount++;
            }

        });

    })

});
