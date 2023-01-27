import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NavBar from "../components/app/navbar";
import { Button, Container, Grid, Typography } from "@mui/material";
import Modal from "../components/mint/modal";
import NFTCard from "../components/cards/NFTCard";
import axios from "axios";
import { getAddress } from "../libs/utils";
import NFTListCard from "../components/cards/NFTListCard";
import { useRouter } from "next/router";

export default function Collection () {

    const router = useRouter()

    const { contract } = router.query

    const [address, setAddress] = useState<any>(null)
    const [NFTs, setNFTs] = useState<any>([])

    const [showModal, setShowModal] = useState(false);

    const getNFTs = async () => {

        const data = (await axios.post(`/api/get-nfts-collection?contractAddress=${contract}`)).data

        setNFTs(data.nfts)

    }

    useEffect(() => {
        getAddress(setAddress)
    }, [])

    useEffect(() => {
        if (contract) getNFTs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract])



    return (
        <div>

            <NavBar />

            <Container maxWidth="lg">

                <Grid container spacing={2} sx={{marginTop: "2em"}}>

                    <Grid container justifyContent={"center"}> 
                        <Typography></Typography>
                    </Grid>

                </Grid>


                <Grid container spacing={2} sx={{marginTop: "2em"}}>

                    {
                        NFTs.map((nft: any, index: number) => <NFTListCard nft={nft} key={index} /> )
                    }

                </Grid>

            </Container>

            <Modal open={showModal} setOpen={setShowModal} />

        </div>
    )
}
