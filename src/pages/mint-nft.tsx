import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Layout from "../components/app/layout";
import Upload from "../components/mint/upload";
import Description from "../components/mint/description";
import { NFT_DETAILS, ROYALTY_DETAILS } from "../libs/intefaces";
import { LoadingButton } from "@mui/lab";
import Royalty from "../components/mint/royalty";
import axios from "axios";
import { toast } from "react-toastify";
import MintModal from "../components/mint/mintModal";
import { useAccount, useContractWrite } from "wagmi";
import { NFTContract } from "../libs/utils";
import RoyaltyTokenABI from "../abi/RoyaltyToken.json";
import { ADDRESS } from "../libs/types";

export default function MintNFT() {

  const [details, setDetails] = useState<NFT_DETAILS>({ name: "", description: ""})
  const [selectedImage, setSelectedImage] = useState<Blob | undefined>()
  const [royalty, setRoyalty] = useState<ROYALTY_DETAILS>({ enabled: false, value: 0 })
  const [status, setStatus] = useState(0)
  const [open, setOpen] = useState(false)
  const [tokenURI, setTokenURI] = useState<string | null>(null)

  const { address } = useAccount()

  const mint = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: NFTContract as ADDRESS,
    abi: RoyaltyTokenABI,
    functionName: 'safeMint',
    args: [address, tokenURI],
  })

  useEffect(() => {
    if (mint.isLoading) {
      setStatus(2)
    } else if (mint.isSuccess) {
      toast.success("NFT minted successfully")
      setOpen(false)
    }
  }, [mint.isLoading, mint.isSuccess])

  const uploadFile = async () => {
    setOpen(true)
    try {

      const body = new FormData();

      body.append("image", selectedImage as Blob);

      const res = await axios.post("/api/upload-image", body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      uploadJSON(res?.data?.IpfsHash)

    } catch (e) {
      console.error(e)
      toast.error("Error! uploading file")
      setOpen(false)
    }
  } 

  const uploadJSON = async (cid: string) => {
    setStatus(1)
    try {

      const body = { 
        name: details.name, 
        description: details.description, 
        image: `https://ipfs.io/ipfs/${cid}`
      }

      const res = await axios.post("/api/upload-meta", body)

      setTokenURI(`ipfs://${res?.data?.IpfsHash}`)

      //toast.success("NFT Minted Successfully")

    } catch (e) {
      console.error(e)
      toast.error("Error! uploading file")
    }
  } 



  const isDisabled = () => {
    if (!selectedImage) return true
    else if (details.name.trim() === "") return true
    else if (details.description.trim() === "") return true
    else return false
  }

  console.log([address, tokenURI])

  return (
    <Layout>
      {/* <Card sx={{p: 4, borderRadius: 2, mt: 10}}> */}
        <Grid item container spacing={4} sx={{marginTop: "2em"}}>
          <Grid item sm={12} md={6} sx={{ width: "100%"}}>
            <Upload selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          </Grid>
          <Grid item sm={12} md={6} sx={{ width: "100%"}}>
            <Description details={details} setDetails={setDetails} />
            <Royalty royalty={royalty} setRoyalty={setRoyalty} />
          </Grid>

          <Grid item container justifyContent={"center"} md={12}>
            <LoadingButton disabled={isDisabled()} onClick={uploadFile} variant="contained">Mint Your NFT</LoadingButton>
          </Grid>

        </Grid>
      {/* </Card> */}
      <MintModal status={status} open={open} setOpen={setOpen} mint={mint} tokenURI={tokenURI as string} />
    </Layout>
  );

}