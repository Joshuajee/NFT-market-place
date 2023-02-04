// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library LM {

    struct ListedToken {
        address seller;
        uint256 price;
        uint256 listedAt;
        uint256 updatedAt;
    }

    struct MapKeys {
        address nftAddress;
        uint tokenId;
    }

    struct Map {
        MapKeys[] keys;
        mapping(address => mapping(uint256 => ListedToken)) values;
        mapping(address => mapping(uint256 => uint256)) indexOf;
        mapping(address => mapping(uint256 => bool)) inserted;
        mapping(address => MapKeys[]) sellerKeys;
        mapping(address => mapping(address => mapping(uint256 => uint256))) sellerIndexOf;
        mapping(address => MapKeys[]) collectionKeys;
        mapping(address => mapping(address => mapping(uint256 => uint256))) collectionIndexOf;
    }

    // Listings Functions
    function get(Map storage map, MapKeys memory key) public view returns (ListedToken memory) {
        return map.values[key.nftAddress][key.tokenId];
    }

    function getKeyAtIndex(Map storage map, uint index) public view returns (MapKeys memory) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }

    // Seller Functions
    function getSellerKeyAtIndex(Map storage map, address seller, uint index) public view returns (MapKeys memory) {
        return map.sellerKeys[seller][index];
    }

    function sellerSize(Map storage map, address seller) public view returns (uint) {
        return map.sellerKeys[seller].length;
    }

    // Collection Functions
    function getCollectionKeyAtIndex(Map storage map, address nftAddress, uint index) public view returns (MapKeys memory) {
        return map.collectionKeys[nftAddress][index];
    }

    function collectionSize(Map storage map, address nftAddress) public view returns (uint) {
        return map.collectionKeys[nftAddress].length;
    }

    function set(Map storage map, MapKeys memory key, ListedToken memory val) public {
        if (map.inserted[key.nftAddress][key.tokenId]) {
            map.values[key.nftAddress][key.tokenId] = val;
        } else {
            map.inserted[key.nftAddress][key.tokenId] = true;
            map.values[key.nftAddress][key.tokenId] = val;
            map.indexOf[key.nftAddress][key.tokenId] = map.keys.length;
            map.keys.push(key);

            // Seller Insert
            map.sellerIndexOf[val.seller][key.nftAddress][key.tokenId] = map.sellerKeys[val.seller].length;
            map.sellerKeys[val.seller].push(key);
            
            // Collection Insert
            map.collectionIndexOf[key.nftAddress][key.nftAddress][key.tokenId] = map.collectionKeys[key.nftAddress].length;
            map.collectionKeys[key.nftAddress].push(key);
        }
    }

    function remove(Map storage map, MapKeys memory key) public {
        
        if (!map.inserted[key.nftAddress][key.tokenId]) {
            return;
        }

        address seller = map.values[key.nftAddress][key.tokenId].seller;
        address collection = key.nftAddress;

        delete map.inserted[key.nftAddress][key.tokenId];
        delete map.values[key.nftAddress][key.tokenId];

        uint index = map.indexOf[key.nftAddress][key.tokenId];
        uint lastIndex = map.keys.length - 1;
        MapKeys memory lastKey = map.keys[lastIndex];

        map.indexOf[lastKey.nftAddress][lastKey.tokenId] = index;
        delete map.indexOf[key.nftAddress][key.tokenId];

        map.keys[index] = lastKey;
        map.keys.pop();

        // seller 
        uint sellerIndex = map.sellerIndexOf[seller][key.nftAddress][key.tokenId];
        uint sellerLastIndex = map.sellerKeys[seller].length - 1;
        MapKeys memory sellerLastKey = map.sellerKeys[seller][sellerLastIndex];

        map.sellerIndexOf[seller][sellerLastKey.nftAddress][sellerLastKey.tokenId] = sellerIndex;
        delete map.sellerIndexOf[seller][key.nftAddress][key.tokenId];

        map.sellerKeys[seller][sellerIndex] = sellerLastKey;
        map.sellerKeys[seller].pop();


        // collection 
        uint collectionIndex = map.collectionIndexOf[collection][key.nftAddress][key.tokenId];
        uint collectionLastIndex = map.collectionKeys[collection].length - 1;
        MapKeys memory collectionLastKey = map.collectionKeys[collection][collectionLastIndex];

        map.collectionIndexOf[collection][collectionLastKey.nftAddress][collectionLastKey.tokenId] = collectionIndex;
        delete map.collectionIndexOf[collection][key.nftAddress][key.tokenId];

        map.collectionKeys[collection][collectionIndex] = collectionLastKey;
        map.collectionKeys[collection].pop();
    }
}
