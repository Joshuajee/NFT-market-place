import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import NFTMarketplaceABI from "../abi/NFTMarketplace.json";
import { Grid } from "@mui/material";
import NFTCard from "../components/cards/NFTCard";
import Layout from "../components/app/layout";
import LoadingBG from "../components/app/loaderBg";
import { ADDRESS } from "../libs/types";
import useRangeQuery from "../hooks/useRangeQuery";
import useGetTokenMetadata from "../hooks/useGetTokenMetadata";
import { METADATA, TOKEN_DETAILS } from "../libs/intefaces";

const contract = String(process.env.NEXT_PUBLIC_CONTRACT)
const limit = 50

export default function Home() {

  const [data, setData] = useState<METADATA[]>([]);
  const [start, setStart] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true)

  const trueLimit = useRangeQuery(start, limit)

  const listSize = useContractRead({
    address: contract as ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'listSize',
  })

  const listings = useContractRead({
    address: contract as ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'getNFTsByRange',
    args: [start, trueLimit],
    enabled: listSize ? (start > 0) ? true  : false : false
  })

  const NFTMetadata = useGetTokenMetadata(listings.data as TOKEN_DETAILS[])

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

  return (
    <Layout>
      {
        initialLoading ? 
          <LoadingBG /> : (
            <Grid item container spacing={2} sx={{marginTop: "2em"}}>
              {
                data.map((nft, index) =>  <NFTCard nft={nft} key={index} /> )
              }
            </Grid>
          )
      }
    </Layout>
  );

}