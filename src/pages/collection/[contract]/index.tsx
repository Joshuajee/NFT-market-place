import { useCallback, useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { verifyAddress } from "../../../libs/utils";
import { getNFTsByCollection } from "../../../libs/alchemy";
import { toast } from "react-toastify";
import { ROUTES } from "../../../libs/constants";
import { NFT_COLLECTION } from "../../../libs/intefaces";
import Layout from "../../../components/app/layout";
import LoadingBG from "../../../components/app/loaderBg";
import NFTViewCard from "../../../components/cards/NFTViewCard";


export default function Collection () {

    const router = useRouter()

    const contract = router.query.contract

    const [NFTs, setNFTs] = useState<any>([])
    const [initialLoader, setInitialLoader] = useState(true)
    const [pageKey, setPageKey] = useState<any>([])

    const getNFTs = useCallback(async (pageKey: null | string = null) => {

        if(verifyAddress(String(contract))) {
            const result = await getNFTsByCollection(String(contract), pageKey)
            if (result.status)
                setNFTs(result.data?.nfts)
            else {
                toast.error(result.error)
            }
        } else {

            toast.error("Invalid Collection Address, Redirecting...")

            setTimeout(() => {
                router.push(ROUTES.MARKET_PLACE)
            }, 6000)
        }

        setInitialLoader(false)
    }, [contract, router])

    useEffect(() => {
        if (contract) getNFTs()
    }, [contract, getNFTs])


    const collection = (
        <Grid container spacing={2} sx={{marginTop: "2em"}}>
            {
                NFTs.map((nft: NFT_COLLECTION, index: number) => <NFTViewCard nft={nft} key={index} /> )
            }
        </Grid>
    )


    return (
        <Layout>
            <Container maxWidth="lg">
                <Grid container spacing={2} sx={{marginTop: "2em"}}>
                    <Grid container justifyContent={"center"}> 
                        <Typography variant="h6"></Typography>
                    </Grid>
                </Grid>
                {
                    initialLoader ? <LoadingBG /> : NFTs.length != 0 ? collection : ""
                }   
            </Container>
        </Layout>
    )
}
