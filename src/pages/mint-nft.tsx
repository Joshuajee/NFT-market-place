import { useState } from "react";
import { Grid, Card } from "@mui/material";
import Layout from "../components/app/layout";
import Upload from "../components/mint/upload";
import Description from "../components/mint/description";
import { NFT_DETAILS, ROYALTY_DETAILS } from "../libs/intefaces";
import { LoadingButton } from "@mui/lab";
import Royalty from "../components/mint/royalty";

export default function MintNFT() {

  const [details, setDetails] = useState<NFT_DETAILS>({ name: "", description: ""})
  const [selectedImage, setSelectedImage] = useState<any>()
  const [royalty, setRoyalty] = useState<ROYALTY_DETAILS>({ enabled: false, value: 0 })

  return (
    <Layout>
      {/* <Card sx={{p: 4, borderRadius: 2, mt: 10}}> */}
        <Grid item container spacing={4} sx={{marginTop: "2em"}}>
          <Grid item md={6}>
            <Upload selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          </Grid>
          <Grid item md={6}>
            <Description details={details} setDetails={setDetails} />
            <Royalty royalty={royalty} setRoyalty={setRoyalty} />
          </Grid>

          <Grid item container justifyContent={"center"} md={12}>
            <LoadingButton variant="contained">Mint Your NFT</LoadingButton>
          </Grid>

        </Grid>
      {/* </Card> */}
    </Layout>
  );

}