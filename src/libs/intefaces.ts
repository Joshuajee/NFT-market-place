import { ADDRESS } from "./types";

export interface NFT_COLLECTION {
    media: { gateway: string } [],
    contract: {
        address: string,
        symbol: string
    },
    title: string, 
    description: string, 
    tokenId: string
}
export interface NFT_DETAILS {
    name: string, 
    description: string, 
}

export interface ROYALTY_DETAILS {
    enabled: boolean, 
    value: number, 
}

export interface TOKEN_DETAILS {
    price: number;
    nftAddress: ADDRESS;
    tokenId: number;
    seller: ADDRESS
}

export interface CONTRACTS {
    address: ADDRESS,
    abi: any[],
    functionName: string,
    args: any[]
}

export interface METADATA {
    contract: ADDRESS;
    description: string; 
    image: string; 
    name: string;
    price: number; 
    tokenId: number;  
    seller: ADDRESS;    
}