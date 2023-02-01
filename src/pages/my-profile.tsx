import axios from "axios";
import { useAccount } from 'wagmi'
import Layout from "../components/app/layout";
import abi from "../abi/abi.json";
import nftAbi from "../abi/nftAbi.json";
import { ethers }   from "ethers";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import NFTCard from "../components/cards/NFTCard";
import ConnectScreen from "../components/ui/connectScreen";


const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT)

export default function Profile () {

    const { isConnected, address } = useAccount()

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData() {

        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        const contract = new ethers.Contract(contractAddress, abi, signer)

        //create an NFT Token
        const transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async (i: any) => {

            const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_NFT_CONTRACT), nftAbi, signer)

            const tokenURI = await contract.tokenURI(i.tokenId);

            const meta = (await axios.get(tokenURI)).data;

            const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            const item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                image: meta.image,                    
                name: meta.name,
                description: meta.description,
            }

            sumPrice += Number(price);

            return item;
            
        }))

        updateData(items as any);
        updateFetched(true);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    useEffect(() => {
        //getNFTData();
    }, [])

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

