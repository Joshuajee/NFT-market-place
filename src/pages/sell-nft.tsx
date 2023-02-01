import { useCallback, useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { Container, Grid } from "@mui/material";
import NFTListCard from "../components/cards/NFTListCard";
import ConnectScreen from "../components/ui/connectScreen";
import Layout from "../components/app/layout";
import { getNFTsByOwner } from "../libs/alchemy";
import { toast } from "react-toastify";
import { NFT_COLLECTION } from "../libs/intefaces";
import LoadingBG from "../components/app/loaderBg";



export default function SellNFT () {

    const [NFTs, setNFTs] = useState<any>(null)
    const [initialLoading, setInitialLoading] = useState(true)

    const { isConnected, address } = useAccount()

    const getNFTs = useCallback(async () => {

        setInitialLoading(true)

        const result = await getNFTsByOwner(address as string)
        if (result.status) {
            setNFTs(result.data?.ownedNfts)
        } else {
            toast.error(result.error)
        }

        setInitialLoading(false)

    }, [address])


    const addNFTs = useCallback(async () => {

        const result = await getNFTsByOwner(address as string)
        if (result.status) {
            setNFTs((nfts: any) => [...nfts, result.data?.ownedNfts])
        } else {
            toast.error(result.error)
        }

    }, [address])

    useEffect(() => {
        if(isConnected) getNFTs()
    }, [isConnected, getNFTs])

    

    const pageContent = (
        <Container maxWidth="lg">
            {
                NFTs &&
                    <Grid container spacing={2} sx={{marginTop: "2em"}}>
                        {
                            NFTs.map((nft: NFT_COLLECTION, index: number) => <NFTListCard nft={nft} address={address} key={index} /> )
                        }
                    </Grid>
                }
        </Container>
    )


    return (
        <Layout>
            {
                !isConnected ? <ConnectScreen /> : initialLoading ?  <LoadingBG /> : pageContent
            }
        </Layout>
    )
}
