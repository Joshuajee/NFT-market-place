import { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, useContractEvent } from 'wagmi';
import {  LoadingButton } from "@mui/lab";
import {  Grid, Typography, Card } from "@mui/material";
import { useRouter } from "next/router";
import { contractAddress, convertToEther, getNFTUrl } from "../../../libs/utils";
import styles from "../../../styles/Pages.module.css";
import Layout from "../../../components/app/layout";
import RoyaltyTokenABI from "../../../abi/RoyaltyToken.json";
import NFTMarketplaceABI from "../../../abi/NFTMarketplace.json";
import { ADDRESS } from "../../../libs/types";
import { toast } from "react-toastify";
import LoadingBG from "../../../components/app/loaderBg";
import Image from "next/image";
import { METADATA, TOKEN_DETAILS } from "../../../libs/intefaces";
import { ERROR_META } from "../../../libs/constants";


export default function NFT () {

    const router = useRouter()

    const { contract, tokenId } = router.query

    const { address } = useAccount()

    const [metadata, setMetadata] = useState<METADATA | null>(null)
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

            const token : TOKEN_DETAILS = listingData.data as TOKEN_DETAILS

            try {
                const data = await (await fetch(getNFTUrl(tokenURI.data as string))).json()
                setMetadata({...data, price: token?.price, tokenId: token?.tokenId, seller: token?.seller })
            } catch (e) {
                toast.error("Oops! an error occured")
                setMetadata({...ERROR_META, price: token?.price, tokenId: token?.tokenId, seller: token?.seller})
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

    const buy = () => {
        if (!address) return toast.error("Please connect your wallet!")
        buyNFT?.write()
    }


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
            
                            <Card sx={{height: "30em", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>

                                <Image 
                                    alt={`NFT`} 
                                    width={1000}
                                    height={1000 }
                                    objectFit={"contain"}
                                    src={getNFTUrl(String(metadata?.image))} />

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
                                                onClick={buy} 
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

