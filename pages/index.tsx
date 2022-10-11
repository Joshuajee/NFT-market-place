import axios from "axios";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../src/libs/abi.json";
import nftAbi from "../src/libs/nftAbi.json";
import { Container } from "@mui/system";
import { Grid } from "@mui/material";
import Navbar from "../src/components/Navbar";
import NFTCard from "../src/components/Cards/NFTCard";

export default function Index() {

  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {

    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();

    //Pull the deployed contract instance
    const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_CONTRACT), abi, signer)
    //create an NFT Token

    const transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async (i: any) => {

      const contract = new ethers.Contract(i.NFTcontract, nftAbi, signer)
      
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

    updateFetched(true);
    updateData(items as any);
  }

  useEffect(() => {
    if(!dataFetched) getAllNFTs();
  }, [dataFetched])

  return (
    <div>
      
      <Navbar  />

      <Container maxWidth="lg">

        <Grid item container spacing={2} sx={{marginTop: "2em"}}>

          {
            data.map((nft, index) => <NFTCard nft={nft} key={index} /> )
          }

        </Grid>

      </Container>
          
    </div>
  );

}