/* eslint-disable @next/next/no-img-element */
import { Box, Button, Card, Grid, Typography } from "@mui/material"
import React, { useState } from "react"
import { NFT_COLLECTION } from "../../libs/intefaces";
import SellNFTModal from "../ui/sellNFT";
import { ADDRESS } from "../../libs/types";

interface IProps {
    nft: NFT_COLLECTION,
    address: ADDRESS
}
const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

const NFTListCard = (props: IProps) => {

    const { media, contract, title, tokenId } = props.nft
    const [open, setOpen] = useState(false)

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} >

            <Card sx={{ borderRadius: "10px", height: "calc(100% - 2em)" }}>

                <SellNFTModal nft={props.nft} address={props.address}  />

                <img alt={`${title} #${tokenId}`} style={{objectFit: "cover", cursor: "pointer", width: "100%", aspectRatio: 1 / 1 }} src={media[0]?.gateway} height="auto" width="100%" />

                <Box sx={{position: "relative", top: "-3em", left: "0.6em"}} >
                    <Typography sx={{ fontWeight: 700, fontSize: "1em"}} variant="body1">{title}</Typography>
                </Box>

            </Card>

        </Grid>
    )
}

export default NFTListCard