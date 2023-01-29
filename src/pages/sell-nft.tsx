import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NavBar from "../components/app/navbar";
import { Button, Container, Grid } from "@mui/material";
import Modal from "../components/mint/modal";
import NFTCard from "../components/cards/NFTCard";
import axios from "axios";
import NFTListCard from "../components/cards/NFTListCard";

export default function ListNFT () {

    const [address, setAddress] = useState<any>(null)
    const [NFTs, setNFTs] = useState<any>([])

    const [showModal, setShowModal] = useState(false);

    const getNFTs = async () => {

        // const res = (await getNft(address))

        // console.log(res)

        //setNFTs(res.data.ownedNfts)

    }

    useEffect(() => {
        //getAddress(setAddress)
    }, [])

    useEffect(() => {
        //if (address) getNFTs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])



    return (
        <div>
            <NavBar />
            <Container maxWidth="lg">
                <Grid container spacing={2} sx={{marginTop: "2em"}}>
                    <Grid container justifyContent={"center"}> 
                        <Button onClick={() => setShowModal(true)} variant="contained">Mint NFT</Button>
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
