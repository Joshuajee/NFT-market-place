/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ethers }   from "ethers";
import NavBar from "../src/components/Navbar";
import { Button, Card, Container, Grid, Typography } from "@mui/material";
import abi from "../src/libs/abi.json";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Pages.module.css";
import { LoadingButton } from "@mui/lab";

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

export default function NFT () {

    const [message, updateMessage] = useState('');
    const [image, setImage] = useState(null)
    const [NFT, setNFT] = useState<any>(null)
    const [showModal, setShowModal] = useState(false);

    const router = useRouter()

    const { tokenId, contract } = router.query

    async function getNFTData() {
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        const contract = new ethers.Contract(contractAddress, abi, signer)
        //create an NFT Token
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        const price = ethers.utils.formatUnits(listedToken.price.toString(), 'ether');

        const item = {
            price: price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }

        setNFT(item);
        console.log("address", addr)
        //updateCurrAddress(addr);
    }

    console.log(NFT)
    
    async function buyNFT() {
        
        try {
        
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const salePrice = ethers.utils.parseUnits(NFT.price, 'ether')
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, {value:salePrice});
            await transaction.wait();
    
            alert('You successfully bought the NFT!');
            updateMessage("");
        
        }   catch(e) {
            //alert("Upload Error"+e)
        }
    }


    useEffect(() => {
        getNFTData()
    }, [getNFTData])


    return (
        <div>

            <NavBar />

            <Container maxWidth="lg">

                {

                    NFT && (
                        <Grid container spacing={2} sx={{marginTop: "2em"}}>

                            <Grid item md={6}> 
        
                                <Card sx={{height: "30em", borderRadius: "10px"}}>
        
                                    <img src={NFT.image} height="100%" width="auto" alt="NFT image" />
        
                                </Card>                    
        
                            </Grid>
        
                            <Grid item md={6}> 
                            
                                <Card sx={{height: "30em", borderRadius: "10px", padding: "1em"}}>
    
                                    <Grid item container spacing={2} justifyContent="center">

                                        <Grid item xs={12}> <Typography className={styles.name} variant="body1"> {NFT.name} #{tokenId}</Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> Description: {NFT.description}</Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> Owner: {NFT.owner}</Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> Seller: {NFT.seller}</Typography> </Grid>

                                        <Grid item xs={12}>
                                            <LoadingButton onClick={buyNFT} variant={"contained"}>
                                                Buy {NFT.price} ETH
                                            </LoadingButton> 
                                        </Grid>
                                            
                                    </Grid>

                                </Card>

                            </Grid>
        
                        </Grid>

                    )

                }

            </Container>

        </div>
    )
}
