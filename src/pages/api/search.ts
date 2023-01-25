import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: String(process.env.ALCHEMY_API_KEY), // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const searchCollection = async(req: any, res: any) => {

    try {

        const  { contractAddress } = req.query
        
        const data = await alchemy.nft.getContractMetadata(contractAddress);

        res.send({ data })

    } catch (e) {
        res.status(500).send({error: e})
        console.error(e)
    }

}

export default searchCollection