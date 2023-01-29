import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_KEY), // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const searchCollection = async(contractAddress: string) => {
    try {
        const data = await alchemy.nft.getContractMetadata(contractAddress);
        return ({ status: true, data })
    } catch (e) {
        return ({ status: false, error: "An error occured" })
    }

}



export const getNFTsByCollection = async (contractAddress: string, pageKey?: null | string) => {
    try {
        const data = await alchemy.nft.getNftsForContract(contractAddress);
        return ({ status: true, data })
    } catch (e) {
        return ({ status: false, error: "An error occured" })
    } 
}



export const getNFTsByOwner = async(owner: string) => {
    try {
        const data = await alchemy.nft.getNftsForOwner(owner);
        return ({ status: true, data })
    } catch (e) {
        return ({ status: false, error: "An error occured" })
    }
}