import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NavBar from "../components/app/navbar";
import { Button, Container, Grid } from "@mui/material";
import Modal from "../components/mint/modal";
import NFTCard from "../components/cards/NFTCard";
import axios from "axios";
import NFTListCard from "../components/cards/NFTListCard";


export default function WalletNFT () {

    const [address, setAddress] = useState<any>(null)
    const [NFTs, setNFTs] = useState<any>([])

    const [showModal, setShowModal] = useState(false);

    // //This function uploads the metadata to IPFS
    // async function uploadMetadataToIPFS() {
    //     const {name, description, price} = formParams;
    //     //Make sure that none of the fields are empty
    //     if( !name || !description || !price || !fileURL)
    //         return;

    //     const nftJSON = {
    //         name, description, price, image: fileURL
    //     }

    //     try {
    //         //upload the metadata JSON to IPFS
    //         const response = await uploadJSONToIPFS(nftJSON);
    //         if(response.success === true){
    //             console.log("Uploaded JSON to Pinata: ", response)
    //             return response.pinataURL;
    //         }
    //     }
    //     catch(e) {
    //         console.log("error uploading JSON metadata:", e)
    //     }
    // }


    const getNFTs = async () => {

        const res = (await axios.post(`/api/get-nfts?owner=${address}`)).data

        setNFTs(res.data.ownedNfts)

    }


    useEffect(() => {
        if (address) getNFTs()
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
