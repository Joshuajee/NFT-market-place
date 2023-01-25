import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: String(process.env.ALCHEMY_API_KEY), // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const getNft = async (contractAddress: string, pageKey: string) => {

    try {
        const data = await alchemy.nft.getNftsForContract(contractAddress);
        return data
    } catch (e) {
        return e
    }

}
