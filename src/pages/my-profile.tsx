import axios from "axios";
import { useAccount } from 'wagmi'
import Layout from "../components/app/layout";
import NFTMarketplaceABI from "../abi/NFTMarketplace.json";
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { ethers }   from "ethers";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import NFTCard from "../components/cards/NFTCard";
import ConnectScreen from "../components/ui/connectScreen";


const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

const limit = 50

export default function Profile () {

    const { isConnected, address } = useAccount()

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [totalPrice, updateTotalPrice] = useState("0");


    const pageContent = (
        <Box>
            <Grid item justifyContent={"center"} container> 
                <Typography sx={{fontWeight: 700, marginTop: "1em"}} textAlign={"center"} variant="h4"> Wallet Address </Typography>
            </Grid>
            
            <Grid item justifyContent={"center"} container> 
                <Typography variant="body2"> {address} </Typography>
            </Grid>

            <Grid item justifyContent={"center"} container> 
                <Grid item xs={1}>
                    <div>
                        <h2 className="font-bold">No. of NFTs</h2>
                        {data.length}
                    </div>
                </Grid>
                <Grid item xs={1}>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETH
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{marginTop: "2em"}}>
                {
                    data.map((nft, index) => <NFTCard nft={nft} key={index} /> )
                }
            </Grid>
        </Box>
    )


    return (
        <Layout>
            {isConnected ? pageContent : <ConnectScreen />}
        </Layout>
    )
};

