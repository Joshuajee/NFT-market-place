import axios from "axios";
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { polygonMumbai } from "wagmi/chains";
import { ethers } from "ethers";
import NFTMarketplaceABI from "../abi/NFTMarketplace.json";
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { Grid } from "@mui/material";
import NFTCard from "../components/cards/NFTCard";
import Layout from "../components/app/layout";
import LoadingBG from "../components/app/loaderBg";
import { ADDRESS } from "../libs/types";
import useRangeQuery from "../hooks/useRangeQuery";

const contract = String(process.env.NEXT_PUBLIC_CONTRACT)
const limit = 50

export default function Home() {

  const array = Array(20).fill(
    {
      image: "https://nft-cdn.alchemy.com/matic-mumbai/a04be25f014165ea518e797d8f7115cc", 
      name: "Go lang", 
      tokenId: "0", 
      contract: "0x0eca8fc72a016d6ea1b036a96dc05072c08a04fe" 
    }
  );


  const [data, setData] = useState(array);
  const [start, setStart] = useState(0);

  const trueLimit = useRangeQuery(start, limit)

  const [dataFetched, updateFetched] = useState(false);

  const listSize = useContractRead({
    address: contract as ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'listSize',
  })

  const listings = useContractRead({
    address: contract as ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'getAllNFTs',
    chainId: polygonMumbai.id,
    //args: [2, 2],
    //enabled: listSize ? (start > 0) ? true  : false : false
  })

  console.log(listSize.data)

  console.log(listings.data)

  console.log(trueLimit)


  useEffect(() => {
    if (start === 0 && listSize.data) setStart(listSize?.data._hex as number)
  }, [listSize.data, start])

  console.log("---- ", start)

  async function getAllNFTs() {

    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();

    //Pull the deployed contract instance
    const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_CONTRACT), NFTMarketplaceABI, signer)
    //create an NFT Token

    const transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async (i: any) => {

      const contract = new ethers.Contract(i.NFTcontract, RoyaltyTokenABI, signer)
      
      const tokenURI = await contract.tokenURI(i.tokenId);

      const meta = ((await axios.get(tokenURI)) as any).data;

      const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

      const item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        contract: i.NFTcontract,
        image: meta?.image,
        name: meta?.name,
        description: meta?.description,
      }

      return item;

    }))

    // updateFetched(true);
    // updateData(items as any);
  }


  return (
    <Layout>
      <Grid item container spacing={2} sx={{marginTop: "2em"}}>
        {
          data.map((nft, index) =>  <NFTCard nft={nft} key={index} /> )
        }
      </Grid>
    </Layout>
  );

}