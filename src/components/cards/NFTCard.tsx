/* eslint-disable @next/next/no-img-element */
import { Box, Card, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"

interface IProps {
    nft: any
}

const NFTCard = (props: IProps) => {

    const { image, name, tokenId, contract } = props.nft

    const router = useRouter()

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} >

            <Card sx={{height: "100%", width:"100%", borderRadius: "25px"}}>

                <img alt={`${name} #${tokenId}`}  onClick={() => router.push(`/nft?contract=${contract}&tokenId=${tokenId}`)} style={{objectFit: "cover", cursor: "pointer"}} src={image} height="100%" width="100%" />

                <Box sx={{position: "relative", top: "-5em", left: "1em"}}>

                    <Typography sx={{ fontWeight: 700}} variant="subtitle1">{name} #{tokenId}</Typography>

                    <Typography sx={{ fontWeight: 700}} component={"div"} variant="body2"> Price: {tokenId}</Typography>

                </Box>
   
            </Card>

        </Grid>
    )
}

export default NFTCard