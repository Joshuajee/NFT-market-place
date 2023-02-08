/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi'
import {  Grid, Typography, Card } from "@mui/material";
import { useRouter } from "next/router";
import { getNFTUrl, verifyAddress } from "../../../libs/utils";
import axios from "axios";
import styles from "../../../styles/Pages.module.css";
import Layout from "../../../components/app/layout";
import { polygonMumbai } from "wagmi/chains";
import RoyaltyTokenABI from "../../../abi/RoyaltyToken.json";


export default function NFT () {

    const router = useRouter()

    const { contract, tokenId, image, name } = router.query

    const [data, setData] = useState(null)

    const tokenData = useContractRead({
        address: contract as `0x${string}`,
        abi: RoyaltyTokenABI,
        functionName: 'tokenURI',
        chainId: polygonMumbai.id,
        args: [tokenId],
    })

    // const fetchNFTData = async () => {
    //     const url = getNFTUrl(String(tokenData?.data as string))
    //     try {
    //         const res = await axios.get(url)
    //         setData(res.data)
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }

    // useEffect(() => {
    //     if(!verifyAddress(String(contract))) {
    //         toast.error("Invalid Collection Address, Redirecting...")

    //         setTimeout(() => {
    //             router.push(ROUTES.MARKET_PLACE)
    //         }, 6000)
    //     }
    // }, [contract])

    // useEffect(() => {

    //     if (tokenData.data) {
    //         fetchNFTData()
    //     }

    // }, [tokenData.data])


    return (
        <Layout>
            <Grid container spacing={2} sx={{marginTop: "2em"}}>
                <Grid container justifyContent={"center"}> 
                    <Typography variant="h6"></Typography>
                </Grid>
            </Grid>

            {
                true && (
                    <Grid container spacing={2} sx={{marginTop: "2em"}}>
            
                        <Grid item sm={6}> 
            
                            <Card sx={{height: "30em", borderRadius: "10px"}}>

                                <img alt={``} style={{objectFit: "contain", cursor: "pointer", aspectRatio: 1 / 1, width: "100%" }} src={String(image)}  />
            
                            </Card>                    
            
                        </Grid>
            
                        <Grid item sm={6}> 
                        
                            <Card sx={{height: "30em", borderRadius: "10px", padding: "1em"}}>
            
                                <Grid item container spacing={2} justifyContent="center">
                                    <Grid item xs={12}> <Typography className={styles.name} variant="body1"> {name} #{tokenId}</Typography> </Grid>
                                    {/*<Grid item xs={12}> <Typography variant="body1"> Description: {data?.description} </Typography> </Grid>
                                    <Grid item xs={12}> <Typography variant="body1"> Price: {data?.price} </Typography> </Grid>
                                    <Grid item xs={12}> <Typography variant="body1"> Seller: {data?.seller} </Typography> </Grid>
             */}
                                    {/* <Grid item xs={12}> <Typography variant="body1"> {data?.seller === address && "You own this NFT"} </Typography> </Grid> */}
            {/* 
                                    <Grid item xs={12}>
                                        <LoadingButton 
                                            disabled={data?.seller === address}
                                            onClick={buyNFT} 
                                            variant={"contained"}
                                            loading={loading}
                                            loadingIndicator={"Loading..."}
                                            >
                                            Buy {data?.price} ETH
                                        </LoadingButton> 
                                    </Grid> */} 
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                )
            }   
        </Layout>
    )
}

