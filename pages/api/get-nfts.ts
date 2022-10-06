import api from 'api'
import { getNetwork } from '../../libs/chooseNetwork'

const sdk = api('@alchemy-docs/v1.0#1ae9z2il7zo8f1u');

const getNft = async(req: any, res: any) => {

    try {

        const  { chainId, owner, contractAddresses, pageKey } = req.query

        const network = getNetwork(chainId)

        sdk.server(network.link);
    
        const data = await sdk.getNFTs(
            {
                apiKey: network.apiKey,
                withMetadata: true, 
                owner: owner,
                contractAddresses: contractAddresses != 'null' ? contractAddresses : undefined,
                pageSize: 30,
                pageKey: pageKey != 'null' ? pageKey : undefined,
            }
        )

        res.send({ data: data })

    } catch (e) {
        res.status(500).send({error: e})
        console.error(e)
    }

}

export default getNft