/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ethers }   from "ethers";
import NavBar from "../components/navbar";
import { Button, Card, Container, Grid, Typography } from "@mui/material";
import abi from "../libs/abi.json";
import nftAbi from "../libs/nftAbi.json";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Pages.module.css";
import { LoadingButton } from "@mui/lab";
import Toast, { ALERT_TYPES } from "../components/alerts";

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

export default function NFT () {

    const [message, setMessage] = useState('');
    const [toast, setToast] = useState(false);
    const [messageType, setMessageType] = useState<ALERT_TYPES>(null);

    const [NFT, setNFT] = useState<any>(null)
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<string | null >(null);

    const router = useRouter()

    const { tokenId } = router.query

    const nftAddress = String(router?.query?.contract)

    async function getNFTData() {
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // //create an NFT Token
        const listedToken = await contract.getListing(nftAddress, tokenId);
 
        const NFTcontract = new ethers.Contract(nftAddress, nftAbi, signer)

        const tokenURI = await NFTcontract.tokenURI(tokenId)

        const meta = ((await axios.get(tokenURI)) as any).data;

        const price = ethers.utils.formatUnits(listedToken.price.toString(), 'ether');

        const item = {
            price: price,
            tokenId: tokenId,
            seller: listedToken.seller,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }

        setNFT(item);
        setAddress(addr)
        console.log("address", addr)
        //updateCurrAddress(addr);
    }
    
    async function buyNFT() {

        setLoading(true)
        
        try {
        
            const provider = new ethers.providers.Web3Provider(window?.ethereum);

            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const salePrice = ethers.utils.parseUnits(NFT.price, 'ether')

            //run the executeSale function
            const transaction = await contract.buyItem(nftAddress, tokenId, {value:salePrice});
            
            await transaction.wait();

            setMessage('You successfully bought the NFT!')
            setMessageType(null)
            setToast(true)
        
        }   catch(e) {
            console.error(e)
            setMessage("An error occurred")
            setMessageType("error")
            setToast(true)
        }

        setLoading(false)

    }


    useEffect(() => {
        getNFTData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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

                                        <Grid item xs={12}> <Typography variant="body1"> Description: {NFT.description} </Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> Price: {NFT.price} </Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> Seller: {NFT.seller} </Typography> </Grid>

                                        <Grid item xs={12}> <Typography variant="body1"> {NFT.seller === address && "You own this NFT"} </Typography> </Grid>

                                        <Grid item xs={12}>
                                            <LoadingButton 
                                                disabled={NFT.seller === address}
                                                onClick={buyNFT} 
                                                variant={"contained"}
                                                loading={loading}
                                                loadingIndicator={"Loading..."}
                                                >
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

            <Toast type={messageType} open={toast} setOpen={setToast} message={message} />

        </div>
    )
}
