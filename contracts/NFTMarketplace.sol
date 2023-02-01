// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract NftMarketplace is ReentrancyGuard {

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
    mapping(address => uint256) private s_noOftokenListed;

    ListedToken[] private i_listings;
    
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

        uint256 newTokenId = i_listings.length;

        s_listings[nftAddress][tokenId] = ListToken(price, msg.sender, newTokenId);

        i_listings.push(ListedToken(tokenId, nftAddress, msg.sender, price));

        s_noOftokenListed[msg.sender] += 1;
        
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

        // remove from list
        removeFromList(id);

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

        // remove from list
        removeFromList(id);

        s_noOftokenListed[listedItem.seller] -= 1;

        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    
    }

    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice)
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

    //  This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns(ListedToken[] memory) {
        return i_listings;
    }

    // This will return all the NFTs currently listed to be sold on the marketplace
    function getListedTokenRange(uint256 start, uint256 count) public view returns (ListedToken[] memory) {

        uint256 nftCount = i_listings.length;
        uint256 current = start;
        uint256 max = current + count;

        if (start > nftCount) return new ListedToken[](0);

        if (count > nftCount) max = nftCount;

        ListedToken[] memory tokens = new ListedToken[](max - current);

        for (uint i = current; i < max; i++) {
            tokens[i] = i_listings[current];
        }

        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
    
        uint256 itemCount = s_noOftokenListed[msg.sender];

        ListedToken[] memory tokens = new ListedToken[](itemCount);

        uint currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {

            if (currentIndex >= i_listings.length) break;

            if(i_listings[i].seller == msg.sender) {
                tokens[currentIndex] = i_listings[i];
                currentIndex++;
            }
        }
        
        return tokens;
    }


    //Returns all the NFTs that the current user is owner or seller in
    function getTokenWithId(uint256 id) public view returns (ListedToken memory) {
        return i_listings[id];
    }

    function removeFromList(uint _index) private {
    
        require(_index < i_listings.length, "index out of bound");

        for (uint i = _index; i < i_listings.length - 1; i++) {
            i_listings[i] = i_listings[i + 1];
        }
        
        i_listings.pop();
    
    }

}