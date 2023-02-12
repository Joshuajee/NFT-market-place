/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, useContractEvent } from 'wagmi';
import {  LoadingButton } from "@mui/lab";
import {  Grid, Typography, Card } from "@mui/material";
import { useRouter } from "next/router";
import { convertToEther, getNFTUrl, verifyAddress } from "../../../libs/utils";
import styles from "../../../styles/Pages.module.css";
import Layout from "../../../components/app/layout";
import RoyaltyTokenABI from "../../../abi/RoyaltyToken.json";
import NFTMarketplaceABI from "../../../abi/NFTMarketplace.json";
import { ADDRESS } from "../../../libs/types";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import LoadingBG from "../../../components/app/loaderBg";


const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)


export default function NFT () {

    const router = useRouter()

    const { contract, tokenId } = router.query

    const { address } = useAccount()

    const [metadata, setMetadata] = useState<any | null>(null)
    const [bought, setBought] = useState(false)

    const tokenURI = useContractRead({
        address: contract as ADDRESS,
        abi: RoyaltyTokenABI,
        functionName: 'tokenURI',
        args: [tokenId],
    })

    const listingData = useContractRead({
        address: contractAddress as ADDRESS,
        abi: NFTMarketplaceABI,
        functionName: 'getDetails',
        args: [contract, tokenId],
        enabled: tokenURI?.data ? true : false
    })

    const buyNFT :any = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: contractAddress as ADDRESS,
        abi: NFTMarketplaceABI,
        functionName: 'buyItem',
        args: [contract, tokenId],
        overrides: {
            value: metadata?.price,
        },
    })

    
    useEffect(() => {
       
        const getMetadata = async () => {

            const token = listingData.data as any

            try {
                const data = await (await fetch(getNFTUrl(tokenURI.data as string))).json()
                setMetadata({...data, price: token?.price, tokenId: token?.tokenId, seller: token?.seller } as any)
            } catch (e) {
                toast.error("Oops! an error occured")
            }

        } 

        if (tokenURI.data) getMetadata()

    }, [tokenURI.data, listingData.data])

    useContractEvent({
        address: contractAddress as ADDRESS,
        abi: NFTMarketplaceABI,
        eventName: 'ItemBought',
        listener(buyer, collection, tokenId, price) {
            if(buyer === address && collection === contract && tokenId === tokenId && price === price) {
                toast.success("You have successfully Bought this NFT")
                setBought(true)
            }
        },
    })

    return (
        <Layout>
            <Grid container spacing={2} sx={{marginTop: "2em"}}>
                <Grid container justifyContent={"center"}> 
                    <Typography variant="h6"></Typography>
                </Grid>
            </Grid>

            {
                (metadata && metadata?.price) ? (
                    <Grid container spacing={2} sx={{marginTop: "2em"}}>
            
                        <Grid item sm={6}> 
            
                            <Card sx={{height: "30em", borderRadius: "10px"}}>

                                <img alt={``} style={{objectFit: "cover", cursor: "pointer", aspectRatio: 1 / 1, width: "100%" }} src={String(metadata?.image)}  />
            
                            </Card>                    
            
                        </Grid>
            
                        <Grid item sm={6}> 
                        
                            <Card sx={{height: "30em", borderRadius: "10px", padding: "1em"}}>
            
                                <Grid item container spacing={2} justifyContent="center">
                                    <Grid item xs={12}> <Typography className={styles.name} variant="body1"> {metadata.name} #{tokenId}</Typography> </Grid>
                                    <Grid item xs={12}> <Typography variant="body1"> Description: {metadata?.description} </Typography> </Grid>
                                    <Grid item xs={12}> <Typography variant="body1"> Price: {convertToEther(metadata?.price)} </Typography> </Grid>
                                    <Grid item xs={12}> <Typography variant="body1"> Seller: {metadata?.seller} </Typography> </Grid>
            
                                    <Grid item xs={12}> <Typography variant="body1"> {metadata?.seller === address && "You own this NFT"} </Typography> </Grid>
        
                                    <Grid item xs={12}>
                                        {
                                            bought ? 
                                            (
                                                <Typography>You&apos;ve Bought this NFT</Typography>
                                            )
                                            : (
                                            <LoadingButton 
                                                disabled={metadata?.seller === address}
                                                onClick={() => buyNFT?.write()} 
                                                variant={"contained"}
                                                loading={buyNFT?.isLoading}
                                                sx={{width: 240}}
                                                loadingIndicator={"Please Wait..."}>
                                                Buy for { convertToEther(metadata?.price)} 
                                            </LoadingButton>
                                            ) 
                                        }
                                    </Grid>

                                </Grid>

                            </Card>

                        </Grid>

                    </Grid>
                ) : (
                    <LoadingBG />
                )
            }   
        </Layout>
    )
}

