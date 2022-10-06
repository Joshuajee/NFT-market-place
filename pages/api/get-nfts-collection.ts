import api from 'api'
import { getNetwork } from '../../libs/chooseNetwork'

const sdk = api('@alchemy-docs/v1.0#1ae9z2il7zo8f1u');

const getNft = async(req: any, res: any) => {

    try {

        const  { chainId, contractAddress, pageKey } = req.query

        const network = getNetwork(chainId)

        sdk.server(network.link);
    
        const data = await sdk.getNFTsForCollection(
            {
                apiKey: network.apiKey,
                withMetadata: true, 
                contractAddress,
                startToken: pageKey,
                limit: 30,
            }
        )

        console.log(data)
        res.send({ data: data })

    } catch (e) {
        res.status(500).send({error: e})
        console.error(e)
    }

}

export default getNft