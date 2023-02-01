/* eslint-disable @next/next/no-img-element */
import { Box, Card, Grid, Typography } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"
import { NFT_COLLECTION, NFT_DETAILS } from "../../libs/intefaces"

interface IProps {
    nft: any
}

const NFTCard = (props: IProps) => {

    const { image, name, tokenId, contract } = props.nft

    const router = useRouter()

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} data-aos={"zoom-up"} >

            <Card sx={{ borderRadius: "25px", height: "calc(100% - 3.4em)" }}>

                <img alt={`${name} #${tokenId}`}  onClick={() => router.push(`/collection/${contract}/${tokenId}?image=${image}&name=${name}`)} style={{objectFit: "cover", cursor: "pointer", width: "100%", aspectRatio: 1 / 1 }} src={image}  />

                <Box sx={{position: "relative", top: "-5em", left: "1em"}}>

                    <Typography sx={{ fontWeight: 700}} variant="subtitle1">{name} #{tokenId}</Typography>

                    <Typography sx={{ fontWeight: 700}} component={"div"} variant="body2"> Price: {tokenId}</Typography>

                </Box>
   
            </Card>

        </Grid>
    )
}

export default NFTCard