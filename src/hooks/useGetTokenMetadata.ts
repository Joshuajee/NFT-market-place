import { useEffect, useState } from "react";
import { readContracts } from '@wagmi/core'
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { CONTRACTS, METADATA, TOKEN_DETAILS } from "../libs/intefaces";
import { getNFTUrl } from "../libs/utils";
import { ADDRESS } from "../libs/types";
import { ERROR_META } from "../libs/constants";


const useGetTokenMetadata = (tokens: TOKEN_DETAILS[] | undefined) => {

    const [tokenURIs, setTokenURIs] = useState<string[]>([])
    const [metadata, setMetadata] = useState<METADATA[] | null>(null)
    const [contracts, setContracts] = useState <CONTRACTS[] | undefined>()


    useEffect(() => {
        const contracts: CONTRACTS[] | undefined = tokens?.map((token : TOKEN_DETAILS) => {
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
                const token = tokens?.[index]

                try {
                    const data = await (await fetch(getNFTUrl(tokenURI))).json()
                    return { ...data, price: token?.price, tokenId: token?.tokenId, contract: token?.nftAddress  }
                } catch (e) {
                    console.log({...ERROR_META, price: token?.price, tokenId: token?.tokenId, contract: token?.nftAddress})
                    return {...ERROR_META, price: token?.price, tokenId: token?.tokenId, contract: token?.nftAddress}
                }
            

            }))

            setMetadata(data)

        } 

        getMetadata()

    }, [tokenURIs, tokens])

    console.log(metadata)


    return metadata

}

export default useGetTokenMetadata