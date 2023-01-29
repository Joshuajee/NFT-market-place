import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NavBar from "../../components/app/navbar";
import { Button, Container, Grid, Typography } from "@mui/material";
import Modal from "../../components/mint/modal";
import NFTCard from "../../components/cards/NFTCard";
import NFTListCard from "../../components/cards/NFTListCard";
import { useRouter } from "next/router";
import { verifyAddress } from "../../libs/utils";
import { getNFTsByCollection } from "../../libs/alchemy";
import { toast } from "react-toastify";
import { ROUTES } from "../../libs/constants";
import { NFT_COLLECTION } from "../../libs/intefaces";

export default function Collection () {

    const router = useRouter()

    const contract = router.query.contract

    const [NFTs, setNFTs] = useState<any>([])
    const [pageKey, setPageKey] = useState<any>([])

    const [showModal, setShowModal] = useState(false);

    const getNFTs = async (pageKey: null | string = null) => {

        if(verifyAddress(String(contract))) {
            const result = await getNFTsByCollection(String(contract), pageKey)
            if (result.status)
                setNFTs(result.data?.nfts)
            else {
                toast.error(result.error)
            }
        } else {

            toast.error("Invalid Collection Address, Redirecting")

            setTimeout(() => {
                router.push(ROUTES.MARKET_PLACE)
            }, 4000)
        }
    }

    useEffect(() => {
        if (contract) getNFTs()
    }, [contract])


    const collection = (
        <Grid container spacing={2} sx={{marginTop: "2em"}}>
            {
                NFTs.map((nft: NFT_COLLECTION, index: number) => <NFTListCard nft={nft} key={index} /> )
            }
        </Grid>
    )


    return (
        <div>

            <NavBar />

            <Container maxWidth="lg">

                <Grid container spacing={2} sx={{marginTop: "2em"}}>

                    <Grid container justifyContent={"center"}> 
                        <Typography variant="h6"></Typography>
                    </Grid>

                </Grid>

                {
                    NFTs.length != 0 ? collection : ""
                }   

            </Container>

            <Modal open={showModal} setOpen={setShowModal} />

        </div>
    )
}
