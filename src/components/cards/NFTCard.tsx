/* eslint-disable @next/next/no-img-element */
import { Card, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"

interface IProps {
    nft: any
}

const NFTCard = (props: IProps) => {

    const { image, name, tokenId, contract } = props.nft

    const router = useRouter()

    return (
        <Grid item xs={12} sm={6} md={4} lg={4} >

            <Card sx={{height: "30em", borderRadius: "10px"}}>

                <img alt={`${name} #${tokenId}`}  onClick={() => router.push(`/nft?contract=${contract}&tokenId=${tokenId}`)} style={{objectFit: "cover"}} src={image} height="auto" width="100%" />

                <Grid item sx={{marginTop: "1em"}} container spacing={2} justifyContent="center">

                    <Typography sx={{ fontWeight: 700, fontSize: "1.4em"}} variant="body1">{name}</Typography>

                </Grid>
   
            </Card>

        </Grid>
    )
}

export default NFTCard