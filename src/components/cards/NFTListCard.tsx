/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab"
import { Box, Button, Card, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { ethers } from "ethers";
import abi from "../../libs/abi.json";
import nftAbi from "../../libs/nftAbi.json";
import { NFT_COLLECTION } from "../../libs/intefaces";

interface IProps {
    nft: NFT_COLLECTION
}
const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

const NFTListCard = (props: IProps) => {

    const { media, contract, title, tokenId } = props.nft

    const { gateway } = media[0]

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
        <Grid item xs={12} sm={6} md={4} lg={3} >

            <Card sx={{ borderRadius: "10px", height: "calc(100% - 2.2em)" }}>

                <img alt={`${title} #${tokenId}`} style={{objectFit: "cover", cursor: "pointer", width: "100%", aspectRatio: 1 / 1 }} src={gateway} height="auto" width="100%" />

                <Box sx={{position: "relative", top: "-3em", left: "0.6em"}} >

                    <Typography sx={{ fontWeight: 700, fontSize: "1em"}} variant="body1">{title}</Typography>

                </Box>
   
            </Card>

        </Grid>
    )
}

export default NFTListCard