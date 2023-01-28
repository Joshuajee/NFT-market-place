// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import { IterableMapping } from "../liberies/IterableMapping.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract NFTMarketplace is ReentrancyGuard {

    using Counters for Counters.Counter;

    using IterableMapping for IterableMapping.Map;

    IterableMapping.Map private map;

    Counters.Counter public listedTokenIds;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    address private constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

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

    // The structure of store info about a listed token
    struct ListedTokenOutput {
        uint256 total;
        uint256 nextIndex;
        ListedToken[] tokens;
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

    // State Variabless
    mapping(address => mapping(uint256 => ListToken)) private s_listings;
    mapping(uint256 => ListedToken) private i_listings;
    
    // Function modifiers
    modifier notListed(address nftAddress, uint256 tokenId, address owner) {
        ListToken memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        ListToken memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    function listItem(address nftAddress, uint256 tokenId, uint256 price)
        public
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {

        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }

        if (IERC721(nftAddress).getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        listedTokenIds.increment();

        uint256 newTokenId = listedTokenIds.current();

        s_listings[nftAddress][tokenId] = ListToken(price, msg.sender, newTokenId);

        i_listings[newTokenId] = ListedToken(tokenId, nftAddress, msg.sender, price);
        
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    
    }

    function checkRoyalties(address _contract) internal view returns (bool) {
        (bool success) = IERC165(_contract).supportsInterface(_INTERFACE_ID_ERC2981);
        return success;
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {

        uint256 id = s_listings[nftAddress][tokenId].index;
        delete (s_listings[nftAddress][tokenId]);
        delete (i_listings[id]);

        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }


    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        uint256 price = msg.value;

        ListToken memory listedItem = s_listings[nftAddress][tokenId];
        
        if (price < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }

        bool implementRoyalties = checkRoyalties(nftAddress);

        if (implementRoyalties) {

            (address receiver, uint256 royaltyAmount)  = IERC2981(nftAddress).royaltyInfo(tokenId, price);

            require(royaltyAmount < price, "Invalid Royalty price, Royalty should be less than price");

            if (royaltyAmount > 0) {

                price = price - royaltyAmount;

                (bool successRoyalty, ) = payable(receiver).call{value: royaltyAmount}("Royalty Payment");

                require(successRoyalty, "Transfer failed");

            }

        }

        (bool success, ) = payable(listedItem.seller).call{value: price}("Proceeds from NFT sales");

        require(success, "Transfer failed");

        uint256 id = s_listings[nftAddress][tokenId].index;
        delete (s_listings[nftAddress][tokenId]);
        delete (i_listings[id]);

        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    
    }


    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice == 0) {
            revert PriceMustBeAboveZero();
        }

        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }


    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (ListToken memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        
        uint256 nftCount = listedTokenIds.current();

        uint256 validCount = getValidListings(nftCount);

        ListedToken[] memory tokens = new ListedToken[](validCount);
  
        uint currentIndex = 0;
        uint currentId = 0;
        
        for(uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            ListedToken memory currentItem = i_listings[currentId];

            if (currentItem.price != 0) {
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }

        }

        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }


    function getValidListings (uint256 count) public view returns (uint256) {

        uint256 validCount = 0;
        uint currentId = 0;

        for(uint i = 0; i < count; i++) {
            currentId = i + 1;
            ListedToken storage currentItem = i_listings[currentId];

            if (currentItem.price != 0) validCount++;

        }

        return validCount;

    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getListedTokenRange(uint256 start, uint256 count) public view returns (ListedTokenOutput memory output) {

        uint256 nftCount = listedTokenIds.current();
        uint256 current = start;
        uint256 max = current + count;
        uint256 _start = 0;

        ListedToken[] memory tokens = new ListedToken[](nftCount);

        if (start > nftCount) return ListedTokenOutput(nftCount, nftCount, tokens);

        if (count > nftCount) max = nftCount;

        while ((start < count) && (current < nftCount)) {
            ListedToken memory currentToken = i_listings[current];
            if (currentToken.price != 0) {
                tokens[_start] = currentToken;
                _start++;
            }
            current++;
        }

        return ListedTokenOutput(nftCount, current, tokens);
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = listedTokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        uint256 currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i = 0; i < totalItemCount; i++)
        {
            if(i_listings[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(i_listings[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = i_listings[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getTokenWithId(uint256 id) public view returns (ListedToken memory) {
        return i_listings[id];
    }

}