import { METADATA } from "./intefaces";
import { ADDRESS } from "./types";

export enum ROUTES {
    MARKET_PLACE = "/",
    MINT_NFT = "/mint-nft",
    SELL_NFT = "/sell-nft",
    MY_PROFILE = "/my-profile"
}

export enum ROUTES_NAME {
    MARKET_PLACE = "Market Place",
    MINT_NFT = "Mint NFT",
    SELL_NFT = "Sell NFT",
    MY_PROFILE = "My Profile"
}

export const ERROR_META : METADATA = {
    name: "NOT FOUND",
    description: "Unreconized token URI",
    image: "/NOTFOUND",
    price: 0,
    tokenId: 0,
    contract: "NOT FOUND" as ADDRESS,
    seller: "NOT FOUND" as ADDRESS
}