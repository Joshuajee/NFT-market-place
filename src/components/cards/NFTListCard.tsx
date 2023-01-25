/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab"
import { Box, Button, Card, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { ethers } from "ethers";
import abi from "../../libs/abi.json";
import nftAbi from "../../libs/nftAbi.json";

interface IProps {
    nft: any
}

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

const NFTListCard = (props: IProps) => {

    const { image, name } = props.nft?.rawMetadata

    const { tokenId, contract } = props.nft

    const [loading, setLoading] = useState(false)


    const listNFT = async (nftAddress: string, tokenId: string, price: number) => {

        setLoading(true)

        try {

            const provider = new ethers.providers.Web3Provider(window?.ethereum);

            const signer = provider.getSigner();

            //create an NFT Token
            const NFTcontract = new ethers.Contract(nftAddress, nftAbi, signer)

            if (await NFTcontract.getApproved(tokenId) === contractAddress) {
            
                await completeListing(nftAddress, tokenId, price)         
            
            } else {
            
                const transaction = await NFTcontract.approve(contractAddress , tokenId)

                await transaction.wait();
            
                await completeListing(nftAddress, tokenId, price)    
            
            }

        } catch (e) {

            console.error(e)

        }

        setLoading(false)
              
    }

    const completeListing = async (nftAddress: string, tokenId: string, price: number) => {

        const provider = new ethers.providers.Web3Provider(window?.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_CONTRACT), abi, signer)
        
        const value = ethers.utils.parseUnits(String(price), 'ether')

        //list the NFT Token
        const transaction = await contract.listItem(nftAddress, tokenId, value)

        await transaction.wait();

    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={4} >

            <Card sx={{height: "30em", borderRadius: "10px"}}>

                <img alt={`${name} #${tokenId}`} style={{objectFit: "cover"}} src={image} height="auto" width="100%" />

                <Grid item sx={{marginTop: "1em"}} container spacing={2} justifyContent="center">

                    <Typography sx={{ fontWeight: 700, fontSize: "1.4em"}} variant="body1">{name}</Typography>

                    <Grid container justifyContent={"center"}>
                        <LoadingButton loading={loading} loadingIndicator="Loading..." onClick={() => listNFT(contract.address, tokenId, 0.01)} variant="contained"> List NFT to Market </LoadingButton>
                    </Grid>

                </Grid>
   
            </Card>

        </Grid>
    )
}

export default NFTListCard