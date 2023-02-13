import { useAccount, useContract, useContractRead } from 'wagmi'
import Layout from "../components/app/layout";
import NFTMarketplaceABI from "../abi/NFTMarketplace.json";
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import NFTCard from "../components/cards/NFTCard";
import ConnectScreen from "../components/ui/connectScreen";
import useRangeQuery from "../hooks/useRangeQuery";
import { contractAddress } from "../libs/utils";
import useGetTokenMetadata from "../hooks/useGetTokenMetadata";
import { ADDRESS } from '../libs/types';
import { METADATA, TOKEN_DETAILS } from '../libs/intefaces';
import LoadingBG from '../components/app/loaderBg';

const limit = 50

export default function Profile () {

    const { isConnected, address } = useAccount()
    const [initialLoading, setInitialLoading] = useState(true)
    const [dataFetched, updateFetched] = useState(false);
    const [totalPrice, updateTotalPrice] = useState("0");

    const [data, setData] = useState<METADATA[]>([]);
    const [start, setStart] = useState(0);


  
    const trueLimit = useRangeQuery(start, limit)
  
    const listSize = useContractRead({
      address: contractAddress as ADDRESS,
      abi: NFTMarketplaceABI,
      functionName: 'sellerSize',
      args: [address],
      enabled: isConnected
    })
  
    const listings = useContractRead({
      address: contractAddress as ADDRESS,
      abi: NFTMarketplaceABI,
      functionName: 'getSellerNFTsByRange',
      args: [address, start, trueLimit],
      enabled: listSize ? (start > 0) ? true  : false : false
    })
  
    const NFTMetadata = useGetTokenMetadata(listings.data as  TOKEN_DETAILS[])
  
    useEffect(() => {
      if (start === 0 && listSize.data) setStart(listSize?.data as number)
    }, [listSize.data, start])
  
    useEffect(() => {
      if(NFTMetadata) {
        if(NFTMetadata.length > 0) {
          setData(NFTMetadata)
          setInitialLoading(false)
        }
      }
    }, [NFTMetadata])


    const pageContent = (
      <Box>
        <Grid item justifyContent={"center"} container> 
          <Typography sx={{fontWeight: 700, marginTop: "1em"}} textAlign={"center"} variant="h4"> Wallet Address </Typography>
        </Grid>
        
        <Grid item justifyContent={"center"} container> 
          <Typography variant="body2"> {address} </Typography>
        </Grid>

        <Typography sx={{mt: 2}} variant="h6" fontWeight={600} textAlign={"center"}>No of NFTs: {listSize?.data?.toString()}</Typography>

        <Grid container spacing={2} sx={{marginTop: "2em"}}>
          {
            data.map((nft, index) => <NFTCard nft={nft} key={index} /> )
          }
        </Grid>
      </Box>
    )


    return (
      <Layout>
        {isConnected ? initialLoading ?  <LoadingBG /> : pageContent : <ConnectScreen /> }
      </Layout>
    )
};

