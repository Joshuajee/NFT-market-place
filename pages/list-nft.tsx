import { useState } from "react";
import { ethers }from "ethers";
import NavBar from "../src/components/Navbar";
import { Button, Container, Grid } from "@mui/material";
import Modal from "../src/components/Mint/Modal";


export default function ListNFT () {

    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const [message, updateMessage] = useState('');

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


    return (
        <div>

            <NavBar />

            <Container maxWidth="lg">

                <Grid container spacing={2} sx={{marginTop: "2em"}}>

                    <Grid container justifyContent={"center"}> 
                        <Button onClick={() => setShowModal(true)} variant="contained">Mint NFT</Button>
                    </Grid>

                </Grid>

            </Container>

            <Modal open={showModal} setOpen={setShowModal} />

        </div>
    )
}
