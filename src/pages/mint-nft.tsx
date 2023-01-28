import axios from "axios";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../libs/nftAbi.json";
import nftAbi from "../libs/nftAbi.json";
import { Container } from "@mui/system";
import { Grid } from "@mui/material";
import Navbar from "../components/app/navbar";
import NFTCard from "../components/cards/NFTCard";
import Layout from "../components/app/layout";

export default function MintNFT() {

  const [data, updateData] = useState([
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ball%2C_%E0%B4%AA%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D.JPG", 
      name: "Go lang", 
      tokenId: "20", 
      contract: "123k4kgmfkdkfgf" 
    },
    
  ]);

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
    //if(!dataFetched) getAllNFTs();
  }, [dataFetched])

  return (
    <Layout>
      <Grid item container spacing={2} sx={{marginTop: "2em"}}>
        {
          data.map((nft, index) => <NFTCard nft={nft} key={index} /> )
        }
      </Grid>

    </Layout>
  );

}