import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk';

const pinata = pinataSDK(String(process.env.PINATA_KEY), String(process.env.PINATA_SECRET));



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {

        const data = await pinata.pinJSONToIPFS(req.body)

        res.send(data)

    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }

}
