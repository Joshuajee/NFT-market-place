import { Box, Card, Grid, Typography } from "@mui/material"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import Image from "next/image"
import React, { useState } from "react"
import { getNFTUrl } from "../../libs/utils"
import { METADATA } from "../../libs/intefaces"


interface IProps {
    nft: METADATA;
}

const NFTCard = (props: IProps) => {

    const { image, name, tokenId, contract, price } = props.nft

    const router = useRouter()

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} data-aos={"zoom-up"} >

            <Card 
                sx={{borderRadius: "25px", height: "calc(100% - 3.4em)", cursor: "pointer"}}
                onClick={() => router.push(`/collection/${contract}/${tokenId}`)}>
                
                <Image 
                    alt={`${name} #${tokenId}`}  
                    height={600}
                    width={600}
                    objectFit="cover"
                    src={getNFTUrl(image)}  />

                <Box sx={{position: "relative", top: "-5em", left: "1em"}}>

                    <Typography sx={{ fontWeight: 700}} variant="subtitle1">{name} #{tokenId.toString()}</Typography>

                    <Typography sx={{ fontWeight: 700}} component={"div"} variant="body2"> Price: {ethers.utils.formatUnits(price.toString(), 'ether')} MATIC</Typography>

                </Box>
   
            </Card>

        </Grid>
    )
}

export default NFTCard