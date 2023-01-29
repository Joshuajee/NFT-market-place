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