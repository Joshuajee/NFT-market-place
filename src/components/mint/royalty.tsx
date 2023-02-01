import { useState } from "react";
import { TextField, Typography, Box, FormControlLabel, Checkbox } from "@mui/material";
import { ethers } from 'ethers';
import nftAbi from "../../abi/nftAbi.json";
import { ROYALTY_DETAILS } from "../../libs/intefaces";



interface IProps {
    royalty: ROYALTY_DETAILS;
    setRoyalty: (royalty: ROYALTY_DETAILS) => void
}

const Royalty = (props: IProps) => {

    const { royalty, setRoyalty } = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoyalty({...royalty, enabled: event.target.checked});
    };


    // async function RoyaltyNFT() {

    //     try {

    //         const metadataURL = `https://ipfs.io/ipfs/${sessionStorage.getItem("json")}`
            
    //         //After adding your Hardhat network to your metamask, this code will get providers and signers
    //         const provider = new ethers.providers.Web3Provider(window?.ethereum);
    //         const signer = provider.getSigner();

    //         //Pull the deployed contract instance
    //         const contract = new ethers.Contract(String(process.env.NEXT_PUBLIC_NFT_CONTRACT), nftAbi, signer)

    //         //actually create the NFT
    //         const transaction = await contract.royaltyRoyalty(address, metadataURL, 0)
            
    //         await transaction.wait()

    //     } catch(e) {

    //     }

    // }

    return (
        <Box>

            <FormControlLabel 
                control={
                    <Checkbox 
                        inputProps={{ 'aria-label': 'Royalty Control' }} 
                        checked={royalty.enabled}
                        onChange={handleChange}
                        />
                    } 

                label="Enable Royalty" />

                { 
                    royalty.enabled && (
                        <Box>
                    
                            <Typography variant={"h5"} sx={{marginBottom: "0.6em", fontWeight: 700 }}> Input Royalty Rate below</Typography>

                            <Typography paragraph sx={{marginBottom: "1em", color: "red"}}> 
                                Please Input a Royalty Rate Between 0 and 50, 
                                if you don&apos;t want Royalty for this Asset leave in blank or input 0
                            </Typography>
                            
                            <TextField 
                                type="number"
                                label={"Royalty Rate"} 
                                value={royalty}
                                onChange={(e) => setRoyalty({...royalty, value: Number(e.target.value)})}
                                sx={{marginTop: "0.6em", width: "100%"}}
                                InputProps={{sx:{color: "#fff"}}}
                                />
                        </Box>
                    )
                }

        </Box>
    );
};

export default Royalty;
