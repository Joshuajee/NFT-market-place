// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTToken is IERC2981, ERC721, ERC721Enumerable, ERC721URIStorage,  ERC165Storage, Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x7aa5391d;
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;
    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    mapping(uint256 => Royalty) private s_royalty;

    struct Royalty {
        address owner;
        uint8 rate;
    }

    constructor() ERC721("Jee Token", "JEE") {
    
        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721);
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
        _registerInterface(_INTERFACE_ID_ERC721_ENUMERABLE);
    
        // Royalties interface
        _registerInterface(_INTERFACE_ID_ERC2981);
    
    }

    function safeMint(address to, string memory uri) public {

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        s_royalty[tokenId] = Royalty(to, 0);
    }

    function royaltyMint(address to, string memory uri, uint8 rate) public {

        require(rate <= 50, "rate must be less than 51");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        s_royalty[tokenId] = Royalty(to, rate);
    }

    function transferRoyalty(address to, uint256 tokenId) public {

        Royalty memory royalty = s_royalty[tokenId];

        require(royalty.owner != msg.sender, "Sender does not own the copyright");

        s_royalty[tokenId] = Royalty(to, royalty.rate);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override(IERC2981) returns (address receiver, uint256 royaltyAmount) {

        Royalty memory royalty = s_royalty[tokenId];

        uint256 amount = salePrice * royalty.rate / 100;

        return (address(royalty.owner), amount);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable, ERC165)
    {
        super._beforeTokenTransfer(from, to, tokenId, 1);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165Storage, IERC165, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    
}