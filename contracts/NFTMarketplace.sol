// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./liberies/ListingMapping.sol";


error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();
error RoyaltyPriceMustBeListThanListingPrice(address nftAddress, address buyer, uint256 tokenId, uint256 price);
error PurchaseFailed(address nftAddress, address buyer, uint256 tokenId, uint256 price);
error OutOfBoundIndex();

contract NFTMarketplace is ReentrancyGuard, Ownable {

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    address private constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

    using LM for LM.Map;
    LM.Map private listingMap;

    struct ListToken {
        uint256 price;
        address seller;
        uint256 index;
    }

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address NFTcontract;
        address seller;
        uint256 price;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    
    // Function modifiers
    modifier notListed(address nftAddress, uint256 tokenId) {
        LM.ListedToken memory listing = getDetails(nftAddress, tokenId);
        if (listing.price > 0) revert AlreadyListed(nftAddress, tokenId);
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId) {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        LM.ListedToken memory listing = getDetails(nftAddress, tokenId);
        if (listing.price < 0) revert NotListed(nftAddress, tokenId);
        _;
    }

    modifier isValidStart(uint start, uint size) {
        if (start > size) revert OutOfBoundIndex();
        _;
    }

    struct TokenDetails {
        address nftAddress;
        address seller;
        uint tokenId;
        uint price;
        uint listedAt;
        uint updatedAt;
    }

    function getDetails(address nftAddress, uint256 tokenId) public view returns(LM.ListedToken memory) {
        return listingMap.get(LM.MapKeys(nftAddress, tokenId));
    }

    function listSize() public view returns(uint256) {
        return listingMap.size();
    }

    function sellerSize(address seller) public view returns(uint256) {
        return listingMap.sellerSize(seller);
    }

    function collectionSize(address nftAddress) public view returns(uint256) {
        return listingMap.collectionSize(nftAddress);
    }

    function getKeys(uint index) public view returns(LM.MapKeys memory) {
        return listingMap.getKeyAtIndex(index);
    }

    function getTokenDetailsByIndex(uint index) public view returns(TokenDetails memory tokenDetails) {
        LM.MapKeys memory mapKeys = getKeys(index);
        LM.ListedToken memory listedToken = getDetails(mapKeys.nftAddress, mapKeys.tokenId);
        tokenDetails = TokenDetails(mapKeys.nftAddress, listedToken.seller, mapKeys.tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
    }

    function getTokenDetails(address nftAddress, uint tokenId) public view returns(TokenDetails memory tokenDetails) {
        LM.ListedToken memory listedToken = getDetails(nftAddress, tokenId);
        tokenDetails = TokenDetails(nftAddress, listedToken.seller, tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
    }

    function set(address nftAddress, uint256 tokenId, uint256 price) internal {
        listingMap.set(LM.MapKeys(nftAddress, tokenId), LM.ListedToken(msg.sender, price, block.timestamp, block.timestamp));
    }

    function update(address nftAddress, uint256 tokenId, uint256 price) internal {
        LM.ListedToken memory listedToken = getDetails(nftAddress, tokenId);
        listingMap.set(LM.MapKeys(nftAddress, tokenId), LM.ListedToken(msg.sender, price, listedToken.listedAt, block.timestamp));
    }

    function remove(address nftAddress, uint256 tokenId) internal {
        listingMap.remove(LM.MapKeys(nftAddress, tokenId));
    }

    function listItem(address nftAddress, uint256 tokenId, uint256 price) 
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId)
    {

        if (price <= 0) revert PriceMustBeAboveZero();

        if (IERC721(nftAddress).getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        set(nftAddress, tokenId, price);
        
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    
    }

    function checkRoyalties(address _contract) internal view returns (bool) {
        (bool success) = IERC165(_contract).supportsInterface(_INTERFACE_ID_ERC2981);
        return success;
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId)
        isListed(nftAddress, tokenId)
    {
        remove(nftAddress, tokenId);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }


    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        uint256 price = msg.value;

        TokenDetails memory listedItem = getTokenDetails(nftAddress, tokenId);
        
        if (price < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }

        bool implementRoyalties = checkRoyalties(nftAddress);

        if (implementRoyalties) {

            (address receiver, uint256 royaltyAmount)  = IERC2981(nftAddress).royaltyInfo(tokenId, price);

            if (royaltyAmount > price) 
                revert RoyaltyPriceMustBeListThanListingPrice(nftAddress, msg.sender, tokenId, price);

            if (royaltyAmount > 0) {
                price = price - royaltyAmount;
                (bool successRoyalty, ) = payable(receiver).call{value: royaltyAmount}("Royalty Payment");
                if (!successRoyalty) revert PurchaseFailed(nftAddress, msg.sender, tokenId, price);
            }

        }

        (bool success, ) = payable(listedItem.seller).call{value: price}("Proceeds from NFT sales");

        if (!success) revert PurchaseFailed(nftAddress, msg.sender, tokenId, price);

        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

        remove(nftAddress, tokenId);
        
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    
    }

    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice)
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId)
    {
        if (newPrice == 0) {
            revert PriceMustBeAboveZero();
        }

        update(nftAddress, tokenId, newPrice);
        
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    //  This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns(TokenDetails[] memory) {

        uint size = listSize();
        uint count = 0;

        TokenDetails[] memory tokenDetails = new TokenDetails[](size); 

        for (uint i = size; i > 0; i--) {
            tokenDetails[count] = getTokenDetailsByIndex(i - 1);
            count++;
        }

        return tokenDetails;
    }

    // This will return all the NFTs currently listed to be sold on the marketplace
    function getNFTsByRange(uint256 start, uint256 limit) public view isValidStart(start, listSize()) returns (TokenDetails[] memory) {

        uint count = 0;

        uint trueCount = start - limit;
        uint trueLimit = limit;

        TokenDetails[] memory tokenDetails = new TokenDetails[](trueLimit); 

        for (uint i = start; i > trueCount; i--) {
            tokenDetails[count] = getTokenDetailsByIndex(i - 1);
            count++;
        }

        return tokenDetails;
    }

    //  This will return all the NFTs currently of a seller listed to be sold on the marketplace
    function getAllSellerNFTs(address seller) public view returns(TokenDetails[] memory) {

        uint size = sellerSize(seller);
        uint count = 0;

        TokenDetails[] memory tokenDetails = new TokenDetails[](size); 

        for (uint i = size; i > 0; i--) {
            LM.MapKeys memory mapKeys = listingMap.getSellerKeyAtIndex(seller, i - 1);
            LM.ListedToken memory listedToken = listingMap.get(mapKeys);
            tokenDetails[count] = TokenDetails(mapKeys.nftAddress, listedToken.seller, mapKeys.tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
            count++;
        }

        return tokenDetails;
    }

    function getSellerNFTsByRange(address seller, uint256 start, uint256 limit) public view isValidStart(start, sellerSize(seller)) returns (TokenDetails[] memory) {

        uint count = 0;

        uint trueCount = start - limit;
        uint trueLimit = limit;

        TokenDetails[] memory tokenDetails = new TokenDetails[](trueLimit); 

        for (uint i = start; i > trueCount; i--) {
            LM.MapKeys memory mapKeys = listingMap.getSellerKeyAtIndex(seller, i - 1);
            LM.ListedToken memory listedToken = listingMap.get(mapKeys);
            tokenDetails[count] = TokenDetails(mapKeys.nftAddress, listedToken.seller, mapKeys.tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
            count++;
        }

        return tokenDetails;
    }

    //  This will return all the NFTs of a collection currently listed to be sold on the marketplace
    function getAllCollectionNFTs(address collection) public view returns(TokenDetails[] memory) {

        uint size = collectionSize(collection);
        uint count = 0;

        TokenDetails[] memory tokenDetails = new TokenDetails[](size); 

        for (uint i = size; i > 0; i--) {
            LM.MapKeys memory mapKeys = listingMap.getCollectionKeyAtIndex(collection, i - 1);
            LM.ListedToken memory listedToken = listingMap.get(mapKeys);
            tokenDetails[count] = TokenDetails(mapKeys.nftAddress, listedToken.seller, mapKeys.tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
            count++;
        }

        return tokenDetails;
    }


    function getCollectionNFTsByRange(address collection, uint256 start, uint256 limit) public view isValidStart(start, collectionSize(collection)) returns (TokenDetails[] memory) {

        uint count = 0;

        uint trueCount = start - limit;
        uint trueLimit = limit;

        TokenDetails[] memory tokenDetails = new TokenDetails[](trueLimit); 

        for (uint i = start; i > trueCount; i--) {
            LM.MapKeys memory mapKeys = listingMap.getCollectionKeyAtIndex(collection, i - 1);
            LM.ListedToken memory listedToken = listingMap.get(mapKeys);
            tokenDetails[count] = TokenDetails(mapKeys.nftAddress, listedToken.seller, mapKeys.tokenId, listedToken.price, listedToken.listedAt, listedToken.updatedAt);
            count++;
        }

        return tokenDetails;
    }

}