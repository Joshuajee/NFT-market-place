import { useEffect, useState } from "react";
import { readContracts } from '@wagmi/core'
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { TOKEN_DETAILS } from "../libs/intefaces";
import { getNFTUrl } from "../libs/utils";
import { ADDRESS } from "../libs/types";


const useGetTokenMetadata = (tokens: TOKEN_DETAILS[] | undefined) => {

    const [tokenURIs, setTokenURIs] = useState<string[]>([])
    const [metadata, setMetadata] = useState<any[] | null>(null)
    const [contracts, setContracts] = useState<Array<any> | undefined>()


    useEffect(() => {

        const contracts: Array<any> | undefined = tokens?.map((token : TOKEN_DETAILS) => {
            return {
                address: token.nftAddress as ADDRESS,
                abi: RoyaltyTokenABI,
                functionName: "tokenURI",
                args: [token.tokenId]
            }
        })

        setContracts(contracts)

    }, [tokens])

    
    useEffect(() => {

        const fetchURIs = async () => {
            try {
                const data = await readContracts({contracts: contracts as any[] })
                setTokenURIs(data as string[])
            } catch (e) {
                console.error(e)
            }
        }

        fetchURIs()

    }, [contracts])


    useEffect(() => {
       
        const getMetadata = async () => {

            const data = await Promise.all(tokenURIs?.map(async (tokenURI: string, index: number) => {
                const data = await (await fetch(getNFTUrl(tokenURI))).json()
                const token = tokens?.[index]
                return { ...data, price: token?.price, tokenId: token?.tokenId  }
            }))

            setMetadata(data)

        } 

        getMetadata()

    }, [tokenURIs, tokens])

    console.log(metadata)

    return metadata

}

export default useGetTokenMetadata